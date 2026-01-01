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
    chance: number;
    price: number;
  }[];
  category: string;
  subType: string;
  periodType: string;
}

const cardSchema = new mongoose.Schema<ICard>(
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
      default: 0,
    },
    fall: {
      type: Number,
      default: 0,
    },
    options: [{
      name: { type: String, required: true },
      tradingVolume: { type: Number, default: 0 },
      chance: { type: Number, default: 0 },
      price: { type: Number, default: 0 }
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
