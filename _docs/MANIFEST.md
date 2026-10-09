# MODULAR SKILLS MANIFEST
# V01D-RULEZ v9.0 - Complete Skills System

## 📌 SINGLE SOURCE OF TRUTH
- **Master File:** `~/.claude/master-rules.md`
- **Auto-loaded:** `~/.claude/CLAUDE.md` (30 core rules)

---

## 🎯 MASTER SKILL: /auto-router

`/auto-router` adalah **master skill** yang orchestrates semua skill lain:

```bash
/auto-router new         → New project wizard
/auto-router scan        → Analyze existing project
/ar                     → Alias untuk /auto-router
```

### How It Works
```
User Input → Intent Detection → Tech Scan → Keyword Analysis → Skills Invoked
     │              │               │              │              │
     └── "API baru" ─► CREATE ─► Fastify ─► auth ─► 25+ skills
```

---

## 🟢 CORE SKILLS (23) - Always Active

| # | Category | Skills |
|---|----------|--------|
| 1 | Version Control | `/git` |
| 2 | DevOps | `/docker`, `/ci-cd`, `/deployment` |
| 3 | Quality | `/testing`, `/tdd`, `/code quality` |
| 4 | Config | `/config`, `/logging`, `/observability` |
| 5 | Security | `/security` |
| 6 | Backend | `/api-design`, `/database` |
| 7 | Architecture | `/domain-modeling`, `/architecture-patterns` |
| 8 | Debugging | `/diagnosing-bugs` |
| 9 | Memory | `/mem-search` |
| 10 | Requirements | `/feature-forge` |
| 11 | Implementation | `/implement` |
| 12 | Frontend | `/ui-ux-pro-max` |
| 13 | Documentation | `/documentation` |
| 14 | Performance | `/performance` |
| 15 | Browser | `/browser-use`, `/anti-slop` |

---

## 🔵 TRIGGER-BASED SKILLS (17) - Auto-invoke on Tech Detected

| Tech | Skills |
|------|--------|
| Python | `/python-pro` |
| TypeScript | `/typescript-pro` |
| Go | `/go-pro` |
| Rust | `/rust-pro` |
| NestJS | `/nestjs-expert` |
| PostgreSQL | `/postgresql-pro` |
| Kubernetes | `/kubernetes` |
| Terraform | `/terraform` |
| GraphQL | `/graphql` |
| ML/AI | `/rag-architect`, `/llm-evaluation`, `/ml-pipeline` |
| LangChain | `/langchain-architect` |
| Feature Flags | `/feature-flags` |

---

## 📋 ALL 89 SKILLS BY CATEGORY

### Languages (5)
`/python-pro`, `/typescript-pro`, `/go-pro`, `/rust-pro`, `/nestjs-expert`

### Backend & APIs (6)
`/api-design`, `/api-client`, `/database`, `/postgresql-pro`, `/graphql`, `/messaging`

### DevOps & Infra (7)
`/docker`, `/ci-cd`, `/deployment`, `/kubernetes`, `/terraform`, `/ansible`, `/serverless`

### Frontend & UI (3)
`/ui-ux-pro-max`, `/ui-ux-pro-max-design-system`, `/ui-ux-pro-max-styling`

### Quality & Testing (4)
`/testing`, `/tdd`, `/code quality`, `/audit`

### Security (4)
`/security`, `/pentest`, `/identity`, `/compliance`

### AI/ML (6)
`/rag-architect`, `/llm-evaluation`, `/ml-pipeline`, `/langchain-architect`, `/data quality`, `/feature-flags`

### Process & Workflow (7)
`/feature-forge`, `/implement`, `/domain-modeling`, `/architecture-patterns`, `/wayfinder`, `/grill-with-docs`, `/handoff`

### GitHub Workflow (8)
`/new-issue`, `/validate-issue`, `/work-on-issue`, `/fix-pr-review`, `/pr-review`, `/commit`, `/create-release`, `/sync-docs`

### Meta & Tools (5)
`/mem-search`, `/anti-slop`, `/browser-use`, `/skill-creator`, `/skillspector`

### Specialized (8)
`/mobile`, `/gaming`, `/iot-edge`, `/networking`, `/scalability`, `/reliability`, `/devops-engineer`, `/cloud-architect`

### Team & DevEx (4)
`/developer-experience`, `/documentation`, `/platform-engineering`, `/team-processes`

### Additional (9)
`/reticle`, `/chisle`, `/research`, `/storage`, `/finops`, `/integration-patterns`, `/performance`, `/observability`, `/logging`, `/config`, `/database`

---

## 📊 STATISTICS

| Metric | Value |
|--------|-------|
| **Total Skills** | 89 |
| **CORE Skills** | 26 |
| **Trigger-Based** | 17 |
| **Manual** | 49 |
| **Categories** | 15 |

---

## 🔄 DEVELOPMENT WORKFLOW

```
1. /feature-forge     → PRD, Requirements
2. /domain-modeling   → Bounded Contexts
3. /architecture      → System Design
4. /api-design        → REST/GraphQL Contract
5. /database          → Schema Design
6. /security          → Auth & Encryption
7. /implement         → Build with TDD
8. /ui-ux-pro-max   → UI/UX Design
9. /documentation   → Write Docs
10. /testing          → Unit/Integration Tests
11. /docker           → Containerize
12. /ci-cd            → Pipeline Setup
13. /deployment       → Deploy to Cloud
14. /observability    → Monitoring & Logging
15. /diagnosing-bugs → Debug
16. /mem-search       → Remember context
```

---

**Version:** 9.0 | **Last Updated:** 2025-01-15 | **Author:** TheVoidSyntax
