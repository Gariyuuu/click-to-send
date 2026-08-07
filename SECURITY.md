# SECURITY.md

This is a small personal utility, not a hardened multi-tenant product —
the analysis below evaluates it against that context, not against a
"public SaaS" bar. Findings are based entirely on reading
`api/send-email.js`, `api/send-discord.js`, `script.js`, `index.html`,
`.env.example`, and `.gitignore`.

## Input validation

- **Email path (`api/send-email.js`):** `message` checked for non-empty
  string after trim; `to` checked against `EMAIL_RE =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/` — a basic shape check, not a full RFC 5322
  validator, but sufficient to block obviously-malformed input and is not
  itself a security hole (the actual send goes through Gmail's own SMTP
  validation as a second layer).
- **Discord path (`api/send-discord.js`):** `message` checked the same
  way; `userIds` checked to be a non-empty array, deduplicated, capped at
  20, and every entry validated against `SNOWFLAKE_RE = /^\d{15,20}$/`
  before any network call is made. This is solid input validation for
  this endpoint's shape.
- Both handlers destructure `req.body || {}` defensively, so a missing/
  malformed body doesn't throw before validation runs — it just fails the
  subsequent presence checks with a clean 400/401, not a 500 crash.

## Injection risk

- **Email:** `message` is passed as `nodemailer`'s `text` field (plain
  text body, not `html`) — no HTML/script injection risk into the email
  body itself, since it's never rendered as HTML. `to` is passed straight
  to `nodemailer` after regex validation; `nodemailer` handles SMTP header
  encoding internally, so there's no obvious header-injection vector from
  a single validated-shape email address. Not independently fuzz-tested
  this audit.
- **Discord:** `message` is sent as `content` in a JSON body to Discord's
  REST API — Discord itself is responsible for rendering that as (at
  most) Markdown-formatted text in a DM, not arbitrary HTML/script; this
  is standard, low-risk usage of a JSON REST API, no raw HTML/SQL
  concatenation happens anywhere in this codebase.
- **No SQL anywhere** — there is no database, so SQL injection is not
  applicable (see `DATABASE.md`).

## XSS risk

- `script.js` only ever writes to `statusEl.textContent` (never
  `.innerHTML`) — confirmed by reading the full file. This means even if
  a `message`/error string somehow contained HTML, it would render as
  literal text, not be parsed as markup. **No XSS vector found in the
  client code.**

## CSRF risk

- Both API routes accept any-origin `POST` requests with a JSON body and
  rely solely on the `passcode` field for authorization — there is no
  CORS restriction visible in the code (no `Access-Control-Allow-Origin`
  header is set by either handler, which means Vercel's default same-origin-
  ish browser behavior applies for browser-based CSRF, but the endpoints
  are equally callable by any non-browser client, e.g. `curl`, from
  anywhere, since there's no session/cookie-based auth to protect via
  CSRF tokens in the first place). In practice, **the passcode itself is
  the only access control**, and it's a request-body value, not a cookie
  — so classic CSRF (an attacker's page tricking a logged-in browser into
  making an authenticated request without knowing the credential) does
  not apply here, since there's no ambient browser-held credential
  (cookie/session) to ride on. The real risk is simpler: **anyone who
  obtains the passcode string, by any means, has full use of both
  endpoints from anywhere.**

## Secret handling

- **`.env.example` contains placeholders only** — verified by reading the
  file in full (`SITE_PASSCODE=pick_something_only_you_know`,
  `GMAIL_USER=youraccount@gmail.com`,
  `GMAIL_APP_PASSWORD=your16charapppassword`,
  `DISCORD_BOT_TOKEN=your_bot_token`). No real value is present.
- **No `.env`/`.env.local` file exists in this checkout** (verified via
  `ls -la .env*` — only `.env.example` is present).
- **`.gitignore` correctly ignores `.env`, `.env.local`, and a catch-all
  `.env*`** — and, unlike a similar sibling-project audit finding, this
  does **not** accidentally also block `.env.example` from being
  committed (confirmed: `.env.example` **is** tracked in git, per `git
  log --oneline -- .env.example` and `git show --stat` on the initial
  commit). No fix was needed here.
- **`git grep` across all tracked files for `GMAIL_APP_PASSWORD`,
  `DISCORD_BOT_TOKEN`, `SITE_PASSCODE`** found only the env-var *names*
  (in `README.md`'s setup instructions and in `api/*.js`'s
  `process.env.X` reads) — never an actual value. **No secret leak found
  in git history or the working tree.**
- Server-side error responses never include the underlying error's
  message/stack (both `catch` blocks return a fixed generic string) — so
  a misconfigured or failing SMTP/Discord call can't leak credential-
  adjacent details to a client via an error message.

## Rate limiting

**None exists.** Neither `api/send-email.js` nor `api/send-discord.js`
tracks request counts, IPs, or timing in any way. Once someone has the
passcode, nothing in this codebase limits how many emails/DMs they can
trigger, how fast, or from how many different sources. This is the
single highest-value gap found in this audit.

- **Recommended fix (not implemented, out of scope for this
  documentation-only audit):** Add a lightweight rate limit — options
  include Vercel's own Edge Config / KV-backed rate limiting, a
  third-party service (e.g. Upstash Redis, commonly paired with Vercel
  serverless functions), or, as a much simpler stopgap, a hard cap on
  total sends per time window tracked in an external store (there is no
  in-repo database to track it in today — see `DATABASE.md`). A purely
  in-memory counter inside the serverless function would **not** work
  reliably, since Vercel functions are not guaranteed to reuse the same
  warm instance between requests.

## Dependency concerns

- **`nodemailer@9.0.3`** — the only runtime dependency, pinned to an
  exact version in `package-lock.json`. No known-vulnerability check
  (e.g. `npm audit`) was run during this audit (would require network
  access to the npm registry, judged out of scope for a read-only
  documentation pass — flagged as **Unable to verify** rather than
  assumed clean). Recommend running `npm audit` in a future session
  before considering dependencies "checked."
- No other dependencies exist (`api/send-discord.js` uses the platform
  `fetch` global, not a package).

## Access-code (passcode) analysis

- Compared via plain `!==` in both handlers — not a constant-time
  comparison. At this app's realistic threat model (a personal tool, low
  request volume, not a target for sophisticated timing-attack actors)
  this is a low-severity theoretical gap, not a practical one, but is
  worth knowing if this code is ever repurposed for something more
  sensitive.
- Sent as plaintext JSON in the request body over HTTPS (per README, "good
  enough to keep random visitors out"). HTTPS is provided by Vercel's
  platform TLS termination, not configured in this repo's code — not
  independently verified this audit that the deployed URL enforces HTTPS
  (Vercel's default behavior is to redirect HTTP→HTTPS automatically for
  `*.vercel.app` domains; not re-confirmed by a live request this audit).
- No lockout/backoff after repeated wrong passcodes — combined with no
  rate limiting (above), a brute-force guess of the passcode is not
  technically prevented, though the passcode has no length/format
  constraint documented (it's "any string only you know" per README), so
  its actual guessability depends entirely on what the owner picked.

## Recommended fixes (priority order)

1. Add rate limiting to both `api/*.js` routes (see above) — highest
   value, addresses the most realistic abuse scenario (a leaked passcode
   being used to spam sends).
2. Run `npm audit` (or equivalent) to check `nodemailer@9.0.3` for known
   vulnerabilities — not done this audit.
3. Consider a constant-time comparison for the passcode check (low
   priority given the threat model, but a cheap, no-downside hardening).
4. Consider whether HTTPS enforcement should be explicitly verified
   against the live deployment rather than assumed from Vercel defaults.

No fixes were implemented during this audit — this is a documentation-only
pass; all of the above are recommendations for a future task, not changes
made.
