import { useEffect, useRef, useState } from 'react';
import { TRACKS, NEIGHBORHOODS } from './data.js';

export function KwHeader({ active, onNav, lang, setLang, scheduleCount }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const hamburgerRef = useRef(null);
  const items = [
    { k: "home",      label: "Overview",    kr: "개요" },
    { k: "discover",  label: "Discover",    kr: "이벤트" },
    { k: "schedule",  label: "My Schedule", kr: "내 일정" },
    { k: "host",      label: "Host",        kr: "호스팅" },
    { k: "admin",     label: "Admin",       kr: "관리자" },
  ];

  const closeMenu = ({ restoreFocus = false } = {}) => {
    setMenuOpen(false);
    if (restoreFocus) {
      window.requestAnimationFrame(() => hamburgerRef.current?.focus());
    }
  };

  const handleNav = (key) => {
    onNav(key);
    closeMenu({ restoreFocus: true });
  };

  const handleLang = (nextLang) => {
    setLang(nextLang);
    closeMenu({ restoreFocus: true });
  };

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeMenu({ restoreFocus: true });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  return (
    <header className="kw-header">
      <div className="kw-header-inner">
        <button type="button" className="kw-brand" onClick={() => handleNav("home")} aria-label="Go to Koom Week Seoul overview">
          <img src="/assets/ukf-symbol-logo.svg" alt="UKF" />
          <span className="divider"></span>
          <span className="wordmark">KOOM<span className="red">·</span>WEEK <span style={{color:"var(--fg-2)", fontWeight:500}}>SEOUL'26</span></span>
        </button>
        <button
          type="button"
          className="kw-hamburger"
          ref={hamburgerRef}
          aria-expanded={menuOpen}
          aria-controls="kw-mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen(v => !v)}
        >
          <span className={`kw-hamburger-icon ${menuOpen ? 'open' : ''}`} />
        </button>
        <nav
          className={`kw-nav ${menuOpen ? 'kw-nav-mobile-open' : ''}`}
          id="kw-mobile-nav"
          aria-label="Primary navigation"
        >
          {items.map(it => (
            <button key={it.k}
               type="button"
               className={`kw-nav-link ${active === it.k ? "active" : ""}`}
               aria-current={active === it.k ? "page" : undefined}
               onClick={() => handleNav(it.k)}>
              <span>{lang === "kr" ? it.kr : it.label}</span>
              {it.k === "schedule" && scheduleCount > 0 && (
                <span className="kw-nav-count">{scheduleCount}</span>
              )}
            </button>
          ))}
          <span className="kw-lang kw-lang-mobile">
            <button type="button" className={lang === "en" ? "active" : ""} onClick={() => handleLang("en")}>EN</button>
            <span className="sep">·</span>
            <button type="button" className={lang === "kr" ? "active" : ""} onClick={() => handleLang("kr")}>KR</button>
          </span>
          <button type="button" className="kw-btn kw-btn-accent kw-btn-sm kw-mobile-cta" onClick={() => handleNav("host")}>
            {lang === "kr" ? "이벤트 호스팅" : "Submit an Event"}
          </button>
        </nav>
      </div>
    </header>
  );
}

export function KwFooter() {
  return (
    <footer className="kw-footer">
      <div className="kw-container-wide">
        <div>
          <img src="/assets/ukf-full-logo.svg" className="flogo" alt="UKF" />
          <p className="tagline">
            Koom Week Seoul is presented by United Korean Founders. The world's largest community for Korean founders, entrepreneurs, and creators.
          </p>
          <div className="socials">
            <a href="#"><img src="/assets/icon-linkedin.svg" alt="LinkedIn" /></a>
            <a href="#"><img src="/assets/icon-instagram.svg" alt="Instagram" /></a>
            <a href="#"><img src="/assets/icon-x.svg" alt="X" /></a>
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

export function KwTrackTag({ track }) {
  const t = TRACKS[track];
  return <span className="kw-track-tag" data-track={track}>{t.label}</span>;
}

export function KwAvatar({ name, color = 1, size = 40, round = true }) {
  const initials = name.split(" ").map(n => n[0]).slice(0, 2).join("");
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
