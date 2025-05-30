// CreditRiskForm.jsx
import React, { useState } from 'react';
import {
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    CircularProgress
} from '@mui/material';
import CreditRiskCard from './CreditRiskCard ';
import useApi from '../hooks/APIHandler';
import { toast } from 'react-toastify';
const CreditRiskForm = () => {
    const [formData, setFormData] = useState({
        income: 50000,
        loan_amount: 15000,
        credit_score: 700
    });
    const [result, setResult] = useState(null);
    const { loading, error, callApi } = useApi();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'income' || name === 'loan_amount' ? parseFloat(value) : parseInt(value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await callApi({ url: 'assess/creditrisk/', method: 'POST', body: formData });
        console.log('response', response)
        if (response.status === 201) {
            setResult(response.data);
            toast.success(response.data.message)
        }

    };

    return (
        <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 3 }}>
            <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Credit Risk Assessment
                </Typography>
                <Typography variant="body1" paragraph>
                    Enter borrower information to assess credit risk
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Annual Income ($)"
                        name="income"
                        type="number"
                        value={formData.income}
                        onChange={handleChange}
                        required
                        inputProps={{ min: 20000, max: 500000 }}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Loan Amount Requested ($)"
                        name="loan_amount"
                        type="number"
                        value={formData.loan_amount}
                        onChange={handleChange}
                        required
                        inputProps={{ min: 1000, max: 200000 }}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Credit Score"
                        name="credit_score"
                        type="number"
                        value={formData.credit_score}
                        onChange={handleChange}
                        required
                        inputProps={{ min: 300, max: 850 }}
                    />

                    <Box sx={{ marginTop: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <CircularProgress size={24} sx={{ marginRight: 1 }} />
                                    Calculating...
                                </>
                            ) : 'Calculate Credit Risk'}
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
                <CreditRiskCard
                    score={result.risk_score}
                    prediction={result.prediction}
                />
            )}
        </Box>
    );
};

export default CreditRiskForm;