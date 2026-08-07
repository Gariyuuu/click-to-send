# TESTING.md

## Current test strategy

**None exists.** Verified by:

- `package.json`'s `"scripts"` object is empty (`{}`) — no `test` script.
- No test framework (Jest/Vitest/Mocha/Playwright/Cypress/etc.) appears
  as a dependency anywhere in `package.json` or `package-lock.json`.
- No test files (`*.test.js`, `*.spec.js`, a `__tests__/` or `test/`
  directory) exist anywhere in the repo.

Every change to this codebase, historically and currently, has been
verified by manual/eyeball review and (presumably) manual clicking
through the deployed or locally-run page — not by any automated suite.
This is not a regression from some prior state; there has never been
automated testing in this repo (confirmed across both commits in git
history).

## What was and wasn't verified during the 2026-08-06 documentation audit

- **Verified by reading the full source of every file:** the validation
  logic, control flow, and response shapes of both `api/*.js` handlers,
  and the client-side wiring in `script.js`/`index.html`. This is "the
  code reads as correct," not "the code was executed and confirmed
  correct."
- **NOT verified by execution this audit:** actual email delivery via
  Gmail SMTP, actual DM delivery via the Discord bot, and actual
  end-to-end behavior of the deployed page in a browser. No real
  credentials were used, and no browser-based click-through was
  performed, because doing so would have sent a real email/DM as a
  side effect of a documentation-only audit — judged out of scope.
- **Verified via CLI (read-only, no side effects):** the Vercel
  deployment exists and reports status "Ready"
  (`npx vercel inspect https://click-to-send.vercel.app`).

## Manual smoke-test checklist (for the next session to actually run)

Prerequisites: a real (ideally disposable/test) Gmail account with an App
Password, a real Discord bot token + a test Discord user ID that shares a
server with the bot, and a `.env` file copied from `.env.example` with
real values filled in (never commit this file).

1. **Local setup**
   - [ ] `npm install`
   - [ ] `cp .env.example .env` and fill in real `SITE_PASSCODE`,
     `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `DISCORD_BOT_TOKEN`.
   - [ ] `npx vercel dev` and open the printed localhost URL.

2. **Email — happy path**
   - [ ] Fill in a valid recipient email, a message, and the correct
     passcode. Click "Send Email."
   - [ ] Button disables, status shows "Sending email...", then "Email
     sent."
   - [ ] Confirm the email actually arrived in the recipient's inbox
     (subject "New message from Click to Send", body = the typed
     message).

3. **Email — error paths**
   - [ ] Empty message → client-side blocks with "Type a message first."
     (no request sent).
   - [ ] Empty recipient → client-side blocks with "Enter a recipient
     email first."
   - [ ] Empty passcode → client-side blocks with "Enter the access code
     first."
   - [ ] Wrong passcode (with valid message/recipient) → server responds
     401, status shows "Failed to send email: Invalid access code."
   - [ ] Malformed recipient (e.g. `not-an-email`) bypassing the browser's
     native `type="email"` nudge → server responds 400, status shows
     "Failed to send email: Valid recipient email is required."

4. **Discord — happy path**
   - [ ] Fill in one valid Discord user ID (a real snowflake, 15-20
     digits, of a user sharing a server with the bot), a message, and the
     correct passcode. Click "Send Discord DM."
   - [ ] Button disables, status shows "Sending Discord DM(s)...", then
     "Sent to 1 recipient(s)."
   - [ ] Confirm the DM actually arrived in that user's Discord DMs.

5. **Discord — multi-recipient and partial-failure paths**
   - [ ] Two comma-separated IDs, one valid (shares a server with the
     bot) and one that doesn't share a server → status shows something
     like "Sent to 1/2. Failed: <the other ID>."
   - [ ] More than 20 comma-separated IDs → server responds 400 "Too many
     recipients (max 20)."
   - [ ] A malformed ID (e.g. too short, or non-digits) mixed with valid
     ones → server responds 400 "One or more Discord user IDs are
     invalid" (the whole request rejected, nothing sent).
   - [ ] Duplicate IDs in the input → confirm only one DM is sent to that
     user (dedup via `Set`), and the `results` count reflects the
     deduplicated count, not the raw input count.

6. **Discord — error paths**
   - [ ] Empty Discord IDs field → client-side blocks with "Enter at
     least one Discord user ID first."
   - [ ] Wrong passcode → server responds 401, same pattern as email.

7. **Server misconfiguration paths** (temporarily unset an env var
   locally to test, then restore it)
   - [ ] Unset `GMAIL_USER`/`GMAIL_APP_PASSWORD`/`SITE_PASSCODE` → `POST
     /api/send-email` returns 500 "Server is not configured."
   - [ ] Unset `DISCORD_BOT_TOKEN`/`SITE_PASSCODE` → `POST
     /api/send-discord` returns 500 "Discord is not configured on the
     server."

8. **Production check** (only if explicitly asked to verify prod, and
   only with a real passcode already configured on Vercel)
   - [ ] Repeat step 2 and step 4's happy paths against
     `https://click-to-send.vercel.app` directly.

None of the above was executed during this documentation audit — this
checklist is written for whoever picks up TASK-101 in `TASKS.md` next.

## If a test framework is ever introduced

The highest-value first tests (per `TASKS.md` → Testing needed) would
mock `nodemailer`/`fetch` and unit-test each `api/*.js` handler's
validation branches (wrong method → 405; missing env vars → 500; wrong
passcode → 401; each invalid-input shape → 400) without hitting real
Gmail/Discord — those are pure, fast, and don't require real credentials
or send real messages, unlike the manual checklist above.
