---
name: handover
description: "Write the handover for the next session: phase state, first steps, open findings and lessons, so a session that dies (API error 400, full context, crash) costs nothing. Trigger: /handover, or before leaving a long task for a fresh session."
when_to_use: "Use when the user says /handover, 'serah terima' or 'lanjut sesi baru', when the context passed 150k tokens, or when a subagent died on an API error with the work half done."
metadata:
  version: "1.0.1"
---

# /handover

The working tree is the real state of a task, not the conversation. A handover
is the note that tells the next session where the task stands.

## When to run it

- the user says `/handover`, "serah terima", "lanjut sesi baru";
- the context of the session is large (the hook warns from 150k tokens on
  this machine - the provider's 400 errors hit 10x more often above that);
- a subagent died on an API error and the work is half done.

## What to read first

1. `specs/.state.md` - the snapshot the hook rewrites every turn: branch, git
   status, last phase, last test run, context size. If it is missing, build
   the same facts from `git status`, `git diff --stat` and the last entry of
   `specs/HANDOFF.md`.
2. The last phase entry in `specs/HANDOFF.md` - the decisions and the open
   items belong to the handover.
3. The last "Serah-terima" section in `specs/RESUME.md` - the handover must
   follow the format already used there, in the language of that file.

## What to write

Replace the current handover section of `specs/RESUME.md` (do not append: the file is not a log). Move the previous handover sections to `specs/handoff/RESUME-history.md` first, so `RESUME.md` keeps only the standing sections and one current handover. Keep the format of the previous section:

- **Keadaan** - branch, commit, what is committed and what is not, the test
  count from the last run, what is proven and what is not.
- **Langkah pertama di sesi baru** - a numbered list of the first commands of
  the next session, in the order they have to be run, each one copy-pastable.
  Name the file and the line, not the topic.
- **Temuan terbuka** - every finding still open, with its id and severity.
- **Pelajaran sesi** - what surprised us, in one line each, and what to do
  differently. Only lessons that are not yet in the file.

Rules:

- every number comes from a command that was run (test counts, file counts,
  key counts); never from memory.
- say plainly what is **not** proven. A handover that overstates is worse than
  no handover.
- keep it under a screen: the next session reads it in 30 seconds.
- the uncommitted files are listed by name, so the next session does not
  mistake them for leftovers of a broken run.

## After writing it

- report the path of the section and the first command of the next session;
- if a subagent died on an API error, check the working tree before anything
  else: the edits it already made are **not** wasted work. Relaunch with a
  brief that says "continue, do not start over".
- the next session reads `specs/.state.md` automatically at its start.
