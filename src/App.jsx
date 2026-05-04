import { useState, useEffect } from 'react';
import './styles.css';
import { KwHeader, KwFooter } from './shared.jsx';
import { TweaksPanel, TweakSection, useTweaks } from './TweaksPanel.jsx';
import HomePage from './pages/HomePage.jsx';
import DiscoverPage from './pages/DiscoverPage.jsx';
import { SchedulePage, HostPage, AdminPage } from './pages/ScheduleHostAdmin.jsx';

const TWEAK_DEFAULTS = { accent: "heritage_red" };

const ACCENT_PALETTES = {
  heritage_red: { name: "Heritage Red",    hex: "#C8102E", deep: "#A60D26", soft: "#FBE8EC", ink: "#FFFFFF" },
  ink_only:     { name: "Ink (no accent)", hex: "#111111", deep: "#000000", soft: "#EFEDE6", ink: "#FFFFFF" },
  jangdok:      { name: "Jangdok Clay",    hex: "#A8451F", deep: "#8A3617", soft: "#F4E5DD", ink: "#FFFFFF" },
  hanji:        { name: "Hanji Mustard",   hex: "#C99A2E", deep: "#A47B22", soft: "#F8EFD8", ink: "#111111" },
  celadon:      { name: "Celadon Green",   hex: "#3F7A60", deep: "#2D5A47", soft: "#DDEAE3", ink: "#FFFFFF" },
  obsidian:     { name: "Hanok Indigo",    hex: "#1F3A5F", deep: "#162947", soft: "#DCE3EC", ink: "#FFFFFF" },
};

export default function App() {
  const [page, setPage] = useState("home");
  const [pageProps, setPageProps] = useState(null);
  const [lang, setLang] = useState("en");
  const [scheduleIds, setScheduleIds] = useState(["e01", "e08", "e13"]);
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    const p = ACCENT_PALETTES[tweaks.accent] || ACCENT_PALETTES.heritage_red;
    document.documentElement.style.setProperty("--accent", p.hex);
    document.documentElement.style.setProperty("--accent-deep", p.deep);
    document.documentElement.style.setProperty("--accent-soft", p.soft);
    document.documentElement.style.setProperty("--accent-ink", p.ink);
  }, [tweaks.accent]);

  const onNav = (k, props = null) => {
    setPage(k);
    setPageProps(props);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const toggleSchedule = (id) => {
    setScheduleIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div data-screen-label={`Koom Week — ${page}`}>
      <KwHeader active={page} onNav={onNav} lang={lang} setLang={setLang} scheduleCount={scheduleIds.length} />

      {page === "home"     && <HomePage lang={lang} onNav={onNav} />}
      {page === "discover" && <DiscoverPage lang={lang}
                                            scheduleIds={scheduleIds}
                                            toggleSchedule={toggleSchedule}
                                            prefilters={pageProps} />}
      {page === "schedule" && <SchedulePage scheduleIds={scheduleIds}
                                            toggleSchedule={toggleSchedule}
                                            onNav={onNav} />}
      {page === "host"     && <HostPage />}
      {page === "admin"    && <AdminPage />}

      {(page === "home" || page === "host") && <KwFooter />}

      <TweaksPanel title="Tweaks">
        <TweakSection title="Accent color" subtitle="Heritage red is the UKF default. Try alternate Korean heritage tones.">
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8}}>
            {Object.entries(ACCENT_PALETTES).map(([k, p]) => (
              <button key={k}
                      onClick={() => setTweak("accent", k)}
                      style={{
                        display:"flex", alignItems:"center", gap:10,
                        padding:"10px 12px",
                        background: tweaks.accent === k ? "rgba(0,0,0,0.05)" : "transparent",
                        border: "1px solid " + (tweaks.accent === k ? "#111" : "#E6E4DD"),
                        borderRadius: 4,
                        cursor:"pointer",
                        font:"500 12px/1.2 Inter, sans-serif",
                        color: "#111",
                        textAlign:"left",
                      }}>
                <span style={{
                  width:18, height:18, borderRadius:"50%",
                  background: p.hex, border:"1px solid rgba(0,0,0,0.1)",
                  flexShrink:0,
                }}></span>
                {p.name}
              </button>
            ))}
          </div>
        </TweakSection>
        <TweakSection title="What's tweakable here?">
          <p style={{font:"400 12px/1.5 Inter, sans-serif", color:"#6B6B66", margin:0}}>
            Per UKF brand rules the rest of the system (type, ink, paper, layout density) stays editorial. Only the accent stamp moves.
          </p>
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}
