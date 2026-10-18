---
name: skillspector
description: "Deterministic 0-100 quality scoring for Claude Code skill bundles. Analyzes SKILL.md across 11 dimensions"
when_to_use: "Use when scoring a skill bundle quality (0-100) across the eleven authoring dimensions."
version: "1.2.0"
category: [meta]
priority: medium
phase: any
auto_invoke:
  enabled: true
  conditions:
    - command: ["/skillspector", "/skill-quality"]
      reason: "Skill quality check"
    - phrase: ["check skill", "quality score", "skill review"]
      reason: "Quality context"
tech_stack:
  languages: [all]
scale: [all]
integrates_with: [skill-creator, sync-docs]
capabilities: [review, analysis]
quality:
  rules_count: 11
  examples_count: 4
  stability: stable
source:
  origin: github.com/larsroettig/skillspector-quality  # quality layer; security engine: github.com/NVIDIA/SkillSpector
author: TheVoidSyntax
---

# SkillSpector Quality

Deterministic authoring quality scorer for Claude Code skills. Rates `SKILL.md` bundles from 0 to 100 across eleven dimensions.

## Overview

SkillSpector Quality adds a quality assessment layer. It reads the same file cache and passes it through eleven independent scoring dimensions. The final score is a weighted sum, normalized so that omitted dimensions do not penalize the skill.

## Dimensions

| Dimension | Weight | What it measures |
|---|---|---|
| Metadata & Discovery | 8 | Completeness and specificity of frontmatter fields |
| Information Density | 15 | Compression ratio and n-gram duplication |
| Lexical Diversity | 6 | MTLD score across all prose |
| Readability | 10 | Ensemble of five readability formulas |
| Topic Coverage | 15 | TF-IDF cosine alignment between description and body |
| Structural Coherence | 13 | Heading hierarchy correctness and link-graph reachability |
| Code Maintainability | 15 | Radon MI, cyclomatic complexity, docstring coverage |
| Example Quality | 10 | Input/output pairing richness and section depth |
| Progressive Disclosure | 8 | Supporting docs linked at depth 1 from SKILL.md |
| Instruction Clarity | 8 | Penalizes hedging and untagged code fences |
| Behavioral Configuration | 10 | Validity of frontmatter behavioral/execution fields |

## Installation

Needs Python 3.12–3.13. Neither package is published to PyPI; install both from GitHub (the security engine first, then the quality layer on top):

```bash
pip install "git+https://github.com/NVIDIA/SkillSpector.git@v2.9.6"         # security engine
pip install "git+https://github.com/larsroettig/skillspector-quality.git"   # quality layer
```

> Windows: `skillspector` pulls `langgraph-cli[inmem]` → `forbiddenfruit`, whose source build trips the path-length limit. Enable long paths, or install with `uv` and an override that drops `langgraph-cli` (the scanner never imports it).

## Usage

```bash
skillspector-quality scan ./my-skill --no-llm
skillspector-quality scan ./my-skill --format json
skillspector-quality scan ./my-skill --min-score 75
```

## Output Formats

| Format | Description |
|---|---|
| `terminal` | Rich terminal report combining security and quality sections |
| `json` | JSON object with quality_assessment |
| `markdown` | Markdown section appended to security report |
| `sarif` | SARIF with quality metrics |

## Integration with Claude Code

To invoke SkillSpector for any skill in your project:

```
Use SkillSpector to analyze: /path/to/skill/SKILL.md
Expected: Quality score 0-100 with per-dimension breakdown
```

## Quality Thresholds

| Score Range | Rating | Action |
|-------------|--------|--------|
| 90-100 | Excellent | Ready to publish |
| 75-89 | Good | Minor improvements possible |
| 50-74 | Average | Consider revisions |
| <50 | Poor | Significant work needed |

---

**Quality layer:** larsroettig/skillspector-quality (Lars Roettig)
**Security engine (upstream):** NVIDIA/SkillSpector
