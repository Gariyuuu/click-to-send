# CHANGELOG.md

This changelog is reconstructed from `git log` — no changelog file
existed in the repo before this audit, and no dates are invented beyond
what git itself records.

## Unreleased / current working tree

- **2026-08-06** — Documentation/handoff audit: added the full 17-file
  memory-system documentation (`CLAUDE.md`, `PROJECT_STATE.md`,
  `ARCHITECTURE.md`, `FILE_MAP.md`, `FEATURES.md`, `TASKS.md`,
  `ROADMAP.md`, `DECISIONS.md`, `DATABASE.md`, `API_REFERENCE.md`,
  `UI_SYSTEM.md`, `SECURITY.md`, `TESTING.md`, `DEPLOYMENT.md`,
  `CHANGELOG.md`, `SESSION_LOG.md`, `HANDOFF.md`) at the repo root. No
  application code was changed. Not committed as part of this audit — see
  `PROJECT_STATE.md` for the exact working-tree state.

## Commit history (from `git log`)

- **`8fbe66d`** (2026-08-06) — "Add favicon so the site shows an icon in
  the browser tab." Added an inline SVG data-URI favicon
  (`<link rel="icon" ...>`) to `index.html`. One-line diff.
- **`c6cefa0`** (2026-07-24) — "Initial commit." Added the full initial
  project: `.gitignore`, `README.md`, `api/send-discord.js`,
  `api/send-email.js`, `index.html`, `package-lock.json`, `package.json`,
  `script.js`, `style.css` — 9 files, 455 insertions.

No other commits exist (`git log --oneline` shows exactly these two).
