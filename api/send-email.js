/**
 * Vercel serverless function — sends transactional email via Resend.
 *
 * Expected environment variables (set in Vercel dashboard or .env.local):
 *   RESEND_API_KEY   — Resend API key (re_xxx)
 *   RESEND_FROM_EMAIL — Sender address (defaults to Koom Week Seoul <hello@koomseoul.com>)
 *
 * Request body (JSON):
 *   { to, subject, html, text?, type? }
 *
 * type is informational only for now — maps to different sender identities
 * when RESEND_FROM_EMAIL is not overridden.
 */

import { Resend } from 'resend';

const DEFAULT_FROM = 'Koom Week Seoul <hello@koomseoul.com>';

const TYPE_SENDERS = {
  verification: 'Koom Week Seoul <verify@koomseoul.com>',
  welcome: 'Koom Week Seoul <hello@koomseoul.com>',
  notification: 'Koom Week Seoul <notify@koomseoul.com>',
};

function getFromAddress(type) {
  const envFrom = process.env.RESEND_FROM_EMAIL;
  if (envFrom) return envFrom;
  if (type && TYPE_SENDERS[type]) return TYPE_SENDERS[type];
  return DEFAULT_FROM;
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[send-email] RESEND_API_KEY is not configured');
    return res.status(503).json({
      success: false,
      error: 'Email service not configured. Set RESEND_API_KEY.',
    });
  }

  const { to, subject, html, text, type } = req.body || {};

  if (!to || !subject || !html) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: to, subject, html',
    });
  }

  if (typeof to !== 'string' || !to.includes('@')) {
    return res.status(400).json({
      success: false,
      error: 'Invalid recipient email address',
    });
  }

  const resend = new Resend(apiKey);
  const from = getFromAddress(type);

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      ...(text ? { text } : {}),
    });

    if (error) {
      console.error('[send-email] Resend error:', error);
      return res.status(502).json({
        success: false,
        error: error.message || 'Email delivery failed',
      });
    }

    console.log(`[send-email] Sent ${type || 'email'} to ${to} (id: ${data?.id})`);
    return res.status(200).json({
      success: true,
      id: data?.id,
    });
  } catch (err) {
    console.error('[send-email] Unexpected error:', err);
    return res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}
