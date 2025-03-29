import React from 'react';
import { Box, Typography } from '@mui/material';
import CommonInputComponent from './CommonInputComponent';
import { useFormContext } from 'react-hook-form';

const ProcessingOptions = () => {
  const { control } = useFormContext();
  
  return (
    <Box sx={{ mt: 1, p: 3, borderTop: 1, borderColor: 'divider' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Processing Options
      </Typography>
      <Box display="flex" justifyContent="space-between" flexWrap="wrap">
        <Box sx={{ width: { xs: '100%', md: '45%' } }}>
          <CommonInputComponent
            field={[
              {
                type: "checkbox",
                name: "delete_duplicate",
                label: 'Delete duplicate',
                default: true
              },
              {
                type: "checkbox",
                name: "merge_existing",
                label: 'Merge with existing data',
                default: false
              }
            ]}
            sx={{ width: '100%' }}
          />
        </Box>
        <Box sx={{ width: { xs: '100%', md: '45%' }, mt: { xs: 2, md: 0 } }}>
          <CommonInputComponent 
            field={{ 
              type: "text", 
              name: "data_name", 
              label: "Data name", 
              required: true 
            }}
          />
          <CommonInputComponent 
            field={{ 
              type: "text", 
              name: "date_format", 
              label: "Date format", 
              isDate: true, 
              required: true 
            }}
          />
          <CommonInputComponent 
            field={{
              type: "select", 
              name: "currency", 
              label: "Currency",
              options: [
                { id: 'XAF', value: 'XAF' }, 
                { id: 'USD', value: 'USD' }, 
                { id: 'EUR', value: 'EUR' }
              ],
              default: 'XAF'
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ProcessingOptions;