# Railway 部署修复说明

## 🔴 问题诊断

您的 Railway 部署显示 "Crashed" 状态，日志只显示 `Starting Container` 后立即崩溃。

### 根本原因

原 `start.sh` 文件中的 uvicorn 命令使用了错误的 Python 模块路径：

```bash
# ❌ 错误的路径
uvicorn backend.app.main:app --host 0.0.0.0 --port "$PORT_VALUE"
```

当脚本从项目根目录运行时，Python 无法找到 `backend.app.main` 模块，因为：
1. `backend/` 目录本身不是 Python 包（没有 `__init__.py`）
2. Python 的模块查找路径不包含正确的位置

## ✅ 修复方案

已修复 `start.sh`，在启动 uvicorn 前切换到 `backend` 目录：

```bash
# ✅ 正确的路径
cd backend
uvicorn app.main:app --host 0.0.0.0 --port "$PORT_VALUE"
```

这样 Python 就能正确找到 `app` 包及其子模块。

## 🚀 部署步骤

### 1. 提交修复

```bash
cd /Users/beiguangsheng/Downloads/MoneyTrace

# 确保脚本有执行权限
chmod +x start.sh

# 提交更改
git add start.sh
git commit -m "fix: 修复 Railway 部署的 uvicorn 模块路径问题"
git push origin main
```

### 2. 等待自动部署

Railway 会自动检测到新的提交并重新部署。您可以在 Railway 控制台查看部署日志。

### 3. 验证部署成功

部署成功后，您应该能看到：

**Deploy Logs 中的成功信息：**
```
[start] 安装后端依赖
[start] 构建前端
[start] 启动后端
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8080
```

**访问您的应用：**
- 前端页面：`https://moneytrace-production.up.railway.app`
- API 文档：`https://moneytrace-production.up.railway.app/docs`
- 健康检查：`https://moneytrace-production.up.railway.app/api/health`

## 🔍 技术细节

### 为什么需要 cd backend？

Python 的模块导入机制：
- 当前工作目录会被添加到 `sys.path`
- `cd backend` 后，当前目录变为 `backend/`
- 此时 `app/` 目录在当前目录下，Python 可以找到 `app.main`

### 与 Dockerfile 的对比

注意 `backend/Dockerfile` 已经使用了正确的方式：

```dockerfile
WORKDIR /app
COPY app ./app
CMD ["uvicorn", "app.main:app", ...]
```

它设置工作目录为 `/app`，然后复制 `app/` 目录，所以可以直接使用 `app.main:app`。

## 📋 其他注意事项

### Railway 环境要求

确保 Railway 环境包含：
- ✅ Python 3.10+
- ✅ Node.js 18+
- ✅ npm

Railway 的 Nixpacks 构建器通常会自动检测并安装这些依赖。

### 环境变量

Railway 会自动提供 `PORT` 环境变量，`start.sh` 会使用它：

```bash
PORT_VALUE=${PORT:-8080}
```

如果 `PORT` 未设置，默认使用 8080。

### 前端静态文件

`start.sh` 会：
1. 构建前端到 `frontend/dist/`
2. 设置 `FRONTEND_DIST` 环境变量
3. FastAPI 会挂载这个目录到根路径

这样访问根 URL 就能看到前端页面。

## 🎯 预期结果

修复后，您的应用应该：
- ✅ 成功启动，不再崩溃
- ✅ 前端页面可访问
- ✅ API 端点正常工作
- ✅ 可以创建记账记录

## 🆘 如果仍然失败

如果修复后仍然失败，请检查：

1. **查看完整的 Deploy Logs**
   - 是否有 Python 或 npm 安装错误？
   - 是否有依赖冲突？

2. **检查 Build Logs**
   - Nixpacks 是否正确检测到项目类型？
   - 是否安装了所有必要的系统依赖？

3. **验证 start.sh 权限**
   ```bash
   ls -la start.sh
   # 应该显示 -rwxr-xr-x
   ```

4. **考虑使用 Dockerfile**
   
   如果 `start.sh` 方式仍有问题，可以让 Railway 使用 `backend/Dockerfile`：
   
   在 Railway 项目设置中：
   - Build Command: `docker build -f backend/Dockerfile -t backend ./backend && docker build -f frontend/Dockerfile -t frontend ./frontend`
   - 或者创建一个多阶段 Dockerfile

祝部署成功！🎉
