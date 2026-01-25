import React from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './theme';
import { DatabaseProvider } from './context/DatabaseContext';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import FastSellersReport from './components/FastSellersReport';
import PurchaseSummaryReport from './components/PurchaseSummaryReport';
import DailyTrendReport from './components/DailyTrendReport';
import MainLayout from './components/MainLayout';

function App() {
  const [activeQuery, setActiveQuery] = React.useState(null);
  const [viewMode, setViewMode] = React.useState('overview');
  const [favorites, setFavorites] = React.useState(() => {
    try {
      const saved = localStorage.getItem('medbag_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse favorites", e);
      return [];
    }
  });

  const handleToggleFavorite = (query) => {
    let newFavs;
    const exists = favorites.find(f => f.sql === query.sql);
    if (exists) {
      newFavs = favorites.filter(f => f.sql !== query.sql);
    } else {
      const newQuery = { ...query, id: query.id || `fav_${Date.now()}` };
      newFavs = [...favorites, newQuery];
    }
    setFavorites(newFavs);
    localStorage.setItem('medbag_favorites', JSON.stringify(newFavs));
  };

  const layoutProps = {
    onSelectQuery: setActiveQuery,
    onViewChange: setViewMode,
    currentView: viewMode,
    favorites: favorites
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DatabaseProvider>
        <Router>
          <Routes>
            <Route path="/" element={
              <MainLayout {...layoutProps}>
                <Dashboard
                  activeQuery={activeQuery}
                  setActiveQuery={setActiveQuery}
                  viewMode={viewMode}
                  favorites={favorites}
                  handleToggleFavorite={handleToggleFavorite}
                />
              </MainLayout>
            } />
            <Route path="/reports/fast-sellers" element={
              <MainLayout {...layoutProps}><FastSellersReport /></MainLayout>
            } />
            <Route path="/reports/purchase-summary" element={
              <MainLayout {...layoutProps}><PurchaseSummaryReport /></MainLayout>
            } />
            <Route path="/reports/daily-trend" element={
              <MainLayout {...layoutProps}><DailyTrendReport /></MainLayout>
            } />
          </Routes>
        </Router>
      </DatabaseProvider>
    </ThemeProvider>
  );
}

export default App;
