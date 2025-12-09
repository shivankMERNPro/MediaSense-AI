import express from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import {
  uploadMediaController,
  getMediaByIdController,
  getMediaController,
  searchMediaController,
  updateMediaController,
  deleteMediaController,
  upload,
} from '../controllers/media.controller';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Upload media
router.post('/upload', upload.single('file'), uploadMediaController);

// Get all media with filters
router.get('/', getMediaController);

// Semantic search
router.get('/search', searchMediaController);

// Get media by ID
router.get('/:id', getMediaByIdController);

// Update media
router.put('/:id', updateMediaController);

// Delete media
router.delete('/:id', deleteMediaController);

export default router;

