import express from 'express';
import { db } from '../db';
import session from 'express-session';
import passport from 'passport';
import MemoryStore from 'memorystore';
import { eq, like } from 'drizzle-orm';
import { users } from '../db/schema';

const app = express();
const MemoryStoreSession = MemoryStore(session);

// 中间件配置
app.use(express.json());
app.use(session({
  cookie: { maxAge: 86400000 },
  store: new MemoryStoreSession({
    checkPeriod: 86400000 // 24 hours
  }),
  resave: false,
  secret: process.env.SESSION_SECRET || 'secret',
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// 您原有的路由处理逻辑
app.post('/api/login', passport.authenticate('local'), (req, res) => {
  res.json({ success: true });
});

app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q as string;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    // 使用 drizzle-orm 执行搜索
    const results = await db
      .select()
      .from(users)
      .where(like(users.username, `%${query}%`))
      .execute();

    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 添加健康检查路由
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 其他 API 路由...
// 从您的原始服务器代码复制其他路由处理程序

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

export default app; 