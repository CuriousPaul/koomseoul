-- ============================================================================
-- Production Auth/RLS Migration for Koom Seoul
-- ============================================================================
-- Run this AFTER docs/supabase-schema.sql in the Supabase SQL Editor.
--
-- This replaces demo-only anonymous RLS policies with production-safe policies:
--   - Anon/public can INSERT new host submissions
--   - Public reads go through a safe projection view (no contact_email/history)
--   - Authenticated admins can SELECT/UPDATE/DELETE all submissions
--   - Anonymous UPDATE and DELETE are removed entirely
--
-- Prerequisites:
--   1. Supabase Auth must be enabled (done by default in new projects)
--   2. Create at least one admin user via Dashboard → Authentication → Add User
--   3. Assign the admin role using the INSERT statement at the bottom of this file
--
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Admin role tracking table
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS user_roles (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role       TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Only admins can read the roles table (prevents user enumeration).
CREATE POLICY "Admins can view user_roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ---------------------------------------------------------------------------
-- 2. Helper function: is_admin()
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- 3. Auto-refresh updated_at trigger
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_updated_at ON event_submissions;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON event_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ---------------------------------------------------------------------------
-- 4. Replace demo RLS policies on event_submissions
-- ---------------------------------------------------------------------------
-- Drop the four demo-only policies created by docs/supabase-schema.sql.
-- These grant unrestricted anonymous read/write/update/delete which is
-- unsafe for any publicly accessible deployment.

DROP POLICY IF EXISTS "Allow anonymous read access" ON event_submissions;
DROP POLICY IF EXISTS "Allow anonymous insert"      ON event_submissions;
DROP POLICY IF EXISTS "Allow anonymous update"      ON event_submissions;
DROP POLICY IF EXISTS "Allow anonymous delete"      ON event_submissions;

-- 4a. Admin SELECT — admins see the full submission queue, including
--     private contact fields and audit history. Public users must not select
--     directly from event_submissions because published rows still contain
--     contact_email and internal history.
CREATE POLICY "Admins can view all submissions"
  ON event_submissions FOR SELECT
  TO authenticated
  USING (is_admin());

-- 4b. INSERT — hosts can submit events without logging in.
--     Rate limiting should be handled at the API gateway or edge-function
--     level; the RLS layer only gates row visibility.
CREATE POLICY "Hosts can submit events"
  ON event_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 4c. UPDATE — admins only.
--     Covers status changes, edits, publishing, and unpublishing.
CREATE POLICY "Admins can update submissions"
  ON event_submissions FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- 4d. DELETE — admins only.
CREATE POLICY "Admins can delete submissions"
  ON event_submissions FOR DELETE
  TO authenticated
  USING (is_admin());

-- ---------------------------------------------------------------------------
-- 5. Public published-event projection
-- ---------------------------------------------------------------------------
-- RLS is row-level, not column-level. A published submission row still contains
-- private fields such as contact_email and history, so public readers should
-- use this safe projection instead of selecting from event_submissions.
--
-- NOTE: the current frontend still reads event_submissions directly. Before a
-- real public launch, point public directory reads to this view (or to an Edge
-- Function/API route that returns the same safe projection).

CREATE OR REPLACE VIEW public_published_events AS
SELECT
  id,
  title,
  host,
  track,
  neigh,
  day,
  start,
  "end",
  format,
  access,
  capacity,
  blurb,
  location,
  audience,
  speakers,
  published_event_id,
  created_at,
  updated_at
FROM event_submissions
WHERE status = 'published';

GRANT SELECT ON public_published_events TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- 6. Seed the first admin user
-- ---------------------------------------------------------------------------
-- AFTER creating an auth user in the Supabase Dashboard
-- (Authentication → Users → Add User), run this statement with the user's
-- UUID to grant admin access. Replace the placeholder with the real UUID.
--
-- Example:
--   INSERT INTO user_roles (user_id, role)
--   VALUES ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', 'admin');
--
-- To add more admins later, repeat the INSERT with a different user_id.
-- To revoke admin access:
--   DELETE FROM user_roles WHERE user_id = 'the-user-uuid';
