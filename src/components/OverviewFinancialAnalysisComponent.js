import React, { useState } from 'react';
import {
    Box,
    Typography,
    Stepper,
    Step,
    StepLabel,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Button,
    Paper,
    Grid,
    TableContainer,
    Table,
    TableHead,
    TableCell,
    TableBody,
    TableRow
} from '@mui/material';
import {
    Assessment,
    Input,
    Analytics,
    Lightbulb,
    TrendingUp,
    Compare,
    CheckCircle
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import FinancialStepper from './FinancialStepper';

const OverviewFinancialAnalysisComponent = () => {
    const navigate = useNavigate();
    const [showAll, setShowAll] = useState(false);
    // Define your table rows
    const allRows = [
        // Liquidity Ratios
        { ratio: 'Current Ratio', benchmark: '1.2 - 1.8', description: 'Ability to pay short-term debts with current assets' },
        { ratio: 'Quick Ratio', benchmark: '0.8 - 1.2', description: 'Stricter measure (excludes inventories)' },

        // Solvency Ratios
        { ratio: 'Debt-to-Equity', benchmark: '1.0 - 2.0', description: 'Debt/equity balance (higher for equipment-heavy firms)' },
        { ratio: 'Interest Coverage', benchmark: '3.0+', description: 'Ability to pay interest expenses' },

        // Efficiency Ratios
        { ratio: 'Inventory Turnover', benchmark: '4 - 6', description: 'Material turnover frequency/year (varies by specialty)' },
        { ratio: 'Accounts Receivable Turnover', benchmark: '8 - 12', description: 'How quickly clients pay (30-45 day ideal)' },

        // Profitability Ratios
        { ratio: 'Gross Profit Margin', benchmark: '15% - 25%', description: 'Profit after direct costs (higher for specialty trades)' },
        { ratio: 'Net Profit Margin', benchmark: '5% - 10%', description: 'Profit after all costs (lower for competitive bids)' },
        { ratio: 'Return on Assets (ROA)', benchmark: '8% - 12%', description: 'Profit generated per dollar of assets' },
        { ratio: 'Return on Equity (ROE)', benchmark: '15% - 20%', description: 'Profit generated per dollar of equity' },

        // Additional Construction-Specific Ratios
        { ratio: 'Backlog Ratio', benchmark: '6 - 12 months', description: 'Months of secured work (indicates future revenue)' },
        { ratio: 'Change Order Frequency', benchmark: '10% - 20%', description: '% of projects with modifications (impacts profitability)' },
    ];

    // Determine which rows to show based on state
    const visibleRows = showAll ? allRows : allRows.slice(0, 2);
    return (
        <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
            {/* Module Overview Section */}
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h4" sx={{
                    mb: 2,
                    fontWeight: 700,
                    color: '#1e293b',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    Module Overview
                </Typography>
                <Typography variant="body1" paragraph>
                    The Financial Analysis module evaluates your business's financial health by calculating standard financial ratios, comparing them to construction sector benchmarks, and providing personalized recommendations for improvement.
                </Typography>

                <FinancialStepper/>
            </Paper>

            {/* Main Content Grid */}
            <Grid container spacing={3}>
                {/* Left Column - Ratio Analysis */}
                <Grid item xs={12} md={6}>
                    <Card elevation={3}>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={2}>
                                <Assessment color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h5" sx={{
                                    fontWeight: 700,
                                    color: '#1e293b',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    Ratio Calculation & Analysis
                                </Typography>
                            </Box>
                            <Typography variant="body1" paragraph>
                                View calculated ratios, metrics, and insights compared to construction sector benchmarks
                            </Typography>
                            <Divider sx={{ my: 2 }} />

                            {/* 3-Column Benchmark Table */}
                            <Box>
                                <TableContainer component={Paper} sx={{ mb: 2 }}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow sx={{ bgcolor: 'grey.100' }}>
                                                <TableCell sx={{ fontWeight: 700 }}>Ratio</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 700 }}>Construction Benchmark</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 700 }}>Description</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {visibleRows.map((row, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{row.ratio}</TableCell>
                                                    <TableCell align="center">{row.benchmark}</TableCell>
                                                    <TableCell align="center">{row.description}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                <Button
                                    variant="outlined"
                                    onClick={() => setShowAll(!showAll)}
                                >
                                    {showAll ? 'Show Less' : 'Show More'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right Column - Recommendations */}
                <Grid item xs={12} md={6}>
                    <Card elevation={3}>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={2}>
                                <Lightbulb color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h5" sx={{
                                    // mb: 2,
                                    fontWeight: 700,
                                    color: '#1e293b',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>Recommendations & Action Plan</Typography>
                            </Box>
                            <Typography variant="body1" paragraph>
                                Get prioritized actions to improve your financial position
                            </Typography>
                            <Divider sx={{ my: 2 }} />

                            <List>
                                <ListItem>
                                    <ListItemIcon><TrendingUp color="secondary" /></ListItemIcon>
                                    <ListItemText primary="Improve inventory turnover by 15%" secondary="Potential impact: $45,000 annual savings" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon><TrendingUp color="secondary" /></ListItemIcon>
                                    <ListItemText primary="Renegotiate supplier terms" secondary="Could improve cash flow by 30 days" />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Key Benefits Section */}
            <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                <Typography variant="h5" sx={{
                    // mb: 2,
                    fontWeight: 700,
                    color: '#1e293b',
                    display: 'flex',
                    alignItems: 'center'
                }}>Key Benefits</Typography>

                <List>
                    <ListItem>
                        <ListItemIcon><Compare color="primary" /></ListItemIcon>
                        <ListItemText
                            primary="Comprehensive Analysis"
                            secondary="Get a complete picture of your financial health with industry-standard metrics"
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon><Lightbulb color="primary" /></ListItemIcon>
                        <ListItemText
                            primary="Actionable Insights"
                            secondary="Transform complex financial data into clear, practical steps for improvement"
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon><Assessment color="primary" /></ListItemIcon>
                        <ListItemText
                            primary="Construction Benchmarking"
                            secondary="Compare your performance to construction sector standards and identify competitive advantages"
                        />
                    </ListItem>
                </List>

                <Box textAlign="center" mt={4}>
                    <Button variant="contained" size="large"  onClick={() => navigate('/financial-analysis')} color="primary">
                        Get Started with Financial Analysis
                    </Button>
                </Box>
            </Paper>

            <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                <Typography variant="h5" sx={{
                    // mb: 2,
                    fontWeight: 700,
                    color: '#1e293b',
                    display: 'flex',
                    alignItems: 'center'
                }}>Key Features</Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <List>
                            <ListItem>
                                <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
                                <ListItemText primary="Comprehensive calculation of financial ratios in four key categories" />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
                                <ListItemText primary="Construction benchmarking to provide context for your metrics" />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
                                <ListItemText primary="Overall financial health score with trend indicators" />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
                                <ListItemText primary="Key insights automatically identified from the data" />
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <List>
                            <ListItem>
                                <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
                                <ListItemText primary="Structured input forms for balance sheet and income statement" />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
                                <ListItemText primary="Automated validation to ensure accuracy" />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
                                <ListItemText primary="Options to import data from CSV/Excel or connect to accounting software" />
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>
            </Paper>

        </Box>
    );
};

export default OverviewFinancialAnalysisComponent;