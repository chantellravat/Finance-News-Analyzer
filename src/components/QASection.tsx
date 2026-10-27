import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types/finance';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  Trash2,
  Copy,
  Check,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

interface QASectionProps {
  articleText: string;
  suggestedQuestions: string[];
  messages: ChatMessage[];
  onSendMessage: (question: string) => void;
  isLoading: boolean;
  onClearChat: () => void;
}

export const QASection: React.FC<QASectionProps> = ({
  articleText,
  suggestedQuestions,
  messages,
  onSendMessage,
  isLoading,
  onClearChat,
}) => {
  const [inputQuestion, setInputQuestion] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const defaultStarterQuestions = [
    'What are the primary drivers behind this financial report?',
    'How might this impact stock market valuations and investor sentiment?',
    'What key risks or challenges are highlighted for the future?',
    'Can you explain the main financial metrics mentioned in plain terms?',
  ];

  const questionsToDisplay =
    suggestedQuestions && suggestedQuestions.length > 0
      ? suggestedQuestions
      : defaultStarterQuestions;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuestion.trim() || isLoading) return;
    onSendMessage(inputQuestion.trim());
    setInputQuestion('');
  };

  const handleChipClick = (question: string) => {
    if (isLoading) return;
    onSendMessage(question);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
      {/* Background glow */}
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-800/80 pb-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
              4
            </span>
            <span>Interactive Q&A Intelligence</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ask targeted questions regarding market catalysts, financial concepts, or statistics in the article.
          </p>
        </div>

        {messages.length > 0 && (
          <button
            type="button"
            onClick={onClearChat}
            className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 transition self-start sm:self-center"
            title="Clear conversation"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            <span>Clear Chat</span>
          </button>
        )}
      </div>

      {/* Suggested Questions Chips */}
      <div className="mb-4 bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>Recommended Questions (Click to Ask):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {questionsToDisplay.map((q, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading || !articleText.trim()}
              onClick={() => handleChipClick(q)}
              className="text-left px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-700/80 text-slate-300 hover:bg-blue-950/40 hover:text-blue-300 hover:border-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed group flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-cyan-400 group-hover:rotate-12 transition-transform shrink-0" />
              <span>{q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 min-h-[220px] max-h-[380px] overflow-y-auto mb-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center text-center p-4">
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-3">
              <MessageSquare className="w-6 h-6 text-slate-500" />
            </div>
            <p className="text-sm font-semibold text-slate-300">
              No questions asked yet
            </p>
            <p className="text-xs text-slate-500 max-w-md mt-1">
              Select one of the suggested prompts above or type your own custom question regarding this financial news article below.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-br-none shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {msg.role === 'user' ? 'You' : 'Financial AI Analyst'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 opacity-70">
                      {msg.timestamp}
                    </span>
                    {msg.role === 'model' && (
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="p-1 hover:text-white text-slate-400 transition"
                        title="Copy answer"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div className="whitespace-pre-wrap font-normal">{msg.text}</div>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-bl-none p-3.5 text-xs text-slate-300 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>Analyzing context & drafting response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          placeholder={
            articleText.trim()
              ? "Ask anything about this article (e.g. 'What does this mean for inflation?')"
              : 'Please paste or analyze an article first...'
          }
          disabled={isLoading || !articleText.trim()}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
        />

        <button
          type="submit"
          disabled={isLoading || !inputQuestion.trim() || !articleText.trim()}
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span className="hidden sm:inline mr-1.5">Ask</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </section>
  );
};
