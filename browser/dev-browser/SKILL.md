---
name: dev-browser
description: |
  Browser automation for coding agents using dev-browser (JS/Bun + Puppeteer).
  Use for fast E2E testing, web scraping, and UI automation with persistent browser state.
  Perfect for Claude Code - lightweight (~13ms overhead), JS-native, persistent tabs.
---

# Dev-Browser - Fast Browser Automation for Coding Agents

Browser control via JavaScript with persistent state between calls.

## When to Use

**Use dev-browser when:**
- Fast E2E testing (~13ms overhead)
- Local development and debugging
- Simple automation scripts
- Node.js/JS ecosystem
- Persistent browser state needed

**Use browser-use instead when:**
- Multi-LLM support needed
- Cloud/stealth browsing required
- Complex AI agent workflows
- Python-first environment

## Installation

```bash
npm install -g dev-browser
dev-browser install  # only if can't find Chrome
```

## Basic Usage

### Quick Test
```bash
dev-browser --headless <<'EOF'
const page = await browser.getPage("main");
await page.goto("https://example.com");
logger.info('Page title:', await page.title());
EOF
```

### Attach to Running Chrome
```bash
# Start managed Chrome
dev-browser chrome

# In another terminal, attach
dev-browser --connect <<'EOF'
logger.info('Active pages:', await browser.listPages());
EOF
```

## Script API

### Browser Control
```javascript
browser.getPage(nameOrId)  // Get/create named page
browser.newPage()          // Create anonymous page
browser.listPages()        // List all pages [{ id, url, title, name }]
browser.closePage(name)    // Close named page
```

### Page Interaction
```javascript
// Get accessibility tree
await page.snapshot({ interactive: true })
// Returns: [{ref: "e12", role: "button", name: "Submit"}]

// Click element by ref
await page.click("ref/e12")

// Get ElementHandle
await page.ref("e12")

// Screenshot
await page.shot()

// Wait for load
await page.waitForLoad()

// Fill form
await page.fill("#email", "me@example.com")
```

### File I/O
```javascript
saveFile(name, data)  // Save to ~/.dev-browser/v1/tmp
readFile(name)        // Read from tmp folder
```

### Output
```javascript
// dev-browser page output methods (not console.log in code)
logger.info()  // Use structured logging instead of console.log
logger.warn()
logger.error()
```

## Recommended Workflow

```
Look → Act → Verify
```

1. **Look**: Get page state via `snapshot()`
2. **Act**: Click, fill, navigate
3. **Verify**: Check results

## Idle Cleanup

Browsers auto-close after 30 min idle:
```bash
dev-browser --idle-timeout 5m < script.js
DEV_BROWSER_IDLE_TIMEOUT=1h dev-browser -e 'await browser.listPages()'
```

## Performance

| Scenario | Time |
|----------|------|
| Empty script | ~13ms |
| getPage + title | ~14ms |
| Snapshot on SERP | ~18ms |
| Screenshot | ~36ms |
| Cold daemon + Chrome | ~280ms |

## MCP Server

Tools exposed via daemon:
- `dev_browser_run`
- `dev_browser_pages`
- `dev_browser_browsers`
- `dev_browser_stop`
- `dev_browser_help`

---

**Fast, lightweight browser automation for coding agents.**
