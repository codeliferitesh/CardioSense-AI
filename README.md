# CardioSense AI — Heart Health Risk Assessment System

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.4+-F7931E?style=flat&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**CardioSense AI** is an intelligent, full-stack clinical decision support web application that assesses cardiovascular disease risk based on clinical biomarkers. Combining a high-performance machine learning backend with an intuitive, modern clinical dashboard, CardioSense AI delivers fast, explainable, and reliable heart risk evaluations.

---

## ✨ Features

- **🩺 Interactive Risk Assessment**: Enter key patient vitals and clinical metrics with real-time field validation and tooltips.
- **⚡ Instant AI Prediction**: Receive instant risk probabilities, risk stratification levels (Low, Moderate, High), and clinical summaries.
- **🔍 Explainable AI & Risk Drivers**: Understand primary contributing physiological factors influencing the risk score.
- **📋 Patient Presets**: One-click quick-fill clinical profiles for rapid demonstration and scenario testing.
- **📊 Interactive Analytics Dashboard**: Explore model metrics, feature significance rankings, and distribution insights.
- **📱 Clean, Responsive UI**: Modern dark/light-friendly clinical interface built with React, TypeScript, and Lucide icons.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: FastAPI (Python 3.10+), Pydantic V2, Uvicorn
- **Machine Learning**: Scikit-Learn (Gradient Boosting & Ensemble Models), Pandas, NumPy, Joblib

---

## 🚀 Quick Start

### Prerequisites
- [Node.js 18+](https://nodejs.org/)
- [Python 3.10+](https://www.python.org/)

---

### 1. Clone the Repository
```bash
git clone https://github.com/codeliferitesh/CardioSense-AI.git
cd CardioSense-AI
```

---

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
# Windows (PowerShell):
python -m venv venv
.\venv\Scripts\Activate.ps1

# Linux / macOS:
# python3 -m venv venv
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the backend server
uvicorn app.main:app --reload --port 8000
```
> The API will be live at `http://localhost:8000` with interactive Swagger docs at `http://localhost:8000/docs`.

---

### 3. Frontend Setup
In a new terminal window:
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
> The web interface will be accessible at `http://localhost:5173`.

---

## 📁 Project Structure

```
CardioSense-AI/
├── backend/
│   ├── app/
│   │   ├── routes/          # API endpoints (predict, health, performance)
│   │   ├── main.py          # FastAPI application entrypoint
│   │   ├── schemas.py       # Pydantic data schemas
│   │   └── services.py      # ML inference & risk logic
│   ├── models/              # Serialized model artifacts
│   ├── training/            # ML training pipeline scripts
│   └── requirements.txt     # Python dependencies
├── data/                    # Dataset storage
├── frontend/
│   ├── src/
│   │   ├── components/      # React UI components
│   │   ├── services/        # API service layer
│   │   ├── types/           # TypeScript interfaces
│   │   └── App.tsx          # Main application component
│   └── package.json         # Node.js dependencies
└── README.md
```

---

## 🌐 Cloud Deployment

- **Backend**: Ready to deploy on [Render](https://render.com) or [Railway](https://railway.app) using the included `render.yaml`.
- **Frontend**: Ready to deploy on [Vercel](https://vercel.com) or [Netlify](https://netlify.com) with root directory set to `frontend`.

---

## ⚠️ Medical Disclaimer

CardioSense AI is developed for educational and clinical decision support purposes only. It is not an autonomous diagnostic device and should never replace professional medical judgment, diagnosis, or treatment.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
