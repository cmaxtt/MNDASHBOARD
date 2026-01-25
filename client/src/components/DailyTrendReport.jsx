import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    Alert,
    Grid,
    Button
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import MUIDataTable from "mui-datatables";
import { useDatabase } from '../context/DatabaseContext';
import api from '../services/api';
import SmartChart from './SmartChart';

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
            // Using the SQL logic from SAMPLE_QUERIES but parameterized by date
            const sql = `
                SELECT 
                    CAST(InvoiceDate AS DATE) as Date, 
                    SUM(SaletotalVI) as TotalSales 
                FROM tblInvoices 
                WHERE InvoiceDate BETWEEN '${startDate.format('YYYY-MM-DD')}' AND '${endDate.format('YYYY-MM-DD')}'
                GROUP BY CAST(InvoiceDate AS DATE) 
                ORDER BY Date ASC
            `;
            const response = await api.post('/execute', { query: sql });
            setData(response.data);
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

    const columns = [
        {
            name: 'Date', label: 'Date', options: {
                customBodyRender: (value) => value ? dayjs(value).format('YYYY-MM-DD') : ''
            }
        },
        {
            name: 'TotalSales', label: 'Total Sales', options: {
                customBodyRender: (value) => `$${value?.toFixed(2)}`
            }
        }
    ];

    const options = {
        filterType: 'multiselect',
        selectableRows: 'none',
        elevation: 0,
        responsive: 'standard',
        tableBodyHeight: 'auto',
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                Daily Sales Trend
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
                            onClick={fetchTrendData}
                            fullWidth
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Update Trend'}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {loading ? (
                <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>
            ) : (
                <React.Fragment>
                    {data.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                            <SmartChart data={data} title="Sales Trend Over Time" />
                        </Box>
                    )}
                    <Paper sx={{ overflow: 'hidden' }}>
                        <MUIDataTable
                            title={"Daily Sales Summary"}
                            data={data}
                            columns={columns}
                            options={options}
                        />
                    </Paper>
                </React.Fragment>
            )}
        </LocalizationProvider>
    );
};

export default DailyTrendReport;
