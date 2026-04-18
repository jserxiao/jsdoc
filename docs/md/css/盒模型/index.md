# 盒模型

> CSS 盒模型是理解元素尺寸计算的基础。每个 HTML 元素都可以看作一个矩形盒子，由内容、内边距、边框和外边距组成。

## 学习要点

- 📦 理解盒模型的四个组成部分
- ⚖️ 掌握两种盒模型的区别
- 📏 学会正确计算元素尺寸
- ✅ 形成设置 box-sizing 的习惯

---

## 1. 盒模型组成

### 四个部分

```
┌─────────────────────────────────────────────┐
│                 margin                       │
│  ┌───────────────────────────────────────┐  │
│  │               border                   │  │
│  │  ┌───────────────────────────────────┐│  │
│  │  │             padding               ││  │
│  │  │  ┌─────────────────────────────┐  ││  │
│  │  │  │                             │  ││  │
│  │  │  │         content             │  ││  │
│  │  │  │                             │  ││  │
│  │  │  └─────────────────────────────┘  ││  │
│  │  │                                   ││  │
│  │  └───────────────────────────────────┘│  │
│  │                                        │  │
│  └────────────────────────────────────────┘  │
│                                              │
└──────────────────────────────────────────────┘

从内到外：
content → padding → border → margin
```

### 各部分说明

| 部分 | 说明 | 特点 |
|------|------|------|
| content | 内容区域 | 显示文本、图片等 |
| padding | 内边距 | 背景会延伸到此区域 |
| border | 边框 | 包围内容和内边距 |
| margin | 外边距 | 透明，控制元素间距 |

---

## 2. 两种盒模型

### 标准盒模型（content-box）

```css
box-sizing: content-box; /* 默认值 */
```

```
width = content 的宽度
元素总宽度 = width + padding + border + margin

示例：
width: 200px;
padding: 20px;
border: 5px;
实际占据宽度 = 200 + 20*2 + 5*2 = 250px
```

### IE 盒模型（border-box）

```css
box-sizing: border-box;
```

```
width = content + padding + border 的总宽度
元素总宽度 = width + margin

示例：
width: 200px;
padding: 20px;
border: 5px;
实际占据宽度 = 200px（width 已包含 padding 和 border）
content 实际宽度 = 200 - 20*2 - 5*2 = 150px
```

### 对比图

```
content-box:              border-box:
┌────────────────┐        ┌────────────────┐
│  width = 200   │        │  width = 200   │
│  (仅内容)      │        │  (包含padding  │
│                │        │   和border)   │
└────────────────┘        └────────────────┘
     ↓                          ↓
加 padding/border          padding/border
后更宽                     在 width 内
```

### 推荐设置

```css
/* 全局设置 border-box */
*, *::before, *::after {
    box-sizing: border-box;
}

/* 或者继承设置 */
html {
    box-sizing: border-box;
}
*, *::before, *::after {
    box-sizing: inherit;
}
```

**为什么推荐 border-box？**
- 更直观：设置的 width 就是实际宽度
- 更方便：不需要计算减去 padding 和 border
- 更灵活：改变 padding/border 不影响布局

---

## 3. 内边距（padding）

```css
/* 四边相同 */
padding: 10px;

/* 上下 | 左右 */
padding: 10px 20px;

/* 上 | 左右 | 下 */
padding: 10px 20px 30px;

/* 上 | 右 | 下 | 左（顺时针） */
padding: 10px 20px 30px 40px;

/* 单边设置 */
padding-top: 10px;
padding-right: 20px;
padding-bottom: 30px;
padding-left: 40px;
```

### 视觉效果

```
padding: 10px 20px;

┌────────────────────────┐
│      20px              │
│  ┌──────────────────┐  │
│10│                  │  │
│px│    content       │  │
│  │                  │  │
│  └──────────────────┘  │
│      20px              │
└────────────────────────┘
```

---

## 4. 外边距（margin）

```css
/* 四边相同 */
margin: 10px;

/* 上下 | 左右 */
margin: 10px 20px;

/* 水平居中 */
margin: 0 auto;

/* 单边设置 */
margin-top: 10px;
margin-right: 20px;
margin-bottom: 30px;
margin-left: 40px;
```

### 外边距合并

```css
/* 垂直方向的外边距会合并 */
.box1 { margin-bottom: 30px; }
.box2 { margin-top: 20px; }

/* 两者间距是 30px，不是 50px */
/* 取较大的值 */
```

### 负外边距

```css
/* 负 margin 会让元素"收缩" */
.box {
    margin-left: -20px; /* 向左移动 */
    margin-top: -20px;  /* 向上移动 */
}

/* 常见应用：让元素溢出容器 */
.box {
    margin: 0 -20px; /* 左右溢出 20px */
}
```

---

## 5. 边框（border）

```css
/* 简写：宽度 样式 颜色 */
border: 1px solid #ccc;
border: 2px dashed red;
border: 3px dotted blue;

/* 单边 */
border-top: 1px solid #ccc;
border-right: 2px dashed red;
border-bottom: 1px solid #ccc;
border-left: 2px dashed red;

/* 圆角 */
border-radius: 4px;           /* 四个角 */
border-radius: 10px 20px;     /* 左上右下 | 右上左下 */
border-radius: 10px 20px 30px 40px; /* 顺时针 */
border-radius: 50%;           /* 圆形 */

/* 边框图片 */
border-image: url(border.png) 30 round;
```

---

## 小结

| 属性 | 作用 | 注意 |
|------|------|------|
| `box-sizing` | 设置盒模型类型 | 推荐 border-box |
| `padding` | 内边距 | 背景会延伸 |
| `border` | 边框 | 会影响元素尺寸 |
| `margin` | 外边距 | 垂直方向会合并 |

---

## 6. 外边距合并深入

> 外边距合并（Margin Collapsing）是 CSS 中一个重要且容易出错的特性。理解它的工作原理对于控制布局至关重要。

### 6.1 什么是外边距合并

```
当两个垂直外边距相遇时，它们会合并成一个外边距，
合并后的外边距高度等于两个发生合并的外边距中较大的一个。

注意：只有垂直方向（上下）的外边距会合并，水平方向不会。
```

### 6.2 合并的三种情况

#### 情况一：相邻兄弟元素

```html
<style>
    .box1 { margin-bottom: 30px; }
    .box2 { margin-top: 20px; }
</style>

<div class="box1">Box 1</div>
<div class="box2">Box 2</div>

<!-- 两者间距是 30px，不是 50px -->
<!-- 取较大值：max(30px, 20px) = 30px -->
```

```
┌─────────────────┐
│     Box 1       │
│  margin-bottom  │ 30px
└─────────────────┘
        │
        │ 合并后 = 30px（取较大值）
        │
┌─────────────────┐
│  margin-top     │ 20px
│     Box 2       │
└─────────────────┘
```

#### 情况二：父元素与第一个/最后一个子元素

```html
<style>
    .parent {
        background: #f0f0f0;
        /* 没有 border、padding、BFC */
    }
    .child {
        margin-top: 50px;  /* 会"穿透"到父元素外面 */
    }
</style>

<div class="parent">
    <div class="child">Child</div>
</div>

<!-- margin-top: 50px 会合并到父元素上 -->
<!-- 子元素不会相对父元素下移，而是父元素整体下移 -->
```

**解决方案：**

```css
/* 方法1：给父元素添加 border */
.parent {
    border-top: 1px solid transparent;
}

/* 方法2：给父元素添加 padding */
.parent {
    padding-top: 1px;
}

/* 方法3：创建 BFC */
.parent {
    overflow: hidden;
    /* 或 */
    display: flow-root;
}

/* 方法4：使用 flex/grid */
.parent {
    display: flex;
    flex-direction: column;
}
```

#### 情况三：空的块级元素

```html
<style>
    .empty {
        margin-top: 50px;
        margin-bottom: 30px;
        /* 自身 margin 合并 = 50px */
    }
</style>

<div class="parent">
    <div class="empty"></div>  <!-- 空元素 -->
</div>

<!-- 空元素的 margin-top 和 margin-bottom 会合并 -->
<!-- 最终间距：max(50px, 30px) = 50px -->
```

### 6.3 不发生合并的情况

```css
/* 1. 水平方向的 margin 永不合并 */
.box {
    display: inline-block;
    margin-left: 20px;
    margin-right: 30px;  /* 不会合并，各算各的 */
}

/* 2. 创建了 BFC 的元素不会与子元素 margin 合并 */
.bfc-parent {
    overflow: hidden;    /* 创建 BFC */
}

/* 3. 定位元素不参与 margin 合并 */
.positioned {
    position: absolute;  /* 不参与 margin 合并 */
}

/* 4. 浮动元素不参与 margin 合并 */
.floated {
    float: left;  /* 不参与 margin 合并 */
}

/* 5. 行内元素不参与 margin 合并 */
.inline {
    display: inline;
    /* margin-top/bottom 无效，自然不参与合并 */
}

/* 6. Flex/Grid 子元素不合并 */
.flex-child {
    display: flex;  /* 子元素 margin 不合并 */
}
```

### 6.4 实际应用技巧

```css
/* 技巧1：只使用一个方向的 margin */
.section {
    margin-bottom: 20px;  /* 只用 margin-bottom */
    /* 最后一个元素需要处理 */
}
.section:last-child {
    margin-bottom: 0;
}

/* 技巧2：使用 padding 代替 margin */
.parent {
    padding: 20px 0;
}
.child {
    margin: 0;  /* 子元素不设 margin */
}

/* 技巧3：使用 gap（现代方案） */
.grid-container {
    display: grid;
    gap: 20px;  /* 没有 margin 合并问题 */
}

/* 技巧4：使用 flow-root 创建 BFC */
.no-collapse {
    display: flow-root;  /* 现代创建 BFC 的方式 */
}
```

---

## 7. BFC（块级格式化上下文）

> BFC（Block Formatting Context）是 CSS 布局中的核心概念，理解它能解决很多布局难题。

### 7.1 什么是 BFC

```
BFC 是一个独立的渲染区域，内部的元素布局不受外部影响，
也不会影响外部元素。

可以理解为：一个隔离的容器，里面的元素和外面的元素互不干扰。
```

### 7.2 创建 BFC 的方式

```css
/* 方式1：float 不为 none */
.bfc-float {
    float: left;
    float: right;
}

/* 方式2：position 为 absolute 或 fixed */
.bfc-position {
    position: absolute;
    position: fixed;
}

/* 方式3：display 为 inline-block */
.bfc-inline-block {
    display: inline-block;
}

/* 方式4：overflow 不为 visible */
.bfc-overflow {
    overflow: hidden;
    overflow: auto;
    overflow: scroll;
}

/* 方式5：display 为 flow-root（推荐） */
.bfc-flow-root {
    display: flow-root;  /* 专门用于创建 BFC，无副作用 */
}

/* 方式6：display 为 table-cell、table-caption */
.bfc-table {
    display: table-cell;
    display: table-caption;
}

/* 方式7：display 为 flex/grid 的直接子元素 */
.flex-container {
    display: flex;
}
.flex-child {
    /* 自动成为 BFC */
}

/* 方式8：contain 为 layout、paint 或 strict */
.bfc-contain {
    contain: layout;
}
```

### 7.3 BFC 的特性与作用

#### 特性1：阻止外边距合并

```html
<style>
    .parent {
        display: flow-root;  /* 创建 BFC */
    }
    .child {
        margin-top: 50px;  /* 不会合并到父元素外面 */
    }
</style>

<div class="parent">
    <div class="child">Child</div>
</div>

<!-- margin-top: 50px 正常作用于父元素内部 -->
```

#### 特性2：包含浮动元素

```html
<style>
    /* 问题：父元素高度塌陷 */
    .parent-no-bfc {
        border: 2px solid red;
        /* 高度为 0，因为子元素浮动 */
    }
    .float-child {
        float: left;
        height: 100px;
    }
    
    /* 解决：创建 BFC */
    .parent-with-bfc {
        display: flow-root;  /* 或 overflow: hidden */
        border: 2px solid blue;
        /* 高度包含浮动子元素 */
    }
</style>

<div class="parent-no-bfc">
    <div class="float-child">Float</div>
</div>

<div class="parent-with-bfc">
    <div class="float-child">Float</div>
</div>
```

```
没有 BFC：
┌─────────────────┐ ← 父元素边框（高度为 0）
└─────────────────┘
┌─────────────────┐
│     Float       │ ← 浮动元素溢出
└─────────────────┘

有 BFC：
┌─────────────────┐
│                 │
│     Float       │ ← 浮动元素被包含
│                 │
└─────────────────┘
```

#### 特性3：阻止元素被浮动覆盖

```html
<style>
    /* 问题：浮动元素覆盖正常元素 */
    .float-box {
        float: left;
        width: 100px;
        height: 100px;
    }
    .normal-box {
        /* 会被浮动元素覆盖 */
    }
    
    /* 解决：创建 BFC */
    .bfc-box {
        display: flow-root;  /* 或 overflow: hidden */
        /* 不会被浮动元素覆盖 */
    }
</style>

<div class="float-box">Float</div>
<div class="bfc-box">不会被覆盖的BFC盒子</div>
```

```
没有 BFC：
┌────────┐──────────────────────┐
│ Float  │ 被覆盖的内容...        │
└────────┘──────────────────────┘

有 BFC：
┌────────┐ ┌──────────────────────┐
│ Float  │ │ 独立的BFC区域         │
└────────┘ └──────────────────────┘
```

#### 特性4：独立的布局环境

```css
/* BFC 内部的元素布局不影响外部 */
.bfc-container {
    display: flow-root;
}

/* 内部浮动不影响外部 */
.bfc-container .floated {
    float: left;
    /* 不会影响 BFC 外部的元素 */
}

/* 内部的 margin 不与外部合并 */
.bfc-container .with-margin {
    margin-top: 50px;
    /* 不会与 BFC 外部的元素合并 */
}
```

### 7.4 BFC 应用场景

#### 场景1：自适应两栏布局

```html
<style>
    .sidebar {
        float: left;
        width: 200px;
        height: 100%;
    }
    .main-content {
        display: flow-root;  /* 创建 BFC */
        /* 自动避开浮动元素，实现自适应 */
    }
</style>

<div class="sidebar">侧边栏</div>
<div class="main-content">主内容区域，自适应宽度</div>
```

#### 场景2：防止高度塌陷

```css
.parent {
    display: flow-root;  /* 包含浮动子元素 */
}

.child {
    float: left;
}
```

#### 场景3：防止 margin 合并

```css
.parent {
    display: flow-root;  /* 阻止与子元素 margin 合并 */
}

.child {
    margin-top: 30px;
}
```

### 7.5 BFC vs 其他格式化上下文

```css
/* BFC - 块级格式化上下文 */
.bfc {
    display: flow-root;
    /* 块级盒子垂直排列 */
}

/* IFC - 行内格式化上下文 */
.ifc {
    display: inline;  /* 或包含行内元素的块级盒子 */
    /* 行内盒子水平排列 */
}

/* FFC - Flex 格式化上下文 */
.ffc {
    display: flex;
    /* Flex 子元素按照 Flex 规则排列 */
}

/* GFC - Grid 格式化上下文 */
.gfc {
    display: grid;
    /* Grid 子元素按照 Grid 规则排列 */
}
```

---

## 小结

| 概念 | 说明 |
|------|------|
| **外边距合并** | 垂直方向的 margin 会合并，取较大值 |
| **合并场景** | 相邻兄弟、父子元素、空元素自身 |
| **不合并情况** | BFC、浮动、定位、inline、flex/grid |
| **BFC 创建** | float、position、overflow、display: flow-root |
| **BFC 作用** | 阻止合并、包含浮动、阻止覆盖、独立布局 |

---

[返回上级目录](../README.md)
