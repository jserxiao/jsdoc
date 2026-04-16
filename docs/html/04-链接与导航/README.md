# 四、链接与导航

## 超链接

```html
<!-- 基本链接 -->
<a href="https://example.com">外部链接</a>

<!-- 新窗口打开 -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
    安全的外部链接
</a>

<!-- 页内锚点 -->
<a href="#section">跳转到锚点</a>
<div id="section">锚点位置</div>

<!-- 邮件链接 -->
<a href="mailto:email@example.com">发送邮件</a>

<!-- 电话链接 -->
<a href="tel:+8612345678900">拨打电话</a>
```

---

## 导航结构

```html
<nav>
    <ul>
        <li><a href="/">首页</a></li>
        <li><a href="/about">关于</a></li>
        <li><a href="/contact">联系</a></li>
    </ul>
</nav>

<!-- 面包屑导航 -->
<nav aria-label="面包屑">
    <ol>
        <li><a href="/">首页</a></li>
        <li><a href="/products">产品</a></li>
        <li aria-current="page">当前产品</li>
    </ol>
</nav>
```

---

## rel 属性

```html
<a rel="noopener">防止新页面访问 window.opener</a>
<a rel="noreferrer">不发送 Referer</a>
<a rel="nofollow">搜索引擎不跟踪</a>
<a rel="noopener noreferrer">推荐组合使用</a>
```

---

[返回上级目录](../README.md)
