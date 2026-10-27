import React, { useState } from 'react';
import { SAMPLE_ARTICLES, SampleArticle } from '../data/sampleArticles';
import {
  FileText,
  Sparkles,
  Clipboard,
  Trash2,
  TrendingUp,
  TrendingDown,
  MinusCircle,
  HelpCircle,
  Loader2,
  Check
} from 'lucide-react';

interface ArticleInputProps {
  articleText: string;
  setArticleText: (text: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  activeSampleId: string | null;
  onSelectSample: (article: SampleArticle) => void;
}

export const ArticleInput: React.FC<ArticleInputProps> = ({
  articleText,
  setArticleText,
  onAnalyze,
  isLoading,
  activeSampleId,
  onSelectSample,
}) => {
  const [copiedNotification, setCopiedNotification] = useState(false);

  const wordCount = articleText.trim() ? articleText.trim().split(/\s+/).length : 0;
  const charCount = articleText.length;

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setArticleText(text);
        setCopiedNotification(true);
        setTimeout(() => setCopiedNotification(false), 2000);
      }
    } catch {
      // Fallback or permission blocked
    }
  };

  const handleClear = () => {
    setArticleText('');
  };

  return (
    <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
      {/* Glow background accent */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold">
              1
            </span>
            <span>Article Input & Source Data</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Paste any market report, earnings transcript snippet, or press release, or test with curated samples.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handlePasteClipboard}
            className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 hover:text-white border border-slate-700 transition"
            title="Paste from clipboard"
          >
            {copiedNotification ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                <span className="text-emerald-400">Pasted!</span>
              </>
            ) : (
              <>
                <Clipboard className="w-3.5 h-3.5 mr-1 text-slate-400" />
                <span>Paste</span>
              </>
            )}
          </button>

          {articleText && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/20 transition"
              title="Clear input text"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Sample Articles Selector */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Load Sample Financial News:</span>
          </span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Click to auto-populate test articles
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
          {SAMPLE_ARTICLES.map((sample) => {
            const isSelected = activeSampleId === sample.id;
            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => onSelectSample(sample)}
                className={`text-left p-2.5 rounded-xl border text-xs transition-all relative group flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500/50 text-white shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500/30'
                    : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-semibold text-slate-400 truncate">
                      {sample.category}
                    </span>
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                        sample.expectedSentiment === 'Positive'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : sample.expectedSentiment === 'Negative'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {sample.expectedSentiment === 'Positive' && (
                        <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                      )}
                      {sample.expectedSentiment === 'Negative' && (
                        <TrendingDown className="w-2.5 h-2.5 mr-0.5" />
                      )}
                      {sample.expectedSentiment === 'Neutral' && (
                        <MinusCircle className="w-2.5 h-2.5 mr-0.5" />
                      )}
                      {sample.expectedSentiment}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-200 line-clamp-1 group-hover:text-cyan-300 transition-colors">
                    {sample.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Textarea */}
      <div className="relative mb-3">
        <textarea
          rows={7}
          value={articleText}
          onChange={(e) => setArticleText(e.target.value)}
          placeholder="Paste or write financial news content here (e.g. quarterly earnings release, central bank rate decision, market commentary, or macroeconomic indicators)..."
          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 sm:p-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition leading-relaxed resize-y font-normal"
        />

        {/* Floating live counter */}
        <div className="flex items-center justify-between mt-1.5 px-1 text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>
              Words: <strong className="text-slate-300 font-mono">{wordCount}</strong>
            </span>
            <span>
              Characters: <strong className="text-slate-300 font-mono">{charCount}</strong>
            </span>
            {wordCount > 0 && (
              <span className="hidden sm:inline">
                Est. Read Time: <strong className="text-slate-400 font-mono">~{Math.max(1, Math.ceil(wordCount / 200))} min</strong>
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <HelpCircle className="w-3 h-3 text-slate-500" />
            <span>Recommended: 50 - 2,000 words</span>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Server AI ready • Direct sentiment scoring & summarization</span>
        </div>

        <button
          type="button"
          onClick={onAnalyze}
          disabled={isLoading || articleText.trim().length < 15}
          className={`w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-sm text-white shadow-lg transition-all duration-200 ${
            isLoading || articleText.trim().length < 15
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 shadow-emerald-900/30 hover:shadow-cyan-500/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin text-cyan-300" />
              <span>Analyzing Financial News...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2 text-yellow-300" />
              <span>Analyze Financial News</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
};
