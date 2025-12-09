import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
export const THUMBNAIL_DIR = path.join(process.cwd(), 'uploads', 'thumbnails');

// Ensure upload directories exist
export const ensureUploadDirs = async (): Promise<void> => {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.mkdir(THUMBNAIL_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create upload directories:', error);
  }
};

// Generate unique filename
export const generateFilename = (originalName: string): string => {
  const ext = path.extname(originalName);
  const uniqueId = uuidv4();
  return `${uniqueId}${ext}`;
};

// Get file path
export const getFilePath = (filename: string): string => {
  return path.join(UPLOAD_DIR, filename);
};

// Get thumbnail path
export const getThumbnailPath = (filename: string): string => {
  return path.join(THUMBNAIL_DIR, filename);
};

// Get relative URL path for serving files
export const getFileUrl = (filename: string): string => {
  return `/uploads/${filename}`;
};

// Get relative URL path for thumbnails
export const getThumbnailUrl = (filename: string): string => {
  return `/uploads/thumbnails/${filename}`;
};

// Delete file
export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error(`Failed to delete file ${filePath}:`, error);
  }
};

