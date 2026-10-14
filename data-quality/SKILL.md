---
name: data-quality
description: "Data validation, cleansing, and quality assurance for data pipelines and databases"
version: "1.1.0"
category: [data]
priority: medium
phase: any
auto_invoke:
  enabled: true
  conditions:
    - command: ["/data-quality", "/data-validation"]
      reason: "Data quality"
    - phrase: ["data quality", "data validation", "data cleansing", "data integrity"]
      reason: "Data quality context"
tech_stack:
  languages: [all]
scale: [medium, large, enterprise]
integrates_with: [database, data-engineering]
capabilities: [implementation]
quality:
  rules_count: 8
  examples_count: 3
  stability: stable
source:
  origin: local
author: thevoidsyntax
---

# Data Quality

Ensure data integrity through validation, cleansing, and monitoring.

## Usage

```
Use data-quality when:
- Building data pipelines
- Validating external data sources
- Cleansing dirty/messy data
- Setting up data contracts
```

## Checks

- Schema validation
- Null/missing value detection
- Type consistency
- Range and constraint validation
- Cross-field dependencies
- Duplicate detection

## Patterns

```python
# Validation example
from pydantic import BaseModel, validator

class UserRecord(BaseModel):
    email: str
    age: int
    
    @validator('age')
    def age_must_be_positive(cls, v):
        if v < 0:
            raise ValueError('Age must be positive')
        return v
```

## Integrations

Works with: `data-engineering`, `ml-pipeline`
