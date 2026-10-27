# Push dan pull request setelah commit

Dibaca `agents/SKILL.md` section 7 setelah commit disetujui.

After a commit, only when the branch is not `main`/`master`, remote `origin` exists, and `gh auth status` succeeds. Otherwise print one line saying why and stop; never push.

1. Ask with AskUserQuestion: **Push + PR** / **Hanya push** / **Selesai**. KLIEN: **Push + PR** first. This is the push request; the push hook still asks for approval on its own.
2. Push with a plain `git push -u origin <branch>` run inside the repo. `-C` and `-c` are denied by the hook.
3. PR: write the body to a temp file outside the repo (run it through `/anti-slop`), then `gh pr create --base <default> --head <branch> --title "<commit subject>" --body-file <file>`. Get the default branch from `gh repo view --json defaultBranchRef -q .defaultBranchRef.name`. The body has: Ringkasan, Perubahan (the CHANGELOG line), Rute with Dina's last `STATUS:`, Open items from HANDOFF, Cara uji, and the personas that worked. No Claude attribution line, same as the commit trailers.
4. Review: invoke `/code-review` with the PR number at medium effort, without `--comment`. Print the findings in at most 10 lines. The user decides whether to fix (a new bugfix route on the same branch) or ignore. No automatic loop, no automatic comments.
5. CI: run `gh pr checks <number>` once and print the result.

The pipeline never merges. Merging is the user's call.
