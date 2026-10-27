#!/usr/bin/env python3
"""Render a page and report the facts /impeccable asks for but cannot be read from markup.

Checks, in order of how often they actually fail:
  1. horizontal overflow at a given width (the R4 requirement)
  2. console errors and page errors
  3. unlabelled form inputs and images without alt text
  4. elements wider than the viewport (names the culprits, not just the count)

Usage:
    python scripts/check.py <url> [--width 360] [--height 800] [--shot out.png] [--wait selector]

Example:
    python scripts/check.py http://localhost:5173 --width 360 --shot 360.png
"""

import argparse
import json
import sys

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    sys.exit("playwright is not installed: pip install playwright && python -m playwright install chromium")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("url")
    ap.add_argument("--width", type=int, default=360)
    ap.add_argument("--height", type=int, default=800)
    ap.add_argument("--shot", help="write a screenshot to this path")
    ap.add_argument("--wait", help="CSS selector to wait for before measuring")
    ap.add_argument("--timeout", type=int, default=30000)
    args = ap.parse_args()

    console = []
    problems = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": args.width, "height": args.height})
        page.on("console", lambda m: console.append((m.type, m.text)) if m.type in ("error", "warning") else None)
        page.on("pageerror", lambda e: problems.append(f"page error: {e}"))

        try:
            page.goto(args.url, wait_until="networkidle", timeout=args.timeout)
        except Exception as exc:
            browser.close()
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

        result = page.evaluate(
            """(vw) => {
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
            }""",
            args.width,
        )

        if args.shot:
            page.screenshot(path=args.shot, full_page=True)

        browser.close()

    errors = [t for t in console if t[0] == "error"]
    warnings = [t for t in console if t[0] == "warning"]

    print(f"url={args.url} viewport={args.width}x{args.height} title={result['title']!r}")
    print(f"horizontal overflow: {result['overflow']}px (overflow-x: {result['overflowX']})")
    if result["wide"]:
        print("elements wider than the viewport:")
        for w in result["wide"]:
            print(f"  {w['tag']} width={w['width']} class={w['cls']!r}")
    if result["unlabelled"]:
        print(f"inputs without a label: {', '.join(result['unlabelled'])}")
    if result["noAlt"]:
        print(f"images without alt: {', '.join(result['noAlt'])}")
    if errors:
        print(f"console errors ({len(errors)}):")
        for _, text in errors:
            print(f"  {text}")
    if warnings:
        print(f"console warnings ({len(warnings)}):")
        for _, text in warnings:
            print(f"  {text}")
    if problems:
        print("page errors:")
        for text in problems:
            print(f"  {text}")

    fails = []
    if result["overflow"] > 1:
        fails.append(f"horizontal scroll of {result['overflow']}px at {args.width}px wide")
    if errors or problems:
        fails.append(f"{len(errors) + len(problems)} console/page error(s)")
    if result["unlabelled"]:
        fails.append(f"{len(result['unlabelled'])} input(s) without a label")
    if result["noAlt"]:
        fails.append(f"{len(result['noAlt'])} image(s) without alt text")

    print()
    print(json.dumps({"fails": fails, "pass": not fails}, indent=2))
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
