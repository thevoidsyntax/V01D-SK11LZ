---
name: uicheck
description: "Render a web UI in a real browser and report what markup review cannot: horizontal overflow at narrow widths, console errors, unlabelled inputs, images without alt. Use when a UI change must be verified in the browser, not read in the source."
when_to_use: "Use when UI work needs proof it renders: after building or changing a page, component, or layout; before handing UI to Dina; when /impeccable asks about 360px width, overflow, console errors, or form accessibility. Needs a running dev server or a static file path."
metadata:
  version: "1.1.0"
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
| `--taste` | also measure house style and report the findings as warnings |
| `--taste-strict` | make house-style findings fail the run |

Exit code is 0 on pass, 1 on a fail. The script reports: horizontal overflow in px, the elements that are wider than the viewport, console errors and page errors, inputs with no label (a placeholder does not count; `hidden`, `submit`, `button` and `reset` inputs are skipped), images with no `alt` attribute (`alt=""` is valid for decorative images).

The script has its own tests: `python -m unittest uicheck/scripts/test_check.py -v` from the skills pack root.

## 3. House style (`--taste`)

Markup review cannot tell whether a page looks designed. These rules measure the render, so a claim about house style is a fact like any other.

```bash
python ~/.claude/skills/uicheck/scripts/check.py <url> --width 360 --taste
```

| Rule | What it measures |
|------|------------------|
| T1 | More than five type sizes on the page |
| T2 | A headline longer than two lines |
| T3 | An eyebrow label above a heading |
| T4 | A floating pill bar (blurred, or a nav with a full radius) |
| T5 | A hairline rule or 1px box, outside tables, form fields and real code |
| T6 | Monospace outside real code |
| T7 | A tiny uppercase label (11px or smaller) |
| T8 | Three or more identical icon cards in one row |
| T9 | A card inside a card |
| T10 | Emoji used as content |
| T11 | Index numbering (`01`, `1.`, `Step 2`) |
| T12 | More than six elements carrying a box-shadow |
| T13 | A blank stretch taller than half the screen |
| T14 | A gradient fill or gradient text |

The findings are warnings. A page that uses one on purpose — because the PRD asks for it by name — is not a failure, and `--taste-strict` stays off unless the PRD forbids all of them.

The rules live in `scripts/taste_rules.py` and decide from a measurement dict, so they can be tested without a browser. The browser part is `scripts/taste_probe.js`, which only measures. Tests: `python -m unittest uicheck/scripts/test_taste_rules.py -v`, with pages in `fixtures/`.

The rule set and the direction library follow taste-skill by Leonxlnx (MIT, github.com/leonxlnx/taste-skill); the measurements and the decisions here are this repo's own.

## 4. What each finding means

For a static file, serve it first — a `file://` URL blocks some requests:

```bash
python -m http.server 8000 --directory src
python ~/.claude/skills/uicheck/scripts/check.py http://localhost:8000/index.html --width 360
```

## 5. What each finding means

| Finding | What to do |
|---------|-----------|
| Horizontal overflow > 1px | A wide element (a table, a long unbroken string, a fixed-width block) pushes the page sideways. Find it in the `--shot` output, then fix the CSS: `min-width: 0` on a flex/grid child, `overflow-wrap: anywhere` on long text, or a real horizontal scroll container for a table. |
| Console errors | A failing request, a bad import, an undefined variable. Read the message — it names the file. |
| Input without a label | Add a `<label for=...>`, an `aria-label`, or wrap the control. Placeholder text is not a label; it disappears on focus. |
| Image without `alt` | `alt=""` for decorative images, a description for meaningful ones. |

## 6. In the HANDOFF entry

Add one line so the gate can check it:

```text
uicheck: PASS 360px, no console errors
- 360px: overflow 0px, widest element 359px
- console: 0 errors
- labels: 4/4 inputs labelled
```

When the run used `--taste`, add its findings on their own line. They are warnings, so they do not block, but the count is evidence:

```text
taste: 2 findings (warn)
- T3 eyebrow label: p 11px 'NEW'
- T14 gradient fill: h1
```

A `uicheck:` line is required when the change touches UI and the project could be served. When it could not be served, write `uicheck: skipped — <reason>` and list it under `Open:`. A missing line is a blocking finding for Dina, exactly like a missing `TDD:` line.

## 7. When not to use it

- A library, CLI, or API with no rendered page. There is nothing to render.
- A design decision. That is `/impeccable` — this skill checks the build, not the taste.
- A page that needs credentials or real data you do not have. Mock it, or skip and say why.
