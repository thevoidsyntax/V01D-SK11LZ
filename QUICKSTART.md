# Quick Setup Guide

## Clone and Use

```powershell
# 1. Clone repo
git clone https://github.com/thevoidsyntax/V01D-SK11LZ.git $HOME/.claude/skills

# 2. Copy settings
Copy-Item settings.json $HOME/.claude/settings.json
Copy-Item plugins-settings.json $HOME/.claude/plugins/claude-mem/settings.local.json

# 3. Sync
cd $HOME/.claude/skills
git pull

# 4. Run sync
.\sync.ps1 -Action sync
```

## Files

| File | Purpose |
|-------|---------|
| `settings.json` | Git hooks, plugins |
| `plugins-settings.json` | mem-sync auto-approve |
| `sync.ps1` | Cross-machine sync |
| `.gitignore` | Ignore node_modules |
| `sync.md` | Full sync instructions |

## Auto-Sync

```powershell
# Add to profile for auto-pull on startup
# PowerShell: Add to $PROFILE:
#   cd $HOME/.claude/skills; git pull; cd -
```

## Troubleshooting

```powershell
# Reset to remote
git fetch origin
git reset --hard origin/master

# Check remote
git remote -v
```
