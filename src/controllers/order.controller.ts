import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import Order from '../models/order.model';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const order = await Order.create(req.body);
  res.status(httpStatus.CREATED).send(order);
});

const getOrders = catchAsync(async (req: Request, res: Response) => {
  const { id, currency } = req.body;
  const filter: any = { id };
  if (currency && currency !== 'all') {
    filter.currency = currency;
  }
  const orders = await Order.find(filter);
  res.send({ data: orders, success: true });
});

export default {
  createOrder,
  getOrders,
};
