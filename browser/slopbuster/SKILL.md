---
name: slopbuster
description: |
  AI text humanizer for prose, code, and academic writing. Strips AI-generated
  patterns and restores human voice. Use when editing or reviewing text to make
  it sound naturally human-written, when cleaning up AI-generated code comments
  and naming, or when revising academic papers flagged for AI patterns.
license: MIT
metadata:
  author: gabelul
  version: "1.0.0"
  tags: [ai-humanizer, text-humanization, ai-slop, deslop, anti-slop, code-quality]
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - AskUserQuestion
---

# De-AI-ify: Kill the Bot, Keep the Human

Strip AI-generated patterns from text and code. Not a grammar pass — a voice transplant.

Works on prose, code, commits, docstrings, academic papers. Anything an LLM touched.

## How This Works

**Two-pass audit.** First pass catches the patterns. Second pass catches what the first pass missed — because removing AI patterns can itself create new ones (sterile, voiceless writing is just as obvious as slop).

## Quick Start

```
/slopbuster <file_or_text>                    # Auto-detect mode, standard depth
/slopbuster <file> --mode text|code|academic  # Force specific mode
/slopbuster <file> --depth quick|standard|deep
/slopbuster <file> --score-only               # Just score, don't rewrite
```

## Modes

| Mode | Targets | Rule files loaded |
|------|---------|-------------------|
| `text` | Prose, marketing, blog posts, docs, emails | text-content, text-language, text-style, text-communication, text-structure |
| `code` | Source files, comments, naming, commits, docstrings | code-comments, code-naming, code-commits, code-docstrings, code-quality, code-llm-tells |
| `academic` | Research papers, theses, abstracts | academic (49 rules, section-specific) |
| `auto` | Detects from context | Loads relevant rule files |

## Depth Levels

| Depth | What happens | Best for |
|-------|-------------|----------|
| `quick` | Single pass, obvious patterns only, no scoring | Fast edits, social copy |
| `standard` | Full pattern scan + two-pass audit + score + changelog | Anything going public |
| `deep` | Full scan + voice calibration + style guide generation | Ghostwriting, brand voice matching |

**Default: `standard`**

## The Process

### Step 1: Diagnose
Read the input. Load the relevant rule files based on mode. Identify every matching pattern. Score the original.

### Step 2: Rewrite
Apply pattern removals. Inject human voice markers. Preserve meaning, facts, and key arguments.

### Step 3: Two-Pass Audit
Ask yourself: *"What still makes this obviously AI-generated?"*
List the remaining tells in brief bullets. Then revise again.

### Step 4: Score and Report
Score the final version. Generate a changelog. Flag anything that needs manual review.

## Core Patterns Removed

### Text: 24 Core Patterns
1. Significance inflation ("pivotal moment", "testament to")
2. Notability name-dropping (listing outlets without context)
3. Superficial -ing analyses ("highlighting", "showcasing", "ensuring")
4. Promotional language ("vibrant", "nestled", "groundbreaking", "breathtaking")
5. AI vocabulary (delve, tapestry, landscape, interplay, foster, garner, pivotal)
6. Copula avoidance ("serves as" instead of "is")
7. Negative parallelisms ("not just X, it's Y")
8. Rule of three (forcing everything into triads)
9. Em dash overuse
10. Boldface overuse
11. Chatbot artifacts ("I hope this helps!", "Let me know if...")
12. Knowledge-cutoff disclaimers
13. Sycophantic tone ("Great question!")
14. Filler phrases ("in order to", "it is important to note")
15. Excessive hedging
16. Generic positive conclusions

### Code: 79 Patterns
- **Comments**: tautological, section headers, narrating obvious intent, hedge TODOs, "we" language
- **Naming**: verbose compounds, Manager/Handler suffix abuse, Enhanced/Advanced prefixes
- **Commits**: vague verbs, "various/several", passive voice, past tense
- **Docstrings**: tautological summaries, type redundancy, weak openings
- **LLM tells**: commented-out alternatives, symmetrical code, placeholder values, defensive null-checks

### Academic: 49 Rules, 10 Groups
Covering meaning preservation, filler removal, punctuation, sentence patterns, voice, deep AI syntax, creative grammar, metaphor, logical closure, subject variety

## What Gets Added

- **Varied sentence rhythm** — mix short (5-10 words) and long (20-30 words)
- **Opinions and reactions** — "I genuinely don't know how to feel about this"
- **Specific examples** — replace "many companies" with actual names and data
- **Contractions** — "it's" not "it is" in casual content
- **Active voice** — "we tested" not "testing was conducted"
- **Honest uncertainty** — real humans have mixed feelings
- **Mess** — perfect structure feels algorithmic; let some tangents in

## Scoring Scale (0-10)

| Score | Label | Description |
|-------|-------|-------------|
| 0-3 | Obviously AI | Multiple cliches, robotic structure |
| 4-5 | AI-heavy | Some human touches but needs work |
| 6-7 | Mixed | Could go either way, lacks strong voice |
| 8-9 | Human-like | Natural voice, minimal patterns |
| 10 | Indistinguishable | Skilled human writer |

**Target: 8+ for public content**

## Two-Pass Soul Check

**Pass 1:** Remove AI patterns using the rule files.

**Pass 2:** Read the result aloud. Ask:
- "What still makes this obviously AI-generated?"
- List remaining tells in brief bullets
- Revise to eliminate those tells

## Output Format

```
ORIGINAL SCORE: 3.8/10 (AI-heavy)
MODE: text | DEPTH: standard

--- DRAFT REWRITE ---
[first pass rewrite]

--- WHAT'S STILL AI ABOUT THIS? ---
- [remaining tells as brief bullets]

--- FINAL VERSION ---
[second pass rewrite]

FINAL SCORE: 8.4/10 (human-like)

CHANGES MADE:
- Removed 7 hedging phrases
- Replaced 4 corporate buzzwords
- Fixed 3 robotic patterns
- Added 5 specific examples

FLAGS FOR MANUAL REVIEW:
- [paragraph-specific items]

FILE SAVED: [original filename]-HUMAN.md
```

---

**Makes AI-generated content sound human again — in prose, code, and papers.**
