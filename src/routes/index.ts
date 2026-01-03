import express from 'express';
import userRoute from './user.route';
import pointRoute from './point.route';
import accountRoute from './account.route';
import cardRoute from './card.route';
import orderRoute from './order.route';
import accountController from '../controllers/account.controller';
import cardController from '../controllers/card.controller';

const router = express.Router();

router.use('/users', userRoute);
router.use('/points', pointRoute);
router.use('/accounts', accountRoute);
router.use('/cards', cardRoute);
router.use('/order', orderRoute);

// 注册 currentUser 路由
router.get('/currentUser', accountController.getCurrentUser);

// 注册 outLogin 路由 (POST 请求更符合规范，虽然 GET 也能用)
router.post('/outLogin', accountController.outLogin);

// 注册 updateCardData 路由
router.post('/updateCardData', cardController.updateCardData);

// 注册 getCardData 路由
router.post('/getCardData', cardController.getCardData);

export default router;
