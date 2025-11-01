import fs from 'fs/promises';
import path from 'path';

const saveAsTxt = async ({ fileName, fileContent }) => {
  try {
    const folderPath = path.join(process.cwd(), 'extracts');

    // Check if the 'extracts' folder exists, create if it does not
    try {
      await fs.access(folderPath);
    } catch {
      await fs.mkdir(folderPath);
    }

    // Define full file path
    const filePath = path.join(folderPath, `${fileName}.txt`);

    // Write the text content to the file
    await fs.writeFile(filePath, fileContent, 'utf8');

    console.log(`File saved: ${filePath}`);
  } catch (error) {
    console.error('Error saving text file:', error);
    throw error;
  }
};

export { saveAsTxt };
