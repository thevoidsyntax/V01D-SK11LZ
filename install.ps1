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
if (-not (Get-Command git -ErrorAction SilentlyContinue) {
    Write-Host "Git not found. Install Git first." -ForegroundColor Red
    exit 1
}

# Clone or pull
if (Test-Path $SKILLS_DIR) {
    Write-Host "Skills folder exists. Pulling updates..." -ForegroundColor Yellow
    Set-Location $SKILLS_DIR
    git pull
} else {
    Write-Host "Cloning repo..." -ForegroundColor Yellow
    git clone $REPO_URL $SKILLS_DIR
    Set-Location $SKILLS_DIR
}

# Copy settings
Write-Host "Copying settings..." -ForegroundColor Yellow

# Core settings
$settingsContent = @"
{
  `"env`": {
    `"ANTHROPIC_AUTH_TOKEN`": null,
    `"ANTHROPIC_BASE_URL`": null
  },
  `"hooks`": {
    `"Stop`": [],
    `"PermissionRequest`": [],
    `"PreToolUse`": [],
    `"UserPromptSubmit`": [],
    `"SubagentStop`": []
  },
  `"enabledPlugins`": {},
  `"modelSettings`": {}
}
"@

if (Test-Path $SETTINGS_FILE) {
    Write-Host "Settings exists. Skipping." -ForegroundColor Gray
} else {
    $settingsContent | Out-File -FilePath $SETTINGS_FILE -Encoding utf8
}

# Mem auto-approve
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
