# 资源优化

> 资源优化关注的是如何减少页面所需资源的体积和数量，通过压缩、优化和合理管理资源来提升加载性能。

## 学习要点

- 🖼️ 掌握图片格式选择与优化策略
- 📦 理解代码压缩与 Tree Shaking
- 🎨 了解字体优化方案
- 💾 运用缓存策略提升资源加载效率

---

## 1. 图片优化

### 1.1 图片格式选择

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  图片格式对比                                                                          │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  格式      │  压缩类型  │  透明度  │  动画   │  压缩率  │  浏览器支持  │  适用场景      │
│  ─────────┼───────────┼─────────┼────────┼─────────┼─────────────┼─────────────── │
│  JPEG     │  有损      │  否     │  否    │  高     │  全部       │  照片、复杂图像 │
│  PNG      │  无损      │  是     │  否    │  中     │  全部       │  图标、截图     │
│  WebP     │  有损/无损 │  是     │  是    │  很高   │  97%+       │  通用（推荐）   │
│  AVIF     │  有损/无损 │  是     │  是    │  最高   │  90%+       │  现代浏览器     │
│  GIF      │  无损      │  是     │  是    │  低     │  全部       │  简单动画       │
│  SVG      │  矢量      │  是     │  是    │  -      │  全部       │  图标、图形     │
│                                                                                       │
├───────────────────────────────────────────────────────────────────────────────────────┤
│  推荐策略                                                                              │
│                                                                                       │
│  1. 照片/复杂图像：AVIF > WebP > JPEG                                                 │
│  2. 图标/简单图形：SVG > WebP > PNG                                                   │
│  3. 动画：WebP/AVIF 动画 > GIF（视频替代更好）                                         │
│  4. 需要透明：WebP > PNG                                                              │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 响应式图片

```html
<!-- ───────────────────────────────────────────────────────────────────────────────── -->
<!-- srcset 和 sizes -->
<!-- ───────────────────────────────────────────────────────────────────────────────── -->

<img
    src="image-800.jpg"
    srcset="
        image-400.jpg 400w,
        image-800.jpg 800w,
        image-1200.jpg 1200w,
        image-1600.jpg 1600w
    "
    sizes="
        (max-width: 600px) 400px,
        (max-width: 1000px) 800px,
        1200px
    "
    alt="Responsive image"
>

<!-- ───────────────────────────────────────────────────────────────────────────────── -->
<!-- picture 元素 - 格式回退 -->
<!-- ───────────────────────────────────────────────────────────────────────────────── -->

<picture>
    <!-- AVIF 格式（最新，压缩率最高） -->
    <source type="image/avif" srcset="image.avif">
    
    <!-- WebP 格式（广泛支持） -->
    <source type="image/webp" srcset="image.webp">
    
    <!-- JPEG 格式（回退） -->
    <img src="image.jpg" alt="Fallback image">
</picture>

<!-- 结合媒体查询 -->
<picture>
    <source 
        media="(min-width: 1200px)"
        type="image/webp"
        srcset="hero-desktop.webp"
    >
    <source 
        media="(min-width: 768px)"
        type="image/webp"
        srcset="hero-tablet.webp"
    >
    <source 
        type="image/webp"
        srcset="hero-mobile.webp"
    >
    <img src="hero-mobile.jpg" alt="Hero image">
</picture>

<!-- ───────────────────────────────────────────────────────────────────────────────── -->
<!-- Art Direction - 不同设备显示不同裁剪 -->
<!-- ───────────────────────────────────────────────────────────────────────────────── -->

<picture>
    <source 
        media="(min-width: 1024px)"
        srcset="wide-crop.jpg"
    >
    <source 
        media="(min-width: 768px)"
        srcset="medium-crop.jpg"
    >
    <img 
        src="narrow-crop.jpg"
        alt="Art directed image"
    >
</picture>
```

### 1.3 图片压缩策略

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 构建时图片压缩配置
// ────────────────────────────────────────────────────────────────────────────────────

// Webpack 配置
module.exports = {
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|webp)$/i,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 8 * 1024 // 8KB 以下转 base64
                    }
                },
                generator: {
                    filename: 'images/[name].[hash][ext]'
                },
                use: [
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 80
                            },
                            optipng: {
                                enabled: true,
                                optimizationLevel: 3
                            },
                            pngquant: {
                                quality: [0.65, 0.90],
                                speed: 4
                            },
                            webp: {
                                quality: 80
                            },
                            avif: {
                                quality: 65
                            }
                        }
                    }
                ]
            }
        ]
    }
};

// Vite 配置
import viteImagemin from 'vite-plugin-imagemin';

export default {
    plugins: [
        viteImagemin({
            gifsicle: { optimizationLevel: 3 },
            optipng: { optimizationLevel: 7 },
            mozjpeg: { quality: 80 },
            svgo: {
                plugins: [
                    { name: 'removeViewBox', active: false },
                    { name: 'removeEmptyAttrs', active: true }
                ]
            },
            webp: { quality: 80 },
            avif: { quality: 65 }
        })
    ]
};

// ────────────────────────────────────────────────────────────────────────────────────
// 运行时图片检测与格式支持
// ────────────────────────────────────────────────────────────────────────────────────

// 检测 AVIF 支持
async function checkAVIFSupport() {
    if (self.createImageBitmap) {
        const avifData = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAEAAQAAADwAAAAJAAAAAAABAAEAAQAAADwAAAAJAAAAAAABAAEAAQAAADwAAAAJAAAAAA==';
        const blob = await fetch(avifData).then(r => r.blob());
        return createImageBitmap(blob).then(() => true, () => false);
    }
    return false;
}

// 检测 WebP 支持
async function checkWebPSupport() {
    if (self.createImageBitmap) {
        const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
        const blob = await fetch(webpData).then(r => r.blob());
        return createImageBitmap(blob).then(() => true, () => false);
    }
    return false;
}

// 根据支持情况选择最优格式
async function getOptimalImageUrl(baseUrl) {
    const supportsAVIF = await checkAVIFSupport();
    const supportsWebP = await checkWebPSupport();
    
    if (supportsAVIF) return `${baseUrl}.avif`;
    if (supportsWebP) return `${baseUrl}.webp`;
    return `${baseUrl}.jpg`;
}
```

### 1.4 图片 CDN 优化

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 图片 CDN 参数处理
// ────────────────────────────────────────────────────────────────────────────────────

class ImageCDN {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    
    // 构建 CDN 图片 URL
    buildUrl(path, options = {}) {
        const {
            width,
            height,
            quality = 80,
            format = 'auto',  // auto 根据浏览器自动选择
            fit = 'cover',    // cover, contain, fill, inside, outside
            position = 'center',
            devicePixelRatio = window.devicePixelRatio || 1,
            progressive = true
        } = options;
        
        const params = new URLSearchParams();
        
        if (width) params.set('w', Math.round(width * devicePixelRatio));
        if (height) params.set('h', Math.round(height * devicePixelRatio));
        params.set('q', quality);
        params.set('f', format);
        params.set('fit', fit);
        if (position !== 'center') params.set('position', position);
        if (progressive) params.set('progressive', 'true');
        
        return `${this.baseUrl}/${path}?${params.toString()}`;
    }
    
    // 响应式图片 URL
    getResponsiveUrls(path, sizes) {
        return sizes.map(size => ({
            size,
            url: this.buildUrl(path, { width: size })
        }));
    }
    
    // 生成 srcset
    generateSrcset(path, widths) {
        return widths
            .map(w => `${this.buildUrl(path, { width: w })} ${w}w`)
            .join(', ');
    }
}

// 使用示例
const imageCDN = new ImageCDN('https://cdn.example.com/images');

// 单个图片
const optimizedUrl = imageCDN.buildUrl('photo.jpg', {
    width: 800,
    quality: 80,
    format: 'auto'
});

// 响应式 srcset
const srcset = imageCDN.generateSrcset('photo.jpg', [400, 800, 1200, 1600]);

/*
常用图片 CDN 服务：
• Cloudinary: cloudinary.com
• imgix: imgix.com
• Cloudflare Images: cloudflare.com/images
• 阿里云 OSS 图片处理: help.aliyun.com/document_detail/44688.html
• 七牛云数据处理: developer.qiniu.com/dora
*/
```

---

## 2. 代码优化

### 2.1 Tree Shaking

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// Tree Shaking 原理
// ────────────────────────────────────────────────────────────────────────────────────

/*
Tree Shaking 是一种消除死代码（Dead Code Elimination）的技术，
它依赖于 ES2015 模块语法的静态结构特性（import 和 export）。

┌───────────────────────────────────────────────────────────────────────────────────────┐
│  支持 Tree Shaking 的写法                                                             │
├───────────────────────────────────────────────────────────────────────────────────────┤
│  ✅ 使用 ES Module 语法（import/export）                                              │
│  ✅ 使用命名导出（Named Export）                                                      │
│  ✅ 在 package.json 中设置 sideEffects: false                                        │
│  ✅ 使用 ES Module 入口（module 字段）                                                │
├───────────────────────────────────────────────────────────────────────────────────────┤
│  ❌ 不支持 Tree Shaking 的写法                                                        │
├───────────────────────────────────────────────────────────────────────────────────────┤
│  ❌ CommonJS 语法（require/module.exports）                                           │
│  ❌ 动态导入（import()）                                                              │
│  ❌ 全局变量注入                                                                      │
│  ❌ 有副作用的模块                                                                    │
└───────────────────────────────────────────────────────────────────────────────────────┘
*/

// ────────────────────────────────────────────────────────────────────────────────────
// 正确示例
// ────────────────────────────────────────────────────────────────────────────────────

// utils.js - 命名导出
export function funcA() { /* ... */ }
export function funcB() { /* ... */ }
export function funcC() { /* ... */ }

// main.js - 命名导入
import { funcA, funcB } from './utils';
// Tree Shaking 后，funcC 会被移除

// ────────────────────────────────────────────────────────────────────────────────────
// package.json 配置
// ────────────────────────────────────────────────────────────────────────────────────

/*
{
    "name": "my-library",
    "version": "1.0.0",
    "main": "dist/index.js",
    "module": "dist/index.esm.js",    // ES Module 入口
    "sideEffects": false,              // 声明无副作用
    // 或指定有副作用的文件
    // "sideEffects": ["*.css", "*.global.js"]
}
*/

// ────────────────────────────────────────────────────────────────────────────────────
// Webpack 配置
// ────────────────────────────────────────────────────────────────────────────────────

module.exports = {
    mode: 'production',  // 生产模式自动启用 Tree Shaking
    optimization: {
        usedExports: true,      // 标记未使用的导出
        sideEffects: true,      // 读取 package.json 的 sideEffects
        concatenateModules: true // 模块合并
    }
};

// ────────────────────────────────────────────────────────────────────────────────────
// 避免副作用
// ────────────────────────────────────────────────────────────────────────────────────

// ❌ 有副作用，无法 Tree Shaking
window.myGlobal = 'value';
document.body.classList.add('loaded');

// ✅ 无副作用，可以 Tree Shaking
export function initialize() {
    window.myGlobal = 'value';
}

// 使用时
import { initialize } from './module';
initialize();  // 只在使用时才执行
```

### 2.2 代码压缩

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// JavaScript 压缩
// ────────────────────────────────────────────────────────────────────────────────────

// Webpack + Terser
module.exports = {
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true,    // 移除 console
                        drop_debugger: true,   // 移除 debugger
                        pure_funcs: ['console.log']  // 移除特定函数调用
                    },
                    format: {
                        comments: false        // 移除注释
                    }
                },
                extractComments: false  // 不提取注释到单独文件
            })
        ]
    }
};

// Vite 默认使用 esbuild 进行压缩
export default {
    build: {
        minify: 'esbuild',  // 或 'terser'
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        }
    }
};

// ────────────────────────────────────────────────────────────────────────────────────
// CSS 压缩
// ────────────────────────────────────────────────────────────────────────────────────

// Webpack + CssMinimizerPlugin
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
    optimization: {
        minimizer: [
            new CssMinimizerPlugin({
                minimizerOptions: {
                    preset: [
                        'default',
                        {
                            discardComments: { removeAll: true },
                            normalizeWhitespace: true
                        }
                    ]
                }
            })
        ]
    }
};

// ────────────────────────────────────────────────────────────────────────────────────
// HTML 压缩
// ────────────────────────────────────────────────────────────────────────────────────

// HtmlWebpackPlugin
new HtmlWebpackPlugin({
    template: 'src/index.html',
    minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
    }
});
```

### 2.3 Gzip 与 Brotli 压缩

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// Webpack 压缩插件
// ────────────────────────────────────────────────────────────────────────────────────

const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    plugins: [
        // Gzip 压缩
        new CompressionPlugin({
            algorithm: 'gzip',
            test: /\.(js|css|html|svg)$/,
            threshold: 10240,  // 大于 10KB 才压缩
            minRatio: 0.8      // 压缩比小于 0.8 才保留
        }),
        
        // Brotli 压缩（压缩率更高）
        new CompressionPlugin({
            algorithm: 'brotliCompress',
            test: /\.(js|css|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8
        })
    ]
};

// Vite 配置
import viteCompression from 'vite-plugin-compression';

export default {
    plugins: [
        viteCompression({
            algorithm: 'gzip',
            threshold: 10240
        }),
        viteCompression({
            algorithm: 'brotliCompress',
            threshold: 10240
        })
    ]
};

// ────────────────────────────────────────────────────────────────────────────────────
// Nginx 配置
// ────────────────────────────────────────────────────────────────────────────────────

/*
# 开启 Gzip
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss application/atom+xml image/svg+xml;

# 开启 Brotli（需要安装 ngx_brotli 模块）
brotli on;
brotli_comp_level 6;
brotli_types text/plain text/css text/xml application/json application/javascript application/xml+rss application/atom+xml image/svg+xml;
*/

/*
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  Gzip vs Brotli 压缩对比                                                               │
├───────────────────────────────────────────────────────────────────────────────────────┤
│  特性          │  Gzip                  │  Brotli                                    │
│  ─────────────┼───────────────────────┼───────────────────────────────────────────  │
│  压缩率        │  约 70%                │  约 75-80%（比 Gzip 高 15-25%）            │
│  压缩速度      │  快                    │  较慢                                       │
│  解压速度      │  快                    │  快                                         │
│  浏览器支持    │  全部                  │  97%+（所有现代浏览器）                     │
│  推荐策略      │  作为 Brotli 回退      │  首选                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
*/
```

---

## 3. 字体优化

### 3.1 字体格式选择

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  字体格式对比                                                                          │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  格式      │  压缩率  │  浏览器支持  │  特点                                          │
│  ─────────┼─────────┼─────────────┼───────────────────────────────────────────────  │
│  WOFF2    │  最高    │  97%+       │  推荐：压缩率最高，现代浏览器首选               │
│  WOFF     │  高      │  99%+       │  兼容性好，作为 WOFF2 回退                     │
│  TTF/OTF  │  中      │  全部       │  传统格式，体积较大                            │
│  EOT      │  低      │  仅 IE      │  已过时，仅用于 IE8-                          │
│                                                                                       │
├───────────────────────────────────────────────────────────────────────────────────────┤
│  推荐使用顺序：WOFF2 > WOFF > TTF/OTF                                                 │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 @font-face 优化

```css
/* ────────────────────────────────────────────────────────────────────────────────────
   字体声明优化
   ──────────────────────────────────────────────────────────────────────────────────── */

@font-face {
    font-family: 'MyFont';
    
    /* 现代浏览器优先 WOFF2 */
    src: url('font.woff2') format('woff2'),
         url('font.woff') format('woff');
    
    /* 字体属性 */
    font-weight: 400;
    font-style: normal;
    font-display: swap;  /* 关键：避免 FOIT（不可见文本闪烁） */
    
    /* Unicode 范围（可选） */
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* ────────────────────────────────────────────────────────────────────────────────────
   font-display 选项
   ──────────────────────────────────────────────────────────────────────────────────── */

/*
┌─────────────────┬─────────────────────────────────────────────────────────────────────┐
│  值              │  行为                                                                 │
├─────────────────┼─────────────────────────────────────────────────────────────────────┤
│  swap           │  立即显示后备字体，字体加载后替换                                    │
│                 │  推荐：适合正文文本                                                  │
├─────────────────┼─────────────────────────────────────────────────────────────────────┤
│  block          │  阻塞渲染，最多等待 3 秒，然后显示后备字体                          │
│                 │  适合：品牌字体、图标字体                                            │
├─────────────────┼─────────────────────────────────────────────────────────────────────┤
│  fallback       │  短暂阻塞（100ms），字体加载后替换，超时则使用后备字体              │
│                 │  适合：标题                                                          │
├─────────────────┼─────────────────────────────────────────────────────────────────────┤
│  optional       │  与 fallback 类似，但浏览器可选择不加载字体                        │
│                 │  适合：低优先级装饰字体                                              │
├─────────────────┼─────────────────────────────────────────────────────────────────────┤
│  auto           │  浏览器默认行为（通常类似 block）                                    │
└─────────────────┴─────────────────────────────────────────────────────────────────────┘
*/

/* ────────────────────────────────────────────────────────────────────────────────────
   字体子集化
   ──────────────────────────────────────────────────────────────────────────────────── */

/* 只包含特定字符的子集（减少体积） */
@font-face {
    font-family: 'MyFont';
    src: url('font-subset.woff2') format('woff2');
    /* 只包含英文基本字符 */
    unicode-range: U+0000-007F;
}

/* 中文字体子集 */
@font-face {
    font-family: 'MyChineseFont';
    src: url('chinese-subset.woff2') format('woff2');
    /* 常用汉字范围 */
    unicode-range: U+4E00-9FFF;
}
```

### 3.3 字体加载策略

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 使用 Font Loading API
// ────────────────────────────────────────────────────────────────────────────────────

// 检测字体加载完成
document.fonts.ready.then(() => {
    console.log('All fonts loaded');
    document.body.classList.add('fonts-loaded');
});

// 加载特定字体
const font = new FontFace('MyFont', 'url(/fonts/myfont.woff2)', {
    style: 'normal',
    weight: '400'
});

font.load().then((loadedFont) => {
    document.fonts.add(loadedFont);
    document.body.style.fontFamily = 'MyFont, sans-serif';
}).catch((error) => {
    console.error('Font loading failed:', error);
});

// ────────────────────────────────────────────────────────────────────────────────────
// 字体预加载
// ────────────────────────────────────────────────────────────────────────────────────

/*
<head>
    <!-- 预加载关键字体 -->
    <link 
        rel="preload" 
        href="/fonts/myfont.woff2" 
        as="font" 
        type="font/woff2" 
        crossorigin
    >
</head>
*/

// ────────────────────────────────────────────────────────────────────────────────────
// 字体加载 CSS 类切换（兼容方案）
// ────────────────────────────────────────────────────────────────────────────────────

// JavaScript 检测
if ('fonts' in document) {
    document.fonts.ready.then(() => {
        document.documentElement.classList.add('fonts-loaded');
    });
} else {
    // 降级：使用会话存储记忆
    if (sessionStorage.getItem('fonts-loaded')) {
        document.documentElement.classList.add('fonts-loaded');
    }
}

/* CSS */
/*
body {
    font-family: system-ui, sans-serif;
}

.fonts-loaded body {
    font-family: 'MyFont', system-ui, sans-serif;
}
*/

// ────────────────────────────────────────────────────────────────────────────────────
// 字体加载优化工具类
// ────────────────────────────────────────────────────────────────────────────────────

class FontLoader {
    constructor(fonts) {
        this.fonts = fonts;
        this.loaded = new Map();
    }
    
    async load() {
        if ('fonts' in document) {
            const promises = this.fonts.map(async ({ family, url, weight, style }) => {
                const font = new FontFace(family, `url(${url})`, { weight, style });
                
                try {
                    const loadedFont = await font.load();
                    document.fonts.add(loadedFont);
                    this.loaded.set(family, true);
                    return true;
                } catch (error) {
                    console.warn(`Failed to load font: ${family}`, error);
                    return false;
                }
            });
            
            await Promise.all(promises);
        }
        
        // 标记加载完成
        document.documentElement.classList.add('fonts-loaded');
        sessionStorage.setItem('fonts-loaded', 'true');
    }
    
    // 检查字体是否可用
    isLoaded(family) {
        return this.loaded.get(family) || false;
    }
}

// 使用
const fontLoader = new FontLoader([
    { family: 'MyFont', url: '/fonts/myfont.woff2', weight: '400', style: 'normal' },
    { family: 'MyFont', url: '/fonts/myfont-bold.woff2', weight: '700', style: 'normal' }
]);

fontLoader.load();
```

---

## 4. 缓存策略

### 4.1 HTTP 缓存策略

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  HTTP 缓存策略                                                                         │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  缓存类型          │  特点                │  适用场景                                  │
│  ─────────────────┼─────────────────────┼─────────────────────────────────────────  │
│  强缓存            │  不发请求，直接使用  │  静态资源（版本化）                        │
│  协商缓存          │  需发请求验证        │  频繁变化的资源                            │
│                                                                                       │
├───────────────────────────────────────────────────────────────────────────────────────┤
│  强缓存配置                                                                            │
│                                                                                       │
│  Cache-Control: max-age=31536000, immutable                                           │
│  适用：带哈希的静态资源（main.a1b2c3.js）                                              │
│                                                                                       │
│  Cache-Control: max-age=86400                                                         │
│  适用：不太变化的资源                                                                  │
│                                                                                       │
├───────────────────────────────────────────────────────────────────────────────────────┤
│  协商缓存配置                                                                          │
│                                                                                       │
│  ETag: "abc123"                                                                       │
│  Last-Modified: Wed, 21 Oct 2015 07:28:00 GMT                                         │
│  适用：HTML、API 响应                                                                  │
│                                                                                       │
├───────────────────────────────────────────────────────────────────────────────────────┤
│  推荐策略                                                                              │
│                                                                                       │
│  • HTML：no-cache（协商缓存）                                                         │
│  • JS/CSS：max-age=31536000 + 文件名哈希                                              │
│  • 图片：max-age=31536000 + 文件名哈希 或 max-age=86400                               │
│  • API：根据业务需求（no-store / no-cache / 短时间缓存）                               │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Nginx 缓存配置

```nginx
# ────────────────────────────────────────────────────────────────────────────────────
# Nginx 缓存配置示例
# ────────────────────────────────────────────────────────────────────────────────────

server {
    listen 80;
    server_name example.com;
    
    # 静态资源 - 强缓存（一年）
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|webp|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }
    
    # HTML - 协商缓存
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache";
        etag on;
        if_modified_since exact;
    }
    
    # API - 不缓存
    location /api/ {
        add_header Cache-Control "no-store, no-cache, must-revalidate";
        proxy_pass http://backend;
    }
    
    # 服务端缓存（代理缓存）
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=1g inactive=60m;
    
    location /api/cacheable/ {
        proxy_cache api_cache;
        proxy_cache_valid 200 10m;
        proxy_cache_key $scheme$request_method$host$request_uri;
        add_header X-Cache-Status $upstream_cache_status;
        proxy_pass http://backend;
    }
}
```

### 4.3 版本化资源管理

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 构建时生成带哈希的文件名
// ────────────────────────────────────────────────────────────────────────────────────

// Webpack 配置
module.exports = {
    output: {
        filename: '[name].[contenthash:8].js',
        chunkFilename: '[name].[contenthash:8].chunk.js',
        assetModuleFilename: '[name].[contenthash:8][ext]'
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash:8].css',
            chunkFilename: '[name].[contenthash:8].chunk.css'
        })
    ]
};

// Vite 默认使用哈希文件名
// dist/assets/index.abc123.js
// dist/assets/index.def456.css

// ────────────────────────────────────────────────────────────────────────────────────
// 长期缓存策略
// ────────────────────────────────────────────────────────────────────────────────────

/*
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  长期缓存策略                                                                          │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  index.html ──────────► no-cache（每次验证）                                          │
│       │                                                                               │
│       ├── app.[hash].js ─────► max-age=31536000, immutable                           │
│       │                                                                               │
│       ├── vendor.[hash].js ──► max-age=31536000, immutable                           │
│       │                                                                               │
│       └── main.[hash].css ───► max-age=31536000, immutable                           │
│                                                                                       │
│  优势：                                                                               │
│  • HTML 始终最新，保证用户获取最新版本                                                 │
│  • 静态资源长期缓存，减少请求                                                          │
│  • 文件内容变化时哈希变化，自动更新                                                    │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
*/
```

---

## 5. 资源优化检查清单

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  资源优化检查清单                                                                      │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  图片优化                                                                              │
│  □ 使用 WebP/AVIF 格式（带回退）                                                      │
│  □ 图片懒加载                                                                         │
│  □ 响应式图片（srcset/sizes）                                                         │
│  □ 图片压缩（适当质量）                                                               │
│  □ 使用图片 CDN                                                                       │
│  □ 图片尺寸适配                                                                       │
│                                                                                       │
│  代码优化                                                                              │
│  □ Tree Shaking 移除死代码                                                           │
│  □ 代码压缩（JS/CSS/HTML）                                                            │
│  □ Gzip/Brotli 压缩                                                                   │
│  □ 代码分割（路由/组件）                                                              │
│  □ 第三方库按需引入                                                                   │
│                                                                                       │
│  字体优化                                                                              │
│  □ 使用 WOFF2 格式                                                                   │
│  □ font-display: swap                                                                │
│  □ 字体预加载                                                                         │
│  □ 字体子集化                                                                         │
│  □ 使用系统字体（如适用）                                                             │
│                                                                                       │
│  缓存策略                                                                              │
│  □ 静态资源长期缓存（版本化文件名）                                                   │
│  □ HTML 协商缓存                                                                      │
│  □ CDN 缓存配置                                                                       │
│  □ Service Worker 缓存                                                                │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

[返回上级目录](../index.md)
