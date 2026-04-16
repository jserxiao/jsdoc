# 十二、变形与动画

> CSS 变形和动画为网页添加动态效果，提升用户体验。掌握这些技术可以创建流畅、吸引人的交互效果。

## 学习要点

- 🔄 掌握 2D/3D 变换的使用
- ⚡ 理解过渡动画的实现
- 🎬 学会创建关键帧动画
- 🎯 能够优化动画性能

---

## 1. transform（变换）

### 2D 变换

```css
.element {
    /* 平移 */
    transform: translate(50px, 100px);  /* x, y */
    transform: translateX(50px);
    transform: translateY(100px);
    transform: translate(50%, 50%);     /* 相对于自身 */
    
    /* 缩放 */
    transform: scale(2);        /* 放大 2 倍 */
    transform: scale(0.5);      /* 缩小一半 */
    transform: scaleX(1.5);     /* 只水平缩放 */
    transform: scale(1, 2);     /* x 方向不变，y 方向 2 倍 */
    
    /* 旋转 */
    transform: rotate(45deg);   /* 顺时针 45 度 */
    transform: rotate(-90deg);  /* 逆时针 90 度 */
    transform: rotate(0.5turn); /* 半圈 */
    
    /* 倾斜 */
    transform: skew(10deg, 20deg);
    transform: skewX(10deg);
    transform: skewY(20deg);
}
```

### 变换原点

```css
.element {
    transform-origin: center center;  /* 默认：中心点 */
    transform-origin: top left;       /* 左上角 */
    transform-origin: 50% 50%;        /* 中心 */
    transform-origin: 0 0;            /* 左上角 */
    transform-origin: 20px 30px;      /* 具体位置 */
}

/* 变换原点影响旋转效果 */
.box1 {
    transform-origin: center;
    transform: rotate(45deg); /* 绕中心旋转 */
}
.box2 {
    transform-origin: top left;
    transform: rotate(45deg); /* 绕左上角旋转 */
}
```

### 多重变换

```css
/* 多个变换函数用空格分隔 */
.element {
    transform: rotate(45deg) scale(1.5) translate(50px, 0);
}

/* 注意顺序：从右向左执行 */
transform: translate(50px) rotate(45deg); /* 先旋转再平移 */
transform: rotate(45deg) translate(50px); /* 先平移再旋转 */
```

### 3D 变换

```css
.container {
    /* 开启 3D 空间 */
    perspective: 1000px;  /* 透视距离 */
}

.element {
    /* 3D 旋转 */
    transform: rotateX(45deg);   /* 绕 X 轴旋转 */
    transform: rotateY(45deg);   /* 绕 Y 轴旋转 */
    transform: rotateZ(45deg);   /* 绕 Z 轴旋转 */
    transform: rotate3d(1, 1, 0, 45deg);  /* 自定义轴 */
    
    /* 3D 平移 */
    transform: translateZ(100px);
    transform: translate3d(10px, 20px, 30px);
    
    /* 保留 3D 效果 */
    transform-style: preserve-3d;
    
    /* 背面可见性 */
    backface-visibility: hidden;
}
```

---

## 2. transition（过渡）

### 基本语法

```css
.element {
    /* 完整属性 */
    transition-property: all;           /* 过渡属性 */
    transition-duration: 0.3s;          /* 持续时间 */
    transition-timing-function: ease;   /* 缓动函数 */
    transition-delay: 0s;               /* 延迟时间 */
    
    /* 简写 */
    transition: all 0.3s ease;
    transition: transform 0.3s ease 0.1s;  /* 带延迟 */
    
    /* 多个属性 */
    transition: transform 0.3s, opacity 0.3s;
}
```

### 缓动函数

```css
.element {
    transition-timing-function: ease;        /* 开始慢，中间快，结束慢 */
    transition-timing-function: linear;      /* 匀速 */
    transition-timing-function: ease-in;     /* 开始慢 */
    transition-timing-function: ease-out;    /* 结束慢 */
    transition-timing-function: ease-in-out; /* 两头慢 */
    
    /* 贝塞尔曲线 */
    transition-timing-function: cubic-bezier(0.68, -0.55, 0.27, 1.55);
    
    /* 步进 */
    transition-timing-function: steps(4, end);
}
```

### 常见过渡效果

```css
/* 按钮悬停 */
.button {
    background: blue;
    transition: all 0.3s ease;
}
.button:hover {
    background: darkblue;
    transform: translateY(-2px);
}

/* 图片缩放 */
.image {
    transition: transform 0.3s ease;
}
.image:hover {
    transform: scale(1.1);
}

/* 淡入淡出 */
.fade {
    opacity: 1;
    transition: opacity 0.3s ease;
}
.fade.hidden {
    opacity: 0;
}
```

---

## 3. animation（动画）

### 定义关键帧

```css
@keyframes slideIn {
    /* from/to 方式 */
    from {
        transform: translateX(-100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes bounce {
    /* 百分比方式（更灵活） */
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-20px);
    }
}

@keyframes complex {
    0% {
        transform: scale(1) rotate(0deg);
        background: red;
    }
    50% {
        transform: scale(1.2) rotate(180deg);
        background: blue;
    }
    100% {
        transform: scale(1) rotate(360deg);
        background: green;
    }
}
```

### 应用动画

```css
.element {
    /* 完整属性 */
    animation-name: slideIn;
    animation-duration: 1s;
    animation-timing-function: ease;
    animation-delay: 0s;
    animation-iteration-count: 1;      /* 播放次数 */
    animation-direction: normal;        /* 播放方向 */
    animation-fill-mode: forwards;      /* 填充模式 */
    animation-play-state: running;      /* 播放状态 */
    
    /* 简写 */
    animation: slideIn 1s ease forwards;
    animation: bounce 0.5s ease infinite;
    
    /* 多个动画 */
    animation: slideIn 1s, fadeIn 0.5s;
}
```

### 动画属性详解

| 属性 | 值 | 说明 |
|------|-----|------|
| `iteration-count` | `1`, `2`, `infinite` | 播放次数 |
| `direction` | `normal`, `reverse`, `alternate` | 播放方向 |
| `fill-mode` | `none`, `forwards`, `backwards`, `both` | 动画前后状态 |
| `play-state` | `running`, `paused` | 播放/暂停 |

### 常见动画效果

```css
/* 弹跳效果 */
@keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-30px); }
    60% { transform: translateY(-15px); }
}

/* 脉冲效果 */
@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}

/* 摇晃效果 */
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
}

/* 旋转加载 */
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
.loading {
    animation: spin 1s linear infinite;
}
```

---

## 4. 性能优化

### 只动画这些属性

```css
/* ✅ 好：使用 transform 和 opacity */
.element {
    transition: transform 0.3s, opacity 0.3s;
}
.element:hover {
    transform: translateY(10px);
    opacity: 0.8;
}

/* ❌ 避免：动画这些属性会触发重排 */
.element {
    transition: width 0.3s, height 0.3s, left 0.3s;
}
```

### 开启 GPU 加速

```css
.element {
    /* 强制开启 GPU 加速 */
    will-change: transform;
    
    /* 或使用 3D 变换（Hack 方式） */
    transform: translateZ(0);
}
```

### 使用 will-change 谨慎

```css
/* ✅ 好：在动画即将开始前设置 */
.element:hover {
    will-change: transform;
}

/* ✅ 好：动画结束后移除 */
.element {
    transition: transform 0.3s;
}
.element.animating {
    will-change: transform;
}
```

---

## 小结

| 属性 | 作用 |
|------|------|
| `transform` | 变换元素 |
| `transition` | 状态变化的过渡效果 |
| `animation` | 关键帧动画 |
| `will-change` | 性能优化提示 |

---

[返回上级目录](../README.md)
