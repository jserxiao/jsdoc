# 元数据与头部

> HTML `<head>` 元素包含文档的元数据（metadata），这些信息不会显示在页面上，但对浏览器、搜索引擎和其他 Web 服务至关重要。

## 学习要点

- 📄 理解 head 元素的作用和结构
- 🏷️ 掌握各种 meta 标签的使用
- 🔗 学会使用 link 标签管理资源
- ⚡ 了解性能优化的头部配置

---

## 1. head 元素概述

### 1.1 head 的作用

```
HTML 文档结构
├── <head> - 元数据区（不可见）
│   ├── <title> - 页面标题
│   ├── <meta> - 元信息
│   ├── <link> - 外部资源链接
│   ├── <style> - 内部样式
│   └── <script> - 脚本
└── <body> - 内容区（可见）
```

### 1.2 基本结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <!-- 字符编码（必须放在最前面） -->
    <meta charset="UTF-8">
    
    <!-- 视口设置（移动端必需） -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- 页面标题 -->
    <title>页面标题 | 网站名称</title>
    
    <!-- SEO 元数据 -->
    <meta name="description" content="页面描述">
    <meta name="keywords" content="关键词1, 关键词2">
    
    <!-- Favicon -->
    <link rel="icon" href="/favicon.ico">
    
    <!-- 样式表 -->
    <link rel="stylesheet" href="/styles.css">
    
    <!-- 其他 head 内容... -->
</head>
<body>
    <!-- 页面内容 -->
</body>
</html>
```

---

## 2. meta 标签详解

### 2.1 字符编码

```html
<!-- 声明字符编码（必须） -->
<meta charset="UTF-8">

<!-- 其他编码（不推荐） -->
<meta charset="ISO-8859-1">
<meta charset="GB2312">
```

### 2.2 视口设置

```html
<!-- 基本视口设置 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- 完整属性 -->
<meta name="viewport" content="
    width=device-width,      /* 宽度等于设备宽度 */
    initial-scale=1.0,       /* 初始缩放比例 */
    maximum-scale=5.0,       /* 最大缩放比例 */
    minimum-scale=1.0,       /* 最小缩放比例 */
    user-scalable=yes,       /* 允许用户缩放 */
    viewport-fit=cover       /* 适配刘海屏 */
">

<!-- 禁止缩放（不推荐，影响可访问性） -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

### 2.3 SEO 相关 meta

```html
<!-- 页面描述（搜索引擎显示） -->
<meta name="description" content="这是页面的描述文字，通常在150-160字符之间">

<!-- 关键词（现代搜索引擎已不太重视） -->
<meta name="keywords" content="前端开发, HTML, CSS, JavaScript">

<!-- 作者 -->
<meta name="author" content="作者名称">

<!-- 版权信息 -->
<meta name="copyright" content="© 2024 网站名称">

<!-- robots 指令 -->
<meta name="robots" content="index, follow">          <!-- 索引并跟踪链接 -->
<meta name="robots" content="noindex, nofollow">     <!-- 不索引不跟踪 -->
<meta name="robots" content="noarchive">              <!-- 不显示快照 -->
<meta name="robots" content="nosnippet">              <!-- 不显示摘要 -->

<!-- 针对特定搜索引擎 -->
<meta name="googlebot" content="noindex">
<meta name="baiduspider" content="noindex">
```

### 2.4 浏览器行为

```html
<!-- IE 兼容模式 -->
<meta http-equiv="X-UA-Compatible" content="IE=edge">

<!-- 渲染模式 -->
<meta name="renderer" content="webkit">  <!-- 360浏览器使用 webkit 内核 -->

<!-- 缓存控制 -->
<meta http-equiv="Cache-Control" content="no-cache">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">

<!-- 自动刷新（秒） -->
<meta http-equiv="refresh" content="30">  <!-- 每30秒刷新 -->

<!-- 定时跳转 -->
<meta http-equiv="refresh" content="5; url=https://example.com">
```

### 2.5 移动端特定

```html
<!-- iOS Safari -->
<meta name="apple-mobile-web-app-capable" content="yes">           <!-- 全屏模式 -->
<meta name="apple-mobile-web-app-status-bar-style" content="black"> <!-- 状态栏样式 -->
<meta name="apple-mobile-web-app-title" content="应用名称">         <!-- 应用名称 -->

<!-- Android -->
<meta name="mobile-web-app-capable" content="yes">
<meta name="theme-color" content="#4285f4">                         <!-- 地址栏颜色 -->

<!-- Windows Phone -->
<meta name="msapplication-TileColor" content="#ffffff">
<meta name="msapplication-TileImage" content="/tile.png">
<meta name="msapplication-tap-highlight" content="no">

<!-- UC 浏览器 -->
<meta name="screen-orientation" content="portrait">                 <!-- 屏幕方向 -->
<meta name="full-screen" content="yes">
<meta name="browsermode" content="application">

<!-- QQ 浏览器 -->
<meta name="x5-orientation" content="portrait">
<meta name="x5-fullscreen" content="true">
<meta name="x5-page-mode" content="app">
```

### 2.6 安全相关 meta

```html
<!-- 内容安全策略 -->
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://cdn.example.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
">

<!-- Referrer 策略 -->
<meta name="referrer" content="strict-origin-when-cross-origin">

<!--
    no-referrer: 不发送 Referer
    no-referrer-when-downgrade: HTTPS→HTTP 不发送
    origin: 只发送源
    origin-when-cross-origin: 跨域只发送源
    same-origin: 同源才发送
    strict-origin: 只发送源，降级不发送
    strict-origin-when-cross-origin: 跨域降级不发送
    unsafe-url: 总是发送完整 URL
-->
```

---

## 3. Open Graph 与社交媒体

### 3.1 Open Graph 协议

```html
<!-- 基础 OG 标签 -->
<meta property="og:type" content="article">
<meta property="og:title" content="文章标题">
<meta property="og:description" content="文章描述">
<meta property="og:url" content="https://example.com/article">
<meta property="og:image" content="https://example.com/image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="网站名称">
<meta property="og:locale" content="zh_CN">
<meta property="og:locale:alternate" content="en_US">

<!-- 文章类型 -->
<meta property="article:published_time" content="2024-01-15T08:00:00+08:00">
<meta property="article:modified_time" content="2024-01-16T10:30:00+08:00">
<meta property="article:author" content="作者名">
<meta property="article:section" content="技术">
<meta property="article:tag" content="前端开发">
<meta property="article:tag" content="HTML">

<!-- 产品类型 -->
<meta property="product:price:amount" content="99.00">
<meta property="product:price:currency" content="CNY">
<meta property="product:availability" content="in stock">
```

### 3.2 Twitter Card

```html
<!-- Twitter 卡片 -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@yourhandle">
<meta name="twitter:creator" content="@authorhandle">
<meta name="twitter:title" content="标题">
<meta name="twitter:description" content="描述">
<meta name="twitter:image" content="https://example.com/image.jpg">

<!-- 卡片类型 -->
<!-- summary: 小图卡片 -->
<!-- summary_large_image: 大图卡片 -->
<!-- player: 视频/音频播放器 -->
<!-- app: 应用下载卡片 -->
```

### 3.3 其他社交平台

```html
<!-- Facebook -->
<meta property="fb:app_id" content="123456789">

<!-- 微信 -->
<meta property="og:image" content="分享图片">
<meta property="og:title" content="分享标题">

<!-- 微博 -->
<meta property="og:type" content="article">
<meta name="weibo:article:create_at" content="2024-01-15">
```

---

## 4. link 标签详解

### 4.1 样式表

```html
<!-- 外部样式表 -->
<link rel="stylesheet" href="/styles.css">

<!-- 带媒体查询 -->
<link rel="stylesheet" href="/print.css" media="print">
<link rel="stylesheet" href="/mobile.css" media="(max-width: 768px)">

<!-- 预加载后加载 -->
<link rel="preload" href="/styles.css" as="style" onload="this.rel='stylesheet'">
```

### 4.2 图标

```html
<!-- Favicon -->
<link rel="icon" href="/favicon.ico">

<!-- PNG 图标 -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">

<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

<!-- Safari 固定标签图标 -->
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">

<!-- Android Chrome -->
<link rel="manifest" href="/site.webmanifest">
```

### 4.3 资源预加载

```html
<!-- 预加载（优先级高，必须使用） -->
<link rel="preload" href="/font.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/critical.css" as="style">
<link rel="preload" href="/hero-image.webp" as="image">
<link rel="preload" href="/video.mp4" as="video">

<!-- 预连接（提前建立连接） -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- DNS 预解析 -->
<link rel="dns-prefetch" href="https://analytics.google.com">

<!-- 预获取（低优先级，未来可能用到） -->
<link rel="prefetch" href="/next-page.html">
<link rel="prefetch" href="/next-page-data.json">

<!-- 预渲染（整个页面） -->
<link rel="prerender" href="/next-page.html">
```

### 4.4 规范链接

```html
<!-- 规范链接（SEO 重要） -->
<link rel="canonical" href="https://example.com/article/123">

<!-- 交替语言版本 -->
<link rel="alternate" hreflang="zh-CN" href="https://example.com/zh/article">
<link rel="alternate" hreflang="en" href="https://example.com/en/article">
<link rel="alternate" hreflang="x-default" href="https://example.com/article">

<!-- AMP 版本 -->
<link rel="amphtml" href="https://example.com/article/amp">

<!-- RSS 订阅 -->
<link rel="alternate" type="application/rss+xml" title="RSS Feed" href="/rss.xml">
```

### 4.5 分页链接

```html
<!-- 分页导航 -->
<link rel="prev" href="/articles?page=1">
<link rel="next" href="/articles?page=3">

<!-- 首页和章节 -->
<link rel="home" href="/">
<link rel="chapter" href="/chapter/1">
<link rel="section" href="/section/intro">
```

---

## 5. script 标签详解

### 5.1 加载方式

```html
<!-- 普通脚本（阻塞解析） -->
<script src="/script.js"></script>

<!-- 异步加载（不阻塞，执行顺序不确定） -->
<script src="/analytics.js" async></script>

<!-- 延迟执行（DOMContentLoaded 前执行，顺序保持） -->
<script src="/app.js" defer></script>

<!-- ES 模块 -->
<script type="module" src="/app.js"></script>

<!-- 模块预加载 -->
<link rel="modulepreload" href="/module.js">

<!-- 内联脚本 -->
<script>
    console.log('Inline script');
</script>

<!-- 内联模块 -->
<script type="module">
    import { foo } from './module.js';
    foo();
</script>
```

### 5.2 async vs defer

```
无属性：        解析 → [下载] → [执行] → 继续解析
                (阻塞解析，阻塞渲染)

async：         解析 → [下载] → [执行] → 继续解析
                (不阻塞解析，下载完立即执行，顺序不确定)

defer：         解析 → [下载] → 解析完成 → [执行]
                (不阻塞解析，DOMContentLoaded 前按顺序执行)
```

```html
<!-- 多个脚本的情况 -->

<!-- async: 执行顺序不确定 -->
<script src="a.js" async></script>
<script src="b.js" async></script>
<!-- 可能 b.js 先执行 -->

<!-- defer: 按顺序执行 -->
<script src="a.js" defer></script>
<script src="b.js" defer></script>
<!-- a.js 一定先于 b.js 执行 -->
```

### 5.3 其他属性

```html
<!-- 跨域脚本 -->
<script src="https://cdn.example.com/script.js" crossorigin="anonymous"></script>

<!-- 完整性校验 -->
<script 
    src="https://cdn.example.com/script.js"
    integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/ux..."
    crossorigin="anonymous"
></script>

<!-- Nomodule 回退 -->
<script type="module" src="app.mjs"></script>
<script nomodule src="app.js"></script>

<!-- 动态导入 -->
<script type="module">
    const module = await import('./module.js');
</script>
```

---

## 6. style 标签

```html
<!-- 内部样式 -->
<style>
    body {
        margin: 0;
        padding: 0;
    }
</style>

<!-- 带媒体查询 -->
<style media="print">
    .no-print {
        display: none;
    }
</style>

<!-- scoped（已废弃，用 Shadow DOM 替代） -->
```

---

## 7. base 标签

```html
<!-- 设置基础 URL -->
<head>
    <base href="https://example.com/app/">
    <base target="_blank">
</head>

<body>
    <!-- 相对 URL 会基于 base -->
    <a href="page.html">  <!-- 实际链接：https://example.com/app/page.html -->
    <img src="image.jpg">  <!-- 实际链接：https://example.com/app/image.jpg -->
</body>
```

**注意**：`<base>` 标签会影响页面上所有相对 URL，使用需谨慎。

---

## 8. 完整 head 模板

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <!-- ========== 基础配置 ========== -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>页面标题 | 网站名称</title>
    
    <!-- ========== SEO ========== -->
    <meta name="description" content="页面描述，150-160字符">
    <meta name="keywords" content="关键词1, 关键词2">
    <meta name="author" content="作者">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://example.com/page">
    
    <!-- ========== Open Graph ========== -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="页面标题">
    <meta property="og:description" content="页面描述">
    <meta property="og:url" content="https://example.com/page">
    <meta property="og:image" content="https://example.com/og-image.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="网站名称">
    <meta property="og:locale" content="zh_CN">
    
    <!-- ========== Twitter Card ========== -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@yourhandle">
    <meta name="twitter:title" content="页面标题">
    <meta name="twitter:description" content="页面描述">
    <meta name="twitter:image" content="https://example.com/twitter-image.jpg">
    
    <!-- ========== Favicon ========== -->
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">
    <meta name="theme-color" content="#4285f4">
    
    <!-- ========== 预连接 ========== -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- ========== 预加载 ========== -->
    <link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/css/critical.css" as="style">
    
    <!-- ========== 样式表 ========== -->
    <link rel="stylesheet" href="/css/critical.css">
    <link rel="stylesheet" href="/css/main.css" media="print" onload="this.media='all'">
    
    <!-- ========== 脚本 ========== -->
    <script src="/js/critical.js"></script>
    <script src="/js/analytics.js" async></script>
    <script src="/js/app.js" defer></script>
    
    <!-- ========== 结构化数据 ========== -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "文章标题",
        "datePublished": "2024-01-15"
    }
    </script>
</head>
<body>
    <!-- 页面内容 -->
</body>
</html>
```

---

## 小结

| 标签 | 用途 | 关键属性 |
|------|------|----------|
| `<meta>` | 元数据 | charset, name, content, property |
| `<link>` | 外部资源 | rel, href, type, sizes, media |
| `<script>` | 脚本 | src, async, defer, type, crossorigin |
| `<style>` | 内部样式 | type, media |
| `<title>` | 页面标题 | - |
| `<base>` | 基础 URL | href, target |

| 最佳实践 | 说明 |
|----------|------|
| charset 放最前 | 确保正确解析 |
| viewport 必设 | 移动端适配 |
| 使用 canonical | 避免 SEO 问题 |
| 预加载关键资源 | 提升性能 |
| 合理使用 async/defer | 不阻塞渲染 |

---

## 参考资源

- [MDN head 元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/head)
- [HTML meta 标签指南](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta)
- [Open Graph 协议](https://ogp.me/)
- [资源预加载](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Link_types)

---

[返回上级目录](../README.md)
