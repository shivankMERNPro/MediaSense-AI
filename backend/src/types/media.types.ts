export interface IMedia {
  userId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  fileType: 'image' | 'video' | 'document';
  fileSize: number;
  filePath: string;
  fileUrl?: string;
  thumbnailPath?: string;
  
  // AI-generated metadata
  description?: string;
  tags?: string[];
  topics?: string[];
  embedding?: number[];
  
  // Processing status
  status: 'uploading' | 'analyzing' | 'ready' | 'error';
  processingError?: string;
  
  // Metadata
  uploadedAt: Date;
  analyzedAt?: Date;
}

export interface IMediaSearchQuery {
  query?: string;
  type?: 'image' | 'video' | 'document' | 'all';
  tags?: string[];
  topics?: string[];
  page?: number;
  limit?: number;
}

