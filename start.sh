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

echo "[start] 开始安装 Python 依赖..."
"$PYTHON_BIN" -m pip install --no-cache-dir -r backend/requirements.txt 2>&1
echo "[start] ✓ Python 依赖安装完成"

echo "[start] 构建前端"
cd frontend
if [ -f package-lock.json ]; then
  echo "[start] 使用 npm ci 安装前端依赖..."
  npm ci 2>&1
else
  echo "[start] 使用 npm install 安装前端依赖..."
  npm install 2>&1
fi
echo "[start] ✓ 前端依赖安装完成"

echo "[start] 开始构建前端..."
npm run build 2>&1
echo "[start] ✓ 前端构建完成"
cd ..

echo "[start] 启动后端服务"
export FRONTEND_DIST="$(pwd)/frontend/dist"
PORT_VALUE=${PORT:-8080}
echo "[start] 监听端口: $PORT_VALUE"
cd backend
exec uvicorn app.main:app --host 0.0.0.0 --port "$PORT_VALUE"
