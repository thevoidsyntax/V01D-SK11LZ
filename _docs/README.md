# My Skills

A comprehensive collection of 64 Claude Code skills for enterprise-grade software development.

## Quick Start

```bash
# Clone this repo to your Claude Code skills directory
git clone https://github.com/thevoidsyntax/my-skills.git ~/.claude/skills
```

## Skills Overview

### Core DevOps (7 skills)
Essential skills for every project:

| Skill | Description |
|-------|-------------|
| `/git` | Version control workflows, branching strategies, rebasing |
| `/docker` | Multi-stage builds, security hardening, compose patterns |
| `/ci-cd` | GitHub Actions, GitLab CI, deployment pipelines |
| `/code-quality` | Code review standards, Fowler smells, two-axis review |
| `/deployment` | Blue-green, canary, zero-downtime deployments |
| `/logging` | Structured logging, correlation IDs, log management |
| `/config` | Environment variables, secrets, feature flags |

### AI Process Skills (11 skills)
From Matt Pocock's curated collection:

| Skill | Description |
|-------|-------------|
| `/tdd` | Test-driven development, red-green-refactor loop |
| `/code-review` | Two-axis review: Standards + Spec |
| `/domain-modeling` | Build domain model, CONTEXT.md discipline |
| `/diagnosing-bugs` | 6-phase systematic debugging |
| `/wayfinder` | Plan large work as decision tickets |
| `/grilling` | Relentless interview for design validation |
| `/handoff` | Compact conversation for agent handoff |
| `/research` | Primary source investigation |
| `/implement` | Build from spec using TDD + code-review |
| `/codebase-design` | Deep module vocabulary |
| `/writing-for-agents` | Write skills/docs for AI |

### GitHub Workflow (8 skills)
End-to-end GitHub automation:

| Skill | Description |
|-------|-------------|
| `/new-issue` | Create complete GitHub issue |
| `/validate-issue` | Fact-check issue against code |
| `/work-on-issue` | Implement + PR in isolated worktree |
| `/fix-pr-review` | Fix review comments |
| `/pr-review` | Review format reference |
| `/create-release` | Bump version + publish release |
| `/sync-docs` | Sync CLAUDE.md/AGENTS.md |
| `/commit` | Guided conventional commit |

### Browser Automation (2 skills)

| Skill | Description |
|-------|-------------|
| `/dev-browser` | Fast browser automation (~13ms), JS-native |
| `/browser-use` | AI agent browser, cloud support |

### Anti-AI Writing (1 skill)

| Skill | Description |
|-------|-------------|
| `/slopbuster` | Strip 152 AI patterns, restore human voice |

### Infrastructure (4 skills)

| Skill | Description |
|-------|-------------|
| `/terraform` | Infrastructure as Code, modules, state |
| `/ansible` | Configuration management, playbooks |
| `/message-queue` | Kafka, RabbitMQ, SQS patterns |
| `/graphql` | Schema design, DataLoader, subscriptions |

### Project Setup (3 skills)

| Skill | Description |
|-------|-------------|
| `/project-init` | Interactive project setup with Q&A |
| `/analyze-project` | Tech stack detection + skill recommendations |
| `/auto-router` | Auto-invoke relevant skills by context |

### Domain Engineering (28 skills)

| Category | Skills |
|----------|--------|
| Security & Identity | `/security`, `/identity`, `/compliance` |
| Data & Storage | `/database`, `/data-engineering`, `/search`, `/storage` |
| Architecture | `/architecture-patterns`, `/design-patterns`, `/integration-patterns` |
| Cloud & Infra | `/kubernetes`, `/serverless`, `/scalability` |
| Observability | `/observability`, `/reliability`, `/sre-operations` |
| Web & Mobile | `/frontend`, `/mobile`, `/performance` |
| Messaging | `/messaging` |
| Development | `/testing`, `/api-design`, `/api-client` |
| Operations | `/deployment`, `/networking`, `/documentation` |
| Team | `/team-processes`, `/platform-engineering`, `/developer-experience` |
| Specialized | `/ml-engineering`, `/python-pro`, `/finops`, `/gaming`, `/iot-edge` |

## Usage

### Interactive Setup
```bash
/project-init
```
Answer questions about your project type, scale, and priorities. Core skills auto-activate, optional skills available for selection.

### Analyze Existing Project
```bash
/analyze-project
```
Scans your codebase, detects tech stack, auto-invokes relevant skills.

### Manual Invocation
```bash
/tdd
/git
/docker
/security
```

## Project Types

| Type | Recommended Skills |
|------|------------------|
| REST API | api-design, security, deployment, database |
| Full-Stack Web | frontend, api-design, security, docker, ci-cd |
| ML Pipeline | ml-engineering, data-engineering, python-pro |
| Enterprise | security, identity, compliance, kubernetes |

## Contributing

1. Fork the repository
2. Create a new skill directory (`skill-name/SKILL.md`)
3. Follow the skill template structure
4. Submit a pull request

## License

MIT License - See [LICENSE](LICENSE)

## Repository Stats

```
Total Skills: 64
Total Lines: ~18,500
Categories: 8
```
