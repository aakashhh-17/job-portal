import { PDFParse } from 'pdf-parse';
import axios from 'axios';

export const extractResumeText = async (resumeUrl) => {
  const response = await axios.get(resumeUrl, {
    responseType: 'arraybuffer',
  });

  const parser = new PDFParse({
    data: Buffer.from(response.data),
  });

  const result = await parser.getText();

  await parser.destroy();

  return result.text;
};

export default extractResumeText;