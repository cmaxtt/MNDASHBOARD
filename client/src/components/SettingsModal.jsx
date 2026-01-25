import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Alert,
    CircularProgress,
    Typography,
    Divider
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useDatabase } from '../context/DatabaseContext';

const SettingsModal = ({ open, onClose }) => {
    const { updateDatabaseSettings, validateSettings, currentSettings } = useDatabase();
    const [formData, setFormData] = useState({
        server: '',
        database: '',
        user: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        if (open && currentSettings) {
            setFormData({
                server: currentSettings.server || '',
                database: currentSettings.database || '',
                user: currentSettings.user || '',
                password: '' // Don't pre-fill password for security
            });
            setStatus({ type: '', message: '' });
        }
    }, [open, currentSettings]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleValidate = async () => {
        setValidating(true);
        setStatus({ type: '', message: '' });
        try {
            const result = await validateSettings(formData);
            if (result.success) {
                setStatus({ type: 'success', message: 'Connection successful!' });
            } else {
                setStatus({ type: 'error', message: result.message || 'Connection failed.' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: error.message || 'An error occurred during validation.' });
        } finally {
            setValidating(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setStatus({ type: '', message: '' });
        try {
            const result = await updateDatabaseSettings(formData);
            if (result.success) {
                setStatus({ type: 'success', message: 'Settings saved and connection updated!' });
                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                setStatus({ type: 'error', message: result.message || 'Failed to save settings.' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: error.message || 'An error occurred while saving.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SettingsIcon color="primary" />
                <Typography variant="h6">Database Settings</Typography>
            </DialogTitle>
            <Divider />
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        Configure the SQL Server connection details. Changes will persist in the server's .env file.
                    </Typography>

                    {status.message && (
                        <Alert severity={status.type} sx={{ mb: 1 }}>
                            {status.message}
                        </Alert>
                    )}

                    <TextField
                        label="Server Address"
                        name="server"
                        value={formData.server}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        placeholder="e.g., localhost or server.domain.com"
                    />
                    <TextField
                        label="Database Name"
                        name="database"
                        value={formData.database}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        label="User ID"
                        name="user"
                        value={formData.user}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
                <Button onClick={onClose} disabled={loading || validating}>
                    Cancel
                </Button>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        onClick={handleValidate}
                        color="secondary"
                        variant="outlined"
                        disabled={loading || validating}
                        startIcon={validating ? <CircularProgress size={20} /> : null}
                    >
                        {validating ? 'Validating...' : 'Validate'}
                    </Button>
                    <Button
                        onClick={handleSave}
                        color="primary"
                        variant="contained"
                        disabled={loading || validating}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {loading ? 'Saving...' : 'Save Settings'}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default SettingsModal;
