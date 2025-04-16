import React, { useEffect, useState, useCallback } from 'react';
import { Grid, Button, Box, Typography, Breadcrumbs } from '@mui/material';
import CommonInputComponent from '../../components/CommonInputComponent';
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from 'react-router-dom';
import { getFormType } from '../../utils/Helper';
import useApi from '../../hooks/APIHandler';
import { toast } from 'react-toastify';

const CreateIncome = () => {
    // Hooks and state initialization
    const methods = useForm();
    const { error, loading, callApi } = useApi();
    const { id } = useParams();
    const navigate = useNavigate();
    const [incomeFields, setIncomeFields] = useState([]);
    const fieldType = getFormType(); // Moved outside state since it's static

    // Memoized function to fetch form fields
    const getFormFields = useCallback(async () => {
        const endpoint = id ? `personalfinance/income/${id}/` : 'personalfinance/income/';
        const response = await callApi({ url: endpoint });

        if (response?.status === 200) {
            setIncomeFields(response.data.data.incomeFields);
        }
    }, [id, callApi]);

    // Fetch form fields on mount
    useEffect(() => {
        getFormFields();
    }, []);

    // Form submission handler
    const onSubmit = useCallback(async (data) => {
        const endpoint = id ? `personalfinance/income/${id}/` : 'personalfinance/income/';
        const response = await callApi({
            url: endpoint,
            method: 'POST',
            body: data
        });

        if (response?.status === 201) {
            methods.reset();
            toast.success(response.data.message);
        }
    }, [id, callApi, methods]);

    // Action handler for different button actions
    const handleAction = useCallback(async (e, action) => {
        e.preventDefault();

        // Only validate for submit actions
        if (action !== "CANCEL") {
            const isValid = await methods.trigger();
            if (!isValid) return; // Stop if validation fails
        }

        switch (action) {
            case "ANOTHER":
                methods.clearErrors();
                await methods.handleSubmit(onSubmit)();
                break;
            case "CANCEL":
                methods.clearErrors();
                navigate('/pf/manage/finance');
                break;
            case "PASS":
                await methods.handleSubmit(onSubmit)();
                navigate('/pf/manage/finance');
                break;
        }
    }, [methods, navigate, onSubmit]);

    // Set default date for date_of_received field
    // useEffect(() => {
    //     if (incomeFields.length > 0) {
    //         methods.setValue("date_of_received", new Date().toISOString().split('T')[0]);
    //     }
    // }, [methods, incomeFields]);

    // Early return if loading
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading form</div>;

    return (
        <Box>
            <FormProvider {...methods}>
                <form>
                    {/* Header Section */}
                    <Box display="flex" justifyContent="space-between">
                        <Breadcrumbs aria-label="breadcrumb">
                            <Typography variant="body2">Home</Typography>
                            <Typography variant="body2">Personal Finance</Typography>
                            <Typography variant="body2">{id ? "Edit" : "Create"} Income</Typography>
                        </Breadcrumbs>
                    </Box>

                    <Typography variant="h6" mt={2} gutterBottom>
                        Income Details
                    </Typography>

                    {/* Form Fields */}
                    <Grid container spacing={3}>
                        {fieldType?.map((field) =>
                            incomeFields?.[field]?.map((field1) => (
                                <Grid
                                    item
                                    xs={12}
                                    md={field1.fullWidth ? 12 : 6}
                                    key={field1.name}
                                >
                                    <CommonInputComponent
                                        field={{
                                            ...field1,
                                            default: field1.name === "date_of_received" ? new Date().toISOString().split('T')[0] : field1.default,
                                            // disabled: id && field1.name === "amount"
                                        }}
                                    />
                                </Grid>
                            ))
                        )}
                    </Grid>

                    {/* Action Buttons */}
                    <Grid item xs={12} mt={3}>
                        <Box display="flex" justifyContent="flex-end" gap={2}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={(e) => handleAction(e, "CANCEL")}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={(e) => handleAction(e, "PASS")}
                            >
                                Save Income
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={(e) => handleAction(e, "ANOTHER")}
                            >
                                Save & Add Another
                            </Button>
                        </Box>
                    </Grid>
                </form>
            </FormProvider>
        </Box>
    );
};

export default React.memo(CreateIncome);