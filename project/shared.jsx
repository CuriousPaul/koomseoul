// Koom Week — shared layout components

const { useState: useStateShared, useEffect: useEffectShared } = React;

function KwHeader({ active, onNav, lang, setLang, scheduleCount }) {
  const items = [
    { k: "home",      label: "Overview",   kr: "개요" },
    { k: "discover",  label: "Discover",   kr: "이벤트" },
    { k: "schedule",  label: "My Schedule",kr: "내 일정" },
    { k: "host",      label: "Host",       kr: "호스팅" },
    { k: "admin",     label: "Admin",      kr: "관리자" },
  ];
  return (
    <header className="kw-header">
      <div className="kw-header-inner">
        <div className="kw-brand" onClick={() => onNav("home")}>
          <img src="assets/ukf-symbol-logo.svg" alt="UKF" />
          <span className="divider"></span>
          <span className="wordmark">KOOM<span className="red">·</span>WEEK <span style={{color:"var(--fg-2)", fontWeight:500}}>SEOUL'26</span></span>
        </div>
        <nav className="kw-nav">
          {items.map(it => (
            <a key={it.k}
               className={`kw-nav-link ${active === it.k ? "active" : ""}`}
               onClick={() => onNav(it.k)}>
              {lang === "kr" ? it.kr : it.label}
              {it.k === "schedule" && scheduleCount > 0 && (
                <span style={{
                  marginLeft: 6, padding: "2px 7px", borderRadius: 999,
                  background: "var(--accent)", color: "#fff",
                  font: "700 10px/1 var(--font-en)"
                }}>{scheduleCount}</span>
              )}
            </a>
          ))}
          <span className="kw-lang">
            <button
              className={lang === "en" ? "active" : ""}
              onClick={() => setLang("en")}>EN</button>
            <span className="sep">·</span>
            <button
              className={lang === "kr" ? "active" : ""}
              onClick={() => setLang("kr")}>KR</button>
          </span>
          <button className="kw-btn kw-btn-accent kw-btn-sm" onClick={() => onNav("host")}>
            {lang === "kr" ? "이벤트 호스팅" : "Submit an Event"}
          </button>
        </nav>
      </div>
    </header>
  );
}

function KwFooter() {
  return (
    <footer className="kw-footer">
      <div className="kw-container-wide">
        <div>
          <img src="assets/ukf-full-logo.svg" className="flogo" alt="UKF" />
          <p className="tagline">
            Koom Week Seoul is presented by United Korean Founders. The world's largest community for Korean founders, entrepreneurs, and creators.
          </p>
          <div className="socials">
            <a href="#"><img src="assets/icon-linkedin.svg" alt="LinkedIn" /></a>
            <a href="#"><img src="assets/icon-instagram.svg" alt="Instagram" /></a>
            <a href="#"><img src="assets/icon-x.svg" alt="X" /></a>
          </div>
        </div>
        <div>
          <h4>Koom Week</h4>
          <ul>
            <li><a href="#">Overview</a></li>
            <li><a href="#">Discover Events</a></li>
            <li><a href="#">My Schedule</a></li>
            <li><a href="#">Speakers</a></li>
            <li><a href="#">Sponsors</a></li>
          </ul>
        </div>
        <div>
          <h4>For Hosts</h4>
          <ul>
            <li><a href="#">Submit an Event</a></li>
            <li><a href="#">Host Guidelines</a></li>
            <li><a href="#">Curation Criteria</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4>UKF Network</h4>
          <ul>
            <li><a href="#">About UKF</a></li>
            <li><a href="#">82Startup</a></li>
            <li><a href="#">KOOM Festival NYC</a></li>
            <li><a href="#">Membership</a></li>
          </ul>
        </div>
        <div className="copyright">
          <span>© 2026 United Korean Founders. Koom Week Seoul Aug 11–15, 2026.</span>
          <span>Privacy · Terms · Code of Conduct</span>
        </div>
      </div>
    </footer>
  );
}

function KwTrackTag({ track, kw }) {
  const t = TRACKS[track];
  return <span className="kw-track-tag" data-track={track}>{kw === "kr" ? t.labelKr : t.label}</span>;
}

function KwAvatar({ name, color = 1, size = 40, round = true }) {
  const initials = name.split(" ").map(n => n[0]).slice(0,2).join("");
  return (
    <div className={`kw-portrait-${color}`}
         style={{
           width: size, height: size,
           borderRadius: round ? "50%" : 8,
           display: "flex", alignItems: "center", justifyContent: "center",
           color: "rgba(255,255,255,0.9)",
           fontWeight: 700, fontSize: Math.round(size * 0.32),
           letterSpacing: "0.02em"
         }}>
      {initials}
    </div>
  );
}

Object.assign(window, { KwHeader, KwFooter, KwTrackTag, KwAvatar });
