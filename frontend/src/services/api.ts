import type { PatientInput, PredictionResponse, ModelPerformanceData, HealthResponse } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function predictRisk(patientData: PatientInput): Promise<PredictionResponse> {
  const url = `${API_BASE}/api/predict`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData),
    });

    if (!res.ok) {
      let errorMsg = `Server returned status ${res.status}`;
      try {
        const errorJson = await res.json();
        if (errorJson.detail) {
          if (Array.isArray(errorJson.detail)) {
            errorMsg = errorJson.detail.map((d: any) => `${d.loc.join('.')}: ${d.msg}`).join(', ');
          } else {
            errorMsg = errorJson.detail;
          }
        }
      } catch {
        // use default error message
      }
      throw new Error(errorMsg);
    }

    return await res.json();
  } catch (err: any) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error(`Unable to connect to CardioSense backend at ${API_BASE}. Please ensure the server is running.`);
    }
    throw err;
  }
}

export async function getModelPerformance(): Promise<ModelPerformanceData> {
  const url = `${API_BASE}/api/model-performance`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to load model performance metrics (${res.status})`);
  }
  return await res.json();
}

export async function checkBackendHealth(): Promise<HealthResponse> {
  const url = `${API_BASE}/api/health`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Health check failed with status ${res.status}`);
  }
  return await res.json();
}
