"""Accessibility rules for a rendered page.

Pure, like taste_rules.py: the browser measures (a11y_probe.js and the tab walk
in check.py), this module decides. Each rule names the WCAG 2.2 criterion it
checks, so a finding can be argued with.
"""

import re

ZOOM_LOCK = re.compile(r"maximum-scale\s*=\s*1(\.0+)?\b|user-scalable\s*=\s*(no|0)\b", re.I)


def _f(out, rid, title, detail):
    out.append({"id": rid, "title": title, "detail": detail})


def evaluate(m):
    """Return one finding per issue found in the measurement dict."""
    out = []

    viewport = m.get("viewport") or ""
    if ZOOM_LOCK.search(viewport):
        _f(out, "A1", "zoom locked in the viewport meta (1.4.4)", repr(viewport))

    for t in m.get("positiveTabindex") or []:
        _f(out, "A2", "positive tabindex breaks the tab order (2.4.3)",
           f"{t.get('tag', 'el')} tabindex={t.get('value')}: {str(t.get('text', ''))[:40]!r}")

    for c in m.get("clickNotFocusable") or []:
        _f(out, "A3", "click target the keyboard cannot reach (2.1.1)",
           f"{c.get('tag', 'div')}: {str(c.get('text', ''))[:40]!r}")

    stops = m.get("focusStops") or []
    for s in stops:
        if not s.get("ring"):
            _f(out, "A4", "focus with no visible indicator (2.4.7)",
               f"{s.get('tag', 'el')}: {str(s.get('text', ''))[:40]!r}")
        if s.get("obscured"):
            _f(out, "A5", "focused element hidden behind other content (2.4.11)",
               f"{s.get('tag', 'el')}: {str(s.get('text', ''))[:40]!r}")

    if (m.get("focusable") or 0) > 0 and not stops:
        _f(out, "A6", "Tab never reaches a focusable element (2.1.1)",
           f"{m.get('focusable')} focusable element(s), 0 keyboard stops")

    return out
