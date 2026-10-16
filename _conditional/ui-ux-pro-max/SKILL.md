---
name: ui-ux-pro-max
description: "AI-powered design intelligence with 79 UI styles, 192 color palettes, 74 font pairings, 119 UX guidelines"
version: "2.14.0"
category: [frontend]
priority: high
phase: any
auto_invoke:
  enabled: true
  conditions:
    - command: ["/ui-ux-pro-max", "/ui-ux"]
      reason: "UI/UX design assistance"
    - phrase: ["design this", "make it look", "ui design", "ux design", "accessibility"]
      reason: "UI/UX context"
tech_stack:
  languages: [all]
  frameworks: [react, vue, svelte, angular, nextjs, nuxt]
scale: [all]
integrates_with: [react-pro, vue-pro, nextjs-pro]
capabilities: [implementation, review]
quality:
  rules_count: 20
  examples_count: 10
  stability: stable
source:
  origin: github.com/nextlevelbuilder/ui-ux-pro-max-skill
author: TheVoidSyntax
---

# UI/UX Pro Max - Design Intelligence

> **Version:** 2.14.0
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

## Animation Implementation

### Easing Curves (Don't Use Linear!)

```css
/* ❌ AI-generic: linear is robotic */
transition: all 0.3s linear;

/* ✅ Intentional easing curves */
.ease-smooth { transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1); }
.ease-bounce { transition: all 400ms cubic-bezier(0.34, 1.56, 0.64, 1); }
.ease-sharp { transition: all 150ms cubic-bezier(0.4, 0, 0.6, 1); }
.ease-gentle { transition: all 500ms cubic-bezier(0.25, 0.1, 0.25, 1); }
```

### Duration Scale

| Type | Duration | Example |
|------|---------|---------|
| Micro | 50-150ms | Button hover, toggle |
| Short | 150-250ms | Modal open, dropdown |
| Medium | 250-400ms | Page transitions |
| Long | 400-700ms | Complex choreography |
| Dramatic | 700-1000ms | Hero animations |

### Spring Physics (Framer Motion / GSAP)

```javascript
// React + Framer Motion
const springConfig = {
  type: "spring",
  stiffness: 400,  // Higher = snappier
  damping: 25,      // Higher = less bounce
  mass: 1
};

// Usage
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={springConfig}
/>

// Staggered children
<motion.div
  variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
  transition={{ staggerChildren: 0.1 }}
>
```

### Motion Hierarchy

```css
/* Define motion tokens */
:root {
  /* Durations */
  --duration-micro: 100ms;
  --duration-fast: 200ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;

  /* Easings */
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## Advanced Responsive

### Container Queries (Modern)

```css
/* ❌ Media queries are viewport-based */
@media (min-width: 768px) { .card { flex-direction: row; } }

/* ✅ Container queries are element-based */
@container card (min-width: 400px) {
  .card { flex-direction: row; }
}

/* With named container */
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}
```

### Fluid Typography

```css
/* Scale from 16px (mobile) to 20px (desktop) */
.heading {
  font-size: clamp(1rem, 0.875rem + 0.625vw, 1.25rem);
  /* Formula: min + (max - min) * viewport units */
}

/* Alternative: CSS custom properties with calc */
:root {
  --fluid-min-width: 320;
  --fluid-max-width: 1200;
  --fluid-min-font: 16;
  --fluid-max-font: 20;
}
```

### Spacing Scale (Beyond 4px)

```css
:root {
  /* Linear scale (boring) */
  --space-1: 4px;
  --space-2: 8px;

  /* Geometric scale (more natural) */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --space-4xl: 96px;
}
```

### Modern Grid

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: var(--space-lg);
}
```

---

## Typography Implementation

### Variable Fonts (Modern Typography)

```css
/* Google Fonts Variable Font */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Variable.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}

.text-heading {
  font-family: 'Inter', system-ui, sans-serif;
  font-variation-settings: 'opsz' 32, 'wght' 700;
  letter-spacing: -0.02em;
}

.text-body {
  font-variation-settings: 'opsz' 14, 'wght' 400;
  line-height: 1.6;
}
```

### Font Pairing System

```css
:root {
  /* Heading: Display/Serif */
  --font-display: 'Playfair Display', Georgia, serif;

  /* Body: Sans-serif */
  --font-body: 'DM Sans', system-ui, sans-serif;

  /* Mono: Code */
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}

h1, h2, h3 { font-family: var(--font-display); }
body { font-family: var(--font-body); }
code { font-family: var(--font-mono); }
```

### Type Scale

```css
:root {
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.8rem);
  --text-sm: clamp(0.875rem, 0.8rem + 0.35vw, 0.9rem);
  --text-base: clamp(1rem, 0.9rem + 0.5vw, 1rem);
  --text-lg: clamp(1.125rem, 1rem + 0.6vw, 1.25rem);
  --text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 1.25rem + 1.25vw, 2rem);
  --text-3xl: clamp(1.875rem, 1.5rem + 1.875vw, 3rem);
  --text-4xl: clamp(2.25rem, 1.75rem + 2.5vw, 4rem);
}
```

---

## Micro-interactions

### Button Interactions

```css
/* Scale on hover */
.btn {
  transition: transform 100ms ease-out, box-shadow 200ms ease-out;
}

.btn:hover {
  transform: scale(1.02);
}

.btn:active {
  transform: scale(0.98);
}

/* With shadow lift */
.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Ripple effect */
.btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
  transform: scale(0);
  opacity: 0;
  transition: transform 0.5s, opacity 0.3s;
}

.btn:active::after {
  transform: scale(2);
  opacity: 1;
}
```

### Input Focus States

```css
.input {
  border: 2px solid var(--color-border);
  transition: border-color 200ms, box-shadow 200ms;
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-alpha);
}

/* With floating label */
.input-group {
  position: relative;
}

.input-label {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  transition: all 150ms ease-out;
  pointer-events: none;
}

.input:focus + .input-label,
.input:not(:placeholder-shown) + .input-label {
  top: 0;
  transform: translateY(-50%) scale(0.85);
  background: white;
  padding: 0 4px;
}
```

### Skeleton Loading

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-surface) 25%,
    var(--color-surface-hover) 50%,
    var(--color-surface) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
}

@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Card Hover Effects

```css
.card {
  transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.08),
    0 8px 24px rgba(0, 0, 0, 0.12),
    0 24px 48px rgba(0, 0, 0, 0.08);
}

/* Subtle image zoom inside card */
.card-image {
  transition: transform 400ms cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover .card-image {
  transform: scale(1.05);
}
```

---

## Unique Brand Patterns (Beyond Template Look)

### Break the Grid Intentionally

```css
.hero {
  /* Off-center for visual interest */
  padding-left: max(24px, calc((100vw - 1200px) / 2 + 24px));
}

/* Asymmetric sections */
.section:nth-child(even) {
  background: var(--color-accent);
  margin-left: -10%;
  padding-left: 10%;
}
```

### Custom Cursor States

```css
/* On interactive elements */
a, button, [role="button"] {
  cursor: pointer;
}

/* Custom cursor for specific elements */
.movable { cursor: grab; }
.movable:active { cursor: grabbing; }

.zoomable { cursor: zoom-in; }

/* Hide default cursor for custom cursors */
.canvas-container {
  cursor: crosshair;
}
```

### Typography as Design Element

```css
/* Oversized numbers */
.stat-number {
  font-size: clamp(4rem, 10vw, 8rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--color-primary);
}

/* Gradient text */
.gradient-text {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Shadow/Lighting Depth

```css
/* ❌ AI-generic: flat shadow */
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

/* ✅ Dimensional: multiple shadow layers */
.card {
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.04),    /* Very subtle top */
    0 2px 4px rgba(0, 0, 0, 0.06),     /* Subtle */
    0 8px 16px rgba(0, 0, 0, 0.08),    /* Medium */
    0 16px 32px rgba(0, 0, 0, 0.1);    /* Large/deep */
}

/* Colored shadows for brand */
.brand-shadow {
  box-shadow: 8px 8px 0px var(--color-brand);
}

/* Inner shadow for inset */
.inset-surface {
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
}
```

### Border Radius Personality

```css
:root {
  /* ❌ AI-generic: all same radius */
  --radius: 8px;

  /* ✅ Intentional radius scale */
  --radius-none: 0;
  --radius-sm: 4px;      /* Tags, chips */
  --radius-md: 8px;      /* Buttons, inputs */
  --radius-lg: 12px;     /* Cards */
  --radius-xl: 16px;     /* Modals */
  --radius-2xl: 24px;   /* Large containers */
  --radius-full: 9999px; /* Pills, avatars */
}

/* Asymmetric for uniqueness */
.organic-shape {
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  /* Or use SVG clip-path for more control */
}
```

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
