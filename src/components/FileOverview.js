import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    CircularProgress,
    Divider,
    Chip,
    useTheme,
    Alert,
    Button,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Badge,
    Tabs,
    Tab,
    IconButton,
    Paper,
} from '@mui/material';
import {
    InsertDriveFile as FileIcon,
    PictureAsPdf as PdfIcon,
    GridOn as ExcelIcon,
    TableChart as CsvIcon,
    CheckCircle as ValidationIcon,
    Error as ErrorIcon,
    Warning as WarningIcon,
    Info as InfoIcon,
    CloudDownload as DownloadIcon,
    BarChart as StatsIcon,
    Numbers as NumericIcon,
    TextFields as TextIcon,
    Event as DateIcon,
    Category as CategoryIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import useApi from '../hooks/APIHandler';
// import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';


const FileOverview = ({ selectedFile, onRefresh }) => {
    const [stats, setStats] = useState(null);
    const [sampleData, setSampleData] = useState({ file: {}, sample_data: [], text_sample: '' });
    const [tabValue, setTabValue] = useState(0);
    const theme = useTheme();
    const { callApi, loading, error } = useApi();
    useEffect(() => {
        const fetchFileStats = async () => {
            if (!selectedFile) return;
            const [statsResponse, sampleResponse] = await Promise.all([
                callApi({ url: `datamanagement/files/${selectedFile.id}/stats/` }),
                callApi({ url: `datamanagement/files/${selectedFile.id}/sample/` })
            ]);
            setStats(statsResponse.data.analysis);
            setSampleData(sampleResponse.data);
        };

        fetchFileStats();
    }, [selectedFile]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleRefresh = () => {
        onRefresh && onRefresh();
    };

    const getFileIcon = () => {
        switch (selectedFile?.type) {
            case 'pdf': return <PdfIcon fontSize="large" color="error" />;
            case 'xlsx':
            case 'xls': return <ExcelIcon fontSize="large" color="success" />;
            case 'csv': return <CsvIcon fontSize="large" color="primary" />;
            default: return <FileIcon fontSize="large" />;
        }
    };

    if (!selectedFile) {
        return null;
    }
    // Add this function to your component
    const downloadImage = async (format = 'png') => {
        try {          
          // Get the tab content element
          const element = document.getElementById('tab-content');
          if (!element) return;
      
          // Special handling for DataGrid if it's the current tab
          if (tabValue === 1) {
            const gridElement = element.querySelector('.MuiDataGrid-root');
            if (gridElement) {
              // Temporarily adjust styles for full capture
              gridElement.style.height = 'auto';
              gridElement.querySelector('.MuiDataGrid-virtualScroller')?.style.setProperty('overflow', 'visible');
            }
          }
      
          // Capture the element
          const canvas = await html2canvas(element, {
            scale: 2, // Higher quality
            useCORS: true, // For external resources
            allowTaint: true,
            scrollY: -window.scrollY,
            windowHeight: element.scrollHeight
          });
      
          // Reset DataGrid styles if modified
          if (tabValue === 1) {
            const gridElement = element.querySelector('.MuiDataGrid-root');
            if (gridElement) {
              gridElement.style.height = '500px';
              gridElement.querySelector('.MuiDataGrid-virtualScroller')?.style.setProperty('overflow', 'auto');
            }
          }
      
          // Create download link
          const link = document.createElement('a');
          link.download = `${selectedFile.processing_option_display}_${
            ['Overview', 'DataSample', 'QualityReport'][tabValue]
          }.${format}`;
          
          if (format === 'png') {
            link.href = canvas.toDataURL('image/png');
          } else {
            link.href = canvas.toDataURL('image/jpeg', 0.9); // 0.9 = JPEG quality
          }
          
          link.click();
        } catch (error) {
          console.error('Error generating image:', error);
        };
    };

    if (loading) {
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
                    Error loading file details: {error}
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header with refresh button */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" alignItems="center">
                    {getFileIcon()}
                    <Box sx={{ ml: 2 }}>
                        <Typography variant="h5">{selectedFile.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {selectedFile.processing_option_display} • Uploaded: {new Date(selectedFile.uploaded_at).toLocaleString()}
                        </Typography>
                    </Box>
                </Box>
                <Box>
                    <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={() => downloadImage('png')}
                        sx={{ mr: 1 }}
                    >
                        Download
                    </Button>

                    <IconButton onClick={handleRefresh} disabled={loading}>
                        <RefreshIcon />
                    </IconButton>
                </Box>
            </Box>

            {/* Tabs */}
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
                <Tab label="Overview" />
                <Tab label="Data Sample" />
                <Tab label="Quality Report" />
            </Tabs>

            {/* Tab content */}
            <div id="tab-content">

                {tabValue === 0 && (
                    <Grid container spacing={3}>
                        {/* Summary cards */}
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Records
                                    </Typography>
                                    <Typography variant="h4">
                                        {stats?.record_count?.toLocaleString() || 'N/A'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Columns
                                    </Typography>
                                    <Typography variant="h4">
                                        {stats?.column_count?.toLocaleString() || 'N/A'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Data Quality
                                        </Typography>
                                        <Badge
                                            badgeContent={stats?.issues_count || 0}
                                            color={stats?.validation_score > 80 ? 'success' : stats?.validation_score > 50 ? 'warning' : 'error'}
                                            sx={{ mr: 1 }}
                                        >
                                            <ValidationIcon
                                                color={stats?.validation_score > 80 ? 'success' : stats?.validation_score > 50 ? 'warning' : 'error'}
                                            />
                                        </Badge>
                                    </Box>
                                    <Typography variant="h4">
                                        {stats?.validation_score || 0}%
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Column statistics */}
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Column Statistics
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Grid container spacing={2}>
                                        {stats?.columns?.map((column, index) => (
                                            <Grid item xs={12} sm={6} md={4} key={index}>
                                                <Card variant="outlined">
                                                    <CardContent>
                                                        <Box display="flex" alignItems="center" mb={1}>
                                                            {(column.type === 'int64' || column.type === 'float64') ? <NumericIcon color="primary" /> :
                                                                column.type === 'string' ? <TextIcon color="secondary" /> :
                                                                    column.type === 'date' ? <DateIcon color="action" /> :
                                                                        <CategoryIcon color="disabled" />}
                                                            <Typography variant="subtitle1" sx={{ ml: 1 }}>
                                                                {column.name}
                                                            </Typography>
                                                        </Box>
                                                        <Divider sx={{ my: 1 }} />
                                                        <Box>
                                                            <Typography variant="body2" color="text.secondary">
                                                                <strong>Type:</strong> {column.type}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                <strong>Unique:</strong> {column.unique_values}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                <strong>Missing:</strong>
                                                                {column.empty_values}{" "}
                                                                ({(column.empty_values / stats.record_count * 100).toFixed(1)}%)
                                                            </Typography>
                                                            {(column.type === 'int64' || column.type === 'float64') && (
                                                                <>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        <strong>Min:</strong> {column.min?.toLocaleString('fr-FR')}
                                                                    </Typography>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        <strong>Max:</strong> {column.max?.toLocaleString('fr-FR')}
                                                                    </Typography>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        <strong>Sum:</strong> {column.sum?.toLocaleString('fr-FR')}
                                                                    </Typography>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        <strong>Avg:</strong> {column.mean?.toLocaleString('fr-FR')}
                                                                    </Typography>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        <strong>Distribution:</strong> {column.distribution}
                                                                    </Typography>
                                                                </>
                                                            )}
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}

                {tabValue === 1 && (
                    <Card>
                        <CardContent>
                            {/* <Typography variant="h6" gutterBottom>
                            {sampleData.file?.file_type === 'pdf' ? 'Extracted Text' : 'Data Sample'} - {sampleData.file?.processing_option_display}
                        </Typography> */}

                            <Divider sx={{ mb: 2 }} />
                            {sampleData.sample_data.tables?.length > 0 ? (
                                < Box sx={{ height: 500 }}>
                                    <DataGrid
                                        rows={sampleData.sample_data.tables[0].sample_rows.map((row, index) => ({ ...row, id: index }))}
                                        columns={(Array.isArray(sampleData.sample_data.tables[0].headers || {}) ? (sampleData.sample_data.tables[0].headers) : Object.keys(sampleData.sample_data.tables[0].headers)).map((col) => ({
                                            field: col,
                                            headerName: col,
                                            width: 150,
                                            renderCell: (params) => (
                                                <Typography variant="body2" noWrap>
                                                    {params.value}
                                                </Typography>
                                            )
                                        }))}
                                        pageSize={10}
                                        rowsPerPageOptions={[10]}
                                        disableSelectionOnClick
                                    />
                                </Box>
                            ) : (
                                <Alert severity="info">
                                    No sample data available
                                </Alert>
                            )}

                        </CardContent>
                    </Card>
                )
                }

                {
                    tabValue === 2 && (
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Quality Report
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                {stats?.issues?.length > 0 ? (
                                    <List dense sx={{ width: '100%' }}>
                                        {stats.issues.map((issue, index) => (
                                            <ListItem key={index}>
                                                <ListItemAvatar>
                                                    <Avatar sx={{
                                                        bgcolor: issue.severity === 'high' ? theme.palette.error.light :
                                                            issue.severity === 'medium' ? theme.palette.warning.light :
                                                                theme.palette.info.light
                                                    }}>
                                                        {issue.severity === 'high' ? <ErrorIcon /> :
                                                            issue.severity === 'medium' ? <WarningIcon /> : <InfoIcon />}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={issue.type}
                                                    secondary={issue.message}
                                                    secondaryTypographyProps={{ color: 'text.secondary' }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Alert severity="success">
                                        No significant data quality issues detected
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>
                    )
                }
            </div>

        </Box >
    );
};

export default FileOverview;