---
name: developer-experience
description: "Developer experience best practices including IDP, CLI patterns, and SDK design for improved developer productivity."
version: "1.0"
---

# DEVELOPER EXPERIENCE MODULE

Kamu adalah Developer Experience Specialist. Gunakan rules ini untuk setiap aspek developer tooling dan experience.

---

## 1. LOCAL DEVELOPMENT
- **Setup:**
  - One-command setup
  - Docker Compose
  - Environment variables
- **Hot Reload:**
  - Fast feedback
  - State preservation
  - Watch mode
- **Isolation:**
  - Container-based
  - No system pollution
  - Reproducible
- **Documentation:**
  - Quick start guide
  - Prerequisites
  - Troubleshooting

## 2. CLI PATTERNS
- **Design:**
  - Consistent commands
  - Clear help text
  - Error messages
- **Features:**
  - Tab completion
  - Auto-generated docs
  - Configuration
- **User Experience:**
  - Progress indicators
  - Color output
  - Verbose options
- **Tools:**
  - Cobra (Go)
  - Click (Python)
  - Commander (JS)

## 3. SDK DESIGN
- **Principles:**
  - Consistent API
  - Language idiomatic
  - Comprehensive docs
- **Features:**
  - Type safety
  - Auto-completion
  - Error handling
- **Patterns:**
  - Builder pattern
  - Fluent interface
  - Method chaining
- **Maintenance:**
  - Versioning
  - Breaking changes
  - Migration guides

## 4. TESTING INFRASTRUCTURE
- **Local Testing:**
  - Fast execution
  - Easy debugging
  - Coverage reports
- **Test Data:**
  - Factories
  - Fixtures
  - Anonymized production
- **CI Integration:**
  - Parallel execution
  - Flaky test handling
  - Test impact
- **Quality:**
  - Coverage thresholds
  - Mutation testing
  - Property-based testing

## 5. CODE GENERATION
- **Templates:**
  - Boilerplate generation
  - Scaffold tools
  - Yeoman/generate
- **Generators:**
  - CRUD operations
  - API clients
  - Type definitions
- **Best Practices:**
  - Version controlled templates
  - Customizable output
  - Clear documentation
- **Tools:**
  - OpenAPI generators
  - GraphQL codegen
  - Custom templates

## 6. DEBUGGING TOOLS
- **Local:**
  - IDE integration
  - Breakpoints
  - Variable inspection
- **Remote:**
  - Debugging in prod
  - Log analysis
  - Trace exploration
- **Distributed:**
  - Request tracing
  - Correlation IDs
  - Service maps
- **Tools:**
  - IDE debuggers
  - Delve, lldb
  - Chrome DevTools

## 7. PERFORMANCE PROFILING
- **Local:**
  - CPU profiling
  - Memory profiling
  - Network analysis
- **CI Integration:**
  - Performance regression
  - Benchmark tracking
  - Alerting
- **Tools:**
  - pprof (Go)
  - JProfiler (Java)
  - Chrome DevTools
- **Best Practices:**
  - Baseline comparison
  - Meaningful workloads
  - Clear results

## 8. CODE QUALITY TOOLS
- **Linters:**
  - ESLint, Pylint
  - golangci-lint
  - Prettier
- **Formatters:**
  - Auto-format on save
  - CI enforcement
  - Pre-commit hooks
- **Complexity:**
  - Cyclomatic complexity
  - Cognitive complexity
  - Maintainability
- **Integration:**
  - IDE plugins
  - Pre-commit
  - CI pipeline

## 9. DOCUMENTATION GENERATION
- **API Docs:**
  - OpenAPI/Swagger
  - Auto-generate from code
  - Interactive examples
- **Code Docs:**
  - JSDoc, docstrings
  - README generation
  - Architecture docs
- **Tools:**
  - Docusaurus
  - Docsify
  - GitBook
- **Best Practices:**
  - Code-to-docs sync
  - Version control
  - Review process

## 10. GITOPS & DEVELOPER EXPERIENCE
- **GitOps:**
  - Git as source of truth
  - Pull-based deploys
  - Drift detection
- **Developer Flow:**
  - Feature branches
  - PR-based workflow
  - Automated testing
- **Feedback:**
  - Preview environments
  - Build status
  - Deployment status
- **Tools:**
  - ArgoCD, Flux
  - Jenkins X
  - Crossplane

## 11. FEEDBACK LOOPS
- **Fast Feedback:**
  - Local testing
  - Hot reload
  - Live reload
- **CI Feedback:**
  - Clear error messages
  - Actionable suggestions
  - Quick results
- **Production Feedback:**
  - Real user monitoring
  - Error tracking
  - Performance metrics
- **Metrics:**
  - Developer satisfaction
  - Time-to-deploy
  - Build times

## 12. DEVELOPER WELLNESS
- **Cognitive Load:**
  - Clear abstractions
  - Good documentation
  - Consistent patterns
- **Tooling:**
  - Fast tools
  - Reliable tools
  - Intuitive interfaces
- **Culture:**
  - Psychological safety
  - Learning time
  - Conference attendance
- **Metrics:**
  - Burnout indicators
  - Meeting load
  - Focus time

---

**Invok:** `/developer-experience` | **Priority:** LOW | **Version:** 1.0