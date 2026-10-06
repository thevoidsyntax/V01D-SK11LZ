---
name: audit
description: "Deep full codebase audit with multi-pass parallel review and adversarial verification. Uses inline agent execution (NOT background) with real-time progress display in chat. Use when user says 'audit', 'full review', 'deep scan', or wants comprehensive code analysis without PR/diff context."
---

# /audit — Deep Full Codebase Audit (Enhanced)

Comprehensive two-pass audit with parallel agents, cross-reference verification, and adversarial checks. **All execution is INLINE with real-time progress in chat.**

## Execution Model

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           /audit  (INLINE MODE)                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ALL phases execute INLINE in chat with REAL-TIME progress updates       │
│  NO background execution unless explicitly requested                      │
│                                                                          │
│  Progress display:                                                       │
│  [■] Phase 1: Scout → [░░░░░░░░░] 0%                                  │
│  [■] Phase 2: Surface Scan → [░░░░░░░░░] 0%                           │
│  ...                                                                     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Complete Workflow (7 Phases)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           /audit  WORKFLOW                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ╔═══════════════════════════════════════════════════════════════════╗  │
│  ║  PHASE 1: SCOUT (Discover) — 1 AGENT                              ║  │
│  ╚═══════════════════════════════════════════════════════════════════╝  │
│                                                                          │
│  TASK: Discover all files, languages, structure                          │
│  OUTPUT: { totalFiles, totalLines, fileList, languages, keyFiles }      │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ╔═══════════════════════════════════════════════════════════════════╗  │
│  ║  PHASE 2: SURFACE SCAN (Pass 1) — 6 AGENTS PARALLEL             ║  │
│  ╚═══════════════════════════════════════════════════════════════════╝  │
│                                                                          │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐                │
│  │scan:files     │ │scan:imports  │ │scan:syntax   │                │
│  │               │ │              │ │              │                │
│  │• Orphaned     │ │• Broken      │ │• Unclosed () │                │
│  │• Deep nesting │ │• Circular    │ │• Syntax err  │                │
│  │• Large files  │ │• Dead import │ │• Type errors │                │
│  └───────────────┘ └───────────────┘ └───────────────┘                │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐                │
│  │scan:smells    │ │scan:duplicates│ │scan:refs    │                │
│  │              │ │              │ │              │                │
│  │• Magic nums  │ │• Duplicate   │ │• Broken link │                │
│  │• Long func   │ │• Copy-paste │ │• Missing .env │                │
│  │• Empty catch │ │• >80% sim   │ │• Orphaned test│                │
│  └───────────────┘ └───────────────┘ └───────────────┘                │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ╔═══════════════════════════════════════════════════════════════════╗  │
│  ║  PHASE 3: DEEP ANALYSIS (Pass 2) — 6 AGENTS PARALLEL            ║  │
│  ╚═══════════════════════════════════════════════════════════════════╝  │
│                                                                          │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐                │
│  │deep:security │ │deep:correct  │ │deep:perf     │                │
│  │              │ │              │ │              │                │
│  │🔴 SQL Inj    │ │• Null/undef  │ │• N+1 query  │                │
│  │🔴 XSS        │ │• Div by 0    │ │• O(N²) loop │                │
│  │🔴 Hardcoded  │ │• Off-by-one  │ │• Memory leak │                │
│  │🔴 Cmd Inj    │ │• Logic inv   │ │• Ineff regex│                │
│  │⚠️ SSRF       │ │• Missing     │ │• Unindexed Q│                │
│  │              │ │  try-catch   │ │              │                │
│  └───────────────┘ └───────────────┘ └───────────────┘                │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐                │
│  │deep:arch     │ │deep:concur   │ │deep:testing  │                │
│  │              │ │              │ │              │                │
│  │• SOLID viol  │ │• Race cond   │ │• No edge    │                │
│  │• God classes │ │• Deadlock    │ │• Happy path  │                │
│  │• Shotgun     │ │• Unbounded Q │ │• No integ    │                │
│  │• Feature env │ │• Global mut  │ │• Flaky tests │                │
│  └───────────────┘ └───────────────┘ └───────────────┘                │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ╔═══════════════════════════════════════════════════════════════════╗  │
│  ║  PHASE 3.5: CROSS-REFERENCE CHECK — 1 AGENT SEQUENTIAL         ║  │
│  ╚═══════════════════════════════════════════════════════════════════╝  │
│                                                                          │
│  CRITICAL CROSS-FILE ISSUES that parallel might miss:                   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  • All imports → do target files exist?                          │  │
│  │  • All requires → do modules exist?                              │  │
│  │  • Config refs → do config files exist?                          │  │
│  │  • API endpoints → are routes defined?                          │  │
│  │  • Type imports → are types exported?                           │  │
│  │  • Package deps → are packages in package.json?                 │  │
│  │  • Circular dependency chains                                    │  │
│  │  • Orphan files (not imported anywhere)                          │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ╔═══════════════════════════════════════════════════════════════════╗  │
│  ║  PHASE 4: CORRELATE & DEDUPLICATE — 1 AGENT                    ║  │
│  ╚═══════════════════════════════════════════════════════════════════╝  │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  1. Merge all findings from Phase 2, 3, 3.5                     │  │
│  │  2. Deduplicate by (file + line + title) key                  │  │
│  │  3. Prefer Pass 2 over Pass 1 if duplicate                     │  │
│  │  4. Assign unique ID (format: [#N])                            │  │
│  │  5. Sort by severity: CRITICAL → HIGH → MEDIUM → LOW         │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ╔═══════════════════════════════════════════════════════════════════╗  │
│  ║  PHASE 5: ADVERSARIAL VERIFICATION — Variable agents            ║  │
│  ╚═══════════════════════════════════════════════════════════════════╝  │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  SEVERITY      VERIFICATION DEPTH                               │  │
│  │  ─────────     ─────────────────────                           │  │
│  │  🔴 CRITICAL   3 agents (full adversarial panel)               │  │
│  │  🟠 HIGH       2 agents (dual verification)                    │  │
│  │  🟡 MEDIUM     1 agent (standard check)                          │  │
│  │  🟢 LOW        1 agent (quick validation)                       │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  For CRITICAL (3-way):                                                 │
│  ├── Agent A: "Is this actually a bug? Try to refute."               │
│  ├── Agent B: "What's the blast radius if this breaks?"             │
│  └── Agent C: "Is the fix suggestion correct and complete?"          │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ╔═══════════════════════════════════════════════════════════════════╗  │
│  ║  PHASE 6: SYNTHESIZE REPORT                                      ║  │
│  ╚═══════════════════════════════════════════════════════════════════╝  │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  GROUP BY SEVERITY                                               │  │
│  │  ├── 🔴 CRITICAL: [finding #1, #2, ...]                        │  │
│  │  ├── 🟠 HIGH: [finding #3, #4, ...]                            │  │
│  │  ├── 🟡 MEDIUM: [finding #5, #6, ...]                          │  │
│  │  └── 🟢 LOW: [finding #7, #8, ...]                             │  │
│  │                                                                   │  │
│  │  GROUP BY CATEGORY                                               │  │
│  │  ├── Security: [f1, f2, ...]                                   │  │
│  │  ├── Correctness: [f1, f2, ...]                                │  │
│  │  ├── Performance: [f1, f2, ...]                                │  │
│  │  ├── Architecture: [f1, f2, ...]                               │  │
│  │  ├── Testing: [f1, f2, ...]                                     │  │
│  │  └── Style: [f1, f2, ...]                                       │  │
│  │                                                                   │  │
│  │  PATTERN GROUPS (issues in multiple files)                       │  │
│  │  └── "Console.log in X files" → list all files                  │  │
│  │                                                                   │  │
│  │  STATISTICS                                                       │  │
│  │  ├── Total files scanned                                         │  │
│  │  ├── Total findings                                              │  │
│  │  ├── Average confidence score                                   │  │
│  │  └── Estimated fix time                                          │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ╔═══════════════════════════════════════════════════════════════════╗  │
│  ║  PHASE 7: USER DECISION GATE                                     ║  │
│  ╚═══════════════════════════════════════════════════════════════════╝  │
│                                                                          │
│  Display FULL report, then wait for user decision:                       │
│                                                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐      │
│  │    FIX ALL      │  │   FIX HIGH+     │  │   FIX SOME      │      │
│  │  (Apply all)    │  │  (Crit + High)  │  │  (User picks)   │      │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘      │
│  ┌─────────────────┐  ┌─────────────────┐                          │
│  │FIX BY CATEGORY  │  │   IGNORE ALL    │                          │
│  │ (Select cat)     │  │   (Exit only)   │                          │
│  └─────────────────┘  └─────────────────┘                          │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Output Format

### Summary Header

```
╔════════════════════════════════════════════════════════════════════════╗
║                        AUDIT REPORT                                 ║
║                    Project: [name]                                  ║
║                    Date: [ISO-8601]                               ║
║                    Duration: [Xm Ys]                               ║
╠════════════════════════════════════════════════════════════════════════╣
║  COVERAGE                                                      ║
║  ├─ Files scanned:         [N]                                   ║
║  ├─ Lines analyzed:       [N]                                   ║
║  ├─ Languages:            [list]                                 ║
║  └─ Agents deployed:      [N] (across 7 phases)                ║
╠════════════════════════════════════════════════════════════════════════╣
║  SUMMARY                                                      ║
║  ├─ Total findings:         [N]                                   ║
║  │   ├─ 🔴 CRITICAL:       [N]                                  ║
║  │   ├─ 🟠 HIGH:           [N]                                  ║
║  │   ├─ 🟡 MEDIUM:         [N]                                  ║
║  │   └─ 🟢 LOW:            [N]                                  ║
║  ├─ Avg confidence:        [N]%                                  ║
║  └─ Est. fix time:         [X hours]                             ║
╚════════════════════════════════════════════════════════════════════════╝
```

### Finding Detail

```
╔════════════════════════════════════════════════════════════════════════╗
║  [#1] [Title]                                              🔴 CRITICAL ║
╠════════════════════════════════════════════════════════════════════════╣
║  File: [path:line]                                                    ║
║  Category: [Security|Correctness|Performance|...]                     ║
║  Pass: [1|2|3.5] | Verified: [YES, 3/3] | Confidence: [N]%           ║
║                                                                          ║
║  Code:                                                                 ║
║  ```                                                                   ║
║  [problematic code]                                                    ║
║  ```                                                                   ║
║                                                                          ║
║  Issue: [description]                                                  ║
║  Impact: [blast radius]                                                ║
║  Fix: [suggested fix]                                                   ║
╚════════════════════════════════════════════════════════════════════════╝
```

## Performance Targets

| Phase | Agents | Target Time |
|-------|--------|-------------|
| 1. Scout | 1 | 5-10s |
| 2. Surface Scan | 6 parallel | 10-15s |
| 3. Deep Analysis | 6 parallel | 20-30s |
| 3.5 Cross-Reference | 1 | 10-15s |
| 4. Correlate | 1 | 5s |
| 5. Verify All | Variable | 30-120s |
| 6. Synthesize | 1 | 5-10s |
| **TOTAL** | ~15-20 agents | **3-5 minutes** |

---

**Invoke:** `/audit` | **Priority:** CRITICAL (Core)

**Aliases:** `/full-audit`, `/deep-scan`, `/comprehensive-review`, `/audit-all`

## Core Behavior

```
┌─────────────────────────────────────────────────────────────────┐
│                         /audit                                   │
│                   Deep Full Codebase Audit                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Target: [User's Project Directory]                             │
│   Scope:  ALL FILES — no exclusion unless specified              │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  PASS 1: Surface Scan (Breadth-First)                    │   │
│   │  • File existence & structure                            │   │
│   │  • Import/require validity                               │   │
│   │  • Basic syntax errors                                   │   │
│   │  • Obvious code smells                                   │   │
│   │  • Duplicate patterns (exact matches)                    │   │
│   │  • Missing files/references                              │   │
│   └─────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  PASS 2: Deep Analysis (Depth-First)                     │   │
│   │  • Logic bugs & edge cases                               │   │
│   │  • Security vulnerabilities                              │   │
│   │  • Performance anti-patterns (O(N²), memory leaks)      │   │
│   │  • Architectural smells (coupling, cohesion)            │   │
│   │  • SOLID violations                                      │   │
│   │  • Race conditions & concurrency issues                  │   │
│   │  • Error handling gaps                                   │   │
│   │  • Test coverage gaps                                    │   │
│   └─────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  CORRELATION & MERGE                                     │   │
│   │  • Deduplicate cross-pass findings                       │   │
│   │  • Severity scoring (CRITICAL/HIGH/MEDIUM/LOW)          │   │
│   │  • Group by category & file                              │   │
│   │  • Impact analysis                                       │   │
│   └─────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│                   ┌───────────────────┐                          │
│                   │  FULL REPORT      │                          │
│                   │  (No Threshold)   │                          │
│                   └───────────────────┘                          │
│                           │                                      │
│                           ▼                                      │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  USER DECISION GATE                                       │   │
│   │                                                           │   │
│   │  [ Fix All ]  [ Fix Critical ]  [ Fix High+ ]            │   │
│   │  [ Fix Some ]              [ Fix by Category ]           │   │
│   │  [ Ignore All ]            [ Export Report ]             │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Pass 1: Surface Scan

### 1.1 File Structure Analysis

```bash
# Discover all files
find . -type f \( -name "*.ts" -o -name "*.js" -o -name "*.tsx" -o -name "*.jsx" -o -name "*.py" -o -name "*.cs" -o -name "*.java" -o -name "*.go" -o -name "*.rs" \) 2>/dev/null

# Get file tree with line counts
wc -l **/*.{ts,js,tsx,jsx,py,cs,java,go,rs}
```

### 1.2 Import/Require Validation

- Check all imports resolve to existing files
- Detect circular dependencies
- Find dead imports (imported but never used)
- Validate module path syntax

### 1.3 Basic Syntax Check

| Language | Command | Check |
|----------|---------|-------|
| TypeScript/JavaScript | `npx tsc --noEmit` | Type errors, syntax |
| Python | `python -m py_compile` | Syntax errors |
| C# | `dotnet build` | Compilation |
| Go | `go vet` | Errors + suspicious constructs |
| Rust | `cargo check` | Compilation |

### 1.4 Obvious Code Smells (Static)

- Magic numbers without constants
- TODO/FIXME/HACK comments that are old
- Console.log/debugger statements in code
- Empty catch blocks
- commented-out code blocks
- Overly long functions (>100 lines)
- Deep nesting (>4 levels)
- Duplicate function names in same scope

### 1.5 Duplicate Detection

```bash
# Find exact duplicate files
find . -type f -exec md5sum {} \; | sort | uniq -d -w32

# Find similar code blocks (simplified)
# Flag files with >80% line similarity
```

### 1.6 Missing References

- Broken internal links (in docs/markdown)
- Missing environment variable definitions
- Unmatched closing tags/brackets
- Orphaned test files (no corresponding source)

## Pass 2: Deep Analysis

### 2.1 Logic Bugs

- Division by zero without guard
- Off-by-one errors in loops
- Incorrect boundary conditions
- Null/undefined access without checks
- Promise without error handling
- Async/await without try-catch
- Logic inversion errors
- Comparison operator mistakes (= vs == vs ===)

### 2.2 Security Vulnerabilities

**Critical Checks:**

| Vulnerability | Pattern | Severity |
|--------------|---------|----------|
| SQL Injection | String concatenation in query | CRITICAL |
| Command Injection | `eval()`, `exec()`, `shell()` with user input | CRITICAL |
| Path Traversal | Unsanitized file paths with `..` | CRITICAL |
| Hardcoded Secrets | API keys, passwords, tokens in code | CRITICAL |
| XSS | `innerHTML`, `dangerouslySetInnerHTML` | HIGH |
| SSRF | Fetch with user-controlled URL | HIGH |
| IDOR | Direct object reference without auth check | HIGH |
| XXE | XML parsing with external entities | HIGH |
| Insecure Deserialization | `pickle`, `yaml.load` without safe loader | HIGH |
| Weak Cryptography | MD5, SHA1 for passwords, weak RNG | HIGH |

**Supply Chain:**

- Dependencies with known CVEs
- Outdated major versions
- Typosquatting candidates

### 2.3 Performance Anti-Patterns

| Pattern | Detection | Impact |
|---------|----------|--------|
| N+1 Query | Loop with DB call inside | HIGH |
| O(N²) Loop | Nested loops over same collection | HIGH |
| Memory Leak | Unclosed streams, event listeners | HIGH |
| Large Object | Creating huge arrays/objects in loop | MEDIUM |
| Sync in Async | Blocking calls in async functions | MEDIUM |
| Inefficient Regex | Catastrophic backtracking | HIGH |
| Unindexed Query | WHERE on non-indexed column | MEDIUM |

### 2.4 Architectural Smells

**SOLID Violations:**

| Principle | Violation | Detection |
|-----------|-----------|-----------|
| SRP | God class/object with many responsibilities | >20 methods or >5 different concerns |
| OCP | Frequent modifications to existing classes | Modification pattern in git history |
| LSP | Subtype incompatible with parent | Type guard bypassing polymorphism |
| ISP | Fat interface | Interface with >10 methods |
| DIP | High-level depends on low-level | Direct instantiation of concrete classes |

**Other Smells:**

- Shotgun Surgery: One change requires edits in many files
- Divergent Change: One module edited for unrelated reasons
- Feature Envy: Method reaches into another object's data more than its own
- Message Chains: Long `a.b().c().d()` navigation
- Data Clumps: Same 3+ params always travel together
- Primitive Obsession: Primitives standing in for domain concepts

### 2.5 Concurrency Issues

- Race conditions in shared state
- Deadlocks (nested locks, lock ordering)
- Unprotected global state mutations
- Callback hell / Promise chains without proper handling
- Resource exhaustion from unbounded queues/streams

### 2.6 Error Handling Gaps

- Empty catch blocks
- Swallowed exceptions (catch without action)
- Generic catch (catch(Exception) or catch(e))
- Missing error propagation
- Error objects without context
- Unhandled promise rejections
- Missing error boundaries in UI frameworks

### 2.7 Test Coverage Analysis

**Coverage Gaps:**

- Critical paths without tests
- Edge cases without tests
- Happy path only testing
- Mock overuse (testing implementation, not behavior)
- No integration tests

**Test Quality:**

- Flaky tests (timeouts, random data)
- Slow tests blocking CI
- Tests that don't actually assert
- Test isolation issues

## Correlation & Merge

### Deduplication Rules

```
IF Pass1 and Pass2 find same issue:
  → Keep the DEEPER finding (Pass2 has more context)
  → Merge metadata (Pass1 caught it earlier, Pass2 explains WHY)

IF multiple files have same pattern:
  → Create single "Pattern X found in N files" finding
  → List all affected files
```

### Severity Scoring

| Severity | Criteria |
|----------|----------|
| **CRITICAL** | Security vulnerability, data loss risk, complete breakage |
| **HIGH** | Logic bug, performance issue, maintainability barrier |
| **MEDIUM** | Code smell, minor issue, could cause problems later |
| **LOW** | Style preference, minor duplication, cosmetic |

### Impact Analysis

For each finding, assess:
- **Scope**: How many files/lines affected
- **Likelihood**: Probability of causing actual problem
- ** blast_radius**: What breaks if this breaks

## Output Format

### Summary Header

```
╔════════════════════════════════════════════════════════════════════╗
║                        AUDIT REPORT                                 ║
║                    Project: [project-name]                          ║
║                    Date: [ISO-8601 timestamp]                      ║
║                    Duration: [Xm Ys]                               ║
╠════════════════════════════════════════════════════════════════════╣
║  COVERAGE                                                           ║
║  ├─ Files scanned:         [N]                                      ║
║  ├─ Lines analyzed:        [N]                                      ║
║  ├─ Languages:             [list]                                   ║
║  └─ Pass 1 findings:       [N] → Pass 2 findings: [N]              ║
╠════════════════════════════════════════════════════════════════════╣
║  SUMMARY                                                            ║
║  ├─ Total findings:         [N]                                      ║
║  │   ├─ 🔴 CRITICAL:       [N]                                      ║
║  │   ├─ 🟠 HIGH:           [N]                                      ║
║  │   ├─ 🟡 MEDIUM:         [N]                                      ║
║  │   └─ 🟢 LOW:            [N]                                      ║
║  ├─ Unique issues:         [N]                                      ║
║  ├─ Pattern issues:        [N] (found in multiple files)           ║
║  └─ Duplicate findings:    [N] (merged)                             ║
╠════════════════════════════════════════════════════════════════════╣
║  CATEGORY BREAKDOWN                                                 ║
║  ├─ Security:              [N] 🔴 [N] 🟠 [N] 🟡 [N] 🟢              ║
║  ├─ Correctness:           [N] 🔴 [N] 🟠 [N] 🟡 [N] 🟢              ║
║  ├─ Performance:           [N] 🔴 [N] 🟠 [N] 🟡 [N] 🟢              ║
║  ├─ Architecture:          [N] 🔴 [N] 🟠 [N] 🟡 [N] 🟢              ║
║  ├─ Testing:               [N] 🔴 [N] 🟠 [N] 🟡 [N] 🟢              ║
║  └─ Style:                 [N] 🔴 [N] 🟠 [N] 🟡 [N] 🟢              ║
╚════════════════════════════════════════════════════════════════════╝
```

### Findings Detail (All findings, no threshold)

```
╔════════════════════════════════════════════════════════════════════╗
║  🔴 CRITICAL FINDINGS (3)                                           ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                     ║
║  [1] SQL Injection Vulnerability                                     ║
║      File: src/database/queries.ts:47                                ║
║      Severity: 🔴 CRITICAL                                           ║
║      Category: Security                                              ║
║      Pass: 2 (Deep Analysis)                                        ║
║                                                                     ║
║      Code:                                                           ║
║      ```typescript                                                   ║
║      const query = `SELECT * FROM users WHERE id = ${userId}`;      ║
║      ```                                                            ║
║                                                                     ║
║      Issue: User input directly interpolated into SQL query.         ║
║      Impact: Attacker can execute arbitrary SQL commands.            ║
║      Fix: Use parameterized queries.                                  ║
║                                                                     ║
║  ─────────────────────────────────────────────────────────────────   ║
║                                                                     ║
║  [2] Hardcoded API Key                                               ║
║      File: src/config/api.ts:12                                      ║
║      Severity: 🔴 CRITICAL                                           ║
║      Category: Security                                              ║
║      Pass: 1 (Surface Scan)                                          ║
║                                                                     ║
║      Code:                                                           ║
║      ```typescript                                                   ║
║      const API_KEY = "sk-abc123xyz789...";                          ║
║      ```                                                            ║
║                                                                     ║
║      Issue: Secret embedded in source code.                         ║
║      Fix: Use environment variable.                                   ║
║                                                                     ║
║  ─────────────────────────────────────────────────────────────────   ║
║                                                                     ║
║  [3] Unhandled Promise Rejection                                     ║
║      File: src/services/auth.ts:89                                   ║
║      Severity: 🔴 CRITICAL                                           ║
║      Category: Correctness                                           ║
║      Pass: 2 (Deep Analysis)                                         ║
║                                                                     ║
║      Code:                                                           ║
║      ```typescript                                                   ║
║      fetchUserData().then(data => process(data));                   ║
║      ```                                                            ║
║                                                                     ║
║      Issue: Promise rejection not handled — crash on network error.  ║
║      Fix: Add .catch() or use try/await with error handling.        ║
║                                                                     ║
╚════════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════════╗
║  🟠 HIGH PRIORITY (8)                                               ║
╠════════════════════════════════════════════════════════════════════╣
║  [4] N+1 Query in Loop                                              ║
║      Files: src/api/orders.ts:34, src/api/orders.ts:45              ║
║      (found in 2 files with same pattern)                           ║
║      → See Pattern #P2 for full file list                           ║
║                                                                     ║
║  [5] Race Condition on Shared State                                 ║
║      File: src/cache/manager.ts:78                                   ║
║      ...                                                            ║
╚════════════════════════════════════════════════════════════════════╝

[ ... continues for all MEDIUM and LOW findings ... ]
```

### Pattern Groupings

```
╔════════════════════════════════════════════════════════════════════╗
║  🔄 PATTERN ISSUES (Issues found in multiple files)                  ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                     ║
║  #P1: Console.log in Production Code                                ║
║       Found in 12 files:                                            ║
║       • src/utils/logger.ts:5                                       ║
║       • src/api/users.ts:23                                        ║
║       • src/services/payment.ts:67                                  ║
║       • ... (9 more)                                                ║
║       Recommendation: Replace with structured logger               ║
║                                                                     ║
║  ─────────────────────────────────────────────────────────────────   ║
║                                                                     ║
║  #P2: N+1 Query Pattern                                             ║
║       Found in 2 files:                                             ║
║       • src/api/orders.ts:34                                        ║
║       • src/api/products.ts:56                                      ║
║       Recommendation: Use JOIN or batch query                       ║
║                                                                     ║
╚════════════════════════════════════════════════════════════════════╝
```

## User Decision Gate

After presenting the full report:

```
╔════════════════════════════════════════════════════════════════════╗
║  READY TO FIX?                                                      ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                     ║
║  Estimated fixes:                                                   ║
║  • Fix All (34 changes): ~2 hours                                   ║
║  • Fix Critical (3 changes): ~15 minutes                           ║
║  • Fix High+ (11 changes): ~45 minutes                             ║
║  • Fix by Category: [Select category]                              ║
║  • Fix Some: [Pick from list]                                       ║
║                                                                     ║
║  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            ║
║  │   FIX ALL    │  │   FIX HIGH+  │  │  FIX SOME    │            ║
║  └──────────────┘  └──────────────┘  └──────────────┘            ║
║  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            ║
║  │FIX BY CATEGORY│  │ IGNORE ALL   │  │ EXPORT REPORT │            ║
║  └──────────────┘  └──────────────┘  └──────────────┘            ║
║                                                                     ║
╚════════════════════════════════════════════════════════════════════╝
```

### Fix Options

| Option | Behavior |
|--------|----------|
| **Fix All** | Apply ALL fixes automatically |
| **Fix Critical** | Only fix CRITICAL severity |
| **Fix High+** | Fix CRITICAL + HIGH |
| **Fix by Category** | Show category picker, fix selected categories |
| **Fix Some** | Show numbered list, user picks which to fix |
| **Ignore All** | Exit, save report to `audit-report-[timestamp].md` |
| **Export Report** | Save full report without fixing |

### Fix Confirmation

```
╔════════════════════════════════════════════════════════════════════╗
║  CONFIRM FIX                                                        ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                     ║
║  Will apply [N] fixes to [M] files:                                ║
║                                                                     ║
║  Files affected:                                                    ║
║  • src/database/queries.ts (1 fix)                                  ║
║  • src/config/api.ts (1 fix)                                        ║
║  • src/services/auth.ts (1 fix)                                    ║
║  • ...                                                              ║
║                                                                     ║
║  ⚠️  This will modify [M] files.                                    ║
║  ⚠️  Recommended: Commit current state first.                        ║
║                                                                     ║
║  ┌──────────────┐                                                  ║
║  │  PROCEED?    │                                                  ║
║  └──────────────┘                                                  ║
║  ┌──────────────┐                                                  ║
║  │    CANCEL    │                                                  ║
║  └──────────────┘                                                  ║
║                                                                     ║
╚════════════════════════════════════════════════════════════════════╝
```

### Post-Fix Summary

```
╔════════════════════════════════════════════════════════════════════╗
║  FIXES APPLIED                                                      ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                     ║
║  ✅ Applied: [N] fixes                                              ║
║  ✅ Files modified: [M]                                            ║
║  ✅ Estimated time saved: [X hours/year]                            ║
║                                                                     ║
║  ⚠️  Not fixed: [K] (requires manual review)                        ║
║                                                                     ║
║  Next steps:                                                        ║
║  1. Review changes: git diff                                       ║
║  2. Run tests: npm test                                            ║
║  3. Commit: /commit                                                 ║
║  4. Re-audit: /audit (to verify fixes)                             ║
║                                                                     ║
╚════════════════════════════════════════════════════════════════════╝
```

## Implementation Notes

### Performance Considerations

- **Pass 1** should be FAST (< 1 minute for typical project)
- **Pass 2** can be slower but should parallelize where possible
- Use worker threads for CPU-intensive analysis
- Batch file reads to reduce I/O

### Context Management

- Pass 1 findings can be discarded after merge (Pass 2 has superset)
- Keep only deduplicated, merged findings for report
- Store detailed evidence for each finding (for fix application)

### False Positive Handling

- Flag potential false positives with `[?]` marker
- Include confidence score (0-100%)
- Allow user to mark as "ignore" during Fix Some selection

### Language-Agnostic Core

The skill should work across languages but use language-specific tools when available:
- TypeScript/JavaScript: ESLint + TypeScript
- Python: Ruff, Bandit, Pyright
- Rust: Clippy, Cargo
- Go: go vet, golangci-lint

---

**Invoke:** `/audit` | **Priority:** CRITICAL (Core)

**Aliases:** `/full-audit`, `/deep-scan`, `/comprehensive-review`
