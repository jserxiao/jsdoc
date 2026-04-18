# Loader 详解

## 概述

Loader 让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只理解 JavaScript）。loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块，然后你就可以利用 webpack 的打包能力，对它们进行处理。

## Loader 特性

- **链式传递**：loader 从右到左、从下到上执行
- **可同步可异步**：loader 可以同步或异步运行
- **模块化**：loader 在 Node.js 中运行，具有所有功能
- **可配置**：loader 可以通过 options 配置

## 常用 Loader 分类

### JavaScript 编译类

| Loader | 作用 | 官方文档 |
|--------|------|---------|
| `babel-loader` | 转换 ES6+ 代码 | [文档](https://github.com/babel/babel-loader) |
| `ts-loader` | 编译 TypeScript | [文档](https://github.com/TypeStrong/ts-loader) |
| `esbuild-loader` | esbuild 编译（更快） | [文档](https://github.com/privatenumber/esbuild-loader) |
| `@swc/loader` | SWC 编译（Rust 实现） | [文档](https://swc.rs/docs/usage-swc-loader) |

### CSS 样式类

| Loader | 作用 | 官方文档 |
|--------|------|---------|
| `style-loader` | 将 CSS 注入 DOM | [文档](https://github.com/webpack-contrib/style-loader) |
| `css-loader` | 解析 CSS 文件 | [文档](https://github.com/webpack-contrib/css-loader) |
| `sass-loader` | 编译 Sass/SCSS | [文档](https://github.com/webpack-contrib/sass-loader) |
| `less-loader` | 编译 Less | [文档](https://github.com/webpack-contrib/less-loader) |
| `postcss-loader` | PostCSS 处理 | [文档](https://github.com/webpack-contrib/postcss-loader) |
| `stylus-loader` | 编译 Stylus | [文档](https://github.com/webpack-contrib/stylus-loader) |

### 资源文件类

| Loader | 作用 | 官方文档 |
|--------|------|---------|
| `file-loader` | 处理文件 | [文档](https://github.com/webpack-contrib/file-loader) |
| `url-loader` | 处理图片/字体 | [文档](https://github.com/webpack-contrib/url-loader) |
| `svg-url-loader` | SVG 转 URL | [文档](https://github.com/hiasinho/svg-url-loader) |
| `image-webpack-loader` | 图片压缩 | [文档](https://github.com/tcoopman/image-webpack-loader) |

### 框架类

| Loader | 作用 | 官方文档 |
|--------|------|---------|
| `vue-loader` | 编译 Vue 组件 | [文档](https://vue-loader.vuejs.org/) |
| `@angular-devkit/build-angular` | Angular 构建 | [文档](https://angular.io/cli) |

### 其他类

| Loader | 作用 | 官方文档 |
|--------|------|---------|
| `html-loader` | 处理 HTML | [文档](https://github.com/webpack-contrib/html-loader) |
| `json-loader` | 加载 JSON | [文档](https://github.com/webpack/json-loader) |
| `yaml-loader` | 加载 YAML | [文档](https://github.com/eemeli/yaml-loader) |
| `toml-loader` | 加载 TOML | [文档](https://github.com/jkuri/js-toml-loader) |
| `csv-loader` | 加载 CSV | [文档](https://github.com/thejameskyle/csv-loader) |
| `xml-loader` | 加载 XML | [文档](https://github.com/gisikw/csv-loader) |
| `markdown-loader` | 加载 Markdown | [文档](https://github.com/unindented/markdown-loader) |
| `raw-loader` | 加载原始文件 | [文档](https://github.com/webpack-contrib/raw-loader) |
| `worker-loader` | Web Worker | [文档](https://github.com/webpack-contrib/worker-loader) |

## JavaScript 编译类 Loader

### babel-loader

#### 安装

```bash
npm install -D babel-loader @babel/core @babel/preset-env @babel/plugin-transform-runtime
```

#### 基础配置

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
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime'],
            cacheDirectory: true
          }
        }
      }
    ]
  }
}
```

#### 完整配置

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'src'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    chrome: '80',
                    firefox: '78',
                    safari: '14',
                    edge: '88',
                    node: '14'
                  },
                  modules: false,  // 保留 ES6 模块语法
                  useBuiltIns: 'usage',  // 按需引入 polyfill
                  corejs: {
                    version: 3,
                    proposals: true
                  }
                }
              ]
            ],
            plugins: [
              '@babel/plugin-transform-runtime',
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-syntax-dynamic-import'
            ],
            cacheDirectory: true,
            cacheCompression: false,
            compact: true
          }
        }
      }
    ]
  }
}
```

#### React 配置

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', {
                runtime: 'automatic'  // React 17+ 自动导入
              }]
            ],
            plugins: [
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              ['@babel/plugin-proposal-class-properties', { loose: true }]
            ]
          }
        }
      }
    ]
  }
}
```

#### TypeScript 配置

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-typescript'
            ]
          }
        }
      }
    ]
  }
}
```

### ts-loader

#### 安装

```bash
npm install -D typescript ts-loader
```

#### 基础配置

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

#### 完整配置

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,  // 仅转译，不类型检查
              happyPackMode: true,  // 多线程
              compilerOptions: {
                module: 'esnext'
              },
              appendTsSuffixTo: [/\.vue$/],
              appendTsxSuffixTo: [/\.vue$/]
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  }
}
```

#### 配合 fork-ts-checker-webpack-plugin

```javascript
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true  // 仅转译
          }
        }
      }
    ]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin()  // 类型检查
  ]
}
```

### esbuild-loader

#### 安装

```bash
npm install -D esbuild-loader
```

#### 基础配置

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

#### 完整配置

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        use: {
          loader: 'esbuild-loader',
          options: {
            loader: 'tsx',
            target: 'es2020',
            jsxFactory: 'React.createElement',
            jsxFragment: 'React.Fragment',
            define: {
              'process.env.NODE_ENV': '"production"'
            }
          }
        }
      }
    ]
  },
  optimization: {
    minimizer: [
      new EsbuildPlugin({
        target: 'es2020',
        css: true
      })
    ]
  }
}
```

## CSS 样式类 Loader

### style-loader

#### 安装

```bash
npm install -D style-loader
```

#### 基础配置

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
}
```

#### 高级配置

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              injectType: 'styleTag',  // 'styleTag' | 'singletonStyleTag' | 'lazyStyleTag' | 'lazySingletonStyleTag' | 'linkTag'
              attributes: {
                'data-test': 'true'
              },
              insert: 'head',  // 插入位置
              base: 0,
              esModule: false
            }
          },
          'css-loader'
        ]
      }
    ]
  }
}
```

### css-loader

#### 安装

```bash
npm install -D css-loader
```

#### 基础配置

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
}
```

#### 高级配置

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              // CSS Modules
              modules: {
                localIdentName: '[name]__[local]__[hash:base64:5]',
                exportLocalsConvention: 'camelCase',
                exportOnlyLocals: false
              },

              // URL 处理
              url: true,
              import: true,

              // Source Map
              sourceMap: true,

              // 导入次数
              importLoaders: 1,

              // ES Module
              esModule: false
            }
          },
          'postcss-loader'
        ]
      }
    ]
  }
}
```

### sass-loader

#### 安装

```bash
npm install -D sass sass-loader
```

#### 基础配置

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  }
}
```

#### 高级配置

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
            }
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),

              // 全局变量
              additionalData: `@import "@/styles/variables.scss";`,

              // Source Map
              sourceMap: true,

              // Sass 选项
              sassOptions: {
                outputStyle: 'expanded',
                fiber: false,
                indentWidth: 2,
                includePaths: [
                  path.resolve(__dirname, 'src/styles')
                ]
              }
            }
          }
        ]
      }
    ]
  }
}
```

### postcss-loader

#### 安装

```bash
npm install -D postcss postcss-loader autoprefixer
```

#### 基础配置

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      }
    ]
  }
}
```

#### PostCSS 配置文件

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('autoprefixer')({
      overrideBrowserslist: [
        '> 1%',
        'last 2 versions',
        'not dead'
      ]
    }),
    require('postcss-preset-env')({
      stage: 0,
      features: {
        'nesting-rules': true
      }
    }),
    require('cssnano')({
      preset: 'default'
    })
  ]
}
```

#### 高级配置

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: path.resolve(__dirname, 'postcss.config.js'),
                plugins: [
                  'autoprefixer',
                  ['postcss-preset-env', {
                    stage: 0
                  }]
                ]
              },
              sourceMap: true
            }
          }
        ]
      }
    ]
  }
}
```

## 资源文件类 Loader

### 图片处理

#### 现代 Asset Modules（Webpack 5+）

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
          filename: 'images/[name].[hash:8][ext]'
        }
      }
    ]
  }
}
```

#### url-loader（Webpack 4）

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,  // 8KB
            name: 'images/[name].[hash:8].[ext]',
            outputPath: 'images/',
            publicPath: '../images/',
            esModule: false
          }
        }
      }
    ]
  }
}
```

#### 图片压缩

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: 'asset',
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              optipng: {
                enabled: false
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4
              },
              gifsicle: {
                interlaced: false
              },
              webp: {
                quality: 75
              }
            }
          }
        ]
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
          filename: 'fonts/[name].[hash:8][ext]'
        }
      }
    ]
  }
}
```

### 媒体文件处理

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
        type: 'asset/resource',
        generator: {
          filename: 'media/[name].[hash:8][ext]'
        }
      }
    ]
  }
}
```

## 框架类 Loader

### vue-loader

#### 安装

```bash
npm install -D vue-loader vue-template-compiler
```

#### Vue 2 配置

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
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['.vue', '.js']
  }
}
```

#### Vue 3 配置

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
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  resolve: {
    extensions: ['.vue', '.js']
  }
}
```

## 其他常用 Loader

### html-loader

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            sources: {
              list: [
                {
                  tag: 'img',
                  attribute: 'src',
                  type: 'src'
                },
                {
                  tag: 'link',
                  attribute: 'href',
                  type: 'src'
                }
              ]
            },
            minimize: true
          }
        }
      }
    ]
  }
}
```

### yaml-loader

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.ya?ml$/,
        use: 'yaml-loader'
      }
    ]
  }
}

// 使用
import data from './data.yaml'
```

### markdown-loader

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.md$/,
        use: [
          'html-loader',
          'markdown-loader'
        ]
      }
    ]
  }
}
```

### worker-loader

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: {
          loader: 'worker-loader',
          options: {
            inline: 'no-fallback'
          }
        }
      }
    ]
  }
}

// 使用
import Worker from './my.worker.js'
const worker = new Worker()
```

## 自定义 Loader

### 基础 Loader

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
// my-loader.js
module.exports = function(source) {
  // 获取配置项
  const options = this.getOptions()

  // 验证配置项
  const schema = {
    type: 'object',
    properties: {
      prefix: {
        type: 'string'
      }
    }
  }

  this.validateOptions(schema, options, 'My Loader')

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

### 返回 Source Map

```javascript
module.exports = function(source) {
  const result = transform(source)

  // 生成 Source Map
  const sourceMap = generateSourceMap(source, result)

  // 返回结果和 Source Map
  return this.callback(null, result, sourceMap)
}
```

### Loader 工具库

```javascript
const { getOptions, stringifyRequest } = require('loader-utils')
const { validate } = require('schema-utils')

const schema = {
  type: 'object',
  properties: {
    test: {
      type: 'string'
    }
  }
}

module.exports = function(source) {
  const options = getOptions(this)

  // 验证选项
  validate(schema, options, {
    name: 'My Loader',
    baseDataPath: 'options'
  })

  // 字符串化请求
  const requestString = stringifyRequest(this, require.resolve('./file.js'))

  return `import ${requestString}\n${source}`
}
```

---

**参考文档**:
- [Webpack Loader 官方文档](https://webpack.js.org/concepts/loaders/)
- [Webpack Loader 列表](https://webpack.js.org/loaders/)
