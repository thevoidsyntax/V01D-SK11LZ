---
name: data-engineering
description: Data engineering patterns including CDC, ETL, data quality, and warehouse design
version: "1.0.0"
category: [data]
priority: medium
phase: phase-4
tech_stack:
  services: [airflow, dbt, spark, kafka]
scale: [medium, large, enterprise]
auto_invoke:
  enabled: false
  conditions:
    - has_file: "**/pipelines/**"
      reason: "Data pipeline detected"
  skill_tier: optional
capabilities: [implementation, analysis]
quality:
  rules_count: 15
  examples_count: 20
  stability: stable
integrates_with: [database, scalability]
source:
  origin: local
author: Claude
---

# DATA ENGINEERING MODULE

Kamu adalah Data Engineering Specialist. Gunakan rules ini untuk setiap aspek data pipeline dan management.

---

## 1. DATA PIPELINE ARCHITECTURE
- **Pipeline Design:** Design pipelines dengan principles:
  - **Idempotency:** Setiap step harus bisa di-run ulang tanpa side effects
  - **Fault Tolerance:** Handle failures gracefully dengan retry dan checkpointing
  - **Observability:** Setiap pipeline harus emit metrics dan lineage
- **Pipeline Orchestration:** Gunakan established orchestration tools:
  - Apache Airflow, Prefect, Dagster (Python ecosystem)
  - dbt (data transformation)
  - AWS Glue, Azure Data Factory (cloud-native)
- **Data Lineage:** Track data lineage dari source ke destination untuk audit dan debugging.
- **Pipeline Versioning:** Version control untuk pipeline definitions dan configurations.

## 2. ETL vs ELT PATTERNS
- **ETL (Extract-Transform-Load):**
  - Transformasi dilakukan sebelum load ke destination
  - Cocok untuk: data cleaning, schema transformation
  - Use case: Structured data ke data warehouse
- **ELT (Extract-Load-Transform):**
  - Load raw data first, transform di destination
  - Cocok untuk: large-scale data, cloud data warehouses
  - Use case: Snowflake, BigQuery, Redshift dengan native transformation
- **CDC (Change Data Capture):**
  - Capture incremental changes dari source database
  - Tools: Debezium, AWS DMS, Fivetran
  - Pattern: Log-based CDC vs query-based CDC

## 3. DATA QUALITY
- **Quality Dimensions:** Evaluasi data terhadap:
  - **Completeness:** Tidak ada missing values di critical fields
  - **Accuracy:** Data mencerminkan real-world state
  - **Consistency:** Data konsisten antar systems
  - **Timeliness:** Data available dalam timeframe yang acceptable
  - **Uniqueness:** Tidak ada duplicate records yang tidak seharusnya
- **Data Validation Rules:**
  - Not null constraints untuk required fields
  - Type validation (string, number, date format)
  - Range validation untuk numeric fields
  - Pattern matching untuk identifiers
  - Cross-field validation
- **Data Profiling:** Automated data profiling untuk discover anomalies dan patterns.
- **SLA Monitoring:** Define data freshness SLA dan monitor compliance.

## 4. DATA WAREHOUSE & LAKEHOUSE
- **Architecture Pattern:**
  - **Data Lake:** Raw storage untuk all data types (structured, semi-structured, unstructured)
  - **Data Warehouse:** Optimized untuk analytical queries
  - **Data Lakehouse:** Unified approach dengan lake capabilities dan warehouse performance
- **Schema Design:**
  - Star schema untuk dimensional modeling
  - Snowflake schema untuk normalized dimensions
  - Data vault untuk long-term historical tracking
- **Partitioning Strategy:** Partition tables berdasarkan:
  - Date/time untuk time-series data
  - Entity type untuk multi-tenant systems
  - High-cardinality columns untuk parallel processing
- **Indexing:** Create appropriate indexes untuk query patterns:
  - B-tree indexes untuk equality queries
  - Bitmap indexes untuk low-cardinality columns
  - Columnar indexes untuk analytical workloads

## 5. DATA MODELING
- **Normalization vs Denormalization:**
  - **OLTP Systems:** 3NF untuk transactional integrity
  - **OLAP Systems:** Denormalized schemas untuk query performance
- **Slowly Changing Dimensions (SCD):**
  - **Type 1:** Overwrite (simple, no history)
  - **Type 2:** Add new row dengan surrogate key dan effective dates
  - **Type 3:** Add columns untuk current/previous values
- **Fact and Dimension Tables:**
  - **Fact tables:** Numeric measures dari business processes
  - **Dimension tables:** Descriptive attributes untuk analysis
- **Conformed Dimensions:** Shared dimensions across data marts untuk consistency.

## 6. DATA STORAGE OPTIMIZATION
- **Compression:** Use columnar compression (Parquet, ORC) untuk analytical storage.
- **Data Tiering:**
  - **Hot:** SSD storage untuk frequently accessed data
  - **Warm:** Standard storage untuk historical data
  - **Cold:** Archive storage untuk compliance retention
- **Data Archival:** Automated archival policy untuk old data dengan:
  - Separate storage tier untuk archival data
  - Index untuk quick retrieval when needed
  - Retention policy sesuai compliance
- **Data Retention:** Define retention policies untuk:
  - Transactional data (7 years untuk financial)
  - Log data (90 days typical)
  - Analytical data (based on business value)

## 7. DATA INTEGRATION
- **API Integration Patterns:**
  - **REST/GraphQL:** Pull-based integration dengan scheduled polling
  - **Webhook:** Push-based untuk real-time updates
  - **Stream:** Real-time integration dengan message queues
- **Batch vs Streaming:**
  - **Batch:** Scheduled jobs untuk large-volume, latency-tolerant processing
  - **Streaming:** Real-time processing untuk low-latency requirements
  - **Lambda Architecture:** Combination dari batch dan speed layers
- **Data Virtualization:** Optional untuk unified view tanpa physical replication:
  - Dremio, Presto, Apache Drill
  - Query federation across multiple sources

## 8. DATA GOVERNANCE
- **Data Catalog:** Maintain centralized data catalog dengan:
  - Data definitions dan descriptions
  - Ownership dan stewardship information
  - Lineage information
  - Quality metrics
- **Data Dictionary:** Document semua data elements:
  - Field name dan description
  - Data type dan format
  - Valid values dan ranges
  - Source system mapping
- **Data Stewardship:** Assign data stewards untuk critical data domains.
- **Metadata Management:** Automated metadata collection dari pipeline executions.

## 9. DATA SECURITY & COMPLIANCE
- **PII Handling:**
  - Classification: Public, Internal, Confidential, Restricted
  - Masking: Mask PII di non-production environments
  - Encryption: Encrypt PII at rest dan in transit
  - Access Control: Role-based access ke sensitive data
- **Column-Level Security:** Implementasikan column-level permissions untuk fine-grained access.
- **Row-Level Security:** Filter data berdasarkan user/tenant context.
- **Audit Trail:** Log semua data access dan modifications untuk sensitive data.

## 10. DATA PROCESSING OPTIMIZATION
- **Parallel Processing:** Distribute workload across multiple nodes:
  - Partition data untuk parallel reads
  - Balance partition sizes untuk even distribution
- **Incremental Processing:** Process hanya changed data:
  - Use watermarks untuk track processing state
  - Implementasikan checkpointing untuk fault recovery
- **Materialized Views:** Pre-compute expensive aggregations untuk query performance.
- **Query Optimization:**
  - Analyze query plans
  - Create covering indexes
  - Optimize join strategies
  - Use query hints sparingly

## 11. DATA PIPELINE RELIABILITY
- **Retry Strategy:** Implementasikan retry dengan exponential backoff untuk transient failures.
- **Dead Letter Queue:** Route failed messages ke DLQ untuk manual review dan reprocessing.
- **Data Validation:** Validate output data quality sebelum marking pipeline as successful.
- **Alerting:** Alert on pipeline failures, SLA breaches, dan data quality anomalies.
- **Backfill Strategy:** Design pipelines untuk support historical backfill:

## 12. STREAM PROCESSING
- **Stream Processing Frameworks:**
  - Apache Kafka Streams, Apache Flink, Apache Spark Streaming
  - AWS Kinesis Data Streams, Google Cloud Dataflow
- **Exactly-Once Semantics:** Ensure data processed exactly once dengan:
  - Idempotent producers
  - Transactional writes
  - Checkpointing
- **Windowing:** Define time windows untuk aggregations:
  - Tumbling windows (non-overlapping)
  - Sliding windows (overlapping)
  - Session windows (activity-based)
- **State Management:** Persist state untuk stateful stream processing dengan:
  - RocksDB for local state
  - Fault-tolerant storage untuk distributed state

---

**Invoke:** `/data-engineering` | **Priority:** HIGH | **Version:** 1.0
