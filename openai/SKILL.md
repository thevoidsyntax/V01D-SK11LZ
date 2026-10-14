---
name: openai
version: "1.0.0"
description: "OpenAI API patterns, chat completions, function calling, and embeddings."
when_to_use: "When using OpenAI API, implementing chat interfaces, function calling, or embeddings."
priority: high
phase: any
category: [ai-ml]
tech_stack:
  services: [openai]
scale: [small, medium, large]
auto_invoke:
  enabled: false
  conditions:
    - pattern: ["openai", "@openai", "ChatCompletion", "gpt-4", "dall-e"]
      reason: "OpenAI API usage detected"
capabilities:
  - chat-completions
  - function-calling
  - embeddings
author: TheVoidSyntax
---

# OPENAI API v1.0 🤖

**OpenAI API patterns, chat completions, function calling, and embeddings**

---

## Quick Reference

```
┌─────────────────────────────────────────────────────────────┐
│  OPENAI MODELS                                              │
├─────────────────────────────────────────────────────────────┤
│  GPT-4o        → Latest flagship, multimodal               │
│  GPT-4 Turbo   → Fast, capable GPT-4                     │
│  GPT-3.5 Turbo → Cheap, fast for simple tasks           │
│  DALL-E 3      → Image generation                        │
│  Whisper        → Speech to text                          │
│  Embeddings     → Text vectorization                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Client Setup

### OpenAI SDK

```typescript
// lib/openai.ts
import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID, // optional
});

// Or using fetch directly
export async function createChatCompletion(messages: OpenAI.Chat.ChatCompletionMessageParam[]) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages,
    }),
  });
  return response.json();
}
```

---

## Chat Completions

### Basic Chat

```typescript
// Simple chat
const completion = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello, how are you?' },
  ],
});

console.log(completion.choices[0].message.content);
```

### With Parameters

```typescript
// Chat with parameters
const completion = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: 'You are a coding assistant.' },
    { role: 'user', content: 'Write a TypeScript function to sum numbers' },
  ],
  temperature: 0.7, // 0-2, lower = more focused
  max_tokens: 500, // Max tokens in response
  top_p: 0.9, // Nucleus sampling
  frequency_penalty: 0.0, // Reduce repetition
  presence_penalty: 0.0, // Encourage new topics
  stop: ['```'], // Stop sequences
});
```

### Streaming

```typescript
// Streaming response
const stream = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Write a story about a robot' }],
  stream: true,
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) {
    process.stdout.write(content);
  }
}
```

---

## Function Calling

### Define Functions

```typescript
const functions: OpenAI.Chat.ChatCompletionCreateParams.Function[] = [
  {
    name: 'get_weather',
    description: 'Get the current weather for a location',
    parameters: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'City name, e.g., San Francisco',
        },
        unit: {
          type: 'string',
          enum: ['celsius', 'fahrenheit'],
          description: 'Temperature unit',
        },
      },
      required: ['location'],
    },
  },
  {
    name: 'search_products',
    description: 'Search for products in the catalog',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query',
        },
        limit: {
          type: 'number',
          description: 'Maximum results to return',
        },
      },
      required: ['query'],
    },
  },
];
```

### Use Function Calling

```typescript
const completion = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'What is the weather in Tokyo?' }],
  tools: functions.map(f => ({ type: 'function', function: f })),
});

const message = completion.choices[0].message;

// Check if function was called
if (message.tool_calls) {
  for (const toolCall of message.tool_calls) {
    const functionName = toolCall.function.name;
    const args = JSON.parse(toolCall.function.arguments);

    console.log(`Calling ${functionName} with args:`, args);

    // Execute function
    let result;
    if (functionName === 'get_weather') {
      result = await getWeather(args.location, args.unit);
    } else if (functionName === 'search_products') {
      result = await searchProducts(args.query, args.limit);
    }

    console.log('Result:', result);
  }
}
```

### Complete with Function Result

```typescript
// Continue conversation with function result
const completionWithResult = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'user', content: 'What is the weather in Tokyo?' },
    message, // The function call message
    {
      role: 'tool',
      tool_call_id: message.tool_calls[0].id,
      content: JSON.stringify({ temp: 22, condition: 'Sunny' }),
    },
  ],
  tools: functions.map(f => ({ type: 'function', function: f })),
});

console.log(completionWithResult.choices[0].message.content);
// "The weather in Tokyo is currently sunny with a temperature of 22°C."
```

---

## Embeddings

### Create Embedding

```typescript
// Generate embedding
const embedding = await openai.embeddings.create({
  model: 'text-embedding-3-small', // or 'text-embedding-3-large'
  input: 'The food was delicious and the service was excellent.',
});

const vector = embedding.data[0].embedding;
console.log(`Embedding dimension: ${vector.length}`); // 1536 for small
```

### Cosine Similarity

```typescript
// Calculate cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (normA * normB);
}

// Search documents
const queryEmbedding = await openai.embeddings.create({
  model: 'text-embedding-3-small',
  input: searchQuery,
});

const results = documents.map(doc => ({
  document: doc,
  similarity: cosineSimilarity(queryEmbedding.data[0].embedding, doc.embedding),
})).sort((a, b) => b.similarity - a.similarity);
```

---

## Image Generation

### DALL-E 3

```typescript
// Generate image
const image = await openai.images.generate({
  model: 'dall-e-3',
  prompt: 'A beautiful sunset over the ocean with seagulls flying',
  n: 1,
  size: '1024x1024',
  quality: 'standard', // or 'hd'
  style: 'vivid', // or 'natural'
});

// Get image URL
console.log(image.data[0].url);

// Save to file
const fs = await import('fs');
const imageResponse = await fetch(image.data[0].url!);
const buffer = await imageResponse.arrayBuffer();
fs.writeFileSync('image.png', Buffer.from(buffer));
```

### Image Editing

```typescript
// Edit image (inpaint)
const edited = await openai.images.edit({
  model: 'dall-e-2',
  image: fs.readFileSync('original.png'),
  mask: fs.readFileSync('mask.png'),
  prompt: 'Replace the sky with a starry night',
  n: 1,
  size: '1024x1024',
});
```

---

## Vision API

```typescript
// Analyze image
const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'What is in this image?',
        },
        {
          type: 'image_url',
          image_url: {
            url: 'https://example.com/image.jpg',
            detail: 'low', // 'low', 'high', 'auto'
          },
        },
      ],
    },
  ],
});

console.log(response.choices[0].message.content);
```

---

## Best Practices

### 1. Use System Prompts

```typescript
// ✅ Good - clear system prompt
const completion = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    {
      role: 'system',
      content: `You are an expert code reviewer.
- Focus on security issues
- Check for performance problems
- Suggest improvements
- Format responses in markdown`,
    },
    { role: 'user', content: userMessage },
  ],
});
```

### 2. Handle Rate Limits

```typescript
// Retry with backoff
async function withRetry(fn: () => Promise<T>, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429) {
        const delay = Math.pow(2, i) * 1000;
        await sleep(delay);
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
}
```

### 3. Token Counting

```typescript
// Use tiktoken for accurate counting
import tiktoken from 'tiktoken';

const enc = tiktoken.encoding_for_model('gpt-4o');
const tokens = enc.encode('Hello, world!');
console.log(`Tokens: ${tokens.length}`); // ~4 tokens
enc.free();
```

---

## Cost Optimization

### Use Appropriate Models

```typescript
// ✅ Good - use cheaper model for simple tasks
if (isSimpleQuery(message)) {
  response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo', // 10x cheaper for simple tasks
    messages: [{ role: 'user', content: message }],
  });
} else {
  response = await openai.chat.completions.create({
    model: 'gpt-4o', // Use powerful model for complex tasks
    messages: [{ role: 'user', content: message }],
  });
}
```

### Batch Processing

```typescript
// Process multiple requests efficiently
const results = await Promise.all(
  items.map(item => openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: item.prompt }],
  }))
);
```

---

## Related Skills

| Skill | Use Case |
|-------|----------|
| `/llm-evaluation` | LLM evaluation |
| `/rag-architect` | RAG architecture |
| `/langchain-architect` | LangChain patterns |

---

*Build AI-powered applications!*
