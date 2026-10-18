---
name: documentation
description: Technical documentation best practices including README, RFC, and onboarding documentation
when_to_use: "Use when writing technical docs: README, RFC, or onboarding guides."
version: "1.0.0"
category: [process]
priority: medium
phase: phase-6
tech_stack:
  languages: [all]
scale: [all]
auto_invoke:
  enabled: false
  conditions:
    - command: "/sync-docs"
      reason: "Docs sync invocation"
  skill_tier: optional
capabilities: [implementation, generation]
quality:
  rules_count: 10
  examples_count: 8
  stability: stable
integrates_with: [auto-router]
source:
  origin: local
author: thevoidsyntax
---

# DOCUMENTATION MODULE

Kamu adalah Documentation Specialist. Gunakan rules ini untuk setiap aspek technical documentation.

---

## 1. README STANDARDS
- **Sections:**
  - Project title
  - One-line description
  - Quick start guide
  - Prerequisites
  - Installation
  - Configuration
  - Usage examples
  - API documentation
  - Contributing
  - License
- **Quick Start:**
  - 5-minute setup
  - Basic commands
  - First run example
- **Maintainability:**
  - Update regularly
  - Badge for build status
  - Links to full docs
- **Style:**
  - Clear and concise
  - Code examples
  - Screenshots if helpful

## 2. RFC PROCESS
- **RFC Structure:**
  - Title and summary
  - Motivation
  - Detailed design
  - Alternatives considered
  - Open questions
  - Decision
- **Process:**
  - Draft RFC
  - Team review
  - Discussion period
  - Decision
  - Implementation
- **Templates:**
  - Standard format
  - Checklist
  - Examples
- **Tracking:**
  - RFC repository
  - Status labels
  - Decision log

## 3. ONBOARDING DOCUMENTATION
- **New Hire Guide:**
  - Welcome
  - Setup instructions
  - Team structure
  - First week tasks
  - Resources
- **Technical Onboarding:**
  - Architecture overview
  - Codebase walkthrough
  - Development workflow
  - Deployment process
- **Buddy System:**
  - Assigned buddy
  - Check-ins
  - Questions channel
- **Progress Tracking:**
  - Onboarding milestones
  - Feedback collection
  - Continuous improvement

## 4. API DOCUMENTATION
- **OpenAPI/Swagger:**
  - All endpoints
  - Request/response examples
  - Authentication
  - Error codes
- **Interactive Docs:**
  - Swagger UI
  - Postman collection
  - Try-it-out features
- **Additional:**
  - Quick start guide
  - Authentication guide
  - Rate limits
  - SDK examples
- **Maintenance:**
  - Keep in sync
  - Version tracking
  - Deprecation notices

## 5. RUNBOOKS
- **Standard Format:**
  - Purpose
  - Prerequisites
  - Steps (numbered)
  - Verification
  - Rollback
  - Escalation
- **Operations:**
  - Deployment procedures
  - Scaling operations
  - Backup procedures
  - Emergency response
- **Troubleshooting:**
  - Common issues
  - Diagnostic steps
  - Resolution procedures
- **Maintenance:**
  - Regular review
  - Update triggers
  - Testing

## 6. ARCHITECTURE DOCUMENTATION
- **C4 Model:**
  - Context diagram
  - Container diagram
  - Component diagram
  - Code diagram
- **Content:**
  - System overview
  - Data flow
  - Integration points
  - Security architecture
- **Diagrams:**
  - Clear notation
  - Version controlled
  - Auto-generated where possible
- **Maintenance:**
  - Review quarterly
  - Update with changes
  - Sync with code

## 7. ADR (Architecture Decision Records)
- **ADR Structure:**
  - Title
  - Status (proposed, accepted, deprecated)
  - Context
  - Decision
  - Consequences
- **When to Create:**
  - Major architecture changes
  - Significant technical decisions
  - Trade-off discussions
- **Process:**
  - Create draft
  - Team review
  - Accept/decline
  - Reference in code
- **Repository:**
  - Centralized location
  - Numbered sequentially
  - Searchable

## 8. CODE DOCUMENTATION
- **Public APIs:**
  - JSDoc, docstrings
  - Usage examples
  - Parameters and returns
- **Complex Logic:**
  - Why, not what
  - Algorithm explanation
  - Edge cases
- **Best Practices:**
  - Don't over-document
  - Keep comments updated
  - Use examples
- **Automated:**
  - Generate from code
  - API docs from types
  - TypeScript/JSDoc

## 9. CHANGELOG
- **Format:**
  - Semantic versioning
  - Categorized changes
  - Date for each version
- **Categories:**
  - Added
  - Changed
  - Deprecated
  - Removed
  - Fixed
  - Security
- **Content:**
  - Breaking changes highlighted
  - Migration guides
  - Links to issues/PRs
- **Automation:**
  - Conventional commits
  - GitHub releases
  - Auto-generation

## 10. CONTRIBUTING GUIDE
- **Sections:**
  - Code of conduct
  - Getting started
  - Development setup
  - Coding standards
  - Testing requirements
  - Pull request process
  - Commit message format
- **Process:**
  - Fork and branch
  - Development workflow
  - Review process
  - Merge criteria
- **Standards:**
  - Code style
  - Testing requirements
  - Documentation updates
- **Help:**
  - Questions channel
  - Issue templates
  - Support contacts

## 11. KNOWLEDGE BASE
- **Structure:**
  - How-to guides
  - Tutorials
  - Reference
  - Troubleshooting
- **Content:**
  - Technical guides
  - Process documentation
  - Tool documentation
  - Team knowledge
- **Organization:**
  - Searchable
  - Categorized
  - Tagged
- **Maintenance:**
  - Ownership
  - Review schedule
  - Stale content removal

## 12. DOCUMENTATION AS CODE
- **Git-based:**
  - Version controlled
  - PR for changes
  - Review process
- **Automation:**
  - Auto-generate from code
  - CI validation
  - Broken link checking
- **Publishing:**
  - Static site
  - Search
  - Versioning
- **Tools:**
  - Docsify, Docusaurus
  - GitBook
  - MkDocs

---

**Invoke:** `/documentation` | **Priority:** LOW | **Version:** 1.0
