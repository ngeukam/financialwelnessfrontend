// MarketRiskCard.jsx
import { Paper, Typography, Box, Chip, LinearProgress, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';

const MarketRiskCard = ({ 
  valueAtRisk,
  expectedShortfall,
  volatility,
  confidenceLevel = 0.95,
  assessmentId
}) => {
  // Convert to percentages for display
  const varPercent = (valueAtRisk * 100).toFixed(2);
  const esPercent = (expectedShortfall * 100).toFixed(2);
  const volPercent = (volatility * 100).toFixed(2);
  
  // Risk level determination
  const getRiskLevel = (value) => {
    if (value < -0.10) return 'Severe';
    if (value < -0.05) return 'High';
    if (value < -0.02) return 'Moderate';
    return 'Low';
  };
  
  const riskLevel = getRiskLevel(valueAtRisk);

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Market Risk Assessment Results
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1">Value at Risk ({(confidenceLevel * 100)}% confidence)</Typography>
        <Box display="flex" alignItems="center">
          <Typography variant="h4" sx={{ mr: 2 }}>
            {varPercent}%
          </Typography>
          <Chip 
            label={riskLevel + " Risk"} 
            color={
              riskLevel === 'Severe' ? 'error' : 
              riskLevel === 'High' ? 'warning' : 'success'
            } 
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          Maximum expected loss under normal market conditions
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1">Expected Shortfall</Typography>
        <Typography variant="h5">{esPercent}%</Typography>
        <Typography variant="body2" color="text.secondary">
          Average loss in worst {((1 - confidenceLevel) * 100)}% of cases
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1">Annualized Volatility</Typography>
        <Typography variant="h5">{volPercent}%</Typography>
      </Box>

      {assessmentId && (
        <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
          Assessment ID: {assessmentId}
        </Typography>
      )}
    </Paper>
  );
};

MarketRiskCard.propTypes = {
  valueAtRisk: PropTypes.number.isRequired,
  expectedShortfall: PropTypes.number.isRequired,
  volatility: PropTypes.number.isRequired,
  confidenceLevel: PropTypes.number,
  assessmentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default MarketRiskCard;