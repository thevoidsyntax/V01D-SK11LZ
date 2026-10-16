# Auto-Router Test Guide v2.0

Comprehensive test scenarios for the auto-router skill implementation.

---

## 📋 Test Overview

| Test ID | Category | Scenario | Expected |
|---------|----------|----------|----------|
| T-01 | Detection | Empty directory | Auto-invoke project-init |
| T-02 | Detection | Partial project | Offer options |
| T-03 | Detection | Existing project | Full analysis |
| T-04 | Detection | Specific command | Direct routing |
| T-05 | Discovery | Skill metadata | All skills have metadata |
| T-06 | Discovery | Skill scanning | Correct skills selected |
| T-07 | Power | Workflow templates | Proper execution |
| T-08 | Power | Enhanced options | Options applied |
| T-09 | Power | Phase-aware | Correct phase skills |
| T-10 | Integration | End-to-end flow | Complete workflow |

---

## 🧪 Test Scenarios

### T-01: NEW PROJECT (Empty Directory)

**Purpose:** Verify auto-router handles empty directories correctly.

**Setup:**
```bash
mkdir /tmp/test-empty-project
cd /tmp/test-empty-project
```

**Execution:**
```bash
/auto-router
```

**Expected Behavior:**
```
┌─────────────────────────────────────────────────────────┐
│ 🔍 PROJECT DETECTION                                    │
│                                                         │
│ State: EMPTY (No project files detected)               │
│                                                         │
│ Files found:                                            │
│   • package.json: NOT FOUND                            │
│   • requirements.txt: NOT FOUND                        │
│   • go.mod: NOT FOUND                                  │
│   • src/: NOT FOUND                                    │
│                                                         │
│ ✅ Decision: Auto-invoking project-init                │
│                                                         │
│ → Launching project-init...                            │
└─────────────────────────────────────────────────────────┘
```

**Validation:**
- [ ] Detects empty state correctly
- [ ] Auto-invokes project-init
- [ ] Shows initialization options
- [ ] User can select template

---

### T-02: EXISTING PROJECT (With package.json)

**Purpose:** Verify auto-router analyzes existing projects correctly.

**Setup:**
```bash
cd /path/to/VentroPOS
```

**Execution:**
```bash
/auto-router
```

**Expected Behavior:**
```
┌─────────────────────────────────────────────────────────┐
│ 🔍 PROJECT ANALYSIS                                      │
│                                                         │
│ State: EXISTING                                         │
│                                                         │
│ 📊 Tech Stack Detected:                                  │
│   • Backend: Fastify (Node.js)                         │
│   • Database: PostgreSQL (Knex.js)                     │
│   • Auth: JWT (@fastify/jwt)                           │
│   • Validation: Zod                                    │
│   • Testing: Vitest                                     │
│   • Logging: Pino                                       │
│                                                         │
│ 🏗️ Architecture: DDD-Lite                              │
│   Detected: src/api/, src/application/, src/domain/    │
│                                                         │
│ 📈 Scale: MEDIUM                                        │
│   Dependencies: ~45                                     │
│   Pattern: Phase-based development                       │
│                                                         │
│ ✅ Recommended Skills:                                  │
│   1. fullstack-guardian (primary)                     │
│   2. api-designer (API focus detected)                │
│   3. security-reviewer (auth detected)                │
│   4. test-master (testing stack detected)             │
│                                                         │
│ ⚠️ Suggested Improvements:                               │
│   • Add monitoring (no Prometheus/Datadog detected)      │
│   • Add rate limiting middleware                        │
│   • Consider adding health endpoints                   │
│                                                         │
│ 💡 Would you like to:                                   │
│   [1] Run recommended skills                           │
│   [2] See detailed analysis                            │
│   [3] Apply suggested improvements                     │
│   [4] Continue with current phase work                 │
└─────────────────────────────────────────────────────────┘
```

**Validation:**
- [ ] Detects Fastify framework
- [ ] Detects PostgreSQL via Knex.js
- [ ] Detects JWT auth
- [ ] Detects DDD-Lite architecture
- [ ] Recommends correct skills
- [ ] Shows improvement suggestions

---

### T-03: PARTIAL PROJECT (Only .git)

**Purpose:** Verify auto-router handles partial projects correctly.

**Setup:**
```bash
mkdir /tmp/test-partial
cd /tmp/test-partial
git init
```

**Execution:**
```bash
/auto-router
```

**Expected Behavior:**
```
┌─────────────────────────────────────────────────────────┐
│ 🔍 PROJECT DETECTION                                    │
│                                                         │
│ State: PARTIAL (Incomplete project structure)          │
│                                                         │
│ Files found:                                            │
│   • .git/: FOUND (initialized)                        │
│   • package.json: NOT FOUND                            │
│   • source code: NOT FOUND                             │
│                                                         │
│ ⚠️ Decision: Project appears incomplete                │
│                                                         │
│ 💡 Options:                                             │
│   [1] Initialize new project (project-init)            │
│   [2] Analyze current state                           │
│   [3] Cancel                                           │
│                                                         │
│ Select option: _                                        │
└─────────────────────────────────────────────────────────┘
```

**Validation:**
- [ ] Detects partial state
- [ ] Shows git directory
- [ ] Offers initialization option
- [ ] Offers analysis option
- [ ] Waits for user input

---

### T-04: SKILL DISCOVERY

**Purpose:** Verify all skills have proper metadata.

**Execution:**
```bash
/auto-router --scan-skills
```

**Expected Behavior:**
```
┌─────────────────────────────────────────────────────────┐
│ 📦 SKILL REGISTRY SCAN                                  │
│                                                         │
│ Skills Found: 15                                        │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Skill Name        │ Priority │ Phase  │ Metadata  │ │
│ ├───────────────────┼───────────┼────────┼───────────┤ │
│ │ fullstack-guardian│ critical │ any    │ ✅ Valid  │ │
│ │ api-designer      │ important │ any    │ ✅ Valid  │ │
│ │ security-reviewer │ high     │ any    │ ✅ Valid  │ │
│ │ test-master       │ high     │ any    │ ✅ Valid  │ │
│ │ architecture-des. │ critical │ any    │ ✅ Valid  │ │
│ │ devops-engineer   │ important │ deploy │ ✅ Valid  │ │
│ │ monitoring-expert │ medium    │ ops    │ ✅ Valid  │ │
│ │ react-expert      │ important │ ui     │ ✅ Valid  │ │
│ │ typescript-pro    │ high     │ any    │ ✅ Valid  │ │
│ │ code-reviewer     │ medium   │ any    │ ✅ Valid  │ │
│ │ debugging-wizard  │ medium   │ any    │ ✅ Valid  │ │
│ │ microservices-arch.│ high     │ arch   │ ✅ Valid  │ │
│ │ cloud-architect   │ high     │ deploy │ ✅ Valid  │ │
│ │ feature-forge     │ medium   │ plan   │ ✅ Valid  │ │
│ │ domain-modeling   │ medium   │ design │ ✅ Valid  │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Summary:                                                │
│   ✅ All skills have valid metadata                     │
│   ✅ Priority levels defined                           │
│   ✅ Phase compatibility set                           │
└─────────────────────────────────────────────────────────┘
```

**Validation:**
- [ ] Scans all skill files
- [ ] Validates metadata format
- [ ] Reports missing metadata
- [ ] Groups by category

---

### T-05: WORKFLOW TEMPLATES

**Purpose:** Verify workflow templates execute correctly.

**Execution:**
```bash
/auto-router --workflow=fullstack-web
```

**Expected Behavior:**
```
┌─────────────────────────────────────────────────────────┐
│ 🚀 WORKFLOW: FULLSTACK WEB APP                          │
│                                                         │
│ Workflow Steps:                                         │
│   1. [ ] Architecture Design                           │
│   2. [ ] Backend Implementation                        │
│   3. [ ] Frontend Implementation                       │
│   4. [ ] API Development                              │
│   5. [ ] Testing Setup                                │
│   6. [ ] Security Review                              │
│   7. [ ] Deployment Setup                             │
│                                                         │
│ Auto-selected Skills:                                   │
│   → architecture-designer                              │
│   → fullstack-guardian                                 │
│   → react-expert                                       │
│   → api-designer                                       │
│   → test-master                                        │
│   → security-reviewer                                  │
│   → devops-engineer                                    │
│                                                         │
│ Starting workflow...                                    │
└─────────────────────────────────────────────────────────┘
```

**Validation:**
- [ ] Parses workflow template
- [ ] Shows execution steps
- [ ] Auto-selects relevant skills
- [ ] Executes in order (or parallel if independent)

---

### T-06: ENHANCED AGENT OPTIONS

**Purpose:** Verify enhanced options work correctly.

**Test --quick mode:**
```bash
/auto-router --quick
```

**Expected:**
```
┌─────────────────────────────────────────────────────────┐
│ 🔍 QUICK SCAN (--quick)                                 │
│                                                         │
│ State: EXISTING                                         │
│ Stack: Fastify + PostgreSQL + Redis                    │
│ Skills: fullstack-guardian, api-designer               │
│                                                         │
│ Use /auto-router for full analysis                     │
└─────────────────────────────────────────────────────────┘
```

**Test --deep mode:**
```bash
/auto-router --deep
```

**Expected:**
```
┌─────────────────────────────────────────────────────────┐
│ 🔍 DEEP ANALYSIS (--deep)                               │
│                                                         │
│ [████████████████████░░░░] 80% Complete                 │
│                                                         │
│ ✓ Tech stack analysis                                   │
│ ✓ Dependency graph mapping                               │
│ ✓ Architecture pattern detection                        │
│ ✓ Security posture assessment                           │
│ ✓ Performance baseline                                  │
│ ⏳ Code quality analysis (in progress...)              │
│ ⏳ Missing patterns detection                          │
└─────────────────────────────────────────────────────────┘
```

**Validation:**
- [ ] `--quick` produces concise output
- [ ] `--deep` shows progress
- [ ] Options are mutually exclusive
- [ ] Defaults to normal mode

---

### T-07: PHASE-AWARE SELECTION

**Purpose:** Verify phase detection and skill selection.

**Setup:**
```bash
# Create project with CLAUDE.md
cat > CLAUDE.md << 'EOF'
# MyProject

## Current Phase
Phase 3: Feature Development

## Completed Phases
- Phase 1: Foundation ✅
- Phase 2: Core Features ✅
EOF
```

**Execution:**
```bash
/auto-router
```

**Expected Behavior:**
```
┌─────────────────────────────────────────────────────────┐
│ 🔍 PROJECT ANALYSIS (Phase-Aware)                       │
│                                                         │
│ Current Phase: Phase 3 - Feature Development            │
│                                                         │
│ 🎯 Phase-Specific Recommendations:                      │
│   Current focus: Feature work, integrations             │
│   Recommended:                                           │
│     • fullstack-guardian (implement features)           │
│     • code-reviewer (quality check)                    │
│     • debugging-wizard (troubleshooting ready)         │
│                                                         │
│ 📋 Phase History:                                       │
│   ✅ Phase 1: Foundation                               │
│   ✅ Phase 2: Core Features                            │
│   📍 Phase 3: Feature Development (current)            │
│   ⬜ Phase 4: Polish & Launch                           │
└─────────────────────────────────────────────────────────┘
```

**Validation:**
- [ ] Parses CLAUDE.md phase info
- [ ] Recommends phase-appropriate skills
- [ ] Shows phase history
- [ ] Indicates current focus

---

### T-08: INTEGRATION WITH PROJECT-INIT

**Purpose:** Verify seamless transition from auto-router to project-init.

**Execution Flow:**
```
/auto-router
  → Detects EMPTY
  → Shows "Initializing new project..."
  → Loads templates
  → User selects: "REST API Service"
  → Generates scaffolding
  → Offers to run initial analysis
```

**Validation:**
- [ ] Auto-router detects empty state
- [ ] Invokes project-init seamlessly
- [ ] User can select template
- [ ] Scaffolding generated correctly
- [ ] Post-init analysis offered

---

### T-09: SKILL CHAINING

**Purpose:** Verify multiple skills can be chained.

**Execution:**
```bash
/auto-router --skills=fullstack-guardian,security-reviewer
```

**Expected:**
```
┌─────────────────────────────────────────────────────────┐
│ 🔗 SKILL CHAIN EXECUTION                               │
│                                                         │
│ Skills in Chain:                                        │
│   1. fullstack-guardian                                │
│   2. security-reviewer                                 │
│                                                         │
│ Executing...                                            │
│   [1/2] fullstack-guardian                             │
│   ✓ Completed                                           │
│                                                         │
│   [2/2] security-reviewer                              │
│   ⏳ Running...                                         │
│                                                         │
│ Chain complete. Summary:                                │
│   • fullstack-guardian: 3 issues found, 2 fixed       │
│   • security-reviewer: 5 vulnerabilities identified    │
└─────────────────────────────────────────────────────────┘
```

**Validation:**
- [ ] Parses skill list
- [ ] Executes in order
- [ ] Shows progress
- [ ] Reports chain summary

---

### T-10: IMPROVEMENT APPLICATION

**Purpose:** Verify auto-router can apply suggested improvements.

**Execution:**
```bash
/auto-router --apply-improvements
```

**Expected:**
```
┌─────────────────────────────────────────────────────────┐
│ 🔧 IMPROVEMENT APPLICATION                              │
│                                                         │
│ Suggested Improvements:                                  │
│                                                         │
│ 1. [✅] Add health endpoints                           │
│    Status: Will be implemented                          │
│                                                         │
│ 2. [✅] Add rate limiting                               │
│    Package: @fastify/rate-limit                         │
│    Action: Install + configure                          │
│                                                         │
│ 3. [✅] Add security headers                           │
│    Package: @fastify/helmet                            │
│    Action: Install + configure                          │
│                                                         │
│ 4. [ ] Add monitoring (optional)                       │
│                                                         │
│ Apply selected improvements? [Y/n]                      │
└─────────────────────────────────────────────────────────┘
```

**Validation:**
- [ ] Lists improvements
- [ ] Shows implementation plan
- [ ] Prompts for confirmation
- [ ] Executes selected improvements

---

## 🔬 Test Data

### Test Project: Minimal Node.js
```json
{
  "name": "test-minimal",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.0"
  }
}
```

### Test Project: Fullstack Next.js
```json
{
  "name": "test-fullstack",
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "@prisma/client": "^5.0.0",
    "fastify": "^5.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
```

### Test Project: Python FastAPI
```python
# requirements.txt
fastapi==0.104.0
uvicorn==0.24.0
sqlalchemy==2.0.0
pydantic==2.0.0
pytest==7.4.0
```

---

## 📊 Acceptance Criteria

### Must Pass (Critical)

- [ ] T-01: Empty project detection works
- [ ] T-02: Existing project analysis works
- [ ] T-03: Partial project detection works
- [ ] T-04: Skill metadata validation works
- [ ] T-07: Phase-aware selection works

### Should Pass (Important)

- [ ] T-05: Workflow templates execute
- [ ] T-06: Enhanced options work
- [ ] T-08: Project-init integration works
- [ ] T-09: Skill chaining works

### Nice to Have (Enhancement)

- [ ] T-10: Improvement application works

---

## 🛠️ Testing Workflow

```bash
# 1. Run detection tests
/auto-router --test=T-01
/auto-router --test=T-02
/auto-router --test=T-03

# 2. Run discovery tests
/auto-router --scan-skills

# 3. Run power feature tests
/auto-router --workflow=fullstack-web
/auto-router --quick
/auto-router --deep

# 4. Run integration tests
/auto-router --test=all
```

---

## 📝 Test Report Template

```markdown
# Auto-Router Test Report

## Date: YYYY-MM-DD
## Tester: [Name]
## Environment: [Details]

## Results Summary

| Test ID | Status | Notes |
|---------|--------|-------|
| T-01    | PASS   | -     |
| T-02    | FAIL   | [reason] |
| ...     | -      | -     |

## Failures

### T-XX: [Test Name]
**Expected:** [What should happen]
**Actual:** [What happened]
**Fix:** [How to fix]

## Sign-off

- [ ] All critical tests pass
- [ ] No regression in existing features
- [ ] Documentation updated
```

---

*Version: 2.0.0 | Last Updated: Auto-generated*
