import React, { useState } from 'react';
import {
  EVENTS, DAYS, NEIGHBORHOODS, TRACKS, ACCESS, FORMATS, PENDING_SUBMISSIONS
} from '../data.js';
import { KwTrackTag } from '../shared.jsx';

// ---------------- SCHEDULE BUILDER ----------------
export function SchedulePage({ scheduleIds, toggleSchedule, onNav }) {
  const myEvents = EVENTS.filter(e => scheduleIds.includes(e.id));
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
export function HostPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: "",
    host: "",
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
  });
  const [submitted, setSubmitted] = useState(false);

  const upd = (k, v) => setForm({ ...form, [k]: v });

  if (submitted) {
    return (
      <div className="kw-container-narrow" style={{padding:"96px 0"}}>
        <div className="kw-form-success">
          <div className="check">✓</div>
          <h2>Submission received.</h2>
          <p>The UKF programming team reviews submissions within 3 business days. You'll get an email at the address on your UKF profile when a decision is made. Approved events appear in the Discover directory and are amplified through the Koom Week newsletter.</p>
          <div style={{marginTop:32, display:"flex", gap:12, justifyContent:"center"}}>
            <button className="kw-btn kw-btn-ghost" onClick={() => { setSubmitted(false); setStep(0); }}>Submit another</button>
            <button className="kw-btn kw-btn-primary">Back to Overview</button>
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
        <p className="sub">UKF curates every event in the official directory. Submissions are reviewed within 3 business days against our quality and audience-fit standards.</p>
      </div>

      {step === 0 && (
        <div className="kw-form-section">
          <h3>The basics</h3>
          <div className="kw-form-row solo">
            <div className="kw-field">
              <label>Event title</label>
              <input value={form.title} onChange={(e) => upd("title", e.target.value)}
                     placeholder="e.g. Cloudglow Founders Breakfast" />
              <span className="help">Title-case. Avoid jargon. Sentence-case sub-titles fine after a colon.</span>
            </div>
          </div>
          <div className="kw-form-row">
            <div className="kw-field">
              <label>Host (company / VC / brand)</label>
              <input value={form.host} onChange={(e) => upd("host", e.target.value)}
                     placeholder="e.g. Olive Young N Seongsu" />
            </div>
            <div className="kw-field">
              <label>Track</label>
              <select value={form.track} onChange={(e) => upd("track", e.target.value)}>
                {Object.values(TRACKS).map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
          </div>
          <div className="kw-form-row solo">
            <div className="kw-field">
              <label>Public blurb</label>
              <textarea value={form.blurb} onChange={(e) => upd("blurb", e.target.value)}
                        placeholder="One short paragraph. What is it, who should come, why now?" />
              <span className="help">Max 280 characters. This appears on the event card and in search results.</span>
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
              <label>Format</label>
              <select value={form.format} onChange={(e) => upd("format", e.target.value)}>
                {FORMATS.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>
          <div className="kw-form-row solo">
            <div className="kw-field">
              <label>Venue address (full)</label>
              <input placeholder="e.g. 4F Salon, Olive Young N Seongsu, 4 Achasan-ro 11-gil" />
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
              <input type="number" value={form.capacity} onChange={(e) => upd("capacity", +e.target.value)} />
              <span className="help">Minimum 60. We don't list events with under-capacity rooms.</span>
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
                        placeholder="Who is the right room for this event? UKF uses this to match attendee profiles to your event." />
            </div>
          </div>
          <div className="kw-form-row solo">
            <div className="kw-field">
              <label>Anti-hoarding acknowledgment</label>
              <div style={{display:"flex", gap:12, alignItems:"start", padding:"16px 18px", background:"var(--bg-sunken)", borderRadius:6}}>
                <input type="checkbox" defaultChecked style={{marginTop:4}} />
                <span style={{font:"400 14px/1.5 var(--font-en)"}}>
                  I understand that attendees with overlapping RSVPs cannot be added to my event roster — UKF enforces "sector intentionality" to protect host show-up rates.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="kw-form-foot">
        <p className="note">All submissions reviewed by the UKF programming team within 3 business days. Approval is subject to brand fit, audience match, and capacity standards.</p>
        <div style={{display:"flex", gap:12}}>
          {step > 0 && <button className="kw-btn kw-btn-ghost" onClick={() => setStep(step - 1)}>← Back</button>}
          {step < 2 ? (
            <button className="kw-btn kw-btn-primary" onClick={() => setStep(step + 1)}>Continue →</button>
          ) : (
            <button className="kw-btn kw-btn-accent" onClick={() => setSubmitted(true)}>Submit for review</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------- ADMIN MODERATION ----------------
export function AdminPage() {
  const [tab, setTab] = useState("pending");
  const [items, setItems] = useState(PENDING_SUBMISSIONS);

  const counts = {
    pending: items.filter(i => i.status === "pending").length,
    approved: items.filter(i => i.status === "approved").length,
    rejected: items.filter(i => i.status === "rejected").length,
  };

  const filtered = tab === "all" ? items : items.filter(i => i.status === tab);

  const setStatus = (id, status) => {
    setItems(items.map(i => i.id === id ? { ...i, status } : i));
  };

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
        <div className="nav-item"><span>Approved Events</span><span className="count">{EVENTS.length}</span></div>
        <div className="nav-item"><span>Hosts</span><span className="count">86</span></div>
        <div className="nav-item"><span>Attendees</span><span className="count">2,418</span></div>
        <div className="nav-item"><span>Sponsors</span><span className="count">12</span></div>

        <div className="kw-admin-stats">
          <h4>This week</h4>
          <div className="row"><span>New submissions</span><span className="v">{counts.pending}</span></div>
          <div className="row"><span>Approval rate</span><span className="v">82%</span></div>
          <div className="row"><span>Avg review time</span><span className="v">36h</span></div>
          <div className="row"><span>Events at capacity</span><span className="v">7</span></div>
        </div>
      </aside>

      <main className="kw-admin-main">
        <div className="kw-admin-head">
          <div>
            <div className="kw-eyebrow"><span className="dot"></span>SUBMISSION QUEUE</div>
            <h1>Review &amp; approve.</h1>
            <p className="sub">Hosts submit through the public form; you decide what goes in the directory.</p>
          </div>
          <div style={{display:"flex", gap:8}}>
            {[
              { k: "pending",  label: "Pending",  c: counts.pending },
              { k: "approved", label: "Approved", c: counts.approved },
              { k: "rejected", label: "Rejected", c: counts.rejected },
              { k: "all",      label: "All",      c: items.length },
            ].map(t => (
              <button key={t.k} onClick={() => setTab(t.k)} style={tabStyle(t.k)}>
                {t.label} <span style={{opacity:0.6, marginLeft:4}}>{t.c}</span>
              </button>
            ))}
          </div>
        </div>

        {filtered.map(item => (
          <div key={item.id}
               className={`kw-pending-card ${item.flag ? "flagged" : ""} ${item.status}`}>
            <div>
              <div className="meta-row">
                <KwTrackTag track={item.track} />
                <span className="kw-pill">{item.format}</span>
                <span className="kw-pill">{ACCESS[item.access].label}</span>
                {item.status === "pending"  && <span className="kw-pill" style={{background:"#FEF3CD", color:"#B97900"}}>● Pending review</span>}
                {item.status === "approved" && <span className="kw-pill" style={{background:"#E1F0E4", color:"#2F7D3B"}}>✓ Approved</span>}
                {item.status === "rejected" && <span className="kw-pill" style={{background:"#FBE8EC", color:"#A60D26"}}>✕ Rejected</span>}
                <span style={{marginLeft:"auto", font:"500 12px/1 var(--font-en)", color:"var(--fg-2)"}}>
                  Submitted {item.submittedAt}
                </span>
              </div>
              <h3>{item.title}</h3>
              <p className="host">{item.host}</p>
              {item.flag && <div className="flag-msg">⚠ Auto-flag: {item.flag}</div>}
              <p className="blurb">{item.blurb}</p>
              <div className="grid">
                <div><div className="lbl">Day · Time</div>
                  {DAYS.find(d => d.id === item.day).date} · {item.start}–{item.end}</div>
                <div><div className="lbl">Neighborhood</div>{NEIGHBORHOODS[item.neigh].label}</div>
                <div><div className="lbl">Capacity</div>{item.capacity}</div>
              </div>
            </div>
            <div className="actions">
              {item.status === "pending" && (
                <>
                  <button className="kw-btn kw-btn-accent kw-btn-sm" onClick={() => setStatus(item.id, "approved")}>
                    ✓ Approve
                  </button>
                  <button className="kw-btn kw-btn-ghost kw-btn-sm">Request changes</button>
                  <button className="kw-btn kw-btn-tertiary kw-btn-sm" onClick={() => setStatus(item.id, "rejected")}
                          style={{color:"var(--accent-deep)"}}>Reject</button>
                </>
              )}
              {item.status === "approved" && (
                <>
                  <button className="kw-btn kw-btn-ghost kw-btn-sm">View on site →</button>
                  <button className="kw-btn kw-btn-tertiary kw-btn-sm" onClick={() => setStatus(item.id, "pending")}>Unapprove</button>
                </>
              )}
              {item.status === "rejected" && (
                <button className="kw-btn kw-btn-ghost kw-btn-sm" onClick={() => setStatus(item.id, "pending")}>Reopen</button>
              )}
            </div>
          </div>
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
