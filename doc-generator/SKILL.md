---
name: doc-generator
version: "1.0.0"
description: "Auto-generate README, API docs, JSDoc, CHANGELOG, and other documentation from code."
when_to_use: "When you need to write documentation, generate README, or document code."
priority: medium
phase: any
category: [documentation]
tech_stack:
  languages: [all]
  frameworks: [all]
auto_invoke:
  enabled: true
  conditions:
    - command: ["/doc", "/docs", "/generate-docs", "/write-docs", "/doc-gen", "/readme"]
      reason: "Documentation generation command"
    - pattern: ["readme", "documentation", "docs", "api", "changelog", "jsdoc", "comment"]
      reason: "Documentation-related keywords"
      confidence: 0.5
capabilities:
  - readme-generation
  - api-docs-generation
  - jsdoc-generation
  - changelog-generation
  - inline-documentation
author: TheVoidSyntax
---

# DOC GENERATOR v1.0 📝

**Auto-generate documentation from code**

## Usage

```
/doc-generator              Generate README for project
/doc-generator --api        Generate API documentation
/doc-generator --jsdoc      Add JSDoc comments
/doc-generator --changelog  Generate/update CHANGELOG
/doc-generator --inline     Add inline comments
```

---

## Supported Outputs

| Type | Format | Description |
|------|--------|-------------|
| README | Markdown | Project overview |
| API Docs | OpenAPI/Postman | REST API documentation |
| JSDoc | TypeScript | Inline documentation |
| CHANGELOG | Keepachangelog | Version history |
| Inline | Comments | Code comments |

---

## README Generator

### Template Structure

```markdown
# Project Name

> One-line description

[![CI](badge-url)](link)
[![License](badge-url)](link)

## Features

- ✨ Feature 1
- 🚀 Feature 2
- 🔒 Feature 3

## Quick Start

```bash
npm install
npm run dev
```

## Installation

```bash
npm install package-name
```

## Usage

```typescript
import { feature } from 'package-name';

const result = feature('input');
console.log(result);
```

## API Reference

### functionName()

Description...

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| param1 | string | Description |

**Returns:** `Promise<Result>`

**Example:**

```typescript
const result = await functionName('input');
```

## Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| API_KEY | string | - | Required API key |

## Contributing

1. Fork it
2. Create your branch
3. Commit changes
4. Push to branch
5. Open PR

## License

MIT © [Author](link)
```

---

## API Docs Generator

### OpenAPI 3.0

```yaml
openapi: 3.0.0
info:
  title: API Name
  version: 1.0.0
  description: API description

servers:
  - url: https://api.example.com/v1
    description: Production

paths:
  /users:
    get:
      summary: List users
      tags:
        - Users
      parameters:
        - name: page
          in: query
          schema:
            type: integer
          description: Page number
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
        '401':
          $ref: '#/components/responses/Unauthorized'

components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
        email:
          type: string
          format: email
      required:
        - id
        - email
  responses:
    Unauthorized:
      description: Unauthorized
```

---

## JSDoc Generator

### Function Documentation

```typescript
// Before
function calculateTotal(items, tax) {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  return subtotal * (1 + tax);
}

// After
/**
 * Calculate total price including tax.
 * 
 * @param items - Array of items with price property
 * @param tax - Tax rate as decimal (e.g., 0.1 for 10%)
 * @returns Total price with tax applied
 * 
 * @example
 * calculateTotal([{ price: 10 }, { price: 20 }], 0.1)
 * // Returns: 33
 * 
 * @throws {Error} If items array is empty
 */
function calculateTotal(items: Item[], tax: number): number {
  if (!items.length) {
    throw new Error('Items array cannot be empty');
  }
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  return subtotal * (1 + tax);
}
```

### Class Documentation

```typescript
/**
 * User service for managing user data.
 * 
 * @class
 * @example
 * const userService = new UserService(db);
 * const user = await userService.findById('123');
 */
class UserService {
  /**
   * Database connection instance.
   * @private
   */
  private db: Database;

  /**
   * Create a new UserService.
   * @param db - Database instance
   */
  constructor(db: Database) {
    this.db = db;
  }

  /**
   * Find user by ID.
   * 
   * @param id - User UUID
   * @returns User object or null if not found
   * 
   * @example
   * const user = await userService.findById('abc-123');
   */
  async findById(id: string): Promise<User | null> {
    return this.db.users.findUnique({ where: { id } });
  }
}
```

### Type Documentation

```typescript
/**
 * User entity in the system.
 * 
 * @typedef {Object} User
 * @property {string} id - Unique identifier (UUID)
 * @property {string} name - Full name
 * @property {string} email - Email address
 * @property {UserRole} role - User role
 * @property {Date} createdAt - Account creation date
 */

/**
 * User roles in the system.
 * @typedef {'admin' | 'user' | 'guest'} UserRole
 */
```

---

## CHANGELOG Generator

### Template (Keepachangelog)

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added
- New feature description

### Changed
- Changed behavior description

### Deprecated
- Soon-to-be removed feature

### Removed
- Removed feature description

### Fixed
- Bug fix description

### Security
- Security improvement

## [1.0.0] - YYYY-MM-DD

### Added
- Initial release
```

### Version Template

```markdown
## [1.2.0] - 2024-01-15

### Added
- New user authentication feature
- Support for OAuth2 login

### Changed
- Improved API response time by 30%
- Updated dependencies to latest versions

### Fixed
- Fixed memory leak in background worker
- Resolved race condition in concurrent requests

### Security
- Updated password hashing to bcrypt
- Added rate limiting to API endpoints
```

---

## Inline Comment Styles

### JavaScript/TypeScript

```typescript
// Single-line comment for simple logic
const MAX_RETRIES = 3;

// Block comment for complex logic
/**
 * Processes user data in batches to avoid memory issues.
 * 
 * WHY: Processing 10k+ records at once causes OOM in lambda
 * LIMIT: Each batch is limited to 100 records
 */
async function processInBatches(data: User[]): Promise<void> {
  const BATCH_SIZE = 100;
  
  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    const batch = data.slice(i, i + BATCH_SIZE);
    await processBatch(batch);
  }
}
```

### Python

```python
# Constants (UPPERCASE)
MAX_CONNECTIONS = 10

# Class docstring
class DataProcessor:
    """
    Process data with caching support.
    
    Attributes:
        cache: In-memory cache instance
        timeout: Request timeout in seconds
    """
    
    def process(self, data: list) -> list:
        """
        Process data items.
        
        Args:
            data: List of items to process
            
        Returns:
            Processed items
            
        Raises:
            ValueError: If data is empty
        """
        if not data:
            raise ValueError("Data cannot be empty")
        return [self.transform(item) for item in data]
```

---

## Output Format

### Terminal Output

```
╔══════════════════════════════════════════════════════════════════════╗
║                   DOCUMENTATION GENERATION                         ║
╠══════════════════════════════════════════════════════════════════════╣
║  📄 Generated: README.md                                          ║
║  📊 Lines: 145                                                   ║
║  📈 Sections: 8                                                  ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  ✅ README.md created with sections:                              ║
║     ├── Title + Badges                                            ║
║     ├── Quick Start                                               ║
║     ├── Features (3 detected)                                      ║
║     ├── Installation                                              ║
║     ├── Usage Example                                             ║
║     ├── API Reference (4 functions)                               ║
║     ├── Configuration                                             ║
║     ├── Contributing                                              ║
║     └── License                                                   ║
║                                                                      ║
║  💡 Tips:                                                         ║
║     ├── Add screenshots to README                                ║
║     └── Add more usage examples                                  ║
║                                                                      ║
║  📝 Run: cat README.md                                           ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## Commands

| Command | Action |
|---------|--------|
| `/doc-generator` | Generate README |
| `/doc-generator --api` | Generate API docs |
| `/doc-generator --jsdoc` | Add JSDoc comments |
| `/doc-generator --changelog` | Generate CHANGELOG |
| `/doc-generator --inline` | Add inline comments |
| `/doc-generator --update` | Update existing docs |

---

## Tips for Good Docs

### 1. README Best Practices

```
✓ Keep it short (300-500 words)
✓ Focus on "what" and "why", not "how"
✓ Include working code examples
✓ Add badges for CI, coverage, version
✓ Update when features change
```

### 2. JSDoc Best Practices

```
✓ Document all public functions
✓ Include @example for complex functions
✓ Use @typedef for shared types
✓ Keep descriptions under 2 sentences
✓ Update when function changes
```

### 3. CHANGELOG Best Practices

```
✓ One version per section
✓ Use semantic versioning
✓ Group by Added/Changed/Fixed
✓ Include migration notes
✓ Keep unreleased section updated
```

---

## Examples

### Example 1: Simple Function

```typescript
// Input
function greet(name: string): string {
  return `Hello, ${name}!`;
}

// Output
/**
 * Generate a greeting message.
 * 
 * @param name - Person's name
 * @returns Greeting message
 * 
 * @example
 * greet('World'); // Returns: "Hello, World!"
 */
function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

### Example 2: API Endpoint

```typescript
// Input
app.post('/users', async (req, res) => {
  const user = await db.users.create(req.body);
  res.json(user);
});

// Output: OpenAPI spec
paths:
  /users:
    post:
      summary: Create user
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUser'
      responses:
        '201':
          description: User created
```

---

## Related Skills

| Skill | Use Case |
|-------|----------|
| `/documentation` | Read/understand existing docs |
| `/autor` | Detect project structure |
| `/api-design` | Design API first |

---

*Document once, understand forever!*
