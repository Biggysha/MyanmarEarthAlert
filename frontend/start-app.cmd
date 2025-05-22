@echo off
echo Starting Myanmar Earthquake Alert System frontend...
echo.

echo Setting Node.js environment options for compatibility...
set NODE_OPTIONS=--openssl-legacy-provider

echo Installing required dependencies...
call npm install

echo.
echo Starting the React development server...
call npm start

pause
