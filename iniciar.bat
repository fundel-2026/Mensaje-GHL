@echo off
cd /d "%~dp0"

echo Iniciando servidor backend en puerto 3000...
start cmd /k "cd backend && npm install && node server.js"

timeout /t 3

echo Iniciando frontend en puerto 5173...
start cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Ambos servidores se están iniciando...
echo.
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
echo.
pause
