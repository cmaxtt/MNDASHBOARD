import React, { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid, // Use normal Gridv1 or Gridv2. Since pkg says @mui/material 7.3.7, Grid v2 is stable. Let's try to stick to standard Grid for now to avoid issues, or Grid2 if configured. 
    Button,
    Container,
    Stack,
    CircularProgress,
    Alert
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ShowChartIcon from '@mui/icons-material/ShowChart';

import api from '../services/api';
import KPICard from './KPICard';

const DailyTrendReport = () => {
    const [startDate, setStartDate] = useState(dayjs().subtract(30, 'day'));
    const [endDate, setEndDate] = useState(dayjs());
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTrendData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/reports/daily-trend', {
                params: {
                    startDate: startDate.format('YYYY-MM-DD'),
                    endDate: endDate.format('YYYY-MM-DD')
                }
            });
            // Add unique ID for DataGrid
            const dataWithId = response.data.map((item, index) => ({
                id: index,
                ...item
            }));
            setData(dataWithId);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch trend data: ' + (err.response?.data || err.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrendData();
    }, []);

    // Summary Statistics
    const stats = useMemo(() => {
        if (!data.length) return { total: 0, avg: 0, peak: 0, peakDate: '-' };
        const total = data.reduce((acc, curr) => acc + (curr.TotalSales || 0), 0);
        const avg = total / data.length;
        const peak = Math.max(...data.map(d => d.TotalSales || 0));
        const peakItem = data.find(d => d.TotalSales === peak);
        return {
            total,
            avg,
            peak,
            peakDate: peakItem ? dayjs(peakItem.Date).format('MMM D, YYYY') : '-'
        };
    }, [data]);

    const columns = [
        {
            field: 'Date',
            headerName: 'Date',
            flex: 1,
            minWidth: 150,
            valueFormatter: (params) => dayjs(params.value).format('MMMM D, YYYY')
        },
        {
            field: 'TotalSales',
            headerName: 'Total Sales',
            flex: 1,
            minWidth: 150,
            type: 'number',
            valueFormatter: (params) => {
                if (params.value == null) return '';
                return `$${params.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }
        },
    ];

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                        Daily Sales Trend
                    </Typography>
                </Box>

                {/* Filters */}
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={3}>
                            <DatePicker
                                label="Start Date"
                                value={startDate}
                                onChange={(newValue) => setStartDate(newValue)}
                                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <DatePicker
                                label="End Date"
                                value={endDate}
                                onChange={(newValue) => setEndDate(newValue)}
                                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Button
                                variant="contained"
                                onClick={fetchTrendData}
                                fullWidth
                                disabled={loading}
                                sx={{ height: 40 }}
                            >
                                {loading ? 'Loading...' : 'Update'}
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                {/* KPI Cards */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={4}>
                        <KPICard
                            title="Total Revenue"
                            value={`$${stats.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                            icon={<AttachMoneyIcon />}
                            color="#00e5ff"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <KPICard
                            title="Daily Average"
                            value={`$${stats.avg.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                            icon={<ShowChartIcon />}
                            color="#76ff03"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <KPICard
                            title="Peak Sales Day"
                            value={stats.peakDate}
                            subValue={`$${stats.peak.toLocaleString()}`}
                            icon={<CalendarMonthIcon />}
                            color="#ff2975"
                        />
                    </Grid>
                </Grid>

                {/* Chart Area */}
                <Paper sx={{ p: 3, mb: 3, height: 400 }}>
                    <Typography variant="h6" gutterBottom>
                        Revenue Trend
                    </Typography>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis
                                dataKey="Date"
                                tickFormatter={(str) => dayjs(str).format('MMM D')}
                                stroke="#94a3b8"
                            />
                            <YAxis
                                stroke="#94a3b8"
                                tickFormatter={(val) => `$${val}`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                labelFormatter={(label) => dayjs(label).format('MMMM D, YYYY')}
                                formatter={(value) => [`$${value.toLocaleString()}`, 'Sales']}
                            />
                            <Area
                                type="monotone"
                                dataKey="TotalSales"
                                stroke="#00e5ff"
                                fillOpacity={1}
                                fill="url(#colorSales)"
                                name="Total Sales"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </Paper>

                {/* Data Grid */}
                <Paper sx={{ height: 600, width: '100%' }}>
                    <DataGrid
                        rows={data}
                        columns={columns}
                        loading={loading}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10 } },
                            sorting: { sortModel: [{ field: 'Date', sort: 'desc' }] },
                        }}
                        pageSizeOptions={[10, 25, 50, 100]}
                        slots={{ toolbar: GridToolbar }}
                        slotProps={{
                            toolbar: {
                                showQuickFilter: true,
                            },
                        }}
                        sx={{
                            border: 'none',
                            '& .MuiDataGrid-cell': {
                                borderBottom: '1px solid #334155',
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#1e293b',
                                borderBottom: '1px solid #334155',
                            },
                        }}
                    />
                </Paper>
            </Container>
        </LocalizationProvider>
    );
};

export default DailyTrendReport;
