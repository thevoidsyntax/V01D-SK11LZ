---
name: tdd
description: Test-driven development with red-green-refactor loop and principles for AI agents
version: "1.0.0"
category: [process]
priority: medium
phase: any
tech_stack:
  languages: [typescript, javascript, python, go, java, all]
scale: [mvp, small, medium, large]
auto_invoke:
  enabled: false
  conditions:
    - command: "/tdd"
      reason: "Explicit invocation"
  skill_tier: optional
capabilities: [implementation, generation]
quality:
  rules_count: 15
  examples_count: 20
  stability: stable
integrates_with: [implement]
source:
  origin: local
author: thevoidsyntax
---

# Test-Driven Development

TDD is the **red → green loop**. This skill produces tests worth keeping: what a good test is, where tests go, anti-patterns, and the rules of the loop.

## The Red-Green-Refactor Cycle

```
┌─────────┐    Write failing    ┌─────────┐    Minimal code     ┌─────────┐
│   RED   │ ─────────────────► │  GREEN  │ ─────────────────► │ REFACTOR│
│  Phase  │       test         │  Phase  │       to pass      │  Phase  │
└─────────┘                    └─────────┘                    └─────────┘
     ▲                                                        │
     └──────────────────── Loop back ◄────────────────────────┘
```

### Phase RED - Write Test First
1. Write unit test that defines expected behavior
2. Test MUST FAIL before implementation exists
3. Do NOT write implementation before test

### Phase GREEN - Minimal Implementation
1. Write code as minimal as possible
2. Only enough to make test PASS
3. Do NOT optimize - focus on correctness

### Phase REFACTOR - Improve Code
1. Refactor for cleanliness & performance
2. Remove duplications
3. Ensure tests still PASS after refactor

---

## What a Good Test Is

Tests verify behavior through **public interfaces**, not implementation details. Code can change entirely; tests shouldn't.

| Good Test | Bad Test |
|-----------|----------|
| Tests observable behavior | Tests implementation details |
| Survives refactors | Breaks on refactor |
| Public API only | Mocks internal collaborators |
| Independent expected values | Tautological assertions |

### Good Test Example
```typescript
test("user can checkout with valid cart", async () => {
  const cart = createCart();
  cart.add(product);
  const result = await checkout(cart, paymentMethod);
  expect(result.status).toBe("confirmed");
});
```

### Bad Test Example (Implementation Detail)
```typescript
test("checkout calls paymentService.process", async () => {
  const mockPayment = jest.mock(paymentService);
  await checkout(cart, payment);
  expect(mockPayment.process).toHaveBeenCalledWith(cart.total);
});
```

---

## Seams: Where Tests Go

A **seam** is the public boundary you test at: the interface where you observe behavior without reaching inside.

**Test only at pre-agreed seams.** Before writing any test, confirm the seams with the user. No test is written at an unconfirmed seam.

### Designing for Testability

```typescript
// ✅ Testable - Accept dependencies
function processOrder(order, paymentGateway) {}

// ❌ Hard to test - Creates dependencies internally
function processOrder(order) {
  const gateway = new StripeGateway();
}
```

---

## Anti-Patterns

### ❌ Implementation-Coupled
Mocks internal collaborators, tests private methods, or verifies through side channels.

### ❌ Tautological
The assertion recomputes the expected value the way the code does:
```typescript
// BAD - Passes by construction
expect(add(a, b)).toBe(a + b);

// GOOD - Independent expected value
expect(add(2, 3)).toBe(5);
```

### ❌ Horizontal Slicing
Writing all tests first, then all implementation. Work in **vertical slices** instead.

---

## Rules of the Loop

- **Red before green.** Write the failing test first, then only enough code to pass it.
- **One slice at a time.** One seam, one test, one minimal implementation per cycle.
- **Refactoring is not part of the loop.** It belongs to the review stage.

---

## TDD for .NET (xUnit)

### Structure Test
```csharp
[Fact]
public async Task CreateUser_WithValidData_ReturnsCreatedUser()
{
    // ARRANGE - Setup dependencies & input
    var repository = new InMemoryUserRepository();
    var handler = new CreateUserCommandHandler(repository);
    var command = new CreateUserCommand("john@example.com", "Password123!");

    // ACT - Execute the operation
    var result = await handler.Handle(command, CancellationToken.None);

    // ASSERT - Verify outcomes
    Assert.NotNull(result);
    Assert.Equal("john@example.com", result.Email);
}
```

### Test Naming Convention
```
[Method]_[Scenario]_[ExpectedResult]

Examples:
- CreateUser_WithValidData_ReturnsCreatedUser
- CreateUser_WithDuplicateEmail_ThrowsDuplicateEmailException
- GetUser_WithInvalidId_ReturnsNull
```

### Mocking with Moq
```csharp
[Fact]
public async Task GetUserById_WithValidId_CallsRepository()
{
    // Arrange
    var mockRepo = new Mock<IUserRepository>();
    var userId = Guid.NewGuid();
    var expectedUser = new User { Id = userId, Email = "test@test.com" };
    
    mockRepo.Setup(r => r.GetByIdAsync(userId))
            .ReturnsAsync(expectedUser);
    
    var handler = new GetUserByIdQueryHandler(mockRepo.Object);

    // Act
    var result = await handler.Handle(new GetUserByIdQuery(userId));

    // Assert
    Assert.Equal(expectedUser.Email, result.Email);
    mockRepo.Verify(r => r.GetByIdAsync(userId), Times.Once);
}
```

---

## TDD for Frontend (Jest + React Testing Library)

### Component Test
```typescript
describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    await userEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Hook Test
```typescript
describe('useUser', () => {
  it('returns user data after mount', async () => {
    const { result } = renderHook(() => useUser('user-123'));
    
    await waitFor(() => {
      expect(result.current.user).toBeDefined();
    });
  });
});
```

---

## Mocking Guidelines

Mock at **system boundaries** only:
- External APIs (payment, email)
- Databases (prefer test DB)
- Time/randomness
- File system

Don't mock your own classes/modules.

---

## Test Coverage Targets

| Layer | Minimum Coverage |
|-------|------------------|
| Domain Entities | 90% |
| Application Handlers | 80% |
| Infrastructure | 70% |
| API Controllers | 60% |
| Frontend Components | 50% |

**Critical Paths (100% coverage):**
- User authentication & authorization
- Financial transactions
- Data validation

---

## Test Pyramid

```
        ┌─────────────┐
        │    E2E      │  ← Few (Playwright)
        ├─────────────┤
        │ Integration │  ← Some (API tests)
        ├─────────────┤
        │    Unit     │  ← Many (xUnit, Jest)
        └─────────────┘
```

---

**Invoke:** `/tdd` | **Priority:** HIGH
