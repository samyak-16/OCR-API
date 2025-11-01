import dotenv from 'dotenv';
dotenv.config();

const env = {
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  MONGO_URL: process.env.MONGO_URL,
  PORT: process.env.PORT,
};

export { env };
