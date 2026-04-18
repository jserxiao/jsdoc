# Webpack

Webpack 是功能强大的模块打包器，拥有最完善的生态系统。

---

## 概述

| 特性 | 说明 |
|------|------|
| 定位 | 模块打包器 |
| 作者 | Tobias Koppers |
| 核心优势 | 生态完善、高度可配置 |
| 模块支持 | AMD、CommonJS、ESM |
| 适用场景 | 企业级复杂项目 |

---

## 详细文档

### 基础入门

| 文档 | 说明 |
|------|------|
| [核心概念](./核心概念.md) | Entry、Output、Loader、Plugin、Mode |
| [基础配置](./基础配置.md) | 入口、出口、模式配置 |

### 核心功能

| 文档 | 说明 |
|------|------|
| [Loader 详解](./Loader详解.md) | 常用 Loader 及配置，包括 JS/CSS/资源处理 |
| [Plugin 详解](./Plugin详解.md) | 常用 Plugin 及配置，HTML/CSS/JS 处理插件 |
| [开发服务器](./开发服务器.md) | devServer 完整配置，HMR、代理、HTTPS 等 |

### 配置详解

| 文档 | 说明 |
|------|------|
| [入口配置详解](./入口配置详解.md) | 单入口、多入口、动态入口、dependOn 配置 |
| [输出配置详解](./输出配置详解.md) | path、filename、publicPath、library 配置 |
| [模块配置详解](./模块配置详解.md) | rules、loader、asset modules 配置 |
| [优化配置详解](./优化配置详解.md) | splitChunks、runtimeChunk、minimizer 配置 |
| [解析配置详解](./解析配置详解.md) | alias、extensions、mainFields 配置 |

### 高级开发

| 文档 | 说明 |
|------|------|
| [插件开发](./插件开发.md) | 自定义 Plugin 开发，Compiler/Compilation 钩子详解 |

---

## 快速开始

### 安装

```bash
npm install webpack webpack-cli --save-dev
```

### 基础配置

```javascript
// webpack.config.js
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  mode: 'development'
}
```

### 构建命令

```bash
# 开发模式
npx webpack --mode development

# 生产模式
npx webpack --mode production

# 开发服务器
npx webpack serve

# 使用配置文件
npx webpack --config webpack.config.js
```

---

## 核心特性

### 1. 模块打包

支持多种模块规范，统一打包输出：

```javascript
// 支持的模块类型
import _ from 'lodash'          // ES Modules
const $ = require('jquery')      // CommonJS
define(['module'], fn)           // AMD
```

### 2. Loader 机制

处理非 JavaScript 文件：

```javascript
module.exports = {
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.js$/, use: 'babel-loader' },
      { test: /\.(png|jpg)$/, type: 'asset/resource' }
    ]
  }
}
```

### 3. Plugin 系统

扩展 webpack 功能：

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
}
```

### 4. 代码分割

优化加载性能：

```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
}
```

### 5. 开发服务器

提升开发体验：

```javascript
module.exports = {
  devServer: {
    hot: true,           // 热更新
    port: 3000,          // 端口
    proxy: {             // 代理
      '/api': 'http://localhost:8080'
    }
  }
}
```

---

## 适用场景

- ✅ 大型企业级项目
- ✅ 复杂构建需求
- ✅ 需要丰富插件支持
- ✅ 遗留项目迁移
- ✅ 微前端架构
- ✅ 服务端渲染 (SSR)

---

## 与 Vite 对比

| 特性 | Webpack | Vite |
|------|---------|------|
| 启动速度 | 较慢（秒级） | 极快（毫秒级） |
| HMR | 较快 | 即时 |
| 配置复杂度 | 复杂 | 简单 |
| 生态成熟度 | 成熟 | 成长中 |
| 生产构建 | Webpack | Rollup |
| 适用场景 | 复杂项目 | 新项目 |

---

## 学习路径

1. **入门阶段**：核心概念 → 基础配置
2. **进阶阶段**：Loader 详解 → Plugin 详解 → 开发服务器
3. **深入阶段**：各类配置详解 → 插件开发
4. **实战应用**：性能优化、微前端、SSR

---

## 相关资源

- [Webpack 官方文档](https://webpack.js.org/)
- [Webpack 中文文档](https://webpack.docschina.org/)
- [Webpack GitHub](https://github.com/webpack/webpack)
- [Awesome Webpack](https://github.com/webpack-contrib/awesome-webpack)

---

[返回上级](../)
