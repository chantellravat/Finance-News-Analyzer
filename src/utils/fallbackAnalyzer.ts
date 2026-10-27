import { AnalysisResult } from '../types/finance';

export function generateLocalFinancialAnalysis(text: string): AnalysisResult {
  const lower = text.toLowerCase();

  // Keyword-based sentiment heuristic
  const positiveWords = [
    'surge', 'jump', 'gain', 'beat', 'growth', 'outperform', 'profit', 'record',
    'expansion', 'bullish', 'dividend', 'repurchase', 'rally', 'positive', 'strong',
    'exceeded', 'upgrade', 'optimism', 'boom'
  ];

  const negativeWords = [
    'slump', 'drop', 'fall', 'plunge', 'decline', 'tumble', 'recession', 'tightening',
    'hawkish', 'delinquency', 'inflation', 'loss', 'miss', 'headwind', 'risk',
    'slowdown', 'downturn', 'crisis', 'layoff', 'contraction'
  ];

  let posCount = 0;
  let negCount = 0;

  for (const word of positiveWords) {
    const matches = lower.match(new RegExp(`\\b${word}`, 'g'));
    if (matches) posCount += matches.length;
  }

  for (const word of negativeWords) {
    const matches = lower.match(new RegExp(`\\b${word}`, 'g'));
    if (matches) negCount += matches.length;
  }

  let sentiment: 'Positive' | 'Negative' | 'Neutral' = 'Neutral';
  let score = 78;
  let tone = 'Balanced Financial Outlook';

  if (posCount > negCount + 1) {
    sentiment = 'Positive';
    score = Math.min(96, 75 + posCount * 3);
    tone = 'Bullish Corporate / Economic Growth';
  } else if (negCount > posCount + 1) {
    sentiment = 'Negative';
    score = Math.min(95, 75 + negCount * 3);
    tone = 'Bearish Headwinds / Macro Caution';
  } else {
    sentiment = 'Neutral';
    score = 82;
    tone = 'Mixed / Neutral Market Data';
  }

  // Extract sentences for summary
  const sentences = text
    .split(/(?<=[.?!])\s+/)
    .filter((s) => s.trim().length > 20);

  const summary =
    sentences.slice(0, 3).join(' ') ||
    'The provided article details current market performance, financial disclosures, and economic factors impacting broader market assets.';

  // Extract numbers / percentages as metrics
  const numberRegex = /(\$[\d,.]+[BMKbmk]?|\d+(?:\.\d+)?%|\b\d+\s+basis points\b)/g;
  const matches = text.match(numberRegex) || [];
  const uniqueMatches = Array.from(new Set(matches)).slice(0, 4);

  const keyMetrics = uniqueMatches.map((val, idx) => ({
    metric: `Key Metric ${idx + 1}`,
    value: val,
  }));

  if (keyMetrics.length === 0) {
    keyMetrics.push(
      { metric: 'Market Condition', value: 'Active Observation' },
      { metric: 'Data Horizon', value: 'Quarterly' }
    );
  }

  return {
    sentiment,
    sentimentScore: score,
    sentimentExplanation: `Based on linguistic and financial indicators, the news article conveys a ${sentiment.toLowerCase()} stance. ${
      sentiment === 'Positive'
        ? 'Key growth catalysts, earnings outperformance, or expansionary developments support investor confidence.'
        : sentiment === 'Negative'
        ? 'Persistent macro risks, restrictive monetary posture, or declining consumer metrics weigh on the outlook.'
        : 'Conflicting or balanced economic figures reflect an equilibrium environment without strong directional pressure.'
    }`,
    summary: summary,
    keyTakeaways: [
      sentences[0] || 'Primary financial announcement reported.',
      sentences[1] || 'Market participants adjusted forward asset expectations.',
      sentences[2] || 'Key stakeholders provided operational or policy commentary.',
    ],
    marketTone: tone,
    bullishFactors:
      sentiment === 'Positive'
        ? ['Top-line and bottom-line expansion', 'Commercial operational resilience']
        : ['Potential stabilization at current market valuation levels'],
    bearishFactors:
      sentiment === 'Negative'
        ? ['Macroeconomic or cost of capital headwinds', 'Risk of earnings or demand compression']
        : ['Sensitivity to upcoming monetary policy announcements'],
    affectedSectors: ['Equities', 'Financial Services', 'Corporate Credit'],
    keyMetrics: keyMetrics,
    suggestedQuestions: [
      'What are the primary factors driving this market reaction?',
      'How does this news impact broader economic forecasts?',
      'What are the key financial ratios or figures mentioned?',
    ],
  };
}
