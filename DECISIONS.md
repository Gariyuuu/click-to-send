# DECISIONS.md — Architectural Decisions

Decisions below are recovered from the actual repository (code structure,
README, commit history) — not from any chat history this auditor has
access to. Each is labeled **Verified** (directly stated or unambiguously
implied by the repo) or **Inferred** (this auditor's reasonable
interpretation of why the code is shaped this way, not explicitly stated
anywhere).

## 1. No frontend framework — plain HTML/CSS/JS

- **Label:** Verified (directly observable — `package.json` has zero
  frontend framework dependencies; `index.html` loads `script.js` as a
  plain script tag).
- **Decision:** Build the UI as a single static HTML page with vanilla JS,
  no React/Vue/build step/bundler.
- **Rationale (Inferred):** The app is small enough (4 inputs, 2 buttons)
  that a framework would add build complexity without benefit. Consistent
  with the project being a personal utility, not a product meant to grow
  a large UI surface.

## 2. Two independent Vercel serverless functions instead of one combined endpoint

- **Label:** Verified (directly observable — `api/send-email.js` and
  `api/send-discord.js` are separate files with separate, near-identical
  validation logic; a combined single-endpoint file such as
  `api/send.js` with a `channel` param does not exist in this repo).
- **Decision:** Email and Discord sends are two separate routes.
- **Rationale (Inferred):** Matches the UI's two distinct buttons and
  keeps each handler's external-call logic (SMTP vs. Discord REST) fully
  separate, at the cost of some duplicated validation code (see
  `TASKS.md` → Technical debt).

## 3. A single shared passcode instead of real authentication

- **Label:** Verified (directly stated in `README.md`: "the deployed URL
  is public, every send request must include a passcode... this is what
  goes in the 'Access code' field" and "not a substitute for real auth if
  you ever expose something more sensitive").
- **Decision:** Gate both endpoints with one shared `SITE_PASSCODE`
  string compared via `!==`, rather than building real user accounts/
  sessions/OAuth.
- **Rationale (Verified, from README):** The tool is meant for the owner
  (and people they trust with the passcode), not as a multi-tenant public
  product — a lightweight shared secret was judged sufficient for that
  threat model.

## 4. Recipients are typed into the page per-send, not stored

- **Label:** Verified (directly stated in `README.md`: "Both the email
  recipient and Discord user ID(s) are typed into the page each time");
  also verified in code — no `localStorage`/database/config file stores a
  recipient list anywhere.
- **Decision:** No saved contact list, no default recipient — every send
  requires typing the recipient(s) fresh.
- **Rationale (Inferred):** Keeps the implementation stateless and
  avoids needing any persistence layer at all, at the cost of retyping
  recipients on every use.

## 5. Discord sends are capped at 20 recipients, sequential, all-or-nothing ID validation

- **Label:** Verified (directly in code — `MAX_RECIPIENTS = 20`,
  `SNOWFLAKE_RE` validation runs over *all* IDs before *any* DM is
  attempted, and the send loop is a sequential `for...of`, not
  `Promise.all`).
- **Decision:** Reject the whole Discord request if any ID is malformed
  or the count exceeds 20, rather than silently skipping bad IDs or
  truncating the list; send sequentially rather than in parallel.
- **Rationale (Inferred):** All-or-nothing validation avoids partially
  processing a request the caller may not have intended to send (e.g. a
  typo'd extra character in one ID). Sequential sending is simpler and
  avoids any risk of Discord rate-limiting from a burst of parallel
  requests — at a max of 20 recipients (40 calls), the added latency of
  sequential sending is small enough not to matter for a personal tool.

## 6. No queue, retry, or delivery confirmation

- **Label:** Verified (directly stated in `README.md`: "Each click sends
  the message once to each recipient listed — there's no queue, retry, or
  repeat-send built in").
- **Decision:** A click either sends immediately and succeeds/fails, or
  the user manually retries by clicking again.
- **Rationale (Verified, from README, by omission/simplicity):** Matches
  the project's scope as a lightweight utility, not a messaging platform.

## 7. No GitHub auto-deploy — manual `vercel --prod` only

- **Label:** Verified this audit (via `npx vercel project inspect
  click-to-send` showing no "Git Repository" section, and no
  `*-git-main-*.vercel.app` alias among the deployment's aliases — see
  `DEPLOYMENT.md` for the full evidence).
- **Decision:** The Vercel project is not connected to the GitHub repo
  for automatic deploys; every deploy is a manual `npx vercel`/`npx
  vercel --prod` CLI invocation.
- **Rationale:** Not stated anywhere in the repo (no `vercel.json`,
  no comment). Could be deliberate (avoiding an accidental auto-deploy of
  a change involving real credentials) or simply never set up. Not
  guessed further here — flagged as Verified-as-a-fact, Inferred-as-to-
  *why*.

## 8. No test framework, no build step, no lint config

- **Label:** Verified (directly observable — `package.json`'s `"scripts"`
  is `{}`, no test/lint dependency exists, no config files for any such
  tool exist anywhere in the repo).
- **Decision:** Ship without any automated verification tooling.
- **Rationale (Inferred):** Consistent with the project's small size and
  personal-utility scope — the cost of setting up a test/build/lint
  pipeline for ~250 total lines of code across 5 source files likely
  wasn't judged worthwhile by whoever built it.
