// ==========================================
// [注意] 此文件是旧的本地脚本，已被废弃。
// 新的 API 业务逻辑（已实现从 POST Body 读取数据）位于: src/controllers/account.controller.ts
// ==========================================
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// ==========================================
// 在这里配置 MongoDB 连接信息
// ==========================================
// 方式 1: 直接在这里修改字符串 (优先级最高)
// 格式: mongodb://username:password@host:port/database
const MONGO_URI = 'mongodb://mongo_rJPeCs:mongo_yjnQEJ@13.212.168.127:27017/caishen_market?authSource=admin';

// 注意：
// 1. 如果你的密码包含特殊字符（如 @, :, /），必须进行 URL 编码（例如 @ -> %40）
// 2. 如果你的账号是在 admin 数据库创建的，请加上 ?authSource=admin
// 3. 请将 'root' 和 'password' 替换为真实的用户名和密码

// 方式 2: 使用 .env 文件中的配置 (如果上面的变量为空)
// const MONGO_URI = process.env.MONGODB_URL || 'mongodb://localhost:27017/caishen_market';
// ==========================================

// 定义临时的 Account Schema
const accountSchema = new mongoose.Schema({
  name: String,
  avatar: String,
  id: String,
  balance: Number
}, { strict: false }); // strict: false 允许插入 Schema 中未定义的字段

const Account = mongoose.model('Account', accountSchema, 'account'); // 第三个参数指定 collection 名称为 'account'

const importData = async () => {
  try {
    console.log('正在连接 MongoDB...');
    console.log('连接地址:', MONGO_URI);
    
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB 连接成功');

    // Mock 数据
    const mockData = [
      {
        "name": "Acount1",
        "avatar": "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
        "id": "0000000001",
        "balance": 10000
      }
    ];

    console.log(`准备处理 ${mockData.length} 条数据`);

    for (const account of mockData) {
      // 查询是否存在相同的 id
      const existingAccount = await Account.findOne({ id: account.id });
      
      if (existingAccount) {
        console.log(`ID: ${account.id} (Name: ${account.name}) 已存在，跳过插入`);
      } else {
        await Account.create(account);
        console.log(`ID: ${account.id} (Name: ${account.name}) 插入成功`);
      }
    }
    
    console.log('数据导入成功！');
    process.exit(0);
  } catch (error) {
    console.error('导入失败:', error);
    process.exit(1);
  }
};

importData();
