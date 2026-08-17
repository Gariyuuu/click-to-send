# DEPLOYMENT.md

## Hosting provider

**Vercel.** Project name `click-to-send`, org `garywangsmes-8349s-projects`
(per `.vercel/project.json`: `projectId: prj_ie7HmrLI2ew6opI8Z6cdVlet82TB`,
`orgId: team_gofGt63nGGecSpDl9hBbsFWm`). Confirmed live via
`npx vercel project ls` and `npx vercel inspect
https://click-to-send.vercel.app` (status "Ready" as of this audit).

## Production URL

`https://click-to-send.vercel.app` — confirmed live, status "Ready".

**Re-confirmed 2026-08-17** (onboard-mode doc audit, read-only): `npx
vercel inspect https://click-to-send.vercel.app` now shows deployment
`dpl_J4xcL6UWVWJAWuXWePYnAfWRk1Za`, created 2026-08-16 18:33:36 -0700 —
6 days after the original 2026-08-06 audit below, and this timestamp
matches `script.js`/`style.css`'s local file mtimes to the minute, meaning
the live site reflects `HEAD` (`e645ea5`, the button/status
micro-interactions commit), not a stale build. Aliases on this
re-inspection: `https://click-to-send.vercel.app`,
`https://click-to-send-garywangsmes-8349s-projects.vercel.app` (the third
alias observed in 2026-08-06 was not present this time — not investigated
further, not consequential; the primary production URL is unaffected).

Original 2026-08-06 audit (superseded by the above, kept for the
historical record): confirmed live, status "Ready", per `npx vercel
inspect` (deployment `dpl_PRpgESdsEntT9bqLNL6MRG9eqJ4G`, created ~3h
before that audit — which lined up with, but wasn't independently proven
identical to, the `8fbe66d` favicon commit's timestamp). Other equivalent
aliases observed then:
`https://click-to-send-garywangsmes-8349s-projects.vercel.app`,
`https://click-to-send-garywangsmes-8349-garywangsmes-8349s-projects.vercel.app`.

## Build / install commands

- **Install:** `npm install` (installs the one dependency, `nodemailer`).
- **Build:** **None.** Per `npx vercel project inspect click-to-send`,
  Vercel's configured Framework Preset for this project is "Other" and
  the build command shown is Vercel's generic fallback text ("`npm run
  vercel-build` or `npm run build`") — but `package.json` defines neither
  script, so in practice Vercel deploys the static files as-is with no
  build step, and separately bundles each file under `api/` as its own
  serverless function. There is no `vercel.json` in this repo overriding
  any of this — confirmed by its absence.
- **Output directory:** Per the same `vercel project inspect` output,
  Vercel's configured default is "`public` if it exists, or `.`" — this
  repo has no `public/` directory, so Vercel serves from the repo root
  (`.`), which is where `index.html`/`style.css`/`script.js` live.

## Environment variable configuration

See `CLAUDE.md`'s environment table for the full list
(`SITE_PASSCODE`, `GMAIL_USER`, `GMAIL_APP_PASSWORD`,
`DISCORD_BOT_TOKEN`). Per `README.md`'s own setup instructions: these
must be added in the **Vercel dashboard** (Project → Settings →
Environment Variables → Production) and the project redeployed, since
`.env`/`.env.local` files are never uploaded by the CLI automatically.
**This audit did not read or verify the actual configured values** on the
live Vercel project (out of scope for a read-only documentation pass, and
unnecessary to confirm the app is deployed).

## Manual-deploy confirmation (no GitHub auto-deploy)

**Confirmed 2026-08-06, and independently re-confirmed 2026-08-17: there
is still no GitHub auto-deploy configured for this project.**

Evidence:
1. `git remote -v` shows a real GitHub remote exists (`origin` →
   `https://github.com/Gariyuuu/click-to-send.git`).
2. `npx vercel project inspect click-to-send` — the output has **no "Git
   Repository" section at all**, both on 2026-08-06 and re-run on
   2026-08-17. When a Vercel project is connected to a git repo for
   auto-deploy, this command prints one (confirmed by contrast: running
   the equivalent inspection against sibling project `chamber-seven`
   (a separate repo at `~/Projects/chamber-seven`, not part of this
   repository), which **is** git-connected, produces
   `*-git-main-*.vercel.app`-style deployment aliases — see that repo's
   own `DEPLOYMENT.md`).
3. `npx vercel inspect https://click-to-send.vercel.app`'s alias list for
   the current production deployment contains only project-name-based
   aliases (`click-to-send.vercel.app`,
   `click-to-send-garywangsmes-8349s-projects.vercel.app`, plus a
   third `...-8349-garywangsmes-8349s-projects.vercel.app` alias observed
   only on the 2026-08-06 inspection) — **no `click-to-send-git-main-*`
   alias exists**, which is the telltale pattern Vercel generates
   specifically for git-integration deploys. Its absence here is
   consistent with (2).
4. **Re-checked 2026-08-17:** no `vercel.json` exists at the repo root
   (confirmed by its absence, same as the original audit) and no
   `.github/workflows/` directory exists either (confirmed via `find
   .github -type f`, which errors "No such file or directory" — the
   `.github/` directory itself doesn't exist). Neither could silently
   introduce an alternate deploy path.
5. **The live deployment's timing is independent corroboration, not just
   absence-of-evidence:** the 2026-08-17 re-inspection found the current
   production deployment (`dpl_J4xcL6UWVWJAWuXWePYnAfWRk1Za`) was created
   2026-08-16 18:33:36 -0700 — the exact minute of the last local commit's
   file mtimes. If GitHub auto-deploy were silently configured, deployment
   timestamps would track `git push` times, which weren't independently
   checked; this is circumstantial, not proof, but is consistent with (2)-(4).

**Practical implication:** pushing a commit to `origin/main` on GitHub
does **not**, by itself, deploy anything. A human (or an agent explicitly
told to) must run `npx vercel` (preview) or `npx vercel --prod`
(production) from this directory, with the Vercel CLI already
authenticated (confirmed authenticated this audit via `npx vercel
whoami` → `garywangsmes-8349`).

This matches the pre-existing user memory note that prompted this audit
("no GitHub auto-deploy — deployment requires manually running `vercel
--prod` after push") — **that note is now independently confirmed
against the actual live project config, not merely repeated.**

## Rollback process

Not exercised during this audit (would require an actual deploy action,
out of scope for a read-only pass). Per Vercel's standard capability:
Vercel retains prior deployments for a project — `npx vercel rollback`
(Vercel CLI) or the dashboard's "Promote to Production" action on a prior
deployment reverts production without a new build. `npx vercel
ls click-to-send` (or the dashboard) would list prior deployments to roll
back to.

## Post-deploy verification (recommended checklist for whoever deploys next)

1. Load the production URL (`https://click-to-send.vercel.app`) and
   confirm the page renders (title "Click to Send", card with 4 inputs +
   2 buttons visible).
2. Run through `TESTING.md`'s manual smoke-test checklist against the
   production URL for at least the email and Discord happy paths — do
   not consider a deploy "done" just because the page loads; the API
   routes need their own check.
3. Confirm the wrong-passcode path still returns 401 in production (a
   quick way to confirm `SITE_PASSCODE` is actually configured on Vercel,
   not just locally).

## What this audit did NOT do

- Did not run `npx vercel` or `npx vercel --prod` (no deploy was
  performed or requested).
- Did not modify `.vercel/project.json` or any Vercel dashboard setting.
- Did not read the actual configured environment variable values on the
  live Vercel project.

## First-time / fresh-clone setup notes

- `node_modules/` and `.vercel/` are gitignored — a fresh clone needs
  `npm install` before anything works locally, and `npx vercel link` (or
  simply running `npx vercel`/`npx vercel dev` while authenticated, which
  prompts to link) to regenerate `.vercel/project.json` if it's ever
  missing.
- No `.nvmrc`/`engines` field pins a Node version locally — Vercel's own
  project setting is Node.js 24.x (per `vercel project inspect`), which a
  fresh local `npm install`/`npx vercel dev` run does not automatically
  match unless the developer's local Node happens to align (local `node
  -v` at audit time was v26.3.0 — different from Vercel's 24.x, though
  this hasn't caused an observed problem since the code uses no
  version-24-vs-26-sensitive Node APIs).
