import * as mongoose from 'mongoose';
export const moderatorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // index: true,
    // sparse: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export interface Moderator {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
