# Email Integration Guide (Resend)

Koom Seoul sends transactional email via [Resend](https://resend.com), routed through a Vercel serverless function. This keeps the API key server-side.

## Architecture

```
Browser (src/lib/emailService.js)
  → POST /api/send-email
    → Vercel serverless function (api/send-email.js)
      → Resend SDK → recipient inbox
```

- **Client-side module** (`src/lib/emailService.js`): convenience wrappers that generate branded HTML and call the API endpoint. Never touches the API key.
- **Serverless function** (`api/send-email.js`): validates input, calls Resend, returns `{ success, id }` or `{ success: false, error }`.

## Setup

### 1. Get a Resend API key

Sign up at [resend.com](https://resend.com) and create an API key with **Send** permission.

### 2. Configure environment variables

In `.env.local` (local) or Vercel Project Settings → Environment Variables (deployed):

```
RESEND_API_KEY=re_your_actual_key
RESEND_FROM_EMAIL=Koom Week Seoul <hello@koomseoul.com>
```

`RESEND_FROM_EMAIL` is optional — the serverless function falls back to branded defaults per email type.

### 3. Verify domain in Resend

Before sending to real addresses, verify your sending domain in the Resend dashboard. During development you can send to your own address or use Resend's test mode.

### 4. Local development

For the API endpoint to work locally, run:

```bash
vercel dev
```

This serves both the Vite app and the `api/` serverless functions. `vite.config.js` proxies `/api` requests to `localhost:3000` where `vercel dev` listens.

If you run plain `vite dev` instead, email calls will fail gracefully — the app still works, emails are just not sent.

## Email types

| Type | Purpose | Sender default |
|------|---------|----------------|
| `verification` | Email verification during signup | verify@koomseoul.com |
| `welcome` | Post-verification welcome | hello@koomseoul.com |
| `notification` | Submission confirmations, status updates | notify@koomseoul.com |

## Trigger points for auth integration

When Supabase Auth (or any auth provider) is wired up, call these functions:

### After user signs up

```js
import { sendVerificationEmail } from './lib/emailService';

// After Supabase signUp returns
const { data, error } = await supabase.auth.signUp({ email, password });
if (!error) {
  // Supabase sends its own verification email by default.
  // If you want to use Resend instead, disable Supabase's built-in email
  // in the Dashboard → Authentication → Email → "Confirm email" toggle,
  // then send your own:
  await sendVerificationEmail(data.user.email, verificationUrl);
}
```

### After email is verified

```js
import { sendWelcomeEmail } from './lib/emailService';

// In your auth state change listener or on the confirmation callback page
await sendWelcomeEmail(user.email, user.user_metadata?.first_name);
```

### After host submits an event

```js
import { sendSubmissionConfirmationEmail } from './lib/emailService';

// In the submission workflow, after the submission is saved
await sendSubmissionConfirmationEmail(submission.contactEmail, submission.title);
```

### After admin approves / rejects (future)

```js
// When this flow is built:
await sendStatusUpdateEmail(hostEmail, eventTitle, 'approved');
```

## Graceful degradation

The email service never blocks or crashes the app:

- If `RESEND_API_KEY` is not set, the serverless function returns 503.
- If the fetch fails (network error, local dev without `vercel dev`), the client module returns `{ success: false }` with a `console.warn`.
- All email functions return `{ success: boolean }` — callers can check but are not required to.

## Adding a new email type

1. Add a convenience wrapper in `src/lib/emailService.js` following the existing pattern.
2. (Optional) Add a sender default in `api/send-email.js` → `TYPE_SENDERS`.
3. Wire the call at the appropriate trigger point.

## Production checklist

- [ ] Resend domain verified (SPF, DKIM, DMARC configured)
- [ ] `RESEND_API_KEY` set in Vercel environment variables
- [ ] `RESEND_FROM_EMAIL` matches verified domain
- [ ] Test send to a real address succeeds
- [ ] Monitor Resend dashboard for delivery failures
