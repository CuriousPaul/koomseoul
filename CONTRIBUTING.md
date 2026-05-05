# Contributing

## Local setup

```bash
npm install
npm run dev
```

## Check your work

```bash
npm run build
npm audit --audit-level=moderate
```

## Project structure

- `src/App.jsx` — page switching and shared state
- `src/pages/` — Home, Discover, Schedule, Host, Admin views
- `src/data.js` — static event and sponsor data
- `src/shared.jsx` — shared header/footer/UI bits
- `src/styles.css` / `src/tokens.css` — styling

## Workflow

1. Create a short-lived branch from `main`.
2. Keep changes focused and doc/code separated when possible.
3. Open a PR against `main` with a clear summary and screenshots only if UI changed.
4. Wait for `npm run build` and `npm audit --audit-level=moderate` to pass before merging.

## Vercel notes

- This is a Vite app, so the build command is `npm run build`.
- Vercel should use `dist` as the output directory.
- Main-branch pushes are the expected deployment path unless the repo is wired differently in Vercel.

## Current prototype limits

- This is a static frontend prototype.
- RSVP, Host, and Admin flows use local React state and in-memory data only.
- No backend, auth, persistence, or real API integrations are present.

## Mobile QA

- Check the header menu, event cards, and form screens on a narrow viewport.
- Verify text wrapping, tap targets, and scroll behavior.
- Confirm no section overflows horizontally.

## Good first tasks

- Fix a small copy or spacing issue.
- Improve one responsive breakpoint.
- Tighten a single shared component.
- Add a missing documentation note.
