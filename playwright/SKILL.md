---
name: playwright
description: "Comprehensive Playwright E2E testing with test writing assistance, automated health checks, accessibility audits, screenshot comparison, and CI/CD integration."
when_to_use: Use for E2E testing, UI automation, accessibility audits, visual regression, broken link checking, or when building test suites.
version: 1.0.0
priority: high
phase: any
tech_stack:
  languages: [typescript, javascript, python]
  frameworks: [playwright, "@playwright/test"]
scale: [mvp, small, medium, large]
model_recommended: sonnet
effort_recommended: medium
mode_recommended: auto
auto_invoke:
  enabled: true
  conditions:
    - command: ["/playwright"]
      reason: "Explicit Playwright invocation"
    - phrase: ["e2e test", "end-to-end test", "playwright test", "browser test", "ui test"]
      reason: "E2E test writing intent"
    - phrase: ["visual regression", "screenshot test"]
      reason: "Visual testing with Playwright"
integrates_with: [testing, tdd, ci-cd]

---

## Quick Start

### 1. Initialize Playwright in Project

```bash
# Install Playwright
npm init playwright@latest

# Or add to existing project
npm install -D @playwright/test
npx playwright install chromium

# Setup with custom config
npx playwright test --ui  # Opens Playwright UI mode
```

### 2. Generate Test from Recording

```bash
# Record actions and generate code
npx playwright codegen https://example.com
```

### 3. Run Automated Checks

```bash
# Health check
npx playwright open --check https://example.com

# Accessibility audit
npx playwright audit --accessibility https://example.com
```

---

## Test Writing

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/login');

    // Fill form
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('password123');

    // Submit
    await page.getByRole('button', { name: 'Login' }).click();

    // Assert
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Welcome')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('invalid@example.com');
    await page.getByLabel('Password').fill('wrong');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByRole('alert')).toContainText('Invalid');
  });
});
```

### Page Object Pattern

```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }

  get errorAlert() {
    return this.page.getByRole('alert');
  }
}

// tests/login.spec.ts
test('login flow', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@test.com', 'password');
  await expect(page).toHaveURL('/dashboard');
});
```

### Locator Best Practices

```typescript
// Priority: getByRole > getByLabel > getByText > CSS > XPath

// ✅ Best - Semantic
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByLabel('Email').fill('test@example.com');
await page.getByPlaceholder('Search...').fill('query');

// ✅ Good - Text content
await page.getByText('Welcome back').click();
await page.getByText('Total: $99.99').isVisible();

// ⚠️ Acceptable - When no other option
await page.locator('.btn-primary').click();
await page.locator('article.card').first();

// ❌ Avoid - Fragile
await page.locator('#submit-btn').click();  // IDs can change
await page.locator('div > span > button').click();  // Deep DOM
```

### API Testing with Playwright

```typescript
import { test, expect, request } from '@playwright/test';

test('API + UI integration', async ({ page }) => {
  // Create user via API
  const apiContext = await request.newContext();
  const response = await apiContext.post('/api/users', {
    data: { email: 'new@test.com', name: 'New User' }
  });
  expect(response.ok()).toBeTruthy();
  const user = await response.json();

  // Verify in UI
  await page.goto('/admin/users');
  await expect(page.getByText(user.name)).toBeVisible();

  // Cleanup
  await apiContext.dispose();
});
```

---

## Automated Health Checks

### Site Health Audit Script

```typescript
// health-check.ts
import { chromium, FullConfig } from '@playwright/test';

interface HealthReport {
  url: string;
  timestamp: string;
  checks: {
    brokenLinks: CheckResult[];
    consoleErrors: ConsoleError[];
    missingAlt: MissingAlt[];
    performance: PerformanceMetrics;
    accessibility: A11yIssue[];
  };
  score: number;
}

async function runHealthCheck(url: string): Promise<HealthReport> {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const results: HealthReport = {
    url,
    timestamp: new Date().toISOString(),
    checks: { brokenLinks: [], consoleErrors: [], missingAlt: [], performance: {}, accessibility: [] },
    score: 0
  };

  // 1. Collect all links
  const links = await page.goto(url).then(() =>
    page.locator('a[href]').evaluateAll(els =>
      els.map(a => ({ href: a.href, text: a.textContent }))
    )
  );

  // 2. Check each link
  for (const link of links) {
    if (link.href.startsWith('http')) {
      try {
        const response = await page.request.get(link.href);
        if (!response.ok()) {
          results.checks.brokenLinks.push({
            url: link.href,
            status: response.status(),
            text: link.text || ''
          });
        }
      } catch {
        results.checks.brokenLinks.push({ url: link.href, status: 0, text: link.text || '' });
      }
    }
  }

  // 3. Console errors
  const consoleErrors: ConsoleError[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push({ message: msg.text(), url: page.url() });
    }
  });

  // 4. Missing alt text
  results.checks.missingAlt = await page.locator('img:not([alt])').evaluateAll(els =>
    els.map(img => ({ selector: img.outerHTML.substring(0, 100), src: img.src }))
  );

  await browser.close();

  // Calculate score
  const maxScore = 100;
  const deductions = (
    results.checks.brokenLinks.length * 5 +
    consoleErrors.length * 10 +
    results.checks.missingAlt.length * 2
  );
  results.score = Math.max(0, maxScore - deductions);

  return results;
}
```

### Console Error Monitoring

```typescript
test('no console errors', async ({ page }) => {
  const errors: string[] = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  page.on('pageerror', error => {
    errors.push(error.message);
  });

  await page.goto('/');

  // Filter known acceptable errors
  const criticalErrors = errors.filter(e =>
    !e.includes('favicon') &&
    !e.includes('warning') &&
    !e.includes('[DOM]')
  );

  expect(criticalErrors).toHaveLength(0);
});
```

---

## Accessibility Audit

### Quick A11y Checks

```typescript
import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('page has proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    const headings = await page.locator('h1, h2, h3, h4, h5, h6')
      .evaluateAll(els => els.map((h, i) => ({ level: h.tagName, text: h.textContent?.trim() })));

    // Should have exactly one h1
    expect(headings.filter(h => h.level === 'H1')).toHaveLength(1);

    // Headings should not skip levels (h1 -> h3)
    let lastLevel = 0;
    for (const heading of headings) {
      const level = parseInt(heading.level[1]);
      expect(level - lastLevel).toBeLessThanOrEqual(1);
      lastLevel = level;
    }
  });

  test('all images have alt text', async ({ page }) => {
    await page.goto('/');

    const imagesWithoutAlt = await page.locator('img:not([alt])').count();
    expect(imagesWithoutAlt).toBe(0);
  });

  test('forms have associated labels', async ({ page }) => {
    await page.goto('/');

    const inputs = page.locator('input:not([type="hidden"]):not([type="submit"])');
    const count = await inputs.count();

    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledby = await input.getAttribute('aria-labelledby');

      // Must have either id+label, aria-label, or aria-labelledby
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        expect(await label.count()).toBeGreaterThan(0);
      } else {
        expect(ariaLabel || ariaLabelledby).toBeTruthy();
      }
    }
  });

  test('color contrast meets WCAG AA', async ({ page }) => {
    await page.goto('/');

    // Inject contrast checker
    const contrastIssues = await page.evaluate(() => {
      const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button');
      const issues: Array<{text: string, bg: string, ratio: number}> = [];

      elements.forEach(el => {
        const style = getComputedStyle(el);
        const bg = style.backgroundColor;
        const color = style.color;
        const ratio = getContrastRatio(bg, color);

        if (ratio < 4.5) {
          issues.push({ text: el.textContent?.slice(0, 50) || '', bg, ratio });
        }
      });

      return issues;
    });

    expect(contrastIssues).toHaveLength(0);
  });
});
```

### ARIA Verification

```typescript
test('interactive elements are keyboard accessible', async ({ page }) => {
  await page.goto('/');

  // Find all interactive elements without proper ARIA
  const interactiveWithoutA11y = await page.evaluate(() => {
    const issues: string[] = [];
    const interactives = document.querySelectorAll('button, a, input, select, textarea, [role]');

    interactives.forEach(el => {
      const tag = el.tagName.toLowerCase();
      const role = el.getAttribute('role');

      // Custom interactive elements need role
      if (tag === 'div' && !role && (el as HTMLElement).tabIndex >= 0) {
        issues.push(`${tag}[tabindex]: ${el.className}`);
      }

      // Buttons must have accessible name
      if (tag === 'button' && !el.textContent?.trim() && !el.getAttribute('aria-label')) {
        issues.push(`button without text: ${el.outerHTML.slice(0, 100)}`);
      }
    });

    return issues;
  });

  expect(interactiveWithoutA11y).toHaveLength(0);
});
```

---

## Visual Regression

### Screenshot Comparison

```typescript
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('homepage matches design', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    await expect(page).toHaveScreenshot('homepage.png', {
      maxDiffPixelRatio: 0.02,  // 2% tolerance
    });
  });

  test('dark mode matches design', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/', { colorScheme: 'dark' });

    await expect(page).toHaveScreenshot('homepage-dark.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('mobile responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });  // iPhone SE
    await page.goto('/');

    await expect(page).toHaveScreenshot('homepage-mobile.png');
  });
});
```

### Component Screenshots

```typescript
test('Button variants', async ({ page }) => {
  await page.goto('/components/buttons');

  // Screenshot each button variant
  const variants = ['primary', 'secondary', 'outline', 'ghost', 'danger'];

  for (const variant of variants) {
    const button = page.getByRole('button', { name: variant });
    await expect(button).toHaveScreenshot(`button-${variant}.png`);
  }
});
```

---

## CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: lts/*

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps chromium

      - name: Run Playwright tests
        run: npx playwright test

      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

      - name: Upload screenshots on failure
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: test-screenshots
          path: test-results/
          retention-days: 7
```

### Parallel Execution

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,           // Run tests in parallel
  forbidOnly: !!process.env.CI,  // No only() in CI
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,  // Auto-detect

  reporter: [
    ['html'],
    ['list']
  ],

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',  // Capture trace on failure
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
```

---

## Debugging

### UI Mode (Interactive)

```bash
# Opens browser with UI for debugging
npx playwright test --ui

# Debug specific test
npx playwright test login.spec.ts --ui
```

### Trace Viewer

```typescript
// In test
await page.context().tracing.startChunk({
  title: 'login-flow'
});

await page.goto('/login');
// ... actions

await page.context().tracing.stopChunk({
  path: './test-results/trace.zip'
});
```

### Debug Selectors

```typescript
test('debug locator', async ({ page }) => {
  // Generate best selector
  const locator = page.getByRole('button', { name: 'Submit' });

  // Print selector alternatives
  console.log('Locator:', locator);
  console.log('CSS:', await locator.evaluate(el => el.outerHTML));

  await locator.click();
});
```

---

## Pre-Delivery Checklist

Before committing Playwright tests:

- [ ] Tests pass on all browsers (Chromium, Firefox, Safari)
- [ ] Mobile responsive tests included
- [ ] No console errors captured
- [ ] Accessibility checks passing
- [ ] Visual regression baseline screenshots captured
- [ ] Page Objects for reusable components
- [ ] CI/CD pipeline configured
- [ ] Test execution time reasonable (< 10 min)

---

## Invoke

**Invoke:** /playwright | **Priority:** HIGH | **Version:** 1.0.0
