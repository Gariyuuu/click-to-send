# CHANGELOG.md

This changelog is reconstructed from `git log` — no changelog file
existed in the repo before this audit, and no dates are invented beyond
what git itself records.

## Unreleased / current working tree

Clean as of 2026-08-17 (re-confirmed during an onboard-mode doc audit;
`git status` → "nothing to commit, working tree clean").

## Commit history (from `git log`)

- **`e645ea5`** (merge, 2026-08-16) — "Merge branch 'chore/polish' into
  main," merging `5888b87` (below) into `main`. No content of its own
  beyond the merge.
- **`5888b87`** (2026-08-16) — "feat(ui): add button press and
  success-stamp micro-interactions." Added `setStatus()` in `script.js`
  (replacing direct `statusEl.textContent` assignment) so a successful
  send can add an `fx-stamp` CSS class; added a `button:not(:disabled):active
  { transform: scale(0.96) }` press effect and an `fx-stamp-in` keyframe
  animation (credited in a code comment as adapted from the MIT-licensed
  "Rubber-Stamp" effect at text-effects.colorion.co, trimmed to a single
  non-looping pass) to `style.css`, both gated behind
  `@media (prefers-reduced-motion: reduce)` fallbacks that disable the
  animation/transform.
- **`45ac6e6`** (2026-08-14) — "Add og.png so the OpenGraph image
  resolves." Added the binary `og.png` (60466 bytes) referenced by the
  `og:image`/`twitter:image` meta tags added in `97f51cd`.
- **`e53d99b`** (merge, 2026-08-14) — "Merge branch 'chore/metadata-og'
  into main," merging `97f51cd` (below) into `main`.
- **`97f51cd`** (2026-08-14) — "chore: add OpenGraph and Twitter card meta
  tags." Added a `<meta name="description">` plus `og:title`,
  `og:description`, `og:image`, `og:url`, `og:type`, and
  `twitter:card`/`twitter:title`/`twitter:description`/`twitter:image`
  tags to `index.html`'s `<head>`, all pointing at
  `https://click-to-send.vercel.app` / `.../og.png`.
- **`a428ee5`** (2026-08-07) — "docs: final transfer checkpoint — fix
  stale commit-status claim." The 2026-08-07 doc-checkpoint session's
  commit of its corrections to `PROJECT_STATE.md`/`TASKS.md`/
  `CHANGELOG.md`/`SESSION_LOG.md`/`HANDOFF.md` (see `SESSION_LOG.md` →
  Session 2). No application code changed.
- **`372d3bd`** (2026-08-06, 20:20:07 -0700) — "docs: add full handoff
  documentation system." Added all 17 memory-system files (`CLAUDE.md`,
  `PROJECT_STATE.md`, `ARCHITECTURE.md`, `FILE_MAP.md`, `FEATURES.md`,
  `TASKS.md`, `ROADMAP.md`, `DECISIONS.md`, `DATABASE.md`,
  `API_REFERENCE.md`, `UI_SYSTEM.md`, `SECURITY.md`, `TESTING.md`,
  `DEPLOYMENT.md`, `CHANGELOG.md` (this file), `SESSION_LOG.md`,
  `HANDOFF.md`) — 17 files, 2355 insertions. No application code changed.
- **`8fbe66d`** (2026-08-06, 03:14:55 -0700) — "Add favicon so the site
  shows an icon in the browser tab." Added an inline SVG data-URI favicon
  (`<link rel="icon" ...>`) to `index.html`. One-line diff.
- **`c6cefa0`** (2026-07-24, 13:06:36 -0700) — "Initial commit." Added the
  full initial project: `.gitignore`, `README.md`, `api/send-discord.js`,
  `api/send-email.js`, `index.html`, `package-lock.json`, `package.json`,
  `script.js`, `style.css` — 9 files, 455 insertions.

**Onboard-mode note (2026-08-17):** the previous version of this file
stopped at `372d3bd`/`8fbe66d`/`c6cefa0` — six real commits (one doc-fix
commit plus five feature/polish commits touching `index.html`, `script.js`,
`style.css`, and adding `og.png`) had landed since and were undocumented
here. Backfilled from `git log` this pass; see `SESSION_LOG.md` → Session 3.
