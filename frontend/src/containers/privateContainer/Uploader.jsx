import { useState } from "react";
import { toast } from "react-toastify";
import UploaderComponent from "../../components/privateComponents/uploader/Uploader";
import { useUploadMediaMutation } from "../../features/apiSlices/dashboardApis";

/**
 * Uploader Container Component
 * Handles all business logic for file uploads
 * - File processing
 * - Server upload
 * - State management
 * - Upload status tracking
 */
const Uploader = () => {
  const [uploadStatus, setUploadStatus] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadMedia] = useUploadMediaMutation();

  /**
   * Handle files selected from Uploader component
   * Receives array of file objects with all required information
   */
  const handleFilesSelected = async (files) => {
    if (!files || files.length === 0) return;

    // Initialize upload status for all files
    const initialStatus = {};
    const initialProgress = {};
    files.forEach((fileInfo) => {
      initialStatus[fileInfo.name] = "uploading";
      initialProgress[fileInfo.name] = 0;
    });
    setUploadStatus(initialStatus);
    setUploadProgress(initialProgress);

    // Upload files to server
    await uploadFilesToServer(files);
  };

  /**
   * Upload files to server
   * Uses RTK Query mutation for file upload
   */
  const uploadFilesToServer = async (files) => {
    for (const fileInfo of files) {
      try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append("file", fileInfo.file);

        // Simulate upload progress (since RTK Query doesn't provide progress)
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            const current = prev[fileInfo.name] || 0;
            if (current < 90) {
              return {
                ...prev,
                [fileInfo.name]: Math.min(current + Math.random() * 15, 90),
              };
            }
            return prev;
          });
        }, 300);

        // Upload file using RTK Query
        const result = await uploadMedia(formData).unwrap();

        clearInterval(progressInterval);

        // Set progress to 100%
        setUploadProgress((prev) => ({
          ...prev,
          [fileInfo.name]: 100,
        }));

        // Mark as success
        setUploadStatus((prev) => ({
          ...prev,
          [fileInfo.name]: "success",
        }));

        toast.success(`Uploaded: ${fileInfo.name}`);
      } catch (error) {
        // Mark as error
        setUploadStatus((prev) => ({
          ...prev,
          [fileInfo.name]: "error",
        }));

        toast.error(`Failed to upload ${fileInfo.name}: ${error?.data?.message || error.message || "Unknown error"}`);
        console.error(`Error uploading ${fileInfo.name}:`, error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-[1450px]">
      <UploaderComponent
        onFilesSelected={handleFilesSelected}
        maxFileSize={50}
        acceptedTypes={[
          "image/*",
          "video/*",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ]}
        uploadStatus={uploadStatus}
        uploadProgress={uploadProgress}
      />
    </div>
  );
};

export default Uploader;

