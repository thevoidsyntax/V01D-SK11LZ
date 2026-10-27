# `/autor release` — potong rilis

Dibaca `autor/SKILL.md` saat `/autor release` dijalankan.

**Action:** Turn the `## [Unreleased]` block of `CHANGELOG.md` into a versioned release, tag it, and push it. Ask before every step that writes, tags, or pushes.

**Preconditions.** Check all of these first and stop with the reason:
- `CHANGELOG.md` exists in the repo root and has a `## [Unreleased]` heading with at least one entry under it. An empty block means there are no release notes yet: stop and say so, they are written first (Vika in the pipeline).
- The working tree is clean: `git status --porcelain` prints nothing. If not, stop and list the changed files.
- The branch is not detached: `git symbolic-ref --short HEAD` succeeds.

**Step 1 - Version bump.**
- Last released version: the newest `## [x.y.z]` heading in `CHANGELOG.md`; if there is none, `0.0.0`.
- Base commit: `git describe --tags --abbrev=0 --match 'v[0-9]*'`. If that fails (no semver tag), use the commit that added the last version heading: `git log -1 --format=%H -S'## [<last version>]' -- CHANGELOG.md`. If that also fails, use the first commit of the repo.
- Range = `<base>..HEAD`, read with `git log --format='%h %s%n%b' <base>..HEAD`. The body is needed to spot a `BREAKING CHANGE:` line. An empty range means there is nothing to release: stop and say so.
- Bump: `feat!` or a `BREAKING CHANGE:` line → major; `feat` → minor; `fix` and `perf` → patch; `docs`, `chore`, `test`, `ci`, `refactor` → no bump. The strongest bump wins; when no commit asks for a bump, use patch.
- Only `v[0-9]*` tags are versions. Other tags (this repo has `skills-v1-full`) are snapshots and are ignored.
- Print:

```text
RELEASE: 4.0.0 → 4.1.0  (minor)
  feat  6fc9f08  roadmap mode for Satria and epic route in /agents
  feat  87fa7cc  branch and PR flow
  fix   0ec9442  make Hexa invoke ponytail/impeccable/anti-slop
  docs  cbfb34a  hooks deny instead of ask
```

- The version comes only from this table. The per-skill `metadata.version` counters are bumped in the change commit, never here.

**Step 2 - Release notes and rollback.**
- The body is the existing `[Unreleased]` entries, unchanged and in order; they are the notes the pipeline already wrote.
- Add one sentence at the top: what changed, not how big it is.
- Add a `### Rollback` section at the end of the body:
  - the previous release, its version number and its tag when one exists;
  - when `migrations/` changed in the range, one line per migration with its down step, read from `migrations/*/down.sql` or the note in `migrations/README.md`, e.g. `2026-10-22_add_status - drops the status column and its index`;
  - when no migration changed: `No schema change. Go back to <previous>: git checkout <previous tag or version>, or git revert <base>..HEAD`.
- Never write a down step that is not in the repo. A migration without a down script is said to need a manual rollback.

**Step 3 - Cut the CHANGELOG.**
- Rename `## [Unreleased]` to `## [<new version>] - <date>`, with the date from `date -u +%Y-%m-%d`.
- Insert a fresh empty `## [Unreleased]` above it.
- Update the `## Versioning` table: the new version becomes `Current` and every other row becomes `Previous`. Insert a row for the previous release when the table has none, so the table never lags behind the headings.
- Show `git diff CHANGELOG.md` and ask **Commit** / **Ubah** / **Lewati**. On **Lewati** stop; nothing is written.

**Step 4 - Commit.** Only after **Commit**.
- `git add CHANGELOG.md`, then `git commit -m "chore(release): v<version>"` with a body holding the one-sentence summary and `Co-Authored-By: Vika` (the writer of the release notes; the persona trailer replaces Claude Code's default attribution line).

**Step 5 - Tag.** Only after **Commit**.
- `git tag -a v<version> -m "v<version> - <one-line summary>"`. Ask first. If the tag exists, stop and report it; never move an existing tag.

**Step 6 - Push.** Only after **Commit** and **Tag**.
- `git push` and `git push origin v<version>`. The global hook asks the user, so never use git global options (`-C`, `-c`) here. If the push is denied or fails, leave the tag local and say so.

**Rules.**
- One release per run. Nothing is tagged and nothing is pushed without an explicit go-ahead.
- Never rewrite the heading of a published version. A fix to a released version is a new patch release.
- The rollback note is mandatory: a release without it is not finished.
