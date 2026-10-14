---
name: claude-ai
version: "1.0.0"
description: "Claude API patterns, tool use, multi-turn conversations, and Claude-specific features."
when_to_use: "When using Claude API, implementing tool use, or building Claude-powered applications."
priority: high
phase: any
category: [ai-ml]
tech_stack:
  services: [anthropic]
scale: [small, medium, large]
auto_invoke:
  enabled: false
  conditions:
    - pattern: ["anthropic", "@anthropic-ai/sdk", "claude", "claude-3", "claude api"]
      reason: "Claude API usage detected"
capabilities:
  - tool-use
  - multi-turn
  - vision
author: TheVoidSyntax
---

# CLAUDE API v1.0 🎯

**Claude API patterns, tool use, multi-turn conversations, and Claude-specific features**

---

## Quick Reference

```
┌─────────────────────────────────────────────────────────────┐
│  CLAUDE MODELS                                              │
├─────────────────────────────────────────────────────────────┤
│  Claude 3.5 Sonnet → Latest, best for coding               │
│  Claude 3 Opus   → Most capable, complex reasoning          │
│  Claude 3 Haiku → Fastest, cheapest                       │
│  Claude 3.5 Haiku → Balance of speed and capability      │
└─────────────────────────────────────────────────────────────┘
```

---

## Client Setup

### Anthropic SDK

```typescript
// lib/claude.ts
import Anthropic from '@anthropic-ai/sdk';

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Or using fetch directly
export async function createClaudeMessage(
  messages: Anthropic.MessageParam[],
  tools?: Anthropic.Tool[]
) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      messages,
      tools,
      max_tokens: 1024,
    }),
  });
  return response.json();
}
```

---

## Basic Messages

### Simple Chat

```typescript
const message = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  messages: [
    {
      role: 'user',
      content: 'Hello, how are you?',
    },
  ],
});

console.log(message.content[0].type === 'text' ? message.content[0].text : '');
```

### Multi-turn Conversation

```typescript
const conversation: Anthropic.MessageParam[] = [
  {
    role: 'user',
    content: 'What is the capital of France?',
  },
  {
    role: 'assistant',
    content: 'The capital of France is Paris.',
  },
  {
    role: 'user',
    content: 'What is its population?',
  },
];

const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  messages: conversation,
});
```

---

## Tool Use

### Define Tools

```typescript
const tools: Anthropic.Tool[] = [
  {
    name: 'get_weather',
    description: 'Get current weather for a location',
    input_schema: {
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
    name: 'search_database',
    description: 'Search the product database',
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query',
        },
        limit: {
          type: 'number',
          description: 'Maximum results',
        },
      },
      required: ['query'],
    },
  },
];
```

### Use Tools

```typescript
const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  messages: [
    {
      role: 'user',
      content: 'What is the weather in Tokyo?',
    },
  ],
  tools,
});

// Check for tool use
if (response.stop_reason === 'tool_use') {
  for (const content of response.content) {
    if (content.type === 'tool_use') {
      console.log(`Using tool: ${content.name}`);
      console.log(`Input: ${JSON.stringify(content.input)}`);

      // Execute tool
      let result;
      if (content.name === 'get_weather') {
        result = await getWeather(
          content.input.location,
          content.input.unit
        );
      }

      // Add result back to conversation
      const toolResult: Anthropic.MessageParam = {
        role: 'user',
        content: [
          {
            type: 'tool_result',
            tool_use_id: content.id,
            content: JSON.stringify(result),
          },
        ],
      };

      // Continue conversation
      const finalResponse = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [...conversation, { role: 'user', content: 'What is the weather in Tokyo?' }, ...response.content, toolResult],
        tools,
      });
    }
  }
}
```

---

## Vision (Image Analysis)

```typescript
import { readFileSync } from 'fs';

// Read image as base64
const imageData = readFileSync('./image.png').toString('base64');

const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: 'image/png',
            data: imageData,
          },
        },
        {
          type: 'text',
          text: 'What is in this image?',
        },
      ],
    },
  ],
});

console.log(response.content[0].text);
```

---

## Streaming

```typescript
const stream = await anthropic.messages.stream({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  messages: [
    {
      role: 'user',
      content: 'Write a short story about a robot',
    },
  ],
});

for await (const event of stream) {
  if (event.type === 'content_block_delta') {
    if (event.delta.type === 'text_delta') {
      process.stdout.write(event.delta.text);
    }
  }
}
```

---

## System Prompt

```typescript
const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  system: `You are an expert code reviewer. Your role:
- Review code for security vulnerabilities
- Check for performance issues
- Suggest improvements
- Always be constructive and helpful`,
  messages: [
    {
      role: 'user',
      content: 'Review this function for issues',
    },
  ],
});
```

---

## Best Practices

### 1. Use Appropriate Models

```typescript
// ✅ Good - use Sonnet for coding
const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022', // Best for coding
  // ...
});

// ✅ Use Haiku for simple tasks
const response = await anthropic.messages.create({
  model: 'claude-3-5-haiku-20241022', // Fastest, cheapest
  // ...
});
```

### 2. Handle Tool Errors

```typescript
try {
  const result = await executeTool(toolCall);
} catch (error) {
  // Return error to Claude
  return {
    role: 'user',
    content: [{
      type: 'tool_result',
      tool_use_id: toolCall.id,
      content: `Error: ${error.message}`,
      is_error: true,
    }],
  };
}
```

### 3. Manage Conversation Length

```typescript
// Truncate old messages to fit context window
function truncateConversation(
  messages: Anthropic.MessageParam[],
  maxTokens: number
): Anthropic.MessageParam[] {
  // Calculate total tokens (rough estimate: 4 chars = 1 token)
  let totalTokens = messages.reduce(
    (sum, msg) => sum + msg.content.toString().length / 4,
    0
  );

  // Remove oldest messages until under limit
  while (totalTokens > maxTokens && messages.length > 2) {
    const removed = messages.shift();
    totalTokens -= removed.content.toString().length / 4;
  }

  return messages;
}
```

---

## Common Patterns

### Code Generation

```typescript
const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 2048,
  system: `You are an expert TypeScript developer.
Generate clean, well-typed code.
Include JSDoc comments for complex logic.`,
  messages: [
    {
      role: 'user',
      content: `Create a function that:
1. Takes an array of numbers
2. Returns the sum
3. Handles empty arrays`,
    },
  ],
});
```

### Data Extraction

```typescript
const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  messages: [
    {
      role: 'user',
      content: `Extract from this text:
Name: John Doe
Email: john@example.com
Phone: 555-1234

Return as JSON with keys: name, email, phone`,
    },
  ],
});

const data = JSON.parse(response.content[0].text);
```

---

## Cost Optimization

### Estimate Tokens

```typescript
// Rough estimation: ~4 characters per token
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// Budget for response
const maxTokens = 1024; // ~4000 chars
const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: maxTokens,
  messages,
});
```

---

## Related Skills

| Skill | Use Case |
|-------|----------|
| `/openai` | OpenAI API patterns |
| `/llm-evaluation` | LLM evaluation |
| `/rag-architect` | RAG patterns |

---

*Build with Claude!*
