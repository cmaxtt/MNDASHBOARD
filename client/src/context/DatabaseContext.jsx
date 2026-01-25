import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const DatabaseContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useDatabase = () => useContext(DatabaseContext);

export const DatabaseProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [dbName, setDbName] = useState('MEDBAGSQLDB');
    const [schema, setSchema] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentSettings, setCurrentSettings] = useState(null);

    // Report State
    const [fastSellersData, setFastSellersData] = useState([]);
    const [purchaseSummaryData, setPurchaseSummaryData] = useState([]);
    const [loadingReport, setLoadingReport] = useState(false);

    useEffect(() => {
        fetchCurrentSettings();
        checkConnection();
    }, []);

    const fetchCurrentSettings = async () => {
        try {
            const response = await api.get('/settings/current');
            setCurrentSettings(response.data);
            setDbName(response.data.database || 'MEDBAGSQLDB');
        } catch (error) {
            console.error("Failed to fetch current settings:", error);
        }
    };

    const checkConnection = async () => {
        try {
            const response = await api.get('/schema/summary');
            if (response.status === 200) {
                setIsConnected(true);
                setSchema(response.data);
            }
        } catch (error) {
            console.error("Connection check failed:", error);
            setIsConnected(false);
        } finally {
            setLoading(false);
        }
    };

    const validateSettings = async (credentials) => {
        try {
            const response = await api.post('/settings/validate', credentials);
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message
            };
        }
    };

    const updateDatabaseSettings = async (credentials) => {
        try {
            const response = await api.post('/settings/save', credentials);
            if (response.data.success) {
                await fetchCurrentSettings();
                await checkConnection();
            }
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message
            };
        }
    };

    const fetchFastSellersReport = async (startDate, endDate) => {
        setLoadingReport(true);
        try {
            const response = await api.get(`/reports/fast-sellers`, {
                params: { startDate, endDate }
            });
            setFastSellersData(response.data);
        } catch (error) {
            console.error("Failed to fetch fast sellers report:", error);
        } finally {
            setLoadingReport(false);
        }
    };

    const fetchPurchaseSummaryReport = async (startDate, endDate) => {
        setLoadingReport(true);
        try {
            const response = await api.get(`/reports/purchase-summary`, {
                params: { startDate, endDate }
            });
            setPurchaseSummaryData(response.data);
        } catch (error) {
            console.error("Failed to fetch purchase summary report:", error);
            throw error;
        } finally {
            setLoadingReport(false);
        }
    };

    return (
        <DatabaseContext.Provider value={{
            isConnected,
            dbName,
            schema,
            loading,
            checkConnection,
            currentSettings,
            validateSettings,
            updateDatabaseSettings,
            fastSellersData,
            purchaseSummaryData,
            loadingReport,
            fetchFastSellersReport,
            fetchPurchaseSummaryReport
        }}>
            {children}
        </DatabaseContext.Provider>
    );
};
