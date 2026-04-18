# SEO 与最佳实践

> SEO（搜索引擎优化）是提升网站在搜索引擎中排名的技术集合。良好的 HTML 结构和最佳实践是 SEO 的基础。

## 学习要点

- 🔍 理解搜索引擎工作原理
- 📝 掌握 SEO 相关的 HTML 标签
- 🎯 学会语义化 HTML 优化策略
- ⚡ 了解性能优化与安全性最佳实践

---

## 1. 搜索引擎工作原理

### 1.1 搜索引擎三大核心流程

```
搜索引擎工作流程
├── 爬取（Crawling）
│   └── 搜索引擎爬虫发现并抓取网页
├── 索引（Indexing）
│   └── 分析、存储网页内容到数据库
└── 排名（Ranking）
    └── 根据算法决定搜索结果顺序
```

### 1.2 影响 SEO 的关键因素

| 因素类别 | 具体内容 | 重要性 |
|----------|----------|--------|
| **技术因素** | 页面速度、移动友好、HTTPS、站点结构 | ⭐⭐⭐⭐⭐ |
| **内容因素** | 内容质量、关键词、原创性、更新频率 | ⭐⭐⭐⭐⭐ |
| **结构因素** | 标题层级、语义化 HTML、内部链接 | ⭐⭐⭐⭐ |
| **用户体验** | 跳出率、停留时间、点击率 | ⭐⭐⭐⭐ |
| **外部因素** | 反向链接、社交信号、品牌提及 | ⭐⭐⭐ |

---

## 2. HTML 语义化与 SEO

### 2.1 文档结构优化

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- 页面标题：50-60 字符，关键词靠前 -->
    <title>前端开发教程 - HTML/CSS/JavaScript 完整指南 | 技术博客</title>
    
    <!-- 描述：150-160 字符，包含关键词 -->
    <meta name="description" content="全面的前端开发教程，涵盖 HTML、CSS、JavaScript 核心知识点，适合初学者和进阶开发者学习。">
    
    <!-- 关键词（现代搜索引擎已不太重视） -->
    <meta name="keywords" content="前端开发, HTML教程, CSS教程, JavaScript">
    
    <!-- 作者信息 -->
    <meta name="author" content="张三">
    
    <!-- robots 指令 -->
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
    
    <!-- 规范链接（避免重复内容） -->
    <link rel="canonical" href="https://example.com/frontend-tutorial">
    
    <!-- 交替语言版本 -->
    <link rel="alternate" hreflang="en" href="https://example.com/en/frontend-tutorial">
    <link rel="alternate" hreflang="zh-CN" href="https://example.com/frontend-tutorial">
</head>
<body>
    <!-- 语义化结构 -->
    <header>
        <nav aria-label="主导航">
            <ul>
                <li><a href="/">首页</a></li>
                <li><a href="/tutorials">教程</a></li>
                <li><a href="/blog">博客</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <article>
            <header>
                <h1>前端开发完整指南</h1>
                <p>
                    <time datetime="2024-01-15">2024年1月15日</time>
                    由 <span rel="author">张三</span> 发布
                </p>
            </header>

            <section>
                <h2>什么是前端开发</h2>
                <p>前端开发是创建网页用户界面的过程...</p>
            </section>

            <section>
                <h2>核心技术栈</h2>
                <h3>HTML</h3>
                <p>HTML 定义网页结构...</p>
                <h3>CSS</h3>
                <p>CSS 负责网页样式...</p>
                <h3>JavaScript</h3>
                <p>JavaScript 实现交互功能...</p>
            </section>
        </article>

        <aside>
            <h2>相关文章</h2>
            <ul>
                <li><a href="/article/1">CSS Grid 布局详解</a></li>
                <li><a href="/article/2">JavaScript 异步编程</a></li>
            </ul>
        </aside>
    </main>

    <footer>
        <p>&copy; 2024 技术博客</p>
    </footer>
</body>
</html>
```

### 2.2 标题层级规范

```html
<!-- ✅ 正确的标题层级 -->
<h1>主标题（每页唯一）</h1>
    <h2>一级子标题</h2>
        <h3>二级子标题</h3>
        <h3>另一个二级子标题</h3>
    <h2>另一个一级子标题</h2>
        <h3>二级子标题</h3>
            <h4>三级子标题</h4>

<!-- ❌ 错误示例：跳过层级 -->
<h1>主标题</h1>
    <h3>跳过了 h2</h3>  <!-- 错误！ -->

<!-- ❌ 错误示例：多个 h1 -->
<h1>标题一</h1>
<h1>标题二</h1>  <!-- 错误！每页应该只有一个 h1 -->

<!-- ❌ 错误示例：仅用于样式 -->
<h1 style="font-size: 14px">这不是标题，只是为了大字体</h1>  <!-- 错误！ -->
```

### 2.3 语义化标签与 SEO 权重

```html
<!-- 高权重语义区域 -->
<header>   <!-- 页头：品牌标识、主导航 -->
<nav>      <!-- 导航：内部链接结构 -->
<main>     <!-- 主内容：页面核心内容 -->
<article>  <!-- 文章：独立完整的内容单元 -->
<section>  <!-- 章节：有主题的内容分组 -->

<!-- 辅助语义区域 -->
<aside>    <!-- 侧边栏：相关但不主要的内容 -->
<footer>   <!-- 页脚：版权、联系信息 -->

<!-- 内容增强标签 -->
<figure>
    <img src="chart.png" alt="销售增长图表">
    <figcaption>图1：2024年第一季度销售数据</figcaption>
</figure>

<time datetime="2024-01-15T14:30:00+08:00">
    2024年1月15日 下午2:30
</time>

<address>
    联系方式：<a href="mailto:info@example.com">info@example.com</a>
</address>
```

---

## 3. Meta 标签详解

### 3.1 基础 Meta 标签

```html
<!-- 字符编码 -->
<meta charset="UTF-8">

<!-- 视口设置（移动端必需） -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- SEO 相关 -->
<meta name="description" content="页面描述，150-160字符">
<meta name="keywords" content="关键词1, 关键词2, 关键词3">
<meta name="author" content="作者名">

<!-- robots 指令详解 -->
<meta name="robots" content="index, follow">        <!-- 索引并跟踪链接（默认） -->
<meta name="robots" content="noindex, nofollow">   <!-- 不索引、不跟踪 -->
<meta name="robots" content="noindex, follow">     <!-- 不索引但跟踪链接 -->
<meta name="robots" content="index, nofollow">     <!-- 索引但不跟踪链接 -->
<meta name="robots" content="noarchive">           <!-- 不显示快照 -->
<meta name="robots" content="nosnippet">           <!-- 不显示摘要 -->

<!-- 针对特定搜索引擎 -->
<meta name="googlebot" content="noindex">
<meta name="baiduspider" content="noindex">

<!-- 主题色（移动浏览器地址栏颜色） -->
<meta name="theme-color" content="#4285f4">

<!-- 浏览器兼容性 -->
<meta http-equiv="X-UA-Compatible" content="IE=edge">
```

### 3.2 Open Graph 协议（社交媒体）

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

<!-- 文章类型专属标签 -->
<meta property="article:published_time" content="2024-01-15T08:00:00+08:00">
<meta property="article:modified_time" content="2024-01-16T10:30:00+08:00">
<meta property="article:author" content="张三">
<meta property="article:section" content="技术">
<meta property="article:tag" content="前端开发">
<meta property="article:tag" content="JavaScript">

<!-- 产品类型专属标签 -->
<meta property="product:price:amount" content="99.00">
<meta property="product:price:currency" content="CNY">
<meta property="product:availability" content="in stock">
```

### 3.3 Twitter Card

```html
<!-- Twitter 卡片 -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@yourtwitterhandle">
<meta name="twitter:creator" content="@authorhandle">
<meta name="twitter:title" content="文章标题">
<meta name="twitter:description" content="文章描述">
<meta name="twitter:image" content="https://example.com/image.jpg">

<!-- 卡片类型 -->
<!-- summary: 小图摘要卡片 -->
<!-- summary_large_image: 大图摘要卡片 -->
<!-- player: 视频/音频播放器卡片 -->
<!-- app: 应用下载卡片 -->
```

### 3.4 结构化数据（Schema.org）

```html
<!-- JSON-LD 格式（推荐） -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "前端开发完整指南",
    "image": [
        "https://example.com/photos/1x1/photo.jpg",
        "https://example.com/photos/4x3/photo.jpg",
        "https://example.com/photos/16x9/photo.jpg"
    ],
    "datePublished": "2024-01-15",
    "dateModified": "2024-01-16",
    "author": [{
        "@type": "Person",
        "name": "张三",
        "url": "https://example.com/author/zhangsan"
    }],
    "publisher": {
        "@type": "Organization",
        "name": "技术博客",
        "logo": {
            "@type": "ImageObject",
            "url": "https://example.com/logo.jpg"
        }
    },
    "description": "全面的前端开发教程..."
}
</script>

<!-- 产品结构化数据 -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "智能手表 Pro",
    "image": "https://example.com/watch.jpg",
    "description": "高性能智能手表",
    "brand": {
        "@type": "Brand",
        "name": "TechBrand"
    },
    "offers": {
        "@type": "Offer",
        "url": "https://example.com/watch",
        "priceCurrency": "CNY",
        "price": "999.00",
        "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.5",
        "reviewCount": "128"
    }
}
</script>

<!-- 面包屑导航结构化数据 -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
        "@type": "ListItem",
        "position": 1,
        "name": "首页",
        "item": "https://example.com"
    }, {
        "@type": "ListItem",
        "position": 2,
        "name": "教程",
        "item": "https://example.com/tutorials"
    }, {
        "@type": "ListItem",
        "position": 3,
        "name": "前端开发指南",
        "item": "https://example.com/tutorials/frontend"
    }]
}
</script>
```

---

## 4. 图片与多媒体 SEO

### 4.1 图片优化

```html
<!-- 图片 SEO 最佳实践 -->
<img 
    src="https://example.com/images/frontend-tutorial.jpg"
    alt="前端开发教程封面图，展示HTML、CSS和JavaScript三大核心技术"  <!-- 必须有描述性 alt -->
    width="800"
    height="450"          <!-- 明确尺寸，避免布局偏移 -->
    loading="lazy"        <!-- 懒加载 -->
    decoding="async"      <!-- 异步解码 -->
>

<!-- 响应式图片 -->
<picture>
    <source 
        media="(min-width: 1200px)"
        srcset="hero-desktop.webp 1x, hero-desktop@2x.webp 2x"
        type="image/webp">
    <source 
        media="(min-width: 768px)"
        srcset="hero-tablet.webp 1x, hero-tablet@2x.webp 2x"
        type="image/webp">
    <img 
        src="hero-mobile.jpg"
        srcset="hero-mobile.jpg 1x, hero-mobile@2x.jpg 2x"
        alt="响应式图片示例"
        width="375"
        height="250"
        loading="lazy">
</picture>

<!-- 图片加上结构化数据 -->
<figure itemscope itemtype="https://schema.org/ImageObject">
    <img 
        src="chart.png" 
        alt="2024年销售增长图表"
        itemprop="contentUrl">
    <figcaption itemprop="caption">图1：2024年第一季度销售数据对比</figcaption>
</figure>
```

### 4.2 视频 SEO

```html
<!-- 视频 SEO -->
<video 
    controls
    width="800"
    height="450"
    poster="video-poster.jpg"
    preload="metadata">
    <source src="video.mp4" type="video/mp4">
    <source src="video.webm" type="video/webm">
    <track kind="captions" src="captions-zh.vtt" srclang="zh" label="中文字幕">
    <track kind="subtitles" src="subtitles-en.vtt" srclang="en" label="English">
    您的浏览器不支持视频播放
</video>

<!-- 视频结构化数据 -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "前端开发入门教程",
    "description": "从零开始学习前端开发",
    "thumbnailUrl": ["https://example.com/thumbnail.jpg"],
    "uploadDate": "2024-01-15T08:00:00+08:00",
    "duration": "PT30M15S",
    "contentUrl": "https://example.com/video.mp4",
    "embedUrl": "https://example.com/embed/video"
}
</script>
```

---

## 5. 链接与导航 SEO

### 5.1 内部链接优化

```html
<!-- 面包屑导航 -->
<nav aria-label="面包屑导航">
    <ol class="breadcrumb" itemscope itemtype="https://schema.org/BreadcrumbList">
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
            <a href="/" itemprop="item">
                <span itemprop="name">首页</span>
            </a>
            <meta itemprop="position" content="1">
        </li>
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
            <a href="/tutorials" itemprop="item">
                <span itemprop="name">教程</span>
            </a>
            <meta itemprop="position" content="2">
        </li>
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
            <span itemprop="name">前端开发指南</span>
            <meta itemprop="position" content="3">
        </li>
    </ol>
</nav>

<!-- 锚文本优化 -->
<!-- ✅ 好的锚文本 -->
<a href="/html-tutorial">HTML 完整教程</a>

<!-- ❌ 差的锚文本 -->
<a href="/html-tutorial">点击这里</a>
<a href="/html-tutorial">了解更多</a>

<!-- 链接关系 -->
<a href="/about" rel="author">关于作者</a>
<a href="/privacy" rel="nofollow">隐私政策</a>
<a href="https://other-site.com" rel="noopener noreferrer nofollow">外部链接</a>

<!-- 分页处理 -->
<link rel="prev" href="/articles?page=1">
<link rel="next" href="/articles?page=3">
```

### 5.2 Sitemap 与 robots.txt

```xml
<!-- sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    <url>
        <loc>https://example.com/</loc>
        <lastmod>2024-01-15</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://example.com/article/frontend-guide</loc>
        <lastmod>2024-01-15</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
        <image:image>
            <image:loc>https://example.com/images/article.jpg</image:loc>
            <image:title>前端开发指南</image:title>
        </image:image>
    </url>
</urlset>
```

```
# robots.txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/
Disallow: /*.json$

Sitemap: https://example.com/sitemap.xml
```

---

## 6. 性能优化

### 6.1 资源加载优化

```html
<!-- 预加载关键资源 -->
<link rel="preload" href="critical.css" as="style">
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="hero-image.webp" as="image">

<!-- 预连接到外部域名 -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://analytics.google.com">

<!-- 预获取未来可能需要的资源 -->
<link rel="prefetch" href="next-page.html">

<!-- 预渲染下一页（谨慎使用） -->
<link rel="prerender" href="next-page.html">

<!-- 异步加载 CSS -->
<link rel="preload" href="non-critical.css" as="style" onload="this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="non-critical.css"></noscript>

<!-- 脚本加载策略 -->
<script src="critical.js"></script>                    <!-- 阻塞加载 -->
<script src="analytics.js" async></script>              <!-- 异步加载 -->
<script src="non-critical.js" defer></script>           <!-- 延迟执行 -->
<script type="module" src="app.js"></script>            <!-- ES 模块 -->
```

### 6.2 图片性能优化

```html
<!-- 使用现代图片格式 -->
<picture>
    <source srcset="image.avif" type="image/avif">
    <source srcset="image.webp" type="image/webp">
    <img src="image.jpg" alt="Fallback image">
</picture>

<!-- 懒加载 -->
<img loading="lazy" src="image.jpg" alt="懒加载图片">
<iframe loading="lazy" src="embed.html"></iframe>

<!-- 响应式图片尺寸 -->
<img 
    srcset="small.jpg 400w, medium.jpg 800w, large.jpg 1200w"
    sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
    src="medium.jpg"
    alt="响应式图片">
```

### 6.3 核心 Web 指标优化

```html
<!-- LCP (Largest Contentful Paint) 优化 -->
<!-- 首屏大图预加载 -->
<link rel="preload" as="image" href="hero.webp">

<!-- CLS (Cumulative Layout Shift) 优化 -->
<!-- 为图片预留空间 -->
<img 
    src="image.jpg" 
    alt="描述"
    width="800" 
    height="450"
    style="aspect-ratio: 800/450;">

<!-- 或使用 CSS aspect-ratio -->
<style>
    .image-container {
        aspect-ratio: 16/9;
        background: #f0f0f0;
    }
</style>

<!-- FID (First Input Delay) / INP 优化 -->
<!-- 减少 JavaScript 阻塞 -->
<script defer src="non-critical.js"></script>

<!-- 分解长任务 -->
<script>
    // 使用 requestIdleCallback 处理非关键任务
    requestIdleCallback(() => {
        // 非关键代码
    });
</script>
```

---

## 7. 安全性最佳实践

### 7.1 内容安全策略（CSP）

```html
<!-- CSP Meta 标签 -->
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://cdn.example.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https: blob:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://api.example.com;
    frame-src 'self' https://www.youtube.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
">

<!-- 报告模式（只报告不阻止） -->
<meta http-equiv="Content-Security-Policy-Report-Only" content="
    default-src 'self';
    report-uri /csp-report;
">
```

### 7.2 安全链接

```html
<!-- 外部链接安全 -->
<a href="https://external.com" target="_blank" rel="noopener noreferrer">
    外部链接
</a>

<!-- 安全的 iframe -->
<iframe 
    src="https://example.com/embed"
    sandbox="allow-scripts allow-same-origin allow-forms"
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade">
</iframe>

<!-- X-Frame-Options 等效（防点击劫持） -->
<!-- 在服务器设置：X-Frame-Options: DENY -->
<!-- 或使用 CSP：frame-ancestors 'none' -->
```

### 7.3 其他安全头部

```html
<!-- X-Content-Type-Options（防止 MIME 嗅探） -->
<meta http-equiv="X-Content-Type-Options" content="nosniff">

<!-- Referrer Policy -->
<meta name="referrer" content="strict-origin-when-cross-origin">

<!-- Permissions Policy（功能权限） -->
<meta http-equiv="Permissions-Policy" content="
    geolocation=(self 'https://example.com'),
    camera=(),
    microphone=(),
    payment=(),
    usb=()
">
```

---

## 8. 移动端 SEO

### 8.1 移动端优化

```html
<!-- 移动端必需设置 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">

<!-- 移动端友好测试 -->
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">

<!-- PWA 相关 -->
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#4285f4">

<!-- manifest.json -->
{
    "name": "我的应用",
    "short_name": "应用",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#4285f4",
    "icons": [
        {
            "src": "/icon-192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/icon-512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ]
}
```

### 8.2 AMP 页面（可选）

```html
<!-- AMP HTML -->
<!DOCTYPE html>
<html amp lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link rel="canonical" href="https://example.com/article.html">
    <style amp-boilerplate>
        body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;
        -moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;
        -ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;
        animation:-amp-start 8s steps(1,end) 0s 1 normal both}
        @-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}
        @-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}
        @-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}
        @-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}
        @keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}
    </style>
    <script async src="https://cdn.ampproject.org/v0.js"></script>
</head>
<body>
    <h1>AMP 页面标题</h1>
    <amp-img src="image.jpg" width="800" height="450" layout="responsive" alt="描述"></amp-img>
</body>
</html>
```

---

## 9. SEO 审计清单

### 9.1 技术检查清单

| 检查项 | 状态 | 说明 |
|--------|------|------|
| robots.txt 配置正确 | ☐ | 允许/禁止正确的页面 |
| sitemap.xml 存在 | ☐ | 包含所有重要页面 |
| 规范链接 (canonical) | ☐ | 避免重复内容 |
| HTTPS | ☐ | 全站 HTTPS |
| 移动端友好 | ☐ | 响应式设计 |
| 页面速度 | ☐ | LCP < 2.5s |
| 结构化数据 | ☐ | 无错误 |
| 404 页面 | ☐ | 自定义 404 |
| 重定向正确 | ☐ | 301 永久重定向 |
| 无爬虫陷阱 | ☐ | 避免无限循环 |

### 9.2 内容检查清单

| 检查项 | 状态 | 说明 |
|--------|------|------|
| 标题标签 | ☐ | 唯一、描述性强 |
| meta 描述 | ☐ | 每页不同、包含关键词 |
| H1 标签 | ☐ | 每页唯一一个 |
| 标题层级 | ☐ | 正确的层级顺序 |
| 图片 alt | ☐ | 所有图片有描述 |
| 链接文本 | ☐ | 有意义的锚文本 |
| 内部链接 | ☐ | 合理的链接结构 |
| 内容原创 | ☐ | 无重复内容 |
| 关键词布局 | ☐ | 自然分布 |

---

## 10. SEO 工具推荐

### 10.1 分析工具

```markdown
**官方工具**
- Google Search Console - 索引状态、搜索分析
- Google Analytics - 流量分析
- Bing Webmaster Tools - 必应搜索数据

**SEO 审计工具**
- Screaming Frog SEO Spider - 网站爬虫分析
- Ahrefs - 反向链接分析
- SEMrush - 竞争对手分析
- Moz Pro - SEO 综合工具

**性能测试**
- Google PageSpeed Insights - 页面速度评分
- Lighthouse - 综合性能审计
- WebPageTest - 详细性能分析

**结构化数据**
- Google Rich Results Test - 富媒体结果测试
- Schema Markup Validator - 结构化数据验证

**移动端测试**
- Google Mobile-Friendly Test - 移动端友好测试
- Chrome DevTools Device Mode - 移动端模拟
```

---

## 小结

| SEO 要素 | 最佳实践 |
|----------|----------|
| 标题标签 | 50-60字符，关键词靠前 |
| Meta 描述 | 150-160字符，吸引点击 |
| 语义化 HTML | 使用正确的标签结构 |
| 图片优化 | 有 alt，指定尺寸，懒加载 |
| 性能 | 优化 Core Web Vitals |
| 安全 | HTTPS，CSP，安全链接 |
| 结构化数据 | 使用 Schema.org |

| 常见错误 | 解决方案 |
|----------|----------|
| 重复内容 | 使用 canonical |
| 404 错误 | 自定义 404 页面 |
| 慢速页面 | 优化资源加载 |
| 缺少 alt | 为所有图片添加描述 |
| 多个 h1 | 每页只用一个 h1 |

---

## 参考资源

### 官方文档
- [Google SEO 指南](https://developers.google.com/search/docs)
- [MDN SEO 基础](https://developer.mozilla.org/zh-CN/docs/Glossary/SEO)
- [Schema.org](https://schema.org/)

### 工具
- [Google Search Console](https://search.google.com/search-console)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Rich Results Test](https://search.google.com/test/rich-results)

---

[返回上级目录](../README.md)
