import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    CircularProgress,
    Grid,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Divider,
    Card,
    CardContent,
    Slider,
    Tooltip
} from '@mui/material';
import { Warning, CheckCircle, Error, Info } from '@mui/icons-material';
import useApi from '../hooks/APIHandler';

const defaultValues = {
    gdp_growth: 2.5,
    inflation: 2.0,
    interest_rate: 1.5,
    market_volatility: 15.0
};

const parameterInfo = {
    gdp_growth: {
        min: -5,
        max: 10,
        description: "Annual GDP growth percentage. Higher growth generally indicates lower risk."
    },
    inflation: {
        min: -2,
        max: 20,
        description: "Annual inflation rate. High inflation typically increases financial risk."
    },
    interest_rate: {
        min: 0,
        max: 15,
        description: "Central bank interest rate. Higher rates can increase borrowing costs and risk."
    },
    market_volatility: {
        min: 0,
        max: 50,
        description: "Market volatility index (0-50). Higher values indicate more market instability."
    }
};

const RiskAnalysisForm = () => {
    const [formData, setFormData] = useState(defaultValues);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { callApi } = useApi();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: parseFloat(value) || 0
        }));
    };

    const handleSliderChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const analyzeRisk = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await callApi({
                url: 'assess/risk-analysis/',
                method: 'POST',
                body: formData
            });
            
            if (response.data) {
                setResults(prev => [response.data.result, ...prev]);
            }
        } catch (err) {
            setError(err.message || 'Risk analysis failed');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData(defaultValues);
    };

    const getRiskChip = (riskLevel) => {
        const config = {
            0: { label: 'Low Risk', color: 'success', icon: <CheckCircle /> },
            1: { label: 'Medium Risk', color: 'warning', icon: <Warning /> },
            2: { label: 'High Risk', color: 'error', icon: <Error /> }
        };
        
        return (
            <Chip
                label={config[riskLevel].label}
                color={config[riskLevel].color}
                icon={config[riskLevel].icon}
                sx={{ fontWeight: 'bold' }}
            />
        );
    };

    const formatProbability = (probabilities) => {
        if (!probabilities) return 'N/A';
        return (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {probabilities.map((p, i) => (
                    <Chip 
                        key={i}
                        label={`${getRiskChip(i).props.label}: ${(p * 100).toFixed(1)}%`}
                        variant="outlined"
                        size="small"
                    />
                ))}
            </Box>
        );
    };

    return (
        <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
            <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Financial Risk Analysis
                </Typography>
                <Typography variant="body1" paragraph>
                    Adjust the economic indicators below to assess financial risk
                </Typography>
                
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    {Object.entries(formData).map(([key, value]) => (
                        <Grid item xs={12} md={6} key={key}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                    {key.replace('_', ' ')}
                                </Typography>
                                <Tooltip title={parameterInfo[key].description}>
                                    <Info color="action" sx={{ ml: 1 }} />
                                </Tooltip>
                            </Box>
                            
                            <Slider
                                value={value}
                                onChange={(e, newValue) => handleSliderChange(key, newValue)}
                                min={parameterInfo[key].min}
                                max={parameterInfo[key].max}
                                step={0.1}
                                valueLabelDisplay="auto"
                                sx={{ mb: 2 }}
                            />
                            
                            <TextField
                                fullWidth
                                label={`${key.replace('_', ' ')} (${key === 'market_volatility' ? 'index' : '%'})`}
                                name={key}
                                type="number"
                                value={value}
                                onChange={handleChange}
                                inputProps={{ 
                                    min: parameterInfo[key].min,
                                    max: parameterInfo[key].max,
                                    step: "0.1"
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={analyzeRisk}
                        disabled={loading}
                        sx={{ minWidth: 200 }}
                    >
                        {loading ? (
                            <>
                                <CircularProgress size={24} sx={{ mr: 1 }} />
                                Analyzing...
                            </>
                        ) : 'Analyze Risk'}
                    </Button>
                    
                    <Button
                        variant="outlined"
                        size="large"
                        onClick={resetForm}
                        disabled={loading}
                    >
                        Reset Values
                    </Button>
                </Box>
                
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
            </Paper>
            
            {results.length > 0 && (
                <>
                    <Paper elevation={3} sx={{ padding: 3, mb: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            Latest Analysis Result
                        </Typography>
                        
                        <Card sx={{ mb: 2 }}>
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle1">Economic Indicators</Typography>
                                        <Divider sx={{ my: 1 }} />
                                        {Object.entries(results[0]).filter(([key]) => key in formData).map(([key, value]) => (
                                            <Typography key={key}>
                                                {key.replace('_', ' ')}: {value}{key === 'market_volatility' ? '' : '%'}
                                            </Typography>
                                        ))}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle1">Risk Prediction</Typography>
                                        <Divider sx={{ my: 1 }} />
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                            <Typography>Risk Level:</Typography>
                                            {getRiskChip(results[0].predicted_risk)}
                                        </Box>
                                        <Typography>Confidence: {(results[0].confidence_score * 100).toFixed(1)}%</Typography>
                                        <Box sx={{ mt: 1 }}>
                                            <Typography variant="subtitle2">Probability Distribution:</Typography>
                                            {formatProbability(results[0].metadata?.probabilities)}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                        
                        <Typography variant="body2" color="text.secondary">
                            Model: {results[0].metadata?.model || 'Unknown model'} • {new Date(results[0].timestamp).toLocaleString()}
                        </Typography>
                    </Paper>
                    
                    <Paper elevation={3} sx={{ padding: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            Analysis History
                        </Typography>
                        
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>GDP Growth</TableCell>
                                        <TableCell>Inflation</TableCell>
                                        <TableCell>Risk Level</TableCell>
                                        <TableCell>Confidence</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {results.map((result, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                {new Date(result.timestamp).toLocaleString()}
                                            </TableCell>
                                            <TableCell>{result.gdp_growth}%</TableCell>
                                            <TableCell>{result.inflation}%</TableCell>
                                            <TableCell>
                                                {getRiskChip(result.predicted_risk)}
                                            </TableCell>
                                            <TableCell>
                                                {(result.confidence_score * 100).toFixed(1)}%
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </>
            )}
        </Box>
    );
};

export default RiskAnalysisForm;