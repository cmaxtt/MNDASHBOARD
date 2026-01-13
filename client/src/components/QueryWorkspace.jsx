import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, CircularProgress, Alert, Button, IconButton } from '@mui/material';
import MUIDataTable from "mui-datatables";
import DownloadIcon from '@mui/icons-material/Download';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Papa from 'papaparse';
import api from '../services/api';
import SmartChart from './SmartChart';

const QueryWorkspace = ({ activeQuery, onToggleFavorite, isFavorite }) => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (activeQuery) {
            executeQuery(activeQuery.sql);
        }
    }, [activeQuery]);

    const executeQuery = async (sql) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/execute', { query: sql });
            setResults(response.data);
        } catch (err) {
            console.error(err);
            setError('Failed to execute query: ' + (err.response?.data || err.message));
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        const csv = Papa.unparse(results);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${activeQuery?.title || 'export'}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!activeQuery) {
        return (
            <Paper sx={{ p: 4, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">Select a query from the sidebar to get started.</Typography>
            </Paper>
        );
    }

    const columns = results.length > 0 ? Object.keys(results[0]).map(key => ({
        name: key,
        label: key,
        options: { filter: true, sort: true }
    })) : [];

    const options = {
        filterType: 'checkbox',
        selectableRows: 'none',
        elevation: 0,
        responsive: 'standard',
        tableBodyHeight: '400px',
        download: false, // We use custom download button
        print: false,
    };

    return (
        <React.Fragment>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="h6" color="primary">
                            {activeQuery.title}
                        </Typography>
                        <IconButton onClick={() => onToggleFavorite(activeQuery)} color={isFavorite ? "secondary" : "default"}>
                            {isFavorite ? <StarIcon /> : <StarBorderIcon />}
                        </IconButton>
                    </Box>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', opacity: 0.7 }}>
                        {activeQuery.sql}
                    </Typography>
                </Box>
                {results.length > 0 && (
                    <Button
                        startIcon={<DownloadIcon />}
                        variant="outlined"
                        onClick={handleDownload}
                        size="small"
                    >
                        Export CSV
                    </Button>
                )}
            </Box>

            {loading && <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>}

            {error && <Alert severity="error">{error}</Alert>}

            {!loading && !error && results.length > 0 && (
                <React.Fragment>
                    <SmartChart data={results} title={activeQuery.title} />
                    <Paper sx={{ overflow: 'hidden' }}>
                        <MUIDataTable
                            title={"Query Results"}
                            data={results}
                            columns={columns}
                            options={options}
                        />
                    </Paper>
                </React.Fragment>
            )}
            {!loading && !error && results.length === 0 && (
                <Typography variant="body2" color="text.secondary">No results found.</Typography>
            )}
        </React.Fragment>
    );
};

export default QueryWorkspace;
