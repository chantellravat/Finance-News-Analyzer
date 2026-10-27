export interface SampleArticle {
  id: string;
  title: string;
  category: string;
  expectedSentiment: 'Positive' | 'Negative' | 'Neutral';
  headline: string;
  source: string;
  date: string;
  content: string;
}

export const SAMPLE_ARTICLES: SampleArticle[] = [
  {
    id: 'tech-earnings-surge',
    title: 'Tech Cloud & AI Beat',
    category: 'Corporate Earnings',
    expectedSentiment: 'Positive',
    headline: 'HyperScale Systems Q3 Revenue Surges 28% on Surging Enterprise AI Cloud Demand',
    source: 'Financial Times Global Markets',
    date: 'October 18, 2026',
    content: `HyperScale Systems Inc. (NASDAQ: HPSC) reported third-quarter fiscal results that comfortably exceeded Wall Street consensus estimates on Wednesday, propelled by accelerating corporate adoption of generative AI infrastructure and cloud computing services.

Total quarterly revenue rose 28% year-over-year to $42.6 billion, outperforming analyst projections of $39.8 billion. Operating income surged 34% to $15.1 billion, while diluted earnings per share (EPS) climbed to $3.45 against expectations of $3.08. The company's Intelligent Cloud segment was the primary growth catalyst, generating $18.4 billion in net sales—a 39% increase compared to the prior-year period.

Chief Executive Officer Elena Rostova highlighted that capital expenditures for AI data centers yielded faster-than-anticipated commercial returns: "We are observing structural demand shifts as Fortune 500 enterprises migrate core production workloads to our specialized accelerator clusters. Our enterprise backlog has expanded to a record $78 billion."

In addition to the top-line beat, management raised full-year forward revenue guidance by $2.5 billion, projecting an annualized operating margin of 36.5%. Free cash flow reached $11.8 billion, allowing the board of directors to authorize an expanded $10 billion share repurchase authorization and an 8% increase in its quarterly dividend.

Shares jumped 7.4% in after-hours trading, lifting broader tech benchmarks including the Nasdaq Composite and semiconductor component suppliers.`
  },
  {
    id: 'fed-rate-hawkish',
    title: 'Fed Rate Decision & Inflation',
    category: 'Monetary Policy',
    expectedSentiment: 'Negative',
    headline: 'Federal Reserve Holds Interest Rates at 5.25%-5.50%, Signals Prolonged Tightening as Core Services Inflation Persists',
    source: 'Wall Street Economic Digest',
    date: 'October 15, 2026',
    content: `The Federal Open Market Committee (FOMC) voted unanimously to maintain the federal funds target rate at a 22-year high of 5.25% to 5.50% following its two-day policy summit, dashing investor hopes for a near-term monetary easing cycle.

During the post-meeting press conference, Chair Jerome Powell adopted an assertive, hawkish posture, underscoring that while headline inflation has cooled from peak levels, the "supercore" services gauge—which excludes volatile shelter and energy components—remains stubbornly elevated at an annualized rate of 3.8%.

"The Committee will not consider rate reductions until we achieve sustainable, verifiable evidence that inflation is definitively on a trajectory toward our 2% objective," Powell stated. "Premature loosening risks unanchoring long-term inflation expectations, which would ultimately impose far steeper economic hardships on American households and businesses."

The central bank's updated Summary of Economic Projections (SEP) reflected revised expectations, projecting higher borrowing costs through the remainder of the calendar year and into mid-2027. Treasury yields climbed sharply across the curve, with the benchmark 10-year note yield rising 14 basis points to 4.62%, while mortgage interest rates touched 7.25%, chilling domestic residential real estate transactions.

Equity markets tumbled following the announcement, with the Dow Jones Industrial Average dropping 480 points (-1.2%) and interest-rate sensitive sectors such as commercial banking, regional lenders, and homebuilders leading declines.`
  },
  {
    id: 'jobs-mixed-neutral',
    title: 'U.S. Jobs & Labor Data',
    category: 'Macroeconomics',
    expectedSentiment: 'Neutral',
    headline: 'U.S. Labor Market Adds 165,000 Jobs in September as Wage Growth Moderates to 3.7%',
    source: 'Bureau of Economic Insights',
    date: 'October 12, 2026',
    content: `The United States economy generated 165,000 nonfarm payroll jobs in September, according to data released Friday by the Bureau of Labor Statistics, closely matching consensus forecasts of 160,000 and demonstrating consistent equilibrium across domestic employment conditions.

The national unemployment rate ticked up marginally by one-tenth of a percentage point to 4.1%, accompanied by a slight rise in the labor force participation rate to 62.8%. Average hourly earnings for private-sector workers increased by 0.2% month-over-month and 3.7% over the past 12 months, reflecting a steady deceleration from previous 4.2% readings.

Sectoral distribution illustrated a balanced workforce dynamic: health care and social assistance led job creation with 48,000 additions, followed by hospitality and government services. Conversely, manufacturing payrolls contracted by 7,000 positions, while professional business services remained broadly flat.

Economists characterized the report as a textbook "Goldilocks" data print—neither overheated enough to reignite inflationary pressures nor weak enough to signal imminent recessionary risks. 

"We are witnessing an orderly cooling of labor tightness without an accompanying spike in involuntary layoffs," observed Marcus Vance, Chief North American Economist at Horizon Capital. "This neutral data set gives monetary policymakers breathing room to assess incoming fiscal and trade indicators without immediate policy interventions."

Financial markets showed little aggregate direction, with the S&P 500 closing flat (+0.04%), while currency markets held steady against major G10 foreign exchange peers.`
  },
  {
    id: 'clean-energy-capital',
    title: 'Clean Energy & Infrastructure',
    category: 'Energy & Industry',
    expectedSentiment: 'Positive',
    headline: 'Renewable Power Consortium Secures $14.2 Billion Financing for Mega-Grid Modernization Initiative',
    source: 'Global Energy Review',
    date: 'October 9, 2026',
    content: `An international consortium of infrastructure investment funds and institutional lenders has closed a landmark $14.2 billion debt and equity financing package to build the Western Clean Energy Interconnect, a 1,100-mile high-voltage direct current (HVDC) transmission corridor.

The project is designed to transport over 6,000 megawatts of utility-scale solar and offshore wind energy from low-cost generation zones directly to major industrial and urban load centers. Lead backers include Brookfield Infrastructure, BlackRock, and sovereign wealth entities alongside commercial banking syndicates.

Engineering procurement agreements have already been finalized with domestic transformer manufacturers and cable fabricators, creating an estimated 8,500 construction jobs and 1,200 permanent technical positions over the next four years. Federal transmission grants provided an additional $1.8 billion in non-dilutive credit enhancements.

"Modernizing transmission infrastructure is the single most critical bottleneck in global decarbonization," remarked Dr. Aris Thorne, Managing Director of Energy Transition at Apex Partners. "This facility guarantees contracted 25-year power purchase agreements with major regional utilities, securing highly predictable, bond-like cash flows for investors."

Shares of electrical equipment manufacturers, smart-grid automation specialists, and renewable generation operators rallied 4% to 9% following the announcement, with analysts upgrading sector-wide price targets on anticipation of multi-year capital deployment cycles.`
  },
  {
    id: 'retail-consumer-pullback',
    title: 'Retail Earnings & Consumer Debt',
    category: 'Consumer & Retail',
    expectedSentiment: 'Negative',
    headline: 'Retail Giants Warn of Discretionary Spending Slump as Credit Card Delinquencies Rise to 8-Year High',
    source: 'Consumer Commerce Daily',
    date: 'October 5, 2026',
    content: `Leading nationwide retailers cautioned on Tuesday that consumer purchasing power is experiencing noticeable strain, as middle-income households curb non-essential discretionary expenditures in response to cumulative price inflation and mounting consumer credit balances.

Quarterly comparable store sales at Apex Department Stores fell 4.6% year-over-year, missing expectations of a modest 1.1% dip. Net profit plunged 22% to $184 million as promotional discounting failed to revive footwear, apparel, and home furnishing volumes. The company subsequently lowered its annual adjusted EBITDA forecast by 18%.

Concurrently, credit reporting agency Equifax disclosed that 90-day credit card delinquency rates rose to 3.18% in the latest quarter, reaching levels not observed since late 2018. Average household revolving balances surpassed $7,400 with prevailing credit card annual percentage rates (APRs) averaging 21.5%, severely squeezing household disposable incomes.

"While consumer spending on essential grocery, healthcare, and utilities remains stable, consumers are exhibiting acute price resistance in apparel, electronics, and recreational items," said Apex Chief Financial Officer Karen Miller. "Promotional discounting is compressing gross margins by 210 basis points."

Retail sector ETFs fell 3.8% on heavy volume, with discretionary goods manufacturers, credit card issuers, and subprime auto lenders facing broad-based selling pressure across morning trading sessions.`
  }
];
