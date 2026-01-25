import React from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = ({ children, onViewChange, currentView, favorites, onSelectQuery }) => {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', bgcolor: 'background.default' }}>
            <Header />
            <Box sx={{ display: 'flex', flexGrow: 1, height: 'calc(100vh - 84px)', overflow: 'hidden' }}>
                <Sidebar
                    onSelectQuery={onSelectQuery}
                    onViewChange={onViewChange}
                    currentView={currentView}
                    favorites={favorites}
                />
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        overflowX: 'hidden',
                        overflowY: 'auto',
                        width: '100%'
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default MainLayout;
