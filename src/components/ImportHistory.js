import { useState, useEffect, useRef } from "react";
import useApi from "../hooks/APIHandler";
import { Box, Button, Grid, IconButton, LinearProgress, Link, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { RemoveRedEye, Delete, Download } from "@mui/icons-material";
import ExpandLessRounded from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded';
import Swal from 'sweetalert2'
import ExpanableRow from "./ExpandableRow";

const ImportHistory = ({ setValue, setfileHistoryId }) => {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5
    })
    const [totalItems, setTotalItems] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [debounceSearch, setDebounceSearch] = useState("");
    const [ordering, setOrdering] = useState([{ field: 'id', sort: 'desc' }]);
    const [showImages, setShowImages] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const { error, loading, callApi } = useApi();
    const divImage = useRef();

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceSearch(searchQuery);
        }, 1000)

        return () => {
            clearTimeout(timer);
        }
    }, [searchQuery])

    const getFilesHistory = async () => {
        let order = '-id';
        if (ordering.length > 0) {
            order = ordering[0].sort === 'asc' ? ordering[0].field : '-' + ordering[0].field
        }
        const result = await callApi({
            url: 'datamanagement/upload-files-history/', method: 'GET', params: {
                page: paginationModel.page + 1,
                pageSize: paginationModel.pageSize,
                search: debounceSearch,
                ordering: order
            }
        })
        if (result) {
            setData(result.data.data.data);
            setTotalItems(result.data.data.totalItems);
            generateColumns(result.data.data.data);
        }
    }
    const onDeleteClick = async (params) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await callApi({
                        url: `datamanagement/detele/${params.row.id}/`,
                        method: 'DELETE',
                    });

                    if (response) {
                        Swal.fire("Deleted!", "The data file has been deleted.", "success");
                    } else {
                        throw new Error("Failed to delete the data file.");
                    }
                } catch (error) {
                    Swal.fire("Error!", error.message, "error");
                } finally {
                    await getFilesHistory(); // Refresh data in all cases
                }
            }
        });
    };

    const onSeeOverViewClick = (params) => {
        console.log('params', params)
        setValue(0);
        setfileHistoryId(params)
    }

    // Handle file download
    const handleDownloadFile = async (fileId) => {
        try {
            const response = await callApi({
                url: `datamanagement/download/datafile/${fileId}/`,
                responseType: 'blob' // Important: Tell your API wrapper to return a blob
            });

            console.log('response', response);

            if (response.status === 200) {
                // Create download link
                const url = window.URL.createObjectURL(response.data);
                const link = document.createElement('a');
                link.href = url;

                // Try to get filename from headers or use a default
                const contentDisposition = response.headers?.['content-disposition'] || '';
                const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
                const filename = filenameMatch ? filenameMatch[1] : `file-${fileId}`;

                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                link.remove();

                // Clean up the object URL
                setTimeout(() => window.URL.revokeObjectURL(url), 100);
            } else {
                console.error('Download failed with status:', response.status);
            }
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    const generateColumns = (data) => {
        if (data.length > 0) {
            const columns = [{
                field: 'action', headerName: 'Action', width: 180, sortable: false, renderCell: (params) => {
                    return <>
                        <IconButton onClick={() => onSeeOverViewClick(params)}>
                            <RemoveRedEye color="primary" />
                        </IconButton>
                        <IconButton onClick={() => onDeleteClick(params)}>
                            <Delete color="secondary" />
                        </IconButton>
                    </>
                }
            }, {
                field: 'expand', headerName: 'Expand', width: 100, sortable: false, renderCell: (params) => {
                    return (<IconButton onClick={() => {
                        const updatedRows = data.map((row) => {
                            if (row.id === params.row.id) {
                                if (row?.open) {
                                    row.open = false;
                                }
                                else {
                                    row.open = true;
                                }
                            }
                            return row;
                        })
                        setData([...updatedRows]);
                    }}>
                        {params.row?.open ? <ExpandLessRounded /> : <ExpandMoreRounded />}
                    </IconButton>)
                }
            }];

            for (const key in data[0]) {
                if (key === 'children') {
                    columns.push({
                        field: key, headerName: key.charAt(0).toUpperCase() + key.slice(1).replaceAll("_", " "),
                        width: 150, sortable: false, renderCell: (params) => {
                            return <Typography variant="body2" pt={3} pb={3}>{params.row.children?.length}</Typography>
                        }
                    })
                }
                else if (key === 'file') {  // Special handling for file column
                    columns.push({
                        field: key,
                        headerName: 'File',
                        width: 200,
                        renderCell: (params) => (
                            <Button
                                startIcon={<Download />}
                                variant="contained"
                                onClick={() => window.open(`${params.value}`, '_blank')}
                                size="small"
                            >
                                Download
                            </Button>

                        )
                    })
                }
                else {
                    columns.push({
                        field: key,
                        headerName: key.charAt(0).toUpperCase() + key.slice(1).replaceAll("_", " "),
                        width: 150
                    })
                }
            }

            setColumns(columns);
        }
    }

    const handleSorting = (newModel) => {
        setOrdering(newModel);
    }

    useEffect(() => {
        if (showImages) {
            divImage.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [selectedImages])

    useEffect(() => {
        getFilesHistory();
    }, [paginationModel, debounceSearch, ordering])

    return (
        <Box component={"div"} sx={{ width: '100%' }}>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={showImages ? 8 : 12} lg={showImages ? 9 : 12}>
                    {/* <TextField label="Search" variant="outlined" fullWidth onChange={(e) => setSearchQuery(e.target.value)} margin="normal" /> */}
                    <DataGrid
                        rows={data}
                        columns={columns}
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
                        slots={
                            {

                                loadingOverlay: LinearProgress,
                                toolbar: GridToolbar,
                                row: (props) => {
                                    return <ExpanableRow row={props.row} props={props} onEditClick={onSeeOverViewClick} onDeleteClick={onDeleteClick} setSelectedImages={setSelectedImages} setShowImages={setShowImages} />
                                }
                            }
                        }

                    />
                </Grid>

            </Grid>
        </Box>
    )
}

export default ImportHistory;