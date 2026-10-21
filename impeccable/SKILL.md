---
name: impeccable
version: "2.0.0"
description: "UI that does not look AI-generated: design decisions from the product brief, banned AI-template tells, and a pass/fail checklist"
when_to_use: "Use when building or changing any UI: web app, website, landing page, dashboard, or component. Hexa runs its checklist before handing off."
priority: high
phase: any
category: [design, frontend]
auto_invoke:
  enabled: true
  conditions:
    - command: ["/impeccable", "/design-review", "/ui-review"]
      reason: "UI work that must not look like an AI template"
capabilities: [design, review]
source:
  origin: rewritten
  inspired_by: "https://github.com/pbakaus/impeccable"
---

# Impeccable: UI that does not look AI-generated

Left to its defaults, a model builds the same UI every time: Inter, a purple-to-blue gradient hero, three feature cards with icons, rounded-2xl everywhere, and "Get Started". This skill replaces those defaults with decisions taken from the product itself.

## 1. Input first

- Read the **Product feel** section of `specs/PRD.md`: audience, tone, 2–3 real reference products, and what to avoid.
- If it is missing, ask for it. Do not fill the gap with defaults.
- Read the project's existing tokens, CSS, and components. Extend them; never start a second design system next to the first.

## 2. Decide before coding

Write these decisions into your `specs/HANDOFF.md` entry under `Decisions:`.

| Decision | Rule |
|----------|------|
| Type | One family (or one pair) chosen for this product, with a one-line reason. A fixed scale of at most 6 sizes. |
| Color | Neutrals plus **one** accent taken from the brand or the reference products. Semantic success/warning/error colors. Text contrast meets WCAG AA. |
| Density | Matches the domain. POS, admin, and dashboards are dense: compact rows, tables, keyboard paths. Marketing pages get room. |
| Layout | Follows the real content, not a section template. Reading text is left-aligned. |
| Shape | One radius scale used on purpose. Shadows only where elevation means something (menus, dialogs). |
| Motion | Only where it explains a change. 200 ms or less, and `prefers-reduced-motion` is respected. |

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

## 4. Required

| # | Requirement |
|---|-------------|
| R1 | Copy is specific to the product and follows `/anti-slop`: what it does, for whom, in plain words |
| R2 | Sample data looks like the real domain (real product names, local currency and formats) |
| R3 | Empty, loading, and error states are designed, plus long text and the zero/one/many cases |
| R4 | Works at 360 px wide with no horizontal scroll |
| R5 | Visible focus, labelled inputs, full keyboard path for the main task |
| R6 | Color and type values come from the tokens decided in section 2, not ad-hoc hex values or sizes |

## 5. Checklist result

Run it on your own output before handing off: read the rendered markup and styles, and grep for the obvious tells (`Inter`, `from-purple`, `bg-gradient`, `backdrop-blur`, `rounded-2xl`, emoji, "Get Started"). Fix every fail, then put the result in your HANDOFF entry:

```text
impeccable: PASS 20/20
- B1 pass: IBM Plex Sans; dense numeric tables in a POS
- B4 pass: dashboard is a table plus a summary bar, no card grid
- R3 pass: empty/loading/error designed for product list and cart
```

Only a full pass may go to Dina. A fail you cannot fix (for example, the brand really is purple) is written as `Bn waived: <reason from the PRD>` and counted separately: `impeccable: PASS 19/20, waived B2`.
