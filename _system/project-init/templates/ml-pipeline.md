# ML PIPELINE TEMPLATE
# Tech Stack: Python + Pandas + MLflow + Airflow

## 📦 DEFAULT TECH STACK
- **Language:** Python 3.11+
- **Data Processing:** Pandas, Polars, Dask
- **ML Framework:** Scikit-learn, PyTorch, TensorFlow
- **Experiment Tracking:** MLflow, Weights & Biases
- **Orchestration:** Apache Airflow, Prefect
- **Feature Store:** Feast
- **Model Serving:** FastAPI, BentoML
- **Data Warehouse:** PostgreSQL, BigQuery
- **Object Storage:** S3, GCS

## 📁 STRUCTURE
```
ml-project/
├── notebooks/                  # EDA & experimentation
│   ├── eda/
│   └── experiments/
├── src/
│   ├── data/                 # Data processing
│   │   ├── ingest/
│   │   ├── transform/
│   │   └── validate/
│   ├── features/            # Feature engineering
│   │   ├── feature_definitions/
│   │   └── feature_store/
│   ├── models/              # Model training
│   │   ├── training/
│   │   ├── evaluation/
│   │   └── registry/
│   ├── serving/             # Model serving
│   │   ├── api/
│   │   └── batch/
│   └── monitoring/         # Model monitoring
│       ├── drift_detection/
│       └── performance/
├── dbt/                     # Data transformations
│   ├── models/
│   └── macros/
├── airflow/                 # Orchestration
│   ├── dags/
│   └── plugins/
├── mlflow/                  # Experiment tracking
├── tests/
│   ├── unit/
│   └── integration/
├── CLAUDE.md
├── pyproject.toml
└── README.md
```

## 🎯 ACTIVE SKILLS
- /ml-engineering (ML Lifecycle)
- /data-engineering (ETL, CDC)
- /api-design (Model serving API)
- /deployment (Container, CI/CD)
- /code-quality (Python, Linting)
- /testing (Unit, Integration)
- /reliability (Monitoring, SLO)

## 📋 ML CONVENTIONS
- Version control for data + models
- Experiment tracking (MLflow)
- Feature store for reusability
- Model registry for versioning
- Drift detection for monitoring
- CI/CD for model deployment

## 🚀 GETTING STARTED
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install dependencies
pip install -e ".[dev]"

# Setup MLflow
docker-compose up -d mlflow

# Run notebook server
jupyter lab
```
