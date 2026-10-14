---
name: commit
description: "Guided conventional commit creation. Analyzes git changes and creates properly formatted commit messages following conventional commits standard."
version: "1.2.0"
category: [workflow]
priority: medium
phase: any
auto_invoke:
  enabled: true
  conditions:
    - command: ["/commit", "/gc"]
      reason: "Create git commit"
    - phrase: ["commit changes", "commit this", "commit files"]
      reason: "Intent to commit"
tech_stack:
  languages: [all]
scale: [all]
integrates_with: [git, pr-review]
capabilities: [implementation]
quality:
  rules_count: 8
  examples_count: 3
  stability: stable
source:
  origin: local
author: thevoidsyntax
---

# Git Commit

Create a git commit following these steps:

## Steps

1. **Check git status** - Run `git status` and `git diff` to see all changes
2. **Analyze changes** - Review staged and unstaged changes
3. **Draft message** - Create a concise commit message following Conventional Commits:
   - Format: `type(scope): description`
   - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
   - Focus on **why** not what
4. **Stage files** - Add relevant untracked files if needed
5. **Commit** - Create the commit with the message
6. **Verify** - Run `git status` after to confirm success

## Important Rules

### Security
- **NEVER commit secrets**: `.env`, `credentials.json`, `*.pem`, API keys, tokens
- Review `.gitignore` before committing
- Check for accidentally staged sensitive files

### Attribution
- **Commits are made under the user's name** (the user is the author)
- **NO Co-Authored-By** attribution added
- User's git config is authoritative for identity

### Best Practices
- Keep commits atomic (one logical change per commit)
- Use imperative mood: "Add feature" not "Added feature"
- Reference issues when applicable: `fix(#123): description`
- If pre-commit hooks modify files, verify before committing

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Examples

```
feat(auth): add OAuth2 login flow

Implements Google and GitHub OAuth2 authentication with
proper token refresh handling.

Closes #123
```

```
fix(api): resolve race condition in user lookup

The cached user lookup was not thread-safe, causing
occasional data corruption under high concurrency.

Fixes #456
```

---

**Invoke:** `/commit` | **Priority:** MEDIUM | **Version:** 1.2.0
