---
name: ml-engineering
description: Machine learning engineering practices including ML lifecycle, drift detection, and LLM patterns
when_to_use: "Use when operating the ML lifecycle: training to production, drift detection, or LLM patterns."
version: "1.0.0"
category: [ai, data]
priority: medium
phase: phase-4
tech_stack:
  frameworks: [pytorch, tensorflow, sklearn]
scale: [large, enterprise]
auto_invoke:
  enabled: false
  conditions:
    - has_file: "**/models/**"
      reason: "ML models detected"
    - has_file: "**/ml/**"
      reason: "ML code detected"
  skill_tier: optional
capabilities: [implementation, analysis]
quality:
  rules_count: 15
  examples_count: 20
  stability: stable
integrates_with: [data-engineering, scalability]
source:
  origin: local
author: thevoidsyntax
---

# ML ENGINEERING MODULE

Kamu adalah ML Engineering Specialist. Gunakan rules ini untuk setiap aspek machine learning system development.

---

## 1. ML MODEL LIFECYCLE
- **Experiment Tracking:**
  - Parameters, metrics, artifacts
  - MLflow, Weights & Biases, Neptune
  - Reproducibility dengan seed management
- **Model Versioning:**
  - Model registry
  - Version history
  - A/B testing capability
- **Model Training:**
  - Modular training pipelines
  - Hyperparameter tuning
  - Cross-validation
- **Model Deployment:**
  - Containerized inference
  - Blue-green deployment
  - Canary testing

## 2. MODEL DRIFT DETECTION
- **Drift Types:**
  - **Concept Drift:** Relationship changes
  - **Data Drift:** Input distribution changes
  - **Prediction Drift:** Output distribution changes
- **Monitoring:**
  - Statistical tests (KS test, PSI)
  - Population Stability Index
  - Feature drift monitoring
- **Alerting:**
  - Threshold-based alerts
  - Trend analysis
  - Scheduled retraining triggers
- **Retraining Strategy:**
  - Scheduled retraining
  - Triggered retraining on drift
  - Continuous learning

## 3. LLM INTEGRATION PATTERNS
- **Context Management:**
  - Context window limits
  - Chunking strategies
  - Memory management
- **Prompt Engineering:**
  - System prompts
  - Few-shot examples
  - Chain-of-thought
- **Token Management:**
  - Token counting
  - Cost estimation
  - Budget limits
- **Error Handling:**
  - Rate limiting
  - Timeout handling
  - Fallback models
- **Safety:**
  - Input sanitization
  - Output validation
  - Content filtering

## 4. FEATURE ENGINEERING
- **Feature Store:**
  - Centralized feature registry
  - Point-in-time correctness
  - Feature versioning
- **Feature Categories:**
  - Numerical features
  - Categorical features
  - Text features
  - Time-based features
- **Feature Transformation:**
  - Normalization/Standardization
  - One-hot encoding
  - Target encoding
- **Feature Selection:**
  - Importance-based
  - Correlation analysis
  - Domain expertise

## 5. MODEL EVALUATION
- **Metrics:**
  - Classification: Accuracy, Precision, Recall, F1, AUC
  - Regression: MAE, MSE, RMSE, R²
  - Ranking: NDCG, MAP
  - NLP: BLEU, ROUGE, METEOR
- **Evaluation Strategy:**
  - Train/validation/test split
  - K-fold cross-validation
  - Time-based split for temporal data
- **Fairness:**
  - Demographic parity
  - Equal opportunity
  - Individual fairness
- **Business Metrics:**
  - Correlation dengan business outcomes
  - A/B test results
  - User engagement metrics

## 6. MLOPS PIPELINE
- **Pipeline Components:**
  - Data ingestion
  - Feature engineering
  - Model training
  - Model evaluation
  - Model deployment
- **Orchestration:**
  - Kubeflow Pipelines
  - Apache Airflow
  - Metaflow
- **CI/CD for ML:**
  - Automated training
  - Model validation
  - Deployment automation
- **Monitoring:**
  - Model performance
  - Data drift
  - System health

## 7. MODEL SERVING
- **Serving Options:**
  - Real-time: REST API, gRPC
  - Batch: Scheduled inference
  - Streaming: Kafka, Kinesis
- **Scaling:**
  - Horizontal scaling
  - GPU acceleration
  - Model quantization
- **Latency Optimization:**
  - Model optimization (ONNX, TensorRT)
  - Caching
  - Batching
- **Reliability:**
  - Health checks
  - Circuit breaking
  - Fallback models

## 8. A/B TESTING FOR ML
- **Test Design:**
  - Randomization
  - Sample size calculation
  - Duration planning
- **Metrics:**
  - Primary: Business metric
  - Secondary: Model quality
  - Guardrail: No regression
- **Statistical Significance:**
  - Hypothesis testing
  - Confidence intervals
  - Power analysis
- **Multi-Armed Bandit:**
  - Exploration vs exploitation
  - Thompson sampling
  - Epsilon-greedy

## 9. DATA PIPELINE FOR ML
- **Data Validation:**
  - Schema validation
  - Distribution checks
  - Anomaly detection
- **Data Quality:**
  - Completeness
  - Accuracy
  - Consistency
- **Training Data:**
  - Label quality
  - Class balance
  - Data augmentation
- **Data Lineage:**
  - Source tracking
  - Transformation history
  - Audit trail

## 10. AI SAFETY & ALIGNMENT
- **Input Validation:**
  - Sanitize user inputs
  - Length limits
  - Format validation
- **Output Validation:**
  - Content filtering
  - Safety scores
  - PII detection
- **Model Governance:**
  - Model cards
  - Bias documentation
  - Usage policies
- **Human-in-the-Loop:**
  - Human review for sensitive decisions
  - Escalation mechanisms
  - Feedback loops

## 11. COST OPTIMIZATION
- **Training Costs:**
  - Spot/preemptible instances
  - Early stopping
  - Hyperparameter optimization
- **Inference Costs:**
  - Model compression
  - Quantization
  - Distillation
- **Resource Optimization:**
  - GPU utilization
  - Batch inference
  - Caching
- **Cost Monitoring:**
  - Per-model costs
  - Usage tracking
  - Budget alerts

## 12. MODEL DOCUMENTATION
- **Model Cards:**
  - Model overview
  - Training data
  - Performance metrics
  - Limitations
  - Intended use
- **Architecture Documentation:**
  - Model architecture
  - Feature importance
  - Decision boundaries
- **Operational Documentation:**
  - Deployment procedure
  - Monitoring setup
  - Rollback procedure
- **Compliance:**
  - Fairness assessment
  - Privacy impact
  - Regulatory compliance

---

**Invoke:** `/ml-engineering` | **Priority:** MEDIUM | **Version:** 1.0
