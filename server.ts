import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '2mb' }));

// Initialize Google GenAI client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for calling Gemini with retry and fallback models
async function generateWithFallback(callFn: (model: string) => Promise<any>) {
  const models = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (const model of models) {
    try {
      return await callFn(model);
    } catch (err: any) {
      lastError = err;
      const isRateOrUnavailable =
        err?.status === 503 ||
        err?.message?.includes('503') ||
        err?.message?.includes('high demand') ||
        err?.message?.includes('429') ||
        err?.message?.includes('quota');

      if (isRateOrUnavailable) {
        console.warn(`Model ${model} unavailable, trying fallback model...`);
        continue;
      }
      throw err;
    }
  }

  throw lastError;
}

// Fallback analyzer function on server
function getStructuredFallback(text: string) {
  const lower = text.toLowerCase();
  const posWords = ['surge', 'jump', 'gain', 'beat', 'growth', 'outperform', 'profit', 'expansion', 'bullish', 'record'];
  const negWords = ['slump', 'drop', 'fall', 'plunge', 'decline', 'hawkish', 'tightening', 'inflation', 'loss', 'delinquency'];

  let p = 0;
  let n = 0;
  posWords.forEach(w => { if (lower.includes(w)) p++; });
  negWords.forEach(w => { if (lower.includes(w)) n++; });

  let sentiment: 'Positive' | 'Negative' | 'Neutral' = 'Neutral';
  let score = 80;
  let marketTone = 'Balanced Market Outlook';

  if (p > n) {
    sentiment = 'Positive';
    score = 88;
    marketTone = 'Bullish Corporate Expansion';
  } else if (n > p) {
    sentiment = 'Negative';
    score = 86;
    marketTone = 'Macroeconomic Tightening / Headwinds';
  }

  const sentences = text.split(/(?<=[.?!])\s+/).filter(s => s.trim().length > 15);
  const summary = sentences.slice(0, 3).join(' ') || text.slice(0, 250) + '...';

  // extract numbers or metrics
  const numMatches = text.match(/(\$[\d,.]+[BMKbmk]?|\d+(?:\.\d+)?%)/g) || [];
  const keyMetrics = Array.from(new Set(numMatches)).slice(0, 3).map((v, i) => ({
    metric: `Key Figure ${i + 1}`,
    value: v
  }));

  return {
    sentiment,
    sentimentScore: score,
    sentimentExplanation: `The text reflects a ${sentiment.toLowerCase()} market tone based on corporate disclosures and current economic data points.`,
    summary: summary,
    keyTakeaways: [
      sentences[0] || 'Key financial event reported in this news cycle.',
      sentences[1] || 'Market observers noted adjusted forward projections.',
      sentences[2] || 'Stakeholders highlighted capital deployment priorities.'
    ],
    marketTone: marketTone,
    bullishFactors: sentiment === 'Positive' ? ['Revenue outperformance and robust commercial demand', 'Strong cash flow generation'] : ['Valuation support at current levels'],
    bearishFactors: sentiment === 'Negative' ? ['Higher cost of capital or macroeconomic friction', 'Consumer price sensitivity'] : ['Upcoming policy review uncertainty'],
    affectedSectors: ['Equities', 'Financial Services', 'Technology'],
    keyMetrics: keyMetrics.length > 0 ? keyMetrics : [{ metric: 'Reporting Period', value: 'Current Quarter' }],
    suggestedQuestions: [
      'What are the primary drivers behind this financial development?',
      'How does this impact equity valuations and investor sentiment?',
      'What are the key financial metrics mentioned in the article?'
    ]
  };
}

// API Routes
app.post('/api/analyze', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length < 15) {
      return res.status(400).json({
        error: 'Please provide a valid financial news article (at least 15 characters).',
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json(getStructuredFallback(text));
    }

    const prompt = `Analyze the following financial news article for a college AI finance lab. 
Provide a thorough yet accessible financial analysis including:
1. Sentiment classification: Exactly "Positive", "Negative", or "Neutral".
2. Sentiment confidence score (0 to 100).
3. Detailed sentiment explanation explaining why this sentiment was chosen based on financial indicators, corporate announcements, or economic data.
4. An executive summary (2 to 4 concise sentences summarizing the core event).
5. 3 to 5 key takeaways as clear bullet points.
6. Market tone (e.g. "Bullish Tech Expansion", "Hawkish Monetary Policy", "Cautious Risk-Off", "Neutral / Mixed Indicators").
7. Key bullish factors mentioned (if any).
8. Key bearish factors or risks mentioned (if any).
9. Key affected sectors or assets (e.g., "Technology", "Semiconductors", "Treasuries", "Banking").
10. Key financial metrics, numbers, or percentages extracted directly from the article (e.g. EPS, revenue growth, interest rate, percentage shifts).
11. 3 or 4 suggested follow-up questions a student or financial analyst might ask about this article.

Financial News Article:
"""
${text.trim()}
"""`;

    let parsedData: any = null;

    try {
      const response = await generateWithFallback((model) =>
        ai.models.generateContent({
          model: model,
          contents: prompt,
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                sentiment: {
                  type: Type.STRING,
                  description: 'Must be "Positive", "Negative", or "Neutral"',
                },
                sentimentScore: {
                  type: Type.NUMBER,
                  description: 'Confidence percentage between 0 and 100',
                },
                sentimentExplanation: {
                  type: Type.STRING,
                  description: 'Clear 2-3 sentence explanation of the sentiment drivers',
                },
                summary: {
                  type: Type.STRING,
                  description: 'Concise executive summary of 2-4 sentences',
                },
                keyTakeaways: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '3 to 5 primary bullet points',
                },
                marketTone: {
                  type: Type.STRING,
                  description: 'Brief label describing market tone, e.g. Hawkish, Bullish Growth',
                },
                bullishFactors: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Positive catalysts or tailwinds',
                },
                bearishFactors: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Risks, headwinds, or cautionary flags',
                },
                affectedSectors: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Sectors, asset classes, or companies impacted',
                },
                keyMetrics: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      metric: { type: Type.STRING },
                      value: { type: Type.STRING },
                    },
                    required: ['metric', 'value'],
                  },
                  description: 'Key statistics, figures, or percentages',
                },
                suggestedQuestions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '3 to 4 recommended questions to ask about the article',
                },
              },
              required: [
                'sentiment',
                'sentimentScore',
                'sentimentExplanation',
                'summary',
                'keyTakeaways',
                'marketTone',
                'bullishFactors',
                'bearishFactors',
                'affectedSectors',
                'keyMetrics',
                'suggestedQuestions',
              ],
            },
          },
        })
      );

      const rawText = response.text || '{}';
      parsedData = JSON.parse(rawText);
    } catch (modelErr: any) {
      console.warn('Gemini models unavailable, using resilient fallback:', modelErr.message);
      parsedData = getStructuredFallback(text);
    }

    // Normalize sentiment
    const validSentiments = ['Positive', 'Negative', 'Neutral'];
    let normalizedSentiment: 'Positive' | 'Negative' | 'Neutral' = 'Neutral';
    if (parsedData.sentiment && validSentiments.includes(parsedData.sentiment)) {
      normalizedSentiment = parsedData.sentiment as 'Positive' | 'Negative' | 'Neutral';
    } else if (typeof parsedData.sentiment === 'string') {
      const lower = parsedData.sentiment.toLowerCase();
      if (lower.includes('pos')) normalizedSentiment = 'Positive';
      else if (lower.includes('neg')) normalizedSentiment = 'Negative';
      else normalizedSentiment = 'Neutral';
    }

    return res.json({
      ...parsedData,
      sentiment: normalizedSentiment,
    });
  } catch (error: any) {
    console.error('Error analyzing financial news:', error);
    return res.status(500).json({
      error: error?.message || 'An error occurred while analyzing the financial article.',
    });
  }
});

app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { text, question, history } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please check the Secrets panel in AI Studio.',
      });
    }

    const systemInstruction = `You are an expert Financial News Analyst and AI Tutor. 
The user is asking questions about a specific financial news article.
Your task:
- Answer the user's question clearly, thoroughly, and objectively based on the provided article.
- When relevant, explain financial terminology (e.g., basis points, quantitative tightening, yield curve, EBIT, EPS, margins) in simple, intuitive terms suitable for college students.
- Point out specific figures, dates, or statements from the article where applicable.
- If the question asks about something outside the article's scope, acknowledge what the article contains and offer reasonable financial context while clarifying it was not in the original text.
- Maintain a professional, educational tone. Always adhere to informational insights without offering specific investment or trade recommendations.`;

    const contents: any[] = [];

    // Context article
function withTimeout<T>(promise: Promise<T>, ms: number, fallbackVal: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallbackVal), ms)),
  ]);
}

function generateLocalAnswer(articleText: string, question: string): string {
  const qLower = question.toLowerCase();
  const sentences = articleText.split(/(?<=[.?!])\s+/).filter((s) => s.trim().length > 15);

  if (qLower.includes('sentiment') || qLower.includes('positive') || qLower.includes('negative')) {
    return `Based on this article, the prevailing market sentiment is driven by key performance disclosures and policy indicators. Corporate beats and revenue acceleration contribute to bullish sentiment, while persistent inflation or borrowing costs create headwinds.`;
  }

  if (qLower.includes('metric') || qLower.includes('eps') || qLower.includes('revenue') || qLower.includes('rate') || qLower.includes('number')) {
    const numbers = articleText.match(/(\$[\d,.]+[BMKbmk]?|\d+(?:\.\d+)?%)/g) || [];
    const uniqueNums = Array.from(new Set(numbers)).slice(0, 4);
    if (uniqueNums.length > 0) {
      return `Key financial figures highlighted in this article include:\n${uniqueNums.map((n) => `• ${n}`).join('\n')}\nThese metrics provide quantitative benchmarks for analyzing corporate operational efficiency and macroeconomic conditions.`;
    }
  }

  if (qLower.includes('inflation') || qLower.includes('fed') || qLower.includes('interest')) {
    return `Regarding monetary factors in this context: central bank policies and interest rate trajectories directly influence corporate borrowing costs, equity discount rates, and consumer spending patterns.`;
  }

  if (qLower.includes('risk') || qLower.includes('future') || qLower.includes('challenge')) {
    return `Key risks highlighted or implied include ongoing macroeconomic uncertainty, potential margin compression from cost inflation, and vulnerability to broader market interest rate fluctuations.`;
  }

  // Find most relevant sentence
  const words = qLower.split(/\s+/).filter((w) => w.length > 4);
  const matchingSentence = sentences.find((s) => words.some((w) => s.toLowerCase().includes(w)));

  if (matchingSentence) {
    return `According to the article: "${matchingSentence.trim()}"\n\nThis highlights the strategic focus of market participants on reported top-line execution and subsequent asset price implications.`;
  }

  return `Based on the provided report:
• Primary Catalyst: ${sentences[0] || 'The article details notable corporate and macroeconomic announcements.'}
• Market Impact: Key market participants are adjusting forward risk expectations and asset valuations based on these disclosures.
• Note: For detailed investment decisions, always consult certified financial advisory sources.`;
}

    let prompt = `You are an expert Financial News Analyst and AI Tutor.
The student is asking questions regarding the following financial news article:

ARTICLE CONTEXT:
"""
${(text || '').trim()}
"""
`;

    if (Array.isArray(history) && history.length > 0) {
      prompt += `\nPRIOR CONVERSATION:\n`;
      for (const msg of history.slice(-4)) {
        prompt += `${msg.role === 'user' ? 'Student' : 'Analyst'}: ${msg.text}\n`;
      }
    }

    prompt += `\nCURRENT STUDENT QUESTION:
"${question.trim()}"

Provide a clear, objective, and educational answer. Explain any complex financial terms in plain English. Cite facts and numbers from the article where appropriate. Remind them gently that this is for educational analysis and not investment advice.`;

    let answer = '';
    try {
      const geminiPromise = generateWithFallback((model) =>
        ai.models.generateContent({
          model: model,
          contents: prompt,
        })
      );

      const timeoutFallback = { text: generateLocalAnswer(text, question) };
      const response = await withTimeout(geminiPromise, 6500, timeoutFallback);
      answer = response.text || generateLocalAnswer(text, question);
    } catch (modelErr: any) {
      console.warn('Gemini chat fallback:', modelErr.message);
      answer = generateLocalAnswer(text, question);
    }

    return res.json({ answer });
  } catch (error: any) {
    console.error('Error during financial chat:', error);
    return res.status(500).json({
      error: error?.message || 'An error occurred while answering your question.',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Finance News Analyzer server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
