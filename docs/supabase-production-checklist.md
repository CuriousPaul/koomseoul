# Supabase Production Readiness Checklist

Use this checklist before deploying the Koom Seoul app with Supabase to a publicly accessible URL.

## Pre-deployment

- [x] Supabase project created and accessible (`koom-seoul`, ref: `hzuoeiorcntdntdbvkgl`)
- [x] `docs/supabase-schema.sql` applied (creates `event_submissions` table and demo policies)
- [x] `docs/supabase-auth-rls.sql` applied (replaces demo policies with production RLS)
- [ ] Authentication enabled in Supabase Dashboard → Authentication → Providers
- [ ] At least one admin user created via Dashboard → Authentication → Users
- [ ] Admin role assigned: `INSERT INTO user_roles (user_id, role) VALUES ('user-uuid', 'admin');`
- [x] `.env.local` or Vercel env vars set: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- [x] Service role key is NOT exposed in client-side code or Vite env vars

## Verify RLS Policies

- [ ] Run in SQL Editor: `SELECT policyname FROM pg_policies WHERE tablename = 'event_submissions';`
- [ ] Confirm demo policies are gone (no "Allow anonymous update" or "Allow anonymous delete")
- [ ] Confirm production policies exist:
  - [ ] "Admins can view all submissions"
  - [ ] "Hosts can submit events"
  - [ ] "Admins can update submissions"
  - [ ] "Admins can delete submissions"
- [ ] Test anon table access: unauthenticated requests should not be able to select `event_submissions`
- [ ] Test public view access: unauthenticated requests should only see safe published fields from `public_published_events`
- [ ] Test admin access: authenticated admin should see all `event_submissions` rows

## Security

- [ ] No real API keys or credentials committed to the repository
- [ ] `.env.local` is in `.gitignore` (already covered by `*.local` pattern)
- [ ] Anon key is the only key used in client-side code (safe with RLS)
- [ ] Service role key is never used in frontend code
- [ ] Row Level Security is enabled on all tables

## Frontend

- [x] `npm run build` passes with no errors
- [x] `npm audit --audit-level=moderate` passes (0 vulnerabilities)
- [x] Admin UI shows appropriate security warning when Supabase is connected without auth
- [x] localStorage fallback still works when Supabase is not configured
- [x] Host submission form works for anonymous users (INSERT policy)

## Post-deployment

- [ ] Vercel deployment succeeds
- [ ] Admin can log in and see all submissions
- [ ] Host can submit new events without authentication
- [x] Public directory only reads from `public_published_events` or an equivalent safe API projection
- [ ] No console errors in production

## Rollback Plan
If something goes wrong:
1. Remove Vercel env vars to fall back to localStorage mode
2. Re-apply `docs/supabase-schema.sql` to restore demo policies
3. Debug in a separate Supabase project before re-applying production policies
