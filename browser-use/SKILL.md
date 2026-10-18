---
name: browser-use
description: "Browser automation and control via CDP (Chrome DevTools Protocol)"
when_to_use: "Use when automating a real browser via CDP (Chrome DevTools Protocol) for navigation or interaction."
version: "1.1.0"
category: [automation]
priority: medium
phase: any
auto_invoke:
  enabled: true
  conditions:
    - command: ["/browser-use", "/browser-automation"]
      reason: "Browser automation"
    - phrase: ["automate browser", "web scraping", "browser control", "CDP"]
      reason: "Browser automation context"
tech_stack:
  languages: [all]
scale: [all]
integrates_with: [dev-browser, playwright]
capabilities: [implementation]
quality:
  rules_count: 8
  examples_count: 3
  stability: stable
source:
  origin: local
author: thevoidsyntax
---

# Browser Use

Enable browser automation and control using Chrome DevTools Protocol.

## Usage

```
Use browser-use when:
- User wants to automate web interactions
- Need to capture screenshots or DOM snapshots
- Web scraping with JavaScript execution
- Form automation across pages
```

## Capabilities

- Launch and control headless browsers
- Execute JavaScript in page context
- Capture network requests/responses
- Screenshot capture
- DOM inspection and manipulation

## Requirements

- Chrome/Chromium installed
- CDP port accessible

## Integration

Works with: `playwright`, `dev-browser`
