---
name: ml-pipeline
description: "ML pipelines with MLflow, Kubeflow, feature stores, experiment tracking, and deployment"
version: "1.0.0"
category: [ai-process]
priority: high
phase: any
tech_stack:
  languages: [python]
  frameworks: [mlflow, kubeflow, apache-spark]
scale: [medium, large, enterprise]
auto_invoke:
  enabled: false
  conditions:
    - phrase: ["ml pipeline", "machine learning", "model training", "experiment tracking"]
      reason: "ML pipeline detected"
  skill_tier: optional
triggers:
  phrases:
    - "ml pipeline"
    - "machine learning"
    - "model training"
    - "experiment tracking"
    - "mlflow"
    - "kubeflow"
    - "feature store"
    - "model deployment"
capabilities: [implementation, analysis]
quality:
  rules_count: 15
  examples_count: 15
  stability: stable
integrates_with: [rag-architect, data-engineering]
dependencies: []
source:
  origin: merged
  sources: ["Jeffallan/claude-skills", "wshobson/agents"]
author: thevoidsyntax
---

# ML Pipeline - Machine Learning Operations

Comprehensive guide for building production ML pipelines covering experiment tracking, feature engineering, model training, evaluation, and deployment.

## Core Workflow

1. **Data Preparation** — Load, clean, and split data
2. **Feature Engineering** — Create and store features
3. **Experiment Tracking** — Log parameters, metrics, and artifacts
4. **Model Training** — Train with version control
5. **Evaluation** — Validate on holdout sets
6. **Deployment** — Serve model with monitoring

## Experiment Tracking with MLflow

```python
import mlflow
from mlflow.sklearn import log_model

# Set tracking URI
mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("customer-churn")

with mlflow.start_run(run_name="v1_baseline"):
    # Log parameters
    mlflow.log_params({
        "n_estimators": 100,
        "max_depth": 5,
        "learning_rate": 0.1,
    })
    
    # Train model
    model = train_model(X_train, y_train)
    
    # Log metrics
    metrics = evaluate(model, X_test, y_test)
    mlflow.log_metrics(metrics)
    
    # Log model
    log_model(model, "model", registered_model_name="churn-predictor")
```

## Feature Store

```python
from feast import FeatureStore

# Initialize feature store
fs = FeatureStore(repo_path=".")

# Define feature view
@feature_view(
    entities=["customer_id"],
    ttl=timedelta(days=1),
)
class CustomerFeatures:
    churn_probability = Float32
    last_purchase_date = Timestamp
    total_spend = Float32

# Fetch features for training
training_df = fs.get_historical_features(
    entity_df=customers_df,
    feature_refs=[
        "customer_features:churn_probability",
        "customer_features:last_purchase_date",
        "customer_features:total_spend",
    ],
).to_df()
```

## Model Training Pipeline

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import cross_val_score

# Create pipeline
pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("classifier", GradientBoostingClassifier()),
])

# Cross-validation
scores = cross_val_score(
    pipeline, X, y, 
    cv=5, 
    scoring="roc_auc",
    n_jobs=-1,
)

print(f"CV AUC: {scores.mean():.3f} (+/- {scores.std()*2:.3f})")

# Fit on full training data
pipeline.fit(X_train, y_train)
```

## Model Registry

```python
# Register best model
best_model = mlflow.register_model(
    model_uri=f"runs:/{mlflow.active_run().info.run_id}/model",
    name="churn-predictor",
)

# Transition to Production
client = mlflow.MlflowClient()
client.transition_model_version_stage(
    name="churn-predictor",
    version=best_model.version,
    stage="Production",
)
```

## Deployment

### FastAPI Serving
```python
from fastapi import FastAPI
import mlflow.pyfunc

app = FastAPI()

# Load production model
model = mlflow.pyfunc.load_model(
    model_uri="models:/churn-predictor/Production"
)

@app.post("/predict")
async def predict(data: PredictionInput):
    features = preprocess(data)
    prediction = model.predict(features)
    return {"prediction": prediction.tolist()}
```

### Batch Inference
```python
# Process in batches
for batch in pd.read_csv("data.csv", chunksize=1000):
    features = transform(batch)
    predictions = model.predict(features)
    save_results(batch, predictions)
```

## Monitoring

```python
# Log predictions for monitoring
def predict_with_monitoring(data, model):
    prediction = model.predict(data)
    
    # Log to monitoring
    mlflow.log_input(
        mlflow.data.load_dataset("production_data"),
        context=mlflow.LoggedInputContext.PRODUCTION_DATA,
    )
    
    return prediction
```

## Essential Practices

### MUST DO
- Use experiment tracking (MLflow, Weights & Biases)
- Version datasets and models
- Log all hyperparameters and metrics
- Use cross-validation for reliable estimates
- Implement data validation (Great Expectations)
- Monitor prediction drift
- Set up model registry with stages

### MUST NOT DO
- Train on full data without holdout set
- Skip data validation
- Hardcode model paths
- Forget to version features
- Deploy without monitoring
- Ignore data drift detection

---

**Invoke:** `/ml-pipeline` | **Version:** 1.0.0
