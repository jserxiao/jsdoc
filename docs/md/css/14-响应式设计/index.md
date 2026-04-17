# 十四、响应式设计

> 响应式设计让网站能够在不同设备上提供最佳体验。掌握媒体查询和响应式技术是现代前端开发的必备技能。

## 学习要点

- 📱 理解响应式设计的核心原则
- 🖥️ 掌握媒体查询的使用
- 📏 学会使用响应式单位
- 🎯 能够实现移动端优先的设计

---

## 1. 响应式设计原则

### 三大核心技术

```
响应式设计 = 弹性布局 + 媒体查询 + 弹性图片
```

### 移动端优先 vs 桌面端优先

```css
/* 移动端优先（推荐）：从小到大 */
.element {
    width: 100%; /* 默认移动端样式 */
}
@media (min-width: 768px) {
    .element { width: 50%; } /* 平板 */
}
@media (min-width: 1024px) {
    .element { width: 33.33%; } /* 桌面 */
}

/* 桌面端优先：从大到小 */
.element {
    width: 33.33%; /* 默认桌面端样式 */
}
@media (max-width: 1023px) {
    .element { width: 50%; }
}
@media (max-width: 767px) {
    .element { width: 100%; }
}
```

---

## 2. 视口设置

```html
<!-- 必须在 head 中设置 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- 参数说明 -->
<!-- width=device-width: 宽度等于设备宽度 -->
<!-- initial-scale=1.0: 初始缩放比例为 1 -->
<!-- maximum-scale=1.0: 最大缩放比例（不推荐限制） -->
<!-- user-scalable=no: 禁止缩放（不推荐） -->
```

---

## 3. 媒体查询

### 基本语法

```css
/* 基本结构 */
@media 媒体类型 and (媒体特性) {
    /* 样式规则 */
}

/* 常用媒体类型 */
@media all { }      /* 所有设备（默认） */
@media screen { }   /* 屏幕 */
@media print { }    /* 打印 */
@media speech { }   /* 屏幕阅读器 */
```

### 常用断点

```css
/* 常用设备断点 */
/* 手机 */
@media (max-width: 575px) { }

/* 平板竖屏 */
@media (min-width: 576px) and (max-width: 767px) { }

/* 平板横屏 */
@media (min-width: 768px) and (max-width: 991px) { }

/* 小桌面 */
@media (min-width: 992px) and (max-width: 1199px) { }

/* 大桌面 */
@media (min-width: 1200px) { }
```

### 组合查询

```css
/* and 组合 */
@media (min-width: 768px) and (max-width: 1024px) {
    .container { width: 80%; }
}

/* or 逗号分隔 */
@media (max-width: 575px), print {
    /* 手机或打印时 */
}

/* not 取反 */
@media not print {
    /* 非打印设备 */
}

/* only 兼容旧浏览器 */
@media only screen and (min-width: 768px) {
    /* 仅屏幕设备 */
}
```

### 媒体特性

```css
/* 宽度相关 */
@media (width: 800px) { }        /* 精确宽度 */
@media (min-width: 768px) { }    /* 最小宽度 */
@media (max-width: 1024px) { }   /* 最大宽度 */

/* 高度相关 */
@media (min-height: 600px) { }

/* 屏幕方向 */
@media (orientation: portrait) { }  /* 竖屏 */
@media (orientation: landscape) { } /* 横屏 */

/* 分辨率 */
@media (min-resolution: 2dppx) { }  /* 高清屏 */
@media (-webkit-min-device-pixel-ratio: 2) { } /* Safari */

/* 用户偏好 */
@media (prefers-color-scheme: dark) { }     /* 暗色模式 */
@media (prefers-color-scheme: light) { }    /* 亮色模式 */
@media (prefers-reduced-motion: reduce) { } /* 减少动画 */
```

### 暗色模式实现

```css
:root {
    --bg-color: #fff;
    --text-color: #333;
}

@media (prefers-color-scheme: dark) {
    :root {
        --bg-color: #1a1a1a;
        --text-color: #f0f0f0;
    }
}

body {
    background: var(--bg-color);
    color: var(--text-color);
}
```

---

## 4. 响应式单位

### 视口单位

```css
.container {
    /* vw: 视口宽度的 1% */
    width: 80vw;
    
    /* vh: 视口高度的 1% */
    height: 100vh;
    
    /* vmin: vw 和 vh 中较小的 */
    font-size: 5vmin;
    
    /* vmax: vw 和 vh 中较大的 */
    padding: 2vmax;
}

/* 常见用途 */
.hero {
    height: 100vh; /* 全屏高度 */
}

.font-responsive {
    font-size: 5vw; /* 响应式字体 */
}
```

### 相对字体单位

```css
html {
    font-size: 16px; /* 根元素字体大小 */
}

.text {
    /* em: 相对于父元素字体大小 */
    font-size: 1.5em; /* 16px * 1.5 = 24px */
    padding: 1em;     /* 24px（相对于自身的字体大小） */
    
    /* rem: 相对于根元素字体大小 */
    margin: 1rem;     /* 16px */
}

/* 推荐使用 rem */
html {
    font-size: 62.5%; /* 10px */
}
body {
    font-size: 1.6rem; /* 16px */
}
.box {
    padding: 2rem; /* 20px */
}
```

### clamp() 函数

```css
/* clamp(最小值, 首选值, 最大值) */
.title {
    /* 字体大小在 16px 到 32px 之间，根据视口宽度自动调整 */
    font-size: clamp(16px, 2.5vw, 32px);
}

.container {
    /* 宽度在 280px 到 1200px 之间 */
    width: clamp(280px, 80%, 1200px);
}
```

---

## 5. 响应式图片

```html
<!-- 响应式图片 -->
<img 
    src="image-800.jpg" 
    srcset="image-400.jpg 400w,
            image-800.jpg 800w,
            image-1200.jpg 1200w"
    sizes="(max-width: 600px) 100vw,
           (max-width: 1200px) 50vw,
           33.33vw"
    alt="响应式图片">

<!-- picture 元素 -->
<picture>
    <source media="(min-width: 1024px)" srcset="desktop.jpg">
    <source media="(min-width: 768px)" srcset="tablet.jpg">
    <img src="mobile.jpg" alt="响应式图片">
</picture>

<!-- 不同格式 -->
<picture>
    <source type="image/avif" srcset="image.avif">
    <source type="image/webp" srcset="image.webp">
    <img src="image.jpg" alt="备用格式">
</picture>
```

---

## 6. 常见响应式布局模式

```css
/* 响应式网格 */
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
}

/* 响应式卡片 */
.cards {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}
.card {
    flex: 1 1 300px; /* 最小 300px，自动换行 */
}

/* 响应式导航 */
.nav {
    display: flex;
}
@media (max-width: 768px) {
    .nav {
        flex-direction: column;
    }
    .nav-toggle {
        display: block;
    }
}

/* 隐藏/显示元素 */
.mobile-only {
    display: none;
}
@media (max-width: 768px) {
    .mobile-only {
        display: block;
    }
    .desktop-only {
        display: none;
    }
}
```

---

## 小结

| 技术 | 用途 |
|------|------|
| 媒体查询 | 根据设备特性应用不同样式 |
| 视口单位 | 相对于视口大小的单位 |
| rem/em | 相对于字体大小的单位 |
| clamp() | 设置值的范围 |
| 响应式图片 | 根据设备加载合适图片 |

---

[返回上级目录](../README.md)
