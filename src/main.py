from fastapi import FastAPI
import pandas as pd
import joblib

from src.schemas import CustomerData
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path


app = FastAPI(
    title="RetentionIQ – Customer Churn Prediction API",
    description="API for predicting customer churn probability",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent.parent

LR_MODEL_PATH = BASE_DIR / "models" / "logistic_regression.joblib"
XGB_MODEL_PATH = BASE_DIR / "models" / "xgboost_model.joblib"

lr_model = joblib.load(LR_MODEL_PATH)
xgb_model = joblib.load(XGB_MODEL_PATH)


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.get("/")
def root():
    return {
        "message": "Customer Churn Prediction API is running"
    }


@app.post("/predict")
def predict(customer: CustomerData):
    customer_df = pd.DataFrame([customer.model_dump()])

    probability = lr_model.predict_proba(customer_df)[0, 1]

    prediction = "Yes" if probability >= 0.30 else "No"

    return {
        "churn_probability": round(float(probability), 4),
        "prediction": prediction
    }


@app.post("/compare")
def compare_models(customer: CustomerData):
    customer_df = pd.DataFrame([customer.model_dump()])

    lr_probability = lr_model.predict_proba(customer_df)[0, 1]
    xgb_probability = xgb_model.predict_proba(customer_df)[0, 1]

    return {
        "logistic_regression": {
            "churn_probability": round(float(lr_probability), 4),
            "prediction": "Yes" if lr_probability >= 0.30 else "No"
        },
        "xgboost": {
            "churn_probability": round(float(xgb_probability), 4),
            "prediction": "Yes" if xgb_probability >= 0.30 else "No"
        }
    }