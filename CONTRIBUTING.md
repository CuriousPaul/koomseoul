# Contributing

## Local setup

```bash
npm install
npm run dev
```

## Check your work

```bash
npm run build
npm audit --audit-level=moderate
```

## Project structure

- `src/App.jsx` — page switching and shared state
- `src/pages/` — Home, Discover, Schedule, Host, Admin views
- `src/data.js` — static event and sponsor data
- `src/shared.jsx` — shared header/footer/UI bits
- `src/styles.css` / `src/tokens.css` — styling
 - `src/submissionService.js` — repository layer (Supabase or localStorage)
- `src/submissionStore.js` — React hook for submission workflow state
- `src/lib/emailService.js` — client-side email service (Resend via Vercel serverless function)
- `api/send-email.js` — Vercel serverless function for transactional email

## Workflow

1. Create a short-lived branch from `main`.
2. Keep changes focused and doc/code separated when possible.
3. Open a PR against `main` with a clear summary and screenshots only if UI changed.
4. Wait for `npm run build` and `npm audit --audit-level=moderate` to pass before merging.

## Vercel notes

- This is a Vite app, so the build command is `npm run build`.
- Vercel should use `dist` as the output directory.
- Main-branch pushes are the expected deployment path unless the repo is wired differently in Vercel.

## Current prototype limits

- Host and Admin flows use Supabase when configured (see below), otherwise localStorage.
- **⚠️ Demo RLS policies are NOT safe for public deployment.** The default `docs/supabase-schema.sql` allows anonymous update/delete. Before any public launch, apply `docs/supabase-auth-rls.sql` and follow the production checklist in `docs/supabase-production-checklist.md`.
- No authentication or role-based access is implemented yet.
- No real-time sync between sessions.

## Supabase backend (optional)

The submission workflow can persist to Supabase instead of localStorage.

1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Run `docs/supabase-schema.sql` in the Supabase SQL Editor.
3. **For production:** also run `docs/supabase-auth-rls.sql` to replace demo policies with safe role-based access control. See `docs/supabase-production-checklist.md`.
4. Create `.env.local` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
5. For Vercel, set the same variables in Project Settings → Environment Variables.
6. See `docs/backend-workflow-notes.md` for full details and limitations.

When Supabase is not configured, the app falls back to localStorage and all features work unchanged.

## Email service (Resend)

Transaction emails (verification, welcome, submission confirmation) go through Resend via a Vercel serverless function. The API key never reaches the client bundle.

1. Sign up at [resend.com](https://resend.com) and create an API key with **Send** permission.
2. Add to `.env.local` (or Vercel env vars):
   ```
   RESEND_API_KEY=re_your_key
   RESEND_FROM_EMAIL=Koom Week Seoul <hello@koomseoul.com>
   ```
3. For local dev with the email endpoint, run `vercel dev` instead of `vite dev`.
4. See `docs/email-integration.md` for trigger points, email types, and auth wiring guide.

When Resend is not configured, email calls fail gracefully — the app continues to work.

## Mobile QA

- Check the header menu, event cards, and form screens on a narrow viewport.
- Verify text wrapping, tap targets, and scroll behavior.
- Confirm no section overflows horizontally.

## Good first tasks

- Fix a small copy or spacing issue.
- Improve one responsive breakpoint.
- Tighten a single shared component.
- Add a missing documentation note.
