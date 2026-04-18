# 布局基础

> CSS 布局的核心是理解文档流、浮动和定位。掌握这三大布局机制，才能实现各种复杂的页面布局效果。

## 学习要点

- 📊 理解文档流和脱离文档流
- 🎯 掌握浮动的原理和清除方法
- 📍 深入理解定位机制和层叠上下文
- 🔄 理解 display、position、float 的相互影响

---

## 1. 文档流（Normal Flow）

### 1.1 什么是文档流

```
文档流是元素在页面中默认的排列方式：
- 块级元素：从上到下垂直排列
- 行内元素：从左到右水平排列（一行排满换行）

文档流是布局的基础，其他布局方式（浮动、定位）都是建立在脱离文档流的基础上。
```

### 1.2 文档流中的元素

```html
<!-- 块级元素：垂直排列 -->
<div>块级元素 1</div>
<div>块级元素 2</div>
<div>块级元素 3</div>

<!-- 行内元素：水平排列 -->
<span>行内元素 1</span>
<span>行内元素 2</span>
<span>行内元素 3</span>
```

```
块级元素排列：
┌──────────────────────────┐
│       块级元素 1          │
└──────────────────────────┘
┌──────────────────────────┐
│       块级元素 2          │
└──────────────────────────┘
┌──────────────────────────┐
│       块级元素 3          │
└──────────────────────────┘

行内元素排列：
┌──────┐┌──────┐┌──────┐
│inline││inline││inline│
│  1   ││  2   ││  3   │
└──────┘└──────┘└──────┘
```

### 1.3 脱离文档流

```css
/* 脱离文档流的方式 */

/* 1. 浮动 */
.floated {
    float: left;
    /* 脱离文档流，但仍影响行内内容 */
}

/* 2. 绝对定位 */
.absolutely-positioned {
    position: absolute;
    /* 完全脱离文档流 */
}

/* 3. 固定定位 */
.fixed-positioned {
    position: fixed;
    /* 完全脱离文档流 */
}

/* 注意：相对定位不脱离文档流 */
.relatively-positioned {
    position: relative;
    /* 仍在文档流中，只是视觉上偏移 */
}
```

### 1.4 脱离文档流的影响

```html
<style>
    .parent {
        border: 2px solid red;
        padding: 10px;
    }
    .normal-child {
        background: lightblue;
        height: 50px;
    }
    .floated-child {
        float: left;
        background: lightgreen;
        height: 80px;
    }
</style>

<!-- 正常文档流：父元素高度包含子元素 -->
<div class="parent">
    <div class="normal-child">正常子元素</div>
</div>

<!-- 子元素浮动：父元素高度塌陷 -->
<div class="parent">
    <div class="floated-child">浮动子元素</div>
    <!-- 父元素高度为 0（只剩 padding） -->
</div>
```

---

## 2. display 属性

### 2.1 常用值

```css
/* 块级显示 */
display: block;

/* 行内显示 */
display: inline;

/* 行内块显示 */
display: inline-block;

/* 隐藏（不占据空间） */
display: none;

/* 弹性布局 */
display: flex;
display: inline-flex;

/* 网格布局 */
display: grid;
display: inline-grid;
```

### 2.2 display 对元素的影响

```css
/* block：块级元素 */
.block {
    display: block;
    /* 特点：
     * 1. 独占一行
     * 2. 可设置宽高
     * 3. 可设置 margin/padding 四个方向
     * 4. 宽度默认填满父容器
     */
}

/* inline：行内元素 */
.inline {
    display: inline;
    /* 特点：
     * 1. 不独占一行
     * 2. 不可设置宽高（由内容决定）
     * 3. 只能设置水平 margin/padding
     * 4. 垂直 padding 有视觉效果但不占空间
     */
}

/* inline-block：行内块元素 */
.inline-block {
    display: inline-block;
    /* 特点：
     * 1. 不独占一行
     * 2. 可设置宽高
     * 3. 可设置四个方向 margin/padding
     * 4. 基线对齐问题
     */
}

/* none：隐藏元素 */
.hidden {
    display: none;
    /* 特点：
     * 1. 元素完全消失
     * 2. 不占据空间
     * 3. 不影响布局
     * 4. 子元素也不显示
     */
}

/* visibility: hidden vs display: none */
.invisible {
    visibility: hidden;
    /* 元素隐藏但仍占据空间 */
}

.removed {
    display: none;
    /* 元素完全移除，不占空间 */
}
```

### 2.3 行内块的基线对齐问题

```html
<style>
    .container {
        border: 1px solid #ccc;
    }
    .box {
        display: inline-block;
        width: 100px;
        height: 100px;
        background: lightblue;
    }
</style>

<div class="container">
    <div class="box">Box 1</div>
    <div class="box">Box 2</div>
</div>

<!-- 问题：inline-block 元素默认基线对齐 -->
<!-- 导致底部有间隙 -->
```

```css
/* 解决方案1：vertical-align */
.box {
    display: inline-block;
    vertical-align: top;    /* 或 bottom/middle */
}

/* 解决方案2：font-size: 0 */
.container {
    font-size: 0;           /* 消除空白间隙 */
}
.box {
    font-size: 16px;        /* 恢复字体大小 */
}

/* 解决方案3：使用 flex */
.container {
    display: flex;
}
```

---

## 3. 浮动（Float）

### 3.1 浮动原理

```
浮动的本质：让元素脱离文档流，向左或向右移动，
直到碰到父容器边缘或另一个浮动元素。

浮动元素的特点：
1. 脱离文档流（不占据空间）
2. 仍会影响行内内容（文字环绕效果）
3. 会变成块级元素（可设置宽高）
4. 宽度由内容决定（不再自动填满）
```

### 3.2 浮动语法

```css
/* 左浮动 */
.left {
    float: left;
}

/* 右浮动 */
.right {
    float: right;
}

/* 不浮动（默认） */
.none {
    float: none;
}

/* 继承父元素浮动值 */
.inherit {
    float: inherit;
}
```

### 3.3 浮动的影响

```html
<style>
    .container {
        border: 2px solid red;
    }
    .float-box {
        float: left;
        width: 100px;
        height: 100px;
        background: lightblue;
    }
    .text {
        background: lightgreen;
    }
</style>

<div class="container">
    <div class="float-box">浮动盒子</div>
    <p class="text">这段文字会环绕浮动元素...</p>
</div>

<!-- 结果：
     1. 浮动盒子脱离文档流
     2. 父容器高度塌陷（只有文字的高度）
     3. 文字环绕浮动元素
     -->
```

```
浮动效果：
┌──────────────────────────────────────┐
│ ┌──────────┐ 文字会环绕浮动元素       │
│ │ 浮动盒子  │ 继续环绕...              │
│ │          │ 文字环绕效果...           │
│ └──────────┘                          │
└──────────────────────────────────────┘
   ↑ 父容器边框只有文字的高度
```

### 3.4 清除浮动

#### 方法1：clear 属性

```css
/* clear: left   - 左侧不允许有浮动元素 */
/* clear: right  - 右侧不允许有浮动元素 */
/* clear: both   - 两侧都不允许有浮动元素 */

.clear-left {
    clear: left;
}

.clear-both {
    clear: both;
}
```

```html
<!-- 在浮动元素后添加清除元素 -->
<div class="container">
    <div class="float-box">浮动盒子</div>
    <div style="clear: both;"></div>  <!-- 清除浮动 -->
</div>
<!-- 父容器现在会包含浮动元素 -->
```

#### 方法2：伪元素清除（推荐）

```css
.clearfix::after {
    content: "";
    display: table;   /* 或 block */
    clear: both;
}

/* 或使用 block + content */
.clearfix::after {
    content: "";
    display: block;
    clear: both;
}
```

```html
<div class="container clearfix">
    <div class="float-box">浮动盒子</div>
    <!-- 不需要额外的清除元素 -->
</div>
```

#### 方法3：创建 BFC

```css
.container {
    overflow: hidden;    /* 创建 BFC */
    /* 或 */
    display: flow-root;  /* 推荐方式 */
}
```

#### 方法4：使用 flex/grid

```css
.container {
    display: flex;
    /* 或 */
    display: grid;
    /* 浮动元素会变成 flex/grid 子元素，不再浮动 */
}
```

### 3.5 浮动布局示例

```html
<style>
    /* 经典两栏布局 */
    .sidebar {
        float: left;
        width: 200px;
        background: #f0f0f0;
    }
    .main {
        margin-left: 220px;  /* 为侧边栏留出空间 */
        background: #fff;
    }
    
    /* 三栏布局 */
    .left-col {
        float: left;
        width: 200px;
    }
    .right-col {
        float: right;
        width: 200px;
    }
    .center-col {
        margin-left: 220px;
        margin-right: 220px;
    }
</style>
```

---

## 4. 定位（Position）

### 4.1 定位类型

```css
/* 静态定位（默认） */
.static {
    position: static;
    /* 正常文档流中的位置 */
}

/* 相对定位 */
.relative {
    position: relative;
    /* 相对自身原位置偏移，仍占空间 */
}

/* 绝对定位 */
.absolute {
    position: absolute;
    /* 相对于定位祖先定位，脱离文档流 */
}

/* 固定定位 */
.fixed {
    position: fixed;
    /* 相对于视口定位，脱离文档流 */
}

/* 粘性定位 */
.sticky {
    position: sticky;
    /* 相对定位和固定定位的结合 */
}
```

### 4.2 相对定位（Relative）

```css
.relative {
    position: relative;
    top: 20px;
    left: 30px;
    
    /* 特点：
     * 1. 仍在文档流中，占据原空间
     * 2. 视觉上偏移到新位置
     * 3. 原位置保留，其他元素不受影响
     * 4. 常用作绝对定位的参考容器
     */
}
```

```
相对定位示意：
┌────────────────┐
│  原位置（保留） │  ← 其他元素以为它还在这里
└────────────────┘
         ↓ top: 20px
         → left: 30px
    ┌────────────────┐
    │  新位置（视觉） │  ← 实际显示在这里
    └────────────────┘
```

### 4.3 绝对定位（Absolute）

```css
.absolute-parent {
    position: relative;  /* 成为定位祖先 */
}

.absolute-child {
    position: absolute;
    top: 10px;
    right: 10px;
    
    /* 特点：
     * 1. 完全脱离文档流
     * 2. 相对于最近的定位祖先定位
     * 3. 如果没有定位祖先，相对于初始包含块（通常是视口）
     * 4. 宽度由内容决定
     * 5. margin: auto 可以实现居中
     */
}

/* 绝对定位居中 */
.centered {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

/* 或使用 margin: auto */
.centered-auto {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    width: 200px;
    height: 100px;
}
```

### 4.4 固定定位（Fixed）

```css
.fixed-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: white;
    z-index: 1000;
    
    /* 特点：
     * 1. 完全脱离文档流
     * 2. 相对于视口定位
     * 3. 滚动时位置不变
     * 4. 不随页面滚动
     */
}

/* 固定在右下角 */
.back-to-top {
    position: fixed;
    right: 20px;
    bottom: 20px;
}
```

### 4.5 粘性定位（Sticky）

```css
.sticky-header {
    position: sticky;
    top: 0;
    
    /* 特点：
     * 1. 正常情况下表现如相对定位
     * 2. 滚动到阈值时变为固定定位
     * 3. 必须指定 top/bottom/left/right 之一
     * 4. 相对于最近的滚动祖先定位
     */
}

/* 注意：父元素不能有 overflow: hidden/auto/scroll */
```

```html
<style>
    .section {
        height: 300px;
        overflow: auto;
    }
    .section-title {
        position: sticky;
        top: 0;
        background: white;
    }
</style>

<div class="section">
    <h2 class="section-title">Section 1</h2>
    <p>Content...</p>
    <h2 class="section-title">Section 2</h2>
    <p>Content...</p>
    <h2 class="section-title">Section 3</h2>
    <p>Content...</p>
</div>
```

### 4.6 定位参考

```css
/*
 * 绝对定位元素的包含块：
 * 1. 如果有定位祖先（position 不为 static）
 *    → 包含块是定位祖先的 padding box
 * 2. 如果没有定位祖先
 *    → 包含块是初始包含块（视口或页面）
 */

.positioned-ancestor {
    position: relative;
    padding: 20px;
}

.absolute-descendant {
    position: absolute;
    top: 0;     /* 相对于 padding box 的顶部 */
    left: 0;    /* 相对于 padding box 的左侧 */
    width: 50%; /* 相对于 padding box 的宽度 */
}
```

---

## 5. z-index 与层叠上下文

### 5.1 什么是层叠上下文

```
层叠上下文（Stacking Context）是 HTML 元素的三维概念，
决定了元素在 Z 轴上的显示顺序。

每个层叠上下文都是独立的，内部元素的 z-index 只在当前上下文内比较。
```

### 5.2 创建层叠上下文

```css
/* 创建层叠上下文的常见方式 */

/* 1. position + z-index */
.stacking-context-1 {
    position: relative;   /* 或 absolute/fixed */
    z-index: 0;          /* auto 以外的值 */
}

/* 2. opacity < 1 */
.stacking-context-2 {
    opacity: 0.99;
}

/* 3. transform */
.stacking-context-3 {
    transform: translateZ(0);
}

/* 4. filter */
.stacking-context-4 {
    filter: blur(0);
}

/* 5. will-change */
.stacking-context-5 {
    will-change: transform;
}

/* 6. isolation: isolate */
.stacking-context-6 {
    isolation: isolate;
}

/* 7. flex/grid 子元素 + z-index */
.flex-container {
    display: flex;
}
.flex-child {
    z-index: 1;  /* 创建层叠上下文 */
}
```

### 5.3 层叠顺序

```
同一层叠上下文内的层叠顺序（从下到上）：

1. 层叠上下文的背景和边框
2. z-index 为负值的定位元素
3. 块级元素（非定位）
4. 浮动元素（非定位）
5. 行内元素（非定位）
6. z-index: 0 或 auto 的定位元素
7. z-index 为正值的定位元素

简单记忆：背景 < 负z-index < block < float < inline < z-index:0 < 正z-index
```

```
层叠顺序示意：

        ┌─────────────────┐
        │  正 z-index     │  最高
        ├─────────────────┤
        │  z-index: 0     │
        ├─────────────────┤
        │  inline 元素    │
        ├─────────────────┤
        │  float 元素     │
        ├─────────────────┤
        │  block 元素     │
        ├─────────────────┤
        │  负 z-index     │
        ├─────────────────┤
        │  背景/边框      │  最低
        └─────────────────┘
```

### 5.4 z-index 使用技巧

```css
/* 问题：z-index 层级混乱 */
.bad {
    z-index: 9999;  /* ❌ 不要这样做 */
}

/* 推荐：分层管理 z-index */
:root {
    --z-dropdown: 100;
    --z-sticky: 200;
    --z-fixed: 300;
    --z-modal-backdrop: 400;
    --z-modal: 500;
    --z-popover: 600;
    --z-tooltip: 700;
}

.dropdown { z-index: var(--z-dropdown); }
.modal { z-index: var(--z-modal); }
.tooltip { z-index: var(--z-tooltip); }

/* 技巧：创建隔离的层叠上下文 */
.isolated {
    isolation: isolate;
    /* 内部元素的 z-index 只在内部比较 */
    /* 不会影响外部元素 */
}
```

### 5.5 层叠上下文示例

```html
<style>
    .parent {
        position: relative;
        z-index: 1;  /* 创建层叠上下文 */
    }
    .child {
        position: absolute;
        z-index: 9999;  /* 只在 parent 内部有效 */
    }
    .sibling {
        position: relative;
        z-index: 2;  /* 会在整个 parent 上面 */
    }
</style>

<div class="parent">
    <div class="child">z-index: 9999</div>
</div>
<div class="sibling">z-index: 2</div>

<!-- sibling 会显示在 child 上面 -->
<!-- 因为 parent 的 z-index: 1 < sibling 的 z-index: 2 -->
<!-- child 的 z-index 只在 parent 内部有效 -->
```

---

## 6. overflow 属性

```css
/* 默认值：内容可见，可能溢出 */
overflow: visible;

/* 隐藏溢出内容 */
overflow: hidden;

/* 始终显示滚动条 */
overflow: scroll;

/* 内容溢出时显示滚动条 */
overflow: auto;

/* 分别控制水平和垂直方向 */
overflow-x: hidden;
overflow-y: auto;
```

### overflow 的副作用

```css
/* overflow: hidden 会创建 BFC */
.bfc {
    overflow: hidden;
    /* 副作用：可能裁剪内容（如阴影、绝对定位子元素） */
}

/* 更好的选择 */
.bfc-safe {
    display: flow-root;  /* 只创建 BFC，不裁剪 */
}

/* 或使用 contain */
.contain-example {
    contain: layout paint;  /* 创建独立的布局和绘制边界 */
}
```

---

## 7. display、position、float 的相互影响

### 7.1 相互作用规则

```
当 display、position、float 同时设置时，浏览器会按以下规则处理：

1. 如果 display: none → position 和 float 不生效，元素不显示

2. 如果 position: absolute 或 fixed →
   - float 不生效（强制为 none）
   - display 根据情况转换

3. 如果 float 不为 none →
   - display 会转换为 block（某些情况）

4. 如果是根元素 → 特殊处理
```

### 7.2 display 转换规则

```css
/* 浮动或绝对定位元素的 display 转换 */

/* 原始值 → 计算值 */
display: inline;        → display: block;
display: inline-block;  → display: block;
display: inline-table;  → display: table;
display: table-row;     → display: block;
display: table-row-group → display: block;

/* display: flex/grid 保持不变 */
display: flex;          → display: flex;    /* 不变 */
display: grid;          → display: grid;    /* 不变 */
```

```html
<style>
    /* 这些样式会自动转换 display */
    .example1 {
        display: inline;
        float: left;
        /* 实际表现为 block */
    }
    
    .example2 {
        display: inline-block;
        position: absolute;
        /* 实际表现为 block */
    }
    
    .example3 {
        display: flex;
        float: left;
        /* float 不生效，仍为 flex */
    }
</style>
```

---

## 小结

| 属性 | 作用 | 关键点 |
|------|------|--------|
| **display** | 控制元素显示类型 | block/inline/inline-block/none |
| **float** | 脱离文档流，水平排列 | 需要清除浮动 |
| **position** | 定位方式 | relative/absolute/fixed/sticky |
| **z-index** | 层叠顺序 | 只在层叠上下文内有效 |
| **overflow** | 溢出处理 | hidden 会创建 BFC |
| **层叠上下文** | 独立的 Z 轴环境 | 影响内部元素的层叠 |

---

[返回上级目录](../README.md)
