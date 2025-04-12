import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Breadcrumbs
} from '@mui/material';
import {
  AccountBalanceWallet,
  ArrowUpward,
  ArrowDownward,
  Add,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  ShowChart,
  PieChartRounded
} from '@mui/icons-material';
import { formatDate, getUser } from '../utils/Helper';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import useApi from '../hooks/APIHandler';
import { getCategoryListIcon } from '../utils/Helper';

const Wallet = () => {
  const [tabValue, setTabValue] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const navigate = useNavigate();
  const { error, loading, callApi } = useApi();
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    let timeoutId;

    const fetchData = async () => {
      try {
        const [chartRes, transactionsRes, summaryRes] = await Promise.all([
          callApi({ url: 'personalfinance/financial-charts/', params: { period: 'monthly', months: 6 } }),
          callApi({ url: 'personalfinance/latest-transactions/' }),
          callApi({ url: 'personalfinance/financial-summary/' })
        ]);
        console.log('transactionsRes', transactionsRes)
        setRecentTransactions(transactionsRes.data);
        setChartData(chartRes.data);
        setWalletBalance(summaryRes.data.total_balance);
        setTotalExpenses(summaryRes.data.total_expenses);
        setTotalIncome(summaryRes.data.total_income);
      } catch (error) {
        console.error('Error fetching financial data:', error);
        // Handle error state if needed
      }
    };

    timeoutId = setTimeout(fetchData, 1000);

    return () => clearTimeout(timeoutId); // Cleanup
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const onAddIncomeClick = () => {
    navigate('/form/income')
  }
  const onAddExpenseClick = () => {
    navigate('/pf/create/expense')
  }
  return (
    <Box component={"div"} sx={{ width: '100%' }}>
      <Box display={'flex'} justifyContent={"space-between"} mb={3}>
        <Breadcrumbs>
          <Typography variant="body2" onClick={() => navigate('/')}>Home</Typography>
          <Typography variant="body2">Personal Finance</Typography>
          <Typography variant="body2" onClick={() => navigate('/pf/wallet')}>Wallet</Typography>
        </Breadcrumbs>
      </Box>
      {/* Wallet Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{
            background: 'linear-gradient(135deg, #3f51b5, #2196f3)',
            color: 'white',
            borderRadius: 2,
            boxShadow: 3
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AccountBalanceWallet sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5">Total Balance</Typography>
              </Box>
              {loading ? (
                <CircularProgress size={30} color="inherit" />
              ) : (
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {getUser().currency}{walletBalance.toLocaleString()}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{
            background: 'linear-gradient(135deg, #4caf50, #8bc34a)',
            color: 'white',
            borderRadius: 2,
            boxShadow: 3
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ArrowUpward sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5">Total Income</Typography>
              </Box>
              {loading ? (
                <CircularProgress size={30} color="inherit" />
              ) : (
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {getUser().currency}{totalIncome.toLocaleString()}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{
            background: 'linear-gradient(135deg, #f44336, #ff5722)',
            color: 'white',
            borderRadius: 2,
            boxShadow: 3
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ArrowDownward sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5">Total Expenses</Typography>
              </Box>
              {loading ? (
                <CircularProgress size={30} color="inherit" />
              ) : (
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {getUser().currency}{totalExpenses.toLocaleString()}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{
        display: 'flex',
        gap: 2,
        mb: 4,
        p: 1,
        // borderRadius: 2,
        // bgcolor: 'background.paper',
        // boxShadow: 1
      }}>
        <Button
          variant="contained"
          startIcon={<Add sx={{ transition: 'transform 0.2s' }} />}
          sx={{
            bgcolor: 'success.main',
            color: 'common.white',
            px: 3,
            py: 1.5,
            borderRadius: 1,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500,
            letterSpacing: 0.5,
            boxShadow: 'none',
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: 'success.dark',
              boxShadow: 2,
              transform: 'translateY(-1px)',
              '& .MuiSvgIcon-root': {
                transform: 'scale(1.1)'
              }
            },
            '&:active': {
              transform: 'translateY(0)'
            }
          }}
          onClick={() => onAddIncomeClick()}
        >
          Add Income
        </Button>
        <Button
          variant="contained"
          startIcon={<Add sx={{ transition: 'transform 0.2s' }} />}
          sx={{
            bgcolor: 'error.main',
            color: 'common.white',
            px: 3,
            py: 1.5,
            borderRadius: 1,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500,
            letterSpacing: 0.5,
            boxShadow: 'none',
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: 'error.dark',
              boxShadow: 2,
              transform: 'translateY(-1px)',
              '& .MuiSvgIcon-root': {
                transform: 'scale(1.1)'
              }
            },
            '&:active': {
              transform: 'translateY(0)'
            }
          }}
          onClick={() => onAddExpenseClick()}
        >
          Add Expense
        </Button>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTabs-indicator': {
              height: 4,
              borderTopLeftRadius: 2,
              borderTopRightRadius: 2,
            }
          }}
        >
          <Tab label="Transactions" icon={<AccountBalanceWallet />} iconPosition="start" />
          <Tab label="Statistics" icon={<ShowChart />} iconPosition="start" />
          <Tab label="Categories" icon={<PieChartRounded />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Recent Transactions */}
      {tabValue === 0 && (
        <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Recent Transactions
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {recentTransactions.map((transaction, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{
                        bgcolor: transaction.type === 'income' ? 'success.light' : 'error.light',
                        // color: transaction.type === 'income' ? 'success.dark' : 'error.dark'
                      }}>
                        {transaction.type === 'income' ? <AccountBalanceWalletIcon sx={{ color: '#FFFFFF' }} /> : getCategoryListIcon(transaction.category, 'white')}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={transaction.description}
                      secondary={`${formatDate(transaction.date)} • ${transaction.category ? transaction.category : 'Income'}`}
                    />
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 'bold',
                        color: transaction.type === 'income' ? 'success.main' : 'error.main'
                      }}
                    >
                      {transaction.type === 'income' ? '+' : '-'}{getUser().currency}{transaction.amount.toLocaleString()}
                    </Typography>
                  </ListItem>
                  {index < recentTransactions.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>
      )}

      {/* Statistics Tab Content */}
      {tabValue === 1 && (
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3, minHeight: 300 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Income vs Expenses
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 250 }}>
            {/* <Typography color="text.secondary">Pie charts will be displayed here</Typography> */}
            <BarChart
              width={800}
              height={400}
              data={chartData.income_vs_expenses.labels.map((label, i) => ({
                name: label,
                income: chartData.income_vs_expenses.income[i],
                expenses: chartData.income_vs_expenses.expenses[i]
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#82ca9d" name="Income" />
              <Bar dataKey="expenses" fill="#8884d8" name="Expenses" />
            </BarChart>
          </Box>
        </Paper>
      )}

      {/* Categories Tab Content */}
      {tabValue === 2 && (
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3, minHeight: 300 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Spending by Category
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 250 }}>
            <PieChart width={600} height={400}>
              <Pie
                data={chartData.spending_by_category.labels.map((label, i) => ({
                  name: label,
                  value: chartData.spending_by_category.data[i],
                  color: chartData.spending_by_category.colors[i]
                }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.spending_by_category.labels.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={chartData.spending_by_category.colors[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default Wallet;