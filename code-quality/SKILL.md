---
name: code-quality
description: "Code quality standards and review patterns including common code smells, refactoring techniques, and review checklists"
version: "1.2.0"
category: [quality]
priority: high
phase: any
auto_invoke:
  enabled: true
  conditions:
    - command: ["/code-quality", "/code-quality"]
      reason: "Code quality review"
    - phrase: ["code quality", "refactor", "code smell", "review code"]
      reason: "Code quality context"
tech_stack:
  languages: [all]
scale: [all]
integrates_with: [pr-review, testing, diagnosing-bugs]
capabilities: [review, analysis]
quality:
  rules_count: 15
  examples_count: 8
  stability: stable
source:
  origin: merged
author: thevoidsyntax
---

# CODE QUALITY MODULE

Kamu adalah Code Quality Specialist. Gunakan rules ini untuk setiap aspek code review dan quality assurance.

---

## 1. CODE REVIEW FUNDAMENTALS

### Review Patterns

#### N+1 Query — Bad vs Good
```python
# BAD: query inside loop
for user in users:
    orders = Order.objects.filter(user=user)

# GOOD: prefetch in bulk
users = User.objects.prefetch_related('orders').all()
```

#### Magic Number — Bad vs Good
```python
# BAD
if status == 3:

# GOOD
ORDER_STATUS_SHIPPED = 3
if status == ORDER_STATUS_SHIPPED:
```

#### SQL Injection — Bad vs Good
```python
# BAD: string interpolation
cursor.execute(f"SELECT * FROM users WHERE id = {user_id}")

# GOOD: parameterized query
cursor.execute("SELECT * FROM users WHERE id = %s", [user_id])
```

### Fowler Code Smells Baseline
- **Mysterious Name**: function/variable/type name doesn't reveal what it does
- **Duplicated Code**: same logic shape in more than one place
- **Feature Envy**: method reaches into another object's data more than its own
- **Data Clumps**: same few fields/params keep travelling together
- **Primitive Obsession**: primitive/string standing in for domain concept
- **Repeated Switches**: same switch/if-cascade recurs
- **Shotgun Surgery**: one change forces scattered edits
- **Divergent Change**: one module edited for unrelated reasons
- **Speculative Generality**: abstraction added for needs the spec doesn't have
- **Message Chains**: long `a.b().c().d()` navigation
- **Middle Man**: class/function that mostly just delegates
- **Refused Bequest**: subclass ignores most of what it inherits

---

## 2. REVIEW WORKFLOW

### Core Workflow
1. **Context** — Understand the problem being solved
2. **Structure** — Review architecture and design decisions
3. **Details** — Check code quality, security, performance
4. **Tests** — Validate test coverage and quality
5. **Feedback** — Produce a categorized report

### Output Template
Code review report must include:
1. **Summary** — One-sentence intent recap + overall assessment
2. **Critical issues** — Must fix before merge
3. **Major issues** — Should fix
4. **Minor issues** — Nice to have
5. **Positive feedback** — Specific patterns done well
6. **Questions for author** — Clarifications needed
7. **Verdict** — Approve / Request Changes / Comment

---

## 3. QUALITY CHECKLIST

### Correctness
- [ ] Logic is correct for all edge cases
- [ ] Error handling is complete
- [ ] Null/undefined cases are handled
- [ ] Boundary conditions are validated

### Security
- [ ] No SQL injection vulnerabilities
- [ ] Input validation present
- [ ] No hardcoded secrets
- [ ] Authentication/authorization checked
- [ ] Output encoding for XSS prevention

### Performance
- [ ] No N+1 query problems
- [ ] Appropriate indexing present
- [ ] No memory leaks
- [ ] Efficient algorithms used
- [ ] Proper use of caching

### Maintainability
- [ ] Clear naming conventions
- [ ] Functions are reasonably sized
- [ ] No deeply nested conditionals
- [ ] DRY principle followed
- [ ] Proper separation of concerns

### Testing
- [ ] Unit tests present
- [ ] Edge cases covered
- [ ] Test descriptions are clear
- [ ] No test pollution

---

## 4. REFACTORING PATTERNS

### Extract Method
```javascript
// BEFORE
function processOrder(order) {
  // Calculate discount
  let discount = 0;
  if (order.type === 'premium') discount = order.amount * 0.2;
  else if (order.type === 'standard') discount = order.amount * 0.1;

  // Calculate tax
  const tax = order.amount * 0.1;

  // Calculate total
  return order.amount - discount + tax;
}

// AFTER
function calculateDiscount(order) {
  if (order.type === 'premium') return order.amount * 0.2;
  if (order.type === 'standard') return order.amount * 0.1;
  return 0;
}

function calculateTax(amount) {
  return amount * 0.1;
}

function processOrder(order) {
  const discount = calculateDiscount(order);
  const tax = calculateTax(order.amount);
  return order.amount - discount + tax;
}
```

### Replace Conditional with Polymorphism
```python
# BEFORE
class Order:
    def calculate_shipping(self):
        if self.type == 'digital':
            return 0
        elif self.type == 'standard':
            return 5.99
        elif self.type == 'express':
            return 15.99

# AFTER
from abc import ABC, abstractmethod

class ShippingStrategy(ABC):
    @abstractmethod
    def calculate(self, order):
        pass

class DigitalShipping(ShippingStrategy):
    def calculate(self, order):
        return 0

class StandardShipping(ShippingStrategy):
    def calculate(self, order):
        return 5.99

class ExpressShipping(ShippingStrategy):
    def calculate(self, order):
        return 15.99

class Order:
    def __init__(self, shipping: ShippingStrategy):
        self.shipping = shipping

    def calculate_shipping(self):
        return self.shipping.calculate(self)
```

---

## 5. CONSTRAINTS

### MUST DO
- Summarize PR intent before reviewing
- Provide specific, actionable feedback
- Include code examples in suggestions
- Praise good patterns
- Prioritize feedback (critical → minor)
- Review tests as thoroughly as code
- Check for security issues

### MUST NOT DO
- Be condescending or rude
- Nitpick style when linters exist
- Block on personal preferences
- Demand perfection
- Skip manual review (tools miss things)

---

**Invoke:** `/code-quality` | **Priority:** HIGH | **Version:** 1.1.0
