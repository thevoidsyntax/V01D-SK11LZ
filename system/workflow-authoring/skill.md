---
name: workflow-authoring
description: "Enhanced workflow authoring with intelligent automation, built-in patterns, TypeScript support, and enterprise-grade resilience patterns. Includes retry, circuit breaker, dry-run, and comprehensive debugging."
version: "2.1"
integrates_with:
  - auto-router (v7.0)
  - analyze-project (v4.1)
  - audit
  - diagnosing-bugs
  - code-review
---

# WORKFLOW AUTHORING v2.0
# Intelligent Automation & Pattern Library

Kamu adalah **Workflow Architect** yang dapat:
1. Membuat workflow automation yang intelligent
2. Menjalankan built-in patterns
3. Handle errors dengan retry & circuit breaker
4. Debugging step-by-step dengan dry-run
5. TypeScript support untuk type-safe scripts

---

## 🎯 TUJUAN UTAMA

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚡ WORKFLOW AUTHORING v2.0 - Intelligent Automation           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. CREATE      → Build type-safe workflows                   │
│  2. PATTERNS    → Use built-in automation patterns           │
│  3. EXECUTE     → Run with retry, circuit breaker           │
│  4. DEBUG       → Dry-run, verbose, step-by-step trace      │
│  5. TEMPLATES   → Pre-built workflow templates              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 CORE TYPES

### Enhanced Agent Options

```typescript
interface AgentOptions {
  // Basic Options
  name: string;
  description?: string;
  
  // Resilience Options
  retry?: {
    maxAttempts: number;        // Default: 3
    backoff: 'linear' | 'exponential' | 'jitter';
    baseDelay?: number;         // ms, default: 1000
    maxDelay?: number;          // ms, default: 30000
  };
  
  timeout?: number;             // ms, default: 60000
  
  circuitBreaker?: {
    threshold: number;          // Error count before opening
    timeout: number;            // ms before half-open
    resetTimeout?: number;       // ms before attempting reset
  };
  
  // Execution Options
  dryRun?: boolean;             // Simulate without execution
  verbose?: boolean;             // Detailed logging
  parallel?: boolean;            // Run steps in parallel
  
  // TypeScript Support
  mode?: 'typescript' | 'javascript';
  typeCheck?: boolean;           // Run tsc before execution
}
```

### Workflow Definition

```typescript
interface WorkflowStep {
  id: string;
  name: string;
  description?: string;
  
  // Execution
  action: string | ((ctx: WorkflowContext) => Promise<Result>);
  conditions?: {
    if?: string;                 // Expression to evaluate
    skip?: boolean;              // Skip if condition met
  };
  
  // Error Handling
  onError?: {
    strategy: 'abort' | 'retry' | 'skip' | 'fallback';
    fallback?: string;           // Step ID to run instead
    maxRetries?: number;
  };
  
  // Output
  output?: {
    key: string;                 // Store result in context
    type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
  };
}

interface WorkflowDefinition {
  name: string;
  version: string;
  description?: string;
  
  // Steps
  steps: WorkflowStep[];
  
  // Entry point
  entry?: string;               // Step ID to start with
  
  // Finalizers (always run)
  finally?: string[];           // Step IDs
  
  // Metadata
  tags?: string[];
  author?: string;
  created?: string;
}

interface WorkflowContext {
  // Built-in
  workflowId: string;
  stepHistory: Map<string, StepResult>;
  startTime: Date;
  
  // Custom (user-defined)
  [key: string]: any;
}

interface StepResult {
  success: boolean;
  output?: any;
  error?: {
    message: string;
    stack?: string;
    retries?: number;
  };
  duration: number;              // ms
  timestamp: Date;
}
```

---

## 🔄 BUILT-IN PATTERNS

### 1. Audit Pattern

```typescript
const AUDIT_PATTERN: WorkflowDefinition = {
  name: 'full-stack-audit',
  version: '1.0.0',
  description: 'Comprehensive codebase audit with multi-pass review',
  tags: ['audit', 'security', 'quality'],
  
  steps: [
    {
      id: 'prepare',
      name: 'Prepare Audit Environment',
      action: async (ctx) => {
        await runCommand('npm audit');
        await runCommand('npm test -- --run');
        await runCommand('tsc --noEmit');
      },
      output: { key: 'auditResults', type: 'object' }
    },
    {
      id: 'scan-deps',
      name: 'Dependency Vulnerability Scan',
      action: async (ctx) => {
        return await runCommand('npm audit --json');
      },
      onError: { strategy: 'skip' }
    },
    {
      id: 'type-check',
      name: 'TypeScript Type Check',
      action: async (ctx) => {
        return await runCommand('tsc --noEmit --pretty');
      },
      output: { key: 'typeErrors', type: 'array' }
    },
    {
      id: 'test-suite',
      name: 'Run Test Suite',
      action: async (ctx) => {
        return await runCommand('npm test -- --reporter=verbose');
      },
      onError: { strategy: 'retry', maxRetries: 2 },
      output: { key: 'testResults', type: 'object' }
    },
    {
      id: 'security-scan',
      name: 'Security Scan',
      action: async (ctx) => {
        return await runCommand('npm audit --audit-level=high');
      },
      onError: { strategy: 'skip' }
    },
    {
      id: 'generate-report',
      name: 'Generate Audit Report',
      action: async (ctx) => {
        const results = {
          auditResults: ctx.stepHistory.get('scan-deps'),
          typeErrors: ctx.stepHistory.get('type-check'),
          testResults: ctx.stepHistory.get('test-suite')
        };
        return formatAuditReport(results);
      },
      output: { key: 'report', type: 'object' }
    }
  ],
  
  entry: 'prepare',
  finally: ['cleanup-temp']
};
```

### 2. Migration Pattern

```typescript
const MIGRATION_PATTERN: WorkflowDefinition = {
  name: 'phase-migration',
  version: '1.0.0',
  description: 'Safe database migration with rollback capability',
  tags: ['migration', 'database', 'rollback'],
  
  steps: [
    {
      id: 'validate-schema',
      name: 'Validate Current Schema',
      action: async (ctx) => {
        const current = await getCurrentSchema();
        return { valid: true, version: current.version };
      },
      output: { key: 'currentSchema', type: 'object' }
    },
    {
      id: 'backup',
      name: 'Create Backup',
      action: async (ctx) => {
        const backupId = await createBackup();
        return { backupId, timestamp: new Date() };
      },
      onError: { strategy: 'abort' },
      output: { key: 'backup', type: 'object' }
    },
    {
      id: 'dry-run',
      name: 'Dry Run Migration',
      action: async (ctx) => {
        return await runCommand('knex migrate:latest --dry-run');
      },
      conditions: {
        if: 'ctx.dryRun === true'
      },
      output: { key: 'dryRunResults', type: 'object' }
    },
    {
      id: 'migrate',
      name: 'Run Migration',
      action: async (ctx) => {
        return await runCommand('knex migrate:latest');
      },
      onError: {
        strategy: 'fallback',
        fallback: 'rollback',
        maxRetries: 3
      },
      output: { key: 'migrationResult', type: 'object' }
    },
    {
      id: 'verify',
      name: 'Verify Migration',
      action: async (ctx) => {
        const newSchema = await getCurrentSchema();
        const expected = ctx.targetSchema;
        return verifySchemaMatch(newSchema, expected);
      },
      onError: {
        strategy: 'fallback',
        fallback: 'rollback'
      }
    },
    {
      id: 'rollback',
      name: 'Rollback on Failure',
      action: async (ctx) => {
        const backup = ctx.stepHistory.get('backup');
        return await restoreBackup(backup.backupId);
      },
      conditions: {
        skip: 'ctx.migrationSuccess === true'
      }
    }
  ]
};
```

### 3. Review Pattern

```typescript
const REVIEW_PATTERN: WorkflowDefinition = {
  name: 'code-review',
  version: '1.0.0',
  description: 'Automated code review with PR analysis',
  tags: ['review', 'pr', 'quality'],
  
  steps: [
    {
      id: 'fetch-pr',
      name: 'Fetch PR Details',
      action: async (ctx) => {
        const pr = await gh.api(`/pulls/${ctx.prNumber}`);
        return pr;
      },
      output: { key: 'prDetails', type: 'object' }
    },
    {
      id: 'get-diff',
      name: 'Get PR Diff',
      action: async (ctx) => {
        const diff = await gh.api(`/pulls/${ctx.prNumber}`, {
          headers: { Accept: 'application/vnd.github.v3.diff' }
        });
        return diff;
      },
      output: { key: 'diff', type: 'string' }
    },
    {
      id: 'analyze-changes',
      name: 'Analyze Code Changes',
      action: async (ctx) => {
        return analyzeDiff(ctx.diff);
      },
      output: { key: 'analysis', type: 'object' }
    },
    {
      id: 'run-tests',
      name: 'Run PR Tests',
      action: async (ctx) => {
        return await runCommand(`npm test -- --filter=${ctx.prBranch}`);
      },
      onError: { strategy: 'skip' },
      output: { key: 'testResults', type: 'object' }
    },
    {
      id: 'security-check',
      name: 'Security Scan',
      action: async (ctx) => {
        return await runCommand('npm audit');
      },
      onError: { strategy: 'skip' },
      output: { key: 'securityResults', type: 'object' }
    },
    {
      id: 'post-review',
      name: 'Post Review Comments',
      action: async (ctx) => {
        const findings = aggregateFindings(ctx);
        await gh.createReviewComment(ctx.prNumber, findings);
      }
    }
  ]
};
```

### 4. Implement Pattern

```typescript
const IMPLEMENT_PATTERN: WorkflowDefinition = {
  name: 'feature-implementation',
  version: '1.0.0',
  description: 'TDD-based feature implementation workflow',
  tags: ['implement', 'tdd', 'feature'],
  
  steps: [
    {
      id: 'analyze-requirement',
      name: 'Analyze Requirements',
      action: async (ctx) => {
        const specs = await parseRequirements(ctx.featureSpec);
        return specs;
      },
      output: { key: 'specs', type: 'object' }
    },
    {
      id: 'write-tests',
      name: 'Write Tests (RED Phase)',
      action: async (ctx) => {
        await createTestFile(ctx.specs);
        await runCommand('npm test -- --run --reporter=verbose');
      },
      onError: { strategy: 'retry', maxRetries: 2 },
      output: { key: 'testResults', type: 'object' }
    },
    {
      id: 'implement-feature',
      name: 'Implement Feature (GREEN Phase)',
      action: async (ctx) => {
        await createImplementation(ctx.specs);
        await runCommand('npm test -- --run');
      },
      onError: {
        strategy: 'retry',
        fallback: 'revert-changes',
        maxRetries: 3
      },
      output: { key: 'implementation', type: 'object' }
    },
    {
      id: 'refactor',
      name: 'Refactor (REFACTOR Phase)',
      action: async (ctx) => {
        await refactorCode(ctx.implementation);
        await runCommand('npm test -- --run');
      },
      onError: { strategy: 'retry', maxRetries: 2 }
    },
    {
      id: 'update-docs',
      name: 'Update Documentation',
      action: async (ctx) => {
        await updateReadme(ctx.specs);
        await updateApiDocs(ctx.specs);
      },
      onError: { strategy: 'skip' }
    },
    {
      id: 'commit',
      name: 'Commit Changes',
      action: async (ctx) => {
        await git.add('.');
        await git.commit(ctx.commitMessage, ctx.signoff);
      }
    }
  ]
};
```

---

## 📝 WORKFLOW TEMPLATES

### Full Stack Audit Template

```typescript
const FULL_STACK_AUDIT: WorkflowDefinition = {
  name: 'full-stack-audit',
  version: '1.0.0',
  description: 'Complete project audit including security, quality, and performance',
  
  options: {
    retry: { maxAttempts: 3, backoff: 'exponential' },
    timeout: 300000,  // 5 minutes
    verbose: true
  },
  
  steps: [
    { id: 'deps', name: 'Dependency Audit', action: 'npm audit --json' },
    { id: 'types', name: 'TypeScript Check', action: 'tsc --noEmit' },
    { id: 'lint', name: 'ESLint', action: 'npm run lint' },
    { id: 'test', name: 'Unit Tests', action: 'npm test' },
    { id: 'security', name: 'Security Scan', action: 'npm audit --audit-level=high' },
    { id: 'bundle', name: 'Bundle Size', action: 'npm run build -- --analyze' },
    { id: 'report', name: 'Generate Report', action: 'format-audit-report' }
  ]
};
```

### Security Review Template

```typescript
const SECURITY_REVIEW: WorkflowDefinition = {
  name: 'security-review',
  version: '1.0.0',
  description: 'Comprehensive security assessment',
  
  options: {
    retry: { maxAttempts: 2, backoff: 'exponential' },
    circuitBreaker: { threshold: 5, timeout: 60000 }
  },
  
  steps: [
    { id: 'secrets', name: 'Secret Detection', action: 'scan-secrets' },
    { id: 'deps', name: 'Vulnerable Dependencies', action: 'npm audit' },
    { id: 'auth', name: 'Auth Flow Review', action: 'review-auth' },
    { id: 'injection', name: 'Injection Attack Test', action: 'test-injection' },
    { id: 'cors', name: 'CORS Configuration', action: 'check-cors' },
    { id: 'rate-limit', name: 'Rate Limiting', action: 'check-rate-limit' },
    { id: 'report', name: 'Security Report', action: 'format-security-report' }
  ]
};
```

### Phase Migration Template

```typescript
const PHASE_MIGRATION: WorkflowDefinition = {
  name: 'phase-migration',
  version: '1.0.0',
  description: 'Safe migration between project phases',
  
  options: {
    dryRun: true,
    retry: { maxAttempts: 3, backoff: 'linear' },
    circuitBreaker: { threshold: 3, timeout: 120000 }
  },
  
  steps: [
    { id: 'backup', name: 'Backup Current State', action: 'create-backup' },
    { id: 'validate', name: 'Validate Prerequisites', action: 'check-phase-prereqs' },
    { id: 'migrate', name: 'Run Phase Migration', action: 'execute-migration' },
    { id: 'verify', name: 'Verify Migration', action: 'verify-schema' },
    { id: 'test', name: 'Run Smoke Tests', action: 'npm test -- --grep="smoke"' },
    { id: 'rollback', name: 'Rollback on Failure', action: 'restore-backup', conditions: { skip: 'success' } }
  ]
};
```

### Performance Analysis Template

```typescript
const PERFORMANCE_ANALYSIS: WorkflowDefinition = {
  name: 'performance-analysis',
  version: '1.0.0',
  description: 'Performance profiling and optimization',
  
  options: {
    verbose: true,
    timeout: 180000
  },
  
  steps: [
    { id: 'profile', name: 'Profile CPU', action: 'node --prof' },
    { id: 'heap', name: 'Heap Analysis', action: 'node --expose-gc --inspect' },
    { id: 'bundle', name: 'Bundle Analysis', action: 'webpack-bundle-analyzer' },
    { id: 'api-latency', name: 'API Latency', action: 'test-api-latency' },
    { id: 'db-query', name: 'Slow Query Analysis', action: 'analyze-db-queries' },
    { id: 'report', name: 'Performance Report', action: 'format-performance-report' }
  ]
};
```

---

## 🔧 EXECUTION ENGINE

### Circuit Breaker Implementation

```typescript
class CircuitBreaker {
  private state: 'closed' | 'open' | 'half-open';
  private failures: number = 0;
  private lastFailure: Date | null = null;
  
  constructor(
    private threshold: number,
    private timeout: number
  ) {
    this.state = 'closed';
  }
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailure!.getTime() > this.timeout) {
        this.state = 'half-open';
      } else {
        throw new CircuitOpenError('Circuit is open');
      }
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess() {
    this.failures = 0;
    this.state = 'closed';
  }
  
  private onFailure() {
    this.failures++;
    this.lastFailure = new Date();
    if (this.failures >= this.threshold) {
      this.state = 'open';
    }
  }
}
```

### Retry with Exponential Backoff

```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    backoff?: 'linear' | 'exponential' | 'jitter';
    baseDelay?: number;
    maxDelay?: number;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    backoff = 'exponential',
    baseDelay = 1000,
    maxDelay = 30000
  } = options;
  
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts) break;
      
      let delay: number;
      switch (backoff) {
        case 'linear':
          delay = baseDelay * attempt;
          break;
        case 'exponential':
          delay = baseDelay * Math.pow(2, attempt - 1);
          break;
        case 'jitter':
          delay = Math.random() * baseDelay * Math.pow(2, attempt - 1);
          break;
      }
      
      delay = Math.min(delay, maxDelay);
      await sleep(delay);
    }
  }
  
  throw lastError!;
}
```

### Workflow Executor

```typescript
class WorkflowExecutor {
  private circuitBreakers: Map<string, CircuitBreaker> = new Map();
  
  async execute(
    workflow: WorkflowDefinition,
    context: WorkflowContext,
    options: AgentOptions = {}
  ): Promise<WorkflowResult> {
    const startTime = Date.now();
    const results: Map<string, StepResult> = new Map();
    
    // Initialize circuit breakers
    if (options.circuitBreaker) {
      for (const step of workflow.steps) {
        this.circuitBreakers.set(
          step.id,
          new CircuitBreaker(
            options.circuitBreaker.threshold,
            options.circuitBreaker.timeout
          )
        );
      }
    }
    
    // Execute steps
    const entryStep = workflow.steps.find(s => s.id === workflow.entry);
    const queue = entryStep ? [entryStep] : workflow.steps;
    
    for (const step of queue) {
      if (options.verbose) {
        console.log(`[${workflow.name}] Executing step: ${step.name}`);
      }
      
      try {
        const result = await this.executeStep(step, context, options);
        results.set(step.id, result);
        
        if (!result.success && step.onError?.strategy === 'abort') {
          throw new WorkflowError(`Step ${step.id} failed`, results);
        }
      } catch (error) {
        if (options.verbose) {
          console.error(`[${workflow.name}] Step ${step.id} failed:`, error);
        }
        
        const errorResult: StepResult = {
          success: false,
          error: { message: (error as Error).message },
          duration: 0,
          timestamp: new Date()
        };
        results.set(step.id, errorResult);
        
        if (step.onError?.strategy === 'fallback' && step.onError.fallback) {
          const fallbackStep = workflow.steps.find(s => s.id === step.onError.fallback);
          if (fallbackStep) {
            const fallbackResult = await this.executeStep(fallbackStep, context, options);
            results.set(fallbackStep.id, fallbackResult);
          }
        }
      }
    }
    
    // Execute finally steps
    if (workflow.finally) {
      for (const finallyId of workflow.finally) {
        const finallyStep = workflow.steps.find(s => s.id === finallyId);
        if (finallyStep) {
          await this.executeStep(finallyStep, context, options);
        }
      }
    }
    
    return {
      success: Array.from(results.values()).every(r => r.success),
      results: Object.fromEntries(results),
      duration: Date.now() - startTime
    };
  }
  
  private async executeStep(
    step: WorkflowStep,
    context: WorkflowContext,
    options: AgentOptions
  ): Promise<StepResult> {
    const startTime = Date.now();
    
    // Check conditions using safe expression evaluator
    if (step.conditions?.if && !this.evaluateCondition(step.conditions.if, context)) {
      return {
        success: true,
        output: 'SKIPPED',
        duration: 0,
        timestamp: new Date()
      };
    }

    if (step.conditions?.skip) {
      return {
        success: true,
        output: 'SKIPPED',
        duration: 0,
        timestamp: new Date()
      };
    }
    
    // Dry run
    if (options.dryRun) {
      console.log(`[DRY RUN] Would execute: ${step.name}`);
      return {
        success: true,
        output: 'DRY_RUN',
        duration: 0,
        timestamp: new Date()
      };
    }
    
    // Get retry config
    const retryConfig = step.onError?.strategy === 'retry'
      ? { maxAttempts: step.onError.maxRetries || 3, backoff: 'exponential' as const }
      : options.retry;
    
    // Execute with retry
    const executeWithTimeout = async () => {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Step timeout')), options.timeout || 60000);
      });
      
      const actionResult = typeof step.action === 'function'
        ? await step.action(context)
        : await runCommand(step.action);
      
      return actionResult;
    };
    
    const output = retryConfig
      ? await withRetry(executeWithTimeout, retryConfig)
      : await executeWithTimeout();
    
    return {
      success: true,
      output,
      duration: Date.now() - startTime,
      timestamp: new Date()
    };
  }

  /**
   * Safe condition evaluator - prevents code injection attacks
   * Only allows: comparisons, logical operators, and context property access
   */
  private evaluateCondition(expr: string, context: WorkflowContext): boolean {
    // Whitelist-based safe expression evaluator
    const allowed = /^[\s\w.!&|><=!]+$/;
    if (!allowed.test(expr)) {
      console.warn(`[Security] Blocked unsafe expression: ${expr}`);
      return false;
    }

    try {
      // Build safe context for evaluation
      const ctx = {
        phase: context.phase,
        skill: context.skill,
        vars: context.variables || {},
        step: context.currentStep,
        results: context.results || {}
      };

      // Use Function constructor with restricted scope
      const safeEval = new Function('ctx', `with(ctx) { return !!(${expr}); }`);
      return safeEval(ctx);
    } catch (e) {
      console.warn(`[Security] Condition evaluation failed: ${expr}`, e);
      return false;
    }
  }
}
```

---

## 📊 OUTPUT FORMATS

### Workflow Execution Report

```
╔══════════════════════════════════════════════════════════════════╗
║  ⚡ WORKFLOW EXECUTION REPORT                                    ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  Workflow: [Workflow Name] v[Version]                           ║
║  Status: [SUCCESS|FAILED|PARTIAL]                               ║
║  Duration: [X seconds]                                        ║
║                                                                  ║
║  ─────────────────────────────────────────────────────────────  ║
║                                                                  ║
║  STEPS EXECUTION:                                               ║
║  ─────────────────────────────────────────────────────────────  ║
║                                                                  ║
║  ✅ [step-1] Prepare Audit Environment         [1.2s]          ║
║  ✅ [step-2] Dependency Vulnerability Scan     [3.5s]          ║
║  ⚠️  [step-3] TypeScript Type Check            [2.1s] [SKIPPED] ║
║  ✅ [step-4] Run Test Suite                     [45.3s]          ║
║  ❌ [step-5] Security Scan                      [0.5s] [FAILED] ║
║     └─ Error: npm audit failed                                   ║
║  🔄 [step-6] Generate Report (FALLBACK)         [0.8s]          ║
║                                                                  ║
║  ─────────────────────────────────────────────────────────────  ║
║                                                                  ║
║  RESILIENCE PATTERNS APPLIED:                                  ║
║  • Retry: 3 attempts with exponential backoff                  ║
║  • Circuit Breaker: threshold=5, timeout=60s                   ║
║  • Fallback: step-6 → step-5                                   ║
║                                                                  ║
║  ─────────────────────────────────────────────────────────────  ║
║                                                                  ║
║  OUTPUTS:                                                      ║
║  • auditResults: { vulnerabilities: 12, critical: 1 }         ║
║  • testResults: { passed: 142, failed: 0 }                    ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

### Debug Trace Output (Verbose Mode)

```
[WORKFLOW] Starting workflow: full-stack-audit v1.0.0
[WORKFLOW] Options: { dryRun: false, verbose: true, timeout: 300000 }
[WORKFLOW] 
[STEP] Executing: [step-1] Prepare Audit Environment
[ACTION] Running: npm audit
[ACTION] Output: {"metadata":{"vulnerabilities":{"critical":1,"high":5}}}
[STEP] ✓ Completed in 1.2s
[WORKFLOW] 
[STEP] Executing: [step-2] Dependency Vulnerability Scan
[ACTION] Running: npm audit --json
[RETRY] Attempt 1/3 failed: Network timeout
[RETRY] Waiting 1000ms before retry...
[RETRY] Attempt 2/3 failed: Network timeout
[RETRY] Waiting 2000ms before retry...
[RETRY] Attempt 3/3 succeeded
[STEP] ✓ Completed in 3.5s
[WORKFLOW] 
[CIRCUIT] Checking circuit state for step-3...
[CIRCUIT] State: CLOSED (failures: 0)
[STEP] Executing: [step-3] TypeScript Type Check
[ACTION] Running: tsc --noEmit
[CIRCUIT] Step completed successfully
[STEP] ⚠️ SKIPPED (condition: skip=true)
[WORKFLOW] 
...
```

---

## 🔗 INTEGRATION WITH AUTO-ROUTE

This skill integrates with `/auto-route` for intelligent project management:

```
┌─────────────────────────────────────────────────────────────────┐
│  AUTO-ROUTE + WORKFLOW INTEGRATION                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  /auto-route --analyze → Invoke /analyze-project              │
│                       → Get phase context                       │
│                       → Auto-select workflow templates           │
│                       → Execute recommended workflows           │
│                                                                 │
│  /auto-route --phase N  → Select phase-specific workflow      │
│                          → Run phase migration pattern         │
│                          → Track progress                       │
│                                                                 │
│  /auto-route --audit   → Run full-stack-audit pattern         │
│                                                                 │
│  /auto-route --review  → Run code-review pattern              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 USAGE EXAMPLES

### Basic Usage

```bash
# Run a built-in pattern
/workflow run --pattern audit --verbose

# Run with custom options
/workflow run --pattern migration --dry-run --timeout 120000

# Run specific workflow file
/workflow run ./workflows/my-audit.yaml
```

### Programmatic Usage

```typescript
import { WorkflowExecutor, withRetry, CircuitBreaker } from './workflow-authoring';

// Use built-in patterns
const executor = new WorkflowExecutor();
const result = await executor.execute(AUDIT_PATTERN, context, {
  verbose: true,
  retry: { maxAttempts: 3, backoff: 'exponential' },
  circuitBreaker: { threshold: 5, timeout: 60000 }
});

// Use retry directly
const data = await withRetry(
  () => fetchDataFromAPI(),
  { maxAttempts: 5, backoff: 'jitter', baseDelay: 500 }
);

// Use circuit breaker
const breaker = new CircuitBreaker(3, 60000);
const result = await breaker.execute(() => riskyOperation());
```

### TypeScript Support

```typescript
// Type-safe workflow definition
const typedWorkflow: WorkflowDefinition<{
  userId: string;
  projectPath: string;
}> = {
  name: 'user-onboarding',
  version: '1.0.0',
  steps: [
    {
      id: 'validate',
      name: 'Validate User',
      output: { key: 'user', type: 'object' as const }
    }
  ]
};

// Type inference for step outputs
type WorkflowOutputs = {
  [K in typeof typedWorkflow.steps[number] as K['output'] extends { key: infer K } ? K : never]: 
    Extract<K['output'], { key: K }>['type']
};
```

---

## 📋 COMMAND LINE INTERFACE

### Available Commands

| Command | Description |
|---------|-------------|
| `workflow list` | List available built-in patterns |
| `workflow run <pattern>` | Execute a pattern |
| `workflow create <name>` | Create new workflow |
| `workflow validate <file>` | Validate workflow YAML |
| `workflow dry-run <file>` | Simulate without execution |

### Options

| Option | Description |
|--------|-------------|
| `--pattern, -p` | Built-in pattern name |
| `--dry-run, -d` | Simulate execution |
| `--verbose, -v` | Detailed output |
| `--timeout, -t` | Timeout in milliseconds |
| `--retry` | Retry configuration |
| `--no-circuit-breaker` | Disable circuit breaker |

---

## 🔄 VERSION HISTORY

| Version | Changes |
|---------|---------|
| 2.0 | Added TypeScript support, enhanced resilience patterns, built-in templates |
| 1.0 | Initial workflow authoring skill |

---

**Invoke:** `/workflow-authoring` | **Priority:** HIGH | **Version:** 2.0

**Related Skills:**
- `/auto-route` - Unified entry point with workflow integration
- `/analyze-project` - Project analysis for workflow selection
- `/audit` - Security and code quality audit
- `/diagnosing-bugs` - Systematic debugging workflow

