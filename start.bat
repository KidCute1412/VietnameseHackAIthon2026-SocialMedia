@echo off
title HypeRoom Orchestrator

echo ===================================================
echo               HYPE ROOM ORCHESTRATOR
echo ===================================================
echo.

set PROJECT_DIR=%~dp0

:: 1. Setup & Start Backend
echo [1/2] Checking Backend environment...
cd /d "%PROJECT_DIR%app\server"

dir /ad .venv >nul 2>nul
if errorlevel 1 (
    echo Virtual environment venv not found. Creating it...
    python -m venv .venv
)

echo Activating virtual environment and verifying dependencies...
call .venv\Scripts\activate
pip install -r requirements.txt

echo Spawning Backend process in a new window...
start "HypeRoom Backend" cmd /k "call .venv\Scripts\activate && cd /d "%PROJECT_DIR%app\server" && uvicorn main:app --reload --port 8000"

:: 2. Setup & Start Frontend
echo.
echo [2/2] Checking Frontend environment...
cd /d "%PROJECT_DIR%app\client"

dir /ad node_modules >nul 2>nul
if errorlevel 1 (
    echo node_modules not found. Running npm install...
    call npm install
)

echo Spawning Frontend process in a new window...
start "HypeRoom Frontend" cmd /k "cd /d "%PROJECT_DIR%app\client" && npm run dev"

echo.
echo ===================================================
echo  Both Frontend and Backend are booting up!
echo  - Backend: http://127.0.0.1:8000
echo  - Frontend: Check the console output for port
echo ===================================================
pause
