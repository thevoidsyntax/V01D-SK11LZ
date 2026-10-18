---
name: test-generator
version: "1.0.0"
description: "Auto-generate unit tests, integration tests, and E2E tests. Supports Jest, Vitest, Mocha, Pytest, and more."
when_to_use: "When you need to write tests, generate test coverage, or set up testing infrastructure."
priority: high
phase: any
category: [testing, quality]
tech_stack:
  languages: [all]
  frameworks: [all]
auto_invoke:
  enabled: true
  conditions:
    - command: ["/test", "/tests", "/generate-tests", "/write-tests", "/test-gen"]
      reason: "Test generation command"
    - pattern: ["test", "spec", "describe", "it(", "expect", "assert", "coverage"]
      reason: "Testing-related keywords"
      confidence: 0.6
capabilities:
  - unit-test-generation
  - integration-test-generation
  - mock-generation
  - coverage-analysis
  - test-template-generation
author: TheVoidSyntax
---

# TEST GENERATOR v1.0 🧪

**Auto-generate tests for your codebase**

## Usage

```
/test-generator              Generate tests for current file
/test-generator --unit       Unit tests only
/test-generator --integration Integration tests
/test-generator --e2e        E2E tests (Playwright/Cypress)
/test-generator --mock      Generate mocks only
```

---

## Supported Frameworks

| Language | Unit Test | Integration | E2E |
|----------|-----------|-------------|-----|
| JavaScript/TypeScript | Jest, Vitest, Mocha | Jest, Supertest | Playwright, Cypress |
| Python | pytest, unittest | pytest | Playwright |
| Go | testing, testify | Go tests | Playwright |
| Rust | #[test], proptest | Go tests | Playwright |

---

## How It Works

```
1. Analyze target code/function
2. Identify test cases (happy path, edge cases, error cases)
3. Generate appropriate test structure
4. Create mocks if needed
5. Match testing framework to project
```

---

## Test Generation Types

### 1. Unit Tests

```typescript
// Source
function add(a: number, b: number): number {
  return a + b;
}

// Generated Test
describe('add()', () => {
  it('should add two positive numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('should handle zero', () => {
    expect(add(0, 5)).toBe(5);
  });

  it('should handle negative numbers', () => {
    expect(add(-1, -2)).toBe(-3);
  });

  it('should handle decimal numbers', () => {
    expect(add(0.1, 0.2)).toBeCloseTo(0.3);
  });
});
```

### 2. Integration Tests

```typescript
// API Integration Test
describe('POST /api/users', () => {
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'John', email: 'john@example.com' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('John');
  });

  it('should return 400 for invalid email', async () => {
    await request(app)
      .post('/api/users')
      .send({ name: 'John', email: 'invalid' })
      .expect(400);
  });
});
```

### 3. E2E Tests (Playwright)

```typescript
// E2E Test
test('user can login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('Welcome');
});
```

### 4. Mock Generation

```typescript
// API Mock
const mockFetchUser = vi.fn().mockResolvedValue({
  id: '1',
  name: 'John',
  email: 'john@example.com'
});

// Database Mock
const mockDb = {
  query: vi.fn().mockResolvedValue([{ id: 1 }]),
  insert: vi.fn().mockResolvedValue({ id: 1 }),
  update: vi.fn().mockResolvedValue({ affectedRows: 1 }),
  delete: vi.fn().mockResolvedValue({ affectedRows: 1 })
};
```

---

## Test Coverage Goals

```
┌─────────────────────────────────────────────────────────────┐
│  COVERAGE TARGETS                                         │
├─────────────────────────────────────────────────────────────┤
│  Lines:     80%+  │  Functions: 90%+                   │
│  Branches:  70%+  │  Statements: 80%+                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Test Case Templates

### Happy Path

```typescript
it('should [expected behavior] when [condition]', () => {
  // Arrange
  const input = createValidInput();
  
  // Act
  const result = functionUnderTest(input);
  
  // Assert
  expect(result).toBe(expectedOutput);
});
```

### Edge Cases

```typescript
it('should handle empty input', () => {
  expect(functionUnderTest('')).toBe(expected);
});

it('should handle null/undefined', () => {
  expect(functionUnderTest(null)).toBe(expected);
  expect(functionUnderTest(undefined)).toBe(expected);
});

it('should handle maximum input', () => {
  const maxInput = 'x'.repeat(10000);
  expect(functionUnderTest(maxInput)).toBe(expected);
});
```

### Error Cases

```typescript
it('should throw error for invalid input', () => {
  expect(() => functionUnderTest(invalidInput))
    .toThrow(ExpectedError);
});

it('should return error result for API failure', async () => {
  mockApi.mockRejectedValue(new Error('Network error'));
  const result = await callApi();
  expect(result).toEqual({ error: 'Network error' });
});
```

---

## Output Format

### Terminal Output

```
╔══════════════════════════════════════════════════════════════════════╗
║                     TEST GENERATION REPORT                          ║
╠══════════════════════════════════════════════════════════════════════╣
║  📁 Target: src/utils/calculator.ts                                ║
║  🧪 Framework: Vitest                                             ║
║  📊 Coverage: +45% (current → target)                             ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  ✅ GENERATED: src/utils/calculator.test.ts                        ║
║                                                                      ║
║  📝 Test Cases: 8                                                  ║
║  ├── ✓ add() - positive numbers                                   ║
║  ├── ✓ add() - negative numbers                                   ║
║  ├── ✓ add() - zero                                               ║
║  ├── ✓ subtract() - basic                                          ║
║  ├── ✓ multiply() - basic                                          ║
║  ├── ✓ divide() - basic                                           ║
║  ├── ✓ divide() - by zero (error case)                            ║
║  └── ✓ divide() - decimal result                                   ║
║                                                                      ║
║  📋 Code Coverage:                                                 ║
║  ├── Statements: 85% (+15%)                                       ║
║  ├── Branches: 78% (+23%)                                         ║
║  └── Functions: 100% (+10%)                                        ║
║                                                                      ║
║  💡 Run tests: npx vitest run src/utils/calculator.test.ts        ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## Commands

| Command | Action |
|---------|--------|
| `/test-generator` | Generate tests for current context |
| `/test-generator --unit` | Unit tests only |
| `/test-generator --integration` | Integration tests |
| `/test-generator --e2e` | E2E tests |
| `/test-generator --coverage` | Show coverage analysis |
| `/test-generator --template` | Show test templates |

---

## Tips for Good Tests

### 1. Follow AAA Pattern

```
Arrange → Act → Assert
  ↓        ↓       ↓
Setup    Run    Verify
```

### 2. Use Descriptive Names

```typescript
// ❌ Bad
it('test1', () => { ... });

// ✅ Good
it('should return 404 when user does not exist', () => { ... });
```

### 3. One Assertion Per Test

```typescript
// ❌ Bad
it('should validate and save user', () => {
  expect(validate()).toBe(true);
  expect(save()).toBe(true);
});

// ✅ Good
it('should validate user input', () => { ... });
it('should save user to database', () => { ... });
```

### 4. Mock External Dependencies

```typescript
it('should fetch user data', async () => {
  mockApi.mockResolvedValue({ id: 1, name: 'John' });
  const user = await fetchUser(1);
  expect(user.name).toBe('John');
});
```

---

## Examples

### Example 1: API Endpoint

```typescript
// Generate tests for this
app.post('/api/users', async (req, res) => {
  const { name, email } = req.body;
  const user = await db.users.create({ name, email });
  res.status(201).json(user);
});

// Output: 5 test cases
// - create user with valid data (201)
// - create user with missing name (400)
// - create user with invalid email (400)
// - create user with duplicate email (409)
// - create user database error (500)
```

### Example 2: Utility Function

```typescript
// Generate tests for this
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Output: 4 test cases
// - format valid date
// - format date with timezone
// - handle invalid date
// - handle edge cases (epoch, far future)
```

---

## Related Skills

| Skill | Use Case |
|-------|----------|
| `/testing` | TDD methodology (red → green → refactor) |
| `/code-quality` | Code quality standards |
| `/autor` | Detect testing framework |

---

*Test smarter, ship with confidence!*
