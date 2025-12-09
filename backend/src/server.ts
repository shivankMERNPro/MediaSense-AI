import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import { env } from './constants/env';
import { logger } from './utils/logger';

// Middlewares :-
import { corsMiddleware } from './middlewares/cors.middleware';
import { requestLogger } from './middlewares/logger.middleware';
// import { rateLimiter } from './middlewares/rateLimit.middleware';
import { credentialsHeaderMiddleware } from './middlewares/credentialsHeader.middleware';

import parentRoutes from './app';
import connectDB from './configs/dbConnectionConfig';
import { ensureUploadDirs } from './utils/fileStorage';

// ----------------------------------------------------------------------
// 1. Initialize Express
// ----------------------------------------------------------------------
const app = express();

// ----------------------------------------------------------------------
// 2. Security & Utility Middlewares
// ----------------------------------------------------------------------
app.use(helmet()); // Apply security-related HTTP headers to protect against common attacks
app.use(corsMiddleware); // Enable Cross-Origin Resource Sharing (CORS) for allowed origins
app.use(credentialsHeaderMiddleware);
// app.use(rateLimiter); // Apply rate limiting to prevent brute-force and DDoS attacks
app.use(requestLogger); // Log incoming HTTP requests (method, URL, response time, etc.)
app.use(express.json()); // Parse incoming JSON payloads in request bodies
app.use(express.urlencoded({ extended: true })); // 🧩 Parse URL-encoded payloads (for form submissions, etc.)
app.use(cookieParser()); // Parse cookies from the request headers

// ----------------------------------------------------------------------
// 3. Serve static files (uploads)
// ----------------------------------------------------------------------
app.use('/uploads', express.static('uploads'));

// ----------------------------------------------------------------------
// 4. Parent Routes ( Mount all main application routes )
// ----------------------------------------------------------------------
app.use(parentRoutes);

// ----------------------------------------------------------------------
// 5. Health Check Routes
// ----------------------------------------------------------------------
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Service is running' });
});

app.get('/api/mongodb/health', (_req: Request, res: Response) => {
  const dbState = mongoose.connection.readyState;
  const states: Record<number, string> = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
  };
  res.status(200).json({
    status: 'OK',
    environment: env.nodeEnv,
    database: states[dbState],
    timestamp: new Date().toISOString(),
  });
});

// ----------------------------------------------------------------------
// 6. Error Handling
// ----------------------------------------------------------------------
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal Server Error',
    error: env.nodeEnv === 'development' ? err : {},
  });
});

// ----------------------------------------------------------------------
// 7. Start Server
// ----------------------------------------------------------------------
const server = app.listen(env.port, async () => {
  await connectDB();
  // Ensure upload directories exist
  await ensureUploadDirs();
  logger.success(
    `⚡️ Server is running at http://localhost:${env.port} [${env.nodeEnv}]`,
  );
});

// ----------------------------------------------------------------------
// 8. Global Process Error Handling
// ----------------------------------------------------------------------
process.on('unhandledRejection', (err: Error) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err: Error) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  server.close(() => process.exit(1));
});
