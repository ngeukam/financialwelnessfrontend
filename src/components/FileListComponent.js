import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Paper, 
  Typography,
  CircularProgress,
  Skeleton,
  Box
} from '@mui/material';
import { 
  InsertDriveFile, 
  PictureAsPdf, 
  GridOn, 
  TableChart 
} from '@mui/icons-material';

const FileList = ({ files, onFileSelect, selectedFileId, loading }) => {
  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return <PictureAsPdf color="error" />;
      case 'xlsx':
      case 'xls': return <GridOn color="success" />;
      case 'csv': return <TableChart color="primary" />;
      default: return <InsertDriveFile />;
    }
  };

  if (loading && files.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        {[...Array(5)].map((_, index) => (
          <Skeleton 
            key={index} 
            variant="rectangular" 
            height={56} 
            sx={{ mb: 1, borderRadius: 1 }} 
          />
        ))}
      </Box>
    );
  }

  return (
    <Paper sx={{ height: '100%', overflow: 'auto' }}>
      <Typography variant="subtitle1" sx={{ p: 2, pb: 1 }}>
        Data Files
      </Typography>
      <List>
        {files.length > 0 ? (
          files.map((file) => (
            <ListItem key={file.id} disablePadding>
              <ListItemButton 
                onClick={() => onFileSelect(file)}
                selected={selectedFileId === file.id}
              >
                <ListItemIcon>
                  {getFileIcon(file.type)}
                </ListItemIcon>
                <ListItemText
                  primary={file.file_name}
                  secondary={file.processing_option_display+' '+new Date(file.uploaded_at).toLocaleDateString()}
                  primaryTypographyProps={{ noWrap: true }}
                  secondaryTypographyProps={{ noWrap: true }}
                />
                {loading && selectedFileId === file.id && (
                  <CircularProgress size={20} />
                )}
              </ListItemButton>
            </ListItem>
          ))
        ) : (
          <Typography variant="body2" sx={{ p: 2, color: 'text.secondary' }}>
            No files uploaded yet
          </Typography>
        )}
      </List>
    </Paper>
  );
};

export default FileList;