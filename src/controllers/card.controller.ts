import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { Request, Response } from 'express';
import Card from '../models/card.model';
import ApiError from '../utils/ApiError';

const getCards = catchAsync(async (req: Request, res: Response) => {
  const filter: any = {};
  if (req.query.category) {
    filter.category = req.query.category;
  }
  if (req.query.subType) {
    filter.subType = req.query.subType;
  }
  if (req.query.periodType && req.query.periodType !== 'all') {
    filter.periodType = req.query.periodType;
  }
  // Allow filtering by other fields if needed, e.g. show
  if (req.query.show) {
      filter.show = req.query.show === 'true';
  }

  const cards = await Card.find(filter).sort({ createdAt: 1 }); // Sort by creation time or id
  res.send(cards);
});

const updateCard = catchAsync(async (req: Request, res: Response) => {
  const card = await Card.findOne({ id: req.params.cardId });
  if (!card) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Card not found');
  }
  Object.assign(card, req.body);
  await card.save();
  res.send(card);
});

export default {
  getCards,
  updateCard,
};
