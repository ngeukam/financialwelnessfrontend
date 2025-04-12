import React, { useState, useEffect } from 'react';
import { 
  Box, 
  CircularProgress, 
  Alert, 
  IconButton,
  Tooltip
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import FileOverview from './FileOverview';
import FileList from './FileListComponent';
import useApi from '../hooks/APIHandler';

const DataOverview = ({file_history_id}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const { callApi, loading, error } = useApi();

  const fetchFiles = async () => {
      const idVar= file_history_id ? file_history_id+"/" : '';
      const response = await callApi({ url: `datamanagement/files/${idVar}`, method:'GET' });
      setFiles(response.data);
      // Auto-select the first file if none is selected
      if (!selectedFile && response.data.length > 0) {
        setSelectedFile(response.data[0]);
      }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleRefresh = () => {
    file_history_id = "";
    fetchFiles();
  };

  if (loading && files.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <Alert 
          severity="error"
          action={
            <IconButton
              aria-label="refresh"
              color="inherit"
              size="small"
              onClick={handleRefresh}
            >
              <RefreshIcon fontSize="inherit" />
            </IconButton>
          }
        >
          Error loading files: {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100%', position: 'relative' }}>
      {/* Refresh button */}
      <Tooltip title="Refresh files">
        <IconButton
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            zIndex: 1,
            backgroundColor: 'background.paper',
            boxShadow: 1
          }}
          onClick={handleRefresh}
          disabled={loading}
        >
          <RefreshIcon />
        </IconButton>
      </Tooltip>

      {/* File list sidebar */}
      <Box sx={{ 
        width: 300, 
        minWidth: 300, 
        height: '100%',
        borderRight: 1,
        borderColor: 'divider'
      }}>
        <FileList 
          files={files} 
          onFileSelect={setSelectedFile}
          selectedFileId={selectedFile?.id || file_history_id}
          loading={loading}
        />
      </Box>

      {/* File overview panel */}
      <Box sx={{ 
        flex: 1, 
        height: '100%', 
        overflow: 'auto',
        position: 'relative'
      }}>
        {selectedFile ? (
          <FileOverview 
            selectedFile={selectedFile} 
            onRefresh={fetchFiles}
          />
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Alert severity="info">
              {files.length === 0 ? 'No files available' : 'Select a file to view details'}
            </Alert>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DataOverview;