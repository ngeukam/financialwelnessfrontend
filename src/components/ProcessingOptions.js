import React from 'react';
import { Box, Typography } from '@mui/material';
import CommonInputComponent from './CommonInputComponent';
import { format } from 'date-fns';


const ProcessingOptions = () => {

  return (
    <Box sx={{ mt: 1, p: 3, borderTop: 1, borderColor: 'divider' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Processing Options
      </Typography>
      <Box display="flex" justifyContent="space-between" flexWrap="wrap">
        <Box sx={{ width: { xs: '100%', md: '45%' } }}>
          {/* <CommonInputComponent
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
          /> */}
          {/* <CommonInputComponent
            field={{
              type: "text",
              name: "rowsToRemove",
              label: "Rows to delete (indices)",
              required: false,
              placeholder: "1, 3-5, 7 (supports ranges and lists)",
              helperText: "Enter row numbers or ranges (e.g., 1, 3-5, 7)"
            }}
          /> */}
          <CommonInputComponent
            field={{
              type: "text",
              name: "columnsToRemove",
              label: "Columns to remove",
              required: false,
              placeholder: "column1, column2",
              helperText: "Comma-separated column names"
            }}
          />
          <CommonInputComponent
            field={{
              type: "number",
              name: "minEmptyValues",
              label: "Minimum empty values to delete row",
              required: false,
              min: 0,
              default: 0,
              helperText: "Rows with more empty values than this will be deleted",
              placeholder:"0 if you don't want to delete None value on row"
            }}
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
              required: true,
              default: format(new Date(), 'yyyy-MM-dd') 
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