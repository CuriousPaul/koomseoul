import { useState } from 'react';
import {
  TRACKS, EVENTS, DAYS, NEIGHBORHOODS,
  FEATURED_SPEAKERS, SPONSORS_PLATINUM, SPONSORS_GOLD
} from '../data.js';

export default function HomePage({ lang, onNav }) {
  const trackCounts = Object.keys(TRACKS).map(t => ({
    track: t,
    count: EVENTS.filter(e => e.track === t).length,
  }));

  const dayHighlights = EVENTS.filter(e =>
    ["e01", "e08", "e10", "e22", "e26"].includes(e.id)
  );

  return (
    <div>
      {/* HERO */}
      <section className="kw-hero">
        <div className="kw-container-wide">
          <div className="kw-hero-grid">
            <div>
              <div className="kw-eyebrow on-red">
                <span className="dot"></span>
                AUG 11 — 15, 2026 · ALL OF SEOUL
              </div>
              <h1 className="kw-hero-title">
                Koom <span className="red">Week</span><br />
                Seoul.
                <span className="small">A decentralized festival of Korean founders, capital, and culture.</span>
              </h1>
              <p className="lead">
                Five days. Six neighborhoods. Hundreds of independently hosted events across K-Beauty, K-Entertainment, K-Food, and venture. UKF curates. The city hosts.
              </p>
              <div className="cta-row">
                <button className="kw-btn kw-btn-accent" onClick={() => onNav("discover")}>
                  Browse Events <span style={{fontSize:18, marginLeft:4}}>→</span>
                </button>
                <button className="kw-btn kw-btn-ghost-light" onClick={() => onNav("host")}>
                  Host an Event
                </button>
              </div>
            </div>
            <div className="kw-hero-side">
              <div className="stat">
                <div className="num"><span className="red">{EVENTS.length}</span> events</div>
                <div className="lbl">Independently hosted across Seoul</div>
              </div>
              <div className="stat">
                <div className="num">2,400+</div>
                <div className="lbl">Founders, investors, creators expected</div>
              </div>
              <div className="stat">
                <div className="num">6</div>
                <div className="lbl">Neighborhood hubs · POPCON co-located</div>
              </div>
            </div>
          </div>

          <div className="kw-hero-meta">
            <div className="item">
              <span className="lbl">Dates</span>
              <span className="val">Aug 11 — 15, 2026</span>
            </div>
            <div className="item">
              <span className="lbl">Where</span>
              <span className="val">Seoul, Republic of Korea<span className="kr">서울</span></span>
            </div>
            <div className="item">
              <span className="lbl">Co-located with</span>
              <span className="val">Seoul POPCON · COEX</span>
            </div>
            <div className="item">
              <span className="lbl">Presented by</span>
              <span className="val">United Korean Founders</span>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="kw-marquee">
        <div className="kw-marquee-inner">
          <span>
            K-BEAUTY <span className="dot"></span>
            K-ENTERTAINMENT <span className="dot"></span>
            K-FOOD <span className="dot"></span>
            VC · INVESTING <span className="dot"></span>
            SEONGSU <span className="dot"></span>
            GANGNAM <span className="dot"></span>
            SANGAM <span className="dot"></span>
            COEX <span className="dot"></span>
            MAPO <span className="dot"></span>
            GANGDONG <span className="dot"></span>
          </span>
          <span aria-hidden="true">
            K-BEAUTY <span className="dot"></span>
            K-ENTERTAINMENT <span className="dot"></span>
            K-FOOD <span className="dot"></span>
            VC · INVESTING <span className="dot"></span>
            SEONGSU <span className="dot"></span>
            GANGNAM <span className="dot"></span>
            SANGAM <span className="dot"></span>
            COEX <span className="dot"></span>
            MAPO <span className="dot"></span>
            GANGDONG <span className="dot"></span>
          </span>
        </div>
      </div>

      {/* TRACKS */}
      <section className="kw-section">
        <div className="kw-container-wide">
          <div className="kw-section-head">
            <div className="left">
              <div className="kw-eyebrow"><span className="dot"></span>FOUR TRACKS · ONE CITY</div>
              <h2>Programmed by sector. Distributed by neighborhood.</h2>
              <p className="body">
                UKF doesn't lock you in a convention center. We act as conductor — curating independently hosted events across Seoul's distinct neighborhoods so you build your week sector-first.
              </p>
            </div>
            <div className="right">
              <a onClick={() => onNav("discover")}>See all events →</a>
            </div>
          </div>

          <div className="kw-tracks-grid">
            {[
              { id: "beauty", title: "K-Beauty", body: "Indie founders, biotech ingredients, retail buyers. Cloudglow ingredients move from clinic to counter.", neighs: ["Seongsu", "Gangnam"] },
              { id: "ent",    title: "K-Entertainment", body: "Webtoon-to-screen, fan-tech, AI music production. Live IP buyers walking POPCON sit down with studios.", neighs: ["Sangam", "COEX"] },
              { id: "food",   title: "K-Food", body: "Foodtech demos, freezer-aisle exports, supper clubs at Seoul's modern Korean restaurants.", neighs: ["Gangdong", "Mapo"] },
              { id: "vc",     title: "VC · Investing", body: "First-check mixers, Series-A pitch floors, sovereign LP roundtables. The capital side of the festival.", neighs: ["Gangnam", "COEX"] },
            ].map((tr, i) => {
              const count = trackCounts.find(c => c.track === tr.id)?.count || 0;
              return (
                <div className="kw-track-card" key={tr.id} onClick={() => onNav("discover", { track: tr.id })}>
                  <div className="num">/ 0{i + 1}</div>
                  <h3>{tr.title}</h3>
                  <div className="kr">{TRACKS[tr.id].labelKr}</div>
                  <p className="body">{tr.body}</p>
                  <div className="neighborhoods">
                    {tr.neighs.map(n => <span className="kw-pill" key={n}>{n}</span>)}
                  </div>
                  <span className="count">{count} events →</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED — Opening Ceremony */}
      <section className="kw-feature">
        <div className="kw-container-wide">
          <div>
            <div className="kw-eyebrow on-red"><span className="dot"></span>OPENING NIGHT · TUE AUG 11</div>
            <h2>The Next<br />Leap of UKF.</h2>
            <p className="body">
              UKF Co-Chairs Saeju Jeong and Kiha Lee open Koom Week Seoul with a keynote on the global Korean founder flywheel — and announce the first cohort of the UKF Foundation.
            </p>
            <div className="cta-row">
              <button className="kw-btn kw-btn-accent" onClick={() => onNav("discover")}>RSVP for Opening</button>
              <button className="kw-btn kw-btn-ghost-light">Watch 2025 Recap</button>
            </div>
          </div>
          <div className="kw-feature-side">
            <h4>This week, hand-picked</h4>
            <ul>
              {dayHighlights.map(e => (
                <li key={e.id}>
                  <div className="time">{e.start}</div>
                  <div>
                    <div className="title">{e.title}</div>
                    <div className="meta">
                      {DAYS.find(d => d.id === e.day).date} · {NEIGHBORHOODS[e.neigh].label}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SPEAKERS */}
      <section className="kw-section">
        <div className="kw-container-wide">
          <div className="kw-section-head">
            <div className="left">
              <div className="kw-eyebrow"><span className="dot"></span>FEATURED SPEAKERS</div>
              <h2>The people in the rooms.</h2>
            </div>
            <div className="right">
              <a>See all 142 speakers →</a>
            </div>
          </div>
          <div className="kw-speakers-grid">
            {FEATURED_SPEAKERS.map((s) => (
              <div className="kw-card kw-speaker-card interactive" key={s.name}>
                <div className={`photo kw-portrait-${s.portrait}`}>
                  {s.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <div className="name">
                    {s.name}
                    <span className="kr">{s.kr}</span>
                  </div>
                  <div className="role">{s.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPONSORS */}
      <section className="kw-sponsors">
        <div className="kw-container-wide">
          <div className="kw-eyebrow"><span className="dot"></span>SPONSORS &amp; PARTNERS</div>
          <h2 style={{font:"700 48px/1.1 var(--font-en)", letterSpacing:"-0.02em", margin:"16px 0 48px"}}>
            Built with the houses<br />that built the wave.
          </h2>
          <div>
            <div className="kw-sponsors-tier platinum">
              <div className="tier-label">Founding · Title</div>
              <div className="logos">
                {SPONSORS_PLATINUM.map(s => (
                  <div key={s.name}>
                    <div className="logo-slug">{s.name}</div>
                    <div className="logo-sub">{s.subtitle}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="kw-sponsors-tier">
              <div className="tier-label">Gold</div>
              <div className="logos">
                {SPONSORS_GOLD.map(s => <div key={s} className="logo-slug" style={{fontSize:20, opacity:0.85}}>{s}</div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="kw-section" style={{paddingTop:0}}>
        <div className="kw-container-wide">
          <div style={{
            background: "var(--ukf-ink)", color: "#fff", borderRadius: 12,
            padding: "80px 64px", display: "grid",
            gridTemplateColumns: "1.4fr 1fr", gap: 64, alignItems: "center"
          }}>
            <div>
              <h2 className="kw-h2" style={{color:"#fff"}}>Hosting something during Koom Week?</h2>
              <p style={{font:"400 18px/1.5 var(--font-en)", color:"rgba(255,255,255,0.7)", marginTop:20, maxWidth:560}}>
                Submit your event for curation by the UKF team. Approved events appear in the official directory, get email amplification, and access to attendee matchmaking.
              </p>
            </div>
            <div style={{display:"flex", flexDirection:"column", gap:12, alignItems:"start"}}>
              <button className="kw-btn kw-btn-accent" onClick={() => onNav("host")}>Start a Submission →</button>
              <button className="kw-btn kw-btn-ghost-light">Read Host Guidelines</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
