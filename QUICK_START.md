# MoneyTrace 快速启动指南

## ✅ 项目已就绪！

所有必要的配置文件和 Python 包结构已经创建完成。现在只需安装依赖并启动即可。

## 🚀 启动步骤

### 方式一：本地开发（推荐用于开发调试）

#### 1. 启动后端

打开终端 1：

```bash
cd /Users/beiguangsheng/Downloads/MoneyTrace/backend

# 创建虚拟环境
python3 -m venv .venv

# 激活虚拟环境
source .venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 启动后端服务
uvicorn app.main:app --reload --port 8000
```

后端启动后访问：
- API 文档：http://localhost:8000/docs
- 健康检查：http://localhost:8000/api/health

#### 2. 启动前端

打开终端 2：

```bash
cd /Users/beiguangsheng/Downloads/MoneyTrace/frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端启动后访问：http://localhost:5173

### 方式二：Docker 部署

```bash
cd /Users/beiguangsheng/Downloads/MoneyTrace

# 构建并启动所有服务
docker compose up --build
```

访问地址：
- 前端：http://localhost:8080
- 后端健康检查：http://localhost:8000/api/health

### 方式三：一体化部署（使用 start.sh）

```bash
cd /Users/beiguangsheng/Downloads/MoneyTrace

# 赋予执行权限
chmod +x start.sh

# 启动
./start.sh
```

访问：http://localhost:8080

## 📝 测试 API

创建一笔记账记录：

```bash
curl -X POST http://localhost:8000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"amount": 12.5, "category": "餐饮", "note": "午饭"}'
```

## 🎯 功能说明

- **前端**：简单的记账表单，输入金额、类别、备注后提交
- **后端**：FastAPI 提供 RESTful API
- **当前实现**：内存存储（演示用），数据不持久化

## 📁 项目结构

```
MoneyTrace/
├── backend/           # FastAPI 后端
│   ├── app/
│   │   ├── main.py           # 应用入口
│   │   ├── api/              # API 控制器
│   │   ├── domain/           # 领域模型和服务
│   │   ├── adapters/         # 数据适配器
│   │   └── schemas/          # Pydantic 模型
│   └── requirements.txt
├── frontend/          # React + Vite 前端
│   ├── src/
│   │   ├── main.tsx
│   │   └── pages/App.tsx
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── docker-compose.yml
├── start.sh
└── .gitignore

```

## ✨ 已修复的问题

1. ✅ 创建了所有 Python 包的 `__init__.py` 文件
2. ✅ 修复了损坏的 `tsconfig.json` 配置
3. ✅ 添加了 `tsconfig.node.json` 配置
4. ✅ 创建了 `.gitignore` 文件
5. ✅ 项目结构完整，可以正常运行

## 🔧 下一步扩展

如需添加真实数据库支持：
1. 在 `docker-compose.yml` 中添加 PostgreSQL 服务
2. 修改 `postgres_adapter.py` 实现真实的数据库操作
3. 添加数据库迁移工具（如 Alembic）

祝您使用愉快！🎉
