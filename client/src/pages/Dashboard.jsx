import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';
import QueryWorkspace from '../components/QueryWorkspace';
import VisualQueryBuilder from '../components/VisualQueryBuilder';

const Dashboard = ({ activeQuery, setActiveQuery, viewMode, favorites, handleToggleFavorite }) => {
    const isFavorite = activeQuery ? favorites.some(f => f.sql === activeQuery.sql) : false;

    return (
        <Grid container spacing={3}>
            {viewMode === 'builder' && (
                <Grid item xs={12}>
                    <VisualQueryBuilder onExecute={setActiveQuery} />
                </Grid>
            )}

            <Grid item xs={12}>
                <QueryWorkspace
                    activeQuery={activeQuery}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorite={isFavorite}
                />
            </Grid>
        </Grid>
    );
};

export default Dashboard;
