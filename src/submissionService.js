/**
 * Repository layer for submission persistence.
 * Supabase-backed when VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY are present;
 * falls back to localStorage so the prototype works offline.
 */

import { createClient } from '@supabase/supabase-js';
import { PENDING_SUBMISSIONS } from './data.js';

let _sb = null;

function getSupabase() {
  if (_sb) return _sb;
  const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};
  if (env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY) {
    _sb = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
  }
  return _sb;
}

export const isBackendAvailable = () => !!getSupabase();

const TABLE = 'event_submissions';

const normalizeStatus = (status) => {
  if (status === 'pending') return 'submitted';
  return status || 'submitted';
};

function rowToSubmission(row) {
  return {
    id: row.id,
    title: row.title,
    host: row.host ?? '',
    contactEmail: row.contact_email ?? '',
    track: row.track ?? '',
    neigh: row.neigh ?? '',
    day: row.day ?? '',
    start: row.start ?? '',
    end: row.end ?? '',
    format: row.format ?? '',
    access: row.access ?? '',
    capacity: row.capacity ?? 60,
    submittedAt: row.submitted_at ?? '',
    status: normalizeStatus(row.status),
    blurb: row.blurb ?? '',
    location: row.location ?? '',
    audience: row.audience ?? '',
    speakers: row.speakers ?? [],
    source: row.source ?? '',
    publishedEventId: row.published_event_id ?? null,
    createdAt: row.created_at ?? '',
    updatedAt: row.updated_at ?? '',
    history: Array.isArray(row.history) ? row.history : [],
    flag: row.flag ?? null,
  };
}

function submissionToRow(s, overrides = {}) {
  return {
    id: s.id,
    title: s.title,
    host: s.host,
    contact_email: s.contactEmail ?? null,
    track: s.track,
    neigh: s.neigh,
    day: s.day,
    start: s.start,
    end: s.end,
    format: s.format,
    access: s.access,
    capacity: s.capacity ?? 60,
    submitted_at: s.submittedAt,
    status: normalizeStatus(s.status),
    blurb: s.blurb,
    location: s.location,
    audience: s.audience ?? null,
    speakers: s.speakers ?? [],
    source: s.source ?? '',
    published_event_id: s.publishedEventId ?? null,
    history: s.history ?? [],
    flag: s.flag ?? null,
    ...overrides,
  };
}

function partialUpdateToRow(updates) {
  const row = {};
  const map = {
    id: 'id',
    title: 'title',
    host: 'host',
    contactEmail: 'contact_email',
    track: 'track',
    neigh: 'neigh',
    day: 'day',
    start: 'start',
    end: 'end',
    format: 'format',
    access: 'access',
    capacity: 'capacity',
    submittedAt: 'submitted_at',
    status: 'status',
    blurb: 'blurb',
    location: 'location',
    audience: 'audience',
    speakers: 'speakers',
    source: 'source',
    publishedEventId: 'published_event_id',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    history: 'history',
    flag: 'flag',
  };
  Object.entries(map).forEach(([domainKey, rowKey]) => {
    if (Object.prototype.hasOwnProperty.call(updates, domainKey)) {
      row[rowKey] = domainKey === 'status' ? normalizeStatus(updates[domainKey]) : updates[domainKey];
    }
  });
  return row;
}

const STORAGE_KEY = 'koomSeoul.eventSubmissions.v1';

const seedSubmissions = () => PENDING_SUBMISSIONS.map((item) => ({
  ...item,
  status: normalizeStatus(item.status),
  createdAt: `${item.submittedAt}T09:00:00.000Z`,
  updatedAt: `${item.submittedAt}T09:00:00.000Z`,
  submittedAt: item.submittedAt,
  source: 'seed',
  history: [
    {
      action: normalizeStatus(item.status) === 'rejected' ? 'rejected' : 'submitted',
      note: item.flag || 'Seeded demo submission',
      at: `${item.submittedAt}T09:00:00.000Z`,
      actor: 'UKF Ops',
    },
  ],
}));

export function loadLocalSubmissions() {
  if (typeof window === 'undefined') return seedSubmissions();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedSubmissions();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return seedSubmissions();
    return parsed.map((item) => ({
      ...item,
      status: normalizeStatus(item.status),
      history: Array.isArray(item.history) ? item.history : [],
    }));
  } catch {
    return seedSubmissions();
  }
}

function localWrite(submissions) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  } catch {
    // private browsing quota
  }
}

export async function loadSubmissions() {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb.from(TABLE).select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) return data.map(rowToSubmission);
      const seeds = seedSubmissions();
      await syncSubmissions(seeds);
      return seeds;
    } catch (err) {
      console.warn('[submissionService] Supabase load failed, using localStorage:', err.message);
    }
  }
  return loadLocalSubmissions();
}

export async function createSubmissionRemote(submission) {
  const sb = getSupabase();
  if (sb) {
    try {
      const row = submissionToRow(submission);
      const { data, error } = await sb.from(TABLE).insert([row]).select().single();
      if (error) throw error;
      return rowToSubmission(data);
    } catch (err) {
      console.warn('[submissionService] Supabase create failed:', err.message);
    }
  }
  return submission;
}

export async function updateSubmissionRemote(id, updates) {
  const sb = getSupabase();
  if (sb) {
    try {
      const rowUpdates = partialUpdateToRow(updates);
      Object.keys(rowUpdates).forEach((k) => {
        if (rowUpdates[k] === undefined) delete rowUpdates[k];
      });
      rowUpdates.updated_at = new Date().toISOString();
      const { data, error } = await sb.from(TABLE).update(rowUpdates).eq('id', id).select().single();
      if (error) throw error;
      return rowToSubmission(data);
    } catch (err) {
      console.warn('[submissionService] Supabase update failed:', err.message);
    }
  }
  return null;
}

export async function syncSubmissions(submissions) {
  const sb = getSupabase();
  if (sb) {
    try {
      await sb.from(TABLE).delete().eq('source', 'seed');
      if (submissions.length > 0) {
        await sb.from(TABLE).insert(submissions.map((s) => submissionToRow(s)));
      }
    } catch (err) {
      console.warn('[submissionService] Supabase sync failed:', err.message);
    }
  }
  localWrite(submissions);
}

export function persistLocal(submissions) {
  localWrite(submissions);
}
