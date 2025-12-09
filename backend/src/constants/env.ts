import dotenv from 'dotenv';
dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || '',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI as string,
  mongoDbName: process.env.MONGO_DB_NAME as string,
  mongoMaxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE) || 0,
  mongoMinPoolSize: Number(process.env.MONGO_MIN_POOL_SIZE) || 0,
  mongoConnectTimeoutMS: Number(process.env.MONGO_CONNECT_TIMEOUT_MS) || 0,
  mongoSocketTimeoutMS: Number(process.env.MONGO_SOCKET_TIMEOUT_MS) || 0,
  jwtSecret: (process.env.JWT_SECRET as string) || '',
  jwtAccessSecret: (process.env.JWT_ACCESS_SECRET as string) || process.env.JWT_SECRET || '',
  jwtRefreshSecret: (process.env.JWT_REFRESH_SECRET as string) || process.env.JWT_SECRET || '',
  corsOrigin: (process.env.CORS_ORIGIN as string) || '',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  githubClientId: process.env.GITHUB_CLIENT_ID || '',
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET || '',
  githubRedirectUri: process.env.GITHUB_REDIRECT_URI || '',
};
