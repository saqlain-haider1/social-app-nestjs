import * as mongoose from 'mongoose';
export const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

export interface Post {
  title: string;
  description: string;
}
