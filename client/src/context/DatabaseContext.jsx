import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const DatabaseContext = createContext();

export const useDatabase = () => useContext(DatabaseContext);

export const DatabaseProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [dbName, setDbName] = useState('MEDBAGSQLDB');
    const [schema, setSchema] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkConnection();
    }, []);

    const checkConnection = async () => {
        try {
            // In a real app, we'd have a specific health check endpoint that verifies DB connectivity
            // For now, we'll try to fetch the schema as a proxy for connection success.
            // Assuming the backend is running and connected.
            const response = await axios.get('http://localhost:5000/api/schema/summary');
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

    return (
        <DatabaseContext.Provider value={{ isConnected, dbName, schema, loading, checkConnection }}>
            {children}
        </DatabaseContext.Provider>
    );
};
