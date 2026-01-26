# Changelog

All notable changes to the MEDBAG Dashboard project will be documented in this file.

## [2026-01-26] - Reporting Overhaul

### Added
- **MUI X Data Grid**: Integrated for all major report tables, providing superior performance, filtering, and sorting capabilities.
- **Recharts**: Added for dynamic, responsive data visualization.
- **KPICard Component**: A new reusable component for displaying high-level statistics with icons and trend indicators.
- **Area Chart (Daily Trend)**: Beautifully visualized sales trends with custom gradients.
- **Bar Chart (Fast Sellers)**: Comparative visualization of top-performing vendors.

### Changed
- **DailyTrendReport**: Refactored to include "Total Revenue", "Daily Average", and "Peak Sales" KPI cards alongside a new Area Chart and Data Grid.
- **FastSellersReport**: Refactored to include "Top Performer", "Total Purchase Value", and "Units Sold" KPI cards, plus a Top 10 Vendor Bar Chart.
- **PurchaseSummaryReport**: Refactored with KPI cards for "Total Sales Value", "Units Sold", and "Unique Products", managed via a high-performance Data Grid.
- **UI Styling**: Enhanced report layouts with standardized spacing and modern dashboard patterns.

### Technical
- Installed `@mui/x-data-grid`, `recharts`, and `@mui/lab`.
- Resolved peer dependency conflicts with `mui-datatables` using `--legacy-peer-deps`.
- Optimized data transformation for charts and grids using `useMemo`.
