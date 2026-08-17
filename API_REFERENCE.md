# API_REFERENCE.md

Two routes total, both Vercel serverless functions under `api/`, both
`POST`-only. No authentication beyond the shared passcode described
below. No secrets appear in any example in this file — all example values
are placeholders.

---

## `POST /api/send-email`

- **Source file:** `api/send-email.js`
- **Purpose:** Send one email via Gmail SMTP to a recipient typed into the
  page.
- **Auth:** Body must include `passcode` matching the server's
  `SITE_PASSCODE` env var. No headers, cookies, or tokens are used.

### Request

Content-Type: `application/json`

```json
{
  "message": "string, required, non-empty after trim",
  "to": "string, required, must match /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/",
  "passcode": "string, required, must equal process.env.SITE_PASSCODE"
}
```

### Responses

| Status | Condition | Body |
|---|---|---|
| 200 | Email accepted by Gmail's SMTP server | `{ "ok": true }` |
| 400 | `message` missing/empty, or `to` missing/invalid shape | `{ "error": "Message is required" }` or `{ "error": "Valid recipient email is required" }` |
| 401 | `passcode` missing or doesn't match `SITE_PASSCODE` | `{ "error": "Invalid access code" }` |
| 405 | Method other than POST | `{ "error": "Method not allowed" }` |
| 500 | `GMAIL_USER`, `GMAIL_APP_PASSWORD`, or `SITE_PASSCODE` not set on the server | `{ "error": "Server is not configured" }` |
| 500 | `nodemailer.sendMail()` threw (e.g. bad Gmail credentials, network issue) | `{ "error": "Failed to send email" }` (no internal detail leaked) |

### Behavior notes

- Validation order: method → env-vars-configured → passcode → message
  presence → email shape. A request failing an earlier check never
  reaches a later one (e.g. an invalid email with a wrong passcode
  returns 401, not 400).
- The email is always sent `from: GMAIL_USER`, with a fixed subject
  ("New message from Click to Send") and `text: message` (plain text, no
  HTML body, no attachments).
- Uses `nodemailer.createTransport({ service: "gmail", auth: { user, pass
  } })` — Gmail's app-password SMTP path, not OAuth2.

---

## `POST /api/send-discord`

- **Source file:** `api/send-discord.js`
- **Purpose:** DM up to 20 Discord user IDs (deduplicated) via a bot
  account.
- **Auth:** Body must include `passcode` matching `SITE_PASSCODE`, same as
  above.

### Request

Content-Type: `application/json`

```json
{
  "message": "string, required, non-empty after trim",
  "userIds": ["string or number, each must match /^\\d{15,20}$/ after String(id).trim()"],
  "passcode": "string, required, must equal process.env.SITE_PASSCODE"
}
```

- `userIds` must be a non-empty array.
- Duplicate IDs (after trimming) are silently deduplicated via `Set`
  before the count/format checks run.
- Deduplicated count must be ≤ `MAX_RECIPIENTS` (20).
- Every deduplicated ID must match the Discord snowflake shape
  (`15`–`20` digits). If **any** ID fails this check, the **entire**
  request is rejected with 400 — no partial sends happen for a
  format-invalid batch.

### Responses

| Status | Condition | Body |
|---|---|---|
| 200 | Request passed validation; each recipient attempted | `{ "results": [{ "userId": "123456789012345678", "ok": true }, { "userId": "987654321098765432", "ok": false, "error": "could not open DM channel (403)" }] }` |
| 400 | `message` missing/empty | `{ "error": "Message is required" }` |
| 400 | `userIds` missing/not an array/empty | `{ "error": "At least one Discord user ID is required" }` |
| 400 | More than 20 deduplicated IDs | `{ "error": "Too many recipients (max 20)" }` |
| 400 | Any ID fails the snowflake regex | `{ "error": "One or more Discord user IDs are invalid" }` |
| 401 | `passcode` missing or wrong | `{ "error": "Invalid access code" }` |
| 405 | Method other than POST | `{ "error": "Method not allowed" }` |
| 500 | `DISCORD_BOT_TOKEN` or `SITE_PASSCODE` not set | `{ "error": "Discord is not configured on the server" }` |

### Behavior notes

- **200 does not mean every DM succeeded** — check each entry in
  `results` for `ok: true`/`false`. This is a deliberate design so one bad
  recipient (e.g. a user who doesn't share a server with the bot) doesn't
  block the others.
- Per-recipient flow (`sendDm()` helper): `POST
  https://discord.com/api/v10/users/@me/channels` with `{recipient_id:
  userId}` to open/get a DM channel, then `POST
  https://discord.com/api/v10/channels/:channelId/messages` with
  `{content: message}`. Both use `Authorization: Bot <DISCORD_BOT_TOKEN>`.
  A non-OK response from either call throws and is caught per-recipient,
  producing `{ok:false, error:"could not open DM channel (<status>)"}` or
  `{ok:false, error:"could not send message (<status>)"}`.
- Sends happen **sequentially**, not in parallel — up to 40 sequential
  Discord API calls for a full 20-recipient request.
- Per Discord's platform rules (documented in `README.md`, not something
  this code can control): a bot can only DM a user if the bot shares at
  least one server with that user. A recipient who doesn't share a server
  with the bot will show up as `ok:false` in `results`.

---

## Routes NOT present

No `GET` routes exist for either path (both reject non-POST with 405).
No health-check endpoint, no status endpoint, no webhook receiver. No
other files exist under `api/` beyond the two documented above (verified
via `ls api/`, which lists exactly two files, `api/send-discord.js` and
`api/send-email.js`).
