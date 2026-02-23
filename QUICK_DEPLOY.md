# 快速部署指南

## 当前状态

✅ 已修复 GitHub Pages 配置（base 路径已更新为 `/Artirs/`）
✅ 已创建部署脚本 `deploy.sh`
✅ 所有更改已推送到 GitHub

## 部署步骤

由于当前环境无法直接运行 npm，请在你的本地终端执行以下步骤：

### 步骤 1: 打开终端并进入项目目录

```bash
cd /Users/tinajiang/Documents/git/Artirs
```

### 步骤 2: 运行部署脚本

```bash
./deploy.sh
```

如果遇到权限问题，先添加执行权限：
```bash
chmod +x deploy.sh
./deploy.sh
```

### 步骤 3: 在 GitHub 上启用 Pages

部署脚本运行完成后：

1. 访问：https://github.com/Boxxelf/Artirs/settings/pages
2. 在 "Source" 部分：
   - 选择 **"Deploy from a branch"**
   - 分支选择 **"gh-pages"**
   - 文件夹选择 **"/ (root)"**
   - 点击 **"Save"**

### 步骤 4: 等待部署完成

- 通常需要 1-2 分钟
- 可以在 GitHub 仓库的 "Actions" 标签页查看状态

### 步骤 5: 访问网站

部署完成后，访问：
**https://boxxelf.github.io/Artirs/**

## 如果部署脚本有问题

可以手动执行：

```bash
cd /Users/tinajiang/Documents/git/Artirs/artris-web-demo
npm install
npm run build
npm run deploy
```

## 检查部署状态

- GitHub Actions: https://github.com/Boxxelf/Artirs/actions
- Pages 设置: https://github.com/Boxxelf/Artirs/settings/pages
