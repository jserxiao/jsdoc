# HTML 全面学习指南

> HTML（HyperText Markup Language，超文本标记语言）是构建网页的基础技术。本模块将系统性地介绍 HTML 的核心概念、语义化标签、表单设计、可访问性等内容。

## 📚 模块概述

HTML 是 Web 开发的三大基石之一（HTML + CSS + JavaScript），它定义了网页的结构和内容。掌握 HTML 是成为前端开发者的第一步。

```
网页技术栈
├── HTML - 结构层（骨架）
│   └── 定义"是什么" - 标题、段落、链接、图片...
├── CSS - 表现层（皮肤）
│   └── 定义"长什么样" - 颜色、布局、动画...
└── JavaScript - 行为层（灵魂）
    └── 定义"能做什么" - 交互、数据、逻辑...
```

## 🎯 学习目标

- 理解 HTML 文档结构和语法规则
- 掌握常用 HTML 标签的正确用法
- 学会使用语义化标签构建页面
- 理解表单设计和验证机制
- 掌握可访问性（Accessibility）最佳实践
- 了解 SEO 优化的 HTML 技巧

## 📖 章节目录

### 基础阶段

#### [一、HTML 基础概念](./01-HTML基础概念/)
- HTML 发展历史与 HTML5 新特性
- 文档结构：DOCTYPE、html、head、body
- 语法基础：标签、元素、属性
- 注释与代码规范

#### [二、文本内容](./02-文本内容/)
- 标题层级：h1-h6
- 段落与换行：p、br、hr
- 文本格式化：strong、em、mark、sub、sup
- 引用与代码：blockquote、q、cite、code、pre

#### [三、列表](./03-列表/)
- 无序列表：ul + li
- 有序列表：ol + li
- 定义列表：dl + dt + dd
- 列表嵌套与样式

#### [四、链接与导航](./04-链接与导航/)
- 超链接：a 标签详解
- 链接类型：外部、内部、锚点、邮件、电话
- 导航结构：nav、面包屑
- rel 属性与安全性

### 进阶阶段

#### [五、多媒体](./05-多媒体/)
- 图片：img、picture、figure
- 视频：video 标签与属性
- 音频：audio 标签与属性
- 嵌入内容：iframe、embed、object

#### [六、SVG 与 Canvas](./06-SVG与Canvas/)
- SVG 基础：形状、路径、文本
- Canvas 绑定：2D 绑定 API
- 图形动画与交互
- 性能对比与选择

#### [七、表格](./07-表格/)
- 表格结构：table、tr、td、th
- 表格分组：thead、tbody、tfoot
- 跨行跨列：rowspan、colspan
- 响应式表格设计

#### [八、表单](./08-表单/)
- 表单结构：form 标签详解
- 输入类型：text、password、email、number...
- 选择控件：radio、checkbox、select
- 表单验证：HTML5 验证与 JavaScript 验证
- 可访问性最佳实践

### 高级阶段

#### [九、语义化结构](./09-语义化结构/)
- 语义化的重要性
- 文档结构元素：header、nav、main、footer
- 内容分区：article、section、aside
- 实战：构建语义化页面

#### [十、元数据与头部](./10-元数据与头部/)
- meta 标签详解
- 视口设置与移动端适配
- Open Graph 与社交分享
- SEO 相关元数据

#### [十一、全局属性](./11-全局属性/)
- 基础属性：id、class、style、title
- 数据属性：data-*
- 无障碍属性：role、aria-*
- 其他属性：hidden、tabindex、contenteditable

#### [十二、可访问性](./12-可访问性/)
- 可访问性基础概念
- ARIA 属性详解
- 屏幕阅读器支持
- 键盘导航与焦点管理

#### [十三、Web Components](./13-WebComponents/)
- 自定义元素：Custom Elements
- 影子 DOM：Shadow DOM
- HTML 模板：template
- 组件化实践

#### [十四、SEO 与最佳实践](./14-SEO与最佳实践/)
- 搜索引擎优化技巧
- 语义化与 SEO
- 性能优化：资源加载
- HTML 验证与调试

## 🔑 核心概念速查

### 文档结构模板

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="页面描述">
    <title>页面标题</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <nav><!-- 导航 --></nav>
    </header>
    
    <main>
        <article>
            <h1>文章标题</h1>
            <section>
                <h2>章节标题</h2>
                <p>内容...</p>
            </section>
        </article>
        <aside><!-- 侧边栏 --></aside>
    </main>
    
    <footer>
        <p>&copy; 2024 版权信息</p>
    </footer>
    
    <script src="script.js"></script>
</body>
</html>
```

### 常用标签分类

| 分类 | 标签 | 用途 |
|------|------|------|
| 文档结构 | html, head, body | 页面骨架 |
| 元数据 | meta, title, link, style | 头部信息 |
| 区块 | header, nav, main, footer, article, section, aside | 语义化结构 |
| 标题 | h1, h2, h3, h4, h5, h6 | 标题层级 |
| 文本 | p, span, a, strong, em, mark, br | 文本内容 |
| 列表 | ul, ol, li, dl, dt, dd | 列表结构 |
| 表格 | table, tr, td, th, thead, tbody | 表格数据 |
| 表单 | form, input, select, textarea, button | 用户输入 |
| 多媒体 | img, video, audio, canvas, svg | 媒体内容 |

### 全局属性速查

| 属性 | 说明 | 示例 |
|------|------|------|
| `id` | 唯一标识符 | `<div id="header">` |
| `class` | 类名（可多个） | `<div class="card active">` |
| `style` | 内联样式 | `<p style="color:red">` |
| `title` | 提示文本 | `<span title="说明">` |
| `data-*` | 自定义数据 | `<div data-id="123">` |
| `hidden` | 隐藏元素 | `<div hidden>` |
| `tabindex` | Tab 顺序 | `<div tabindex="0">` |
| `contenteditable` | 可编辑 | `<div contenteditable>` |

## 📚 参考资源

### 官方文档
- [MDN HTML 教程](https://developer.mozilla.org/zh-CN/docs/Web/HTML) - 最权威的 HTML 参考文档
- [HTML 标准规范](https://html.spec.whatwg.org/) - WHATWG 官方规范
- [W3C HTML 验证器](https://validator.w3.org/) - 验证 HTML 代码

### 推荐书籍
- 《HTML5 权威指南》- Adam Freeman
- 《HTML 与 CSS 设计与构建网站》- Jon Duckett
- 《无障碍设计指南》- Laura Kalbag

### 在线工具
- [CodePen](https://codepen.io/) - 在线代码编辑器
- [Can I Use](https://caniuse.com/) - 浏览器兼容性查询
- [HTML5 Please](https://html5please.com/) - HTML5 特性建议

## 💡 学习建议

1. **循序渐进**：从基础概念开始，逐步掌握进阶内容
2. **动手实践**：每学一个标签都要亲手写代码验证
3. **关注语义化**：理解为什么使用某个标签，而不仅仅是怎么用
4. **重视可访问性**：从开始就养成无障碍开发习惯
5. **使用验证工具**：定期使用 W3C 验证器检查代码质量

## 🚀 快速开始

```bash
# 创建第一个 HTML 文件
echo '<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>我的第一个网页</title>
</head>
<body>
    <h1>Hello, HTML!</h1>
</body>
</html>' > index.html

# 在浏览器中打开
open index.html  # macOS
start index.html # Windows
```

---

*持续更新中，欢迎提出建议和反馈！*
