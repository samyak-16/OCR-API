import { ApiError } from '../Utils/api-error.js';
import { inngest } from '../Config/inngest.js';
import { Page } from '../Models/page.model.js';
import { ApiResponse } from '../Utils/api-response.js';
const bulkUpload = async (req, res) => {
  try {
    const files = req.files;
    if(!files){
       return res.status(400).json(new ApiError(400, 'Images are required'));
    }
    console.log(files);
    
   
    for (const pageMetadata of files) {
      console.log(pageMetadata.originalname);
      
      const page = new Page({
        localPath: pageMetadata.path,
        originalName: pageMetadata.originalname,
      });
      await page.save();
    }

    // Fire/Invoke inngest event
    //Invoke inngest event
    await inngest.send({
      name: 'on/upload',
      data: {}, // Empty data
    });

    return res.status(200).json(new ApiResponse(200, {}, 'Processing started'));
  } catch (error) {
    console.error('Internal Server Error at bulkUpload ', error.message);
    return res
      .status(500)
      .json(new ApiError(500, 'Internal Server Error at bulkUpload'));
  }
};

export { bulkUpload };
