import React from 'react';
import { AnalysisResult } from '../types/finance';
import {
  TrendingUp,
  TrendingDown,
  MinusCircle,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Activity,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface SentimentCardProps {
  analysis: AnalysisResult;
}

export const SentimentCard: React.FC<SentimentCardProps> = ({ analysis }) => {
  const isPositive = analysis.sentiment === 'Positive';
  const isNegative = analysis.sentiment === 'Negative';
  const isNeutral = analysis.sentiment === 'Neutral';

  // Dynamic styling based on sentiment
  const themeConfig = {
    Positive: {
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      glowBg: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      icon: TrendingUp,
      iconColor: 'text-emerald-400',
      label: 'POSITIVE SENTIMENT',
      subtitle: 'Bullish market indicators and expansionary signals detected',
      barColor: 'from-emerald-500 to-teal-400',
    },
    Negative: {
      badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      glowBg: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30',
      icon: TrendingDown,
      iconColor: 'text-rose-400',
      label: 'NEGATIVE SENTIMENT',
      subtitle: 'Bearish headwinds, restrictive policy, or contraction risks detected',
      barColor: 'from-rose-500 to-amber-500',
    },
    Neutral: {
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      glowBg: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      icon: MinusCircle,
      iconColor: 'text-amber-400',
      label: 'NEUTRAL / BALANCED SENTIMENT',
      subtitle: 'Mixed indicators, equilibrium prints, or market consolidation detected',
      barColor: 'from-amber-400 to-cyan-400',
    },
  }[analysis.sentiment] || {
    badgeBg: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    glowBg: 'bg-slate-500/10',
    borderColor: 'border-slate-800',
    icon: MinusCircle,
    iconColor: 'text-slate-400',
    label: analysis.sentiment,
    subtitle: 'Financial sentiment classification',
    barColor: 'from-slate-400 to-slate-500',
  };

  const IconComponent = themeConfig.icon;

  return (
    <section className={`bg-slate-900/90 border ${themeConfig.borderColor} rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden backdrop-blur-sm transition-all duration-300`}>
      {/* Background ambient glow */}
      <div className={`absolute -top-12 -right-12 w-64 h-64 ${themeConfig.glowBg} rounded-full blur-3xl pointer-events-none`} />

      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
        <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            2
          </span>
          <span>Sentiment Analysis & Classification</span>
        </h2>
        <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>AI Model Evaluated</span>
        </span>
      </div>

      {/* Main Sentiment Classification Banner */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-5 items-center">
        {/* Sentiment Badge & Score */}
        <div className="md:col-span-5 bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Classification
            </span>
            {analysis.marketTone && (
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-cyan-300 border border-slate-700 truncate max-w-[170px]">
                {analysis.marketTone}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 my-1">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-inner ${themeConfig.badgeBg}`}>
              <IconComponent className={`w-7 h-7 ${themeConfig.iconColor}`} />
            </div>
            <div>
              <div className={`text-2xl font-extrabold tracking-tight ${themeConfig.iconColor}`}>
                {analysis.sentiment}
              </div>
              <div className="text-xs text-slate-400 font-medium">
                {themeConfig.subtitle}
              </div>
            </div>
          </div>

          {/* Confidence Meter */}
          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 font-medium">Model Confidence:</span>
              <span className="font-mono font-bold text-white">
                {analysis.sentimentScore}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${themeConfig.barColor} transition-all duration-700 ease-out`}
                style={{ width: `${Math.min(100, Math.max(10, analysis.sentimentScore))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Sentiment Explanation */}
        <div className="md:col-span-7 bg-slate-950/40 border border-slate-800/60 rounded-xl p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <span>Sentiment Driver & Economic Rationale:</span>
          </h3>
          <p className="text-sm text-slate-200 leading-relaxed">
            {analysis.sentimentExplanation}
          </p>

          {/* Affected Sectors */}
          {analysis.affectedSectors && analysis.affectedSectors.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-800/60">
              <span className="text-[11px] font-semibold text-slate-400 mr-2 flex items-center gap-1 inline-flex">
                <Layers className="w-3 h-3 text-cyan-400" />
                Impacted Sectors:
              </span>
              <div className="inline-flex flex-wrap gap-1.5 mt-1">
                {analysis.affectedSectors.map((sector, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60"
                  >
                    {sector}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bullish vs Bearish Factors Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bullish Factors */}
        <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            <span>Bullish Catalysts / Positive Factors</span>
          </div>
          {analysis.bullishFactors && analysis.bullishFactors.length > 0 ? (
            <ul className="space-y-1.5">
              {analysis.bullishFactors.map((factor, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 italic">No significant bullish catalysts identified in this report.</p>
          )}
        </div>

        {/* Bearish Factors */}
        <div className="bg-rose-950/20 border border-rose-500/20 rounded-xl p-3.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">
            <ArrowDownRight className="w-4 h-4 text-rose-400" />
            <span>Bearish Risks / Headwinds</span>
          </div>
          {analysis.bearishFactors && analysis.bearishFactors.length > 0 ? (
            <ul className="space-y-1.5">
              {analysis.bearishFactors.map((factor, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 italic">No immediate structural headwinds highlighted.</p>
          )}
        </div>
      </div>
    </section>
  );
};
