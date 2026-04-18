# Vite CSS 配置详解

## 概述

Vite 对 CSS 提供了开箱即用的支持，并提供了丰富的配置选项来处理 CSS 预处理器、CSS Modules、PostCSS 等。

## 基础配置

### css.modules

CSS Modules 配置。

```typescript
import { defineConfig } from 'vite'

export default defineConfig({
  css: {
    modules: {
      // 生成的类名格式
      generateScopedName: '[name]__[local]__[hash:base64:5]',

      // 或使用函数
      generateScopedName: (name, filename, css) => {
        const file = filename.split('/').pop().split('.')[0]
        return `${file}__${name}`
      },

      // 匹配 CSS Modules 文件
      include: /\.module\.(css|scss|sass)$/,
      exclude: /node_modules/,

      // 全局导入
      globalModulePaths: [/global\.css$/],

      // 转换行为
      localsConvention: 'camelCase',  // 'camelCase' | 'camelCaseOnly' | 'dashes' | 'dashesOnly'

      // hashPrefix
      hashPrefix: 'my-prefix',

      // 轻量级 CSS Modules
      lightningcss: {
        cssModules: true
      }
    }
  }
})
```

### 使用 CSS Modules

```typescript
// vite.config.ts
export default defineConfig({
  css: {
    modules: {
      generateScopedName: '[name]__[local]__[hash:base64:5]'
    }
  }
})
```

```css
/* styles.module.css */
.container {
  display: flex;
}
.title {
  font-size: 24px;
}
```

```typescript
// App.vue 或 App.tsx
import styles from './styles.module.css'

console.log(styles.container)  // styles__container__xyz123
console.log(styles.title)      // styles__title__xyz123
```

## CSS 预处理器

### Sass/SCSS

Vite 对 Sass/SCSS 提供内置支持，只需安装依赖：

```bash
npm install -D sass
```

```typescript
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        // 全局变量
        additionalData: `@import "@/styles/variables.scss";`,

        // API 选项
        api: 'modern-compiler',  // 'modern-compiler' | 'modern' | 'legacy'

        // Silence 警告
        silenceDeprecations: ['legacy-js-api'],

        // 其他选项
        charset: false,
      },

      // 使用旧版 API
      scss: {
        additionalData: (content, filePath) => {
          if (filePath.includes('components')) {
            return `@import "@/styles/mixins.scss";${content}`
          }
          return content
        }
      }
    }
  }
})
```

### Less

```bash
npm install -D less
```

```typescript
export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        // 全局变量
        additionalData: `@import "@/styles/variables.less";`,

        // 修改 Less 变量
        modifyVars: {
          'primary-color': '#1890ff',
          'link-color': '#1890ff',
        },

        // JavaScript 表达式
        javascriptEnabled: true,

        // 数学计算
        math: 'always',  // 'always' | 'parens-division' | 'parens' | 'strictLegacy'
      }
    }
  }
})
```

### Stylus

```bash
npm install -D stylus
```

```typescript
export default defineConfig({
  css: {
    preprocessorOptions: {
      styl: {
        // 全局导入
        additionalData: `@import "@/styles/variables.styl"`,

        // 定义变量
        define: {
          $primary-color: '#1890ff',
          $font-size: '14px',
        },

        // 包含 CSS
        include: ['node_modules'],

        // 压缩
        compress: true,
      }
    }
  }
})
```

## PostCSS 配置

### postcss.config.js

```javascript
// postcss.config.js
export default {
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

### vite.config.ts 中配置

```typescript
export default defineConfig({
  css: {
    postcss: {
      plugins: [
        require('autoprefixer')(),
        require('postcss-preset-env')({ stage: 0 }),
        require('cssnano')({ preset: 'default' })
      ]
    }
  }
})
```

### 指定 PostCSS 配置文件路径

```typescript
export default defineConfig({
  css: {
    postcss: './postcss.config.js'
  }
})
```

### 内联 PostCSS 配置

```typescript
export default defineConfig({
  css: {
    postcss: {
      plugins: [
        {
          postcssPlugin: 'internal:charset-removal',
          AtRule: {
            charset: (atRule) => {
              if (atRule.name === 'charset') {
                atRule.remove()
              }
            }
          }
        }
      ]
    }
  }
})
```

## 开发配置

### css.devSourcemap

开发环境 Source Map。

```typescript
export default defineConfig({
  css: {
    devSourcemap: true,  // 启用（默认 false）
  }
})
```

### css.extract

CSS 提取配置。

```typescript
export default defineConfig({
  build: {
    cssCodeSplit: true,   // CSS 代码分割
  },
  css: {
    extract: {
      filename: 'css/[name].[hash].css',
      chunkFilename: 'css/[name].[hash].css',
    }
  }
})
```

## CSS 转换

### css.transformer

CSS 转换器选择。

```typescript
export default defineConfig({
  css: {
    transformer: 'postcss',   // 使用 PostCSS（默认）
    transformer: 'lightningcss', // 使用 Lightning CSS
  }
})
```

### Lightning CSS

```typescript
export default defineConfig({
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      // 目标浏览器
      targets: {
        chrome: 95,
        safari: 14,
        firefox: 91,
      },

      // CSS Modules
      cssModules: true,

      // 压缩
      minify: true,

      // 草稿特性
      drafts: {
        nesting: true,
        customMedia: true,
      },

      // 非标准特性
      nonStandard: {
        deepCombinator: true,
      }
    }
  }
})
```

## CSS 预处理器全局配置

### 全局变量和混合

```typescript
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/styles/variables.scss";
          @import "@/styles/mixins.scss";
          @import "@/styles/functions.scss";
        `
      }
    }
  }
})
```

### 条件导入

```typescript
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: (content, filePath) => {
          // 只在特定文件中导入
          if (filePath.includes('components')) {
            return `@import "@/styles/component-vars.scss";\n${content}`
          }
          if (filePath.includes('pages')) {
            return `@import "@/styles/page-vars.scss";\n${content}`
          }
          return content
        }
      }
    }
  }
})
```

## 完整配置示例

### 开发环境配置

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],

  css: {
    // CSS Modules
    modules: {
      generateScopedName: '[name]__[local]__[hash:base64:5]',
      localsConvention: 'camelCase',
    },

    // 开发环境 Source Map
    devSourcemap: true,

    // 预处理器
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
        api: 'modern-compiler',
      }
    },

    // PostCSS
    postcss: './postcss.config.js'
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
```

### 生产环境配置

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],

  build: {
    cssCodeSplit: true,
    cssMinify: true,
  },

  css: {
    modules: {
      generateScopedName: '[hash:base64:5]',
    },

    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
        api: 'modern-compiler',
      }
    },

    // 使用 Lightning CSS
    transformer: 'lightningcss',
    lightningcss: {
      minify: true,
      targets: {
        chrome: 80,
        safari: 13,
        firefox: 75,
      }
    }
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
```

### Ant Design 定制主题

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],

  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          'primary-color': '#1890ff',
          'link-color': '#1890ff',
          'border-radius-base': '4px',
          'font-size-base': '14px',
        },
      }
    }
  }
})
```

### Element Plus 定制主题

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/styles/element/index.scss" as *;
        `,
        api: 'modern-compiler',
      }
    }
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
```

```scss
/* src/styles/element/index.scss */
@forward 'element-plus/theme-chalk/src/common/var.scss' with (
  $colors: (
    'primary': (
      'base': #409eff,
    ),
  ),
  $button: (
    'border-radius': 4px,
  ),
);

@use "element-plus/theme-chalk/src/index.scss" as *;
```

## 常见问题

### 1. CSS Modules 类名冲突

```typescript
export default defineConfig({
  css: {
    modules: {
      generateScopedName: '[path][name]__[local]__[hash:base64:5]',
      localsConvention: 'camelCaseOnly',
    }
  }
})
```

### 2. 全局样式不生效

```typescript
// vite.config.ts
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/global.scss";`
      }
    }
  }
})
```

```typescript
// main.ts
import '@/styles/global.scss'
```

### 3. Sass 编译错误

```typescript
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',  // 使用新编译器
        silenceDeprecations: ['legacy-js-api'],
      }
    }
  }
})
```

### 4. PostCSS 插件不生效

```typescript
// vite.config.ts
export default defineConfig({
  css: {
    postcss: {
      plugins: [
        require('autoprefixer')({
          overrideBrowserslist: ['last 2 versions']
        })
      ]
    }
  }
})
```

### 5. CSS 顺序问题

```typescript
// main.ts
// 确保正确的导入顺序
import 'normalize.css'
import '@/styles/base.scss'
import '@/styles/global.scss'
import App from './App.vue'
```

---

**参考文档**:
- [Vite CSS Options](https://vitejs.dev/config/shared-options.html#css)
- [Sass Documentation](https://sass-lang.com/documentation/)
- [PostCSS Documentation](https://postcss.org/)
- [Lightning CSS](https://lightningcss.dev/)

[返回上级](./)
