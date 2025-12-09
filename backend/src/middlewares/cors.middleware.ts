import cors, { CorsOptions } from 'cors';
import { env } from '../constants/env';
import { logger } from '../utils/logger';

const allowedOrigins = env.corsOrigin ? env.corsOrigin.split(',') : [];

console.log(allowedOrigins, "allowedOrigins");
console.log(env.nodeEnv, "env.nodeEnv");

// ------------------------------
// CORS CONFIG (Fixed & Correct)
// ------------------------------
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow all in development
    if (env.nodeEnv !== 'production') {
      return callback(null, true);
    }

    // Production strict check
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    logger.warn(`❌ Blocked by CORS: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  },

  credentials: true, // allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-App-Version'
  ],
};

// Export CORS middleware
export const corsMiddleware = cors(corsOptions);