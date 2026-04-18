# 用户界面

## 尺寸与溢出

```css
.element {
    width: 200px;
    height: 100px;
    min-width: 100px;
    max-width: 500px;
    min-height: 50px;
    max-height: 300px;
    
    overflow: hidden;
    overflow-x: auto;
    overflow-y: scroll;
}
```

---

## 轮廓与调整

```css
.element {
    /* 轮廓（不影响布局） */
    outline: 2px solid blue;
    outline-offset: 4px;
    
    /* 尺寸调整 */
    resize: none;
    resize: both;
    resize: horizontal;
    resize: vertical;
}
```

---

## 光标

```css
.cursor-pointer { cursor: pointer; }
.cursor-move { cursor: move; }
.cursor-not-allowed { cursor: not-allowed; }
.cursor-grab { cursor: grab; }
```

---

## 用户选择

```css
.element {
    user-select: none;  /* 禁止选择 */
    user-select: all;   /* 点击全选 */
    user-select: text;  /* 允许选择 */
}
```

---

[返回上级目录](../README.md)
