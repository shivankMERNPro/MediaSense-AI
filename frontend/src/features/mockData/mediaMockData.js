/**
 * Mock Media Data Service
 * Provides mock data for development and testing
 */

// Generate mock media data
const generateMockMedia = (count = 10) => {
  const types = ["image", "video", "document"];
  const statuses = ["ready", "uploading", "analyzing", "failed"];
  const categories = {
    image: ["nature", "landscape", "portrait", "urban", "abstract"],
    video: ["nature", "travel", "documentary", "tutorial", "entertainment"],
    document: ["report", "presentation", "spreadsheet", "letter", "contract"],
  };

  const mockFiles = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const date = new Date(now - Math.random() * 30 * 24 * 60 * 60 * 1000);

    let filename = "";
    let size = 0;
    let description = "-";
    let tags = [];
    let topics = [];

    switch (type) {
      case "image":
        filename = `Screenshot ${date.toLocaleDateString("en-GB").replace(/\//g, "-")} at ${date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}.png`;
        size = (Math.random() * 5 + 0.5).toFixed(2);
        description = Math.random() > 0.5 ? "AI-generated description" : "-";
        tags = categories.image.slice(0, Math.floor(Math.random() * 3) + 1);
        topics = ["photography", "nature"];
        break;
      case "video":
        filename = `Video_${date.getTime()}.mp4`;
        size = (Math.random() * 100 + 10).toFixed(2);
        description = Math.random() > 0.5 ? "Video content description" : "-";
        tags = categories.video.slice(0, Math.floor(Math.random() * 3) + 1);
        topics = ["video", "content"];
        break;
      case "document":
        filename = `Document_${i + 1}.pdf`;
        size = (Math.random() * 10 + 0.1).toFixed(2);
        description = Math.random() > 0.5 ? "Document description" : "-";
        tags = categories.document.slice(0, Math.floor(Math.random() * 3) + 1);
        topics = ["document", "business"];
        break;
    }

    mockFiles.push({
      id: `media-${i + 1}`,
      type,
      filename,
      description,
      tags: tags.join(", "),
      topics: topics.join(", "),
      size: `${size} MB`,
      sizeMB: parseFloat(size),
      status,
      date: date.toLocaleDateString("en-GB"),
      createdAt: date.toISOString(),
      preview: type === "image" ? `https://picsum.photos/200/200?random=${i}` : null,
    });
  }

  return mockFiles;
};

/**
 * Mock API functions
 */
export const mockMediaService = {
  // Get media with filters
  getMedia: async ({ query, type, status }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    let data = generateMockMedia(15);

    // Apply filters
    if (type && type !== "all") {
      data = data.filter((item) => item.type === type);
    }

    if (status && status !== "all") {
      data = data.filter((item) => item.status === status);
    }

    if (query) {
      const lowerQuery = query.toLowerCase();
      data = data.filter(
        (item) =>
          item.filename.toLowerCase().includes(lowerQuery) ||
          item.description.toLowerCase().includes(lowerQuery) ||
          item.tags.toLowerCase().includes(lowerQuery)
      );
    }

    return {
      data,
      total: data.length,
    };
  },

  // Get media by ID
  getMediaById: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const allMedia = generateMockMedia(1);
    return {
      ...allMedia[0],
      id,
    };
  },

  // Update media
  updateMedia: async ({ id, ...data }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      id,
      ...data,
      updatedAt: new Date().toISOString(),
    };
  },

  // Delete media
  deleteMedia: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { id, deleted: true };
  },
};

export default mockMediaService;

