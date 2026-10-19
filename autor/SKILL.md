---
name: autor
version: "2.6.0"
description: "Project intelligence with Smart Flow, 6-persona pipeline, token-efficient core skills, and memory continuity for Claude Code"
when_to_use: "Use when starting a new project, analyzing existing codebase, or needing project intelligence. Run /autor scan for project health check, /autor new for fresh projects."
priority: critical
phase: any
category: [process, intelligence]
tech_stack:
  languages: [all]
  frameworks: [all]
  databases: [all]
  services: [all]
scale: [all]
auto_invoke:
  enabled: true
  conditions:
    - command: ["/autor", "/ar", "/autor scan", "/autor status", "/autor analyze", "/autor help", "/autor new", "/autor init"]
      auto_invoke: /autor, /git, /config, /security, /testing, /error-debugger, /observability, /doc-generator, /mem-search, /anti-slop, /chisle, /caveman, /codebase-design, /ponytail
      reason: "Primary entry - invoke autor with all 12 core skills for project intelligence"
capabilities: [implementation, analysis]
source:
  origin: infrastructure
author: thevoidsyntax
---

# AUTOR v2.6 - PROJECT INTELLIGENCE

Claude Code skill for analyzing projects, planning features, and shipping code using a 6-persona team workflow.

For quick reference:
- [QUICKREF.md](./QUICKREF.md) - Command list
- [PERSONAS.md](./PERSONAS.md) - Persona details

---

## WHAT IS SMART FLOW?

Smart Flow is a systematic method combining intelligent project analysis with a structured 6-persona pipeline.

**Core cycle:**

```text
Assess → Plan → Design → Build → Audit → Deploy → Document
```

**Benefits:**
- Systematic approach to development
- Quality gates prevent bad code
- Token-efficient through skill sharing
- Memory continuity across sessions

---

## WHEN TO USE PLAN MODE

Plan Mode = human approval before execution. Use it for:

| Task | Mode | Reason |
|------|------|--------|
| Writing requirements | plan | Changes ripple everywhere |
| Architecture decisions | plan | Expensive to fix later |
| Database migrations | plan | Data loss risk |
| Feature development | auto | Dina guards quality |
| Testing | auto | Automated verification |
| Documentation | auto | Human reviews draft |

---

## COMMANDS

```bash
/autor              # Analyze current project
/autor scan         # Full health check with recommendations
/autor new          # New project wizard
/autor status       # Quick status overview
```

---

## 12 CORE SKILLS (Auto-loaded)

These activate automatically when you invoke /autor:

| # | Skill | Function |
|---|-------|----------|
| 1 | git | Version control strategy |
| 2 | config | Environment management |
| 3 | security | Security best practices |
| 4 | testing | Testing methodology |
| 5 | error-debugger | Debug patterns |
| 6 | observability | Monitoring setup |
| 7 | doc-generator | Auto documentation |
| 8 | mem-search | Memory search |
| 9 | anti-slop | Token optimization |
| 10 | chisle | Context pruning |
| 11 | caveman | Output compression |
| 12 | codebase-design | Architecture guidance |

Token cost: 1x shared across all personas.

---

## 6 PERSONAS PIPELINE

Sequential workflow where each persona hands off to the next:

```text
Satria → Athena → Hexa → Dina → Frans → Vika
  PM       Arch     Code    QA     DevOps   Writer
 plan      plan    auto   auto     plan    auto
```

| # | Persona | Model | Effort | Mode | Handoff |
|---|---------|-------|--------|------|---------|
| 1 | Satria | Sonnet | medium | plan | PRD to Athena |
| 2 | Athena | Opus | high | plan | ADR to Hexa |
| 3 | Hexa | Sonnet | medium | auto | Code to Dina |
| 4 | Dina | Opus | xhigh | auto | Report to Frans/Vika |
| 5 | Frans | Sonnet | medium | plan | Infrastructure |
| 6 | Vika | Haiku | low | auto | Documentation |

Dina is the gatekeeper. She either approves or rejects. If rejected, Hexa patches and resubmits. Maximum three resubmission attempts allowed.

---

## PIPELINE STEPS

### 1. PLANNING (Satria)

```bash
/autor new
```

Satria gathers requirements and writes:
- User stories with acceptance criteria
- Project scope and boundaries
- Risks and dependencies

Output: `specs/PRD.md`

### 2. DESIGN (Athena)

Athena reads PRD and creates:
- Architecture Decision Records
- Data schema definitions
- API interface contracts

Output: `specs/ADR.md`, `specs/contracts.*`

### 3. IMPLEMENTATION (Hexa)

Hexa implements against contracts:
- Feature code in `src/`
- Unit tests in `tests/`

Output: `src/*`, `tests/*`

### 4. AUDIT (Dina)

Dina reviews implementation:
- Logic correctness
- Race conditions
- OWASP vulnerabilities
- Transaction safety

Output: `specs/AUDIT.md`

If REJECTED → Hexa patches → resubmit (max 3x)
If APPROVED → Frans continues

### 5. DEPLOYMENT (Frans)

Frans sets up infrastructure:
- Docker containerization
- Database migrations with rollback
- CI/CD pipeline

Output: `Dockerfile`, `migrations/*`, `ci.yml`

### 6. DOCUMENTATION (Vika)

Vika syncs documentation:
- OpenAPI specification
- Changelog entries

Output: `docs/openapi.*`, `CHANGELOG.md`

---

## AUDIT TRIGGERS

Run `/audit` when:

| Context | Trigger? |
|---------|----------|
| Adding authentication | ✅ Yes, strongly |
| Adding payment processing | ✅ Yes, strongly |
| Handling personal data | ✅ Yes, strongly |
| First production deploy | ✅ Yes |
| Major refactoring | ✅ Yes |
| Small bug fixes | ❌ No |
| Recent audit completed | ❌ No |

```bash
/audit                # Full codebase scan
/audit src/auth/      # Module-specific scan
```

---

## HEALTH CHECK CRITERIA

Analyze these dimensions during project assessment:

| Dimension | Metric | Fix Command |
|-----------|--------|------------|
| Test coverage | Percentage | /dina |
| CI/CD | Pipeline exists | /frans |
| Documentation | README, API docs | /vika |
| Security | OWASP checklist | /dina |
| Code structure | Architecture | /athena |

---

## TOKEN OPTIMIZATION

Core skills: 1x shared token

Persona extended skills add tokens:

| Persona | Additional Skills | Token Cost |
|---------|-----------------|------------|
| Satria | brd, prd, fsd + | +13 |
| Athena | api-design, database + | +25 |
| Hexa | language-pro + | varies |
| Dina | pentest, playwright + | +15 |
| Frans | docker, terraform + | +23 |
| Vika | documentation + | +6 |

Built-in savers:
- anti-slop: reduces 30%
- chisle: reduces 20%
- caveman: reduces 65%

---

## CONTEXT DETECTION

Claude automatically loads relevant skills:

```text
You: "useState hook in React"
→ Recognizes: React patterns
→ Loads: /react-pro

You: "postgres connection refused"
→ Recognizes: PostgreSQL error
→ Loads: /postgresql-pro + /error-debugger
```

---

## EXAMPLE: NEW PROJECT

**User input:**
```bash
/autor new
```

**Wizard question:**
```text
What type of project?
- Web application
- REST/GraphQL API
- CLI tool
- NPM library
- Mobile app
```

**User selects:** Web application for e-commerce

**Claude response:**
```text
✅ Recommended Stack:

Frontend:
├─ Next.js 15 + React 19
├─ Tailwind CSS 4
└─ shadcn/ui components

Backend:
├─ Node.js 22 LTS
├─ Fastify framework
└─ Prisma ORM + PostgreSQL 16

Authentication:
├─ NextAuth.js v5
└─ JWT with refresh tokens

Payments:
├─ Stripe Checkout
└─ Webhook handlers

Infrastructure:
├─ Vercel (app hosting)
└─ Railway (database hosting)

📋 Setup Commands:

npx create-next-app@latest mystore \
  --typescript --tailwind --eslint --app

cd mystore
npm install @prisma/client
npx prisma init --datasource-provider postgresql

🔒 Security: /security loaded
🧪 Testing: /testing loaded
📝 Docs: /doc-generator loaded

Skills activated: /nextjs-pro /prisma /auth-flows /security /testing
```

---

## EXAMPLE: EXISTING PROJECT

**User input:**
```bash
/autor scan
```

**Claude performs:**
1. Repository structure analysis
2. Test coverage measurement
3. CI/CD configuration check
4. Documentation audit
5. Security assessment

**Claude response:**
```text
PROJECT STATE: NEEDS ATTENTION

┌─────────────────────────────────────────────────────┐
│  ✅ WORKING                                        │
├─────────────────────────────────────────────────────┤
│  ├─ NextAuth.js authentication                    │
│  ├─ REST API endpoints                           │
│  ├─ TypeScript strict mode                       │
│  └─ Environment configuration                     │
├─────────────────────────────────────────────────────┤
│  ⚠️  DEFICIENT                                   │
├─────────────────────────────────────────────────────┤
│  ├─ Test coverage: 45% (target: 70%)            │
│  ├─ CI/CD: Not configured                        │
│  └─ API documentation: Missing                   │
└─────────────────────────────────────────────────────┘

📋 REMEDIATION ROADMAP:

1. IMMEDIATE (Blocks Deployment):
   └─ Configure CI/CD pipeline
     → Command: /frans
     → Time estimate: 15 minutes
     → Delivers: .github/workflows/ci.yml

2. THIS SPRINT (Quality):
   └─ Increase test coverage to 70%
     → Command: /dina
     → Time estimate: 30 minutes
     → Delivers: tests/* with coverage report

3. NEXT SPRINT (Documentation):
   └─ Generate OpenAPI specification
     → Command: /vika
     → Time estimate: 10 minutes
     → Delivers: docs/openapi.yaml

🎯 AVAILABLE PERSONAS:

/satria   /athena   /hexa   /dina   /frans   /vika
(plan)    (plan)    (auto)  (auto)  (plan)   (auto)
```

---

## EXAMPLE: FEATURE PIPELINE

**User:** "I want to add user registration with email verification"

**Step 1: Satria**
```bash
Satria writes: specs/PRD.md
```

PRD contains:
- User story: "As a visitor, I want to register with email so I can access the platform"
- Acceptance criteria:
  - Valid email format required
  - Password minimum 8 characters with numbers
  - Verification email sent automatically
  - Account activated after email confirmation
- Non-functional requirements:
  - Registration completes within 3 seconds
  - Verification link expires after 24 hours
- Out of scope:
  - Social login (OAuth)
  - Password reset flow

**Step 2: Athena**
```bash
Athena writes: specs/ADR.md, specs/contracts.ts
```

ADR documents:
- Hash passwords with bcrypt (cost factor 12)
- JWT access tokens (15 min expiry) + refresh tokens (7 days)
- Store verification tokens in Redis with TTL
- Send emails via Resend API

Contracts define:
```typescript
interface RegisterRequest {
  email: string;
  password: string;
}

interface RegisterResponse {
  userId: string;
  message: string;
}
```

**Step 3: Hexa**
```bash
Hexa writes: src/auth/register.ts, tests/auth/register.test.ts
```

Implementation:
- Email validation with regex
- Password hashing with bcrypt
- JWT generation
- Redis token storage
- Email sending via Resend
- Comprehensive unit tests

**Step 4: Dina**
```bash
Dina writes: specs/AUDIT.md
```

Audit findings:
- ✅ Password hashing correct
- ✅ JWT implementation secure
- ⚠️ Missing rate limiting on registration endpoint
- ⚠️ No CAPTCHA to prevent bot registration

STATUS: REJECTED

**Step 3 (patch): Hexa**
- Adds rate limiting (5 requests per minute per IP)
- Integrates hCaptcha

STATUS: APPROVED

**Step 5: Frans**
```bash
Frans writes: Dockerfile, migrations/001_add_users.sql, ci.yml
```

**Step 6: Vika**
```bash
Vika writes: docs/openapi.yaml, CHANGELOG.md
```

---

*"Make it work, make it right, make it fast."*
