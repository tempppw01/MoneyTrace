# MoneyTrace

一个简单的记账示例项目，前端使用 React + Vite，后端使用 FastAPI。

## 功能概览

- 后端提供 `POST /api/transactions` 创建记账记录
- 前端提供最小可用表单，提交后展示返回结果

## 目录结构

```
backend/   # FastAPI 服务
frontend/  # React + Vite 前端
```

## 环境依赖

- Python 3.10+（后端）
- Node.js 18+（前端）

## 后端启动

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

访问健康检查：`http://localhost:8000/api/health`

## 前端启动

```bash
cd frontend
npm install
npm run dev
```

默认前端地址：`http://localhost:5173`

已在 `vite.config.ts` 中配置代理：`/api -> http://localhost:8000`。

## API 示例

```bash
curl -X POST http://localhost:8000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"amount": 12.5, "category": "餐饮", "note": "午饭"}'
```

响应示例：

```json
{
  "id": "uuid",
  "amount": 12.5,
  "category": "餐饮",
  "note": "午饭",
  "created_at": "2026-01-30T06:00:00Z"
}
```

## Docker 部署

```bash
docker compose up --build
```

- 前端访问：`http://localhost:8080`
- 后端健康检查：`http://localhost:8000/api/health`

## 注意事项

- 当前版本使用内存假实现（未连接数据库），仅用于演示。
- 若需接入数据库，可在 `backend/app/adapters/db` 下扩展。