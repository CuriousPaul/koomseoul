# Email Integration Guide (Resend)

Koom Seoul sends transactional email via [Resend](https://resend.com), routed through a Vercel serverless function. This keeps the API key server-side and out of the Vite browser bundle.

## Architecture

```
Browser (src/lib/emailService.js)
  → POST /api/send-email with { to, type, payload }
    → Vercel serverless function (api/send-email.js)
      → render approved server-side template
      → Resend SDK → recipient inbox
```

Important security properties:

- `RESEND_API_KEY` is **server-side only**. It is not prefixed with `VITE_` and must never be imported in frontend code.
- The browser cannot submit arbitrary `subject`/`html`. The endpoint accepts only approved template `type` values and structured payload.
- CORS allows same-origin, configured `SITE_URL`, the current Vercel deployment URL, and local dev origins only.
- If `RESEND_TEST_MODE=true`, the endpoint returns a dry-run success without sending email.

## Implemented email triggers

| Trigger | File | Email type |
|---|---|---|
| Host submits an event | `src/submissionStore.js` → `createSubmission()` | `submission_confirmation` |
| Admin changes submission status | `src/submissionStore.js` → `updateStatus()` | `status_update` |

Both triggers are non-blocking. If Resend is unavailable, the app logs a warning and the submission/admin action still succeeds.

## Current supported templates

| Type | Purpose | Required payload | Sender default |
|---|---|---|---|
| `submission_confirmation` | Host submission receipt | `{ eventTitle }` | `notify@koomseoul.com` |
| `status_update` | Admin status update to host | `{ eventTitle, status, note? }` | `notify@koomseoul.com` |
| `welcome` | Future post-auth welcome email | `{ firstName? }` | `hello@koomseoul.com` |

## Environment variables

Set these in Vercel Project Settings → Environment Variables.

```
RESEND_API_KEY=re_your_actual_key
RESEND_FROM_EMAIL=Koom Week Seoul <hello@koomseoul.com>
SITE_URL=https://koomseoul.vercel.app
# Optional local/staging dry-run mode:
# RESEND_TEST_MODE=true
```

Local `.env.local` can use the same names. Do not prefix these with `VITE_`.

## Resend dashboard setup checklist

1. Create or log into the Resend account.
2. Add the sending domain you want to use, e.g. `koomseoul.com`.
3. Add the DNS records Resend gives you:
   - SPF / return-path record
   - DKIM records
   - DMARC record if not already present
4. Wait until Resend marks the domain as **Verified**.
5. Create an API key with send permission.
6. In Vercel, add `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `SITE_URL` for Production.
7. Redeploy production after setting env vars.
8. Submit a test event from production and confirm the host receives the receipt email.
9. Change the submission status in Admin and confirm the host receives the status update email.
10. Monitor the Resend dashboard for bounces or delivery errors.

## Local development

For the API endpoint to work locally, run Vercel dev so the `api/` function exists:

```bash
vercel dev
```

If you run plain `npm run dev`, email calls may fail gracefully because Vite alone does not execute Vercel serverless functions.

For a no-send local smoke test:

```bash
RESEND_TEST_MODE=true vercel dev
```

Then submit an event and verify the API returns success without hitting Resend.

## Supabase Auth email boundary

Supabase Auth confirmation / magic link / password reset emails are still handled by Supabase unless configured separately in the Supabase Dashboard.

For auth emails, there are two future options:

1. **Supabase built-in SMTP using Resend SMTP** — recommended if Supabase Dashboard supports the needed SMTP settings for this project.
2. **Custom auth callback flow** — more control, but higher scope and security risk.

This implementation intentionally completes the operational host/admin transactional email foundation first and does not replace Supabase Auth's built-in auth email flow yet.

## Production checklist

- [ ] Resend domain verified
- [ ] `RESEND_API_KEY` set in Vercel Production
- [ ] `RESEND_FROM_EMAIL` matches a verified domain
- [ ] `SITE_URL=https://koomseoul.vercel.app` set in Vercel Production
- [ ] Production redeployed after env vars are set
- [ ] Host submission receipt email tested
- [ ] Admin status update email tested
- [ ] Resend dashboard checked for delivery failures
