import express from 'express';
import cardController from '../controllers/card.controller';

const router = express.Router();

router
  .route('/')
  .get(cardController.getCards);

router
  .route('/:cardId')
  .patch(cardController.updateCard);

export default router;
