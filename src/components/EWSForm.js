import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Alert,
    IconButton,
    Collapse,
    Chip,
    Divider,
    Tooltip,
    Grid
} from '@mui/material';
import { 
    AddCircleOutline, 
    DeleteOutline, 
    InfoOutlined,
    ExpandMore,
    ExpandLess,
    WarningAmber,
    CheckCircleOutline
} from '@mui/icons-material';
import useApi from '../hooks/APIHandler';
import { getUser } from '../utils/Helper';

const EWSForm = () => {
    const [indicatorType, setIndicatorType] = useState('SPENDING');
    const [spendingData, setSpendingData] = useState([]);
    const [results, setResults] = useState([]);
    const [summary, setSummary] = useState(null);
    const [expandedRows, setExpandedRows] = useState([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const { loading, error, callApi } = useApi();

    useEffect(() => {
        const fetchFinancialData = async () => {
            try {
                const response = await callApi({
                    url: 'personalfinance/financial-summary/',
                    method: 'GET'
                });

                if (response.data) {
                    setSpendingData([{
                        income: response.data.total_income || 0,
                        expenses: response.data.total_expenses || 0
                    }]);
                }
            } catch (error) {
                console.error('Error fetching financial data:', error);
                setSpendingData([{ income: 0, expenses: 0 }]);
            }
            setIsInitialLoad(false);
        };

        if (isInitialLoad) {
            fetchFinancialData();
        }
    }, [isInitialLoad, callApi]);

    const handleIndicatorChange = (e) => {
        setIndicatorType(e.target.value);
        setResults([]);
        setSummary(null);
    };

    const handleSpendingChange = (index, field, value) => {
        const newData = [...spendingData];
        newData[index][field] = parseFloat(value) || 0;
        setSpendingData(newData);
    };

    const addSpendingRow = () => {
        setSpendingData([...spendingData, { income: 0, expenses: 0 }]);
    };

    const removeSpendingRow = (index) => {
        if (spendingData.length > 1) {
            const newData = spendingData.filter((_, i) => i !== index);
            setSpendingData(newData);
        }
    };

    const toggleRowExpand = (index) => {
        setExpandedRows(prev => 
            prev.includes(index) 
                ? prev.filter(i => i !== index) 
                : [...prev, index]
        );
    };

    const analyzeData = async () => {
        if (spendingData.length === 0) return;

        const payload = {
            indicator_type: indicatorType,
            values: spendingData.map(item => [item.income, item.expenses]),
            thresholds: {}
        };

        try {
            const response = await callApi({
                url: 'assess/ews/',
                method: 'POST',
                body: payload
            });

            if (response.status === 201) {
                setResults(response.data.results);
                setSummary(response.data.summary);
                setExpandedRows(response.data.summary.anomaly_indices);
                console.log('Analysis response:', response.data);
            }
        } catch (err) {
            console.error("Analysis failed:", err);
        }
    };

    const renderFinancialMetrics = (metrics) => {
        if (!metrics) return null;
        
        return (
            <Box sx={{ mt: 1, p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                    Financial Metrics:
                </Typography>
                <Grid container spacing={1}>
                    <Grid item xs={4}>
                        <Typography variant="body2">
                            Savings Rate: <strong>{(metrics.savings_rate * 100).toFixed(1)}%</strong>
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="body2">
                            Expense Ratio: <strong>{metrics.expense_ratio === Infinity ? '∞' : metrics.expense_ratio.toFixed(2)}</strong>
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="body2">
                            Disposable Income: <strong>{getUser().currency}{metrics.disposable_income.toFixed(2)}</strong>
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        );
    };

    const renderAnalysisDetails = (result) => {
        if (!result.metadata) return null;
        
        return (
            <TableRow>
                <TableCell colSpan={4} sx={{ py: 0 }}>
                    <Collapse in={expandedRows.includes(results.indexOf(result))} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Analysis Details
                                    </Typography>
                                    <Divider sx={{ mb: 1 }} />
                                    <Typography variant="body2">
                                        <strong>Method:</strong> {result.metadata.analysis_method}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Contamination:</strong> {result.metadata.contamination}
                                    </Typography>
                                    {result.metadata.debug?.business_rules?.length > 0 && (
                                        <Box sx={{ mt: 1 }}>
                                            <Typography variant="subtitle2">
                                                Business Rule Violations:
                                            </Typography>
                                            <ul style={{ marginTop: 4, paddingLeft: 20 }}>
                                                {result.metadata.debug.business_rules.map((rule, i) => (
                                                    <li key={i}>
                                                        <Typography variant="body2">{rule}</Typography>
                                                    </li>
                                                ))}
                                            </ul>
                                        </Box>
                                    )}
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    {renderFinancialMetrics(result.metadata.metrics)}
                                </Grid>
                            </Grid>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        );
    };

    return (
        <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
            <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Early Warning System
                </Typography>
                <Typography variant="body1" paragraph>
                    Monitor financial indicators for potential risks using advanced anomaly detection
                </Typography>

                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Indicator Type</InputLabel>
                    <Select
                        value={indicatorType}
                        label="Indicator Type"
                        onChange={handleIndicatorChange}
                    >
                        <MenuItem value="SPENDING">Spending Pattern</MenuItem>
                        <MenuItem value="TRANSACTION">Transaction Pattern</MenuItem>
                        <MenuItem value="STOCK">Stock Movement</MenuItem>
                        <MenuItem value="LOAN">Loan Default Risk</MenuItem>
                        <MenuItem value="NEWS">News Sentiment</MenuItem>
                    </Select>
                </FormControl>

                {indicatorType === 'SPENDING' && (
                    <>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6">
                                Spending Patterns (Income vs Expenses)
                            </Typography>
                            <Tooltip title="Enter income and expenses data for anomaly detection. The system will flag unusual spending patterns.">
                                <InfoOutlined color="action" sx={{ ml: 1 }} />
                            </Tooltip>
                        </Box>
                        
                        <TableContainer component={Paper} sx={{ mb: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Income {getUser().currency}</TableCell>
                                        <TableCell>Expenses {getUser().currency}</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {spendingData.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                <TextField
                                                    fullWidth
                                                    type="number"
                                                    value={row.income}
                                                    onChange={(e) => handleSpendingChange(index, 'income', e.target.value)}
                                                    inputProps={{ min: 0, step: 0.01 }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    fullWidth
                                                    type="number"
                                                    value={row.expenses}
                                                    onChange={(e) => handleSpendingChange(index, 'expenses', e.target.value)}
                                                    inputProps={{ min: 0, step: 0.01 }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    onClick={() => removeSpendingRow(index)}
                                                    disabled={spendingData.length <= 1}
                                                >
                                                    <DeleteOutline color={spendingData.length <= 1 ? "disabled" : "error"} />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="outlined"
                                startIcon={<AddCircleOutline />}
                                onClick={addSpendingRow}
                                sx={{ mb: 3 }}
                            >
                                Add Row
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => setSpendingData([{ income: 0, expenses: 0 }])}
                                sx={{ mb: 3 }}
                            >
                                Reset Data
                            </Button>
                        </Box>
                    </>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={analyzeData}
                        disabled={loading || spendingData.length === 0}
                        sx={{ minWidth: 200 }}
                    >
                        {loading ? (
                            <>
                                <CircularProgress size={24} sx={{ marginRight: 1 }} />
                                Analyzing...
                            </>
                        ) : 'Run Analysis'}
                    </Button>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        Error: {error.message || 'An error occurred during analysis'}
                    </Alert>
                )}
            </Paper>

            {summary && (
                <Paper elevation={3} sx={{ padding: 3, mb: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Analysis Summary
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                        <Chip 
                            label={`Total Records: ${results.length}`} 
                            variant="outlined" 
                            color="default"
                        />
                        <Chip 
                            label={`Anomalies Detected: ${summary.total_anomalies}`}
                            variant="outlined"
                            color={summary.total_anomalies > 0 ? "error" : "success"}
                            icon={summary.total_anomalies > 0 ? <WarningAmber /> : <CheckCircleOutline />}
                        />
                        <Chip 
                            label={`Contamination: ${summary.contamination_used}`}
                            variant="outlined"
                            color="info"
                        />
                    </Box>
                    {summary.anomaly_indices.length > 0 && (
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            Anomalies detected in rows: {summary.anomaly_indices.map(i => i + 1).join(', ')}
                        </Alert>
                    )}
                </Paper>
            )}

            {results.length > 0 && (
                <Paper elevation={3} sx={{ padding: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Detailed Results
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell width="40px" />
                                    <TableCell>Type</TableCell>
                                    <TableCell>Values</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {results.map((result, index) => (
                                    <React.Fragment key={index}>
                                        <TableRow hover>
                                            <TableCell>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => toggleRowExpand(index)}
                                                >
                                                    {expandedRows.includes(index) ? <ExpandLess /> : <ExpandMore />}
                                                </IconButton>
                                            </TableCell>
                                            <TableCell sx={{ textTransform: 'capitalize' }}>
                                                {result.indicator_type.toLowerCase().replace('_', ' ')}
                                            </TableCell>
                                            <TableCell>
                                                {Array.isArray(result.value) ? (
                                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                                        <Box>
                                                            <Typography variant="caption">Income</Typography>
                                                            <Typography>
                                                                {getUser().currency}{result.value[0]?.toFixed(2) || 0}
                                                            </Typography>
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="caption">Expenses</Typography>
                                                            <Typography>
                                                                {getUser().currency}{result.value[1]?.toFixed(2) || 0}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                ) : (
                                                    `${getUser().currency}${result.value?.toFixed(2) || 0}`
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {result.is_anomaly ? (
                                                    <Chip 
                                                        label="Anomaly" 
                                                        color="error" 
                                                        size="small" 
                                                        icon={<WarningAmber />}
                                                    />
                                                ) : (
                                                    <Chip 
                                                        label="Normal" 
                                                        color="success" 
                                                        size="small"
                                                        icon={<CheckCircleOutline />}
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(result.timestamp).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <Button 
                                                    size="small" 
                                                    onClick={() => toggleRowExpand(index)}
                                                >
                                                    {expandedRows.includes(index) ? 'Hide Details' : 'View Details'}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                        {renderAnalysisDetails(result)}
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}
        </Box>
    );
};

export default EWSForm;