import { useState, useEffect, useMemo } from "react";

import { toast } from "react-toastify";
import SearchForm from "../../components/privateComponents/dashboard/SearchForm";
import MediaTable from "../../components/privateComponents/dashboard/MediaTable";
import EditMediaModal from "../../components/privateComponents/dashboard/EditMediaModal";
import MediaDetailModal from "../../components/privateComponents/dashboard/MediaDetailModal";

import {
  useGetMediaQuery,
  useSearchMediaQuery,
  useDeleteMediaMutation,
  useUpdateMediaMutation,
} from "../../features/apiSlices/dashboardApis";
import useDebounce from "../../hooks/useDebounce";

import ImageIcon from '@mui/icons-material/Image';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import DescriptionIcon from '@mui/icons-material/Description';

const formatFileSize = (bytes) => {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
};

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [useSemanticSearch, setUseSemanticSearch] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  // Action menu states
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // Determine which query to use
  const shouldUseSemanticSearch = useSemanticSearch && debouncedSearchQuery.trim().length > 0;

  // Regular query
  const {
    data: mediaDataResponse,
    isLoading: loadingRegular,
    refetch: refetchMedia,
  } = useGetMediaQuery(
    {
      query: shouldUseSemanticSearch ? undefined : debouncedSearchQuery,
      type: typeFilter === "all" ? undefined : typeFilter,
      tags: selectedTags.length ? selectedTags : undefined,
      topics: selectedTopics.length ? selectedTopics : undefined,
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
    },
    { skip: shouldUseSemanticSearch }
  );

  // Semantic search query
  const {
    data: searchDataResponse,
    isLoading: loadingSearch,
  } = useSearchMediaQuery(
    {
      query: debouncedSearchQuery,
      limit: 50,
    },
    { skip: !shouldUseSemanticSearch }
  );

  const [deleteMedia] = useDeleteMediaMutation();
  const [updateMedia] = useUpdateMediaMutation();

  const loading = loadingRegular || loadingSearch;

  // Get media data from appropriate source
  const semanticResults = useMemo(() => {
    if (!shouldUseSemanticSearch) return [];
    const items = searchDataResponse?.data?.media || [];
    return items.filter((item) => {
      const tagMatch =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => item.tags?.includes(tag));
      const topicMatch =
        selectedTopics.length === 0 ||
        selectedTopics.every((topic) => item.topics?.includes(topic));
      return tagMatch && topicMatch;
    });
  }, [searchDataResponse, shouldUseSemanticSearch, selectedTags, selectedTopics]);

  const mediaData = shouldUseSemanticSearch
    ? semanticResults
    : mediaDataResponse?.data?.media || [];

  // Transform data for table
  const transformedMediaData = mediaData.map((item) => ({
    id: item._id || item.id,
    type: item.fileType,
    filename: item.originalName || item.filename,
    description: item.description || "Failed to generate description, Tags & Topics as well",
    tags:  item.tags?.join(", ") || "No tags",
    topics: item.topics?.join(", ") || "No topics",
    size: formatFileSize(item.fileSize),
    status: item.status,
    date: new Date(item.uploadedAt).toLocaleDateString(),
    preview: item.fileUrl
      ? `${import.meta.env.VITE_API_BASE_URL}${item.fileUrl}`
      : null,
    fileUrl: item.fileUrl,
    ...item,
  }));

  const availableTags = useMemo(() => {
    const tagSet = new Set();
    mediaData.forEach((item) => {
      item.tags?.forEach((tag) => tag && tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [mediaData]);

  const availableTopics = useMemo(() => {
    const topicSet = new Set();
    mediaData.forEach((item) => {
      item.topics?.forEach((topic) => topic && topicSet.add(topic));
    });
    return Array.from(topicSet);
  }, [mediaData]);

  const handlePaginationChange = (model) => {
    setPaginationModel(model);
  };

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  // Filters
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // Auto-enable semantic search for natural language queries
    if (e.target.value.trim().length > 10) {
      setUseSemanticSearch(true);
    } else {
      setUseSemanticSearch(false);
    }
  };

  const handleTypeChange = (e) => setTypeFilter(e.target.value);
  const handleTagsChange = (event) => {
    const value = event.target.value;
    setSelectedTags(typeof value === "string" ? value.split(",") : value);
  };

  const handleTopicsChange = (event) => {
    const value = event.target.value;
    setSelectedTopics(typeof value === "string" ? value.split(",") : value);
  };

  // View detail handler
  const handleViewDetail = (row) => {
    setSelectedMedia(row);
    setDetailModalOpen(true);
  };

  // Edit / Delete handlers
  const handleEdit = () => {
    setEditModalOpen(true);
    setSelectedMedia(selectedRow);
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this media?")) return;

    try {
      await deleteMedia(selectedRow.id).unwrap();
      toast.success("Media deleted");
      refetchMedia();
    } catch (err) {
      toast.error("Failed to delete");
    }
    handleMenuClose();
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      const payload = {
        id: updatedData.id,
        description: updatedData.description,
        filename: updatedData.filename,
        tags: updatedData.tags
          ? updatedData.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
          : [],
        topics: updatedData.topics
          ? updatedData.topics.split(",").map((topic) => topic.trim()).filter(Boolean)
          : [],
      };
      await updateMedia({
        ...payload,
      }).unwrap();
      toast.success("Media updated");
      setEditModalOpen(false);
      setSelectedMedia(null);
      refetchMedia();
    } catch {
      toast.error("Failed to update media");
    }
  };

  // ICON SELECTOR FUNCTION
  const getTypeIcon = (type) => {
    if (type === "image") return <ImageIcon sx={{ color: "#fff" }} />;
    if (type === "video") return <VideoCameraBackIcon sx={{ color: "#fff" }} />;
    return <DescriptionIcon sx={{ color: "#fff" }} />;
  };

  // STATUS COLOR FUNCTION
  const getStatusColor = (status) => {
    const styles = {
      ready: { bg: "rgba(52,211,153,0.15)", color: "#34d399" },
      analyzing: { bg: "rgba(251,191,36,0.15)", color: "#fbbf24" },
      uploading: { bg: "rgba(59,130,246,0.15)", color: "#3b82f6" },
      error: { bg: "rgba(239,68,68,0.15)", color: "#ef4444" },
    };
    return styles[status] || { bg: "rgba(255,255,255,0.1)", color: "#fff" };
  };

  const totalRows = shouldUseSemanticSearch
    ? semanticResults.length
    : mediaDataResponse?.data?.total || 0;

  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [
    typeFilter,
    selectedTags,
    selectedTopics,
    debouncedSearchQuery,
    shouldUseSemanticSearch,
  ]);

  return (
    <div className="container mx-auto px-4 py-6 max-w-[1450px]">
      <SearchForm
        searchQuery={searchQuery}
        typeFilter={typeFilter}
        selectedTags={selectedTags}
        selectedTopics={selectedTopics}
        availableTags={availableTags}
        availableTopics={availableTopics}
        onSearchChange={handleSearchChange}
        onTypeChange={handleTypeChange}
        onTagsChange={handleTagsChange}
        onTopicsChange={handleTopicsChange}
        useSemanticSearch={useSemanticSearch}
      />

      <div className="mt-8">
        <MediaTable
          mediaData={transformedMediaData}
          loading={loading}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationChange}
          rowCount={totalRows}
          anchorEl={anchorEl}
          selectedRow={selectedRow}
          onMenuOpen={handleMenuOpen}
          onMenuClose={handleMenuClose}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewDetail={handleViewDetail}
          getTypeIcon={getTypeIcon}
          getStatusColor={getStatusColor}
        />
      </div>

      <MediaDetailModal
        open={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedMedia(null);
        }}
        media={selectedMedia}
      />

      <EditMediaModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedMedia(null);
        }}
        media={selectedMedia}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default Dashboard;
