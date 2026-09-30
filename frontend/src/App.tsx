import React, { useState, useEffect } from 'react';
import type { PatientInput, PredictionResponse, HealthResponse, FeatureImportanceItem } from './types';
import { predictRisk, checkBackendHealth, getModelPerformance } from './services/api';
import { Header } from './components/Header';
import { PatientForm } from './components/PatientForm';
import { PredictionResult } from './components/PredictionResult';
import { ModelInsights } from './components/ModelInsights';
import { ModelPerformance } from './pages/ModelPerformance';
import { Footer } from './components/Footer';
import { 
  HeartHandshake, 
  ShieldCheck, 
  AlertCircle, 
  Stethoscope,
  Info
} from 'lucide-react';

const DEFAULT_PATIENT: PatientInput = {
  age: 52,
  sex: 1,
  cp: 0,
  trestbps: 125,
  chol: 212,
  fbs: 0,
  restecg: 1,
  thalach: 168,
  exang: 0,
  oldpeak: 1.0,
  slope: 2,
  ca: 2,
  thal: 3,
};

const HIGH_RISK_PRESET: PatientInput = {
  age: 58,
  sex: 0,
  cp: 0,
  trestbps: 100,
  chol: 248,
  fbs: 0,
  restecg: 0,
  thalach: 122,
  exang: 0,
  oldpeak: 1.0,
  slope: 1,
  ca: 0,
  thal: 2,
};

const LOW_RISK_PRESET: PatientInput = {
  age: 53,
  sex: 1,
  cp: 0,
  trestbps: 140,
  chol: 203,
  fbs: 1,
  restecg: 0,
  thalach: 155,
  exang: 1,
  oldpeak: 3.1,
  slope: 0,
  ca: 0,
  thal: 3,
};

export function App() {
  const [activeTab, setActiveTab] = useState<'assessment' | 'performance'>('assessment');
  const [formData, setFormData] = useState<PatientInput>(DEFAULT_PATIENT);
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [checkingHealth, setCheckingHealth] = useState<boolean>(true);
  const [features, setFeatures] = useState<FeatureImportanceItem[]>([]);
  const [modelName, setModelName] = useState<string>('Gradient Boosting');

  const checkHealth = async () => {
    setCheckingHealth(true);
    try {
      const h = await checkBackendHealth();
      setHealth(h);
      if (h.model_name && h.model_name !== 'None') {
        setModelName(h.model_name);
      }
    } catch {
      setHealth(null);
    } finally {
      setCheckingHealth(false);
    }
  };

  const loadInsights = async () => {
    try {
      const perf = await getModelPerformance();
      if (perf.feature_importance) {
        setFeatures(perf.feature_importance);
      }
      if (perf.selected_model) {
        setModelName(perf.selected_model);
      }
    } catch {
      // Non-blocking fallback
    }
  };

  useEffect(() => {
    checkHealth();
    loadInsights();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await predictRisk(formData);
      setPredictionResult(res);
      // Smooth scroll to prediction result on smaller screens
      setTimeout(() => {
        const resultElem = document.getElementById('prediction-results-view');
        if (resultElem && window.innerWidth < 1024) {
          resultElem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during prediction.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(DEFAULT_PATIENT);
    setPredictionResult(null);
    setErrorMessage(null);
  };

  const handleLoadPreset = (presetKey: 'high' | 'low' | 'sample1') => {
    if (presetKey === 'high') {
      setFormData(HIGH_RISK_PRESET);
    } else if (presetKey === 'low') {
      setFormData(LOW_RISK_PRESET);
    } else {
      setFormData(DEFAULT_PATIENT);
    }
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col selection:bg-teal-500/30 selection:text-teal-200">
      {/* Top Clinical Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        health={health}
        checkingHealth={checkingHealth}
        onRefreshHealth={checkHealth}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'performance' ? (
          <ModelPerformance />
        ) : (
          <div className="space-y-8">
            {/* Clinical Context Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 shrink-0">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Clinical Decision Support System (CDSS) Dashboard
                  </h2>
                  <p className="text-xs text-slate-400 max-w-2xl leading-relaxed mt-0.5">
                    Enter patient cardiovascular vitals, fluoroscopy, and exercise stress testing markers to compute statistical heart disease risk probabilities.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Standardized ML Pipeline Active</span>
              </div>
            </div>

            {/* Error Notification */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-3 animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="font-semibold block text-rose-300">Assessment Error</strong>
                  <p className="text-[11px] leading-relaxed">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Assessment Workspace Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Form Column (7 Cols on large screens) */}
              <div className="lg:col-span-7 space-y-6">
                <PatientForm
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  onReset={handleReset}
                  onLoadPreset={handleLoadPreset}
                />
              </div>

              {/* Right Output & Insights Column (5 Cols on large screens) */}
              <div id="prediction-results-view" className="lg:col-span-5 space-y-6">
                {predictionResult ? (
                  <PredictionResult
                    result={predictionResult}
                    patientData={formData}
                  />
                ) : (
                  /* Standby Placeholder Card */
                  <div className="clinical-card p-8 text-center space-y-4 border-dashed border-slate-800">
                    <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto border border-teal-500/20">
                      <HeartHandshake className="w-7 h-7" />
                    </div>
                    <div className="space-y-1.5 max-w-sm mx-auto">
                      <h3 className="text-base font-bold text-white">
                        Awaiting Patient Assessment
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Complete or customize the 13 clinical biomarkers on the left and click <span className="text-teal-400 font-semibold">"Assess Heart Disease Risk"</span> to evaluate patient probability.
                      </p>
                    </div>

                    <div className="pt-2 text-left bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-2">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                        <Info className="w-3.5 h-3.5 text-teal-400" />
                        <span>CDSS Evaluation Process:</span>
                      </div>
                      <ol className="list-decimal list-inside space-y-1 pl-1 text-[11px] text-slate-400">
                        <li>Standardizes physiological units (BP, Chol, ST-depression).</li>
                        <li>Encodes fluoroscopy &amp; thallium scintigraphy indicators.</li>
                        <li>Passes feature vector to calibrated {modelName} model.</li>
                        <li>Returns probability score, risk tier, and clinical next steps.</li>
                      </ol>
                    </div>
                  </div>
                )}

                {/* Model Insights & Feature Importance */}
                {features.length > 0 && (
                  <ModelInsights
                    features={features}
                    modelName={modelName}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Clinical Footer */}
      <Footer />
    </div>
  );
}

export default App;
