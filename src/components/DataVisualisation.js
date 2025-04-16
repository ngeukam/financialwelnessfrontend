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
  TextField,
  ButtonGroup
} from '@mui/material';
import useApi from '../hooks/APIHandler';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { CloudDownload as DownloadIcon } from '@mui/icons-material'

const DataVisualisation = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [operation, setOperation] = useState('value_counts');
  const [parameters, setParameters] = useState({});
  const { callApi } = useApi();
  const [chartType, setChartType] = useState('bar');
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
    // describe: {
    //   name: 'Basic Statistics',
    //   parameters: [],
    //   description: 'Show descriptive statistics for all numeric columns'
    // },
    // correlation: {
    //   name: 'Correlation Matrix',
    //   parameters: [],
    //   description: 'Calculate pairwise correlations between numeric columns'
    // },
    value_counts: {
      name: 'Value Counts',
      parameters: [{ name: 'column', type: 'column' }],
      description: 'Count frequency of unique values in a column'
    },
    time_series: {
      name: 'Time Series Analysis',
      parameters: [
        { name: 'date_column', type: 'column', required: true },
        { name: 'value_column', type: 'column', required: true },
        { name: 'frequency', type: 'select', options: ['D', 'W', 'ME', 'Q', 'Y'], default: 'D' },
        { name: 'agg_function', type: 'select', options: ['sum', 'mean', 'median', 'min', 'max'], default: 'sum' }
      ],
      description: 'Analyze trends and patterns over time'
    },
    // correlation_extreme: {
    //   name: 'Extreme Correlations',
    //   parameters: [
    //     { name: 'threshold', type: 'number', default: 0.8, min: 0, max: 1, step: 0.05 },
    //     { name: 'direction', type: 'select', options: ['positive', 'negative', 'both'], default: 'both' }
    //   ],
    //   description: 'Find strongly correlated feature pairs above threshold'
    // },
    // pattern_detect: {
    //   name: 'Pattern Detection',
    //   parameters: [
    //     { name: 'target_column', type: 'column', required: true },
    //     { name: 'pattern_type', type: 'select', options: ['seasonal', 'trend', 'outlier', 'change_point'], default: 'seasonal' },
    //     { name: 'sensitivity', type: 'number', default: 0.7, min: 0, max: 1, step: 0.1 }
    //   ],
    //   description: 'Identify patterns and anomalies in data'
    // },
    nested_aggregate: {
      name: 'Nested Aggregation',
      parameters: [
        { name: 'group_by', type: 'multi-column', required: true },
        { name: 'agg_columns', type: 'multi-column', required: true },
        {
          name: 'agg_functions', type: 'multi-select',
          options: ['sum', 'mean', 'count', 'min', 'max', 'median', 'std'],
          default: ['mean']
        }
      ],
      description: 'Aggregate data by multiple grouping levels'
    },
    // linear_regression: {
    //   name: 'Linear Regression',
    //   parameters: [
    //     { name: 'x_column', type: 'column' },
    //     { name: 'y_column', type: 'column' }
    //   ],
    //   description: 'Perform simple linear regression analysis'
    // },
    // pca: {
    //   name: 'PCA',
    //   parameters: [
    //     { name: 'n_components', type: 'number', default: 2 },
    //     { name: 'features', type: 'multi-column' }
    //   ],
    //   description: 'Principal Component Analysis for dimensionality reduction'
    // },
    // cluster: {
    //   name: 'Clustering',
    //   parameters: [
    //     { name: 'n_clusters', type: 'number', default: 3 },
    //     { name: 'features', type: 'multi-column' }
    //   ],
    //   description: 'Group similar data points using clustering algorithms'
    // }
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
    } finally {
      setLoading(false);
    }
  };
  // Add this function to your component
  // const downloadPDF = async () => {
  //   // Get the tab content element
  //   const element = document.getElementById('tab-content');

  //   // Use html2canvas to capture the content
  //   const canvas = await html2canvas(element, {
  //     scale: 2, // Higher quality
  //     useCORS: true, // For external resources
  //     allowTaint: true,
  //     scrollY: -window.scrollY // Fix for scrolling issues
  //   });

  //   // Create PDF
  //   const pdf = new jsPDF('p', 'mm', 'a4');
  //   const imgData = canvas.toDataURL('image/png');
  //   const imgWidth = 210; // A4 width in mm
  //   const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //   pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  //   pdf.save(`${selectedFile.processing_option_display}_${'Visualisation'}.pdf`);
  // };

  // Render parameter inputs

  const downloadImage = async (format = 'png') => {
    try {
      // Get the tab content element
      const element = document.getElementById('tab-content');
      if (!element) return;
      // Capture the element
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true, // For external resources
        allowTaint: true,
        scrollY: -window.scrollY,
        windowHeight: element.scrollHeight
      });

      // Reset DataGrid styles if modified
      const gridElement = element.querySelector('.MuiDataGrid-root');
      if (gridElement) {
        gridElement.style.height = '500px';
        gridElement.querySelector('.MuiDataGrid-virtualScroller')?.style.setProperty('overflow', 'auto');
      }

      // Create download link
      const link = document.createElement('a');
      link.download = `${selectedFile.processing_option_display}_${['DataVisualisation']
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
              {param.options ? (
                param.options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))
              ) : (
                columns.map((col) => (
                  <MenuItem key={col} value={col}>{col}</MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        );
      case 'multi-select':
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
              {param.options ? (
                param.options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))
              ) : (
                columns.map((col) => (
                  <MenuItem key={col} value={col}>{col}</MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        );

      case 'select':
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
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,  // Limit dropdown height
                  },
                }
              }}
            >
              {param.options ? (
                param.options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))
              ) : (
                columns.map((col) => (
                  <MenuItem key={col} value={col}>{col}</MenuItem>
                ))
              )}
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
    if (!analysisResult) return null;

    const result = analysisResult;

    if (operation === 'value_counts') {
      const data = Object.entries(result.counts).map(([value, count], index) => ({
        id: index,
        value,
        count
      })).sort((a, b) => b.count - a.count);

      return (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Value Counts for {result.column}
          </Typography>

          {/* Chart type selector */}
          <Box sx={{ mb: 2 }}>
            <ButtonGroup variant="contained">
              <Button
                onClick={() => setChartType('bar')}
                color={chartType === 'bar' ? 'primary' : 'inherit'}
              >
                Bar Chart
              </Button>
              <Button
                onClick={() => setChartType('pie')}
                color={chartType === 'pie' ? 'primary' : 'inherit'}
              >
                Pie Chart
              </Button>
            </ButtonGroup>
          </Box>

          {/* Conditional chart rendering */}
          <div id="tab-content">
            <Box sx={{ height: 400, mt: 1 }}>
              {chartType === 'bar' ? (
                <BarChart
                  dataset={data}
                  yAxis={[{
                    scaleType: 'band',
                    dataKey: 'value',
                    label: result.column,
                    tickLabelStyle: {
                      angle: 0,
                      textAnchor: 'start',
                      fontSize: 12
                    }
                  }]}
                  series={[{
                    dataKey: 'count',
                    label: 'Count',
                    color: theme.palette.primary.main
                  }]}
                  layout="horizontal"
                  margin={{ left: 100 }}
                />
              ) : (
                <PieChart
                  series={[{
                    data: data.map(item => ({
                      id: item.id,
                      value: item.count,
                      label: `${item.value} (${((item.count / data.reduce((total, curr) => total + curr.count, 0)) * 100).toFixed(1)}%)`
                    })),
                    innerRadius: 30,
                    outerRadius: 100,
                    paddingAngle: 5,
                    cornerRadius: 5,
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                  }]}
                  slotProps={{
                    legend: {
                      hidden: false,
                      direction: 'row', // Horizontal legend
                      position: { vertical: 'bottom', horizontal: 'middle' }, // Position below chart
                      itemMarkWidth: 10, // Width of the color indicator
                      itemMarkHeight: 10, // Height of the color indicator
                      labelStyle: { fontSize: 12 }, // Legend text style
                      markGap: 5, // Gap between mark and label
                      itemGap: 20, // Gap between legend items
                      padding: { top: 20 }, // Add space above legend
                    },
                  }}
                  margin={{ top: 0, bottom: 80, left: 0, right: 0 }} // Add bottom margin for legend
                  width={600}
                  height={300}
                />)}
            </Box>
          </div>

          {/* Raw data table (unchanged) */}
          <Box sx={{ mt: 1 }}>
            <Typography variant="h6" gutterBottom>Raw Data</Typography>
            <DataGrid
              rows={data}
              columns={[
                {
                  field: 'value',
                  headerName: result.column,
                  width: 300,
                  renderCell: (params) => (
                    <div style={{ whiteSpace: 'normal', lineHeight: 'normal' }}>
                      {params.value}
                    </div>
                  )
                },
                {
                  field: 'count',
                  headerName: 'Count',
                  width: 100
                }
              ]}
              autoHeight
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 },
                },
              }}
            />
          </Box>
        </Box>
      );
    }

    if (result.plot) {
      return (

        <Box sx={{ mt: 2 }}>
          <div id="tab-content">
            <img
              src={`data:image/png;base64,${result.plot}`}
              alt="Analysis result"
              style={{ maxWidth: '100%' }}
            />
          </div>
          <pre style={{ overflowX: 'auto', padding: '1rem' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </Box>
      );
    }

    return (
      <div id="tab-content">
        <pre style={{ overflowX: 'auto', padding: '1rem' }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
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
                  setAnalysisResult(null);
                }}
                label="Operation"
                disabled={!selectedFile}
              >
                {Object.entries(operations).map(([key, op]) => (
                  <MenuItem key={key} value={key}>
                    <Box>
                      <div>{op.name}</div>
                      <i>{op.description}</i>
                    </Box>
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
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" gutterBottom>
                Analysis Results
              </Typography>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => downloadImage('png')}
                sx={{ mr: 1 }}
              >
                Download
              </Button>
            </Box>


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