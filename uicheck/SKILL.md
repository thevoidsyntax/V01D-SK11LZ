---
name: uicheck
description: "Render a web UI in a real browser and report what markup review cannot: horizontal overflow at narrow widths, console errors, unlabelled inputs, images without alt. Use when a UI change must be verified in the browser, not read in the source."
when_to_use: "Use when UI work needs proof it renders: after building or changing a page, component, or layout; before handing UI to Dina; when /impeccable asks about 360px width, overflow, console errors, or form accessibility. Needs a running dev server or a static file path."
metadata:
  version: "1.0.1"
---

# UICheck — verify the render, not the source

`/impeccable` reads markup and greps for tells. It cannot tell whether a page overflows at 360 px, whether the browser console is throwing, or whether an input has a label a screen reader would find. Those are facts about the render, so get them from a browser.

The rule: a UI claim is a claim about the rendered page. Grep finds intent; a browser finds behaviour.

## 1. Requirements

- `playwright` for Python: `pip install playwright` then `python -m playwright install chromium`
- A running dev server, or a path to a static file.

Check before running anything:

```bash
python -c "from playwright.sync_api import sync_playwright; print('playwright ok')"
```

If it fails, install it, or say in the HANDOFF entry that the render was **not verified** — never claim a pass you did not measure.

## 2. Run the check

The script lives next to this file. From the repo root of the skills pack (`~/.claude/skills`) the path is `uicheck/scripts/check.py`:

```bash
python ~/.claude/skills/uicheck/scripts/check.py <url> --width 360 --shot 360.png
```

| Flag | Use |
|------|-----|
| `--width` | viewport width in px. 360 is the `/impeccable` R4 requirement; also run 768 and 1280 for a responsive change |
| `--shot` | write a full-page screenshot, then **read it with the Read tool** — the picture is the evidence |
| `--wait` | a CSS selector to wait for, when the page renders after a fetch |
| `--height` | viewport height, default 800 |

Exit code is 0 on pass, 1 on a fail. The script reports: horizontal overflow in px, the elements that are wider than the viewport, console errors and page errors, inputs with no label (a placeholder does not count), images with no `alt` attribute (`alt=""` is valid for decorative images).

The script has its own tests: `python -m unittest uicheck/scripts/test_check.py -v` from the skills pack root.

For a static file, serve it first — a `file://` URL blocks some requests:

```bash
python -m http.server 8000 --directory src
python ~/.claude/skills/uicheck/scripts/check.py http://localhost:8000/index.html --width 360
```

## 3. What each finding means

| Finding | What to do |
|---------|-----------|
| Horizontal overflow > 1px | A wide element (a table, a long unbroken string, a fixed-width block) pushes the page sideways. Find it in the `--shot` output, then fix the CSS: `min-width: 0` on a flex/grid child, `overflow-wrap: anywhere` on long text, or a real horizontal scroll container for a table. |
| Console errors | A failing request, a bad import, an undefined variable. Read the message — it names the file. |
| Input without a label | Add a `<label for=...>`, an `aria-label`, or wrap the control. Placeholder text is not a label; it disappears on focus. |
| Image without `alt` | `alt=""` for decorative images, a description for meaningful ones. |

## 4. In the HANDOFF entry

Add one line so the gate can check it:

```text
uicheck: PASS 360px, no console errors
- 360px: overflow 0px, widest element 359px
- console: 0 errors
- labels: 4/4 inputs labelled
```

A `uicheck:` line is required when the change touches UI and the project could be served. When it could not be served, write `uicheck: skipped — <reason>` and list it under `Open:`. A missing line is a blocking finding for Dina, exactly like a missing `TDD:` line.

## 5. When not to use it

- A library, CLI, or API with no rendered page. There is nothing to render.
- A design decision. That is `/impeccable` — this skill checks the build, not the taste.
- A page that needs credentials or real data you do not have. Mock it, or skip and say why.
