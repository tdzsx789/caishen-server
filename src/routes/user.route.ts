import express from 'express';
import validate from '../middlewares/validate';
import userController from '../controllers/user.controller';
import Joi from 'joi';

const router = express.Router();

const createUserSchema = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().required().email(),
  }),
};

const getUserSchema = {
  params: Joi.object().keys({
    userId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
  }),
};

router
  .route('/')
  .post(validate(createUserSchema), userController.createUser)
  .get(userController.getUsers);

router
  .route('/:userId')
  .get(validate(getUserSchema), userController.getUser);

export default router;
