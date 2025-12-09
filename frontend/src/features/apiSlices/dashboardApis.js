import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithInterceptor } from "../baseQuery";

//-------------------------------------------------------
//  * Media API Slice
//  * Handles all media-related API calls
//-------------------------------------------------------
export const dashboardApi = createApi({
  reducerPath: "mediaApi",
  baseQuery: baseQueryWithInterceptor,
  tagTypes: ["Media"],

  endpoints: (builder) => ({
    // Get all media with filters
    getMedia: builder.query({
      query: ({ query, type, tags, topics, page = 1, limit = 20 }) => {
        const params = new URLSearchParams();
        if (query) params.append("query", query);
        if (type && type !== "all") params.append("type", type);
        if (tags && tags.length > 0) params.append("tags", tags.join(","));
        if (topics && topics.length > 0) params.append("topics", topics.join(","));
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        return `/api/v1/media?${params.toString()}`;
      },
      providesTags: ["Media"],
    }),

    //--------------------------------------
    // Semantic search
    //--------------------------------------
    searchMedia: builder.query({
      query: ({ query, limit = 20 }) => {
        const params = new URLSearchParams();
        params.append("query", query);
        params.append("limit", limit.toString());
        return `/api/v1/media/search?${params.toString()}`;
      },
      providesTags: ["Media"],
    }),

    //------------------------------------
    // Get single media by ID
    //------------------------------------
    getMediaById: builder.query({
      query: (id) => `/api/v1/media/${id}`,
      providesTags: (result, error, id) => [{ type: "Media", id }],
    }),

    //-----------------------------------
    // Update media information
    //-----------------------------------
    updateMedia: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/v1/media/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Media", id },
        "Media",
      ],
    }),

    //----------------------------------
    // Delete media
    //----------------------------------
    deleteMedia: builder.mutation({
      query: (id) => ({
        url: `/api/v1/media/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Media"],
    }),

    //---------------------------------
    // Upload media files
    //---------------------------------
    uploadMedia: builder.mutation({
      query: (formData) => ({
        url: "/api/v1/media/upload",
        method: "POST",
        body: formData,
        extra: { isFormData: true },
      }),
      invalidatesTags: ["Media"],
    }),
  }),
});

export const dashboardApiReducer = dashboardApi.reducer;
export const dashboardApiMiddleware = dashboardApi.middleware;
export const dashboardApiReducerPath = dashboardApi.reducerPath;

export const {
  useGetMediaQuery,
  useSearchMediaQuery,
  useGetMediaByIdQuery,
  useUpdateMediaMutation,
  useDeleteMediaMutation,
  useUploadMediaMutation, 
} = dashboardApi;

