# V01D-SK11LZ Setup Script
# Run in VS Code Terminal

# Configuration
$REPO_URL = "https://github.com/thevoidsyntax/V01D-SK11LZ.git"
$SKILLS_DIR = "$HOME\.claude\skills"
$SETTINGS_FILE = "$HOME\.claude\settings.json"
$MEM_SETTINGS = "$HOME\.claude\plugins\claude-mem\settings.local.json"

Write-Host "V01D-SK11LZ Setup" -ForegroundColor Cyan
Write-Host ""

# Check git
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Git not found. Install Git first." -ForegroundColor Red
    exit 1
}

# Clone or update
$gitDir = Join-Path $SKILLS_DIR ".git"
if (Test-Path $gitDir) {
    Write-Host "Skills repo exists. Pulling updates..." -ForegroundColor Yellow
    Set-Location $SKILLS_DIR
    git pull
    if ($LASTEXITCODE -ne 0) { Write-Host "git pull failed." -ForegroundColor Red; exit 1 }
} elseif (Test-Path $SKILLS_DIR) {
    Write-Host "'$SKILLS_DIR' exists but is not a git clone of this repo." -ForegroundColor Red
    Write-Host "Move or remove it first, then re-run. Your existing files are left untouched." -ForegroundColor Red
    exit 1
} else {
    Write-Host "Cloning repo..." -ForegroundColor Yellow
    git clone --config core.longpaths=true $REPO_URL $SKILLS_DIR
    if ($LASTEXITCODE -ne 0) { Write-Host "git clone failed." -ForegroundColor Red; exit 1 }
    Set-Location $SKILLS_DIR
}

# Copy settings from the repo (single source of truth) unless you already have one
Write-Host "Copying settings..." -ForegroundColor Yellow
if (Test-Path $SETTINGS_FILE) {
    Write-Host "Settings exists. Skipping." -ForegroundColor Gray
} else {
    Copy-Item (Join-Path $SKILLS_DIR "settings.json") $SETTINGS_FILE -Force
}

# Install the claude-mem plugin so the enabled setting + auto-approve take effect
if (Get-Command claude -ErrorAction SilentlyContinue) {
    Write-Host "Installing claude-mem plugin..." -ForegroundColor Yellow
    claude plugin marketplace add thedotmack/claude-mem --scope user
    claude plugin install "claude-mem@thedotmack" --scope user -y
    if ($LASTEXITCODE -ne 0) {
        Write-Host "claude-mem install did not complete. Retry manually:" -ForegroundColor DarkYellow
        Write-Host "  claude plugin marketplace add thedotmack/claude-mem --scope user" -ForegroundColor DarkYellow
        Write-Host "  claude plugin install claude-mem@thedotmack --scope user -y" -ForegroundColor DarkYellow
    }
} else {
    Write-Host "'claude' CLI not on PATH - skipping claude-mem plugin install." -ForegroundColor DarkYellow
    Write-Host "Install it later from a Claude Code session:" -ForegroundColor DarkYellow
    Write-Host "  /plugin marketplace add thedotmack/claude-mem" -ForegroundColor DarkYellow
    Write-Host "  /plugin install claude-mem" -ForegroundColor DarkYellow
}

# claude-mem auto-approve (written last so it is the final word)
$memContent = @"
{
  `"autoSave`": true,
  `"askToApprove`": false,
  `"quiet`": true
}
"@

$memDir = Split-Path $MEM_SETTINGS -Parent
if (-not (Test-Path $memDir)) {
    New-Item -ItemType Directory -Path $memDir -Force | Out-Null
}
$memContent | Out-File -FilePath $MEM_SETTINGS -Encoding utf8

Write-Host "Done!" -ForegroundColor Green
Write-Host ""
Write-Host "Restart Claude Code to use new skills." -ForegroundColor Yellow
