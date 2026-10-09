---
name: data-quality
description: Data validation, cleansing, and quality assurance
version: "1.0.0"
category: [data, quality]
priority: medium
phase: any
author: Claude
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
