import fs from 'fs';

export function imageToBase64(filePath) {
  try {
    // Read the image file as a binary buffer
    const imageBuffer = fs.readFileSync(filePath);
    // Convert the binary data to a Base64 string
    const base64String = imageBuffer.toString('base64');
    // Determine MIME type based on file extension
    let mimeType;
    if (filePath.endsWith('.png')) {
      mimeType = 'image/png';
    } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
      mimeType = 'image/jpeg';
    } else if (filePath.endsWith('.gif')) {
      mimeType = 'image/gif';
    } else if (filePath.endsWith('.bmp')) {
      mimeType = 'image/bmp';
    } else if (filePath.endsWith('.webp')) {
      mimeType = 'image/webp';
    } else {
      mimeType = 'application/octet-stream'; // fallback for unknown types
    }
    return `data:${mimeType};base64,${base64String}`;
  } catch (error) {
    console.error('Internal API Error in imageToBase64 :  ', error.message);
    throw error;
  }
}

// Example usage (in the same file or imported elsewhere)
// import { imageToBase64 } from './yourModule.js';
// const base64Image = imageToBase64('./path/to/your/image.jpg');
// console.log(base64Image);
