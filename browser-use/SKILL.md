---
name: browser-use
description: Browser automation and control via CDP (Chrome DevTools Protocol)
version: "1.0.0"
category: [frontend, automation]
priority: medium
phase: any
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
