---
name: go-pro
description: "Go development with concurrency patterns, interfaces, goroutines, channels, and idiomatic Go practices"
when_to_use: "Use when writing Go: concurrency, goroutines, channels, interfaces, and idiomatic patterns."
version: "1.0.0"
category: [backend]
priority: high
phase: any
tech_stack:
  languages: [go]
  frameworks: [grpc, echo, gin, fiber]
scale: [small, medium, large, enterprise]
auto_invoke:
  enabled: true
  conditions:
    - has_file: "**/*.go"
      reason: "Go project detected"
    - has_file: "**/go.mod"
      reason: "Go module detected"
  skill_tier: context
triggers:
  phrases:
    - "go"
    - "golang"
    - "goroutine"
    - "channel"
    - "concurrency"
    - "gRPC"
capabilities: [implementation, generation, review]
quality:
  rules_count: 15
  examples_count: 20
  stability: stable
integrates_with: [api-design, docker, kubernetes]
dependencies: [api-design]
source:
  origin: external
  sources: ["Jeffallan/claude-skills"]
author: Jeffallan
---

# Go Pro - Concurrent Go Development

A specialized skill for Go development covering concurrency, microservices, and idiomatic patterns.

## Core Workflow

1. **Architecture Analysis** — Analyze requirements and identify concurrency needs
2. **Interface Design** — Design interfaces before implementation
3. **Implementation** — Write idiomatic Go with proper error handling
4. **Validation** — Run `go vet`, linting, and tests
5. **Optimization** — Profile with pprof if needed

## Key Patterns

### Concurrency with Goroutines
```go
func ProcessItems(ctx context.Context, items []Item) error {
    errCh := make(chan error, len(items))
    var wg sync.WaitGroup
    
    for _, item := range items {
        wg.Add(1)
        go func(i Item) {
            defer wg.Done()
            if err := process(i); err != nil {
                errCh <- fmt.Errorf("item %d: %w", i.ID, err)
            }
        }(item)
    }
    
    wg.Wait()
    close(errCh)
    
    return collectErrors(errCh)
}
```

### Context with Cancellation
```go
func LongRunningTask(ctx context.Context) error {
    for {
        select {
        case <-ctx.Done():
            return ctx.Err()
        default:
            if err := doWork(); err != nil {
                return fmt.Errorf("work failed: %w", err)
            }
        }
    }
}
```

### Error Wrapping (Modern Go)
```go
// Use %w for wrapped errors
if err := db.QueryContext(ctx, query); err != nil {
    return fmt.Errorf("query users: %w", err)
}

// Check wrapped errors
if errors.Is(err, sql.ErrNoRows) {
    return ErrUserNotFound
}
```

### Graceful Shutdown
```go
func main() {
    srv := &http.Server{Addr: ":8080"}
    
    go func() {
        if err := srv.ListenAndServe(); err != http.ErrServerClosed {
            log.Fatal(err)
        }
    }()
    
    sigCh := make(chan os.Signal, 1)
    signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
    <-sigCh
    
    ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    defer cancel()
    
    srv.Shutdown(ctx)
}
```

## Essential Practices

### MUST DO
- Use `golangci-lint` for linting
- Add `context.Context` to all blocking operations
- Handle all errors explicitly — never ignore with `_`
- Write table-driven tests with subtests
- Document all exported symbols
- Use union constraints for generics (Go 1.18+)
- Run race detector: `go test -race`
- Use `errgroup` for structured concurrency

### MUST NOT DO
- Use `panic` for normal errors
- Create goroutines without lifecycle management
- Skip context cancellation propagation
- Use reflection without strong justification
- Mix sync/async patterns
- Hardcode configuration values
- Use `println` instead of proper logging
- Create race conditions

## Project Structure
```
myapp/
├── cmd/
│   └── myapp/
│       └── main.go
├── internal/
│   ├── api/
│   ├── service/
│   └── repository/
├── pkg/
│   └── utils/
├── go.mod
└── Makefile
```

## Validation Commands
```bash
go fmt ./...
go vet ./...
golangci-lint run
go test -race -cover ./...
go build -o myapp ./cmd/myapp
```

## Integration with Other Skills
- Use with `/api-design` for REST/gRPC APIs
- Use with `/docker` for containerization
- Use with `/kubernetes` for orchestration

---

**Invoke:** `/go-pro` | **Version:** 1.0.0
