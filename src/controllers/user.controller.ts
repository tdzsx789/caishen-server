import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import User from '../models/user.model';
import ApiError from '../utils/ApiError';
import { Request, Response } from 'express';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await User.create(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUser = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const getUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await User.find();
  res.send(users);
});

export default {
  createUser,
  getUser,
  getUsers,
};
