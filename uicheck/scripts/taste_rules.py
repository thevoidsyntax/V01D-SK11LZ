"""House-style rules for a rendered page.

Pure: the browser measures, this module decides. So the rules can be tested
without a browser, and a rule can be tuned without touching the page.
"""

TYPE_SIZE_CEILING = 5
HEADLINE_LINE_CEILING = 2
EYEBROW_MAX_PX = 13
TINY_CAP_MAX_PX = 11
HAIRLINE_PX = 1
PILL_RADIUS_PX = 999
ICON_CARD_MIN = 3
SHADOW_CEILING = 6
BLANK_FRACTION = 0.5


def _f(out, rid, title, detail):
    out.append({"id": rid, "title": title, "detail": detail})


def evaluate(m):
    """Return one finding per issue found in the measurement dict."""
    out = []

    sizes = m.get("typeSizes") or []
    if len(sizes) > TYPE_SIZE_CEILING:
        _f(out, "T1", "more type sizes than the page allows",
           f"{len(sizes)} sizes: {', '.join(str(s) for s in sizes[:8])}px")

    for h in m.get("headings") or []:
        if h.get("lines", 0) > HEADLINE_LINE_CEILING:
            _f(out, "T2", "headline longer than two lines",
               f"{h.get('tag', 'h1')} {h.get('lines')} lines: {str(h.get('text', ''))[:60]!r}")

    for e in m.get("eyebrows") or []:
        _f(out, "T3", "eyebrow label above a heading",
           f"{e.get('tag', 'span')} {e.get('fontSize')}px: {str(e.get('text', ''))[:40]!r}")

    for p in m.get("pillBars") or []:
        _f(out, "T4", "floating pill bar",
           f"{p.get('tag', 'div')} class={p.get('cls', '')!r}")

    for h in m.get("hairlines") or []:
        _f(out, "T5", "hairline rule or 1px box",
           f"{h.get('tag', 'div')} class={h.get('cls', '')!r}")

    for mono in m.get("monospace") or []:
        _f(out, "T6", "monospace outside real code",
           f"{mono.get('tag', 'span')} class={mono.get('cls', '')!r}")

    for t in m.get("tinyCaps") or []:
        _f(out, "T7", "tiny uppercase label",
           f"{t.get('fontSize')}px: {str(t.get('text', ''))[:40]!r}")

    for c in m.get("iconCards") or []:
        if c.get("count", 0) >= ICON_CARD_MIN:
            _f(out, "T8", "row of identical icon cards",
               f"{c.get('count')} cards, class={c.get('cls', '')!r}")

    for n in m.get("nestedCards") or []:
        _f(out, "T9", "card inside a card",
           f"{n.get('tag', 'div')} class={n.get('cls', '')!r}")

    for e in m.get("emoji") or []:
        _f(out, "T10", "emoji used as content",
           f"{e.get('tag', 'span')}: {str(e.get('text', ''))[:20]!r}")

    for n in m.get("indexNumbers") or []:
        _f(out, "T11", "index numbering",
           f"{n.get('tag', 'span')}: {str(n.get('text', ''))[:40]!r}")

    shadows = m.get("shadows") or []
    if len(shadows) > SHADOW_CEILING:
        _f(out, "T12", "shadow on elements at rest",
           f"{len(shadows)} elements carry a box-shadow")

    vh = m.get("viewportHeight") or 0
    for g in m.get("sectionGaps") or []:
        if vh and g.get("px", 0) > vh * BLANK_FRACTION:
            _f(out, "T13", "blank stretch taller than half a screen",
               f"{g.get('px')}px gap before {g.get('tag', 'section')}")

    for g in m.get("gradients") or []:
        _f(out, "T14", "gradient fill or gradient text",
           f"{g.get('tag', 'div')} class={g.get('cls', '')!r}")

    return out


def summarize(findings):
    """Counts per rule id, ordered by id."""
    counts = {}
    for f in findings:
        counts[f["id"]] = counts.get(f["id"], 0) + 1
    return counts
