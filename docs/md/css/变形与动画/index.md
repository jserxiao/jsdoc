# 变形与动画

> CSS 变形（transform）、过渡（transition）和动画（animation）是现代网页动态效果的核心技术。掌握这些技术可以创建流畅、吸引人的交互体验。内容参考《CSS权威指南》等经典著作。

## 学习要点

- 🔄 掌握 2D/3D 变换的原理和用法
- ⚡ 理解过渡动画的时机和缓动
- 🎬 学会创建复杂的关键帧动画
- 🎯 能够优化动画性能

---

## 1. transform（变换）

### 1.1 2D 变换

#### translate（平移）

```css
.element {
    /* 平移 */
    transform: translate(50px, 100px);  /* x, y */
    transform: translate(50px);         /* 只传一个值 = x 方向 */
    transform: translateX(50px);        /* x 方向 */
    transform: translateY(100px);       /* y 方向 */
    
    /* 百分比（相对于自身尺寸） */
    transform: translate(50%, 50%);     /* 自身宽高的 50% */
    transform: translateX(-50%);        /* 向左移动自身宽度的 50% */
}

/* 居中定位技巧 */
.centered {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
```

#### scale（缩放）

```css
.element {
    /* 缩放 */
    transform: scale(2);           /* 整体放大 2 倍 */
    transform: scale(0.5);         /* 整体缩小一半 */
    transform: scale(2, 0.5);      /* x 方向 2 倍，y 方向 0.5 倍 */
    transform: scaleX(1.5);        /* 只水平缩放 */
    transform: scaleY(0.8);        /* 只垂直缩放 */
    
    /* 负值（镜像翻转） */
    transform: scaleX(-1);         /* 水平翻转 */
    transform: scale(-1, 1);       /* 水平翻转 */
}

/* 悬停缩放效果 */
.card {
    transition: transform 0.3s ease;
}
.card:hover {
    transform: scale(1.05);
}
```

#### rotate（旋转）

```css
.element {
    /* 旋转 */
    transform: rotate(45deg);      /* 顺时针 45 度 */
    transform: rotate(-90deg);     /* 逆时针 90 度 */
    transform: rotate(0.5turn);    /* 半圈 = 180deg */
    transform: rotate(1turn);      /* 一圈 = 360deg */
    
    /* 弧度单位 */
    transform: rotate(1rad);       /* 弧度 */
    transform: rotate(3.14159rad); /* π 弧度 ≈ 180deg */
}

/* 旋转加载动画 */
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
.loading {
    animation: spin 1s linear infinite;
}
```

#### skew（倾斜）

```css
.element {
    /* 倾斜 */
    transform: skew(10deg);        /* x 方向倾斜 */
    transform: skew(10deg, 20deg); /* x 和 y 方向 */
    transform: skewX(10deg);       /* 只水平倾斜 */
    transform: skewY(20deg);       /* 只垂直倾斜 */
}

/* 平行四边形效果 */
.parallelogram {
    transform: skewX(-20deg);
}
```

#### matrix（矩阵变换）

```css
/* matrix(a, b, c, d, tx, ty) */
/* 等价于：matrix( scaleX, skewY, skewX, scaleY, translateX, translateY ) */

.element {
    /* 使用矩阵 */
    transform: matrix(1, 0, 0, 1, 50, 100);  /* translate(50px, 100px) */
    transform: matrix(2, 0, 0, 2, 0, 0);     /* scale(2) */
    transform: matrix(0.866, 0.5, -0.5, 0.866, 0, 0);  /* rotate(30deg) */
    
    /* matrix3d 用于 3D 变换 */
    transform: matrix3d(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        50, 100, 0, 1
    );
}
```

### 1.2 transform-origin（变换原点）

```css
.element {
    /* 默认值 */
    transform-origin: center center;  /* 或 50% 50% */
    
    /* 关键字 */
    transform-origin: top left;
    transform-origin: bottom right;
    transform-origin: center top;
    
    /* 百分比 */
    transform-origin: 0 0;            /* 左上角 */
    transform-origin: 100% 100%;      /* 右下角 */
    transform-origin: 20% 80%;
    
    /* 像素 */
    transform-origin: 20px 30px;
    
    /* 三值（包含 z 轴） */
    transform-origin: center center 50px;
}
```

#### 变换原点示意图

```
transform-origin: center center:    transform-origin: top left:
         ┌─────────┐                      ┌─────────┐
         │    ○    │                      │○        │
         │         │                      │         │
         └─────────┘                      └─────────┘
         绕中心旋转                        绕左上角旋转
              ↻                                ↻
         ╲─────────╱                      ◠─────────╲
          ╲       ╱                        ╲        │
           ╲     ╱                          ╲       │
            ╲───╱                            ╲──────╱
```

### 1.3 多重变换

```css
/* 多个变换函数用空格分隔（从右向左执行） */
.element {
    transform: rotate(45deg) scale(1.5) translate(50px, 0);
}

/* 顺序很重要！ */
.box1 {
    transform: translate(50px) rotate(45deg);  /* 先旋转再平移 */
}
.box2 {
    transform: rotate(45deg) translate(50px);  /* 先平移再旋转 */
}

/* 组合变换示例 */
.card {
    transition: transform 0.3s ease;
}
.card:hover {
    transform: translateY(-5px) scale(1.02) rotate(2deg);
}
```

### 1.4 3D 变换

#### perspective（透视）

```css
/* 在父元素设置透视 */
.container {
    perspective: 1000px;  /* 透视距离（越小透视效果越强） */
}

/* 在元素本身设置 */
.element {
    transform: perspective(1000px) rotateY(45deg);
}

/* perspective-origin：消失点位置 */
.container {
    perspective: 1000px;
    perspective-origin: center center;  /* 默认 */
    perspective-origin: 50% 50%;
    perspective-origin: left top;
    perspective-origin: 200px 100px;
}
```

#### 3D 旋转

```css
.element {
    /* 绕轴旋转 */
    transform: rotateX(45deg);   /* 绕 X 轴（水平轴） */
    transform: rotateY(45deg);   /* 绕 Y 轴（垂直轴） */
    transform: rotateZ(45deg);   /* 绕 Z 轴（等同于 rotate） */
    
    /* 自定义轴旋转 */
    /* rotate3d(x, y, z, angle) */
    transform: rotate3d(1, 0, 0, 45deg);    /* 绕 X 轴 */
    transform: rotate3d(0, 1, 0, 45deg);    /* 绕 Y 轴 */
    transform: rotate3d(0, 0, 1, 45deg);    /* 绕 Z 轴 */
    transform: rotate3d(1, 1, 0, 45deg);    /* 绕 XY 对角线 */
}
```

#### 3D 平移

```css
.element {
    transform: translateZ(100px);              /* 向观察者方向移动 */
    transform: translate3d(10px, 20px, 30px);  /* x, y, z */
}
```

#### 3D 缩放

```css
.element {
    transform: scaleZ(2);            /* Z 方向缩放 */
    transform: scale3d(1, 1, 2);     /* x, y, z */
}
```

#### transform-style（变换风格）

```css
.container {
    transform-style: flat;         /* 默认：子元素不保留 3D 效果 */
    transform-style: preserve-3d;  /* 子元素保留 3D 效果 */
}

/* 立方体示例 */
.cube-container {
    perspective: 1000px;
}
.cube {
    transform-style: preserve-3d;
    transform: rotateX(-20deg) rotateY(45deg);
}
.cube-face {
    position: absolute;
    width: 200px;
    height: 200px;
}
.front  { transform: translateZ(100px); }
.back   { transform: translateZ(-100px) rotateY(180deg); }
.left   { transform: translateX(-100px) rotateY(-90deg); }
.right  { transform: translateX(100px) rotateY(90deg); }
.top    { transform: translateY(-100px) rotateX(90deg); }
.bottom { transform: translateY(100px) rotateX(-90deg); }
```

#### backface-visibility（背面可见性）

```css
.element {
    backface-visibility: visible;  /* 默认：背面可见 */
    backface-visibility: hidden;   /* 背面隐藏 */
}

/* 翻转卡片效果 */
.card-container {
    perspective: 1000px;
}
.card {
    transform-style: preserve-3d;
    transition: transform 0.6s;
}
.card.flipped {
    transform: rotateY(180deg);
}
.card-front, .card-back {
    backface-visibility: hidden;
    position: absolute;
}
.card-back {
    transform: rotateY(180deg);
}
```

---

## 2. transition（过渡）

### 2.1 基本语法

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
    transition: transform 0.3s, opacity 0.3s, background-color 0.5s;
}
```

### 2.2 transition-property（过渡属性）

```css
.element {
    transition-property: all;         /* 所有可动画属性 */
    transition-property: none;        /* 无过渡 */
    transition-property: transform;   /* 单个属性 */
    transition-property: transform, opacity;  /* 多个属性 */
}

/* 可动画属性示例 */
.animated {
    /* 可过渡 */
    transition: 
        width 0.3s,
        height 0.3s,
        opacity 0.3s,
        transform 0.3s,
        background-color 0.3s,
        color 0.3s,
        margin 0.3s,
        padding 0.3s;
    
    /* 不可过渡 */
    /* display, position, float 等无法过渡 */
}
```

### 2.3 transition-duration（持续时间）

```css
.element {
    transition-duration: 0.3s;   /* 秒 */
    transition-duration: 300ms;  /* 毫秒 */
    transition-duration: 0.3s, 0.5s;  /* 多个属性不同时间 */
}
```

### 2.4 transition-timing-function（缓动函数）

```css
.element {
    /* 关键字 */
    transition-timing-function: ease;        /* 默认：慢-快-慢 */
    transition-timing-function: linear;      /* 匀速 */
    transition-timing-function: ease-in;     /* 慢开始 */
    transition-timing-function: ease-out;    /* 慢结束 */
    transition-timing-function: ease-in-out; /* 慢开始和结束 */
    
    /* 贝塞尔曲线 */
    transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
    transition-timing-function: cubic-bezier(0.68, -0.55, 0.27, 1.55);  /* 弹性效果 */
    
    /* 步进函数 */
    transition-timing-function: steps(4, end);    /* 4 步，结束时跳跃 */
    transition-timing-function: steps(4, start);  /* 4 步，开始时跳跃 */
    transition-timing-function: step-start;       /* = steps(1, start) */
    transition-timing-function: step-end;         /* = steps(1, end) */
}
```

#### 缓动函数可视化

```
linear:          ease:           ease-in:        ease-out:
    ────             ╭──             ╭────            ────╮
                      ╯─             │                    │
                                     ╰──                  ╯

ease-in-out:
      ╭──
      │
      ╰──
```

#### 常用贝塞尔曲线

```css
:root {
    /* 预设曲线 */
    --ease-in-quad: cubic-bezier(0.55, 0.085, 0.68, 0.53);
    --ease-in-cubic: cubic-bezier(0.55, 0.055, 0.675, 0.19);
    --ease-in-quart: cubic-bezier(0.895, 0.03, 0.685, 0.22);
    --ease-in-expo: cubic-bezier(0.95, 0.05, 0.795, 0.035);
    
    --ease-out-quad: cubic-bezier(0.25, 0.46, 0.45, 0.94);
    --ease-out-cubic: cubic-bezier(0.215, 0.61, 0.355, 1);
    --ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1);
    --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
    
    --ease-in-out-quad: cubic-bezier(0.455, 0.03, 0.515, 0.955);
    --ease-in-out-cubic: cubic-bezier(0.645, 0.045, 0.355, 1);
    --ease-in-out-quart: cubic-bezier(0.77, 0, 0.175, 1);
    
    /* 弹性效果 */
    --ease-back: cubic-bezier(0.68, -0.55, 0.27, 1.55);
}
```

### 2.5 transition-delay（延迟时间）

```css
.element {
    transition-delay: 0s;       /* 无延迟 */
    transition-delay: 0.3s;     /* 延迟 0.3 秒 */
    transition-delay: -0.3s;    /* 负值：立即开始，但已执行了 0.3 秒 */
    
    /* 多个延迟 */
    transition-delay: 0.1s, 0.2s, 0.3s;
}
```

### 2.6 过渡实战示例

#### 按钮悬停效果

```css
.button {
    padding: 12px 24px;
    background: #1890ff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.button:hover {
    background: #40a9ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
}

.button:active {
    transform: translateY(0);
}
```

#### 下拉菜单

```css
.dropdown {
    position: relative;
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s ease;
}

.dropdown:hover .dropdown-menu,
.dropdown:focus-within .dropdown-menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}
```

#### 卡片悬停效果

```css
.card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}
```

#### 图片缩放

```css
.image-container {
    overflow: hidden;
}

.image-container img {
    transition: transform 0.5s ease;
}

.image-container:hover img {
    transform: scale(1.1);
}
```

---

## 3. animation（动画）

### 3.1 定义关键帧

```css
/* from/to 方式 */
@keyframes slideIn {
    from {
        transform: translateX(-100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

/* 百分比方式（更灵活） */
@keyframes bounce {
    0%, 100% {
        transform: translateY(0);
    }
    25% {
        transform: translateY(-20px);
    }
    50% {
        transform: translateY(-10px);
    }
    75% {
        transform: translateY(-15px);
    }
}

/* 多属性动画 */
@keyframes complexAnimation {
    0% {
        transform: scale(1) rotate(0deg);
        background: #f00;
        opacity: 1;
    }
    50% {
        transform: scale(1.2) rotate(180deg);
        background: #0f0;
        opacity: 0.8;
    }
    100% {
        transform: scale(1) rotate(360deg);
        background: #00f;
        opacity: 1;
    }
}
```

### 3.2 应用动画

```css
.element {
    /* 完整属性 */
    animation-name: slideIn;
    animation-duration: 1s;
    animation-timing-function: ease;
    animation-delay: 0s;
    animation-iteration-count: 1;
    animation-direction: normal;
    animation-fill-mode: forwards;
    animation-play-state: running;
    
    /* 简写 */
    animation: slideIn 1s ease forwards;
    animation: bounce 0.5s ease infinite;
    
    /* 多个动画 */
    animation: slideIn 1s, fadeIn 0.5s 0.5s;
}
```

### 3.3 动画属性详解

#### animation-duration（持续时间）

```css
animation-duration: 1s;
animation-duration: 1000ms;
animation-duration: 1s, 2s;  /* 多个动画 */
```

#### animation-timing-function（缓动函数）

```css
animation-timing-function: ease;
animation-timing-function: linear;
animation-timing-function: cubic-bezier(0.68, -0.55, 0.27, 1.55);

/* 步进动画 */
animation-timing-function: steps(8, end);  /* 8 步动画 */
```

#### animation-iteration-count（播放次数）

```css
animation-iteration-count: 1;       /* 播放 1 次 */
animation-iteration-count: 3;       /* 播放 3 次 */
animation-iteration-count: infinite; /* 无限循环 */
animation-iteration-count: 2, infinite;  /* 多个动画 */
```

#### animation-direction（播放方向）

```css
animation-direction: normal;      /* 默认：正向播放 */
animation-direction: reverse;     /* 反向播放 */
animation-direction: alternate;   /* 正向 → 反向交替 */
animation-direction: alternate-reverse;  /* 反向 → 正向交替 */
```

#### animation-fill-mode（填充模式）

```css
animation-fill-mode: none;      /* 默认：动画前后不应用任何样式 */
animation-fill-mode: forwards;  /* 动画结束后保持最后一帧 */
animation-fill-mode: backwards; /* 动画开始前应用第一帧 */
animation-fill-mode: both;      /* forwards + backwards */
```

```
填充模式示意：
          延迟        动画         结束
           │          │            │
none:      │ ──────── │ ───────── │ ──────── (回到原始状态)
forwards:  │ ──────── │ ───────── │ ════════ (保持最后一帧)
backwards: ═════════ │ ───────── │ ──────── (延迟期间显示第一帧)
both:      ═════════ │ ───────── │ ════════
```

#### animation-play-state（播放状态）

```css
animation-play-state: running;  /* 播放中 */
animation-play-state: paused;   /* 暂停 */

/* 悬停暂停 */
.animated {
    animation: spin 2s linear infinite;
}
.animated:hover {
    animation-play-state: paused;
}
```

### 3.4 常用动画效果库

#### 淡入淡出

```css
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInLeft {
    from {
        opacity: 0;
        transform: translateX(-30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes fadeInRight {
    from {
        opacity: 0;
        transform: translateX(30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}
```

#### 弹跳效果

```css
@keyframes bounce {
    0%, 20%, 53%, 80%, 100% {
        transform: translateY(0);
    }
    40%, 43% {
        transform: translateY(-30px);
    }
    70% {
        transform: translateY(-15px);
    }
    90% {
        transform: translateY(-4px);
    }
}

@keyframes bounceIn {
    0% {
        opacity: 0;
        transform: scale(0.3);
    }
    50% {
        transform: scale(1.05);
    }
    70% {
        transform: scale(0.9);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}
```

#### 脉冲效果

```css
@keyframes pulse {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}

@keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    14% { transform: scale(1.3); }
    28% { transform: scale(1); }
    42% { transform: scale(1.3); }
    70% { transform: scale(1); }
}
```

#### 摇晃效果

```css
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
    20%, 40%, 60%, 80% { transform: translateX(10px); }
}

@keyframes swing {
    20% { transform: rotate(15deg); }
    40% { transform: rotate(-10deg); }
    60% { transform: rotate(5deg); }
    80% { transform: rotate(-5deg); }
    100% { transform: rotate(0deg); }
}

@keyframes wobble {
    0% { transform: translateX(0); }
    15% { transform: translateX(-25px) rotate(-5deg); }
    30% { transform: translateX(20px) rotate(3deg); }
    45% { transform: translateX(-15px) rotate(-3deg); }
    60% { transform: translateX(10px) rotate(2deg); }
    75% { transform: translateX(-5px) rotate(-1deg); }
    100% { transform: translateX(0); }
}
```

#### 加载动画

```css
/* 旋转加载 */
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* 点点加载 */
@keyframes dotPulse {
    0%, 80%, 100% {
        transform: scale(0);
        opacity: 0.5;
    }
    40% {
        transform: scale(1);
        opacity: 1;
    }
}

.loading-dots span {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #1890ff;
    animation: dotPulse 1.4s ease-in-out infinite;
}
.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }
.loading-dots span:nth-child(3) { animation-delay: 0; }

/* 进度条 */
@keyframes progress {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

.progress-bar {
    background: linear-gradient(90deg, transparent, #1890ff, transparent);
    animation: progress 1.5s ease-in-out infinite;
}
```

#### 闪烁效果

```css
@keyframes flash {
    0%, 50%, 100% { opacity: 1; }
    25%, 75% { opacity: 0; }
}

@keyframes tada {
    0% { transform: scale(1); }
    10%, 20% {
        transform: scale(0.9) rotate(-3deg);
    }
    30%, 50%, 70%, 90% {
        transform: scale(1.1) rotate(3deg);
    }
    40%, 60%, 80% {
        transform: scale(1.1) rotate(-3deg);
    }
    100% {
        transform: scale(1) rotate(0);
    }
}
```

---

## 4. 性能优化

### 4.1 只动画合成属性

```css
/* ✅ 好：使用 transform 和 opacity（不触发重排重绘） */
.optimized {
    transition: transform 0.3s, opacity 0.3s;
}
.optimized:hover {
    transform: translateY(10px);
    opacity: 0.8;
}

/* ❌ 避免：触发重排的属性 */
.not-optimized {
    transition: width 0.3s, height 0.3s, top 0.3s, left 0.3s, margin 0.3s;
}
```

#### 属性性能对比

| 属性 | 重排 | 重绘 | 合成 | 推荐 |
|------|------|------|------|------|
| transform | ✗ | ✗ | ✓ | ✓ |
| opacity | ✗ | ✗ | ✓ | ✓ |
| filter | ✗ | ✓ | ✗ | 中 |
| color | ✗ | ✓ | ✗ | 中 |
| background | ✗ | ✓ | ✗ | 中 |
| width | ✓ | ✓ | ✗ | ✗ |
| height | ✓ | ✓ | ✗ | ✗ |
| top/left | ✓ | ✓ | ✗ | ✗ |
| margin | ✓ | ✓ | ✗ | ✗ |
| padding | ✓ | ✓ | ✗ | ✗ |

### 4.2 will-change（性能提示）

```css
.element {
    /* 提示浏览器元素将要变化 */
    will-change: transform;
    will-change: opacity;
    will-change: transform, opacity;
    
    /* 通用值 */
    will-change: auto;  /* 移除提示 */
}

/* 最佳实践：在交互开始前设置 */
.element:hover {
    will-change: transform;
}

/* 动画结束后移除 */
.element:not(:hover) {
    will-change: auto;
}
```

#### will-change 使用原则

```css
/* ❌ 避免：滥用 will-change（消耗内存） */
* {
    will-change: transform;  /* 千万不要这样做！ */
}

/* ❌ 避免：为太多元素设置 */
.many-elements .item {
    will-change: transform;  /* 太多了！ */
}

/* ✅ 好：仅在需要时设置 */
.slider-item {
    transition: transform 0.3s;
}
.slider-item.moving {
    will-change: transform;
}
```

### 4.3 创建独立图层

```css
/* 方法1：will-change */
.layer1 {
    will-change: transform;
}

/* 方法2：3D 变换 */
.layer2 {
    transform: translateZ(0);
}

/* 方法3：特定属性 */
.layer3 {
    backface-visibility: hidden;
}

/* 方法4：固定定位 */
.layer4 {
    position: fixed;
}
```

### 4.4 使用 CSS Containment

```css
/* 限制浏览器重排重绘范围 */
.container {
    contain: layout;       /* 布局隔离 */
    contain: paint;        /* 绘制隔离 */
    contain: layout paint; /* 组合 */
    contain: strict;       /* 最严格隔离 */
}

/* 适合独立组件 */
.widget {
    contain: layout style paint;
}
```

### 4.5 减少动画偏好

```css
/* 尊重用户偏好 */
@media (prefers-reduced-motion: reduce) {
    .animated {
        animation: none;
        transition: none;
    }
    
    /* 或使用更简单的动画 */
    .animated {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

---

## 5. 实战案例

### 5.1 翻转卡片

```html
<style>
.flip-card {
    perspective: 1000px;
    width: 200px;
    height: 200px;
}

.flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;
}

.flip-card:hover .flip-card-inner {
    transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
}

.flip-card-front {
    background: #1890ff;
    color: white;
}

.flip-card-back {
    background: #52c41a;
    color: white;
    transform: rotateY(180deg);
}
</style>

<div class="flip-card">
    <div class="flip-card-inner">
        <div class="flip-card-front">正面</div>
        <div class="flip-card-back">背面</div>
    </div>
</div>
```

### 5.2 滚动显示动画

```html
<style>
.reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal.visible {
    opacity: 1;
    transform: translateY(0);
}

/* 交错动画 */
.stagger-item {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.4s ease, transform 0.4s ease;
}

.stagger-item:nth-child(1) { transition-delay: 0s; }
.stagger-item:nth-child(2) { transition-delay: 0.1s; }
.stagger-item:nth-child(3) { transition-delay: 0.2s; }
.stagger-item:nth-child(4) { transition-delay: 0.3s; }
</style>

<script>
// 滚动监听
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
});
</script>
```

### 5.3 汉堡菜单动画

```html
<style>
.hamburger {
    width: 30px;
    height: 20px;
    position: relative;
    cursor: pointer;
}

.hamburger span {
    position: absolute;
    width: 100%;
    height: 3px;
    background: #333;
    border-radius: 3px;
    transition: all 0.3s ease;
}

.hamburger span:nth-child(1) { top: 0; }
.hamburger span:nth-child(2) { top: 50%; transform: translateY(-50%); }
.hamburger span:nth-child(3) { bottom: 0; }

/* X 状态 */
.hamburger.active span:nth-child(1) {
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
}

.hamburger.active span:nth-child(2) {
    opacity: 0;
}

.hamburger.active span:nth-child(3) {
    bottom: 50%;
    transform: translateY(50%) rotate(-45deg);
}
</style>

<div class="hamburger" onclick="this.classList.toggle('active')">
    <span></span>
    <span></span>
    <span></span>
</div>
```

---

## 小结

### transform 速查

| 函数 | 说明 | 示例 |
|------|------|------|
| translate | 平移 | `translate(50px, 100px)` |
| scale | 缩放 | `scale(1.5)` |
| rotate | 旋转 | `rotate(45deg)` |
| skew | 倾斜 | `skew(10deg)` |
| matrix | 矩阵 | `matrix(1,0,0,1,50,0)` |

### transition 速查

| 属性 | 说明 | 默认值 |
|------|------|--------|
| property | 过渡属性 | all |
| duration | 持续时间 | 0s |
| timing-function | 缓动函数 | ease |
| delay | 延迟 | 0s |

### animation 速查

| 属性 | 说明 | 默认值 |
|------|------|--------|
| name | 动画名称 | none |
| duration | 持续时间 | 0s |
| timing-function | 缓动函数 | ease |
| delay | 延迟 | 0s |
| iteration-count | 播放次数 | 1 |
| direction | 播放方向 | normal |
| fill-mode | 填充模式 | none |
| play-state | 播放状态 | running |

### 性能优化清单

| 做法 | 说明 |
|------|------|
| ✓ 使用 transform/opacity | 只触发合成 |
| ✓ 使用 will-change | 提示浏览器优化 |
| ✓ 减少动画元素 | 避免同时动画太多元素 |
| ✓ 使用 CSS Containment | 隔离重排范围 |
| ✓ 尊重用户偏好 | prefers-reduced-motion |
| ✗ 避免动画布局属性 | width, height, top, left |
| ✗ 避免滥用 will-change | 消耗内存 |

---

## 参考资源

- [MDN CSS Transform](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform)
- [MDN CSS Transition](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transition)
- [MDN CSS Animation](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation)
- [CSS 动画性能优化](https://web.dev/animations/)
- [Cubic-bezier 生成器](https://cubic-bezier.com/)

---

[返回上级目录](../index.md)
