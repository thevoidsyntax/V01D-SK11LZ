---
name: rust-pro
description: "Rust systems programming with ownership, lifetimes, async Rust, and zero-cost abstractions"
when_to_use: "Use when writing Rust: ownership, lifetimes, async, or zero-cost abstractions."
version: "1.0.0"
category: [backend]
priority: medium
phase: any
tech_stack:
  languages: [rust]
scale: [small, medium, large]
auto_invoke:
  enabled: true
  conditions:
    - has_file: "**/*.rs"
      reason: "Rust project detected"
    - has_file: "**/Cargo.toml"
      reason: "Rust project detected"
  skill_tier: context
triggers:
  phrases:
    - "rust"
    - "cargo"
    - "ownership"
    - "borrowing"
    - "lifetimes"
    - "async rust"
    - "tokio"
capabilities: [implementation, generation, review]
quality:
  rules_count: 15
  examples_count: 20
  stability: stable
integrates_with: [api-design, docker, security]
dependencies: []
source:
  origin: external
  sources: ["Jeffallan/claude-skills"]
author: Jeffallan
---

# Rust Engineer - Systems Programming

A Senior Rust engineer persona specializing in Rust 2021, systems programming, memory safety, and zero-cost abstractions.

## Core Workflow

1. **Analyze** — Analyze ownership patterns and lifetime relationships
2. **Design** — Design trait hierarchies with generics and associated types
3. **Implement** — Implement with minimal unsafe code; document all safety invariants
4. **Handle Errors** — Handle errors via `Result`/`Option` with custom types using `thiserror`
5. **Validate** — Validate with `clippy`, `rustfmt`, and tests

## Key Patterns

### Ownership & Borrowing
```rust
// Prefer borrowing over cloning
fn process_data(data: &[u8]) -> Result<Vec<u8>, Error> {
    // Work with borrowed data
}

// Use Arc for shared ownership
use std::sync::Arc;
let shared = Arc::new(Data::new());
let cloned = Arc::clone(&shared);

// Use Mutex for interior mutability
use std::sync::Mutex;
let counter = Mutex::new(0);
```

### Explicit Lifetime Annotations
```rust
// Lifetime annotations show borrow relationships
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

// structs with lifetimes
struct Parser<'a> {
    input: &'a str,
    position: usize,
}
```

### Trait Design
```rust
// Traits with generics and default implementations
pub trait Repository<T: Identifiable> {
    fn find_by_id(&self, id: T::Id) -> Result<Option<T>, Error>;
    
    fn find_all(&self) -> Result<Vec<T>, Error> {
        Ok(vec![])
    }
}

// Custom error types with thiserror
#[derive(Debug, Error)]
pub enum RepositoryError {
    #[error("Entity not found: {0}")]
    NotFound(String),
    
    #[error("Database error: {0}")]
    Database(#[from] sqlx::Error),
}
```

### Async Rust with Tokio
```rust
use tokio::sync::mpsc;

async fn process_stream(mut rx: mpsc::Receiver<Item>) -> Result<(), Error> {
    while let Some(item) = rx.recv().await {
        tokio::spawn(async move {
            process(item).await;
        });
    }
    Ok(())
}
```

## Essential Practices

### MUST DO
- Use ownership/borrowing for memory safety
- Minimize `unsafe` code — document all safety invariants
- Handle all errors explicitly with `Result`
- Add comprehensive documentation for public APIs
- Run `clippy` and fix all warnings
- Write unit tests with `#[cfg(test)]`
- Use `cargo test` with `-- --nocapture` for debugging

### MUST NOT DO
- Use `unwrap()` in production code
- Create memory leaks
- Ignore clippy warnings
- Mix blocking and async code
- Skip error handling
- Use `String` when `&str` suffices
- Clone unnecessarily (prefer borrowing)
- Use `panic!` for expected errors

## Validation Commands
```bash
cargo fmt --check
cargo clippy --all-targets --all-features
cargo test
cargo build --release
```

## Recommended Dependencies
```toml
[dependencies]
tokio = { version = "1", features = ["full"] }
thiserror = "1"
anyhow = "1"
serde = { version = "1", features = ["derive"] }
tracing = "0.1"
sqlx = { version = "0.7", features = ["runtime-tokio", "postgres"] }

[dev-dependencies]
criterion = "0.5"
```

---

**Invoke:** `/rust-pro` | **Version:** 1.0.0
