import { Box, Breadcrumbs, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import RiskTabs from '../../layout/RiskTabs';
const ManageRisk = () => {
    const navigate = useNavigate();
    return (
        <div>
            <Box display={'flex'} justifyContent={"space-between"} mb={3}>
                <Breadcrumbs>
                    <Typography variant="body2" onClick={() => navigate('/')}>Home</Typography>
                    <Typography variant="body2" onClick={() => navigate('/manage/risk')}>Risk Management</Typography>
                </Breadcrumbs>
            </Box>
            <RiskTabs />
        </div>
    )
}
export default ManageRisk;
