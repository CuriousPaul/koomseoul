-- Supabase migration: event_submissions table
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
--
-- DEMO ONLY / DO NOT DEPLOY PUBLICLY AS-IS:
-- The RLS policies below intentionally allow anonymous read/write/delete so the
-- prototype can be tested without auth. Before any public production launch,
-- replace them with authenticated role-based policies and remove anonymous
-- update/delete access.

CREATE TABLE IF NOT EXISTS event_submissions (
  id                  TEXT PRIMARY KEY,
  title               TEXT NOT NULL,
  host                TEXT DEFAULT '',
  contact_email       TEXT,
  track               TEXT DEFAULT '',
  neigh               TEXT DEFAULT '',
  day                 TEXT DEFAULT '',
  start               TEXT DEFAULT '',
  end                 TEXT DEFAULT '',
  format              TEXT DEFAULT '',
  access              TEXT DEFAULT '',
  capacity            INTEGER DEFAULT 60,
  submitted_at        TEXT DEFAULT '',
  status              TEXT NOT NULL DEFAULT 'submitted',
  blurb               TEXT DEFAULT '',
  location            TEXT DEFAULT '',
  audience            TEXT,
  speakers            JSONB DEFAULT '[]'::jsonb,
  source              TEXT DEFAULT '',
  published_event_id  TEXT,
  history             JSONB DEFAULT '[]'::jsonb,
  flag                TEXT,
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now()
);

-- Index for the admin queue (ordered by created_at desc)
CREATE INDEX IF NOT EXISTS idx_event_submissions_created_at
  ON event_submissions (created_at DESC);

-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_event_submissions_status
  ON event_submissions (status);

-- Enable Row Level Security
ALTER TABLE event_submissions ENABLE ROW LEVEL SECURITY;

-- DEMO-ONLY RLS policy: allow anonymous reads (public directory needs this)
-- PRODUCTION TODO: restrict reads to published-only and require auth for admin access
CREATE POLICY "Allow anonymous read access"
  ON event_submissions
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- DEMO-ONLY RLS policy: allow anonymous inserts (host form submissions)
-- PRODUCTION TODO: add rate limiting and require at least anon auth
CREATE POLICY "Allow anonymous insert"
  ON event_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- DEMO-ONLY RLS policy: allow anonymous updates (admin status changes)
-- PRODUCTION TODO: restrict to authenticated admin users only
CREATE POLICY "Allow anonymous update"
  ON event_submissions
  FOR UPDATE
  TO anon, authenticated
  USING (true);

-- DEMO-ONLY RLS policy: allow anonymous deletes (seed reset only)
-- PRODUCTION TODO: remove anonymous delete access entirely
CREATE POLICY "Allow anonymous delete"
  ON event_submissions
  FOR DELETE
  TO anon, authenticated
  USING (true);
