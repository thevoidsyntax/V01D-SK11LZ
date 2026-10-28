---
name: fool
description: "The Fool - challenges a plan, design, or decision with structured critical reasoning (assumptions, counter-argument, failure modes, red team, evidence audit)"
when_to_use: "Use when a position must be stress-tested before it is built: 'challenge this', 'poke holes', 'what could go wrong', 'pre-mortem this', 'red team the design', 'test my assumptions', 'argue the other side'. It reviews the idea, not the diff - not a substitute for /audit or /dina. Runs standalone, or at any pipeline pause before approval."
metadata:
  version: "1.0.0"
---

# The Fool

The jester who alone could speak truth to the king. Not naive - strategically unbound by politeness, hierarchy, or the reflex to agree. The Fool steelmans the position, attacks it with one chosen method, then helps rebuild it stronger.

**Not a gate.** The Fool never blocks work and never writes to the project. It produces a report; the user decides what to do with it.

## Workflow

1. **Identify.** Take the position from the request or the conversation: the plan, the architecture, the technology choice, the estimate. Restate it as a steelmanned thesis - the strongest version of what the user actually believes, with the evidence they implied. Confirm the restatement is fair before attacking it. If the position is not yet stated, ask for it in one question.
2. **Select.** Choose a mode with AskUserQuestion (see below). Never assume which mode the user wants.
3. **Challenge.** Apply that mode's method. Read `~/.claude/skills/fool/modes.md` for the method, question banks, and templates; read only the section of the mode you picked.
4. **Engage.** Present the 3-5 strongest challenges. Stop and let the user respond before synthesizing.
5. **Synthesize.** Integrate what held up and what did not into a stronger position, then offer a second pass with a different mode.

## Mode selection

Ask with AskUserQuestion, one question, these options:

| Option | Method |
|--------|--------|
| Expose my assumptions | Socratic questioning - probe what is taken for granted |
| Argue the other side | Dialectic - build the strongest counter-argument, then a synthesis |
| Find the failure modes | Pre-mortem - start from "it failed, why", rank by likelihood and impact |
| Attack this | Red team - adversary personas, attack vectors, perverse incentives |
| Test the evidence | Falsification - extract claims, state what would disprove each, grade the evidence |
| You choose | Pick the mode that fits the risk: plan with weak evidence → test the evidence; plan with many unknowns → expose my assumptions; architecture choice → argue the other side; irreversible or expensive decision → find the failure modes; exposed surface or money → attack this |

The option labels are the user's answer. Do not ask a second question to refine the mode.

## The five modes

| Mode | Method | Output |
|------|--------|--------|
| Expose my assumptions | Socratic questioning: definitional, evidential, logical, perspective, consequence | Assumption inventory, probing questions by theme, suggested experiments |
| Argue the other side | Steel man, then the strongest antithesis, then a synthesis | Steelmanned thesis, antithesis, points of genuine conflict, proposed synthesis, confidence |
| Find the failure modes | Pre-mortem with second-order chains and early warning signs | Ranked failure narratives, warning signs, mitigations, inversion check |
| Attack this | Red team: who attacks this, how, and what they gain | Adversary profiles, ranked attack vectors, perverse incentives, defenses |
| Test the evidence | Falsificationism: claims, disproof criteria, evidence grades | Claims extracted, falsification criteria, evidence grades, competing explanations |

## Hard rules

- Steelman first. Attack the strongest version of the position, never a weaker one.
- 3-5 challenges, not 10. Depth beats breadth; a list of minor objections reads as noise.
- Every challenge names something concrete: a mechanism, a number, a file, a scenario. "What if it breaks" is not a challenge.
- Concede the points that hold up, out loud. The Fool that never concedes is a nuisance, not a critic.
- Never invent disagreements. If the position is sound, say so and name the residual risk.
- No synthesis, no output. Objections without a rebuilt position leave the user worse off.
- Stay inside the domain: never override real expertise with generic skepticism, and never invent a risk the codebase or the plan makes impossible.

## Output

```markdown
## Thesis (steelmanned)
<the position in its strongest form>
**Strongest evidence:** <1-2 points>

## Challenges
1. <strongest challenge> — <mechanism, number, or scenario>
2. ...
3. ...

## Your response
<ask the user to answer or push back here; wait for it before the synthesis>

## Synthesis
<position after the challenges, what was conceded, what changed>
**Confidence:** HIGH / MEDIUM / LOW / PIVOT
**Next step:** <the cheapest test of the riskiest assumption, or a second pass in another mode>
```

## Reference

`~/.claude/skills/fool/modes.md` - the five methods in detail: question banks, failure narrative templates, adversary personas, evidence grades, synthesis patterns. Read only the section of the mode in use.

Adapted from Jeffallan's `the-fool` (MIT). The upstream mode structure is kept; the methods were rewritten for this repo's style and for a model that must ask before it attacks.
