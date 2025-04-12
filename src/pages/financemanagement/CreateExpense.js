import {
    Box,
    Breadcrumbs,
    Button,
    Divider,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import useApi from "../../hooks/APIHandler";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { getFormType } from "../../utils/Helper";
import CommonInputComponent from "../../components/CommonInputComponent";
import { Add, CheckCircle, Close, Delete, Save } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import FileInputComponent from "../../components/FileInputComponents";

const CreateExpense = () => {
    const { error, loading, callApi } = useApi();
    const { id } = useParams();
    const [expenseFields, setExpenseFields] = useState([]);
    const [expenseItemFields, setExpenseItemFields] = useState([]);
    const [fieldType, setFieldType] = useState(getFormType());
    const methods = useForm();
    const navigate = useNavigate();

    const getFormFields = async () => {
        const idVar = id ? id + "/" : "";
        const response = await callApi({ url: `personalfinance/expense/${idVar}` });
        console.log('response.data.data',response.data.data)
        if (response && response.status === 200) {
            setExpenseFields(response.data.data.expenseFields);
            setExpenseItemFields(response.data.data.expenseItemFields);
            methods.setValue('items', response.data.data?.expenseItems || []);
        }
    };

    useEffect(() => {
        getFormFields();
    }, []);

    const deleteItem = (index) => {
        let items = methods.watch('items');
        items = items.filter((item, i) => i !== index);
        methods.setValue('items', items);
    };

    const getExpenseItems = () => {
        return methods?.watch('items')?.map((item, index) => (
            <TableRow key={index}>
                <TableCell>
                    <IconButton onClick={() => deleteItem(index)}>
                        <Delete color="error" />
                    </IconButton>
                </TableCell>
                {fieldType.map((fieldT) =>
                    expenseItemFields?.[fieldT]?.map((field) => {
                        let tempField = { ...field };

                        // Set default values based on field name
                        if (tempField.name === 'expense_done') {
                            tempField.default = "NO";  // Default to "NO"
                        } else if (tempField.name === 'date_of_expense') {
                            tempField.default = new Date().toISOString().split('T')[0];  // Today's date in YYYY-MM-DD format
                        } else {
                            tempField.default = item[tempField?.name];  // Original value if exists
                        }

                        tempField.name = `items[${index}].${tempField.name}`;

                        return (
                            <TableCell key={tempField.name}>
                                <CommonInputComponent field={tempField} sx={{ width: 200 }} />
                            </TableCell>
                        );
                    }))
                }
            </TableRow>
        ));
    };

    const onSubmit = async (data) => {
        if (!methods.watch('items') || methods.watch("items").length === 0) {
            toast.error("Please add at least one expense item");
            return;
        }

        const idVar = id ? id + "/" : "";
        const response = await callApi({
            url: `personalfinance/expense/${idVar}`,
            method: 'POST',
            body: data
        });

        if (response?.status === 201) {
            methods.reset();
            toast.success(response.data.message);
            navigate('/pf/manage/finance');
        }
    };

    const createExpense = async (e, status) => {
        e.preventDefault();
        methods.setValue("status", status);
        if (status === "DRAFT") {
            methods.clearErrors();
            await methods.trigger();
        }
        methods.handleSubmit(onSubmit)();
    };

    return (
        <Box>
            <FormProvider {...methods}>
                <form>
                    <Box display="flex" justifyContent={"space-between"}>
                        <Breadcrumbs>
                            <Typography variant="body2">Home</Typography>
                            <Typography variant="body2">Personal Finance</Typography>
                            <Typography variant="body2">{id ? "Edit" : "Create"} Expense</Typography>
                        </Breadcrumbs>
                    </Box>

                    <Typography variant="h6" mt={2}>
                        Expense Details
                    </Typography>

                    <Grid container spacing={2} mt={2} mb={2}>
                        {fieldType?.map((field) =>
                            expenseFields?.[field]?.map((field1) => (
                                <Grid
                                    item
                                    xs={12}
                                    lg={field1.name === "additional_details" ? 12 : 3}
                                    md={field1.name === "additional_details" ? 12 : 4}
                                    sm={field1.name === "additional_details" ? 12 : 6}
                                    key={field1.name}
                                >
                                    {field1.name === "image" ? <FileInputComponent field={field1} /> : <CommonInputComponent field={field1} />}

                                </Grid>
                            ))
                        )}
                    </Grid>

                    <Divider sx={{ mt: 1, mb: 1 }} />

                    <Box display={"flex"} justifyContent={"space-between"}>
                        <Typography variant="h6">Expense Items</Typography>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            color="primary"
                            onClick={() => {
                                methods.setValue('items', [
                                    ...(methods.watch('items') || []),
                                    { amount: 0, target_date: new Date().toISOString().split('T')[0] }
                                ]);
                            }}
                        >
                            Add Item
                        </Button>
                    </Box>

                    <Divider sx={{ mt: 1, mb: 1 }} />

                    <TableContainer component={Paper} sx={{ whiteSpace: "nowrap" }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Action</TableCell>
                                    {fieldType.map((item) =>
                                        expenseItemFields?.[item]?.map((field) => (
                                            <TableCell key={field.name}>{field.label}</TableCell>
                                        ))
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>{getExpenseItems()}</TableBody>
                        </Table>
                    </TableContainer>

                    <Box justifyContent={"space-between"} display={"flex"} sx={{ mt: 2 }}>
                        <Button
                            variant="contained"
                            sx={{ m: 2 }}
                            startIcon={<Save />}
                            color="primary"
                            type="button"
                            onClick={(e) => createExpense(e, "DRAFT")}
                            fullWidth
                        >
                            Save Draft
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ m: 2 }}
                            type="button"
                            startIcon={<CheckCircle />}
                            color="primary"
                            fullWidth
                            onClick={(e) => createExpense(e, "ACTIVE")}
                        >
                            {id ? "Update" : "Create"} Expense
                        </Button>
                    </Box>

                    <input type="hidden" name="status" {...methods.register("status")} />
                </form>
            </FormProvider>
        </Box>
    );
};

export default CreateExpense;