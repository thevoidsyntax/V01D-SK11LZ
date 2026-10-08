# Re-review Routing

This document defines routing rules for re-review after fixes are applied.

## Re-review Triggers

1. **Fix Applied**: Original finding addressed
2. **Scope Changed**: PR scope changed after review
3. **New Changes**: Additional commits pushed
4. **Verification Requested**: Author requests re-review

## Routing Rules

### Fix Applied

Route to: Original reviewer
Priority: High
Timeline: Within 24 hours

### Scope Changed

Route to: Original reviewer + architect
Priority: High
Timeline: Immediate

### New Changes

Route to: Original reviewer
Priority: Medium
Timeline: After CI passes

## TODO: Expand with detailed workflow
