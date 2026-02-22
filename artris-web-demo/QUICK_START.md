# 快速开始指南

## 问题：npm 命令找不到

您的系统已安装 Node.js v24.13.1，但 npm 需要通过 corepack 启用。

## 解决方案

### 方法一：启用 corepack（推荐）

在终端中运行：

```bash
cd "/Volumes/Extreme SSD/Artris-moni/artris-web-demo"
corepack enable
npm install
```

### 方法二：使用安装脚本

```bash
cd "/Volumes/Extreme SSD/Artris-moni/artris-web-demo"
./setup.sh
```

### 方法三：手动添加 npm 到 PATH

```bash
export PATH="/usr/local/lib/node_modules/corepack/shims:$PATH"
cd "/Volumes/Extreme SSD/Artris-moni/artris-web-demo"
npm install
```

### 方法四：使用 yarn（如果已安装）

```bash
cd "/Volumes/Extreme SSD/Artris-moni/artris-web-demo"
yarn install
```

### 方法五：重新安装 Node.js（包含 npm）

如果以上方法都不行，请：

1. 访问 https://nodejs.org/
2. 下载并安装 LTS 版本（包含 npm）
3. 重新打开终端
4. 运行 `npm install`

## 安装完成后

```bash
# 启动开发服务器
npm run dev

# 或使用 yarn
yarn dev
```

项目将在 http://localhost:5173 启动

## 如果 corepack enable 也找不到

您的 Node.js 可能是通过其他方式安装的。请尝试：

1. **检查 Node.js 安装位置：**
   ```bash
   which node
   ```

2. **查找 npm：**
   ```bash
   find /usr/local -name npm 2>/dev/null
   ```

3. **或者直接下载 Node.js 安装包：**
   - 访问：https://nodejs.org/
   - 下载 macOS 安装包（.pkg 文件）
   - 安装后重启终端
