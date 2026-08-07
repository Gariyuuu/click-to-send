# HANDOFF.md — Start Here

You are picking up **Click to Send** with no memory of any prior
conversation. This file is your fastest path to being useful. Everything
here is backed by the other memory files in this repo root, all written
2026-08-06 from a direct audit of the actual code — not from chat
history.

## What is this project?

A tiny static single-page site: type a recipient email, a message, and a
shared "access code," click a button, and it sends that message by email
(Gmail SMTP) and/or Discord DM (via a bot), through two Vercel serverless
functions. No accounts, no database, no build step, no framework. Live at
`https://click-to-send.vercel.app`.

## What should I read first?

In order:
1. `CLAUDE.md` — identity, stack, conventions, critical rules. Read this
   in full before doing anything else.
2. `PROJECT_STATE.md` — the exact stopping point, right now.
3. `TASKS.md` — what's queued (nothing urgent, as of this writing).
4. Whichever of `ARCHITECTURE.md` / `FEATURES.md` / `API_REFERENCE.md` /
   `DATABASE.md` / `UI_SYSTEM.md` / `SECURITY.md` / `DEPLOYMENT.md` /
   `DECISIONS.md` is relevant to what you're about to do.

## What is the current task?

**Nothing is currently in progress.** A full documentation/handoff audit
was just completed this session (2026-08-06) — this entire 17-file memory
system is the output of that audit. No application code was changed. If
the user hasn't given new direction, don't start on `TASKS.md`'s
Medium/Low priority items unprompted — confirm with the user first.

## What was the previous agent doing?

One thing: a from-scratch documentation audit, because this repo had zero
handoff documentation before this session (no `CLAUDE.md`, nothing). The
agent read every source file in full, checked git history, ran read-only
Vercel CLI checks to confirm the live deployment and (specifically)
whether GitHub auto-deploy is configured, grepped for signs of unfinished/
risky work, and wrote all 17 files now present at the repo root.

## What works right now?

Per `FEATURES.md`: both send paths (email via Gmail SMTP, Discord DM via
bot) are **fully wired end-to-end** — frontend → API route → validation →
external send → JSON response → status-line update — and the code reads
as logically correct. Classified "Mostly complete" rather than "Verified
complete" only because **actual delivery was not runtime-tested this
session** (no real credentials were exercised, to avoid sending a real
message as a side effect of a documentation pass). The shared-passcode
gate is fully wired and enforced identically in both API routes.

## What is broken?

**Nothing found broken.** No bugs, no failing checks, no TODO/FIXME/mock
code was found anywhere in the repo (confirmed via a full-repo grep — see
`SESSION_LOG.md`). The known gaps are omissions, not defects: no rate
limiting, no automated tests, no build/lint script, some duplicated
validation logic between the two API files. See `TASKS.md` and
`SECURITY.md`.

## What should I do next?

Nothing is blocking or urgent. If the user hasn't given new direction,
either ask what they want next, or propose the smallest well-scoped item
in `TASKS.md` → Medium priority: **TASK-101, runtime-verify actual
email/Discord delivery** with real test credentials (see `TESTING.md`'s
manual smoke-test checklist) — this is the one thing a documentation-only
audit structurally could not confirm.

## Which files are most important?

- `api/send-email.js` / `api/send-discord.js` — the entire server-side
  logic and the passcode security boundary. Read `CLAUDE.md` → "DO NOT
  CHANGE WITHOUT REVIEW" before touching either.
- `script.js` — the entire client-side logic; must stay in sync with
  whatever `api/*.js` actually returns.
- `.env.example` — the source of truth for what env vars exist; never put
  a real value here.

Full annotated map: `FILE_MAP.md`.

## Which areas are dangerous to modify?

See `CLAUDE.md` → "DO NOT CHANGE WITHOUT REVIEW" for the full list.
Headline: the passcode/validation checks in both `api/*.js` files (the
only thing stopping abuse of the owner's Gmail/Discord bot), and
`.env.example` (placeholders only, ever). Also: **do not run `npx vercel
--prod` (or push+expect auto-deploy — there is none) without explicit
user permission** — see `DEPLOYMENT.md` for the confirmed evidence that
this project has no GitHub auto-deploy.

## Which commands should I run first?

```bash
cd ~/Projects/click-to-send
git status                    # confirm this matches PROJECT_STATE.md — don't assume, check
npm install                   # if node_modules isn't already present
```

There is no `npm run build`/`lint`/`test` — `package.json`'s `"scripts"`
is empty (verified). This is not an oversight to "fix" reflexively; it's
the actual current state (see `TASKS.md` → TASK-104 if you want to add
one, but confirm with the user first).

## How do I verify the app still works?

```bash
npx vercel dev
```

Then open the printed localhost URL and walk `TESTING.md`'s manual
smoke-test checklist (requires real, ideally disposable, Gmail/Discord
test credentials in a local `.env` — never commit it). There is no
automated test suite — manual/in-browser verification is currently the
only way to confirm behavior beyond "the code reads correctly."

---

## Prompt for the next Claude Code account

Copy-paste this to start a new session cleanly:

```
Read CLAUDE.md, PROJECT_STATE.md, and TASKS.md in full before doing
anything else. Then:

1. Run `git status` and `git log --oneline -5` and confirm the repo
   state matches what PROJECT_STATE.md describes. If it doesn't (someone
   else has committed/changed things since), stop and tell me what's
   different before proceeding.

2. In 3-5 sentences, summarize your understanding of: what this project
   is, what the current task is, and what (if anything) is blocking it.
   I want to confirm you've actually absorbed the memory files, not just
   skimmed them.

3. Flag anything in CLAUDE.md/PROJECT_STATE.md/TASKS.md/FEATURES.md that
   looks stale or contradicts what you find in the actual code — don't
   silently work around a contradiction, surface it.

4. Check TASKS.md's "Current task" section — if it says nothing is in
   progress, ask me what to work on next rather than guessing; don't
   assume the backlog's suggested next item (TASK-101, runtime-verifying
   actual send delivery, as of this writing) is what I want without
   confirming.

5. Preserve the existing architecture (static HTML/CSS/JS frontend, two
   independent Vercel serverless functions under api/, no framework, no
   database, shared-passcode gate) unless I give you a genuinely strong
   reason to change it — and if you do, write it up in DECISIONS.md
   rather than changing it silently.

6. Do NOT run `npx vercel --prod` (or any deploy) without me explicitly
   asking — this project has no GitHub auto-deploy, so any production
   deploy is a deliberate action only, confirmed via DEPLOYMENT.md's
   evidence.

7. After completing any meaningful work, update PROJECT_STATE.md,
   TASKS.md, and append to SESSION_LOG.md before ending your session —
   don't let the next handoff start from a stale snapshot.
```
