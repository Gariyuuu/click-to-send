# CLAUDE.md — Operating Manual for Click to Send

This file is the primary entry point for any AI coding agent (or human)
picking up this repository. Read this first, then `PROJECT_STATE.md`, then
`TASKS.md`, before touching code.

This entire memory system (`CLAUDE.md`, `PROJECT_STATE.md`, `ARCHITECTURE.md`,
`FILE_MAP.md`, `FEATURES.md`, `TASKS.md`, `ROADMAP.md`, `DECISIONS.md`,
`DATABASE.md`, `API_REFERENCE.md`, `UI_SYSTEM.md`, `SECURITY.md`,
`TESTING.md`, `DEPLOYMENT.md`, `CHANGELOG.md`, `SESSION_LOG.md`,
`HANDOFF.md`) was generated on **2026-08-06** by auditing the actual
repository (source, config, git history) — not by recalling prior chat
history. Where something couldn't be verified from the repo, it is
labeled **Unverified**/**Needs confirmation** rather than stated as fact.

## Project identity

- **Name:** Click to Send
- **One-sentence description:** A tiny single-page site where you type a
  recipient, a message, and a shared access code, click a button, and it
  sends that message by email (Gmail SMTP) and/or Discord DM.
- **Detailed summary:** The page (`index.html`/`style.css`/`script.js`) has
  four inputs — recipient email, comma-separated Discord user IDs, message
  text, access code — and two buttons. "Send Email" posts to
  `api/send-email.js`, a Vercel serverless function that sends one email via
  Gmail SMTP (`nodemailer`) to the typed address. "Send Discord DM" posts to
  `api/send-discord.js`, a Vercel serverless function that opens a DM channel
  and sends a message to each of up to 20 comma-separated Discord user IDs via
  a bot token. Both endpoints require a passcode in the request body that must
  match the server's `SITE_PASSCODE` env var, since the deployed URL is public
  with no other auth.
- **Target audience:** The repo owner personally (and anyone they share the
  URL/passcode with) — a personal utility, not a multi-tenant product.
- **Current development stage:** Small, complete, working utility. No
  in-progress feature work found in the repo (no TODOs, no half-built code
  paths, no commented-out sections). Two commits total.
- **Production status:** **Deployed** to Vercel at
  `https://click-to-send.vercel.app`. **Re-confirmed 2026-08-17** (onboard
  audit) via `npx vercel inspect https://click-to-send.vercel.app` —
  status "Ready", deployment `dpl_J4xcL6UWVWJAWuXWePYnAfWRk1Za` created
  2026-08-16 18:33:36 -0700, which matches `script.js`/`style.css`'s local
  mtimes to the minute — i.e. the live deployment reflects current `HEAD`
  (`e645ea5`), not a stale build. See `DEPLOYMENT.md`.
- **Repository type:** Single app, not a monorepo. One `package.json` at
  the root; two serverless functions under `api/`; a static
  `index.html`/`style.css`/`script.js` trio at the root.
- **Important scope note:** `~/Projects` (the parent of this repo) is
  **not** a monorepo — it's a collection of many unrelated, independently
  pushed git repos belonging to the same developer. Nothing in this memory
  system applies outside `~/Projects/click-to-send`.

## Current status

See `PROJECT_STATE.md` for the exact, timestamped snapshot. Summary:

- **Current task: `T-001`** — no active task. Nothing is in progress or
  queued by the user; `T-001` is this memory system's stable ID for that
  "nothing in progress" state (not an application task), kept identical
  across `CLAUDE.md`/`PROJECT_STATE.md`/`TASKS.md`/`HANDOFF.md` per the
  repo-memory current-task invariant. The last completed documentation
  task was `DOC-002` (see `TASKS.md`); the unstarted backlog items are
  `TASK-101` through `TASK-104` (also `TASKS.md`).
- **Working tree:** Clean as of this audit (`git status` → "nothing to
  commit, working tree clean").
- **Current blockers:** None found.
- **Highest-priority next task:** None queued by the user. This audit is a
  documentation-only pass; no code changes were made or requested. See
  `TASKS.md`.

## Technology stack

Versions below are copied verbatim from `package.json` / `package-lock.json`
/ local tool output — not guessed.

- **Language:** Plain JavaScript (ES modules, `"type": "module"` in
  `package.json`). No TypeScript, no build step, no bundler.
- **Frontend:** Static HTML/CSS/vanilla JS — `index.html`, `style.css`,
  `script.js`. No frontend framework (no React/Vue/etc.), no client-side
  dependencies at all.
- **Backend:** Two Vercel serverless functions under `api/` (Node.js
  runtime, the Vercel default `(req, res)` handler signature, not Next.js
  API routes — there is no Next.js in this project).
- **Package manager:** npm. `package-lock.json` is present and committed
  (`lockfileVersion: 3`). No other lockfile exists.
- **Runtime dependency:** `nodemailer` `^9.0.3` (pinned to exact `9.0.3` in
  `package-lock.json`; installed copy in `node_modules/nodemailer` also
  reports `9.0.3`). This is the **only** dependency in `package.json` —
  used only by `api/send-email.js`. `api/send-discord.js` uses the global
  `fetch` (no Discord SDK) to call the Discord REST API directly.
- **Node.js version:** Not pinned in this repo (no `.nvmrc`, no `engines`
  field in `package.json`). Local `node -v` at audit time: `v26.3.0`.
  Vercel's project settings report **Node.js Version: 24.x** for this
  project (per `npx vercel project inspect click-to-send`) — that is
  Vercel's own default/setting, not something configured in-repo.
- **Hosting:** Vercel (project `click-to-send`, org
  `garywangsmes-8349s-projects`; linked via `.vercel/project.json`,
  `projectId: prj_ie7HmrLI2ew6opI8Z6cdVlet82TB`).
- **Vercel CLI available locally:** `56.5.0` (via `npx vercel --version`;
  not a project dependency — resolved from npm's cache/global install).
- **Auth provider:** None (no login system). A single shared
  "access code" string (`SITE_PASSCODE`) gates both API endpoints — see
  `SECURITY.md`.
- **Email provider:** Gmail SMTP via an app password, through
  `nodemailer.createTransport({ service: "gmail", ... })` in
  `api/send-email.js`.
- **Messaging provider:** Discord Bot REST API (`discord.com/api/v10`),
  called directly via `fetch` in `api/send-discord.js` — no Discord SDK
  dependency.
- **Testing libraries:** None installed. No test framework in
  `package.json`. See `TESTING.md`.
- **Build tools:** None. `package.json`'s `"scripts"` object is empty
  (`{}`) — there is no `build`, `lint`, `dev`, `start`, or `test` script
  defined anywhere in this repo.
- **Linting/formatting:** None configured — no ESLint/Prettier config
  files found anywhere in the repo.
- **External APIs:** Gmail SMTP (via `nodemailer`) and the Discord REST
  API (`https://discord.com/api/v10`, called directly with `fetch`). No
  other third-party services.

## Essential commands

All commands run from the repository root (`~/Projects/click-to-send`).
**Verified against the actual `package.json`: the `"scripts"` object is
empty — there is no `npm run dev`, `npm run build`, `npm test`, or
`npm run lint` command defined in this repo.** Do not assume one exists.

```bash
npm install                # install the one dependency (nodemailer)

npx vercel dev              # local dev server that also runs the api/
                             # serverless functions (per README.md; this
                             # is the documented way to run this project
                             # locally — there is no npm script for it)

npx vercel                  # deploy a preview build
npx vercel --prod           # deploy to production — see DEPLOYMENT.md;
                             # this is a MANUAL step, not automated
```

There is no build step, no test command, no lint command, and no database
migration/seed command — none of these exist in this repo.

## Repository structure

```
click-to-send/
├── index.html               # The entire page: 4 inputs, 2 buttons, 1 status line
├── style.css                 # All styling — single dark card, ~90 lines, no framework
├── script.js                  # All client logic: reads inputs, POSTs to /api/*, updates status
├── api/
│   ├── send-email.js           # Vercel serverless function — validates input + passcode,
│   │                            # sends one email via Gmail SMTP (nodemailer)
│   └── send-discord.js         # Vercel serverless function — validates input + passcode,
│                                # DMs up to 20 Discord user IDs via the Discord REST API
├── package.json                # name/version/type:module, one dependency (nodemailer),
│                                # empty "scripts" object
├── package-lock.json           # npm lockfile, lockfileVersion 3
├── .env.example                 # Template for SITE_PASSCODE / GMAIL_USER / GMAIL_APP_PASSWORD
│                                 # / DISCORD_BOT_TOKEN — placeholders only, safe to commit
├── og.png                       # Open Graph / Twitter-card preview image, added 2026-08-14
│                                 # (referenced by index.html's og:image/twitter:image tags)
├── .gitignore                   # Ignores node_modules, .env*, .vercel, logs, editor files
├── .vercel/                      # Vercel CLI link metadata (gitignored) — projectId/orgId
│                                 # for project "click-to-send"
├── node_modules/                 # Installed dependency (nodemailer only)
└── README.md                     # Human-facing setup guide (existing; content folded into
                                    # this memory system, not duplicated — see below)
```

**What should NOT be placed where:**
- Do not add a frontend framework/bundler without it being the explicit
  point of a task — this is intentionally a zero-build static site.
- Do not put server-only logic (SMTP calls, the Discord bot token) in
  `script.js` or any client-side file — it must stay inside `api/`, which
  runs server-side on Vercel and is the only place `process.env` secrets
  are read.
- Do not add new environment variables without also adding a placeholder
  entry to `.env.example` (see `DEPLOYMENT.md`/`SECURITY.md` — never a
  real value).

## Architecture summary

See `ARCHITECTURE.md` for the full write-up with a Mermaid diagram. Short
version:

- The browser loads static `index.html`/`style.css`/`script.js` directly
  from Vercel's static hosting — no server rendering, no framework.
- Clicking a button does a `fetch("/api/send-email", {...})` or
  `fetch("/api/send-discord", {...})` `POST` with JSON body
  `{ message, to, passcode }` or `{ message, userIds, passcode }`.
- Each `api/*.js` file is an independent Vercel serverless function
  (Node.js). Each one: rejects non-POST methods, checks that its required
  env vars are configured (500 if not), checks the passcode against
  `SITE_PASSCODE` (401 if wrong/missing), validates the rest of the input
  (400 if invalid), then performs the send and returns JSON.
- `api/send-email.js` sends exactly one email via `nodemailer`'s Gmail
  transport. `api/send-discord.js` loops sequentially over up to 20
  deduplicated Discord user IDs, opening a DM channel and posting a
  message to each via two `fetch` calls per recipient, collecting a
  per-recipient `{userId, ok, error?}` result.
- There is no database, no session/auth beyond the shared passcode, no
  queue, and no retry logic anywhere.

## Coding conventions

These are **Verified** (observed directly in the existing, small codebase).

- **Language style:** Plain ES modules (`import`/`export default`), no
  TypeScript, no JSX. `const`/arrow functions throughout; no class syntax
  used anywhere.
- **File organization:** One file per concern — one HTML file, one CSS
  file, one client JS file, one serverless function per external service
  (`api/send-email.js`, `api/send-discord.js`). No shared/utility module exists
  between the two `api/` files even though both duplicate the same
  passcode-check and message-validation pattern — this duplication is
  small (a few lines) and was not refactored during this audit (a
  documentation-only pass), but is worth knowing before adding a third
  endpoint (see `TASKS.md` → Technical debt).
- **Validation:** Both `api/*.js` files validate in the same order: method
  → env-var-configured check → passcode → message presence → recipient
  shape. `api/send-email.js` uses a regex (`EMAIL_RE`) for a basic email
  shape check; `api/send-discord.js` uses a regex (`SNOWFLAKE_RE`,
  15–20 digits) for Discord snowflake ID shape, deduplicates IDs via
  `Set`, and caps at `MAX_RECIPIENTS = 20`.
- **Error handling:** Every handler responds with `res.status(code).json({
  error: "..." })` on failure — no thrown/unhandled errors escape a
  handler (each has a `try/catch` around the actual send call). Client-side,
  `script.js`'s `post()` helper throws on a non-OK response and each button
  handler catches it and writes `err.message` into the status line.
- **Naming:** `camelCase` for variables/functions, `SCREAMING_SNAKE_CASE`
  for module-level constants (`EMAIL_RE`, `SNOWFLAKE_RE`, `MAX_RECIPIENTS`).
- **Comments:** Minimal — used only in `.gitignore`/`.env.example` to
  explain *why*, not scattered through the JS.
- **Styling:** Plain CSS, no preprocessor, no utility framework, one
  hardcoded dark color palette (see `UI_SYSTEM.md`).
- **Tests:** None exist. No test-writing convention has been established.

## Environment setup

All environment variables found in `.env.example` (the only source of
truth for this — there is no `.env`/`.env.local` file in the repo, and
none should ever be committed):

| Variable | Purpose | Required? | Client/Server | Format | Safe placeholder |
|---|---|---|---|---|---|
| `SITE_PASSCODE` | Shared access code checked against the `passcode` field of every `/api/send-email` and `/api/send-discord` request; without a match, both handlers return 401 | **Required** — both handlers return 500 ("Server is not configured") if unset | Server only (`process.env.SITE_PASSCODE`, read in `api/send-email.js` and `api/send-discord.js`) | Any string, only needs to match what's typed into the page's "Access code" field | `pick_something_only_you_know` |
| `GMAIL_USER` | The Gmail address emails are sent *from* | **Required** for `/api/send-email` — that handler returns 500 if unset | Server only (`api/send-email.js`) | A Gmail address | `youraccount@gmail.com` |
| `GMAIL_APP_PASSWORD` | A 16-character Gmail App Password (not the account's real password) for SMTP auth | **Required** for `/api/send-email` — that handler returns 500 if unset | Server only (`api/send-email.js`) | 16-character app password string | `your16charapppassword` |
| `DISCORD_BOT_TOKEN` | Bot token used as `Authorization: Bot <token>` when opening DM channels and posting messages via the Discord REST API | **Required** for `/api/send-discord` — that handler returns 500 ("Discord is not configured on the server") if unset | Server only (`api/send-discord.js`) | Discord bot token string | `your_bot_token` |

No client-exposed (`NEXT_PUBLIC_*`-style or otherwise) environment
variables exist — this is a plain static site, not a framework with a
public/private env var distinction; nothing in `script.js` or `index.html`
reads any env var.

`.env.example` exists at the repo root with exactly these four
placeholder entries (verified — see the file itself).

**Correction (found 2026-08-17, previously stated wrong in this file and
in `SECURITY.md`):** `.gitignore`'s final line, a catch-all `.env*`
pattern, **does** catch `.env.example` — confirmed via `git check-ignore
-v .env.example`, which reports it ignored by `.gitignore:28:.env*`. The
2026-08-06 audit's claim that `.gitignore` listing `.env`/`.env.local`
by name *before* the broad `.env*` line meant the broad pattern didn't
apply to `.env.example` was **factually wrong** — plain (non-negated)
`.gitignore` patterns don't work that way; any matching pattern excludes
the file, order among non-negated lines doesn't create an exception.
Separately, and more concretely: `git log --all --full-history --
.env.example` returns **no commits at all** — `.env.example` has never
been part of any commit in this repo's history (not the initial commit,
not any later one), and `git ls-files` confirms it is not tracked today.
**Practical implication: a fresh `git clone` of this repo does not
include `.env.example`.** The file only exists in this checkout as an
untracked, locally-created file. `README.md`'s setup instructions
(`cp .env.example .env`) only work for someone who already has this
local file — they will fail on a clean clone from GitHub. See `TASKS.md`
→ High priority and `SECURITY.md` → Secret handling for the corrected
claim.

## Database summary

**There is no database.** No ORM, no DB client library, no connection
string env var, no `DATABASE_URL`. See `DATABASE.md`.

## API and integrations

Full detail in `API_REFERENCE.md`. Two routes, both POST-only, both
Vercel serverless functions under `api/`:

- `POST /api/send-email` — sends one email via Gmail SMTP.
- `POST /api/send-discord` — DMs up to 20 Discord user IDs via the
  Discord Bot REST API.

No REST framework, no routing library — Vercel's filesystem-based `api/`
routing maps each file to its own endpoint automatically. No webhooks, no
OAuth, no other external APIs.

## Testing and verification

No automated tests exist anywhere in this repo (no test framework
installed, no test files, no `npm test` script). See `TESTING.md` for the
manual smoke-test checklist that currently substitutes for automated
tests.

Verification actually run during this audit (read-only, non-destructive):

```bash
node -v          # v26.3.0 (local)
npx vercel --version   # Vercel CLI 56.5.0
npx vercel whoami       # confirms an authenticated Vercel session exists
npx vercel project ls    # confirms click-to-send is deployed, Ready
npx vercel inspect https://click-to-send.vercel.app   # confirms deploy metadata
```

`npm install`, a build step, and a lint step were **not** run during this
audit beyond what's listed above, because no `build`/`lint` script exists
in `package.json` to run (verified by reading the file — the `"scripts"`
object is literally `{}`). This is not a gap in the audit; there is
nothing to invoke.

## Deployment

Full detail in `DEPLOYMENT.md`. Summary:

- **Hosting:** Vercel, project `click-to-send`
  (`garywangsmes-8349s-projects` org), linked via `.vercel/project.json`.
- **Confirmed live:** `https://click-to-send.vercel.app` — status "Ready"
  as of `npx vercel inspect` run during this audit (deployment created
  2026-08-06, ~3h before the audit).
- **No GitHub auto-deploy is configured for this project — CONFIRMED.**
  `npx vercel project inspect click-to-send` shows no "Git Repository"
  section at all (Vercel prints one when a project has git integration
  connected — compare to sibling project `chamber-seven`, which does show
  git-linked deployment aliases like `*-git-main-*.vercel.app`; no such
  alias exists among click-to-send's aliases). This confirms deployment
  requires manually running `npx vercel --prod` (or `npx vercel deploy
  --prod`) after pushing — it does not happen automatically on `git push`.
  A GitHub remote **does** exist (`origin` →
  `https://github.com/Gariyuuu/click-to-send.git`), but pushing to it does
  not, by itself, trigger a Vercel deployment.

## DO NOT CHANGE WITHOUT REVIEW

- **`api/send-email.js` / `api/send-discord.js` validation and passcode
  checks** — these are the only thing stopping a random visitor to the
  public URL from using this project's Gmail account and Discord bot to
  message people. Do not weaken, bypass, or remove the `SITE_PASSCODE`
  check, the email regex, the Discord snowflake regex, or the
  `MAX_RECIPIENTS` cap without it being the explicit, deliberate point of
  a task.
- **`.env.example`** — placeholders only, ever. Never write a real
  passcode, Gmail app password, or Discord bot token into this file (or
  any file in this repo).
- **`.vercel/project.json`** — links this repo to the specific Vercel
  project `click-to-send` (`prj_ie7HmrLI2ew6opI8Z6cdVlet82TB`). Do not
  edit or delete; if it's ever missing, `npx vercel link` regenerates it,
  but only run that deliberately (it prompts for project selection).
- **`.gitignore`'s `.env*` handling** — verified correct (does not
  accidentally catch `.env.example`); don't add a new broad pattern above
  the existing lines without checking it doesn't re-introduce that
  problem.
- **Deployment itself** — do not run `npx vercel --prod` (or `npx
  vercel`/`vercel deploy`) unless the user explicitly asks for a
  deployment. This memory system was built via a read-only audit; no
  deploy was performed to produce it.

## Known issues

See `PROJECT_STATE.md` and `FEATURES.md` for full per-feature detail.
Headline items found during this audit:

1. **No rate limiting on either API route.** Beyond the shared passcode,
   nothing stops a caller who has the passcode from sending an unbounded
   number of emails/DMs in a loop. See `SECURITY.md`.
2. **Duplicated validation logic between `api/send-email.js` and
   `api/send-discord.js`** (passcode check, message-presence check) — small
   in scope, but a third endpoint would make a shared helper worth
   extracting. See `TASKS.md` → Technical debt.
3. **No automated tests.** See `TESTING.md`.
4. **No lint/format/build/dev scripts defined in `package.json`.** The
   README documents `npx vercel dev` as the way to run this locally
   (bypassing the empty `"scripts"` object entirely) — this is consistent
   with what's in the repo, just worth flagging since it means there is no
   `npm run <anything>` command that works out of the box except
   `npm install`.
5. **No custom error page / 404 handling** for the two API routes beyond
   the built-in Vercel serverless-function behavior — not investigated
   further as it's default platform behavior, not custom code.

Nothing resembling TODO/FIXME/HACK/WIP/placeholder-data/mock/dummy/
hardcoded-secret/disabled-feature/deprecated-code/"not implemented"/
empty-catch-block was found anywhere in `index.html`, `style.css`,
`script.js`, `api/send-email.js`, or `api/send-discord.js` (verified via a
repo-wide case-insensitive grep for these terms, excluding
`node_modules`). The only matches were incidental (the HTML `placeholder`
attribute on form inputs, the CSS `:disabled` pseudo-class / JS
`.disabled` property on buttons — both normal, intended usage, not
red flags).

## AI working instructions

Future Claude Code sessions (or any AI agent) working in this repo must:

1. Read `CLAUDE.md` (this file).
2. Read `PROJECT_STATE.md`.
3. Read `TASKS.md`.
4. Read whichever of `ARCHITECTURE.md` / `FEATURES.md` / `API_REFERENCE.md`
   / `DATABASE.md` / `UI_SYSTEM.md` / `SECURITY.md` / `DEPLOYMENT.md` is
   relevant to the task at hand.
5. Inspect the affected code directly before changing it — do not trust a
   memory file's description of a function's exact behavior over reading
   the function itself; memory files can go stale.
6. Check `git status` before modifying files.
7. Avoid overwriting unrelated work.
8. Make small, reviewable changes.
9. There is no build/lint/test command to run after changes (verified —
   `package.json`'s `"scripts"` is empty). If you add one, document it
   here and in `TESTING.md`/`DEPLOYMENT.md`.
10. Update documentation after meaningful changes (see the permanent rules
    below).
11. Never claim something works without verification — "the code reads
    correctly" is not the same claim as "I ran it and confirmed the
    email/DM actually sent." Say which one you mean.
12. Never expose secrets (`SITE_PASSCODE`, `GMAIL_APP_PASSWORD`,
    `DISCORD_BOT_TOKEN`, or any real value) in output, commits, or
    documentation.
13. Never run `npx vercel --prod` / `npx vercel deploy --prod` (or push to
    `origin`) without explicit user permission — this project has no
    auto-deploy, so any production deploy is a deliberate, visible action
    someone must ask for.
14. Never perform destructive operations (force-push, `git reset --hard`,
    deleting `.vercel/`, rotating/regenerating credentials) without
    explicit permission.
15. Never silently replace an existing architectural pattern (e.g. adding
    a framework/bundler, adding a database, adding real user auth) without
    it being the explicit point of the task.
16. Never remove the one dependency (`nodemailer`) or change how it's
    invoked without checking `api/send-email.js`'s usage first.
17. Never change the passcode/validation logic in `api/*.js` casually —
    see "DO NOT CHANGE WITHOUT REVIEW" above.
18. Record unresolved uncertainty in the relevant memory file rather than
    guessing and presenting a guess as fact.

## Permanent rules for future development

**After every meaningful coding task:**

1. Update `PROJECT_STATE.md` with the new exact stopping point.
2. Update `TASKS.md` (move/close tasks, add new ones discovered).
3. Append an entry to `SESSION_LOG.md` (do not overwrite prior entries).
4. Update whichever of `FEATURES.md` / `ARCHITECTURE.md` /
   `API_REFERENCE.md` / `DATABASE.md` / `TESTING.md` / `DEPLOYMENT.md` /
   `SECURITY.md` is affected by the change.
5. Remove or correct stale information you notice, even if unrelated to
   your task — but note what you changed and why in `SESSION_LOG.md`.
6. Record meaningful architectural decisions in `DECISIONS.md`.
7. Run whatever verification exists at the time (currently: none beyond
   manual smoke-testing — see `TESTING.md`).
8. Clearly record anything not verified rather than implying full
   verification.
9. Treat this repository's memory files as the permanent source of
   project memory — do not rely on chat history surviving to the next
   session.

**Before every meaningful coding task:**

1. Read `CLAUDE.md`.
2. Read `PROJECT_STATE.md`.
3. Read `TASKS.md`.
4. Read the relevant technical documentation file(s).
5. Run `git status` and `git diff --stat`.
6. Inspect the specific files you're about to change.
7. Confirm the requested work isn't already done.
8. Preserve unrelated work — don't `git checkout`/`reset`/`clean` without
   first stashing or confirming with the user.
9. Identify risks before modifying anything listed under "DO NOT CHANGE
   WITHOUT REVIEW" above.
