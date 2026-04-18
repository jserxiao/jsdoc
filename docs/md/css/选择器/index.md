# 选择器

> 选择器是 CSS 的核心，用于定位 HTML 元素并应用样式。掌握各种选择器是高效编写 CSS 的基础。

## 学习要点

- 🎯 掌握各类选择器的语法和用法
- ⚖️ 理解选择器优先级计算规则
- 🔧 学会使用组合选择器
- ✅ 形成良好的选择器命名习惯

---

## 1. 基础选择器

```css
/* 通配选择器 - 选中所有元素 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* 元素选择器 - 选中指定标签 */
div { display: block; }
p { line-height: 1.6; }
a { color: blue; }

/* 类选择器 - 最常用，可复用 */
.container { width: 1200px; }
.btn-primary { background: blue; }
.text-center { text-align: center; }

/* ID 选择器 - 唯一标识，优先级高 */
#header { position: fixed; }
#main-nav { z-index: 100; }

/* 分组选择器 - 多个选择器共享样式 */
h1, h2, h3, h4, h5, h6 {
    font-weight: bold;
    line-height: 1.2;
}
```

### 选择器对比

| 选择器 | 语法 | 示例 | 优先级 | 使用建议 |
|--------|------|------|--------|----------|
| 通配 | `*` | `*` | 0 | 用于重置样式 |
| 元素 | `tag` | `div` | 1 | 用于基础样式 |
| 类 | `.class` | `.container` | 10 | ⭐ 最常用 |
| ID | `#id` | `#header` | 100 | 谨慎使用 |

---

## 2. 关系选择器（组合选择器）

```css
/* 后代选择器 - 选中所有后代（任意层级） */
div p { color: blue; }  /* div 里的所有 p */

/* 子代选择器 - 只选中直接子元素 */
div > p { color: red; } /* div 的直接子元素 p */

/* 相邻兄弟选择器 - 选中紧邻的下一个兄弟 */
h1 + p { margin-top: 0; } /* h1 后面紧邻的 p */

/* 通用兄弟选择器 - 选中后面所有兄弟 */
h1 ~ p { color: gray; } /* h1 后面所有的 p */
```

### 图解关系选择器

```html
<div>
    <p>1. 直接子元素</p>
    <section>
        <p>2. 后代元素（非直接子元素）</p>
    </section>
    <p>3. 直接子元素</p>
</div>
<h1>标题</h1>
<p>4. h1 的相邻兄弟</p>
<p>5. h1 的通用兄弟（不是相邻）</p>
```

```css
div > p { }   /* 选中 1, 3 */
div p { }     /* 选中 1, 2, 3 */
h1 + p { }    /* 只选中 4 */
h1 ~ p { }    /* 选中 4, 5 */
```

---

## 3. 属性选择器

```css
/* 存在属性 */
[disabled] { opacity: 0.5; }
[required] { border-color: red; }

/* 属性等于某值 */
[type="text"] { border: 1px solid #ccc; }
[target="_blank"] { }

/* 属性包含某词（空格分隔） */
[class~="active"] { } /* class 包含 active 这个词 */

/* 开头匹配 */
[href^="https"] { }  /* href 以 https 开头 */
[class^="btn-"] { }  /* class 以 btn- 开头 */

/* 结尾匹配 */
[href$=".pdf"] { }   /* href 以 .pdf 结尾 */
[class$="-active"] { } /* class 以 -active 结尾 */

/* 包含匹配 */
[href*="example"] { } /* href 包含 example */
[class*="container"] { } /* class 包含 container */

/* 忽略大小写 */
[type="text" i] { } /* i 表示忽略大小写 */
```

### 实用示例

```css
/* 所有外部链接加图标 */
a[href^="http"]:not([href*="mysite.com"])::after {
    content: " ↗";
}

/* PDF 链接加图标 */
a[href$=".pdf"]::before {
    content: "📄 ";
}

/* 安全链接标识 */
a[href^="https"]::before {
    content: "🔒 ";
}
```

---

## 4. 伪类选择器

### 用户交互伪类

```css
/* 鼠标悬停 */
a:hover { color: red; }

/* 激活状态（点击时） */
button:active { transform: scale(0.95); }

/* 获得焦点 */
input:focus { border-color: blue; outline: 2px solid blue; }

/* 链接访问状态 */
a:link { color: blue; }    /* 未访问 */
a:visited { color: purple; } /* 已访问 */

/* 焦点可见（键盘导航时） */
button:focus-visible { outline: 2px solid blue; }

/* 鼠标悬停但禁用 */
button:hover:not(:disabled) { background: #0056b3; }
```

### 结构伪类

```css
/* 第一个/最后一个子元素 */
li:first-child { font-weight: bold; }
li:last-child { border-bottom: none; }

/* 第 n 个子元素 */
li:nth-child(2) { }      /* 第 2 个 */
li:nth-child(odd) { }    /* 奇数个 */
li:nth-child(even) { }   /* 偶数个 */
li:nth-child(3n) { }     /* 3, 6, 9... */
li:nth-child(3n+1) { }   /* 1, 4, 7... */
li:nth-child(n+3) { }    /* 从第 3 个开始 */

/* 倒数第 n 个 */
li:nth-last-child(2) { } /* 倒数第 2 个 */

/* 第一个/最后一个某类型元素 */
p:first-of-type { }
p:last-of-type { }
p:nth-of-type(2) { }
p:nth-last-of-type(2) { }

/* 唯一子元素 */
li:only-child { }       /* 唯一的子元素 */
p:only-of-type { }      /* 唯一的 p 元素 */

/* 空元素 */
div:empty { display: none; }
```

### 表单伪类

```css
/* 选中状态 */
input:checked { }
option:checked { }

/* 禁用/可用 */
input:disabled { opacity: 0.5; }
input:enabled { }

/* 只读 */
input:read-only { background: #f0f0f0; }
input:read-write { }

/* 验证状态 */
input:valid { border-color: green; }
input:invalid { border-color: red; }
input:in-range { }      /* 值在范围内 */
input:out-of-range { }  /* 值超出范围 */

/* 必填 */
input:required { }
input:optional { }      /* 非必填 */

/* 占位符显示时 */
input:placeholder-shown { }
```

### 逻辑伪类

```css
/* :not() - 排除 */
button:not(.disabled) { cursor: pointer; }
li:not(:last-child) { border-bottom: 1px solid #ccc; }

/* :is() - 匹配任一（优先级取最高的） */
:is(h1, h2, h3) { font-weight: bold; }
:is(article, section) :is(h1, h2) { margin-top: 1em; }

/* :where() - 同 :is，但优先级始终为 0 */
:where(h1, h2, h3) { font-weight: bold; }

/* :has() - 根据子元素选择父元素（CSS 4） */
article:has(img) { }           /* 包含 img 的 article */
a:has(> img) { }               /* 直接包含 img 的链接 */
form:has(input:invalid) { }    /* 包含无效输入的表单 */
```

---

## 5. 伪元素选择器

```css
/* 在元素内容前后插入内容 */
p::before {
    content: "→ ";
    color: blue;
}

p::after {
    content: " ←";
    color: blue;
}

/* 首行样式 */
p::first-line {
    font-weight: bold;
    color: navy;
}

/* 首字母样式 */
p::first-letter {
    font-size: 2em;
    float: left;
    line-height: 1;
}

/* 选中文本样式 */
::selection {
    background: yellow;
    color: black;
}

/* 占位符样式 */
input::placeholder {
    color: gray;
    font-style: italic;
}

/* 列表标记样式 */
li::marker {
    color: blue;
    font-weight: bold;
}

/* 滚动条样式（非标准，webkit 支持） */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #f1f1f1; }
::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
```

### 伪元素 vs 伪类

| 特性 | 伪类 `:` | 伪元素 `::` |
|------|----------|--------------|
| 语法 | `:hover` | `::before` |
| 作用 | 选择元素的状态 | 创建虚拟元素 |
| 数量 | 选择现有元素 | 创建新元素 |
| content | 不需要 | `::before/after` 需要 |

---

## 6. 优先级计算

### 计算规则

```
优先级 = (行内样式, ID数量, 类/属性/伪类数量, 元素/伪元素数量)

比较时从左到右比较，数值大的优先级高
```

### 计算示例

```css
* { }                           /* 0, 0, 0, 0 */
div { }                         /* 0, 0, 0, 1 */
div span { }                    /* 0, 0, 0, 2 */
.container { }                  /* 0, 0, 1, 0 */
div.container { }               /* 0, 0, 1, 1 */
[type="text"] { }               /* 0, 0, 1, 0 */
:hover { }                      /* 0, 0, 1, 0 */
#header { }                     /* 0, 1, 0, 0 */
#header .nav { }                /* 0, 1, 1, 0 */
#header #nav .item { }          /* 0, 2, 1, 0 */
<div style="color: red;">       /* 1, 0, 0, 0 */
```

---

## 小结

| 选择器类型 | 语法 | 用途 |
|------------|------|------|
| 基础选择器 | `*`, `tag`, `.class`, `#id` | 基本选择 |
| 关系选择器 | ` `, `>`, `+`, `~` | 组合选择 |
| 属性选择器 | `[attr]`, `[attr=value]` | 按属性选择 |
| 伪类选择器 | `:hover`, `:nth-child()` | 按状态/位置选择 |
| 伪元素选择器 | `::before`, `::after` | 创建虚拟元素 |

---

[返回上级目录](../README.md)
