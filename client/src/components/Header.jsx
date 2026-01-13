import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Chip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import { useDatabase } from '../context/DatabaseContext';

const Header = () => {
    const { isConnected, dbName } = useDatabase();

    return (
        <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 2 }}>
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, letterSpacing: '0.1em', fontWeight: 'bold', background: 'linear-gradient(45deg, #00e5ff, #ff2975)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    MEDBAG ANALYTICS
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                    <Chip
                        icon={isConnected ? <WifiIcon /> : <WifiOffIcon />}
                        label={isConnected ? `Connected: ${dbName}` : "Disconnected"}
                        color={isConnected ? "success" : "error"}
                        variant="outlined"
                        sx={{ backdropFilter: 'blur(5px)' }}
                    />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
