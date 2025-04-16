import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Avatar,
    Chip,
    Divider,
    useTheme,
    TextField
} from '@mui/material';
import {
    ImportExport,
    MoreVert,
    AttachMoney,
    Home,
    Fastfood,
    DirectionsCar,
    Build,
    Category,
    Add,
    AddRounded,
    AddCircle,
    Business,
    Delete,
    Edit,
    Movie
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { capitalizeFirstLetter, formatDate, getUser } from '../utils/Helper';
import { useNavigate } from 'react-router-dom';
import useApi from "../hooks/APIHandler";
import { DataGrid } from '@mui/x-data-grid';
import { getCategoryListIcon } from '../utils/Helper';

// Composant stylisé pour les cartes de catégorie
const CategoryCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: theme.shadows[6]
    }
}));

const ExpenseDashboard = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [totalItems, setTotalItems] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [data, setData] = useState([]);
    const [dataCategories, setDataCategories] = useState([]);
    const { error, loading, callApi } = useApi();
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [columns, setColumns] = useState([]);
    const [debounceSearch, setDebounceSearch] = useState("");
    const [ordering, setOrdering] = useState([{ field: 'id', sort: 'desc' }]);
    // Icônes pour le tableau
    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Housing': return <Home fontSize="small" />;
            case 'Food': return <Fastfood fontSize="small" />;
            case 'Transportation': return <DirectionsCar fontSize="small" />;
            case 'Utilities': return <Build fontSize="small" />;
            case 'Business': return <Business color="small" />;
            case 'Entertainment': return <Movie color="small" />;
            default: return <Category fontSize="small" />;
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceSearch(searchQuery);
        }, 1000)

        return () => {
            clearTimeout(timer);
        }
    }, [searchQuery])

    const flattenExpenseItems = (rawData) => {
        let flat = [];
        rawData.forEach(expense => {
            expense.items.forEach(item => {
                flat.push({
                    id: `${expense.id}-${item.id}`,
                    parent_id: expense.id,
                    description: capitalizeFirstLetter(expense.description)+": "+capitalizeFirstLetter(expense.expense_note),
                    category_name: item.category_name,
                    price: item.price,
                    date_of_expense: formatDate(item.date_of_expense)
                });
            });
        });
        return flat;
    };

    const getExpenses = async () => {
        let order = '-id';
        if (ordering.length > 0) {
            order = ordering[0].sort === 'asc' ? ordering[0].field : '-' + ordering[0].field
        }
        const result = await callApi({
            url: 'personalfinance/expenses/', method: 'GET', params: {
                page: paginationModel.page + 1,
                pageSize: paginationModel.pageSize,
                search: debounceSearch,
                ordering: order
            }
        })
        if (result) {
            const flatData = flattenExpenseItems(result.data.data.data);
            setData(flatData);
            setTotalItems(result.data.data.totalItems);
            setTotalExpense(result.data.total_expense);
            setDataCategories(result.data.categories_summary)
            generateColumns(result.data.data.data);

        }
    }
    useEffect(() => {
        getExpenses();
    }, [paginationModel, debounceSearch, ordering])

    const onDeleteClick = (params) => {
        console.log(params);
    }
    const onEditClick = (params) => {
        navigate(`/pf/create/expense/${params.row.parent_id}`)
    }
    const generateColumns = () => {
        const columns = [
            {
                field: 'action', headerName: 'Action', width: 120, sortable: false,
                renderCell: (params) => (
                    <>
                        <IconButton onClick={() => onEditClick(params)}>
                            <Edit color="primary" />
                        </IconButton>
                        <IconButton onClick={() => onDeleteClick(params)}>
                            <Delete color="secondary" />
                        </IconButton>
                    </>
                )
            },
            {
                field: 'description',
                headerName: 'Description',
                width: 200
            },
            {
                field: 'price',
                headerName: 'Total',
                width: 120,
                renderCell: (params) => (
                    <Typography variant="outlined" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                        -{getUser().currency}{params.value?.toLocaleString()}
                    </Typography>
                )
            },
            {
                field: 'date_of_expense',
                headerName: 'Spend On',
                width: 200
            },
            {
                field: 'category_name',
                headerName: 'Category',
                width: 180,
                renderCell: (params) => (
                    <Chip
                        icon={getCategoryIcon(params.value)}
                        label={params.value}
                        size="small"
                        variant="outlined"
                    />
                )
            },
            {
                field: 'created_at',
                headerName: 'Created At',
                width: 200,
            },
        ];
        setColumns(columns);
    };

    const onAddClick = (params) => {
        navigate('/pf/create/expense')
    }
    const handleSorting = (newModel) => {
        setOrdering(newModel);
    }
    return (
        <Box sx={{ p: 3, backgroundColor: theme.palette.background.default }}>
            {/* Header Section */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
                p: 3,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
                color: 'white'
            }}>
                <Box>
                    <Typography variant="overline" sx={{ opacity: 0.8 }}>Total Expenses</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {getUser().currency}{totalExpense.toLocaleString()}
                    </Typography>
                    <Chip
                        label="This month"
                        size="small"
                        sx={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            fontWeight: 'medium'
                        }}
                    />
                </Box>

                <Box>
                    <Button
                        variant="outlined"
                        startIcon={<AddCircle />}
                        sx={{
                            textTransform: 'none',
                            color: 'white',
                            borderColor: 'white',
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                borderColor: 'white'
                            }
                        }}
                        onClick={() => onAddClick()}
                    >
                        Create Expense
                    </Button>

                </Box>
            </Box>

            <Grid container spacing={3}>
                {/* Expenses by Category Section */}
                <Grid item xs={12} md={5}>
                    <Paper elevation={0} sx={{
                        p: 2,
                        height: '100%',
                        borderRadius: 3,
                        border: `1px solid ${theme.palette.divider}`
                    }}>
                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                            <AttachMoney sx={{ mr: 1 }} /> Expenses by Category
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        {dataCategories.map((category, index) => (
                            <CategoryCard
                                key={index}
                                sx={{ mb: 2 }}
                                elevation={2}
                            >
                                <Avatar sx={{
                                    mr: 2,
                                    backgroundColor: theme.palette.action.hover
                                }}>
                                    {/* {category.icon} */}
                                    {getCategoryListIcon(category.category_name)}
                                </Avatar>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="subtitle1">{category.category_name}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {((category.total_amount / totalExpense) * 100).toFixed(1)}% of total
                                    </Typography>
                                </Box>
                                <Typography variant="h6">
                                    {getUser().currency}{category.total_amount.toLocaleString()}
                                </Typography>
                            </CategoryCard>
                        ))}
                    </Paper>
                </Grid>

                {/* Recent Transactions Section */}
                <Grid item xs={12} md={7}>
                    <Paper elevation={0} sx={{
                        borderRadius: 3,
                        border: `1px solid ${theme.palette.divider}`
                    }}>
                        <Box sx={{ p: 2 }}>
                            <Typography variant="h6">Expenses List</Typography>
                        </Box>
                        <Divider />

                        <TextField label="Search" variant="outlined" fullWidth onChange={(e) => setSearchQuery(e.target.value)} margin="normal" />


                        <DataGrid
                            rows={data}
                            columns={columns}
                            getRowId={(row) => row.id}
                            rowHeight={75}
                            autoHeight={true}
                            sortingOrder={['asc', 'desc']}
                            sortModel={ordering}
                            onSortModelChange={handleSorting}
                            paginationMode="server"
                            initialState={{
                                ...data.initialState,
                                pagination: { paginationModel: paginationModel }
                            }}
                            pageSizeOptions={[5, 10, 20]}
                            pagination
                            rowCount={totalItems}
                            loading={loading}
                            rowSelection={false}
                            onPaginationModelChange={(pagedetails) => {
                                setPaginationModel({
                                    page: pagedetails.page,
                                    pageSize: pagedetails.pageSize

                                })
                            }}
                        />

                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ExpenseDashboard;