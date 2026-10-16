# 📚 Project Documentation Templates

This folder contains templates and guidelines for project documentation.

---

## Templates

| Template | Purpose | When to Use |
|----------|---------|--------------|
| **BRD** | Business Requirements Document | Define business needs, stakeholders, objectives |
| **FSD** | Functional Specifications Document | Define detailed technical requirements |
| **PRD** | Product Requirements Document | Define product features, priorities, launches |
| **Master Rules** | Global Claude Code instructions | Global rules for all projects |

---

## Usage

### For New Projects

```
1. Create project folder
2. Use /brd to create BRD
3. Use /fsd to create FSD
4. Use /prd to create PRD
```

### Commands

```bash
/brd              # Business Requirements Document
/fsd              # Functional Specifications
/prd              # Product Requirements Document
/feature-forge    # Interactive PRD workshop
```

---

## Document Flow

```
┌─────────┐
│   BRD   │ ← Business Requirements
└────┬────┘
     │
     ▼
┌─────────┐
│   FSD   │ ← Functional Specifications
└────┬────┘
     │
     ▼
┌─────────┐
│   PRD   │ ← Product Requirements
└────┬────┘
     │
     ▼
┌─────────┐
│  Launch │ ← Development & Launch
└─────────┘
```

---

## Document Hierarchy

```
Project/
├── BRD.md          # Business Requirements
├── FSD.md          # Functional Specifications  
├── PRD.md          # Product Requirements
├── SPEC.md         # Technical Specifications
└── README.md       # Project Overview
```

---

## Templates Structure

Each template includes:
- Version control
- Change history
- Approval workflow
- Templates for common sections
- Examples

---

## Version

v2.0.0 - Added BRD, FSD templates
