# RetentionIQ

> Machine learning application for predicting customer churn.

RetentionIQ combines a trained **Random Forest** model with a **FastAPI** backend and a **React + TypeScript** frontend to predict customer churn probability.

## 🚀 Features

* 🎯 Customer churn prediction
* 📊 Churn probability score
* 🌲 Random Forest classification model
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

RetentionIQ uses a **Random Forest classifier** to predict whether a customer is likely to churn.

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
