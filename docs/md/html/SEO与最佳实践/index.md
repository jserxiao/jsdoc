# SEO 与最佳实践

> SEO（搜索引擎优化）是提升网站在搜索引擎中排名的技术集合。良好的 HTML 结构和最佳实践是 SEO 的基础。内容参考《HTML5 权威指南》等经典著作。

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

### 1.2 爬虫工作原理

```
爬虫发现 URL 的方式：
1. 已知的 URL 数据库
2. 站点地图（sitemap.xml）
3. 外部链接
4. 内部链接
5. 用户提交（Search Console）

爬虫行为特点：
- 遵循 robots.txt 规则
- 有爬取频率限制（crawl budget）
- 优先爬取重要页面
- 会被慢速页面影响爬取效率
```

### 1.3 影响 SEO 的关键因素

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

#### 标题层级大纲示例

```html
<!-- 文章结构大纲 -->
<article>
    <h1>JavaScript 异步编程完整指南</h1>          <!-- 主标题 -->
    
    <section>
        <h2>什么是异步编程</h2>                    <!-- 1. -->
        <h3>同步 vs 异步</h3>                     <!-- 1.1 -->
        <h3>为什么需要异步</h3>                    <!-- 1.2 -->
    </section>
    
    <section>
        <h2>回调函数</h2>                          <!-- 2. -->
        <h3>回调函数基础</h3>                     <!-- 2.1 -->
        <h3>回调地狱问题</h3>                     <!-- 2.2 -->
    </section>
    
    <section>
        <h2>Promise</h2>                           <!-- 3. -->
        <h3>Promise 基础</h3>                     <!-- 3.1 -->
        <h3>Promise 链式调用</h3>                  <!-- 3.2 -->
        <h3>Promise.all 与 Promise.race</h3>       <!-- 3.3 -->
        <h4>Promise.all 详解</h4>                 <!-- 3.3.1 -->
        <h4>Promise.race 详解</h4>                <!-- 3.3.2 -->
    </section>
    
    <section>
        <h2>async/await</h2>                       <!-- 4. -->
        <h3>基本语法</h3>                         <!-- 4.1 -->
        <h3>错误处理</h3>                         <!-- 4.2 -->
        <h3>并行执行</h3>                         <!-- 4.3 -->
    </section>
</article>
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

#### 语义化标签使用场景

```html
<!-- 首页结构 -->
<body>
    <header>
        <!-- Logo、搜索框、主导航 -->
        <a href="/" rel="home">
            <img src="logo.svg" alt="网站名称">
        </a>
        <nav aria-label="主导航">
            <ul>
                <li><a href="/products">产品</a></li>
                <li><a href="/services">服务</a></li>
                <li><a href="/about">关于我们</a></li>
                <li><a href="/contact">联系方式</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <!-- Hero 区域 -->
        <section class="hero">
            <h1>网站核心价值主张</h1>
            <p>副标题说明</p>
            <a href="/get-started" class="cta">立即开始</a>
        </section>
        
        <!-- 特色区域 -->
        <section class="features">
            <h2>核心特色</h2>
            <article class="feature">
                <h3>特色一</h3>
                <p>特色描述...</p>
            </article>
            <article class="feature">
                <h3>特色二</h3>
                <p>特色描述...</p>
            </article>
        </section>
        
        <!-- 推荐内容 -->
        <section class="recommendations">
            <h2>推荐阅读</h2>
            <article>
                <h3>文章标题</h3>
                <p>文章摘要...</p>
                <a href="/article/1">阅读更多</a>
            </article>
        </section>
    </main>
    
    <aside>
        <!-- 侧边栏：订阅、广告、热门文章 -->
        <section>
            <h2>订阅更新</h2>
            <form>...</form>
        </section>
        <section>
            <h2>热门文章</h2>
            <ul>...</ul>
        </section>
    </aside>
    
    <footer>
        <nav aria-label="页脚导航">
            <ul>
                <li><a href="/privacy">隐私政策</a></li>
                <li><a href="/terms">服务条款</a></li>
            </ul>
        </nav>
        <p>&copy; 2024 网站名称</p>
    </footer>
</body>

<!-- 文章页面结构 -->
<body>
    <header>...</header>
    
    <main>
        <article itemscope itemtype="https://schema.org/Article">
            <header>
                <h1 itemprop="headline">文章标题</h1>
                <p>
                    <time itemprop="datePublished" datetime="2024-01-15">2024年1月15日</time>
                    由 <span itemprop="author">张三</span> 发布
                </p>
            </header>
            
            <section>
                <h2>第一节</h2>
                <p itemprop="articleBody">内容...</p>
            </section>
            
            <footer>
                <p>标签：<a href="/tag/js" rel="tag">JavaScript</a></p>
            </footer>
        </article>
        
        <aside>
            <h2>相关文章</h2>
            <ul>
                <li><a href="/article/2">相关文章1</a></li>
                <li><a href="/article/3">相关文章2</a></li>
            </ul>
        </aside>
    </main>
    
    <footer>...</footer>
</body>
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
```

#### robots 指令详解

```html
<!-- robots 指令 -->
<meta name="robots" content="index, follow">        <!-- 索引并跟踪链接（默认） -->
<meta name="robots" content="noindex, nofollow">   <!-- 不索引、不跟踪 -->
<meta name="robots" content="noindex, follow">     <!-- 不索引但跟踪链接 -->
<meta name="robots" content="index, nofollow">     <!-- 索引但不跟踪链接 -->
<meta name="robots" content="noarchive">           <!-- 不显示快照 -->
<meta name="robots" content="nosnippet">           <!-- 不显示摘要 -->
<meta name="robots" content="noimageindex">        <!-- 不索引图片 -->
<meta name="robots" content="notranslate">         <!-- 不提供翻译 -->

<!-- 针对特定搜索引擎 -->
<meta name="googlebot" content="noindex">
<meta name="baiduspider" content="noindex">
<meta name="bingbot" content="noindex">

<!-- 组合使用 -->
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">

<!-- 指令说明 -->
<!--
index / noindex: 是否索引页面
follow / nofollow: 是否跟踪页面上的链接
archive / noarchive: 是否保存快照
snippet / nosnippet: 是否显示摘要
-->
```

#### 视口设置详解

```html
<!-- 基础视口设置 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- 完整参数 -->
<meta name="viewport" content="
    width=device-width,      /* 宽度等于设备宽度 */
    initial-scale=1.0,       /* 初始缩放比例 */
    maximum-scale=5.0,       /* 最大缩放比例（允许用户缩放） */
    minimum-scale=1.0,       /* 最小缩放比例 */
    user-scalable=yes,       /* 允许用户缩放 */
    viewport-fit=cover       /* 适配刘海屏 */
">

<!-- ⚠️ 避免禁止缩放（影响可访问性） -->
<!-- ❌ 不推荐 -->
<meta name="viewport" content="user-scalable=no">
<meta name="viewport" content="maximum-scale=1.0">
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
```

#### 不同内容类型的 OG 标签

```html
<!-- 文章类型 -->
<meta property="og:type" content="article">
<meta property="article:published_time" content="2024-01-15T08:00:00+08:00">
<meta property="article:modified_time" content="2024-01-16T10:30:00+08:00">
<meta property="article:author" content="张三">
<meta property="article:section" content="技术">
<meta property="article:tag" content="前端开发">
<meta property="article:tag" content="JavaScript">

<!-- 产品类型 -->
<meta property="og:type" content="product">
<meta property="product:price:amount" content="99.00">
<meta property="product:price:currency" content="CNY">
<meta property="product:availability" content="in stock">
<meta property="product:condition" content="new">
<meta property="product:brand" content="品牌名">

<!-- 视频类型 -->
<meta property="og:type" content="video.other">
<meta property="og:video" content="https://example.com/video.mp4">
<meta property="og:video:type" content="video/mp4">
<meta property="og:video:width" content="1280">
<meta property="og:video:height" content="720">
<meta property="video:duration" content="1800">

<!-- 网站首页 -->
<meta property="og:type" content="website">
<meta property="og:title" content="网站名称 - 副标题">
<meta property="og:description" content="网站整体描述">
```

#### OG 图片最佳实践

```html
<!-- 推荐图片尺寸 -->
<!-- 通用分享：1200 x 630 (1.91:1) -->
<!-- Facebook：1200 x 628 -->
<!-- Twitter 大图：1200 x 600 -->
<!-- LinkedIn：1200 x 627 -->

<!-- 多尺寸图片 -->
<meta property="og:image" content="https://example.com/image-1200x630.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="图片描述">

<!-- 备用图片 -->
<meta property="og:image" content="https://example.com/image-square.jpg">
<meta property="og:image:width" content="800">
<meta property="og:image:height" content="800">
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
<meta name="twitter:image:alt" content="图片描述">
```

#### Twitter 卡片类型

```html
<!-- 摘要卡片（小图） -->
<meta name="twitter:card" content="summary">
<!-- 图片尺寸：最小 144x144，推荐 300x157 -->

<!-- 大图摘要卡片 -->
<meta name="twitter:card" content="summary_large_image">
<!-- 图片尺寸：最小 300x157，推荐 1200x600 -->

<!-- 播放器卡片 -->
<meta name="twitter:card" content="player">
<meta name="twitter:player" content="https://example.com/player">
<meta name="twitter:player:width" content="1280">
<meta name="twitter:player:height" content="720">

<!-- 应用卡片 -->
<meta name="twitter:card" content="app">
<meta name="twitter:app:id:iphone" content="123456789">
<meta name="twitter:app:id:ipad" content="123456789">
<meta name="twitter:app:id:googleplay" content="com.example.app">
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
```

#### 常用结构化数据类型

```html
<!-- 产品 -->
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
        "priceValidUntil": "2024-12-31",
        "availability": "https://schema.org/InStock",
        "seller": {
            "@type": "Organization",
            "name": "官方店铺"
        }
    },
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.5",
        "reviewCount": "128"
    },
    "review": [{
        "@type": "Review",
        "author": {
            "@type": "Person",
            "name": "用户A"
        },
        "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
        },
        "reviewBody": "非常好用的产品！"
    }]
}
</script>

<!-- 本地商家 -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "咖啡店",
    "image": "https://example.com/cafe.jpg",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "中关村大街1号",
        "addressLocality": "北京市",
        "addressRegion": "海淀区",
        "postalCode": "100080",
        "addressCountry": "CN"
    },
    "geo": {
        "@type": "GeoCoordinates",
        "latitude": 39.98,
        "longitude": 116.31
    },
    "url": "https://example.com/cafe",
    "telephone": "+86-10-12345678",
    "openingHoursSpecification": [{
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "22:00"
    }, {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday", "Sunday"],
        "opens": "10:00",
        "closes": "23:00"
    }]
}
</script>

<!-- 面包屑导航 -->
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
        "name": "前端开发指南"
    }]
}
</script>

<!-- FAQ 页面 -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
        "@type": "Question",
        "name": "什么是前端开发？",
        "acceptedAnswer": {
            "@type": "Answer",
            "text": "前端开发是创建网页用户界面的过程，主要涉及 HTML、CSS、JavaScript 等技术。"
        }
    }, {
        "@type": "Question",
        "name": "如何学习前端开发？",
        "acceptedAnswer": {
            "@type": "Answer",
            "text": "建议从 HTML、CSS 基础开始学习，然后掌握 JavaScript，最后学习框架和工程化工具。"
        }
    }]
}
</script>

<!-- HowTo 步骤指南 -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "如何部署网站",
    "step": [{
        "@type": "HowToStep",
        "name": "准备代码",
        "text": "确保代码已提交到 Git 仓库",
        "image": "https://example.com/step1.jpg"
    }, {
        "@type": "HowToStep",
        "name": "配置服务器",
        "text": "设置服务器环境和域名",
        "image": "https://example.com/step2.jpg"
    }, {
        "@type": "HowToStep",
        "name": "部署上线",
        "text": "将代码部署到服务器",
        "image": "https://example.com/step3.jpg"
    }],
    "totalTime": "PT30M"
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
    alt="前端开发教程封面图，展示HTML、CSS和JavaScript三大核心技术"
    width="800"
    height="450"
    loading="lazy"
    decoding="async"
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
```

#### alt 文本编写指南

```html
<!-- ✅ 好的 alt 文本 -->
<img alt="前端开发教程封面图，展示HTML、CSS和JavaScript三大核心技术">
<img alt="2024年第一季度销售增长趋势图表，同比增长15%">
<img alt="红色提交按钮，点击提交表单">

<!-- ❌ 差的 alt 文本 -->
<img alt="图片">                           <!-- 无意义 -->
<img alt="img001.jpg">                     <!-- 文件名 -->
<img alt="图片图片图片图片图片">            <!-- 关键词堆砌 -->
<img alt="">                               <!-- 空值（装饰性图片除外） -->

<!-- 装饰性图片（空 alt） -->
<img alt="" src="decorative-pattern.png">  <!-- 纯装饰，不传递信息 -->

<!-- 复杂图片使用 longdesc 或 aria-describedby -->
<img 
    src="complex-chart.png" 
    alt="2024年销售数据分析图表"
    aria-describedby="chart-description"
>
<p id="chart-description" class="sr-only">
    详细描述：图表显示2024年第一季度销售额为150万元...
</p>
```

#### 图片性能优化

```html
<!-- 现代图片格式 -->
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
    alt="响应式图片"
    width="800"
    height="450"
>

<!-- 预加载重要图片 -->
<link rel="preload" as="image" href="hero.webp">

<!-- 图片解码 -->
<img decoding="async" src="image.jpg" alt="异步解码">
<img decoding="sync" src="important.jpg" alt="同步解码">
<img decoding="auto" src="image.jpg" alt="自动选择">

<!-- fetchpriority -->
<img fetchpriority="high" src="hero.jpg" alt="高优先级">
<img fetchpriority="low" src="below-fold.jpg" alt="低优先级">
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
```

#### 视频结构化数据

```html
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "前端开发入门教程",
    "description": "从零开始学习前端开发，涵盖 HTML、CSS、JavaScript 基础知识",
    "thumbnailUrl": ["https://example.com/thumbnail.jpg"],
    "uploadDate": "2024-01-15T08:00:00+08:00",
    "duration": "PT30M15S",
    "contentUrl": "https://example.com/video.mp4",
    "embedUrl": "https://example.com/embed/video",
    "interactionStatistic": {
        "@type": "InteractionCounter",
        "interactionType": {
            "@type": "WatchAction"
        },
        "userInteractionCount": 12345
    }
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
```

#### 锚文本优化

```html
<!-- ✅ 好的锚文本 -->
<a href="/html-tutorial">HTML 完整教程</a>
<a href="/css-flexbox">CSS Flexbox 布局详解</a>
<a href="/js-async">JavaScript 异步编程指南</a>

<!-- ❌ 差的锚文本 -->
<a href="/html-tutorial">点击这里</a>
<a href="/html-tutorial">了解更多</a>
<a href="/html-tutorial">链接</a>
```

#### 链接关系

```html
<!-- rel 属性详解 -->
<a href="/about" rel="author">关于作者</a>           <!-- 作者页面 -->
<a href="/license" rel="license">许可证</a>           <!-- 许可证页面 -->
<a href="/next-article" rel="next">下一页</a>         <!-- 分页：下一页 -->
<a href="/prev-article" rel="prev">上一页</a>         <!-- 分页：上一页 -->
<a href="/print" rel="alternate" media="print">打印版</a>
<a href="https://other-site.com" rel="external">外部链接</a>

<!-- 外部链接安全 -->
<a href="https://external.com" target="_blank" rel="noopener noreferrer nofollow">
    外部链接
</a>

<!-- nofollow：不传递权重 -->
<a href="/privacy" rel="nofollow">隐私政策</a>        <!-- 不重要的页面 -->
<a href="https://ads.com" rel="nofollow sponsored">广告链接</a>

<!-- sponsored：赞助链接 -->
<a href="https://sponsor.com" rel="sponsored">赞助内容</a>

<!-- ugc：用户生成内容 -->
<a href="/user-post/123" rel="ugc">用户评论中的链接</a>
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
            <image:caption>封面图描述</image:caption>
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
Disallow: /tmp/
Disallow: /*.json$
Disallow: /*?sort=

# 特定爬虫规则
User-agent: Googlebot
Allow: /
Disallow: /private/

User-agent: Baiduspider
Allow: /
Disallow: /private/

# 站点地图位置
Sitemap: https://example.com/sitemap.xml
Sitemap: https://example.com/sitemap-news.xml
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
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="dns-prefetch" href="https://analytics.google.com">

<!-- 预获取未来可能需要的资源 -->
<link rel="prefetch" href="next-page.html">
<link rel="prefetch" href="future-resource.js" as="script">

<!-- 预渲染下一页（谨慎使用） -->
<link rel="prerender" href="next-page.html">
```

#### 脚本加载策略

```html
<!-- 阻塞加载（仅关键脚本） -->
<script src="critical.js"></script>

<!-- 异步加载（不阻塞，顺序不保证） -->
<script src="analytics.js" async></script>

<!-- 延迟执行（不阻塞，按顺序执行） -->
<script src="non-critical.js" defer></script>

<!-- ES 模块 -->
<script type="module" src="app.js"></script>
<script nomodule src="app-legacy.js"></script>

<!-- 内联关键 CSS -->
<style>
    /* 首屏关键样式 */
    body { margin: 0; font-family: sans-serif; }
    .header { background: #fff; }
</style>

<!-- 异步加载非关键 CSS -->
<link rel="preload" href="non-critical.css" as="style" onload="this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="non-critical.css"></noscript>
```

### 6.2 核心 Web 指标优化

```html
<!-- LCP (Largest Contentful Paint) 优化 -->
<!-- 目标：< 2.5s -->

<!-- 预加载首屏大图 -->
<link rel="preload" as="image" href="hero.webp">

<!-- 内联关键 CSS -->
<style>/* 关键样式 */</style>

<!-- 异步加载字体 -->
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>
<style>
    @font-face {
        font-family: 'CustomFont';
        src: url('font.woff2') format('woff2');
        font-display: swap;  /* 避免字体加载延迟 */
    }
</style>
```

```html
<!-- CLS (Cumulative Layout Shift) 优化 -->
<!-- 目标：< 0.1 -->

<!-- 为图片预留空间 -->
<img 
    src="image.jpg" 
    alt="描述"
    width="800" 
    height="450"
>

<!-- 使用 aspect-ratio -->
<style>
    .image-container {
        aspect-ratio: 16/9;
        background: #f0f0f0;
    }
    .image-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
</style>

<!-- 字体加载占位 -->
<style>
    .text {
        font-family: 'CustomFont', system-ui, sans-serif;
    }
    /* 或使用 font-display: optional 避免布局偏移 */
</style>

<!-- 动画使用 transform -->
<style>
    /* ✅ 使用 transform（不影响布局） */
    .animate {
        transform: translateX(0);
        transition: transform 0.3s;
    }
    .animate:hover {
        transform: translateX(10px);
    }
    
    /* ❌ 避免改变布局属性 */
    .bad-animate {
        left: 0;
        transition: left 0.3s;
    }
    .bad-animate:hover {
        left: 10px;  /* 触发重排 */
    }
</style>
```

```html
<!-- FID (First Input Delay) / INP 优化 -->
<!-- 目标：< 100ms (FID), < 200ms (INP) -->

<!-- 减少主线程阻塞 -->
<script defer src="non-critical.js"></script>

<!-- 分解长任务 -->
<script>
    // 使用 requestIdleCallback 处理非关键任务
    requestIdleCallback(() => {
        // 非关键代码
    });
    
    // 分批处理大数据
    function processInBatches(items, batchSize = 100) {
        let i = 0;
        function processBatch() {
            const batch = items.slice(i, i + batchSize);
            batch.forEach(item => processItem(item));
            i += batchSize;
            if (i < items.length) {
                requestIdleCallback(processBatch);
            }
        }
        requestIdleCallback(processBatch);
    }
</script>

<!-- Web Worker 处理复杂计算 -->
<script>
    const worker = new Worker('compute.js');
    worker.postMessage({ data: largeDataSet });
    worker.onmessage = (e) => {
        // 处理结果
    };
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
    report-to csp-endpoint;
">

<!-- 报告端点 -->
<meta http-equiv="Reporting-Endpoints" content='csp-endpoint="https://example.com/csp-reports"'>
```

#### CSP 指令详解

```html
<!-- 常用指令 -->
<!--
default-src: 默认资源策略
script-src: JavaScript 资源
style-src: CSS 资源
img-src: 图片资源
font-src: 字体资源
connect-src: AJAX、WebSocket 连接
frame-src: iframe 嵌入
object-src: 插件资源（建议设为 'none'）
media-src: 音视频资源
manifest-src: Web App Manifest
worker-src: Web Worker
child-src: 子框架和 Worker

特殊值：
'self': 同源
'none': 禁止
'unsafe-inline': 允许内联（降低安全性）
'unsafe-eval': 允许 eval（降低安全性）
'nonce-xxx': 使用 nonce
'sha256-xxx': 使用哈希
data:: 允许 data URI
https:: 允许 HTTPS 资源
-->
```

### 7.2 安全链接

```html
<!-- 外部链接安全 -->
<a href="https://external.com" target="_blank" rel="noopener noreferrer">
    外部链接
</a>

<!-- rel 属性说明 -->
<!-- 
noopener: 防止新页面访问 window.opener
noreferrer: 不发送 Referer 头
nofollow: 不传递 SEO 权重
sponsored: 赞助链接
ugc: 用户生成内容
-->

<!-- 安全的 iframe -->
<iframe 
    src="https://example.com/embed"
    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
>
</iframe>

<!-- sandbox 属性说明 -->
<!--
allow-scripts: 允许脚本
allow-same-origin: 允许同源
allow-forms: 允许表单
allow-popups: 允许弹窗
allow-popups-to-escape-sandbox: 允许弹窗脱离沙箱
allow-top-navigation: 允许导航顶级窗口
allow-downloads: 允许下载
-->
```

### 7.3 其他安全头部

```html
<!-- Referrer Policy -->
<meta name="referrer" content="strict-origin-when-cross-origin">

<!-- 可选值 -->
<!--
no-referrer: 不发送 Referer
no-referrer-when-downgrade: 降级时不发送
origin: 只发送源
origin-when-cross-origin: 跨域时只发送源
same-origin: 同源时发送完整 URL
strict-origin: 只发送源，降级时不发送
strict-origin-when-cross-origin: 默认值
unsafe-url: 始终发送完整 URL
-->

<!-- Permissions Policy（功能权限） -->
<meta http-equiv="Permissions-Policy" content="
    geolocation=(self 'https://example.com'),
    camera=(),
    microphone=(),
    payment=(),
    usb=(),
    magnetometer=(),
    gyroscope=(),
    accelerometer=()
">

<!-- X-Content-Type-Options（服务器设置） -->
<!-- X-Content-Type-Options: nosniff -->

<!-- Strict-Transport-Security（服务器设置） -->
<!-- Strict-Transport-Security: max-age=31536000; includeSubDomains; preload -->
```

---

## 8. 国际化 SEO

### 8.1 多语言页面标记

```html
<!-- 语言标记 -->
<html lang="zh-CN">

<!-- 页面内语言切换 -->
<p lang="en">This is English text.</p>

<!-- 交替语言版本 -->
<link rel="alternate" hreflang="zh-CN" href="https://example.com/zh/article">
<link rel="alternate" hreflang="en" href="https://example.com/en/article">
<link rel="alternate" hreflang="ja" href="https://example.com/ja/article">
<link rel="alternate" hreflang="x-default" href="https://example.com/article">

<!-- hreflang 代码 -->
<!--
zh-CN: 简体中文（中国大陆）
zh-TW: 繁体中文（台湾）
zh-HK: 繁体中文（香港）
en: 英语
en-US: 美式英语
en-GB: 英式英语
ja: 日语
ko: 韩语
x-default: 默认语言版本
-->
```

### 8.2 多区域网站结构

```html
<!-- 方案一：子目录 -->
<!-- https://example.com/zh/ -->
<!-- https://example.com/en/ -->
<!-- https://example.com/ja/ -->

<!-- 方案二：子域名 -->
<!-- https://cn.example.com/ -->
<!-- https://en.example.com/ -->
<!-- https://jp.example.com/ -->

<!-- 方案三：独立域名 -->
<!-- https://example.cn/ -->
<!-- https://example.com/ -->
<!-- https://example.jp/ -->

<!-- 每个页面的头部都需要标记 -->
<head>
    <link rel="canonical" href="https://example.com/zh/article">
    <link rel="alternate" hreflang="zh-CN" href="https://example.com/zh/article">
    <link rel="alternate" hreflang="en" href="https://example.com/en/article">
    <link rel="alternate" hreflang="x-default" href="https://example.com/article">
</head>
```

---

## 9. 移动端 SEO

### 9.1 移动端优化

```html
<!-- 移动端必需设置 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">

<!-- 移动端友好测试 -->
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="应用名称">

<!-- 主题色 -->
<meta name="theme-color" content="#4285f4">
<meta name="msapplication-navbutton-color" content="#4285f4">
<meta name="msapplication-TileColor" content="#4285f4">

<!-- iOS 图标 -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="apple-touch-icon-precomposed" href="/apple-touch-icon-precomposed.png">

<!-- PWA 相关 -->
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#4285f4">
```

#### PWA Manifest

```json
{
    "name": "我的应用完整名称",
    "short_name": "应用",
    "description": "应用描述",
    "start_url": "/?source=pwa",
    "display": "standalone",
    "orientation": "portrait-primary",
    "background_color": "#ffffff",
    "theme_color": "#4285f4",
    "scope": "/",
    "lang": "zh-CN",
    "categories": ["education", "productivity"],
    "icons": [
        {
            "src": "/icon-72.png",
            "sizes": "72x72",
            "type": "image/png",
            "purpose": "any"
        },
        {
            "src": "/icon-192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any maskable"
        },
        {
            "src": "/icon-512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ],
    "screenshots": [
        {
            "src": "/screenshot1.png",
            "sizes": "1280x720",
            "type": "image/png",
            "form_factor": "wide"
        },
        {
            "src": "/screenshot2.png",
            "sizes": "750x1334",
            "type": "image/png",
            "form_factor": "narrow"
        }
    ]
}
```

### 9.2 移动端性能优化

```html
<!-- 移动端特定优化 -->

<!-- 减少重定向 -->
<!-- ❌ 避免：example.com → m.example.com → m.example.com/page -->

<!-- 使用 App Links -->
<meta property="al:ios:url" content="myapp://article/123">
<meta property="al:ios:app_store_id" content="123456789">
<meta property="al:ios:app_name" content="My App">
<meta property="al:android:url" content="myapp://article/123">
<meta property="al:android:package" content="com.example.app">
<meta property="al:android:app_name" content="My App">

<!-- 减少移动端资源 -->
<picture>
    <source media="(max-width: 600px)" srcset="small.webp">
    <source media="(max-width: 1200px)" srcset="medium.webp">
    <img src="large.jpg" alt="响应式图片">
</picture>
```

---

## 10. SEO 审计清单

### 10.1 技术检查清单

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

### 10.2 内容检查清单

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

### 10.3 性能检查清单

| 检查项 | 目标值 |
|--------|--------|
| LCP (最大内容绘制) | < 2.5s |
| FID (首次输入延迟) | < 100ms |
| CLS (累积布局偏移) | < 0.1 |
| TTFB (首字节时间) | < 600ms |
| FCP (首次内容绘制) | < 1.8s |
| TTI (可交互时间) | < 3.8s |

---

## 小结

### SEO 要素速查

| SEO 要素 | 最佳实践 |
|----------|----------|
| 标题标签 | 50-60字符，关键词靠前 |
| Meta 描述 | 150-160字符，吸引点击 |
| 语义化 HTML | 使用正确的标签结构 |
| 图片优化 | 有 alt，指定尺寸，懒加载 |
| 性能 | 优化 Core Web Vitals |
| 安全 | HTTPS，CSP，安全链接 |
| 结构化数据 | 使用 Schema.org |

### 常见错误与解决方案

| 常见错误 | 解决方案 |
|----------|----------|
| 重复内容 | 使用 canonical |
| 404 错误 | 自定义 404 页面 |
| 慢速页面 | 优化资源加载 |
| 缺少 alt | 为所有图片添加描述 |
| 多个 h1 | 每页只用一个 h1 |
| 跳过标题层级 | 按顺序使用 h1-h6 |
| 无意义锚文本 | 使用描述性链接文本 |

### 核心 Web 指标优化要点

| 指标 | 优化方法 |
|------|----------|
| LCP | 预加载关键资源、优化服务器响应、CDN |
| CLS | 图片预留空间、字体优化、避免插入内容 |
| INP | 减少 JavaScript 阻塞、分解长任务、使用 Web Worker |

---

## 参考资源

### 官方文档

- [Google SEO 指南](https://developers.google.com/search/docs)
- [MDN SEO 基础](https://developer.mozilla.org/zh-CN/docs/Glossary/SEO)
- [Schema.org](https://schema.org/)
- [Web.dev 性能优化](https://web.dev/performance/)

### 工具

- [Google Search Console](https://search.google.com/search-console)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Screaming Frog SEO Spider](https://www.screamingfrog.co.uk/seo-spider/)

---

[返回上级目录](../index.md)
