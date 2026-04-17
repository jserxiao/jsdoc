# 四、链接与导航

> 链接是 Web 的核心特性，它将分散的页面连接成一个整体。正确使用链接不仅能提升用户体验，还能改善 SEO 和安全性。

## 📚 学习要点

- 🔗 掌握 `<a>` 标签的各种用法
- 🔗 理解不同链接类型的特点
- 🧭 学会构建语义化的导航结构
- 🔒 理解链接安全性和 rel 属性

---

## 1. 超链接基础

### 基本语法

```html
<a href="URL">链接文本</a>
```

### 基本链接

```html
<!-- 外部链接 -->
<a href="https://www.example.com">访问示例网站</a>

<!-- 内部链接（相对路径） -->
<a href="/about.html">关于我们</a>
<a href="./contact.html">联系方式</a>
<a href="../index.html">返回首页</a>

<!-- 锚点链接 -->
<a href="#section">跳转到章节</a>

<!-- 邮件链接 -->
<a href="mailto:info@example.com">发送邮件</a>

<!-- 电话链接 -->
<a href="tel:+8612345678900">拨打电话</a>

<!-- 短信链接 -->
<a href="sms:+8612345678900">发送短信</a>
```

### target 属性

```html
<!-- 当前窗口打开（默认） -->
<a href="https://example.com" target="_self">当前窗口</a>

<!-- 新窗口/标签页打开 -->
<a href="https://example.com" target="_blank">新窗口</a>

<!-- 在指定 iframe 中打开 -->
<a href="https://example.com" target="myframe">iframe中打开</a>

<!-- 在父框架中打开 -->
<a href="https://example.com" target="_parent">父框架</a>

<!-- 在顶层窗口打开 -->
<a href="https://example.com" target="_top">顶层窗口</a>
```

---

## 2. 链接类型详解

### 外部链接

```html
<!-- 基本外部链接 -->
<a href="https://www.example.com">访问外部网站</a>

<!-- 安全的外部链接（推荐） -->
<a href="https://www.example.com" target="_blank" rel="noopener noreferrer">
    安全访问外部网站
</a>
```

### 为什么需要 `rel="noopener noreferrer"`？

```
安全风险：
┌─────────────────────────────────────────────┐
│ 原页面                                      │
│ window.opener → 指向原页面                   │
└─────────────────────────────────────────────┘
                    ↓ 点击 target="_blank"
┌─────────────────────────────────────────────┐
│ 新页面（恶意网站）                           │
│ 可以通过 window.opener 控制原页面！          │
│ window.opener.location = '钓鱼网站'         │
└─────────────────────────────────────────────┘

解决方案：rel="noopener noreferrer"
- noopener: 阻止新页面访问 window.opener
- noreferrer: 不发送 Referer 信息
```

### 页内锚点

```html
<!-- 定义锚点 -->
<h2 id="section1">第一章节</h2>
<p>内容...</p>

<h2 id="section2">第二章节</h2>
<p>内容...</p>

<!-- 跳转到锚点 -->
<nav>
    <ul>
        <li><a href="#section1">跳到第一章</a></li>
        <li><a href="#section2">跳到第二章</a></li>
    </ul>
</nav>

<!-- 跳转到页面顶部 -->
<a href="#">返回顶部</a>

<!-- 跳转到其他页面的锚点 -->
<a href="page.html#section">跳转到其他页面的锚点</a>
```

### 邮件链接

```html
<!-- 基本邮件链接 -->
<a href="mailto:info@example.com">发送邮件</a>

<!-- 带主题 -->
<a href="mailto:info@example.com?subject=咨询问题">发送邮件（带主题）</a>

<!-- 带抄送 -->
<a href="mailto:info@example.com?cc=cc@example.com">发送邮件（带抄送）</a>

<!-- 带密送 -->
<a href="mailto:info@example.com?bcc=bcc@example.com">发送邮件（带密送）</a>

<!-- 带正文 -->
<a href="mailto:info@example.com?body=这是预设的正文内容">发送邮件（带正文）</a>

<!-- 组合参数 -->
<a href="mailto:info@example.com?subject=咨询&cc=cc@example.com&body=问题内容">
    发送完整邮件
</a>
```

### 电话链接

```html
<!-- 基本电话链接 -->
<a href="tel:+8612345678900">+86 123 4567 8900</a>

<!-- 带分机号 -->
<a href="tel:+8612345678900,1234">+86 123 4567 8900 转 1234</a>

<!-- 自动拨打 -->
<a href="tel:400-123-4567">客服热线：400-123-4567</a>
```

---

## 3. 导航结构

### 基本导航

```html
<nav>
    <ul>
        <li><a href="/">首页</a></li>
        <li><a href="/products">产品</a></li>
        <li><a href="/about">关于</a></li>
        <li><a href="/contact">联系</a></li>
    </ul>
</nav>
```

### 当前页面标识

```html
<nav aria-label="主导航">
    <ul>
        <li><a href="/">首页</a></li>
        <li><a href="/products" aria-current="page">产品</a></li>
        <li><a href="/about">关于</a></li>
        <li><a href="/contact">联系</a></li>
    </ul>
</nav>
```

### 面包屑导航

```html
<nav aria-label="面包屑导航">
    <ol>
        <li><a href="/">首页</a></li>
        <li><a href="/products">产品</a></li>
        <li><a href="/products/electronics">电子产品</a></li>
        <li aria-current="page">手机</li>
    </ol>
</nav>

<style>
nav[aria-label="面包屑导航"] ol {
    display: flex;
    list-style: none;
    padding: 0;
    gap: 8px;
}

nav[aria-label="面包屑导航"] li:not(:last-child)::after {
    content: "/";
    margin-left: 8px;
    color: #999;
}
</style>
```

### 多级导航

```html
<nav aria-label="主导航">
    <ul class="main-nav">
        <li><a href="/">首页</a></li>
        <li>
            <a href="/products">产品</a>
            <ul class="sub-nav">
                <li><a href="/products/a">产品A</a></li>
                <li><a href="/products/b">产品B</a></li>
                <li><a href="/products/c">产品C</a></li>
            </ul>
        </li>
        <li>
            <a href="/services">服务</a>
            <ul class="sub-nav">
                <li><a href="/services/consulting">咨询服务</a></li>
                <li><a href="/services/support">技术支持</a></li>
            </ul>
        </li>
        <li><a href="/contact">联系</a></li>
    </ul>
</nav>
```

### 页脚导航

```html
<footer>
    <nav aria-label="页脚导航">
        <ul>
            <li><a href="/privacy">隐私政策</a></li>
            <li><a href="/terms">服务条款</a></li>
            <li><a href="/sitemap">网站地图</a></li>
        </ul>
    </nav>
</footer>
```

---

## 4. rel 属性详解

### 安全相关

```html
<!-- noopener: 阻止新页面访问 window.opener -->
<a href="https://example.com" target="_blank" rel="noopener">安全链接</a>

<!-- noreferrer: 不发送 Referer 头 -->
<a href="https://example.com" rel="noreferrer">无 Referer</a>

<!-- 组合使用（推荐） -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer">推荐</a>
```

### SEO 相关

```html
<!-- nofollow: 告诉搜索引擎不要跟踪此链接 -->
<a href="https://spam-site.com" rel="nofollow">不推荐的网站</a>

<!-- sponsored: 标记为付费链接 -->
<a href="https://advertiser.com" rel="sponsored">广告链接</a>

<!-- ugc: 用户生成内容 -->
<a href="https://user-link.com" rel="ugc">用户发布的链接</a>
```

### 预加载相关

```html
<!-- prefetch: 预获取资源 -->
<link rel="prefetch" href="next-page.html">

<!-- preconnect: 预连接 -->
<link rel="preconnect" href="https://cdn.example.com">

<!-- preload: 预加载 -->
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>
```

---

## 5. 链接最佳实践

### 链接文本规范

```html
<!-- ❌ 不好的链接文本 -->
<a href="/about">点击这里</a>
<a href="/about">了解更多</a>
<a href="/about">链接</a>

<!-- ✅ 好的链接文本 -->
<a href="/about">关于我们</a>
<a href="/about">了解我们的团队</a>
<a href="/about">查看公司简介</a>
```

### 链接样式

```html
<style>
/* 基本链接样式 */
a {
    color: #0066cc;
    text-decoration: underline;
}

a:hover {
    color: #004499;
}

a:visited {
    color: #660099;
}

a:focus {
    outline: 2px solid #0066cc;
    outline-offset: 2px;
}

/* 外部链接标识 */
a[href^="http"]::after {
    content: " ↗";
}
</style>
```

### 图片链接

```html
<!-- 图片链接 -->
<a href="https://example.com">
    <img src="logo.png" alt="公司Logo">
</a>

<!-- 带标题的链接 -->
<a href="https://example.com" title="访问示例网站">
    示例网站
</a>
```

### 下载链接

```html
<!-- 普通下载 -->
<a href="document.pdf">下载文档</a>

<!-- 指定下载文件名 -->
<a href="document.pdf" download="报告.pdf">下载报告</a>

<!-- 下载图片 -->
<a href="image.png" download="图片.png">下载图片</a>
```

---

## 6. 可访问性

### 键盘导航

```html
<!-- 链接默认支持键盘操作 -->
<!-- Tab: 聚焦链接 -->
<!-- Enter: 激活链接 -->

<!-- 跳过导航链接 -->
<a href="#main-content" class="skip-link">跳到主要内容</a>
<nav>
    <ul>
        <li><a href="/">首页</a></li>
        <!-- 更多导航 -->
    </ul>
</nav>
<main id="main-content">
    <!-- 主要内容 -->
</main>

<style>
.skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    padding: 8px;
    background: #000;
    color: #fff;
}

.skip-link:focus {
    top: 0;
}
</style>
```

### ARIA 属性

```html
<!-- 当前页面 -->
<a href="/products" aria-current="page">产品</a>

<!-- 弹出菜单 -->
<a href="#" aria-haspopup="true" aria-expanded="false">
    下拉菜单
</a>

<!-- 描述链接目的 -->
<a href="/help" aria-describedby="help-desc">
    帮助
</a>
<span id="help-desc" hidden>
    获取使用帮助和常见问题解答
</span>
```

---

## 7. 实战示例

### 完整导航栏

```html
<header>
    <a href="/" class="logo">
        <img src="logo.png" alt="公司名称">
    </a>
    
    <nav aria-label="主导航">
        <ul class="nav-list">
            <li><a href="/" aria-current="page">首页</a></li>
            <li>
                <a href="/products">产品</a>
                <ul class="dropdown">
                    <li><a href="/products/a">产品A</a></li>
                    <li><a href="/products/b">产品B</a></li>
                </ul>
            </li>
            <li><a href="/about">关于</a></li>
            <li><a href="/contact">联系</a></li>
        </ul>
    </nav>
    
    <div class="header-actions">
        <a href="/login" class="btn btn-outline">登录</a>
        <a href="/signup" class="btn btn-primary">注册</a>
    </div>
</header>
```

### 社交分享链接

```html
<div class="social-share">
    <a href="https://twitter.com/share?url=..." target="_blank" rel="noopener noreferrer" aria-label="分享到 Twitter">
        <svg><!-- Twitter 图标 --></svg>
    </a>
    <a href="https://www.facebook.com/sharer/sharer.php?u=..." target="_blank" rel="noopener noreferrer" aria-label="分享到 Facebook">
        <svg><!-- Facebook 图标 --></svg>
    </a>
    <a href="https://service.weibo.com/share/share.php?url=..." target="_blank" rel="noopener noreferrer" aria-label="分享到微博">
        <svg><!-- 微博图标 --></svg>
    </a>
</div>
```

---

## 小结

### 链接属性速查

| 属性 | 说明 | 示例 |
|------|------|------|
| `href` | 链接目标 | `href="https://example.com"` |
| `target` | 打开方式 | `target="_blank"` |
| `rel` | 链接关系 | `rel="noopener noreferrer"` |
| `download` | 下载文件 | `download="filename.pdf"` |
| `title` | 提示文本 | `title="点击访问"` |

### 链接类型速查

| 类型 | 格式 | 用途 |
|------|------|------|
| 外部链接 | `https://...` | 跳转到其他网站 |
| 内部链接 | `/path` 或 `./path` | 站内导航 |
| 锚点链接 | `#id` | 页内跳转 |
| 邮件链接 | `mailto:email` | 发送邮件 |
| 电话链接 | `tel:number` | 拨打电话 |
| 下载链接 | `download` 属性 | 下载文件 |

### 关键要点

1. **外部链接安全**：始终使用 `rel="noopener noreferrer"`
2. **链接文本有意义**：避免"点击这里"，描述链接目的
3. **语义化导航**：使用 `<nav>` 包裹导航链接
4. **可访问性**：添加 ARIA 属性，支持键盘导航

---

[返回上级目录](../index.md) | [下一章：多媒体](../05-多媒体/index.md)
