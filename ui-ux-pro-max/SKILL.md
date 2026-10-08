---
name: ui-ux-pro-max
description: AI-powered design intelligence with 79 UI styles, 192 color palettes, 74 font pairings, 119 UX guidelines, 25 chart types across 22 tech stacks. Industry-specific reasoning rules for Tech/SaaS, Finance, Healthcare, E-commerce, and more.
when_to_use: Use when building UI - new pages, components, design systems, color/typography decisions, UX reviews, accessibility checks, or visual quality control.
version: 2.13.0
priority: high
phase: any
platforms: claude, cursor, windsurf, copilot, kiro, roocode, codex, opencode, continue
author: TheVoidSyntax
source: github.com/nextlevelbuilder/ui-ux-pro-max-skill
---

# UI/UX Pro Max - Design Intelligence

> **Version:** 2.13.0
> **Repository:** [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
> **Website:** [uupm.cc](https://uupm.cc)

AI skill providing design intelligence for building professional UI/UX across multiple platforms and frameworks.

---

## Key Numbers

| Category | Count |
|----------|-------|
| **UI Styles** | 79 (50 active) |
| **Color Palettes** | 192 |
| **Font Pairings** | 74 |
| **UX Guidelines** | 119 |
| **Industry Rules** | 192 |
| **Chart Types** | 25 |
| **Tech Stacks** | 22 |

---

## When to Apply

**USE for:**
- Designing new pages or features
- Creating/refactoring UI components
- Choosing color/typography/spacing/layout
- UI/UX accessibility reviews
- Navigation/animation/responsive behavior
- Improving perceived quality

**SKIP for:**
- Pure backend logic
- API/database design
- Non-visual performance
- Infrastructure/DevOps

---

## Rule Categories by Priority

| Priority | Category | Impact | Key Checks | Anti-Patterns |
|----------|----------|--------|------------|---------------|
| 1 | Accessibility | CRITICAL | Contrast 4.5:1, Alt text, Keyboard nav, ARIA | Removing focus rings |
| 2 | Touch & Interaction | CRITICAL | Min 44×44px, 8px+ spacing | Hover-only reliance |
| 3 | Performance | HIGH | WebP/AVIF, Lazy loading, CLS < 0.1 | Layout thrashing |
| 4 | Style Selection | HIGH | Match product type, SVG icons | Mixed skeuomorphic |
| 5 | Layout & Responsive | HIGH | Mobile-first, No horizontal scroll | Fixed px widths |
| 6 | Typography & Color | MEDIUM | Base 16px, Semantic tokens | Raw hex in code |
| 7 | Animation | MEDIUM | Context-aware timing, Motion conveys meaning | One duration all |
| 8 | Forms & Feedback | MEDIUM | Visible labels, Error near field | Placeholder-only |
| 9 | Navigation | HIGH | Predictable back, Bottom nav ≤5 | Overloaded nav |
| 10 | Charts & Data | LOW | Legends, Tooltips | Color-only meaning |

---

## Supported Tech Stacks

| Category | Stacks |
|----------|--------|
| **JavaScript/React** | React, Next.js, Vue, Nuxt.js, Svelte, Astro |
| **Mobile** | SwiftUI, React Native, Flutter, Jetpack Compose |
| **Backend** | Laravel, Angular |
| **Special** | shadcn/ui, Tailwind, Three.js |
| **Desktop** | SwiftUI, JavaFX, WPF, WinUI, Avalonia, Uno |

---

## Usage Workflow

### 1. Generate Design System (NEW PROJECT)

```bash
python "${CLAUDE_PLUGIN_ROOT}/.claude/skills/ui-ux-pro-max/scripts/search.py" \
  "<product_type> <industry> <keywords>" \
  --design-system \
  [-p "Project Name"]
```

Example:
```bash
python "${CLAUDE_PLUGIN_ROOT}/.claude/skills/ui-ux-pro-max/scripts/search.py" \
  "SaaS dashboard analytics" \
  --design-system \
  -p "MyApp"
```

### 2. Persist Design System (CROSS-SESSION)

```bash
python "${CLAUDE_PLUGIN_ROOT}/.claude/skills/ui-ux-pro-max/scripts/search.py" \
  "<query>" \
  --design-system \
  --persist \
  -p "Project Name" \
  --output-dir "<project-root>"
```

This creates:
```
design-system/<project>/MASTER.md    ← Global Source of Truth
design-system/<project>/pages/*.md    ← Page-specific overrides
```

### 3. Design Dials (OPTIONAL)

| Dial | Low (1-3) | Mid (4-7) | High (8-10) |
|------|-----------|-----------|-------------|
| `--variance` | Centered/minimal | Balanced/modern | Bold/asymmetric |
| `--motion` | Subtle micro | Standard scroll | Complex choreography |
| `--density` | Spacious (24-96px) | Standard (16-64px) | Dense (8-32px) |

Example:
```bash
python "${CLAUDE_PLUGIN_ROOT}/.claude/skills/ui-ux-pro-max/scripts/search.py" \
  "internal analytics dashboard" \
  --design-system \
  --variance 8 --motion 7 --density 8 \
  -p "Ops Console"
```

### 4. Domain-Specific Search

```bash
# Style options
python search.py "<keyword>" --domain style

# Color palettes
python search.py "<keyword>" --domain color

# Typography
python search.py "<keyword>" --domain typography

# UX guidelines
python search.py "<keyword>" --domain ux

# Charts
python search.py "<keyword>" --domain chart

# Stack guidelines
python search.py "<keyword>" --stack <stack>
```

---

## Available Search Domains

| Domain | Purpose | Example |
|--------|---------|---------|
| `product` | Product type patterns | `"entertainment social"` |
| `style` | UI style options | `"glassmorphism dark"` |
| `color` | Color palettes | `"entertainment vibrant"` |
| `typography` | Font pairings | `"playful modern"` |
| `google-fonts` | Google Fonts | `"sans serif popular"` |
| `chart` | Chart types | `"real-time dashboard"` |
| `ux` | UX best practices | `"error summary validation"` |
| `landing` | Landing page structure | `"hero social-proof"` |
| `icons` | Icon recommendations | `"decorative aria-hidden"` |
| `gsap` | Animation presets | `"scroll reveal stagger"` |
| `react` | React performance | `"rerender memo list"` |
| `web` | App/native guidelines | `"accessibilityLabel safe-area"` |

---

## Installation

```bash
# Install CLI globally
npm install -g ui-ux-pro-max-cli

# Initialize for Claude Code
uipro init --ai claude
```

---

## Sub-Skills

This skill bundle includes:

| Skill | Purpose |
|--------|---------|
| `ui-ux-pro-max` | Main design intelligence |
| `design-system` | Token architecture & slides |
| `ui-styling` | Tailwind, shadcn/ui, Canvas |
| `design` | Core design patterns |
| `brand` | Brand identity |
| `slides` | Presentation generation |
| `banner-design` | Banner creation |

---

## Quick Examples

**Build a landing page:**
```
Build a landing page for my SaaS product
```

**Create a dashboard:**
```
Create a dashboard for healthcare analytics
```

**Design system for project:**
```
Generate design system for fintech app
```

**Style search:**
```
Search style for minimalist portfolio
```

---

## Tips

| Problem | Solution |
|---------|----------|
| Can't decide on style | Re-run with different keywords |
| Dark mode contrast | Check color-dark-mode rules |
| Animations feel wrong | Check spring-physics, easing |
| Form UX poor | Check inline-validation, error-clarity |
| Navigation confusing | Check nav-hierarchy, bottom-nav-limit |
| Layout breaks mobile | Check mobile-first, breakpoint-consistency |
| Performance jank | Check virtualize-lists, main-thread-budget |

---

## Pre-Delivery Checklist

Before delivering any UI:
1. Run accessibility checks (contrast, ARIA, keyboard)
2. Test touch targets (44×44px minimum)
3. Verify responsive breakpoints
4. Check animation motion preferences
5. Validate form error placement
6. Test dark mode contrast

---

**License:** MIT
**Author:** NextLevelBuilder
