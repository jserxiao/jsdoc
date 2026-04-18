# 颜色与背景

## 颜色值

```css
/* 关键字 */
color: red;
color: transparent;
color: currentColor;

/* 十六进制 */
color: #ff0000;
color: #f00;
color: #ff000080; /* 带透明度 */

/* RGB */
color: rgb(255, 0, 0);
color: rgba(255, 0, 0, 0.5);

/* HSL */
color: hsl(0, 100%, 50%);
color: hsla(0, 100%, 50%, 0.5);

/* 现代写法 */
color: rgb(255 0 0);
color: rgb(255 0 0 / 0.5);
```

---

## 背景

```css
/* 背景色 */
background-color: #fff;

/* 背景图 */
background-image: url('image.jpg');

/* 重复 */
background-repeat: no-repeat;
background-repeat: repeat-x;

/* 位置 */
background-position: center center;
background-position: 50% 50%;

/* 大小 */
background-size: cover;
background-size: contain;
background-size: 100% 100%;

/* 简写 */
background: #fff url('image.jpg') no-repeat center/cover;
```

---

## 渐变

```css
/* 线性渐变 */
background: linear-gradient(to right, red, blue);
background: linear-gradient(45deg, red, blue);
background: linear-gradient(red, yellow 50%, blue);

/* 径向渐变 */
background: radial-gradient(circle, red, blue);
background: radial-gradient(at center, red, blue);

/* 锥形渐变 */
background: conic-gradient(red, yellow, blue);

/* 重复渐变 */
background: repeating-linear-gradient(
    45deg, red, red 10px, blue 10px, blue 20px
);
```

---

[返回上级目录](../README.md)
