# Skills Sync Script - Auto-sync skills across machines
# Usage: .\sync.ps1 [init|pull|push|sync]
param(
    [string]$Action = "sync"
)

$ErrorActionPreference = "Stop"
$SKILLS_DIR = "$env:USERPROFILE\.claude\skills"
$REPO_URL = "https://github.com/thevoidsyntax/V01D-SK11LZ.git"

function Assert-GitInstalled {
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        Write-Error "Git not found. Install Git first."
        exit 1
    }
}

function Get-Branch {
    return git branch --show-current
}

function Get-Status {
    git status --porcelain | Where-Object { $_ -notmatch "^\?\?$" }
}

function Sync-Init {
    if (-not (Test-Path $SKILLS_DIR)) {
        Write-Host "Cloning skills repo..." -ForegroundColor Cyan
        git clone $REPO_URL $SKILLS_DIR
        Write-Host "Done!" -ForegroundColor Green
    } else {
        Write-Host "Skills folder exists. Run sync or pull." -ForegroundColor Yellow
    }
}

function Sync-Pull {
    Set-Location $SKILLS_DIR
    git pull origin (Get-Branch)
    Write-Host "Pulled latest" -ForegroundColor Green
}

function Sync-Push {
    Set-Location $SKILLS_DIR
    $changes = Get-Status
    if ($changes) {
        git add -A
        git commit -m "sync: auto-commit at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        git push origin (Get-Branch)
        Write-Host "Pushed changes" -ForegroundColor Green
    } else {
        Write-Host "No changes" -ForegroundColor Gray
    }
}

function Sync-Sync {
    Sync-Pull
    Sync-Push
}

Assert-GitInstalled

Write-Host "Skills Sync" -ForegroundColor White
Write-Host ""

switch ($Action) {
    "init" { Sync-Init }
    "pull" { Sync-Pull }
    "push" { Sync-Push }
    "sync" { Sync-Sync }
}

Write-Host "Done." -ForegroundColor Gray
