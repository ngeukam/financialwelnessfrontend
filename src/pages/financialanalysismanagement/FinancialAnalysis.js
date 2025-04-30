import React from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FinancialAnalysisComponent from '../../components/FinancialAnalysisComponent';
const FinancialAnalysis = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Breadcrumbs>
        <Typography variant="body2" onClick={() => navigate('/')}>Home</Typography>
        <Typography variant="body2" onClick={() => navigate('/financial-analysis')}>Financial Analysis</Typography>
      </Breadcrumbs>
      <Box>
        <FinancialAnalysisComponent />
      </Box>
    </Box>
  );
};

export default FinancialAnalysis;