# Flexbox 弹性布局

> Flexbox 是 CSS3 引入的强大布局模式，专门用于解决传统布局痛点。它是现代 CSS 布局的基石之一。

## 学习要点

- 🎯 理解主轴和交叉轴的概念
- 📦 掌握容器和项目的属性
- 🔧 能够实现各种常见布局
- ⚠️ 了解常见的 Flexbox 陷阱

---

## 1. 什么是 Flexbox？

### 传统布局的痛点

```css
/* 传统布局：水平居中很麻烦 */
.container {
    width: 100%;
    text-align: center; /* 行内元素居中 */
}
.box {
    display: inline-block;
    /* 或者 */
    margin: 0 auto; /* 块元素居中 */
}

/* 传统布局：垂直居中更麻烦 */
.container {
    position: relative;
}
.box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
```

### Flexbox 解决方案

```css
/* Flexbox：一个声明搞定 */
.container {
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center;     /* 垂直居中 */
}
```

### Flexbox 的优势

| 传统布局 | Flexbox |
|----------|---------|
| 需要 float、position、margin 技巧 | 一套属性搞定 |
| 垂直居中困难 | `align-items: center` |
| 等高列很麻烦 | 自动等高 |
| 响应式布局复杂 | 容易实现 |

---

## 2. Flexbox 基本概念

### 主轴与交叉轴

```
┌─────────────────────────────────────────────┐
│                                             │
│  main start ──────────────────► main end   │  ← 主轴
│  │                                         │
│  │    ┌─────┐  ┌─────┐  ┌─────┐           │
│  │    │  1  │  │  2  │  │  3  │           │
│  │    └─────┘  └─────┘  └─────┘           │
│  │                                         │
│  ▼                                         │
│ cross start ──────────────── cross end     │  ← 交叉轴
│                                             │
└─────────────────────────────────────────────┘

默认情况：
- 主轴：水平方向，从左到右
- 交叉轴：垂直方向，从上到下
```

### 容器和项目

```html
<div class="container">  <!-- Flex 容器 -->
    <div class="item">1</div>  <!-- Flex 项目 -->
    <div class="item">2</div>
    <div class="item">3</div>
</div>
```

```
容器属性（设置在父元素上）：
- flex-direction
- flex-wrap
- justify-content
- align-items
- align-content

项目属性（设置在子元素上）：
- flex-grow
- flex-shrink
- flex-basis
- flex
- align-self
- order
```

---

## 3. 容器属性

### flex-direction（主轴方向）

```css
.container {
    display: flex;
    
    /* 默认值：主轴从左到右 */
    flex-direction: row;
    
    /* 主轴从右到左 */
    flex-direction: row-reverse;
    
    /* 主轴从上到下 */
    flex-direction: column;
    
    /* 主轴从下到上 */
    flex-direction: column-reverse;
}
```

```
row:          1 → 2 → 3
row-reverse:  3 ← 2 ← 1
column:       1
              ↓
              2
              ↓
              3
```

### flex-wrap（换行）

```css
.container {
    display: flex;
    flex-wrap: nowrap;    /* 默认：不换行，压缩项目 */
    flex-wrap: wrap;      /* 换行，第一行在上 */
    flex-wrap: wrap-reverse; /* 换行，第一行在下 */
}
```

### justify-content（主轴对齐）

```css
.container {
    display: flex;
    
    justify-content: flex-start;    /* 默认：起点对齐 */
    justify-content: flex-end;      /* 终点对齐 */
    justify-content: center;        /* 居中 */
    justify-content: space-between; /* 两端对齐，间距相等 */
    justify-content: space-around;  /* 项目两侧间距相等 */
    justify-content: space-evenly;  /* 所有间距完全相等 */
}
```

```
flex-start:   |1  2  3        |
flex-end:     |        1  2  3|
center:       |    1  2  3    |
space-between:|1    2    3    |
space-around: | 1  2  3 |     | (1周围间距: 0.5x, 0.5x)
space-evenly: |  1  2  3  |   | (所有间距: 1x)
```

### align-items（交叉轴对齐）

```css
.container {
    display: flex;
    height: 200px; /* 需要高度才能看到效果 */
    
    align-items: stretch;     /* 默认：拉伸填满 */
    align-items: flex-start;  /* 起点对齐 */
    align-items: flex-end;    /* 终点对齐 */
    align-items: center;      /* 居中 */
    align-items: baseline;    /* 基线对齐（文本底部） */
}
```

### 简写：flex-flow

```css
.container {
    display: flex;
    /* flex-direction + flex-wrap */
    flex-flow: row wrap;
}
```

---

## 4. 项目属性

### flex-grow（放大比例）

```css
.item {
    /* 默认 0：不放大 */
    flex-grow: 0;
}

.item:nth-child(1) { flex-grow: 1; } /* 占 1 份 */
.item:nth-child(2) { flex-grow: 2; } /* 占 2 份 */
.item:nth-child(3) { flex-grow: 1; } /* 占 1 份 */
/* 总共 4 份：1:2:1 分配剩余空间 */
```

### flex-shrink（缩小比例）

```css
.item {
    /* 默认 1：空间不足时等比例缩小 */
    flex-shrink: 1;
}

.no-shrink {
    flex-shrink: 0; /* 不缩小 */
}
```

### flex-basis（基础大小）

```css
.item {
    /* 默认 auto：使用项目本身大小 */
    flex-basis: auto;
    
    /* 指定固定值 */
    flex-basis: 200px;
    flex-basis: 25%;
}
```

### flex 简写（重要！）

```css
/* 常用值 */
flex: 1;          /* flex-grow: 1; flex-shrink: 1; flex-basis: 0%; */
flex: auto;       /* flex-grow: 1; flex-shrink: 1; flex-basis: auto; */
flex: none;       /* flex-grow: 0; flex-shrink: 0; flex-basis: auto; */
flex: 0 0 200px;  /* 不放大不缩小，固定 200px */

/* 等分布局 */
.item { flex: 1; }  /* 所有项目等分 */
```

### align-self（单独对齐）

```css
.container {
    display: flex;
    align-items: center; /* 默认居中 */
}

.item:nth-child(2) {
    align-self: flex-start; /* 第二个项目单独顶部对齐 */
}
```

### order（排序）

```css
.item:nth-child(1) { order: 3; } /* 显示在最后 */
.item:nth-child(2) { order: 1; } /* 显示在最前 */
.item:nth-child(3) { order: 2; } /* 显示在中间 */
```

---

## 5. 常见布局示例

### 水平垂直居中

```css
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
```

### 三栏布局（中间自适应）

```css
.container {
    display: flex;
}
.left, .right {
    width: 200px;
    flex-shrink: 0; /* 不缩小 */
}
.center {
    flex: 1; /* 占据剩余空间 */
}
```

### 粘性底部

```css
body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}
main {
    flex: 1; /* 占据剩余空间 */
}
footer {
    /* 自动推到底部 */
}
```

### 导航栏

```css
.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
}
.nav-links {
    display: flex;
    gap: 20px;
}
```

### 等高卡片

```css
.cards {
    display: flex;
}
.card {
    flex: 1;
    /* 自动等高 */
}
```

---

## 小结

| 属性 | 作用 | 常用值 |
|------|------|--------|
| `display: flex` | 启用 Flexbox | - |
| `flex-direction` | 主轴方向 | row, column |
| `justify-content` | 主轴对齐 | center, space-between |
| `align-items` | 交叉轴对齐 | center, stretch |
| `flex` | 项目伸缩 | 1, auto, none |
| `gap` | 项目间距 | 10px, 1rem |

---

[返回上级目录](../README.md)
