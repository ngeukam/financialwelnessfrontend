import React, { useEffect, useState, useCallback } from 'react';
import { Grid, Button, Box, Typography, Breadcrumbs } from '@mui/material';
import CommonInputComponent from '../../components/CommonInputComponent';
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from 'react-router-dom';
import { getFormType } from '../../utils/Helper';
import useApi from '../../hooks/APIHandler';
import { toast } from 'react-toastify';

const CreateGoal = () => {
    // Hooks and state initialization
    const methods = useForm();
    const { error, loading, callApi } = useApi();
    const { id } = useParams();
    const navigate = useNavigate();
    const [goalFields, setGoalFields] = useState([]);
    const fieldType = getFormType();

    // Memoized function to fetch form fields
    const getFormFields = useCallback(async () => {
        const endpoint = id ? `personalfinance/goal/${id}/` : 'personalfinance/goal/';
        const response = await callApi({ url: endpoint });

        if (response?.status === 200) {
            setGoalFields(response.data.data.goalFields);
        }
    }, [id, callApi]);

    // Fetch form fields on mount
    useEffect(() => {
        getFormFields();
    }, []);

    // Form submission handler
    const onSubmit = useCallback(async (data) => {
        const endpoint = id ? `personalfinance/goal/${id}/` : 'personalfinance/goal/';
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
                            {/* <Typography variant="body2">Goals</Typography> */}
                            <Typography variant="body2">{id ? "Edit" : "Create"} Goal</Typography>
                        </Breadcrumbs>
                    </Box>

                    <Typography variant="h6" mt={2} gutterBottom>
                        Goal Details
                    </Typography>

                    {/* Form Fields */}
                    <Grid container spacing={3}>
                        {fieldType?.map((field) =>
                            goalFields?.[field]?.map((field1) => (
                                <Grid
                                    item
                                    xs={12}
                                    md={field1.fullWidth ? 12 : 6}
                                    key={field1.name}
                                >
                                    <CommonInputComponent
                                        field={{
                                            ...field1,
                                            default: field1.name === "begin_date" ? new Date().toISOString().split('T')[0] :
                                                field1.name === "end_date" ? new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0] :
                                                    field1.default,
                                            label: field1.name === "description" ? "Title of goal" : field1.label,
                                            placeholder: field1.name === "description"
                                                ? "Give a title to your goal..." : field1.name === "percentage" ? "Example enter 10 for 10%"
                                                    : field1.placeholder
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
                                Save Goal
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

export default React.memo(CreateGoal);