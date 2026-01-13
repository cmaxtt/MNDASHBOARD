import React from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './theme';
import { DatabaseProvider } from './context/DatabaseContext';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DatabaseProvider>
        <Router>
          <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', bgcolor: 'background.default' }}>
            <Header />
            <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </DatabaseProvider>
    </ThemeProvider>
  );
}

export default App;
