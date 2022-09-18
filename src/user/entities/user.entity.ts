import * as mongoose from 'mongoose';
export const userSchema = new mongoose.Schema({
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
  paid: {
    type: Boolean,
    default: false,
  },
  followers: {
    type: [mongoose.Types.ObjectId],
    default: [],
  },
  following: {
    type: [mongoose.Types.ObjectId],
    default: [],
  },
});

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  paid: boolean;
  following: Array<mongoose.Types.ObjectId>;
  followers: Array<mongoose.Types.ObjectId>;
}
