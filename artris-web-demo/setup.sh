#!/bin/bash

# Artris Web Demo - 安装脚本
# Setup script for Artris Web Demo

echo "🚀 Artris Web Demo - 依赖安装脚本"
echo "=================================="
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未找到 Node.js"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"

# 启用 corepack (Node.js 18+ 自带)
if command -v corepack &> /dev/null; then
    echo "📦 启用 corepack..."
    corepack enable
    echo "✅ corepack 已启用"
elif [ -f "/usr/local/lib/node_modules/corepack/shims/npm" ]; then
    echo "📦 通过 corepack 启用 npm..."
    export PATH="/usr/local/lib/node_modules/corepack/shims:$PATH"
    corepack enable 2>/dev/null || echo "⚠️  请手动运行: corepack enable"
fi

# 检查 npm
if command -v npm &> /dev/null; then
    echo "✅ npm 版本: $(npm --version)"
    echo ""
    echo "📥 开始安装依赖..."
    npm install
    echo ""
    echo "✅ 安装完成！"
    echo ""
    echo "运行开发服务器:"
    echo "  npm run dev"
else
    echo "❌ 未找到 npm"
    echo ""
    echo "请尝试以下方法："
    echo "1. 运行: corepack enable"
    echo "2. 或者重新安装 Node.js: https://nodejs.org/"
    echo "3. 或者使用 yarn: yarn install"
    exit 1
fi
