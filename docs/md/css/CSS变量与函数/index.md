# CSS 变量与函数

> CSS 变量（自定义属性）和 CSS 函数是现代 CSS 的两大核心特性。变量使样式更具可维护性和可复用性，而函数则提供了强大的计算和动态能力。内容参考《CSS权威指南》等经典著作。

## 学习要点

- 🎯 理解 CSS 变量的作用域和继承机制
- 🔧 掌握 var() 函数的高级用法
- 📐 学会使用 calc()、min()、max()、clamp() 进行数值计算
- 🎨 了解各类 CSS 函数的应用场景

---

## 1. CSS 自定义属性（变量）

### 1.1 基本语法

```css
/* 定义变量：以 -- 开头 */
:root {
    --primary-color: #1890ff;
    --font-size-base: 16px;
    --spacing-unit: 8px;
}

/* 使用变量：var() 函数 */
.button {
    color: var(--primary-color);
    font-size: var(--font-size-base);
    padding: var(--spacing-unit);
}
```

### 1.2 变量命名规则

```css
/* ✅ 合法的变量名 */
:root {
    --color: red;                    /* 简单名称 */
    --primary-color: blue;           /* 连字符 */
    --color_primary: green;          /* 下划线 */
    --FontSize: 16px;                /* 大小写敏感 */
    --font-size: 14px;               /* 与上面不同 */
    --1color: red;                   /* 数字开头 */
    ----color: blue;                 /* 多个连字符 */
    --🎯: target;                    /* Unicode 字符（不推荐） */
}

/* ❌ 非法变量名 */
/* $color: red;      错误：$ 是 Sass 语法 */
/* @color: red;      错误：@ 是 CSS 规则前缀 */
```

### 1.3 作用域与继承

CSS 变量具有作用域，子元素会继承父元素的变量：

```css
/* 全局作用域（推荐用于主题变量） */
:root {
    --global-color: #1890ff;
}

/* 局部作用域 */
.card {
    --card-padding: 16px;  /* 只在 .card 及其子元素可用 */
    padding: var(--card-padding);
}

.card-header {
    padding: var(--card-padding);  /* 继承父元素变量 */
}

/* 变量覆盖 */
.dark-theme {
    --global-color: #52c41a;  /* 覆盖全局变量 */
}

/* 具体元素覆盖 */
.button {
    --button-bg: #1890ff;
    background: var(--button-bg);
}

.button.secondary {
    --button-bg: #f0f0f0;  /* 只在 .secondary 覆盖 */
    background: var(--button-bg);
}
```

#### 作用域示意图

```
:root
  │
  ├── --global-color: blue (全局可用)
  │
  └── .card
        │
        ├── --card-padding: 16px (.card 及子元素可用)
        │
        └── .card-header
              │
              └── 可使用 --global-color 和 --card-padding
```

### 1.4 var() 函数详解

#### 基本用法

```css
/* 基本使用 */
color: var(--primary-color);

/* 带默认值 */
color: var(--primary-color, blue);        /* 变量未定义时使用 blue */
font-size: var(--font-size, 14px);        /* 变量未定义时使用 14px */

/* 默认值可以是另一个变量 */
color: var(--primary-color, var(--default-color, #333));

/* 默认值可以包含空格 */
font-family: var(--font-family, "Helvetica Neue", sans-serif);
```

#### 默认值陷阱

```css
/* ⚠️ 注意：默认值在逗号处结束 */
padding: var(--gap, 10px 20px);     /* ✅ 正确 */
padding: var(--gap, 10px, 20px);    /* ❌ 错误：20px 被视为无效值 */

/* 多值的正确处理 */
:root {
    --padding-default: 10px 20px;
}
padding: var(--padding, var(--padding-default));
```

#### var() 的限制

```css
/* ❌ 不能用于属性名 */
.--side: margin-left;
var(--side): 10px;  /* 无效 */

/* ❌ 不能单独作为值的一部分 */
.foo {
    --gap: 20;
    margin: var(--gap)px;  /* 无效：会产生 "20px" 字符串 */
}

/* ✅ 正确做法：使用 calc() */
.foo {
    --gap: 20;
    margin: calc(var(--gap) * 1px);  /* 20px */
}
```

### 1.5 变量类型

CSS 变量可以存储任何 CSS 值：

```css
:root {
    /* 颜色 */
    --color-primary: #1890ff;
    --color-secondary: rgba(0, 0, 0, 0.5);
    
    /* 长度 */
    --spacing: 16px;
    --width: 50%;
    --line-height: 1.5;
    
    /* 时间 */
    --transition-duration: 0.3s;
    --animation-delay: 200ms;
    
    /* 字符串 */
    --font-family: "Helvetica Neue", sans-serif;
    --content: "→";
    
    /* 函数 */
    --gradient: linear-gradient(to right, #f06, #3cf);
    --transform: translateX(10px) rotate(45deg);
    
    /* 整个声明块（配合 CSS Houdini） */
    --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

### 1.6 实际应用模式

#### 主题切换

```css
/* 定义主题变量 */
:root {
    --bg-color: #ffffff;
    --text-color: #333333;
    --border-color: #e8e8e8;
}

[data-theme="dark"] {
    --bg-color: #1a1a1a;
    --text-color: #f0f0f0;
    --border-color: #333333;
}

/* 应用主题 */
body {
    background-color: var(--bg-color);
    color: var(--text-color);
}

.card {
    background-color: var(--bg-color);
    border: 1px solid var(--border-color);
}
```

#### 设计系统

```css
:root {
    /* 颜色系统 */
    --color-primary: #1890ff;
    --color-primary-light: #40a9ff;
    --color-primary-dark: #096dd9;
    --color-success: #52c41a;
    --color-warning: #faad14;
    --color-danger: #ff4d4f;
    
    /* 字体系统 */
    --font-size-xs: 12px;
    --font-size-sm: 14px;
    --font-size-base: 16px;
    --font-size-lg: 18px;
    --font-size-xl: 20px;
    
    /* 间距系统（8px 基础单位） */
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
    
    /* 圆角系统 */
    --radius-sm: 2px;
    --radius-md: 4px;
    --radius-lg: 8px;
    --radius-full: 9999px;
    
    /* 阴影系统 */
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}

/* 使用设计系统 */
.button {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-sm);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
}
```

#### 响应式间距

```css
:root {
    --container-padding: 16px;
}

@media (min-width: 768px) {
    :root {
        --container-padding: 24px;
    }
}

@media (min-width: 1200px) {
    :root {
        --container-padding: 32px;
    }
}

.container {
    padding: 0 var(--container-padding);
}
```

### 1.7 JavaScript 操作变量

```javascript
// 获取变量值
const root = document.documentElement;
const primaryColor = getComputedStyle(root).getPropertyValue('--primary-color');
console.log(primaryColor);  // "#1890ff"

// 设置变量值
root.style.setProperty('--primary-color', '#52c41a');

// 局部设置
const card = document.querySelector('.card');
card.style.setProperty('--card-padding', '24px');

// 移除变量
root.style.removeProperty('--primary-color');

// 批量设置
const theme = {
    '--bg-color': '#1a1a1a',
    '--text-color': '#f0f0f0',
    '--border-color': '#333333'
};

Object.entries(theme).forEach(([key, value]) => {
    root.style.setProperty(key, value);
});
```

#### 动态主题切换示例

```javascript
// 定义主题
const themes = {
    light: {
        '--bg-color': '#ffffff',
        '--text-color': '#333333',
        '--primary-color': '#1890ff'
    },
    dark: {
        '--bg-color': '#1a1a1a',
        '--text-color': '#f0f0f0',
        '--primary-color': '#40a9ff'
    }
};

// 切换主题
function setTheme(themeName) {
    const theme = themes[themeName];
    Object.entries(theme).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
    });
    localStorage.setItem('theme', themeName);
}

// 初始化主题
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);
```

### 1.8 CSS @property（自定义属性注册）

CSS Houdini 的 `@property` 允许为变量定义类型和初始值：

```css
/* 注册自定义属性 */
@property --gradient-angle {
    syntax: '<angle>';        /* 类型：角度 */
    initial-value: 0deg;      /* 初始值 */
    inherits: false;          /* 是否继承 */
}

@property --primary-hue {
    syntax: '<integer>';      /* 类型：整数 */
    initial-value: 210;
    inherits: true;
}

/* 使用注册后的属性（支持动画） */
.animated-gradient {
    --gradient-angle: 0deg;
    background: linear-gradient(var(--gradient-angle), #f06, #3cf);
    animation: rotate-gradient 3s linear infinite;
}

@keyframes rotate-gradient {
    to {
        --gradient-angle: 360deg;  /* 可以动画了！ */
    }
}

/* 颜色动画 */
@property --color-h {
    syntax: '<integer>';
    initial-value: 0;
    inherits: false;
}

.color-animation {
    --color-h: 0;
    color: hsl(var(--color-h), 100%, 50%);
    animation: color-shift 5s linear infinite;
}

@keyframes color-shift {
    to {
        --color-h: 360;
    }
}
```

#### syntax 类型值

```css
/* 支持的类型 */
@property --example {
    syntax: '<length>';       /* 长度：10px, 2em */
    syntax: '<percentage>';   /* 百分比：50% */
    syntax: '<length-percentage>';  /* 长度或百分比 */
    syntax: '<color>';        /* 颜色 */
    syntax: '<integer>';      /* 整数 */
    syntax: '<number>';       /* 数字（含小数） */
    syntax: '<angle>';        /* 角度：45deg, 0.5turn */
    syntax: '<time>';         /* 时间：1s, 500ms */
    syntax: '<resolution>';   /* 分辨率：2dppx */
    syntax: '<transform-function>';  /* 变换函数 */
    syntax: '<custom-ident>'; /* 自定义标识符 */
    syntax: '<url>';          /* URL */
    syntax: '*';              /* 任意值（但失去类型检查） */
}
```

---

## 2. 数学计算函数

### 2.1 calc() 函数

`calc()` 允许在 CSS 中进行数学计算，支持加减乘除：

```css
/* 基本用法 */
.box {
    width: calc(100% - 20px);          /* 减法 */
    height: calc(50% + 10px);          /* 加法 */
    padding: calc(1em + 10px);         /* 混合单位 */
    margin: calc(var(--spacing) * 2);  /* 乘法 */
    font-size: calc(16px / 2);         /* 除法 */
}

/* 运算符规则 */
.box {
    /* 运算符前后必须有空格 */
    width: calc(100% - 20px);   /* ✅ 正确 */
    width: calc(100%-20px);     /* ❌ 错误 */
    
    /* 乘除法可以省略一边空格 */
    width: calc(50%*2);         /* ✅ 正确 */
    width: calc(50% * 2);       /* ✅ 正确 */
    
    /* 除数不能为 0 */
    /* width: calc(100px / 0);  ❌ 无效 */
}
```

#### 混合单位计算

```css
/* calc() 最大的优势：混合单位 */
.sidebar {
    width: calc(100% - 300px);  /* % 和 px 混合 */
}

.footer {
    height: calc(10vh + 50px);  /* vh 和 px 混合 */
}

.grid-item {
    width: calc(33.33% - 1rem); /* % 和 rem 混合 */
}
```

#### 常见应用场景

```css
/* 固定宽度侧边栏布局 */
.layout {
    display: flex;
}
.sidebar {
    width: 250px;
    flex-shrink: 0;
}
.main {
    width: calc(100% - 250px);
}

/* 全屏覆盖（排除导航） */
.hero {
    min-height: calc(100vh - 60px);  /* 视口高度减去导航高度 */
}

/* 等宽列（含间距） */
.grid {
    display: grid;
    grid-template-columns: repeat(3, calc((100% - 2rem) / 3));
    gap: 1rem;
}

/* 自适应字体大小 */
.title {
    font-size: calc(16px + 1vw);  /* 基础大小 + 响应式增量 */
}

/* 居中技巧 */
.centered {
    position: absolute;
    top: calc(50% - 50px);  /* 已知高度时 */
    left: calc(50% - 100px); /* 已知宽度时 */
}

/* 更好的居中（未知尺寸） */
.centered-unknown {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
```

### 2.2 min() 函数

`min()` 返回参数中的最小值：

```css
/* 语法 */
width: min(value1, value2, ...);

/* 基本用法 */
.box {
    width: min(50%, 300px);  /* 取较小值：最大 300px */
    height: min(100vh, 800px); /* 最大 800px */
}

/* 多个值 */
.box {
    width: min(100% - 20px, 500px, 30vw);
}

/* 常见应用 */
.container {
    /* 响应式容器：最小值优先 */
    width: min(90%, 1200px);
    margin: 0 auto;
}

.font-responsive {
    /* 字体最大 18px */
    font-size: min(4vw, 18px);
}
```

#### min() 与 max-width 的区别

```css
/* 两种方式等效 */
.approach1 {
    width: 50%;
    max-width: 300px;
}

.approach2 {
    width: min(50%, 300px);
}

/* min() 更灵活（可设置多个约束） */
.flexible {
    width: min(100% - 2rem, 600px, 40vw);
}
```

### 2.3 max() 函数

`max()` 返回参数中的最大值：

```css
/* 语法 */
width: max(value1, value2, ...);

/* 基本用法 */
.box {
    width: max(50%, 300px);   /* 取较大值：最小 300px */
    font-size: max(14px, 1.2vw);  /* 最小 14px */
}

/* 多个值 */
.box {
    width: max(100px, 20%, 10vw);
}

/* 常见应用 */
.text {
    /* 响应式字体：最小值保证 */
    font-size: max(16px, 1.5vw);
}

.sidebar {
    /* 侧边栏最小宽度 */
    width: max(200px, 20%);
}

.safe-area {
    /* 安全区域 */
    padding-left: max(16px, env(safe-area-inset-left));
    padding-right: max(16px, env(safe-area-inset-right));
}
```

### 2.4 clamp() 函数

`clamp()` 返回一个介于最小值和最大值之间的值：

```css
/* 语法：clamp(最小值, 理想值, 最大值) */
width: clamp(min, preferred, max);

/* 基本用法 */
.box {
    /* 宽度：最小 200px，理想 50%，最大 600px */
    width: clamp(200px, 50%, 600px);
}

/* 响应式字体 */
.title {
    /* 字体：最小 1rem，理想 5vw，最大 3rem */
    font-size: clamp(1rem, 5vw, 3rem);
}

.text {
    font-size: clamp(14px, 1.2vw + 0.5rem, 20px);
}
```

#### clamp() 工作原理

```
clamp(200px, 50%, 600px):

┌─────────────────────────────────────────────────────┐
│  视口宽度 < 400px    │  视口宽度 = 400-1200px      │  视口宽度 > 1200px  │
│  50% < 200px        │  200px ≤ 50% ≤ 600px       │  50% > 600px       │
│  使用最小值 200px    │  使用理想值 50%             │  使用最大值 600px   │
└─────────────────────────────────────────────────────┘
```

#### 实际应用示例

```css
/* 响应式容器 */
.container {
    width: clamp(320px, 90%, 1200px);
    margin: 0 auto;
}

/* 响应式间距 */
.section {
    padding: clamp(1rem, 5vw, 3rem);
}

/* 响应式标题 */
h1 {
    font-size: clamp(2rem, 4vw + 1rem, 4rem);
}

/* 响应式行高 */
p {
    line-height: clamp(1.4, 1.2 + 0.2vw, 1.8);
}

/* 玻璃卡片效果 */
.glass-card {
    width: clamp(280px, 30vw, 400px);
    padding: clamp(1rem, 3vw, 2rem);
    border-radius: clamp(0.5rem, 2vw, 1.5rem);
}
```

---

## 3. 比较函数

### 3.1 min() / max() / clamp() 对比

```css
/* 三者关系 */
width: clamp(min, preferred, max);

/* 等价于 */
width: max(min, min(preferred, max));

/* 实例对比 */
.element {
    /* 使用 clamp */
    width: clamp(100px, 50%, 500px);
    
    /* 等价的组合 */
    width: max(100px, min(50%, 500px));
}
```

### 3.2 选择指南

| 需求场景 | 推荐函数 | 示例 |
|---------|---------|------|
| 限制最大宽度 | `min()` | `min(100%, 1200px)` |
| 保证最小宽度 | `max()` | `max(300px, 30%)` |
| 同时限制范围 | `clamp()` | `clamp(300px, 50%, 1200px)` |
| 响应式字体 | `clamp()` | `clamp(1rem, 2.5vw, 2rem)` |
| 安全区域内边距 | `max()` | `max(16px, env(safe-area-inset-left))` |

---

## 4. 颜色函数

### 4.1 基础颜色函数

```css
/* RGB / RGBA */
color: rgb(255, 0, 0);
color: rgba(255, 0, 0, 0.5);
color: rgb(255 0 0);           /* 现代语法 */
color: rgb(255 0 0 / 50%);     /* 现代语法 */

/* HSL / HSLA */
color: hsl(0, 100%, 50%);
color: hsla(0, 100%, 50%, 0.5);
color: hsl(0deg 100% 50%);     /* 现代语法 */
color: hsl(0 100% 50% / 50%);  /* 现代语法 */

/* HWB（Hue-Whiteness-Blackness） */
color: hwb(0 0% 0%);           /* 纯红 */
color: hwb(0 20% 0%);          /* 红色 + 20% 白 */
color: hwb(0 0% 20%);          /* 红色 + 20% 黑 */
```

### 4.2 现代颜色函数

```css
/* LAB 颜色空间 */
color: lab(50% 0 0);           /* 中灰 */
color: lab(50% 80 0);          /* 鲜红 */
color: lab(50% 0 80);          /* 鲜蓝 */

/* LCH（Lab 的极坐标形式） */
color: lch(50% 100 0deg);      /* 亮度50%，彩度100，色相0度 */
color: lch(70% 50 180deg);     /* 青色 */

/* OKLab / OKLCH（更好的感知均匀性） */
color: oklab(0.5 0.1 0.1);
color: oklch(0.5 0.1 180deg);
```

### 4.3 color-mix() 颜色混合

```css
/* 基本语法 */
color: color-mix(in 颜色空间, 颜色1 百分比, 颜色2 百分比);

/* 等比例混合 */
color: color-mix(in srgb, red, blue);        /* 50% 红 + 50% 蓝 = 紫色 */

/* 不等比例 */
color: color-mix(in srgb, red 70%, blue);    /* 70% 红 + 30% 蓝 */

/* 不同颜色空间 */
color: color-mix(in lch, red, blue);
color: color-mix(in oklch, red, blue);
color: color-mix(in hsl, red, blue);
```

#### 实际应用

```css
:root {
    --primary: #1890ff;
    --success: #52c41a;
    
    /* 自动生成变体 */
    --primary-light: color-mix(in srgb, var(--primary), white 30%);
    --primary-dark: color-mix(in srgb, var(--primary), black 30%);
    --primary-transparent: color-mix(in srgb, var(--primary), transparent 50%);
    
    /* 禁用状态 */
    --primary-disabled: color-mix(in srgb, var(--primary), gray 50%);
}

.button {
    background: var(--primary);
}

.button:hover {
    background: var(--primary-light);
}

.button:disabled {
    background: var(--primary-disabled);
}
```

### 4.4 color-contrast() 对比色

```css
/* 自动选择对比色（实验性） */
color: color-contrast(red vs white, black);  /* 返回对比度更高的颜色 */

/* 实际应用 */
.text {
    background: var(--bg);
    color: color-contrast(var(--bg) vs #333, #fff);
}
```

---

## 5. 其他常用函数

### 5.1 env() 环境变量

```css
/* 安全区域（iOS 刘海屏） */
.safe-area {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
}

/* 全屏布局 */
.fullscreen {
    height: 100vh;
    height: 100dvh;  /* 动态视口高度 */
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
}

/* 回退值 */
.box {
    padding-top: env(safe-area-inset-top, 20px);
}
```

### 5.2 attr() 获取属性值

```css
/* 从 HTML 属性获取值 */
[data-tooltip]::after {
    content: attr(data-tooltip);
}

/* 配合 CSS 变量使用 */
.progress-bar {
    --progress: attr(value);
    width: calc(var(--progress) * 1%);
}

/* 自定义提示 */
[tooltip]::before {
    content: attr(tooltip);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    padding: 4px 8px;
    background: #333;
    color: #fff;
    font-size: 12px;
    white-space: nowrap;
}
```

### 5.3 url() 资源引用

```css
/* 图片 */
background-image: url('image.jpg');
background-image: url(image.jpg);     /* 无引号也可以 */
background-image: url("./images/bg.png");

/* 字体 */
@font-face {
    src: url('font.woff2') format('woff2');
}

/* SVG（内联） */
background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23333" d="M7 10l5 5 5-5z"/></svg>');

/* Base64 */
background: url('data:image/png;base64,iVBORw0KGgo...');
```

### 5.4 image-set() 响应式图片

```css
/* 根据设备像素比选择图片 */
background-image: image-set(
    'image-1x.jpg' 1x,
    'image-2x.jpg' 2x,
    'image-3x.jpg' 3x
);

/* 指定图片格式 */
background-image: image-set(
    'image.webp' type('image/webp') 1x,
    'image.jpg' type('image/jpeg') 1x
);

/* 响应式 + 格式 */
background-image: image-set(
    'image-small.webp' type('image/webp') 1x,
    'image-small.jpg' type('image/jpeg') 1x,
    'image-large.webp' type('image/webp') 2x,
    'image-large.jpg' type('image/jpeg') 2x
);
```

### 5.5 element() 元素引用

```css
/* 将元素作为背景（仅 Firefox 支持） */
.preview {
    background: element(#source-element);
}

/* 实时预览 */
#preview {
    background: element(#editor);
    background-size: contain;
}
```

### 5.6 toggle() 切换值

```css
/* 在列表项间切换值（实验性） */
li {
    list-style-type: toggle(disc, circle, square);
}

/* 交替颜色 */
li {
    background: toggle(#fff, #f0f0f0);
}
```

---

## 6. 渐变函数

### 6.1 线性渐变

```css
/* 基本语法 */
background: linear-gradient(方向, 颜色1, 颜色2, ...);

/* 方向关键字 */
background: linear-gradient(to right, red, blue);
background: linear-gradient(to bottom right, red, blue);

/* 角度 */
background: linear-gradient(45deg, red, blue);
background: linear-gradient(0deg, red, blue);    /* 从下到上 */
background: linear-gradient(90deg, red, blue);   /* 从左到右 */

/* 多色渐变 */
background: linear-gradient(red, yellow, green, blue);

/* 颜色停止点 */
background: linear-gradient(red 0%, red 30%, blue 30%, blue 100%);
```

### 6.2 径向渐变

```css
/* 基本语法 */
background: radial-gradient(形状 大小 at 位置, 颜色1, 颜色2, ...);

/* 形状 */
background: radial-gradient(circle, red, blue);
background: radial-gradient(ellipse, red, blue);

/* 大小 */
background: radial-gradient(closest-side, red, blue);
background: radial-gradient(farthest-corner, red, blue);
background: radial-gradient(circle 100px, red, blue);

/* 位置 */
background: radial-gradient(at center, red, blue);
background: radial-gradient(at top left, red, blue);
background: radial-gradient(circle at 50% 50%, red, blue);
```

### 6.3 锥形渐变

```css
/* 基本语法 */
background: conic-gradient(from 起始角度 at 中心位置, 颜色1 角度1, ...);

/* 基本用法 */
background: conic-gradient(red, yellow, blue, red);

/* 指定角度 */
background: conic-gradient(from 0deg, red, yellow, blue);

/* 指定中心 */
background: conic-gradient(at 50% 50%, red, yellow, blue);

/* 饼图 */
background: conic-gradient(
    red 0deg 120deg,
    yellow 120deg 200deg,
    blue 200deg 360deg
);
```

### 6.4 重复渐变

```css
/* 重复线性渐变 */
background: repeating-linear-gradient(
    45deg,
    red,
    red 10px,
    blue 10px,
    blue 20px
);

/* 重复径向渐变 */
background: repeating-radial-gradient(
    circle,
    red,
    red 10px,
    blue 10px,
    blue 20px
);

/* 重复锥形渐变 */
background: repeating-conic-gradient(
    red 0deg 30deg,
    blue 30deg 60deg
);
```

---

## 7. 滤镜函数

### 7.1 filter 属性

```css
/* 模糊 */
filter: blur(5px);

/* 亮度 */
filter: brightness(1.2);  /* 120% 亮度 */
filter: brightness(0.8);  /* 80% 亮度 */

/* 对比度 */
filter: contrast(1.5);

/* 灰度 */
filter: grayscale(100%);  /* 完全灰度 */
filter: grayscale(50%);   /* 50% 灰度 */

/* 色相旋转 */
filter: hue-rotate(90deg);

/* 反转 */
filter: invert(100%);     /* 颜色反转 */

/* 透明度 */
filter: opacity(50%);

/* 饱和度 */
filter: saturate(2);      /* 双倍饱和度 */
filter: saturate(0);      /* 无饱和度（灰度） */

/* 褐色 */
filter: sepia(100%);

/* 阴影 */
filter: drop-shadow(4px 4px 10px rgba(0, 0, 0, 0.5));

/* 组合滤镜 */
filter: brightness(1.1) contrast(1.2) saturate(1.3);
```

### 7.2 backdrop-filter

```css
/* 背景滤镜（毛玻璃效果） */
.glass {
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(10px);
}

/* 组合效果 */
.glass-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 暗色毛玻璃 */
.glass-dark {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px) brightness(0.8);
}
```

---

## 8. 变换函数

### 8.1 2D 变换

```css
/* 平移 */
transform: translate(50px, 100px);
transform: translateX(50px);
transform: translateY(100px);

/* 缩放 */
transform: scale(2);
transform: scale(1.5, 0.8);
transform: scaleX(1.5);
transform: scaleY(0.8);

/* 旋转 */
transform: rotate(45deg);
transform: rotate(0.5turn);

/* 倾斜 */
transform: skew(10deg, 20deg);
transform: skewX(10deg);
transform: skewY(20deg);

/* 矩阵 */
transform: matrix(1, 0, 0, 1, 50, 100);
```

### 8.2 3D 变换

```css
/* 透视 */
transform: perspective(1000px);

/* 3D 平移 */
transform: translateZ(100px);
transform: translate3d(10px, 20px, 30px);

/* 3D 旋转 */
transform: rotateX(45deg);
transform: rotateY(45deg);
transform: rotateZ(45deg);
transform: rotate3d(1, 1, 0, 45deg);

/* 3D 缩放 */
transform: scaleZ(2);
transform: scale3d(1, 1, 2);
```

---

## 9. 计数器函数

### 9.1 counter()

```css
/* 定义计数器 */
body {
    counter-reset: section;  /* 初始化计数器 */
}

h2::before {
    counter-increment: section;  /* 递增计数器 */
    content: "Section " counter(section) ": ";
}

/* 嵌套计数器 */
ol {
    counter-reset: item;
}
li {
    counter-increment: item;
}
li::before {
    content: counter(item) ". ";
}

/* 多级编号 */
h1 { counter-reset: chapter; }
h1::before {
    counter-increment: chapter;
    content: "Chapter " counter(chapter) ". ";
}

h2 { counter-reset: section; }
h2::before {
    counter-increment: section;
    content: counter(chapter) "." counter(section) " ";
}
```

### 9.2 counters()

```css
/* 嵌套列表编号 */
ol {
    counter-reset: item;
    list-style-type: none;
}

li {
    counter-increment: item;
}

li::before {
    content: counters(item, ".") " ";
}

/* 结果：
1. 第一项
   1.1 子项
   1.2 子项
2. 第二项
   2.1 子项
*/
```

---

## 10. 选择器函数

### 10.1 :is()

```css
/* 匹配任意选择器 */
:is(h1, h2, h3) {
    font-weight: bold;
}

/* 复杂选择器简化 */
/* 传统写法 */
header a:hover, footer a:hover, nav a:hover {
    color: red;
}

/* 使用 :is() */
:is(header, footer, nav) a:hover {
    color: red;
}

/* 允容错（忽略无效选择器） */
:is(.valid, :unsupported) {
    /* :unsupported 无效，但 .valid 仍生效 */
}
```

### 10.2 :where()

```css
/* 类似 :is()，但优先级为 0 */
:where(h1, h2, h3) {
    font-weight: bold;
}

/* 用于重置样式 */
:where(ul, ol) {
    margin: 0;
    padding: 0;
}

/* 可以被覆盖 */
article :where(h1, h2) {
    color: blue;  /* 优先级为 0 */
}

article h1 {
    color: red;   /* 可以覆盖上面的样式 */
}
```

### 10.3 :has()

```css
/* 包含选择器（父选择器） */
/* 选择包含 img 的 a 标签 */
a:has(img) {
    display: block;
}

/* 选择包含 h2 的 section */
section:has(h2) {
    border-top: 2px solid #333;
}

/* 选择后面有 figcaption 的 figure */
figure:has(figcaption) {
    padding: 1rem;
}

/* 复杂组合 */
form:has(:invalid) button {
    opacity: 0.5;
}

/* 子状态 */
label:has(input:checked) {
    font-weight: bold;
}
```

---

## 11. 实战案例

### 11.1 主题系统

```css
/* 主题变量定义 */
:root {
    /* 颜色 */
    --color-primary: #1890ff;
    --color-success: #52c41a;
    --color-warning: #faad14;
    --color-danger: #ff4d4f;
    
    /* 色调变量（HSL） */
    --primary-h: 210;
    --primary-s: 100%;
    --primary-l: 50%;
    
    /* 动态变体 */
    --primary: hsl(var(--primary-h), var(--primary-s), var(--primary-l));
    --primary-light: hsl(var(--primary-h), var(--primary-s), calc(var(--primary-l) + 15%));
    --primary-dark: hsl(var(--primary-h), var(--primary-s), calc(var(--primary-l) - 15%));
}

/* 暗色主题 */
[data-theme="dark"] {
    --primary-l: 60%;
    --color-bg: #1a1a1a;
    --color-text: #f0f0f0;
}

/* 使用 */
.button {
    background: var(--primary);
    border-color: var(--primary);
}

.button:hover {
    background: var(--primary-light);
}

.button:active {
    background: var(--primary-dark);
}
```

### 11.2 响应式排版

```css
:root {
    /* 流式排版 */
    --font-size-min: 16px;
    --font-size-max: 20px;
    --viewport-min: 320px;
    --viewport-max: 1200px;
}

body {
    font-size: clamp(
        var(--font-size-min),
        var(--font-size-min) + (var(--font-size-max) - var(--font-size-min)) * 
            ((100vw - var(--viewport-min)) / (var(--viewport-max) - var(--viewport-min))),
        var(--font-size-max)
    );
}

/* 简化版 */
h1 {
    font-size: clamp(2rem, 4vw + 1rem, 4rem);
    line-height: clamp(1.2, 1.2 + 0.2vw, 1.4);
}

h2 {
    font-size: clamp(1.5rem, 3vw + 0.5rem, 2.5rem);
}
```

### 11.3 智能间距系统

```css
:root {
    --spacing-base: 8px;
    
    /* 倍数间距 */
    --spacing-xs: calc(var(--spacing-base) * 0.5);  /* 4px */
    --spacing-sm: var(--spacing-base);               /* 8px */
    --spacing-md: calc(var(--spacing-base) * 2);    /* 16px */
    --spacing-lg: calc(var(--spacing-base) * 3);    /* 24px */
    --spacing-xl: calc(var(--spacing-base) * 4);    /* 32px */
    
    /* 响应式间距 */
    --section-padding: clamp(2rem, 5vw, 4rem);
}

.section {
    padding: var(--section-padding);
}

.card {
    padding: var(--spacing-md);
    gap: var(--spacing-sm);
}
```

### 11.4 动态颜色系统

```css
:root {
    --base-hue: 210;
    
    /* 语义化颜色 */
    --color-primary: hsl(var(--base-hue), 100%, 50%);
    --color-primary-soft: hsl(var(--base-hue), 50%, 95%);
    --color-primary-muted: hsl(var(--base-hue), 30%, 50%);
    
    /* 补色 */
    --color-complement: hsl(calc(var(--base-hue) + 180), 100%, 50%);
    
    /* 类似色 */
    --color-analogous-1: hsl(calc(var(--base-hue) - 30), 100%, 50%);
    --color-analogous-2: hsl(calc(var(--base-hue) + 30), 100%, 50%);
    
    /* 三色组 */
    --color-triad-1: hsl(calc(var(--base-hue) + 120), 100%, 50%);
    --color-triad-2: hsl(calc(var(--base-hue) + 240), 100%, 50%);
}

/* JavaScript 动态调整色相 */
// document.documentElement.style.setProperty('--base-hue', '280');
```

---

## 小结

### CSS 变量速查

| 特性 | 说明 | 示例 |
|------|------|------|
| 定义 | 以 `--` 开头 | `--color: red;` |
| 使用 | `var()` 函数 | `color: var(--color);` |
| 默认值 | 第二个参数 | `var(--color, blue)` |
| 作用域 | 级联继承 | `:root` 全局，元素内局部 |
| JS 操作 | `setProperty()` | `el.style.setProperty('--x', '10px')` |

### 数学函数速查

| 函数 | 说明 | 示例 |
|------|------|------|
| `calc()` | 数学计算 | `calc(100% - 20px)` |
| `min()` | 取最小值 | `min(50%, 300px)` |
| `max()` | 取最大值 | `max(16px, 2vw)` |
| `clamp()` | 限制范围 | `clamp(16px, 2vw, 32px)` |

### 颜色函数速查

| 函数 | 说明 | 示例 |
|------|------|------|
| `rgb()` | RGB 颜色 | `rgb(255, 0, 0)` |
| `hsl()` | HSL 颜色 | `hsl(0, 100%, 50%)` |
| `lab()` | LAB 颜色 | `lab(50% 80 0)` |
| `color-mix()` | 颜色混合 | `color-mix(in srgb, red, blue)` |

### 滤镜函数速查

| 函数 | 说明 | 示例 |
|------|------|------|
| `blur()` | 模糊 | `blur(5px)` |
| `brightness()` | 亮度 | `brightness(1.2)` |
| `contrast()` | 对比度 | `contrast(1.5)` |
| `grayscale()` | 灰度 | `grayscale(100%)` |
| `hue-rotate()` | 色相旋转 | `hue-rotate(90deg)` |
| `drop-shadow()` | 阴影 | `drop-shadow(4px 4px 10px rgba(0,0,0,0.5))` |

---

## 参考资源

- [MDN CSS 自定义属性](https://developer.mozilla.org/zh-CN/docs/Web/CSS/--*)
- [MDN CSS 函数](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Functions)
- [CSS @property](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@property)
- [CSS color-mix()](https://developer.mozilla.org/zh-CN/docs/Web/CSS/color_value/color-mix)

---

[返回上级目录](../index.md)
