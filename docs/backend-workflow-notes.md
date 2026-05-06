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

## Next Production Steps

1. **Add Supabase Auth** — Enable email/password or social login. Use RLS policies to restrict writes to authenticated ops users.
2. **Normalize audit history** — Move `history` to a separate `submission_audit_log` table with proper foreign keys.
3. **Add real-time subscriptions** — Use `supabase.channel()` to push changes to all connected admin sessions.
4. **Add `published_events` table** — A separate table for the public event directory, populated by a trigger when a submission is published.
5. **Add rate limiting** — Prevent spam submissions at the API gateway or RLS level.
6. **Add soft delete** — Demo reset is local-only in the app and seed-scoped in the service. Add `deleted_at` column before any production delete workflow.
