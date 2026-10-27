export type SentimentType = 'Positive' | 'Negative' | 'Neutral';

export interface KeyMetric {
  metric: string;
  value: string;
}

export interface AnalysisResult {
  sentiment: SentimentType;
  sentimentScore: number;
  sentimentExplanation: string;
  summary: string;
  keyTakeaways: string[];
  marketTone: string;
  bullishFactors: string[];
  bearishFactors: string[];
  affectedSectors: string[];
  keyMetrics: KeyMetric[];
  suggestedQuestions: string[];
  analyzedAt?: string;
  articleSnippet?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  error?: boolean;
}
