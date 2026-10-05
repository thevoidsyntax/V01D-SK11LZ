---
name: prd
description: "Generate comprehensive Product Requirements Document (PRD) based on industry best practices from Google, Microsoft, Amazon, and Silicon Valley standards. Use when user wants to create a new product, feature specification, or product roadmap."
version: "1.0"
author: "Claude Code"
---

# PRD SKILL - Product Requirements Document Generator

**Version:** 1.0
**Base Directory:** `C:\Users\CareTechnologies\.claude\skills\prd`

---

## 🎯 PURPOSE

Generate comprehensive Product Requirements Document (PRD) based on industry best practices from:
- Google
- Microsoft
- Amazon
- Silicon Valley standards

---

## 📋 PRD STRUCTURE

### Section 1: Product Overview
```markdown
## 1. Product Overview

### 1.1 Problem Statement
*High-level problem being solved*

### 1.2 Product Vision
*3-5 year vision*

### 1.3 Product Mission
*Mission for stakeholders*

### 1.4 Goals & Objectives
| Goal | Key Result | Success Metric |
|------|------------|----------------|
```

### Section 2: User Personas
```markdown
## 2. User Personas

### 2.1 Primary Persona
- Name, Role, Demographics
- Goals & Motivations
- Pain Points
- Tech Proficiency

### 2.2 Secondary Personas
```

### Section 3: User Stories
```markdown
## 3. User Stories

### P0 - Must Have (MVP)
| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|

### P1 - Should Have
### P2 - Could Have
```

### Section 4: Feature Requirements
```markdown
## 4. Feature Requirements

### Feature Name
- Description
- User Flow (ASCII/Mermaid)
- Requirements List
- Edge Cases
```

### Section 5: User Flows
```markdown
## 5. User Flows

### Happy Path
### Alternative Flows  
### Error Flows
```

### Section 6: Technical Requirements
```markdown
## 6. Technical Requirements

### 6.1 Architecture
### 6.2 API Endpoints
### 6.3 Database Schema
### 6.4 Third-party Integrations
```

### Section 7: Non-Functional Requirements
```markdown
## 7. Non-Functional Requirements

### 7.1 Performance
### 7.2 Security
### 7.3 Scalability
### 7.4 Availability (SLA)
```

### Section 8: Success Metrics
```markdown
## 8. Success Metrics

### 8.1 KPIs
### 8.2 Analytics Events
```

### Section 9: Timeline
```markdown
## 9. Timeline & Milestones
```

### Section 10: Glossary
```markdown
## 10. Glossary
```

---

## 🔄 WORKFLOW

### Step 1: Gather Information
Ask user:
1. Product name & type
2. Target users
3. Core problem being solved
4. Key features needed
5. Timeline/deadline
6. Budget/resources

### Step 2: Generate PRD
Create comprehensive document following structure above.

### Step 3: Export Options
- Markdown (.md)
- PDF
- Notion/Confluence format

---

## 📝 ACCEPTANCE CRITERIA FORMAT

```
Given [context/precondition]
When [action performed]
Then [expected outcome]
And [additional outcome if needed]
```

---

## 🎯 USER STORY FORMAT

```
As a [user type]
I want [goal/action]
so that [benefit/value]
```

---

## 📊 PRIORITY MATRIX

| Priority | Description | Timeline |
|----------|-------------|----------|
| P0 | MVP - Must have | Phase 1 |
| P1 | Essential - Should have | Phase 2 |
| P2 | Enhanced - Could have | Phase 3 |
| P3 | Nice to have - Won't have | Future |

---

## 🔗 METRICS FRAMEWORK

### AARRR (Pirate Metrics)
- **Acquisition** - How users find you
- **Activation** - First experience
- **Retention** - Come back
- **Revenue** - Pay for value
- **Referral** - Tell others

### North Star Metrics
Single metric that best captures core value delivered.

---

## 📁 OUTPUT LOCATION

PRD documents should be saved to:
```
{project}/docs/prd/{feature-name}.md
```

Or main PRD:
```
{project}/docs/PRDs/product-requirements.md
```

---

**Invoke:** `/prd` | **Priority:** MEDIUM | **Version:** 1.0
