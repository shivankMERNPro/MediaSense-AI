import { DataGrid } from "@mui/x-data-grid";
import { Box, IconButton, Chip, Avatar, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const MediaTable = ({
  mediaData = [],
  loading = false,
  paginationModel,
  onPaginationModelChange,
  rowCount = 0,
  anchorEl,
  selectedRow,
  onMenuOpen,
  onMenuClose,
  onEdit,
  onDelete,
  onViewDetail,
  getTypeIcon,
  getStatusColor,
}) => {
  const columns = [
    {
      field: "type",
      headerName: "Type",
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems:"center", height:"55px", width: "100%" }}>
          {getTypeIcon(params.value)}
        </Box>
      ),
    },
    {
      field: "preview",
      headerName: "Preview",
      width: 100,
      sortable: false,
      renderCell: (params) => {
        const row = params.row;
        const previewUrl =
          row.preview ||
          (row.fileUrl
            ? `${import.meta.env.VITE_API_BASE_URL}${row.fileUrl}`
            : null);
        return (
          <Avatar
            src={row.type === "image" ? previewUrl : ""}
            alt={row.filename}
            variant="rounded"
            sx={{
              width: 56,
              height: 56,
              bgcolor: "rgba(107, 52, 146, 0.3)",
              cursor: "pointer",
            }}
            onClick={() => onViewDetail && onViewDetail(row)}
          >
            {getTypeIcon(row.type)}
          </Avatar>
        );
      },
    },
    { 
      field: "filename", 
      headerName: "Filename", 
      flex: 1, 
      minWidth: 150,
      renderCell: (params) => (
        <Box
          sx={{
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" },
          }}
          onClick={() => onViewDetail && onViewDetail(params.row)}
        >
          {params.value}
        </Box>
      ),
    },
    { field: "description", headerName: "AI Description", flex: 1.5, minWidth: 200 },
    { field: "tags", headerName: "Tags", flex: 1, minWidth: 150 },
    { field: "topics", headerName: "Topics", flex: 1, minWidth: 150 },
    { field: "size", headerName: "Size", width: 100 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        const c = getStatusColor(params.value);
        return (
          <Chip
            label={params.value}
            size="small"
            sx={{
              backgroundColor: c.bg,
              color: c.color,
              fontWeight: "medium",
              textTransform: "capitalize",
              border: `1px solid ${c.color}40`,
            }}
          />
        );
      },
    },
    { field: "date", headerName: "Date", width: 120 },

    // ACTION MENU
    {
      field: "actions",
      headerName: "Actions",
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            size="small"
            onClick={(e) => onMenuOpen(e, params.row)}
            sx={{
              color: "rgba(255,255,255,0.8)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && selectedRow?.id === params.row.id}
            onClose={onMenuClose}
            PaperProps={{
              sx: {
                backgroundColor: "rgba(107, 52, 146, 0.95)",
                color: "white",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
              },
            }}
          >
            <MenuItem onClick={() => onViewDetail && onViewDetail(selectedRow)}>
              View Details
            </MenuItem>
            <MenuItem onClick={onEdit}>Edit</MenuItem>
            <MenuItem sx={{ color: "#ef4444" }} onClick={onDelete}>
              Delete
            </MenuItem>
          </Menu>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        rows={mediaData}
        columns={columns}
        loading={loading}
        rowHeight={65}
        disableRowSelectionOnClick
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={[10, 25, 50]}
        rowCount={rowCount}
        paginationMode="server"
        sx={{
          background: "linear-gradient(135deg, #693b93 0%, #2f1b4b 100%)",
          borderRadius: "20px",
          border: "1px solid #8443a8",
          color: "white",
          // padding: "6px",
        
          /* REMOVE DEFAULT LINES */
          "& .MuiDataGrid-columnSeparator": { display: "none" },
          "& .MuiDataGrid-iconButtonContainer": { display: "none" },
        
          /* HEADER */
          "& .MuiDataGrid-columnHeaders": {
            background: "transparent",
            color: "#e5e7eb",
            fontWeight: 600,
            borderBottom: "1px solid #8443a8",
          },
        
          "& .MuiDataGrid-columnHeader": {
            background: "transparent",
            color: "#e5e7eb",
            fontSize: "0.95rem",
          },
        
          /* ROW STYLING */
          "& .MuiDataGrid-row": {
            background: "transparent",
            borderBottom: "none",
          },
        
          "& .MuiDataGrid-row:last-child": {
            borderBottom: "none",
          },
        
          /* ROW HOVER EFFECT */
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
          },
        
          /* CELL TEXT COLOR */
          "& .MuiDataGrid-cell": {
            color: "white",
            fontSize: "0.95rem",
            borderBottom: "0px solid rgba(25,255,0.1)",
          },
        
          /* ACTION BUTTON COLOR */
          "& .MuiIconButton-root": {
            color: "#cfcfcf",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.15)",
            },
          },
        
          /* PAGINATION STYLING (optional) */
          "& .MuiTablePagination-root": {
            color: "white",
          },
          "& .MuiTablePagination-selectIcon": {
            color: "white",
          },
        }}        
      />
    </Box>
  );
};

export default MediaTable;
