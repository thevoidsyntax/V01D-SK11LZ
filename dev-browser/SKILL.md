---
name: dev-browser
description: "Development-focused browser with debugging and inspection tools"
version: "1.1.0"
category: [frontend]
priority: medium
phase: any
auto_invoke:
  enabled: true
  conditions:
    - command: ["/dev-browser", "/browser-dev"]
      reason: "Browser development"
    - phrase: ["open in browser", "inspect element", "debug browser"]
      reason: "Browser debugging context"
tech_stack:
  languages: [all]
scale: [all]
integrates_with: [ui-ux-pro-max, browser-use]
capabilities: [implementation]
quality:
  rules_count: 8
  examples_count: 3
  stability: stable
source:
  origin: local
author: thevoidsyntax
---

# Dev Browser

Browser-based development tools for debugging and inspection.

## Usage

```
Use dev-browser when:
- Debugging frontend issues
- Inspecting network traffic
- Analyzing performance bottlenecks
- Testing responsive designs
```

## Tools

- Element inspector
- Network monitor
- Console access
- Performance profiler
- Application tab (storage, service workers)
- Security panel

## Automation

Can be controlled via Puppeteer or Playwright for automated testing.
