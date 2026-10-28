"""Tests for the house-style rules: python -m unittest uicheck/scripts/test_taste_rules.py -v

The rule tests need no browser: taste_rules.py decides from a measurement dict.
The last two tests run the real page through check.py and need Playwright.
"""

import subprocess
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from taste_rules import evaluate  # noqa: E402

try:
    import playwright.sync_api  # noqa: F401
    HAVE_PLAYWRIGHT = True
except ImportError:
    HAVE_PLAYWRIGHT = False

CHECK = Path(__file__).with_name("check.py")
FIXTURES = Path(__file__).parent.parent / "fixtures"


class RuleTest(unittest.TestCase):
    def ids(self, measurement):
        return [f["id"] for f in evaluate(measurement)]

    def test_empty_measurement_is_clean(self):
        self.assertEqual(evaluate({}), [])

    def test_type_size_ceiling_is_five(self):
        self.assertNotIn("T1", self.ids({"typeSizes": [14, 16, 18, 20, 24]}))
        self.assertIn("T1", self.ids({"typeSizes": [12, 14, 16, 18, 20, 24]}))

    def test_headline_over_two_lines_fires(self):
        self.assertIn("T2", self.ids({"headings": [{"tag": "h1", "lines": 3, "text": "x"}]}))
        self.assertNotIn("T2", self.ids({"headings": [{"tag": "h1", "lines": 2}]}))

    def test_eyebrow_fires(self):
        self.assertIn("T3", self.ids({"eyebrows": [{"tag": "span", "fontSize": 11, "text": "New"}]}))

    def test_pill_bar_fires(self):
        self.assertIn("T4", self.ids({"pillBars": [{"tag": "nav"}]}))

    def test_hairline_fires(self):
        self.assertIn("T5", self.ids({"hairlines": [{"tag": "div"}]}))

    def test_monospace_fires(self):
        self.assertIn("T6", self.ids({"monospace": [{"tag": "span"}]}))

    def test_tiny_caps_fire(self):
        self.assertIn("T7", self.ids({"tinyCaps": [{"tag": "span", "fontSize": 10, "text": "NEW"}]}))

    def test_icon_card_row_needs_three(self):
        self.assertNotIn("T8", self.ids({"iconCards": [{"count": 2}]}))
        self.assertIn("T8", self.ids({"iconCards": [{"count": 3}]}))

    def test_nested_card_fires(self):
        self.assertIn("T9", self.ids({"nestedCards": [{"tag": "div"}]}))

    def test_emoji_fires(self):
        self.assertIn("T10", self.ids({"emoji": [{"tag": "span", "text": "rocket"}]}))

    def test_index_numbering_fires(self):
        self.assertIn("T11", self.ids({"indexNumbers": [{"tag": "span", "text": "01"}]}))

    def test_shadow_ceiling(self):
        self.assertNotIn("T12", self.ids({"shadows": [{}] * 6}))
        self.assertIn("T12", self.ids({"shadows": [{}] * 7}))

    def test_blank_stretch_needs_a_viewport_height(self):
        self.assertNotIn("T13", self.ids({"sectionGaps": [{"px": 900, "tag": "section"}]}))
        self.assertIn("T13", self.ids({
            "viewportHeight": 800,
            "sectionGaps": [{"px": 900, "tag": "section"}],
        }))

    def test_gradient_fires(self):
        self.assertIn("T14", self.ids({"gradients": [{"tag": "h1"}]}))

    def test_trailing_arrow_fires(self):
        self.assertIn("T15", self.ids({"trailingArrows": [{"tag": "a", "text": "Lihat harga →"}]}))

    def test_middle_dot_meta_fires(self):
        self.assertIn("T16", self.ids({"midDots": [{"tag": "p", "text": "Jakarta · 2026 · Gratis"}]}))


@unittest.skipUnless(HAVE_PLAYWRIGHT, "playwright is not installed")
class PageTest(unittest.TestCase):
    def run_check(self, fixture, *flags):
        return subprocess.run(
            [sys.executable, str(CHECK), (FIXTURES / fixture).as_uri(), "--width", "360",
             "--timeout", "5000", *flags],
            capture_output=True, text=True,
        )

    def test_clean_page_reports_no_finding(self):
        r = self.run_check("taste-clean.html", "--taste")
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        self.assertIn("house style: clean", r.stdout)

    def test_page_with_tells_reports_them_as_warnings(self):
        r = self.run_check("taste-tells.html", "--taste")
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        self.assertIn("house style:", r.stdout)
        for rid in ("T1", "T2", "T3", "T5", "T7", "T8", "T10", "T11", "T12", "T14", "T15", "T16"):
            self.assertIn(rid, r.stdout, f"{rid} missing:\n{r.stdout}")

    def test_strict_mode_fails_the_run(self):
        r = self.run_check("taste-tells.html", "--taste-strict")
        self.assertEqual(r.returncode, 1, r.stdout)
        self.assertIn('"pass": false', r.stdout)


if __name__ == "__main__":
    unittest.main()
