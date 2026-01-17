import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const DatabaseContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useDatabase = () => useContext(DatabaseContext);

export const DatabaseProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [dbName] = useState('MEDBAGSQLDB');
    const [schema, setSchema] = useState(null);
    const [loading, setLoading] = useState(true);

    // Report State
    const [fastSellersData, setFastSellersData] = useState([]);
    const [purchaseSummaryData, setPurchaseSummaryData] = useState([]);
    const [loadingReport, setLoadingReport] = useState(false);

    useEffect(() => {
        checkConnection();
    }, []);

    const checkConnection = async () => {
        try {
            // In a real app, we'd have a specific health check endpoint that verifies DB connectivity
            // For now, we'll try to fetch the schema as a proxy for connection success.
            // Assuming the backend is running and connected.
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
