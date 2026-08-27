@echo off
title Discord Ticket Bot - 1-Click Installer
color 0b
cls

echo =======================================================================
echo           MINOFORGE DISCORD TICKET BOT — 1-CLICK INSTALLER
echo =======================================================================
echo.
echo [1/3] Checking Node.js installation...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    color 0c
    echo [ERROR] Node.js is NOT installed on your computer!
    echo Please download and install Node.js (v18+) from: https://nodejs.org
    echo.
    pause
    exit /b
)
echo [OK] Node.js is installed!
echo.

echo [2/3] Installing Discord.js dependencies (npm install)...
echo Please wait a moment while packages are being downloaded...
echo.
call npm install
if %errorlevel% neq 0 (
    color 0c
    echo [ERROR] Failed to install dependencies. Please check your internet connection.
    pause
    exit /b
)
echo.
echo [OK] All dependencies installed successfully!
echo.

echo [3/3] Setting up configuration template...
if not exist "config.json" (
    if exist "config.example.json" (
        copy "config.example.json" "config.json" >nul
        echo [OK] Created "config.json" from "config.example.json"!
    )
) else (
    echo [OK] Existing "config.json" found.
)
echo.

color 0a
echo =======================================================================
echo                     INSTALLATION COMPLETE! 🎉
echo =======================================================================
echo.
echo NEXT STEPS:
echo   1. Open "config.json" (or "config.example.json") and paste your:
echo      - Bot Token (from https://discord.com/developers/applications)
echo      - Client ID & Server (Guild) ID
echo      - Support Staff Role ID
echo.
echo   2. Start your bot by running:
echo      node index.js
echo.
echo   3. In your Discord server #support channel, run:
echo      /ticket setup
echo =======================================================================
echo.
pause
