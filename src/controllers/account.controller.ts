import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import Account from '../models/account.model';
import ApiError from '../utils/ApiError';
import { Request, Response } from 'express';

const createAccount = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.body;

  // Check if account with same ID already exists
  const existingAccount = await Account.findOne({ id });
  if (existingAccount) {
    res.status(httpStatus.OK).send({
      message: '账户已存在，跳过创建账户',
      data: existingAccount
    });
    return;
  }

  const account = await Account.create(req.body);
  res.status(httpStatus.CREATED).send({
    message: '创建账户成功',
    data: account
  });
});

const getAccounts = catchAsync(async (req: Request, res: Response) => {
  const accounts = await Account.find();
  res.send(accounts);
});

export default {
  createAccount,
  getAccounts,
};
