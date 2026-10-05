---
name: skillspector
description: Deterministic 0-100 quality scoring for Claude Code skill bundles. Analyzes SKILL.md across 10 dimensions: metadata completeness, information density, lexical diversity, readability, topic coverage, structural coherence, code maintainability, example quality, progressive disclosure, and behavioral configuration.
when_to_use: Use when evaluating or improving Claude Code skill bundles before publishing. Invoke after writing a new skill to verify quality thresholds. Use in CI to gate merges on minimum score.
version: 1.1.0
priority: medium
phase: any
author: TheVoidSyntax
source: github.com/larsroettig/skillspector-quality
---

# SkillSpector Quality

Deterministic authoring quality scorer for Claude Code skills. Rates `SKILL.md` bundles from 0 to 100 across ten dimensions.

## Overview

SkillSpector Quality adds a quality assessment layer. It reads the same file cache and passes it through ten independent scoring dimensions. The final score is a weighted sum, normalized so that omitted dimensions do not penalize the skill.

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
| Behavioral Config | 10 | Validity of frontmatter behavioral/execution fields |

## Installation

```bash
pip install -e ../SkillRator   # install skillspector
pip install -e .               # install skillspector-quality
```

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

**Author:** Lars Roettig
**Repository:** larsroettig/skillspector-quality
