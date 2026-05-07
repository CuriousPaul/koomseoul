import { useState, useMemo } from 'react';
import {
  TRACKS, NEIGHBORHOODS, NEIGHBORHOOD_COORDS, ACCESS, DAYS, EVENTS as STATIC_EVENTS
} from '../data.js';
import { KwTrackTag } from '../shared.jsx';
import { t, accessLabel } from '../i18n.js';

export default function DiscoverPage({ lang, events = STATIC_EVENTS, scheduleIds, toggleSchedule, prefilters }) {
  const [selectedTracks, setSelectedTracks] = useState(prefilters?.track ? [prefilters.track] : []);
  const [selectedNeighs, setSelectedNeighs] = useState([]);
  const [selectedAccess, setSelectedAccess] = useState([]);
  const [selectedDay, setSelectedDay] = useState("all");
  const [activeEvent, setActiveEvent] = useState(null);
  const [hoveredNeigh, setHoveredNeigh] = useState(null);

  const toggleArr = (arr, setArr, v) =>
    setArr(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);

  const filtered = useMemo(() => {
    return events.filter(e => {
      if (selectedTracks.length && !selectedTracks.includes(e.track)) return false;
      if (selectedNeighs.length && !selectedNeighs.includes(e.neigh)) return false;
      if (selectedAccess.length && !selectedAccess.includes(e.access)) return false;
      if (selectedDay !== "all" && e.day !== selectedDay) return false;
      return true;
    });
  }, [events, selectedTracks, selectedNeighs, selectedAccess, selectedDay]);

  const trackCounts = Object.keys(TRACKS).map(t => ({ t, n: events.filter(e => e.track === t).length }));
  const neighCounts = Object.keys(NEIGHBORHOODS).map(n => ({ n, c: events.filter(e => e.neigh === n).length }));
  const neighEventCount = Object.keys(NEIGHBORHOODS).reduce((acc, n) => {
    acc[n] = filtered.filter(e => e.neigh === n).length;
    return acc;
  }, {});

  const grouped = DAYS.map(d => ({ ...d, events: filtered.filter(e => e.day === d.id).sort((a, b) => a.start.localeCompare(b.start)) }));

  const isConflict = (ev) => {
    return scheduleIds.some(sid => {
      if (sid === ev.id) return false;
      const s = events.find(e => e.id === sid);
      if (!s || s.day !== ev.day) return false;
      return !(ev.end <= s.start || ev.start >= s.end);
    });
  };

  return (
    <div className="kw-discovery">
      {/* FILTERS */}
      <aside className="kw-filters">
        <h3>{t('discover.day', lang)}</h3>
        <div className="group" style={{paddingTop:0}}>
          <div className={`filter-opt ${selectedDay === "all" ? "checked" : ""}`}
               onClick={() => setSelectedDay("all")}>
            <span className="label-wrap">
              <span className="checkbox" style={{borderRadius:"50%"}}></span>{t('discover.allDays', lang)}
            </span>
            <span className="count">{events.length}</span>
          </div>
          {DAYS.map(d => (
            <div key={d.id}
                 className={`filter-opt ${selectedDay === d.id ? "checked" : ""}`}
                 onClick={() => setSelectedDay(d.id)}>
              <span className="label-wrap">
                <span className="checkbox" style={{borderRadius:"50%"}}></span>{d.date} · {d.weekday}
              </span>
              <span className="count">{events.filter(e => e.day === d.id).length}</span>
            </div>
          ))}
        </div>

        <div className="group">
          <h3>{t('discover.track', lang)}</h3>
          {trackCounts.map(({t: trackId, n}) => (
            <div key={trackId}
                 className={`filter-opt ${selectedTracks.includes(trackId) ? "checked" : ""}`}
                 onClick={() => toggleArr(selectedTracks, setSelectedTracks, trackId)}>
              <span className="label-wrap">
                <span className="checkbox"></span>{lang === 'kr' ? TRACKS[trackId].labelKr : TRACKS[trackId].label}
              </span>
              <span className="count">{n}</span>
            </div>
          ))}
        </div>

        <div className="group">
          <h3>{t('discover.neighborhood', lang)}</h3>
          {neighCounts.map(({n, c}) => (
            <div key={n}
                 className={`filter-opt ${selectedNeighs.includes(n) ? "checked" : ""}`}
                 onClick={() => toggleArr(selectedNeighs, setSelectedNeighs, n)}>
              <span className="label-wrap">
                <span className="checkbox"></span>{lang === 'kr' ? NEIGHBORHOODS[n].labelKr : NEIGHBORHOODS[n].label}
              </span>
              <span className="count">{c}</span>
            </div>
          ))}
        </div>

        <div className="group">
          <h3>{t('discover.access', lang)}</h3>
          {Object.values(ACCESS).map(a => (
            <div key={a.id}
                 className={`filter-opt ${selectedAccess.includes(a.id) ? "checked" : ""}`}
                 onClick={() => toggleArr(selectedAccess, setSelectedAccess, a.id)}>
              <span className="label-wrap">
                <span className="checkbox"></span>{accessLabel(a.id, lang)}
              </span>
              <span className="count">{events.filter(e => e.access === a.id).length}</span>
            </div>
          ))}
        </div>

        <button className="clear" onClick={() => {
          setSelectedTracks([]); setSelectedNeighs([]); setSelectedAccess([]); setSelectedDay("all");
        }}>{t('discover.clearFilters', lang)}</button>
      </aside>

      {/* LIST */}
      <main className="kw-list-col">
        <div className="kw-list-toolbar">
          <div className="count">
            {filtered.length}<span className="small">{filtered.length === 1 ? t('discover.event', lang) : t('discover.events', lang)}</span>
          </div>
          <div className="day-tabs">
            <button className={`day-tab ${selectedDay === "all" ? "active" : ""}`}
                    onClick={() => setSelectedDay("all")}>{t('discover.all', lang)}</button>
            {DAYS.map(d => (
              <button key={d.id}
                      className={`day-tab ${selectedDay === d.id ? "active" : ""}`}
                      onClick={() => setSelectedDay(d.id)}>
                <span className="dow">{d.weekday}</span>
                {d.date.replace("Aug ", "")}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 && (
          <div style={{textAlign:"center", padding:"96px 32px", color:"var(--fg-2)"}}>
            <h3 className="kw-h3" style={{marginBottom:8}}>{t('discover.emptyTitle', lang)}</h3>
            <p>{t('discover.emptyBody', lang)}</p>
          </div>
        )}

        {selectedDay === "all" ? grouped.filter(g => g.events.length).map(g => (
          <div key={g.id}>
            <div className="kw-list-day-header">
              <span className="day">{g.date}</span>
              <span className="dow">{g.weekday}</span>
              {g.note && <span className="note">· {g.note}</span>}
            </div>
            {g.events.map(e => (
              <EventRow key={e.id} ev={e} lang={lang}
                        active={activeEvent?.id === e.id}
                        inSchedule={scheduleIds.includes(e.id)}
                        hasConflict={isConflict(e)}
                        onClick={() => setActiveEvent(e)} />
            ))}
          </div>
        )) : (
          [...filtered].sort((a, b) => a.start.localeCompare(b.start)).map(e => (
            <EventRow key={e.id} ev={e} lang={lang}
                      active={activeEvent?.id === e.id}
                      inSchedule={scheduleIds.includes(e.id)}
                      hasConflict={isConflict(e)}
                      onClick={() => setActiveEvent(e)} />
          ))
        )}
      </main>

      {/* MAP */}
      <aside className="kw-map-col">
        <SeoulMap eventCounts={neighEventCount} lang={lang}
                  hovered={hoveredNeigh}
                  setHovered={setHoveredNeigh}
                  highlighted={selectedNeighs}
                  onNeighClick={(n) => toggleArr(selectedNeighs, setSelectedNeighs, n)} />
      </aside>

      {activeEvent && (
        <EventModal ev={activeEvent} lang={lang}
                    onClose={() => setActiveEvent(null)}
                    inSchedule={scheduleIds.includes(activeEvent.id)}
                    hasConflict={isConflict(activeEvent)}
                    onToggle={() => toggleSchedule(activeEvent.id)} />
      )}
    </div>
  );
}

function EventRow({ ev, lang, active, inSchedule, hasConflict, onClick }) {
  const cap = ev.rsvp / ev.capacity;
  const full = cap >= 1;
  return (
    <div className={`kw-event-row ${active ? "active" : ""} ${inSchedule ? "in-schedule" : ""}`}
         onClick={onClick}>
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
          <span className="kw-pill">{accessLabel(ev.access, lang)}</span>
          {inSchedule && <span className="kw-pill red">{t('discover.inSchedule', lang)}</span>}
          {hasConflict && !inSchedule && <span className="kw-pill" style={{color:"var(--accent-deep)"}}>{t('discover.conflict', lang)}</span>}
        </div>
      </div>
      <div className="rsvp-cell">
        <span className="capacity">
          {full ? <span className="full">{t('discover.waitlist', lang)}</span> : `${ev.rsvp}/${ev.capacity}`}
        </span>
        <button className="kw-btn kw-btn-ghost kw-btn-sm" onClick={(e) => { e.stopPropagation(); onClick(); }}>
          {t('discover.details', lang)}
        </button>
      </div>
    </div>
  );
}

function SeoulMap({ eventCounts, lang, hovered, setHovered, highlighted, onNeighClick }) {
  return (
    <div className="kw-map-canvas">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M -2 56 Q 15 58 28 50 Q 45 42 58 52 Q 72 60 88 50 Q 96 46 102 48"
              fill="none" stroke="var(--kw-river)" strokeWidth="3" opacity="0.85" />
        <path d="M -2 56 Q 15 58 28 50 Q 45 42 58 52 Q 72 60 88 50 Q 96 46 102 48"
              fill="none" stroke="#A8C5C0" strokeWidth="0.4" opacity="0.6" />

        <g fill="none" stroke="var(--ukf-hairline)" strokeWidth="0.3" opacity="0.7">
          <path d="M 18 28 L 32 32 L 35 42" />
          <path d="M 35 42 L 50 38 L 60 42" />
          <path d="M 60 42 L 78 36" />
          <path d="M 22 70 L 40 72 L 55 75" />
          <path d="M 55 75 L 72 70 L 86 65" />
          <path d="M 12 40 L 20 60" />
          <path d="M 88 35 L 92 65" />
        </g>

        <g transform="translate(92,12)" opacity="0.4">
          <line x1="0" y1="-4" x2="0" y2="4" stroke="var(--fg-2)" strokeWidth="0.3"/>
          <line x1="-4" y1="0" x2="4" y2="0" stroke="var(--fg-2)" strokeWidth="0.3"/>
          <text x="0" y="-5" fontSize="2.5" fill="var(--fg-2)" textAnchor="middle" fontFamily="var(--font-en)" fontWeight="600">N</text>
        </g>

        <text x="50" y="22" fontSize="6" fill="var(--ukf-hairline)"
              textAnchor="middle" fontFamily="var(--font-en)"
              fontWeight="700" letterSpacing="0.6em">SEOUL · 서울</text>

        <text x="50" y="92" fontSize="2.2" fill="var(--fg-3)"
              textAnchor="middle" fontFamily="var(--font-en)"
              fontWeight="500" letterSpacing="0.3em">HAN RIVER · 한강</text>
      </svg>

      {Object.entries(NEIGHBORHOOD_COORDS).map(([id, c]) => {
        const count = eventCounts[id] || 0;
        const isActive = highlighted.includes(id) || hovered === id;
        const neighLabel = lang === 'kr' ? NEIGHBORHOODS[id].labelKr : c.label;
        return (
          <div key={id}
               className={`kw-map-pin ${isActive ? "active" : ""}`}
               style={{left: `${c.x}%`, top: `${c.y}%`}}
               onMouseEnter={() => setHovered(id)}
               onMouseLeave={() => setHovered(null)}
               onClick={() => onNeighClick(id)}>
            <div className="marker"
                 style={{
                   width: 14 + Math.min(count, 8) * 2,
                   height: 14 + Math.min(count, 8) * 2,
                 }}></div>
            {count > 0 && <div className="count">{count}</div>}
            <div className="label">
              {neighLabel}{count ? ` · ${count} event${count === 1 ? "" : "s"}` : " · 0"}
            </div>
          </div>
        );
      })}

      <div className="kw-map-header">
        <h3>Seoul · 서울특별시</h3>
        <p>{t('map.clickToFilter', lang)}</p>
      </div>

      <div className="kw-map-controls">
        <button>+</button>
        <button>−</button>
      </div>

      <div className="kw-map-legend">
        <h4>{t('map.legend', lang)}</h4>
        <div className="row"><span className="dot" style={{background:"var(--ukf-ink)"}}></span>{t('map.density', lang)}</div>
        <div className="row"><span className="dot" style={{background:"var(--accent)"}}></span>{t('map.selected', lang)}</div>
        <div className="row" style={{marginTop:6, color:"var(--fg-2)", fontSize:12}}>{t('map.hoverClick', lang)}</div>
      </div>
    </div>
  );
}

function EventModal({ ev, lang, onClose, inSchedule, hasConflict, onToggle }) {
  const cap = ev.rsvp / ev.capacity;
  const full = cap >= 1;
  const dayObj = DAYS.find(d => d.id === ev.day);
  return (
    <div className="kw-modal-backdrop" onClick={onClose}>
      <div className="kw-modal" onClick={(e) => e.stopPropagation()}>
        <div className={`kw-modal-banner ${ev.track}`}>
          <button className="kw-modal-close" onClick={onClose}>×</button>
          <div className="pills">
            <span className="kw-pill red">{lang === 'kr' ? TRACKS[ev.track].labelKr : TRACKS[ev.track].label}</span>
            <span className="kw-pill">{ev.format}</span>
            <span className="kw-pill">{accessLabel(ev.access, lang)}</span>
          </div>
          <h2>{ev.title}</h2>
        </div>
        <div className="kw-modal-body">
          {hasConflict && !inSchedule && (
            <div className="kw-conflict">
              <div className="icon">!</div>
              <div>
                <h4>{t('modal.conflictTitle', lang)}</h4>
                <p>{t('modal.conflictBody', lang)}</p>
              </div>
            </div>
          )}

          <div className="kw-modal-meta-grid">
            <div>
              <div className="lbl">{t('modal.when', lang)}</div>
              <div className="val">
                {dayObj.date} · {dayObj.weekday}
                <span className="small">{ev.start} — {ev.end}</span>
              </div>
            </div>
            <div>
              <div className="lbl">{t('modal.where', lang)}</div>
              <div className="val">{lang === 'kr' ? NEIGHBORHOODS[ev.neigh].labelKr : NEIGHBORHOODS[ev.neigh].label}<span className="small">{ev.location}</span></div>
            </div>
            <div>
              <div className="lbl">{t('modal.hostedBy', lang)}</div>
              <div className="val">{ev.host}</div>
            </div>
            <div>
              <div className="lbl">{t('modal.capacity', lang)}</div>
              <div className="val">{ev.capacity} {t('modal.guests', lang)}<span className="small">{ev.rsvp} {t('modal.confirmed', lang)}</span></div>
            </div>
          </div>

          <h3>{t('modal.aboutEvent', lang)}</h3>
          <p>{ev.blurb}</p>

          {ev.speakers && (
            <>
              <h3>{t('modal.speakers', lang)}</h3>
              <div className="kw-modal-speakers">
                {ev.speakers.map((s, i) => (
                  <div className="person" key={s}>
                    <div className={`photo kw-portrait-${(i % 6) + 1}`}>
                      {s.split(" ").map(n => n[0]).slice(0, 2).join("")}
                    </div>
                    <span className="nm">{s}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <h3>{t('modal.curationNote', lang)}</h3>
          <p style={{color:"var(--fg-2)", fontSize:14}}>
            {t('modal.curationBody', lang)}
          </p>
        </div>

        <div className="kw-modal-cta">
          <div className="capacity-bar">
            <div className="lbl">
              <span>{t('modal.capacityLabel', lang)}</span>
              <span>{ev.rsvp} / {ev.capacity}</span>
            </div>
            <div className={`bar ${cap > 0.85 ? "warn" : ""}`}>
              <div style={{width: `${Math.min(100, cap * 100)}%`}}></div>
            </div>
          </div>
          {inSchedule ? (
            <button className="kw-btn kw-btn-ghost" onClick={onToggle}>
              {t('modal.removeSchedule', lang)}
            </button>
          ) : (
            <button className={`kw-btn ${hasConflict ? "kw-btn-primary" : "kw-btn-accent"}`}
                    disabled={hasConflict}
                    style={hasConflict ? {opacity:0.4, cursor:"not-allowed"} : {}}
                    onClick={hasConflict ? null : onToggle}>
              {full ? t('modal.joinWaitlist', lang) : (ev.access === "open" ? t('modal.rsvp', lang) : ev.access === "apply" ? t('modal.applyAttend', lang) : t('modal.requestInvite', lang))} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
