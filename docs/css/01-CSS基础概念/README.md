# 一、CSS 基础概念

> CSS（Cascading Style Sheets，层叠样式表）是用于描述 HTML 文档表现样式的语言。理解 CSS 的核心概念是掌握网页样式的第一步。

## 学习要点

- 🎨 了解 CSS 的三种引入方式及其优先级
- 📝 掌握 CSS 的基本语法结构
- 🔄 理解层叠和继承机制
- ⚡ 学会计算选择器优先级

---

## 1. CSS 引入方式

CSS 有三种引入 HTML 的方式，它们的优先级不同。

### 内联样式（Inline Styles）

```html
<!-- 直接在 HTML 元素的 style 属性中写样式 -->
<div style="color: red; font-size: 16px;">内容</div>
```

**特点：**
- ✅ 优先级最高，会覆盖其他样式
- ❌ 不利于维护，样式和结构混杂
- ❌ 无法使用伪类、伪元素
- ❌ 无法复用

**使用场景：** 动态样式（JavaScript 设置）、临时调试

### 内部样式表（Internal Stylesheet）

```html
<!-- 在 HTML 文档的 <head> 中使用 <style> 标签 -->
<head>
    <style>
        .container { 
            color: blue; 
            background: white;
        }
        
        /* 可以使用伪类 */
        a:hover {
            color: red;
        }
    </style>
</head>
```

**特点：**
- ✅ 样式集中管理
- ✅ 可以使用伪类、伪元素
- ❌ 只能在当前页面使用
- ❌ HTML 文件变大

**使用场景：** 单页面应用、特定页面样式

### 外部样式表（External Stylesheet）

```html
<!-- 在 <head> 中使用 <link> 引入外部 CSS 文件 -->
<head>
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="styles/components.css">
</head>
```

**特点：**
- ✅ 样式和结构分离，易于维护
- ✅ 可以被多个页面复用
- ✅ 浏览器缓存，加载更快
- ✅ 最推荐的方式

**最佳实践：** 将 CSS 按功能模块拆分为多个文件

### @import 导入

```html
<style>
    /* 在 CSS 文件或 style 标签中导入其他 CSS 文件 */
    @import url('reset.css');
    @import url('variables.css');
    @import url('components.css');
</style>
```

**特点：**
- ⚠️ 会阻塞渲染，影响性能
- ⚠️ 必须放在样式表最前面
- 🔄 现代开发推荐使用构建工具合并 CSS

### 优先级规则

```
内联样式 > 内部样式表 ≈ 外部样式表（后来者优先）

注意：内部样式表和外部样式表的优先级相同，
      取决于它们在 HTML 中出现的顺序——后出现的会覆盖前面的。
```

---

## 2. CSS 语法结构

### 基本语法

```css
/* CSS 规则集（Rule Set）由选择器和声明块组成 */
选择器 {
    属性名: 属性值;
    属性名: 属性值;  /* 声明 */
}

/* 示例 */
h1 {
    color: red;
    font-size: 24px;
}

/* 分组选择器 - 多个选择器共享样式 */
h1, h2, h3 {
    color: blue;
    font-weight: bold;
}
```

### 语法细节

```css
/* 注释 - 不会被浏览器解析 */
/* 这是单行注释 */
/*
  这是
  多行注释
*/

/* 属性值可以是： */
div {
    /* 关键字 */
    display: block;
    
    /* 数值 + 单位 */
    width: 100px;
    margin: 1.5em;
    
    /* 颜色值 */
    color: red;
    color: #ff0000;
    color: rgb(255, 0, 0);
    
    /* 函数 */
    width: calc(100% - 20px);
    background: linear-gradient(red, blue);
    
    /* 多值属性 */
    padding: 10px 20px 10px 20px;
    border: 1px solid #ccc;
}
```

### 声明顺序建议

```css
/* 推荐的属性声明顺序（便于阅读和维护） */
.element {
    /* 1. 布局相关 */
    display: flex;
    position: relative;
    float: left;
    
    /* 2. 盒模型 */
    width: 100px;
    height: 100px;
    margin: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    
    /* 3. 视觉样式 */
    background: white;
    color: black;
    font-size: 14px;
    
    /* 4. 其他 */
    cursor: pointer;
    transition: all 0.3s;
}
```

---

## 3. 层叠与继承

### 层叠规则（Cascading）

当多条规则应用于同一元素时，CSS 通过层叠规则决定最终应用哪个值。

#### 优先级计算（Specificity）

```
优先级从高到低：

1. !important（最高优先级）
   └── color: red !important;

2. 内联样式（权重：1000）
   └── <div style="color: red;">

3. ID 选择器（权重：100）
   └── #header { }

4. 类选择器、属性选择器、伪类（权重：10）
   └── .container { }
   └── [type="text"] { }
   └── :hover { }

5. 元素选择器、伪元素（权重：1）
   └── div { }
   └── ::before { }

6. 通配选择器（权重：0）
   └── * { }
```

#### 优先级计算示例

```css
/* 计算优先级权重 */
* { }                           /* 0,0,0,0 */
div { }                         /* 0,0,0,1 */
div span { }                    /* 0,0,0,2 */
.container { }                  /* 0,0,1,0 */
div.container { }               /* 0,0,1,1 */
#header { }                     /* 0,1,0,0 */
#header .nav { }                /* 0,1,1,0 */
<div style="color: red;">       /* 1,0,0,0 */
color: red !important;          /* 最高 */

/* 示例：最终 color 是什么？ */
#content .article p { color: blue; }  /* 0,1,1,1 */
#content p { color: red; }            /* 0,1,0,1 */
/* 答案：blue（权重更高） */
```

#### 层叠原则

```css
/* 当优先级相同时，后出现的规则生效 */
h1 { color: red; }
h1 { color: blue; }  /* 最终是 blue */

/* !important 会覆盖一切（慎用！） */
h1 { color: red !important; }
h1#header { color: blue; }  /* 仍然是 red */
```

### 继承（Inheritance）

某些 CSS 属性会从父元素继承到子元素。

```css
/* 可继承的属性（子元素会获得父元素的值） */
body {
    font-family: Arial;      /* 可继承 ✓ */
    font-size: 16px;         /* 可继承 ✓ */
    color: #333;             /* 可继承 ✓ */
    line-height: 1.5;        /* 可继承 ✓ */
    text-align: center;      /* 可继承 ✓ */
}

/* 不可继承的属性（子元素不会获得父元素的值） */
body {
    border: 1px solid #ccc;  /* 不可继承 ✗ */
    margin: 10px;            /* 不可继承 ✗ */
    padding: 10px;           /* 不可继承 ✗ */
    width: 100%;             /* 不可继承 ✗ */
    background: white;       /* 不可继承 ✗ */
}
```

#### 控制继承

```css
.parent {
    color: red;
}

.child {
    color: inherit;   /* 强制继承父元素的值 */
    color: initial;   /* 使用属性的初始值 */
    color: unset;     /* 如果可继承则继承，否则使用初始值 */
    color: revert;    /* 使用浏览器默认样式 */
}

/* all 属性可以同时设置所有属性 */
.reset {
    all: unset;  /* 重置所有属性 */
}
```

---

## 4. 最佳实践

### 组织 CSS 文件

```
styles/
├── base/
│   ├── _reset.css       /* 重置样式 */
│   ├── _variables.css   /* CSS 变量 */
│   └── _typography.css  /* 字体排版 */
├── components/
│   ├── _button.css      /* 按钮组件 */
│   ├── _form.css        /* 表单组件 */
│   └── _card.css        /* 卡片组件 */
├── layout/
│   ├── _header.css      /* 页头 */
│   ├── _footer.css      /* 页脚 */
│   └── _grid.css        /* 网格系统 */
└── main.css             /* 主文件（导入所有模块） */
```

### 命名规范

```css
/* BEM 命名法（推荐） */
.block { }              /* 模块 */
.block__element { }     /* 元素 */
.block--modifier { }    /* 修饰符 */

/* 示例 */
.card { }
.card__header { }
.card__body { }
.card--featured { }
.card__header--dark { }
```

### 避免 !important

```css
/* ❌ 不推荐 */
.title {
    color: red !important;
}

/* ✅ 推荐：通过提高选择器权重解决 */
.container .title {
    color: red;
}
```

---

## 小结

| 概念 | 核心要点 |
|------|----------|
| **引入方式** | 外部样式表 > 内部样式表 > 内联样式 |
| **语法** | 选择器 + { 属性: 值; } |
| **优先级** | !important > 内联 > ID > 类 > 元素 > 通配 |
| **继承** | 字体、颜色等可继承；盒模型等不可继承 |

---

[返回上级目录](../README.md)
