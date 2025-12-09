import { useState, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  LinearProgress,
  Chip,
} from "@mui/material";

import ImageIcon from "@mui/icons-material/Image";
import VideocamIcon from "@mui/icons-material/Videocam";
import DescriptionIcon from "@mui/icons-material/Description";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

/**
 * Uploader Component
 * Fully functional file uploader with drag & drop support
 * Returns file information ready for server upload
 * 
 * @param {Function} onFilesSelected - Callback function that receives array of file objects
 * @param {Number} maxFileSize - Maximum file size in MB (default: 50)
 * @param {Array} acceptedTypes - Accepted file types (default: ['image/*', 'video/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
 * @param {Object} uploadStatus - Object with file names as keys and status as values (e.g., { "file.jpg": "uploading" })
 * @param {Object} uploadProgress - Object with file names as keys and progress percentage as values (e.g., { "file.jpg": 50 })
 */
const Uploader = ({
  onFilesSelected,
  maxFileSize = 50,

  acceptedTypes = [
    "image/*",
    "video/*",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],

  uploadStatus = {},
  uploadProgress = {},
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  /**
   * Get file type category (image, video, document)
   */
  const getFileType = (file) => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    return "document";
  };

  /**
   * Get file icon based on type
   */
  const getFileIcon = (type, size = 48) => {
    const iconSize = { fontSize: size };
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

  /**
   * Validate file
   */
  const validateFile = (file) => {
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
      toast.error(
        `File "${file.name}" exceeds maximum size of ${maxFileSize}MB`
      );
      return false;
    }

    // Check file type
    const isAccepted = acceptedTypes.some((type) => {
      if (type.endsWith("/*")) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });

    if (!isAccepted) {
      toast.error(`File type "${file.type}" is not supported`);
      return false;
    }

    return true;
  };

  /**
   * Process files and extract information
   */
  const processFiles = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(validateFile);

    if (validFiles.length === 0) {
      return;
    }

    const processedFiles = validFiles.map((file) => {
      const fileType = getFileType(file);
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);

      // Create file object with all required information
      return {
        file, // Original File object
        name: file.name,
        size: file.size,
        sizeMB: parseFloat(fileSizeMB),
        type: file.type,
        category: fileType,
        lastModified: file.lastModified,
        // Additional metadata for server
        metadata: {
          filename: file.name,
          mimeType: file.type,
          size: file.size,
          category: fileType,
          extension: file.name.split(".").pop().toLowerCase(),
        },
        // Preview URL for images/videos
        preview: fileType === "image" || fileType === "video" 
          ? URL.createObjectURL(file) 
          : null,
      };
    });

    setSelectedFiles((prev) => [...prev, ...processedFiles]);
    
    // Call callback with processed files
    if (onFilesSelected) {
      onFilesSelected(processedFiles);
    }

    toast.success(`Added ${processedFiles.length} file(s) successfully`);
  };

  /**
   * Handle file input change
   */
  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    // Reset input to allow selecting same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /**
   * Handle drag over
   */
  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  /**
   * Handle drag leave
   */
  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  /**
   * Handle drop
   */
  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);

      const files = event.dataTransfer.files;
      if (files && files.length > 0) {
        processFiles(files);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /**
   * Handle select files button click
   */
  const handleSelectFiles = () => {
    fileInputRef.current?.click();
  };

  /**
   * Remove file from selection
   */
  const handleRemoveFile = (index) => {
    const fileToRemove = selectedFiles[index];
    
    // Revoke preview URL to free memory
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);

    // Notify parent of updated files
    if (onFilesSelected) {
      onFilesSelected(updatedFiles);
    }

    toast.info(`Removed ${fileToRemove.name}`);
  };

  /**
   * Clear all files
   */
  const handleClearAll = () => {
    // Revoke all preview URLs
    selectedFiles.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });

    setSelectedFiles([]);
    if (onFilesSelected) {
      onFilesSelected([]);
    }
    toast.info("Cleared all files");
  };

  return (
    <Box sx={{ width: "100%", mb: 4 }}>
      {/* Title Section */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            color: "#e9d5ff",
            fontWeight: "bold",
            mb: 1,
          }}
        >
          Upload Media
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "rgba(255, 255, 255, 0.8)",
          }}
        >
          Upload images, videos, or documents for AI analysis
        </Typography>
      </Box>

      {/* Upload Area */}
      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleSelectFiles}
        sx={{
          border: `2px dashed ${isDragging ? "#a855f7" : "rgba(255, 255, 255, 0.3)"}`,
          borderRadius: "16px",
          backgroundColor: "rgba(107, 52, 146, 0.2)",
          padding: "48px 24px",
          textAlign: "center",
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: "rgba(107, 52, 146, 0.3)",
            borderColor: "rgba(255, 255, 255, 0.5)",
          },
        }}
      >
        {/* File Type Icons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 4,
            mb: 3,
          }}
        >
          <ImageIcon sx={{ fontSize: 48, color: "#a855f7" }} />
          <VideocamIcon sx={{ fontSize: 48, color: "#ec4899" }} />
          <DescriptionIcon sx={{ fontSize: 48, color: "#3b82f6" }} />
        </Box>

        {/* Instructions */}
        <Typography
          variant="h6"
          sx={{
            color: "white",
            fontWeight: "bold",
            mb: 1,
          }}
        >
          Drop files here or click to upload
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "rgba(255, 255, 255, 0.7)",
            mb: 3,
          }}
        >
          Support for images, videos, and documents
        </Typography>

        {/* Select Files Button */}
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={(e) => {
            e.stopPropagation();
            handleSelectFiles();
          }}
          sx={{
            background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
            color: "white",
            padding: "12px 32px",
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: "bold",
            "&:hover": {
              background: "linear-gradient(135deg, #9333ea 0%, #db2777 100%)",
            },
          }}
        >
          Select Files
        </Button>

        {/* File Size Info */}
        <Typography
          variant="caption"
          sx={{
            color: "rgba(255, 255, 255, 0.5)",
            display: "block",
            mt: 2,
          }}
        >
          Maximum file size: {maxFileSize}MB per file
        </Typography>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </Box>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "white",
                fontWeight: "bold",
              }}
            >
              Selected Files ({selectedFiles.length})
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={handleClearAll}
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                borderColor: "rgba(255, 255, 255, 0.3)",
                "&:hover": {
                  borderColor: "rgba(255, 255, 255, 0.5)",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Clear All
            </Button>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 2,
            }}
          >
            {selectedFiles.map((fileInfo, index) => (
              <Box
                key={`${fileInfo.name}-${index}`}
                sx={{
                  backgroundColor: "rgba(107, 52, 146, 0.3)",
                  borderRadius: "12px",
                  padding: 2,
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  position: "relative",
                }}
              >
                {/* Remove Button */}
                <IconButton
                  size="small"
                  onClick={() => handleRemoveFile(index)}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    color: "rgba(255, 255, 255, 0.8)",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 0, 0, 0.3)",
                    },
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>

                {/* File Preview/Icon */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  {fileInfo.preview && fileInfo.category === "image" ? (
                    <img
                      src={fileInfo.preview}
                      alt={fileInfo.name}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "120px",
                        borderRadius: "8px",
                      }}
                    />
                  ) : (
                    getFileIcon(fileInfo.category)
                  )}
                </Box>

                {/* File Info */}
                <Typography
                  variant="body2"
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    mb: 0.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={fileInfo.name}
                >
                  {fileInfo.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  {fileInfo.sizeMB} MB • {fileInfo.category}
                </Typography>

                {/* Upload Progress (if uploading) */}
                {uploadProgress[fileInfo.name] !== undefined && (
                  <LinearProgress
                    variant="determinate"
                    value={uploadProgress[fileInfo.name]}
                    sx={{
                      mt: 1,
                      borderRadius: "4px",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#a855f7",
                      },
                    }}
                  />
                )}
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Upload Status Section - Shows only when files are uploading */}
      {Object.keys(uploadStatus).length > 0 && (
        <Box
          sx={{
            mt: 4,
            backgroundColor: "rgba(107, 52, 146, 0.3)",
            borderRadius: "16px",
            padding: 3,
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "white",
              fontWeight: "bold",
              mb: 2,
            }}
          >
            Upload Status
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {selectedFiles
              .filter((fileInfo) => uploadStatus[fileInfo.name])
              .map((fileInfo, index) => {
                const status = uploadStatus[fileInfo.name];
                const progress = uploadProgress[fileInfo.name] || 0;

                return (
                  <Box
                    key={`upload-${fileInfo.name}-${index}`}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      padding: 2,
                      backgroundColor: "rgba(107, 52, 146, 0.2)",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    {/* File Icon */}
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {getFileIcon(fileInfo.category, 32)}
                    </Box>

                    {/* File Name */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "white",
                          fontWeight: "medium",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={fileInfo.name}
                      >
                        {fileInfo.name}
                      </Typography>
                    </Box>

                    {/* Upload Status Badge */}
                    <Chip
                      label={
                        status === "uploading"
                          ? "Uploading..."
                          : status === "success"
                          ? "Uploaded"
                          : status === "error"
                          ? "Failed"
                          : status
                      }
                      sx={{
                        backgroundColor:
                          status === "uploading"
                            ? "rgba(168, 85, 247, 0.3)"
                            : status === "success"
                            ? "rgba(34, 197, 94, 0.3)"
                            : status === "error"
                            ? "rgba(239, 68, 68, 0.3)"
                            : "rgba(168, 85, 247, 0.3)",
                        color: "white",
                        fontWeight: "medium",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                      }}
                    />

                    {/* Progress Bar */}
                    {status === "uploading" && (
                      <Box sx={{ width: "100px" }}>
                        <LinearProgress
                          variant={
                            progress > 0 ? "determinate" : "indeterminate"
                          }
                          value={progress}
                          sx={{
                            height: 6,
                            borderRadius: "3px",
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: "#a855f7",
                            },
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                );
              })}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Uploader;

