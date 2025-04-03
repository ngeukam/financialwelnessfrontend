import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  TextField
} from '@mui/material';
import useApi from '../hooks/APIHandler';
import { BarChart } from '@mui/x-charts/BarChart';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';

const DataVisualisation = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [operation, setOperation] = useState('describe');
  const [parameters, setParameters] = useState({});
  const { callApi } = useApi();
  const theme = useTheme();
  // Fetch files on component mount
  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      try {
        const response = await callApi({ url: 'datamanagement/data-files/' });
        setFiles(response.data);
      } catch (error) {
        console.error('Failed to fetch files:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  // Available operations with their parameters
  const operations = {
    describe: { name: 'Basic Statistics', parameters: [] },
    correlation: { name: 'Correlation Matrix', parameters: [] },
    value_counts: {
      name: 'Value Counts',
      parameters: [{ name: 'column', type: 'column' }]
    },
    linear_regression: {
      name: 'Linear Regression',
      parameters: [
        { name: 'x_column', type: 'column' },
        { name: 'y_column', type: 'column' }
      ]
    },
    pca: {
      name: 'PCA',
      parameters: [
        { name: 'n_components', type: 'number', default: 2 },
        { name: 'features', type: 'multi-column' }
      ]
    },
    cluster: {
      name: 'Clustering',
      parameters: [
        { name: 'n_clusters', type: 'number', default: 3 },
        { name: 'features', type: 'multi-column' }
      ]
    }
  };

  // Get available columns from sample data (if available)
  const columns = selectedFile?.sample_data?.[0]
    ? Object.keys(selectedFile.sample_data[0])
    : [];
  // Perform analysis
  const handleAnalyze = async () => {
    if (!selectedFile?.id) return;

    setLoading(true);
    try {
      const response = await callApi({
        url: `datamanagement/data-analysis/${selectedFile.id}/`,
        method: 'POST',
        body: {
          operation,
          parameters
        }
      });
      setAnalysisResult(response.data?.analysis);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Render parameter inputs
  const renderParameterInput = (param) => {
    switch (param.type) {
      case 'column':
        return (
          <FormControl fullWidth size="small" sx={{ mt: 1 }}>
            <InputLabel>{param.name}</InputLabel>
            <Select
              value={parameters[param.name] || ''}
              onChange={(e) => setParameters({
                ...parameters,
                [param.name]: e.target.value
              })}
              label={param.name}
            >
              {columns.map((col) => (
                <MenuItem key={col} value={col}>{col}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'multi-column':
        return (
          <FormControl fullWidth size="small" sx={{ mt: 1 }}>
            <InputLabel>{param.name}</InputLabel>
            <Select
              multiple
              value={parameters[param.name] || []}
              onChange={(e) => setParameters({
                ...parameters,
                [param.name]: e.target.value
              })}
              label={param.name}
            >
              {columns.map((col) => (
                <MenuItem key={col} value={col}>{col}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'number':
        return (
          <TextField
            fullWidth
            size="small"
            type="number"
            label={param.name}
            value={parameters[param.name] || param.default || ''}
            onChange={(e) => setParameters({
              ...parameters,
              [param.name]: Number(e.target.value)
            })}
            sx={{ mt: 1 }}
          />
        );

      default:
        return null;
    }
  };

  // Render analysis results
  const renderAnalysisResult = () => {
    if (!analysisResult?.result) return null;

    const { result } = analysisResult;
    if (operation === 'value_counts') {
      const data = Object.entries(result).map(([value, count], index) => ({
        id: index,  // Add unique ID
        value,
        count
      })).sort((a, b) => b.count - a.count);
      return (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
          Value Counts for {parameters.column}
        </Typography>

          {/* Bar chart for value counts */}
          <Box sx={{ height: 400, mt: 2 }}>
            <BarChart
              dataset={data}
              xAxis={[{ scaleType: 'band', dataKey: 'value' }]}
              yAxis={[{ scaleType: 'linear', dataKey: 'count' }]}
              series={[{ dataKey: 'count', label: 'Count' }]}
              layout="vertical"
              colors={[
                theme.palette.primary.main,
                // theme.palette.secondary.main,
                // theme.palette.error.main,
                // theme.palette.warning.main,
                // theme.palette.success.main
              ]}

            />
          </Box>

          {/* Raw data table */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>Raw Data</Typography>
            <DataGrid
              rows={data}
              columns={[
                { field: 'value', headerName: 'Value', width: 150 },
                { field: 'count', headerName: 'Count', width: 100 }
              ]}
              autoHeight
              hideFooter
            />
          </Box>
        </Box>
      );
    }

    if (result.plot) {
      return (
        <Box sx={{ mt: 2 }}>
          <img
            src={`data:image/png;base64,${result.plot}`}
            alt="Analysis result"
            style={{ maxWidth: '100%' }}
          />
          <pre style={{ overflowX: 'auto', background: '#f5f5f5', padding: '1rem' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </Box>
      );
    }

    return (
      <pre style={{ overflowX: 'auto', background: '#f5f5f5', padding: '1rem' }}>
        {JSON.stringify(result, null, 2)}
      </pre>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              File Selection
            </Typography>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Select a file</InputLabel>
              <Select
                value={selectedFile?.id || ''}
                onChange={(e) => {
                  const file = files.find(f => f.id === e.target.value);
                  setSelectedFile(file);
                  setAnalysisResult(null);
                  setParameters({});
                }}
                label="Select a file"
                disabled={loading}
              >
                {files.map((file) => (
                  <MenuItem key={file.id} value={file.id}>
                    {file.data_name || file.file_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="h6" gutterBottom>
              Analysis Options
            </Typography>

            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel>Operation</InputLabel>
              <Select
                value={operation}
                onChange={(e) => {
                  setOperation(e.target.value);
                  setParameters({});
                }}
                label="Operation"
                disabled={!selectedFile}
              >
                {Object.entries(operations).map(([key, op]) => (
                  <MenuItem key={key} value={key}>
                    {op.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {operations[operation].parameters.map((param) => (
              <Box key={param.name} sx={{ mt: 2 }}>
                {renderParameterInput(param)}
              </Box>
            ))}

            <Button
              fullWidth
              variant="contained"
              onClick={handleAnalyze}
              disabled={loading || !selectedFile}
              sx={{ mt: 3 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Run Analysis'}
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, minHeight: '60vh' }}>
            <Typography variant="h6" gutterBottom>
              Analysis Results
            </Typography>
            {!selectedFile ? (
              <Typography color="text.secondary">
                Please select a file to analyze
              </Typography>
            ) : analysisResult ? (
              renderAnalysisResult()
            ) : (
              <Typography color="text.secondary">
                Select an operation and run analysis
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
export default DataVisualisation