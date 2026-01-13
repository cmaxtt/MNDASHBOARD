import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, FormControl, InputLabel, Select, MenuItem, Chip, Button, Grid } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useDatabase } from '../context/DatabaseContext';

const VisualQueryBuilder = ({ onExecute }) => {
    const { schema } = useDatabase();
    const [selectedTable, setSelectedTable] = useState('');
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [filters, setFilters] = useState([]); // { column, operator, value }
    const [generatedSql, setGeneratedSql] = useState('');

    useEffect(() => {
        generateSql();
    }, [selectedTable, selectedColumns, filters]);

    const handleTableChange = (event) => {
        setSelectedTable(event.target.value);
        setSelectedColumns([]);
        setFilters([]);
    };

    const handleColumnToggle = (column) => {
        const currentIndex = selectedColumns.indexOf(column);
        const newChecked = [...selectedColumns];

        if (currentIndex === -1) {
            newChecked.push(column);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setSelectedColumns(newChecked);
    };

    const generateSql = () => {
        if (!selectedTable) {
            setGeneratedSql('');
            return;
        }

        let cols = selectedColumns.length > 0 ? selectedColumns.join(', ') : '*';
        let sql = `SELECT ${cols} FROM ${selectedTable}`;

        if (filters.length > 0) {
            // Very basic filter logic for demo
            const whereClauses = filters.map(f => `${f.column} ${f.operator} '${f.value}'`);
            sql += ` WHERE ${whereClauses.join(' AND ')}`;
        }

        setGeneratedSql(sql);
    };

    return (
        <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
                Visual Query Builder
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Select Table</InputLabel>
                        <Select
                            value={selectedTable}
                            label="Select Table"
                            onChange={handleTableChange}
                        >
                            {schema && Object.keys(schema).map((table) => (
                                <MenuItem key={table} value={table}>{table}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {selectedTable && schema[selectedTable] && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>Columns</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {schema[selectedTable].map((col) => (
                                    <Chip
                                        key={col.name}
                                        label={col.name}
                                        onClick={() => handleColumnToggle(col.name)}
                                        color={selectedColumns.includes(col.name) ? "primary" : "default"}
                                        variant={selectedColumns.includes(col.name) ? "filled" : "outlined"}
                                        clickable
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}
                </Grid>

                <Grid item xs={12} md={8}>
                    <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1, minHeight: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column', gap: 2 }}>
                        <Typography variant="body1" component="pre" sx={{ fontFamily: 'monospace', m: 0, width: '100%', overflowX: 'auto' }}>
                            {generatedSql || '-- Select a table to generate SQL'}
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<PlayArrowIcon />}
                            disabled={!generatedSql}
                            onClick={() => onExecute({ title: 'Custom Query', sql: generatedSql })}
                            fullWidth
                        >
                            Run Query
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default VisualQueryBuilder;
