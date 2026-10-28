from fastapi import FastAPI
import pandas as pd
import joblib
import shap
import numpy as np

from src.schemas import CustomerData
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix
)


app = FastAPI(
    title="RetentionIQ – Customer Churn Prediction API",
    description="API for predicting customer churn probability",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "https://retentioniq-frontend.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent.parent

LR_MODEL_PATH = BASE_DIR / "models" / "logistic_regression.joblib"
XGB_MODEL_PATH = BASE_DIR / "models" / "xgboost_model.joblib"
XGB_SHAP_MODEL_PATH = BASE_DIR / "models" / "xgboost_model_shap.joblib"

xgb_shap_model = joblib.load(XGB_SHAP_MODEL_PATH)

shap_explainer = shap.TreeExplainer(
    xgb_shap_model.named_steps["classifier"]
)

shap_preprocessor = xgb_shap_model.named_steps["preprocessor"]
shap_feature_names = shap_preprocessor.get_feature_names_out()

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

@app.post("/explain")
def explain_prediction(customer: CustomerData):
    customer_df = pd.DataFrame([customer.model_dump()])

    probability = xgb_shap_model.predict_proba(customer_df)[0, 1]

    transformed_customer = shap_preprocessor.transform(customer_df)

    shap_values = shap_explainer.shap_values(transformed_customer)
    shap_values = np.asarray(shap_values).reshape(-1)

    explanation = pd.DataFrame({
        "feature": shap_feature_names,
        "shap_value": shap_values
    })

    explanation["impact"] = np.where(
        explanation["shap_value"] > 0,
        "Increases churn risk",
        "Decreases churn risk"
    )

    explanation["abs_shap"] = explanation["shap_value"].abs()

    top_factors = (
        explanation
        .sort_values("abs_shap", ascending=False)
        .head(10)
    )

    return {
        "churn_probability": round(float(probability), 4),
        "prediction": "Yes" if probability >= 0.30 else "No",
        "explanations": [
            {
                "feature": row["feature"],
                "shap_value": round(float(row["shap_value"]), 4),
                "impact": row["impact"]
            }
            for _, row in top_factors.iterrows()
        ]
    }

@app.get("/evaluate")
def evaluate_models():
    evaluation_path = BASE_DIR / "data" / "evaluation_test.csv"

    if not evaluation_path.exists():
        return {"error": "Evaluation dataset not found"}

    df = pd.read_csv(evaluation_path)

    X_eval = df.drop(columns=["Churn"])
    y_eval = df["Churn"]

    results = {}

    models = {
        "logistic_regression": lr_model,
        "xgboost": xgb_model,
    }

    for name, model in models.items():
        y_pred = model.predict(X_eval)
        probabilities = model.predict_proba(X_eval)

        classes = list(model.classes_)
        positive_index = classes.index("Yes") if "Yes" in classes else classes.index(1)
        y_probability = probabilities[:, positive_index]

        y_true_binary = (y_eval == "Yes").astype(int)
        y_pred_binary = (y_pred == "Yes").astype(int) if "Yes" in classes else y_pred.astype(int)

        results[name] = {
            "accuracy": round(float(accuracy_score(y_true_binary, y_pred_binary)), 4),
            "precision": round(float(precision_score(y_true_binary, y_pred_binary, zero_division=0)), 4),
            "recall": round(float(recall_score(y_true_binary, y_pred_binary, zero_division=0)), 4),
            "f1_score": round(float(f1_score(y_true_binary, y_pred_binary, zero_division=0)), 4),
            "roc_auc": round(float(roc_auc_score(y_true_binary, y_probability)), 4),
            "confusion_matrix": confusion_matrix(
                y_true_binary, y_pred_binary, labels=[0, 1]
            ).tolist()
        }

    return {
        "test_samples": len(df),
        "positive_class": "Yes",
        "models": results
    }