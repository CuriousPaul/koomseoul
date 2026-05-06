# Next Scope Decision Memo

## Context
Koom Seoul is currently a client-side Vite/React prototype with static event data and in-memory state. The repo docs explicitly say RSVP, Host, and Admin flows are not backed by a database, auth, persistence, or real APIs; the existing UI only simulates these paths.

## Option comparison
| Option | Value | Effort | Fit now | Notes |
|---|---:|---:|---:|---|
| A) Content/design polish | Medium | Low | Good | Improves presentation, but leaves the product as a static showcase. |
| B) Real RSVP/Host/Admin backend | High | Very high | Weak | Needs auth, persistence, APIs, roles, and operational hardening. |
| C) Event submission workflow for UKF ops | High | Medium | Best | Extends the current Host/Admin prototype into a real intake + review flow. |

## Recommendation
Choose **C**. It best matches the current codebase because the app already has a host submission form, a pending queue, and an admin moderation view. That means the next step can convert mock flows into a useful internal workflow without first building the entire public RSVP platform.

## Why not the others now
- **A** is worthwhile later, but it doesn’t change the product’s core utility.
- **B** is premature because the repo has no auth, backend, database, or API layer to support it.

## MVP scope
- Internal event submission intake for UKF ops
- Review queue with approve/reject/request-changes states
- Submission metadata capture and validation
- Basic publish-to-directory handoff for approved events

## Implementation phases
1. **Intake**: capture submission fields and validate required data.
2. **Review**: queue submissions for UKF ops with clear status transitions.
3. **Publish**: move approved submissions into the public event dataset.
4. **Operate**: add auditability, notifications, and simple reporting.

## Data model / API needs
- `events`
- `event_submissions`
- `submission_reviews`
- `users` / roles for ops and admins
- API endpoints for create submission, list queue, change status, publish approved event

## Operational workflow
1. Host submits an event.
2. UKF ops reviews the submission.
3. Ops requests changes, rejects, or approves.
4. Approved items are published into the public directory.

## Risks
- Role/auth design can expand scope quickly.
- Publishing rules must avoid duplicate or inconsistent events.
- Approval workflow needs clear ownership and audit trail.

## Validation checklist
- Submit a valid event end to end.
- See it appear in the review queue.
- Change status to approved/rejected/request-changes.
- Confirm approved events surface in the public directory.
- Confirm invalid submissions are blocked.

## Candidate first tasks
1. Define submission and review data models.
2. Add API contract for create/list/update submission.
3. Wire host form to the submission endpoint.
4. Wire admin queue to real submission data.
5. Add approve/reject/request-changes transitions.
6. Add publish step from approved submission to event record.
7. Add basic role gating for ops/admin views.
8. Add audit timestamps and submission status history.
