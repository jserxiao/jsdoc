# esbuild

## 定位

使用 Go 编写的极速 JavaScript 打包器。

## 核心特点

- **极致速度**：比 Webpack 快 10-100 倍
- **内置功能**：TypeScript、JSX、CSS 转换
- **API 简洁**：CLI 和 JS API 两种方式
- **内存友好**：并行处理，内存占用低

## 基础使用

### 命令行

```bash
# 安装
npm install esbuild --save-dev

# 构建
npx esbuild src/index.js --bundle --outfile=dist/bundle.js

# 压缩
npx esbuild src/index.js --bundle --minify --outfile=dist/bundle.min.js

# 开发服务器
npx esbuild src/index.js --bundle --servedir=.
```

### JavaScript API

```javascript
const esbuild = require('esbuild')

// 构建
esbuild.build({
  entryPoints: ['src/index.js'],
  bundle: true,
  minify: true,
  sourcemap: true,
  outfile: 'dist/bundle.js',
  format: 'esm',
  target: ['es2020']
}).catch(() => process.exit(1))
```

### 增量构建

```javascript
const ctx = await esbuild.context({
  entryPoints: ['src/index.js'],
  bundle: true,
  outfile: 'dist/bundle.js'
})

// 启用监听
await ctx.watch()

// 启动开发服务器
let { host, port } = await ctx.serve({
  servedir: 'dist'
})
```

## 完整配置示例

```javascript
const esbuild = require('esbuild')

const buildOptions = {
  entryPoints: ['src/index.tsx'],
  bundle: true,
  minify: true,
  sourcemap: true,
  outdir: 'dist',
  format: 'esm',
  target: ['es2020', 'chrome80', 'firefox75', 'safari13'],
  loader: {
    '.png': 'dataurl',
    '.woff': 'file'
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  external: ['react', 'react-dom'],
  splitting: true,
  treeShaking: true
}

// 构建
esbuild.build(buildOptions)
  .then(() => console.log('Build success!'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
```

## 与其他工具集成

### 与 Vite 集成
Vite 使用 esbuild 进行 TypeScript/JSX 转换

### 与 Webpack 集成
```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'esbuild-loader'
      }
    ]
  }
}
```

## 插件系统

```javascript
const esbuild = require('esbuild')

const httpPlugin = {
  name: 'http',
  setup(build) {
    // 拦截 https? 导入
    build.onResolve({ filter: /^https?:\/\// }, args => ({
      path: args.path,
      namespace: 'http-url'
    }))

    // 加载远程模块
    build.onLoad({ filter: /.*/, namespace: 'http-url' }, async (args) => {
      const fetch = require('node-fetch')
      const res = await fetch(args.path)
      return { contents: await res.text(), loader: 'js' }
    })
  }
}

esbuild.build({
  entryPoints: ['src/index.js'],
  bundle: true,
  outfile: 'dist/bundle.js',
  plugins: [httpPlugin]
})
```

## 适用场景

- 追求极致构建速度
- 简单项目快速打包
- 作为其他工具的底层引擎（Vite、Webpack）
- 开发环境快速编译

## 与其他工具对比

| 特性 | esbuild | Webpack | Rollup |
|------|---------|---------|--------|
| 构建速度 | 极快 | 较慢 | 较快 |
| 配置复杂度 | 简单 | 复杂 | 中等 |
| Tree Shaking | 支持 | 支持 | 最佳 |
| 生态成熟度 | 成长中 | 成熟 | 成熟 |
| 类型检查 | 不支持 | 支持（插件） | 支持（插件） |
