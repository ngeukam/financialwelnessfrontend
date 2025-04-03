import {
  Autocomplete,
  FormControlLabel,
  Switch,
  TextField,
  Box,
  FormGroup,
} from "@mui/material";
import JsonInputComponent from "./JsonInputComponent";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";

const CommonInputComponent = ({ field, sx }) => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  useEffect(() => {
    if (Array.isArray(field)) {
      // Handle array of fields (like checkboxes)
      field.forEach((f) => {
        if (f.type === 'checkbox' && f.default !== undefined) {
          setValue(f.name, f.default);
        }
      });
    } else {
      // Handle single field (original logic)
      const selectedOption = field?.options?.find((option) => option.id === watch(field.name)) ||
        field?.options?.find((option) => option.id === field.default) ||
        null;
      if (selectedOption) {
        setValue(field.name, selectedOption.id);
      }

      if (field.type === 'text' && 'isDateTime' in field) {
        if (field.default) {
          const date = new Date(field.default);
          const tzOffset = new Date().getTimezoneOffset() * 60000;
          const localTime = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
          setValue(field.name, localTime);
        } else {
          setValue(field.name, new Date().toISOString().slice(0, 16));
        }
      }
    }
  }, []);

  // Handle array of fields (like checkboxes)
  if (Array.isArray(field)) {
    return (
      <Box sx={sx}>
        <FormGroup>
          {field.map((f) => (
            <FormControlLabel
              key={f.name}
              control={
                <Switch
                  {...register(f.name)}
                  defaultChecked={f.default || false}
                />
              }
              label={f.label}
            />
          ))}
        </FormGroup>
      </Box>
    );
  }

  // Original single field handling
  return field.type === "text" ? (
    "isDate" in field ? (
      <TextField
        fullWidth
        margin="normal"
        required={field.required}
        sx={sx}
        key={field.name}
        label={field.label}
        error={!!errors[field.name]}
        {...register(field.name, { required: field.required })}
        defaultValue={field.default}
        placeholder={field.placeholder}
        type="date"
        InputLabelProps={{ shrink: true }}
      />
    ) : "isDateTime" in field ? (
      <TextField
        fullWidth
        sx={sx}
        margin="normal"
        required={field.required}
        key={field.name}
        label={field.label}
        error={!!errors[field.name]}
        {...register(field.name, { required: field.required })}
        defaultValue={field.default}
        placeholder={field.placeholder}
        type="datetime-local"
        InputLabelProps={{ shrink: true }}
      />
    ) : (
      <TextField
        fullWidth
        margin="normal"
        sx={sx}
        required={field.required}
        key={field.name}
        label={field.label}
        error={!!errors[field.name]}
        {...register(field.name, { required: field.required })}
        defaultValue={field.default}
        placeholder={field.placeholder}
      />
    )
  ) : field.type === "number" ? (  // ✅ Added Number Handling
    <TextField
      fullWidth
      margin="normal"
      sx={sx}
      required={field.required}
      key={field.name}
      label={field.label}
      error={!!errors[field.name]}
      {...register(field.name, {
        required: field.required,
        valueAsNumber: true,
        min: {
          value: field.min ?? 0,  // ✅ Default min value (0) if not provided
          message: `Value must be at least ${field.min ?? 0}`,
        },
        validate: (value) => !isNaN(value) || "Invalid number",
      })}
      defaultValue={field.default}
      placeholder={field.placeholder}
      type="number"
      InputLabelProps={{ shrink: true }}
      inputProps={{ min: field.min ?? 0 }} // ✅ Ensures UI prevents values below min
      helperText={errors[field.name]?.message}
    />
  ) : // In your CommonInputComponent.js
    field.type === "select" ? (
      <Autocomplete
        sx={{ mt: 2, ...sx }}
        options={field.options}
        getOptionLabel={(option) => option.value || option.label || ''}
        isOptionEqualToValue={(option, value) =>
          option.id === value?.id || option.value === value?.value
        }
        value={
          field.options.find(option =>
            option.id === watch(field.name) ||
            option.value === watch(field.name)
          ) || null
        }
        onChange={(event, newValue) => {
          setValue(field.name, newValue ? newValue.id || newValue.value : "");
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={field.label}
            variant="outlined"
            error={!!errors[field.name]}
            helperText={errors[field.name]?.message || "This field is required"}
          />
        )}
      />
    ) : field.type === "checkbox" ? (
      <FormControlLabel
        sx={sx}
        control={
          <Switch
            error={!!errors[field.name]}
            {...register(field.name, { required: field.required })}
            defaultValue={field.default}
          />
        }
        label={field.label}
      />
    ) : field.type === "textarea" ? (
      <TextField
        fullWidth
        sx={sx}
        margin="normal"
        key={field.name}
        required={field.required}
        error={!!errors[field.name]}
        label={field.label}
        {...register(field.name, { required: field.required })}
        defaultValue={field.default}
        rows={4}
        multiline
        placeholder={field.placeholder}
      />
    ) : field.type === "json" ? (
      <JsonInputComponent fields={field} key={field.name} />
    ) : (
      <h2>Field Not Found</h2>
    );
};

export default CommonInputComponent;