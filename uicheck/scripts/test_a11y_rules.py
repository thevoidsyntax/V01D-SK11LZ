"""Tests for the accessibility rules: python -m unittest uicheck/scripts/test_a11y_rules.py -v

The rule tests need no browser: a11y_rules.py decides from a measurement dict.
The page tests run the real fixtures through check.py and need Playwright.
"""

import subprocess
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from a11y_rules import evaluate  # noqa: E402

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

    def test_zoom_lock_fires(self):
        self.assertIn("A1", self.ids({"viewport": "width=device-width, maximum-scale=1"}))
        self.assertIn("A1", self.ids({"viewport": "width=device-width, user-scalable=no"}))
        self.assertIn("A1", self.ids({"viewport": "width=device-width,user-scalable=0"}))

    def test_plain_viewport_is_clean(self):
        self.assertNotIn("A1", self.ids({"viewport": "width=device-width, initial-scale=1"}))
        self.assertNotIn("A1", self.ids({"viewport": "width=device-width, maximum-scale=5"}))

    def test_positive_tabindex_fires(self):
        self.assertIn("A2", self.ids({"positiveTabindex": [{"tag": "a", "value": 3}]}))

    def test_click_target_without_focus_fires(self):
        self.assertIn("A3", self.ids({"clickNotFocusable": [{"tag": "div", "text": "Beli"}]}))

    def test_focus_stop_without_visible_ring_fires(self):
        stops = [{"tag": "button", "text": "Simpan", "ring": False, "obscured": False}]
        self.assertIn("A4", self.ids({"focusStops": stops}))

    def test_obscured_focus_stop_fires(self):
        stops = [{"tag": "a", "text": "Masuk", "ring": True, "obscured": True}]
        self.assertIn("A5", self.ids({"focusStops": stops}))

    def test_visible_unobscured_stop_is_clean(self):
        stops = [{"tag": "a", "text": "Masuk", "ring": True, "obscured": False}]
        self.assertEqual(self.ids({"focusStops": stops, "focusable": 1}), [])

    def test_focusable_page_with_no_keyboard_stop_fires(self):
        self.assertIn("A6", self.ids({"focusable": 3, "focusStops": []}))
        self.assertNotIn("A6", self.ids({"focusable": 0, "focusStops": []}))


@unittest.skipUnless(HAVE_PLAYWRIGHT, "playwright is not installed")
class PageTest(unittest.TestCase):
    def run_check(self, fixture, *flags):
        r = subprocess.run(
            [sys.executable, str(CHECK), (FIXTURES / fixture).as_uri(), "--width", "360",
             "--timeout", "30000", *flags],
            capture_output=True, text=True,
        )
        # Exit code 1 means a fail and also "could not load"; only a measured page counts.
        if "url=" not in r.stdout:
            self.fail(f"check.py never measured the page (exit {r.returncode}):\n{r.stderr[-800:]}")
        return r

    def test_clean_page_reports_no_finding(self):
        r = self.run_check("a11y-clean.html", "--a11y")
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        self.assertIn("accessibility: clean", r.stdout)
        self.assertIn("tab stops: 3 of 3 focusable", r.stdout)

    def test_broken_page_reports_every_rule_as_a_warning(self):
        r = self.run_check("a11y-broken.html", "--a11y")
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        for rid in ("A1", "A2", "A3", "A4", "A5"):
            self.assertIn(rid, r.stdout, f"{rid} missing:\n{r.stdout}")

    def test_strict_mode_fails_the_run(self):
        r = self.run_check("a11y-broken.html", "--a11y-strict")
        self.assertEqual(r.returncode, 1, r.stdout + r.stderr)
        self.assertIn('"pass": false', r.stdout)


if __name__ == "__main__":
    unittest.main()
