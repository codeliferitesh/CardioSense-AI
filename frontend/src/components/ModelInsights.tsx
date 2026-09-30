import React from 'react';
import type { FeatureImportanceItem } from '../types';
import { Info, BarChart3 } from 'lucide-react';

interface ModelInsightsProps {
  features: FeatureImportanceItem[];
  modelName: string;
}

export const ModelInsights: React.FC<ModelInsightsProps> = ({ features, modelName }) => {
  const topFeatures = features.slice(0, 8);
  const maxImportance = topFeatures.length > 0 ? topFeatures[0].importance : 1;

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Cardiovascular':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      case 'Electrocardiogram & Stress':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'Anatomical':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
      case 'Demographics':
        return 'bg-teal-500/10 text-teal-300 border-teal-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="clinical-card p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Model Insights &amp; Feature Importance
            </h3>
            <p className="text-xs text-slate-400">
              Calculated weights from trained {modelName} ensemble
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-slate-950 border border-slate-800 text-teal-400">
          Top Influential Biomarkers
        </span>
      </div>

      <div className="space-y-3.5">
        {topFeatures.map((item, idx) => {
          const widthPct = Math.round((item.importance / maxImportance) * 100);
          const rawPct = (item.importance * 100).toFixed(1);

          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-400 text-[11px] w-4">#{idx + 1}</span>
                  <span className="font-medium text-slate-200">{item.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded border ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-slate-400 text-[11px]">{item.feature}</span>
                  <span className="font-bold text-teal-400 text-xs">{rawPct}%</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800/80">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-500"
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Rationale & Scientific Disclaimer */}
      <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Statistical Note:</strong> Feature importance indicates the relative contribution of each parameter to tree split criteria during model training. It reflects associative patterns within the dataset cohort rather than direct biological causality.
        </p>
      </div>
    </div>
  );
};
