// MarketRiskForm.jsx
import React, { useState } from 'react';
import {
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    CircularProgress,
    Grid
} from '@mui/material';
import MarketRiskCard from './MarketRiskCard';
import useApi from '../hooks/APIHandler';
import { toast } from 'react-toastify';

const MarketRiskForm = () => {
    // Initialize with sample data as arrays of numbers
    const [stockPrices, setStockPrices] = useState([100, 102, 105, 103, 107]);
    const [exchangeRates, setExchangeRates] = useState([1.2, 1.21, 1.19]);
    const [interestRates, setInterestRates] = useState([0.05, 0.051, 0.049]);
    const [result, setResult] = useState(null);
    const { loading, error, callApi } = useApi();

    const handleStockPriceChange = (index, value) => {
        const newPrices = [...stockPrices];
        newPrices[index] = parseFloat(value) || 0;
        setStockPrices(newPrices);
    };

    const handleExchangeRateChange = (index, value) => {
        const newRates = [...exchangeRates];
        newRates[index] = parseFloat(value) || 0;
        setExchangeRates(newRates);
    };

    const handleInterestRateChange = (index, value) => {
        const newRates = [...interestRates];
        newRates[index] = parseFloat(value) || 0;
        setInterestRates(newRates);
    };

    const addStockPriceField = () => {
        setStockPrices([...stockPrices, 0]);
    };

    const addExchangeRateField = () => {
        setExchangeRates([...exchangeRates, 0]);
    };

    const addInterestRateField = () => {
        setInterestRates([...interestRates, 0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const payload = {
            stock_prices: stockPrices,
            exchange_rates: exchangeRates,
            interest_rates: interestRates
        };

        const response = await callApi({ 
            url: 'assess/marketrisk/', 
            method: 'POST', 
            body: payload 
        });

        if (response.status === 201) {
            setResult(response.data);
            toast.success('Market risk assessment completed successfully');
        }
    };

    return (
        <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 3 }}>
            <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Market Risk Assessment
                </Typography>
                <Typography variant="body1" paragraph>
                    Enter market data to assess risk metrics
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                        Stock Prices
                    </Typography>
                    <Grid container spacing={2}>
                        {stockPrices.map((price, index) => (
                            <Grid item xs={4} key={`stock-${index}`}>
                                <TextField
                                    fullWidth
                                    label={`Day ${index + 1}`}
                                    type="number"
                                    value={price}
                                    onChange={(e) => handleStockPriceChange(index, e.target.value)}
                                    inputProps={{ step: "0.01" }}
                                />
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Button 
                                variant="outlined" 
                                onClick={addStockPriceField}
                                sx={{ mt: 1 }}
                            >
                                Add Stock Price
                            </Button>
                        </Grid>
                    </Grid>

                    <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
                        Exchange Rates
                    </Typography>
                    <Grid container spacing={2}>
                        {exchangeRates.map((rate, index) => (
                            <Grid item xs={4} key={`exchange-${index}`}>
                                <TextField
                                    fullWidth
                                    label={`Day ${index + 1}`}
                                    type="number"
                                    value={rate}
                                    onChange={(e) => handleExchangeRateChange(index, e.target.value)}
                                    inputProps={{ step: "0.0001" }}
                                />
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Button 
                                variant="outlined" 
                                onClick={addExchangeRateField}
                                sx={{ mt: 1 }}
                            >
                                Add Exchange Rate
                            </Button>
                        </Grid>
                    </Grid>

                    <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
                        Interest Rates
                    </Typography>
                    <Grid container spacing={2}>
                        {interestRates.map((rate, index) => (
                            <Grid item xs={4} key={`interest-${index}`}>
                                <TextField
                                    fullWidth
                                    label={`Day ${index + 1}`}
                                    type="number"
                                    value={rate}
                                    onChange={(e) => handleInterestRateChange(index, e.target.value)}
                                    inputProps={{ step: "0.0001" }}
                                />
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Button 
                                variant="outlined" 
                                onClick={addInterestRateField}
                                sx={{ mt: 1 }}
                            >
                                Add Interest Rate
                            </Button>
                        </Grid>
                    </Grid>

                    <Box sx={{ marginTop: 4 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <CircularProgress size={24} sx={{ marginRight: 1 }} />
                                    Calculating...
                                </>
                            ) : 'Calculate Market Risk'}
                        </Button>
                    </Box>
                </form>

                {error && (
                    <Typography color="error" sx={{ marginTop: 2 }}>
                        Error: {error}
                    </Typography>
                )}
            </Paper>

            {result && (
                <MarketRiskCard
                    valueAtRisk={result.value_at_risk}
                    expectedShortfall={result.expected_shortfall}
                    volatility={result.volatility}
                />
            )}
        </Box>
    );
};

export default MarketRiskForm;