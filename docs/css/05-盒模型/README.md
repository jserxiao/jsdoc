# 五、盒模型

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

[返回上级目录](../README.md)
