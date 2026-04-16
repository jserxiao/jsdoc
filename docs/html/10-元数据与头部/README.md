# 十、元数据与头部

## meta 标签

```html
<!-- 字符编码 -->
<meta charset="UTF-8">

<!-- 视口设置 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- SEO -->
<meta name="description" content="页面描述">
<meta name="keywords" content="关键词1, 关键词2">
<meta name="author" content="作者">

<!-- Open Graph -->
<meta property="og:title" content="标题">
<meta property="og:description" content="描述">
<meta property="og:image" content="图片URL">

<!-- 缓存控制 -->
<meta http-equiv="Cache-Control" content="no-cache">
```

---

## link 标签

```html
<!-- 样式表 -->
<link rel="stylesheet" href="style.css">

<!-- 图标 -->
<link rel="icon" href="favicon.ico">

<!-- 预加载 -->
<link rel="preload" href="font.woff2" as="font" crossorigin>

<!-- 预连接 -->
<link rel="preconnect" href="https://fonts.googleapis.com">
```

---

## script 标签

```html
<!-- 普通 -->
<script src="script.js"></script>

<!-- 异步加载 -->
<script src="script.js" async></script>

<!-- 延迟执行 -->
<script src="script.js" defer></script>

<!-- 模块 -->
<script type="module" src="module.js"></script>
```

---

[返回上级目录](../README.md)
