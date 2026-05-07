/**
 * Client-side email service for Koom Seoul.
 *
 * Sends transactional email by calling the Vercel serverless function
 * at /api/send-email. The Resend API key stays server-side; this module
 * never touches it directly.
 *
 * The API endpoint accepts template names + structured payload only. This keeps
 * the browser from turning the endpoint into a custom-content mail relay.
 *
 * Graceful degradation: when the email endpoint is unavailable (e.g. local
 * dev without `vercel dev`, or network error), every function logs a warning
 * and returns `{ success: false }` without throwing.
 */

const API_ENDPOINT = '/api/send-email';

// ---------------------------------------------------------------------------
// Core send
// ---------------------------------------------------------------------------

/**
 * Send a templated email via the serverless endpoint.
 * @param {{ to: string, type: string, payload?: Record<string, unknown> }} params
 * @returns {Promise<{ success: boolean, id?: string, error?: string }>}
 */
export async function sendEmail({ to, type, payload = {} }) {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, type, payload }),
    });

    let data = {};
    try {
      data = await response.json();
    } catch {
      data = {};
    }

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
// Convenience wrappers
// ---------------------------------------------------------------------------

/**
 * Send a welcome email after the user's email is verified.
 * @param {string} email
 * @param {string} [firstName]
 * @returns {Promise<{ success: boolean, id?: string, error?: string }>}
 */
export async function sendWelcomeEmail(email, firstName) {
  return sendEmail({
    to: email,
    type: 'welcome',
    payload: { firstName },
  });
}

/**
 * Send a confirmation that an event submission was received.
 * @param {string} email — host / submitter email
 * @param {string} eventTitle
 * @returns {Promise<{ success: boolean, id?: string, error?: string }>}
 */
export async function sendSubmissionConfirmationEmail(email, eventTitle) {
  return sendEmail({
    to: email,
    type: 'submission_confirmation',
    payload: { eventTitle },
  });
}

/**
 * Send a status update to the host when admins change a submission status.
 * @param {string} email
 * @param {string} eventTitle
 * @param {string} status
 * @param {string} [note]
 * @returns {Promise<{ success: boolean, id?: string, error?: string }>}
 */
export async function sendStatusUpdateEmail(email, eventTitle, status, note) {
  return sendEmail({
    to: email,
    type: 'status_update',
    payload: { eventTitle, status, note },
  });
}
