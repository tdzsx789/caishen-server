import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import Account from '../models/account.model';
import ApiError from '../utils/ApiError';
import { Request, Response } from 'express';

const createAccount = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.body;

  // Check if account with same ID already exists
  if (await Account.findOne({ id })) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Account with this ID already exists');
  }

  const account = await Account.create(req.body);
  res.status(httpStatus.CREATED).send(account);
});

const getAccounts = catchAsync(async (req: Request, res: Response) => {
  const accounts = await Account.find();
  res.send(accounts);
});

export default {
  createAccount,
  getAccounts,
};
