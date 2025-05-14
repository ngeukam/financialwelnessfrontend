import React, { useEffect, useRef, useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Paper,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    Tabs,
    Tab,
    Chip,
    Tooltip,
    IconButton
} from '@mui/material';
import {
    Assessment,
    Input,
    Analytics,
    TableChart,
    InsertDriveFile,
    CloudUpload,
    Settings,
    InfoOutlined,
    ArrowCircleRight,
    ArrowCircleLeft,
} from '@mui/icons-material';
import FinancialHealthCard from './FinancialHealthCard';
import ExportButtons from '../utils/ExportButtons';
import * as XLSX from 'xlsx';

const FinancialAnalysisComponent = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [formData, setFormData] = useState({
        currentAssets: 75000,
        totalAssets: 150000,
        currentLiabilities: 30000,
        totalLiabilities: 60000,
        revenue: 250000,
        cogs: 100000,
        operatingExpenses: 100000,
        netIncome: 0,
        cogsPercentage: 30,
        interestExpense: 10000,
        currentassetsAR: 20,
        currentAssetsInventory: 30,
        taxes: 0
    });
    const ratiosTabRef = useRef(null);
    const zScoreTabRef = useRef(null);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleNextTab = () => {
        setActiveTab(1);
    };
    const handleGoBackTab0 = () => {
        setActiveTab(0);
    };
    const handleGoBackTab1 = () => {
        setActiveTab(1);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
          setFormData(prev => ({
            ...prev,
            netIncome: (prev.revenue - prev.cogs - prev.operatingExpenses) - prev.taxes
          }));
        }, 1000);
      
        return () => clearTimeout(timer);
      }, [formData, setFormData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const parsedValue = parseFloat(value) || 0;

        setFormData(prev => {
            const updated = {
                ...prev,
                [name]: parsedValue
            };

            updated.netIncome = (updated.revenue - updated.cogs - updated.operatingExpenses) - updated.taxes
            updated.netIncome = Math.round(updated.netIncome);
            return updated;
        });
    };

    const handleExcelImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        e.target.value = null;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                if (workbook.SheetNames.length === 0) {
                    alert('No sheets found in the Excel file');
                    return;
                }

                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet);

                if (jsonData.length === 0) {
                    alert('No data found in the first sheet');
                    return;
                }
                const excelRow = jsonData[0];
                const mappedData = {
                    currentAssets: parseFloat(excelRow['Current Assets'] || excelRow['currentAssets'] || formData.currentAssets),
                    totalAssets: parseFloat(excelRow['Total Assets'] || excelRow['totalAssets'] || formData.totalAssets),
                    currentLiabilities: parseFloat(excelRow['Current Liabilities'] || excelRow['currentLiabilities'] || formData.currentLiabilities),
                    totalLiabilities: parseFloat(excelRow['Total Liabilities'] || excelRow['totalLiabilities'] || formData.totalLiabilities),
                    revenue: parseFloat(excelRow['Revenue'] || excelRow['revenue'] || formData.revenue),
                    cogs: parseFloat(excelRow['COGS'] || excelRow['Cost of Goods Sold'] || excelRow['cogs'] || formData.cogs),
                    operatingExpenses: parseFloat(excelRow['Operating Expenses'] || excelRow['operatingExpenses'] || formData.operatingExpenses),
                    taxes: parseFloat(excelRow['Taxes'] || excelRow['Taxe'] || formData.taxes),
                    cogsPercentage: parseFloat(excelRow['COGS %'] || excelRow['cogsPercentage'] || formData.cogsPercentage),
                    interestExpense: parseFloat(excelRow['Interest Expense'] || excelRow['interestExpense'] || formData.interestExpense),
                    currentassetsAR: parseFloat(excelRow['Current Assets AR %'] || excelRow['Current Assets AR'] || excelRow['currentassetsAR'] || formData.currentassetsAR),
                    currentAssetsInventory: parseFloat(excelRow['Current Assets Inventory %'] || excelRow['currentAssetsInventory'] || formData.currentAssetsInventory)
                };

                // Validate at least one field was imported
                if (Object.values(mappedData).every(val => val === formData[Object.keys(mappedData)[0]])) {
                    alert('No matching data found in Excel file. Please check column headers.');
                    return;
                }

                setFormData(mappedData);
            } catch (error) {
                console.error('Error processing Excel file:', error);
                alert('Error processing Excel file. Please check the format.');
            }
        };
        reader.onerror = () => {
            alert('Error reading file');
        };
        reader.readAsArrayBuffer(file);

    };

    const safeDivide = (numerator, denominator, fallback = 0) => {
        return denominator !== 0 ? numerator / denominator : fallback;
    };
    // Calculate all financial ratios
    const currentRatio = safeDivide(formData.currentAssets, formData.currentLiabilities);
    const quickRatio = safeDivide(
        formData.currentAssets - formData.cogs * (formData.cogsPercentage / 100),
        formData.currentLiabilities
    );
    const debtToEquity = safeDivide(
        formData.totalLiabilities,
        formData.totalAssets - formData.totalLiabilities
    );
    const interestCoverage = safeDivide(
        formData.netIncome + formData.interestExpense,
        formData.interestExpense
    );
    const inventoryTurnover = safeDivide(
        formData.cogs,
        formData.currentAssets * (formData.currentAssetsInventory / 100)
    );
    const receivablesTurnover = safeDivide(
        formData.revenue,
        formData.currentAssets * (formData.currentassetsAR / 100)
    );
    const assetsTurnoverRation = safeDivide(formData.revenue, formData.totalAssets)

    const grossMargin = safeDivide(
        formData.revenue - formData.cogs,
        formData.revenue
    );
    const netProfitMargin = safeDivide(
        formData.netIncome,
        formData.revenue
    );
    const returnOnAssets = safeDivide(
        formData.netIncome,
        formData.totalAssets
    );
    const returnOnEquity = safeDivide(
        formData.netIncome,
        formData.totalAssets - formData.totalLiabilities
    );

    const calculateAltmanZScore = () => {
        // Extract values from formData
        const {
            currentAssets,
            totalAssets,
            currentLiabilities,
            totalLiabilities,
            revenue,
            netIncome,
            interestExpense
        } = formData;

        // Calculate components
        const workingCapital = currentAssets - currentLiabilities;
        const retainedEarnings = netIncome; // Simplified - in practice, this would be cumulative
        const ebit = netIncome + interestExpense; // Earnings Before Interest and Taxes
        const marketValueEquity = totalAssets - totalLiabilities; // Simplified approximation
        const totalLiabilitiesAdj = totalLiabilities;

        // Altman Z-Score formula components (manufacturing version)
        const A = (workingCapital / totalAssets) * 1.2;
        const B = (retainedEarnings / totalAssets) * 1.4;
        const C = (ebit / totalAssets) * 3.3;
        const D = (marketValueEquity / totalLiabilitiesAdj) * 0.6;
        const E = (revenue / totalAssets) * 1.0;

        const zScore = A + B + C + D + E;

        // Interpretation
        let interpretation = '';
        let color = '';

        if (zScore > 2.6) {
            interpretation = 'Safe Zone (Low risk for contractors)';
            color = 'success';
        } else if (zScore > 1.75) {
            interpretation = 'Watch Zone (Moderate risk)';
            color = 'warning';
        } else {
            interpretation = 'Distress Zone (High bankruptcy risk)';
            color = 'error';
        }

        return {
            score: zScore.toFixed(2),
            interpretation,
            color,
            components: { A, B, C, D, E }
        };
    };

    // Usage in component
    const zScoreResult = calculateAltmanZScore();

    return (
        <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
            {/* Key Features Section */}

            {/* Tabs for different sections */}
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
                <Tab label="Data Input" icon={<Input />} />
                <Tab label="Financial Ratios" icon={<Analytics />} />
                <Tab label="Financial Health" icon={<Assessment />} />
            </Tabs>
            {activeTab === 0 && (
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>Financial Data Input</Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="subtitle1" gutterBottom>
                                        <TableChart sx={{ verticalAlign: 'middle', mr: 1, mb:2 }} />
                                        Balance Sheet Data
                                    </Typography>

                                    <Tooltip title="Cash and assets convertible to cash within 1 year (bank accounts, receivables, inventory)" arrow>
                                        <TextField
                                            fullWidth
                                            label="Current Assets"
                                            name="currentAssets"
                                            value={formData.currentAssets}
                                            onChange={handleInputChange}
                                            type="number"
                                            sx={{ mb: 2 }}
                                        />
                                    </Tooltip>

                                    <Tooltip title="Everything your company owns (equipment, property, cash, investments)" arrow>
                                        <TextField
                                            fullWidth
                                            label="Total Assets"
                                            name="totalAssets"
                                            value={formData.totalAssets}
                                            onChange={handleInputChange}
                                            type="number"
                                            sx={{ mb: 2 }}
                                        />
                                    </Tooltip>

                                    <Tooltip title="Debts due within 1 year (supplier payments, short-term loans)" arrow>
                                        <TextField
                                            fullWidth
                                            label="Current Liabilities"
                                            name="currentLiabilities"
                                            value={formData.currentLiabilities}
                                            onChange={handleInputChange}
                                            type="number"
                                            sx={{ mb: 2 }}
                                        />
                                    </Tooltip>

                                    <Tooltip title="All outstanding debts (loans, mortgages, accounts payable)" arrow>
                                        <TextField
                                            fullWidth
                                            label="Total Liabilities"
                                            name="totalLiabilities"
                                            value={formData.totalLiabilities}
                                            onChange={handleInputChange}
                                            type="number"
                                            sx={{ mb: 2 }}
                                        />
                                    </Tooltip>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="subtitle1" gutterBottom>
                                        <TableChart sx={{ verticalAlign: 'middle', mr: 1, mb:2 }} />
                                        Income Statement Data
                                    </Typography>

                                    <Tooltip title="Total sales before any deductions (also called 'top line')" arrow>
                                        <TextField
                                            fullWidth
                                            label="Revenue"
                                            name="revenue"
                                            value={formData.revenue}
                                            onChange={handleInputChange}
                                            type="number"
                                            sx={{ mb: 2 }}
                                        />
                                    </Tooltip>

                                    <Tooltip title="Direct costs for projects (materials, labor, equipment rental)" arrow>
                                        <TextField
                                            fullWidth
                                            label="Cost of Goods Sold"
                                            name="cogs"
                                            value={formData.cogs}
                                            onChange={handleInputChange}
                                            type="number"
                                            sx={{ mb: 2 }}
                                        />
                                    </Tooltip>

                                    <Tooltip title="Ongoing business costs (office rent, salaries, utilities)" arrow>
                                        <TextField
                                            fullWidth
                                            label="Operating Expenses"
                                            name="operatingExpenses"
                                            value={formData.operatingExpenses}
                                            onChange={handleInputChange}
                                            type="number"
                                            sx={{ mb: 2 }}
                                        />
                                    </Tooltip>
                                    <Tooltip title=" Taxes" arrow>
                                        <TextField
                                            fullWidth
                                            label="Taxes"
                                            name="taxes"
                                            value={formData.taxes}
                                            onChange={handleInputChange}
                                            inputProps={{ min: 0 }}
                                            type="number"
                                            sx={{ mb: 2 }}
                                            placeholder="Enter taxes value"
                                        />
                                    </Tooltip>
                                    <Tooltip title="Final profit after all expenses (Revenue - COGS - Operating Expenses - Taxes)" arrow>
                                        <TextField
                                            fullWidth
                                            label="Net Income"
                                            name="netIncome"
                                            value={formData.netIncome}
                                            onChange={handleInputChange}
                                            type="number"
                                            sx={{ mb: 2 }}
                                        />
                                    </Tooltip>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="subtitle1" gutterBottom>
                                        <Settings sx={{ verticalAlign: 'middle', mr: 1, mb: 2 }} />
                                        Parameters
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        label="Assuming x% of COGS is inventory"
                                        name="cogsPercentage"
                                        value={formData.cogsPercentage}
                                        onChange={handleInputChange}
                                        placeholder="Example: x=30"
                                        type="number"
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Assuming interest expense of x"
                                        name="interestExpense"
                                        value={formData.interestExpense}
                                        onChange={handleInputChange}
                                        placeholder="Example: x=10000"
                                        type="number"
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Assuming x% of current assets is AR"
                                        name="currentassetsAR"
                                        value={formData.currentassetsAR}
                                        onChange={handleInputChange}
                                        placeholder="Example: x=20"
                                        type="number"
                                        sx={{ mb: 2 }}

                                    />
                                    <TextField
                                        fullWidth
                                        label="Assuming x% of current assets is inventory"
                                        name="currentAssetsInventory"
                                        value={formData.currentAssetsInventory}
                                        onChange={handleInputChange}
                                        placeholder="Example: x=30"
                                        type="number"
                                        sx={{ mb: 2 }}

                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <input
                                accept=".xlsx,.xls,.csv"
                                style={{ display: 'none' }}
                                id="excel-import"
                                type="file"
                                onChange={handleExcelImport}
                            />
                            <label htmlFor="excel-import">
                                <Button
                                    variant="outlined"
                                    startIcon={<InsertDriveFile />}
                                    component="span"
                                >
                                    Import from Excel
                                </Button>
                            </label>
                            <Tooltip
                                title={
                                    <div>
                                        <Typography variant="body2">Excel should include these columns:</Typography>
                                        <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
                                            <li>Current Assets</li>
                                            <li>Total Assets</li>
                                            <li>Current Liabilities</li>
                                            <li>Total Liabilities</li>
                                            <li>Revenue</li>
                                            <li>COGS (Cost of Goods Sold)</li>
                                            <li>Operating Expenses</li>
                                            <li>Taxes</li>
                                            <li>COGS %</li>
                                            <li>Interest Expense</li>
                                            <li>Current Assets AR %</li>
                                            <li>Current Assets Inventory %</li>
                                            
                                            
                                        </ul>
                                        <Typography variant="caption">Column names are case-insensitive</Typography>
                                    </div>
                                }
                                arrow
                                placement="right"
                            >
                                <IconButton size="small">
                                    <InfoOutlined fontSize="small" color='info' />
                                </IconButton>
                            </Tooltip>
                        </div>
                        <Button
                            variant="outlined"
                            startIcon={<CloudUpload />}
                            sx={{ ml: 2 }}
                        >
                            Connect to Accounting Software
                        </Button>
                        <Button
                            variant="contained"
                            endIcon={<ArrowCircleRight />}
                            sx={{ ml: 2 }}
                            onClick={handleNextTab}
                        >
                            Next
                        </Button>
                    </Box>
                </Paper>
            )}

            {activeTab === 1 && (
                <>
                    <Grid container spacing={3} ref={ratiosTabRef}>
                        {/* Liquidity Ratios */}
                        <Grid item xs={12} md={6}>
                            <Card elevation={3}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>Liquidity Ratios</Typography>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                            <span><strong>Current Ratio</strong></span>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Benchmark: 1.2 - 1.8
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Measures short-term debt payment ability
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                            <span>{currentRatio.toFixed(2)}</span>
                                                            <Typography variant="caption" color="text.secondary">
                                                                ({currentRatio > 1.8 ? '↑ Above' : currentRatio < 1.2 ? '↓ Below' : '✓ Within range'})
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Tooltip
                                                            title={`Ideal for construction: 1.2 - 1.8\n\n >1.8 may indicate underutilized assets\n<1.2 signals liquidity risk`}
                                                            arrow
                                                        >
                                                            <Chip
                                                                label={currentRatio > 1.5 ? 'Strong' : currentRatio > 1.2 ? 'Good' : 'Risk'}
                                                                size="small"
                                                                color={currentRatio > 1.5 ? 'success' : currentRatio > 1.2 ? 'warning' : 'error'}
                                                            />
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell colSpan={3} sx={{
                                                        fontSize: '0.75rem',
                                                        bgcolor: currentRatio > 1.5 ? '#f0fdf4' :
                                                            currentRatio > 1.2 ? '#fffbeb' : '#fef2f2',
                                                        p: 1,
                                                        borderLeft: currentRatio > 1.5 ? '4px solid #10b981' :
                                                            currentRatio > 1.2 ? '4px solid #f59e0b' : '4px solid #ef4444'
                                                    }}>
                                                        {currentRatio > 1.5 ? (
                                                            <span>✅ <strong>Optimal:</strong> Maintain this level to handle unexpected project delays or material cost increases.</span>
                                                        ) : currentRatio > 1.2 ? (
                                                            <span>⚠️ <strong>Watch:</strong> Consider building cash reserves before taking on new projects.</span>
                                                        ) : (
                                                            <span>❌ <strong>Action:</strong> Delay non-essential equipment purchases and negotiate longer payment terms with suppliers.</span>
                                                        )}
                                                    </TableCell>
                                                </TableRow>

                                                <TableRow>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
                                                            <span><strong>Quick Ratio</strong></span>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Benchmark: 0.8 - 1.2
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Strict liquidity measure (excludes inventory)
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                            <span>{quickRatio.toFixed(2)}</span>
                                                            <Typography variant="caption" color="text.secondary">
                                                                ({quickRatio > 1.2 ? '↑ Above' : quickRatio < 0.8 ? '↓ Below' : '✓ Within range'})
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Tooltip
                                                            title={`Ideal for construction: 0.8 - 1.2\n\n>1.2 may indicate excess cash\n<0.8 signals potential cash flow issues`}
                                                            arrow
                                                        >
                                                            <Chip
                                                                label={quickRatio > 1.0 ? 'Strong' : quickRatio > 0.8 ? 'Good' : 'Risk'}
                                                                size="small"
                                                                color={quickRatio > 1.0 ? 'success' : quickRatio > 0.8 ? 'warning' : 'error'}
                                                            />
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell colSpan={3} sx={{
                                                        fontSize: '0.75rem',
                                                        bgcolor: quickRatio > 1.0 ? '#f0fdf4' :
                                                            quickRatio > 0.8 ? '#fffbeb' : '#fef2f2',
                                                        p: 1,
                                                        borderLeft: quickRatio > 1.0 ? '4px solid #10b981' :
                                                            quickRatio > 0.8 ? '4px solid #f59e0b' : '4px solid #ef4444'
                                                    }}>
                                                        {quickRatio > 1.0 ? (
                                                            <span>✅ <strong>Healthy:</strong> You can comfortably meet short-term obligations without selling inventory.</span>
                                                        ) : quickRatio > 0.8 ? (
                                                            <span>⚠️ <strong>Monitor:</strong> Reduce accounts payable or increase cash reserves for better liquidity.</span>
                                                        ) : (
                                                            <span>❌ <strong>Critical:</strong> Prioritize collecting receivables and avoid taking on new debt.</span>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Solvency Ratios */}
                        <Grid item xs={12} md={6}>
                            <Card elevation={3}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>Solvency Ratios</Typography>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                            <span><strong>Debt-to-Equity</strong></span>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Benchmark: 1.0 - 2.0
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Measures financial leverage
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                            <span>{debtToEquity.toFixed(2)}</span>
                                                            <Typography variant="caption" color="text.secondary">
                                                                ({debtToEquity > 2.0 ? '↑ High' : debtToEquity < 1.0 ? '↓ Low' : '✓ Ideal'})
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Tooltip title="Construction firms often carry more debt for equipment">
                                                            <Chip
                                                                label={debtToEquity < 1.0 ? 'Excellent' : debtToEquity < 2.0 ? 'Acceptable' : 'High Risk'}
                                                                size="small"
                                                                color={debtToEquity < 1.0 ? 'success' : debtToEquity < 2.0 ? 'warning' : 'error'}
                                                            />
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>

                                                <TableRow>
                                                    <TableCell colSpan={3} sx={{
                                                        fontSize: '0.75rem',
                                                        bgcolor: debtToEquity < 1.0 ? '#f0fdf4' :
                                                            debtToEquity < 2.0 ? '#fffbeb' : '#fef2f2',
                                                        p: 1,
                                                        borderLeft: debtToEquity < 1.0 ? '4px solid #10b981' :
                                                            debtToEquity < 2.0 ? '4px solid #f59e0b' : '4px solid #ef4444'
                                                    }}>
                                                        {debtToEquity < 1.0 ? (
                                                            <span>✅ <strong>Conservative:</strong> You could consider strategic borrowing for equipment upgrades.</span>
                                                        ) : debtToEquity < 2.0 ? (
                                                            <span>⚠️ <strong>Manageable:</strong> Focus on paying down highest interest debts first.</span>
                                                        ) : (
                                                            <span>❌ <strong>Danger:</strong> Immediately develop a debt reduction plan and avoid new loans.</span>
                                                        )}
                                                    </TableCell>
                                                </TableRow>

                                                <TableRow>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
                                                            <span><strong>Interest Coverage</strong></span>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Benchmark: 3.0+
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Ability to pay interest expenses
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                            <span>{interestCoverage.toFixed(2)}</span>
                                                            <Typography variant="caption" color="text.secondary">
                                                                ({interestCoverage > 3.0 ? '✓ Safe' : interestCoverage > 1.5 ? '⚠️ Caution' : '↓ Danger'})
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Chip
                                                            label={interestCoverage > 3.0 ? 'Safe' : interestCoverage > 1.5 ? 'Caution' : 'Danger'}
                                                            size="small"
                                                            color={interestCoverage > 3.0 ? 'success' : interestCoverage > 1.5 ? 'warning' : 'error'}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell colSpan={3} sx={{
                                                        fontSize: '0.75rem',
                                                        bgcolor: interestCoverage > 3.0 ? '#f0fdf4' :
                                                            interestCoverage > 1.5 ? '#fffbeb' : '#fef2f2',
                                                        p: 1,
                                                        borderLeft: interestCoverage > 3.0 ? '4px solid #10b981' :
                                                            interestCoverage > 1.5 ? '4px solid #f59e0b' : '4px solid #ef4444'
                                                    }}>
                                                        {interestCoverage > 3.0 ? (
                                                            <span>✅ <strong>Comfortable:</strong> Your earnings comfortably cover interest payments.</span>
                                                        ) : interestCoverage > 1.5 ? (
                                                            <span>⚠️ <strong>Warning:</strong> Monitor cash flow closely to avoid default risk.</span>
                                                        ) : (
                                                            <span>❌ <strong>Emergency:</strong> Restructure debt immediately to lower interest burden.</span>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Efficiency Ratios */}
                        <Grid item xs={12} md={6}>
                            <Card elevation={3}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>Efficiency Ratios</Typography>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                            <span><strong>Inventory Turnover</strong></span>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Benchmark: 4 - 6
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                How quickly materials are used
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                            <span>{inventoryTurnover.toFixed(2)}</span>
                                                            <Typography variant="caption" color="text.secondary">
                                                                ({inventoryTurnover > 6 ? '↑ Fast' : inventoryTurnover < 4 ? '↓ Slow' : '✓ Normal'})
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Tooltip title="Higher is better for construction materials">
                                                            <Chip
                                                                label={inventoryTurnover > 5 ? 'Fast' : inventoryTurnover > 3 ? 'Normal' : 'Slow'}
                                                                size="small"
                                                                color={inventoryTurnover > 5 ? 'success' : inventoryTurnover > 3 ? 'warning' : 'error'}
                                                            />
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell colSpan={3} sx={{
                                                        fontSize: '0.75rem',
                                                        bgcolor: inventoryTurnover > 5 ? '#f0fdf4' :
                                                            inventoryTurnover > 3 ? '#fffbeb' : '#fef2f2',
                                                        p: 1,
                                                        borderLeft: inventoryTurnover > 5 ? '4px solid #10b981' :
                                                            inventoryTurnover > 3 ? '4px solid #f59e0b' : '4px solid #ef4444'
                                                    }}>
                                                        {inventoryTurnover > 5 ? (
                                                            <span>✅ <strong>Efficient:</strong> Your material management is excellent. Maintain supplier relationships.</span>
                                                        ) : inventoryTurnover > 3 ? (
                                                            <span>⚠️ <strong>Opportunity:</strong> Implement just-in-time ordering for slow-moving items.</span>
                                                        ) : (
                                                            <span>❌ <strong>Problem:</strong> Liquidate obsolete stock and renegotiate supplier contracts.</span>
                                                        )}
                                                    </TableCell>
                                                </TableRow>

                                                <TableRow>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
                                                            <span><strong>Receivables Turnover</strong></span>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Benchmark: 8 - 12
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                How quickly clients pay
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                            <span>{receivablesTurnover.toFixed(2)}</span>
                                                            <Typography variant="caption" color="text.secondary">
                                                                ({receivablesTurnover > 12 ? '↑ Fast' : receivablesTurnover < 8 ? '↓ Slow' : '✓ Normal'})
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Chip
                                                            label={receivablesTurnover > 10 ? 'Fast' : receivablesTurnover > 6 ? 'Normal' : 'Slow'}
                                                            size="small"
                                                            color={receivablesTurnover > 10 ? 'success' : receivablesTurnover > 6 ? 'warning' : 'error'}
                                                        />
                                                    </TableCell>
                                                </TableRow>


                                                <TableRow>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
                                                            <span><strong>Asset Turnover Ration</strong></span>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Benchmark: 0.8 - 1.5
                                                            </Typography>

                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                            <span>{assetsTurnoverRation.toFixed(2)}</span>
                                                            <Typography variant="caption" color="text.secondary">
                                                                ({assetsTurnoverRation > 1.5 ? '↑ High' : assetsTurnoverRation < 0.8 ? '↓ Low' : '✓ Normal'})
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Tooltip title="Revenue generated per asset dollar">
                                                            <Chip
                                                                label={assetsTurnoverRation > 1.5 ? 'High' : assetsTurnoverRation > 0.8 ? 'Normal' : 'Low'}
                                                                size="small"
                                                                color={assetsTurnoverRation > 1.5 ? 'success' : assetsTurnoverRation > 0.8 ? 'warning' : 'error'}
                                                            />
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell colSpan={3} sx={{
                                                        fontSize: '0.75rem',
                                                        bgcolor: assetsTurnoverRation > 1.5 ? '#f0fdf4' :
                                                            assetsTurnoverRation > 0.8 ? '#fffbeb' : '#fef2f2',
                                                        p: 1,
                                                        borderLeft: assetsTurnoverRation > 1.5 ? '4px solid #10b981' :
                                                            assetsTurnoverRation > 0.8 ? '4px solid #f59e0b' : '4px solid #ef4444'
                                                    }}>
                                                        {assetsTurnoverRation > 1.5 ? (
                                                            <span>✅ <strong>Excellent:</strong> High asset efficiency. Optimize further for growth.</span>
                                                        ) : assetsTurnoverRation > 0.8 ? (
                                                            <span>⚠️ <strong>Improve:</strong> Review idle equipment and project delays.</span>
                                                        ) : (
                                                            <span>❌ <strong>Critical:</strong> Assets are underused. Lease/sell unused equipment.</span>
                                                        )}
                                                    </TableCell>
                                                </TableRow>

                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Profitability Ratios */}
                        <Grid item xs={12} md={6}>
                            <Card elevation={3}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>Profitability Ratios</Typography>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                            <span><strong>Gross Margin</strong></span>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Benchmark: 15% - 25%
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Profit after direct costs
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                            <span>{(grossMargin * 100).toFixed(1)}%</span>
                                                            <Typography variant="caption" color="text.secondary">
                                                                ({grossMargin > 0.25 ? '↑ High' : grossMargin < 0.15 ? '↓ Low' : '✓ Standard'})
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Tooltip title="Commercial projects typically have higher margins">
                                                            <Chip
                                                                label={grossMargin > 0.25 ? 'Strong' : grossMargin > 0.15 ? 'Average' : 'Weak'}
                                                                size="small"
                                                                color={grossMargin > 0.25 ? 'success' : grossMargin > 0.15 ? 'warning' : 'error'}
                                                            />
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell colSpan={3} sx={{
                                                        fontSize: '0.75rem',
                                                        bgcolor: grossMargin > 0.25 ? '#f0fdf4' :
                                                            grossMargin > 0.15 ? '#fffbeb' : '#fef2f2',
                                                        p: 1,
                                                        borderLeft: grossMargin > 0.25 ? '4px solid #10b981' :
                                                            grossMargin > 0.15 ? '4px solid #f59e0b' : '4px solid #ef4444'
                                                    }}>
                                                        {grossMargin > 0.25 ? (
                                                            <span>✅ <strong>Premium:</strong> You're pricing effectively. Consider expanding to higher-margin services.</span>
                                                        ) : grossMargin > 0.15 ? (
                                                            <span>⚠️ <strong>Competitive:</strong> Review material costs and labor productivity for improvements.</span>
                                                        ) : (
                                                            <span>❌ <strong>Danger:</strong> Re-evaluate bidding strategy. Audit for cost overruns or theft.</span>
                                                        )}
                                                    </TableCell>
                                                </TableRow>

                                                <TableRow>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
                                                            <span><strong>Net Profit Margin</strong></span>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Benchmark: 5% - 10%
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Final profit after all expenses
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                            <span>{(netProfitMargin * 100).toFixed(1)}%</span>
                                                            <Typography variant="caption" color="text.secondary">
                                                                ({netProfitMargin > 0.10 ? '↑ High' : netProfitMargin < 0.05 ? '↓ Low' : '✓ Standard'})
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Tooltip title="Varies by project type - commercial typically higher than residential">
                                                            <Chip
                                                                label={netProfitMargin > 0.10 ? 'Strong' : netProfitMargin > 0.05 ? 'Average' : 'Weak'}
                                                                size="small"
                                                                color={netProfitMargin > 0.10 ? 'success' : netProfitMargin > 0.05 ? 'warning' : 'error'}
                                                            />
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell colSpan={3} sx={{
                                                        fontSize: '0.75rem',
                                                        bgcolor: netProfitMargin > 0.10 ? '#f0fdf4' :
                                                            netProfitMargin > 0.05 ? '#fffbeb' : '#fef2f2',
                                                        p: 1,
                                                        borderLeft: netProfitMargin > 0.10 ? '4px solid #10b981' :
                                                            netProfitMargin > 0.05 ? '4px solid #f59e0b' : '4px solid #ef4444'
                                                    }}>
                                                        {netProfitMargin > 0.10 ? (
                                                            <span>✅ <strong>Profitable:</strong> Excellent overall cost management. Reinvest in growth.</span>
                                                        ) : netProfitMargin > 0.05 ? (
                                                            <span>⚠️ <strong>Marginal:</strong> Review overhead costs and operational efficiency.</span>
                                                        ) : (
                                                            <span>❌ <strong>Loss:</strong> Immediate cost-cutting and pricing review required.</span>
                                                        )}
                                                    </TableCell>
                                                </TableRow>

                                                <TableRow>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
                                                            <span><strong>Return on Assets</strong></span>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Benchmark: 8% - 12%
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Efficiency of asset utilization
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                            <span>{(returnOnAssets * 100).toFixed(1)}%</span>
                                                            <Typography variant="caption" color="text.secondary">
                                                                ({returnOnAssets > 0.12 ? '↑ High' : returnOnAssets < 0.08 ? '↓ Low' : '✓ Target'})
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Tooltip title="Equipment-heavy firms may have lower ROA">
                                                            <Chip
                                                                label={returnOnAssets > 0.10 ? 'Strong' : returnOnAssets > 0.05 ? 'Average' : 'Weak'}
                                                                size="small"
                                                                color={returnOnAssets > 0.10 ? 'success' : returnOnAssets > 0.05 ? 'warning' : 'error'}
                                                            />
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell colSpan={3} sx={{
                                                        fontSize: '0.75rem',
                                                        bgcolor: returnOnAssets > 0.10 ? '#f0fdf4' :
                                                            returnOnAssets > 0.05 ? '#fffbeb' : '#fef2f2',
                                                        p: 1,
                                                        borderLeft: returnOnAssets > 0.10 ? '4px solid #10b981' :
                                                            returnOnAssets > 0.05 ? '4px solid #f59e0b' : '4px solid #ef4444'
                                                    }}>
                                                        {returnOnAssets > 0.10 ? (
                                                            <span>✅ <strong>Effective:</strong> Your assets are generating strong returns.</span>
                                                        ) : returnOnAssets > 0.05 ? (
                                                            <span>⚠️ <strong>Moderate:</strong> Consider selling underutilized equipment.</span>
                                                        ) : (
                                                            <span>❌ <strong>Poor:</strong> Reassess equipment investments and utilization rates.</span>
                                                        )}
                                                    </TableCell>
                                                </TableRow>

                                                <TableRow>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
                                                            <span><strong>Return on Equity</strong></span>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Benchmark: 15% - 20%
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Profit per dollar invested
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                            <span>{(returnOnEquity * 100).toFixed(1)}%</span>
                                                            <Typography variant="caption" color="text.secondary">
                                                                ({returnOnEquity > 0.20 ? '↑ High' : returnOnEquity < 0.15 ? '↓ Low' : '✓ Target'})
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Chip
                                                            label={returnOnEquity > 0.20 ? 'Excellent' : returnOnEquity > 0.15 ? 'Good' : 'Poor'}
                                                            size="small"
                                                            color={returnOnEquity > 0.20 ? 'success' : returnOnEquity > 0.15 ? 'warning' : 'error'}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell colSpan={3} sx={{
                                                        fontSize: '0.75rem',
                                                        bgcolor: returnOnEquity > 0.15 ? '#f0fdf4' :
                                                            returnOnEquity > 0.10 ? '#fffbeb' : '#fef2f2',
                                                        p: 1,
                                                        borderLeft: returnOnEquity > 0.15 ? '4px solid #10b981' :
                                                            returnOnEquity > 0.10 ? '4px solid #f59e0b' : '4px solid #ef4444'
                                                    }}>
                                                        {returnOnEquity > 0.15 ? (
                                                            <span>✅ <strong>Outstanding:</strong> Shareholders are getting excellent returns.</span>
                                                        ) : returnOnEquity > 0.10 ? (
                                                            <span>⚠️ <strong>Acceptable:</strong> Could improve through better financial leverage.</span>
                                                        ) : (
                                                            <span>❌ <strong>Unacceptable:</strong> Fundamental restructuring needed.</span>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                        <ExportButtons
                            tabRefs={[ratiosTabRef, zScoreTabRef]}
                            activeTab={activeTab}  // Pass activeTab prop
                        />
                        <Button
                            variant="outlined"
                            startIcon={<ArrowCircleLeft />}
                            sx={{ ml: 2 }}
                            onClick={handleGoBackTab0}
                        >
                            Go Back
                        </Button>
                    </Box>

                </>
            )}

            {activeTab === 2 && (
                <>
                    <div ref={zScoreTabRef}>
                        <FinancialHealthCard zScoreResult={zScoreResult} />
                    </div>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                        <ExportButtons
                            tabRefs={[ratiosTabRef, zScoreTabRef]}
                            activeTab={activeTab}  // Pass activeTab prop
                        />
                        <Button
                            variant="outlined"
                            startIcon={<ArrowCircleLeft />}
                            sx={{ ml: 2 }}
                            onClick={handleGoBackTab1}
                        >
                            Go Back
                        </Button>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default FinancialAnalysisComponent;