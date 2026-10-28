#!/usr/bin/env python3
"""Render a page and report the facts /impeccable asks for but cannot be read from markup.

Checks, in order of how often they actually fail:
  1. horizontal overflow at a given width (the R4 requirement)
  2. console errors and page errors
  3. unlabelled form inputs and images without alt text
  4. elements wider than the viewport (names the culprits, not just the count)

With --taste it also measures house style (type scale, eyebrow labels, hairline
rules, gradients and the rest) and reports the findings. Those are warnings by
default; --taste-strict makes them fail the run.

With --a11y it walks the page with Tab and checks zoom lock, tab order, click
targets the keyboard cannot reach, visible focus, and focus hidden behind other
content. Warnings by default; --a11y-strict makes them fail the run.

Usage:
    python scripts/check.py <url> [--width 360] [--height 800] [--shot out.png] [--wait selector]
    python scripts/check.py <url> --taste --a11y

Example:
    python scripts/check.py http://localhost:5173 --width 360 --shot 360.png
"""

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from taste_rules import evaluate as evaluate_taste  # noqa: E402
from a11y_rules import evaluate as evaluate_a11y  # noqa: E402

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    sys.exit("playwright is not installed: pip install playwright && python -m playwright install chromium")


PROBE = Path(__file__).with_name("taste_probe.js")
A11Y_PROBE = Path(__file__).with_name("a11y_probe.js")
MAX_TAB_STOPS = 30


def measure_a11y(page):
    """Static scan, then a Tab walk until focus leaves the page or comes back round."""
    source = A11Y_PROBE.read_text(encoding="utf-8")
    page.evaluate(f"window.__a11y = ({source})")
    m = page.evaluate("window.__a11y.scan()")
    stops, seen = [], set()
    for _ in range(MAX_TAB_STOPS):
        page.keyboard.press("Tab")
        stop = page.evaluate("window.__a11y.stop()")
        if stop is None:
            if stops:
                break
            continue
        if stop["id"] in seen:
            break
        seen.add(stop["id"])
        stops.append(stop)
    m["focusStops"] = stops
    return m


def report(label, findings):
    if not findings:
        print(f"{label}: clean")
        return
    print(f"{label}: {len(findings)} finding(s)")
    for f in findings:
        print(f"  {f['id']} {f['title']}: {f['detail']}")


BASIC_PROBE = """(vw) => {
    const doc = document.documentElement;
    const overflow = Math.max(doc.scrollWidth, document.body.scrollWidth) - vw;
    const wide = [];
    for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect();
        if (r.width > vw + 1 && r.height > 0) {
            wide.push({
                tag: el.tagName.toLowerCase(),
                cls: (el.className && el.className.toString().slice(0, 60)) || '',
                width: Math.round(r.width),
            });
        }
    }
    const unlabelled = [];
    for (const el of document.querySelectorAll('input,select,textarea')) {
        if (['hidden', 'submit', 'button', 'reset'].includes(el.type)) continue;
        const id = el.id;
        const hasLabel = id && document.querySelector(`label[for="${id}"]`);
        const wrapped = el.closest('label');
        const aria = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby');
        if (!hasLabel && !wrapped && !aria) {
            unlabelled.push(el.tagName.toLowerCase() + (el.name ? `[name=${el.name}]` : ''));
        }
    }
    const noAlt = [...document.querySelectorAll('img')]
        .filter((i) => !i.hasAttribute('alt'))
        .map((i) => i.getAttribute('src') || '(no src)');
    const overflowX = getComputedStyle(doc).overflowX;
    return {
        overflow, wide: wide.slice(0, 12), unlabelled, noAlt: noAlt.slice(0, 12),
        overflowX, title: document.title,
    };
}"""


def parse_args():
    ap = argparse.ArgumentParser()
    ap.add_argument("url")
    ap.add_argument("--width", type=int, default=360)
    ap.add_argument("--height", type=int, default=800)
    ap.add_argument("--shot", help="write a screenshot to this path")
    ap.add_argument("--wait", help="CSS selector to wait for before measuring")
    ap.add_argument("--timeout", type=int, default=30000)
    ap.add_argument("--taste", action="store_true",
                    help="also measure house style and report the findings as warnings")
    ap.add_argument("--taste-strict", action="store_true",
                    help="make house-style findings fail the run")
    ap.add_argument("--a11y", action="store_true",
                    help="also walk the page with Tab and report accessibility findings as warnings")
    ap.add_argument("--a11y-strict", action="store_true",
                    help="make accessibility findings fail the run")
    args = ap.parse_args()
    args.taste = args.taste or args.taste_strict
    args.a11y = args.a11y or args.a11y_strict
    return args


def load(page, args, problems):
    """Navigate and wait until the document is fully parsed; exit when the page never loads."""
    try:
        page.goto(args.url, wait_until="networkidle", timeout=args.timeout)
    except Exception as exc:
        sys.exit(f"could not load {args.url}: {exc}")

    if args.wait:
        try:
            page.wait_for_selector(args.wait, timeout=args.timeout)
        except Exception:
            problems.append(f"selector never appeared: {args.wait}")

    # The document must be fully parsed before the DOM is measured: a query that
    # runs mid-parse misses every element below the parser's current position.
    page.wait_for_load_state("load")
    page.wait_for_function("() => document.readyState === 'complete'")
    page.wait_for_timeout(100)


def measure(args):
    """Render the page once and return everything the report needs."""
    out = {"console": [], "problems": [], "taste": [], "a11y": [], "a11y_m": {}}
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        try:
            page = browser.new_page(viewport={"width": args.width, "height": args.height})
            page.on("console", lambda m: out["console"].append((m.type, m.text))
                    if m.type in ("error", "warning") else None)
            page.on("pageerror", lambda e: out["problems"].append(f"page error: {e}"))
            if args.a11y:
                page.add_init_script(f"({A11Y_PROBE.read_text(encoding='utf-8')}).hook()")

            load(page, args, out["problems"])
            out["basic"] = page.evaluate(BASIC_PROBE, args.width)
            if args.taste:
                out["taste"] = evaluate_taste(page.evaluate(f"({PROBE.read_text(encoding='utf-8')})()"))
            if args.shot:
                page.screenshot(path=args.shot, full_page=True)
            # Last: the Tab walk moves focus and scroll, which the other checks must not see.
            if args.a11y:
                out["a11y_m"] = measure_a11y(page)
                out["a11y"] = evaluate_a11y(out["a11y_m"])
        finally:
            browser.close()
    return out


def print_list(heading, lines):
    if not lines:
        return
    print(heading)
    for line in lines:
        print(f"  {line}")


def print_basic(args, m, errors, warnings):
    r = m["basic"]
    print(f"url={args.url} viewport={args.width}x{args.height} title={r['title']!r}")
    print(f"horizontal overflow: {r['overflow']}px (overflow-x: {r['overflowX']})")
    print_list("elements wider than the viewport:",
               [f"{w['tag']} width={w['width']} class={w['cls']!r}" for w in r["wide"]])
    if r["unlabelled"]:
        print(f"inputs without a label: {', '.join(r['unlabelled'])}")
    if r["noAlt"]:
        print(f"images without alt: {', '.join(r['noAlt'])}")
    print_list(f"console errors ({len(errors)}):", errors)
    print_list(f"console warnings ({len(warnings)}):", warnings)
    print_list("page errors:", m["problems"])


def collect_fails(args, m, errors):
    r = m["basic"]
    checks = [
        (r["overflow"] > 1, f"horizontal scroll of {r['overflow']}px at {args.width}px wide"),
        (errors or m["problems"], f"{len(errors) + len(m['problems'])} console/page error(s)"),
        (r["unlabelled"], f"{len(r['unlabelled'])} input(s) without a label"),
        (r["noAlt"], f"{len(r['noAlt'])} image(s) without alt text"),
    ]
    fails = [msg for hit, msg in checks if hit]
    strict = (m["taste"] if args.taste_strict else []) + (m["a11y"] if args.a11y_strict else [])
    return fails + [f"{f['id']} {f['title']}: {f['detail']}" for f in strict]


def main():
    args = parse_args()
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")

    m = measure(args)
    errors = [text for kind, text in m["console"] if kind == "error"]
    warnings = [text for kind, text in m["console"] if kind == "warning"]

    print_basic(args, m, errors, warnings)
    if args.taste:
        report("house style", m["taste"])
    if args.a11y:
        print(f"tab stops: {len(m['a11y_m']['focusStops'])} of {m['a11y_m']['focusable']} focusable")
        report("accessibility", m["a11y"])

    fails = collect_fails(args, m, errors)
    print()
    print(json.dumps({"fails": fails, "pass": not fails, "taste": m["taste"], "a11y": m["a11y"]}, indent=2))
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
