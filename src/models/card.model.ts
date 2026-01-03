import mongoose, { Document, Model } from 'mongoose';

export interface ICard extends Document {
  key: string;
  id: string;
  show: boolean;
  title: string;
  description: string;
  activityDescription: string;
  tradingVolume: number;
  endTime: string;
  startTime: string;
  rise: number;
  fall: number;
  options?: {
    name: string;
    tradingVolume: number;
    yes: number;
    no: number;
    price: number;
  }[];
  category: string;
  subType: string;
  periodType: string;
}

export const cardSchema = new mongoose.Schema<ICard>(
  {
    key: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    show: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    activityDescription: {
      type: String,
      required: true,
    },
    tradingVolume: {
      type: Number,
      default: 0,
    },
    endTime: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    rise: {
      type: Number,
      default: 50,
    },
    fall: {
      type: Number,
      default: 50,
    },
    options: [{
      name: { type: String, required: true },
      tradingVolume: { type: Number, default: 0 },
      yes: { type: Number, default: 50 },
      no: { type: Number, default: 50 },
      price: { type: Number, default: 50 }
    }],
    category: {
      type: String,
      required: true,
    },
    subType: {
      type: String,
      required: true,
    },
    periodType: {
      type: String,
      required: true,
      default: 'hour',
    },
  },
  {
    timestamps: true,
    collection: 'cards',
  }
);

const Card: Model<ICard> = mongoose.model<ICard>('Card', cardSchema);

export default Card;
