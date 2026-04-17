# Loader 详解

Loader 让 Webpack 能够处理非 JavaScript 文件，将其转换为有效模块。

## 常用 Loader 列表

| Loader | 作用 |
|--------|------|
| `babel-loader` | 转换 ES6+ 代码 |
| `ts-loader` | 编译 TypeScript |
| `css-loader` | 解析 CSS 文件 |
| `style-loader` | 将 CSS 注入 DOM |
| `sass-loader` | 编译 Sass/SCSS |
| `less-loader` | 编译 Less |
| `postcss-loader` | PostCSS 处理 |
| `url-loader` | 处理图片/字体 |
| `file-loader` | 处理文件 |
| `html-loader` | 处理 HTML |
| `vue-loader` | 编译 Vue 组件 |

## JavaScript 处理

### babel-loader

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: '> 0.25%, not dead',
                useBuiltIns: 'usage',
                corejs: 3
              }]
            ],
            plugins: [
              '@babel/plugin-transform-runtime'
            ],
            cacheDirectory: true
          }
        }
      }
    ]
  }
}
```

### ts-loader

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
}
```

### esbuild-loader（更快）

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'esbuild-loader',
          options: {
            loader: 'js',
            target: 'es2015'
          }
        }
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: 'esbuild-loader',
          options: {
            loader: 'tsx',
            target: 'es2015'
          }
        }
      }
    ]
  }
}
```

## CSS 处理

### 基础 CSS 配置

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',    // 将 CSS 注入 DOM
          'css-loader',      // 解析 @import 和 url()
          'postcss-loader'   // 添加浏览器前缀
        ]
      }
    ]
  }
}
```

### 生产环境 CSS 提取

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,  // 提取到单独文件
          'css-loader',
          'postcss-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css'
    })
  ]
}
```

### Sass/SCSS 配置

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              additionalData: `@import "@/styles/variables.scss";`
            }
          }
        ]
      }
    ]
  }
}
```

### CSS Modules

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]'
              }
            }
          }
        ]
      }
    ]
  }
}
```

### PostCSS 配置

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('autoprefixer')({
      overrideBrowserslist: ['> 1%', 'last 2 versions']
    }),
    require('postcss-preset-env')({
      stage: 0
    }),
    require('cssnano')({
      preset: 'default'
    })
  ]
}
```

## 资源处理

### 图片处理

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg|webp)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024  // 8KB 以下转 base64
          }
        },
        generator: {
          filename: 'images/[hash][ext]'
        }
      }
    ]
  }
}
```

### 字体处理

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[hash][ext]'
        }
      }
    ]
  }
}
```

### 媒体文件

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
        type: 'asset/resource',
        generator: {
          filename: 'media/[hash][ext]'
        }
      }
    ]
  }
}
```

## Vue 处理

```javascript
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}
```

## 自定义 Loader

### Loader 基本结构

```javascript
// my-loader.js
module.exports = function(source) {
  // source 是文件内容字符串
  
  // 处理逻辑
  const result = source.replace(/console\.log\(/g, '// console.log(')
  
  // 返回处理后的内容
  return result
}
```

### 异步 Loader

```javascript
module.exports = function(source) {
  const callback = this.async()
  
  // 异步处理
  someAsyncOperation(source, (err, result) => {
    if (err) return callback(err)
    
    // 返回结果
    callback(null, result, sourceMap, ast)
  })
}
```

### 带 Options 的 Loader

```javascript
module.exports = function(source) {
  const options = this.getOptions()
  
  // 使用配置项
  const prefix = options.prefix || ''
  
  return prefix + source
}

// 使用
module.exports = {
  module: {
    rules: [
      {
        test: /\.txt$/,
        use: {
          loader: path.resolve(__dirname, 'my-loader.js'),
          options: {
            prefix: '// AUTO GENERATED\n'
          }
        }
      }
    ]
  }
}
```

---

[返回上级](./)
