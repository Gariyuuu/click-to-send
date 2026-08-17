# PROJECT_STATE.md — Exact Handoff Snapshot

**This file describes the state of the repository at one specific moment.**
It will go stale the instant more work happens — update it after every
meaningful session (see `CLAUDE.md` → Permanent rules).

## Audit timestamp

- **Audit performed:** 2026-08-06 (documentation/handoff audit — a
  from-scratch build of the full 17-file memory system; no product code
  was changed).
- **Re-confirmed at "final account-switch checkpoint" pass:** same session,
  2026-08-06 (git state re-checked immediately before writing this file;
  nothing changed between the initial inspection and this checkpoint).
- **Re-verified at a second, later "final transfer checkpoint" pass:**
  2026-08-07 (new session, cold start — no memory of the 2026-08-06
  session). Re-read all 17 files against the actual current code
  (`index.html`, `script.js`, `api/send-email.js`, `api/send-discord.js`,
  `package.json`), re-ran `git status`/`git log`/`git fetch origin`, and
  re-grepped for secrets. Found and fixed one stale claim (see below) —
  no other drift between the docs and the actual code was found.
- **Re-verified at a third pass ("onboard" mode), 2026-08-17:** cold
  start again. Six real commits had landed since the 2026-08-07 checkpoint
  (see Git state below) touching `index.html`, `script.js`, `style.css`,
  and adding `og.png` — none of it reflected in the docs until this pass.
  Re-ran `git log`/`git status`, diffed every changed file against what
  `372d3bd`-era docs described, re-ran `npx vercel project inspect
  click-to-send` and `npx vercel inspect
  https://click-to-send.vercel.app` (both live, read-only checks, no
  deploy performed). Fixed the drift in `CHANGELOG.md`, `FILE_MAP.md`,
  `UI_SYSTEM.md`, `CLAUDE.md`, this file, `TASKS.md`, and `HANDOFF.md` —
  see `SESSION_LOG.md` → Session 3.

## Git state

- **Branch:** `main` (only branch that exists, locally or on `origin` —
  confirmed via `git branch -a`).
- **Tracking:** `origin/main` → `https://github.com/Gariyuuu/click-to-send.git`.
  `git status` on 2026-08-17 reports "up to date with 'origin/main'" — not
  re-confirmed with `git fetch origin` this pass (last explicit fetch
  confirmation was 2026-08-07).
- **Latest commit:** `e645ea5` — "Merge branch 'chore/polish' into main"
  (2026-08-16), merging `5888b87` ("feat(ui): add button press and
  success-stamp micro-interactions"). Confirmed via `git log
  --oneline --all --graph` on 2026-08-17.
- **Commits since the 2026-08-07 checkpoint** (`a428ee5` → `e645ea5`, 6
  commits, none of them previously reflected in this file): `a428ee5`
  (docs-only, the 2026-08-07 checkpoint's own commit), `97f51cd`/`e53d99b`
  (OpenGraph + Twitter card meta tags in `index.html`), `45ac6e6` (added
  `og.png`), `5888b87`/`e645ea5` (button press + success-stamp CSS/JS
  micro-interactions). Full detail: `CHANGELOG.md`.
- **Earlier commits:** `372d3bd` — "docs: add full handoff documentation
  system" (2026-08-06 20:20:07 -0700, 17 files, 2355 insertions);
  `8fbe66d` — "Add favicon so the site shows an icon in the browser tab"
  (2026-08-06); `c6cefa0` — "Initial commit" (2026-07-24).
- **Working tree as of 2026-08-17:** **Clean.** `git status` reports
  "nothing to commit, working tree clean."
- **Node modules / build artifacts:** `node_modules/` exists locally
  (containing only `nodemailer`) and is correctly gitignored; not part of
  git state.

## Active objective

The 2026-08-17 session's objective was also **documentation only**: an
onboard-mode pass to catch up the memory system with six real commits
(feature/polish work — OG meta tags, `og.png`, button micro-interactions —
plus one prior doc-checkpoint commit) that had landed since the last
verification on 2026-08-07 without being reflected in the docs. No
application code was changed by this pass. (Original objective, 2026-08-06:
build a complete 17-file handoff/memory-doc system for this repo from
scratch, matching sibling projects `chamber-seven`/`buildstrike-arena`.)

## Last completed task

**DOC-002 (2026-08-17):** re-synced the memory system against six
undocumented commits — `CHANGELOG.md` backfilled with the missing commit
entries, `FILE_MAP.md`/`UI_SYSTEM.md`/`CLAUDE.md`/this file updated to
describe `og.png` and the button/status micro-interactions, and the
deployment claim re-confirmed live (see `DEPLOYMENT.md`). See
`SESSION_LOG.md` → Session 3 for the exact commands run.

Prior: full repository audit (source files, `package.json`/
`package-lock.json`, `.env.example`, `.vercel/project.json`, `.gitignore`,
`README.md`, git history, and a read-only Vercel CLI inspection of the
live deployment) and creation of all 17 original documentation files
(2026-08-06).

## Current unfinished task

**`T-001` — no active task.** Nothing is in progress or queued. (`T-001`
is this memory system's stable ID for the "nothing in progress" state,
kept identical across `CLAUDE.md`/`PROJECT_STATE.md`/`TASKS.md`/
`HANDOFF.md`; it does not name an application task.) Last completed:
`DOC-002` (this pass). Unstarted backlog: `TASK-101` through `TASK-104` in
`TASKS.md`. If a next session picks this up, check `git log --oneline -5`
against the "Latest commit" above first — this file only stays accurate
until the next commit lands.

## What works (verified this audit)

- **Static frontend** (`index.html`, `style.css`, `script.js`) — renders a
  single dark card with 4 inputs and 2 buttons; verified by reading the
  full source of all three files. Client-side validation (empty
  message/recipient/passcode checks) is present and correctly wired to
  disable buttons and show status text during a request.
- **`POST /api/send-email`** — full validation chain present: method
  check → env-var-configured check → passcode check → message-presence
  check → email-format regex check → `nodemailer` Gmail SMTP send inside a
  `try/catch` → JSON response. Verified by reading the complete file
  (`api/send-email.js`, 50 lines). **Runtime behavior (does an email
  actually arrive) was NOT tested this audit** — no real Gmail
  credentials were exercised; this is Verified-by-code-reading, not
  Verified-by-execution. See `TESTING.md`.
- **`POST /api/send-discord`** — full validation chain present: method →
  env-var check → passcode → message presence → array-of-userIds presence
  → dedup via `Set` → `MAX_RECIPIENTS = 20` cap → per-ID snowflake regex
  (`^\d{15,20}$`) → sequential per-recipient DM send (open channel, then
  post message) via direct `fetch` calls to the Discord REST API, with
  per-recipient success/failure collected into a `results` array.
  Verified by reading the complete file (`api/send-discord.js`, 79 lines).
  **Runtime behavior (does a DM actually arrive) was NOT tested this
  audit** — no real Discord bot token was exercised. See `TESTING.md`.
- **Deployment exists, is live, and reflects current `HEAD`** — re-checked
  2026-08-17 (not just carried forward from the 2026-08-06 audit). `npx
  vercel inspect https://click-to-send.vercel.app` shows status "Ready"
  for deployment `dpl_J4xcL6UWVWJAWuXWePYnAfWRk1Za`, created 2026-08-16
  18:33:36 -0700 — that timestamp matches `script.js`/`style.css`'s local
  file mtimes to the minute, i.e. someone ran `vercel --prod` right after
  the `5888b87`/`e645ea5` micro-interactions commit, so production is
  current, not stale. **Still true as of this pass: no `vercel --prod` run
  is automatically triggered by future pushes** — whoever deploys next
  still has to run it manually; don't assume a later `git push` alone
  reached production without re-running `npx vercel inspect`.
- **No GitHub auto-deploy** — re-confirmed 2026-08-17 via `npx vercel
  project inspect click-to-send`, which still shows no "Git Repository"
  section (a connected project would show one; compare to `chamber-seven`,
  which does), and no vercel.json or `.github/workflows/` exist in this
  repo either. See `DEPLOYMENT.md` for full evidence — the manual-deploy
  requirement documented there is unchanged.

## What fails / is unverified

- **Actual email/Discord delivery was not runtime-tested** during this
  audit (no real credentials were used; this was a read-only
  documentation pass, and using real Gmail/Discord credentials was out of
  scope and would have sent a real message). Status: **Unable to
  verify (this session)** — see `TESTING.md` for exactly what a future
  session should do to verify it.
- **Whether the live deployment's code exactly matches the current `HEAD`
  commit (`8fbe66d`)** was not independently confirmed beyond the
  deployment timestamp being consistent with (slightly after) that
  commit's timestamp. `npx vercel inspect` does not print a source commit
  SHA for this deployment. Status: **Needs confirmation** if this ever
  matters (e.g. before assuming "prod already has the favicon").
- No automated tests exist to catch any regression (see `TESTING.md`).

## Blockers

None.

## Assumptions currently in effect

- It's assumed the Vercel project's actual environment variables
  (`SITE_PASSCODE`, `GMAIL_USER`, `GMAIL_APP_PASSWORD`,
  `DISCORD_BOT_TOKEN`) are configured in the Vercel dashboard, matching
  what `.env.example` documents — this was **not** independently checked
  via the Vercel dashboard/CLI env-var listing during this audit (reading
  actual configured values, even to confirm presence, was treated as
  unnecessary for a documentation-only pass and a needless brush against
  secret-adjacent data).
- It's assumed no `.env`/`.env.local` file exists on any other machine
  this repo might be checked out on with real values that could
  accidentally get committed — `.gitignore`'s handling of `.env*` was
  verified correct in this checkout (see `CLAUDE.md`), but that's a
  per-checkout `.gitignore`, not a server-enforced protection.

## Next three recommended actions

1. **If the goal is to verify the app actually works end-to-end:** run
   `npx vercel dev` locally with a real (test) `.env` populated from
   `.env.example`, and walk `TESTING.md`'s manual smoke-test checklist —
   this is the only way to confirm delivery actually happens, since no
   automated test exists.
2. **If the goal is to reduce duplication:** consider extracting the
   shared passcode-check/message-validation logic from `api/send-email.js`
   and `api/send-discord.js` into one small shared helper — see
   `TASKS.md` → Technical debt. Low priority, purely a maintainability
   improvement, not a bug fix.
3. **If the goal is to harden the deployed app:** add basic rate limiting
   to both `api/*.js` handlers (currently none exists beyond the shared
   passcode) — see `SECURITY.md` → Recommended fixes.

No code changes were made to produce this file — it is a pure
documentation/handoff artifact.
