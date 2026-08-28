#!/usr/bin/env bash
set -e

echo "=== 1/3 Installing & Building Frontend (client) ==="
cd client
npm install --no-audit --no-fund
npm run build

echo "=== 2/3 Installing Backend (server) ==="
cd ../server
npm install --no-audit --no-fund

echo "=== 3/3 Build Complete! Ready to launch. ==="
