import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import {
  uploadMediaService,
  getMediaByIdService,
  getMediaService,
  searchMediaService,
  updateMediaService,
  deleteMediaService,
} from '../services/media.service';
import { sendResponse } from '../utils/sendResponse';
import { generateFilename } from '../utils/fileStorage';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

// Configure multer storage
const storage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const filename = generateFilename(file.originalname);
    cb(null, filename);
  },
});

// File filter
const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/x-msvideo',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, videos, and documents are allowed.'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
});

/**
 * Upload media files
 */
export const uploadMediaController = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return sendResponse(res, 400, {
        code: 400,
        message: 'No file uploaded',
      });
    }

    const userId = req.userId!;
    const file = req.file;

    // Determine file type
    let fileType: 'image' | 'video' | 'document' = 'document';
    if (file.mimetype.startsWith('image/')) {
      fileType = 'image';
    } else if (file.mimetype.startsWith('video/')) {
      fileType = 'video';
    }

    const fileData = {
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      fileType,
      fileSize: file.size,
      filePath: file.path,
    };

    const result = await uploadMediaService(userId, fileData);
    return sendResponse(res, result.code, result);
  } catch (error: any) {
    return sendResponse(res, 500, {
      code: 500,
      message: error.message || 'Upload failed',
      error: error.message,
    }); 
  }
};

/**
 * Get media by ID
 */
export const getMediaByIdController = async (req: AuthRequest, res: Response) => {
  try {
    const { id }: any = req.params;
    const userId = req.userId!;

    const result = await getMediaByIdService(id, userId);
    return sendResponse(res, result.code, result);
  } catch (error: any) {
    return sendResponse(res, 500, {
      code: 500,
      message: error.message || 'Failed to retrieve media',
      error: error.message,
    });
  }
};

/**
 * Get all media with filters
 */
export const getMediaController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const query : any= {
      query: req.query.query as string | undefined,
      type: req.query.type as 'image' | 'video' | 'document' | 'all' | undefined,
      tags: req.query.tags
        ? (req.query.tags as string).split(',').filter(Boolean)
        : undefined,
      topics: req.query.topics
        ? (req.query.topics as string).split(',').filter(Boolean)
        : undefined,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    };

    const result = await getMediaService(userId, query);
    return sendResponse(res, result.code, result);
  } catch (error: any) {
    return sendResponse(res, 500, {
      code: 500,
      message: error.message || 'Failed to retrieve media',
      error: error.message,
    });
  }
};

/**
 * Semantic search
 */
export const searchMediaController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { query } = req.query;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    if (!query || typeof query !== 'string') {
      return sendResponse(res, 400, {
        code: 400,
        message: 'Search query is required',
      });
    }

    const result = await searchMediaService(userId, query, limit);
    return sendResponse(res, result.code, result);
  } catch (error: any) {
    return sendResponse(res, 500, {
      code: 500,
      message: error.message || 'Search failed',
      error: error.message,
    });
  }
};

/**
 * Update media
 */
export const updateMediaController = async (req: AuthRequest, res: Response) => {
  try {
    const { id }: any = req.params;
    const userId = req.userId!;
    const updates = req.body;

    const result = await updateMediaService(id, userId, updates);
    return sendResponse(res, result.code, result);
  } catch (error: any) {
    return sendResponse(res, 500, {
      code: 500,
      message: error.message || 'Failed to update media',
      error: error.message,
    });
  }
};

/**
 * Delete media
 */
export const deleteMediaController = async (req: AuthRequest, res: Response) => {
  try {
    const { id }: any = req.params;
    const userId = req.userId!;

    const result = await deleteMediaService(id, userId);
    return sendResponse(res, result.code, result);
  } catch (error: any) {
    return sendResponse(res, 500, {
      code: 500,
      message: error.message || 'Failed to delete media',
      error: error.message,
    });
  }
};

