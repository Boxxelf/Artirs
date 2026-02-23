#!/bin/bash
# GitHub Pages 部署脚本
set -e

# 设置 PATH 以确保能找到 npm
export PATH="/usr/local/bin:/usr/bin:/bin:$PATH"

# 检测 npm 命令
NPM_CMD=""
if command -v npm &> /dev/null; then
    NPM_CMD="npm"
elif [ -f "/usr/local/bin/npm" ]; then
    NPM_CMD="/usr/local/bin/npm"
else
    echo "❌ 错误: 未找到 npm 命令"
    echo ""
    echo "请先安装 Node.js 和 npm:"
    echo "  方法 1: 访问 https://nodejs.org/ 下载安装"
    echo "  方法 2: 使用 Homebrew: brew install node"
    echo ""
    echo "安装完成后，重新运行此脚本。"
    exit 1
fi

echo "🚀 开始部署到 GitHub Pages..."
echo "📦 使用 npm: $($NPM_CMD --version)"
cd "$(dirname "$0")/artris-web-demo"

if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    $NPM_CMD install
fi

echo "🔨 构建项目..."
NODE_ENV=production $NPM_CMD run build

echo "📤 部署到 GitHub Pages..."
$NPM_CMD run deploy

echo "✅ 部署完成！"
echo "🌐 网站地址: https://boxxelf.github.io/Artirs/"
echo ""
echo "⚠️  下一步: 在 GitHub 上启用 Pages"
echo "   1. 访问: https://github.com/Boxxelf/Artirs/settings/pages"
echo "   2. 选择 'Deploy from a branch'"
echo "   3. 选择 'gh-pages' 分支"
echo "   4. 保存设置"
