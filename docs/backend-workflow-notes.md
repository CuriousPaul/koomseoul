# Backend Workflow Notes — Supabase Submission API

## Architecture

The submission workflow supports two persistence modes:

1. **Supabase (recommended)** — when environment variables are configured, all CRUD operations go through the Supabase Postgres database. Data persists across devices and sessions.
2. **localStorage fallback** — when Supabase is not configured, the app uses browser localStorage. This is the original prototype behaviour and works offline.

The mode is determined at startup by checking for `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables. The Admin page shows which mode is active.

## Supabase Setup

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com), create a new project, and note your Project URL and anon/public key.

### 2. Run the SQL migration

Execute the SQL in `docs/supabase-schema.sql` in the Supabase SQL Editor. This creates the `event_submissions` table with demo-friendly RLS policies. **Do not use those policies for a public production launch without adding Supabase Auth and role-based admin restrictions.**

### 3. Set environment variables

**Local development** — create `.env.local`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Vercel deployment** — set the same variables in Project Settings → Environment Variables.

**Never commit `.env.local` or real keys to the repository.**

### 4. Verify

Start the dev server (`npm run dev`), navigate to Admin, and confirm the sidebar shows "Prototype store: Supabase".

## Data Flow

```
Host form → createSubmission() → submissionService → Supabase insert
                                          ↓ (fallback)
                                     localStorage write

Admin queue → updateStatus() → submissionService → Supabase update
                                    ↓ (fallback)
                               localStorage write

Admin publish → publishSubmission() → submissionService → Supabase update (status='published')
                                           ↓ (fallback)
                                      localStorage write
```

## Key Files

| File | Role |
|---|---|
| `src/submissionService.js` | Repository layer — Supabase client, row↔domain mapping, localStorage fallback |
| `src/submissionStore.js` | React hook (`useSubmissionWorkflow`) — state management, audit trail, publish guard |
| `src/pages/ScheduleHostAdmin.jsx` | Host form + Admin UI, shows backend mode hint |
| `docs/supabase-schema.sql` | SQL migration for the `event_submissions` table |

## Current Limitations

- **Demo-only security model.** The current SQL intentionally allows anonymous read/write/delete to `event_submissions` so the prototype can be tested without auth. **Never deploy this policy set publicly as-is.** Add Supabase Auth and role-based RLS before production use.
- **No real-time sync.** Changes made by one user are not pushed to other open sessions. Each page load fetches fresh data from Supabase.
- **Optimistic local updates.** The UI updates immediately in local state, then syncs to Supabase asynchronously. If the Supabase write fails, local state will be correct but remote will be stale.
- **No file uploads.** The submission form does not support image or document attachments.
- **history field is a JSON array.** The audit trail is stored as a JSON column, not a separate table. This is sufficient for the current scale but should be normalized if query/reporting needs grow.

## Production Auth/RLS Hardening

The demo SQL in `docs/supabase-schema.sql` allows anonymous read/write/delete on `event_submissions`. **Never use those policies on a publicly accessible project.** The production migration in `docs/supabase-auth-rls.sql` replaces them with role-based access control.

### Step-by-step hardening process

1. **Enable Supabase Auth** (if not already active):
   - Go to Dashboard → Authentication → Providers
   - Enable Email/Password (or your preferred auth method)

2. **Create an admin user**:
   - Dashboard → Authentication → Users → Add User
   - Set email and password for the ops admin account
   - Copy the user's UUID (shown in the user list)

3. **Apply the production RLS migration**:
   - Go to Dashboard → SQL Editor → New Query
   - Paste the contents of `docs/supabase-auth-rls.sql`
   - Run it. This drops the demo policies and creates production ones.

4. **Assign the admin role**:
```sql
-- Replace with the actual user UUID from step 2
INSERT INTO user_roles (user_id, role)
VALUES ('the-admin-user-uuid-here', 'admin');
```

5. **Verify policies**:
```sql
-- Check that demo policies are gone
SELECT policyname FROM pg_policies WHERE tablename = 'event_submissions';
   
-- Test anon table access: should NOT be able to select event_submissions
-- Test anon public view access: should only see safe published fields from public_published_events
-- Test admin access: authenticated admin should see all event_submissions rows
```

6. **Set Vercel environment variables**:
- `VITE_SUPABASE_URL` — your project URL
- `VITE_SUPABASE_ANON_KEY` — the anon/public key (safe for client-side code with RLS)
- Do NOT set the service_role key as a Vite env variable

### What changes after hardening

| Operation | Before (demo) | After (production) |
|-----------|--------------|-------------------|
| Anon SELECT on `event_submissions` | All rows | ❌ Blocked |
| Anon SELECT on `public_published_events` | N/A | Safe published fields only |
| Anon INSERT | Any row | New host submissions only |
| Anon UPDATE | Any row | ❌ Blocked |
| Anon DELETE | Any row | ❌ Blocked |
| Admin SELECT | N/A | All rows |
| Admin UPDATE | N/A | Any row |
| Admin DELETE | N/A | Any row |

### What to do next
- Ensure all production checks are completed before going live.

## Next Production Steps

1. ~~**Add Supabase Auth**~~ — ✅ See `docs/supabase-auth-rls.sql` and the Production Auth/RLS Hardening section above.
2. **Normalize audit history** — Move `history` to a separate `submission_audit_log` table with proper foreign keys.
3. **Add real-time subscriptions** — Use `supabase.channel()` to push changes to all connected admin sessions.
4. ~~**Point public reads to `public_published_events`**~~ — ✅ Implemented in `src/submissionService.js` (`loadPublishedEvents()`) and wired into `src/submissionStore.js`. When Supabase is available, published events are read from the safe `public_published_events` view (no contact_email/history). Admin queue continues to read `event_submissions` for full visibility.
5. **Add rate limiting** — Prevent spam submissions at the API gateway or RLS level.
6. **Add soft delete** — Demo reset is local-only in the app and seed-scoped in the service. Add `deleted_at` column before any production delete workflow.

## Supabase Project Setup (Completed)

- **Project name**: koom-seoul
- **Region**: Northeast Asia (Seoul) — `ap-northeast-2`
- **Project ref**: `hzuoeiorcntdntdbvkgl`
- **Dashboard**: https://supabase.com/dashboard/project/hzuoeiorcntdntdbvkgl
- **Migrations applied**:
  - `20260506050000_event_submissions_schema.sql` — creates table + demo RLS
  - `20260506050100_auth_rls_hardening.sql` — replaces demo policies with production RLS, creates `public_published_events` view
- **Vercel env vars**: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set for production/preview/development
- **Local env**: `.env.local` created (gitignored)
- **Remaining manual step**: Create an admin user in Supabase Dashboard → Authentication → Users, then run:
  ```sql
  INSERT INTO user_roles (user_id, role) VALUES ('the-admin-user-uuid', 'admin');
  ```
