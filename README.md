# V01D-SK11LZ

> AI agent skills ecosystem untuk development environment yang terstruktur & efisien.

---

## Quick Start

```
/autor          # Analyze project, auto-load skills
/satria          # Project Manager (PM)
/athena          # Software Engineer (SE)
/dina            # Quality Assurance (QA)
/frans           # DevOps Engineer
```

---

## System

### Skills (auto-invoke)

```
/autor            # Auto-load 13 core skills
/git              # Version control
/config            # Environment setup
/security          # Security practices
/testing           # Testing strategy
/error-debugger     # Debugging
/observability      # Logging/monitoring
/doc-generator      # Auto-docs
/mem-search        # Memory continuity
/anti-slop         # Output optimization
/chisle            # Context pruning
/caveman           # Terse communication
/codebase-design    # Architecture patterns
/ponytail          # Code-less philosophy
```

### Personas (bounded)

```
/satria  - /brd, /fsd, /prd, /audit, /graphify, /scraper
/athena - /api-design, /graphify, /scraper
/dina    - /playwright, /graphify, /impeccable, /scraper
/frans   - /onyx, /graphify, /scraper
```

### External Tools (reference)

```
/impeccable   # Design review
/superpowers  # Workflow methodology
/onyx          # Enterprise knowledge
/graphify        # Codebase graph
/scraper        # Web scraping
```

---

## Sync

### Clone & Setup

```powershell
# 1. Clone repo
git clone https://github.com/thevoidsyntax/V01D-SK11LZ $HOME/.claude/skills

# 2. Copy settings
cp settings.json $HOME/.claude/settings.json
cp plugins-settings.json $HOME/.claude/plugins/claude-mem/settings.local.json

# 3. Sync
cd $HOME/.claude/skills
git pull
```

### Auto-Sync

```powershell
# Manual sync
.\sync.ps1 -Action sync

# Watch mode (continuous)
.\sync.ps1 -Action watch
```

---

## Stats

```
Core Skills:     13
Persona Skills:   4
Conditional:     ~40
On-Demand:      ~5
Total:          ~60+
```
