# 安装依赖说明

## 方法一：使用 npm（推荐）

如果您的系统已安装 Node.js 和 npm，请在终端中运行：

```bash
cd "/Volumes/Extreme SSD/Artris-moni/artris-web-demo"
npm install
```

## 方法二：检查 npm 安装

如果遇到 "command not found: npm" 错误，请先检查：

1. **检查 Node.js 和 npm 是否已安装：**
```bash
node --version
npm --version
```

2. **如果 Node.js 已安装但 npm 未找到：**
   - macOS: 可能需要重新安装 Node.js（包含 npm）
   - 下载地址：https://nodejs.org/

3. **使用 Homebrew 安装（macOS）：**
```bash
brew install node
```

## 方法三：使用其他包管理器

### 使用 yarn：
```bash
yarn install
```

### 使用 pnpm：
```bash
pnpm install
```

## 安装完成后

运行开发服务器：
```bash
npm run dev
```

构建生产版本：
```bash
npm run build
```

## 常见问题

### 问题：权限错误
如果遇到权限问题，可以尝试：
```bash
sudo npm install
```

### 问题：网络超时
如果在中国大陆，可以使用国内镜像：
```bash
npm install --registry=https://registry.npmmirror.com
```

或设置永久镜像：
```bash
npm config set registry https://registry.npmmirror.com
```
