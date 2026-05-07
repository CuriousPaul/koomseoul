/**
 * Vercel serverless function — sends transactional email via Resend.
 *
 * The endpoint intentionally does NOT accept arbitrary subject/html from the
 * browser. It accepts a small template payload and renders branded email on the
 * server so the Resend key cannot become an open relay for custom content.
 *
 * Expected environment variables (set in Vercel dashboard or .env.local):
 *   RESEND_API_KEY     — Resend API key (re_xxx)
 *   RESEND_FROM_EMAIL  — Sender address (defaults to Koom Week Seoul <hello@koomseoul.com>)
 *   SITE_URL           — Optional canonical app origin for CORS/origin checks
 *   RESEND_TEST_MODE   — Optional: "true" returns a dry-run success without sending
 */

import { Resend } from 'resend';

const DEFAULT_FROM = 'Koom Week Seoul <hello@koomseoul.com>';
const DEFAULT_SITE_URL = 'https://koomseoul.vercel.app';
const MAX_EMAIL_LENGTH = 254;
const MAX_TITLE_LENGTH = 160;
const MAX_STATUS_LENGTH = 40;

const TYPE_SENDERS = {
  submission_confirmation: 'Koom Week Seoul <notify@koomseoul.com>',
  status_update: 'Koom Week Seoul <notify@koomseoul.com>',
  welcome: 'Koom Week Seoul <hello@koomseoul.com>',
};

function getAllowedOrigins() {
  return new Set([
    DEFAULT_SITE_URL,
    process.env.SITE_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    'http://localhost:5173',
    'http://localhost:3000',
  ].filter(Boolean));
}

function setCorsHeaders(req, res) {
  const origin = req.headers.origin;
  if (origin && getAllowedOrigins().has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function isAllowedOrigin(req) {
  const origin = req.headers.origin;
  // Same-origin/server-to-server requests may omit Origin.
  if (!origin) return true;
  return getAllowedOrigins().has(origin);
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isValidEmail(email) {
  return (
    typeof email === 'string' &&
    email.length > 3 &&
    email.length <= MAX_EMAIL_LENGTH &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  );
}

function truncate(value, max) {
  const text = String(value || '').trim();
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function getFromAddress(type) {
  const envFrom = process.env.RESEND_FROM_EMAIL;
  if (envFrom) return envFrom;
  if (type && TYPE_SENDERS[type]) return TYPE_SENDERS[type];
  return DEFAULT_FROM;
}

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
          <a href="https://koomseoul.vercel.app" style="color:#C8102E;">koomseoul.vercel.app</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function plainTextFallback(heading, bodyText) {
  return `Koom Week Seoul — ${heading}\n\n${bodyText}\n\n— Koom Week Seoul / Urban Korea Foundation\nhttps://koomseoul.vercel.app`;
}

function buildSubmissionConfirmation(payload = {}) {
  const eventTitle = truncate(payload.eventTitle, MAX_TITLE_LENGTH);
  if (!eventTitle) throw new Error('Missing payload.eventTitle');
  const safeTitle = escapeHtml(eventTitle);

  return {
    subject: `Koom Week Seoul — Submission received: ${eventTitle}`,
    html: brandedWrapper(
      'Submission received',
      `<p>Thanks for submitting <strong>${safeTitle}</strong> to Koom Week Seoul.</p>
       <p>Our curation team will review your event. You'll receive another email once it's approved or if we need more details.</p>
       <p>Typical review time: 2–3 business days.</p>`,
    ),
    text: plainTextFallback(
      'Submission received',
      `Your event "${eventTitle}" has been submitted. The curation team will review it within 2-3 business days.`,
    ),
  };
}

function buildStatusUpdate(payload = {}) {
  const eventTitle = truncate(payload.eventTitle, MAX_TITLE_LENGTH);
  const status = truncate(payload.status, MAX_STATUS_LENGTH);
  if (!eventTitle || !status) throw new Error('Missing payload.eventTitle or payload.status');

  const safeTitle = escapeHtml(eventTitle);
  const safeStatus = escapeHtml(status.replace(/_/g, ' '));
  const note = truncate(payload.note, 600);
  const safeNote = note ? `<p style="font-size:13px;color:#666;">${escapeHtml(note)}</p>` : '';

  return {
    subject: `Koom Week Seoul — Submission ${status.replace(/_/g, ' ')}: ${eventTitle}`,
    html: brandedWrapper(
      'Submission status updated',
      `<p>Your submission <strong>${safeTitle}</strong> is now marked as <strong>${safeStatus}</strong>.</p>
       ${safeNote}
       <p>If we need anything else, the curation team will follow up directly.</p>`,
    ),
    text: plainTextFallback(
      'Submission status updated',
      `Your submission "${eventTitle}" is now marked as ${status.replace(/_/g, ' ')}.${note ? `\n\nNote: ${note}` : ''}`,
    ),
  };
}

function buildWelcome(payload = {}) {
  const firstName = truncate(payload.firstName, 80) || 'there';
  const safeName = escapeHtml(firstName);

  return {
    subject: 'Welcome to Koom Week Seoul!',
    html: brandedWrapper(
      'Welcome to Koom Week Seoul!',
      `<p>Hi ${safeName},</p>
       <p>Your email is verified — you're all set.</p>
       <p>Explore the event directory, build your schedule, and if you're hosting, submit your event for curation.</p>
       <p style="margin:24px 0;">
         <a href="https://koomseoul.vercel.app"
            style="display:inline-block;padding:12px 28px;background:#C8102E;color:#fff;
                   text-decoration:none;border-radius:4px;font-weight:600;">
           Explore events
         </a>
       </p>`,
    ),
    text: plainTextFallback(
      'Welcome to Koom Week Seoul!',
      `Hi ${firstName}, your email is verified. Head to https://koomseoul.vercel.app to explore events.`,
    ),
  };
}

function buildEmail(type, payload) {
  switch (type) {
    case 'submission_confirmation':
      return buildSubmissionConfirmation(payload);
    case 'status_update':
      return buildStatusUpdate(payload);
    case 'welcome':
      return buildWelcome(payload);
    default:
      throw new Error(`Unsupported email type: ${type || '(missing)'}`);
  }
}

export default async function handler(req, res) {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  if (!isAllowedOrigin(req)) {
    return res.status(403).json({ success: false, error: 'Origin not allowed' });
  }

  const { to, type, payload } = req.body || {};

  if (!isValidEmail(to)) {
    return res.status(400).json({ success: false, error: 'Invalid recipient email address' });
  }

  let email;
  try {
    email = buildEmail(type, payload || {});
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err instanceof Error ? err.message : 'Invalid email payload',
    });
  }

  if (process.env.RESEND_TEST_MODE === 'true') {
    console.log(`[send-email] Dry run ${type} to ${to}`);
    return res.status(200).json({ success: true, id: 'dry-run' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[send-email] RESEND_API_KEY is not configured');
    return res.status(503).json({
      success: false,
      error: 'Email service not configured. Set RESEND_API_KEY.',
    });
  }

  const resend = new Resend(apiKey);
  const from = getFromAddress(type);

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject: email.subject,
      html: email.html,
      text: email.text,
    });

    if (error) {
      console.error('[send-email] Resend error:', error);
      return res.status(502).json({
        success: false,
        error: error.message || 'Email delivery failed',
      });
    }

    console.log(`[send-email] Sent ${type} to ${to} (id: ${data?.id})`);
    return res.status(200).json({ success: true, id: data?.id });
  } catch (err) {
    console.error('[send-email] Unexpected error:', err);
    return res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}
