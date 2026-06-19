import nvidia from '../config/nvidia.js';

export const generateMatchScore = async (resumeText, jobDescription) => {
  console.log('[aiService] used at ' ,Date.now());
  const prompt = `You are an ATS-style resume evaluator. Compare the resume to the job description and return ONLY valid JSON, no markdown, no preamble, in this exact shape:

{
  "score": <integer 0-100>,
  "matchedSkills": [<strings>],
  "missingSkills": [<strings>],
  "summary": "<2-3 sentence explanation>"
}

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}`;

  const completion = await nvidia.chat.completions.create({
    model: 'meta/llama-3.1-70b-instruct',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 1000,
  });

  const raw = completion.choices[0].message.content.trim();
  const cleaned = raw.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error('AI returned invalid JSON');
  }
};