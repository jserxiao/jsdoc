# 十五、CSS 变量与函数

## 自定义属性

```css
/* 定义 */
:root {
    --primary-color: #007bff;
    --spacing: 16px;
    --radius: 4px;
}

/* 使用 */
.button {
    background-color: var(--primary-color);
    padding: var(--spacing);
    border-radius: var(--radius, 8px); /* 默认值 */
}

/* JavaScript 操作 */
const root = document.documentElement;
root.style.setProperty('--primary-color', '#28a745');
const value = getComputedStyle(root).getPropertyValue('--primary-color');
```

---

## CSS 函数

```css
/* 计算 */
width: calc(100% - 20px);
width: calc(50% + 10px);

/* 最小最大 */
width: min(200px, 50%);
width: max(100px, 20%);
width: clamp(100px, 50%, 200px);

/* 颜色 */
color: rgb(255, 0, 0);
color: rgba(255, 0, 0, 0.5);
color: hsl(0, 100%, 50%);

/* 渐变 */
background: linear-gradient(to right, red, blue);
background: radial-gradient(circle, red, blue);

/* 其他 */
filter: blur(5px);
transform: rotate(calc(180deg / 3));
```

---

[返回上级目录](../README.md)
