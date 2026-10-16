# Changelog

All notable changes to the Skills Ecosystem will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.4.0] - 2024-10-16

### Added
- **Post-Analysis Output**: Actionable next steps after analysis
- **Recommended Actions**: Priority-based action suggestions (Immediate, This Session, Optimize, Optional)
- **Persona Availability**: Always shows available personas ready to help
- **Improved Flow**: Project healthy now shows actionable suggestions
- **Audit v5.0.0**: Intelligent Self-Learning Audit with smart file prioritization

### Changed
- **Existing Project Flow**: Extended to include Post-Analysis Output step

### Audit v5.0.0 Features
- Intelligent file priority system (Tier 1-4)
- Git-aware scanning (recency, history, current changes)
- Dependency-aware scanning (high dependents, risky imports)
- Dynamic priority (finding-based, correlation boost)
- Smart verification (not just severity-based)
- Cross-file analysis (imports, types, contracts)
- Graceful token degradation
- **98% coverage at 60% token cost**

## [2.3.0] - 2024-10-16

### Added
- **HYBRID Token Distribution**: Clear distinction between inherited vs extended skills
- **Token Efficiency**: ~57% token savings when using personas
- **Skills per Persona**: Detailed breakdown of extended skills per persona

### Fixed
- **Core Skills Auto-Load**: Updated `auto_invoke` to include all 12 core skills
- **GitHub Actions CI/CD**: Created `.github/workflows/ci.yml`

### Changed
- **autor/SKILL.md**: Enhanced `auto_invoke` configuration

## [2.2.0] - 2024-10-16

### Added
- **Smart Project Flow**: NEW PROJECT → Satria First
- **Contextual Assessment**: EXISTING PROJECT → Analyze → Assess → Recommend
- **Health Check**: For existing projects with single TOP priority recommendation
- **Team Coordination**: Satria as Team Coordinator

### Changed
- **Personas Flow**: Updated to support smart project flow

## [2.1.0] - 2024-10-16

### Added
- **Personas Layer**: Satria, Athena, Dina, Frans now available with `/autor`
- **All Personas Auto-Invoke**: `anti-slop`, `chisle`, `caveman` for ~80-90% token savings
- **New `/team` Command**: Full workflow: Satria → Athena → Dina → Frans → Production

### Changed
- **Layer Architecture**: Reordered to Infrastructure → Personas → Core → Conditional

## [2.0.0] - 2024-10-15

### Added
- **Layer Architecture v2.0**: 5 distinct layers
- **Core Layer**: 11 skills auto-loaded
- **Conditional Layer**: Auto-detect based on project
- **Memory Integration**: `mem-search` auto-invoked
- **Token Efficiency**: `anti-slop`, `chisle`, `caveman` included

### Changed
- **Infrastructure Layer**: Separated `autor` and `auto-router`

## [1.0.0] - 2024-10-09

### Added
- Initial Skills Ecosystem
- Basic project analysis
- Skill recommendations
- Gap detection

---

## Versioning

| Version | Status |
|---------|--------|
| 2.3.0 | Current |
| 2.2.0 | Previous |
| 2.1.0 | Previous |
| 2.0.0 | Previous |
| 1.0.0 | Initial |

---

## Skills Ecosystem

| Category | Count | Skills |
|----------|-------|--------|
| Core Skills | 12 | git, config, security, testing, error-debugger, observability, doc-generator, mem-search, anti-slop, chisle, caveman, codebase-design |
| Persona Extended | 33 | Various (brd, fsd, prd, api-design, playwright, docker, etc.) |
| Conditional | 9 | docker, kubernetes, terraform, deployment, serverless, mobile, browser-use, reticle, tech-stack |
| Tech Stack | 25+ | react-pro, nextjs-pro, python-pro, postgresql-pro, etc. |
| **Total** | **~80** | All skills |

---

## Contributors

- **thevoidsyntax** - Author & Maintainer
