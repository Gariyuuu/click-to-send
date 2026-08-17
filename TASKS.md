# TASKS.md — Active Execution Queue

Update this file after every meaningful session. Move completed tasks to
"Recently completed" rather than deleting them.

## Current task

**`T-001` — no active task.** Nothing is in progress or queued; wait for
the user's next direction rather than inventing new work. (`T-001` is a
stable placeholder ID for this "nothing in progress" state, kept
identical across `CLAUDE.md`/`PROJECT_STATE.md`/`TASKS.md`/`HANDOFF.md` —
it is not an application task, and is separate from this file's own
`DOC-`/`TASK-`-numbered items below.) Most recently, **DOC-002
(2026-08-17)** re-synced this memory system with six commits (OG meta
tags, `og.png`, button/status micro-interactions) that had landed since
DOC-001 without being documented — see `SESSION_LOG.md` → Session 3.

### DOC-001 — Build the full 17-file handoff documentation system

- **Status:** **DONE (2026-08-06).**
- **Priority:** N/A (user-requested, one-off)
- **Exact objective:** Create `CLAUDE.md`, `PROJECT_STATE.md`,
  `ARCHITECTURE.md`, `FILE_MAP.md`, `FEATURES.md`, `TASKS.md`,
  `ROADMAP.md`, `DECISIONS.md`, `DATABASE.md`, `API_REFERENCE.md`,
  `UI_SYSTEM.md`, `SECURITY.md`, `TESTING.md`, `DEPLOYMENT.md`,
  `CHANGELOG.md`, `SESSION_LOG.md`, `HANDOFF.md` at the repo root, built
  entirely from direct inspection of this repo (not copied from sibling
  projects' content), matching the structural depth of `chamber-seven`'s
  and `buildstrike-arena`'s equivalent files.
- **What was completed:**
  - Read every source file in full: `index.html`, `style.css`,
    `script.js`, `api/send-email.js`, `api/send-discord.js`,
    `package.json`, `package-lock.json`, `.env.example`, `.gitignore`,
    `README.md`, `.vercel/project.json`.
  - Inspected git history (`git log`, `git status`, `git branch -a`,
    `git show --stat` on both commits).
  - Grepped the whole repo for TODO/FIXME/HACK/WIP/placeholder/mock/
    dummy/hardcoded/disabled/deprecated/"not implemented"/console.log/
    localhost — no genuine matches found (only incidental HTML
    `placeholder` attributes and CSS/JS `disabled` state, both normal
    usage).
  - Ran read-only Vercel CLI checks (`vercel whoami`, `vercel project ls`,
    `vercel inspect <url>`, `vercel project inspect click-to-send`) to
    confirm the live deployment exists and to confirm (by the absence of
    a "Git Repository" section, contrasted with `chamber-seven` which has
    one) that no GitHub auto-deploy is configured for this project.
  - Wrote all 17 files listed above.
- **What remains:** Nothing for this task.
- **Relevant files:** All 17 new root-level `.md` files listed above.
- **Known errors:** None.
- **Blockers:** None.
- **Acceptance criteria:**
  1. ✅ All 17 files exist at the repo root.
  2. ✅ No fact was copied from `chamber-seven`/`buildstrike-arena` —
     every claim traces to something actually read in this repo (env var
     names/values are placeholders from this repo's own `.env.example`;
     versions are from this repo's own `package.json`/`package-lock.json`;
     deployment facts are from this repo's own `.vercel/project.json`
     and live CLI inspection).
  3. ✅ No real secret/token/password was written anywhere (verified via
     re-read of every file before finishing — see `SECURITY.md` and
     `HANDOFF.md`'s consistency check).
  4. ✅ Nothing was pushed, deployed, reset, or discarded during the file-
     writing step itself. **Correction (added during the 2026-08-07
     checkpoint pass):** this criterion originally also claimed nothing
     was *committed* — that was true at the instant it was written, but
     the same 2026-08-06 session subsequently committed all 17 files as
     `372d3bd` ("docs: add full handoff documentation system"). The docs
     were never updated to reflect that follow-up commit until this pass.
     See `PROJECT_STATE.md` → Git state and `SESSION_LOG.md` → Session 2.
- **Verification steps performed:** Re-read `git status` after writing
  all files to confirm only new, untracked `.md` files appear and no
  tracked file was modified; re-grepped all new `.md` files for the
  literal strings `SITE_PASSCODE=`, `GMAIL_APP_PASSWORD=`,
  `DISCORD_BOT_TOKEN=` followed by anything other than a placeholder
  pattern, to confirm no real value leaked in.

## Next up

Nothing is currently queued. If the user wants follow-up work, the
best-scoped next items (not started, not requested) are listed below
under High/Medium/Low priority — do not start any of them unprompted.

## Blocked

Nothing currently blocked.

## High priority

- **TASK-105 — `.env.example` is not actually tracked in git; a fresh
  clone won't have it.** Found 2026-08-17 (onboard-mode re-sync),
  correcting a factual error in the original 2026-08-06 docs. Verified:
  `git check-ignore -v .env.example` → ignored via the `.gitignore:28`
  catch-all `.env*` pattern; `git log --all --full-history --
  .env.example` → no commits ever; `git ls-files` → not listed. The file
  currently exists only as an untracked local file in this checkout.
  **Practical effect:** `README.md`'s documented setup step (`cp
  .env.example .env`) silently fails for anyone who clones this repo
  fresh from GitHub — there is nothing to copy. Files: `.gitignore`
  (the `.env*` line is too broad), `.env.example` (untracked). Fix
  options: (a) add a `!.env.example` negation line to `.gitignore` after
  the `.env*` catch-all, or (b) rename the broad pattern to be more
  specific (`.env.local`/`.env.*.local`) instead of a blanket `.env*`.
  Either requires editing `.gitignore` and then `git add -f .env.example`
  (or removing the negation need) and committing — **do not do this
  without asking the user first**, since it changes what future
  `git status`/`git add -A` runs will pick up repo-wide, and the fix
  itself is a config change outside this documentation-only pass's scope.
  Acceptance: `git ls-files | grep .env.example` returns the file, and a
  fresh `git clone` + `cp .env.example .env` works.

## Medium priority

- **TASK-101 — Runtime-verify actual email/Discord delivery.** The code
  reads as correct, but neither send path was exercised with real
  credentials this audit. See `TESTING.md`'s manual smoke-test checklist.
  Files: `api/send-email.js`, `api/send-discord.js`. Acceptance: a real
  test email arrives in an inbox, and a real test DM arrives from the
  bot, both triggered through the deployed (or `vercel dev`-run) app, not
  by calling Gmail/Discord directly.
- **TASK-102 — Add basic rate limiting to both API routes.** Currently
  nothing but the shared passcode stops rapid repeated sends. See
  `SECURITY.md` → Recommended fixes. Files: `api/send-email.js`,
  `api/send-discord.js`. Acceptance: a rapid burst of requests with a
  valid passcode is throttled/rejected past some reasonable threshold,
  verified by a manual test hitting the endpoint repeatedly.

## Low priority

- **TASK-103 — Extract shared validation logic.** `api/send-email.js` and
  `api/send-discord.js` duplicate the passcode-check and message-presence
  check almost verbatim. Not urgent at 2 files, but worth extracting a
  shared helper module (not yet created — e.g. a new `api/_lib/`
  directory with a `validate.js` file) if a third endpoint is ever added.
  Files: `api/send-email.js`, `api/send-discord.js`. Acceptance: both
  files import and use the same helper, behavior is unchanged (same
  status codes/messages for the same inputs).
- **TASK-104 — Add a `build`/`lint` script to `package.json`.** Currently
  `"scripts"` is empty; there's nothing to run for basic sanity-checking
  beyond manual testing. Even a trivial `"lint": "node --check
  script.js api/*.js"`-style syntax check would give future sessions
  something automatable. Files: `package.json`. Acceptance: `npm run
  lint` (or equivalent) exits 0 on the current codebase.

## Bugs

None found during this audit. No exceptions, stack traces, or incorrect
behavior were identified from static code reading (see `PROJECT_STATE.md`
for what was and wasn't runtime-verified).

## Technical debt

- Duplicated passcode/message validation between the two `api/*.js`
  files (see TASK-103).
- No `.nvmrc`/`engines` field pinning a Node version — Vercel's project
  setting (24.x, per `vercel project inspect`) is the only place this is
  pinned, invisibly to anyone reading just the repo.
- Empty `"scripts"` object in `package.json` means there's no
  discoverable "how do I run/check this" via `npm run` — the README
  documents `npx vercel dev` instead, which works but isn't discoverable
  from `package.json` alone.

## Testing needed

- No automated tests exist at all — see `TESTING.md`. The highest-value
  first test (if a framework is ever introduced) would be a mocked test
  of both `api/*.js` handlers' validation branches (wrong method, missing
  env vars, wrong passcode, invalid input shapes) since those are pure,
  easily-mocked logic — the actual Gmail/Discord network calls would need
  to be mocked out rather than hit for real in CI.

## Documentation needed

None outstanding beyond what this audit just produced.

## Recently completed

- DOC-002 — Onboard-mode re-sync of the memory system against 6
  undocumented commits (OG/Twitter meta tags, `og.png`, button/status
  micro-interactions), plus a re-confirmation that the live deployment is
  current and still has no GitHub auto-deploy (2026-08-17). See
  `SESSION_LOG.md` → Session 3.
- DOC-001 — Full 17-file handoff documentation system (2026-08-06). See
  above for detail.

## Deferred

None recorded — no explicit deferrals were found in code comments or
commit history.

## Rejected ideas

None recorded — no explicit rejections were found in code comments or
commit history.
