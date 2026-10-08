---
name: data-quality
description: "Data validation, quality frameworks, Great Expectations, and data pipeline testing"
version: "1.0.0"
category: [data]
priority: high
phase: any
tech_stack:
  languages: [python, sql]
  frameworks: [great-expectations, dbt]
scale: [medium, large, enterprise]
auto_invoke:
  enabled: false
  conditions:
    - phrase: ["data quality", "data validation", "data testing", "great expectations"]
      reason: "Data quality detected"
  skill_tier: optional
triggers:
  phrases:
    - "data quality"
    - "data validation"
    - "data testing"
    - "data pipeline"
    - "data profiling"
capabilities: [implementation, analysis]
quality:
  rules_count: 12
  examples_count: 10
  stability: stable
integrates_with: [database, ml-pipeline, data-engineering]
dependencies: []
source:
  origin: external
author: Claude
---

# Data Quality - Data Validation Framework

Comprehensive data quality validation using Great Expectations, data profiling, and pipeline testing patterns.

## Core Workflow

1. **Profile** — Understand data structure and statistics
2. **Define Expectations** — Set data quality rules
3. **Validate** — Run validation on datasets
4. **Monitor** — Track data quality over time
5. **Alert** — Notify on quality degradation

## Great Expectations

```python
import great_expectations as ge

# Connect to data
context = ge.get_context()
datasource = context.sources.add_pandas_filesystem("data")

# Create expectation suite
suite = context.suites.add(
    ge.core.ExpectationSuite("customer_data_quality")
)

# Define expectations
suite.add_expectation(
    ge.core.ExpectationConfiguration(
        expectation_type="expect_column_values_to_not_be_null",
        kwargs={"column": "customer_id"}
    )
)

suite.add_expectation(
    ge.core.ExpectationConfiguration(
        expectation_type="expect_column_values_to_be_between",
        kwargs={
            "column": "age",
            "min_value": 0,
            "max_value": 150
        }
    )
)

suite.add_expectation(
    ge.core.ExpectationConfiguration(
        expectation_type="expect_column_value_lengths_to_be_between",
        kwargs={
            "column": "email",
            "min_value": 3,
            "max_value": 254
        }
    )
)

# Validate
batch = datasource.get_batch_list_from_directory(
    path="data/customers.csv"
)[0]

results = batch.validate(suite)
print(results.success)
```

## Data Quality Rules

```python
# Schema expectations
expectations = [
    ge.core.ExpectationConfiguration(
        expectation_type="expect_table_columns_to_match_ordered_list",
        kwargs={
            "column_list": [
                "customer_id", "email", "name", 
                "age", "created_at"
            ]
        }
    ),
    
    # Value range
    ge.core.ExpectationConfiguration(
        expectation_type="expect_column_values_to_be_between",
        kwargs={"column": "price", "min_value": 0, "max_value": 10000}
    ),
    
    # Unique values
    ge.core.ExpectationConfiguration(
        expectation_type="expect_column_values_to_be_unique",
        kwargs={"column": "customer_id"}
    ),
    
    # Set membership
    ge.core.ExpectationConfiguration(
        expectation_type="expect_column_values_to_be_in_set",
        kwargs={
            "column": "status",
            "value_set": ["active", "inactive", "pending"]
        }
    ),
]

# Uniqueness and completeness
ge.core.ExpectationConfiguration(
    expectation_type="expect_column_proportion_of_unique_values_to_be_between",
    kwargs={"column": "email", "min_value": 0.95, "max_value": 1.0}
)
```

## Data Pipeline Testing

```python
import pytest

def test_customer_data_quality(pipeline_context):
    """Test customer data meets quality standards."""
    df = pipeline_context.load("customers")
    
    # Completeness
    assert df["customer_id"].notna().all(), "Missing customer IDs"
    assert df["email"].notna().sum() / len(df) > 0.99, "Email completeness < 99%"
    
    # Validity
    assert df["age"].between(0, 150).all(), "Invalid age values"
    assert df["email"].str.contains("@").all(), "Invalid email format"
    
    # Uniqueness
    assert df["customer_id"].nunique() == len(df), "Duplicate customer IDs"
    
    # Referential integrity
    assert df["plan_id"].isin(pipeline_context.load("plans")["id"]).all()


def test_data_freshness(pipeline_context):
    """Test data is recent enough."""
    df = pipeline_context.load("transactions")
    latest_date = df["created_at"].max()
    
    # Data should be less than 1 hour old
    assert (datetime.now() - latest_date).total_seconds() < 3600
```

## Data Quality Metrics

| Metric | Target | Description |
|--------|--------|-------------|
| Completeness | > 99% | Non-null values |
| Validity | > 98% | Values match rules |
| Consistency | > 99% | Same format across sources |
| Timeliness | < 1 hour | Data freshness |

## Essential Practices

### MUST DO
- Define data quality rules early in pipeline design
- Test both happy path and edge cases
- Profile data before setting expectations
- Monitor data quality over time
- Set up alerts for quality degradation

### MUST NOT DO
- Skip data validation
- Hardcode thresholds without justification
- Ignore data quality warnings
- Deploy pipelines without testing

---

**Invoke:** `/data-quality` | **Version:** 1.0.0
