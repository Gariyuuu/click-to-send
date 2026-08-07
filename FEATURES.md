# FEATURES.md — Feature-by-Feature Status

Status classifications used below: Verified complete / Mostly complete /
Partially implemented / UI only / Backend only / Mocked / Planned / Broken
/ Deprecated / Unable to verify.

## 1. Send a message by email

- **Purpose:** Let the page owner type a recipient email + message and
  send it via their own Gmail account, gated by a shared passcode.
- **User flow:** Fill "Recipient email", "Message", "Access code" → click
  "Send Email" → button disables, status shows "Sending email..." → on
  success, status shows "Email sent."; on failure, status shows "Failed
  to send email: <reason>" → button re-enables either way.
- **Status: Mostly complete.** The full flow is wired end-to-end
  (frontend → `POST /api/send-email` → validation → `nodemailer` Gmail
  SMTP send → JSON response → status line update) and the code reads as
  logically correct on inspection. Downgraded from "Verified complete" to
  "Mostly complete" because **actual email delivery was not
  runtime-tested this audit** (no real Gmail credentials were exercised —
  see `TESTING.md`). This is "Verified by code reading," not "Verified by
  execution."
- **Relevant files:** `index.html` (inputs `#recipient`, `#message`,
  `#passcode`, button `#send-email`), `script.js` (`emailBtn` click
  handler, `post()` helper), `api/send-email.js` (the entire handler).
- **Env vars:** `SITE_PASSCODE`, `GMAIL_USER`, `GMAIL_APP_PASSWORD` (all
  required — handler returns 500 if any is missing).
- **Validation:** Client-side: non-empty message/recipient/passcode
  (UX only). Server-side: passcode exact match; message is a non-empty
  trimmed string; `to` matches `EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/`
  (a basic shape check, not full RFC 5322 validation — e.g. it would
  accept some technically-invalid addresses and reject some technically-
  valid unusual ones; this is an intentional simplification, not a bug,
  for a personal-use tool).
- **Error states:** 405 (wrong method), 500 (server misconfigured — env
  vars missing), 401 (wrong/missing passcode), 400 (missing message /
  invalid email), 500 (`nodemailer` send threw — generic "Failed to send
  email" message, no internal detail leaked to the client).
- **Known issues:** No CC/BCC/reply-to/attachment support (not claimed
  anywhere as a feature — out of scope, not a bug). No delivery
  confirmation beyond Gmail accepting the SMTP send (a 200 response means
  Gmail's SMTP server accepted the message, not that the recipient's
  inbox actually received/kept it — normal for any SMTP-based sender, not
  specific to this code).
- **Remaining work:** Runtime-verify actual delivery with real (test)
  credentials — see `TESTING.md`'s manual smoke-test checklist.

## 2. Send a message by Discord DM

- **Purpose:** Let the page owner type up to 20 comma-separated Discord
  user IDs + a message and DM each of them via a bot, gated by the same
  shared passcode.
- **User flow:** Fill "Discord user IDs (comma-separated)", "Message",
  "Access code" → click "Send Discord DM" → button disables, status shows
  "Sending Discord DM(s)..." → on success, status shows a per-recipient
  summary (e.g. "Sent to 3 recipient(s)." or "Sent to 2/3. Failed: 123") →
  button re-enables.
- **Status: Mostly complete.** Same reasoning as email: the full flow is
  wired end-to-end (frontend → `POST /api/send-discord` → validation →
  sequential Discord REST API calls per recipient → JSON response with
  per-recipient results → status line summary) and reads as logically
  correct on inspection, but **actual DM delivery was not runtime-tested
  this audit** (no real Discord bot token was exercised).
- **Relevant files:** `index.html` (inputs `#discord-ids`, `#message`,
  `#passcode`, button `#send-discord`), `script.js` (`discordBtn` click
  handler, ID-splitting logic), `api/send-discord.js` (the entire
  handler, including the internal `sendDm()` helper).
- **Env vars:** `SITE_PASSCODE`, `DISCORD_BOT_TOKEN` (both required —
  handler returns 500 if either is missing).
- **Validation:** Client-side: splits the comma-separated field, trims,
  filters empty strings, requires at least one ID + message + passcode
  (UX only). Server-side: passcode exact match; message non-empty;
  `userIds` must be a non-empty array; deduplicated via `Set`; capped at
  `MAX_RECIPIENTS = 20` (rejects the whole request if exceeded, does not
  silently truncate); every ID must match `SNOWFLAKE_RE = /^\d{15,20}$/`
  (rejects the whole request if any one ID is malformed — all-or-nothing,
  not partial).
- **Error states:** 405, 500 (misconfigured), 401 (bad passcode), 400
  (missing message / no IDs / too many IDs / malformed ID). Per-recipient
  send failures do **not** produce an HTTP error — the endpoint still
  returns 200 with a `results` array where individual entries can have
  `ok:false, error:"..."` (e.g. "could not open DM channel (403)" if the
  bot and recipient don't share a server, per Discord's DM-requires-
  shared-server rule documented in `README.md`).
- **Known issues:** Sends are sequential (`for...of`, not parallelized),
  so 20 recipients means up to 40 sequential Discord API calls — slower
  than necessary at the cap, though 20 is small enough this is unlikely to
  be a real problem in practice. No retry on transient failure (matches
  the README's explicitly stated design: "there's no queue, retry, or
  repeat-send built in").
- **Remaining work:** Runtime-verify actual DM delivery with a real (test)
  bot token — see `TESTING.md`.

## 3. Shared access-code gate

- **Purpose:** Prevent random visitors to the public deployed URL from
  using the owner's Gmail account / Discord bot, since there's no other
  authentication.
- **User flow:** Typed once per send into the "Access code" field
  (`type="password"`, so it's masked on-screen but not otherwise
  protected); sent in the plaintext JSON body of every API request.
- **Status: Verified complete** as a mechanism (present, wired, and
  enforced identically in both `api/*.js` handlers — confirmed by reading
  both files in full), but explicitly **not** a strong security control —
  see `SECURITY.md` for the full risk analysis (no rate limiting, no
  hashing, no lockout, plain `!==` string comparison).
- **Relevant files:** `index.html` (`#passcode` input), `script.js` (reads
  `passcodeEl.value`, includes it in both POST bodies), `api/send-email.js`
  and `api/send-discord.js` (`SITE_PASSCODE` comparison).
- **Env vars:** `SITE_PASSCODE`.
- **Known issues / remaining work:** See `SECURITY.md` → Recommended
  fixes (rate limiting is the highest-value addition if this is ever
  exposed more broadly than "a few trusted people know the passcode").

## Features NOT found in this repo (explicitly out of scope / not present)

- No user accounts/login of any kind.
- No message history/log of what was sent, to whom, or when — nothing is
  persisted anywhere (confirmed: no database, no file writes, no
  `localStorage` usage in `script.js`).
- No scheduling/queuing/retry of sends.
- No file/image attachments for either email or Discord.
- No admin panel or way to view/rotate the passcode from the UI (must be
  changed via the Vercel dashboard's environment variables).
