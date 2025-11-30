import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { inngest } from './Config/inngest.js';
import { serve } from 'inngest/express';
import { inngestFunctions } from './Inngest/index.js';
import pageRouter from './Routes/imageProcessing.route.js';

const app = express();

app.use(cors());
app.use(cookieParser());

/* 🔥 IMPORTANT — Multer routes must come BEFORE JSON parser */
app.use('/api/save-page-text', pageRouter);

/* JSON parser */
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/', (req, res) => {
  res.send('Hello from backend');
});

app.use(
  '/api/inngest',
  serve({ client: inngest, functions: inngestFunctions })
);

export { app };
