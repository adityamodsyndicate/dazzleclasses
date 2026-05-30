@echo off
title Dazzle Academy Launcher
echo ====================================================
echo ⚡ Starting Dazzle Academy & Computer Hub...
echo ====================================================

:: Move to the directory where the batch file is located
cd /d "%~dp0"

:: Check if Node is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed on this system!
    echo Please install Node.js from https://nodejs.org/ and try again.
    pause
    exit /b
)

:: Check if node_modules exists, if not run npm install
if not exist "node_modules\" (
    echo [INFO] Installing required packages. Please wait...
    call npm install
)

:: Automatically open browser after a short delay
echo [INFO] Opening the browser at http://localhost:3000...
start "" "http://localhost:3000"

:: Start the application
echo [INFO] Running backend and frontend concurrently...
call npm run dev

pause
