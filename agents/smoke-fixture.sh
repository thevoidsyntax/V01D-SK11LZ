#!/usr/bin/env bash
# Build a fixture for the /agents smoke test. Usage: smoke-fixture.sh <variant> <dir>
#
#   clean    the fixture described in agents/smoke-test.md: a PRIBADI project
#            with a roadmap, a PRD index, and the E1 slugify PRD
#   planted  clean, plus one untracked file that carries a real defect
#            (path traversal). /audit scans untracked files, so the gate finds
#            it and the route has to react to a REJECTED
#   units    clean, plus an ADR with a Work units table, so the orchestrator
#            takes the parallel-Hexa branch. Two units own the same file, so
#            the batch scope check has a collision to find
#
# The fixture is disposable: the personas write into it, so build a fresh one
# per run.
set -euo pipefail

VARIANT="${1:-}"
DIR="${2:-}"

case "$VARIANT" in
  clean|planted|units) ;;
  *) echo "usage: smoke-fixture.sh <variant: clean|planted|units> <dir>" >&2; exit 2 ;;
esac
if [ -z "$DIR" ]; then
  echo "usage: smoke-fixture.sh <variant: clean|planted|units> <dir>" >&2
  exit 2
fi
if [ -e "$DIR" ] && [ -n "$(ls -A "$DIR" 2>/dev/null)" ]; then
  echo "refusing to build into a non-empty directory: $DIR" >&2
  echo "the fixture is disposable; use a fresh directory per run" >&2
  exit 2
fi

mkdir -p "$DIR"
cd "$DIR"

git init -q -b main
git config user.email "eval@example.com"
git config user.name "Eval Fixture"
git config commit.gpgsign false

mkdir -p specs/prd src tests
printf '__pycache__/\n*.pyc\n' > .gitignore

cat > CLAUDE.md <<'EOF'
# Slugkit fixture

Scale: PRIBADI
UI language: English
Code language: English
Artifact language: English
Stack: Python 3 (stdlib only), unittest
Commands: python -m unittest
Layout: src/, tests/, specs/
EOF

cat > specs/ROADMAP.md <<'EOF'
# Roadmap

| Epic | Title | Milestone | Depends on | PRD | Status |
|---|---|---|---|---|---|
| E1 | Slugify | M1 | - | specs/prd/E1-slugify.md | todo |
| E2 | Truncate and join | M1 | E1 | | todo |

Current PRD: specs/prd/E1-slugify.md
EOF

cat > specs/PRD.md <<'EOF'
# Product index

Current PRD: specs/prd/E1-slugify.md
EOF

cat > specs/prd/E1-slugify.md <<'EOF'
# E1 Slugify

`slugify(text: str) -> str` lives in `src/slugkit/slugify.py`.

- FR-SLUG-001: the result is lowercase.
  - Given `slugify("Hello World")`, when it runs, then the result is `hello-world`.
- FR-SLUG-002: runs of spaces or punctuation collapse into one `-`.
  - Given `slugify("a,  b")`, when it runs, then the result is `a-b`.
- FR-SLUG-003: no `-` at either end.
  - Given `slugify("--x--")`, when it runs, then the result is `x`.
- FR-SLUG-004: accented Latin letters fold to their ASCII base letter.
  - Given `slugify("Café")`, when it runs, then the result is `cafe`.
- FR-SLUG-005: text without letters or digits gives `""`.
  - Given `slugify("!!!")`, when it runs, then the result is an empty string.
- FR-SLUG-006: a non-string raises `TypeError`.
  - Given `slugify(1)`, when it runs, then it raises `TypeError`.
EOF

cat > specs/HANDOFF.md <<'EOF'
## [SCAFFOLD] autor — 2026-11-01T08:00:00Z
Input: the request
Output: specs/ROADMAP.md, specs/PRD.md, specs/prd/E1-slugify.md
Decisions: PRIBADI project, stdlib only.
Open: -
Next: Hexa
EOF

if [ "$VARIANT" = "units" ]; then
  cat > specs/prd/E1-slugify.md <<'EOF'
# E1 Slugkit

Three modules: the slug rules, a query parser that reuses them, and a CLI.

## Slug rules

`slugify(text: str) -> str` lives in `src/slugkit/slugify.py`.

- FR-SLUG-001: the result is lowercase.
  - Given `slugify("Hello World")`, when it runs, then the result is `hello-world`.
- FR-SLUG-002: runs of spaces or punctuation collapse into one `-`.
  - Given `slugify("a,  b")`, when it runs, then the result is `a-b`.
- FR-SLUG-003: no `-` at either end.
  - Given `slugify("--x--")`, when it runs, then the result is `x`.
- FR-SLUG-004: accented Latin letters fold to their ASCII base letter.
  - Given `slugify("Café")`, when it runs, then the result is `cafe`.
- FR-SLUG-005: text without letters or digits gives `""`.
  - Given `slugify("!!!")`, when it runs, then the result is an empty string.
- FR-SLUG-006: a non-string raises `TypeError`.
  - Given `slugify(1)`, when it runs, then it raises `TypeError`.

## Query parser

`parse_query(raw: str) -> dict[str, str]` lives in `src/slugkit/http_api.py`.

- FR-HTTP-001: a query string is split on `&`, and each pair on `=`.
  - Given `parse_query("a=1&b=2")`, when it runs, then the result is `{"a": "1", "b": "2"}`.
- FR-HTTP-002: the parser reuses the slug rules, so it adds a `slugify_query`
  helper to `src/slugkit/slugify.py` and uses it for every key.
  - Given `parse_query("Full Name=Ada")`, when it runs, then the key is `full-name`.

## CLI

`main(argv: list[str]) -> int` lives in `src/slugkit/cli.py`.

- FR-CLI-001: the CLI prints one slug per line for each argument.
  - Given `main(["Hello World", "Café"])` with stdout captured, when it runs,
    then stdout holds `hello-world` and `cafe` on separate lines.
EOF

  cat > specs/ADR.md <<'EOF'
# ADR — E1 Slugify API

## Context

E1 ships the slug rules, a query parser that reuses them, and a CLI. The work
splits into units that do not all depend on each other.

## Work units

| Unit | Owns | Depends on |
|---|---|---|
| core | `src/slugkit/slugify.py`, `tests/test_slugify.py` | - |
| http | `src/slugkit/http_api.py`, `tests/test_http_api.py`, `src/slugkit/slugify.py` | - |
| cli | `src/slugkit/cli.py`, `tests/test_cli.py` | core |
| integration | `src/slugkit/__init__.py`, `tests/test_integration.py` | core, http, cli |

## Decisions

- `slugify` lives in `src/slugkit/slugify.py`; FR-HTTP-002 puts
  `slugify_query` in that same module, so the core and the http unit both
  write it.
- The HTTP unit answers with `text/plain`.
- The CLI prints one slug per line.
EOF
fi

git add -A
git commit -q -m "fixture: scaffold"

if [ "$VARIANT" = "planted" ]; then
  cat > src/legacy_export.py <<'EOF'
"""Legacy export helper, kept from the old dashboard."""

import os


def read_template(base_dir: str, name: str) -> str:
    """Return the contents of the template file *name* under *base_dir*."""
    path = os.path.join(base_dir, name)
    with open(path, encoding="utf-8") as handle:
        return handle.read()
EOF
fi

echo "fixture ready: $DIR"
echo "  variant: $VARIANT  head: $(git rev-parse HEAD)"
echo "  next: run /agents headless in that directory, write the run output outside it"
