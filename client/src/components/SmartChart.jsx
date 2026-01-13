import React, { useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Box, Paper } from '@mui/material';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const SmartChart = ({ data, title }) => {
    const chartConfig = useMemo(() => {
        if (!data || data.length === 0) return null;

        const keys = Object.keys(data[0]);
        // Simple heuristic: find first string/date column for labels, first number for values
        const labelKey = keys.find(k => typeof data[0][k] === 'string' || data[0][k] instanceof Date);
        const valueKey = keys.find(k => typeof data[0][k] === 'number');

        if (!labelKey || !valueKey) return null;

        const labels = data.map(item => item[labelKey]);
        const values = data.map(item => item[valueKey]);

        // Heuristics for chart type
        // 1. If label is "Date" or looks like date -> Line Chart
        // 2. If <= 5 categories -> Doughnut
        // 3. Else -> Bar Chart

        let type = 'bar';
        if (labelKey.toLowerCase().includes('date')) {
            type = 'line';
        } else if (data.length <= 5) {
            type = 'doughnut';
        }

        return { type, labels, values, labelKey, valueKey };

    }, [data]);

    if (!chartConfig) return null;

    const { type, labels, values, labelKey, valueKey } = chartConfig;

    const chartData = {
        labels,
        datasets: [
            {
                label: valueKey,
                data: values,
                backgroundColor: [
                    'rgba(0, 229, 255, 0.6)',
                    'rgba(255, 41, 117, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                ],
                borderColor: [
                    'rgba(0, 229, 255, 1)',
                    'rgba(255, 41, 117, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: 'white' }
            },
            title: {
                display: true,
                text: title,
                color: 'white'
            },
        },
        scales: type !== 'doughnut' ? {
            y: { ticks: { color: 'gray' }, grid: { color: 'rgba(255,255,255,0.1)' } },
            x: { ticks: { color: 'gray' }, grid: { color: 'rgba(255,255,255,0.1)' } }
        } : {}
    };

    return (
        <Paper sx={{ p: 2, mb: 3, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ width: '100%', height: '100%' }}>
                {type === 'line' && <Line options={options} data={chartData} />}
                {type === 'bar' && <Bar options={options} data={chartData} />}
                {type === 'doughnut' && <Box sx={{ maxWidth: 400, mx: 'auto' }}><Doughnut options={options} data={chartData} /></Box>}
            </Box>
        </Paper>
    );
};

export default SmartChart;
