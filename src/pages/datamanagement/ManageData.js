/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { Box, Tabs, Tab, useTheme, useMediaQuery, Typography, Button } from '@mui/material';
import { css } from '@emotion/react';

import DataOverview from '../../components/DataOverview';
import ImportHistory from '../../components/ImportHistory';
import FileInputWithDragDrop from '../../components/FileInputWithDragDrop';
import { FormProvider, useForm } from 'react-hook-form';
import ProcessingOptions from '../../components/ProcessingOptions';
import { Cancel, Upload } from '@mui/icons-material'
import useApi from '../../hooks/APIHandler';
import { toast } from 'react-toastify';
import DataVisualisation from '../../components/DataVisualisation';


export const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`horizontal-tabpanel-${index}`}
            aria-labelledby={`horizontal-tab-${index}`}
            {...other}
            css={css`
        width: 100%;
        height: 100%;
        overflow: auto;
      `}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

const a11yProps = (index) => {
    return {
        id: `horizontal-tab-${index}`,
        'aria-controls': `horizontal-tabpanel-${index}`,
    };
};

const ManageData = () => {
    const { error, loading, callApi } = useApi();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [value, setValue] = useState(0);
    const [fileHistoryId, setfileHistoryId] = useState(null);

    const methods = useForm();
    const { control } = methods;

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const onSubmit = async (data) => {
        const formData = new FormData();
        // Append files if they exist
        if (data.dataFiles) {
            data.dataFiles.forEach(file => {
                formData.append('data_files', file);
            });
        }
        // Append processing options
        formData.append('data_name', data.data_name);
        formData.append('date_format', data.date_format);
        formData.append('currency', data.currency || 'XAF');
    
        // Ajoutez les options de traitement comme champs séparés
        formData.append('delete_duplicate', data.delete_duplicate);
        formData.append('merge_existing', data.merge_existing);

        const response = await callApi({ url: 'datamanagement/process-and-upload/', method: 'POST', body: formData });
        if (response?.status === 201) {
            methods.reset();
            setValue(0);
            toast.success(response.data.message);
        }

    };

    const UploadData = async (e) => {
        console.log(methods.formState.errors);
        e.preventDefault();
        methods.handleSubmit(onSubmit)();
    }
    return (
        <Box
            sx={{
                flexGrow: 1,
                bgcolor: 'background.paper',
                display: 'flex',
                height: '100%',
                flexDirection: 'column',
            }}
        >
            <Box
                sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    width: '100%',
                }}
            >
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant={isMobile ? 'scrollable' : 'standard'}
                    scrollButtons={isMobile ? 'auto' : false}
                    aria-label="Main tabs"
                    css={css`
                    .MuiTab-root {
                    text-transform: none;
                    font-weight: ${theme.typography.fontWeightMedium};
                    min-width: 120px;
                    padding: ${isMobile ? '12px 16px' : '16px 24px'};
                    transition: all 0.3s ease;
                    
                    &:hover {
                        color: ${theme.palette.primary.main};
                        background-color: ${theme.palette.action.hover};
                    }
                    
                    &.Mui-selected {
                        color: ${theme.palette.primary.main};
                    }
                    }
                    
                    .MuiTabs-indicator {
                    height: 3px;
                    background: linear-gradient(
                        to right,
                        ${theme.palette.primary.light},
                        ${theme.palette.primary.dark}
                    );
                    }
                `}
                >
                    <Tab label="Data Overview" {...a11yProps(0)} />
                    <Tab label="Import History" {...a11yProps(1)} />
                    <Tab label="Data Upload" {...a11yProps(2)} />
                    <Tab label="Data Visualisation" {...a11yProps(3)} />
                </Tabs>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    overflow: 'auto',
                    width: '100%',
                }}
            >
                <TabPanel value={value} index={0}>
                    <DataOverview file_history_id={fileHistoryId?.id}/>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <ImportHistory setValue={setValue} setfileHistoryId={setfileHistoryId} />
                </TabPanel>
                <FormProvider {...methods}>
                    <form>
                        <TabPanel value={value} index={2}>
                            <Box sx={{ p: 3 }}>
                                <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                                    Data Upload
                                </Typography>
                                <FileInputWithDragDrop
                                    field={{
                                        name: 'dataFiles',
                                        required: true,
                                        multiple: true,
                                        maxFiles: 5,
                                        maxSize: 5 * 1024 * 1024, // 5MB
                                        description: 'Drag and drop files or click to browse (max 5 files)'
                                    }}
                                    control={control}
                                />
                            </Box>
                            <ProcessingOptions />
                            <Box justifyContent={"space-between"} display={"flex"} sx={{ mt: 1 }}>
                                <Button
                                    variant="contained"
                                    sx={{ m: 2 }}
                                    startIcon={<Cancel />}
                                    color="primary"
                                    type="button"
                                    onClick={() => methods.reset()}
                                    fullWidth
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{ m: 2 }}
                                    type="button"
                                    startIcon={<Upload />}
                                    color="primary"
                                    fullWidth
                                    disabled={loading}
                                    onClick={(e) => UploadData(e)}
                                >
                                    {loading ? 'Processing...' : 'Upload & Process'}
                                </Button>
                            </Box>

                        </TabPanel>
                    </form>
                </FormProvider>
                <TabPanel value={value} index={3}>
                    <DataVisualisation />
                </TabPanel>
            </Box>
        </Box>
    );
};

export default ManageData;