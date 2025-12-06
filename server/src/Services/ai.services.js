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
const formatOCRExtractedNepaliContent = async (text) => {
  try {
    const prompt = `
You are cleaning and reformatting Nepali OCR text extracted from books.

Your goal is to produce a highly accurate, clean, readable final text
that is formatted as if it will be printed on A4 paper.

------------------------------------
### GENERAL RULES
------------------------------------
1. Maintain very high accuracy.
   - Correct OCR errors when obvious.
   - Fix broken words caused by line wrapping.
   - Remove unwanted symbols, duplicates, or garbage characters.

2. Remove all OCR-generated noise:
   - Page numbers
   - Chapter markers repeated at each page
   - Headers/footers
   - Line breaks caused by page boundaries
   - Random extra spaces
   - Hyphens at line ends caused by OCR
   - Anything not part of the original content

3. Reconstruct text naturally:
   - Merge lines belonging to the same paragraph.
   - Ensure paragraph flow is natural and continuous.
   - Do NOT add unnecessary line breaks.

------------------------------------
### PARAGRAPH RULES (A4 PAPER LOGIC)
------------------------------------
1. All normal paragraphs should be written as continuous lines,
   formatted to fit the full left-to-right width of an A4 page.
   
2. Paragraphs must be:
   - Full-width
   - Left-aligned
   - With normal line wrapping
   - With natural spacing

3. If not explicitly defined, assume the output is intended for
   printing on **A4 paper**, and structure the text accordingly.

------------------------------------
### POEM / VERSE / LYRICS RULES
------------------------------------
1. Detect poems using accuracy-based heuristics:
   - Short lines
   - Rhythmic pattern
   - Repetitive indentation
   - Visual structure different from paragraphs

2. For poems:
   - Preserve line breaks exactly.
   - Preserve indentation exactly.
   - Keep spacing between stanzas.
   - Do not merge lines.

------------------------------------
### HEADINGS / TITLES RULES
------------------------------------
1. Detect headings based on:
   - Centered text
   - All-caps or notable formatting
   - Short standalone lines

2. Keep headings visually distinct:
   - Leave one blank line before and after headings.

------------------------------------
### OUTPUT REQUIREMENTS
------------------------------------
1. Return ONLY clean, corrected, formatted Nepali text.
2. Do not include explanations.
3. Do not include markup.
4. Preserve original meaning and literary structure.
5. Produce a final output suitable for A4 printing.

------------------------------------

Here is the raw OCR text:
${text}
`;

    const input = [
      new HumanMessage({
        content: [
          {
            type: 'text',
            text: prompt,
          },
        ],
      }),
    ];

    const response = await llm.invoke(input);

    return response.text || response.content || '';
  } catch (error) {
    console.error('Error formatting Nepali OCR text:', error.message);
    throw error;
  }
};
export { extractNepaliText, formatOCRExtractedNepaliContent };
