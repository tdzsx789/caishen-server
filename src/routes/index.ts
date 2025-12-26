import express from 'express';
import userRoute from './user.route';
import pointRoute from './point.route';
import accountRoute from './account.route';

const router = express.Router();

router.use('/users', userRoute);
router.use('/points', pointRoute);
router.use('/accounts', accountRoute);

export default router;
