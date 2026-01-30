#!/usr/bin/env bash
set -e

echo "[start] 安装后端依赖"
python3 -m venv .venv
source .venv/bin/activate
pip install --no-cache-dir -r backend/requirements.txt

echo "[start] 构建前端"
cd frontend
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi
npm run build
cd ..

echo "[start] 启动后端"
export FRONTEND_DIST="$(pwd)/frontend/dist"
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000