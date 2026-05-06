import { useEffect, useMemo, useState } from 'react';
import { PENDING_SUBMISSIONS } from './data.js';

const STORAGE_KEY = 'koomSeoul.eventSubmissions.v1';

const nowIso = () => new Date().toISOString();

const statusLabels = {
  submitted: 'Submitted',
  needs_changes: 'Needs changes',
  approved: 'Approved',
  rejected: 'Rejected',
  published: 'Published',
};

export const SUBMISSION_STATUSES = statusLabels;

const normalizeLegacyStatus = (status) => {
  if (status === 'pending') return 'submitted';
  return status || 'submitted';
};

const addAudit = (submission, action, note) => {
  const at = nowIso();
  return {
    ...submission,
    updatedAt: at,
    history: [
      ...(submission.history || []),
      { action, note, at, actor: 'UKF Ops' },
    ],
  };
};

const seedSubmissions = () => PENDING_SUBMISSIONS.map((item) => ({
  ...item,
  status: normalizeLegacyStatus(item.status),
  createdAt: `${item.submittedAt}T09:00:00.000Z`,
  updatedAt: `${item.submittedAt}T09:00:00.000Z`,
  submittedAt: item.submittedAt,
  source: 'seed',
  history: [
    {
      action: normalizeLegacyStatus(item.status) === 'rejected' ? 'rejected' : 'submitted',
      note: item.flag || 'Seeded demo submission',
      at: `${item.submittedAt}T09:00:00.000Z`,
      actor: 'UKF Ops',
    },
  ],
}));

const safeRead = () => {
  if (typeof window === 'undefined') return seedSubmissions();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedSubmissions();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return seedSubmissions();
    return parsed.map((item) => ({
      ...item,
      status: normalizeLegacyStatus(item.status),
      history: Array.isArray(item.history) ? item.history : [],
    }));
  } catch {
    return seedSubmissions();
  }
};

const safeWrite = (submissions) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  } catch {
    // localStorage can fail in private browsing. Keep the in-memory workflow usable.
  }
};

const buildPublishedEventId = (submissionId, reservedIds) => {
  const baseId = `pub-${submissionId}`;
  if (!reservedIds.has(baseId)) return baseId;
  let suffix = 2;
  while (reservedIds.has(`${baseId}-${suffix}`)) suffix += 1;
  return `${baseId}-${suffix}`;
};

export const getReservedEventIds = (events = []) => new Set(events.map((event) => event.id));

export function useSubmissionWorkflow(reservedEventIds = new Set()) {
  const [submissions, setSubmissions] = useState(() => safeRead());

  useEffect(() => {
    safeWrite(submissions);
  }, [submissions]);

  const createSubmission = (form) => {
    const at = nowIso();
    const id = `s${Date.now().toString(36)}`;
    const submission = {
      ...form,
      id,
      status: 'submitted',
      submittedAt: at.slice(0, 10),
      createdAt: at,
      updatedAt: at,
      source: 'host-form',
      history: [
        { action: 'submitted', note: 'Host submitted event proposal', at, actor: form.host || 'Host' },
      ],
    };
    setSubmissions((prev) => [submission, ...prev]);
    return submission;
  };

  const updateStatus = (id, status, note = '') => {
    setSubmissions((prev) => prev.map((item) => {
      if (item.id !== id) return item;
      return addAudit({ ...item, status }, status, note || statusLabels[status] || status);
    }));
  };

  const publishSubmission = (id) => {
    setSubmissions((prev) => {
      const reservedIds = new Set(reservedEventIds);
      prev.forEach((submission) => {
        if (submission.id !== id && submission.publishedEventId) {
          reservedIds.add(submission.publishedEventId);
        }
      });

      return prev.map((item) => {
        if (item.id !== id) return item;
        if (item.status !== 'approved') return item;
        const publishedEventId = item.publishedEventId || buildPublishedEventId(item.id, reservedIds);
        return addAudit({ ...item, status: 'published', publishedEventId }, 'published', 'Published to public directory');
      });
    });
  };

  const resetDemoData = () => setSubmissions(seedSubmissions());

  const publishedEvents = useMemo(() => submissions
    .filter((item) => item.status === 'published')
    .map(submissionToEvent), [submissions]);

  return {
    submissions,
    publishedEvents,
    createSubmission,
    updateStatus,
    publishSubmission,
    resetDemoData,
  };
}

export function submissionToEvent(item) {
  return {
    id: item.publishedEventId || `pub-${item.id}`,
    title: item.title,
    host: item.host,
    track: item.track,
    neigh: item.neigh,
    day: item.day,
    start: item.start,
    end: item.end,
    format: item.format,
    access: item.access,
    capacity: Number(item.capacity) || 60,
    rsvp: Number(item.rsvp) || 0,
    status: 'approved',
    blurb: item.blurb,
    location: item.location || 'Venue TBA',
    speakers: item.speakers || [],
    submissionId: item.id,
  };
}
