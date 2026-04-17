# Plugin 详解

Plugin 用于扩展 Webpack 功能，处理 Loader 无法完成的复杂任务。

## 常用 Plugin 列表

| Plugin | 作用 |
|--------|------|
| `HtmlWebpackPlugin` | 生成 HTML 文件 |
| `MiniCssExtractPlugin` | 提取 CSS 到单独文件 |
| `DefinePlugin` | 定义环境变量 |
| `CopyWebpackPlugin` | 复制静态资源 |
| `CleanWebpackPlugin` | 清理构建目录 |
| `BundleAnalyzerPlugin` | 分析构建产物 |
| `CompressionWebpackPlugin` | 压缩资源 |
| `TerserPlugin` | 压缩 JavaScript |

## HTML 处理

### HtmlWebpackPlugin

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      // 模板文件
      template: './public/index.html',
      
      // 输出文件名
      filename: 'index.html',
      
      // 注入位置
      inject: 'body',  // 'head' | 'body' | false
      
      // 压缩选项
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      
      // 自定义变量
      title: 'My App',
      meta: {
        viewport: 'width=device-width, initial-scale=1'
      }
    })
  ]
}
```

### 多页面配置

```javascript
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      template: './src/admin.html',
      filename: 'admin.html',
      chunks: ['admin']
    })
  ]
}
```

## CSS 处理

### MiniCssExtractPlugin

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[id].[contenthash:8].css'
    })
  ]
}
```

### CssMinimizerPlugin

```javascript
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

module.exports = {
  optimization: {
    minimizer: [
      new CssMinimizerPlugin({
        parallel: true,
        minimizerOptions: {
          preset: ['default', { discardComments: { removeAll: true } }]
        }
      })
    ]
  }
}
```

## JavaScript 处理

### TerserPlugin

```javascript
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true
          },
          format: {
            comments: false
          }
        },
        extractComments: false
      })
    ]
  }
}
```

## 环境变量

### DefinePlugin

```javascript
const { DefinePlugin } = require('webpack')

module.exports = {
  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.API_URL': JSON.stringify('https://api.example.com'),
      __DEV__: process.env.NODE_ENV === 'development',
      __VERSION__: JSON.stringify(require('./package.json').version)
    })
  ]
}
```

## 资源复制

### CopyWebpackPlugin

```javascript
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          to: 'public',
          globOptions: {
            ignore: ['**/index.html']
          }
        },
        {
          from: 'src/assets/images',
          to: 'images'
        }
      ]
    })
  ]
}
```

## 构建分析

### BundleAnalyzerPlugin

```javascript
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'report.html'
    })
  ]
}
```

## 压缩

### CompressionPlugin

```javascript
const CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
  plugins: [
    // Gzip
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8
    }),
    
    // Brotli
    new CompressionPlugin({
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
}
```

## 进度显示

### ProgressPlugin

```javascript
const { ProgressPlugin } = require('webpack')

module.exports = {
  plugins: [
    new ProgressPlugin({
      handler(percentage, message, ...args) {
        console.info(`${(percentage * 100).toFixed(0)}%`, message)
      }
    })
  ]
}
```

## 自定义 Plugin

### Plugin 基本结构

```javascript
class MyPlugin {
  constructor(options) {
    this.options = options
  }
  
  apply(compiler) {
    // compiler 是 Webpack 实例
    
    // 监听 emit 钩子
    compiler.hooks.emit.tapAsync('MyPlugin', (compilation, callback) => {
      // compilation 表示构建产物
      
      // 创建新文件
      compilation.assets['myfile.txt'] = {
        source: () => 'Hello World',
        size: () => 11
      }
      
      callback()
    })
  }
}

module.exports = MyPlugin
```

### 常用钩子

```javascript
class MyPlugin {
  apply(compiler) {
    // 构建开始
    compiler.hooks.run.tap('MyPlugin', (compiler) => {
      console.log('构建开始')
    })
    
    // 编译完成
    compiler.hooks.compile.tap('MyPlugin', (params) => {
      console.log('编译开始')
    })
    
    // 生成资源到 output 目录
    compiler.hooks.emit.tapAsync('MyPlugin', (compilation, callback) => {
      console.log('生成资源')
      callback()
    })
    
    // 构建完成
    compiler.hooks.done.tap('MyPlugin', (stats) => {
      console.log('构建完成')
    })
    
    // 构建失败
    compiler.hooks.failed.tap('MyPlugin', (error) => {
      console.error('构建失败:', error)
    })
  }
}
```

### 修改输出文件

```javascript
class ModifyOutputPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('ModifyOutputPlugin', (compilation, callback) => {
      // 遍历所有输出文件
      for (const filename in compilation.assets) {
        if (filename.endsWith('.js')) {
          const source = compilation.assets[filename].source()
          
          // 修改内容
          const newSource = `/* Auto Generated */\n${source}`
          
          compilation.assets[filename] = {
            source: () => newSource,
            size: () => newSource.length
          }
        }
      }
      
      callback()
    })
  }
}
```

---

[返回上级](./)
