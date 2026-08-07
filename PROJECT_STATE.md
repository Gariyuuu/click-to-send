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

## Git state

- **Branch:** `main` (only branch that exists, locally or on `origin` —
  confirmed via `git branch -a`).
- **Tracking:** `origin/main` → `https://github.com/Gariyuuu/click-to-send.git`,
  reported "up to date with 'origin/main'" by `git status`, confirmed
  again 2026-08-07 via `git fetch origin` (no new remote commits) — 0
  ahead, 0 behind.
- **Latest commit:** `372d3bd1c51e5a01c0e657c19b9b6899878ebbf7` — "docs:
  add full handoff documentation system" (2026-08-06 20:20:07 -0700, 17
  files changed, 2355 insertions). **This is the commit that actually
  added all 17 memory-system files** — see correction below.
- **Previous commits:** `8fbe66dd85342d1a40dbfa93290a546b53bca19e` — "Add
  favicon so the site shows an icon in the browser tab" (2026-08-06
  03:14:55 -0700); `c6cefa0be8c4b9b57381d802fa009aa82b48dcf2` — "Initial
  commit" (2026-07-24 13:06:36 -0700).
- **Correction (found during the 2026-08-07 checkpoint pass):** this
  section, `TASKS.md` (DOC-001's acceptance criteria), and `CHANGELOG.md`
  previously stated that the 17 memory-system files were left uncommitted
  ("nothing was committed... during this audit"). That was accurate at
  the moment those sentences were originally written, but the same
  2026-08-06 session went on to commit all 17 files as `372d3bd` (visible
  in `git log`) — the docs were never updated afterward to reflect that.
  Fixed in this pass; see `SESSION_LOG.md` → Session 2 for detail.
- **Working tree as of 2026-08-07:** **Clean.** `git status` reports
  "nothing to commit, working tree clean" — the 17 memory-system files
  are tracked and committed (part of `372d3bd`), not untracked.
- **Node modules / build artifacts:** `node_modules/` exists locally
  (containing only `nodemailer`) and is correctly gitignored; not part of
  git state.

## Active objective

This session's objective was **documentation only**: build a complete
17-file handoff/memory-doc system for this repo from scratch (none
existed before), matching the structural depth of sibling projects
`chamber-seven` and `buildstrike-arena`, using only facts verified by
directly inspecting this repo. No application feature work was requested
or performed.

## Last completed task

Full repository audit (source files, `package.json`/`package-lock.json`,
`.env.example`, `.vercel/project.json`, `.gitignore`, `README.md`, git
history, and a read-only Vercel CLI inspection of the live deployment) and
creation of all 17 documentation files listed above. See `SESSION_LOG.md`
for the exact commands run.

## Current unfinished task

**None.** The documentation build is complete as of this file being
written. If a next session picks this up mid-way, check whether all 17
files listed above exist at the repo root and whether their content still
matches the actual code (re-run the verification commands in
`CLAUDE.md` → "Testing and verification" / `SESSION_LOG.md`).

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
- **Deployment exists and is live** *(as of the 2026-08-06 Vercel CLI
  inspection — not re-run during the 2026-08-07 checkpoint pass, which was
  a read-only docs/git audit only)*. `npx vercel project ls` lists
  `click-to-send` with production URL `https://click-to-send.vercel.app`,
  and `npx vercel inspect https://click-to-send.vercel.app` confirms
  deployment status "Ready" (deployment `dpl_PRpgESdsEntT9bqLNL6MRG9eqJ4G`,
  created 2026-08-06, ~3h before that audit — consistent with, but not
  proven identical to, the `8fbe66d` favicon commit — the last commit that
  touched site-serving files; `372d3bd`, the current `HEAD`, only added
  `.md` docs and has no effect on the deployed page). **No `vercel --prod`
  is known to have run since** — whoever deploys next should not assume
  this status is still current without re-running `npx vercel inspect`.
- **No GitHub auto-deploy** — confirmed via `npx vercel project inspect
  click-to-send`, which shows no "Git Repository" section at all (a
  connected project would show one; compare to `chamber-seven`, which
  does). See `DEPLOYMENT.md`.

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
