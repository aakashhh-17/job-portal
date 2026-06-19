import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse/lib/pdf-parse.js');

import axios from 'axios';

export const extractResumeText = async (resumeUrl) => {
  const response = await axios.get(resumeUrl, { responseType: 'arraybuffer' });
  const data = await pdf(response.data);
  return data.text;
};