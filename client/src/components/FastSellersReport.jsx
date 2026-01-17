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
    Chip,
    CircularProgress
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useDatabase } from '../context/DatabaseContext';

const FastSellersReport = () => {
    const { fetchFastSellersReport, fastSellersData, loadingReport } = useDatabase();
    const [startDate, setStartDate] = useState(dayjs().startOf('month'));
    const [endDate, setEndDate] = useState(dayjs().endOf('month'));

    const handleRunReport = () => {
        if (startDate && endDate) {
            fetchFastSellersReport(startDate.toISOString(), endDate.toISOString());
        }
    };

    // Calculate Top Vendor
    const topVendor = fastSellersData && fastSellersData.length > 0 ? fastSellersData[0] : null;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                    Fast Sellers Report by Vendor
                </Typography>

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

                {topVendor && (
                    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ mr: 2 }}>Top Performer:</Typography>
                        <Chip
                            icon={<EmojiEventsIcon />}
                            label={`${topVendor.VendorName} - $${topVendor.TotalPurchaseValue?.toFixed(2)}`}
                            color="warning"
                            variant="filled"
                            sx={{ fontSize: '1.1rem', py: 2, px: 1 }}
                        />
                    </Box>
                )}

                <TableContainer component={Paper} elevation={3}>
                    <Table sx={{ minWidth: 650 }} aria-label="fast sellers table">
                        <TableHead sx={{ bgcolor: 'action.hover' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Vendor Name</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total Quantity</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total Purchase Value</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loadingReport ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center" sx={{ py: 5 }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : fastSellersData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                                        No data available for the selected period.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                fastSellersData.map((row, index) => (
                                    <TableRow
                                        key={row.VendorName || index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.VendorName}
                                        </TableCell>
                                        <TableCell align="right">{row.TotalQuantity}</TableCell>
                                        <TableCell align="right">${row.TotalPurchaseValue?.toFixed(2)}</TableCell>
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

export default FastSellersReport;
