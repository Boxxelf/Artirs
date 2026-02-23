#!/bin/bash
# GitHub Pages 部署脚本
set -e

# 设置 PATH
export PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:$PATH"

# 检测 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

# 检测 npm - 尝试多种方式
NPM_CMD=""
if command -v npm &> /dev/null; then
    NPM_CMD="npm"
elif [ -f "/usr/local/lib/node_modules/corepack/shims/npm" ]; then
    NPM_CMD="/usr/local/lib/node_modules/corepack/shims/npm"
elif command -v npx &> /dev/null; then
    # 使用 npx 来运行 npm 命令
    NPM_CMD="npx --yes npm"
else
    echo "❌ 错误: 未找到 npm 命令"
    echo ""
    echo "Node.js 已安装，但 npm 不可用。"
    echo "请尝试："
    echo "  1. 重新安装 Node.js: https://nodejs.org/"
    echo "  2. 或运行: corepack enable"
    echo ""
    exit 1
fi

echo "🚀 开始部署到 GitHub Pages..."
echo "📦 Node.js: $(node --version)"
echo "📦 使用: $NPM_CMD"
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
