/**
 * Lightweight bilingual dictionary for Koom Seoul.
 *
 * Usage:
 *   import { t } from './i18n.js';
 *   t('hero.browseEvents', lang)  // → '이벤트 둘러보기' or 'Browse Events'
 *
 * `lang` is 'kr' (default) or 'en'. Keys are dot-separated for readability.
 * Falls back to English if a Korean string is missing.
 */

const S = {
  // ─── HEADER / NAV ───────────────────────────────────────────────
  'nav.overview':     { en: 'Overview',     kr: '개요' },
  'nav.discover':     { en: 'Discover',     kr: '이벤트' },
  'nav.schedule':     { en: 'My Schedule',  kr: '내 일정' },
  'nav.host':         { en: 'Host',         kr: '호스팅' },
  'nav.admin':        { en: 'Admin',        kr: '관리자' },
  'nav.submitEvent':  { en: 'Submit an Event', kr: '이벤트 호스팅' },
  'nav.openMenu':     { en: 'Open menu',    kr: '메뉴 열기' },
  'nav.closeMenu':    { en: 'Close menu',   kr: '메뉴 닫기' },
  'nav.goOverview':   { en: 'Go to Koom Week Seoul overview', kr: 'Koom Week Seoul 개요로 이동' },

  // ─── HERO ────────────────────────────────────────────────────────
  'hero.eyebrow':     { en: 'AUG 11 — 15, 2026 · ALL OF SEOUL', kr: '2026년 8월 11일 — 15일 · 서울 전역' },
  'hero.titleHtml':   { en: null, kr: null },  // handled inline (has HTML)
  'hero.subtitle':    { en: 'A decentralized festival of Korean founders, capital, and culture.',
                         kr: '한국 창업자, 자본, 문화가 모이는 탈중앙화 페스티벌.' },
  'hero.lead':        { en: 'Five days. Six neighborhoods. Hundreds of independently hosted events across K-Beauty, K-Entertainment, K-Food, and venture. UKF curates. The city hosts.',
                         kr: '5일간, 6개 동네, 수백 개의 독립 호스팅 이벤트. K-뷰티, K-엔터테인먼트, K-푸드, 벤처까지. UKF가 큐레이션하고, 서울이 무대가 됩니다.' },
  'hero.browseEvents':{ en: 'Browse Events',  kr: '이벤트 둘러보기' },
  'hero.hostEvent':   { en: 'Host an Event',   kr: '이벤트 호스팅하기' },
  'hero.statEvents':  { en: 'events',          kr: '개 이벤트' },
  'hero.statEventsDesc': { en: 'Independently hosted across Seoul', kr: '서울 전역에서 독립 호스팅' },
  'hero.statFoundersDesc': { en: 'Founders, investors, creators expected', kr: '예상 참가자 (창업자·투자자·크리에이터)' },
  'hero.statNeighsDesc': { en: 'Neighborhood hubs · POPCON co-located', kr: '동네 허브 · POPCON 공동 개최' },
  // Hero meta
  'hero.dates':       { en: 'Dates',           kr: '기간' },
  'hero.where':       { en: 'Where',           kr: '장소' },
  'hero.colocated':   { en: 'Co-located with', kr: '공동 개최' },
  'hero.presentedBy': { en: 'Presented by',    kr: '주최' },

  // ─── TRACKS SECTION ──────────────────────────────────────────────
  'tracks.eyebrow':   { en: 'FOUR TRACKS · ONE CITY', kr: '4개 트랙 · 1개 도시' },
  'tracks.heading':   { en: 'Programmed by sector. Distributed by neighborhood.',
                         kr: '섹터별로 기획하고, 동네별로 펼쳐집니다.' },
  'tracks.body':      { en: "UKF doesn't lock you in a convention center. We act as conductor — curating independently hosted events across Seoul's distinct neighborhoods so you build your week sector-first.",
                         kr: "UKF는 컨벤션센터에 여러분을 가두지 않습니다. 지휘자 역할을 하며 — 서울의 다채로운 동네에서 독립 호스팅된 이벤트를 큐레이션하여, 섹터 중심으로 여러분만의 일주일을 설계할 수 있게 합니다." },
  'tracks.seeAll':    { en: 'See all events →', kr: '전체 이벤트 보기 →' },
  'tracks.eventsSuffix': { en: ' events →', kr: '개 이벤트 →' },

  // Track card bodies
  'tracks.beauty.body': { en: 'Indie founders, biotech ingredients, retail buyers. Cloudglow ingredients move from clinic to counter.',
                           kr: '인디 창업자, 바이오 기술 성분, 리테일 바이어. 클라우드글로우 성분이 클리닉에서 카운터로.' },
  'tracks.ent.body':    { en: "Webtoon-to-screen, fan-tech, AI music production. Live IP buyers walking POPCON sit down with studios.",
                           kr: '웹툰 영상화, 팬 테크, AI 음악 제작. POPCON에 온 글로벌 IP 바이어가 스튜디오와 만납니다.' },
  'tracks.food.body':   { en: "Foodtech demos, freezer-aisle exports, supper clubs at Seoul's modern Korean restaurants.",
                           kr: '푸드테크 데모, 냉동 수출, 서울의 모던 한식 레스토랑에서의 수퍼클럽.' },
  'tracks.vc.body':     { en: 'First-check mixers, Series-A pitch floors, sovereign LP roundtables. The capital side of the festival.',
                           kr: '시드 믹서, 시리즈A 피치 플로어, 국부 펀드 LP 라운드테이블. 페스티벌의 자본 파트.' },

  // ─── OPENING CEREMONY ────────────────────────────────────────────
  'opening.eyebrow':  { en: 'OPENING NIGHT · TUE AUG 11', kr: '개막식 · 8월 11일 화요일' },
  'opening.heading':  { en: 'The Next\nLeap of UKF.', kr: 'UKF의\n다음 도약.' },
  'opening.body':     { en: 'UKF Co-Chairs Saeju Jeong and Kiha Lee open Koom Week Seoul with a keynote on the global Korean founder flywheel — and announce the first cohort of the UKF Foundation.',
                         kr: 'UKF 공동 의장 정세주, 이기하가 글로벌 한국 창업자 플라이휠에 대한 기조연설로 Koom Week Seoul을 열고, UKF 파운데이션 첫 기수를 발표합니다.' },
  'opening.rsvp':     { en: 'RSVP for Opening', kr: '개막식 참석하기' },
  'opening.recap':    { en: 'Watch 2025 Recap', kr: '2025 하이라이트 보기' },
  'opening.curated':  { en: 'This week, hand-picked', kr: '이번 주 추천 이벤트' },

  // ─── SPEAKERS ────────────────────────────────────────────────────
  'speakers.eyebrow': { en: 'FEATURED SPEAKERS', kr: '주요 연사' },
  'speakers.heading': { en: 'The people in the rooms.', kr: '무대에 오르는 사람들.' },
  'speakers.seeAll':  { en: 'See all 142 speakers →', kr: '전체 연사 142명 보기 →' },

  // ─── SPONSORS ────────────────────────────────────────────────────
  'sponsors.eyebrow': { en: 'SPONSORS & PARTNERS', kr: '스폰서 & 파트너' },
  'sponsors.heading': { en: 'Built with the houses\nthat built the wave.', kr: '한류를 만든 기관들이\n함께합니다.' },
  'sponsors.founding':{ en: 'Founding · Title', kr: '파운딩 · 타이틀' },
  'sponsors.gold':    { en: 'Gold', kr: '골드' },

  // ─── HOST CTA ────────────────────────────────────────────────────
  'cta.heading':      { en: 'Hosting something during Koom Week?', kr: 'Koom Week에 호스팅하실 이벤트가 있나요?' },
  'cta.body':         { en: 'Submit your event for curation by the UKF team. Approved events appear in the official directory, get email amplification, and access to attendee matchmaking.',
                         kr: '이벤트를 제출해 주세요. UKF 팀이 검토 후 공식 디렉토리에 등록합니다. 승인된 이벤트는 이메일 홍보와 참가자 매칭 혜택을 받습니다.' },
  'cta.start':        { en: 'Start a Submission →', kr: '이벤트 제안하기 →' },
  'cta.guidelines':   { en: 'Read Host Guidelines', kr: '호스트 가이드라인' },

  // ─── FOOTER ──────────────────────────────────────────────────────
  'footer.tagline':   { en: 'Koom Week Seoul is presented by United Korean Founders. The world\'s largest community for Korean founders, entrepreneurs, and creators.',
                         kr: 'Koom Week Seoul은 United Korean Founders가 주최합니다. 전 세계 한국 창업자, 기업가, 크리에이터를 위한 가장 큰 커뮤니티.' },
  'footer.colKoom':   { en: 'Koom Week', kr: 'Koom Week' },
  'footer.colHosts':  { en: 'For Hosts', kr: '호스트' },
  'footer.colNetwork':{ en: 'UKF Network', kr: 'UKF 네트워크' },
  'footer.overview':  { en: 'Overview', kr: '개요' },
  'footer.discoverEvents': { en: 'Discover Events', kr: '이벤트 탐색' },
  'footer.mySchedule':{ en: 'My Schedule', kr: '내 일정' },
  'footer.speakers':  { en: 'Speakers', kr: '연사' },
  'footer.sponsors':  { en: 'Sponsors', kr: '스폰서' },
  'footer.submitEvent': { en: 'Submit an Event', kr: '이벤트 제안하기' },
  'footer.hostGuides':{ en: 'Host Guidelines', kr: '호스트 가이드라인' },
  'footer.curation':  { en: 'Curation Criteria', kr: '큐레이션 기준' },
  'footer.faq':       { en: 'FAQ', kr: '자주 묻는 질문' },
  'footer.aboutUkf':  { en: 'About UKF', kr: 'UKF 소개' },
  'footer.membership':{ en: 'Membership', kr: '멤버십' },
  'footer.copyright': { en: '© 2026 United Korean Founders. Koom Week Seoul Aug 11–15, 2026.',
                         kr: '© 2026 United Korean Founders. Koom Week Seoul 2026년 8월 11–15일.' },
  'footer.legal':     { en: 'Privacy · Terms · Code of Conduct', kr: '개인정보처리방침 · 이용약관 · 행동강령' },

  // ─── DISCOVER PAGE ───────────────────────────────────────────────
  'discover.day':     { en: 'Day', kr: '요일' },
  'discover.track':   { en: 'Track', kr: '트랙' },
  'discover.neighborhood': { en: 'Neighborhood', kr: '동네' },
  'discover.access':  { en: 'Access', kr: '참여 방식' },
  'discover.allDays': { en: 'All days', kr: '전체 기간' },
  'discover.clearFilters': { en: 'Clear all filters ×', kr: '필터 전체 해제 ×' },
  'discover.event':   { en: ' event', kr: '개 이벤트' },
  'discover.events':  { en: ' events', kr: '개 이벤트' },
  'discover.all':     { en: 'All', kr: '전체' },
  'discover.emptyTitle': { en: 'No events match your filters.', kr: '조건에 맞는 이벤트가 없습니다.' },
  'discover.emptyBody':  { en: 'Try clearing some filters in the rail to see more events.', kr: '필터를 조정하면 더 많은 이벤트를 볼 수 있습니다.' },
  'discover.waitlist':{ en: 'Waitlist', kr: '대기자' },
  'discover.details': { en: 'Details →', kr: '상세보기 →' },
  'discover.inSchedule': { en: '✓ In your schedule', kr: '✓ 내 일정에 추가됨' },
  'discover.conflict':{ en: '⚠ Conflict', kr: '⚠ 시간 겹침' },
  // Map
  'map.clickToFilter':{ en: 'Click a neighborhood to filter', kr: '동네를 클릭하여 필터' },
  'map.legend':       { en: 'Reading the map', kr: '지도 안내' },
  'map.density':      { en: 'Pin size = event density', kr: '핀 크기 = 이벤트 밀도' },
  'map.selected':     { en: 'Selected neighborhood', kr: '선택된 동네' },
  'map.hoverClick':   { en: 'Hover for label · click to filter', kr: '호버로 이름 확인 · 클릭으로 필터' },
  // Modal
  'modal.conflictTitle': { en: 'Sector Intentionality — Time Conflict', kr: '시간 겹침 안내' },
  'modal.conflictBody':  { en: "This event overlaps with one already on your schedule. UKF's anti-hoarding protocol prevents you from RSVPing to two simultaneous events. Remove the conflicting event first.",
                            kr: '이 이벤트는 이미 내 일정에 있는 이벤트와 시간이 겹칩니다. 동시간대 이벤트 중복 참석을 방지하기 위해, 먼저 기존 이벤트를 제거해 주세요.' },
  'modal.when':       { en: 'When', kr: '시간' },
  'modal.where':      { en: 'Where', kr: '장소' },
  'modal.hostedBy':   { en: 'Hosted by', kr: '호스트' },
  'modal.capacity':   { en: 'Capacity', kr: '수용 인원' },
  'modal.guests':     { en: 'guests', kr: '명' },
  'modal.confirmed':  { en: 'confirmed', kr: '명 확정' },
  'modal.aboutEvent': { en: 'About this event', kr: '이벤트 소개' },
  'modal.speakers':   { en: 'Speakers', kr: '연사' },
  'modal.curationNote':{ en: 'Curation note', kr: '큐레이션 노트' },
  'modal.curationBody':{ en: 'This event was reviewed and approved by the UKF programming team on June 18, 2026. RSVPs are subject to host approval — your profile and stated goals are visible to the host when you apply.',
                          kr: '이 이벤트는 2026년 6월 18일 UKF 프로그래밍 팀의 검토를 거쳤습니다. 참가 신청 시 호스트가 프로필과 참가 목적을 확인할 수 있습니다.' },
  'modal.removeSchedule': { en: '✓ Remove from schedule', kr: '✓ 내 일정에서 제거' },
  'modal.rsvp':       { en: 'RSVP', kr: '참석하기' },
  'modal.applyAttend':{ en: 'Apply to Attend', kr: '참가 신청' },
  'modal.requestInvite': { en: 'Request Invite', kr: '초대 요청' },
  'modal.joinWaitlist': { en: 'Join Waitlist', kr: '대기자 등록' },
  'modal.capacityLabel': { en: 'Capacity', kr: '수용 인원' },

  // ─── SCHEDULE PAGE ───────────────────────────────────────────────
  'schedule.eyebrow': { en: 'YOUR KOOM WEEK', kr: '나의 KOOM WEEK' },
  'schedule.heading': { en: 'My Schedule.', kr: '내 일정.' },
  'schedule.export':  { en: 'Export to .ics', kr: '.ics 내보내기' },
  'schedule.addEvents': { en: '+ Add events', kr: '+ 이벤트 추가' },
  'schedule.emptyTitle': { en: 'Your schedule is empty.', kr: '아직 일정이 비어 있습니다.' },
  'schedule.emptyBody':  { en: "Browse events on the Discover page and tap RSVP to add them here. UKF's sector intentionality protocol will warn you about time conflicts as you build.",
                           kr: '이벤트 탐색에서 RSVP를 눌러 일정을 추가해 보세요. 시간이 겹치는 이벤트는 자동으로 알려드립니다.' },
  'schedule.browseEvents': { en: 'Browse Events →', kr: '이벤트 둘러보기 →' },
  'schedule.statEvents': { en: 'Events', kr: '이벤트' },
  'schedule.statTracks': { en: 'Tracks covered', kr: '트랙' },
  'schedule.statNeighs': { en: 'Neighborhoods', kr: '동네' },
  'schedule.statDays':  { en: 'Active days', kr: '참여 일수' },
  'schedule.time':     { en: 'TIME', kr: '시간' },
  'schedule.listView': { en: 'List view', kr: '목록 보기' },
  'schedule.remove':   { en: 'Remove', kr: '제거' },
  'schedule.inSchedule': { en: '✓ In your schedule', kr: '✓ 내 일정에 추가됨' },

  // ─── HOST FORM ───────────────────────────────────────────────────
  'host.eyebrow':     { en: 'HOST AN EVENT · STEP', kr: '이벤트 호스팅 ·' },
  'host.of':          { en: 'OF 3', kr: '/ 3 단계' },
  'host.heading':     { en: 'Submit your event for Koom Week.', kr: 'Koom Week 이벤트를 제안해 주세요.' },
  'host.sub':         { en: 'Submissions are saved locally in this prototype and routed into the Admin review queue for UKF ops demo review.',
                         kr: '제안은 이 프로토타입에서 로컬로 저장되며, UKF 운영 데모 검토 큐로 전달됩니다.' },
  'host.alertBefore': { en: 'Before submitting:', kr: '제출 전 확인:' },
  // Step 1
  'host.step1Title':  { en: 'The basics', kr: '기본 정보' },
  'host.eventTitle':  { en: 'Event title', kr: '이벤트 제목' },
  'host.eventTitlePh':{ en: 'e.g. Cloudglow Founders Breakfast', kr: '예: 클라우드글로우 창업자 브렉퍼스트' },
  'host.hostLabel':   { en: 'Host (company / VC / brand)', kr: '호스트 (기업 / VC / 브랜드)' },
  'host.hostPh':      { en: 'e.g. Olive Young N Seongsu', kr: '예: 올리브영 N 성수' },
  'host.opsEmail':    { en: 'Ops contact email', kr: '운영 연락처 이메일' },
  'host.track':       { en: 'Track', kr: '트랙' },
  'host.format':      { en: 'Format', kr: '형식' },
  'host.blurb':       { en: 'Public blurb', kr: '공개 소개글' },
  'host.blurbPh':     { en: 'One short paragraph. What is it, who should come, why now?', kr: '짧은 문단으로 소개해 주세요. 무엇인지, 누가 와야 하는지, 왜 지금인지.' },
  'host.characters':  { en: 'characters', kr: '자' },
  // Step 2
  'host.step2Title':  { en: 'When & where', kr: '시간 및 장소' },
  'host.day':         { en: 'Day', kr: '요일' },
  'host.start':       { en: 'Start', kr: '시작' },
  'host.end':         { en: 'End', kr: '종료' },
  'host.neighborhood':{ en: 'Neighborhood', kr: '동네' },
  'host.venue':       { en: 'Venue address / note', kr: '장소 주소 / 비고' },
  'host.venuePh':     { en: 'e.g. 4F Salon, Olive Young N Seongsu', kr: '예: 올리브영 N 성수 4F 살롱' },
  // Step 3
  'host.step3Title':  { en: 'Audience & capacity', kr: '참가자 및 수용 인원' },
  'host.capacity':    { en: 'Capacity', kr: '수용 인원' },
  'host.capacityMin': { en: 'Minimum 60 for official directory listing.', kr: '공식 디렉토리 등록을 위해 최소 60명 이상이어야 합니다.' },
  'host.accessType':  { en: 'Access type', kr: '참여 방식' },
  'host.targetAudience': { en: 'Target audience', kr: '타겟 참가자' },
  'host.audiencePh':  { en: 'Who is the right room for this event?', kr: '이 이벤트에 적합한 참가자는 누구인가요?' },
  'host.reviewPreview': { en: 'Review preview', kr: '제안 미리보기' },
  'host.untitledEvent': { en: 'Untitled event', kr: '제목 없는 이벤트' },
  'host.hostTbd':     { en: 'Host TBD', kr: '호스트 미정' },
  // Host form validation
  'host.err.titleRequired':     { en: 'Event title is required.', kr: '이벤트 제목을 입력해 주세요.' },
  'host.err.hostRequired':      { en: 'Host name is required.', kr: '호스트 이름을 입력해 주세요.' },
  'host.err.emailRequired':     { en: 'Contact email is required for ops follow-up.', kr: '운영 연락처 이메일을 입력해 주세요.' },
  'host.err.emailInvalid':      { en: 'Use a valid email address.', kr: '올바른 이메일 주소를 입력해 주세요.' },
  'host.err.blurbRequired':     { en: 'Public blurb is required.', kr: '공개 소개글을 입력해 주세요.' },
  'host.err.blurbTooLong':      { en: 'Keep the public blurb under 280 characters.', kr: '공개 소개글은 280자 이내로 작성해 주세요.' },
  'host.err.locationRequired':  { en: 'Venue or location note is required.', kr: '장소를 입력해 주세요.' },
  'host.err.audienceRequired':  { en: 'Target audience is required.', kr: '타겟 참가자를 입력해 주세요.' },
  'host.err.capacityMin':       { en: 'Capacity must be at least 60.', kr: '수용 인원은 최소 60명 이상이어야 합니다.' },
  'host.err.endTime':           { en: 'End time must be after start time.', kr: '종료 시간은 시작 시간 이후여야 합니다.' },
  // Host buttons
  'host.back':        { en: '← Back', kr: '← 이전' },
  'host.continue':    { en: 'Continue →', kr: '다음 →' },
  'host.submitReview':{ en: 'Submit for review', kr: '검토 요청하기' },
  // Supabase note
  'host.supabaseNote': { en: 'Supabase can power the shared review queue when configured; otherwise this prototype falls back to browser localStorage.',
                          kr: 'Supabase가 연동되면 공유 검토 큐를 사용합니다. 연동 전에는 브라우저 localStorage를 사용합니다.' },
  // Success
  'host.successTitle': { en: 'Submission received.', kr: '제안이 접수되었습니다.' },
  'host.successBody':  { en: 'Your proposal is now in the UKF operations review queue as',
                          kr: '제안이 UKF 운영팀 검토 큐에 접수되었습니다. ID:' },
  'host.successStatus': { en: 'Status', kr: '상태' },
  'host.successSubmitted': { en: 'Submitted', kr: '제출일' },
  'host.successHost': { en: 'Host', kr: '호스트' },
  'host.submitAnother': { en: 'Submit another', kr: '다시 제안하기' },
  'host.reviewAdmin': { en: 'Review in Admin →', kr: '관리자에서 확인 →' },
  'host.backDiscover': { en: 'Back to Discover', kr: '이벤트 둘러보기' },

  // ─── ADMIN PAGE ──────────────────────────────────────────────────
  'admin.badge':      { en: 'UKF Admin', kr: 'UKF 관리자' },
  'admin.heading':    { en: 'Programming\nConsole.', kr: '프로그래밍\n콘솔.' },
  'admin.submissions': { en: 'Submissions', kr: '제안' },
  'admin.published':  { en: 'Published Events', kr: '게시된 이벤트' },
  'admin.hosts':      { en: 'Hosts', kr: '호스트' },
  'admin.attendees':  { en: 'Attendees', kr: '참가자' },
  'admin.sponsors':   { en: 'Sponsors', kr: '스폰서' },
  'admin.thisWeek':   { en: 'This week', kr: '이번 주' },
  'admin.newSubs':    { en: 'New submissions', kr: '새 제안' },
  'admin.needsChanges': { en: 'Needs changes', kr: '수정 필요' },
  'admin.publishedLabel': { en: 'Published', kr: '게시됨' },
  'admin.prototypeStore': { en: 'Prototype store', kr: '프로토타입 스토어' },
  'admin.queueEyebrow': { en: 'SUBMISSION QUEUE', kr: '제안 큐' },
  'admin.reviewHeading': { en: 'Review & publish.', kr: '검토 및 게시.' },
  'admin.reviewSub':  { en: 'Host submissions use Supabase when configured, with localStorage fallback for prototype/offline mode.',
                         kr: 'Supabase 연동 시 공유 큐를 사용하며, 연동 전에는 localStorage를 사용합니다.' },
  // Tabs
  'admin.tabSubmitted':    { en: 'Submitted', kr: '접수됨' },
  'admin.tabNeedsChanges': { en: 'Needs changes', kr: '수정 필요' },
  'admin.tabApproved':     { en: 'Approved', kr: '승인됨' },
  'admin.tabPublished':    { en: 'Published', kr: '게시됨' },
  'admin.tabRejected':     { en: 'Rejected', kr: '반려됨' },
  'admin.tabAll':          { en: 'All', kr: '전체' },
  // Security warning
  'admin.securityWarning': { en: '⚠ Security warning:',
                              kr: '⚠ 보안 경고:' },
  'admin.securityBody':    { en: 'Supabase is connected with demo-only RLS policies. Anyone with the project URL can read, update, or delete all submissions. Apply docs/supabase-auth-rls.sql and set up admin authentication before any public launch. See docs/supabase-production-checklist.md for steps.',
                              kr: 'Supabase가 데모용 RLS 정책으로 연결되어 있습니다. 프로젝트 URL을 아는 누구나 모든 제안을 읽고, 수정하고, 삭제할 수 있습니다. 공개 전에 docs/supabase-auth-rls.sql을 적용하고 관리자 인증을 설정하세요.' },
  // Prototype note
  'admin.prototypeNote': { en: 'Prototype note:', kr: '프로토타입 안내:' },
  'admin.connectedNote': { en: 'Connected to Supabase backend. Data persists across devices and sessions.',
                            kr: 'Supabase에 연결됨. 여러 기기와 세션에서 데이터가 유지됩니다.' },
  'admin.localNote':     { en: 'Using localStorage — data stays in this browser only. Connect Supabase for shared persistence.',
                            kr: 'localStorage 사용 중 — 데이터가 이 브라우저에만 저장됩니다. Supabase를 연동하면 여러 기기에서 공유됩니다.' },
  'admin.resetDemo':     { en: 'Reset demo queue', kr: '데모 큐 초기화' },
  'admin.emptyQueue':    { en: 'Nothing in this queue.', kr: '이 큐에 항목이 없습니다.' },
  // Card labels
  'admin.dayTime':     { en: 'Day · Time', kr: '요일 · 시간' },
  'admin.neighborhood':{ en: 'Neighborhood', kr: '동네' },
  'admin.capacity':    { en: 'Capacity', kr: '수용 인원' },
  'admin.audience':    { en: 'Audience:', kr: '타겟 참가자:' },
  'admin.venue':       { en: 'Venue:', kr: '장소:' },
  'admin.opsContact':  { en: 'Ops contact:', kr: '운영 연락처:' },
  'admin.auditHistory':{ en: 'Audit history', kr: '이력' },
  'admin.submittedAt': { en: 'Submitted', kr: '제출일' },
  // Card action buttons
  'admin.approve':     { en: '✓ Approve', kr: '✓ 승인' },
  'admin.requestChanges': { en: 'Request changes', kr: '수정 요청' },
  'admin.reject':      { en: 'Reject', kr: '반려' },
  'admin.markResubmitted': { en: 'Mark resubmitted', kr: '재제출 처리' },
  'admin.publishDir':  { en: 'Publish to directory →', kr: '디렉토리에 게시 →' },
  'admin.reopen':      { en: 'Reopen', kr: '재개' },
  'admin.liveDiscover': { en: 'Live in Discover', kr: 'Discover에 게시됨' },
  'admin.unpublish':   { en: 'Unpublish', kr: '게시 취소' },
};

/**
 * Look up a translation key for the given language.
 * Falls back to English if the Korean string is missing.
 */
export function t(key, lang = 'kr') {
  const entry = S[key];
  if (!entry) return key;
  return entry[lang] ?? entry.en ?? key;
}

/**
 * Return ACCESS label for current language.
 * (Used for structured data in data.js)
 */
export const ACCESS_LABELS = {
  open:   { en: 'Open to Public', kr: '누구나 참가' },
  apply:  { en: 'Apply to Attend', kr: '참가 신청' },
  invite: { en: 'Invite Only',     kr: '초대 전용' },
};

export function accessLabel(id, lang = 'kr') {
  return ACCESS_LABELS[id]?.[lang] ?? ACCESS_LABELS[id]?.en ?? id;
}

/**
 * Submission status labels (bilingual)
 */
export const STATUS_LABELS = {
  submitted:     { en: 'Submitted',     kr: '접수됨' },
  needs_changes: { en: 'Needs changes', kr: '수정 필요' },
  approved:      { en: 'Approved',      kr: '승인됨' },
  rejected:      { en: 'Rejected',      kr: '반려됨' },
  published:     { en: 'Published',     kr: '게시됨' },
};

export function statusLabel(status, lang = 'kr') {
  return STATUS_LABELS[status]?.[lang] ?? STATUS_LABELS[status]?.en ?? status;
}
