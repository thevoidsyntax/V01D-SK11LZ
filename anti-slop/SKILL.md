---
name: anti-slop
description: "Writing that does not read as AI-generated: the tells to remove, plain replacements, rules for UI copy, comments and docs, and a self-check"
when_to_use: "Use when writing anything a person will read: UI copy, docs, README, CHANGELOG, commit messages, code comments, or replies. Hexa loads it for UI copy, Vika for all docs."
metadata:
  version: "2.0.0"
---

# Anti-slop: writing that does not read as AI-generated

Default model prose has recognizable tells: warm openers, inflated words, three-item lists, a summary at the end of every paragraph. Readers notice them and trust the text less. This skill lists the tells and what to write instead. The rules apply in English and Indonesian alike.

## 1. Words and phrases

| Tell | Write instead |
|------|---------------|
| Openers: "Certainly!", "Great question", "I'd be happy to", "Tentu saja!", "Baik, berikut adalah…" | Start with the answer or the action |
| Closers: "In conclusion", "I hope this helps", "Let me know if…", "Semoga membantu", "Dengan demikian" | Stop after the last useful sentence |
| Inflated words: leverage, robust, seamless, delve, utilize, comprehensive, cutting-edge, empower, unlock, elevate, streamline, "solusi komprehensif" | The plain word (use, reliable, easy, look at, full), or the concrete fact the adjective stands for |
| Filler: "It is important to note that", "It's worth mentioning", "In order to", "The fact that", "Perlu diketahui bahwa" | Cut it, or "to" for "in order to" |
| Signposting: "Let's dive in", "Here's a breakdown", "Mari kita bahas" | Do the thing without announcing it |
| Hedge stacks: "may potentially", "could possibly help to" | One hedge, and only when you really are unsure |
| Mirroring the question back before answering | Answer it |

## 2. Structure

- **Rule of three on autopilot.** Three adjectives, three bullets, three examples, whether or not there are three things. Use the real count.
- **Summary sentences.** A paragraph that ends by restating itself. Delete the restatement.
- **Format for its own sake.** Headings and bullets around two sentences of content. Write the two sentences.
- **Bold everywhere.** Bold only what a skimming reader must not miss, at most once per paragraph.
- **Repeated contrast frames.** "Not just X, but Y", "It's not about X, it's about Y". Say Y.
- **Emoji as section markers or bullets.** Leave them out unless the product voice uses them.

## 3. UI copy

- Say what it does and for whom, in the user's words. "Catat stok masuk dari supplier" beats "Kelola inventaris dengan mudah dan efisien".
- Buttons are verb + object: "Simpan produk", "Kirim pesanan". Avoid "Submit", "Get Started", "Pelajari lebih lanjut" when a specific action exists.
- Errors say what happened and what to do next: "Nomor HP harus 10–13 digit" instead of "Input tidak valid".
- Empty states say why the screen is empty and offer the next action.
- No claims the product cannot back up: "fast", "secure", "trusted by thousands", fake numbers or testimonials.
- Match the audience's register. A neighbourhood shop speaks differently from a bank.

## 4. Code comments

Explain why, not what. The code already says what.

```typescript
// Avoid: restates the code
// This function validates the user credentials and returns a token
function authenticate(creds: Credentials): Token { /* ... */ }

// Use: the reason a reader could not guess
// Constant-time compare: a plain === leaks the hash prefix through timing
function authenticate(creds: Credentials): Token { /* ... */ }
```

No comment on code that explains itself. No banner comments, no "Step 1:" narration, no commented-out code.

## 5. Docs, README, CHANGELOG, commit messages

~~~markdown
<!-- Avoid -->
## Introduction
This document provides a comprehensive overview of the robust API client.
## Key Features
1. Seamless integration  2. Powerful retries  3. Blazing-fast caching
## Conclusion
In conclusion, this solution empowers developers…

<!-- Use -->
## API client
Typed HTTP client for the shop API. Retries idempotent requests up to 3 times
and caches GET responses for 60 s.

```ts
const client = new ApiClient({ baseUrl: process.env.API_URL })
```
~~~

- Lead with what it is and how to use it. Skip introductions and conclusions.
- CHANGELOG entries say what changed for the user and why, not which files moved.
- Commit messages: what changed and why, in the imperative. No "This commit…".

## 6. Self-check before sending

1. Search the text for the words in section 1. Replace or delete each hit.
2. The first sentence answers the question or names the action.
3. There is no closing pleasantry or summary of what was just said.
4. Every adjective that makes a claim is backed by a number, a name, or an example, or it is gone.
5. Lists have their real length, not three by habit.
6. Read it as the target reader: would they say it this way?
