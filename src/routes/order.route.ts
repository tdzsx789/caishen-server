import express from 'express';
import orderController from '../controllers/order.controller';

const router = express.Router();

router
  .route('/')
  .post(orderController.createOrder);

router.post('/getOrders', orderController.getOrders);

export default router;
