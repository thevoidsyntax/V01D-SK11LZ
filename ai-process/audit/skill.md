---
name: audit
description: Deep full codebase audit with multi-pass parallel review, adversarial verification, and API testing
version: "1.0.0"
category: [process]
priority: high
phase: any
tech_stack:
  languages: [all]
scale: [all]
auto_invoke:
  enabled: false
  conditions:
    - command: "/audit"
      reason: "Audit invocation"
  skill_tier: core
capabilities: [analysis, review]
quality:
  rules_count: 20
  examples_count: 5
  stability: stable
integrates_with: [auto-route, pr-review]
source:
  origin: local
author: Claude
---

# /audit — Deep Full Codebase Audit + API Testing

Comprehensive two-pass audit with parallel agents, cross-reference verification, adversarial checks, AND API testing. **All execution is INLINE with real-time progress in chat.**

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
│  [■] Phase 3: API Testing → [░░░░░░░░░] 0%                            │
│  ...                                                                     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Complete Workflow (8 Phases)

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
│  ║  PHASE 4: API TESTING — 1 AGENT (NEW!)                          ║  │
│  ╚═══════════════════════════════════════════════════════════════════╝  │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  PRE-REQUISITE: Check if server is running                       │  │
│  │  • curl http://localhost:3000/health                             │  │
│  │  • If down: Start server with `npm run dev`                     │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  TEST SEQUENCES (execute in order):                               │  │
│  │                                                                   │  │
│  │  1. HEALTH CHECKS                                                │  │
│  │     GET /health → expect 200 OK                                   │  │
│  │     GET /ready → expect 200 OK                                   │  │
│  │                                                                   │  │
│  │  2. AUTHENTICATION                                                │  │
│  │     POST /auth/login → get access token                          │  │
│  │     POST /auth/refresh → test refresh                            │  │
│  │     POST /auth/register → test registration                       │  │
│  │                                                                   │  │
│  │  3. CRUD OPERATIONS (with auth token)                           │  │
│  │     GET /products → list products                                │  │
│  │     POST /products → create product                              │  │
│  │     PUT /products/:id → update product                          │  │
│  │     DELETE /products/:id → delete product                       │  │
│  │     (repeat for: users, categories, tables, modifiers)            │  │
│  │                                                                   │  │
│  │  4. CORE BUSINESS LOGIC                                          │  │
│  │     POST /orders → create order                                 │  │
│  │     POST /orders/:id/checkout → process payment                 │  │
│  │     PUT /orders/:id/status → update status                       │  │
│  │     POST /orders/:id/void → void order                         │  │
│  │                                                                   │  │
│  │  5. INVENTORY MANAGEMENT                                        │  │
│  │     GET /stock/overview → stock overview                         │  │
│  │     GET /stock/alerts → low stock alerts                        │  │
│  │     POST /stock/adjust → manual adjustment                       │  │
│  │     POST /stock/receive → restock                              │  │
│  │     GET /stock/history → stock history                          │  │
│  │                                                                   │  │
│  │  6. REPORTING                                                    │  │
│  │     GET /reports/sales → sales summary                          │  │
│  │     GET /reports/products → product performance                  │  │
│  │     GET /reports/staff → staff performance                      │  │
│  │     GET /reports/categories → category breakdown                 │  │
│  │     GET /reports/export → CSV export                           │  │
│  │                                                                   │  │
│  │  7. ERROR HANDLING                                               │  │
│  │     GET /protected-endpoint (no auth) → 401                     │  │
│  │     POST /auth/login (wrong creds) → 401                        │  │
│  │     POST /products (invalid data) → 400                         │  │
│  │     GET /products/non-existent-id → 404                         │  │
│  │                                                                   │  │
│  │  8. RATE LIMITING                                                │  │
│  │     Send 100+ rapid requests → 429 Too Many Requests              │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  TEST RESULTS FORMAT:                                                   │
│  • ✅ Endpoint: METHOD /path — Status 200 + Response time             │
│  • ❌ Endpoint: METHOD /path — Status XXX (Error message)            │
│  • ⏱️  Response time: <100ms (fast), 100-500ms (ok), >500ms (slow) │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ╔═══════════════════════════════════════════════════════════════════╗  │
│  ║  PHASE 5: CORRELATE & DEDUPLICATE — 1 AGENT                    ║  │
│  ╚═══════════════════════════════════════════════════════════════════╝  │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  1. Merge all findings from Phase 2, 3, 3.5, 4                  │  │
│  │  2. Deduplicate by (file + line + title) key                  │  │
│  │  3. Prefer Pass 2 over Pass 1 if duplicate                     │  │
│  │  4. Assign unique ID (format: [#N])                            │  │
│  │  5. Sort by severity: CRITICAL → HIGH → MEDIUM → LOW         │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ╔═══════════════════════════════════════════════════════════════════╗  │
│  ║  PHASE 6: ADVERSARIAL VERIFICATION — Variable agents           ║  │
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
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ╔═══════════════════════════════════════════════════════════════════╗  │
│  ║  PHASE 7: SYNTHESIZE REPORT                                      ║  │
│  ╚═══════════════════════════════════════════════════════════════════╝  │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ╔═══════════════════════════════════════════════════════════════════╗  │
│  ║  PHASE 8: USER DECISION GATE                                     ║  │
│  ╚═══════════════════════════════════════════════════════════════════╝  │
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
║  └─ API Endpoints tested:  [N]                                   ║
╠════════════════════════════════════════════════════════════════════════╣
║  SUMMARY                                                      ║
║  ├─ Code findings:         [N]                                   ║
║  │   ├─ 🔴 CRITICAL:       [N]                                  ║
║  │   ├─ 🟠 HIGH:           [N]                                  ║
║  │   ├─ 🟡 MEDIUM:         [N]                                  ║
║  │   └─ 🟢 LOW:            [N]                                  ║
║  ├─ API Tests:             [N]                                   ║
║  │   ├─ ✅ Passed:         [N]                                  ║
║  │   └─ ❌ Failed:         [N]                                  ║
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
║  Pass: [1|2|3.5|4] | Verified: [YES, 3/3] | Confidence: [N]%      ║
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

### API Test Results

```
╔════════════════════════════════════════════════════════════════════════╗
║  API TEST RESULTS                                            ║
╠════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║  Health Checks:                                                        ║
║  ✅ GET /health → 200 OK (12ms)                                       ║
║  ✅ GET /ready → 200 OK (15ms)                                        ║
║                                                                          ║
║  Authentication:                                                       ║
║  ✅ POST /auth/login → 200 OK (45ms)                                   ║
║  ✅ POST /auth/refresh → 200 OK (23ms)                                 ║
║                                                                          ║
║  Products CRUD:                                                        ║
║  ✅ GET /products → 200 OK (28ms)                                      ║
║  ✅ POST /products → 201 Created (52ms)                                 ║
║  ✅ PUT /products/:id → 200 OK (38ms)                                   ║
║  ✅ DELETE /products/:id → 204 No Content (25ms)                        ║
║                                                                          ║
║  Orders:                                                               ║
║  ✅ POST /orders → 201 Created (67ms)                                  ║
║  ✅ POST /orders/:id/checkout → 200 OK (89ms)                           ║
║  ❌ POST /orders/:id/void → 500 Internal Server Error                   ║
║     └─ Issue: Stock restoration logic not implemented                   ║
║                                                                          ║
║  Error Handling:                                                       ║
║  ✅ GET /protected (no auth) → 401 Unauthorized                        ║
║  ✅ POST /auth/login (bad creds) → 401 Invalid credentials              ║
║  ✅ POST /products (invalid) → 400 Validation Error                     ║
║                                                                          ║
║  SUMMARY: 23/24 tests passed (96%)                                    ║
║  ⚠️  1 FAILED: POST /orders/:id/void                                 ║
║                                                                          ║
╚════════════════════════════════════════════════════════════════════════╝
```

## Performance Targets

| Phase | Agents | Target Time |
|-------|--------|-------------|
| 1. Scout | 1 | 5-10s |
| 2. Surface Scan | 6 parallel | 10-15s |
| 3. Deep Analysis | 6 parallel | 20-30s |
| 3.5 Cross-Reference | 1 | 10-15s |
| 4. API Testing | 1 | 30-60s |
| 5. Correlate | 1 | 5s |
| 6. Verify All | Variable | 30-120s |
| 7. Synthesize | 1 | 5-10s |
| **TOTAL** | ~15-20 agents | **5-8 minutes** |

---

**Invoke:** `/audit` | **Priority:** CRITICAL (Core)

**Aliases:** `/full-audit`, `/deep-scan`, `/comprehensive-review`, `/audit-all`

## Core Behavior

```
┌─────────────────────────────────────────────────────────────────┐
│                         /audit                                   │
│              Full Codebase Audit + API Testing                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Target: [User's Project Directory]                             │
│   Scope:  ALL FILES + ALL API ENDPOINTS                          │
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
│   │  PASS 3: API Testing (LIVE)                             │   │
│   │  • Check if server is running (curl /health)            │   │
│   │  • If not running: "Start server with `npm run dev`"   │   │
│   │  • Test ALL endpoints in sequence                        │   │
│   │  • Auth flow → CRUD → Business Logic → Reports          │   │
│   │  • Error handling & rate limiting                       │   │
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

## API Testing Protocol

### Pre-Requisite Check

```
1. Check if server is running:
   curl -s http://localhost:3000/health

2. If response is NOT {"status":"ok"}:
   → Tell user: "Server not running. Start with: npm run dev"
   → Wait for user to start server
   → Re-check health endpoint
   → Only then proceed with API tests
```

### Test Sequences

#### 1. Health Endpoints (No Auth Required)

```bash
# Basic health check
curl -s http://localhost:3000/health
# Expect: {"status":"ok","timestamp":"..."}

# Readiness check (includes DB connection)
curl -s http://localhost:3000/ready
# Expect: {"status":"ready","checks":{"database":true}}
```

#### 2. Authentication Flow

```bash
# Get fresh token
TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@demo.com","password":"owner123"}' \
  | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

# Test protected endpoint with token
curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/v1/products
# Expect: 200 + product list
```

#### 3. CRUD Operations Test Template

```bash
# For each resource: products, users, categories, tables, modifiers

# List (should work)
curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/v1/[resource]
# Expect: 200

# Create (should work)
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","price":100}' \
  http://localhost:3000/api/v1/[resource]
# Expect: 201

# Update (should work)
curl -s -X PUT -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated"}' \
  http://localhost:3000/api/v1/[resource]/:id
# Expect: 200

# Delete (should work)
curl -s -X DELETE -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/v1/[resource]/:id
# Expect: 204
```

#### 4. Error Handling Tests

```bash
# No auth token
curl -s http://localhost:3000/api/v1/products
# Expect: 401 Unauthorized

# Invalid credentials
curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"wrong@email.com","password":"wrongpass"}'
# Expect: 401 Invalid credentials

# Invalid data
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":""}' \
  http://localhost:3000/api/v1/products
# Expect: 400 Validation Error

# Not found
curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/v1/products/00000000-0000-0000-0000-000000000000
# Expect: 404 Not Found
```

### Response Time Thresholds

| Response Time | Rating | Color |
|--------------|--------|-------|
| < 100ms | Fast | 🟢 |
| 100-500ms | Acceptable | 🟡 |
| > 500ms | Slow | 🔴 |

---

## User Decision Gate

After presenting the full report:

```
╔════════════════════════════════════════════════════════════════════════╗
║  READY TO FIX?                                                      ║
╠════════════════════════════════════════════════════════════════════════╣
║                                                                     ║
║  Code Quality:  [N] findings                                        ║
║  API Testing:   [M] tests ([P] passed, [F] failed)               ║
║                                                                     ║
║  Estimated fixes:                                                   ║
║  • Fix All ([N] changes): ~2 hours                                   ║
║  • Fix Critical ([N] changes): ~15 minutes                           ║
║  • Fix High+ ([N] changes): ~45 minutes                             ║
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
╚════════════════════════════════════════════════════════════════════════╝
```

---

**Invoke:** `/audit` | **Priority:** CRITICAL (Core)

**Aliases:** `/full-audit`, `/deep-scan`, `/comprehensive-review`
