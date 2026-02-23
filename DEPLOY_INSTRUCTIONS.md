# 部署说明

## 快速部署（推荐）

在项目根目录运行部署脚本：

```bash
./deploy.sh
```

或者手动执行：

```bash
cd artris-web-demo
npm install
npm run build
npm run deploy
```

然后：
1. 访问：https://github.com/Boxxelf/Artirs/settings/pages
2. 在 "Source" 部分选择 **"Deploy from a branch"**
3. 选择 **"gh-pages"** 分支
4. 保存设置

## 网站地址

部署完成后，网站将在以下地址可用：
**https://boxxelf.github.io/Artirs/**

## 自动部署（可选）

如果你想设置自动部署，可以在 GitHub 网页上手动创建 workflow 文件：

1. 访问：https://github.com/Boxxelf/Artirs
2. 点击 "Add file" -> "Create new file"
3. 文件路径输入：`.github/workflows/deploy.yml`
4. 复制以下内容：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: artris-web-demo/package-lock.json

      - name: Install dependencies
        working-directory: artris-web-demo
        run: npm ci

      - name: Build
        working-directory: artris-web-demo
        run: npm run build
        env:
          NODE_ENV: production

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: artris-web-demo/dist

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

5. 点击 "Commit new file"
6. 然后在 Pages 设置中选择 "GitHub Actions" 作为源
