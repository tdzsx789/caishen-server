import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import User from '../models/user.model';
import Transaction from '../models/transaction.model';
import ApiError from '../utils/ApiError';
import { Request, Response } from 'express';

const addPoints = catchAsync(async (req: Request, res: Response) => {
  const { userId, amount, description } = req.body;
  
  if (amount <= 0) {
     throw new ApiError(httpStatus.BAD_REQUEST, 'Amount must be positive');
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { points: amount } },
    { new: true }
  );

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  await Transaction.create({
    user: userId,
    amount,
    type: 'add',
    description,
  });

  res.send(user);
});

const pay = catchAsync(async (req: Request, res: Response) => {
  const { userId, amount, description } = req.body;

  if (amount <= 0) {
     throw new ApiError(httpStatus.BAD_REQUEST, 'Amount must be positive');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.points < amount) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient balance');
  }

  // Atomically decrement
  const updatedUser = await User.findOneAndUpdate(
    { _id: userId, points: { $gte: amount } },
    { $inc: { points: -amount } },
    { new: true }
  );

  if (!updatedUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient balance or User not found');
  }

  await Transaction.create({
    user: userId,
    amount,
    type: 'pay',
    description,
  });

  res.send(updatedUser);
});

const getHistory = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const transactions = await Transaction.find({ user: userId }).sort({ createdAt: -1 });
  res.send(transactions);
});

export default {
  addPoints,
  pay,
  getHistory,
};
