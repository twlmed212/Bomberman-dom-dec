#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_PORT=8080
FRONTEND_PORT=5173

echo "Starting backend on port ${BACKEND_PORT}..."
node "${ROOT_DIR}/backend/server.js" &
BACKEND_PID=$!

cleanup() {
  kill "${BACKEND_PID}" 2>/dev/null || true
}
trap cleanup EXIT

echo "Starting frontend on http://localhost:${FRONTEND_PORT}/frontend/public/index.html"
python3 -m http.server "${FRONTEND_PORT}" -d "${ROOT_DIR}"
