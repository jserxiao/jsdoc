# Grid 网格布局

> CSS Grid 是最强大的 CSS 布局系统，可以创建二维布局（行和列）。它与 Flexbox 互补，是现代 CSS 布局的基石。

## 学习要点

- 🏗️ 理解 Grid 的二维布局概念
- 📏 掌握网格轨道和网格线的定义
- 📦 学会使用网格区域命名
- 🎯 能够实现复杂布局

---

## 1. Grid 基础概念

### 与 Flexbox 的对比

| 特性 | Flexbox | Grid |
|------|---------|------|
| 维度 | 一维（行或列） | 二维（行和列） |
| 适用 | 内容驱动的布局 | 布局驱动的布局 |
| 思维 | 从内容出发 | 从容器出发 |

### 基本术语

```
┌─────────────────────────────────────────────┐
│ Grid Container                               │
│  ┌────────┐  ┌────────┐  ┌────────┐        │
│  │ Cell   │  │ Cell   │  │ Cell   │        │ ← Grid Track (行轨道)
│  └────────┘  └────────┘  └────────┘        │
│  │        │  │        │  │        │        │
│  │ Cell   │  │ Cell   │  │ Cell   │        │ ← Grid Track (行轨道)
│  │        │  │        │  │        │        │
│  └────────┘  └────────┘  └────────┘        │
│  ↑           ↑           ↑                  │
│  Grid Track (列轨道)                         │
└─────────────────────────────────────────────┘

Grid Line: 网格线（用于定位）
Grid Cell: 网格单元（最小单位）
Grid Area: 网格区域（多个单元格）
Grid Track: 网格轨道（行或列）
```

---

## 2. 容器属性

### display 和基本定义

```css
.container {
    /* 启用 Grid */
    display: grid;
    /* 或行内 Grid */
    display: inline-grid;
}
```

### grid-template-columns / rows（定义轨道）

```css
.container {
    display: grid;
    
    /* 固定宽度 */
    grid-template-columns: 100px 200px 100px;
    grid-template-rows: 50px auto 50px;
    
    /* fr 单位（比例分配） */
    grid-template-columns: 1fr 2fr 1fr;  /* 中间列是两侧的两倍宽 */
    
    /* repeat 函数 */
    grid-template-columns: repeat(3, 1fr);  /* 三等分 */
    grid-template-columns: repeat(2, 100px 1fr); /* 100px 1fr 100px 1fr */
    
    /* auto-fill / auto-fit（自动填充） */
    grid-template-columns: repeat(auto-fill, 200px); /* 尽可能多 */
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* 响应式 */
    
    /* minmax 函数 */
    grid-template-columns: minmax(100px, 200px) 1fr;
}
```

### gap（间距）

```css
.container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    
    /* 统一间距 */
    gap: 20px;
    
    /* 行间距 列间距 */
    gap: 20px 30px;
    row-gap: 20px;
    column-gap: 30px;
}
```

### 对齐属性

```css
.container {
    display: grid;
    
    /* 项目在单元格内的对齐 */
    justify-items: start | end | center | stretch;
    align-items: start | end | center | stretch;
    place-items: center; /* 简写：align justify */
    
    /* 整个网格在容器内的对齐 */
    justify-content: start | end | center | space-between | space-around | space-evenly;
    align-content: start | end | center | space-between | space-around | space-evenly;
}
```

---

## 3. 项目属性

### 位置定位

```css
.item {
    /* 起止网格线 */
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 3;
    
    /* 简写 */
    grid-column: 1 / 3;  /* 从第1线到第3线 */
    grid-row: 1 / 3;
    
    /* span 跨越 */
    grid-column: 1 / span 2;  /* 从第1线开始跨2列 */
    grid-column: span 2;       /* 跨越2列 */
}
```

### 网格线示意图

```
  1       2       3       4
  │       │       │       │
1 ├───────┼───────┼───────┤
  │       │       │       │
2 ├───────┼───────┼───────┤
  │       │       │       │
3 ├───────┼───────┼───────┤
  │       │       │       │
  1       2       3       4

grid-column: 1 / 3 → 占据第1列和第2列
grid-row: 1 / 3 → 占据第1行和第2行
```

### 单独对齐

```css
.item {
    /* 覆盖容器的对齐设置 */
    justify-self: start | end | center | stretch;
    align-self: start | end | center | stretch;
}
```

### 排序

```css
.item {
    order: 1; /* 数字越小越靠前 */
}
```

---

## 4. 网格区域命名

### 定义和使用区域

```css
.container {
    display: grid;
    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: auto 1fr auto;
    
    /* 命名区域 */
    grid-template-areas:
        "header header header"
        "sidebar main aside"
        "footer footer footer";
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.aside   { grid-area: aside; }
.footer  { grid-area: footer; }
```

### 区域可视化

```
┌─────────────────────────────────────┐
│            header                   │
├──────────┬────────────┬─────────────┤
│ sidebar  │    main    │   aside     │
│          │            │             │
├──────────┴────────────┴─────────────┤
│            footer                   │
└─────────────────────────────────────┘
```

### 响应式布局

```css
.container {
    display: grid;
    grid-template-areas:
        "header"
        "main"
        "sidebar"
        "footer";
}

@media (min-width: 768px) {
    .container {
        grid-template-columns: 200px 1fr;
        grid-template-areas:
            "header header"
            "sidebar main"
            "footer footer";
    }
}
```

---

## 5. 常见布局示例

### 三栏布局

```css
.layout {
    display: grid;
    grid-template-columns: 200px 1fr 200px;
    min-height: 100vh;
}

.layout {
    grid-template-areas:
        "header header header"
        "sidebar main aside"
        "footer footer footer";
}
```

### 瀑布流布局

```css
.masonry {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 10px;
}

.masonry .item:nth-child(3n+1) { grid-row: span 15; }
.masonry .item:nth-child(3n+2) { grid-row: span 20; }
.masonry .item:nth-child(3n)   { grid-row: span 12; }
```

### 等宽响应式卡片

```css
.cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}
```

---

## 小结

| 属性 | 作用 |
|------|------|
| `grid-template-columns/rows` | 定义轨道 |
| `gap` | 设置间距 |
| `grid-column/row` | 项目定位 |
| `grid-template-areas` | 区域命名 |
| `fr` | 比例单位 |
| `minmax()` | 最小最大值 |

---

[返回上级目录](../README.md)
