---
name: impeccable
version: "1.0.0"
description: "Design language for AI frontend - Design guidance, anti-pattern detection, and live browser iteration for AI-generated UI"
when_to_use: "Use when reviewing or creating frontend designs, UI components, or user interfaces. Provides design quality checks and anti-pattern detection."
priority: medium
phase: any
category: [design, review, frontend]
tech_stack:
  languages: [all]
  frameworks: [react, vue, svelte, nextjs, nuxt]
auto_invoke:
  enabled: true
  conditions:
    - command: ["/impeccable", "/design-review", "/ui-review"]
      reason: "Design review and frontend quality tasks"
    - phrase: ["design review", "UI quality", "frontend design", "impeccable"]
      reason: "Design quality and anti-pattern detection"
capabilities: [review, implementation]
source:
  origin: external
  repo: "https://github.com/pbakaus/impeccable"
author: pbakaus (via GitHub)
---

# IMPECCABLE v1.0

**Design Language for AI Frontend**

> Design guidance, anti-pattern detection, and live browser iteration for AI-generated UI.

---

## Overview

Impeccable provides design guidance and quality checks for AI-generated frontend code. It helps coding agents produce better-designed interfaces through automated detection and suggestions.

### Key Features

| Feature | Description |
|---------|-------------|
| Design Guidance | Standards for typography, spacing, color, layout |
| Anti-Pattern Detection | 59 deterministic rules for common design mistakes |
| Live Browser Mode | Visual iteration in the browser |
| Design Critique | UX review for hierarchy, clarity, emotional resonance |

---

## Commands

| Command | Purpose |
|---------|---------|
| `/impeccable init` | Setup: inspect project, create PRODUCT.md |
| `/impeccable audit` | Technical quality checks (a11y, performance, responsive) |
| `/impeccable critique` | UX design review |
| `/impeccable polish` | Final pass, design system alignment |
| `/impeccable live` | Visual variant mode: iterate in browser |
| `/impeccable distill` | Strip to essence |

---

## Design Anti-Patterns

### Common Mistakes to Avoid

```
❌ OVERUSED FONTS
   Inter (too common)
   Roboto
   Arial

❌ BAD COLOR GRADIENTS
   Purple to blue gradients
   Rainbow effects

❌ NESTED CARDS
   Card inside card inside card

❌ POOR TYPOGRAPHY
   Too many font sizes
   Inconsistent hierarchy

❌ VISUAL NOISE
   Too many colors
   Cluttered layouts
```

---

## Design Checklist

### Hierarchy
- [ ] Clear visual hierarchy (heading levels)
- [ ] Consistent font sizing scale
- [ ] Proper spacing rhythm

### Clarity
- [ ] Readable contrast ratios
- [ ] Clear CTAs (call-to-action)
- [ ] Obvious navigation

### Emotional Resonance
- [ ] Appropriate tone for audience
- [ ] Consistent design language
- [ ] Professional polish

---

## Integration

Works with:
- Claude Code
- Cursor
- GitHub Copilot
- Codex CLI
- DeepSeek

---

**Invoke:** `/impeccable` | **Version:** 1.0.0

---

*Based on: https://github.com/pbakaus/impeccable*
