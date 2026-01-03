import mongoose, { Document, Model } from 'mongoose';

export interface IOrder extends Document {
  id: string; // Account ID
  petId: string; // Order ID (16 digits)
  quantity: number;
  shipDate: Date;
  status: string;
  complete: boolean;
  category: string;
  currency: string;
  type: string;
  price: number;
  income: number;
}

const orderSchema = new mongoose.Schema<IOrder>(
  {
    id: {
      type: String,
      required: true,
    },
    petId: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    shipDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      default: 'delivered',
      enum: ['placed', 'approved', 'delivered'],
    },
    complete: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      default: 'guess',
    },
    currency: {
      type: String,
    },
    type: {
      type: String,
    },
    price: {
      type: Number,
    },
    income: {
      type: Number,
    },
  },
  {
    timestamps: true,
    collection: 'orders',
  }
);

const Order: Model<IOrder> = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
