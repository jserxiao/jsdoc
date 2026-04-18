# Plugin 详解

## 概述

Plugin 用于扩展 webpack 功能，处理 Loader 无法完成的复杂任务。webpack 插件是一个具有 `apply` 方法的 JavaScript 对象，`apply` 方法会被 webpack compiler 调用，并且在整个编译生命周期可以访问 compiler 对象。

## Plugin 特性

- **钩子机制**：通过 Tapable 提供的各种钩子监听构建过程
- **完整访问权限**：可以访问 compiler 和 compilation 对象
- **操作能力**：可以修改构建产物、添加新文件、优化资源等

## 常用 Plugin 分类

### HTML 处理

| Plugin | 作用 | 官方文档 |
|--------|------|---------|
| `HtmlWebpackPlugin` | 生成 HTML 文件 | [文档](https://github.com/jantimon/html-webpack-plugin) |
| `HtmlMinimizerPlugin` | 压缩 HTML | [文档](https://webpack.js.org/plugins/html-minimizer-webpack-plugin/) |
| `ScriptExtHtmlWebpackPlugin` | 扩展 HTML 脚本 | [文档](https://github.com/numical/script-ext-html-webpack-plugin) |

### CSS 处理

| Plugin | 作用 | 官方文档 |
|--------|------|---------|
| `MiniCssExtractPlugin` | 提取 CSS 到单独文件 | [文档](https://github.com/webpack-contrib/mini-css-extract-plugin) |
| `CssMinimizerPlugin` | 压缩 CSS | [文档](https://github.com/webpack-contrib/css-minimizer-webpack-plugin) |
| `PurgeCSSPlugin` | 删除未使用的 CSS | [文档](https://github.com/FullHuman/purgecss) |

### JavaScript 处理

| Plugin | 作用 | 官方文档 |
|--------|------|---------|
| `TerserPlugin` | 压缩 JavaScript | [文档](https://github.com/webpack-contrib/terser-webpack-plugin) |
| `DefinePlugin` | 定义环境变量 | [文档](https://webpack.js.org/plugins/define-plugin/) |
| `ProvidePlugin` | 自动加载模块 | [文档](https://webpack.js.org/plugins/provide-plugin/) |
| `BannerPlugin` | 添加注释 | [文档](https://webpack.js.org/plugins/banner-plugin/) |
| `SourceMapDevToolPlugin` | Source Map | [文档](https://webpack.js.org/plugins/source-map-dev-tool-plugin/) |

### 资源优化

| Plugin | 作用 | 官方文档 |
|--------|------|---------|
| `CopyWebpackPlugin` | 复制静态资源 | [文档](https://github.com/webpack-contrib/copy-webpack-plugin) |
| `ImageMinimizerPlugin` | 图片压缩 | [文档](https://github.com/webpack-contrib/image-minimizer-webpack-plugin) |
| `CompressionPlugin` | 压缩资源 | [文档](https://github.com/webpack-contrib/compression-webpack-plugin) |

### 构建分析

| Plugin | 作用 | 官方文档 |
|--------|------|---------|
| `BundleAnalyzerPlugin` | 分析构建产物 | [文档](https://github.com/webpack/webpack-bundle-analyzer) |
| `WebpackBundleAnalyzer` | 可视化分析 | [文档](https://github.com/webpack/webpack-bundle-analyzer) |
| `SpeedMeasurePlugin` | 测量构建速度 | [文档](https://github.com/stephencookdev/speed-measure-webpack-plugin) |

### 缓存

| Plugin | 作用 | 官方文档 |
|--------|------|---------|
| `HardSourceWebpackPlugin` | 模块缓存 | [文档](https://github.com/mzgoddard/hard-source-webpack-plugin) |
| `CacheWebpackPlugin` | 持久化缓存 | [文档](https://webpack.js.org/configuration/cache/) |

### 其他

| Plugin | 作用 | 官方文档 |
|--------|------|---------|
| `ProgressPlugin` | 进度显示 | [文档](https://webpack.js.org/plugins/progress-plugin/) |
| `FriendlyErrorsWebpackPlugin` | 友好的错误提示 | [文档](https://github.com/geowarin/friendly-errors-webpack-plugin) |
| `NotifierWebpackPlugin` | 桌面通知 | [文档](https://github.com/Turbo87/webpack-notifier) |
| `CleanWebpackPlugin` | 清理构建目录 | [文档](https://github.com/johnagan/clean-webpack-plugin) |

## HTML 处理类 Plugin

### HtmlWebpackPlugin

#### 安装

```bash
npm install -D html-webpack-plugin
```

#### 基础配置

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      inject: 'body'
    })
  ]
}
```

#### 完整配置

```javascript
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      // 模板文件
      template: './public/index.html',
      templateParameters: {
        title: 'My App',
        env: process.env.NODE_ENV
      },

      // 输出文件名
      filename: 'index.html',
      path: path.resolve(__dirname, 'dist'),

      // 注入位置
      inject: 'body',  // 'head' | 'body' | false

      // 脚本加载
      scriptLoading: 'defer',  // 'blocking' | 'defer' | 'module'

      // 压缩选项
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyCSS: true,
        minifyJS: true
      },

      // 自定义变量
      title: 'My App',
      meta: {
        viewport: 'width=device-width, initial-scale=1',
        description: 'My application'
      },
      favicon: './public/favicon.ico',

      // chunks 控制
      chunks: 'all',  // 'all' | ['main', 'vendor']
      excludeChunks: ['dev'],
      chunksSortMode: 'auto',  // 'none' | 'auto' | 'manual' | function

      // 其他选项
      hash: true,
      showErrors: true,
      cache: true,
      xhtml: false
    })
  ]
}
```

#### 多页面配置

```javascript
module.exports = {
  entry: {
    index: './src/index.js',
    admin: './src/admin.js',
    mobile: './src/mobile.js'
  },
  plugins: [
    // 首页
    new HtmlWebpackPlugin({
      template: './src/templates/index.html',
      filename: 'index.html',
      chunks: ['index', 'vendor', 'common'],
      chunksSortMode: 'manual',
      title: '首页'
    }),

    // 管理页面
    new HtmlWebpackPlugin({
      template: './src/templates/admin.html',
      filename: 'admin.html',
      chunks: ['admin', 'vendor', 'common'],
      title: '管理后台'
    }),

    // 移动端页面
    new HtmlWebpackPlugin({
      template: './src/templates/mobile.html',
      filename: 'mobile/index.html',
      chunks: ['mobile'],
      title: '移动端'
    })
  ]
}
```

#### 自定义模板

```html
<!-- template.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title><%= htmlWebpackPlugin.options.title %></title>
  <% for (var css in htmlWebpackPlugin.files.css) { %>
  <link href="<%= htmlWebpackPlugin.files.css[css] %>" rel="stylesheet">
  <% } %>
</head>
<body>
  <div id="app"></div>
  <% for (var js in htmlWebpackPlugin.files.js) { %>
  <script src="<%= htmlWebpackPlugin.files.js[js] %>"></script>
  <% } %>
</body>
</html>
```

#### 使用 EJS 模板

```javascript
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/templates/index.ejs',
      templateParameters: {
        title: 'My App',
        description: 'Description',
        keywords: ['webpack', 'plugin'],
        ga: process.env.NODE_ENV === 'production'
      }
    })
  ]
}
```

```html
<!-- index.ejs -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title><%= title %></title>
  <meta name="description" content="<%= description %>">
  <meta name="keywords" content="<%= keywords.join(', ') %>">
  <% if (ga) { %>
  <script>
    // Google Analytics
  </script>
  <% } %>
</head>
<body>
  <div id="app"></div>
</body>
</html>
```

### HtmlMinimizerPlugin

```javascript
const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin')

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new HtmlMinimizerPlugin({
        parallel: true,
        minimizerOptions: {
          collapseWhitespace: true,
          removeComments: true,
          minifyCSS: true,
          minifyJS: true
        }
      })
    ]
  }
}
```

## CSS 处理类 Plugin

### MiniCssExtractPlugin

#### 安装

```bash
npm install -D mini-css-extract-plugin
```

#### 基础配置

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
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css'
    })
  ]
}
```

#### 完整配置

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
              esModule: false
            }
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[id].[contenthash:8].css',
      ignoreOrder: false,
      insert: function(linkTag) {
        const reference = document.querySelector('#css-inject-point')
        if (reference) {
          reference.parentNode.insertBefore(linkTag, reference)
        }
      },
      attributes: {
        'data-test': 'true'
      }
    })
  ]
}
```

#### 开发/生产环境区分

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    ...(isProduction ? [
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css'
      })
    ] : [])
  ]
}
```

### CssMinimizerPlugin

```javascript
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin({
        parallel: true,
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
              normalizeWhitespace: false
            }
          ]
        },
        test: /\.css$/i,
        include: /\/includes/,
        exclude: /\/excludes/,
        warningsFilter: (warning, file) => {
          return !file.includes('node_modules')
        }
      })
    ]
  }
}
```

### PurgeCSSPlugin

```javascript
const PurgeCSSPlugin = require('purgecss-webpack-plugin')
const glob = require('glob')
const path = require('path')

module.exports = {
  plugins: [
    new PurgeCSSPlugin({
      paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`, { nodir: true }),
      safelist: {
        standard: [/^ant-/],
        deep: [/^ant-/],
        greedy: [/modal$/]
      },
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
      only: ['bundle', 'vendor']
    })
  ]
}
```

## JavaScript 处理类 Plugin

### TerserPlugin

#### 安装

```bash
npm install -D terser-webpack-plugin
```

#### 基础配置

```javascript
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin()
    ]
  }
}
```

#### 完整配置

```javascript
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        // 并行处理
        parallel: true,

        // 文件过滤
        test: /\.js(\?.*)?$/i,
        include: /\/includes/,
        exclude: /\/excludes/,

        // 压缩选项
        terserOptions: {
          ecma: 2015,
          parse: {
            ecma: 2015
          },
          compress: {
            defaults: true,
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log'],
            passes: 2
          },
          mangle: {
            safari10: true,
            properties: {
              regex: /^_/
            }
          },
          format: {
            comments: false,
            beautify: false
          }
        },

        // 提取注释
        extractComments: {
          condition: /^\**!|@preserve|@license|@cc_on/i,
          filename: (dataFile) => `${dataFile}.LICENSE.txt`,
          banner: (licenseFile) => `License information can be found in ${licenseFile}`
        }
      })
    ]
  }
}
```

### DefinePlugin

```javascript
const { DefinePlugin } = require('webpack')

module.exports = {
  plugins: [
    new DefinePlugin({
      // 环境变量
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.API_URL': JSON.stringify('https://api.example.com'),
      'process.env.VERSION': JSON.stringify(require('./package.json').version),

      // 布尔值
      __DEV__: process.env.NODE_ENV === 'development',
      __PROD__: process.env.NODE_ENV === 'production',
      __TEST__: process.env.NODE_ENV === 'test',

      // 其他值
      __VERSION__: JSON.stringify(require('./package.json').version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString())
    })
  ]
}

// 使用
console.log(process.env.NODE_ENV)
console.log(__DEV__)
console.log(__VERSION__)
```

### ProvidePlugin

```javascript
const { ProvidePlugin } = require('webpack')

module.exports = {
  plugins: [
    new ProvidePlugin({
      // 自动导入
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',

      // 按需导入
      _: 'lodash',
      React: 'react',
      Vue: ['vue/dist/vue.esm.js', 'default'],

      // 方法级别
      map: ['lodash', 'map'],
      join: ['lodash/array', 'join']
    })
  ]
}

// 使用时无需导入
// $('div').hide()
// _.map([1, 2, 3], n => n * 2)
```

### BannerPlugin

```javascript
const { BannerPlugin } = require('webpack')

module.exports = {
  plugins: [
    new BannerPlugin({
      banner: `
/*!
 * My Project
 * @author Your Name
 * @version ${require('./package.json').version}
 * @license MIT
 */
      `.trim(),
      raw: true,
      entryOnly: true,
      test: /\.js$/
    })
  ]
}
```

## 资源优化类 Plugin

### CopyWebpackPlugin

#### 安装

```bash
npm install -D copy-webpack-plugin
```

#### 基础配置

```javascript
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public', to: 'public' }
      ]
    })
  ]
}
```

#### 完整配置

```javascript
module.exports = {
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          to: 'public',
          globOptions: {
            ignore: ['**/index.html', '**/.DS_Store']
          },
          filter: (resourcePath) => {
            return !resourcePath.includes('node_modules')
          },
          transform(content, absoluteFrom) {
            // 修改文件内容
            if (absoluteFrom.endsWith('.json')) {
              return JSON.stringify(JSON.parse(content))
            }
            return content
          },
          noErrorOnMissing: true
        },
        {
          from: 'src/assets/images',
          to: 'images',
          context: 'src'
        },
        {
          from: 'node_modules/vue/dist/vue.min.js',
          to: 'js/vue.min.js'
        }
      ],
      options: {
        concurrency: 100
      }
    })
  ]
}
```

### CompressionPlugin

#### 安装

```bash
npm install -D compression-webpack-plugin
```

#### Gzip 压缩

```javascript
const CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
  plugins: [
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,  // 10KB 以上压缩
      minRatio: 0.8,
      deleteOriginalAssets: false,
      filename: '[path][base].gz'
    })
  ]
}
```

#### Brotli 压缩

```javascript
module.exports = {
  plugins: [
    new CompressionPlugin({
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8,
      filename: '[path][base].br'
    })
  ]
}
```

#### 同时生成 Gzip 和 Brotli

```javascript
module.exports = {
  plugins: [
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8
    }),
    new CompressionPlugin({
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
}
```

## 构建分析类 Plugin

### BundleAnalyzerPlugin

#### 安装

```bash
npm install -D webpack-bundle-analyzer
```

#### 基础配置

```javascript
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
}
```

#### 完整配置

```javascript
module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',  // 'server' | 'static' | 'disabled'
      analyzerHost: '127.0.0.1',
      analyzerPort: 8888,
      reportFilename: 'report.html',
      defaultSizes: 'parsed',  // 'stat' | 'parsed' | 'gzip'
      openAnalyzer: true,
      generateStatsFile: true,
      statsFilename: 'stats.json',
      statsOptions: {
        source: false,
        modules: false
      },
      excludeAssets: /node_modules/,
      logLevel: 'info'
    })
  ]
}
```

### SpeedMeasurePlugin

```javascript
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')

const smp = new SpeedMeasurePlugin({
  outputFormat: 'human',
  outputTarget: console.log,
  pluginNames: false,
  granularLoaderData: false
})

module.exports = smp.wrap({
  entry: './src/index.js',
  module: {
    rules: [...]
  },
  plugins: [...]
})
```

## 其他实用 Plugin

### ProgressPlugin

```javascript
const { ProgressPlugin } = require('webpack')

module.exports = {
  plugins: [
    new ProgressPlugin({
      activeModules: false,
      entries: true,
      modules: true,
      modulesCount: 5000,
      profile: false,
      dependencies: true,
      dependenciesCount: 10000,
      percentBy: 'entries',
      handler(percentage, message, ...args) {
        console.info(`${(percentage * 100).toFixed(2)}%`, message)
      }
    })
  ]
}
```

### FriendlyErrorsWebpackPlugin

```javascript
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

module.exports = {
  plugins: [
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: ['You application is running here http://localhost:3000'],
        notes: ['Some addition notes']
      },
      onErrors: (severity, errors) => {
        if (severity === 'error') {
          const error = errors[0]
          console.log(error)
        }
      },
      clearConsole: true,
      additionalFormatters: [],
      additionalTransformers: []
    })
  ]
}
```

### CleanWebpackPlugin

```javascript
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  plugins: [
    new CleanWebpackPlugin({
      dry: false,
      verbose: true,
      cleanStaleWebpackAssets: true,
      protectWebpackAssets: true,
      cleanOnceBeforeBuildPatterns: ['**/*', '!static-files*'],
      cleanAfterEveryBuildPatterns: ['*.LICENSE.txt'],
      dangerouslyAllowCleanPatternsOutsideProject: true
    })
  ]
}
```

### WorkboxWebpackPlugin（PWA）

```javascript
const WorkboxPlugin = require('workbox-webpack-plugin')

module.exports = {
  plugins: [
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/api\.example\.com/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24
            }
          }
        }
      ]
    })
  ]
}
```

### ModuleFederationPlugin（微前端）

```javascript
const { ModuleFederationPlugin } = require('webpack').container

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'app1',
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/components/Button',
        './Header': './src/components/Header'
      },
      remotes: {
        app2: 'app2@http://localhost:3002/remoteEntry.js'
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true }
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
    // compiler 是 webpack 实例

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

### 常用 Compiler 钩子

```javascript
class MyPlugin {
  apply(compiler) {
    // 初始化
    compiler.hooks.initialize.tap('MyPlugin', () => {
      console.log('初始化')
    })

    // 构建开始
    compiler.hooks.run.tap('MyPlugin', (compiler) => {
      console.log('构建开始')
    })

    // 监听模式
    compiler.hooks.watchRun.tap('MyPlugin', (compiler) => {
      console.log('监听开始')
    })

    // 编译开始
    compiler.hooks.compile.tap('MyPlugin', (params) => {
      console.log('编译开始')
    })

    // 编译完成
    compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
      console.log('编译完成')
    })

    // 生成资源
    compiler.hooks.emit.tapAsync('MyPlugin', (compilation, callback) => {
      console.log('生成资源')
      callback()
    })

    // 资源生成后
    compiler.hooks.afterEmit.tapAsync('MyPlugin', (compilation, callback) => {
      console.log('资源生成后')
      callback()
    })

    // 构建完成
    compiler.hooks.done.tap('MyPlugin', (stats) => {
      console.log('构建完成')
      console.log(stats.toString())
    })

    // 构建失败
    compiler.hooks.failed.tap('MyPlugin', (error) => {
      console.error('构建失败:', error)
    })

    // 构建结束
    compiler.hooks.shutdown.tap('MyPlugin', () => {
      console.log('构建结束')
    })
  }
}
```

### 常用 Compilation 钩子

```javascript
class MyPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
      // 构建模块
      compilation.hooks.buildModule.tap('MyPlugin', (module) => {
        console.log('构建模块:', module.resource)
      })

      // 成功构建模块
      compilation.hooks.succeedModule.tap('MyPlugin', (module) => {
        console.log('成功构建:', module.resource)
      })

      // 失败构建模块
      compilation.hooks.failedModule.tap('MyPlugin', (module, error) => {
        console.error('失败构建:', module.resource, error)
      })

      // 优化开始
      compilation.hooks.optimize.tap('MyPlugin', () => {
        console.log('优化开始')
      })

      // 优化模块
      compilation.hooks.optimizeModules.tap('MyPlugin', (modules) => {
        console.log('优化模块')
      })

      // 优化块
      compilation.hooks.optimizeChunks.tap('MyPlugin', (chunks) => {
        console.log('优化块')
      })

      // 优化资源
      compilation.hooks.optimizeAssets.tap('MyPlugin', (assets) => {
        console.log('优化资源')
      })

      // 块资源
      compilation.hooks.chunkAsset.tap('MyPlugin', (chunk, filename) => {
        console.log('块资源:', filename)
      })

      // 处理资源
      compilation.hooks.processAssets.tap(
        {
          name: 'MyPlugin',
          stage: compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
        },
        (assets) => {
          console.log('处理资源')
        }
      )
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
          const newSource = `/* Auto Generated - ${new Date().toISOString()} */\n${source}`

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

### 创建新文件

```javascript
class CreateFilePlugin {
  constructor(options) {
    this.filename = options.filename || 'created.txt'
    this.content = options.content || ''
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('CreateFilePlugin', (compilation, callback) => {
      compilation.assets[this.filename] = {
        source: () => this.content,
        size: () => this.content.length
      }
      callback()
    })
  }
}
```

### 文件大小报告

```javascript
class FileSizePlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('FileSizePlugin', (compilation, callback) => {
      const sizes = {}

      for (const filename in compilation.assets) {
        sizes[filename] = {
          size: compilation.assets[filename].size(),
          sizeKB: (compilation.assets[filename].size() / 1024).toFixed(2)
        }
      }

      const report = JSON.stringify(sizes, null, 2)

      compilation.assets['size-report.json'] = {
        source: () => report,
        size: () => report.length
      }

      console.log('File sizes:')
      console.table(sizes)

      callback()
    })
  }
}
```

### 构建通知

```javascript
class BuildNotifierPlugin {
  constructor(options) {
    this.title = options.title || 'Webpack Build'
  }

  apply(compiler) {
    compiler.hooks.done.tap('BuildNotifierPlugin', (stats) => {
      const hasErrors = stats.hasErrors()
      const hasWarnings = stats.hasWarnings()

      const message = hasErrors
        ? 'Build failed with errors'
        : hasWarnings
          ? 'Build completed with warnings'
          : 'Build completed successfully'

      console.log(`\n${this.title}: ${message}`)

      // 发送桌面通知（需要安装 node-notifier）
      if (this.notify) {
        const notifier = require('node-notifier')
        notifier.notify({
          title: this.title,
          message: message
        })
      }
    })
  }
}
```

---

**参考文档**:
- [Webpack Plugin 官方文档](https://webpack.js.org/concepts/plugins/)
- [Webpack Plugin 列表](https://webpack.js.org/plugins/)
- [Webpack Compiler 钩子](https://webpack.js.org/api/compiler-hooks/)
- [Webpack Compilation 钩子](https://webpack.js.org/api/compilation-hooks/)
