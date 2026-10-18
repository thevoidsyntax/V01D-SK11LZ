---
name: storage
description: Storage systems best practices including object storage, CDN, and storage tiering
when_to_use: "Use when choosing storage: object storage, CDN, or storage tiering."
version: "1.0.0"
category: [infrastructure]
priority: low
phase: phase-3
tech_stack:
  services: [s3, gcs, azure-blob, cloudfront]
scale: [medium, large]
auto_invoke:
  enabled: false
  conditions:
    - has_file: "**/storage/**"
      reason: "Storage code detected"
  skill_tier: optional
capabilities: [implementation, analysis]
quality:
  rules_count: 8
  examples_count: 12
  stability: stable
integrates_with: [scalability]
source:
  origin: local
author: thevoidsyntax
---

# STORAGE MODULE

Kamu adalah Storage Specialist. Gunakan rules ini untuk setiap aspek storage systems.

---

## 1. OBJECT STORAGE PATTERNS
- **S3-Compatible Storage:**
  - AWS S3, GCS, Azure Blob
  - MinIO for on-prem
- **Bucket Organization:**
  - By environment
  - By feature
  - By access pattern
- **Access Patterns:**
  - Direct access
  - Presigned URLs
  - CloudFront distribution
- **Security:**
  - Bucket policies
  - IAM policies
  - Encryption (SSE-S3, SSE-KMS)

## 2. CDN INTEGRATION
- **CDN Setup:**
  - Origin configuration
  - Cache rules
  - SSL certificates
- **Cache Invalidation:**
  - Manual purge
  - Automatic TTL
  - Versioned URLs
- **Performance:**
  - Edge locations
  - Compression
  - HTTP/2 or HTTP/3
- **Cost Optimization:**
  - Cache hit ratio
  - Invalidation costs
  - Request pricing

## 3. FILE VERSIONING
- **Version Control:**
  - Enable versioning for critical buckets
  - Lifecycle policies
  - Cost management
- **Version Retrieval:**
  - List versions
  - Restore previous versions
  - Compare versions
- **Cleanup:**
  - Delete markers
  - Expired versions
  - Cost control
- **Implementation:**
  - S3 Versioning
  - Git-like semantics
  - Metadata retention

## 4. STORAGE TIERING
- **Hot Storage:**
  - SSD-backed
  - Immediate access
  - High cost per GB
- **Warm Storage:**
  - Standard storage
  - Infrequent access
  - Lower cost
- **Cold Storage:**
  - Archive storage
  - Long retrieval times
  - Very low cost
- **Lifecycle Policies:**
  - Auto-tiering
  - Expiration rules
  - Cost optimization

## 5. BACKUP STRATEGIES
- **Backup Types:**
  - Full backup
  - Incremental backup
  - Point-in-time recovery
- **Backup Storage:**
  - Offsite storage
  - Cross-region replication
  - Encrypted backups
- **Backup Verification:**
  - Regular restore tests
  - Integrity checks
  - Documentation
- **RTO/RPO:**
  - Define targets
  - Test recovery
  - Automate where possible

## 6. DATA LAKE ARCHITECTURE
- **Lake Organization:**
  - Raw zone
  - Processed zone
  - Curated zone
- **File Formats:**
  - Parquet (analytical)
  - ORC (Hive)
  - Delta Lake (ACID)
- **Partitioning:**
  - By date
  - By category
  - By source
- **Governance:**
  - Catalog
  - Lineage
  - Access control

## 7. BLOCK STORAGE
- **Volume Types:**
  - SSD (high performance)
  - HDD (high capacity)
  - NVMe (ultra performance)
- **Attachment:**
  - Single attachment
  - Multi-attach
  - Shared volumes
- **Snapshots:**
  - Point-in-time snapshots
  - Cross-region copies
  - Snapshot policies
- **Performance:**
  - IOPS requirements
  - Throughput requirements
  - Latency requirements

## 8. FILE STORAGE
- **NFS/Shared Storage:**
  - Mount targets
  - Permissions
  - Performance tuning
- **Use Cases:**
  - Shared application files
  - Media storage
  - Log aggregation
- **Alternatives:**
  - EFS (AWS)
  - Azure Files
  - Google Filestore
- **Best Practices:**
  - Concurrent access
  - Lock management
  - Backup strategy

## 9. ARCHIVE STORAGE
- **Archive Solutions:**
  - AWS Glacier
  - Azure Archive
  - Google Archive
- **Retrieval Times:**
  - Expedited (1-5 min)
  - Standard (3-5 hours)
  - Bulk (5-12 hours)
- **Cost Optimization:**
  - Archive older data
  - Match retrieval to need
  - Lifecycle management
- **Compliance:**
  - Legal hold
  - Retention policies
  - Audit trail

## 10. STORAGE SECURITY
- **Encryption:**
  - At rest
  - In transit
  - Key management
- **Access Control:**
  - IAM policies
  - Bucket policies
  - Presigned access
- **Audit Logging:**
  - Access logs
  - API calls
  - Anomaly detection
- **Compliance:**
  - Data residency
  - PII handling
  - Regulatory requirements

## 11. DISASTER RECOVERY
- **Replication:**
  - Cross-region
  - Cross-account
  - Synchronous/async
- **Recovery:**
  - Point-in-time restore
  - Cross-region restore
  - Failover procedures
- **Testing:**
  - Regular DR tests
  - Document procedures
  - Measure RTO/RPO
- **Automation:**
  - Automated failover
  - Health checks
  - Notification

## 12. STORAGE METRICS
- **Monitoring:**
  - Capacity usage
  - IOPS/throughput
  - Latency
- **Cost Monitoring:**
  - Per-bucket costs
  - Trend analysis
  - Anomaly detection
- **Optimization:**
  - Identify waste
  - Right-tier storage
  - Compression
- **Alerts:**
  - Capacity thresholds
  - Performance degradation
  - Cost spikes

---

**Invoke:** `/storage` | **Priority:** LOW | **Version:** 1.0
