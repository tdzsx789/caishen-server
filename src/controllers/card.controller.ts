import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { Request, Response } from 'express';
import Card from '../models/card.model';
import MultipleCard from '../models/multipleCard.model';
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

  let cards: any[] = [];

  if (filter.subType === 'multiple') {
      cards = await MultipleCard.find(filter).sort({ createdAt: 1 });
  } else if (filter.subType) {
      cards = await Card.find(filter).sort({ createdAt: 1 });
  } else {
      // Query both
      const [cards1, cards2] = await Promise.all([
          Card.find(filter).sort({ createdAt: 1 }),
          MultipleCard.find(filter).sort({ createdAt: 1 })
      ]);
      cards = [...cards1, ...cards2];
      // Re-sort merged results
      cards.sort((a, b) => {
          // Assuming createdAt is available and comparable
          const t1 = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const t2 = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return t1 - t2; 
      });
  }

  res.send(cards);
});

const updateCard = catchAsync(async (req: Request, res: Response) => {
  let card = await Card.findOne({ id: req.params.cardId });
  if (card) {
    Object.assign(card, req.body);
    await card.save();
    res.send(card);
    return;
  }

  const multipleCard = await MultipleCard.findOne({ id: req.params.cardId });
  if (multipleCard) {
    Object.assign(multipleCard, req.body);
    await multipleCard.save();
    res.send(multipleCard);
    return;
  }

  throw new ApiError(httpStatus.NOT_FOUND, 'Card not found');
});

const updateCardData = catchAsync(async (req: Request, res: Response) => {
  const { id, type } = req.body;
  
  // 查找卡片
  let card = await Card.findOne({ _id: id });
  
  if (card) {
    if (type === 'rise') {
      // rise当前值减去3，fall的值变成102-当前rise值
      // 注意：这里的"当前rise值"是指减去3之后的新值
      card.rise = (card.rise || 50) - 3;
      card.fall = 102 - card.rise;
    } else if (type === 'fall') {
      // fall当前值减去3，rise的值变成102-当前fall值
      // 同理，这里的"当前fall值"是指减去3之后的新值
      card.fall = (card.fall || 50) - 3;
      card.rise = 102 - card.fall;
    }
    
    await card.save();
    res.send(card);
    return;
  }

  // 如果在Card集合中找不到，尝试在MultipleCard中查找（虽然需求描述主要针对rise/fall，通常属于Card）
  // 但为了保持健壮性，这里只处理Card，因为MultipleCard结构可能不同且需求未提及
  
  throw new ApiError(httpStatus.NOT_FOUND, 'Card not found');
});

const getCardData = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.body;
  
  // 查找卡片
  let card = await Card.findOne({ _id: id });
  
  if (card) {
    res.send(card);
    return;
  }
  
  throw new ApiError(httpStatus.NOT_FOUND, 'Card not found');
});

export default {
  getCards,
  updateCard,
  updateCardData,
  getCardData,
};
