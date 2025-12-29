import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import Account from '../models/account.model';
import ApiError from '../utils/ApiError';
import { Request, Response } from 'express';

const createAccount = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.body;

  // Check if account with same ID already exists
  const existingAccount = await Account.findOne({ id });
  if (existingAccount) {
    // Fix 2: Set session data only when account is verified
    // This will trigger session save due to saveUninitialized: false
    if (req.session) {
      (req.session as any).accountId = existingAccount.id;
    }

    res.status(httpStatus.OK).send({
      message: '账户已存在，跳过创建账户',
      data: existingAccount
    });
    return;
  }

  const account = await Account.create(req.body);
  
  // Set session for new account too
  if (req.session) {
    (req.session as any).accountId = (account as any).id;
  }

  res.status(httpStatus.CREATED).send({
    message: '创建账户成功',
    data: account
  });
});

const getAccounts = catchAsync(async (req: Request, res: Response) => {
  const accounts = await Account.find();
  res.send(accounts);
});

const getCurrentUser = catchAsync(async (req: Request, res: Response) => {
  // 1. 检查 Session 是否存在
  if (!req.session || !(req.session as any).accountId) {
    // 如果没有登录，返回 401 Unauthorized
    res.status(httpStatus.UNAUTHORIZED).send({
      message: '用户未登录',
      isLogin: false
    });
    return;
  }

  // 2. 如果有 Session，根据 Session 中的 accountId 查询用户信息
  const accountId = (req.session as any).accountId;
  const account = await Account.findOne({ id: accountId });

  if (!account) {
    // 极端情况：Session 还在，但数据库里账号被删了
    res.status(httpStatus.UNAUTHORIZED).send({
      message: '账户不存在',
      isLogin: false
    });
    return;
  }

  // 3. 返回用户信息（Ant Design Pro 格式）
  res.send({
    success: true,
    data: {
      name: account.name,
      avatar: account.avatar || 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      userid: account.id,
      email: 'antdesign@alipay.com',
      signature: '海纳百川，有容乃大',
      title: '交互专家',
      group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
      tags: [],
      notifyCount: 12,
      unreadCount: 11,
      country: 'China',
      access: 'admin',
      geographic: {
          province: { label: '浙江省', key: '330000' },
          city: { label: '杭州市', key: '330100' },
      },
      address: '西湖区工专路 77 号',
      phone: '0752-268888888',
    },
    isLogin: true
  });
});

const outLogin = catchAsync(async (req: Request, res: Response) => {
  // 1. 销毁服务器端 Session
  req.session.destroy((err) => {
    if (err) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, '退出登录失败');
    }
    
    // 2. 清除客户端 Cookie
    res.clearCookie('connect.sid'); // 默认 session cookie name

    // 3. 返回成功响应
    res.send({
      success: true,
      message: '退出登录成功',
    });
  });
});

export default {
  createAccount,
  getAccounts,
  getCurrentUser,
  outLogin,
};
