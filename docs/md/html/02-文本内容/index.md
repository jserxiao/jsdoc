# 二、文本内容

> 文本是网页最基本的组成元素。正确使用文本相关标签不仅能让内容更有意义，还能提升 SEO 和可访问性。

## 📚 学习要点

- 📝 掌握标题的正确使用和层级关系
- 📄 理解段落、换行、水平线的语义
- 🎨 区分语义化文本标签与纯样式标签
- 💬 学会使用引用和代码相关标签

---

## 1. 标题（Headings）

### 基本用法

HTML 提供了六个级别的标题，从 `<h1>` 到 `<h6>`，重要性依次递减。

```html
<h1>一级标题 - 页面主标题</h1>
<h2>二级标题 - 章节标题</h2>
<h3>三级标题 - 子章节标题</h3>
<h4>四级标题</h4>
<h5>五级标题</h5>
<h6>六级标题</h6>
```

### 标题使用规则

```html
<!-- ✅ 正确：按层级使用 -->
<h1>网站名称</h1>
<h2>关于我们</h2>
<h3>公司历史</h3>
<h4>创立初期</h4>

<!-- ❌ 错误：跳级使用 -->
<h1>网站名称</h1>
<h3>关于我们</h3> <!-- 跳过了 h2 -->
<h2>公司历史</h2> <!-- 层级混乱 -->

<!-- ❌ 错误：仅用于样式 -->
<h1>这只是想要大字体</h1> <!-- 应该用 CSS -->
```

### 最佳实践

| 规则 | 说明 |
|------|------|
| 每页只有一个 `<h1>` | 页面主标题，SEO 重要元素 |
| 按层级顺序使用 | h1 → h2 → h3，不要跳级 |
| 不因样式选择标题 | 用 CSS 控制外观 |
| 标题后紧跟内容 | 不要空标题 |

---

## 2. 段落与换行

### 段落（p）

```html
<p>这是一个段落。段落是文本内容的基本单位。</p>
<p>这是另一个段落。浏览器会自动在段落之间添加间距。</p>

<!-- 段落可以包含其他内联元素 -->
<p>段落中可以有<strong>粗体</strong>、<em>斜体</em>和<a href="#">链接</a>。</p>
```

### 换行（br）

```html
<p>
    第一行<br>
    第二行<br>
    第三行
</p>

<!-- 诗歌、地址等场景 -->
<p>
    床前明月光，<br>
    疑是地上霜。<br>
    举头望明月，<br>
    低头思故乡。
</p>
```

### 水平线（hr）

```html
<p>第一部分内容...</p>
<hr>
<p>第二部分内容...</p>

<!-- hr 表示主题转换，不只是装饰线 -->
<section>
    <h2>第一章</h2>
    <p>内容...</p>
</section>
<hr>
<section>
    <h2>第二章</h2>
    <p>内容...</p>
</section>
```

---

## 3. 文本格式化

### 语义化标签 vs 样式标签

```html
<!-- 语义化标签（推荐）：强调内容含义 -->

<strong>重要文本</strong>    <!-- 表示重要性，默认粗体 -->
<em>强调文本</em>          <!-- 表示强调，默认斜体 -->
<mark>高亮文本</mark>       <!-- 表示标记/高亮 -->
<del>删除文本</del>         <!-- 表示已删除 -->
<ins>插入文本</ins>         <!-- 表示新增内容 -->
<s>不再相关</s>             <!-- 表示不再准确（非删除） -->

<!-- 样式标签（不推荐）：仅有视觉效果 -->
<b>粗体文本</b>            <!-- 只是粗体，无语义 -->
<i>斜体文本</i>            <!-- 只是斜体，无语义 -->
<u>下划线文本</u>          <!-- 只是下划线，无语义 -->
```

### 何时使用哪个？

| 场景 | 推荐标签 | 说明 |
|------|---------|------|
| 关键警告 | `<strong>` | 表示重要性 |
| 语气强调 | `<em>` | 表示强调 |
| 搜索结果高亮 | `<mark>` | 用户关注的内容 |
| 原价划掉 | `<del>` | 表示删除 |
| 新价格 | `<ins>` | 表示新增 |
| 过期信息 | `<s>` | 不再准确 |

### 上标与下标

```html
<!-- 数学公式 -->
<p>E = mc<sup>2</sup></p>
<p>H<sub>2</sub>O 是水的化学式</p>
<p>x<sub>1</sub><sup>2</sup> + x<sub>2</sub><sup>2</sup></p>

<!-- 脚注 -->
<p>这是正文<sup><a href="#note1">[1]</a></sup>。</p>
<p id="note1"><small>[1] 这是脚注内容</small></p>

<!-- 商标符号 -->
<p>BrandName<sup>®</sup></p>
<p>BrandName<sup>™</sup></p>
```

### 小号文本

```html
<p>
    <small>版权所有 © 2024</small>
</p>

<p>
    原价：¥99 <small>（不含税）</small>
</p>

<!-- 法律条款 -->
<p><small>
    本服务受相关法律法规约束。使用本服务即表示您同意我们的条款和条件。
</small></p>
```

---

## 4. 引用与署名

### 块引用（blockquote）

```html
<!-- 长引用，独立成段 -->
<blockquote cite="https://example.com/article">
    <p>这是一段长引用的内容。blockquote 用于引用大段文字，
    通常会有缩进等样式来区分于正文。</p>
    <footer>—— <cite>鲁迅《呐喊》</cite></footer>
</blockquote>
```

### 短引用（q）

```html
<!-- 行内短引用 -->
<p>鲁迅说过：<q cite="https://example.com">其实地上本没有路，走的人多了，也便成了路。</q></p>
```

### 引用来源（cite）

```html
<!-- 表示作品名称（书、文章、电影等） -->
<p>我最喜欢的书是<cite>《百年孤独》</cite>。</p>

<!-- 配合 blockquote -->
<blockquote>
    <p>引用内容...</p>
    <footer>—— <cite>作者名</cite></footer>
</blockquote>
```

---

## 5. 代码相关标签

### 行内代码（code）

```html
<p>使用 <code>console.log()</code> 输出调试信息。</p>
<p>HTML 元素由 <code>&lt;tag&gt;</code> 标签组成。</p>
```

### 预格式化文本（pre）

```html
<!-- 保留空格和换行 -->
<pre>
function hello() {
    console.log('Hello, World!');
}
</pre>

<!-- 配合 code 使用 -->
<pre><code>
function greet(name) {
    return `Hello, ${name}!`;
}

// 调用
greet('World');
</code></pre>
```

### 键盘输入（kbd）

```html
<p>按 <kbd>Ctrl</kbd> + <kbd>C</kbd> 复制。</p>
<p>按 <kbd>Enter</kbd> 提交表单。</p>
<p>使用 <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>I</kbd> 打开开发者工具。</p>
```

### 示例输出（samp）

```html
<p>程序输出：<samp>Hello, World!</samp></p>
<p>错误信息：<samp>Error: Invalid input</samp></p>

<!-- 终端输出示例 -->
<pre><samp>
$ npm install
added 127 packages in 3.5s
</samp></pre>
```

### 变量（var）

```html
<p>圆的面积公式：<var>S</var> = π<var>r</var><sup>2</sup></p>
<p>方程 <var>x</var> + <var>y</var> = 10 的解...</p>
```

---

## 6. 缩写与定义

### 缩写（abbr）

```html
<p>
    <abbr title="HyperText Markup Language">HTML</abbr> 是网页的基础。
</p>

<p>
    <abbr title="World Health Organization">WHO</abbr> 是联合国下属机构。
</p>

<!-- 配合 CSS 显示提示样式 -->
<style>
abbr {
    text-decoration: underline dotted;
    cursor: help;
}
</style>
```

### 定义术语（dfn）

```html
<p><dfn>HTML</dfn>是一种用于创建网页的标记语言。</p>

<!-- 配合 abbr -->
<p><dfn><abbr title="Cascading Style Sheets">CSS</abbr></dfn>
是一种样式表语言，用于描述文档的表现形式。</p>
```

---

## 7. 地址信息

```html
<!-- 页脚中的联系信息 -->
<footer>
    <address>
        作者：<a href="mailto:author@example.com">张三</a><br>
        地址：北京市朝阳区xxx街道<br>
        电话：<a href="tel:+8612345678900">123-4567-8900</a>
    </address>
</footer>

<!-- 文章作者信息 -->
<article>
    <h1>文章标题</h1>
    <p>文章内容...</p>
    <footer>
        <address>
            作者：<a href="/author/zhang">张三</a>
        </address>
    </footer>
</article>
```

---

## 8. 标签选择指南

| 需求 | 推荐标签 | 避免使用 |
|------|---------|---------|
| 标题 | `<h1>`-`<h6>` | 用 `<div>` + CSS 放大 |
| 段落 | `<p>` | 用 `<div>` + `<br>` |
| 重要内容 | `<strong>` | `<b>` |
| 强调语气 | `<em>` | `<i>` |
| 高亮标记 | `<mark>` | `<span style="background:yellow">` |
| 删除内容 | `<del>` | `<s>` 或 CSS 删除线 |
| 代码 | `<code>` | `<span class="code">` |
| 引用 | `<blockquote>` / `<q>` | `<div class="quote">` |

---

## 9. 实战示例

### 文章结构

```html
<article>
    <header>
        <h1>深入理解 HTML 语义化</h1>
        <p>
            <time datetime="2024-01-15">2024年1月15日</time>
            作者：<cite>张三</cite>
        </p>
    </header>
    
    <section>
        <h2>什么是语义化</h2>
        <p>HTML 语义化是指使用恰当的标签来标记内容...</p>
        
        <h3>语义化的好处</h3>
        <p>语义化有以下几个好处：</p>
        <ul>
            <li><strong>提升可访问性</strong>：屏幕阅读器能正确解读</li>
            <li><strong>优化 SEO</strong>：搜索引擎更好理解内容</li>
            <li><strong>便于维护</strong>：代码结构清晰</li>
        </ul>
    </section>
    
    <section>
        <h2>代码示例</h2>
        <p>使用 <code>&lt;article&gt;</code> 标签包裹独立内容：</p>
        <pre><code>&lt;article&gt;
    &lt;h1&gt;标题&lt;/h1&gt;
    &lt;p&gt;内容...&lt;/p&gt;
&lt;/article&gt;</code></pre>
    </section>
    
    <footer>
        <p><small>本文首发于某某博客</small></p>
    </footer>
</article>
```

---

## 小结

### 文本标签分类

```
文本标签
├── 结构类
│   ├── h1-h6    标题（层级递减）
│   ├── p        段落
│   ├── br       换行
│   └── hr       主题分隔
├── 语义类
│   ├── strong   重要
│   ├── em       强调
│   ├── mark     高亮
│   ├── del      删除
│   ├── ins      插入
│   └── s        不再相关
├── 引用类
│   ├── blockquote  块引用
│   ├── q           行内引用
│   └── cite        引用来源
└── 代码类
    ├── code     代码
    ├── pre      预格式化
    ├── kbd      键盘输入
    ├── samp     示例输出
    └── var      变量
```

### 关键要点

1. **语义优先**：选择标签看含义，不看样式
2. **层级正确**：标题按层级使用，每页只有一个 h1
3. **可访问性**：正确使用标签帮助辅助技术理解内容
4. **SEO 友好**：语义化标签有助于搜索引擎理解页面

---

[返回上级目录](../index.md) | [下一章：列表](../03-列表/index.md)
