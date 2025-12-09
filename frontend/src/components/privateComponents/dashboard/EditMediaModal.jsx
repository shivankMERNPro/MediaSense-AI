import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const EditMediaModal = ({ open, onClose, media, onSave }) => {
  const [formData, setFormData] = useState({
    filename: "",
    description: "",
    tags: "",
    topics: "",
  });

  useEffect(() => {
    if (media) {
      setFormData({
        filename: media.filename || "",
        description: media.description || "",
        tags: Array.isArray(media.tags) ? media.tags.join(", ") : media.tags || "",
        topics: Array.isArray(media.topics) ? media.topics.join(", ") : media.topics || "",
      });
    }
  }, [media]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSave = () => {
    if (media && onSave) {
      onSave({
        id: media.id,
        ...formData,
      });
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: "linear-gradient(145deg, #0f172a, #3b0764)", // slate-900 → purple-900
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0px 0px 30px rgba(0,0,0,0.5)",
          overflow: "hidden",
          backdropFilter: "blur(12px)",
        },
      }}
    >
      {/* HEADER */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "white",
          fontWeight: "bold",
          fontSize: "22px",
          padding: "10px 20px",
          background: "linear-gradient(80deg, #0f172a, #3b0764)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
        }}
      >
        Edit Media
        <IconButton
          onClick={onClose}
          sx={{
            color: "rgba(255,255,255,0.7)",
            "&:hover": {
              color: "white",
              backgroundColor: "rgba(255,255,255,0.1)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* CONTENT */}
      <DialogContent sx={{ padding: "20px", }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, marginTop: "20px" }}>
          {/* Text Inputs Same as Mocha Styling */}
          {["filename", "description", "tags", "topics"].map((field) => (
            <TextField
              key={field}
              label={
                field === "tags"
                  ? "Tags (comma-separated)"
                  : field === "topics"
                  ? "Topics (comma-separated)"
                  : field.charAt(0).toUpperCase() + field.slice(1)
              }
              value={formData[field]}
              onChange={handleChange(field)}
              fullWidth
              multiline={field === "description"}
              rows={field === "description" ? 3 : 1}
              placeholder={
                field === "tags"
                  ? "nature, landscape, sunset"
                  : field === "topics"
                  ? "photography, nature"
                  : ""
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(8px)",
                  color: "white",
                  borderRadius: "12px",
                  "& fieldset": {
                    borderColor: "rgba(255,255,255,0.1)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(168,85,247,0.4)", // purple-500
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#a855f7", // purple-500
                    boxShadow: "0 0 0 2px rgba(168,85,247,0.3)",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255,255,255,0.75)",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#c084fc",
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "rgba(255,255,255,0.5)",
                },
              }}
            />
          ))}
        </Box>
      </DialogContent>

      {/* FOOTER BUTTONS */}
      <DialogActions
        sx={{
          padding: "20px",
          borderTop: "1px solid rgba(255,255,255,0.12)",
          display: "flex",
          gap: 2,
        }}
      >
        <Button
          onClick={onClose}
          fullWidth
          sx={{
            padding: "10px 0",
            borderRadius: "10px",
            color: "white",
            backgroundColor: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.1)",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          fullWidth
          sx={{
            padding: "10px 0",
            borderRadius: "10px",
            color: "white",
            background: "linear-gradient(90deg, #9333ea, #ec4899)",
            fontWeight: "600",
            "&:hover": {
              transform: "scale(1.03)",
              boxShadow: "0px 0px 15px rgba(236, 72, 153, 0.4)",
            },
            transition: "all 0.2s",
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditMediaModal;
