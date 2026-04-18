# 语义化结构

> HTML 语义化是指使用恰当的 HTML 标签来标记内容，让代码更具可读性，对搜索引擎和辅助技术更友好。

## 学习要点

- 🏗️ 理解语义化的重要性和好处
- 📚 掌握 HTML5 语义化标签的正确用法
- 🎯 学会构建合理的文档结构

---

## 1. 为什么需要语义化？

### 对比：语义化 vs 非语义化

```html
<!-- ❌ 非语义化写法：全是 div -->
<div class="header">
    <div class="nav">...</div>
</div>
<div class="main">
    <div class="article">...</div>
</div>
<div class="footer">...</div>

<!-- ✅ 语义化写法：使用正确的标签 -->
<header>
    <nav>...</nav>
</header>
<main>
    <article>...</article>
</main>
<footer>...</footer>
```

### 语义化的好处

| 好处 | 说明 |
|------|------|
| **代码可读性** | 更容易理解页面结构 |
| **SEO 友好** | 搜索引擎能更好理解内容 |
| **可访问性** | 屏幕阅读器能正确导航 |
| **代码维护** | 结构清晰，便于修改 |

---

## 2. 文档结构元素

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>页面标题</title>
</head>
<body>
    <!-- 页面头部 -->
    <header>
        <div class="logo">网站名称</div>
        <nav aria-label="主导航">
            <ul>
                <li><a href="/">首页</a></li>
                <li><a href="/about">关于</a></li>
            </ul>
        </nav>
    </header>
    
    <!-- 主要内容区域 -->
    <main>
        <article>
            <header>
                <h1>文章标题</h1>
                <time datetime="2024-01-15">2024年1月15日</time>
            </header>
            
            <section>
                <h2>第一节</h2>
                <p>内容...</p>
            </section>
            
            <footer>
                <p>作者：张三</p>
            </footer>
        </article>
        
        <!-- 侧边栏 -->
        <aside>
            <h2>相关文章</h2>
            <ul>...</ul>
        </aside>
    </main>
    
    <!-- 页面底部 -->
    <footer>
        <p>&copy; 2024 网站名称</p>
    </footer>
</body>
</html>
```

### 各元素详解

| 元素 | 用途 | 使用场景 |
|------|------|----------|
| `<header>` | 头部区域 | 页面头部、文章头部 |
| `<nav>` | 导航链接 | 主导航、面包屑 |
| `<main>` | 主要内容 | 每页只有一个 |
| `<article>` | 独立内容 | 文章、评论、帖子 |
| `<section>` | 内容分区 | 章节、功能区 |
| `<aside>` | 附属内容 | 侧边栏、广告 |
| `<footer>` | 底部区域 | 页面底部、文章底部 |

---

## 3. 语义化文本元素

```html
<!-- 图片说明 -->
<figure>
    <img src="chart.png" alt="销售图表">
    <figcaption>图1：2024年销售数据</figcaption>
</figure>

<!-- 详情折叠 -->
<details>
    <summary>点击查看更多</summary>
    <p>详细内容...</p>
</details>

<!-- 时间标记 -->
<time datetime="2024-01-15">2024年1月15日</time>

<!-- 进度条 -->
<progress value="70" max="100">70%</progress>

<!-- 度量 -->
<meter value="0.7" min="0" max="1">70%</meter>

<!-- 地址 -->
<address>
    联系人：<a href="mailto:test@example.com">张三</a>
</address>

<!-- 标记/高亮 -->
<p>这是<mark>重要</mark>的内容</p>
```

---

## 4. 结构对比图

```
非语义化结构：                    语义化结构：
┌─────────────────────┐         ┌─────────────────────┐
│ div.header          │         │ header              │
│ └── div.nav         │         │ └── nav             │
├─────────────────────┤         ├─────────────────────┤
│ div.main            │         │ main                │
│ ├── div.article     │         │ ├── article         │
│ │   ├── div.title   │         │ │   ├── h1          │
│ │   └── div.content │         │ │   └── section     │
│ └── div.sidebar     │         │ └── aside           │
├─────────────────────┤         ├─────────────────────┤
│ div.footer          │         │ footer              │
└─────────────────────┘         └─────────────────────┘
```

---

## 小结

- 使用正确的语义标签替代无意义的 div
- 每个页面只有一个 `<main>`
- `<article>` 用于可独立分发的内容
- `<section>` 用于相关内容分组
- 语义化提升 SEO 和可访问性

---

[返回上级目录](../README.md)
