import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";

/**
 * SearchForm Component - Presentational Component
 * Displays search and filter UI, receives values and handlers as props
 */
const SearchForm = ({
  searchQuery,
  typeFilter,
  selectedTags = [],
  selectedTopics = [],
  availableTags = [],
  availableTopics = [],
  onSearchChange,
  onTypeChange,
  onTagsChange,
  onTopicsChange,
  useSemanticSearch = false,
}) => {

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
          Media Library
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "rgba(255, 255, 255, 0.8)",
          }}
        >
          Search and manage your AI-analyzed media
          {useSemanticSearch && (
            <span style={{ marginLeft: 8, color: "#a855f7", fontWeight: "bold" }}>
              (Semantic Search Active)
            </span>
          )}
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
          <TextField
          fullWidth
          placeholder="Search using natural language... (e.g., 'sunset photos' or 'documents from last week')"
          value={searchQuery}
          onChange={onSearchChange}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ color: "rgba(255, 255, 255, 0.6)", mr: 1 }} />
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "rgba(107, 52, 146, 0.3)",
              borderRadius: "12px",
              color: "white",
              "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.2)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(255, 255, 255, 0.3)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "rgba(255, 255, 255, 0.5)",
              },
            },
            "& .MuiInputBase-input::placeholder": {
              color: "rgba(255, 255, 255, 0.5)",
              opacity: 1,
            },
          }}
        />
      </Box>

      {/* Filters Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FilterListIcon sx={{ color: "rgba(255, 255, 255, 0.8)" }} />
          <Typography
            variant="body1"
            sx={{
              color: "rgba(255, 255, 255, 0.8)",
              fontWeight: 500,
            }}
          >
            Filters
          </Typography>
        </Box>
      </Box>

      {/* Filter Dropdowns */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(3, 1fr)",
          },
          gap: 2,
        }}
      >
        {/* Type Filter */}
        <FormControl
          sx={{
            minWidth: "100%",
          }}
        >
          <InputLabel
            sx={{
              color: "rgba(255, 255, 255, 0.8)",
              "&.Mui-focused": {
                color: "rgba(255, 255, 255, 0.8)",
              },
            }}
          >
            Type
          </InputLabel>
          <Select
            value={typeFilter}
            onChange={onTypeChange}
            label="Type"
            sx={{
              backgroundColor: "rgba(107, 52, 146, 0.3)",
              borderRadius: "12px",
              color: "white",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.2)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.3)",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.5)",
              },
              "& .MuiSvgIcon-root": {
                color: "rgba(255, 255, 255, 0.8)",
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: "rgba(107, 52, 146, 0.95)",
                  backdropFilter: "blur(10px)",
                  "& .MuiMenuItem-root": {
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                    "&.Mui-selected": {
                      backgroundColor: "rgba(168, 85, 247, 0.3)",
                      "&:hover": {
                        backgroundColor: "rgba(168, 85, 247, 0.4)",
                      },
                    },
                  },
                },
              },
            }}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="image">Images</MenuItem>
            <MenuItem value="video">Videos</MenuItem>
            <MenuItem value="document">Documents</MenuItem>
          </Select>
        </FormControl>

        <FormControl
          sx={{
            minWidth: "100%",
          }}
        >
          <InputLabel
            sx={{
              color: "rgba(255, 255, 255, 0.8)",
              "&.Mui-focused": {
                color: "rgba(255, 255, 255, 0.8)",
              },
            }}
          >
            Tags
          </InputLabel>
          <Select
            multiple
            value={selectedTags}
            onChange={onTagsChange}
            label="Tags"
            renderValue={(selected) => selected.join(", ")}
            sx={{
              backgroundColor: "rgba(107, 52, 146, 0.3)",
              borderRadius: "12px",
              color: "white",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.2)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.3)",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.5)",
              },
              "& .MuiSvgIcon-root": {
                color: "rgba(255, 255, 255, 0.8)",
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: "rgba(107, 52, 146, 0.95)",
                  backdropFilter: "blur(10px)",
                  "& .MuiMenuItem-root": {
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                    "&.Mui-selected": {
                      backgroundColor: "rgba(168, 85, 247, 0.3)",
                      "&:hover": {
                        backgroundColor: "rgba(168, 85, 247, 0.4)",
                      },
                    },
                  },
                },
              },
            }}
          >
            {availableTags.length === 0 && (
              <MenuItem value="" disabled>
                No tags available
              </MenuItem>
            )}
            {availableTags.map((tag) => (
              <MenuItem key={tag} value={tag}>
                {tag}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          sx={{
            minWidth: "100%",
          }}
        >
          <InputLabel
            sx={{
              color: "rgba(255, 255, 255, 0.8)",
              "&.Mui-focused": {
                color: "rgba(255, 255, 255, 0.8)",
              },
            }}
          >
            Topics
          </InputLabel>
          <Select
            multiple
            value={selectedTopics}
            onChange={onTopicsChange}
            label="Topics"
            renderValue={(selected) => selected.join(", ")}
            sx={{
              backgroundColor: "rgba(107, 52, 146, 0.3)",
              borderRadius: "12px",
              color: "white",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.2)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.3)",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.5)",
              },
              "& .MuiSvgIcon-root": {
                color: "rgba(255, 255, 255, 0.8)",
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: "rgba(107, 52, 146, 0.95)",
                  backdropFilter: "blur(10px)",
                  "& .MuiMenuItem-root": {
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                    "&.Mui-selected": {
                      backgroundColor: "rgba(168, 85, 247, 0.3)",
                      "&:hover": {
                        backgroundColor: "rgba(168, 85, 247, 0.4)",
                      },
                    },
                  },
                },
              },
            }}
          >
            {availableTopics.length === 0 && (
              <MenuItem value="" disabled>
                No topics available
              </MenuItem>
            )}
            {availableTopics.map((topic) => (
              <MenuItem key={topic} value={topic}>
                {topic}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default SearchForm;

