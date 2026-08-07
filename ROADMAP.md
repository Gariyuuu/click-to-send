# ROADMAP.md

No time estimates are given anywhere below — none were found in the repo
(no milestones/dates in commit messages, README, or code comments beyond
the two actual commit dates), and none are invented here.

## Current milestone

**Ship a working two-channel (email + Discord) passcode-gated send
utility.** This appears to already be met by the current codebase:

- **Objective:** A single page where the owner can send an ad hoc message
  by email and/or Discord DM without opening Gmail or Discord directly.
- **Priority:** N/A (already the entire scope of the existing repo).
- **Status:** Appears complete per static code review (see
  `FEATURES.md`) — both send paths are fully wired end-to-end. Runtime
  delivery is unverified this audit (see `PROJECT_STATE.md`/`TESTING.md`).
- **Difficulty:** N/A (retrospective — already built).
- **Risk:** Low — the code is small, has no external framework
  dependencies to go stale, and the one real dependency (`nodemailer`) is
  pinned.
- **Definition of done:** A real email arrives and a real Discord DM
  arrives, both triggered from the deployed page with a correct passcode,
  and both correctly rejected with a wrong/missing passcode. Not yet
  independently confirmed this audit — see `TASKS.md` → TASK-101.

## Next milestone

No next milestone has been defined by the user or found in any commit
message, TODO, or roadmap-like comment in the repo. The items below are
this auditor's inferred, unconfirmed candidates based on gaps found during
the audit — **not commitments, not scheduled, not requested by the user.**

- **Objective (candidate):** Runtime-verify both send paths with real
  test credentials.
  - **Priority:** Medium (see `TASKS.md` TASK-101).
  - **Status:** Not started.
  - **Difficulty:** Low (no code change required, just a manual test
    pass).
  - **Risk:** Low.
  - **Definition of done:** See `TASKS.md` TASK-101's acceptance
    criteria.
- **Objective (candidate):** Add basic rate limiting to both API routes.
  - **Priority:** Medium (see `TASKS.md` TASK-102).
  - **Status:** Not started.
  - **Difficulty:** Low-Medium (Vercel serverless functions are
    stateless per-invocation, so simple in-memory rate limiting won't
    reliably work across invocations — a real implementation would need
    an external store, e.g. a small KV/Redis, or accept a coarser
    IP-based approach; this needs a deliberate design decision, not a
    quick patch).
  - **Risk:** Low-Medium (adding external dependencies for this is a
    bigger decision than it first appears — see Difficulty note).
  - **Definition of done:** See `TASKS.md` TASK-102.

## Post-MVP

No post-MVP plans were found or requested. If this project grows past "a
personal utility," reasonable next candidates (again, **not requested,
purely observational**) would be: per-user passcodes instead of one
shared one, a send history/audit log, and email/Discord delivery
confirmation webhooks. None of this is scoped or committed to.

## Long-term ideas

None found in the repo and none invented here.

## Out-of-scope

Explicitly stated as out-of-scope by the existing `README.md`'s own
"Notes" section (verified — this is the repo's own documented design,
not this auditor's opinion):

- A send queue, retry logic, or repeat-send.
- More than 20 Discord recipients per click (hardcoded `MAX_RECIPIENTS`).
- Any authentication stronger than the shared access code ("not a
  substitute for real auth if you ever expose something more sensitive,"
  per `README.md`).
