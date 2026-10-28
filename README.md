# RetentionIQ

> Machine learning application for predicting customer churn.

RetentionIQ combines a trained **Logistic Regression** and **XGBoost** model with a **FastAPI** backend and a **React + TypeScript** frontend to predict customer churn probability. It features **SHAP-based** explainability to help interpret predictions and enables model performance comparison.

<img width="1917" height="1026" alt="Screenshot 2026-10-28 170603" src="https://github.com/user-attachments/assets/1c87ff86-4189-4c30-8893-522016c74312" />

<img width="1917" height="1026" alt="Screenshot 2026-10-28 170618" src="https://github.com/user-attachments/assets/e3127872-28e9-4b75-abbc-9bdfdb63cbd7" />

<img width="1906" height="1025" alt="Screenshot 2026-10-28 170637" src="https://github.com/user-attachments/assets/71e6add0-9e2a-4d71-82ca-dea7d35828b9" />



## 🚀 Features

* 🎯 Customer churn prediction
* 📊 Churn probability score
* 📈 Logistic Regression classification model
* ⚡ FastAPI REST API
* ⚛️ React + TypeScript frontend
* 💚 API health monitoring
* 🐳 Docker & Docker Compose
* 📚 Swagger / OpenAPI documentation

## 🛠️ Tech Stack

### Backend

* Python
* FastAPI
* Pandas
* Scikit-learn
* Joblib
* Docker

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

## 🐳 Running with Docker

Clone the repository and run:

```bash
docker compose up --build
```

### Application

**Frontend**

http://localhost:5173

**API**

http://localhost:8000

**Swagger Documentation**

http://localhost:8000/docs

**Health Check**

http://localhost:8000/health

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
