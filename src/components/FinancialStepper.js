import { Step, StepLabel, Stepper, Typography } from '@mui/material';
import { Input, Analytics, Lightbulb } from '@mui/icons-material';

// Map step numbers to their corresponding icons
const stepIcons = {
    1: Input,
    2: Analytics,
    3: Lightbulb
  };
// Composant personnalisé pour les icônes avec bordures arrondies
const CustomStepIcon = (props) => {
  const { active, completed, icon} = props;

  // Couleurs pour chaque étape
  const colors = {
    1: '#4caf50', // Vert
    2: '#2196f3', // Bleu
    3: '#ff9800', // Orange
  };
  // Get the correct icon component based on the step number
  const IconComponent = stepIcons[icon];
  return (
    <div
    style={{
        width: 60,
        height: 60,
        borderRadius: '50%',
        backgroundColor:colors[icon],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color:'white',
      }}
    >
      <IconComponent fontSize="medium" />
    </div>
  );
};

// Votre composant Stepper
const FinancialStepper = () => (
  <Stepper activeStep={0} alternativeLabel sx={{ mt: 4 }}>
    <Step>
      <StepLabel StepIconComponent={CustomStepIcon}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          Step 1: Data Input
        </Typography>
        <Typography variant="body2">
          Enter financial data from balance sheet and income statement
        </Typography>
      </StepLabel>
    </Step>
    <Step>
      <StepLabel StepIconComponent={CustomStepIcon}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          Step 2: Analysis
        </Typography>
        <Typography variant="body2">
          View calculated ratios and financial health metrics
        </Typography>
      </StepLabel>
    </Step>
    <Step>
      <StepLabel StepIconComponent={CustomStepIcon}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          Step 3: Recommendations
        </Typography>
        <Typography variant="body2">
          Get actionable steps to improve financial position
        </Typography>
      </StepLabel>
    </Step>
  </Stepper>
);

export default FinancialStepper;