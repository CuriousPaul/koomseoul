/**
 * Client-side email service for Koom Seoul.
 *
 * Sends transactional email by calling the Vercel serverless function
 * at /api/send-email. The Resend API key stays server-side; this module
 * never touches it directly.
 *
 * Graceful degradation: when the email endpoint is unavailable (e.g. local
 * dev without `vercel dev`, or network error), every function logs a warning
 * and returns `{ success: false }` without throwing.
 *
 * ── Trigger points for auth integration ─────────────────────────────
 *
 * When Supabase Auth (or any auth provider) is wired up, call these
 * functions at the listed moments:
 *
 *   1. After Supabase signUp completes
 *      → sendVerificationEmail(user.email, verificationUrl)
 *
 *   2. After email confirmation is verified
 *      → sendWelcomeEmail(user.email, user.firstName)
 *
 *   3. After a host submits an event
 *      → sendSubmissionConfirmationEmail(hostEmail, eventTitle)
 *
 *   4. After admin approves / rejects a submission (future)
 *      → sendStatusUpdateEmail(hostEmail, eventTitle, newStatus)
 *
 * Each convenience wrapper generates a branded HTML body so you don't
 * need a template engine.
 * ─────────────────────────────────────────────────────────────────────
 */

const API_ENDPOINT = '/api/send-email';

// ---------------------------------------------------------------------------
// Core send
// ---------------------------------------------------------------------------

/**
 * Send an email via the serverless endpoint.
 * @param {{ to: string, subject: string, html: string, text?: string, type?: string }} params
 * @returns {Promise<{ success: boolean, id?: string, error?: string }>}
 */
export async function sendEmail({ to, subject, html, text, type }) {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, html, text, type }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.warn('[emailService] Send failed:', data.error || response.status);
      return { success: false, error: data.error || `HTTP ${response.status}` };
    }

    return { success: true, id: data.id };
  } catch (err) {
    console.warn('[emailService] Network error:', err instanceof Error ? err.message : err);
    return { success: false, error: 'Email service unavailable' };
  }
}

// ---------------------------------------------------------------------------
// Branded HTML helpers
// ---------------------------------------------------------------------------

function brandedWrapper(heading, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F3EC;font-family:'Helvetica Neue',Arial,sans-serif;color:#111;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:32px auto;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #E6E4DD;">
    <tr>
      <td style="padding:24px 32px 16px;background:#C8102E;">
        <span style="font-size:18px;font-weight:700;color:#fff;letter-spacing:0.5px;">Koom Week Seoul</span>
      </td>
    </tr>
    <tr>
      <td style="padding:32px;">
        <h2 style="margin:0 0 16px;font-size:20px;font-weight:600;color:#111;">${heading}</h2>
        <div style="font-size:15px;line-height:1.6;color:#333;">
          ${bodyHtml}
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 32px 24px;border-top:1px solid #E6E4DD;">
        <p style="margin:0;font-size:12px;color:#888;">
          Koom Week Seoul — Urban Korea Foundation<br>
          <a href="https://koomseoul.com" style="color:#C8102E;">koomseoul.com</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function plainTextFallback(heading, bodyText) {
  return `Koom Week Seoul — ${heading}\n\n${bodyText}\n\n— Koom Week Seoul / Urban Korea Foundation\nhttps://koomseoul.com`;
}

// ---------------------------------------------------------------------------
// Convenience wrappers
// ---------------------------------------------------------------------------

/**
 * Send a verification / confirm-your-email message.
 * @param {string} email  — recipient address
 * @param {string} verificationUrl — the link the user must click
 * @returns {Promise<{ success: boolean, id?: string, error?: string }>}
 */
export async function sendVerificationEmail(email, verificationUrl) {
  const html = brandedWrapper(
    'Verify your email',
    `<p>Thanks for signing up with Koom Week Seoul.</p>
     <p style="margin:24px 0;">
       <a href="${verificationUrl}"
          style="display:inline-block;padding:12px 28px;background:#C8102E;color:#fff;
                 text-decoration:none;border-radius:4px;font-weight:600;">
         Verify email address
       </a>
     </p>
     <p style="font-size:13px;color:#666;">
       If the button doesn't work, copy and paste this link into your browser:<br>
       <code style="word-break:break-all;">${verificationUrl}</code>
     </p>
     <p style="font-size:13px;color:#666;">This link expires in 24 hours.</p>`,
  );

  const text = plainTextFallback(
    'Verify your email',
    `Copy this link into your browser to verify your email:\n${verificationUrl}\n\nThis link expires in 24 hours.`,
  );

  return sendEmail({
    to: email,
    subject: 'Koom Week Seoul — Verify your email',
    html,
    text,
    type: 'verification',
  });
}

/**
 * Send a welcome email after the user's email is verified.
 * @param {string} email
 * @param {string} [firstName]
 * @returns {Promise<{ success: boolean, id?: string, error?: string }>}
 */
export async function sendWelcomeEmail(email, firstName) {
  const name = firstName || 'there';
  const html = brandedWrapper(
    'Welcome to Koom Week Seoul!',
    `<p>Hi ${name},</p>
     <p>Your email is verified — you're all set.</p>
     <p>Explore the event directory, build your schedule, and if you're hosting, submit your event for curation.</p>
     <p style="margin:24px 0;">
       <a href="https://koomseoul.com"
          style="display:inline-block;padding:12px 28px;background:#C8102E;color:#fff;
                 text-decoration:none;border-radius:4px;font-weight:600;">
         Explore events
       </a>
     </p>`,
  );

  const text = plainTextFallback(
    'Welcome to Koom Week Seoul!',
    `Hi ${name}, your email is verified. Head to https://koomseoul.com to explore events.`,
  );

  return sendEmail({
    to: email,
    subject: 'Welcome to Koom Week Seoul!',
    html,
    text,
    type: 'welcome',
  });
}

/**
 * Send a confirmation that an event submission was received.
 * @param {string} email — host / submitter email
 * @param {string} eventTitle
 * @returns {Promise<{ success: boolean, id?: string, error?: string }>}
 */
export async function sendSubmissionConfirmationEmail(email, eventTitle) {
  const html = brandedWrapper(
    'Submission received',
    `<p>Thanks for submitting <strong>${eventTitle}</strong> to Koom Week Seoul.</p>
     <p>Our curation team will review your event. You'll receive another email once it's approved or if we need more details.</p>
     <p>Typical review time: 2–3 business days.</p>`,
  );

  const text = plainTextFallback(
    'Submission received',
    `Your event "${eventTitle}" has been submitted. The curation team will review it within 2-3 business days.`,
  );

  return sendEmail({
    to: email,
    subject: `Koom Week Seoul — Submission received: ${eventTitle}`,
    html,
    text,
    type: 'notification',
  });
}
