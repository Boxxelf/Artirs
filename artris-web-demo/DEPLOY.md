# 部署说明 / Deployment Guide

## GitHub Pages 部署步骤

### 1. 准备仓库

```bash
# 初始化 git 仓库（如果还没有）
git init
git add .
git commit -m "Initial commit"

# 添加 GitHub 远程仓库
git remote add origin https://github.com/YOUR_USERNAME/artris-web-demo.git
git branch -M main
git push -u origin main
```

### 2. 安装依赖并构建

```bash
npm install
npm run build
```

### 3. 部署到 GitHub Pages

有两种方式：

#### 方式一：使用 gh-pages 包（推荐）

```bash
# 安装 gh-pages
npm install --save-dev gh-pages

# 部署
npm run deploy
```

#### 方式二：手动部署

```bash
# 构建项目
npm run build

# 切换到 gh-pages 分支
git checkout --orphan gh-pages
git rm -rf .

# 复制 dist 目录内容到根目录
cp -r dist/* .

# 提交并推送
git add .
git commit -m "Deploy to GitHub Pages"
git push -u origin gh-pages
```

### 4. 配置 GitHub Pages

1. 进入 GitHub 仓库设置
2. 找到 "Pages" 设置
3. 选择 `gh-pages` 分支作为源
4. 保存设置

### 5. 访问网站

部署完成后，网站将在以下地址可用：
`https://YOUR_USERNAME.github.io/artris-web-demo/`

## 注意事项

1. **Base URL**: 在 `vite.config.js` 中已配置 `base: '/artris-web-demo/'`
   - 如果仓库名不同，请修改此配置

2. **自动部署**: 已配置 GitHub Actions 工作流
   - 每次推送到 `main` 分支会自动部署

3. **环境变量**: 如需配置环境变量，创建 `.env` 文件

## 故障排除

### 问题：页面显示空白
- 检查 `vite.config.js` 中的 `base` 配置是否正确
- 确保所有资源路径使用相对路径

### 问题：路由不工作
- 确保使用 `HashRouter` 或配置 GitHub Pages 支持 SPA
- 可以添加 `404.html` 重定向到 `index.html`
