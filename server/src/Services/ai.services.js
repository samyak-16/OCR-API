import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';
import { imageToBase64 } from '../Utils/convertImageToBase64Encoding.js';

const llm = new ChatGoogleGenerativeAI({
  model: 'gemini-2.5-flash',
  temperature: 0,
  maxRetries: 2,
});

const extractNepaliText = async ({ filePath }) => {
  try {
    const base64Image = imageToBase64(filePath);

    const input = [
      new HumanMessage({
        content: [
          {
            type: 'text',
            text: 'Extract the Nepali text from the following image accurately.',
          },

          {
            type: 'image_url',
            image_url: base64Image,
          },
        ],
      }),
    ];

    const response = await llm.invoke(input);

    return response.text || response.content || '';
  } catch (error) {
    console.error('Error extracting Nepali text:', error.message);
    throw error;
  }
};

export { extractNepaliText };
