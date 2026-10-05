# Code Comments Anti-Patterns (18 patterns)

## Tautological Comments
```
// BAD: State what's obvious from code
// Loop through array
for (let i = 0; i < arr.length; i++) { }

// GOOD: Delete or explain WHY
// User might not have entered birth year yet
```

## Section Headers
```
// BAD: Useless organizational comments
// ============ CONSTANTS ============
// ---------------- API ----------------

// GOOD: Section headers only if context is non-obvious
// Config is re-read on every request (see #1234)
```

## Narrating Intent
```
// BAD: Describing what code does line by line
const result = items.filter(x => x.active);
const sorted = result.sort((a, b) => a.name.localeCompare(b.name));

// GOOD: Explain non-obvious business logic
// Show inactive users last, then sort alphabetically
const sorted = items.sort((a, b) => {
  if (a.active !== b.active) return a.active ? 1 : -1;
  return a.name.localeCompare(b.name);
});
```

## Hedge TODOs
```
// BAD: Hedging and justifying
// TODO: Might need to refactor this later if performance becomes an issue

// GOOD: Specific, actionable
// TODO: Cache this result — profile shows 40% of time in this function
```

## "We" Language
```
// BAD: Collective/narrating voice
// We need to validate the input before proceeding

// GOOD: Imperative or third-person
// Validate input: reject null/empty strings
```

## Changelog Comments
```
// BAD: Dated change logs in code
// 2024-01-15: Added validation for email format

// GOOD: Link to issue tracker
// Fixes #1234 — added email format validation
```

## Philosophical Prose
```
// BAD: Explaining fundamental concepts
// Authentication is the process of verifying identity...

// GOOD: Implementation-specific context
// Auth tokens expire after 24h (security requirement)
```

## Question-Answer Comments
```
// BAD: Rhetorical questions
// Why are we sorting here? To ensure consistent ordering

// GOOD: State the reason directly
// Sort by priority so critical alerts surface first
```

## Redundant Emphasizers
```
// BAD: Emphasizing with ALL CAPS or multiple exclamation marks
// IMPORTANT: DO NOT DELETE THIS LINE!!!
// ALWAYS make sure to check for null!!!

// GOOD: Calm, specific guidance
// Required: non-null value for downstream parser
```

## Permission Requests
```
// BAD: Writing as if asking permission
// Let's try to parse the JSON and see what happens

// GOOD: Direct statements
// Parse JSON; malformed input throws at this boundary
```

## Meta Comments
```
// BAD: Comments about comments
// The above function does X, but see note below
// (Note: the below actually applies to the above)

// GOOD: Clear, linear structure
```

## Placeholder TODOs
```
// BAD: Generic placeholders
// TODO: Add error handling
// FIXME: Fix this later

// GOOD: Specific with context
// TODO: Add retry with exponential backoff — current impl drops on timeout
// FIXME(#5678): Race condition if two requests arrive simultaneously
```

## Unnecessary Clarifications
```
// BAD: Stating the obvious
// Set the count to zero (initialize)
count = 0;

// GOOD: Only explain non-obvious
count = 0; // Reset on every new session
```

## Aspirational Comments
```
// BAD: What the code should do someday
// Ideally this should handle concurrent requests, but...

// GOOD: What it actually does now
// Single-threaded: concurrent requests queue up
```

## Double-Negative Logic
```
// BAD: Hard to parse
// Don't skip non-disabled items

// GOOD: Positive, clear
// Include only enabled items
```

## Magic Number Explanations
```
// BAD: Generic explanations
const timeout = 30000; // 30 seconds is a good timeout

// GOOD: Specific reasoning
const timeout = 30_000; // matches server-side session expiry
```

## Unreachable Code Comments
```
// BAD: Comments about dead code
// This function is never called, but I'm keeping it for reference

// GOOD: Delete or move to separate file
```

## Defensive Over-Explanation
```
// BAD: Covering every possible interpretation
// This function may or may not return null depending on various factors

// GOOD: Direct, honest
// Returns null if user not found
```
