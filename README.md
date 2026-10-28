# RetentionIQ

Live Demo deployed on Render: https://retentioniq-frontend.onrender.com

> Machine learning application for predicting customer churn.

RetentionIQ combines a trained **Logistic Regression** and **XGBoost** model with a **FastAPI** backend and a **React + TypeScript** frontend to predict customer churn probability. It includes **SHAP-based explainability** to interpret individual predictions and a **Model Evaluation dashboard** to compare model performance using metrics such as accuracy, precision, recall, F1-score, and ROC-AUC.

<img width="1911" height="1022" alt="Screenshot 2026-10-28 214719" src="https://github.com/user-attachments/assets/8ea4a77f-9630-4702-b51b-cb4e1c09ace9" />

<img width="1917" height="1026" alt="Screenshot 2026-10-28 170618" src="https://github.com/user-attachments/assets/e3127872-28e9-4b75-abbc-9bdfdb63cbd7" />

<img width="1906" height="1025" alt="Screenshot 2026-10-28 170637" src="https://github.com/user-attachments/assets/71e6add0-9e2a-4d71-82ca-dea7d35828b9" />

<img width="1915" height="1018" alt="Screenshot 2026-10-28 213311" src="https://github.com/user-attachments/assets/af0d8f43-4f3c-448a-9372-76253cf61c1d" />

<img width="1917" height="1026" alt="Screenshot 2026-10-28 213329" src="https://github.com/user-attachments/assets/0fb25d9d-3b86-43cf-9df1-22c541db48ff" />

🌐 Live Deployment

Frontend: https://retentioniq-frontend.onrender.com

Backend API: https://retentioniq-5ukl.onrender.com

API Documentation: https://retentioniq-5ukl.onrender.com/docs


## 🚀 Features

🎯 Customer churn prediction

📊 Churn probability scores

📈 Logistic Regression classification model

🚀 XGBoost classification model

🔍 SHAP-based prediction explainability

⚖️ Model performance comparison

⚡ FastAPI REST API

⚛️ React + TypeScript frontend

💚 API health monitoring

🐳 Docker & Docker Compose

📚 Swagger / OpenAPI documentation

## 🛠️ Tech Stack

### Backend

🐍 Python

⚡ FastAPI

🐼 Pandas

🤖 Scikit-learn

🚀 XGBoost

🔍 SHAP

📦 Joblib

🐳 Docker

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

## 🤖 Machine Learning

RetentionIQ uses a **Logistic Regression model** to predict whether a customer is likely to churn.

The API returns both the prediction and the estimated churn probability.

Example response:

```json
{
  "churn_probability": 0.6916,
  "prediction": "Yes"
}
```

## 📁 Project Structure

```text
RetentionIQ/
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── Dockerfile
│
├── models/
│   └── churn_model.pkl
│
├── src/
│   └── main.py
│
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── .gitignore
└── README.md
```

## 📌 Project Status

Currently available as a fully functional local application with a trained ML model, REST API, React frontend, health monitoring, and Docker support.
