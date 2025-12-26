import express from 'express';
import validate from '../middlewares/validate';
import accountController from '../controllers/account.controller';
import Joi from 'joi';

const router = express.Router();

const createAccountSchema = {
  body: Joi.object().keys({
    name: Joi.string().required().messages({
      'any.required': 'Name is required',
    }),
    avatar: Joi.string().uri().allow('').messages({
      'string.uri': 'Avatar must be a valid URL',
    }),
    id: Joi.string().required().messages({
      'any.required': 'ID is required',
    }),
    balance: Joi.number().default(0),
  }),
};

router
  .route('/')
  .post(validate(createAccountSchema), accountController.createAccount)
  .get(accountController.getAccounts);

export default router;
