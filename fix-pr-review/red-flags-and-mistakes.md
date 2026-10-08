# Red Flags and Mistakes

This document catalogs common red flags and mistakes found in code reviews.

## Code Quality Red Flags

1. **Nested callbacks** - Callback hell indicator
2. **Global state mutation** - Hard to test and debug
3. **Magic numbers** - Should be named constants
4. **Long functions** - Over 50 lines, consider splitting
5. **Duplicate code** - DRY violation

## Security Red Flags

1. **SQL string concatenation** - SQL injection risk
2. **eval() usage** - Code injection risk
3. **Hardcoded credentials** - Security violation
4. **Missing input validation** - Attack vector
5. **Unsanitized user input in HTML** - XSS risk

## Performance Red Flags

1. **N+1 queries** - Database performance killer
2. **Sync I/O in request handler** - Blocks event loop
3. **Memory leaks** - Event listeners not removed
4. **Large object allocations in loops** - GC pressure

## TODO: Expand with more examples
