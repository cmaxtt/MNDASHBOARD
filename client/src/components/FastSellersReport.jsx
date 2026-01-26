import React, { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    Container,
    Alert
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StoreIcon from '@mui/icons-material/Store';
import { useDatabase } from '../context/DatabaseContext';
import KPICard from './KPICard';

const FastSellersReport = () => {
    const { fetchFastSellersReport, fastSellersData, loadingReport } = useDatabase();
    const [startDate, setStartDate] = useState(dayjs().startOf('month'));
    const [endDate, setEndDate] = useState(dayjs().endOf('month'));
    const [reportRun, setReportRun] = useState(false);

    const handleRunReport = () => {
        if (startDate && endDate) {
            setReportRun(true);
            fetchFastSellersReport(startDate.toISOString(), endDate.toISOString());
        }
    };

    // Prepare data for DataGrid with unique ID
    const rows = useMemo(() => {
        return fastSellersData.map((item, index) => ({
            id: index,
            ...item
        }));
    }, [fastSellersData]);

    // Calculate Statistics
    const stats = useMemo(() => {
        if (!fastSellersData || fastSellersData.length === 0) return null;

        const topVendor = fastSellersData[0]; // Assuming API returns sorted by something relevant, or we pick max
        const totalRevenue = fastSellersData.reduce((acc, curr) => acc + (curr.TotalPurchaseValue || 0), 0);
        const totalQuantity = fastSellersData.reduce((acc, curr) => acc + (curr.TotalQuantity || 0), 0);

        return {
            topVendorName: topVendor.VendorName,
            topVendorValue: topVendor.TotalPurchaseValue,
            totalRevenue,
            totalQuantity
        };
    }, [fastSellersData]);

    // Prepare Top 10 Data for Chart
    const chartData = useMemo(() => {
        return fastSellersData
            .sort((a, b) => (b.TotalPurchaseValue || 0) - (a.TotalPurchaseValue || 0))
            .slice(0, 10);
    }, [fastSellersData]);

    const columns = [
        { field: 'VendorName', headerName: 'Vendor Name', flex: 2, minWidth: 200 },
        {
            field: 'TotalQuantity',
            headerName: 'Units Sold',
            flex: 1,
            type: 'number',
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'TotalPurchaseValue',
            headerName: 'Total Value',
            flex: 1,
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
                <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
                    Fast Sellers by Vendor
                </Typography>

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
                                onClick={handleRunReport}
                                fullWidth
                                disabled={loadingReport}
                                sx={{ height: 40 }}
                            >
                                {loadingReport ? 'Generating...' : 'Run Report'}
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {reportRun && !loadingReport && fastSellersData.length === 0 && (
                    <Alert severity="info" sx={{ mb: 3 }}>No data found for the selected period.</Alert>
                )}

                {stats && (
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={12} md={4}>
                            <KPICard
                                title="Top Performer"
                                value={stats.topVendorName}
                                subValue={`$${stats.topVendorValue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                                icon={<EmojiEventsIcon />}
                                color="#ffab00" // Amber/Gold
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <KPICard
                                title="Total Purchase Value"
                                value={`$${stats.totalRevenue?.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                                icon={<AttachMoneyIcon />} // We need to import this locally if KPICard doesn't handle it, but wait, KPICard accepts a node.
                                // I need to import AttachMoneyIcon here.
                                color="#00e5ff"
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <KPICard
                                title="Total Units Sold"
                                value={stats.totalQuantity?.toLocaleString()}
                                icon={<ShoppingCartIcon />}
                                color="#76ff03"
                            />
                        </Grid>
                    </Grid>
                )}

                {chartData.length > 0 && (
                    <Paper sx={{ p: 3, mb: 3, height: 400 }}>
                        <Typography variant="h6" gutterBottom>Top 10 Vendors by Value</Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="VendorName"
                                    type="category"
                                    width={150}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#334155', opacity: 0.4 }}
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                    formatter={(value) => [`$${value.toLocaleString()}`, 'Purchase Value']}
                                />
                                <Bar dataKey="TotalPurchaseValue" fill="#00e5ff" radius={[0, 4, 4, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#ffab00' : '#00e5ff'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                )}

                {/* Data Grid */}
                <Paper sx={{ height: 600, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        loading={loadingReport}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10 } },
                            sorting: { sortModel: [{ field: 'TotalPurchaseValue', sort: 'desc' }] },
                        }}
                        pageSizeOptions={[10, 25, 50]}
                        slots={{ toolbar: GridToolbar }}
                        slotProps={{
                            toolbar: { showQuickFilter: true },
                        }}
                        sx={{
                            border: 'none',
                            '& .MuiDataGrid-cell': { borderBottom: '1px solid #334155' },
                            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#1e293b', borderBottom: '1px solid #334155' },
                        }}
                    />
                </Paper>
            </Container>
        </LocalizationProvider>
    );
};

// Need to import AttachMoneyIcon locally since it was missing in imports above
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

export default FastSellersReport;
