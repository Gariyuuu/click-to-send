# CHANGELOG.md

This changelog is reconstructed from `git log` — no changelog file
existed in the repo before this audit, and no dates are invented beyond
what git itself records.

## Unreleased / current working tree

Clean as of 2026-08-07 — no uncommitted changes. (The 17-file
documentation system described below was, at one point, an uncommitted
addition to this section; it has since been committed as `372d3bd` and is
now listed under "Commit history" instead — see the correction note
there.)

## Commit history (from `git log`)

- **`372d3bd`** (2026-08-06, 20:20:07 -0700) — "docs: add full handoff
  documentation system." Added all 17 memory-system files (`CLAUDE.md`,
  `PROJECT_STATE.md`, `ARCHITECTURE.md`, `FILE_MAP.md`, `FEATURES.md`,
  `TASKS.md`, `ROADMAP.md`, `DECISIONS.md`, `DATABASE.md`,
  `API_REFERENCE.md`, `UI_SYSTEM.md`, `SECURITY.md`, `TESTING.md`,
  `DEPLOYMENT.md`, `CHANGELOG.md` (this file), `SESSION_LOG.md`,
  `HANDOFF.md`) — 17 files, 2355 insertions. No application code changed.
  **Correction (2026-08-07 checkpoint pass):** this entry was missing
  until now — the files' content originally (incorrectly) described
  itself as "not committed as part of this audit," which was true only
  until this same commit landed later in that session. See
  `PROJECT_STATE.md` → Git state and `SESSION_LOG.md` → Session 2.
- **`8fbe66d`** (2026-08-06, 03:14:55 -0700) — "Add favicon so the site
  shows an icon in the browser tab." Added an inline SVG data-URI favicon
  (`<link rel="icon" ...>`) to `index.html`. One-line diff.
- **`c6cefa0`** (2026-07-24, 13:06:36 -0700) — "Initial commit." Added the
  full initial project: `.gitignore`, `README.md`, `api/send-discord.js`,
  `api/send-email.js`, `index.html`, `package-lock.json`, `package.json`,
  `script.js`, `style.css` — 9 files, 455 insertions.

No other commits exist (`git log --oneline` shows exactly these three).
