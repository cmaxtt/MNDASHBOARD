# MEDBAG Analytics Dashboard

A high-performance, dark-themed analytics dashboard built for the MEDBAGSQLDB system. This application provides real-time sales insights, a visual SQL query builder, and interactive data visualization.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![React](https://img.shields.io/badge/React-18-blue)
![Node](https://img.shields.io/badge/Node.js-Express-green)

## Features

-   **📊 Analytics Engine**: Pre-built high-value queries (Daily Trends, Top Salespeople, Stock Alerts).
-   **🎨 Visual Query Builder**: Drag-and-drop interface to build complex SQL queries without writing code.
-   **📈 Smart Visualization**: Automatically selects the best chart type (Line, aggregate Bar, Doughnut) based on your data.
-   **💾 Persistence**: Save your favorite queries for quick access later.
-   **✨ Vibe Design**: Modern "Glassmorphism" UI with dark mode and smooth transitions using MUI.

## Tech Stack

-   **Frontend**: React (Vite), Material UI (MUI), Chart.js, Axios.
-   **Backend**: Node.js, Express.
-   **Database**: MS SQL Server (via `mssql`/Tedious driver).

## Getting Started

### Prerequisites

-   Node.js (v16+)
-   MS SQL Server instance with `MEDBAGSQLDB` (or compatible schema).

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/cmaxtt/MNDASHBOARD.git
    cd MNDASHBOARD
    ```

2.  **Setup the Backend**
    ```bash
    cd server
    npm install
    ```
    *   Create a `.env` file in the `server` directory:
        ```env
        PORT=5000
        DB_USER=your_db_user
        DB_PASSWORD=your_db_password
        DB_SERVER=your_server_address
        DB_DATABASE=MEDBAGSQLDB
        ```
    *   Start the server:
        ```bash
        npm start
        ```

3.  **Setup the Frontend**
    Open a new terminal:
    ```bash
    cd client
    npm install
    # Important: Run with cmd /c on Windows if you see PowerShell errors
    cmd /c npm run dev
    ```

## Troubleshooting

### Windows PowerShell Error
If you see `running scripts is disabled on this system` when running `npm`:
-   **Solution**: Use **Command Prompt (cmd)** instead of PowerShell.
-   **Alternative**: Run `cmd /c npm run dev` directly in PowerShell.

## License

ISC
