#!/usr/bin/env bash
set -e

echo "[start] 安装后端依赖"
PYTHON_BIN=""
if command -v python3 >/dev/null 2>&1; then
  PYTHON_BIN="python3"
elif command -v python >/dev/null 2>&1; then
  PYTHON_BIN="python"
else
  echo "未找到 python/python3，请确保部署环境包含 Python 3。" >&2
  exit 1
fi

"$PYTHON_BIN" -m pip install --no-cache-dir -r backend/requirements.txt

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