import { useEffect, useRef, useState } from 'react';
import { TRACKS, NEIGHBORHOODS } from './data.js';
import { t } from './i18n.js';

export function KwHeader({ active, onNav, lang, setLang, scheduleCount }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const hamburgerRef = useRef(null);
  const items = [
    { k: "home",      label: t('nav.overview', lang),     kr: t('nav.overview', 'kr') },
    { k: "discover",  label: t('nav.discover', lang),     kr: t('nav.discover', 'kr') },
    { k: "schedule",  label: t('nav.schedule', lang),     kr: t('nav.schedule', 'kr') },
    { k: "host",      label: t('nav.host', lang),         kr: t('nav.host', 'kr') },
    { k: "admin",     label: t('nav.admin', lang),        kr: t('nav.admin', 'kr') },
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
        <button type="button" className="kw-brand" onClick={() => handleNav("home")} aria-label={t('nav.goOverview', lang)}>
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
           aria-label={menuOpen ? t('nav.closeMenu', lang) : t('nav.openMenu', lang)}
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
                <span>{it.label}</span>
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
            {t('nav.submitEvent', lang)}
          </button>
        </nav>
      </div>
    </header>
  );
}

export function KwFooter({ lang = 'kr' }) {
  return (
    <footer className="kw-footer">
      <div className="kw-container-wide">
        <div>
          <img src="/assets/ukf-full-logo.svg" className="flogo" alt="UKF" />
          <p className="tagline">
            {t('footer.tagline', lang)}
          </p>
          <div className="socials">
            <a href="#"><img src="/assets/icon-linkedin.svg" alt="LinkedIn" /></a>
            <a href="#"><img src="/assets/icon-instagram.svg" alt="Instagram" /></a>
            <a href="#"><img src="/assets/icon-x.svg" alt="X" /></a>
          </div>
        </div>
        <div>
          <h4>{t('footer.colKoom', lang)}</h4>
          <ul>
            <li><a href="#">{t('footer.overview', lang)}</a></li>
            <li><a href="#">{t('footer.discoverEvents', lang)}</a></li>
            <li><a href="#">{t('footer.mySchedule', lang)}</a></li>
            <li><a href="#">{t('footer.speakers', lang)}</a></li>
            <li><a href="#">{t('footer.sponsors', lang)}</a></li>
          </ul>
        </div>
        <div>
          <h4>{t('footer.colHosts', lang)}</h4>
          <ul>
            <li><a href="#">{t('footer.submitEvent', lang)}</a></li>
            <li><a href="#">{t('footer.hostGuides', lang)}</a></li>
            <li><a href="#">{t('footer.curation', lang)}</a></li>
            <li><a href="#">{t('footer.faq', lang)}</a></li>
          </ul>
        </div>
        <div>
          <h4>{t('footer.colNetwork', lang)}</h4>
          <ul>
            <li><a href="#">{t('footer.aboutUkf', lang)}</a></li>
            <li><a href="#">82Startup</a></li>
            <li><a href="#">KOOM Festival NYC</a></li>
            <li><a href="#">{t('footer.membership', lang)}</a></li>
          </ul>
        </div>
        <div className="copyright">
          <span>{t('footer.copyright', lang)}</span>
          <span>{t('footer.legal', lang)}</span>
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
