import axios from 'axios';

const ADZUNA_BASE_URL = 'https://api.adzuna.com/v1/api/jobs';

export const fetchAdzunaJobs = async ({ country = 'in', page = 1, resultsPerPage = 50 } = {}) => {
  const { data } = await axios.get(`${ADZUNA_BASE_URL}/${country}/search/${page}`, {
    params: {
      app_id: process.env.ADZUNA_APP_ID,
      app_key: process.env.ADZUNA_APP_KEY,
      results_per_page: resultsPerPage,
      sort_by: 'date',
      'content-type': 'application/json',
    },
  });
  return data; // { count, results: [...] }
};

export const normalizeAdzunaJob = (job) => ({
  source: 'adzuna',
  externalId: String(job.id),
  title: job.title?.trim() || 'Untitled role',
  description: job.description || '',
  location: job.location?.display_name || 'Not specified',
  category: job.category?.label || 'Other',
  level: job.contract_time || 'Not specified',
  salary: job.salary_min ? Math.round(job.salary_min) : 0,
  date: job.created ? new Date(job.created).getTime() : Date.now(),
  visible: true,
  companyName: job.company?.display_name || 'Unknown company',
  sourceUrl: job.redirect_url,
});