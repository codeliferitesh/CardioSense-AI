import React, { useState } from 'react';
import type { PatientInput } from '../types';
import { 
  User, 
  Heart, 
  Activity, 
  Stethoscope, 
  HelpCircle, 
  Sparkles, 
  RotateCcw,
  Zap,
  FileSpreadsheet
} from 'lucide-react';

interface PatientFormProps {
  formData: PatientInput;
  setFormData: React.Dispatch<React.SetStateAction<PatientInput>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onReset: () => void;
  onLoadPreset: (presetKey: 'high' | 'low' | 'sample1') => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  isLoading,
  onReset,
  onLoadPreset
}) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const handleChange = (field: keyof PatientInput, value: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Top Action Bar: Presets & Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>Quick Clinical Case Presets:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onLoadPreset('sample1')}
            className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
            title="Load actual test sample from dataset (52M, CP 0, BP 125, Chol 212)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
            Dataset Case 1
          </button>
          <button
            type="button"
            onClick={() => onLoadPreset('low')}
            className="px-2.5 py-1 rounded-lg text-xs bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/60 transition-colors flex items-center gap-1.5"
            title="Load low-risk cardiovascular profile"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            Low-Risk Profile
          </button>
          <button
            type="button"
            onClick={() => onLoadPreset('high')}
            className="px-2.5 py-1 rounded-lg text-xs bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 transition-colors flex items-center gap-1.5"
            title="Load high-risk symptomatic profile"
          >
            <Zap className="w-3.5 h-3.5 text-rose-400" />
            High-Risk Profile
          </button>
          <button
            type="button"
            onClick={onReset}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent transition-colors"
            title="Reset form to defaults"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SECTION 1: Patient Information */}
        <div className="clinical-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <User className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                1. Patient Demographics
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">Baseline Data</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Age */}
            <div>
              <label className="clinical-label">Age (Years)</label>
              <input
                type="number"
                min="1"
                max="120"
                value={formData.age}
                onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
                className="clinical-input text-lg font-mono font-bold"
                required
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Valid range: 18 - 100 yrs</span>
            </div>

            {/* Sex */}
            <div>
              <label className="clinical-label">Biological Sex</label>
              <div className="grid grid-cols-2 gap-2 mt-0.5">
                <button
                  type="button"
                  onClick={() => handleChange('sex', 1)}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                    formData.sex === 1
                      ? 'bg-teal-600 text-white border-teal-500 shadow-sm'
                      : 'bg-slate-950/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
                  }`}
                >
                  Male (1)
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('sex', 0)}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                    formData.sex === 0
                      ? 'bg-teal-600 text-white border-teal-500 shadow-sm'
                      : 'bg-slate-950/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
                  }`}
                >
                  Female (0)
                </button>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Dataset mapping: 1=Male, 0=Female</span>
            </div>
          </div>
        </div>

        {/* SECTION 2: Cardiovascular Parameters */}
        <div className="clinical-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Heart className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                2. Cardiovascular Parameters
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">Resting Vitals</span>
          </div>

          <div className="space-y-4">
            {/* Chest Pain Type */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="clinical-label !mb-0">Chest Pain Type (cp)</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setActiveTooltip(activeTooltip === 'cp' ? null : 'cp')}
                    className="text-slate-400 hover:text-teal-400"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                  {activeTooltip === 'cp' && (
                    <div className="absolute right-0 bottom-6 w-64 p-2.5 bg-slate-900 border border-slate-700 rounded-lg shadow-xl text-[11px] text-slate-300 z-20">
                      <strong>0: Typical Angina:</strong> substernal chest discomfort on exertion.<br/>
                      <strong>1: Atypical Angina:</strong> non-classical symptoms.<br/>
                      <strong>2: Non-anginal Pain:</strong> sharp/pleuritic chest pain.<br/>
                      <strong>3: Asymptomatic:</strong> no chest pain reported.
                    </div>
                  )}
                </div>
              </div>
              <select
                value={formData.cp}
                onChange={(e) => handleChange('cp', parseInt(e.target.value))}
                className="clinical-select"
              >
                <option value={0}>0 — Typical Angina</option>
                <option value={1}>1 — Atypical Angina</option>
                <option value={2}>2 — Non-anginal Pain</option>
                <option value={3}>3 — Asymptomatic</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Resting BP */}
              <div>
                <label className="clinical-label">Resting BP (mm Hg)</label>
                <input
                  type="number"
                  min="50"
                  max="260"
                  value={formData.trestbps}
                  onChange={(e) => handleChange('trestbps', parseInt(e.target.value) || 0)}
                  className="clinical-input font-mono font-medium"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-1 block">AHA: &lt;120 Normal, &gt;130 High</span>
              </div>

              {/* Cholesterol */}
              <div>
                <label className="clinical-label">Serum Chol (mg/dl)</label>
                <input
                  type="number"
                  min="80"
                  max="650"
                  value={formData.chol}
                  onChange={(e) => handleChange('chol', parseInt(e.target.value) || 0)}
                  className="clinical-input font-mono font-medium"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Desirable: &lt;200 mg/dl</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Fasting Blood Sugar */}
              <div>
                <label className="clinical-label">Fasting Blood Sugar</label>
                <select
                  value={formData.fbs}
                  onChange={(e) => handleChange('fbs', parseInt(e.target.value))}
                  className="clinical-select"
                >
                  <option value={0}>0 — ≤ 120 mg/dl (Normal)</option>
                  <option value={1}>1 — &gt; 120 mg/dl (Elevated/Diabetic)</option>
                </select>
              </div>

              {/* Resting ECG */}
              <div>
                <label className="clinical-label">Resting ECG Result</label>
                <select
                  value={formData.restecg}
                  onChange={(e) => handleChange('restecg', parseInt(e.target.value))}
                  className="clinical-select"
                >
                  <option value={0}>0 — Normal</option>
                  <option value={1}>1 — ST-T Abnormality</option>
                  <option value={2}>2 — LV Hypertrophy</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Exercise & Stress Test Parameters */}
        <div className="clinical-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Activity className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                3. Exercise &amp; Stress Parameters
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">Stress Test</span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Max Heart Rate */}
              <div>
                <label className="clinical-label">Max Heart Rate (bpm)</label>
                <input
                  type="number"
                  min="50"
                  max="250"
                  value={formData.thalach}
                  onChange={(e) => handleChange('thalach', parseInt(e.target.value) || 0)}
                  className="clinical-input font-mono font-medium"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Est. max: {220 - formData.age} bpm</span>
              </div>

              {/* Exercise Induced Angina */}
              <div>
                <label className="clinical-label">Exercise Angina (exang)</label>
                <select
                  value={formData.exang}
                  onChange={(e) => handleChange('exang', parseInt(e.target.value))}
                  className="clinical-select"
                >
                  <option value={0}>0 — No (Asymptomatic)</option>
                  <option value={1}>1 — Yes (Induced Angina)</option>
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">Exertional chest discomfort</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Oldpeak ST Depression */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="clinical-label !mb-0">ST Depression (Oldpeak)</label>
                  <span className="text-xs font-mono font-bold text-teal-400">{formData.oldpeak.toFixed(1)} mm</span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  min="0.0"
                  max="10.0"
                  value={formData.oldpeak}
                  onChange={(e) => handleChange('oldpeak', parseFloat(e.target.value) || 0)}
                  className="clinical-input font-mono"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Normal: &lt;1.0 mm ST shift</span>
              </div>

              {/* Slope */}
              <div>
                <label className="clinical-label">Peak ST Slope</label>
                <select
                  value={formData.slope}
                  onChange={(e) => handleChange('slope', parseInt(e.target.value))}
                  className="clinical-select"
                >
                  <option value={0}>0 — Upsloping</option>
                  <option value={1}>1 — Flat (Ischemia indicator)</option>
                  <option value={2}>2 — Downsloping</option>
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">ST segment trajectory</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: Anatomical & Fluoroscopy Parameters */}
        <div className="clinical-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Stethoscope className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                4. Anatomical &amp; Fluoroscopy Parameters
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">Imaging &amp; Perfusion</span>
          </div>

          <div className="space-y-4">
            {/* Major Vessels (ca) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="clinical-label !mb-0">Major Vessels Colored (ca)</label>
                <span className="text-xs text-slate-400">Fluoroscopy 0-4</span>
              </div>
              <select
                value={formData.ca}
                onChange={(e) => handleChange('ca', parseInt(e.target.value))}
                className="clinical-select font-mono"
              >
                <option value={0}>0 — Zero vessels colored (Normal)</option>
                <option value={1}>1 — One major vessel colored</option>
                <option value={2}>2 — Two major vessels colored</option>
                <option value={3}>3 — Three major vessels colored</option>
                <option value={4}>4 — Four vessels (High risk)</option>
              </select>
              <span className="text-[10px] text-slate-400 mt-1 block">Number of major coronary arteries with fluroscopic opacification</span>
            </div>

            {/* Thalassemia (thal) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="clinical-label !mb-0">Thallium Stress Scintigraphy (thal)</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setActiveTooltip(activeTooltip === 'thal' ? null : 'thal')}
                    className="text-slate-400 hover:text-teal-400"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                  {activeTooltip === 'thal' && (
                    <div className="absolute right-0 bottom-6 w-64 p-2.5 bg-slate-900 border border-slate-700 rounded-lg shadow-xl text-[11px] text-slate-300 z-20">
                      <strong>1: Normal:</strong> normal perfusion during exercise &amp; rest.<br/>
                      <strong>2: Fixed Defect:</strong> non-reversible scar (prior infarct).<br/>
                      <strong>3: Reversible Defect:</strong> exercise ischemia with rest recovery.
                    </div>
                  )}
                </div>
              </div>
              <select
                value={formData.thal}
                onChange={(e) => handleChange('thal', parseInt(e.target.value))}
                className="clinical-select"
              >
                <option value={1}>1 — Normal Perfusion</option>
                <option value={2}>2 — Fixed Defect (Previous Infarction)</option>
                <option value={3}>3 — Reversible Defect (Active Ischemia)</option>
                <option value={0}>0 — Null / Unspecified</option>
              </select>
              <span className="text-[10px] text-slate-400 mt-1 block">Myocardial perfusion scintigraphy findings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 px-6 rounded-xl font-bold text-sm tracking-wider uppercase text-white bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 shadow-lg shadow-teal-900/40 border border-teal-400/30 transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Evaluating Patient Biomarkers...</span>
            </>
          ) : (
            <>
              <Activity className="w-5 h-5 animate-pulse text-white" />
              <span>Assess Heart Disease Risk</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
