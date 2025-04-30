// FinancialHealthCard.jsx
import React from 'react';
import { Paper, Typography, Box, Chip, LinearProgress, Tooltip } from '@mui/material';

// Construction-specific thresholds
const CONSTRUCTION_ZONES = {
  SAFE: 2.6,
  WARNING: 1.75,
  COLORS: {
    SAFE: '#4caf50',
    WARNING: '#ff9800',
    DANGER: '#f44336'
  }
};

const RiskIndicator = ({ score }) => {
  const getRiskLevel = () => {
    if (score > CONSTRUCTION_ZONES.SAFE) 
      return { label: 'Low Risk', color: 'success', tooltip: 'Healthy for construction firms' };
    if (score > CONSTRUCTION_ZONES.WARNING) 
      return { label: 'Monitor', color: 'warning', tooltip: 'Typical for seasonal builders' };
    return { label: 'High Alert', color: 'error', tooltip: 'Critical risk for contractors' };
  };

  const { label, color, tooltip } = getRiskLevel();

  return (
    <Tooltip title={tooltip} arrow>
      <Chip label={label} color={color} size="medium" />
    </Tooltip>
  );
};

const ScoreProgressBar = ({ score }) => {
  const getProgressValue = () => {
    // Non-linear scale for construction (more sensitive in danger zone)
    if (score < CONSTRUCTION_ZONES.WARNING) return (score / 1.75) * 40;
    if (score < CONSTRUCTION_ZONES.SAFE) return 40 + ((score - 1.75) / 0.85) * 30;
    return 70 + ((score - 2.6) / 1.9) * 30;
  };

  return (
    <LinearProgress
      variant="determinate"
      value={Math.min(Math.max(getProgressValue(), 0), 100)}
      sx={{
        height: 10,
        mb: 2,
        '& .MuiLinearProgress-bar': {
          backgroundColor: 
            score > CONSTRUCTION_ZONES.SAFE ? CONSTRUCTION_ZONES.COLORS.SAFE :
            score > CONSTRUCTION_ZONES.WARNING ? CONSTRUCTION_ZONES.COLORS.WARNING : 
            CONSTRUCTION_ZONES.COLORS.DANGER
        },
      }}
    />
  );
};

const ZoneLegend = () => (
  <>
    <Box display="flex" justifyContent="space-between">
      <Typography variant="caption">High Risk</Typography>
      <Typography variant="caption">Moderate Risk</Typography>
      <Typography variant="caption">Low Risk</Typography>
    </Box>
    <Box display="flex" justifyContent="space-between" mt={1}>
      <Tooltip title="Immediate action required" arrow>
        <Typography variant="caption" sx={{ width: '33%', textAlign: 'center' }}>
          Below 1.75
        </Typography>
      </Tooltip>
      <Tooltip title="Monitor project cash flows" arrow>
        <Typography variant="caption" sx={{ width: '33%', textAlign: 'center' }}>
          1.75-2.6
        </Typography>
      </Tooltip>
      <Tooltip title="Healthy for construction" arrow>
        <Typography variant="caption" sx={{ width: '33%', textAlign: 'center' }}>
          2.6+
        </Typography>
      </Tooltip>
    </Box>
  </>
);

const HealthAssessmentText = ({ score, hasDebtIssue }) => {
  let assessmentText = '';
  
  if (score > CONSTRUCTION_ZONES.SAFE) {
    assessmentText = "Strong position for construction. Maintain cash reserves for project fluctuations.";
  } else if (score > CONSTRUCTION_ZONES.WARNING) {
    assessmentText = "Typical range for builders. Watch receivables and project margins.";
  } else {
    assessmentText = "Danger zone for contractors. Review bidding and reduce equipment debt.";
  }

  if (hasDebtIssue) {
    assessmentText += " Construction firms should keep debt-to-equity below 60%.";
  }

  return (
    <Typography variant="body2" sx={{ mt: 2 }}>
      {assessmentText}
    </Typography>
  );
};

const FinancialHealthCard = ({ zScoreResult }) => {
    console.log('zScoreResult',zScoreResult)
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Overall Financial Health
      </Typography>

      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h4" sx={{ mr: 2 }}>
          {zScoreResult.score}
        </Typography>
        <RiskIndicator score={parseFloat(zScoreResult.score)} />
        <Typography
          variant="body1"
          sx={{ ml: 2 }}
          color={
            zScoreResult.score > CONSTRUCTION_ZONES.SAFE ? 'success.main' :
            zScoreResult.score > CONSTRUCTION_ZONES.WARNING ? 'warning.main' : 'error.main'
          }
        >
          {zScoreResult.score > CONSTRUCTION_ZONES.SAFE ? 'Stable' : 
           zScoreResult.score > CONSTRUCTION_ZONES.WARNING ? 'Caution' : 'Critical'}
        </Typography>
      </Box>

      <ScoreProgressBar score={parseFloat(zScoreResult.score)} />
      <ZoneLegend />

      <HealthAssessmentText 
        score={parseFloat(zScoreResult.score)} 
        hasDebtIssue={zScoreResult.components.D < 0.4} // Adjusted for construction
      />

      <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
        <strong>Construction Adjusted:</strong> Thresholds account for higher leverage and project-based cash flows
      </Typography>
    </Paper>
  );
};

export default FinancialHealthCard;