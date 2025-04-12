import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Grid, Card, CardContent, Paper, styled, LinearProgress, Typography, CardActions, MenuItem, Select, Pagination, Chip, CircularProgress, Tooltip } from "@mui/material";
import { AddCircle, AttachMoney, CalendarToday,  ArrowUpward as ArrowUpwardIcon, ErrorOutline } from "@mui/icons-material";
import useApi from "../hooks/APIHandler";
import { calculateTimeRemaining, getUser } from "../utils/Helper";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const GoalsCard = styled(Card)(({ theme }) => ({
    borderRadius: '16px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    background: theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)' // Dark mode gradient
        : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', // Light mode gradient
    color: theme.palette.common.white,
}))
const StrategyCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    borderRadius: '12px',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    height: '100%',
}));

const Goals = ({ theme }) => {
    const [data, setData] = useState([]);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 6
    })
    const [totalItems, setTotalItems] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [debounceSearch, setDebounceSearch] = useState("");
    const [ordering, setOrdering] = useState([{ field: 'id', sort: 'desc' }]);
    const [showImages, setShowImages] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const { error, loading, callApi } = useApi();
    const divImage = useRef();
    const navigate = useNavigate();
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceSearch(searchQuery);
        }, 1000)

        return () => {
            clearTimeout(timer);
        }
    }, [searchQuery])

    const getGoals = async () => {
        let order = '-id';
        if (ordering.length > 0) {
            order = ordering[0].sort === 'asc' ? ordering[0].field : '-' + ordering[0].field
        }
        const result = await callApi({
            url: 'personalfinance/goals-list/', method: 'GET', params: {
                page: paginationModel.page + 1,
                pageSize: paginationModel.pageSize,
                search: debounceSearch,
                ordering: order
            }
        })
        if (result) {
            setData(result.data.data.data);
            setTotalItems(result.data.data.totalItems);
        }
    }

    const onDeleteClick = (params) => {
        console.log(params);
    }
    const onEditClick = (params) => {
        console.log('params', params);
        navigate(`/pf/create/goal/${params.id}`)
    }
    const onAddClick = (params) => {
        console.log(params);
        navigate('/pf/create/goal')
    }

    useEffect(() => {
        if (showImages) {
            divImage.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [selectedImages])

    useEffect(() => {
        getGoals();
    }, [paginationModel, debounceSearch, ordering])

    return (
        <Box component={"div"} sx={{ width: '100%' }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <GoalsCard>
                        <CardContent sx={{ position: 'relative' }}>
                            {/* Animated background gradient */}
                            <Box sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'linear-gradient(135deg, rgba(79,172,254,0.15) 0%, rgba(0,242,96,0.1) 100%)',
                                borderRadius: 'inherit',
                                zIndex: 0,
                                opacity: 0.7
                            }} />

                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                                {/* Header with subtle animation on hover */}
                                <Box sx={{
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateX(2px)'
                                    }
                                }}>
                                    <Typography
                                        variant="overline"
                                        sx={{
                                            opacity: 0.8,
                                            letterSpacing: '1.5px',
                                            display: 'block',
                                            mb: 0.5
                                        }}
                                    >
                                        TOTAL BUDGET
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            fontWeight: 'bold',
                                            mb: 2,
                                            background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            MozBackgroundClip: 'text',
                                            MozTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                            textFillColor: 'white',
                                            display: 'inline-block',
                                            color: 'white'
                                        }}
                                    >
                                        {getUser().currency}{data[0]?.total_budget_current_month?.toLocaleString() || '0.00'}
                                    </Typography>

                                    {/* Chip with pulse animation */}
                                    <Chip
                                        label="This month"
                                        size="small"
                                        sx={{
                                            backgroundColor: 'rgba(255,255,255,0.25)',
                                            color: 'white',
                                            fontWeight: 'medium',
                                            backdropFilter: 'blur(5px)',
                                            ml: 1.5,
                                            animation: 'pulse 2s infinite',
                                            '@keyframes pulse': {
                                                '0%': { opacity: 0.8 },
                                                '50%': { opacity: 1 },
                                                '100%': { opacity: 0.8 }
                                            }
                                        }}
                                    />
                                </Box>

                                {/* Button with elegant hover effect */}
                                <Box sx={{
                                    display: 'flex',
                                    gap: 2,
                                    mt: 3
                                }}>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddCircle sx={{ transition: 'all 0.3s ease' }} />}
                                        sx={{
                                            backgroundColor: 'white',
                                            color: '#4facfe',
                                            borderRadius: '12px',
                                            textTransform: 'none',
                                            px: 3,
                                            py: 1,
                                            boxShadow: '0 4px 15px rgba(79, 172, 254, 0.3)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 6px 20px rgba(79, 172, 254, 0.4)',
                                                '& .MuiSvgIcon-root': {
                                                    transform: 'scale(1.1)'
                                                }
                                            }
                                        }}
                                        onClick={() => onAddClick()}
                                    >
                                        <Typography variant="outlined" sx={{ fontWeight: 'medium' }}>
                                            Create Goal
                                        </Typography>
                                    </Button>
                                </Box>
                            </Box>
                        </CardContent>
                    </GoalsCard>
                </Grid>
                <Grid item xs={12} md={6}>
                    <StrategyCard>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            New case
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Very Saving Strategies
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Button
                                variant="outlined"
                                size="small"
                                sx={{
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                }}
                            >
                                Learn more
                            </Button>
                        </Box>
                    </StrategyCard>
                </Grid>
            </Grid>
            <Grid container spacing={2} mt={2}>

                <Grid item xs={12} sm={showImages ? 8 : 12} lg={showImages ? 9 : 12}>
                    {/* Card List Section */}
                    <Typography gutterBottom variant="h6" component="div">
                        Goals List
                    </Typography>
                    <Grid container spacing={3}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : (

                            data.map((goal) => {
                                // Determine priority color
                                const priorityColor = {
                                    'HIGH': 'error.main',
                                    'MEDIUM': 'warning.main',
                                    'LOW': 'info.main'
                                }[goal.priority] || 'primary.main';

                                // Calculate progress percentage
                                const progress = Math.min((goal.total_expenses / goal.budget) * 100, 100);

                                return (
                                    <Grid item xs={12} sm={6} md={4} key={goal.id}>
                                        <Card sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            borderLeft: `4px solid ${theme?.palette[priorityColor.split('.')[0]][priorityColor.split('.')[1]]}`,
                                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                            transition: 'all 0.3s ease',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            background: 'linear-gradient(to bottom right, #ffffff, #f9f9f9)',
                                            '&:hover': {
                                                transform: 'translateY(-6px)',
                                                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)'
                                            }
                                        }}>
                                            <CardContent sx={{
                                                flexGrow: 1,
                                                padding: '24px'
                                            }}>
                                                {/* Priority Indicator */}
                                                <Chip
                                                    label={goal.priority}
                                                    size="small"
                                                    sx={{
                                                        mb: 2,
                                                        backgroundColor: priorityColor,
                                                        color: 'white',
                                                        fontWeight: 'bold',
                                                        fontSize: '0.75rem',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px',
                                                        borderRadius: '4px',
                                                        padding: '0 8px',
                                                        height: '24px'
                                                    }}
                                                />

                                                <Typography
                                                    gutterBottom
                                                    variant="h6"
                                                    component="div"
                                                    sx={{
                                                        fontWeight: '600',
                                                        fontSize: '1.1rem',
                                                        color: '#2d3748',
                                                        mb: 2,
                                                        fontFamily: "'Poppins', sans-serif",
                                                        lineHeight: '1.4'
                                                    }}
                                                >
                                                    {goal.description}
                                                </Typography>

                                                <Box sx={{ mb: 2 }}>
                                                    <Typography variant="body2" sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        mb: 1,
                                                        color: '#4a5568',
                                                        fontSize: '0.875rem'
                                                    }}>
                                                        <Box component="span" sx={{
                                                            fontWeight: '600',
                                                            minWidth: '90px',
                                                            color: '#2d3748',
                                                            display: 'inline-flex',
                                                            alignItems: 'center'
                                                        }}>
                                                            <AttachMoney sx={{ fontSize: '16px', mr: 0.5 }} />
                                                            Target:
                                                        </Box>
                                                        <Box component="span" sx={{ fontWeight: '500' }}>
                                                            {getUser().currency}{goal.budget?.toLocaleString()}
                                                        </Box>
                                                    </Typography>

                                                    <Typography variant="body2" sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        color: '#4a5568',
                                                        fontSize: '0.875rem'
                                                    }}>
                                                        <Box component="span" sx={{
                                                            fontWeight: '600',
                                                            minWidth: '90px',
                                                            color: '#2d3748',
                                                            display: 'inline-flex',
                                                            alignItems: 'center'
                                                        }}>
                                                            <CalendarToday sx={{ fontSize: '16px', mr: 0.5 }} />
                                                            Target Date:
                                                        </Box>
                                                        <Box component="span" sx={{ fontWeight: '500' }}>
                                                            {new Date(goal.end_date)?.toLocaleDateString()}
                                                        </Box>
                                                    </Typography>
                                                </Box>

                                                {/* Progress Bar */}
                                                <Box sx={{ mt: 3, mb: 2 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Typography variant="body2" sx={{
                                                                fontWeight: '600',
                                                                color: '#2d3748',
                                                                fontSize: '0.875rem',
                                                                mr: 1
                                                            }}>
                                                                {Math.round(progress)}%
                                                            </Typography>
                                                            {goal.total_expenses > goal.budget && (
                                                                <Tooltip title="Budget exceeded" arrow>
                                                                    <ErrorOutline sx={{
                                                                        color: '#ef4444',
                                                                        fontSize: '1rem'
                                                                    }} />
                                                                </Tooltip>
                                                            )}
                                                        </Box>
                                                        <Typography variant="body2" sx={{
                                                            fontWeight: '500',
                                                            color: goal.total_expenses > goal.budget ? '#ef4444' : '#4a5568',
                                                            fontSize: '0.875rem',
                                                            display: 'flex',
                                                            alignItems: 'center'
                                                        }}>
                                                            {getUser().currency}{goal.total_expenses?.toLocaleString()}
                                                            <span style={{ margin: '0 4px' }}>/</span>
                                                            {getUser().currency}{goal.budget?.toLocaleString()}
                                                            {goal.total_expenses > goal.budget && (
                                                                <Tooltip title={`Exceeded by ${getUser().currency}${(goal.total_expenses - goal.budget).toLocaleString()}`} arrow>
                                                                    <ArrowUpwardIcon sx={{
                                                                        color: '#ef4444',
                                                                        fontSize: '0.875rem',
                                                                        ml: 0.5
                                                                    }} />
                                                                </Tooltip>
                                                            )}
                                                        </Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={Math.min(progress, 100)}
                                                        sx={{
                                                            height: '8px',
                                                            borderRadius: '8px',
                                                            backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                                            '& .MuiLinearProgress-bar': {
                                                                backgroundColor: goal.reached === 'YES' ? '#10b981' :
                                                                    goal.total_expenses > goal.budget ? '#ef4444' : priorityColor,
                                                                borderRadius: '8px',
                                                                boxShadow: goal.reached === 'YES' ? '0 2px 4px rgba(16, 185, 129, 0.3)' :
                                                                    goal.total_expenses > goal.budget ? '0 2px 4px rgba(239, 68, 68, 0.3)' : 'none'
                                                            }
                                                        }}
                                                    />
                                                </Box>

                                                {/* Time remaining indicator */}
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    mt: 3,
                                                    mb: 1,
                                                    padding: '8px 12px',
                                                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                                                    borderRadius: '8px',
                                                    borderLeft: '3px solid #e2e8f0'
                                                }}>
                                                    <AccessTimeIcon fontSize="small" sx={{
                                                        mr: 1,
                                                        color: '#4a5568',
                                                        fontSize: '18px'
                                                    }} />
                                                    <Typography variant="caption" sx={{
                                                        fontWeight: '500',
                                                        color: '#4a5568',
                                                        fontSize: '0.75rem',
                                                        letterSpacing: '0.2px'
                                                    }}>
                                                        {calculateTimeRemaining(goal.end_date)}
                                                    </Typography>
                                                </Box>
                                            </CardContent>

                                            <CardActions sx={{
                                                justifyContent: 'space-between',
                                                padding: '16px 24px',
                                                borderTop: '1px solid rgba(0, 0, 0, 0.05)',
                                                backgroundColor: '#f8fafc'
                                            }}>
                                                <Button
                                                    size="small"
                                                    startIcon={<EditIcon sx={{ fontSize: '18px' }} />}
                                                    onClick={() => onEditClick(goal)}
                                                    sx={{
                                                        color: '#4a5568',
                                                        fontWeight: '500',
                                                        fontSize: '0.8125rem',
                                                        textTransform: 'none',
                                                        letterSpacing: '0.2px',
                                                        '&:hover': {
                                                            color: '#3182ce',
                                                            backgroundColor: 'rgba(49, 130, 206, 0.04)'
                                                        }
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="small"
                                                    startIcon={<DeleteIcon sx={{ fontSize: '18px' }} />}
                                                    onClick={() => onDeleteClick(goal)}
                                                    sx={{
                                                        color: '#e53e3e',
                                                        fontWeight: '500',
                                                        fontSize: '0.8125rem',
                                                        textTransform: 'none',
                                                        letterSpacing: '0.2px',
                                                        '&:hover': {
                                                            color: '#c53030',
                                                            backgroundColor: 'rgba(229, 62, 62, 0.04)'
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                );
                            })
                        )}
                    </Grid>
                    {/* Pagination Controls */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Pagination
                            count={Math.ceil(totalItems / paginationModel.pageSize)}
                            page={paginationModel.page + 1}
                            onChange={(event, page) => {
                                setPaginationModel({
                                    ...paginationModel,
                                    page: page - 1
                                });
                            }}
                            color="primary"
                            showFirstButton
                            showLastButton
                        />
                        <Select
                            value={paginationModel.pageSize}
                            onChange={(e) => {
                                setPaginationModel({
                                    ...paginationModel,
                                    pageSize: e.target.value
                                });
                            }}
                            sx={{ ml: 2 }}
                        >
                            <MenuItem value={6}>6 per page</MenuItem>
                            <MenuItem value={16}>12 per page</MenuItem>
                            <MenuItem value={24}>24 per page</MenuItem>
                        </Select>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Goals;