---
name: llm-evaluation
description: "LLM evaluation frameworks, benchmark design, and quality metrics for AI applications"
when_to_use: "Use when evaluating an LLM app: benchmarks, quality metrics, or eval harnesses."
version: "1.0.0"
category: [ai-process]
priority: high
phase: any
tech_stack:
  languages: [python, typescript]
  frameworks: [langchain, llama-index]
scale: [small, medium, large]
auto_invoke:
  enabled: false
  conditions:
    - phrase: ["llm evaluation", "ai evaluation", "model benchmark"]
      reason: "LLM evaluation detected"
  skill_tier: optional
triggers:
  phrases:
    - "llm evaluation"
    - "ai evaluation"
    - "model benchmark"
    - "prompt evaluation"
    - "response quality"
    - "hallucination"
capabilities: [analysis, review]
quality:
  rules_count: 15
  examples_count: 10
  stability: stable
integrates_with: [rag-architect, ml-pipeline]
dependencies: []
source:
  origin: merged
  sources: ["Jeffallan/claude-skills", "wshobson/agents"]
author: thevoidsyntax
---

# LLM Evaluation - AI Application Quality Assurance

Comprehensive framework for evaluating LLM applications including response quality, hallucination detection, benchmark design, and production monitoring.

## Core Workflow

1. **Define Metrics** — Identify what "good" looks like
2. **Create Benchmarks** — Design test datasets
3. **Run Evaluation** — Execute automated and human evaluations
4. **Analyze Results** — Identify failure modes
5. **Iterate** — Improve prompts and pipelines

## Evaluation Metrics

### Task-Specific Metrics

```python
# Exact Match (for classification)
def exact_match(prediction: str, reference: str) -> float:
    return 1.0 if prediction.strip() == reference.strip() else 0.0

# F1 Score (for NER, tagging)
from sklearn.metrics import f1_score
f1 = f1_score(y_true, y_pred, average="macro")

# BLEU/ROUGE (for text generation)
from nltk.translate.bleu_score import sentence_bleu
bleu = sentence_bleu(reference, hypothesis)

# BERTScore (semantic similarity)
from bert_score import score
P, R, F1 = score([hypothesis], [reference], lang="en")
```

### LLM-as-Judge

```python
from anthropic import Anthropic

def llm_judge_eval(question: str, response: str) -> dict:
    client = Anthropic()
    
    response = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=1024,
        system="""You are an expert evaluator. Rate the response on:
- Accuracy (1-5)
- Helpfulness (1-5)
- Safety (1-5)

Return JSON with scores and reasoning."""",
        messages=[{
            "role": "user",
            "content": f"Question: {question}\n\nResponse: {response}"
        }]
    )
    
    return parse_json(response.content[0].text)
```

## RAG Evaluation

```python
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall,
)
from datasets import Dataset

# Create test dataset
test_data = {
    "question": ["What is RAG?", "How to optimize queries?"],
    "answer": ["RAG is...", "Query optimization..."],
    "contexts": [["RAG context..."], ["Optimization context..."]],
    "ground_truth": ["RAG definition", "Optimization tips"]
}

dataset = Dataset.from_dict(test_data)

# Evaluate
result = evaluate(dataset, metrics=[
    faithfulness,
    answer_relevancy,
    context_precision,
])

print(result)
```

## Hallucination Detection

```python
# Self-consistency check
def detect_hallucination(response: str, context: str) -> dict:
    claims = extract_claims(response)
    verified = []
    hallucinated = []
    
    for claim in claims:
        if claim_in_context(claim, context):
            verified.append(claim)
        else:
            hallucinated.append(claim)
    
    return {
        "verified": verified,
        "hallucinated": hallucinated,
        "hallucination_rate": len(hallucinated) / len(claims) if claims else 0
    }

def extract_claims(text: str) -> list:
    # Use LLM to extract factual claims
    prompt = f"Extract all factual claims from: {text}"
    return llm_extract(prompt).claims
```

## Benchmark Design

```python
from dataclasses import dataclass

@dataclass
class BenchmarkCase:
    input: str
    expected_output: str
    metadata: dict
    difficulty: str  # easy, medium, hard
    category: str

# Create benchmark
BENCHMARK_CASES = [
    BenchmarkCase(
        input="What is the capital of France?",
        expected_output="Paris",
        metadata={"domain": "general", "type": "factual"},
        difficulty="easy",
        category="knowledge",
    ),
    # ... more cases
]

def run_benchmark(model, cases: list[BenchmarkCase]) -> dict:
    results = []
    for case in cases:
        response = model.predict(case.input)
        score = evaluate_single(response, case.expected_output)
        results.append({**case.__dict__, "score": score, "response": response})
    return aggregate_results(results)
```

## Prompt Injection Testing

```python
def test_prompt_injection(llm, adversarial_inputs: list) -> dict:
    """Test for prompt injection vulnerabilities"""
    results = {
        "total": len(adversarial_inputs),
        "compromised": 0,
        "detected": 0,
        "failed": 0,
    }
    
    for input_text in adversarial_inputs:
        response = llm.generate(input_text)
        
        if contains_malicious_pattern(response):
            results["detected"] += 1
        elif was_injection_successful(input_text, response):
            results["compromised"] += 1
        else:
            results["failed"] += 1
    
    return results
```

## Regression Testing

```python
import difflib

def regression_test(
    current: str, 
    previous: str, 
    threshold: float = 0.9
) -> dict:
    """Detect regressions in model responses"""
    
    similarity = difflib.SequenceMatcher(
        None, current, previous
    ).ratio()
    
    if similarity < threshold:
        return {
            "passed": False,
            "similarity": similarity,
            "changes": generate_diff(previous, current),
        }
    
    return {"passed": True, "similarity": similarity}
```

## Essential Practices

### MUST DO
- Define clear evaluation criteria before building
- Use both automated and human evaluation
- Test for edge cases and adversarial inputs
- Monitor for hallucination in production
- Implement regression testing for prompt changes
- Use LLM-as-Judge for subjective evaluation

### MUST NOT DO
- Evaluate only on happy path
- Skip production monitoring
- Rely on single metric
- Ignore user feedback loops
- Deploy without A/B testing

---

**Invoke:** `/llm-evaluation` | **Version:** 1.0.0
