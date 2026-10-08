---
name: feature-forge
description: "Requirements specialist for structured workshops, EARS-format specs, user stories, and feature specifications"
version: "1.0.0"
category: [process]
priority: critical
phase: phase-1
tech_stack:
  languages: [all]
scale: [all]
auto_invoke:
  enabled: true
  conditions:
    - phrase: ["new feature", "prd", "requirements", "user story", "specification", "create feature", "feature request"]
      reason: "Feature planning detected"
  skill_tier: core
triggers:
  phrases:
    - "prd"
    - "product requirements"
    - "user story"
    - "requirements"
    - "acceptance criteria"
    - "feature spec"
    - "functional requirements"
    - "non-functional requirements"
capabilities: [implementation, generation]
quality:
  rules_count: 20
  examples_count: 15
  stability: stable
integrates_with: [implement, tdd, domain-modeling]
dependencies: []
source:
  origin: external
  sources: ["Jeffallan/claude-skills:feature-forge"]
author: Jeffallan
---

# Feature Forge - Requirements Engineering

Requirements specialist for structured workshops to define feature specifications, user stories, and EARS-format functional requirements.

## Two Hats

Wear both perspectives when using this skill:
- **PM Perspective** — User value, business goals, success metrics
- **Dev Perspective** — Technical feasibility, security, performance, edge cases

## Core Workflow

1. **Discover** — Understand feature goals and target users
2. **Interview** — Systematic questioning from both perspectives
3. **Document** — Write EARS-format requirements
4. **Validate** — Review with stakeholders
5. **Plan** — Create implementation checklist

## EARS Format

### Pattern 1: Ubiquitous (Most Common)
```
The system SHALL [requirement]
```
Example: "The system SHALL authenticate users with email and password."

### Pattern 2: Event-Driven
```
When [event], the system SHALL [response]
```
Example: "When a user submits the registration form, the system SHALL validate all required fields."

### Pattern 3: Optional Behavior
```
When [event], if [condition], the system SHALL [response]
```
Example: "When a user submits the form, if the email is already registered, the system SHALL display an error message."

### Pattern 4: State-Driven
```
While [state], the system SHALL [response]
```
Example: "While the user is unauthenticated, the system SHALL redirect all requests to the login page."

## Required Outputs

When creating a feature specification, provide:

1. **Overview** — Feature name, goal, user value
2. **User Stories** — In format: As a [role], I want [feature] so that [benefit]
3. **Functional Requirements** — EARS format, numbered (FR-001, FR-002, etc.)
4. **Non-Functional Requirements** — Performance, security, scalability
5. **Acceptance Criteria** — Given/When/Then format
6. **Error Handling Table** — Error scenarios and responses
7. **Implementation Checklist** — TODO breakdown

## Example: User Authentication Feature

### Overview
**Feature:** User Authentication
**Goal:** Allow users to securely log in to the platform
**User Value:** Access personalized content and features

### User Stories
```
As a registered user, I want to log in with email/password
so that I can access my personalized dashboard.

As a registered user, I want to receive a password reset link
so that I can regain access if I forget my password.
```

### Functional Requirements
```
FR-001: The system SHALL authenticate users with valid email and password.
FR-002: The system SHALL reject authentication attempts with invalid credentials.
FR-003: The system SHALL lock accounts after 5 consecutive failed attempts.
FR-004: The system SHALL send password reset emails within 30 seconds.
FR-005: The system SHALL expire password reset tokens after 1 hour.
```

### Non-Functional Requirements
```
NFR-001: Authentication response time SHALL be < 500ms (p95)
NFR-002: System SHALL support 10,000 concurrent login attempts
NFR-003: All passwords SHALL be hashed with bcrypt (cost factor 12)
NFR-004: Session tokens SHALL be HTTP-only and secure cookies
```

### Acceptance Criteria
```
Given: A registered user with valid credentials
When: The user submits the login form
Then: The user is redirected to their dashboard
And: A session cookie is set with 24-hour expiration

Given: A user with invalid password
When: The user submits the login form
Then: An error message is displayed
And: No session is created
```

### Error Handling Table
| Scenario | Error Message | HTTP Status |
|----------|--------------|--------------|
| Invalid email format | "Please enter a valid email address" | 400 |
| Invalid credentials | "Invalid email or password" | 401 |
| Account locked | "Account temporarily locked. Try again in 15 minutes" | 423 |
| Server error | "An error occurred. Please try again." | 500 |

## Essential Practices

### MUST DO
- Use `AskUserQuestions` for structured elicitation
- Conduct thorough interview before writing spec
- Use EARS format for functional requirements
- Include non-functional requirements
- Write testable acceptance criteria (Given/When/Then)
- Consider security, performance, edge cases
- Review with stakeholders before implementation

### MUST NOT DO
- Skip the interview phase
- Write requirements without user input
- Skip security considerations
- Skip error handling
- Write vague acceptance criteria
- Overlook edge cases
- Rush the review phase

## Integration

Use with:
- `/implement` — For building the feature
- `/tdd` — For test-driven development
- `/security` — For security considerations
- `/domain-modeling` — For domain structure

---

**Invoke:** `/feature-forge` | **Version:** 1.0.0
