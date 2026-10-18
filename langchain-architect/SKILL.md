---
name: langchain-architect
description: "LangChain framework architecture, chains, agents, memory, and RAG implementations"
when_to_use: "Use when building LLM apps with LangChain: chains, agents, memory, or RAG."
version: "1.0.0"
category: [ai-process]
priority: high
phase: any
tech_stack:
  languages: [python]
  frameworks: [langchain, llama-index]
scale: [small, medium, large]
auto_invoke:
  enabled: false
  conditions:
    - phrase: ["langchain", "llm app", "chain", "agent"]
      reason: "LangChain detected"
  skill_tier: optional
triggers:
  phrases:
    - "langchain"
    - "llm app"
    - "chain"
    - "agent"
    - "chatbot"
capabilities: [implementation]
quality:
  rules_count: 15
  examples_count: 15
  stability: stable
integrates_with: [rag-architect, llm-evaluation]
dependencies: [rag-architect]
source:
  origin: merged
  sources: ["wshobson/agents"]
author: thevoidsyntax
---

# LangChain Architect - LLM Application Framework

Design and implement production-grade LLM applications using LangChain framework covering chains, agents, memory, tools, and RAG implementations.

## Core Workflow

1. **Define Use Case** — Identify LLM application requirements
2. **Design Chain** — Design conversation flow and tools
3. **Implement** — Build with LangChain components
4. **Add Memory** — Implement conversation history
5. **Deploy** — Serve with monitoring

## Basic Chain

```python
from langchain_openai import ChatOpenAI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate

# Initialize model
llm = ChatOpenAI(model="gpt-4", temperature=0)

# Define prompt
prompt = PromptTemplate(
    input_variables=["topic"],
    template="Explain {topic} to a 5 year old in 3 sentences."
)

# Create chain
chain = LLMChain(llm=llm, prompt=prompt)

# Run
result = chain.run(topic="quantum computing")
print(result)
```

## RAG Chain

```python
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain.chains import RetrievalQA
from langchain_community.llms import OpenAI

# Setup vector store
embeddings = OpenAIEmbeddings()
vectorstore = Chroma(
    persist_directory="db",
    embedding_function=embeddings
)

# Create retriever
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

# Create QA chain
qa_chain = RetrievalQA.from_chain_type(
    llm=OpenAI(),
    chain_type="stuff",
    retriever=retriever,
    return_source_documents=True
)

# Run
result = qa_chain({"query": "What is LangChain?"})
```

## Agents

```python
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain.tools import Tool
from langchain_openai import ChatOpenAI

# Define tools
tools = [
    Tool(
        name="calculator",
        func=lambda x: str(eval(x)),
        description="Useful for math calculations"
    ),
    Tool(
        name="search",
        func=lambda x: search_engine(x),
        description="Useful for searching the web"
    ),
]

# Create agent
llm = ChatOpenAI(model="gpt-4", temperature=0)
agent = create_openai_functions_agent(llm, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

# Run
result = executor.invoke({
    "input": "What is 25 * 17 plus the current year?"
})
```

## Memory

```python
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain

# Create memory
memory = ConversationBufferMemory(
    memory_key="history",
    return_messages=True,
    output_key="response"
)

# Create conversational chain
conversation = ConversationChain(
    llm=ChatOpenAI(model="gpt-4"),
    memory=memory,
    verbose=True
)

# Chat
conversation.predict(input="My name is John")
conversation.predict(input="What is my name?")  # Returns: John
```

## Tool Integration

```python
from langchain.tools import StructuredTool
from pydantic import BaseModel

class WeatherInput(BaseModel):
    location: str
    unit: str = "celsius"

def get_weather(location: str, unit: str = "celsius") -> str:
    """Get current weather for a location."""
    # Call weather API
    return f"The weather in {location} is 22 degrees {unit}"

weather_tool = StructuredTool(
    name="weather",
    description="Get current weather for a location",
    func=get_weather,
    args_schema=WeatherInput
)
```

## Streaming

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4", streaming=True)

# Stream response
for chunk in llm.stream("Write a haiku about coding"):
    print(chunk.content, end="", flush=True)
```

## Essential Practices

### MUST DO
- Use structured output (Pydantic) for tool inputs
- Implement error handling for API failures
- Add conversation memory for multi-turn interactions
- Use streaming for better UX
- Monitor token usage and costs
- Implement rate limiting

### MUST NOT DO
- Trust LLM output without validation
- Store sensitive data in memory without encryption
- Use single prompt for complex tasks
- Skip error handling for API failures
- Hardcode API keys

## Production Patterns

```python
# Async for high throughput
from langchain_openai import ChatOpenAI
import asyncio

async def process_batch(queries: list):
    llm = ChatOpenAI(model="gpt-4")
    
    tasks = [llm.agenerate([query]) for query in queries]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    return [r.content if not isinstance(r, Exception) else str(r) for r in results]
```

---

**Invoke:** `/langchain-architect` | **Version:** 1.0.0
