---
name: scrapling
version: "1.0.0"
description: "Python web scraping framework - Fast HTTP requests, stealth browsers, Cloudflare bypass, and MCP server for AI agents"
when_to_use: "Use when you need to scrape web data, bypass protection, or extract information from websites for testing or data collection."
priority: medium
phase: any
category: [scraping, testing, data-collection]
tech_stack:
  languages: [python]
  frameworks: [playwright]
auto_invoke:
  enabled: true
  conditions:
    - command: ["/scrapling", "/scrape", "/web-scraping"]
      reason: "Web scraping and data extraction"
    - phrase: ["scrape", "web scraping", "extract data", "crawl"]
      reason: "Web data collection tasks"
capabilities: [implementation, testing]
source:
  origin: external
  repo: "https://github.com/D4Vinci/Scrapling"
author: D4Vinci (via GitHub)
---

# SCRAPLING v1.0

**Web Scraping Framework for AI Agents**

> Fast HTTP requests, stealth browsers, Cloudflare bypass, and MCP server for AI agents.

---

## Overview

Scrapling is a Python web scraping framework that handles everything from a single request to a full-scale crawl. It's designed specifically for AI agents.

### Key Features

| Feature | Description |
|---------|-------------|
| Multiple Fetching | HTTP, stealth browsers, JavaScript rendering |
| Stealth | Cloudflare bypass, CAPTCHA handling |
| Fast | ~1700x faster than BeautifulSoup |
| AI Integration | MCP server for Claude, Cursor, etc. |

---

## Fetching Methods

```
┌─────────────────────────────────────────────────────────────┐
│  FETCHING OPTIONS                                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. HTTP Requests                                         │
│     Fast TLS fingerprinting                                │
│     • scrapling.get(url)                                  │
│                                                              │
│  2. Stealth Browser (Playwright)                          │
│     Headless browser automation                           │
│     • scrapling.get(url, browser=True)                  │
│                                                              │
│  3. JavaScript Rendering                                  │
│     Wait for dynamic content                              │
│     • scrapling.get(url, render_js=True)                │
│                                                              │
│  4. Cloudflare Bypass                                    │
│     Automatic bypass                                        │
│     • scrapling.get(url, stealth=True)                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Parsing Methods

### CSS Selectors
```python
# Extract elements
elements = scraper.css('div.product > .price')

# Extract text
price = scraper.css_first('span.price').text

# Extract attributes
link = scraper.css_first('a.product').attr('href')
```

### XPath
```python
# XPath queries
elements = scraper.xpath('//div[@class="product"]//span[@class="price"]')
```

### Adaptive Tracking
```python
# Find similar elements
similar = scraper.find_similar('div.product')
```

---

## Crawling Framework

### Spider API
```python
from scrapling import Spider

class MySpider(Spider):
    start_urls = ['https://example.com']

    def parse(self, response):
        # Extract data
        products = response.css('div.product')

        # Follow links
        yield from response.follow_all(links, self.parse)

        # Export
        yield {'products': products}
```

### Features
```
• Concurrent crawling
• Proxy rotation
• Auto-throttling
• Pause/resume
• Built-in exporters (JSON/CSV/XML)
```

---

## AI Integration

### MCP Server

Scrapling provides an MCP server for AI agents:

```python
# Start MCP server
scrapling mcp-server
```

Claude Code can then use Scrapling through the MCP protocol.

### Agent Skill

```python
# Use in agent
from scrapling import scraper

def scrape_product(url: str) -> dict:
    response = scraper.get(url, browser=True)
    return {
        'title': response.css_first('h1').text,
        'price': response.css_first('.price').text,
        'image': response.css_first('img.product').attr('src')
    }
```

---

## CLI

```bash
# Install
pip install scrapling
pip install "scrapling[fetchers]"  # With browsers
pip install "scrapling[all]"         # Everything

# Interactive shell
scrapling shell

# Extract to markdown
scrapling extract get https://example.com output.md
```

---

## Use Cases

### For Dina (QA)

```
• Extract test data from websites
• Scrape product information for testing
• Bypass login for test accounts
• Collect pricing data for comparisons
```

### For Athena (SE)

```
• Build data pipelines
• Extract web APIs
• Fetch external data for apps
• Parse documentation
```

### For Frans (DevOps)

```
• Monitor website uptime
• Extract infrastructure docs
• Scrape health check endpoints
• Collect metrics data
```

---

**Invoke:** `/scrapling` | **Version:** 1.0.0

---

*Based on: https://github.com/D4Vinci/Scrapling*
