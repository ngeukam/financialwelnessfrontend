import React from 'react'
import PFTabs from '../../layout/PFTabs'
import { Box, Breadcrumbs, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
const ManageFinance = () => {
    const navigate = useNavigate();
    return (
        <div>
            <Box display={'flex'} justifyContent={"space-between"} mb={3}>
                <Breadcrumbs>
                    <Typography variant="body2" onClick={() => navigate('/')}>Home</Typography>
                    <Typography variant="body2">Personal Finance</Typography>
                    <Typography variant="body2" onClick={() => navigate('pf/manage/finance')}>Finance Management</Typography>
                </Breadcrumbs>
            </Box>
            <PFTabs />
        </div>
    )
}
export default ManageFinance
