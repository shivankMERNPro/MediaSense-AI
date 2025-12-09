import path from 'path';
import { pathToFileURL } from 'url';
import { Types } from 'mongoose';
import { Media } from '../models/media.model';
import { IMedia, IMediaSearchQuery } from '../types/media.types';
import { HTTP_STATUS } from '../constants/httpStatus';
import { ApiResponse } from '../types/apiResponse.type';
import { deleteFile, getFileUrl } from '../utils/fileStorage';


const aiWorkflowModuleUrl = pathToFileURL(
  path.resolve(process.cwd(), "..", "ai-workflow", "processMedia.ts")
).href;

const loadAiWorkflowModule = async () => import(aiWorkflowModuleUrl);

/**
 * Upload and create media record
 */
export const uploadMediaService = async (
  userId: string,
  fileData: {
    filename: string;
    originalName: string;
    mimeType: string;
    fileType: 'image' | 'video' | 'document';
    fileSize: number;
    filePath: string;
    thumbnailPath?: string;
  }
): Promise<ApiResponse<IMedia>> => {
  try {

    const media = await Media.create({
      userId,
      ...fileData,
      fileUrl: getFileUrl(fileData.filename),
      status: 'uploading',
      uploadedAt: new Date(),
    });

    const mediaId = (media._id as unknown as Types.ObjectId).toString();
    
    // Update status to analyzing before starting AI processing
    await Media.findByIdAndUpdate(mediaId, { 
      status: 'analyzing',
      analyzedAt: new Date()
    }).exec();
    
    try {
      // Dynamic import of AI workflow
      const aiWorkflow = await loadAiWorkflowModule();
      
      console.log(`Starting AI processing for media ${mediaId}`);
      await aiWorkflow.processMediaWithAI(mediaId, fileData.filePath, fileData.fileType);
      
      // if (!aiResult) {
      //   throw new Error("AI processing returned no result");
      // }
      
      console.log(`✅ Completed AI processing for media ${mediaId}`);
      
      // Fetch the updated media with AI-generated content
      const updatedMedia = await Media.findById(mediaId);
      if (!updatedMedia) {
        throw new Error("Media not found after AI processing");
      }
      
      return {
        code: HTTP_STATUS.CREATED,
        message: 'Media uploaded and analyzed successfully',
        data: updatedMedia.toObject() as IMedia,
      };
      
    } catch (error: any) {
      console.error(`❌ AI processing failed for media ${mediaId}:`, error);
      
      // Update status to error with detailed message
      const errorMessage = error.message || 'Unknown error during AI processing';
      await Media.findByIdAndUpdate(mediaId, {
        status: 'error',
        processingError: errorMessage,
        analyzedAt: new Date()
      }).exec().catch(updateError => {
        console.error('Failed to update media error status:', updateError);
      });
      
      // Return the media with error status
      const errorMedia = await Media.findById(mediaId);
      return {
        code: HTTP_STATUS.CREATED,
        message: 'Media uploaded but AI analysis failed',
        data: errorMedia?.toObject() as IMedia,
        error: errorMessage,
      };
    }
  } catch (error: any) {
    return {
      code: HTTP_STATUS.INTERNAL_SERVER,
      message: 'Failed to upload media',
      error: error.message,
    };
  }
};

/**
 * Get media by ID
 */
export const getMediaByIdService = async (
  mediaId: string,
  userId: string
): Promise<ApiResponse<IMedia>> => {
  try {
    const media = await Media.findOne({ _id: mediaId, userId });

    if (!media) {
      return {
        code: HTTP_STATUS.NOT_FOUND,
        message: 'Media not found',
      };
    }

    return {
      code: HTTP_STATUS.OK,
      message: 'Media retrieved successfully',
      data: media.toObject() as IMedia,
    };
  } catch (error: any) {
    return {
      code: HTTP_STATUS.INTERNAL_SERVER,
      message: 'Failed to retrieve media',
      error: error.message,
    };
  }
};

/**
 * Get all media with filters and search
 */
export const getMediaService = async (
  userId: string,
  query: IMediaSearchQuery
): Promise<ApiResponse<{ media: IMedia[]; total: number; page: number; limit: number }>> => {
  try {
    const {
      query: searchQuery,
      type,
      tags,
      topics,
      page = 1,
      limit = 20,
    } = query;

    const filter: any = { userId };

    // Filter by file type
    if (type && type !== 'all') {
      filter.fileType = type;
    }

    // Filter by tags
    if (tags && tags.length > 0) {
      filter.tags = { $in: tags };
    }

    // Filter by topics
    if (topics && topics.length > 0) {
      filter.topics = { $in: topics };
    }

    // Text search (will be enhanced with semantic search)
    if (searchQuery) {
      filter.$or = [
        { originalName: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
        { tags: { $in: [new RegExp(searchQuery, 'i')] } },
        { topics: { $in: [new RegExp(searchQuery, 'i')] } },
      ];
    }

    const skip = (page - 1) * limit;

    const [media, total] = await Promise.all([
      Media.find(filter)
        .sort({ uploadedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Media.countDocuments(filter),
    ]);

    return {
      code: HTTP_STATUS.OK,
      message: 'Media retrieved successfully',
      data: {
        media: media as IMedia[],
        total,
        page,
        limit,
      },
    };
  } catch (error: any) {
    return {
      code: HTTP_STATUS.INTERNAL_SERVER,
      message: 'Failed to retrieve media',
      error: error.message,
    };
  }
};

/**
 * Semantic search using embeddings
 */
// export const searchMediaService = async (
//   userId: string,
//   query: string,
//   limit: number = 20
// ): Promise<ApiResponse<{ media: IMedia[]; total: number }>> => {
//   try {
//     // Import AI workflow function for semantic search
//     const { generateEmbedding, findSimilarMedia } = await loadAiWorkflowModule();
    

//     // Generate embedding for search query
//     const queryEmbedding = await generateEmbedding(query);

//     // Find similar media using vector similarity
//     const similarMedia = await findSimilarMedia(
//       userId,
//       queryEmbedding,
//       limit
//     );

//     return {
//       code: HTTP_STATUS.OK,
//       message: 'Search completed successfully',
//       data: {
//         media: similarMedia,
//         total: similarMedia.length,
//       },
//     };
//   } catch (error: any) {
//     return {
//       code: HTTP_STATUS.INTERNAL_SERVER,
//       message: 'Search failed',
//       error: error.message,
//     };
//   }
// };


export const searchMediaService = async (
  userId: string,
  query: string,
  limit: number = 20
): Promise<ApiResponse<{ media: IMedia[]; total: number }>> => {
  try {
    if (!query || query.trim().length === 0) {
      return {
        code: HTTP_STATUS.BAD_REQUEST,
        message: "Query cannot be empty",
      };
    }

    // Load AI workflow functions
    const { generateEmbedding, findSimilarMedia } = await loadAiWorkflowModule();

    let similarMedia: IMedia[] = [];

    // ----------------------------------------------------
    // 1️⃣ Smart Logic → Skip AI embedding for tiny queries
    // ----------------------------------------------------
    if (query.trim().length < 3) {
      console.log("ℹ️ Query too short, using keyword search only.");

      similarMedia = await Media.find({
        userId,
        status: "ready",
        $or: [
          { description: { $regex: query, $options: "i" } },
          { tags: { $regex: query, $options: "i" } },
          { topics: { $regex: query, $options: "i" } },
        ],
      })
        .limit(limit)
        .lean();

      return {
        code: HTTP_STATUS.OK,
        message: "Keyword search completed",
        data: {
          media: similarMedia,
          total: similarMedia.length,
        },
      };
    }

    // ----------------------------------------------------
    // 2️⃣ Generate embedding for semantic search
    // ----------------------------------------------------
    const queryEmbedding = await generateEmbedding(query);

    if (!queryEmbedding || !Array.isArray(queryEmbedding)) {
      console.warn("⚠️ Embedding failed. Falling back to keyword search...");

      similarMedia = await Media.find({
        userId,
        status: "ready",
        $or: [
          { description: { $regex: query, $options: "i" } },
          { tags: { $regex: query, $options: "i" } },
          { topics: { $regex: query, $options: "i" } },
        ],
      })
        .limit(limit)
        .lean();

      return {
        code: HTTP_STATUS.OK,
        message: "Fallback keyword search completed",
        data: {
          media: similarMedia,
          total: similarMedia.length,
        },
      };
    }

    // ----------------------------------------------------
    // 3️⃣ Run semantic vector-based search
    // ----------------------------------------------------
    similarMedia = await findSimilarMedia(
      userId,
      queryEmbedding,
      limit
    );

    return {
      code: HTTP_STATUS.OK,
      message: "Semantic search completed successfully",
      data: {
        media: similarMedia,
        total: similarMedia.length,
      },
    };
  } catch (error: any) {
    console.error("❌ searchMediaService Error:", error);

    return {
      code: HTTP_STATUS.INTERNAL_SERVER,
      message: "Search failed",
      error: error?.message || "Unknown error",
    };
  }
};



/**
 * Update media metadata
 */
export const updateMediaService = async (
  mediaId: string,
  userId: string,
  updates: Partial<IMedia>
): Promise<ApiResponse<IMedia>> => {
  try {
    const media = await Media.findOneAndUpdate(
      { _id: mediaId, userId },
      { $set: updates },
      { new: true }
    );

    if (!media) {
      return {
        code: HTTP_STATUS.NOT_FOUND,
        message: 'Media not found',
      };
    }

    return {
      code: HTTP_STATUS.OK,
      message: 'Media updated successfully',
      data: media.toObject() as IMedia,
    };
  } catch (error: any) {
    return {
      code: HTTP_STATUS.INTERNAL_SERVER,
      message: 'Failed to update media',
      error: error.message,
    };
  }
};

/**
 * Delete media
 */
export const deleteMediaService = async (
  mediaId: string,
  userId: string
): Promise<ApiResponse<void>> => {
  try {
    const media = await Media.findOne({ _id: mediaId, userId });

    if (!media) {
      return {
        code: HTTP_STATUS.NOT_FOUND,
        message: 'Media not found',
      };
    }

    // Delete file from storage
    await deleteFile(media.filePath);
    if (media.thumbnailPath) {
      await deleteFile(media.thumbnailPath);
    }

    // Delete from database
    await Media.findByIdAndDelete(mediaId);

    return {
      code: HTTP_STATUS.OK,
      message: 'Media deleted successfully',
    };
  } catch (error: any) {
    return {
      code: HTTP_STATUS.INTERNAL_SERVER,
      message: 'Failed to delete media',
      error: error.message,
    };
  }
};

