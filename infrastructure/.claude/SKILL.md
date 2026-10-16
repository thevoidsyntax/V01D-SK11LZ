---
name: skills-ecosystem-settings
version: "1.0.0"
description: "Local skill settings for Skills Ecosystem project"
priority: high
---

# 🎯 Skills Ecosystem - Local Settings

This directory contains project-specific configurations for the Skills Ecosystem.

## Files

| File | Purpose |
|------|---------|
| `settings.json` | Main configuration file |
| `SKILL.md` | This documentation |

## Configuration Areas

### 1. Skills Configuration

```json
"skills": {
  "autor": {
    "enabled": true,
    "autoInvokeOnProjectAnalysis": true,
    "postAnalysisOutput": true    // Show actionable next steps
  },
  "coreSkills": {
    "autoLoad": true,           // Load 12 core skills on /autor
    "include": [...]            // List of skills to auto-load
  }
}
```

### 2. Coding Standards

```json
"codingStandards": {
  "typescript": {
    "strict": true,
    "target": "ES2022"
  },
  "testing": {
    "framework": "vitest",
    "coverageThreshold": {
      "lines": 70,
      "functions": 70,
      "branches": 60,
      "statements": 70
    }
  }
}
```

### 3. CI/CD

```json
"ci": {
  "enabled": true,
  "provider": "github-actions",
  "nodeVersions": [18, 20, 22],
  "runOnPush": true,
  "runOnPR": true
}
```

### 4. Preferences

```json
"preferences": {
  "outputFormat": "detailed",
  "tokenEfficiency": "high",
  "showNextSteps": true,        // Show recommended actions
  "proactiveSuggestions": true   // Suggest next actions
}
```

## Usage

These settings influence how `/autor` and other skills behave:

| Setting | Effect |
|---------|--------|
| `postAnalysisOutput` | Shows actionable next steps after analysis |
| `showNextSteps` | Always show recommended actions |
| `proactiveSuggestions` | Suggest tasks proactively |
| `tokenEfficiency` | Optimizes for token conservation |

## Extending

To add custom skill preferences, modify `settings.json`:

```json
"skills": {
  "customSkill": {
    "enabled": true,
    "options": {...}
  }
}
```
