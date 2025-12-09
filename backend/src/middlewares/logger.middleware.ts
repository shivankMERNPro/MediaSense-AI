import morgan from 'morgan';
import { env } from '../constants/env';
import { logger } from '../utils/logger';

const stream = {
  write: (message: string) => logger.info(message.trim()),
};

const format =
  env.nodeEnv === 'production'
    ? 'combined'
    : ':method :url :status :response-time ms - :res[content-length] - :remote-addr';


export const requestLogger = morgan(format, { stream });
