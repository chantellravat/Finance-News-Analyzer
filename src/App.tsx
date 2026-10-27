import React, { useState, useEffect } from 'react';
import { SAMPLE_ARTICLES, SampleArticle } from './data/sampleArticles';
import { AnalysisResult, ChatMessage } from './types/finance';
import { generateLocalFinancialAnalysis } from './utils/fallbackAnalyzer';
import { Navbar } from './components/Navbar';
import { ArticleInput } from './components/ArticleInput';
import { SentimentCard } from './components/SentimentCard';
import { SummaryCard } from './components/SummaryCard';
import { QASection } from './components/QASection';
import { Disclaimer } from './components/Disclaimer';
import { GlossaryModal } from './components/GlossaryModal';
import { AlertCircle, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react';

export default function App() {
  const [articleText, setArticleText] = useState<string>(SAMPLE_ARTICLES[0].content);
  const [activeSampleId, setActiveSampleId] = useState<string | null>(SAMPLE_ARTICLES[0].id);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Q&A state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoadingChat, setIsLoadingChat] = useState<boolean>(false);

  // Glossary modal
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);

  // Analyze the default article on initial load so the dashboard is immediately rich and engaging
  useEffect(() => {
    analyzeCurrentArticle(SAMPLE_ARTICLES[0].content);
  }, []);

  const handleSelectSample = (sample: SampleArticle) => {
    setActiveSampleId(sample.id);
    setArticleText(sample.content);
    setAnalysisError(null);
  };

  const analyzeCurrentArticle = async (textToAnalyze?: string) => {
    const text = (textToAnalyze ?? articleText).trim();
    if (!text || text.length < 15) {
      setAnalysisError('Please enter at least 15 characters of financial news content.');
      return;
    }

    setIsLoadingAnalysis(true);
    setAnalysisError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data: AnalysisResult = await response.json();
      setAnalysisResult(data);
      // Reset chat messages when new article is analyzed to keep context clean
      setChatMessages([]);
    } catch (err: any) {
      console.warn('API analyze request fallback invoked:', err);
      // Resilient fallback for offline / demo environments
      const fallback = generateLocalFinancialAnalysis(text);
      setAnalysisResult(fallback);
      setAnalysisError(
        'Note: Used local financial engine due to API connection limit. Sentiment and summary generated.'
      );
      setChatMessages([]);
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const handleSendMessage = async (question: string) => {
    if (!question.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: question.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setIsLoadingChat(true);

    try {
      const historyPayload = chatMessages.slice(-6).map((msg) => ({
        role: msg.role,
        text: msg.text,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: articleText,
          question: question.trim(),
          history: historyPayload,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get answer from AI analyst');
      }

      const data = await response.json();
      const modelMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: data.answer || 'No response returned from the model.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, modelMessage]);
    } catch (error: any) {
      console.error('Chat error:', error);
      // Educational fallback answer
      const fallbackAnswer = `Based on the provided article:
• The central theme revolves around current financial developments and market reactions.
• The reported figures directly impact analyst consensus and investor risk premiums.
• Note: For full real-time model streaming, verify that the Gemini API secret is attached in your environment settings.`;

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: fallbackAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleResetAll = () => {
    setArticleText('');
    setActiveSampleId(null);
    setAnalysisResult(null);
    setAnalysisError(null);
    setChatMessages([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <Navbar
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        onReset={handleResetAll}
        hasData={!!analysisResult || articleText.length > 0}
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Banner Alert if any warning */}
        {analysisError && (
          <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-3.5 text-xs text-amber-200 flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{analysisError}</span>
            </div>
            <button
              onClick={() => setAnalysisError(null)}
              className="text-amber-400 hover:text-amber-100 text-[11px] font-medium underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Section 1: Article Input & Sample Articles */}
        <ArticleInput
          articleText={articleText}
          setArticleText={(text) => {
            setArticleText(text);
            setActiveSampleId(null);
          }}
          onAnalyze={() => analyzeCurrentArticle()}
          isLoading={isLoadingAnalysis}
          activeSampleId={activeSampleId}
          onSelectSample={handleSelectSample}
        />

        {/* Section 2: Sentiment Classification & Market Analysis */}
        {analysisResult && (
          <div className="space-y-6 transition-all duration-300">
            <SentimentCard analysis={analysisResult} />

            {/* Section 3: Summary & Key Financial Metrics */}
            <SummaryCard analysis={analysisResult} articleSnippet={articleText} />

            {/* Section 4: Interactive Question & Answer (Q&A) */}
            <QASection
              articleText={articleText}
              suggestedQuestions={analysisResult.suggestedQuestions}
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              isLoading={isLoadingChat}
              onClearChat={() => setChatMessages([])}
            />
          </div>
        )}

        {/* Section 5: Mandatory Informational Disclaimer */}
        <Disclaimer />
      </main>

      {/* Financial Glossary Modal */}
      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />
    </div>
  );
}
