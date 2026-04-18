# 文本样式

> 文本样式是 CSS 最基础也是最重要的部分之一。掌握字体、文本、行高等属性，才能构建清晰易读的网页内容。内容参考《CSS权威指南》《CSS设计彻底研究》等经典著作。

## 学习要点

- 📝 掌握字体相关属性及其继承特性
- 📏 理解行高与垂直对齐的原理
- 🎨 学会文本装饰与变换
- 📐 掌握文本溢出与换行处理

---

## 1. 字体属性

### 1.1 font-family（字体族）

```css
/* 字体族列表，从左到右依次尝试 */
body {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

/* 通用字体族 */
font-family: serif;       /* 衬线字体：Times New Roman、宋体 */
font-family: sans-serif;  /* 无衬线字体：Arial、Helvetica、黑体 */
font-family: monospace;   /* 等宽字体：Consolas、Courier */
font-family: cursive;     /* 手写体 */
font-family: fantasy;     /* 艺术字体 */
font-family: system-ui;   /* 系统默认字体 */
```

#### 中文字体设置

```css
/* 中文字体最佳实践 */
body {
    font-family: 
        -apple-system,            /* macOS/iOS 系统字体 */
        BlinkMacSystemFont,       /* macOS Chrome */
        "PingFang SC",            /* macOS 苹方 */
        "Microsoft YaHei",        /* Windows 微软雅黑 */
        "Hiragino Sans GB",       /* macOS 冬青黑体 */
        sans-serif;               /* 回退字体 */
}

/* 代码字体 */
code, pre {
    font-family: 
        "SF Mono",                /* macOS */
        Monaco,                   /* macOS */
        "Cascadia Code",          /* Windows */
        Consolas,                 /* Windows */
        "Liberation Mono",        /* Linux */
        monospace;
}
```

#### 自定义字体（@font-face）

```css
/* 定义自定义字体 */
@font-face {
    font-family: "MyCustomFont";
    src: url("fonts/MyCustomFont.woff2") format("woff2"),
         url("fonts/MyCustomFont.woff") format("woff");
    font-weight: normal;
    font-style: normal;
    font-display: swap;  /* 避免 FOIT（Flash of Invisible Text） */
}

/* 使用自定义字体 */
body {
    font-family: "MyCustomFont", sans-serif;
}

/* 多字重字体 */
@font-face {
    font-family: "Roboto";
    src: url("Roboto-Light.woff2") format("woff2");
    font-weight: 300;
    font-style: normal;
}

@font-face {
    font-family: "Roboto";
    src: url("Roboto-Regular.woff2") format("woff2");
    font-weight: 400;
    font-style: normal;
}

@font-face {
    font-family: "Roboto";
    src: url("Roboto-Bold.woff2") format("woff2");
    font-weight: 700;
    font-style: normal;
}
```

### 1.2 font-size（字体大小）

```css
/* 绝对单位 */
font-size: 16px;      /* 像素，最常用 */
font-size: 12pt;      /* 点，打印用 */

/* 相对单位 */
font-size: 1em;       /* 相对于父元素字体大小 */
font-size: 1rem;      /* 相对于根元素字体大小（推荐） */
font-size: 100%;      /* 相对于父元素字体大小 */

/* 关键字 */
font-size: xx-small;
font-size: x-small;
font-size: small;
font-size: medium;    /* 默认值，通常 16px */
font-size: large;
font-size: x-large;
font-size: xx-large;

/* 相对关键字 */
font-size: smaller;   /* 比父元素小 */
font-size: larger;    /* 比父元素大 */

/* 视口单位 */
font-size: 2vw;       /* 视口宽度的 2% */
font-size: 2vh;       /* 视口高度的 2% */
```

#### 字体大小最佳实践

```css
/* 推荐：使用 rem 单位 */
html {
    font-size: 16px;  /* 设置根元素字体大小 */
}

body {
    font-size: 1rem;  /* 16px */
}

h1 {
    font-size: 2rem;  /* 32px */
}

h2 {
    font-size: 1.5rem; /* 24px */
}

/* 响应式字体大小 */
.title {
    /* clamp(最小值, 首选值, 最大值) */
    font-size: clamp(1.5rem, 4vw, 3rem);
}

/* 使用 CSS 变量管理字体大小 */
:root {
    --font-size-xs: 0.75rem;   /* 12px */
    --font-size-sm: 0.875rem;  /* 14px */
    --font-size-base: 1rem;    /* 16px */
    --font-size-lg: 1.125rem;  /* 18px */
    --font-size-xl: 1.25rem;   /* 20px */
    --font-size-2xl: 1.5rem;   /* 24px */
    --font-size-3xl: 2rem;     /* 32px */
}
```

### 1.3 font-weight（字体粗细）

```css
/* 关键字 */
font-weight: normal;  /* 400 */
font-weight: bold;    /* 700 */
font-weight: lighter; /* 比父元素细 */
font-weight: bolder;  /* 比父元素粗 */

/* 数值（100-900，以 100 为单位） */
font-weight: 100;  /* Thin */
font-weight: 200;  /* Extra Light */
font-weight: 300;  /* Light */
font-weight: 400;  /* Normal */
font-weight: 500;  /* Medium */
font-weight: 600;  /* Semi Bold */
font-weight: 700;  /* Bold */
font-weight: 800;  /* Extra Bold */
font-weight: 900;  /* Black */
```

#### 字重使用场景

```css
/* 标题层次 */
h1 { font-weight: 700; }
h2 { font-weight: 600; }
h3 { font-weight: 500; }

/* 正文 */
p { font-weight: 400; }

/* 强调 */
strong, .emphasis { font-weight: 600; }

/* 辅助文字 */
.caption { font-weight: 300; }
```

### 1.4 font-style（字体样式）

```css
font-style: normal;   /* 正常 */
font-style: italic;   /* 斜体（使用斜体字体） */
font-style: oblique;  /* 倾斜（强制倾斜正常字体） */
font-style: oblique 20deg; /* 指定倾斜角度 */
```

### 1.5 line-height（行高）

```css
/* 无单位值（推荐）：相对于字体大小的倍数 */
line-height: 1.5;    /* 字体大小的 1.5 倍 */
line-height: 1.2;

/* 有单位值 */
line-height: 24px;   /* 固定像素 */
line-height: 1.5em;  /* 相对于自身字体大小 */
line-height: 150%;   /* 百分比 */

/* 关键字 */
line-height: normal; /* 浏览器默认，通常约 1.2 */
```

#### 行高计算原理

```
行高 = 行间距 + 字体大小
行间距 = 行高 - 字体大小

示例：
font-size: 16px;
line-height: 1.5;
行高 = 16px × 1.5 = 24px
行间距 = 24px - 16px = 8px（上下各 4px）

┌─────────────────────────────┐
│         半行间距 (4px)       │
├─────────────────────────────┤
│                             │
│      文字内容 (16px)         │
│                             │
├─────────────────────────────┤
│         半行间距 (4px)       │
└─────────────────────────────┘
```

#### 行高最佳实践

```css
/* 正文：1.5-1.8 倍行高最易读 */
body {
    line-height: 1.6;
}

/* 标题：较紧凑的行高 */
h1, h2, h3 {
    line-height: 1.2;
}

/* 代码：紧凑行高 */
code, pre {
    line-height: 1.4;
}

/* 无单位值的继承特性 */
.parent {
    font-size: 16px;
    line-height: 1.5;  /* 计算值：24px */
}
.child {
    font-size: 32px;
    /* line-height 继承的是 1.5，不是 24px */
    /* 所以子元素的行高是 32px × 1.5 = 48px */
}
```

### 1.6 font 简写属性

```css
/* 完整简写语法 */
/* font: font-style font-variant font-weight font-size/line-height font-family */

/* 示例 */
font: italic small-caps bold 16px/1.5 Arial, sans-serif;
font: bold 14px/1.4 "Helvetica Neue", sans-serif;
font: 1rem/1.6 system-ui, sans-serif;

/* 最小简写（必须包含 font-size 和 font-family） */
font: 16px Arial;

/* 包含行高 */
font: 16px/1.5 Arial;

/* 系统字体关键字 */
font: caption;      /* 标题字体 */
font: icon;         /* 图标字体 */
font: menu;         /* 菜单字体 */
font: message-box;  /* 对话框字体 */
font: small-caption;/* 小标题字体 */
font: status-bar;   /* 状态栏字体 */
```

---

## 2. 文本属性

### 2.1 color（文本颜色）

```css
/* 关键字 */
color: red;
color: blue;
color: transparent;  /* 透明 */
color: currentColor; /* 继承父元素的 color 值 */

/* 十六进制 */
color: #ff0000;
color: #f00;         /* 简写 */
color: #ff000080;    /* 带透明度（8位） */

/* RGB */
color: rgb(255, 0, 0);
color: rgb(255, 0, 0, 0.5);  /* 带透明度 */
color: rgba(255, 0, 0, 0.5); /* 同上 */

/* 现代语法（推荐） */
color: rgb(255 0 0);
color: rgb(255 0 0 / 0.5);   /* 带透明度 */

/* HSL */
color: hsl(0, 100%, 50%);
color: hsl(0 100% 50%);
color: hsl(0 100% 50% / 0.5);

/* 颜色关键字 */
color: rebeccapurple;  /* #663399 */
```

### 2.2 text-align（文本对齐）

```css
/* 基本对齐 */
text-align: left;      /* 左对齐（默认，LTR 语言） */
text-align: right;     /* 右对齐 */
text-align: center;    /* 居中对齐 */
text-align: justify;   /* 两端对齐 */

/* 新增值 */
text-align: start;     /* 开始边界对齐（LTR 时左，RTL 时右） */
text-align: end;       /* 结束边界对齐 */

/* 匹配父元素 */
text-align: match-parent;

/* 字符对齐（用于数字对齐） */
text-align: ".";       /* 按小数点对齐 */
```

#### 两端对齐示例

```css
.justified {
    text-align: justify;
    text-align-last: left;  /* 最后一行对齐方式 */
}

/* 中文排版：两端正对齐 */
.chinese-text {
    text-align: justify;
    text-justify: inter-ideographic;  /* 中文优化 */
}
```

### 2.3 text-decoration（文本装饰）

```css
/* 简写：text-decoration: line style color thickness */

/* 下划线 */
text-decoration: underline;
text-decoration: underline wavy red;  /* 波浪红色下划线 */

/* 删除线 */
text-decoration: line-through;

/* 上划线 */
text-decoration: overline;

/* 无装饰 */
text-decoration: none;

/* 分开设置 */
text-decoration-line: underline overline;  /* 可多个 */
text-decoration-style: solid;      /* solid, double, dotted, dashed, wavy */
text-decoration-color: red;
text-decoration-thickness: 2px;

/* 下划线偏移 */
text-underline-offset: 4px;
text-underline-position: under;    /* 下划线在基线下方 */
```

#### 链接样式

```css
/* 默认链接样式 */
a {
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
    text-underline-offset: 3px;
}

/* 更好的下划线 */
.better-underline {
    text-decoration: underline;
    text-decoration-color: rgba(0, 0, 0, 0.3);
    text-underline-offset: 0.2em;
}
```

### 2.4 text-transform（文本转换）

```css
text-transform: none;        /* 无转换 */
text-transform: capitalize;  /* 首字母大写 */
text-transform: uppercase;   /* 全部大写 */
text-transform: lowercase;   /* 全部小写 */
text-transform: full-width;  /* 全角字符 */
```

#### 使用场景

```css
/* 标题统一格式 */
.article-title {
    text-transform: capitalize;  /* Each Word Capitalized */
}

/* 标签/徽章 */
.tag {
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
}

/* 显示原始内容 */
.user-input {
    text-transform: none;
}
```

### 2.5 text-indent（文本缩进）

```css
/* 首行缩进 */
p {
    text-indent: 2em;    /* 首行缩进两个字符 */
}

/* 负缩进（悬挂缩进） */
p {
    text-indent: -2em;
    padding-left: 2em;
}

/* 百分比 */
p {
    text-indent: 10%;    /* 相对于包含块宽度 */
}

/* 首行缩进但不影响第一段 */
p + p {
    text-indent: 2em;
}
```

### 2.6 letter-spacing（字母间距）

```css
letter-spacing: normal;    /* 默认 */
letter-spacing: 0.1em;     /* 增加间距 */
letter-spacing: -0.05em;   /* 减少间距 */
letter-spacing: 2px;       /* 固定像素 */
```

### 2.7 word-spacing（单词间距）

```css
word-spacing: normal;
word-spacing: 0.5em;       /* 增加单词间距 */
word-spacing: -0.1em;      /* 减少单词间距 */
```

### 2.8 text-shadow（文本阴影）

```css
/* 语法：text-shadow: x-offset y-offset blur-radius color */

/* 单个阴影 */
text-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);

/* 多个阴影 */
text-shadow: 
    1px 1px 0 #fff,
    2px 2px 0 #333;

/* 发光效果 */
text-shadow: 0 0 10px rgba(0, 0, 255, 0.5);

/* 凸起文字 */
text-shadow: 
    1px 1px 0 #ccc,
    2px 2px 0 #c9c9c9,
    3px 3px 0 #bbb;
```

---

## 3. 行内格式化

### 3.1 vertical-align（垂直对齐）

```css
/* 相对于行框的基线 */
vertical-align: baseline;     /* 默认：基线对齐 */
vertical-align: top;          /* 顶部对齐 */
vertical-align: middle;       /* 中部对齐 */
vertical-align: bottom;       /* 底部对齐 */
vertical-align: text-top;     /* 与文字顶部对齐 */
vertical-align: text-bottom;  /* 与文字底部对齐 */
vertical-align: sub;          /* 下标 */
vertical-align: super;        /* 上标 */

/* 相对于行高 */
vertical-align: 5px;          /* 上移 5px */
vertical-align: -5px;         /* 下移 5px */
vertical-align: 50%;          /* 相对于 line-height */

/* 数值 */
vertical-align: 0.5em;
```

#### 常见问题：图片底部间隙

```html
<style>
    /* 问题：图片底部有间隙 */
    .container img {
        /* 默认 baseline 对齐，底部有间隙 */
    }
    
    /* 解决方案 */
    .container img {
        vertical-align: top;      /* 方案1 */
        vertical-align: middle;   /* 方案2 */
        display: block;           /* 方案3 */
    }
</style>

<div class="container">
    <img src="image.jpg" alt="">
</div>
```

### 3.2 word-break（单词断行）

```css
word-break: normal;      /* 默认：在单词边界换行 */
word-break: break-all;   /* 任意位置换行（包括单词内） */
word-break: keep-all;    /* 只在单词边界换行（CJK 文字不换行） */
word-break: break-word;  /* 同 overflow-wrap: break-word */
```

#### 使用场景

```css
/* 长 URL 自动换行 */
.url {
    word-break: break-all;
}

/* 中文标题不随意断行 */
.chinese-title {
    word-break: keep-all;
}

/* 代码片段 */
.code {
    word-break: break-word;
}
```

### 3.3 overflow-wrap / word-wrap（溢出换行）

```css
/* word-wrap 是 overflow-wrap 的别名 */
overflow-wrap: normal;      /* 默认 */
overflow-wrap: break-word;  /* 单词太长时在任意位置换行 */
overflow-wrap: anywhere;    /* 任意位置换行（影响 min-content 计算） */
```

#### word-break vs overflow-wrap

```css
/* word-break: break-all */
/* 不管单词长短，都可能在任意位置断开 */
.text {
    word-break: break-all;
}
/* 结果：hello w-orld */

/* overflow-wrap: break-word */
/* 只有单词太长无法放下时才断开 */
.text {
    overflow-wrap: break-word;
}
/* 结果：hello
   worldverylongword */
```

### 3.4 white-space（空白处理）

```css
white-space: normal;      /* 默认：合并空白，自动换行 */
white-space: nowrap;      /* 合并空白，不换行 */
white-space: pre;         /* 保留空白，不换行 */
white-space: pre-wrap;    /* 保留空白，自动换行 */
white-space: pre-line;    /* 合并空白，保留换行符 */
white-space: break-spaces;/* 保留空白，自动换行（包括行尾空格） */
```

#### 行为对比

| 值 | 换行符 | 空格和制表符 | 文本换行 |
|----|--------|--------------|----------|
| normal | 合并 | 合并 | 自动换行 |
| nowrap | 合并 | 合并 | 不换行 |
| pre | 保留 | 保留 | 不换行 |
| pre-wrap | 保留 | 保留 | 自动换行 |
| pre-line | 保留 | 合并 | 自动换行 |

---

## 4. 文本溢出处理

### 4.1 单行文本溢出省略

```css
.ellipsis {
    white-space: nowrap;      /* 不换行 */
    overflow: hidden;         /* 隐藏溢出 */
    text-overflow: ellipsis;  /* 显示省略号 */
}

/* text-overflow 值 */
text-overflow: clip;      /* 裁剪（默认） */
text-overflow: ellipsis;  /* 省略号 */
text-overflow: "…";       /* 自定义字符串（部分浏览器支持） */

/* 鼠标悬停显示完整内容 */
.ellipsis[title]:hover {
    cursor: help;
}
```

### 4.2 多行文本溢出省略

```css
/* WebKit 内核浏览器 */
.multi-line-ellipsis {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;  /* 显示 3 行 */
    overflow: hidden;
}

/* 使用 line-clamp（现代标准） */
.multi-line-ellipsis {
    line-clamp: 3;
}
```

### 4.3 文本溢出示例

```css
/* 新闻标题 */
.news-title {
    width: 300px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* 文章摘要 */
.article-excerpt {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
}

/* 用户名 */
.username {
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
```

---

## 5. 字体度量与垂直对齐

### 5.1 理解字体度量

```
                ┌─────────────────┐ 上边界
                │                 │
    em 方框 ──→ │   ┌─────────┐   │
                │   │  大写字母 │   │
                │   └─────────┘   │
────────────────│─────────────────│─────── 基线 (baseline)
                │   ┌─────────┐   │
                │   │ 下伸部分  │   │
                │   └─────────┘   │
                │                 │
                └─────────────────┘ 下边界

关键度量：
- em 方框：字体大小的方框
- 基线：字母的基准线
- 上伸 (ascender)：小写字母上伸部分（如 b, d, h）
- 下伸 (descender)：字母下伸部分（如 g, j, p, y）
- 大写字母高度 (cap height)
- x 高度 (x-height)
```

### 5.2 line-height 与字体度量的关系

```css
/* 行内元素的垂直居中并非真正居中 */
.button {
    height: 40px;
    line-height: 40px;  /* 单行文本垂直居中 */
}

/* 更好的方式：使用 Flexbox */
.button {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}
```

### 5.3 图标与文字对齐

```css
/* 图标与文字对齐 */
.icon-text .icon {
    display: inline-block;
    width: 1em;
    height: 1em;
    vertical-align: -0.15em; /* 微调对齐 */
}

/* 使用 Flexbox */
.icon-text {
    display: inline-flex;
    align-items: center;
    gap: 0.5em;
}
```

---

## 6. 书写模式

### 6.1 writing-mode（书写模式）

```css
writing-mode: horizontal-tb;    /* 水平从上到下（默认） */
writing-mode: vertical-rl;      /* 垂直从右到左 */
writing-mode: vertical-lr;      /* 垂直从左到右 */
writing-mode: sideways-rl;      /* 垂直旋转从右到左 */
writing-mode: sideways-lr;      /* 垂直旋转从左到右 */
```

#### 竖排文字示例

```css
/* 古文竖排 */
.classical-text {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    height: 30em;
}

/* 垂直标题 */
.vertical-title {
    writing-mode: vertical-rl;
    text-orientation: upright; /* 字符正立 */
}
```

### 6.2 direction（文本方向）

```css
direction: ltr;  /* 从左到右（默认） */
direction: rtl;  /* 从右到左 */

/* 配合 unicode-bidi */
.arabic-text {
    direction: rtl;
    unicode-bidi: bidi-override;
}
```

---

## 7. 高级文本效果

### 7.1 文字描边（-webkit-text-stroke）

```css
/* 描边文字 */
.outline-text {
    -webkit-text-stroke: 2px black;
}

/* 描边+填充 */
.stroke-fill {
    -webkit-text-stroke: 1px black;
    color: white;
}

/* 仅描边（透明填充） */
.stroke-only {
    -webkit-text-stroke: 2px black;
    color: transparent;
}
```

### 7.2 背景剪裁文字

```css
/* 渐变文字 */
.gradient-text {
    background: linear-gradient(45deg, #f06, #3cf);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* 图片文字 */
.image-text {
    background: url('texture.jpg');
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
```

### 7.3 文字裁剪路径

```css
.clip-text {
    background: #333;
    color: white;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}

/* 渐变显示 */
.reveal-text {
    background: linear-gradient(90deg, #000 50%, transparent 50%);
    background-size: 200% 100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: reveal 2s infinite;
}

@keyframes reveal {
    from { background-position: 200% 0; }
    to { background-position: -200% 0; }
}
```

---

## 8. 可变字体

```css
/* 定义可变字体 */
@font-face {
    font-family: "VariableFont";
    src: url("VariableFont.woff2") format("woff2-variations");
    font-weight: 100 900;      /* 权重范围 */
    font-style: oblique 0deg 12deg; /* 倾斜范围 */
}

/* 使用可变字体 */
.variable-text {
    font-family: "VariableFont";
    font-weight: 450;          /* 任意权重 */
    font-style: oblique 5deg;  /* 任意倾斜角度 */
}

/* font-variation-settings（低级控制） */
.variable-text {
    font-variation-settings: 
        "wght" 450,   /* 权重 */
        "slnt" -5,    /* 倾斜 */
        "wdth" 100;   /* 宽度 */
}
```

---

## 小结

### 字体属性速查

| 属性 | 说明 | 常用值 |
|------|------|--------|
| `font-family` | 字体族 | 具体字体名 + 通用字体族 |
| `font-size` | 字体大小 | px, rem, em, % |
| `font-weight` | 字体粗细 | normal, bold, 100-900 |
| `font-style` | 字体样式 | normal, italic |
| `line-height` | 行高 | 无单位倍数（推荐） |
| `font` | 简写 | style weight size/line-height family |

### 文本属性速查

| 属性 | 说明 | 常用值 |
|------|------|--------|
| `color` | 文本颜色 | 十六进制, rgb, hsl |
| `text-align` | 文本对齐 | left, center, right, justify |
| `text-decoration` | 文本装饰 | none, underline, line-through |
| `text-transform` | 文本转换 | none, uppercase, lowercase |
| `text-indent` | 首行缩进 | em, px, % |
| `letter-spacing` | 字母间距 | em, px |
| `word-spacing` | 单词间距 | em, px |
| `text-shadow` | 文本阴影 | x y blur color |

### 溢出处理速查

| 效果 | 样式组合 |
|------|---------|
| 单行省略 | `overflow: hidden; white-space: nowrap; text-overflow: ellipsis;` |
| 多行省略 | `display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: N; overflow: hidden;` |
| 长单词换行 | `overflow-wrap: break-word;` |
| 强制换行 | `word-break: break-all;` |

---

## 参考资源

- [MDN CSS 文本](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Text)
- [CSS 文本装饰](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Text_Decoration)
- [CSS 字体](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Fonts)
- [可变字体指南](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Fonts/Variable_Fonts_Guide)

---

[返回上级目录](../index.md)
