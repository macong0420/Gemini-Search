import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "../db/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// 针对不同环境的连接配置
const connectionConfig = process.env.VERCEL 
  ? {
      connectionString: process.env.DATABASE_URL,
    }
  : {
      connectionString: process.env.DATABASE_URL,
      webSocket: ws,
    };

export const db = drizzle({
  connection: connectionConfig,
  schema
});
