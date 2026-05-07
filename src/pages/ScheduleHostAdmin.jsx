import React, { useState } from 'react';
import {
  EVENTS as STATIC_EVENTS, DAYS, NEIGHBORHOODS, TRACKS, ACCESS, FORMATS
} from '../data.js';
import { KwTrackTag } from '../shared.jsx';
import { SUBMISSION_STATUSES } from '../submissionStore.js';
import { t, accessLabel, statusLabel } from '../i18n.js';

// ---------------- SCHEDULE BUILDER ----------------
export function SchedulePage({ events = STATIC_EVENTS, scheduleIds, toggleSchedule, onNav, lang = 'kr' }) {
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
            <div className="kw-eyebrow"><span className="dot"></span>{t('schedule.eyebrow', lang)}</div>
            <h1>{t('schedule.heading', lang)}</h1>
          </div>
          <div className="right">
            <button className="kw-btn kw-btn-ghost">{t('schedule.export', lang)}</button>
            <button className="kw-btn kw-btn-primary" onClick={() => onNav("discover")}>{t('schedule.addEvents', lang)}</button>
          </div>
        </div>

        {myEvents.length === 0 ? (
          <div className="kw-schedule-empty">
            <h3>{t('schedule.emptyTitle', lang)}</h3>
            <p>{t('schedule.emptyBody', lang)}</p>
            <button className="kw-btn kw-btn-accent" onClick={() => onNav("discover")}>{t('schedule.browseEvents', lang)}</button>
          </div>
        ) : (
          <>
            <div className="kw-schedule-summary">
              <div className="stat"><div className="num">{stats.events}</div><div className="lbl">{t('schedule.statEvents', lang)}</div></div>
              <div className="stat"><div className="num">{stats.tracks}</div><div className="lbl">{t('schedule.statTracks', lang)}</div></div>
              <div className="stat"><div className="num">{stats.neighs}</div><div className="lbl">{t('schedule.statNeighs', lang)}</div></div>
              <div className="stat"><div className="num">{stats.days}</div><div className="lbl">{t('schedule.statDays', lang)}</div></div>
            </div>

            <div className="kw-schedule-grid">
              <div className="col-header" style={{background:"var(--ukf-ink)", color:"#fff"}}>
                <div className="dow" style={{color:"rgba(255,255,255,0.6)"}}>{t('schedule.time', lang)}</div>
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
                              <div className="neigh">{lang === 'kr' ? NEIGHBORHOODS[ev.neigh].labelKr : NEIGHBORHOODS[ev.neigh].label}</div>
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
              <h2 className="kw-h3" style={{marginBottom:24}}>{t('schedule.listView', lang)}</h2>
              {byDay.filter(d => d.events.length).map(d => (
                <div key={d.id} style={{marginBottom: 32}}>
                  <div className="kw-list-day-header">
                    <span className="day">{d.date}</span>
                    <span className="dow">{d.weekday}</span>
                  </div>
                  {d.events.map(e => (
                    <ScheduleEventRow key={e.id} ev={e} lang={lang} onRemove={() => toggleSchedule(e.id)} />
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

function ScheduleEventRow({ ev, lang, onRemove }) {
  return (
    <div className="kw-event-row in-schedule" onClick={onRemove}>
      <div className="time">
        {ev.start}
        <span className="end">— {ev.end}</span>
      </div>
      <div className="body">
        <h4>{ev.title}</h4>
        <div className="meta">
          {ev.host} · {lang === 'kr' ? NEIGHBORHOODS[ev.neigh].labelKr : NEIGHBORHOODS[ev.neigh].label} · {ev.format}
        </div>
        <div className="tags">
          <KwTrackTag track={ev.track} />
          <span className="kw-pill red">{t('schedule.inSchedule', lang)}</span>
        </div>
      </div>
      <div className="rsvp-cell">
        <button className="kw-btn kw-btn-ghost kw-btn-sm">{t('schedule.remove', lang)}</button>
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

function validateHostForm(form, lang) {
  const errors = {};
  if (!form.title.trim()) errors.title = t('host.err.titleRequired', lang);
  if (!form.host.trim()) errors.host = t('host.err.hostRequired', lang);
  if (!form.contactEmail.trim()) errors.contactEmail = t('host.err.emailRequired', lang);
  if (form.contactEmail && !/^\S+@\S+\.\S+$/.test(form.contactEmail)) errors.contactEmail = t('host.err.emailInvalid', lang);
  if (!form.blurb.trim()) errors.blurb = t('host.err.blurbRequired', lang);
  if (form.blurb.length > 280) errors.blurb = t('host.err.blurbTooLong', lang);
  if (!form.location.trim()) errors.location = t('host.err.locationRequired', lang);
  if (!form.audience.trim()) errors.audience = t('host.err.audienceRequired', lang);
  if (Number(form.capacity) < 60) errors.capacity = t('host.err.capacityMin', lang);
  if (form.end <= form.start) errors.end = t('host.err.endTime', lang);
  return errors;
}

export function HostPage({ createSubmission, onNav, lang = 'kr' }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL_HOST_FORM);
  const [submitted, setSubmitted] = useState(null);
  const [errors, setErrors] = useState({});

  const upd = (k, v) => {
    setForm({ ...form, [k]: v });
    if (errors[k]) setErrors({ ...errors, [k]: undefined });
  };

  const submit = () => {
    const nextErrors = validateHostForm(form, lang);
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
          <h2>{t('host.successTitle', lang)}</h2>
          <p>{t('host.successBody', lang)} <strong>{submitted.id}</strong>. </p>
          <p style={{marginTop:8, color:'var(--fg-2)'}}>
            {lang === 'kr'
              ? '운영팀이 검토 후 승인 또는 수정 요청을 보냅니다.'
              : 'Ops can request changes, approve, reject, or publish it from Admin.'}
          </p>
          <div className="kw-submission-receipt">
            <div><span>{t('host.successStatus', lang)}</span><strong>{statusLabel(submitted.status, lang)}</strong></div>
            <div><span>{t('host.successSubmitted', lang)}</span><strong>{submitted.submittedAt}</strong></div>
            <div><span>{t('host.successHost', lang)}</span><strong>{submitted.host}</strong></div>
          </div>
          <div style={{marginTop:32, display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap"}}>
            <button className="kw-btn kw-btn-ghost" onClick={() => { setSubmitted(null); setForm(INITIAL_HOST_FORM); setStep(0); }}>{t('host.submitAnother', lang)}</button>
            <button className="kw-btn kw-btn-primary" onClick={() => onNav("admin")}>{t('host.reviewAdmin', lang)}</button>
            <button className="kw-btn kw-btn-tertiary" onClick={() => onNav("discover")}>{t('host.backDiscover', lang)}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="kw-form-page">
      <div className="kw-form-head">
        <div className="kw-eyebrow"><span className="dot"></span>{t('host.eyebrow', lang)} {step + 1} {t('host.of', lang)}</div>
        <h1>{t('host.heading', lang)}</h1>
        <p className="sub">{t('host.sub', lang)}</p>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="kw-form-alert" role="alert">
          <strong>{t('host.alertBefore', lang)}</strong>
          <ul>{Object.values(errors).filter(Boolean).map(err => <li key={err}>{err}</li>)}</ul>
        </div>
      )}

      {step === 0 && (
        <div className="kw-form-section">
          <h3>{t('host.step1Title', lang)}</h3>
          <div className="kw-form-row solo">
            <div className="kw-field">
              <label>{t('host.eventTitle', lang)}</label>
              <input value={form.title} onChange={(e) => upd("title", e.target.value)}
                     placeholder={t('host.eventTitlePh', lang)} />
              {errors.title && <span className="help error">{errors.title}</span>}
            </div>
          </div>
          <div className="kw-form-row">
            <div className="kw-field">
              <label>{t('host.hostLabel', lang)}</label>
              <input value={form.host} onChange={(e) => upd("host", e.target.value)}
                     placeholder={t('host.hostPh', lang)} />
              {errors.host && <span className="help error">{errors.host}</span>}
            </div>
            <div className="kw-field">
              <label>{t('host.opsEmail', lang)}</label>
              <input type="email" value={form.contactEmail} onChange={(e) => upd("contactEmail", e.target.value)}
                     placeholder="host@example.com" />
              {errors.contactEmail && <span className="help error">{errors.contactEmail}</span>}
            </div>
          </div>
          <div className="kw-form-row">
            <div className="kw-field">
              <label>{t('host.track', lang)}</label>
              <select value={form.track} onChange={(e) => upd("track", e.target.value)}>
                {Object.values(TRACKS).map(tr => <option key={tr.id} value={tr.id}>{lang === 'kr' ? tr.labelKr : tr.label}</option>)}
              </select>
            </div>
            <div className="kw-field">
              <label>{t('host.format', lang)}</label>
              <select value={form.format} onChange={(e) => upd("format", e.target.value)}>
                {FORMATS.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>
          <div className="kw-form-row solo">
            <div className="kw-field">
              <label>{t('host.blurb', lang)}</label>
              <textarea value={form.blurb} onChange={(e) => upd("blurb", e.target.value)}
                        placeholder={t('host.blurbPh', lang)} />
              <span className={`help ${errors.blurb ? "error" : ""}`}>{errors.blurb || `${form.blurb.length}/280 ${t('host.characters', lang)}`}</span>
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="kw-form-section">
          <h3>{t('host.step2Title', lang)}</h3>
          <div className="kw-form-row triple">
            <div className="kw-field">
              <label>{t('host.day', lang)}</label>
              <select value={form.day} onChange={(e) => upd("day", e.target.value)}>
                {DAYS.map(d => <option key={d.id} value={d.id}>{d.date} · {d.weekday}</option>)}
              </select>
            </div>
            <div className="kw-field">
              <label>{t('host.start', lang)}</label>
              <input type="time" value={form.start} onChange={(e) => upd("start", e.target.value)} />
            </div>
            <div className="kw-field">
              <label>{t('host.end', lang)}</label>
              <input type="time" value={form.end} onChange={(e) => upd("end", e.target.value)} />
              {errors.end && <span className="help error">{errors.end}</span>}
            </div>
          </div>
          <div className="kw-form-row">
            <div className="kw-field">
              <label>{t('host.neighborhood', lang)}</label>
              <select value={form.neigh} onChange={(e) => upd("neigh", e.target.value)}>
                {Object.values(NEIGHBORHOODS).map(n => <option key={n.id} value={n.id}>{lang === 'kr' ? n.labelKr : n.label}</option>)}
              </select>
            </div>
            <div className="kw-field">
              <label>{t('host.venue', lang)}</label>
              <input value={form.location} onChange={(e) => upd("location", e.target.value)}
                     placeholder={t('host.venuePh', lang)} />
              {errors.location && <span className="help error">{errors.location}</span>}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="kw-form-section">
          <h3>{t('host.step3Title', lang)}</h3>
          <div className="kw-form-row">
            <div className="kw-field">
              <label>{t('host.capacity', lang)}</label>
              <input type="number" min="60" value={form.capacity} onChange={(e) => upd("capacity", +e.target.value)} />
              <span className={`help ${errors.capacity ? "error" : ""}`}>{errors.capacity || t('host.capacityMin', lang)}</span>
            </div>
            <div className="kw-field">
              <label>{t('host.accessType', lang)}</label>
              <div className="kw-segment">
                {Object.values(ACCESS).map(a => (
                  <button key={a.id} type="button"
                          className={form.access === a.id ? "active" : ""}
                          onClick={() => upd("access", a.id)}>{accessLabel(a.id, lang)}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="kw-form-row solo">
            <div className="kw-field">
              <label>{t('host.targetAudience', lang)}</label>
              <textarea value={form.audience} onChange={(e) => upd("audience", e.target.value)}
                        placeholder={t('host.audiencePh', lang)} />
              {errors.audience && <span className="help error">{errors.audience}</span>}
            </div>
          </div>
          <div className="kw-review-preview">
            <h4>{t('host.reviewPreview', lang)}</h4>
            <p><strong>{form.title || t('host.untitledEvent', lang)}</strong> {lang === 'kr' ? 'by' : 'by'} {form.host || t('host.hostTbd', lang)}</p>
            <p>{DAYS.find(d => d.id === form.day)?.date} · {form.start}–{form.end} · {lang === 'kr' ? NEIGHBORHOODS[form.neigh]?.labelKr : NEIGHBORHOODS[form.neigh]?.label}</p>
          </div>
        </div>
      )}

      <div className="kw-form-foot">
        <p className="note">{t('host.supabaseNote', lang)}</p>
        <div style={{display:"flex", gap:12, flexWrap:"wrap"}}>
          {step > 0 && <button className="kw-btn kw-btn-ghost" onClick={() => setStep(step - 1)}>{t('host.back', lang)}</button>}
          {step < 2 ? (
            <button className="kw-btn kw-btn-primary" onClick={() => setStep(step + 1)}>{t('host.continue', lang)}</button>
          ) : (
            <button className="kw-btn kw-btn-accent" onClick={submit}>{t('host.submitReview', lang)}</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------- ADMIN MODERATION ----------------
const queueTabs = (lang) => [
  { k: 'submitted',     label: t('admin.tabSubmitted', lang) },
  { k: 'needs_changes', label: t('admin.tabNeedsChanges', lang) },
  { k: 'approved',      label: t('admin.tabApproved', lang) },
  { k: 'published',     label: t('admin.tabPublished', lang) },
  { k: 'rejected',      label: t('admin.tabRejected', lang) },
  { k: 'all',           label: t('admin.tabAll', lang) },
];

export function AdminPage({ workflow, lang = 'kr' }) {
  const [tab, setTab] = useState("submitted");
  const items = workflow.submissions;
  const tabs = queueTabs(lang);

  const counts = tabs.reduce((acc, tb) => {
    acc[tb.k] = tb.k === 'all' ? items.length : items.filter(i => i.status === tb.k).length;
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
        <div className="badge"><span style={{width:6, height:6, borderRadius:"50%", background:"#fff"}}></span>{t('admin.badge', lang)}</div>
        <h2>{t('admin.heading', lang).split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}</h2>

        <div className="nav-item active">
          <span>{t('admin.submissions', lang)}</span>
          <span className="count">{items.length}</span>
        </div>
        <div className="nav-item"><span>{t('admin.published', lang)}</span><span className="count">{workflow.publishedEvents.length}</span></div>
        <div className="nav-item"><span>{t('admin.hosts', lang)}</span><span className="count">86</span></div>
        <div className="nav-item"><span>{t('admin.attendees', lang)}</span><span className="count">2,418</span></div>
        <div className="nav-item"><span>{t('admin.sponsors', lang)}</span><span className="count">12</span></div>

        <div className="kw-admin-stats">
          <h4>{t('admin.thisWeek', lang)}</h4>
          <div className="row"><span>{t('admin.newSubs', lang)}</span><span className="v">{counts.submitted}</span></div>
          <div className="row"><span>{t('admin.needsChanges', lang)}</span><span className="v">{counts.needs_changes}</span></div>
          <div className="row"><span>{t('admin.publishedLabel', lang)}</span><span className="v">{counts.published}</span></div>
          <div className="row"><span>{t('admin.prototypeStore', lang)}</span><span className="v">{workflow.backendMode ? 'Supabase' : 'local'}</span></div>
        </div>
      </aside>

      <main className="kw-admin-main">
        <div className="kw-admin-head">
          <div>
            <div className="kw-eyebrow"><span className="dot"></span>{t('admin.queueEyebrow', lang)}</div>
            <h1>{t('admin.reviewHeading', lang)}</h1>
            <p className="sub">{t('admin.reviewSub', lang)}</p>
          </div>
          <div className="kw-admin-tabs">
            {tabs.map(tb => (
              <button key={tb.k} onClick={() => setTab(tb.k)} style={tabStyle(tb.k)}>
                {tb.label} <span style={{opacity:0.6, marginLeft:4}}>{counts[tb.k]}</span>
              </button>
            ))}
          </div>
        </div>

        {workflow.backendMode && (
          <div className="kw-admin-security-warning" role="alert">
            <strong>{t('admin.securityWarning', lang)}</strong> {t('admin.securityBody', lang)}
          </div>
        )}
        <div className="kw-admin-prototype-note">
          <strong>{t('admin.prototypeNote', lang)}</strong> {workflow.backendMode
            ? t('admin.connectedNote', lang)
            : t('admin.localNote', lang)}
          {!workflow.backendMode && (
            <button className="kw-btn kw-btn-tertiary kw-btn-sm" onClick={workflow.resetDemoData}>{t('admin.resetDemo', lang)}</button>
          )}
        </div>

        {filtered.map(item => (
          <SubmissionCard key={item.id} item={item} workflow={workflow} lang={lang} />
        ))}

        {filtered.length === 0 && (
          <div style={{textAlign:"center", padding:"96px 32px", color:"var(--fg-2)"}}>
            <p>{t('admin.emptyQueue', lang)}</p>
          </div>
        )}
      </main>
    </div>
  );
}

function SubmissionCard({ item, workflow, lang }) {
  const sLabel = statusLabel(item.status, lang);
  return (
    <div className={`kw-pending-card ${item.flag ? "flagged" : ""} ${item.status}`}>
      <div>
        <div className="meta-row">
          <KwTrackTag track={item.track} />
          <span className="kw-pill">{item.format}</span>
          <span className="kw-pill">{accessLabel(item.access, lang)}</span>
          <span className={`kw-pill status-${item.status}`}>{sLabel}</span>
          <span style={{marginLeft:"auto", font:"500 12px/1 var(--font-en)", color:"var(--fg-2)"}}>
            {t('admin.submittedAt', lang)} {item.submittedAt}
          </span>
        </div>
        <h3>{item.title}</h3>
        <p className="host">{item.host}</p>
        {item.contactEmail && <p className="host">{t('admin.opsContact', lang)} {item.contactEmail}</p>}
        {item.flag && <div className="flag-msg">⚠ Auto-flag: {item.flag}</div>}
        <p className="blurb">{item.blurb}</p>
        <div className="grid">
          <div><div className="lbl">{t('admin.dayTime', lang)}</div>
            {DAYS.find(d => d.id === item.day)?.date} · {item.start}–{item.end}</div>
          <div><div className="lbl">{t('admin.neighborhood', lang)}</div>{lang === 'kr' ? NEIGHBORHOODS[item.neigh]?.labelKr : NEIGHBORHOODS[item.neigh]?.label}</div>
          <div><div className="lbl">{t('admin.capacity', lang)}</div>{item.capacity}</div>
        </div>
        {item.audience && <p className="kw-admin-audience"><strong>{t('admin.audience', lang)}</strong> {item.audience}</p>}
        {item.location && <p className="kw-admin-audience"><strong>{t('admin.venue', lang)}</strong> {item.location}</p>}
        <details className="kw-audit-log">
          <summary>{t('admin.auditHistory', lang)} ({item.history?.length || 0})</summary>
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
            <button className="kw-btn kw-btn-accent kw-btn-sm" onClick={() => workflow.updateStatus(item.id, "approved", lang === 'kr' ? 'UKF 운영팀 승인' : "Approved by UKF ops")}>{t('admin.approve', lang)}</button>
            <button className="kw-btn kw-btn-ghost kw-btn-sm" onClick={() => workflow.updateStatus(item.id, "needs_changes", lang === 'kr' ? '호스트 수정 요청' : "Needs host follow-up")}>{t('admin.requestChanges', lang)}</button>
            <button className="kw-btn kw-btn-tertiary kw-btn-sm" onClick={() => workflow.updateStatus(item.id, "rejected", lang === 'kr' ? 'UKF 운영팀 반려' : "Rejected by UKF ops")} style={{color:"var(--accent-deep)"}}>{t('admin.reject', lang)}</button>
          </>
        )}
        {item.status === "needs_changes" && (
          <>
            <button className="kw-btn kw-btn-accent kw-btn-sm" onClick={() => workflow.updateStatus(item.id, "approved", lang === 'kr' ? '수정사항 승인' : "Changes accepted")}>{t('admin.approve', lang)}</button>
            <button className="kw-btn kw-btn-ghost kw-btn-sm" onClick={() => workflow.updateStatus(item.id, "submitted", lang === 'kr' ? '호스트 재제출 처리' : "Host resubmitted")}>{t('admin.markResubmitted', lang)}</button>
          </>
        )}
        {item.status === "approved" && (
          <>
            <button className="kw-btn kw-btn-accent kw-btn-sm" onClick={() => workflow.publishSubmission(item.id)}>{t('admin.publishDir', lang)}</button>
            <button className="kw-btn kw-btn-tertiary kw-btn-sm" onClick={() => workflow.updateStatus(item.id, "submitted", lang === 'kr' ? '승인 재개' : "Approval reopened")}>{t('admin.reopen', lang)}</button>
          </>
        )}
        {item.status === "published" && (
          <>
            <button className="kw-btn kw-btn-ghost kw-btn-sm" disabled>{t('admin.liveDiscover', lang)}</button>
            <button className="kw-btn kw-btn-tertiary kw-btn-sm" onClick={() => workflow.updateStatus(item.id, "approved", lang === 'kr' ? '디렉토리에서 게시 취소' : "Unpublished from directory")}>{t('admin.unpublish', lang)}</button>
          </>
        )}
        {item.status === "rejected" && (
          <button className="kw-btn kw-btn-ghost kw-btn-sm" onClick={() => workflow.updateStatus(item.id, "submitted", lang === 'kr' ? '반려 후 재개' : "Reopened after rejection")}>{t('admin.reopen', lang)}</button>
        )}
      </div>
    </div>
  );
}
