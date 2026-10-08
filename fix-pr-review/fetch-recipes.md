# Fetch Recipes

This document contains reusable patterns for fetching data from external sources.

## API Fetch Pattern

```typescript
async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  retries = 3
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
    }
  }
  throw new Error('Unreachable');
}
```

## TODO: Expand with more recipes
