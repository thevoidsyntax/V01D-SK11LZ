# Sync Instructions for Skills Ecosystem

## Quick Setup

### On This Machine (Source)

```bash
cd ~/.claude/skills

# Initialize git if not already
git init
git add .
git commit -m "chore: initial skills ecosystem"

# Create GitHub repo and push
gh repo create skills-ecosystem --private --source . --push
```

### On Other Machines (Clone)

```bash
# Clone to skills folder
git clone https://github.com/thevoidsyntax/V01D-SK11LZ ~/.claude/skills-temp

# Backup existing skills (if any)
mv ~/.claude/skills ~/.claude/skills-backup

# Use synced version
mv ~/.claude/skills-temp ~/.claude/skills

# Pull updates
cd ~/.claude/skills
git pull origin master
```

## Auto-Sync Setup

### Option 1: Git Aliases

Add to shell profile (~/.bashrc or ~/.zshrc):

```bash
alias skills-pull='cd ~/.claude/skills && git pull'
alias skills-push='cd ~/.claude/skills && git add -A && git commit -m "update" && git push'
alias skills-sync='git-pull && git push'
```

### Option 2: Git Hook (Auto-push on commit)

Create `.git/hooks/post-commit`:

```bash
#!/bin/bash
cd ~/.claude/skills
git push
```

### Option 3: Cron Job (Auto-pull every hour)

```bash
crontab -e
# Add line:
0 * * * * cd ~/.claude/skills && git pull --quiet
```

## Sync Commands

```bash
# Pull latest
cd ~/.claude/skills && git pull

# Push changes
cd ~/.claude/skills && git add -A && git commit -m "update" && git push

# Force push (use carefully)
cd ~/.claude/skills && git push --force
```

## Conflicts

If both machines made changes:

```bash
# Pull and merge
cd ~/.claude/skills && git pull

# If conflicts, edit conflicting files
# Then commit merge
git add .
git commit -m "merge: resolve conflicts"
git push
```

## Reset to Remote (Discard local changes)

```bash
cd ~/.claude/skills && git fetch origin && git reset --hard origin/master
```
