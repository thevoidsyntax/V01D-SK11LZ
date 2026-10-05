---
name: browser-use
description: |
  AI agent browser automation using browser-use library. Use when you need to:
  - Navigate websites with JavaScript rendering
  - Automate web scraping or form submission
  - Take screenshots of web pages
  - Test web applications with login sessions
  - Handle bot-protected sites (requires cloud browser)
  When simple HTTP requests (curl/fetch) suffice for public data, prefer that approach.
---

# Browser Use - AI Agent Browser Automation

Enable AI agents to control browsers for web automation tasks.

## When to Use This

**Use browser-use when:**
- JavaScript rendering required (SPA, React, Vue, Angular)
- Login/session needed for authenticated pages
- Bot protection prevents simple HTTP requests
- Screenshots of dynamic content needed
- Complex interaction flows (multi-step forms, drag-drop)

**Use simple HTTP instead when:**
- Public data that doesn't need JavaScript
- Static HTML pages
- API endpoints directly accessible

## Basic Usage

```bash
# Run browser automation via CLI
browser-use <<'PY'
print(page_info())
PY
```

## Key Workflow

### 1. First Navigation
```bash
browser-use <<'PY'
new_tab("https://example.com")
PY
```

### 2. Find Elements
Use accessibility tree (not screenshots) for element detection:
- AX tree provides semantic structure
- Stable element references
- Better than pixel-based selection

### 3. Interact
```bash
browser-use <<'PY'
# Click by accessibility node position
click_at_xy(x, y)

# Wait for navigation
wait_for_load()
```

### 4. Verify
```bash
browser-use <<'PY'
content = get_page_content()
print("Success" in content)
PY
```

## Setup Requirements

### Local Chrome
1. Enable remote debugging: `chrome://inspect/#remote-debugging`
2. Run `browser-use --doctor` for diagnostics
3. On macOS, approve Chrome debugging if prompted

### Remote/Cloud Browsers (Optional)
```bash
browser-use auth login
start_remote_daemon("my-browser")
```
Cloud browsers recommended for:
- Concurrent automation tasks
- CAPTCHA-sensitive sites
- Headless servers

## Environment Variables

```bash
# Required for cloud features
OPENAI_API_KEY=your-key

# Optional: BU2 model or cloud browser
BROWSER_USE_API_KEY=your-key
```

## Supported Models

- **BU2** (Browser Use optimized)
- **Claude** (Anthropic)
- **GPT** (OpenAI)
- **Gemini** (Google)
- **Ollama** (local models)

## Recording Sessions

```bash
# Start recording
browser-use <<'PY'
start_recording("my-task")
PY

# Your automation here...

# Stop recording
browser-use <<'PY'
stop_recording()
PY
```

## MCP Integration

For integration with other tools:
```json
{
  "mcpServers": {
    "browser-use": {
      "command": "npx",
      "args": ["@browser-use/mcp@latest"]
    }
  }
}
```

## Reference

For detailed interaction patterns (cookies, downloads, drag-drop, dropdowns, iframes, scrolling, tabs, uploads), see:
`github.com/browser-use/browser-harness/tree/main/interaction-skills/`

---

**Makes AI agents browse the web like humans do.**
