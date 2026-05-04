// Koom Week Seoul 2026 — sample data
// 28 events across 4 tracks, 5 days (Aug 11–15, 2026), 4 neighborhoods.

const TRACKS = {
  beauty:  { id: "beauty",  label: "K-Beauty",        labelKr: "K-뷰티",     accent: "var(--accent)" },
  ent:     { id: "ent",     label: "K-Entertainment", labelKr: "K-엔터",     accent: "var(--accent)" },
  food:    { id: "food",    label: "K-Food",          labelKr: "K-푸드",     accent: "var(--accent)" },
  vc:      { id: "vc",      label: "VC / Investing",  labelKr: "VC · 투자",  accent: "var(--accent)" },
};

const NEIGHBORHOODS = {
  seongsu:  { id: "seongsu",  label: "Seongsu-dong",        labelKr: "성수동",   blurb: "Beauty pop-ups, brand experiences" },
  gangnam:  { id: "gangnam",  label: "Gangnam",             labelKr: "강남",     blurb: "Biotech clinics, capital corridors" },
  sangam:   { id: "sangam",   label: "Sangam-dong",         labelKr: "상암동",   blurb: "Broadcast & entertainment HQs" },
  coex:     { id: "coex",     label: "COEX · Samseong",     labelKr: "코엑스",   blurb: "Conventions, IP buyers, POPCON" },
  mapo:     { id: "mapo",     label: "Mapo-gu",             labelKr: "마포구",   blurb: "Foodtech labs, modern Korean dining" },
  gangdong: { id: "gangdong", label: "Gangdong-gu",         labelKr: "강동구",   blurb: "Foodtech Startup Center, R&D kitchens" },
};

// Approximate map positions (% of map canvas, 0-100).
// Seoul roughly: Han River runs WSW→ENE through middle.
const NEIGHBORHOOD_COORDS = {
  sangam:   { x: 18, y: 38, label: "Sangam"  },
  mapo:     { x: 30, y: 42, label: "Mapo"    },
  gangnam:  { x: 50, y: 60, label: "Gangnam" },
  seongsu:  { x: 56, y: 44, label: "Seongsu" },
  coex:     { x: 60, y: 62, label: "COEX"    },
  gangdong: { x: 78, y: 52, label: "Gangdong"},
};

const FORMATS = ["Pitch", "Panel", "Mixer", "Demo Day", "Supper Club", "Workshop", "Showcase", "Breakfast", "Hackathon"];

const ACCESS = {
  open:    { id: "open",    label: "Open to Public" },
  apply:   { id: "apply",   label: "Apply to Attend" },
  invite:  { id: "invite",  label: "Invite Only" },
};

// Date helpers — Aug 2026
const DAYS = [
  { id: "tue", date: "Aug 11", weekday: "Tue", iso: "2026-08-11" },
  { id: "wed", date: "Aug 12", weekday: "Wed", iso: "2026-08-12" },
  { id: "thu", date: "Aug 13", weekday: "Thu", iso: "2026-08-13" },
  { id: "fri", date: "Aug 14", weekday: "Fri", iso: "2026-08-14", note: "POPCON opens" },
  { id: "sat", date: "Aug 15", weekday: "Sat", iso: "2026-08-15", note: "Liberation Day · light schedule" },
];

// 28 sample events
const EVENTS = [
  // ---- TUESDAY Aug 11 ----
  { id: "e01", title: "Opening Ceremony · The Next Leap", host: "United Korean Founders", track: "vc", neigh: "coex",
    day: "tue", start: "18:00", end: "21:00", format: "Showcase", access: "open",
    capacity: 1200, rsvp: 847, status: "approved",
    blurb: "Co-Chairs Saeju Jeong and Kiha Lee open Koom Week with a keynote on the global Korean founder flywheel.",
    speakers: ["Saeju Jeong", "Kiha Lee", "Hyunjoon Park"],
    location: "COEX Hall D · Samseong-dong" },

  { id: "e02", title: "Cloudglow Founders Breakfast", host: "Olive Young N Seongsu", track: "beauty", neigh: "seongsu",
    day: "tue", start: "08:30", end: "10:30", format: "Breakfast", access: "apply",
    capacity: 80, rsvp: 64, status: "approved",
    blurb: "Indie K-beauty founders break bread with global retail buyers from Sephora, Ulta and CULT.",
    speakers: ["Jin-young Park", "Hannah Cho"],
    location: "Olive Young N Seongsu · 4F Salon" },

  { id: "e03", title: "Lab-Grown PDRN: The Next Hero Ingredient", host: "Sage Partners × VOS Bio", track: "beauty", neigh: "gangnam",
    day: "tue", start: "11:00", end: "13:00", format: "Panel", access: "apply",
    capacity: 120, rsvp: 89, status: "approved",
    blurb: "Bio-engineered PDRN moves from clinic to counter. Three founders, two MDs, one investor.",
    speakers: ["Dr. Hyemin Lee", "Andrew Kim", "Sora Bae"],
    location: "Apgujeong Skin Tower · Gangnam" },

  { id: "e04", title: "Foodtech Startup Center · Heat-and-Eat Demo Day", host: "Seoul Foodtech Center", track: "food", neigh: "gangdong",
    day: "tue", start: "14:00", end: "18:00", format: "Demo Day", access: "open",
    capacity: 300, rsvp: 211, status: "approved",
    blurb: "Twelve teams pitch freezer-aisle innovations: from Korean street food to shelf-stable banchan.",
    location: "Gangdong Foodtech Center · IR Theater" },

  { id: "e05", title: "VC Supper Club: Modern Korean", host: "Mirae Asset Capital", track: "food", neigh: "mapo",
    day: "tue", start: "19:30", end: "23:00", format: "Supper Club", access: "invite",
    capacity: 24, rsvp: 24, status: "approved",
    blurb: "A long-table tasting menu at Mosu. Five seed-stage foodtech founders, fifteen partners.",
    location: "Mosu Seoul · Hannam-dong" },

  { id: "e06", title: "AI × Songwriting: Inside HYBE's Sandbox", host: "HYBE × Stability AI", track: "ent", neigh: "sangam",
    day: "tue", start: "15:00", end: "17:00", format: "Workshop", access: "apply",
    capacity: 60, rsvp: 60, status: "approved",
    blurb: "Producers walk through the prompt-to-stem pipeline being used on a 2027 release. NDAs at the door.",
    location: "HYBE Studio 1 · Sangam-dong" },

  { id: "e07", title: "First-Check Founders Mixer", host: "Goodwater Capital", track: "vc", neigh: "gangnam",
    day: "tue", start: "20:00", end: "23:00", format: "Mixer", access: "apply",
    capacity: 200, rsvp: 156, status: "approved",
    blurb: "Pre-seed founders meet US and SEA investors writing first checks under $500K.",
    location: "Sage House · Cheongdam" },

  // ---- WEDNESDAY Aug 12 ----
  { id: "e08", title: "Webtoon → Global TV: The Adaptation Stack", host: "CJ ENM StudioMonowa", track: "ent", neigh: "sangam",
    day: "wed", start: "10:00", end: "12:00", format: "Panel", access: "apply",
    capacity: 180, rsvp: 142, status: "approved",
    blurb: "How CJ ENM, Naver Webtoon and Anthem Studios are co-developing IP for Netflix and AppleTV+.",
    speakers: ["Miky Lee", "JC Park", "Joonho Bahng"],
    location: "CJ ENM Center · Theatre B" },

  { id: "e09", title: "Hyper-Personalized Skincare: The DNA-to-Drop Pipeline", host: "Amorepacific Ventures", track: "beauty", neigh: "seongsu",
    day: "wed", start: "11:30", end: "13:00", format: "Showcase", access: "open",
    capacity: 250, rsvp: 198, status: "approved",
    blurb: "Live demo: cheek-swab to custom serum in 90 minutes. Three startups demo end-to-end.",
    location: "Amore Seongsu · 1F Atrium" },

  { id: "e10", title: "Series-A Pitch Floor", host: "Altos Ventures × Bessemer", track: "vc", neigh: "coex",
    day: "wed", start: "13:00", end: "18:00", format: "Pitch", access: "apply",
    capacity: 600, rsvp: 412, status: "approved",
    blurb: "Twenty-four selected teams pitch on a single open floor. Open feedback, open table.",
    location: "COEX Hall E · Samseong-dong" },

  { id: "e11", title: "K-Pop Tech Showcase: Fan Engagement APIs", host: "SM Entertainment × Weverse", track: "ent", neigh: "sangam",
    day: "wed", start: "14:00", end: "17:00", format: "Showcase", access: "open",
    capacity: 400, rsvp: 367, status: "approved",
    blurb: "Eight startups demo fan-data tooling: ticketing, light-stick OS, AI greetings, IRL meetups.",
    location: "Sangam DMC · Studio 8" },

  { id: "e12", title: "Banchan Goes Global: Retail Lunch", host: "Shinsegae × CJ Foods USA", track: "food", neigh: "gangdong",
    day: "wed", start: "12:00", end: "14:00", format: "Panel", access: "apply",
    capacity: 90, rsvp: 71, status: "approved",
    blurb: "Buyers from Costco, H-Mart and Whole Foods on what's actually moving on US shelves in 2026.",
    location: "Foodtech Center · Auditorium" },

  { id: "e13", title: "Indie Beauty × Creator Mixer", host: "Roa Korea × Hince", track: "beauty", neigh: "seongsu",
    day: "wed", start: "19:00", end: "23:00", format: "Mixer", access: "apply",
    capacity: 180, rsvp: 180, status: "approved",
    blurb: "Tier-one Korean creators meet emerging indie founders. DJ set by Park Hye Jin.",
    location: "Cafe Sukara · Seongsu-dong" },

  { id: "e14", title: "82Startup West Coast Reunion Dinner", host: "82Startup", track: "vc", neigh: "gangnam",
    day: "wed", start: "19:00", end: "23:00", format: "Supper Club", access: "invite",
    capacity: 60, rsvp: 60, status: "approved",
    blurb: "Bay Area Korean founders reconnect in Seoul. Family-style at Mingles.",
    location: "Mingles · Cheongdam" },

  // ---- THURSDAY Aug 13 ----
  { id: "e15", title: "Biotech Beauty Pitch Breakfast", host: "Dongbang Capital", track: "beauty", neigh: "gangnam",
    day: "thu", start: "08:00", end: "10:30", format: "Pitch", access: "apply",
    capacity: 100, rsvp: 78, status: "approved",
    blurb: "Six biotech-beauty teams pitch to a panel of dermatology investors and clinical advisors.",
    location: "Gangnam Finance Center · 38F" },

  { id: "e16", title: "Concert Tech: From Light Sticks to Spatial Audio", host: "Kakao Entertainment", track: "ent", neigh: "sangam",
    day: "thu", start: "10:00", end: "12:30", format: "Panel", access: "open",
    capacity: 350, rsvp: 287, status: "approved",
    blurb: "Engineers from BTS, ATEEZ and IVE world tours on the hardware-software stack of arena pop.",
    location: "Kakao Friends HQ · Sangam" },

  { id: "e17", title: "Korean Pantry Hackathon", host: "Woowa Brothers Lab", track: "food", neigh: "mapo",
    day: "thu", start: "10:00", end: "20:00", format: "Hackathon", access: "apply",
    capacity: 120, rsvp: 96, status: "approved",
    blurb: "Eight teams, ten hours, one Korean pantry. Build a CPG product. Eat each other's prototypes.",
    location: "Woowa Lab · Mapo-gu" },

  { id: "e18", title: "Global LP Roundtable", host: "Korea Investment Partners", track: "vc", neigh: "gangnam",
    day: "thu", start: "13:00", end: "16:00", format: "Panel", access: "invite",
    capacity: 40, rsvp: 38, status: "approved",
    blurb: "Sovereign and pension LPs from Singapore, UAE and Canada on Korea allocation in 2027.",
    location: "Sage House · Cheongdam" },

  { id: "e19", title: "AI-Native Music Production Demo Day", host: "Riffusion × YG PLUS", track: "ent", neigh: "coex",
    day: "thu", start: "14:00", end: "17:00", format: "Demo Day", access: "open",
    capacity: 500, rsvp: 411, status: "approved",
    blurb: "Six AI-music startups perform live with K-pop producers, then take questions.",
    location: "COEX Auditorium · Hall D" },

  { id: "e20", title: "Scent of Place: A K-Beauty Walking Tour", host: "Tamburins", track: "beauty", neigh: "seongsu",
    day: "thu", start: "16:00", end: "19:00", format: "Workshop", access: "apply",
    capacity: 30, rsvp: 30, status: "approved",
    blurb: "Three flagship visits: Tamburins, Gentle Monster, Hince. Curators host. Aperitif after.",
    location: "Seongsu loop · meet at Tamburins" },

  { id: "e21", title: "Modern Korean × Foodtech Supper Club", host: "Onjium × Yuba", track: "food", neigh: "mapo",
    day: "thu", start: "19:30", end: "23:30", format: "Supper Club", access: "invite",
    capacity: 28, rsvp: 28, status: "approved",
    blurb: "A 12-course tasting paired with three founder pitches between courses.",
    location: "Onjium · Bukchon" },

  // ---- FRIDAY Aug 14 ----
  { id: "e22", title: "POPCON × Koom: IP Buyers' Lunch", host: "UKF × Seoul POPCON", track: "ent", neigh: "coex",
    day: "fri", start: "12:00", end: "14:30", format: "Panel", access: "apply",
    capacity: 250, rsvp: 198, status: "approved",
    blurb: "International IP buyers walking POPCON sit down with Korean studios for a structured matchmaking lunch.",
    location: "COEX Grand Ballroom" },

  { id: "e23", title: "Heritage Brands × Indie Founders", host: "Shiseido Future Beauty", track: "beauty", neigh: "gangnam",
    day: "fri", start: "10:30", end: "12:30", format: "Panel", access: "open",
    capacity: 200, rsvp: 167, status: "approved",
    blurb: "Heritage Japanese and French houses on what they're acquiring — and why it's mostly Korean.",
    location: "Gangnam Finance Center · Hall A" },

  { id: "e24", title: "The Korean K-Wave Index", host: "Bain & Company × Hashed", track: "vc", neigh: "coex",
    day: "fri", start: "15:00", end: "17:00", format: "Panel", access: "open",
    capacity: 400, rsvp: 312, status: "approved",
    blurb: "A new index tracking the global commercial wake of Korean culture. Premiere data drop.",
    location: "COEX Hall E" },

  { id: "e25", title: "Ferment Forward: K-Food's Next Decade", host: "Pulmuone × CJ CheilJedang", track: "food", neigh: "gangdong",
    day: "fri", start: "11:00", end: "13:00", format: "Panel", access: "apply",
    capacity: 150, rsvp: 119, status: "approved",
    blurb: "Beyond kimchi: gochujang, makgeolli, doenjang as the new global functional foods.",
    location: "Foodtech Center · IR Theater" },

  { id: "e26", title: "Founders' Night Out: Han River Cruise", host: "UKF · all tracks", track: "vc", neigh: "sangam",
    day: "fri", start: "20:00", end: "23:30", format: "Mixer", access: "apply",
    capacity: 350, rsvp: 350, status: "approved",
    blurb: "Three hours, one boat, all Koom Week tracks combined. The week's only fully cross-track party.",
    location: "Yeouido Pier 3 · Han River" },

  // ---- SATURDAY Aug 15 ----
  { id: "e27", title: "Liberation Day Brunch · Founders' Reflections", host: "UKF Co-Chairs", track: "vc", neigh: "gangnam",
    day: "sat", start: "10:30", end: "13:00", format: "Breakfast", access: "invite",
    capacity: 80, rsvp: 71, status: "approved",
    blurb: "A quiet morning to close the week. Saeju and Kiha host alumni for a reflection brunch.",
    location: "Sage House · Cheongdam" },

  { id: "e28", title: "Closing Showcase + After-Party", host: "United Korean Founders", track: "ent", neigh: "seongsu",
    day: "sat", start: "20:00", end: "02:00", format: "Showcase", access: "open",
    capacity: 800, rsvp: 612, status: "approved",
    blurb: "Awards. Three live performances. One DJ set. The week, distilled.",
    location: "S-Factory · Seongsu-dong" },
];

// Submission queue for admin moderation view
const PENDING_SUBMISSIONS = [
  { id: "p01", title: "Korean Coffee Wave: Third Place Brands Going Global", host: "Anthracite × Fritz", track: "food", neigh: "mapo",
    day: "thu", start: "15:00", end: "17:00", format: "Panel", access: "open", capacity: 100,
    submittedAt: "2026-06-14", status: "pending",
    blurb: "How Korean specialty coffee is exporting both beans and brand language. Three founders, one Q&A." },
  { id: "p02", title: "Gut Microbiome × K-Beauty: From Inside-Out", host: "Bionic Beauty Labs", track: "beauty", neigh: "gangnam",
    day: "wed", start: "16:00", end: "18:00", format: "Workshop", access: "apply", capacity: 50,
    submittedAt: "2026-06-12", status: "pending",
    blurb: "Probiotics-as-skincare. Live blood-panel analysis. Not for the squeamish." },
  { id: "p03", title: "Late-Night Pitch Karaoke", host: "Anthemis × MUSE", track: "vc", neigh: "gangnam",
    day: "thu", start: "22:00", end: "02:00", format: "Mixer", access: "apply", capacity: 60,
    submittedAt: "2026-06-15", status: "pending",
    blurb: "Pitch your startup. Then sing. The investor decides if you advanced based on... vibes.",
    flag: "Format unclear — does this run after midnight?" },
  { id: "p04", title: "Webtoon Studios Open House", host: "Naver Webtoon", track: "ent", neigh: "sangam",
    day: "fri", start: "14:00", end: "17:00", format: "Showcase", access: "open", capacity: 300,
    submittedAt: "2026-06-10", status: "pending",
    blurb: "Five Naver Webtoon studios open to international buyers and adapting producers." },
  { id: "p05", title: "Vegan Korean Lab", host: "Plant Based Forward", track: "food", neigh: "gangdong",
    day: "wed", start: "10:00", end: "13:00", format: "Workshop", access: "apply", capacity: 40,
    submittedAt: "2026-06-13", status: "rejected",
    blurb: "Build a vegan Korean menu in three hours. Lab kitchen. Twelve teams.",
    flag: "Capacity (40) below minimum (60). Resubmit." },
];

// Sponsor / Speaker directory
const SPONSORS_PLATINUM = [
  { name: "Noom", subtitle: "Founding Partner" },
  { name: "Sage Partners", subtitle: "Founding Partner" },
  { name: "CJ ENM", subtitle: "Title Partner · Entertainment" },
  { name: "Olive Young", subtitle: "Title Partner · Beauty" },
];
const SPONSORS_GOLD = [
  "Amorepacific", "Kakao Ventures", "Mirae Asset", "Altos Ventures",
  "HYBE", "SK Telecom", "Naver D2SF", "Bessemer Venture Partners",
];

const FEATURED_SPEAKERS = [
  { name: "Saeju Jeong",    role: "Co-Chair, UKF · Co-founder, Noom",       portrait: 1, kr: "정세주" },
  { name: "Kiha Lee",       role: "Co-Chair, UKF · Partner, Sage Partners", portrait: 2, kr: "이기하" },
  { name: "Miky Lee",       role: "Vice Chair, CJ ENM",                     portrait: 3, kr: "이미경" },
  { name: "Sora Bae",       role: "Founder, VOS Bio",                       portrait: 4, kr: "배소라" },
  { name: "JC Park",        role: "Head of IP, StudioMonowa",               portrait: 5, kr: "박재찬" },
  { name: "Hyemin Lee, MD", role: "CSO, Cloudglow Therapeutics",            portrait: 6, kr: "이혜민" },
];

Object.assign(window, {
  TRACKS, NEIGHBORHOODS, NEIGHBORHOOD_COORDS, FORMATS, ACCESS, DAYS,
  EVENTS, PENDING_SUBMISSIONS, SPONSORS_PLATINUM, SPONSORS_GOLD, FEATURED_SPEAKERS,
});
