import express from 'express';
import validate from '../middlewares/validate';
import pointController from '../controllers/point.controller';
import Joi from 'joi';

const router = express.Router();

const addPointsSchema = {
  body: Joi.object().keys({
    userId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
    amount: Joi.number().positive().required(),
    description: Joi.string().allow(''),
  }),
};

const payPointsSchema = {
  body: Joi.object().keys({
    userId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
    amount: Joi.number().positive().required(),
    description: Joi.string().allow(''),
  }),
};

const getHistorySchema = {
  params: Joi.object().keys({
    userId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
  }),
};

router.post('/add', validate(addPointsSchema), pointController.addPoints);
router.post('/pay', validate(payPointsSchema), pointController.pay);
router.get('/history/:userId', validate(getHistorySchema), pointController.getHistory);

export default router;
