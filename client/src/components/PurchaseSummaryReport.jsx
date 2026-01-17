import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Grid,
    Button,
    CircularProgress
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useDatabase } from '../context/DatabaseContext';

const PurchaseSummaryReport = () => {
    const { fetchPurchaseSummaryReport, purchaseSummaryData, loadingReport } = useDatabase();
    const [startDate, setStartDate] = useState(dayjs().startOf('month'));
    const [endDate, setEndDate] = useState(dayjs().endOf('month'));
    const [error, setError] = useState(null);

    const handleRunReport = async () => {
        if (startDate && endDate) {
            setError(null);
            try {
                await fetchPurchaseSummaryReport(startDate.toISOString(), endDate.toISOString());
            } catch (err) {
                setError("Failed to generate report. Please try again.");
            }
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                    Purchase Summary by Product
                </Typography>

                {error && (
                    <Paper sx={{ p: 2, mb: 3, bgcolor: 'error.main', color: 'error.contrastText' }}>
                        <Typography>{error}</Typography>
                    </Paper>
                )}

                <Paper sx={{ p: 3, mb: 3 }}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <DatePicker
                                label="Start Date"
                                value={startDate}
                                onChange={(newValue) => setStartDate(newValue)}
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <DatePicker
                                label="End Date"
                                value={endDate}
                                onChange={(newValue) => setEndDate(newValue)}
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleRunReport}
                                fullWidth
                                disabled={loadingReport}
                            >
                                {loadingReport ? 'Generating...' : 'Run Report'}
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                <TableContainer component={Paper} elevation={3}>
                    <Table sx={{ minWidth: 650 }} aria-label="purchase summary table">
                        <TableHead sx={{ bgcolor: 'action.hover' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Product Code</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total Quantity</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total Purchase Value</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loadingReport ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : purchaseSummaryData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                        No data available for the selected period.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                purchaseSummaryData.map((row, index) => (
                                    <TableRow
                                        key={row.ProductCode || index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.ProductCode}
                                        </TableCell>
                                        <TableCell>
                                            {row.ProductName}
                                        </TableCell>
                                        <TableCell align="right">{row.TotalQuantity}</TableCell>
                                        {/* Assuming TotalPurch or TotalPurchaseValue is the field name */}
                                        <TableCell align="right">${(row.TotalPurch || row.TotalPurchaseValue || 0).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </LocalizationProvider>
    );
};

export default PurchaseSummaryReport;
