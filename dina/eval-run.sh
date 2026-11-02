#!/usr/bin/env bash
# Run the Dina language eval once, end to end. Usage: eval-run.sh <case: a|b|c> <work-dir> [budget-usd]
#
#   work-dir   a scratch directory that does not exist yet; the fixture is
#              built in <work-dir>/fixture and the run output is written to
#              <work-dir>/run.json
#   budget-usd the per-run budget, default 5
#
# The fixture is built by eval-fixture.sh and scored by eval-verify.py, so a
# run is reproducible from this repo alone. Two traps are already paid for and
# are avoided here:
#
#   * the Bash allowlist stays wide. A denied command is retried, and the
#     denial loop once burned a whole budget (37 turns, $3.08) without
#     producing a verdict.
#   * the run output is written outside the fixture. A run.json inside it is
#     an untracked file in the repo under audit, and Dina reports it as a
#     finding of the run itself.
set -euo pipefail

CASE="${1:-}"
WORK="${2:-}"
BUDGET="${3:-5}"

case "$CASE" in
  a|b|c) ;;
  *) echo "usage: eval-run.sh <case: a|b|c> <work-dir> [budget-usd]" >&2; exit 2 ;;
esac
if [ -z "$WORK" ]; then
  echo "usage: eval-run.sh <case: a|b|c> <work-dir> [budget-usd]" >&2
  exit 2
fi

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FIXTURE="$WORK/fixture"
RUN_JSON="$WORK/run.json"

mkdir -p "$WORK"
bash "$HERE/eval-fixture.sh" "$CASE" "$FIXTURE"

cd "$FIXTURE"
claude -p "You are **Dina** (QA & Security Auditor). Invoke the \`/dina\` skill and follow its whole workflow. Read only these artifacts: the project CLAUDE.md, specs/HANDOFF.md, specs/.audit-base, specs/, src/, tests/. Produce: specs/AUDIT.md plus everything your workflow writes (the specs/HANDOFF.md entry; for Dina also specs/.audit-base). Write artifacts in English (PRD, ADR, HANDOFF, ROADMAP, docs, commit message, PR body); UI copy follows the project's \`UI language:\`. Keep your reply to a one-line handoff summary. Write one file per step and never put several large files in one turn." \
  --model sonnet --effort high --permission-mode acceptEdits \
  --allowedTools "Agent Skill Read Write Edit Glob Grep Bash" \
  --max-budget-usd "$BUDGET" --output-format json > "$RUN_JSON" 2> "$WORK/run.err" || true

python "$HERE/eval-verify.py" "$FIXTURE" "$CASE" --run-json "$RUN_JSON" || rc=$?
rc=${rc:-0}
if [ "$rc" -eq 0 ]; then
  echo "eval verdict: PASS"
else
  echo "eval verdict: FAIL"
fi
exit "$rc"
