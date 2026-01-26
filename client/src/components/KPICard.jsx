import React from 'react';
import { Paper, Typography, Box, Stack, useTheme } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const KPICard = ({ title, value, icon, trend, subValue, color }) => {
    const theme = useTheme();
    const cardColor = color || theme.palette.primary.main;

    return (
        <Paper
            elevation={3}
            sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '4px',
                    height: '100%',
                    backgroundColor: cardColor,
                }
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    {title}
                </Typography>
                {icon && (
                    <Box sx={{
                        color: cardColor,
                        p: 1,
                        borderRadius: '50%',
                        bgcolor: `${cardColor}22`
                    }}>
                        {icon}
                    </Box>
                )}
            </Box>

            <Box>
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
                    {value}
                </Typography>
                {subValue && (
                    <Typography variant="body2" color="text.secondary">
                        {subValue}
                    </Typography>
                )}

                {trend && (
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                        {trend.value >= 0 ? (
                            <TrendingUpIcon fontSize="small" color="success" />
                        ) : (
                            <TrendingDownIcon fontSize="small" color="error" />
                        )}
                        <Typography
                            variant="body2"
                            color={trend.value >= 0 ? 'success.main' : 'error.main'}
                            fontWeight="500"
                        >
                            {Math.abs(trend.value)}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {trend.label}
                        </Typography>
                    </Stack>
                )}
            </Box>
        </Paper>
    );
};

export default KPICard;
