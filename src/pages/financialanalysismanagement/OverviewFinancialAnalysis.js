import React from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import OverviewFinancialAnalysisComponent from '../../components/OverviewFinancialAnalysisComponent';
const OverviewFinancialAnalysis = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Breadcrumbs>
        <Typography variant="body2" onClick={() => navigate('/')}>Home</Typography>
        <Typography variant="body2" onClick={() => navigate('/overview/financial-analysis')}>Overview Financial Analysis</Typography>
      </Breadcrumbs>
      <Grid container spacing={3} sx={{mt:2}}>
        <OverviewFinancialAnalysisComponent />
      </Grid>
    </Box>
  );
};

export default OverviewFinancialAnalysis;