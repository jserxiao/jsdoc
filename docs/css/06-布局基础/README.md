# 六、布局基础

## display

```css
display: block;
display: inline;
display: inline-block;
display: none;
display: flex;
display: grid;
```

---

## position

```css
position: static;   /* 默认 */
position: relative; /* 相对定位 */
position: absolute; /* 绝对定位 */
position: fixed;    /* 固定定位 */
position: sticky;   /* 粘性定位 */

top: 0;
right: 0;
bottom: 0;
left: 0;
z-index: 100;
```

---

## float

```css
float: left;
float: right;
float: none;

/* 清除浮动 */
clear: both;

/* 父元素清除浮动 */
.clearfix::after {
    content: "";
    display: table;
    clear: both;
}
```

---

## overflow

```css
overflow: visible; /* 默认 */
overflow: hidden;
overflow: scroll;
overflow: auto;

overflow-x: hidden;
overflow-y: auto;
```

---

[返回上级目录](../README.md)
