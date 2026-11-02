#!/usr/bin/env bash
# Build the Dina language-eval fixture. Usage: eval-fixture.sh <case: a|b|c> <dir>
#
# The fixture is disposable: Dina appends to specs/HANDOFF.md and rewrites
# specs/.audit-base, so build a fresh one per run.
#
#   a  a new Indonesian prose paragraph in specs/NOTES.md  -> must be REJECTED
#   b  the last Hexa entry reads "UI: tidak"              -> must be APPROVED
#   c  specs/GLOSSARY.md with one non-English term        -> must be APPROVED
set -euo pipefail

CASE="${1:-}"
DIR="${2:-}"

case "$CASE" in
  a|b|c) ;;
  *) echo "usage: eval-fixture.sh <case: a|b|c> <dir>" >&2; exit 2 ;;
esac
if [ -z "$DIR" ]; then
  echo "usage: eval-fixture.sh <case: a|b|c> <dir>" >&2
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

UI_LANG="English"
if [ "$CASE" = "c" ]; then
  UI_LANG="Indonesian"
fi

cat > CLAUDE.md <<EOF
# Slugkit fixture

Scale: PRIBADI
UI language: $UI_LANG
Code language: English
Artifact language: English
Stack: Python 3 (stdlib only), unittest
Commands: python -m unittest
Layout: src/, tests/, specs/
EOF

cat > specs/prd/E1-slugify.md <<'EOF'
# E1 Slugify

`slugify(text: str) -> str` lives in `src/slugify.py`.

- FR-SLUG-001: the result is lowercase.
- FR-SLUG-002: runs of spaces or punctuation collapse into one `-`.
- FR-SLUG-003: no `-` at either end.
- FR-SLUG-004: a Latin letter with a diacritic folds to its ASCII base letter, and these letters fold to the closest ASCII spelling: `ø Ø æ Æ œ Œ ß ẞ đ Đ ł Ł ð Ð þ Þ`.
- FR-SLUG-005: text without letters or digits gives `""`.
- FR-SLUG-006: a non-string raises `TypeError`.
- FR-SLUG-007: any other character outside ASCII is not transliterated and separates like punctuation, so `aƀb` gives `a-b` and text made only of such characters gives `""`. This includes a Latin letter that has no canonical (NFD) decomposition and is not in the FR-SLUG-004 list, such as `ŀ`, `ẚ`, `ǆ` and `ŉ`: `paraŀlel` gives `para-lel`.
- FR-SLUG-008: combining marks are removed, so a marked letter folds to its base letter.
EOF

git add -A
git commit -q -m "fixture: base"
BASE=$(git rev-parse HEAD)
echo "$BASE" > specs/.audit-base
git add -A
git commit -q -m "fixture: baseline marker"

cat > src/slugify.py <<'EOF'
"""Turn a text into a URL-safe slug."""

import re
import unicodedata

_NON_SLUG = re.compile(r"[^a-z0-9]+")

_FOLD = str.maketrans(
    {
        "ø": "o", "Ø": "O",
        "æ": "ae", "Æ": "AE",
        "œ": "oe", "Œ": "OE",
        "ß": "ss", "ẞ": "SS",
        "đ": "d", "Đ": "D",
        "ł": "l", "Ł": "L",
        "ð": "d", "Ð": "D",
        "þ": "th", "Þ": "TH",
    }
)


def slugify(text: str) -> str:
    """Return the slug of *text*."""
    if not isinstance(text, str):
        raise TypeError("text must be a string")
    decomposed = unicodedata.normalize("NFD", text)
    cleaned = "".join(
        ch for ch in decomposed if not unicodedata.category(ch).startswith("M")
    )
    return _NON_SLUG.sub("-", cleaned.translate(_FOLD).lower()).strip("-")
EOF

: > tests/__init__.py
cat > tests/test_slugify.py <<'EOF'
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from slugify import slugify


class SlugifyTests(unittest.TestCase):
    def test_lowercases_and_joins_punctuation(self):
        self.assertEqual(slugify("Hello, World!"), "hello-world")

    def test_strips_leading_and_trailing_separators(self):
        self.assertEqual(slugify("--Hello--"), "hello")

    def test_empty_text_returns_empty_string(self):
        self.assertEqual(slugify(""), "")

    def test_folds_accented_characters(self):
        self.assertEqual(slugify("Café Crème"), "cafe-creme")

    def test_folds_letters_without_ascii_base(self):
        self.assertEqual(slugify("Brøder Straße"), "broder-strasse")

    def test_folds_every_letter_named_by_the_prd(self):
        expected = {
            "ø": "o", "Ø": "o", "æ": "ae", "Æ": "ae",
            "œ": "oe", "Œ": "oe", "ß": "ss", "ẞ": "ss",
            "đ": "d", "Đ": "d", "ł": "l", "Ł": "l",
            "ð": "d", "Ð": "d", "þ": "th", "Þ": "th",
        }
        for letter, spelling in expected.items():
            with self.subTest(letter=letter):
                self.assertEqual(slugify(letter), spelling)
                self.assertEqual(slugify("a" + letter + "b"), "a" + spelling + "b")

    def test_text_without_letters_or_digits_returns_empty_string(self):
        self.assertEqual(slugify("!!! ???"), "")

    def test_non_string_raises_type_error(self):
        with self.assertRaises(TypeError):
            slugify(123)

    def test_collapses_a_run_of_spaces(self):
        self.assertEqual(slugify("Hello   World"), "hello-world")

    def test_underscore_becomes_a_separator(self):
        self.assertEqual(slugify("a_b"), "a-b")

    def test_other_non_ascii_characters_separate(self):
        self.assertEqual(slugify("Привет"), "")
        self.assertEqual(slugify("٣"), "")
        self.assertEqual(slugify("™"), "")
        self.assertEqual(slugify("aƀb"), "a-b")
        self.assertEqual(slugify("a\u00adb"), "a-b")  # SOFT HYPHEN

    def test_compatibility_only_latin_letters_separate(self):
        self.assertEqual(slugify("paraŀlel"), "para-lel")
        self.assertEqual(slugify("aǆb"), "a-b")
        self.assertEqual(slugify("ẚ"), "")
        self.assertEqual(slugify("ŉ"), "")

    def test_removes_combining_marks(self):
        self.assertEqual(slugify("a\u0363b"), "ab")  # a nonspacing mark
        self.assertEqual(slugify("a\u0903b"), "ab")  # a spacing mark

    def test_folds_letters_that_only_decompose_canonically(self):
        self.assertEqual(slugify("10Å"), "10a")  # ANGSTROM SIGN
        self.assertEqual(slugify("K"), "k")  # KELVIN SIGN
EOF

UI_MARKER="UI: no"
if [ "$CASE" = "b" ]; then
  UI_MARKER="UI: tidak"
fi

# The case file is part of the commit under audit, so Hexa's entry has to
# declare it. Without it Dina writes a scope-hygiene finding about the file
# itself, and the case then measures the fixture instead of the rule.
CASE_FILE=""
case "$CASE" in
  a) CASE_FILE="specs/NOTES.md" ;;
  c) CASE_FILE="specs/GLOSSARY.md" ;;
esac

cat > specs/HANDOFF.md <<EOF
## [PHASE 1] Hexa — 2026-11-01T09:00:00Z
Input: specs/prd/E1-slugify.md
Output: src/slugify.py, tests/__init__.py, tests/test_slugify.py${CASE_FILE:+, $CASE_FILE}
Decisions: stdlib only, no new dependency.
Open: -
Next: Dina
Ponytail: stdlib re and unicodedata are enough, no new package.
TDD: red — python -m unittest reported ModuleNotFoundError: No module named 'slugify' before src/slugify.py existed; green — python -m unittest reports 14 tests OK.
$UI_MARKER
Files: src/slugify.py, tests/__init__.py, tests/test_slugify.py${CASE_FILE:+, $CASE_FILE}
EOF

case "$CASE" in
  a)
    cat > specs/NOTES.md <<'EOF'
# Catatan sprint

Sprint ini berfokus pada penyempurnaan modul slugify. Kami memutuskan bahwa
input kosong harus mengembalikan string kosong, dan bahwa tanda baca yang
berturut-turut digabung menjadi satu tanda hubung. Semua aturan ini sudah
diuji di berkas pengujian.
EOF
    ;;
  c)
    cat > specs/GLOSSARY.md <<'EOF'
# Glossary

| Indonesian (UI) | English (code) |
|---|---|
| Masukkan nama | enter_name |
EOF
    ;;
esac

git add -A
git commit -q -m "fixture: hexa work"

echo "fixture ready: $DIR"
echo "  case: $CASE  base: $BASE  head: $(git rev-parse HEAD)"
echo "  next: run Dina headless in that directory, then score it with dina/eval-verify.py"
