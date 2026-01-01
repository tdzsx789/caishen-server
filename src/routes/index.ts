import express from 'express';
import userRoute from './user.route';
import pointRoute from './point.route';
import accountRoute from './account.route';
import cardRoute from './card.route';
import accountController from '../controllers/account.controller';

const router = express.Router();

router.use('/users', userRoute);
router.use('/points', pointRoute);
router.use('/accounts', accountRoute);
router.use('/cards', cardRoute);

// 注册 currentUser 路由
router.get('/currentUser', accountController.getCurrentUser);

// 注册 outLogin 路由 (POST 请求更符合规范，虽然 GET 也能用)
router.post('/outLogin', accountController.outLogin);

export default router;
