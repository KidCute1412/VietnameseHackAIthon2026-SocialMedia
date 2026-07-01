#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$ROOT_DIR/app"
SERVER_DIR="$APP_DIR/server"
CLIENT_DIR="$APP_DIR/client"
COMPOSE_FILE="$APP_DIR/docker-compose.yaml"

DB_CONTAINER="${DB_CONTAINER:-hyperoom-postgres}"
DB_USER="${DB_USER:-postgres}"
DB_NAME="${DB_NAME:-mydb}"
BACKEND_HOST="${BACKEND_HOST:-0.0.0.0}"
BACKEND_PORT="${BACKEND_PORT:-3000}"

BACKEND_PID=""
FRONTEND_PID=""

print_header() {
    echo "==================================================="
    echo "              HYPE ROOM ORCHESTRATOR"
    echo "==================================================="
}

fail() {
    echo "$1" >&2
    exit 1
}

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

cleanup() {
    if [[ -n "$BACKEND_PID" ]]; then
        kill "$BACKEND_PID" >/dev/null 2>&1 || true
    fi

    if [[ -n "$FRONTEND_PID" ]]; then
        kill "$FRONTEND_PID" >/dev/null 2>&1 || true
    fi
}

find_python() {
    if [[ -n "${PYTHON_BIN:-}" ]]; then
        echo "$PYTHON_BIN"
        return
    fi

    if command_exists python3; then
        echo "python3"
        return
    fi

    if command_exists python; then
        echo "python"
        return
    fi

    fail "Python 3.10+ is required but was not found."
}

wait_for_database() {
    echo "Waiting for PostgreSQL to become ready..."

    for _ in $(seq 1 30); do
        if docker exec "$DB_CONTAINER" pg_isready -U "$DB_USER" -d "$DB_NAME" >/dev/null 2>&1; then
            echo "PostgreSQL is ready."
            return
        fi

        sleep 1
    done

    fail "PostgreSQL did not become ready in time."
}

trap cleanup INT TERM EXIT

print_header

[[ -f "$COMPOSE_FILE" ]] || fail "Missing compose file: $COMPOSE_FILE"
command_exists docker || fail "Docker is required but was not found."
docker compose version >/dev/null 2>&1 || fail "Docker Compose is required but was not found."
command_exists npm || fail "npm is required but was not found."

echo
echo "[1/3] Starting PostgreSQL database..."
docker compose -f "$COMPOSE_FILE" up -d postgres
wait_for_database

echo
echo "[2/3] Checking Backend environment..."
PYTHON="$(find_python)"

if [[ ! -d "$SERVER_DIR/.venv" ]]; then
    echo "Virtual environment .venv not found. Creating it..."
    "$PYTHON" -m venv "$SERVER_DIR/.venv"
fi

echo "Activating virtual environment and verifying dependencies..."
"$SERVER_DIR/.venv/bin/python" -m pip install -r "$SERVER_DIR/requirements.txt"

echo "Starting Backend process..."
(
    cd "$SERVER_DIR"
    exec .venv/bin/uvicorn main:app --reload --host "$BACKEND_HOST" --port "$BACKEND_PORT"
) &
BACKEND_PID=$!

echo
echo "[3/3] Checking Frontend environment..."
if [[ ! -d "$CLIENT_DIR/node_modules" ]]; then
    echo "node_modules not found. Running npm install..."
    (cd "$CLIENT_DIR" && npm install)
fi

echo "Starting Frontend process..."
(
    cd "$CLIENT_DIR"
    exec npm run dev
) &
FRONTEND_PID=$!

echo
echo "==================================================="
echo " Both Frontend and Backend are booting up!"
echo " - Database: localhost:5432"
echo " - Backend: http://127.0.0.1:3000"
echo " - Frontend: http://localhost:5173"
echo " Press Ctrl+C to stop Backend and Frontend."
echo "==================================================="

wait -n "$BACKEND_PID" "$FRONTEND_PID"
