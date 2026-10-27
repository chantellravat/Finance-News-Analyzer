import React from 'react';
import { TrendingUp, BookOpen, Sparkles, GraduationCap, RotateCcw } from 'lucide-react';

interface NavbarProps {
  onOpenGlossary: () => void;
  onReset: () => void;
  hasData: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenGlossary, onReset, hasData }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  Finance News Analyzer
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Gemini AI
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                <span>College AI Financial Intelligence Project</span>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onOpenGlossary}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white border border-slate-700/80 transition-colors shadow-sm"
              title="Learn common financial terms"
            >
              <BookOpen className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
              <span>Financial Glossary</span>
            </button>

            {hasData && (
              <button
                onClick={onReset}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/20 transition-colors"
                title="Clear current analysis"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
