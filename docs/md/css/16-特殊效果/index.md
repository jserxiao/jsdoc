# 十六、特殊效果

## 滤镜

```css
.element {
    filter: blur(5px);
    filter: brightness(1.2);
    filter: contrast(1.5);
    filter: grayscale(100%);
    filter: hue-rotate(90deg);
    filter: invert(100%);
    filter: opacity(0.5);
    filter: saturate(2);
    filter: sepia(100%);
    filter: drop-shadow(2px 4px 6px black);
    
    /* 组合 */
    filter: blur(2px) brightness(1.2);
}
```

---

## 裁剪与遮罩

```css
/* clip-path */
.element {
    clip-path: circle(50%);
    clip-path: ellipse(50% 30%);
    clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
    clip-path: inset(10px 20px);
}

/* mask */
.element {
    mask: url('mask.png');
    mask-size: cover;
    mask-repeat: no-repeat;
}
```

---

## 混合模式

```css
.element {
    mix-blend-mode: multiply;
    mix-blend-mode: screen;
    mix-blend-mode: overlay;
    
    background-blend-mode: multiply;
}
```

---

[返回上级目录](../README.md)
