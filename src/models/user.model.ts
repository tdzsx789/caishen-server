import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  points: number;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    // Simple point balance cache in user model for fast access
    points: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Add plugin for easier conversion to JSON if needed
userSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  (object as any).id = _id;
  return object;
});

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
