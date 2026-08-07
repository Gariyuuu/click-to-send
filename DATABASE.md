# DATABASE.md

## There is no database in this project.

Verified by:

- `package.json` has exactly one dependency (`nodemailer`) — no database
  client, ORM, or driver of any kind (no `pg`, `mongodb`, `mongoose`,
  `prisma`, `@vercel/postgres`, `@supabase/supabase-js`, `sqlite3`,
  `redis`, etc.).
- No `DATABASE_URL` or any similarly-named env var appears in
  `.env.example` (the four vars present are `SITE_PASSCODE`,
  `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `DISCORD_BOT_TOKEN` — none are
  connection strings).
- No `.sql`, `.prisma`, schema, or migration file exists anywhere in the
  repo.
- No file-based storage (SQLite file, JSON-file-as-DB, etc.) is read or
  written by either `api/send-email.js` or `api/send-discord.js` — both
  are pure request-in/external-API-call/response-out functions with no
  persistence step.
- `script.js` does not use `localStorage`, `sessionStorage`, or
  `IndexedDB` — every form value is read fresh from the DOM at click
  time and nothing is saved between page loads.

## What this means in practice

- Nothing sent through this app is logged, recorded, or recoverable after
  the fact — not on the client, not on the server. If you need a record
  of what was sent, you'd have to add that yourself (e.g. logging to an
  external service, or a real database) — see `TASKS.md`/`ROADMAP.md` for
  related (unrequested) candidate ideas.
- There is nothing to migrate, seed, back up, or restore.
- If a database is ever added to this project, this file should be
  rewritten to document its schema, connection method, migration
  tooling, and backup/restore process — do not silently add persistence
  without recording the decision in `DECISIONS.md` and updating this
  file (per `CLAUDE.md`'s permanent rules).
