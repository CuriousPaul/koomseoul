# Festival Event Platform

_Started 2026-05-04 09:33 UTC_

---

## User



## Assistant

I'll dig into this. The user wants a design for **Koom Week Seoul: August 2026** — a decentralized, city-wide tech festival. Given the attached skills (Hi-fi design + Interactive prototype + UKF Design System), this is a hi-fi clickable prototype of the Koom Week event platform.

Let me first explore the design system to understand what's available.

_[tool: list_files]_

_[tool: list_files]_

Before diving in, let me ask a few key questions to scope this properly.

_[tool: questions_v2]_

## User

Questions answered:
- scope: All three, as a connected clickable prototype
- primary_view: Split: map + list side-by-side
- tracks: Yes — VC/Investing as a 4th track
- visual_direction: Festival-mode: bolder type, more red, bigger imagery
- variations: Design canvas with 3 hero/discovery options side-by-side
- interactivity_depth: Working filters, RSVP toggle, schedule builder (real state)
- anti_hoarding: Decide for me
- map_style: 1
- languages: EN/KR toggle in header (only EN content actually fleshed out)
- sample_events: 28
- tweaks: Accent color swap (red → other heritage tones)

## Assistant

I've got everything I need. Let me dig into the design system, then plan and build.

_[tool: update_todos]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

I have the design tokens and components I need. Let me set up the project and start building.

_[tool: copy_files]_

_[tool: copy_starter_component]_

_[tool: copy_starter_component]_

_[tool: snip]_

Now let me start building. I'll create the data layer first, then the styles, then the React app.

_[tool: write_file]_

_[tool: snip]_

Now the styles. I'm building a "festival mode" of UKF — bigger type, more red, bigger imagery, but rooted in their tokens.

_[tool: write_file]_

_[tool: snip]_

Now I'll build the shared components and page modules.

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: snip]_

_[tool: show_html]_

_[tool: snip]_

_[tool: show_html]_

_[tool: get_webview_logs]_

Clean. Let me take a screenshot to verify, then build the design canvas wrapper for the 3 hero variants.

_[tool: save_screenshot]_

_[tool: view_image]_

The hero is rendering — but the title is wrapping aggressively at the narrow viewport. The discovery split-pane is also tight in the iframe. Let me check the discover page and see how it lays out, then build the design canvas with 3 hero variants.

_[tool: save_screenshot]_

[Snipping resolved work]

_[tool: snip]_

_[tool: view_image]_

The discover view looks great — map, filters, and event list all wired up. The list column is squeezed because of the iframe width, but it'll breathe at full size.

The hero text wrapping is too aggressive at narrower viewports. Let me fix that and build the design canvas with 3 hero variants.

_[tool: str_replace_edit]_

[Snipping resolved iterations.]

_[tool: snip]_

Now let me build the design canvas with 3 hero/discovery variants. I'll create a separate file for variant heroes since the user asked for design canvas options for the hero/discovery.

_[tool: read_file]_

_[tool: snip]_

Now let me build the variant explorations file. I'll keep them compact — three different hero treatments composed onto the design canvas.

_[tool: write_file]_

_[tool: snip]_

_[tool: register_assets]_

_[tool: done]_

_[tool: snip]_

_[tool: fork_verifier_agent]_

Built **Koom Week Seoul 2026** as a connected clickable prototype in the UKF design system, festival-mode treatment.

**`Koom Week Seoul.html`** — five linked surfaces:
- **Overview** — black hero, scrolling marquee, four-track grid, opening ceremony feature, speakers, sponsors
- **Discover** — three-pane: filter rail · day-grouped event list · stylized Seoul map with density pins (28 events across 5 days, 6 neighborhoods, 4 tracks; filters and pins are wired)
- **My Schedule** — week-grid timetable + list view, with sector-intentionality conflict detection in the event modal
- **Host** — three-step submission form
- **Admin** — UKF moderation console with approve/reject/reopen flows and a flagged queue

**Tweaks panel** swaps the accent stamp across six Korean heritage tones (Heritage Red, Jangdok Clay, Hanji Mustard, Celadon, Hanok Indigo, Ink-only).

**`Hero Variants.html`** — design canvas with 3 hero directions side-by-side: Editorial Black, Hangul Display (쿰·위크 as the display element), and Magazine Split.

**Caveats / next steps:** Map is an editorial line drawing, not a real Seoul geometry — easy upgrade to GeoJSON. RSVP state is in-memory. Korean copy is only on a few surfaces (KR toggle works in the header but body content is mostly English, per your spec).

