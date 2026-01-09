@echo off
echo.
echo ====================================
echo   Snap2Slides Network Setup
echo ====================================
echo.

:: Stop any existing processes
taskkill /F /IM node.exe >nul 2>&1

:: Get network IPs
node show-network-urls.js

echo.
echo ⚡ Starting server with network access...
echo.

:: Start the server
start /B npm run dev:network

:: Wait for server to start
timeout /t 5 /nobreak >nul

echo ✅ Server should be running now!
echo.
echo 🔗 Try these URLs on your mobile device:
echo    • http://192.168.56.1:3000
echo    • http://192.168.1.33:3000
echo.
echo 💡 Troubleshooting:
echo    • Make sure both devices are on same WiFi
echo    • Check Windows Firewall if connection fails
echo    • Try opening Windows Defender Firewall to allow Node.js
echo.
echo Press any key to exit...
pause >nul