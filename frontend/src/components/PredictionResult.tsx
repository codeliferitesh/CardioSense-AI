import React from 'react';
import type { PredictionResponse, PatientInput } from '../types';
import { 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  ListChecks, 
  TrendingUp, 
  Printer
} from 'lucide-react';

interface PredictionResultProps {
  result: PredictionResponse;
  patientData?: PatientInput;
}

export const PredictionResult: React.FC<PredictionResultProps> = ({ result }) => {
  const isHighRisk = result.risk_level === 'High' || result.prediction === 1;
  const isModerateRisk = result.risk_level === 'Moderate';
  const probPercent = Math.round(result.probability * 100);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner: Clinical Risk Stratification */}
      <div className={`p-6 rounded-2xl border ${
        isHighRisk
          ? 'bg-rose-950/40 border-rose-800/80 shadow-rose-950/50'
          : isModerateRisk
          ? 'bg-amber-950/40 border-amber-800/80 shadow-amber-950/50'
          : 'bg-emerald-950/40 border-emerald-800/80 shadow-emerald-950/50'
      } shadow-xl backdrop-blur-md`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className={`p-3.5 rounded-2xl ${
              isHighRisk
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : isModerateRisk
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              {isHighRisk ? (
                <AlertTriangle className="w-8 h-8 animate-pulse" />
              ) : isModerateRisk ? (
                <AlertTriangle className="w-8 h-8" />
              ) : (
                <CheckCircle2 className="w-8 h-8" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase tracking-wider font-mono font-semibold text-slate-400">
                  Model Prediction Output
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                  isHighRisk 
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                    : isModerateRisk
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {result.risk_category}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white tracking-tight">
                {isHighRisk 
                  ? 'Model predicts a higher likelihood of heart disease' 
                  : isModerateRisk
                  ? 'Model predicts moderate / borderline heart disease risk'
                  : 'Predicted lower likelihood of heart disease'}
              </h3>
              
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {result.clinical_summary}
              </p>
            </div>
          </div>

          {/* Probability Gauge Box */}
          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950/80 border border-slate-800 min-w-[170px] text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Model Probability
            </span>
            <div className="flex items-baseline gap-1 my-1">
              <span className={`text-4xl font-extrabold font-mono ${
                isHighRisk ? 'text-rose-400' : isModerateRisk ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {probPercent}
              </span>
              <span className="text-lg font-bold text-slate-400 font-mono">%</span>
            </div>
            {/* Meter Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1">
              <div
                className={`h-full transition-all duration-700 ease-out ${
                  isHighRisk 
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500' 
                    : isModerateRisk
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(Math.max(probPercent, 5), 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1.5 font-mono">
              Engine: {result.model}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Key Risk Factors & Evidence-Based Clinical Guidance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Contributing Factors */}
        <div className="clinical-card p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-slate-200">
            <TrendingUp className="w-4 h-4 text-teal-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider">
              Key Contributing Patient Factors
            </h4>
          </div>

          <ul className="space-y-2.5">
            {result.key_contributing_factors && result.key_contributing_factors.length > 0 ? (
              result.key_contributing_factors.map((factor, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                  <span>{factor}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-slate-400 italic">
                No acute abnormal cardiovascular markers triggered in input features.
              </li>
            )}
          </ul>
        </div>

        {/* Evidence-Based Clinical Decision Support Guidance */}
        <div className="clinical-card p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-slate-200">
            <ListChecks className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider">
              Clinical Decision Support Recommendations
            </h4>
          </div>

          <ul className="space-y-2.5">
            {result.recommendations && result.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mandatory Medical Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 text-amber-200/90 text-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-semibold block text-amber-300">
            Clinical Decision Support System (CDSS) Notice
          </strong>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            Important: This prediction is generated from a machine-learning model trained on cohort data and should not be used as an autonomous medical diagnosis. Clinical assessment by a qualified healthcare professional, combined with direct diagnostic imaging, comprehensive lab testing, and patient history, is required before making treatment decisions.
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-[11px] font-mono text-slate-400">
          Assessment Timestamp: {new Date(result.timestamp || Date.now()).toLocaleString()}
        </span>
        <button
          onClick={handlePrint}
          className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-2"
        >
          <Printer className="w-3.5 h-3.5 text-teal-400" />
          Print / Export CDSS Report
        </button>
      </div>
    </div>
  );
};
