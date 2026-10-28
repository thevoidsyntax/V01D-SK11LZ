# The five modes

Read only the section of the mode in use.

## Expose my assumptions (Socratic)

Socratic questioning does not argue, it asks. The goal is a moment of "I had not thought of that". Every question must target a specific assumption.

### Question categories

| Category | Pattern | Example |
|----------|---------|---------|
| Definitional | "When you say X, what do you mean exactly?" | "Scalable - 10x users or 1000x?" |
| Evidential | "What evidence supports this?" | "Which data shows users want this?" |
| Logical | "Does X necessarily lead to Y?" | "Does caching necessarily improve the experience?" |
| Perspective | "How would <stakeholder> see this?" | "How does the on-call engineer feel about this schema?" |
| Consequential | "What becomes harder later?" | "Which future feature does this schema block?" |

### Signals that an assumption is hiding

| Phrase | What it hides |
|--------|---------------|
| "Obviously..." | never questioned |
| "Everyone knows..." | consensus never verified |
| "It just makes sense..." | the reasoning chain was never written down |
| "We always..." | a past pattern treated as optimal |
| "Users want..." | research missing or stale |
| "The standard approach is..." | convention never validated for this context |
| "It's simple..." | complexity underestimated |

### Technical question bank

- What are you optimizing for, and is that the right dimension?
- What is the simplest version that tests the core assumption?
- Which constraint are you treating as fixed that is actually flexible?
- How would you build this if it had to ship in a week?
- What is the most expensive thing to change later?

### Output

```markdown
## Assumption Inventory
| # | Assumption | Stated or hidden | Confidence |

## Probing Questions
### <theme>
1. <question aimed at assumption #X>

## Suggested Experiments
| Assumption | Experiment | Effort | Signal |
```

## Argue the other side (dialectic)

The dialectic does not win. It produces a position stronger than either side alone.

### Steel man

1. Strip the weak framing, keep the core claim.
2. Add the strongest evidence the user implied.
3. Name what is genuinely good about it.
4. Ask: "is this a fair restatement?"

Then build the antithesis as if a smart, informed person disagreed: the opposing trade-off, a hidden cost, an alternative that solves the same problem more cheaply, a precedent where it was tried and reverted, or a stakeholder the thesis does not serve.

Reductio works too, used sparingly - take the thesis to its limit to show the boundary of the principle ("then we would never ship, since bugs hurt DX").

### Synthesis patterns

| Pattern | Shape |
|---------|-------|
| Conditional | X when A holds, Y when B holds |
| Scope | X in domain A, Y in domain B |
| Temporal | start with X, move to Y when Z happens |
| Risk mitigation | do X, add the safeguard from Y |
| Hybrid | take the strongest element of each side |

### Confidence

| Level | Meaning |
|-------|---------|
| HIGH | the synthesis is clearly stronger than either side |
| MEDIUM | plausible but untested - name the riskiest assumption and a test for it |
| LOW | both sides hold, the trade-off is real - let the user decide by priority |
| PIVOT | the antithesis won - say so plainly |

### Failure modes of this mode

| Failure | Fix |
|---------|-----|
| False synthesis ("just do both") | name the exact trade-off being resolved |
| Weak antithesis | steel man the counter-argument too |
| Thesis bias | check the antithesis was genuinely engaged |
| Fence-sitting ("it depends") | name the condition for each path |

### Output

```markdown
## Thesis (steelmanned)
## Antithesis
## Points of Genuine Conflict
| Dimension | Thesis says | Antithesis says |
## Proposed Synthesis
**Pattern:** <one>
**Preserves:** <from the thesis>
**Incorporates:** <from the antithesis>
**Gives up:** <explicit trade-off>
**Confidence:** <HIGH | MEDIUM | LOW | PIVOT>
```

## Find the failure modes (pre-mortem)

Invert the question: "It is six months from now and this has failed. Why?" Failure becomes the starting point, which sidesteps optimism bias.

### Narrative construction

A failure narrative names a trigger, a number, the chain of events, who is affected. "It did not scale" is not a narrative; "at 50k concurrent users the pool was exhausted, requests timed out, and the breaker rejected all traffic for four minutes" is.

```markdown
**Failure: <title>**
It is <timeframe> from now. <trigger with a number>. That caused <first order>,
which led to <second order>. The team noticed when <detection point>,
by which time <consequence>. The root cause was <assumption that turned out wrong>.
```

### Second order

Trace at least two orders deep: trigger → first order → second order → third order.

| First order | Second order | Third order |
|-------------|-------------|------------|
| Feature ships late | Sales misses the quarter | Engineering loses trust, gets more oversight |
| Performance degrades | Users build workarounds | Workarounds become constraints on the next design |
| Key person leaves | Timeline slips | Overlap with the old system doubles the running cost |
| Data quality issue | Reports are wrong | Decisions get made on bad data |

### Inversion

Ask what would guarantee failure, then check whether any of it is already true: one person holding all the knowledge, no rollback plan, all-or-nothing deploy, untested at target scale, no buffer for unknowns, migration without validation, schema change without backward compatibility.

### Ranking

Rank by likelihood x impact. For each: the early warning sign (what you would see before it fails) and the mitigation (a concrete action, not "be careful").

### Output

```markdown
## Failure Modes (ranked)
### 1. <title> - likelihood, impact
**Narrative:** <the story>
**Warning sign:** <observable>
**Mitigation:** <action>
## Inversion check
**What would guarantee failure here:** <list>
**Already true:** <which of them>
```

## Attack this (red team)

Ask: "If someone wanted to break, exploit, or game this, how would they?" Not only attackers - competitors, careless users, regulators, and people gaming incentives are adversarial forces too.

### Adversary personas

| Persona | Motivation | Typical vectors |
|---------|-----------|-----------------|
| External attacker | money, data | API abuse, credential stuffing, injection |
| Opportunistic gamer | personal benefit | business logic loopholes, referral fraud, coupon replay |
| Careless user | none | misconfiguration, shared credentials |
| Disgruntled insider | revenge, money | privilege escalation, exfiltration |
| Competitor | market advantage | feature copying, talent poaching |
| Regulator | enforcement | data handling, audit gaps, accessibility |

Build two or three personas with role, motivation, capability, and access. Generic attackers give generic findings.

### Vectors

| Category | Example |
|----------|---------|
| Technical | injection, auth bypass, race condition, SSRF |
| Business logic | workflow bypass, state manipulation, price tampering |
| Social | phishing, pretexting, authority impersonation |
| Operational | supply chain, dependency poisoning, insider |
| Information | data leakage, metadata exposure, user enumeration by error message |
| Economic | resource exhaustion, denial of wallet, asymmetric cost |

### Perverse incentives

Ask what the design rewards that you did not intend: how will people game it, what is the cheapest way to get the reward without the effort, if we measure X what gets sacrificed, who benefits when this fails.

### Output

```markdown
## Red Team: <target>
### Asset under assessment
### Adversary profiles
### Attack vectors (ranked)
| # | Vector | Adversary | Likelihood | Impact |
### Perverse incentives
| Incentive created | Unintended behavior | Severity |
### Defenses
| Vector | Defense | Effort | Priority |
```

## Test the evidence (falsification)

A claim only means something if you can say what would disprove it. The goal is not to disprove - it is to find out whether the evidence supports the conclusion.

### Claim types

Causal, predictive, comparative, existential, universal, quantitative. One sentence often hides three claims: "the pilot cut deploy time by 60%" assumes the pilot is representative, assumes the tool caused the drop, and assumes the drop holds at scale.

### Falsification criteria

| Claim | What would disprove it | Test |
|-------|----------------------|------|
| Users want feature X | fewer than 10% engage within 30 days | flag it, measure adoption |
| This scales to 100k users | response time over 500ms at 50k | load test at target scale |
| Migration takes 3 months | more than 2 unknowns found in month 1 | count surprises in the first phase |
| Framework X is faster | benchmark under 5% difference | controlled benchmark on real workload |

Red flags: vague outcomes ("improve things"), moving goalposts ("eventually"), circular claims ("the best because experts say so"), unfalsifiable hedges ("might help in some cases"). For each, ask for a measurable outcome and a time boundary.

### Evidence grades

| Grade | What it is |
|-------|-----------|
| A | controlled experiment, large sample, reproducible |
| B | observational data, reasonable sample, consistent with other evidence |
| C | case study, small sample, single source |
| D | anecdote, opinion, vendor material |
| F | no evidence cited |

Weak patterns: survivorship bias, cherry-picked metrics, vendor benchmarks, appeal to authority, anchoring on an industry average.

### Competing explanations

For every conclusion ask what else explains the same evidence: what else changed at the same time, what was retired, what did the team get better at. Then say which explanation fits best and why.

### Output

```markdown
## Evidence Audit: <proposal>
### Claims
| # | Claim | Type | Evidence cited |
### Falsification criteria
| Claim | What would disprove it | How to test |
### Evidence grades
| Claim | Grade | Why |
### Competing explanations
### Weakest link
**The claim everything else rests on:** <claim>
**Test it by:** <cheapest experiment>
```
