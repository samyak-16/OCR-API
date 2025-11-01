import express from 'express';
import { upload } from '../Middlewares/multer.middleware.js';
import { bulkUpload } from '../Controllers/ImageProcessing.controller.js';
const router = express.Router();

router.post('/', upload.array('pages', 1000), bulkUpload);

export default router;
