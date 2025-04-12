import { useFormContext } from 'react-hook-form';
import {
    Box,
    TextField,
    FormHelperText
} from "@mui/material";
import { useEffect, useState } from "react";
import { format, parseISO, isValid } from 'date-fns';

const StepTextComponents = ({ formConfig, fieldType }) => {
    const {
        register,
        formState: { errors },
        reset,
        setValue,
        watch
    } = useFormContext();
    const [textFields, setTextFields] = useState(formConfig.data.text);

    // Format date for display (YYYY-MM-DD)
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        try {
            const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
            return isValid(date) ? format(date, 'yyyy-MM-dd') : '';
        } catch {
            return '';
        }
    };

    useEffect(() => {
        setTextFields(formConfig.data.text);
        const defaultValues = formConfig.data.text.reduce((acc, field) => {
            acc[field.name] = field.isDate ? formatDateForInput(field.default) : field.default;
            return acc;
        }, {});
        reset(defaultValues);
    }, [formConfig.data.text, reset]);

    // Handle date field changes
    const handleDateChange = (fieldName, value) => {
        setValue(fieldName, value, { shouldValidate: true });
    };

    return (
        <Box>
            {textFields.map((field) => {
                const commonProps = {
                    fullWidth: true,
                    margin: "normal",
                    required: field.required,
                    key: field.name,
                    label: field.label,
                    error: !!errors[field.name],
                    helperText: errors[field.name]?.message,
                    placeholder: field.placeholder,
                    InputLabelProps: field.isDate ? { shrink: true } : undefined,
                };

                if (field.name === "date_of_received" ||
                    field.name === "date_of_expense" ||
                    field.name === "begin_date" ||
                    field.name === "end_date"
                ) {
                    return (
                        <Box key={field.name}>
                            <TextField
                                {...commonProps}
                                type="date"
                                value={watch(field.name) || ''}
                                onChange={(e) => handleDateChange(field.name, e.target.value)}
                                inputProps={{
                                    ...register(field.name, {
                                        required: field.required ? 'This field is required' : false,
                                        validate: {
                                            validDate: (value) =>
                                                !value || isValid(parseISO(value)) || 'Invalid date format'
                                        }
                                    }),
                                }}
                            />
                            {errors[field.name] && (
                                <FormHelperText error>
                                    {errors[field.name].message}
                                </FormHelperText>
                            )}
                        </Box>
                    );
                }

                return (
                    <TextField
                        {...commonProps}
                        {...register(field.name, {
                            required: field.required ? 'This field is required' : false
                        })}
                        defaultValue={field.default}
                    />
                );
            })}
        </Box>
    );
};

export default StepTextComponents;