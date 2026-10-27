import React, { useState } from 'react';
import { AnalysisResult } from '../types/finance';
import {
  FileText,
  Volume2,
  VolumeX,
  Copy,
  Check,
  CheckCircle,
  Hash,
  Download,
  Share2
} from 'lucide-react';

interface SummaryCardProps {
  analysis: AnalysisResult;
  articleSnippet?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ analysis, articleSnippet }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSpeakSummary = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(analysis.summary);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handleCopyReport = async () => {
    const formatted = `--- FINANCE NEWS ANALYSIS REPORT ---
Sentiment: ${analysis.sentiment} (${analysis.sentimentScore}% Confidence)
Market Tone: ${analysis.marketTone}

EXECUTIVE SUMMARY:
${analysis.summary}

KEY TAKEAWAYS:
${analysis.keyTakeaways.map((t) => `• ${t}`).join('\n')}

KEY METRICS:
${analysis.keyMetrics.map((m) => `${m.metric}: ${m.value}`).join('\n')}

SENTIMENT RATIONALE:
${analysis.sentimentExplanation}

DISCLAIMER: For informational & educational purposes only. Not financial advice.`;

    try {
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
      {/* Background glow */}
      <div className="absolute top-0 left-1/3 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-800/80 pb-3">
        <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-semibold">
            3
          </span>
          <span>Executive Summary & Key Metrics</span>
        </h2>

        {/* Audio read-aloud & Copy buttons */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleSpeakSummary}
            className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
              isPlayingAudio
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white border-slate-700'
            }`}
            title="Read summary aloud"
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-3.5 h-3.5 mr-1 text-cyan-400" />
                <span>Stop Audio</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 mr-1 text-teal-400" />
                <span>Listen</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCopyReport}
            className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white border border-slate-700 transition"
            title="Copy full analysis report"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                <span className="text-emerald-400">Report Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1 text-slate-400" />
                <span>Copy Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Executive Summary Box */}
      <div className="bg-gradient-to-br from-slate-950/80 to-slate-900/60 border border-teal-500/20 rounded-xl p-4 sm:p-5 mb-5 relative">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-teal-400 mb-2">
          <span className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-teal-400" />
            Executive Summary
          </span>
          <span className="text-slate-400 font-normal normal-case">
            Synthesized by AI
          </span>
        </div>
        <p className="text-sm sm:text-base text-slate-100 font-normal leading-relaxed">
          {analysis.summary}
        </p>
      </div>

      {/* Key Takeaways & Metrics Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Key Takeaways */}
        <div className="lg:col-span-7 bg-slate-950/50 border border-slate-800/80 rounded-xl p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
            <span>Key Takeaways & Core Events</span>
          </h3>
          <ul className="space-y-2.5">
            {analysis.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-teal-300 border border-slate-700 text-[11px] font-semibold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Key Extracted Metrics */}
        <div className="lg:col-span-5 bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-cyan-400" />
              <span>Extracted Financial Metrics</span>
            </h3>

            {analysis.keyMetrics && analysis.keyMetrics.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                {analysis.keyMetrics.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition"
                  >
                    <span className="text-xs text-slate-400 font-medium truncate mr-2">
                      {item.metric}
                    </span>
                    <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20 shrink-0">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No specific numerical data points extracted.</p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500">
            Numerical indicators parsed directly from article body.
          </div>
        </div>
      </div>
    </section>
  );
};
