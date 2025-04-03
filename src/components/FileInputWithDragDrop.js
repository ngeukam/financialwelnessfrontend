import React, { useCallback, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  IconButton,
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText,
  Avatar,
  useTheme
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { useController, useFormContext } from 'react-hook-form';
import {
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon,
  Delete as DeleteIcon,
  InsertDriveFile as InsertDriveFileIcon,
  Image as ImageIcon
} from '@mui/icons-material';

const FileInputWithDragDrop = ({ field, control }) => {
  const theme = useTheme();
  const {
    field: { onChange, value: formFiles = [] },
    fieldState: { error }
  } = useController({
    name: field.name,
    control,
    rules: { 
      required: field.required,
      validate: {
        maxFiles: (files) => !field.maxFiles || files.length <= field.maxFiles || 
          `Maximum ${field.maxFiles} files allowed`,
        maxSize: (files) => !field.maxSize || files.every(file => file.size <= field.maxSize) ||
          `File size should not exceed ${field.maxSize / (1024 * 1024)}MB`
      }
    }
  });

  const onDrop = useCallback((acceptedFiles) => {
    // Filter out duplicates by name and size
    const newFiles = acceptedFiles.filter(newFile => 
      !formFiles.some(existingFile => 
        existingFile.name === newFile.name && 
        existingFile.size === newFile.size
      )
    );

    const filesWithPreview = newFiles.map(file => 
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );
    
    const updatedFiles = field.multiple ? [...formFiles, ...filesWithPreview] : filesWithPreview;
    onChange(updatedFiles);
  }, [onChange, formFiles, field.multiple]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: field.accept || {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf'],
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxSize: field.maxSize || 10 * 1024 * 1024,
    multiple: field.multiple !== false,
    noClick: true // Important for custom button
  });

  const handleFileInputChange = (event) => {
    const files = Array.from(event.target.files);
    onDrop(files);
    // Reset the input value to allow selecting the same file again
    event.target.value = null;
  };

  const handleRemoveFile = (index) => {
    // Revoke the object URL before removing
    if (formFiles[index].preview) {
      URL.revokeObjectURL(formFiles[index].preview);
    }
    const updatedFiles = formFiles.filter((_, i) => i !== index);
    onChange(updatedFiles);
  };

  useEffect(() => {
    return () => {
      formFiles.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, [formFiles]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Dropzone Area */}
      <Box
        {...getRootProps()}
        sx={{
          border: `2px dashed ${error ? theme.palette.error.main : 
                   isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
          borderRadius: 1,
          p: 4,
          textAlign: 'center',
          backgroundColor: isDragActive ? theme.palette.action.hover : theme.palette.background.paper,
          cursor: 'pointer',
          '&:hover': {
            borderColor: theme.palette.primary.main
          }
        }}
      >
        <input 
          {...getInputProps()} 
          id={`file-input-${field.name}`} 
          onChange={handleFileInputChange}
        />
        <CloudUploadIcon 
          fontSize="large" 
          color={isDragActive ? 'primary' : 'disabled'} 
          sx={{ mb: 1 }} 
        />
        <Typography variant="h6" gutterBottom>
          {isDragActive ? 'Drop files here' : 'Drag and drop files here'}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {field.description || 'Supported formats: JPG, PNG, PDF, CSV, JSON, XLS, XLSX'}
        </Typography>
        <Button
          variant="contained"
          component="label"
          htmlFor={`file-input-${field.name}`}
          startIcon={<DescriptionIcon />}
          sx={{ mt: 1 }}
        >
          Browse Files
        </Button>
      </Box>

      {/* File Previews */}
      {formFiles.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Selected Files ({formFiles.length})
          </Typography>
          <List dense>
            {formFiles.map((file, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton 
                    edge="end" 
                    onClick={() => handleRemoveFile(index)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    {file.type?.startsWith('image/') ? <ImageIcon /> : <InsertDriveFileIcon />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={file.name}
                  secondary={`${(file.size / 1024).toFixed(2)} KB`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Error Display */}
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error.message}
        </Typography>
      )}
    </Box>
  );
};

export default FileInputWithDragDrop;