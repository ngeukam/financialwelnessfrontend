import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    IconButton,
    Chip,
    Divider,
    useTheme,
    TextField,
    Grid
} from '@mui/material';
import {
    AddCircle,
    Delete,
    Edit
} from '@mui/icons-material';
import { formatDate, getUser } from '../utils/Helper';
import { useNavigate } from 'react-router-dom';
import useApi from "../hooks/APIHandler";
import { DataGrid } from '@mui/x-data-grid';

const IncomeDashboard = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [totalItems, setTotalItems] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [data, setData] = useState([]);
    const { error, loading, callApi } = useApi();
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [columns, setColumns] = useState([]);
    const [debounceSearch, setDebounceSearch] = useState("");
    const [ordering, setOrdering] = useState([{ field: 'id', sort: 'desc' }]);


    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceSearch(searchQuery);
        }, 1000)

        return () => {
            clearTimeout(timer);
        }
    }, [searchQuery])

    const getExpenses = async () => {
        let order = '-id';
        if (ordering.length > 0) {
            order = ordering[0].sort === 'asc' ? ordering[0].field : '-' + ordering[0].field
        }
        const result = await callApi({
            url: 'personalfinance/incomes-list/', method: 'GET', params: {
                page: paginationModel.page + 1,
                pageSize: paginationModel.pageSize,
                search: debounceSearch,
                ordering: order
            }
        })
        if (result) {
            setData(result.data.data.data);
            setTotalItems(result.data.data.totalItems);
            setTotalExpense(result.data.total_income);
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
        console.log(params);
        navigate(`/form/income/${params.row.id}`)
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
                field: 'frequency',
                headerName: 'Frequency',
                width: 120
            },
            {
                field: 'source',
                headerName: 'Source',
                width: 120,
            },
            {
                field: 'amount',
                headerName: 'Amount',
                width: 120,
                renderCell: (params) => (
                    <Typography variant="outlined" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                        +{getUser().currency}{params.row.amount?.toLocaleString()}
                    </Typography>
                )
            },
            {
                field: 'description',
                headerName: 'Description',
                width: 200
            },
            {
                field: 'date_of_received',
                headerName: 'Received On',
                width: 120,
                renderCell: (params) => (
                    <Typography variant="outlined">
                        {formatDate(params.row.date_of_received)}
                    </Typography>
                )
            },

        ];
        setColumns(columns);
    };

    const onAddClick = (params) => {
        navigate('/form/income')
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
                background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                color: 'white'
            }}>
                <Box>
                    <Typography variant="overline" sx={{ opacity: 0.8 }}>Total Incomes</Typography>
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
                        Create Income
                    </Button>

                </Box>
            </Box>

            <Grid container>
                <Box sx={{ p: 2 }}>
                    <Typography variant="h6">Recent Transactions</Typography>
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

            </Grid>
        </Box>
    );
};

export default IncomeDashboard;