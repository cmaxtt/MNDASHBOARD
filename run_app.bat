@echo off
echo Starting MEDBAG Dashboard...

:: Start Backend Server
echo Starting Server...
start "MEDBAG Server" cmd /k "cd server && npm start"

:: Start Frontend Client
echo Starting Client...
start "MEDBAG Client" cmd /k "cd client && npm run dev"

echo App is running!
echo Server: http://localhost:5000
echo Client: http://localhost:5173
pause
