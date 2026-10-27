export interface GlossaryTerm {
  term: string;
  category: 'Monetary Policy' | 'Earnings & Valuation' | 'Market Sentiment' | 'Economic Indicators';
  definition: string;
  example: string;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Hawkish',
    category: 'Monetary Policy',
    definition: 'A policy stance favoring higher interest rates to combat inflation, typically tightening liquidity and slowing economic growth.',
    example: 'The Fed Chair gave a hawkish speech indicating rates would stay higher for longer.'
  },
  {
    term: 'Dovish',
    category: 'Monetary Policy',
    definition: 'A policy stance favoring lower interest rates and monetary stimulus to stimulate economic growth and employment.',
    example: 'Dovish comments from the central bank signaled upcoming rate cuts.'
  },
  {
    term: 'Basis Point (bps)',
    category: 'Monetary Policy',
    definition: 'A unit of measure for interest rates and financial percentages. One basis point equals 0.01% (1/100th of a percent), so 50 bps equals 0.50%.',
    example: 'The central bank raised the federal funds rate by 25 basis points.'
  },
  {
    term: 'EPS (Earnings Per Share)',
    category: 'Earnings & Valuation',
    definition: 'A company\'s net profit divided by the number of outstanding common shares, serving as a key indicator of corporate profitability.',
    example: 'Quarterly EPS of $3.45 beat analyst consensus expectations of $3.08.'
  },
  {
    term: 'Forward Guidance',
    category: 'Earnings & Valuation',
    definition: 'Projections and commentary provided by corporate executives or central bankers about expected future financial performance and policy.',
    example: 'Management raised its full-year forward revenue guidance by $2.5 billion.'
  },
  {
    term: 'EBITDA',
    category: 'Earnings & Valuation',
    definition: 'Earnings Before Interest, Taxes, Depreciation, and Amortization; a metric used to evaluate a company\'s operating performance without non-operating factors.',
    example: 'Retail margins fell, lowering adjusted EBITDA by 18% year-over-year.'
  },
  {
    term: 'Free Cash Flow (FCF)',
    category: 'Earnings & Valuation',
    definition: 'The cash a company generates after accounting for cash outflows to support operations and maintain its capital assets.',
    example: 'Strong cash flow of $11.8B funded an expanded share buyback program.'
  },
  {
    term: 'Nonfarm Payrolls (NFP)',
    category: 'Economic Indicators',
    definition: 'A key monthly macroeconomic report measuring the number of paid workers in the U.S. excluding farm workers, government employees, and non-profits.',
    example: 'The economy added 165,000 nonfarm payroll jobs, in line with forecasts.'
  },
  {
    term: 'Delinquency Rate',
    category: 'Economic Indicators',
    definition: 'The percentage of loans or credit accounts within a portfolio whose payments are overdue past a designated window (e.g., 30, 60, or 90 days).',
    example: 'Credit card 90-day delinquency rates increased to 3.18%, signaling consumer debt stress.'
  },
  {
    term: 'Bullish vs Bearish',
    category: 'Market Sentiment',
    definition: 'Bullish indicates an expectation that prices or the economy will rise; Bearish indicates an expectation of market declines or contraction.',
    example: 'AI infrastructure investment was bullish for chipmakers, while high rates were bearish for housing.'
  }
];
