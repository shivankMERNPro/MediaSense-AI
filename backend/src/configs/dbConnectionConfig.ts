import mongoose from 'mongoose';
import { env } from '../constants/env';
import { logger } from '../utils/logger';

let isConnected = false;
let reconnectAttempts = 0;
const MAX_RETRIES = 5;

const connectDB = async (): Promise<void> => {
  if (isConnected) {
    logger.info('👍 MongoDB is already connected.');
    return;
  }

  const options: mongoose.ConnectOptions = {
    dbName: env.mongoDbName,
    maxPoolSize: env.mongoMaxPoolSize,
    minPoolSize: env.mongoMinPoolSize,
    connectTimeoutMS: env.mongoConnectTimeoutMS,
    socketTimeoutMS: env.mongoSocketTimeoutMS,
    autoIndex: env.nodeEnv === 'development',
    autoCreate: true,
  };

  try {
    await mongoose.connect(env.mongoUri, options);
    isConnected = true;
    reconnectAttempts = 0;
    logger.success(
      `👍 MongoDB connected successfully to database: ${env.mongoDbName}`,
    );
  } catch (error) {
    reconnectAttempts++;
    logger.error(
      `MongoDB connection error (${reconnectAttempts}/${MAX_RETRIES}): ${(error as Error).message}`,
    );

    if (reconnectAttempts < MAX_RETRIES) {
      logger.warn(`Retrying connection in 5 seconds...`);
      setTimeout(connectDB, 5000);
    } else {
      logger.error('Max retry attempts reached. Exiting process.');
      process.exit(1);
    }
  }
};

// Handle process termination gracefully
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.warn('MongoDB connection closed due to app termination (SIGINT).');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await mongoose.connection.close();
  logger.warn('MongoDB connection closed due to app termination (SIGTERM).');
  process.exit(0);
});

// Connection event listeners
mongoose.connection.on('connected', () => logger.info('MongoDB connected.'));
mongoose.connection.on('disconnected', () =>
  logger.warn('MongoDB disconnected.'),
);
mongoose.connection.on('reconnected', () =>
  logger.info('MongoDB reconnected.'),
);
mongoose.connection.on('error', (err) => logger.error(`MongoDB error: ${err}`));

export default connectDB;
