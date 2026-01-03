import mongoose, { Document, Model } from 'mongoose';

export interface IAccount extends Document {
  name: string;
  avatar?: string;
  id: string;
  balance: number;
  total_bets: number;
  total_income: number;
  win_rate: number;
}

const accountSchema = new mongoose.Schema<IAccount>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      trim: true,
    },
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    total_bets: {
      type: Number,
      default: 0,
    },
    total_income: {
      type: Number,
      default: 0,
    },
    win_rate: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: 'account', // Explicitly match the collection name used in the script
  }
);

const Account: Model<IAccount> = mongoose.model<IAccount>('Account', accountSchema);

export default Account;
