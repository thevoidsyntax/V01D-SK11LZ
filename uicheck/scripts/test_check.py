"""Tests for check.py: python -m unittest uicheck/scripts/test_check.py -v"""

import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

try:
    import playwright.sync_api  # noqa: F401
    HAVE_PLAYWRIGHT = True
except ImportError:
    HAVE_PLAYWRIGHT = False

CHECK = Path(__file__).with_name("check.py")
PIXEL = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="


@unittest.skipUnless(HAVE_PLAYWRIGHT, "playwright is not installed")
class CheckTest(unittest.TestCase):
    def run_check(self, body, width=360):
        with tempfile.TemporaryDirectory() as tmp:
            page = Path(tmp) / "index.html"
            page.write_text(f"<!doctype html><title>t</title><body>{body}</body>", encoding="utf-8")
            return self.run_url(page.as_uri(), width)

    def run_url(self, url, width=360):
        return subprocess.run(
            [sys.executable, str(CHECK), url, "--width", str(width), "--timeout", "5000"],
            capture_output=True, text=True,
        )

    def test_clean_page_passes(self):
        r = self.run_check(f'<h1>Hi</h1><label for="a">Name</label><input id="a"><img src="{PIXEL}" alt="logo">')
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)

    def test_wide_element_fails_and_is_named(self):
        r = self.run_check('<div style="width:900px">wide</div>')
        self.assertEqual(r.returncode, 1, r.stdout)
        self.assertIn("div width=900", r.stdout)

    def test_input_without_label_fails(self):
        r = self.run_check('<input name="email">')
        self.assertEqual(r.returncode, 1, r.stdout)
        self.assertIn("inputs without a label", r.stdout)

    def test_placeholder_is_not_a_label(self):
        r = self.run_check('<input name="email" placeholder="Email">')
        self.assertEqual(r.returncode, 1, "placeholder-only input passed:\n" + r.stdout)

    def test_label_for_wrapping_and_aria_label_pass(self):
        r = self.run_check(
            '<label for="a">A</label><input id="a">'
            '<label>B <input name="b"></label>'
            '<input name="c" aria-label="C">'
        )
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)

    def test_image_without_alt_attribute_fails(self):
        r = self.run_check(f'<img src="{PIXEL}">')
        self.assertEqual(r.returncode, 1, r.stdout)
        self.assertIn("images without alt", r.stdout)

    def test_decorative_image_with_empty_alt_passes(self):
        r = self.run_check(f'<img src="{PIXEL}" alt="">')
        self.assertEqual(r.returncode, 0, "alt=\"\" flagged as missing:\n" + r.stdout)

    def test_image_with_alt_text_passes(self):
        r = self.run_check(f'<img src="{PIXEL}" alt="a cat">')
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)

    def test_unreachable_url_exits_nonzero_with_reason(self):
        r = self.run_url("http://127.0.0.1:1/")
        self.assertNotEqual(r.returncode, 0)
        self.assertIn("could not load", r.stdout + r.stderr)


if __name__ == "__main__":
    unittest.main()
