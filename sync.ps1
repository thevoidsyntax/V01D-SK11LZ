# Skills Sync Script - Auto-sync skills across machines
# Usage: .\sync.ps1 [init|push|pull|sync|watch]

param(
    [ValidateSet("init", "push", "pull", "sync", "watch")]
    [string]$Action = "sync"
)

$ErrorActionPreference = "Stop"
$SKILLS_DIR = "$env:USERPROFILE\.claude\skills"
$REPO_URL = "https://github.com/thevoidsyntax/V01D-SK11LZ.git"

function Assert-GitInstalled {
    if (-not (Get-Command git -ErrorAction SilentlyContinue) {
        Write-Error "Git not found. Install Git first."
        exit 1
    }
}

function Assert-InSkillsDir {
    if (-not $MyInvocation.MyCommand.Path.StartsWith($SKILLS_DIR)) {
        Set-Location $SKILLS_DIR
    }
}

function Test-IsRepo {
    return (Test-Path ".git")
}

function Get-BranchName {
    return git branch --show-current
}

function Get-Status {
    return git status --porcelain | Where-Object { $_ -notmatch "^\?\?" }
}

function Sync-Init {
    if (-not (Test-Path $SKILLS_DIR) {
        Write-Host "Cloning skills repo..." -ForegroundColor Cyan
        git clone $REPO_URL $SKILLS_DIR
        Write-Host "Done!" -ForegroundColor Green
    } else {
        Write-Host "Skills already exists. Run sync or pull." -ForegroundColor Yellow
    }
}

function Sync-Pull {
    git pull origin (Get-BranchName)
    Write-Host "Pulled latest changes" -ForegroundColor Green
}

function Sync-Push {
    $changes = Get-Status
    if ($changes) {
        git add -A
        git commit -m "sync: auto-commit at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss'"
        git push origin (Get-BranchName)
        Write-Host "Pushed changes" -ForegroundColor Green
    } else {
        Write-Host "No changes to push" -ForegroundColor Gray
    }
}

function Sync-Sync {
    Sync-Pull
    Sync-Push
}

function Sync-Watch {
    Write-Host "Watching for changes (Ctrl+C to stop)..." -ForegroundColor Cyan
    while ($true) {
        Start-Sleep -Seconds 5
        $changes = Get-Status
        if ($changes) {
            Write-Host "Changes detected, syncing..." -ForegroundColor Yellow
            Sync-Push
        }
    }
}

Assert-GitInstalled
Set-Location $SKILLS_DIR

Write-Host "Skills Sync" -ForegroundColor White
Write-Host ""

switch ($Action) {
    "init" { Sync-Init }
    "pull" { Sync-Pull }
    "push" { Sync-Push }
    "sync" { Sync-Sync }
    "watch" { Sync-Watch }
}

Write-Host "Done." -ForegroundColor Gray
