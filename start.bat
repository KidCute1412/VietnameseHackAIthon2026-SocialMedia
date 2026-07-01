:; exec bash "$(dirname "$0")/start.sh" "$@"
@echo off
title HypeRoom Orchestrator

echo ===================================================
echo               HYPE ROOM ORCHESTRATOR
echo ===================================================
echo.

set PROJECT_DIR=%~dp0
set DB_CONTAINER=hyperoom-postgres
set DB_USER=postgres
set DB_NAME=mydb

:: 1. Start Database
echo [1/3] Starting PostgreSQL database...
cd /d "%PROJECT_DIR%app"

docker compose -f docker-compose.yaml up -d postgres
if errorlevel 1 (
    echo Failed to start PostgreSQL with Docker Compose.
    echo Please make sure Docker Desktop or Docker Engine is running.
    pause
    exit /b 1
)

echo Waiting for PostgreSQL to become ready...
for /L %%i in (1,1,30) do (
    docker exec "%DB_CONTAINER%" pg_isready -U "%DB_USER%" -d "%DB_NAME%" >nul 2>nul
    if not errorlevel 1 goto db_ready
    timeout /t 1 /nobreak >nul
)

echo PostgreSQL did not become ready in time.
pause
exit /b 1

:db_ready
echo PostgreSQL is ready.

:: 2. Setup & Start Backend
echo.
echo [2/3] Checking Backend environment...
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
start "HypeRoom Backend" cmd /k "call .venv\Scripts\activate && uvicorn main:app --reload --host 0.0.0.0 --port 3000"

:: 3. Setup & Start Frontend
echo.
echo [3/3] Checking Frontend environment...
cd /d "%PROJECT_DIR%app\client"

dir /ad node_modules >nul 2>nul
if errorlevel 1 (
    echo node_modules not found. Running npm install...
    call npm install
)

echo Spawning Frontend process in a new window...
start "HypeRoom Frontend" cmd /k "npm run dev"

echo.
echo ===================================================
echo  Both Frontend and Backend are booting up!
echo  - Database: localhost:5432
echo  - Backend: http://127.0.0.1:3000
echo  - Frontend: Check the console output for port
echo ===================================================
pause
