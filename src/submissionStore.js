import { useCallback, useEffect, useMemo, useState } from 'react';
import { PENDING_SUBMISSIONS } from './data.js';
import {
  isBackendAvailable,
  loadSubmissions as loadFromService,
  createSubmissionRemote,
  updateSubmissionRemote,
  syncSubmissions,
  persistLocal,
  loadLocalSubmissions,
  loadPublishedEvents,
} from './submissionService.js';
import {
  sendSubmissionConfirmationEmail,
  sendStatusUpdateEmail,
} from './lib/emailService.js';

const nowIso = () => new Date().toISOString();

const statusLabels = {
  submitted: 'Submitted',
  needs_changes: 'Needs changes',
  approved: 'Approved',
  rejected: 'Rejected',
  published: 'Published',
};

export const SUBMISSION_STATUSES = statusLabels;

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
  status: item.status === 'pending' ? 'submitted' : (item.status || 'submitted'),
  createdAt: `${item.submittedAt}T09:00:00.000Z`,
  updatedAt: `${item.submittedAt}T09:00:00.000Z`,
  submittedAt: item.submittedAt,
  source: 'seed',
  history: [
    {
      action: (item.status === 'pending' ? 'submitted' : item.status || 'submitted') === 'rejected' ? 'rejected' : 'submitted',
      note: item.flag || 'Seeded demo submission',
      at: `${item.submittedAt}T09:00:00.000Z`,
      actor: 'UKF Ops',
    },
  ],
}));

const buildPublishedEventId = (submissionId, reservedIds) => {
  const baseId = `pub-${submissionId}`;
  if (!reservedIds.has(baseId)) return baseId;
  let suffix = 2;
  while (reservedIds.has(`${baseId}-${suffix}`)) suffix += 1;
  return `${baseId}-${suffix}`;
};

export const getReservedEventIds = (events = []) => new Set(events.map((event) => event.id));

export function useSubmissionWorkflow(reservedEventIds = new Set()) {
  const [submissions, setSubmissions] = useState(() => loadLocalSubmissions());
  const [backendMode, setBackendMode] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [publicEvents, setPublicEvents] = useState([]);
  const currentBackendMode = isBackendAvailable();

  useEffect(() => {
    let cancelled = false;
    loadFromService().then((loaded) => {
      if (!cancelled) {
        setSubmissions(loaded);
        setBackendMode(isBackendAvailable());
        setHydrated(true);
      }
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (hydrated && !currentBackendMode) persistLocal(submissions);
  }, [submissions, currentBackendMode, hydrated]);

  useEffect(() => {
    if (!hydrated || !currentBackendMode) return;
    let cancelled = false;
    loadPublishedEvents().then((events) => {
      if (!cancelled) setPublicEvents(events);
    });
    return () => { cancelled = true; };
  }, [hydrated, currentBackendMode]);

  const createSubmission = useCallback((form) => {
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

    if (backendMode) {
      createSubmissionRemote(submission).then(() => {
        loadFromService().then(setSubmissions);
      });
    }

    sendSubmissionConfirmationEmail(submission.contactEmail, submission.title).then((result) => {
      if (!result.success) {
        console.warn('[submissionStore] Submission confirmation email not sent:', result.error);
      }
    });

    setSubmissions((prev) => [submission, ...prev]);
    return submission;
  }, [backendMode]);

  const updateStatus = useCallback((id, status, note = '') => {
    const apply = (prev) => prev.map((item) => {
      if (item.id !== id) return item;
      return addAudit({ ...item, status }, status, note || statusLabels[status] || status);
    });

    setSubmissions(apply);

    const current = submissions.find((item) => item.id === id);

    if (current?.contactEmail) {
      sendStatusUpdateEmail(current.contactEmail, current.title, status, note || statusLabels[status] || status).then((result) => {
        if (!result.success) {
          console.warn('[submissionStore] Status update email not sent:', result.error);
        }
      });
    }

    if (backendMode && current) {
      const audited = addAudit({ ...current, status }, status, note || statusLabels[status] || status);
      updateSubmissionRemote(id, audited).then((remote) => {
        if (remote) loadFromService().then(setSubmissions);
      });
    }
  }, [backendMode, submissions]);

  const publishSubmission = useCallback((id) => {
    const apply = (prev) => {
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
    };

    setSubmissions(apply);

    if (backendMode) {
      setSubmissions((current) => {
        const item = current.find((s) => s.id === id);
        if (item && item.status === 'approved') {
          const reservedIds = new Set(reservedEventIds);
          current.forEach((s) => { if (s.publishedEventId) reservedIds.add(s.publishedEventId); });
          const publishedEventId = item.publishedEventId || buildPublishedEventId(item.id, reservedIds);
          const at = nowIso();
          updateSubmissionRemote(id, {
            status: 'published',
            publishedEventId,
            updatedAt: at,
            history: [...(item.history || []), { action: 'published', note: 'Published to public directory', at, actor: 'UKF Ops' }],
          }).then((remote) => {
            if (remote) loadFromService().then(setSubmissions);
          });
        }
        return current;
      });
    }
  }, [backendMode, reservedEventIds]);

  const resetDemoData = useCallback(() => {
    if (backendMode) {
      console.warn('[submissionStore] Reset demo queue is disabled while Supabase is connected.');
      return;
    }
    setSubmissions(seedSubmissions());
  }, [backendMode]);

  const publishedEvents = useMemo(() => {
    if (currentBackendMode && publicEvents.length > 0) return publicEvents;
    return submissions
      .filter((item) => item.status === 'published')
      .map(submissionToEvent);
  }, [submissions, publicEvents, currentBackendMode]);

  return {
    submissions,
    publishedEvents,
    createSubmission,
    updateStatus,
    publishSubmission,
    resetDemoData,
    backendMode,
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
