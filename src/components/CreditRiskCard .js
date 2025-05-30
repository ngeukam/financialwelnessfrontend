// CreditRiskCard.jsx
import { Paper, Typography, Box, Chip, LinearProgress, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';

const DEFAULT_THRESHOLDS = {
  SAFE: 2.6,
  WARNING: 1.75,
  COLORS: {
    SAFE: '#4caf50',
    WARNING: '#ff9800',
    DANGER: '#f44336'
  },
  LABELS: {
    SAFE: 'Low Risk',
    WARNING: 'Monitor',
    DANGER: 'High Alert'
  },
  STATUS_TEXTS: {
    SAFE: 'Stable',
    WARNING: 'Caution',
    DANGER: 'Critical'
  },
  TOOLTIPS: {
    SAFE: 'Healthy financial position',
    WARNING: 'Requires monitoring',
    DANGER: 'Immediate attention needed'
  },
  RANGE_LABELS: {
    LOW: 'High Risk',
    MEDIUM: 'Moderate Risk',
    HIGH: 'Low Risk'
  },
  RANGE_TOOLTIPS: {
    LOW: 'High probability of default',
    MEDIUM: 'Moderate financial risk',
    HIGH: 'Low probability of default'
  }
};

const RiskIndicator = ({ score, thresholds }) => {
  const getRiskLevel = () => {
    if (score > thresholds.SAFE) {
      return { 
        label: thresholds.LABELS.SAFE, 
        color: 'success', 
        tooltip: thresholds.TOOLTIPS.SAFE 
      };
    }
    if (score > thresholds.WARNING) {
      return { 
        label: thresholds.LABELS.WARNING, 
        color: 'warning', 
        tooltip: thresholds.TOOLTIPS.WARNING 
      };
    }
    return { 
      label: thresholds.LABELS.DANGER, 
      color: 'error', 
      tooltip: thresholds.TOOLTIPS.DANGER 
    };
  };

  const { label, color, tooltip } = getRiskLevel();

  return (
    <Tooltip title={tooltip} arrow>
      <Chip label={label} color={color} size="medium" />
    </Tooltip>
  );
};

const ScoreProgressBar = ({ score, thresholds }) => {
  const getProgressValue = () => {
    // Calculate percentage based on thresholds
    if (score < thresholds.WARNING) {
      return (score / thresholds.WARNING) * 40;
    }
    if (score < thresholds.SAFE) {
      return 40 + ((score - thresholds.WARNING) / (thresholds.SAFE - thresholds.WARNING)) * 30;
    }
    return 70 + ((score - thresholds.SAFE) / (thresholds.SAFE * 0.5)) * 30;
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
            score > thresholds.SAFE ? thresholds.COLORS.SAFE :
            score > thresholds.WARNING ? thresholds.COLORS.WARNING : 
            thresholds.COLORS.DANGER
        },
      }}
    />
  );
};

const CreditRiskCard = ({ 
  score, 
  prediction, 
  thresholds = DEFAULT_THRESHOLDS,
  businessType = 'business',
  showPrediction = true,
  assessmentId
}) => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Credit Risk Assessment Results
      </Typography>

      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h4" sx={{ mr: 2 }}>
          {score.toFixed(2)}
        </Typography>
        <RiskIndicator score={score} thresholds={thresholds} />
        <Typography
          variant="body1"
          sx={{ ml: 2 }}
          color={
            score > thresholds.SAFE ? 'success.main' :
            score > thresholds.WARNING ? 'warning.main' : 'error.main'
          }
        >
          {score > thresholds.SAFE ? thresholds.STATUS_TEXTS.SAFE : 
           score > thresholds.WARNING ? thresholds.STATUS_TEXTS.WARNING : 
           thresholds.STATUS_TEXTS.DANGER}
        </Typography>
      </Box>

      <ScoreProgressBar score={score} thresholds={thresholds} />
      
      <Box display="flex" justifyContent="space-between">
        <Typography variant="caption">{thresholds.RANGE_LABELS.LOW}</Typography>
        <Typography variant="caption">{thresholds.RANGE_LABELS.MEDIUM}</Typography>
        <Typography variant="caption">{thresholds.RANGE_LABELS.HIGH}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" mt={1}>
        <Tooltip title={thresholds.RANGE_TOOLTIPS.LOW} arrow>
          <Typography variant="caption" sx={{ width: '33%', textAlign: 'center' }}>
            Below {thresholds.WARNING}
          </Typography>
        </Tooltip>
        <Tooltip title={thresholds.RANGE_TOOLTIPS.MEDIUM} arrow>
          <Typography variant="caption" sx={{ width: '33%', textAlign: 'center' }}>
            {thresholds.WARNING}-{thresholds.SAFE}
          </Typography>
        </Tooltip>
        <Tooltip title={thresholds.RANGE_TOOLTIPS.HIGH} arrow>
          <Typography variant="caption" sx={{ width: '33%', textAlign: 'center' }}>
            {thresholds.SAFE}+
          </Typography>
        </Tooltip>
      </Box>

      {showPrediction && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          Prediction: <strong>{prediction ? 'High risk of default' : 'Low risk of default'}</strong>
        </Typography>
      )}

      {assessmentId && (
        <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
          Assessment ID: {assessmentId}
        </Typography>
      )}
    </Paper>
  );
};

CreditRiskCard.propTypes = {
  score: PropTypes.number.isRequired,
  prediction: PropTypes.bool,
  thresholds: PropTypes.shape({
    SAFE: PropTypes.number,
    WARNING: PropTypes.number,
    COLORS: PropTypes.shape({
      SAFE: PropTypes.string,
      WARNING: PropTypes.string,
      DANGER: PropTypes.string
    }),
    LABELS: PropTypes.shape({
      SAFE: PropTypes.string,
      WARNING: PropTypes.string,
      DANGER: PropTypes.string
    }),
    STATUS_TEXTS: PropTypes.shape({
      SAFE: PropTypes.string,
      WARNING: PropTypes.string,
      DANGER: PropTypes.string
    }),
    TOOLTIPS: PropTypes.shape({
      SAFE: PropTypes.string,
      WARNING: PropTypes.string,
      DANGER: PropTypes.string
    }),
    RANGE_LABELS: PropTypes.shape({
      LOW: PropTypes.string,
      MEDIUM: PropTypes.string,
      HIGH: PropTypes.string
    }),
    RANGE_TOOLTIPS: PropTypes.shape({
      LOW: PropTypes.string,
      MEDIUM: PropTypes.string,
      HIGH: PropTypes.string
    })
  }),
  businessType: PropTypes.string,
  showPrediction: PropTypes.bool,
  assessmentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default CreditRiskCard;