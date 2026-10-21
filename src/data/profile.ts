/**
 * The unified content model.
 *
 * Three résumés (AI, SDE, BA) describe the same person with different
 * emphasis. This file merges them into one narrative: each role and project
 * appears exactly once, with the strongest phrasing of each bullet and every
 * metric preserved verbatim. Where two résumés gave the same role different
 * titles, the title used here is noted in a comment.
 */

export type Experience = {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  /** Short label shown in the rail */
  short: string;
  context: string;
  work: string[];
  stack: string[];
  results: Array<{ value: string; label: string }>;
};

export type Project = {
  id: string;
  slug: string;
  index: string;
  title: string;
  /** One line, used on the home page summary */
  summary: string;
  venue: string;
  period: string;
  problem: string;
  approach: string[];
  build: string[];
  result: string[];
  matters: string;
  stack: string[];
  metrics: Array<{ value: string; label: string }>;
  /** Public source repository, shown as a button on the case study. */
  repo?: string;
  /**
   * A rendered product film, used in place of a drawn schematic when the
   * project has a real interface to show. Paths are relative to `public/`.
   */
  film?: { src: string; poster: string; label: string };
};

export const education = [
  {
    school: 'University of Maryland',
    location: 'MD, USA',
    degree: 'M.S. Information Systems & AI',
    period: 'Expected December 2026',
    grade: '3.92 / 4.0',
  },
  {
    school: 'Sardar Patel Institute of Technology',
    location: 'Mumbai, India',
    degree: 'B.Tech Computer Engineering',
    period: 'June 2025',
    grade: '8.06 / 10.0',
  },
];

export const experience: Experience[] = [
  {
    id: 'advagen',
    // Titled "Business Analyst Intern" on the BA résumé — the one offered
    // for download — and "Data Engineering Intern" on the AI and SDE
    // résumés. One role, one title here.
    role: 'Business Analyst Intern',
    company: 'AdvaGen Pharma',
    location: 'Princeton, USA',
    period: 'Jun 2026 — Sep 2026',
    short: 'AdvaGen Pharma',
    context:
      'Sales bids, warehouse picking and executive reporting all ran out of SAP and into Excel by hand. The work was to close that gap with pipelines the business could rely on daily.',
    work: [
      'Engineered an automated Python and SQL pipeline using Selenium and Power Automate to extract, transform and route SAP sales bid data — the organisation’s first automated, SQL-driven SAP sales pipeline.',
      'Built a Python report generator that prioritised warehouse picking lists on deadlines, order priority, location and cancellations, optimising daily warehouse capacity.',
      'Built an automated Python-to-Power BI ETL pipeline that transformed SAP financial data into live executive dashboards, replacing manual Excel reporting.',
      'Built a Power BI demand forecasting dashboard comparing forecasted demand against actual sales at the customer-product level using Python and DAX, so sales leadership could spot shortfalls and take targeted inventory action.',
      'Ran daily Agile sprints with stakeholders — testing dashboards, gathering feedback and translating it into process improvements across sales, finance and operations.',
    ],
    stack: [
      'Python',
      'SQL',
      'SAP',
      'Power BI',
      'DAX',
      'Selenium',
      'Power Automate',
      'Agile',
    ],
    results: [
      { value: '5 hrs', label: 'manual bid processing removed per week' },
      { value: '$50K', label: 'overstock and stock-out losses prevented' },
      { value: '1 hr', label: 'manual financial reporting removed per day' },
    ],
  },
  {
    id: 'spjain',
    role: 'Machine Learning Research Intern',
    company: 'S.P. Jain Institute of Management',
    location: 'Mumbai, India',
    period: 'Jan 2025 — Jun 2025',
    short: 'S.P. Jain',
    context:
      'Prediction alone does not pick a squad. The research problem was to forecast player performance and then act on the forecast under real budget and roster limits.',
    work: [
      'Engineered a scalable machine learning pipeline over 5,000 player records, building domain-specific features and optimising an ElasticNet model through automated hyperparameter tuning.',
      'Developed mathematical optimisation algorithms using integer programming to maximise lineup performance across 38 gameweeks, integrating the model’s predictions with budget, roster and matchup constraints.',
    ],
    stack: [
      'Python',
      'ElasticNet',
      'Feature Engineering',
      'Integer Programming',
      'Hyperparameter Tuning',
    ],
    results: [
      { value: '+12%', label: 'predictive accuracy over baseline models' },
      { value: '5,000', label: 'player records in the pipeline' },
      { value: '38', label: 'gameweeks optimised under constraints' },
    ],
  },
  {
    id: 'dgs',
    role: 'Technical Consultation Intern',
    company: 'Maryland Department of General Services',
    location: 'Maryland, USA',
    period: 'Jan 2026 — May 2026',
    short: 'Maryland DGS',
    context:
      'Order intake was fragmented across departments. The capstone engagement was to design one system Baltimore-wide operations could actually consolidate onto.',
    work: [
      'Unified fragmented order-intake workflows across Maryland DGS, consolidating Baltimore-wide operations into a proposed mobile application.',
      'Translated cross-departmental stakeholder requirements into scalable logical and physical data models — ERDs, DFDs and database schemas.',
      'Presented detailed API integration strategies and full solution architecture recommendations to executive stakeholders.',
    ],
    stack: [
      'Requirements Analysis',
      'ERD',
      'DFD',
      'Data Modelling',
      'API Design',
      'Visio',
    ],
    results: [
      { value: 'CIO', label: 'and Deputy Secretary approval secured' },
      { value: 'Fall', label: 'technical launch greenlit' },
    ],
  },
  {
    id: 'timetechnoplast',
    // "SAP Developer Intern" on the SDE résumé, "SAP Data Analyst Intern" on
    // the BA résumé. Same role.
    role: 'SAP Data Analyst Intern',
    company: 'Time Technoplast',
    location: 'Mumbai, India',
    period: 'Jun 2024 — Aug 2024',
    short: 'Time Technoplast',
    context:
      'A production plant set its product mix on instinct. SAP held the evidence to set it on numbers instead.',
    work: [
      'Engineered an automated SQL-based ETL pipeline to process SAP production and sales data, integrating and validating it to surface operational inefficiencies.',
      'Analysed the result to identify opportunities to optimise product mix at the plant level.',
    ],
    stack: ['SQL', 'SAP', 'ETL', 'Data Validation'],
    results: [{ value: '+12%', label: 'plant sales the following month' }],
  },
];

export const projects: Project[] = [
  {
    id: 'reconcile',
    slug: 'reconcile',
    index: '01',
    title: 'Reconcile',
    summary:
      'An AI agent that reads purchase orders, receiving reports and supplier invoices, matches them line by line, and puts a dollar figure on every mismatch.',
    venue: 'Personal Project · Open Source',
    period: 'Oct 2026',
    problem:
      'Before an invoice is paid, someone has to check it against what was ordered and what actually arrived — the three-way match. Done by hand it is slow, and it misses short-shipments, quiet price increases, duplicate invoices and lines nobody ordered.',
    approach: [
      'Read each document — PDF or scan — with an LLM into a typed schema where every field carries a confidence score and the box it was read from, then ran deterministic checks (quantity × price, lines to subtotal, subtotal to total) so a field that fails the arithmetic loses confidence and goes to a human review queue.',
      'Kept the LLM out of anything a rule can decide. A pure matching engine pairs lines by exact SKU, then by text similarity, and calls the LLM only for the leftovers — and every pair it makes is stored with its reasoning.',
      'Raised seven problem types (short-ship, over-ship, price variance, billed-not-received, missing document, duplicate invoice, unmatched line), each with an exact dollar impact, for a person to approve, dispute or write off with a required note in an append-only audit log.',
      'Measured everything against a seeded synthetic generator that plants 12 kinds of error and writes an answer key per document set, with a CI gate that fails any pull request dropping a metric by more than two points.',
      'Ran it as a gated SDLC over eight milestones — requirements, design, ADRs, test plans and retrospectives — directing Claude Code as the coding agent and approving every gate.',
    ],
    build: [
      'TypeScript monorepo: Fastify REST API with OpenAPI generated from Zod schemas, a BullMQ worker on Redis, and PostgreSQL through Prisma.',
      'Google Gemini behind a provider interface (LangChain.js), with a shared rate limiter, retries with backoff, a response cache, replay mode for CI and a hard spending cap.',
      'Next.js review interface: a problem queue sorted by money at risk, the three documents side by side, field highlights drawn on the page image, and live upload status over server-sent events.',
      'An MCP server with six read-only tools, so Claude can answer questions about open problems — with document text marked as untrusted data against prompt injection.',
      'Terraform on AWS: EC2 behind CloudFront, secrets in SSM Parameter Store, no SSH, budget alarms, and one-command deploy and teardown.',
      'Vitest, Playwright and axe for 212 automated tests, plus an eval harness in GitHub Actions.',
    ],
    result: [
      '99.8% field-level F1 reading 60 documents (PDFs and scans) on the CI test set, and 100% of planted problems found with exact dollar amounts end to end.',
      '$0.0093 per document at Gemini list price, and $0 to run on the free tier.',
      'Deployed to AWS from a single command, torn down with nothing billable left, and redeployed cleanly.',
      'Measured on synthetic documents only — no real company data or users.',
    ],
    matters:
      'Accounts payable is a place where a confident wrong answer costs money. The interesting work was deciding what the model should not do: rules handle the arithmetic and the matching, the model reads documents and judges the leftovers, and every claim it makes arrives with a confidence, a source box and a reason a person can check.',
    stack: [
      'TypeScript',
      'Gemini',
      'LangChain.js',
      'Fastify',
      'BullMQ',
      'Redis',
      'PostgreSQL',
      'Prisma',
      'Next.js',
      'MCP',
      'Vitest',
      'Playwright',
      'Docker',
      'Terraform',
      'AWS',
      'GitHub Actions',
    ],
    metrics: [
      { value: '99.8%', label: 'of document fields read correctly' },
      { value: '100%', label: 'of planted problems found' },
      { value: '$0', label: 'to run on free tiers' },
    ],
    repo: 'https://github.com/rishabhsrinivasan657-design/reconcile',
    film: {
      src: 'media/reconcile/reconcile-film.mp4',
      poster: 'media/reconcile/reconcile-poster.jpg',
      label:
        'A 23-second product film of Reconcile: $49,245.07 at risk, three documents matched, a price gap of $3.78 per case flagged on an invoice, and the problem written off with a note. It closes on 99.8% of fields read correctly, 100% of planted problems found, and $0 to run.',
    },
  },
  {
    id: 'agentic-advisory',
    slug: 'agentic-financial-advisory',
    index: '02',
    title: 'Agentic Financial Advisory System',
    summary:
      'Nine agents coordinating portfolio analysis, risk and compliance — with one whose only job is to disagree with the others.',
    venue: 'Google AI Hackathon 2026',
    period: 'Jun 2026',
    problem:
      'Financial advice is not one task. It is portfolio analysis, risk assessment and compliance review, each with different inputs and a different definition of correct — and a single model asked to do all three does none of them reliably.',
    approach: [
      'Split the work across nine specialised agents orchestrated with Google ADK, so portfolio analysis, risk assessment and compliance each run as coordinated multi-agent reasoning with their own tool execution.',
      'Grounded recommendations in retrieval rather than recall: a FAISS-powered RAG pipeline puts vector search and live Yahoo Finance data behind every LLM response.',
      'Closed the loop with an evaluation agent that checks generated portfolios against predefined compliance rules before anything reaches the client.',
    ],
    build: [
      'Google ADK for multi-agent orchestration and tool execution.',
      'FAISS vector store for retrieval-augmented generation over financial documents.',
      'Live Yahoo Finance data feeding ETF and mutual fund recommendations against client risk profiles.',
      'A rule-based evaluation agent driving automated quality assurance and self-correction.',
    ],
    result: [
      'Personalised ETF and mutual fund recommendations generated per client risk profile.',
      'Automated quality assurance, self-correction and dynamic portfolio updates.',
    ],
    matters:
      'Multi-agent systems fail quietly — a confident wrong answer looks exactly like a right one. Building the critic as a first-class agent, with compliance rules as its ground truth, is what separates a demo from something you could defend to a regulator.',
    stack: [
      'Google ADK',
      'FAISS',
      'RAG',
      'Python',
      'Yahoo Finance API',
      'LLM Orchestration',
    ],
    metrics: [
      { value: '9', label: 'coordinated agents' },
      { value: 'RAG', label: 'grounded on live market data' },
      { value: '1', label: 'evaluation agent enforcing compliance' },
    ],
  },
  {
    id: 'medbuddy',
    slug: 'medbuddy',
    index: '03',
    title: 'MedBuddy',
    summary:
      'A medication platform that reads a prescription from a photograph and checks it against the FDA before it reaches a patient.',
    venue: 'Advanced Project · University of Maryland',
    period: 'Jan 2026 — Feb 2026',
    problem:
      'Patients hold their prescription information as paper and photographs, not as structured data. Nothing checks whether two prescriptions from two doctors should be taken together.',
    approach: [
      'Built the platform as a real product rather than a notebook: React and TypeScript on the front end, Spring Boot and PostgreSQL behind secure REST APIs covering prescription tracking, adherence monitoring and user management.',
      'Extracted structured prescription data straight from images using Google Gemini Vision, removing the manual entry step entirely.',
      'Identified potential drug interactions through retrieval-augmented generation over FDA datasets, so the check cites a source instead of asserting an answer.',
    ],
    build: [
      'React + TypeScript client; Spring Boot + PostgreSQL services behind secure REST APIs.',
      'Google Gemini Vision for prescription image extraction.',
      'RAG over FDA datasets for drug interaction detection.',
      'Docker containerisation with GitHub Actions CI/CD.',
      'JWT authentication with refresh-token rotation, plus offline-first capability.',
    ],
    result: [
      'A production-ready, containerised deployment with automated CI/CD.',
      'Prescription tracking and adherence monitoring backed by authenticated, offline-capable clients.',
    ],
    matters:
      'This is the project where the engineering had to be as careful as the model. Refresh-token rotation, offline-first sync and a containerised pipeline are not features a user sees — they are the reason a health tool can be trusted with a real prescription.',
    stack: [
      'React',
      'TypeScript',
      'Spring Boot',
      'PostgreSQL',
      'Gemini Vision',
      'RAG',
      'Docker',
      'GitHub Actions',
      'JWT',
    ],
    metrics: [
      { value: 'Vision', label: 'prescription extraction from images' },
      { value: 'FDA', label: 'datasets behind interaction checks' },
      { value: 'CI/CD', label: 'containerised and automated' },
    ],
    film: {
      src: 'media/medbuddy/medbuddy-film.mp4',
      poster: 'media/medbuddy/medbuddy-poster.jpg',
      label:
        'A 21-second product film of MedBuddy: a dose reminder, a prescription label scanned and its form filled in at 97% confidence, a question about taking lisinopril with ibuprofen answered with an FDA monograph citation, and a dashboard showing 96% adherence as a dose is logged as taken.',
    },
  },
  {
    id: 'market-regime',
    slug: 'market-regime-analysis',
    index: '04',
    title: 'Financial Market Regime Analysis',
    summary:
      'A Databricks pipeline that classifies decades of US economic history into four regimes — built as a scheduled workflow, not a pile of notebooks.',
    venue: 'Databricks Project',
    period: 'Jun 2026',
    problem:
      'Sector performance only means something relative to the economic regime it happened in. Answering that at scale needs versioned, reproducible data — which is exactly what a folder of standalone notebooks cannot give you.',
    approach: [
      'Architected a production-style Databricks pipeline on Delta Lake tables and PySpark, orchestrating a Bronze–Silver–Gold Medallion Architecture as a scheduled, dependency-based Databricks Workflow instead of siloed, standalone notebooks.',
      'Engineered 15+ macroeconomic and sector features into versioned Delta tables in the Gold layer, making the classification reproducible across time.',
      'Built a regime classification system tagging historical data into inflation, GDP, Fed policy and yield-curve categories.',
    ],
    build: [
      'Databricks Workflows with explicit task dependencies and scheduling.',
      'Delta Lake Bronze / Silver / Gold layers with versioned tables.',
      'PySpark transformations across the medallion tiers.',
      'Automated visualisations comparing performance across all six sectors.',
    ],
    result: [
      'Reliable four-regime classification of historical U.S. economic conditions across time.',
      'Automated sector-performance comparisons generated straight from the Gold layer.',
    ],
    matters:
      'The analysis is the visible half. The half that matters is that it re-runs on a schedule, against versioned tables, and produces the same answer twice — which is the difference between a finding and a data product.',
    stack: [
      'Databricks',
      'Delta Lake',
      'PySpark',
      'Medallion Architecture',
      'Databricks Workflows',
    ],
    metrics: [
      { value: '15+', label: 'macro and sector features engineered' },
      { value: '4', label: 'economic regimes classified' },
      { value: '6', label: 'sectors compared automatically' },
    ],
  },
  {
    id: 'demand-forecasting',
    slug: 'demand-forecasting',
    index: '05',
    title: 'Demand Forecasting & Revenue Analytics',
    summary:
      '50,000 e-commerce records, three forecasting models scored head to head, and a 60-day revenue forecast a planner can actually use.',
    venue: 'Advanced Project',
    period: 'May 2026 — Jun 2026',
    problem:
      'Demand planning needs a number and a reason to trust it. Raw transactional data gives you neither until it has been modelled, validated and put in front of the person making the call.',
    approach: [
      'Designed a PostgreSQL revenue analytics database, ingesting 50K+ e-commerce records across nine relational tables with Python.',
      'Engineered category-level daily revenue datasets through SQL transformations.',
      'Ran time-series analysis with ARIMA, Prophet and XGBoost under rolling-window validation, comparing forecast accuracy across the three rather than committing to one.',
      'Generated a 60-day revenue forecast for demand planning from the comparison.',
    ],
    build: [
      'PostgreSQL schema across nine relational tables.',
      'Python ingestion and a SQL transformation layer.',
      'ARIMA, Prophet and XGBoost under rolling-window validation.',
      'An interactive Tableau dashboard covering category performance, historical demand trends, forecasted revenue and model results.',
    ],
    result: [
      'A 60-day category-level revenue forecast backed by a documented model comparison.',
      'A Tableau dashboard translating the analysis into something a stakeholder can act on without reading the notebook.',
    ],
    matters:
      'Running three models instead of one is the whole point. Rolling-window validation is what lets you say which forecast to trust, and the dashboard is what makes that answer survive contact with the person who has to order stock.',
    stack: ['PostgreSQL', 'Python', 'SQL', 'ARIMA', 'Prophet', 'XGBoost', 'Tableau'],
    metrics: [
      { value: '50K+', label: 'e-commerce records ingested' },
      { value: '9', label: 'relational tables designed' },
      { value: '60', label: 'day revenue forecast horizon' },
    ],
  },
];

/** Shown in the index section — real work, presented at lower magnification. */
export const additionalWork = [
  {
    id: 'daily-briefing',
    title: 'Daily AI Financial Briefing Newspaper',
    venue: 'Advanced Project · University of Maryland',
    period: 'Jan 2026 — Feb 2026',
    description:
      'A serverless Python pipeline using Playwright MCP and OpenAI that translates global financial news and generates PDF briefings. Refactoring a 7-step multi-call workflow with LangSmith tracing and guardrail checks cut costs by 85% while eliminating hallucination risks.',
    stack: ['Python', 'Playwright MCP', 'OpenAI', 'LangSmith', 'Serverless'],
    metric: { value: '−85%', label: 'cost after refactor' },
  },
  {
    id: 'stark',
    title: 'STARK — Student Tracking Advising Resource Kit',
    venue: 'Agentic AI Hackathon',
    period: 'Oct 2025',
    description:
      'A Flask-based AI platform unifying academic records, communications and LLM-powered automated support, with a recommendation engine that combines academic records, career goals and advising history into personalised career guidance.',
    stack: ['Flask', 'Python', 'LLMs', 'Recommendation Systems'],
    metric: { value: '−50%', label: 'advising workload' },
  },
];

export const recognition = [
  {
    title: 'Winner — EY Financial Analyst & IBM Case Competitions',
    detail:
      'First place in case competitions hosted by EY and IBM, developing and presenting data-driven solutions to complex business challenges.',
  },
  {
    title: 'Teaching Assistant — Information Systems, AI & Digital Transformation',
    detail:
      'Selected to support and mentor students through course concepts and applied learning.',
  },
];

export const skillGroups = [
  {
    id: 'data',
    label: 'Data & Analytics',
    caption: 'Getting to a number, and being able to defend it.',
    skills: [
      'SQL',
      'Python',
      'R',
      'DAX',
      'PostgreSQL',
      'Oracle SQL',
      'MySQL',
      'MongoDB',
      'Neo4j',
      'Snowflake',
      'dbt',
      'Power BI',
      'Tableau',
      'Power Query',
      'Looker',
      'Excel',
      'Alteryx',
    ],
  },
  {
    id: 'engineering',
    label: 'Engineering',
    caption: 'Shipping the thing that produces the number.',
    skills: [
      'Java',
      'JavaScript',
      'C++',
      'C',
      'TypeScript',
      'React',
      'Next.js',
      'AngularJS',
      'Node.js',
      'Spring Boot',
      'Fastify',
      'Docker',
      'Git',
      'IntelliJ',
      'Jupyter',
      'LaTeX',
    ],
  },
  {
    id: 'ai',
    label: 'AI & Machine Learning',
    caption: 'Models, and the scaffolding that keeps them honest.',
    skills: [
      'LangGraph',
      'LangChain',
      'LangSmith',
      'Google ADK',
      'RAG',
      'MCP',
      'TensorFlow',
      'PyTorch',
      'MLflow',
      'NumPy',
      'Pandas',
      'Seaborn',
      'ChromaDB',
      'FAISS',
    ],
  },
  {
    id: 'platforms',
    label: 'Platforms & Operations',
    caption: 'Where the data lives and how it moves.',
    skills: [
      'Apache Spark',
      'Hadoop',
      'PySpark',
      'Databricks',
      'Airflow',
      'Kafka',
      'SAP',
      'AWS (Lambda, S3, EC2, CloudFront)',
      'Terraform',
      'Google Cloud',
      'Azure',
      'Power Automate',
      'Selenium',
      'Jira',
      'Confluence',
      'Visio',
    ],
  },
];

/** Featured on the home page, in scroll order. */
export const featuredProjects = projects.filter(project =>
  ['reconcile', 'agentic-advisory', 'medbuddy', 'market-regime'].includes(project.id)
);

export const analyticsProject = projects.find(
  project => project.id === 'demand-forecasting'
)!;

export function getProjectBySlug(slug?: string) {
  return projects.find(project => project.slug === slug);
}
