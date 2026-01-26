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
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; // Import locally
import { useDatabase } from '../context/DatabaseContext';
import KPICard from './KPICard';

const PurchaseSummaryReport = () => {
    const { fetchPurchaseSummaryReport, purchaseSummaryData, loadingReport } = useDatabase();
    const [startDate, setStartDate] = useState(dayjs().startOf('month'));
    const [endDate, setEndDate] = useState(dayjs().endOf('month'));
    const [error, setError] = useState(null);
    const [reportRun, setReportRun] = useState(false);

    const handleRunReport = async () => {
        if (startDate && endDate) {
            setError(null);
            setReportRun(true);
            try {
                await fetchPurchaseSummaryReport(startDate.toISOString(), endDate.toISOString());
            } catch (err) {
                setError("Failed to generate report. Please try again.");
            }
        }
    };

    // Prepare data for DataGrid
    const rows = useMemo(() => {
        return purchaseSummaryData.map((item, index) => ({
            id: index,
            ...item,
            // Normalize TotalPurchaseValue
            TotalValue: item.TotalPurch || item.TotalPurchaseValue || 0
        }));
    }, [purchaseSummaryData]);

    // Statistics
    const stats = useMemo(() => {
        if (!rows.length) return null;
        const totalValue = rows.reduce((acc, curr) => acc + curr.TotalValue, 0);
        const totalQty = rows.reduce((acc, curr) => acc + (curr.TotalQuantity || 0), 0);
        const uniqueProducts = rows.length;

        return { totalValue, totalQty, uniqueProducts };
    }, [rows]);

    const columns = [
        { field: 'ProductCode', headerName: 'Code', width: 150 },
        { field: 'ProductName', headerName: 'Product Name', flex: 2, minWidth: 200 },
        {
            field: 'TotalQuantity',
            headerName: 'Qty Sold',
            type: 'number',
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'TotalValue',
            headerName: 'Total Value',
            type: 'number',
            flex: 1,
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
                    Purchase Summary by Product
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
                )}

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

                {/* KPI Cards */}
                {stats && (
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={12} md={4}>
                            <KPICard
                                title="Total Sales Value"
                                value={`$${stats.totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                                icon={<AttachMoneyIcon />}
                                color="#00e5ff"
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <KPICard
                                title="Total Units Sold"
                                value={stats.totalQty.toLocaleString()}
                                icon={<ReceiptLongIcon />}
                                color="#76ff03"
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <KPICard
                                title="Unique Products"
                                value={stats.uniqueProducts.toLocaleString()}
                                icon={<LocalOfferIcon />}
                                color="#ff2975"
                            />
                        </Grid>
                    </Grid>
                )}

                {reportRun && !loadingReport && rows.length === 0 && (
                    <Alert severity="info" sx={{ mb: 3 }}>No data found for the selected period.</Alert>
                )}

                <Paper sx={{ height: 600, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        loading={loadingReport}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 15 } },
                            sorting: { sortModel: [{ field: 'TotalValue', sort: 'desc' }] },
                        }}
                        pageSizeOptions={[15, 30, 50, 100]}
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

export default PurchaseSummaryReport;
