---
name: ui-ux-pro-max-design-system
description: Token architecture with three-layer system (Primitive → Semantic → Component), component specifications, and slide generation with Chart.js integration.
when_to_use: Use when creating design systems, establishing token architecture, or building consistent component libraries.
version: 2.13.0
priority: medium
phase: any
author: TheVoidSyntax
source: github.com/nextlevelbuilder/ui-ux-pro-max-skill
---

# Design System Skill

Token architecture and component specifications using a three-layer token system.

## Three-Layer Token Architecture

```
Primitive (raw values) → Semantic (purpose aliases) → Component (specific)
```

### Example: Color Tokens

```css
/* Layer 1: Primitive */
--color-blue-500: #3b82f6;
--color-blue-600: #2563eb;

/* Layer 2: Semantic */
--color-primary: var(--color-blue-600);
--color-primary-hover: var(--color-blue-500);

/* Layer 3: Component */
--button-bg: var(--color-primary);
--button-bg-hover: var(--color-primary-hover);
```

### Example: Spacing Tokens

```css
/* Primitive */
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-4: 1rem;

/* Semantic */
--space-section: var(--space-8);
--space-component: var(--space-4);

/* Component */
--card-padding: var(--space-component);
--section-gap: var(--space-section);
```

## Slide Requirements

All slides must:
1. Import `assets/design-tokens.css`
2. Use CSS variables exclusively
3. Use Chart.js for data visualization
4. Include navigation (keyboard, click, progress)
5. Center content and focus on persuasion

## Integration

- **Dependencies:** brand, ui-styling skills
- **Primary Agents:** ui-ux-designer, frontend-developer

## Features

- **Token Architecture**: Centralized design tokens
- **Component Specifications**: Atomic Design components
- **Slide System**: Brand-compliant presentations
- **Decision CSVs**: Strategy, layout, typography, color logic
- **BM25 Search**: Find relevant patterns

---

**Source:** nextlevelbuilder/ui-ux-pro-max-skill
