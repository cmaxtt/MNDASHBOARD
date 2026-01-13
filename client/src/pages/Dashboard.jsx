import React, { useState, useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import Sidebar from '../components/Sidebar';
import QueryWorkspace from '../components/QueryWorkspace';
import VisualQueryBuilder from '../components/VisualQueryBuilder';

const Dashboard = () => {
    const [activeQuery, setActiveQuery] = useState(null);
    const [viewMode, setViewMode] = useState('overview'); // 'overview' | 'builder'
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('medbag_favorites');
        if (saved) {
            setFavorites(JSON.parse(saved));
        }
    }, []);

    const handleExecuteCustom = (query) => {
        setActiveQuery(query);
    };

    const handleToggleFavorite = (query) => {
        let newFavs;
        const exists = favorites.find(f => f.sql === query.sql); // Simple duplicate check

        if (exists) {
            newFavs = favorites.filter(f => f.sql !== query.sql);
        } else {
            // Ensure ID
            const newQuery = { ...query, id: query.id || `fav_${Date.now()}` };
            newFavs = [...favorites, newQuery];
        }

        setFavorites(newFavs);
        localStorage.setItem('medbag_favorites', JSON.stringify(newFavs));
    };

    const isFavorite = activeQuery ? favorites.some(f => f.sql === activeQuery.sql) : false;

    return (
        <Box sx={{ display: 'flex', height: '100%' }}>
            <Sidebar
                onSelectQuery={setActiveQuery}
                onViewChange={setViewMode}
                currentView={viewMode}
                favorites={favorites}
            />
            <Box component="main" sx={{ flexGrow: 1, p: 2, overflow: 'auto' }}>
                <Grid container spacing={3}>
                    {viewMode === 'builder' && (
                        <Grid item xs={12}>
                            <VisualQueryBuilder onExecute={handleExecuteCustom} />
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
            </Box>
        </Box>
    );
};

export default Dashboard;
