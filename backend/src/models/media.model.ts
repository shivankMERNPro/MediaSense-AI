import mongoose, { Schema, Document, Model } from 'mongoose';
import { IMedia } from '../types/media.types';

export interface IMediaDocument extends IMedia, Document {}

const mediaSchema = new Schema<IMediaDocument>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
    },
    filename: {
      type: String,
      required: [true, 'Filename is required'],
    },
    originalName: {
      type: String,
      required: [true, 'Original name is required'],
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
    },
    fileType: {
      type: String,
      enum: ['image', 'video', 'document'],
      required: [true, 'File type is required'],
      index: true,
    },
    fileSize: {
      type: Number,
      required: [true, 'File size is required'],
    },
    filePath: {
      type: String,
      required: [true, 'File path is required'],
    },
    fileUrl: {
      type: String,
    },
    thumbnailPath: {
      type: String,
    },
    description: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    topics: {
      type: [String],
      default: [],
      index: true,
    },
    embedding: {
      type: [Number],
      default: [],
    },
    status: {
      type: String,
      enum: ['uploading', 'analyzing', 'ready', 'error'],
      default: 'uploading',
      index: true,
    },
    processingError: {
      type: String,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    analyzedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: 'throw',
    collection: 'media',
  }
);

// Indexes for search performance
mediaSchema.index({ userId: 1, status: 1 });
mediaSchema.index({ tags: 1 });
mediaSchema.index({ topics: 1 });
mediaSchema.index({ fileType: 1, status: 1 });
mediaSchema.index({ uploadedAt: -1 });

export const Media: Model<IMediaDocument> =
  mongoose.models.Media || mongoose.model<IMediaDocument>('Media', mediaSchema);

