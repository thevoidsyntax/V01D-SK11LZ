---
name: git
description: Git version control operations, workflows, and best practices
version: "1.0.0"
category: [process]
priority: high
phase: any
tech_stack:
  languages: [all]
scale: [all]
auto_invoke:
  enabled: true
  conditions:
    - always: true
      reason: "Core skill for any project"
  skill_tier: core
triggers:
  phrases:
    - "git"
    - "commit"
    - "branch"
    - "merge"
    - "rebase"
    - "pull"
    - "push"
    - "version control"
    - "github"
    - "gitlab"
capabilities: [implementation, review]
quality:
  rules_count: 15
  examples_count: 30
  stability: stable
integrates_with: [auto-route, analyze-project]
source:
  origin: local
author: Claude
---

# Git - Version Control Master Reference

## Essential Workflows

### Daily Workflow
```bash
# Start fresh
git switch main
git pull --rebase

# Create feature branch
git switch -c feat/feature-name

# Work and commit
git add -p  # Stage hunks selectively
git commit -m "feat: description"

# Push and create PR
git push -u origin feat/feature-name
```

### Branching Strategy
```
main (production)
  └── develop (integration)
        ├── feat/feature-name
        ├── fix/bug-name
        ├── hotfix/urgent-fix
        └── release/v1.2.0
```

## Branch Operations

### Create & Switch
```bash
# Create and switch
git switch -c new-branch

# Create from specific commit/branch
git switch -c new-branch abc123
git switch -c new-branch origin/develop

# Switch back
git switch -
```

### Delete
```bash
# Delete merged branch
git branch -d branch-name

# Force delete unmerged
git branch -D branch-name

# Delete remote
git push origin --delete branch-name
```

## Commit Operations

### Amend & Fix
```bash
# Amend last commit (not pushed)
git commit --amend

# Amend without changing message
git commit --amend --no-edit

# Change commit message
git commit --amend -m "new message"

# Add forgotten files to last commit
git add forgotten-file.txt
git commit --amend --no-edit
```

### Interactive Staging
```bash
# Stage hunks selectively
git add -p

# Stage files selectively
git add -p file.txt

# Options per hunk:
# y - stage this hunk
# n - skip this hunk
# s - split into smaller hunks
# e - manually edit hunk
```

### Squash & Combine
```bash
# Squash last N commits
git reset --soft HEAD~3
git commit -m "combined message"

# Or use interactive rebase
git rebase -i HEAD~3
# Change 'pick' to 'squash' or 's'
```

## Merge Operations

### Standard Merge
```bash
# Merge branch into current
git merge feature-branch

# Merge with message
git merge --no-ff feature-branch -m "Merge feat/feature"
```

### Handle Conflicts
```bash
# See conflicted files
git status

# Open in editor (VS Code)
code .

# After resolving, stage
git add resolved-file.txt

# Complete merge
git commit
```

### Merge vs Rebase
```
Use MERGE when:
├── Merging shared/public branches
├── You want to preserve history
└── Team prefers merge commits

Use REBASE when:
├── Cleaning up local feature branch
├── Applying upstream changes
└── Keeping linear history
```

## Rebase Operations

### Standard Rebase
```bash
# Rebase onto another branch
git rebase main

# Continue after resolving conflicts
git rebase --continue

# Abort rebase
git rebase --abort

# Skip problematic commit
git rebase --skip
```

### Interactive Rebase
```bash
# Rebase last N commits
git rebase -i HEAD~5

# Commands in editor:
pick abc123 "First commit"
squash def456 "Second commit"  # Combine
reword ghi789 "Third commit"   # Change message
drop jkl012 "Unwanted commit"  # Delete
```

### Rebase vs Pull
```bash
# Pull with rebase (cleaner history)
git pull --rebase origin main

# Equivalent to:
git fetch
git rebase origin/main
```

## Stash Operations

### Basic Stash
```bash
# Stash changes
git stash
git stash save "description"

# Stash including untracked
git stash -u

# Stash with message
git stash push -m "WIP: feature X"

# Stash specific files
git stash push -m "partial work" file1.js file2.css
```

### Apply & Pop
```bash
# Apply most recent stash
git stash pop

# Apply specific stash
git stash apply stash@{2}

# Apply without removing from stash list
git stash apply

# List stashes
git stash list
# stash@{0}: WIP: feature X
# stash@{1}: On main: hotfix
```

### Clean Up
```bash
# Drop most recent stash
git stash drop

# Drop specific stash
git stash drop stash@{1}

# Clear all stashes
git stash clear
```

## Reset & Restore

### Undo Commits
```bash
# Undo last commit, keep changes staged
git reset --soft HEAD~1

# Undo last commit, keep changes unstaged
git reset --mixed HEAD~1

# Undo last commit, discard changes
git reset --hard HEAD~1

# Reset to specific commit
git reset --hard abc123
```

### Restore Files
```bash
# Restore file from HEAD
git restore file.txt

# Restore from specific commit
git restore --source=abc123 file.txt

# Unstage file
git restore --staged file.txt

# Discard changes
git restore file.txt
```

## Git Bisect

### Binary Search for Bugs
```bash
# Start bisect
git bisect start

# Mark current (broken)
git bisect bad

# Mark known good commit
git bisect good abc123

# Git will checkout midpoint
# Test and mark:
git bisect good   # If working
git bisect bad    # If broken

# Repeat until found
# Git reports first bad commit

# End bisect
git bisect reset
```

### Automated Bisect
```bash
# Run test script automatically
git bisect start
git bisect bad HEAD
git bisect good abc123
git bisect run npm test

# After finding, reset
git bisect reset
```

## Submodules

### Add Submodule
```bash
git submodule add https://github.com/user/repo.git path/to/submodule
```

### Clone with Submodules
```bash
# Clone and init submodules
git clone --recurse-submodules https://github.com/user/repo.git

# Or after clone
git submodule init
git submodule update
```

### Update Submodule
```bash
# Fetch and checkout latest
cd path/to/submodule
git fetch origin
git checkout main
git pull

# Or in main repo
git submodule update --remote path/to/submodule
```

### Remove Submodule
```bash
git submodule deinit path/to/submodule
git rm path/to/submodule
rm -rf .git/modules/path/to/submodule
```

## Tags

### Create Tags
```bash
# Lightweight tag
git tag v1.0.0

# Annotated tag (recommended)
git tag -a v1.0.0 -m "Release version 1.0.0"

# Tag specific commit
git tag -a v1.0.0 abc123 -m "Version 1.0.0"
```

### Push & Delete Tags
```bash
# Push single tag
git push origin v1.0.0

# Push all tags
git push --tags

# Delete local tag
git tag -d v1.0.0

# Delete remote tag
git push origin --delete v1.0.0
```

## Remote Operations

### Manage Remotes
```bash
# List remotes
git remote -v

# Add remote
git remote add upstream https://github.com/original/repo.git

# Fetch from remote
git fetch origin
git fetch --all

# Prune deleted remote branches
git fetch --prune
```

### Work with Fork
```bash
# Add upstream (your fork workflow)
git remote add upstream original-repo-url

# Sync with upstream
git fetch upstream
git switch main
git merge upstream/main
git push origin main
```

## Log & History

### View History
```bash
# Pretty log
git log --oneline --graph --all

# Short log by author
git shortlog

# Log with stat
git log --stat

# Search commits
git log --grep="fix:"

# Log for file
git log -- path/to/file.txt
```

### Blame
```bash
# Who changed what
git blame file.txt

# Blame specific lines
git blame -L 10,20 file.txt

# Blame ignoring whitespace
git blame -w file.txt
```

## Diff Operations

### Compare Branches
```bash
# Diff between branches
git diff main..feature-branch

# Diff staged changes
git diff --staged

# Diff untracked
git diff HEAD

# Diff specific file
git diff main -- path/to/file.txt
```

### Diff Tools
```bash
# External diff tool
git difftool

# Configure VS Code
git config diff.tool vscode
git config difftool.vscode.cmd "code --wait --diff $LOCAL $REMOTE"
```

## Configuration

### Useful Aliases
```bash
# In ~/.gitconfig or via command
git config --global alias.st "status -sb"
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage "reset HEAD --"
git config --global alias.last "log -1 HEAD"
git config --global alias.visual "difftool -d"
```

### Essential Config
```bash
# Set default branch
git config --global init.defaultBranch main

# Set pull rebase default
git config --global pull.rebase true

# Enable color
git config --global color.ui auto

# Set editor
git config --global core.editor "code --wait"
```

## Hooks

### Pre-commit Hook
```bash
# .git/hooks/pre-commit
#!/bin/bash
npm test
npm run lint
```

### Commit-msg Hook (Conventional Commits)
```bash
# .git/hooks/commit-msg
commit_msg=$(cat $1)
pattern="^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .+"

if ! [[ $commit_msg =~ $pattern ]]; then
    echo "Invalid commit message format"
    exit 1
fi
```

---

**Invoke:** `/git` | **Priority:** HIGH
