---
name: impeccable
description: "UI that does not look AI-generated: design decisions from the product brief, banned AI-template tells, a pass/fail checklist, and house style measured in a real browser"
when_to_use: "Use when building or changing any UI: web app, website, landing page, dashboard, or component. Hexa runs its checklist before handing off."
metadata:
  version: "2.3.0"
---

# Impeccable: UI that does not look AI-generated

Left to its defaults, a model builds the same UI every time: Inter, a purple-to-blue gradient hero, three feature cards with icons, rounded-2xl everywhere, and "Get Started". This skill replaces those defaults with decisions taken from the product itself.

## 1. Input first

- Read the **Product feel** section of `specs/PRD.md`: audience, tone, 2–3 real reference products, and what to avoid.
- If it is missing, ask for it. Do not fill the gap with defaults.
- Read the project's existing tokens, CSS, and components. Extend them; never start a second design system next to the first.

## 2. Decide before coding

Write these decisions into your `specs/HANDOFF.md` entry under `Decisions:`.

Pick the direction before the type. `impeccable/library/directions.json` holds 20 art directions and the palettes that go with them. Read it, choose one id, and write it in the decisions. The PRD wins: when it names reference products, follow those and skip the library.

| Decision | Rule |
|----------|------|
| Type | One family (or one pair) chosen for this product, with a one-line reason. A fixed scale of at most 6 sizes. |
| Color | Neutrals plus **one** accent taken from the brand or the reference products. Semantic success/warning/error colors. Text contrast meets WCAG AA. |
| Density | Matches the domain. POS, admin, and dashboards are dense: compact rows, tables, keyboard paths. Marketing pages get room. |
| Layout | Follows the real content, not a section template. Reading text is left-aligned. |
| Shape | One radius scale used on purpose. Shadows only where elevation means something (menus, dialogs). |
| Motion | Only where it explains a change. 200 ms or less, and `prefers-reduced-motion` is respected. |

Then review the plan before writing code. Ask of each decision: would a similar prompt for a different product land on the same choice? If it would, it is a default, not a decision — change it and write what changed and why under `Decisions:`. Spend the boldness in one place: one element is the memorable thing, everything around it stays quiet.

## 3. Banned AI-template tells

Each one is a checklist item. Using one is a fail unless the Product feel asks for it by name.

| # | Tell |
|---|------|
| B1 | Default font (Inter, Geist, Roboto, system-ui) picked without a stated reason |
| B2 | Purple-to-blue or rainbow gradients, gradient text in headings |
| B3 | Glassmorphism hero: `backdrop-blur` panels over a gradient blob |
| B4 | The three-feature-cards-with-icons grid, or any card grid used as a page skeleton |
| B5 | Emoji as bullets, headings, or button icons |
| B6 | The same `rounded-2xl` + `shadow-lg` on every element |
| B7 | Everything centered: hero, sections, and paragraph text |
| B8 | Generic CTAs and slogans: "Get Started", "Unlock the power of…", "Seamless", "Revolutionize" |
| B9 | Lorem ipsum, "John Doe", fake logos, invented testimonials or metrics |
| B10 | One icon set sprinkled on every heading and list item |
| B11 | Neon-on-black dark mode used as the only theme |
| B12 | Cards nested inside cards |
| B13 | Stock hero illustration or abstract 3D shapes that say nothing about the product |
| B14 | Pricing table, FAQ, or testimonial section the PRD never asked for |
| B15 | An eyebrow or kicker: a small tracked uppercase label sitting above a heading |
| B16 | A pill badge above the headline ("New", "Beta", "Introducing") |
| B17 | Yellow-cream ground with terracotta or rust — warmth worn as a costume |
| B18 | A bento grid of rounded tiles used as the feature section |
| B19 | Glass, aurora, or liquid glass offered as the shortcut to "premium" |
| B20 | One word or phrase in the headline singled out in another color, italic, or weight |
| B21 | An arrow (`→`, `->`) appended to link or button text |
| B22 | Meta strings joined with middle dots (`A · B · C`) or labels built as `WORD — fragment` |
| B23 | Tinted near-black (`#0B0B0B`, `#111`) standing in for black, or black with a single acid-green or vermilion accent |
| B24 | The default hero: a big number with a small label, supporting stats, and a gradient accent |
| B25 | Fade-and-slide-up on every section and a hover lift on every card, instead of one orchestrated moment |

### 3b. Page or app screen

A page is read and scrolled. An app screen is worked in. Same skill, different house style.

| | Page | App screen |
|---|---|---|
| Density | Room to breathe; sections 120–240px apart | Compact rows, tables, keyboard paths |
| Borders | Rare; space separates instead | Quiet borders are normal |
| Shadows | Only what truly floats | Only menus and dialogs |
| Colour | One ground, one ink, one accent | Same, but the accent marks state and action |
| Imagery | One dominant image, or none | A real interface fragment, or none |
| Numbered steps | No index numbering | No index numbering |
| Vanity numbers | None invented | None invented |

A product site that shows its app is a page; the interface fragments inside it follow the app-screen rules.

## 4. Required

| # | Requirement |
|---|-------------|
| R1 | Copy is specific to the product and follows `/anti-slop`: what it does, for whom, in plain words |
| R2 | Sample data looks like the real domain (real product names, local currency and formats) |
| R3 | Empty, loading, and error states are designed, plus long text and the zero/one/many cases |
| R4 | Works at 360 px wide with no horizontal scroll |
| R5 | Visible focus, labelled inputs, full keyboard path for the main task — measured with `/uicheck --a11y`, not claimed |
| R6 | Color and type values come from the tokens decided in section 2, not ad-hoc hex values or sizes |
| R7 | None of the accessibility patterns below appear in the code |

Grep for these before handing off. Each one breaks a WCAG 2.2 A/AA criterion or a task a keyboard or screen-reader user cannot finish:

| Pattern | Fix |
|---------|-----|
| `outline: none` / `outline-none` with no `:focus-visible` replacement | Keep the browser ring, or add a custom one that reaches 3:1 |
| `<div onClick` / `<span onClick` | `<button>`, or `<a href>` when it navigates |
| `role="button"` / `role="tab"` with no key handler | The native element, or the APG key map |
| Any positive `tabindex` | Fix the DOM order; use `0` or `-1` only |
| `disabled={!isValid}` on a submit button | Keep it enabled, validate on submit, focus the first invalid field |
| A live region mounted together with its text | Render the empty region first, then set its text |
| `aria-live="assertive"` on a success toast | `role="status"` |
| `aria-label` that omits the visible label | Start the name with the visible text |
| `aria-hidden` on an ancestor of a button, link, or input | Remove it, or make the subtree `inert` |
| `maximum-scale=1` or `user-scalable=no` in the viewport meta | Remove it |
| A drag interaction with no button or menu alternative | Add a single-pointer path to the same result |
| A tooltip on a natively `disabled` control | Text beside it, or `aria-disabled` so it stays focusable |

Building a dialog, a menu, tabs, a combobox, a form with validation, a toast, or a client-side route change: **Read `~/.claude/skills/impeccable/a11y.md` and follow it** for that pattern.

## 5. Verify the render

Markup review proves intent, not behaviour. R4, R5, and anything about the page working at a width are claims about the render, so measure them in a browser with `/uicheck`:

```bash
python ~/.claude/skills/uicheck/scripts/check.py <url> --width 360 --shot 360.png
```

Read the screenshot with the Read tool — the picture is the evidence, not the HTML source. It reports horizontal overflow, the elements causing it, console errors, inputs without a label, and images without `alt`.

Add `--taste` to the same run to measure house style: type scale, headline length, eyebrow labels, hairline rules, gradients, monospace outside code, icon-card rows, nested cards, emoji, index numbering, shadows at rest, blank stretches.

```bash
python ~/.claude/skills/uicheck/scripts/check.py <url> --width 360 --taste
```

Those findings are warnings, not a style police force. A finding the PRD asks for by name is waived, the same way a banned tell is waived. Use `--taste-strict` only when the PRD forbids every one of them.

Add `--a11y` when the page has anything to click or type into. It walks the page with Tab and reports A1 zoom locked, A2 positive tabindex, A3 click targets the keyboard cannot reach, A4 focus with no visible indicator, A5 focus hidden behind a sticky bar, A6 Tab reaching nothing. R5 passes only on an `--a11y` run with no A3–A6 finding. Run it at `--width 320` too for reflow (WCAG 1.4.10).

```bash
python ~/.claude/skills/uicheck/scripts/check.py <url> --width 360 --taste --a11y
```

When the page cannot be served (no dev server, needs credentials), say so and record it as `Open:`. Never write a pass you did not measure.

## 6. Checklist result

Run it on your own output before handing off: read the rendered markup and styles, and grep for the obvious tells (`Inter`, `from-purple`, `bg-gradient`, `backdrop-blur`, `rounded-2xl`, emoji, "Get Started"). Fix every fail, then put the result in your HANDOFF entry:

```text
impeccable: PASS 32/32
- B1 pass: IBM Plex Sans; dense numeric tables in a POS
- B4 pass: dashboard is a table plus a summary bar, no card grid
- B15 pass: no eyebrow above any heading
- R3 pass: empty/loading/error designed for product list and cart
- R5 pass: uicheck --a11y, tab stops 9 of 9, 0 A3-A6
```

Only a full pass may go to Dina. A fail you cannot fix (for example, the brand really is purple) is written as `Bn waived: <reason from the PRD>` and counted separately: `impeccable: PASS 31/32, waived B2`.

Add the render result as its own line:

```text
uicheck: PASS 360px, no console errors
- 360px: overflow 0px, widest element 359px
- console: 0 errors
- labels: 4/4 inputs labelled
```

When the run used `--taste`, add its findings as a separate line. Warnings do not block; the count is evidence:

```text
taste: 2 findings (warn)
- T3 eyebrow label: p 11px 'NEW'
- T14 gradient fill: h1
```

When the run used `--a11y`, add its result the same way:

```text
a11y: 1 finding (warn)
- A4 focus with no visible indicator: button 'Simpan'
```

B20–B25 come from Anthropic's `frontend-design` skill (Apache-2.0) and R7 with `a11y.md` from Jakub Krehel's `better-accessibility` (MIT), both rewritten for this repo.
