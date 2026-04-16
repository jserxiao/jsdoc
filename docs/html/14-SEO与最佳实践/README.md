# 十四、SEO 与最佳实践

## SEO 基础

```html
<!-- 标题标签 -->
<title>页面标题 | 网站名</title>

<!-- meta 描述 -->
<meta name="description" content="页面描述，150字以内">

<!-- 语义化标签 -->
<header>头部</header>
<nav>导航</nav>
<main>主内容</main>
<article>文章</article>
<footer>页脚</footer>

<!-- 结构化数据 -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "文章标题",
    "author": "作者名",
    "datePublished": "2024-01-01"
}
</script>
```

---

## 性能优化

```html
<!-- 预加载关键资源 -->
<link rel="preload" href="critical.css" as="style">
<link rel="preload" href="font.woff2" as="font" crossorigin>

<!-- 图片懒加载 -->
<img src="image.jpg" loading="lazy" alt="描述">

<!-- 异步脚本 -->
<script src="analytics.js" async></script>

<!-- 延迟非关键CSS -->
<link rel="preload" href="non-critical.css" as="style" onload="this.rel='stylesheet'">
```

---

## 安全性

```html
<!-- CSP -->
<meta http-equiv="Content-Security-Policy" content="default-src 'self'">

<!-- 安全的 iframe -->
<iframe 
    src="https://example.com" 
    sandbox="allow-scripts allow-same-origin"
></iframe>

<!-- 安全的外部链接 -->
<a href="https://external.com" rel="noopener noreferrer">外部链接</a>
```

---

[返回上级目录](../README.md)
