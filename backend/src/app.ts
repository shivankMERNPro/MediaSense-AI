// app.ts

import express from 'express';

// ----------------------------------------------------------------------
// Import Child Routes
// ----------------------------------------------------------------------
import authRoutes from './routes/auth.routes';
import mediaRoutes from './routes/media.routes';

const parentRoutes = express.Router();

parentRoutes.use('/api/v1', authRoutes);
parentRoutes.use('/api/v1/media', mediaRoutes);

export default parentRoutes;
