import React from 'react';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, Paper } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorageIcon from '@mui/icons-material/Storage';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import StarIcon from '@mui/icons-material/Star';


const Sidebar = ({ onSelectQuery, onViewChange, currentView, favorites = [] }) => {
    return (
        <Paper
            sx={{
                width: 280,
                flexShrink: 0,
                height: '100%',
                borderRadius: 0,
                borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                overflowY: 'auto'
            }}
        >
            <Box sx={{ p: 2 }}>
                <Typography variant="overline" color="text.secondary">
                    Navigation
                </Typography>
            </Box>
            <List>
                <ListItemButton
                    selected={currentView === 'overview'}
                    onClick={() => onViewChange('overview')}
                >
                    <ListItemIcon>
                        <DashboardIcon color={currentView === 'overview' ? "primary" : "inherit"} />
                    </ListItemIcon>
                    <ListItemText primary="Overview" />
                </ListItemButton>
                <ListItemButton
                    selected={currentView === 'builder'}
                    onClick={() => onViewChange('builder')}
                >
                    <ListItemIcon>
                        <QueryStatsIcon color={currentView === 'builder' ? "primary" : "inherit"} />
                    </ListItemIcon>
                    <ListItemText primary="Query Builder" />
                </ListItemButton>
            </List>

            {favorites.length > 0 && (
                <React.Fragment>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ p: 2 }}>
                        <Typography variant="overline" color="text.secondary">
                            Favorites
                        </Typography>
                    </Box>
                    <List dense>
                        {favorites.map((query) => (
                            <ListItemButton key={query.id} onClick={() => onSelectQuery(query)}>
                                <ListItemIcon>
                                    <StarIcon fontSize="small" color="secondary" />
                                </ListItemIcon>
                                <ListItemText primary={query.title} />
                            </ListItemButton>
                        ))}
                    </List>
                </React.Fragment>
            )}

            <Divider sx={{ my: 1 }} />
            <Box sx={{ p: 2 }}>
                <Typography variant="overline" color="text.secondary">
                    Reports
                </Typography>
            </Box>
            <List dense>
                <ListItemButton onClick={() => window.location.href = '/reports/fast-sellers'}>
                    <ListItemIcon>
                        <QueryStatsIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Fast Sellers Report" />
                </ListItemButton>
                <ListItemButton onClick={() => window.location.href = '/reports/daily-trend'}>
                    <ListItemIcon>
                        <QueryStatsIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Daily Trend Report" />
                </ListItemButton>
                <ListItemButton onClick={() => window.location.href = '/reports/purchase-summary'}>
                    <ListItemIcon>
                        <QueryStatsIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Purchase Summary" />
                </ListItemButton>
            </List>


        </Paper>
    );
};

export default Sidebar;
