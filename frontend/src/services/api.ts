const API_URL = import.meta.env.VITE_API_URL;;

export interface CustomerData {
  gender: string;
  SeniorCitizen: number;
  Partner: string;
  Dependents: string;
  tenure: number;
  PhoneService: string;
  MultipleLines: string;
  InternetService: string;
  OnlineSecurity: string;
  OnlineBackup: string;
  DeviceProtection: string;
  TechSupport: string;
  StreamingTV: string;
  StreamingMovies: string;
  Contract: string;
  PaperlessBilling: string;
  PaymentMethod: string;
  MonthlyCharges: number;
  TotalCharges: number;
}

export interface PredictionResult {
  churn_probability: number;
  prediction: string;
}

export interface ModelComparisonResult {
  logistic_regression: PredictionResult;
  xgboost: PredictionResult;
}

export interface FeatureExplanation {
  feature: string;
  shap_value: number;
  impact: string;
}

export interface ExplanationResult extends PredictionResult {
  explanations: FeatureExplanation[];
}

export interface ModelEvaluation {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  confusion_matrix: number[][];
}

export interface EvaluationResult {
  test_samples: number;
  positive_class: string;
  models: {
    logistic_regression: ModelEvaluation;
    xgboost: ModelEvaluation;
  };
}

export async function predictChurn(
  customer: CustomerData
): Promise<PredictionResult> {
  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  });

  if (!response.ok) {
    throw new Error("Prediction request failed");
  }

  return response.json();
}

export async function compareModels(
  customer: CustomerData
): Promise<ModelComparisonResult> {
  const response = await fetch(`${API_URL}/compare`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  });

  if (!response.ok) {
    throw new Error("Model comparison request failed");
  }

  return response.json();
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`);

    return response.ok;
  } catch {
    return false;
  }
}

export async function explainPrediction(
  customer: CustomerData
): Promise<ExplanationResult> {
  const response = await fetch(`${API_URL}/explain`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  });

  if (!response.ok) {
    throw new Error("Prediction explanation request failed");
  }

  return response.json();
}

export async function getModelEvaluation(): Promise<EvaluationResult> {
  const response = await fetch(`${API_URL}/evaluate`);

  if (!response.ok) {
    throw new Error("Failed to load model evaluation");
  }

  return response.json();
}