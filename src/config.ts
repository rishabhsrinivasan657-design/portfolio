/**
 * Identity and links. Everything here comes from the résumés — nothing is
 * invented. If a value isn't on a résumé, it doesn't belong in this file.
 */
export const config = {
  name: 'Rishabh Srinivasan',
  initials: 'RS',

  /**
   * The hero reads `role` first, then cycles the disciplines beneath it.
   * One identity, four facets — each backed by concrete résumé evidence:
   *   Analyst    — feature engineering, forecast vs actual analysis, case wins
   *   Architect  — "architected" a 9-agent platform and a Databricks pipeline
   *   Forecaster — ARIMA / Prophet / XGBoost, demand forecasting dashboards
   *   Optimizer  — integer programming, picking-list and product-mix optimisation
   */
  role: 'Engineer',
  disciplines: ['Analyst', 'Architect', 'Forecaster', 'Optimizer'],

  email: 'rishabhsrinivasan657@gmail.com',
  phone: '+1-240-906-9055',
  linkedin: 'https://www.linkedin.com/in/rishabh-srinivasan/',
  github: 'https://github.com/rishabhsrinivasan657-design',
  githubHandle: 'rishabhsrinivasan657-design',

  resume: 'resume/Rishabh-Srinivasan-Resume.pdf',

  location: 'Maryland, USA',
  /** University of Maryland, College Park — used as a decorative coordinate */
  coordinates: '38.9897° N, 76.9378° W',

  /**
   * Deployed at a project-site path, so the repo name is part of the URL.
   * If this ever moves to a `<username>.github.io` repo, drop the `/portfolio`
   * here — the build workflow works out the base path on its own.
   */
  url: 'https://rishabhsrinivasan657-design.github.io/portfolio',
} as const;

export default config;
