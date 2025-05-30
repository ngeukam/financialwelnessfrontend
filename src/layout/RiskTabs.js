/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { Box, Tabs, Tab, useTheme, useMediaQuery, Typography } from '@mui/material';
import { css } from '@emotion/react';
import CreditRiskForm from '../components/CreditRiskForm';
import MarketRiskForm from '../components/MarketRiskForm';
import EWSForm from '../components/EWSForm';
import RiskAnalysisForm from '../components/RiskAnalysisForm';

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

const RiskTabs = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [value, setValue] = useState(0);


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

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
                    <Tab label="Credit Risk" {...a11yProps(0)} />
                    <Tab label="Market Risk" {...a11yProps(1)} />
                    <Tab label="Early Warning" {...a11yProps(2)} />
                    <Tab label="Smart Analysis" {...a11yProps(3)} />

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
                    <CreditRiskForm />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <MarketRiskForm />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <EWSForm />
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <RiskAnalysisForm />
                </TabPanel>
            </Box>
        </Box>
    );
};

export default RiskTabs;