#!/bin/bash
# GitHub Pages 部署脚本
set -e
echo "🚀 开始部署到 GitHub Pages..."
cd "$(dirname "$0")/artris-web-demo"
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi
echo "🔨 构建项目..."
NODE_ENV=production npm run build
echo "📤 部署到 GitHub Pages..."
npm run deploy
echo "✅ 部署完成！"
echo "🌐 网站地址: https://boxxelf.github.io/Artirs/"
