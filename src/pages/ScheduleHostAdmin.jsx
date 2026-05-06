import React, { useState } from 'react';
import {
  EVENTS as STATIC_EVENTS, DAYS, NEIGHBORHOODS, TRACKS, ACCESS, FORMATS
} from '../data.js';
import { KwTrackTag } from '../shared.jsx';
import { SUBMISSION_STATUSES } from '../submissionStore.js';

// ---------------- SCHEDULE BUILDER ----------------
export function SchedulePage({ events = STATIC_EVENTS, scheduleIds, toggleSchedule, onNav }) {
  const myEvents = events.filter(e => scheduleIds.includes(e.id));
  const byDay = DAYS.map(d => ({
    ...d,
    events: myEvents.filter(e => e.day === d.id).sort((a, b) => a.start.localeCompare(b.start)),
  }));

  const slots = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];

  const stats = {
    events: myEvents.length,
    tracks: new Set(myEvents.map(e => e.track)).size,
    neighs: new Set(myEvents.map(e => e.neigh)).size,
    days: new Set(myEvents.map(e => e.day)).size,
  };

  return (
    <div className="kw-schedule">
      <div className="kw-container-wide">
        <div className="kw-schedule-head">
          <div>
            <div className="kw-eyebrow"><span className="dot"></span>YOUR KOOM WEEK</div>
            <h1>My Schedule.</h1>
          </div>
          <div className="right">
            <button className="kw-btn kw-btn-ghost">Export to .ics</button>
            <button className="kw-btn kw-btn-primary" onClick={() => onNav("discover")}>+ Add events</button>
          </div>
        </div>

        {myEvents.length === 0 ? (
          <div className="kw-schedule-empty">
            <h3>Your schedule is empty.</h3>
            <p>Browse events on the Discover page and tap RSVP to add them here. UKF's sector intentionality protocol will warn you about time conflicts as you build.</p>
            <button className="kw-btn kw-btn-accent" onClick={() => onNav("discover")}>Browse Events →</button>
          </div>
        ) : (
          <>
            <div className="kw-schedule-summary">
              <div className="stat"><div className="num">{stats.events}</div><div className="lbl">Events</div></div>
              <div className="stat"><div className="num">{stats.tracks}</div><div className="lbl">Tracks covered</div></div>
              <div className="stat"><div className="num">{stats.neighs}</div><div className="lbl">Neighborhoods</div></div>
              <div className="stat"><div className="num">{stats.days}</div><div className="lbl">Active days</div></div>
            </div>

            <div className="kw-schedule-grid">
              <div className="col-header" style={{background:"var(--ukf-ink)", color:"#fff"}}>
                <div className="dow" style={{color:"rgba(255,255,255,0.6)"}}>TIME</div>
                Aug 26
              </div>
              {DAYS.map(d => (
                <div className="col-header" key={d.id}>
                  <div className="dow">{d.weekday}</div>
                  {d.date.replace("Aug ", "")}
                </div>
              ))}
              {slots.map((slot, si) => {
                const next = slots[si + 1] || "24:00";
                return (
                  <React.Fragment key={slot}>
                    <div className="time-slot">{slot}</div>
                    {DAYS.map(d => {
                      const ev = byDay.find(b => b.id === d.id).events.find(e =>
                        e.start >= slot && e.start < next
                      );
                      return (
                        <div className="cell" key={d.id + slot}>
                          {ev ? (
                            <div className="kw-schedule-event" data-track={ev.track}
                                 onClick={() => toggleSchedule(ev.id)}>
                              <div className="time">{ev.start}—{ev.end}</div>
                              <div className="title">{ev.title}</div>
                              <div className="neigh">{NEIGHBORHOODS[ev.neigh].label}</div>
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </div>

            <div style={{marginTop: 48}}>
              <h2 className="kw-h3" style={{marginBottom:24}}>List view</h2>
              {byDay.filter(d => d.events.length).map(d => (
                <div key={d.id} style={{marginBottom: 32}}>
                  <div className="kw-list-day-header">
                    <span className="day">{d.date}</span>
                    <span className="dow">{d.weekday}</span>
                  </div>
                  {d.events.map(e => (
                    <ScheduleEventRow key={e.id} ev={e} onRemove={() => toggleSchedule(e.id)} />
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ScheduleEventRow({ ev, onRemove }) {
  return (
    <div className="kw-event-row in-schedule" onClick={onRemove}>
      <div className="time">
        {ev.start}
        <span className="end">— {ev.end}</span>
      </div>
      <div className="body">
        <h4>{ev.title}</h4>
        <div className="meta">
          {ev.host} · {NEIGHBORHOODS[ev.neigh].label} · {ev.format}
        </div>
        <div className="tags">
          <KwTrackTag track={ev.track} />
          <span className="kw-pill red">✓ In your schedule</span>
        </div>
      </div>
      <div className="rsvp-cell">
        <button className="kw-btn kw-btn-ghost kw-btn-sm">Remove</button>
      </div>
    </div>
  );
}

// ---------------- HOST SUBMISSION ----------------
const INITIAL_HOST_FORM = {
  title: "",
  host: "",
  contactEmail: "",
  track: "beauty",
  format: "Panel",
  day: "wed",
  start: "14:00",
  end: "16:00",
  neigh: "seongsu",
  capacity: 60,
  access: "apply",
  blurb: "",
  audience: "",
  location: "",
};

function validateHostForm(form) {
  const errors = {};
  if (!form.title.trim()) errors.title = "Event title is required.";
  if (!form.host.trim()) errors.host = "Host name is required.";
  if (!form.contactEmail.trim()) errors.contactEmail = "Contact email is required for ops follow-up.";
  if (form.contactEmail && !/^\S+@\S+\.\S+$/.test(form.contactEmail)) errors.contactEmail = "Use a valid email address.";
  if (!form.blurb.trim()) errors.blurb = "Public blurb is required.";
  if (form.blurb.length > 280) errors.blurb = "Keep the public blurb under 280 characters.";
  if (!form.location.trim()) errors.location = "Venue or location note is required.";
  if (!form.audience.trim()) errors.audience = "Target audience is required.";
  if (Number(form.capacity) < 60) errors.capacity = "Capacity must be at least 60.";
  if (form.end <= form.start) errors.end = "End time must be after start time.";
  return errors;
}

export function HostPage({ createSubmission, onNav }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL_HOST_FORM);
  const [submitted, setSubmitted] = useState(null);
  const [errors, setErrors] = useState({});

  const upd = (k, v) => {
    setForm({ ...form, [k]: v });
    if (errors[k]) setErrors({ ...errors, [k]: undefined });
  };

  const submit = () => {
    const nextErrors = validateHostForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    const submission = createSubmission({ ...form, capacity: Number(form.capacity) });
    setSubmitted(submission);
  };

  if (submitted) {
    return (
      <div className="kw-container-narrow" style={{padding:"96px 0"}}>
        <div className="kw-form-success">
          <div className="check">✓</div>
          <h2>Submission received.</h2>
          <p>Your proposal is now in the UKF operations review queue as <strong>{submitted.id}</strong>. Ops can request changes, approve, reject, or publish it from Admin.</p>
          <div className="kw-submission-receipt">
            <div><span>Status</span><strong>{SUBMISSION_STATUSES[submitted.status]}</strong></div>
            <div><span>Submitted</span><strong>{submitted.submittedAt}</strong></div>
            <div><span>Host</span><strong>{submitted.host}</strong></div>
          </div>
          <div style={{marginTop:32, display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap"}}>
            <button className="kw-btn kw-btn-ghost" onClick={() => { setSubmitted(null); setForm(INITIAL_HOST_FORM); setStep(0); }}>Submit another</button>
            <button className="kw-btn kw-btn-primary" onClick={() => onNav("admin")}>Review in Admin →</button>
            <button className="kw-btn kw-btn-tertiary" onClick={() => onNav("discover")}>Back to Discover</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="kw-form-page">
      <div className="kw-form-head">
        <div className="kw-eyebrow"><span className="dot"></span>HOST AN EVENT · STEP {step + 1} OF 3</div>
        <h1>Submit your event for Koom Week.</h1>
        <p className="sub">Submissions are saved locally in this prototype and routed into the Admin review queue for UKF ops demo review.</p>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="kw-form-alert" role="alert">
          <strong>Before submitting:</strong>
          <ul>{Object.values(errors).filter(Boolean).map(err => <li key={err}>{err}</li>)}</ul>
        </div>
      )}

      {step === 0 && (
        <div className="kw-form-section">
          <h3>The basics</h3>
          <div className="kw-form-row solo">
            <div className="kw-field">
              <label>Event title</label>
              <input value={form.title} onChange={(e) => upd("title", e.target.value)}
                     placeholder="e.g. Cloudglow Founders Breakfast" />
              {errors.title && <span className="help error">{errors.title}</span>}
            </div>
          </div>
          <div className="kw-form-row">
            <div className="kw-field">
              <label>Host (company / VC / brand)</label>
              <input value={form.host} onChange={(e) => upd("host", e.target.value)}
                     placeholder="e.g. Olive Young N Seongsu" />
              {errors.host && <span className="help error">{errors.host}</span>}
            </div>
            <div className="kw-field">
              <label>Ops contact email</label>
              <input type="email" value={form.contactEmail} onChange={(e) => upd("contactEmail", e.target.value)}
                     placeholder="host@example.com" />
              {errors.contactEmail && <span className="help error">{errors.contactEmail}</span>}
            </div>
          </div>
          <div className="kw-form-row">
            <div className="kw-field">
              <label>Track</label>
              <select value={form.track} onChange={(e) => upd("track", e.target.value)}>
                {Object.values(TRACKS).map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
            <div className="kw-field">
              <label>Format</label>
              <select value={form.format} onChange={(e) => upd("format", e.target.value)}>
                {FORMATS.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>
          <div className="kw-form-row solo">
            <div className="kw-field">
              <label>Public blurb</label>
              <textarea value={form.blurb} onChange={(e) => upd("blurb", e.target.value)}
                        placeholder="One short paragraph. What is it, who should come, why now?" />
              <span className={`help ${errors.blurb ? "error" : ""}`}>{errors.blurb || `${form.blurb.length}/280 characters`}</span>
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="kw-form-section">
          <h3>When &amp; where</h3>
          <div className="kw-form-row triple">
            <div className="kw-field">
              <label>Day</label>
              <select value={form.day} onChange={(e) => upd("day", e.target.value)}>
                {DAYS.map(d => <option key={d.id} value={d.id}>{d.date} · {d.weekday}</option>)}
              </select>
            </div>
            <div className="kw-field">
              <label>Start</label>
              <input type="time" value={form.start} onChange={(e) => upd("start", e.target.value)} />
            </div>
            <div className="kw-field">
              <label>End</label>
              <input type="time" value={form.end} onChange={(e) => upd("end", e.target.value)} />
              {errors.end && <span className="help error">{errors.end}</span>}
            </div>
          </div>
          <div className="kw-form-row">
            <div className="kw-field">
              <label>Neighborhood</label>
              <select value={form.neigh} onChange={(e) => upd("neigh", e.target.value)}>
                {Object.values(NEIGHBORHOODS).map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
              </select>
            </div>
            <div className="kw-field">
              <label>Venue address / note</label>
              <input value={form.location} onChange={(e) => upd("location", e.target.value)}
                     placeholder="e.g. 4F Salon, Olive Young N Seongsu" />
              {errors.location && <span className="help error">{errors.location}</span>}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="kw-form-section">
          <h3>Audience &amp; capacity</h3>
          <div className="kw-form-row">
            <div className="kw-field">
              <label>Capacity</label>
              <input type="number" min="60" value={form.capacity} onChange={(e) => upd("capacity", +e.target.value)} />
              <span className={`help ${errors.capacity ? "error" : ""}`}>{errors.capacity || "Minimum 60 for official directory listing."}</span>
            </div>
            <div className="kw-field">
              <label>Access type</label>
              <div className="kw-segment">
                {Object.values(ACCESS).map(a => (
                  <button key={a.id} type="button"
                          className={form.access === a.id ? "active" : ""}
                          onClick={() => upd("access", a.id)}>{a.label}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="kw-form-row solo">
            <div className="kw-field">
              <label>Target audience</label>
              <textarea value={form.audience} onChange={(e) => upd("audience", e.target.value)}
                        placeholder="Who is the right room for this event?" />
              {errors.audience && <span className="help error">{errors.audience}</span>}
            </div>
          </div>
          <div className="kw-review-preview">
            <h4>Review preview</h4>
            <p><strong>{form.title || "Untitled event"}</strong> by {form.host || "Host TBD"}</p>
            <p>{DAYS.find(d => d.id === form.day)?.date} · {form.start}–{form.end} · {NEIGHBORHOODS[form.neigh]?.label}</p>
          </div>
        </div>
      )}

      <div className="kw-form-foot">
        <p className="note">This frontend prototype persists submissions in your browser localStorage so UKF can test the operating workflow before adding auth and a database.</p>
        <div style={{display:"flex", gap:12, flexWrap:"wrap"}}>
          {step > 0 && <button className="kw-btn kw-btn-ghost" onClick={() => setStep(step - 1)}>← Back</button>}
          {step < 2 ? (
            <button className="kw-btn kw-btn-primary" onClick={() => setStep(step + 1)}>Continue →</button>
          ) : (
            <button className="kw-btn kw-btn-accent" onClick={submit}>Submit for review</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------- ADMIN MODERATION ----------------
const queueTabs = [
  { k: 'submitted', label: 'Submitted' },
  { k: 'needs_changes', label: 'Needs changes' },
  { k: 'approved', label: 'Approved' },
  { k: 'published', label: 'Published' },
  { k: 'rejected', label: 'Rejected' },
  { k: 'all', label: 'All' },
];

export function AdminPage({ workflow }) {
  const [tab, setTab] = useState("submitted");
  const items = workflow.submissions;

  const counts = queueTabs.reduce((acc, t) => {
    acc[t.k] = t.k === 'all' ? items.length : items.filter(i => i.status === t.k).length;
    return acc;
  }, {});

  const filtered = tab === "all" ? items : items.filter(i => i.status === tab);

  const tabStyle = (k) => ({
    padding: "8px 16px",
    borderRadius: 4,
    font: "600 13px/1 var(--font-en)",
    cursor: "pointer",
    background: tab === k ? "var(--ukf-ink)" : "transparent",
    color: tab === k ? "#fff" : "var(--ukf-ink)",
    border: "1px solid " + (tab === k ? "var(--ukf-ink)" : "var(--ukf-hairline)"),
  });

  return (
    <div className="kw-admin">
      <aside className="kw-admin-rail">
        <div className="badge"><span style={{width:6, height:6, borderRadius:"50%", background:"#fff"}}></span>UKF Admin</div>
        <h2>Programming<br />Console.</h2>

        <div className="nav-item active">
          <span>Submissions</span>
          <span className="count">{items.length}</span>
        </div>
        <div className="nav-item"><span>Published Events</span><span className="count">{workflow.publishedEvents.length}</span></div>
        <div className="nav-item"><span>Hosts</span><span className="count">86</span></div>
        <div className="nav-item"><span>Attendees</span><span className="count">2,418</span></div>
        <div className="nav-item"><span>Sponsors</span><span className="count">12</span></div>

        <div className="kw-admin-stats">
          <h4>This week</h4>
          <div className="row"><span>New submissions</span><span className="v">{counts.submitted}</span></div>
          <div className="row"><span>Needs changes</span><span className="v">{counts.needs_changes}</span></div>
          <div className="row"><span>Published</span><span className="v">{counts.published}</span></div>
          <div className="row"><span>Prototype store</span><span className="v">local</span></div>
        </div>
      </aside>

      <main className="kw-admin-main">
        <div className="kw-admin-head">
          <div>
            <div className="kw-eyebrow"><span className="dot"></span>SUBMISSION QUEUE</div>
            <h1>Review &amp; publish.</h1>
            <p className="sub">Host submissions are persisted in browser localStorage for this ops workflow prototype.</p>
          </div>
          <div className="kw-admin-tabs">
            {queueTabs.map(t => (
              <button key={t.k} onClick={() => setTab(t.k)} style={tabStyle(t.k)}>
                {t.label} <span style={{opacity:0.6, marginLeft:4}}>{counts[t.k]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="kw-admin-prototype-note">
          <strong>Prototype limitation:</strong> this queue uses localStorage, not shared auth or a server database. It is ready for workflow QA, not multi-user operations.
          <button className="kw-btn kw-btn-tertiary kw-btn-sm" onClick={workflow.resetDemoData}>Reset demo queue</button>
        </div>

        {filtered.map(item => (
          <SubmissionCard key={item.id} item={item} workflow={workflow} />
        ))}

        {filtered.length === 0 && (
          <div style={{textAlign:"center", padding:"96px 32px", color:"var(--fg-2)"}}>
            <p>Nothing in this queue.</p>
          </div>
        )}
      </main>
    </div>
  );
}

function SubmissionCard({ item, workflow }) {
  const statusLabel = SUBMISSION_STATUSES[item.status] || item.status;
  return (
    <div className={`kw-pending-card ${item.flag ? "flagged" : ""} ${item.status}`}>
      <div>
        <div className="meta-row">
          <KwTrackTag track={item.track} />
          <span className="kw-pill">{item.format}</span>
          <span className="kw-pill">{ACCESS[item.access].label}</span>
          <span className={`kw-pill status-${item.status}`}>{statusLabel}</span>
          <span style={{marginLeft:"auto", font:"500 12px/1 var(--font-en)", color:"var(--fg-2)"}}>
            Submitted {item.submittedAt}
          </span>
        </div>
        <h3>{item.title}</h3>
        <p className="host">{item.host}</p>
        {item.contactEmail && <p className="host">Ops contact: {item.contactEmail}</p>}
        {item.flag && <div className="flag-msg">⚠ Auto-flag: {item.flag}</div>}
        <p className="blurb">{item.blurb}</p>
        <div className="grid">
          <div><div className="lbl">Day · Time</div>
            {DAYS.find(d => d.id === item.day)?.date} · {item.start}–{item.end}</div>
          <div><div className="lbl">Neighborhood</div>{NEIGHBORHOODS[item.neigh]?.label}</div>
          <div><div className="lbl">Capacity</div>{item.capacity}</div>
        </div>
        {item.audience && <p className="kw-admin-audience"><strong>Audience:</strong> {item.audience}</p>}
        {item.location && <p className="kw-admin-audience"><strong>Venue:</strong> {item.location}</p>}
        <details className="kw-audit-log">
          <summary>Audit history ({item.history?.length || 0})</summary>
          {(item.history || []).map((h, idx) => (
            <div className="audit-row" key={`${h.at}-${idx}`}>
              <span>{new Date(h.at).toLocaleString()}</span>
              <strong>{h.action}</strong>
              <em>{h.note}</em>
            </div>
          ))}
        </details>
      </div>
      <div className="actions">
        {item.status === "submitted" && (
          <>
            <button className="kw-btn kw-btn-accent kw-btn-sm" onClick={() => workflow.updateStatus(item.id, "approved", "Approved by UKF ops")}>✓ Approve</button>
            <button className="kw-btn kw-btn-ghost kw-btn-sm" onClick={() => workflow.updateStatus(item.id, "needs_changes", "Needs host follow-up")}>Request changes</button>
            <button className="kw-btn kw-btn-tertiary kw-btn-sm" onClick={() => workflow.updateStatus(item.id, "rejected", "Rejected by UKF ops")} style={{color:"var(--accent-deep)"}}>Reject</button>
          </>
        )}
        {item.status === "needs_changes" && (
          <>
            <button className="kw-btn kw-btn-accent kw-btn-sm" onClick={() => workflow.updateStatus(item.id, "approved", "Changes accepted")}>Approve</button>
            <button className="kw-btn kw-btn-ghost kw-btn-sm" onClick={() => workflow.updateStatus(item.id, "submitted", "Host resubmitted")}>Mark resubmitted</button>
          </>
        )}
        {item.status === "approved" && (
          <>
            <button className="kw-btn kw-btn-accent kw-btn-sm" onClick={() => workflow.publishSubmission(item.id)}>Publish to directory →</button>
            <button className="kw-btn kw-btn-tertiary kw-btn-sm" onClick={() => workflow.updateStatus(item.id, "submitted", "Approval reopened")}>Reopen</button>
          </>
        )}
        {item.status === "published" && (
          <>
            <button className="kw-btn kw-btn-ghost kw-btn-sm" disabled>Live in Discover</button>
            <button className="kw-btn kw-btn-tertiary kw-btn-sm" onClick={() => workflow.updateStatus(item.id, "approved", "Unpublished from directory")}>Unpublish</button>
          </>
        )}
        {item.status === "rejected" && (
          <button className="kw-btn kw-btn-ghost kw-btn-sm" onClick={() => workflow.updateStatus(item.id, "submitted", "Reopened after rejection")}>Reopen</button>
        )}
      </div>
    </div>
  );
}
