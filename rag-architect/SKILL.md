---
name: rag-architect
description: "RAG systems design with vector databases, embeddings, hybrid search, and retrieval quality evaluation"
version: "1.1.0"
category: [ai-process]
priority: high
phase: any
tech_stack:
  languages: [python, typescript]
  frameworks: [langchain, llama-index]
  services: [openai, qdrant, pinecone, weaviate]
scale: [small, medium, large]
auto_invoke:
  enabled: false
  conditions:
    - phrase: ["rag", "retrieval augmented", "vector database", "embedding", "semantic search"]
      reason: "RAG system detected"
  skill_tier: optional
triggers:
  phrases:
    - "rag"
    - "vector store"
    - "vector database"
    - "embeddings"
    - "semantic search"
    - "retrieval"
    - "llm"
capabilities: [implementation, analysis]
quality:
  rules_count: 20
  examples_count: 15
  stability: stable
integrates_with: [ml-pipeline, data-engineering]
dependencies: []
source:
  origin: external
  sources: ["Jeffallan/claude-skills:rag-architect"]
author: Jeffallan
---

# RAG Architect - Retrieval-Augmented Generation Systems

Design and implement production-grade RAG (Retrieval-Augmented Generation) systems covering document chunking, embedding generation, vector store configuration, hybrid search pipelines, reranking, and retrieval quality evaluation.

## Core Workflow

1. **Requirements Analysis** — Identify retrieval needs, latency constraints, accuracy requirements, and scale
2. **Vector Store Design** — Select database, schema design, indexing strategy, sharding approach
3. **Chunking Strategy** — Document splitting, overlap, semantic boundaries, metadata enrichment
4. **Retrieval Pipeline** — Embedding selection, query transformation, hybrid search, reranking
5. **Evaluation & Iteration** — Metrics tracking, retrieval debugging, continuous optimization

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Documents  │────►│  Chunking   │────►│  Embedding  │
└─────────────┘     └─────────────┘     └─────────────┘
                                                │
                                                ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│     LLM     │◄────│  Reranking  │◄────│   Vector    │
│  (Response) │     │   (Cohere)  │     │    Store    │
└─────────────┘     └─────────────┘     └─────────────┘
       ▲
       │ Query
┌─────────────┐     ┌─────────────┐
│    User     │────►│   Query     │
│   Query     │     │ Transform   │
└─────────────┘     └─────────────┘
```

## Key Implementation Areas

### Chunking Strategy
```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Domain-specific chunk sizes (NOT default 512)
splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,      # Domain-dependent
    chunk_overlap=100,   # Preserve context
    separators=["\n\n", "\n", ". ", " ", ""],
    length_function=len,
)

# For code: use language-aware splitting
# For legal: larger chunks with higher overlap
# For chat: smaller chunks for precision
```

### Embeddings & Vector Store
```python
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_qdrant import Qdrant

# Generate embeddings
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

# Store with deterministic IDs for idempotent upserts
vector_store = Qdrant.from_documents(
    documents=chunks,
    embedding=embeddings,
    collection_name="my_collection",
    url="http://localhost:6333",
    force_recreate=False,
)

# Search with metadata filtering
results = vector_store.similarity_search(
    query="user query",
    filter={"category": "documentation"},
    k=5,
)
```

### Hybrid Search
```python
from langchain.retrievers import EnsembleRetriever

# Combine dense vector search with BM25 sparse retrieval
vector_retriever = vector_store.as_retriever(search_kwargs={"k": 10})
bm25_retriever = BM25Retriever.from_documents(documents)

# Reciprocal Rank Fusion
ensemble = EnsembleRetriever(
    retrievers=[bm25_retriever, vector_retriever],
    weights=[0.3, 0.7],  # Weighted fusion
)
```

### Reranking
```python
from cohere import Client as CohereClient

cohere_client = CohereClient(api_key=os.environ["COHERE_API_KEY"])

def rerank_results(query: str, results: list, top_k: int = 5):
    response = cohere_client.rerank(
        query=query,
        documents=[r.page_content for r in results],
        top_n=top_k,
        model="rerank-english-v2.0",
    )
    return [results[r.index] for r in response.results]
```

## Evaluation Metrics

```python
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall,
)

# Run evaluation
result = evaluate(
    dataset=test_dataset,
    metrics=[faithfulness, answer_relevancy],
)
```

| Metric | Target | Description |
|--------|--------|-------------|
| Context Precision | > 0.8 | Relevant docs ranked highly |
| Context Recall | > 0.85 | All relevant docs retrieved |
| Faithfulness | > 0.9 | Response matches context |
| Answer Relevancy | > 0.85 | Response answers query |

## Essential Practices

### MUST DO
- Evaluate multiple embedding models on domain data
- Implement hybrid search (vector + keyword)
- Add metadata filters for multi-tenant retrieval
- Measure retrieval metrics (precision@k, recall@k, MRR, NDCG)
- Use reranking for top-k results
- Implement idempotent ingestion with deduplication
- Monitor retrieval latency and quality

### MUST NOT DO
- Use default chunk size without evaluation
- Skip metadata enrichment
- Use cosine similarity alone for complex retrieval
- Deploy without production-like testing
- Ignore query expansion/rewriting

## Deliverables

When designing RAG architecture, provide:
1. System architecture diagram (ingestion + retrieval pipelines)
2. Vector database selection with trade-off analysis
3. Chunking strategy with examples and rationale
4. Retrieval pipeline design (query → results flow)
5. Evaluation plan with metrics and pass/fail thresholds

---

**Invoke:** `/rag-architect` | **Version:** 1.1.0
