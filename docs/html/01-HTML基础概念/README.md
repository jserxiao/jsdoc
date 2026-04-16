# 一、HTML 基础概念

> HTML（HyperText Markup Language，超文本标记语言）是构建网页的基础。理解 HTML 的基本概念是学习前端开发的第一步。

## 学习要点

- 📄 理解 HTML 文档的基本结构
- 🏷️ 掌握标签、元素、属性的概念
- 📝 了解 DOCTYPE 和文档类型
- ✅ 形成良好的 HTML 编写习惯

---

## 1. HTML 是什么？

### 定义

HTML 是一种**标记语言**（不是编程语言），它使用标签来描述网页的结构和内容。

```
网页 = HTML（结构）+ CSS（样式）+ JavaScript（行为）
```

### HTML、CSS、JavaScript 的关系

```
┌─────────────────────────────────────────────┐
│                    网页                      │
├─────────────┬─────────────┬─────────────────┤
│   HTML      │    CSS      │   JavaScript    │
│   结构      │    样式     │      行为        │
│             │             │                 │
│ "是什么"    │ "长什么样"  │   "能做什么"     │
│             │             │                 │
│ <h1>标题</h1>│ h1 {        │ btn.onclick =   │
│ <p>内容</p> │   color:red;│   alert('hi')   │
│ <button>    │ }           │ }               │
└─────────────┴─────────────┴─────────────────┘
```

---

## 2. HTML 文档基本结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>页面标题</title>
</head>
<body>
    <h1>Hello World</h1>
    <p>这是我的第一个网页</p>
</body>
</html>
```

### 结构解析

| 部分 | 说明 |
|------|------|
| `<!DOCTYPE html>` | 文档类型声明，告诉浏览器使用 HTML5 标准解析 |
| `<html>` | 根元素，整个网页的容器 |
| `<head>` | 头部，包含元数据（不显示在页面上） |
| `<meta charset>` | 字符编码声明，支持中文等字符 |
| `<meta viewport>` | 视口设置，对移动端适配很重要 |
| `<title>` | 页面标题，显示在浏览器标签上 |
| `<body>` | 主体，包含可见的页面内容 |

---

## 3. HTML 语法基础

### 标签（Tags）

```html
<!-- 双标签（容器标签） -->
<div>内容</div>
<p>段落</p>
<h1>标题</h1>

<!-- 单标签（自闭合标签） -->
<img src="image.jpg">
<br>
<input type="text">

<!-- 带斜杠的自闭合写法（可选） -->
<img src="image.jpg" />
<input type="text" />
```

### 元素（Elements）

```
元素 = 开始标签 + 内容 + 结束标签

<p>Hello World</p>
│   │          │
│   │          └── 结束标签
│   └──────────── 内容
└──────────────── 开始标签
```

### 属性（Attributes）

```html
<!-- 属性格式：属性名="属性值" -->
<a href="https://example.com" target="_blank">链接</a>

<!-- 布尔属性（有则表示 true） -->
<input type="text" disabled>
<input type="checkbox" checked>

<!-- 全局属性（所有元素都能用） -->
<div id="header" class="container" data-id="123">
    content
</div>
```

### 属性分类

| 类型 | 示例 | 说明 |
|------|------|------|
| 全局属性 | id, class, style, title | 所有元素可用 |
| 特定属性 | href, src, type, value | 特定元素可用 |
| 布尔属性 | disabled, checked, readonly | 有则为 true |
| 自定义属性 | data-* | 存储自定义数据 |

---

## 4. DOCTYPE 声明

### 为什么需要 DOCTYPE？

```html
<!DOCTYPE html>
```

DOCTYPE 告诉浏览器：
1. 这是 HTML5 文档
2. 使用**标准模式**渲染（而不是怪异模式）

### 标准模式 vs 怪异模式

```
标准模式：浏览器按 W3C 标准渲染页面
怪异模式：浏览器模拟旧版本行为（兼容老页面）

没有 DOCTYPE 或 DOCTYPE 错误 → 怪异模式
正确的 DOCTYPE               → 标准模式
```

**重要**：始终在文档第一行写 `<!DOCTYPE html>`

---

## 5. HTML 注释

```html
<!-- 这是单行注释 -->

<!--
  这是
  多行注释
-->

<!-- 
  注释不会显示在页面上
  但会出现在源代码中
  不要在注释中放敏感信息！
-->
```

---

## 6. 常见错误与最佳实践

### 常见错误

```html
<!-- ❌ 忘记关闭标签 -->
<div>
    <p>内容
</div>

<!-- ❌ 标签嵌套错误 -->
<b><i>文本</b></i>

<!-- ❌ 属性值没有引号（虽然有时可以，但不推荐） -->
<div class=container>

<!-- ❌ 使用废弃的标签 -->
<font color="red">文本</font>
<center>居中</center>
```

### 最佳实践

```html
<!-- ✅ 正确关闭标签 -->
<div>
    <p>内容</p>
</div>

<!-- ✅ 正确嵌套 -->
<b><i>文本</i></b>

<!-- ✅ 属性值使用引号 -->
<div class="container">

<!-- ✅ 使用 CSS 代替废弃标签 -->
<span style="color: red;">文本</span>
<div style="text-align: center;">居中</div>

<!-- ✅ 语义化标签 -->
<header>头部</header>
<nav>导航</nav>
<main>主内容</main>
<footer>页脚</footer>
```

---

## 7. HTML5 新特性速览

```html
<!-- 语义化标签 -->
<header>, <nav>, <main>, <article>, <section>, <aside>, <footer>

<!-- 多媒体 -->
<video src="video.mp4" controls></video>
<audio src="audio.mp3" controls></audio>

<!-- 表单增强 -->
<input type="email">
<input type="date">
<input type="range">

<!-- 绘图 -->
<canvas id="canvas"></canvas>
<svg>...</svg>

<!-- 本地存储（JavaScript API） -->
localStorage, sessionStorage
```

---

## 小结

| 概念 | 说明 |
|------|------|
| **HTML** | 超文本标记语言，描述网页结构 |
| **标签** | `<tag>` 标记内容的开始和结束 |
| **元素** | 标签 + 内容，如 `<p>文本</p>` |
| **属性** | 提供额外信息，如 `class="name"` |
| **DOCTYPE** | 文档类型声明，触发标准模式 |

---

[返回上级目录](../README.md)
