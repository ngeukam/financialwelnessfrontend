import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    List,
    ListItem,
    ListItemText,
    Divider,
    Chip,
    LinearProgress,
    useTheme,
    CircularProgress
} from '@mui/material';
import {
    ArrowUpward as ArrowUpwardIcon,
    ArrowDownward as ArrowDownwardIcon,
    Home as HomeIcon,
    Restaurant as RestaurantIcon,
    DirectionsCar as DirectionsCarIcon,
    Movie as MovieIcon,
    AccountBalanceWallet as AccountBalanceWalletIcon,
    AttachMoney as AttachMoneyIcon,
    TrendingUp as TrendingUpIcon,
    ShowChart as ShowChartIcon,
    CenterFocusStrong,
    Home,
    Fastfood,
    DirectionsCar,
    Movie,
    Category,
    Business,
    Build,
    LocalGroceryStore,
    HealthAndSafety,
    School,
    ShoppingBag,
    Flight,
    FitnessCenter,
    Pets
} from '@mui/icons-material';
import useApi from '../hooks/APIHandler';
import { getCategoryListIcon, getUser } from '../utils/Helper';
import { formatDate } from '../utils/Helper';

const PersonalFinanceOverview = () => {
    const theme = useTheme();
    const { error, loading, callApi } = useApi();
    const [incomeSummary, setIncomeSummary] = useState({
        current_month_income: 0,
        previous_month_income: 0,
        income_change: 0,
        income_change_percentage: 0
    });
    const [expenseSummary, setExpenseSummary] = useState({
        current_month_expenses: 0,
        previous_month_expenses: 0,
        expense_change: 0,
        expense_change_percentage: 0
    });
    const [goalsSummary, setGoalsSummary] = useState({
        current_month_budget: 0,
        previous_month_budget: 0,
        budget_change: 0,
        budget_change_percentage: 0
    });
    const [recentTransactions, setRecentTransactions] = useState([]);

    console.log('recentTransactions', recentTransactions)

    const getLatestTransactions = async () => {
        const result = await callApi({
            url: 'personalfinance/latest-transactions/', method: 'GET'
        })
        if (result) {
            setRecentTransactions(result.data)

        }
    }

    const getIncomeSummary = async () => {
        const result = await callApi({
            url: 'personalfinance/incomes-summary/', method: 'GET'
        })
        if (result) {
            setIncomeSummary(result.data)

        }
    }
    const getExpenseSummary = async () => {
        const result = await callApi({
            url: 'personalfinance/expenses-summary/', method: 'GET'
        })
        if (result) {
            console.log('result', result)
            setExpenseSummary(result.data)

        }
    }
    const getGoalsSummary = async () => {
        const result = await callApi({
            url: 'personalfinance/goals-summary/', method: 'GET'
        })
        if (result) {
            setGoalsSummary(result.data)

        }
    }
    useEffect(() => {
        getIncomeSummary();
        getExpenseSummary();
        getGoalsSummary();
        getLatestTransactions();
    }, [])

    const categoryStyles = {
        'Housing': { icon: <Home />, color: '#6366f1' },        // Indigo
        'Food': { icon: <Fastfood />, color: '#10b981' },      // Emerald
        'Transportation': { icon: <DirectionsCar />, color: '#f59e0b' }, // Amber
        'Entertainment': { icon: <Movie />, color: '#8b5cf6' }, // Violet
        'Business': { icon: <Business />, color: '#0ea5e9' },   // Sky Blue
        'Utilities': { icon: <Build />, color: '#84cc16' },     // Lime
        'Groceries': { icon: <LocalGroceryStore />, color: '#ec4899' }, // Pink
        'Healthcare': { icon: <HealthAndSafety />, color: '#ef4444' }, // Red
        'Education': { icon: <School />, color: '#14b8a6' },    // Teal
        'Shopping': { icon: <ShoppingBag />, color: '#f97316' }, // Orange
        'Travel': { icon: <Flight />, color: '#a855f7' },       // Purple
        'Fitness': { icon: <FitnessCenter />, color: '#22d3ee' }, // Cyan
        'Pets': { icon: <Pets />, color: '#65a30d' },           // Green
        'Other Expenses': { icon: <Category />, color: '#64748b' } // Gray
    };
    if (loading) {
        return (<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
        </Box>)
    }
    return (
        <Box sx={{
            p: 4,
            backgroundColor: '#f8fafc',
            minHeight: '100vh',
            [theme.breakpoints.down('sm')]: { p: 2 }
        }}>
            <Typography variant="h4" sx={{
                mb: 4,
                fontWeight: 700,
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center'
            }}>
                <AccountBalanceWalletIcon sx={{ mr: 2, fontSize: '2rem' }} />
                Financial Overview
            </Typography>

            {/*Incomes Card - Full Width*/}
            <Paper sx={{
                p: 3,
                mb: 3,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                border: '1px solid rgba(226, 232, 240, 0.5)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)'
                }
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '12px',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                    }}>
                        <ArrowUpwardIcon sx={{ color: '#10b981' }} />
                    </Box>
                    <Typography variant="subtitle1" color="text.secondary">
                        Incomes
                    </Typography>
                </Box>
                <Typography variant="h3" sx={{
                    fontWeight: 700,
                    mb: 1,
                    color: '#1e293b',
                    fontFeatureSettings: '"tnum"'
                }}>
                    {getUser().currency}{incomeSummary.current_month_income?.toLocaleString()}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip
                        label="This month"
                        size="small"
                        sx={{
                            mr: 1,
                            backgroundColor: 'rgba(226, 232, 240, 0.5)',
                            color: '#64748b'
                        }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#10b981' }}>
                        <ArrowUpwardIcon fontSize="small" />
                        <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 500 }}>
                            {getUser().currency}{incomeSummary.previous_month_income?.toLocaleString()} from last month
                        </Typography>
                    </Box>
                    <Chip
                        label={`${incomeSummary.income_change_percentage?.toFixed(1)}%`}
                        size="small"
                        sx={{
                            ml: 1,
                            backgroundColor: incomeSummary.income_change_percentage >= 0
                                ? 'rgba(16, 185, 129, 0.1)'  // Green for positive
                                : 'rgba(239, 68, 68, 0.1)',  // Red for negative
                            color: incomeSummary.income_change_percentage >= 0
                                ? '#10b981'  // Green text for positive
                                : '#ef4444', // Red text for negative
                            fontWeight: 600
                        }}
                        icon={incomeSummary.income_change_percentage >= 0 ? (
                            <ArrowUpwardIcon fontSize="small" />
                        ) : (
                            <ArrowDownwardIcon fontSize="small" />
                        )}
                    />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                        {incomeSummary.income_change_percentage <= 0 ? 'less' : 'more'} than last month
                    </Typography>
                </Box>
            </Paper>
            {/* Expenses Card - Full Width */}
            <Paper sx={{
                p: 3,
                mb: 3,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                border: '1px solid rgba(226, 232, 240, 0.5)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)'
                }
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '12px',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                    }}>
                        <ArrowDownwardIcon sx={{ color: '#ef4444' }} />
                    </Box>
                    <Typography variant="subtitle1" color="text.secondary">
                        Expenses
                    </Typography>
                </Box>
                <Typography variant="h3" sx={{
                    fontWeight: 700,
                    mb: 1,
                    color: '#1e293b',
                    fontFeatureSettings: '"tnum"'
                }}>
                    {getUser().currency}{expenseSummary.current_month_expenses?.toLocaleString()}

                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip
                        label="This month"
                        size="small"
                        sx={{
                            mr: 1,
                            backgroundColor: 'rgba(226, 232, 240, 0.5)',
                            color: '#64748b'
                        }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#ef4444' }}>
                        <ArrowDownwardIcon fontSize="small" />
                        <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 500 }}>
                            {getUser().currency}{expenseSummary.previous_month_expenses?.toLocaleString()} from last month
                        </Typography>
                    </Box>
                    <Chip
                        label={`${expenseSummary.expense_change_percentage?.toFixed(1)}%`}
                        size="small"
                        sx={{
                            ml: 1,
                            backgroundColor: expenseSummary.expense_change_percentage >= 0
                                ? 'rgba(16, 185, 129, 0.1)'  // Green for positive
                                : 'rgba(239, 68, 68, 0.1)',  // Red for negative
                            color: expenseSummary.expense_change_percentage >= 0
                                ? '#10b981'  // Green text for positive
                                : '#ef4444', // Red text for negative
                            fontWeight: 600
                        }}
                        icon={expenseSummary.expense_change_percentage >= 0 ? (
                            <ArrowUpwardIcon fontSize="small" />
                        ) : (
                            <ArrowDownwardIcon fontSize="small" />
                        )}
                    />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                        {expenseSummary.expense_change_percentage <= 0 ? 'less' : 'more'} than last month
                    </Typography>
                </Box>
            </Paper>

            {/* Savings Card - Full Width */}
            <Paper sx={{
                p: 3,
                mb: 3,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                border: '1px solid rgba(226, 232, 240, 0.5)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)'
                }
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '12px',
                        backgroundColor: 'rgba(38, 52, 173, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                    }}>
                        <CenterFocusStrong sx={{ color: '#0000FF' }} />
                    </Box>
                    <Typography variant="subtitle1" color="text.secondary">
                        Goals Budget
                    </Typography>
                </Box>
                <Typography variant="h3" sx={{
                    fontWeight: 700,
                    mb: 1,
                    color: '#1e293b',
                    fontFeatureSettings: '"tnum"'
                }}>
                    {getUser().currency}{goalsSummary.current_month_budget?.toLocaleString()}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip
                        label="This month"
                        size="small"
                        sx={{
                            mr: 1,
                            backgroundColor: 'rgba(226, 232, 240, 0.5)',
                            color: '#64748b'
                        }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#0000FF' }}>
                        <CenterFocusStrong fontSize="small" />
                        <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 500 }}>
                            {getUser().currency}{goalsSummary.previous_month_budget?.toLocaleString()} from last month
                        </Typography>
                    </Box>
                    <Chip
                        label={`${goalsSummary.budget_change_percentage?.toFixed(1)}%`}
                        size="small"
                        sx={{
                            ml: 1,
                            backgroundColor: goalsSummary.budget_change_percentage >= 0
                                ? 'rgba(16, 185, 129, 0.1)'  // Green for positive
                                : 'rgba(239, 68, 68, 0.1)',  // Red for negative
                            color: goalsSummary.budget_change_percentage >= 0
                                ? '#10b981'  // Green text for positive
                                : '#ef4444', // Red text for negative
                            fontWeight: 600
                        }}
                        icon={goalsSummary.budget_change_percentage >= 0 ? (
                            <ArrowUpwardIcon fontSize="small" />
                        ) : (
                            <ArrowDownwardIcon fontSize="small" />
                        )}
                    />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                        {goalsSummary.budget_change_percentage <= 0 ? 'less' : 'more'} than last month
                    </Typography>
                </Box>
            </Paper>

            {/* Budget Overview - Full Width */}
            <Paper sx={{
                p: 3,
                mb: 3,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                border: '1px solid rgba(226, 232, 240, 0.5)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)'
                }
            }}>
                <Typography variant="h6" sx={{
                    fontWeight: 700,
                    mb: 3,
                    color: '#1e293b',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <ShowChartIcon sx={{ mr: 1.5, color: '#6366f1' }} />
                    Budget Overview
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color='#1e293b' sx={{ mb: 1.5 }}>
                        Monthly Budget Allocation
                    </Typography>

                    {expenseSummary?.expense_by_category?.map((category) => {
                        const style = categoryStyles[category.category] || {
                            icon: <Category />,
                            color: '#64748b'
                        };

                        return (
                            <Box key={category.category} sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                                        <Box sx={{
                                            color: style.color,
                                            fontSize: '1rem',
                                            mr: 1,
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                            {style.icon}
                                        </Box>
                                        {category.category}
                                    </Typography>
                                    <Typography variant="body2" color='#1e293b' sx={{ fontWeight: 600 }}>
                                        {getUser().currency}{category.amount.toLocaleString()}
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={category.percentage}
                                    sx={{
                                        height: 6,
                                        borderRadius: 3,
                                        backgroundColor: `${style.color}10`, // Adds opacity
                                        '& .MuiLinearProgress-bar': {
                                            borderRadius: 3,
                                            backgroundColor: style.color
                                        }
                                    }}
                                />
                            </Box>
                        );
                    })}
                </Box>
            </Paper>

            {/* Recent Transactions - Full Width */}
            <Paper sx={{
                p: 3,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                border: '1px solid rgba(226, 232, 240, 0.5)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)'
                }
            }}>
                <Typography variant="h6" sx={{
                    fontWeight: 700,
                    mb: 3,
                    color: '#1e293b',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <TrendingUpIcon sx={{ mr: 1.5, color: '#6366f1' }} />
                    Recent Transactions
                </Typography>

                <List sx={{ '& .MuiListItem-root': { px: 0 } }}>
                    {recentTransactions.map((transaction, index) => (
                        <>
                            <ListItem>
                                <Box sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '12px',
                                    // backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                    backgroundColor: transaction.type === 'income' ? 'success.light' : 'error.light',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 2
                                }}>
                                    {/* <RestaurantIcon sx={{ color: '#ef4444' }} /> */}
                                    {transaction.type === 'income' ? <AccountBalanceWalletIcon sx={{ color: '#FFFFFF' }} /> : getCategoryListIcon(transaction.category, 'white')}

                                </Box>
                                <ListItemText
                                    primary={
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {transaction.description}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" color="text.secondary">
                                            {`${formatDate(transaction.date)} • ${transaction.category ? transaction.category : 'Income'}`}
                                        </Typography>
                                    }
                                />
                                <Typography variant="body1" sx={{ fontWeight: 600,  color: transaction.type === 'income' ? 'success.main' : 'error.main' }}>
                                    {transaction.type === 'income' ? '+' : '-'}{getUser().currency}{transaction.amount.toLocaleString()}
                                </Typography>
                            </ListItem>
                            <Divider component="li" sx={{ my: 1.5 }} />
                        </>
                    ))}

                </List>
            </Paper>
        </Box>
    );
};

export default PersonalFinanceOverview;