// backend/config/nvidia.js
import OpenAI from 'openai';

const nvidia = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

export default nvidia;