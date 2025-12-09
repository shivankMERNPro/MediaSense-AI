import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  IconButton,
  LinearProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import ImageIcon from "@mui/icons-material/Image";
import VideocamIcon from "@mui/icons-material/Videocam";
import DescriptionIcon from "@mui/icons-material/Description";

const MediaDetailModal = ({ open, onClose, media }) => {
  if (!media) return null;

  const getFileIcon = (type) => {
    const iconSize = { fontSize: 64 };
    switch (type) {
      case "image":
        return <ImageIcon sx={{ ...iconSize, color: "#a855f7" }} />;
      case "video":
        return <VideocamIcon sx={{ ...iconSize, color: "#ec4899" }} />;
      case "document":
        return <DescriptionIcon sx={{ ...iconSize, color: "#3b82f6" }} />;
      default:
        return <DescriptionIcon sx={{ ...iconSize, color: "#3b82f6" }} />;
    }
  };

  const getStatusColor = (status) => {
    const styles = {
      ready: { bg: "rgba(52,211,153,0.15)", color: "#34d399" },
      analyzing: { bg: "rgba(251,191,36,0.15)", color: "#fbbf24" },
      uploading: { bg: "rgba(59,130,246,0.15)", color: "#3b82f6" },
      error: { bg: "rgba(239,68,68,0.15)", color: "#ef4444" },
    };
    return styles[status] || { bg: "rgba(255,255,255,0.1)", color: "#fff" };
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleDownload = () => {
    if (media.fileUrl) {
      const url = `${import.meta.env.VITE_API_BASE_URL}${media.fileUrl}`;
      window.open(url, "_blank");
    }
  };

  const statusColor = getStatusColor(media.status);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: "linear-gradient(135deg, #693b93 0%, #2f1b4b 100%)",
          borderRadius: "20px",
          border: "1px solid #8443a8",
          color: "white",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
          pb: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#e9d5ff" }}>
          Media Details
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: "rgba(255,255,255,0.8)",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {/* Preview Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 4,
            minHeight: 200,
            backgroundColor: "rgba(107, 52, 146, 0.2)",
            borderRadius: "12px",
            padding: 3,
            alignItems: "center",
          }}
        >
          {media.fileType === "image" && media.fileUrl ? (
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}${media.fileUrl}`}
              alt={media.originalName}
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                borderRadius: "8px",
              }}
            />
          ) : (
            getFileIcon(media.fileType)
          )}
        </Box>

        {/* File Info */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{ color: "#e9d5ff", fontWeight: "bold", mb: 1 }}
          >
            {media.originalName || media.filename}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
            <Chip
              label={media.fileType}
              size="small"
              sx={{
                backgroundColor: "rgba(168, 85, 247, 0.3)",
                color: "white",
                textTransform: "capitalize",
              }}
            />
            <Chip
              label={media.status}
              size="small"
              sx={{
                backgroundColor: statusColor.bg,
                color: statusColor.color,
                textTransform: "capitalize",
              }}
            />
            <Chip
              label={formatFileSize(media.fileSize)}
              size="small"
              sx={{
                backgroundColor: "rgba(59, 130, 246, 0.3)",
                color: "white",
              }}
            />
          </Box>
        </Box>

        {/* AI Description */}
        {media.description && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{ color: "#a855f7", fontWeight: "bold", mb: 1 }}
            >
              AI Description
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "rgba(255,255,255,0.9)", lineHeight: 1.6 }}
            >
              {media.description}
            </Typography>
          </Box>
        )}

        {/* Tags */}
        {media.tags && media.tags.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{ color: "#a855f7", fontWeight: "bold", mb: 1 }}
            >
              Tags
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {Array.isArray(media.tags)
                ? media.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(168, 85, 247, 0.2)",
                        color: "#e9d5ff",
                        border: "1px solid rgba(168, 85, 247, 0.3)",
                      }}
                    />
                  ))
                : media.tags.split(", ").map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(168, 85, 247, 0.2)",
                        color: "#e9d5ff",
                        border: "1px solid rgba(168, 85, 247, 0.3)",
                      }}
                    />
                  ))}
            </Box>
          </Box>
        )}

        {/* Topics */}
        {media.topics && media.topics.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{ color: "#a855f7", fontWeight: "bold", mb: 1 }}
            >
              Topics / Themes
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {Array.isArray(media.topics)
                ? media.topics.map((topic, index) => (
                    <Chip
                      key={index}
                      label={topic}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(236, 72, 153, 0.2)",
                        color: "#f9a8d4",
                        border: "1px solid rgba(236, 72, 153, 0.3)",
                      }}
                    />
                  ))
                : media.topics.split(", ").map((topic, index) => (
                    <Chip
                      key={index}
                      label={topic}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(236, 72, 153, 0.2)",
                        color: "#f9a8d4",
                        border: "1px solid rgba(236, 72, 153, 0.3)",
                      }}
                    />
                  ))}
            </Box>
          </Box>
        )}

        {/* Metadata */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{ color: "#a855f7", fontWeight: "bold", mb: 1 }}
          >
            Metadata
          </Typography>
          <Box
            sx={{
              backgroundColor: "rgba(107, 52, 146, 0.2)",
              borderRadius: "8px",
              padding: 2,
            }}
          >
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
              <strong>Uploaded:</strong>{" "}
              {new Date(media.uploadedAt).toLocaleString()}
            </Typography>
            {media.analyzedAt && (
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", mt: 1 }}>
                <strong>Analyzed:</strong>{" "}
                {new Date(media.analyzedAt).toLocaleString()}
              </Typography>
            )}
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", mt: 1 }}>
              <strong>MIME Type:</strong> {media.mimeType}
            </Typography>
          </Box>
        </Box>

        {/* Processing Status */}
        {media.status === "analyzing" && (
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="body2"
              sx={{ color: "#fbbf24", mb: 1, fontWeight: "medium" }}
            >
              AI analysis in progress...
            </Typography>
            <LinearProgress
              sx={{
                borderRadius: "4px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#fbbf24",
                },
              }}
            />
          </Box>
        )}

        {media.status === "error" && media.processingError && (
          <Box
            sx={{
              mt: 2,
              padding: 2,
              backgroundColor: "rgba(239, 68, 68, 0.2)",
              borderRadius: "8px",
              border: "1px solid rgba(239, 68, 68, 0.3)",
            }}
          >
            <Typography variant="body2" sx={{ color: "#fca5a5" }}>
              <strong>Error:</strong> {media.processingError}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          borderTop: "1px solid rgba(255,255,255,0.2)",
          padding: 2,
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: "rgba(255,255,255,0.8)",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
          }}
        >
          Close
        </Button>
        {media.status === "ready" && (
          <Button
            onClick={handleDownload}
            startIcon={<DownloadIcon />}
            sx={{
              background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(135deg, #9333ea 0%, #db2777 100%)",
              },
            }}
          >
            Download
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default MediaDetailModal;

