import React, { useEffect, useState } from 'react';
import type { ModelPerformanceData } from '../types';
import { getModelPerformance } from '../services/api';
import { 
  Database, 
  ShieldAlert, 
  Layers, 
  Award,
  RefreshCw,
  BarChart2
} from 'lucide-react';

export const ModelPerformance: React.FC = () => {
  const [data, setData] = useState<ModelPerformanceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const perf = await getModelPerformance();
      setData(perf);
    } catch (err: any) {
      setError(err.message || 'Failed to load model performance benchmarks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-10 h-10 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-400">Loading benchmark performance metrics...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 rounded-2xl bg-rose-950/30 border border-rose-800 text-center space-y-4 max-w-xl mx-auto my-12">
        <ShieldAlert className="w-10 h-10 text-rose-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Performance Metrics Unavailable</h3>
        <p className="text-xs text-rose-200">{error}</p>
        <button
          onClick={fetchMetrics}
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const selectedModelData = data.models.find(m => m.is_selected) || data.models[0];

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-teal-950 border border-teal-800 text-teal-400">
              CDSS Validation Benchmarks
            </span>
            <span className="text-xs text-slate-400">Reproducible Stratified 5-Fold Split</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Machine Learning Model Performance &amp; Evaluation
          </h2>
          <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
            Rigorous supervised classification benchmark comparing ensemble trees, kernel methods, and linear baselines trained on clinical cardiac cohorts.
          </p>
        </div>

        <button
          onClick={fetchMetrics}
          className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-2 shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5 text-teal-400" />
          Refresh Metrics
        </button>
      </div>

      {/* Top 4 Key Metric Cards for Champion Model */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Accuracy */}
        <div className="clinical-card p-4 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Test Accuracy
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold font-mono text-white">
              {(selectedModelData.accuracy * 100).toFixed(1)}
            </span>
            <span className="text-sm font-mono text-slate-400">%</span>
          </div>
          <span className="text-[10px] text-teal-400 font-medium">Selected: {selectedModelData.model_name}</span>
        </div>

        {/* ROC-AUC */}
        <div className="clinical-card p-4 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            ROC - AUC Score
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold font-mono text-cyan-400">
              {selectedModelData.roc_auc.toFixed(4)}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Discrimination Power</span>
        </div>

        {/* Clinical Recall / Sensitivity */}
        <div className="clinical-card p-4 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Clinical Sensitivity (Recall)
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold font-mono text-emerald-400">
              {(selectedModelData.recall * 100).toFixed(1)}
            </span>
            <span className="text-sm font-mono text-slate-400">%</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Minimizes False Negatives</span>
        </div>

        {/* Precision */}
        <div className="clinical-card p-4 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Precision
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold font-mono text-teal-300">
              {(selectedModelData.precision * 100).toFixed(1)}
            </span>
            <span className="text-sm font-mono text-slate-400">%</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Positive Predictive Value</span>
        </div>

        {/* F1 Score */}
        <div className="clinical-card p-4 space-y-1 col-span-2 lg:col-span-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Harmonic F1-Score
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold font-mono text-indigo-400">
              {(selectedModelData.f1_score * 100).toFixed(1)}
            </span>
            <span className="text-sm font-mono text-slate-400">%</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Balanced Harmonic Mean</span>
        </div>
      </div>

      {/* Multi-Model Comparison Table */}
      <div className="clinical-card p-6 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                Candidate Models Evaluation Benchmark
              </h3>
              <p className="text-xs text-slate-400">
                Trained and evaluated on held-out 20% test partition (N = {data.dataset_summary.test_samples})
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[11px]">
                <th className="py-3 px-4">Model Architecture</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4">Precision</th>
                <th className="py-3 px-4">Recall</th>
                <th className="py-3 px-4">F1-Score</th>
                <th className="py-3 px-4">ROC-AUC</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {data.models.map((m, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    m.is_selected ? 'bg-teal-950/30 text-white font-semibold' : 'text-slate-300'
                  }`}
                >
                  <td className="py-3.5 px-4 flex items-center gap-2 font-sans font-medium">
                    {m.is_selected && <Award className="w-4 h-4 text-teal-400 shrink-0" />}
                    <span>{m.model_name}</span>
                  </td>
                  <td className="py-3.5 px-4">{(m.accuracy * 100).toFixed(2)}%</td>
                  <td className="py-3.5 px-4">{(m.precision * 100).toFixed(2)}%</td>
                  <td className="py-3.5 px-4 text-emerald-400">{(m.recall * 100).toFixed(2)}%</td>
                  <td className="py-3.5 px-4">{(m.f1_score * 100).toFixed(2)}%</td>
                  <td className="py-3.5 px-4 text-cyan-400 font-bold">{m.roc_auc.toFixed(4)}</td>
                  <td className="py-3.5 px-4 text-center">
                    {m.is_selected ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/40 uppercase font-sans">
                        Production Model
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] text-slate-400 font-sans">
                        Candidate
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confusion Matrix & Dataset Architecture Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confusion Matrix Visualizer */}
        <div className="clinical-card p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <BarChart2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  Confusion Matrix ({selectedModelData.model_name})
                </h3>
                <p className="text-xs text-slate-400">
                  Test set classification breakdown (N = {data.dataset_summary.test_samples})
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {/* True Negative */}
            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-center space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                True Negatives (TN)
              </span>
              <span className="text-3xl font-extrabold font-mono text-teal-400 block">
                {selectedModelData.confusion_matrix[0][0]}
              </span>
              <span className="text-[10px] text-slate-400">Correctly predicted Low Risk</span>
            </div>

            {/* False Positive */}
            <div className="p-4 rounded-xl bg-slate-950/90 border border-amber-800/40 text-center space-y-1">
              <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block">
                False Positives (FP)
              </span>
              <span className="text-3xl font-extrabold font-mono text-amber-400 block">
                {selectedModelData.confusion_matrix[0][1]}
              </span>
              <span className="text-[10px] text-slate-400">Predicted High Risk, Actually Low</span>
            </div>

            {/* False Negative */}
            <div className="p-4 rounded-xl bg-slate-950/90 border border-rose-800/50 text-center space-y-1">
              <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block">
                False Negatives (FN)
              </span>
              <span className="text-3xl font-extrabold font-mono text-rose-400 block">
                {selectedModelData.confusion_matrix[1][0]}
              </span>
              <span className="text-[10px] text-slate-400">Critical missed cases (Minimized)</span>
            </div>

            {/* True Positive */}
            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-center space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                True Positives (TP)
              </span>
              <span className="text-3xl font-extrabold font-mono text-emerald-400 block">
                {selectedModelData.confusion_matrix[1][1]}
              </span>
              <span className="text-[10px] text-slate-400">Correctly predicted High Risk</span>
            </div>
          </div>
        </div>

        {/* Dataset Breakdown & Split */}
        <div className="clinical-card p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  Dataset Architecture &amp; Stratification
                </h3>
                <p className="text-xs text-slate-400">
                  Total Records: {data.dataset_summary.total_samples} samples, {data.dataset_summary.num_features} physiological features
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-1 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Training Cohort (80% Stratified)</span>
              <span className="font-mono font-bold text-slate-200">{data.dataset_summary.train_samples} samples</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Testing Cohort (20% Stratified)</span>
              <span className="font-mono font-bold text-slate-200">{data.dataset_summary.test_samples} samples</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Target Distribution</span>
              <div className="font-mono text-right">
                <span className="text-emerald-400 font-bold">{data.dataset_summary.target_distribution.higher_risk_count} High Risk ({data.dataset_summary.target_distribution.higher_risk_pct}%)</span>
                <span className="text-slate-400"> / </span>
                <span className="text-teal-400 font-bold">{data.dataset_summary.target_distribution.lower_risk_count} Low Risk ({data.dataset_summary.target_distribution.lower_risk_pct}%)</span>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 block mb-1 font-semibold">Model Selection Rationale:</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {data.selection_rationale}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed text-[11px]">
          {data.disclaimer}
        </p>
      </div>
    </div>
  );
};
