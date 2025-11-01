import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
    },
    bookIdentifier: {
      type: String,
    },
    pageOrder: {
      type: Number,
    },
    translatedText: {
      type: String,
    },
    localPath: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Page = mongoose.model('Page', pageSchema);
