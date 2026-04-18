# 颜色与背景

> 颜色和背景是 CSS 中最直观的样式属性。掌握颜色表示法、背景属性和渐变技术，能为网页增添丰富的视觉效果。内容参考《CSS权威指南》等经典著作。

## 学习要点

- 🎨 掌握各种颜色表示法及其适用场景
- 🖼️ 理解背景属性的工作原理
- 🌈 学会使用各种渐变效果
- 📱 了解背景在响应式设计中的应用

---

## 1. 颜色表示法

### 1.1 颜色关键字

```css
/* 命名颜色 */
color: red;
color: blue;
color: coral;
color: rebeccapurple;  /* #663399 */

/* 特殊关键字 */
color: transparent;   /* 透明 */
color: currentColor;  /* 继承当前元素的 color 值 */

/* 系统颜色 */
color: Canvas;        /* 背景色 */
color: CanvasText;    /* 文本色 */
color: LinkText;      /* 链接色 */
color: VisitedText;   /* 已访问链接色 */
color: ButtonFace;    /* 按钮面颜色 */
color: ButtonText;    /* 按钮文本色 */
color: Highlight;     /* 选中高亮色 */
color: HighlightText; /* 选中文本色 */
```

#### currentColor 的妙用

```css
/* currentColor 引用当前元素的 color 值 */
.button {
    color: #1890ff;
    border: 2px solid currentColor;  /* 边框颜色 = color */
}

.button:hover {
    color: #40a9ff;
    /* 边框颜色自动跟随变化 */
}

/* 图标继承颜色 */
.icon {
    fill: currentColor;
}

/* SVG 图标 */
svg {
    fill: currentColor;
}
```

### 1.2 十六进制（Hexadecimal）

```css
/* 3 位十六进制（RGB 各用 1 位） */
color: #f00;   /* 红 */
color: #0f0;   /* 绿 */
color: #00f;   /* 蓝 */
color: #fff;   /* 白 */
color: #000;   /* 黑 */

/* 6 位十六进制（RGB 各用 2 位） */
color: #ff0000;  /* 红 */
color: #00ff00;  /* 绿 */
color: #0000ff;  /* 蓝 */
color: #1890ff;  /* 自定义蓝 */

/* 4 位十六进制（RGB + Alpha） */
color: #f00f;  /* 红色，完全不透明 */
color: #f008;  /* 红色，50% 透明 */
color: #f000;  /* 红色，完全透明 */

/* 8 位十六进制（RGB + Alpha） */
color: #ff0000ff;  /* 红色，完全不透明 */
color: #ff000080;  /* 红色，50% 透明 */
color: #ff000000;  /* 红色，完全透明 */
```

### 1.3 RGB / RGBA

```css
/* RGB（0-255） */
color: rgb(255, 0, 0);      /* 红 */
color: rgb(0, 255, 0);      /* 绿 */
color: rgb(0, 0, 255);      /* 蓝 */

/* RGBA（添加透明度） */
color: rgba(255, 0, 0, 1);    /* 红色，完全不透明 */
color: rgba(255, 0, 0, 0.5);  /* 红色，50% 透明 */
color: rgba(255, 0, 0, 0);    /* 红色，完全透明 */

/* 现代语法（推荐） */
color: rgb(255 0 0);          /* 使用空格分隔 */
color: rgb(255 0 0 / 1);      /* 使用 / 分隔透明度 */
color: rgb(255 0 0 / 50%);    /* 透明度使用百分比 */
color: rgb(255 0 0 / 0.5);    /* 或使用 0-1 的数值 */
```

### 1.4 HSL / HSLA

HSL 是一种更直观的颜色表示方式：
- **H (Hue)**: 色相，0-360 度
- **S (Saturation)**: 饱和度，0-100%
- **L (Lightness)**: 亮度，0-100%

```css
/* HSL */
color: hsl(0, 100%, 50%);    /* 红 */
color: hsl(120, 100%, 50%);  /* 绿 */
color: hsl(240, 100%, 50%);  /* 蓝 */

/* HSLA */
color: hsla(0, 100%, 50%, 1);    /* 红色，不透明 */
color: hsla(0, 100%, 50%, 0.5);  /* 红色，半透明 */

/* 现代语法 */
color: hsl(0deg 100% 50%);
color: hsl(0 100% 50% / 0.5);
color: hsl(0deg 100% 50% / 50%);
```

#### HSL 色相环

```
色相值对照：
0°   - 红色
60°  - 黄色
120° - 绿色
180° - 青色
240° - 蓝色
300° - 紫色
360° - 红色（回到起点）

              0° 红
               │
    300° 紫 ──┼── 60° 黄
               │
   240° 蓝 ───┼─── 120° 绿
               │
              180° 青
```

#### HSL 变体生成

```css
/* 基础颜色 */
:root {
    --h: 210;  /* 色相 */
    --s: 100%; /* 饱和度 */
    --l: 50%;  /* 亮度 */
}

/* 变体 */
.primary { color: hsl(var(--h), var(--s), var(--l)); }
.primary-light { color: hsl(var(--h), var(--s), 70%); }
.primary-lighter { color: hsl(var(--h), var(--s), 90%); }
.primary-dark { color: hsl(var(--h), var(--s), 35%); }
.primary-darker { color: hsl(var(--h), var(--s), 20%); }
```

### 1.5 其他颜色函数

```css
/* HWB（Hue-Whiteness-Blackness） */
color: hwb(0 0% 0%);      /* 红色 */
color: hwb(0 20% 0%);     /* 红色 + 20% 白 */
color: hwb(0 0% 20%);     /* 红色 + 20% 黑 */
color: hwb(0 0% 0% / 0.5); /* 半透明 */

/* LAB 颜色 */
color: lab(50% 0 0);      /* 中灰 */
color: lab(50% 80 0);     /* 鲜红 */
color: lab(50% -80 0);    /* 鲜绿 */

/* LCH 颜色（Lab 的极坐标形式） */
color: lch(50% 100 0deg); /* 亮度50%，彩度100，色相0度 */

/* OKLab / OKLCH（更准确的感知均匀性） */
color: oklab(0.5 0.1 0.1);
color: oklch(0.5 0.1 180deg);
```

### 1.6 颜色混合

```css
/* color-mix() 函数（现代浏览器） */
/* 两种颜色按比例混合 */
color: color-mix(in srgb, red, blue);           /* 50% 红 + 50% 蓝 */
color: color-mix(in srgb, red 70%, blue);        /* 70% 红 + 30% 蓝 */
color: color-mix(in srgb, red 70%, blue 30%);    /* 同上 */

/* 不同颜色空间混合 */
color: color-mix(in lch, red, blue);
color: color-mix(in oklch, red, blue);

/* 实际应用 */
.button {
    --base-color: #1890ff;
    --hover-color: color-mix(in srgb, var(--base-color), white 20%);
}
```

### 1.7 颜色对比度与可访问性

```css
/* WCAG 对比度要求 */
/* AA 级别：普通文本 4.5:1，大文本 3:1 */
/* AAA 级别：普通文本 7:1，大文本 4.5:1 */

/* 确保文本可读 */
.text-on-white {
    color: #333;  /* 白底深色文字，对比度约 12.6:1 ✓ */
}

.text-on-dark {
    color: #f0f0f0;  /* 深底浅色文字 */
}

/* 使用 CSS 变量管理配色 */
:root {
    --text-primary: #1a1a1a;
    --text-secondary: #666666;
    --bg-primary: #ffffff;
    --bg-secondary: #f5f5f5;
    
    /* 计算对比度：确保 ratio >= 4.5 */
}
```

---

## 2. 背景属性

### 2.1 background-color（背景色）

```css
/* 基本用法 */
background-color: #fff;
background-color: white;
background-color: rgb(255, 255, 255);
background-color: transparent;  /* 透明 */

/* 背景色与透明度 */
background-color: rgba(0, 0, 0, 0.5);  /* 半透明黑 */
background-color: #00000080;            /* 同上 */
```

### 2.2 background-image（背景图）

```css
/* 单张图片 */
background-image: url('image.jpg');

/* 多张图片（层叠） */
background-image: 
    url('overlay.png'),
    url('bg.jpg');

/* 渐变 */
background-image: linear-gradient(red, blue);
background-image: radial-gradient(circle, red, blue);

/* 无图片 */
background-image: none;

/* 图像集 */
background-image: image-set(
    'image-1x.webp' 1x,
    'image-2x.webp' 2x,
    'image-3x.webp' 3x
);
```

### 2.3 background-repeat（背景重复）

```css
background-repeat: repeat;     /* 默认：水平和垂直重复 */
background-repeat: repeat-x;   /* 仅水平重复 */
background-repeat: repeat-y;   /* 仅垂直重复 */
background-repeat: no-repeat;  /* 不重复 */
background-repeat: space;      /* 重复且间距均匀 */
background-repeat: round;      /* 重复且缩放以填满 */

/* 双值语法 */
background-repeat: repeat no-repeat;  /* 水平重复，垂直不重复 */
background-repeat: space round;        /* 水平 space，垂直 round */
```

#### 重复模式对比

```
repeat:     ┌──┬──┬──┬──┬──┐  完整重复
            │##│##│##│##│##│  可裁剪
            └──┴──┴──┴──┴──┘

space:      ┌──┐   ┌──┐   ┌──┐  完整显示
            │##│   │##│   │##│  间距均匀
            └──┘   └──┘   └──┘

round:      ┌─────┬─────┬─────┐  完整填满
            │ ##  │ ##  │ ##  │  缩放适应
            └─────┴─────┴─────┘
```

### 2.4 background-position（背景位置）

```css
/* 关键字 */
background-position: center;
background-position: top;
background-position: bottom;
background-position: left;
background-position: right;

/* 组合关键字 */
background-position: center center;  /* 居中 */
background-position: top left;       /* 左上 */
background-position: bottom right;   /* 右下 */
background-position: center top;     /* 顶部居中 */

/* 百分比（相对于容器减去图片） */
background-position: 50% 50%;   /* 居中 = center center */
background-position: 0% 0%;     /* 左上 = top left */
background-position: 100% 100%; /* 右下 = bottom right */

/* 像素/长度 */
background-position: 20px 30px;  /* 距左 20px，距顶 30px */
background-position: 20px center;

/* 边缘偏移 */
background-position: top 20px right 30px;  /* 距顶部 20px，距右边 30px */
background-position: bottom 10px left 20px;

/* 多背景定位 */
background-position: 0 0, center center;
```

### 2.5 background-size（背景大小）

```css
/* 关键字 */
background-size: auto;      /* 默认：原始大小 */
background-size: cover;     /* 覆盖容器，可能裁剪 */
background-size: contain;   /* 包含在容器内，可能留空 */

/* 固定大小 */
background-size: 100px 200px;  /* 宽 100px，高 200px */
background-size: 100px;        /* 宽 100px，高 auto */

/* 百分比 */
background-size: 50% 50%;      /* 容器宽高的 50% */
background-size: 100% auto;    /* 宽度撑满，高度自适应 */

/* 多背景大小 */
background-size: 50% auto, cover;
```

#### cover vs contain

```
原始图片:      cover:         contain:
┌────────┐    ┌──────────┐    ┌──────────┐
│        │    │##########│    │          │
│  图片   │    │## 裁剪 ##│    │┌──────┐ │
│        │    │##########│    ││ 图片 │ │
│        │    │##########│    │└──────┘ │
└────────┘    └──────────┘    │          │
                              └──────────┘
              填满容器          完整显示
              可能裁剪          可能留空
```

### 2.6 background-attachment（背景附着）

```css
background-attachment: scroll;  /* 默认：随页面滚动 */
background-attachment: fixed;   /* 固定在视口 */
background-attachment: local;   /* 随元素内容滚动 */
```

#### 视差滚动效果

```css
.parallax {
    height: 100vh;
    background-image: url('bg.jpg');
    background-size: cover;
    background-attachment: fixed;  /* 固定背景 */
    background-position: center;
}
```

### 2.7 background-origin（背景原点）

```css
background-origin: padding-box;  /* 默认：从 padding 区域开始 */
background-origin: border-box;   /* 从 border 区域开始 */
background-origin: content-box;  /* 从 content 区域开始 */
```

```
border-box:     padding-box:    content-box:
┌────────────┐  ┌────────────┐  ┌────────────┐
│##border####│  │  border    │  │   border   │
│##┌──────┐##│  │##padding##│  │   padding  │
│##│content│##│  │##┌────┐##│  │##content##│
│##└──────┘##│  │##└────┘##│  │###########│
└────────────┘  └────────────┘  └────────────┘
```

### 2.8 background-clip（背景裁剪）

```css
background-clip: border-box;    /* 默认：裁剪到 border 边缘 */
background-clip: padding-box;   /* 裁剪到 padding 边缘 */
background-clip: content-box;   /* 裁剪到 content 边缘 */
background-clip: text;          /* 裁剪到文字形状 */
```

#### 文字背景效果

```css
/* 渐变文字 */
.gradient-text {
    background: linear-gradient(45deg, #f06, #3cf);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* 图片文字 */
.image-text {
    background: url('texture.jpg');
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
```

### 2.9 background 简写

```css
/* 完整语法 */
background: 
    [background-color]
    [background-image]
    [background-repeat]
    [background-attachment]
    [background-position] / [background-size]
    [background-origin]
    [background-clip];

/* 常用示例 */
background: #fff url('bg.jpg') no-repeat center;
background: url('bg.jpg') center/cover no-repeat;
background: url('bg.jpg') 50% 50% / contain no-repeat border-box padding-box;

/* 多背景（用逗号分隔） */
background: 
    url('overlay.png') no-repeat center,
    url('bg.jpg') no-repeat center/cover;

/* 纯色背景 */
background: #f5f5f5;
```

---

## 3. CSS 渐变

### 3.1 线性渐变（linear-gradient）

```css
/* 基本语法 */
/* linear-gradient(方向, 颜色1, 颜色2, ...) */

/* 默认从上到下 */
background: linear-gradient(red, blue);

/* 指定方向 */
background: linear-gradient(to right, red, blue);      /* 从左到右 */
background: linear-gradient(to left, red, blue);       /* 从右到左 */
background: linear-gradient(to top, red, blue);        /* 从下到上 */
background: linear-gradient(to bottom right, red, blue); /* 对角线 */

/* 角度（0deg = 从下到上） */
background: linear-gradient(0deg, red, blue);      /* 从下到上 */
background: linear-gradient(90deg, red, blue);     /* 从左到右 */
background: linear-gradient(180deg, red, blue);    /* 从上到下 */
background: linear-gradient(45deg, red, blue);     /* 45度角 */

/* 多个颜色 */
background: linear-gradient(red, yellow, green, blue);
background: linear-gradient(90deg, red 0%, yellow 50%, green 100%);

/* 颜色停止点 */
background: linear-gradient(red 0%, red 30%, blue 30%, blue 100%);
/* 30% 处硬切换 */
```

#### 角度示意图

```
        0deg (to top)
           ↑
           │
270deg ←───┼───→ 90deg (to right)
           │
           ↓
       180deg (to bottom)

45deg 方向:
┌──────────────┐
│            ↗ │
│          ↗   │
│        ↗     │
│      ↗       │
│    ↗         │
│  ↗           │
│↗             │
└──────────────┘
```

#### 渐变条纹

```css
/* 水平条纹 */
.stripes-h {
    background: linear-gradient(
        red 0%, red 20%,
        blue 20%, blue 40%,
        red 40%, red 60%,
        blue 60%, blue 80%,
        red 80%, red 100%
    );
}

/* 垂直条纹 */
.stripes-v {
    background: linear-gradient(90deg,
        red 0%, red 50px,
        blue 50px, blue 100px
    );
    background-size: 100px 100%;
}

/* 斜条纹 */
.stripes-diagonal {
    background: repeating-linear-gradient(
        45deg,
        red,
        red 10px,
        blue 10px,
        blue 20px
    );
}
```

### 3.2 径向渐变（radial-gradient）

```css
/* 基本语法 */
/* radial-gradient(形状 大小 at 位置, 颜色1, 颜色2, ...) */

/* 默认：圆形，居中 */
background: radial-gradient(red, blue);

/* 形状 */
background: radial-gradient(circle, red, blue);
background: radial-gradient(ellipse, red, blue);  /* 默认 */

/* 大小 */
background: radial-gradient(closest-side, red, blue);   /* 到最近边 */
background: radial-gradient(closest-corner, red, blue); /* 到最近角 */
background: radial-gradient(farthest-side, red, blue);  /* 到最远边 */
background: radial-gradient(farthest-corner, red, blue);/* 到最远角（默认） */

/* 固定大小 */
background: radial-gradient(circle 100px, red, blue);
background: radial-gradient(ellipse 100px 50px, red, blue);

/* 位置 */
background: radial-gradient(at center, red, blue);
background: radial-gradient(at top left, red, blue);
background: radial-gradient(at 50% 50%, red, blue);
background: radial-gradient(at 20px 30px, red, blue);

/* 组合使用 */
background: radial-gradient(circle 100px at top left, red, blue);
background: radial-gradient(ellipse 80% 50% at 50% 50%, red, blue);

/* 多个颜色停止点 */
background: radial-gradient(
    circle at center,
    red 0%, 
    red 30%,
    yellow 30%, 
    yellow 60%,
    blue 60%, 
    blue 100%
);
```

#### 径向渐变形状

```
circle:         ellipse:
   ┌─────┐        ┌─────────┐
   │  ─── │        │    ─────│
   │ │   │ │        │  │     │ │
   │  ─── │        │    ─────│
   └─────┘        └─────────┘
```

### 3.3 锥形渐变（conic-gradient）

```css
/* 基本语法 */
/* conic-gradient(from 起始角度 at 中心位置, 颜色1 角度1, 颜色2 角度2, ...) */

/* 默认：从 0 度开始，居中 */
background: conic-gradient(red, yellow, blue);

/* 指定起始角度 */
background: conic-gradient(from 0deg, red, yellow, blue, red);
background: conic-gradient(from 45deg, red, yellow, blue);

/* 指定中心点 */
background: conic-gradient(at center, red, yellow, blue);
background: conic-gradient(at top left, red, yellow, blue);
background: conic-gradient(at 30% 70%, red, yellow, blue);

/* 指定颜色停止角度 */
background: conic-gradient(
    red 0deg,
    yellow 90deg,
    green 180deg,
    blue 270deg,
    red 360deg
);

/* 饼图效果 */
.pie-chart {
    background: conic-gradient(
        red 0deg 120deg,
        yellow 120deg 200deg,
        blue 200deg 360deg
    );
    border-radius: 50%;
}
```

### 3.4 重复渐变

```css
/* 重复线性渐变 */
background: repeating-linear-gradient(
    45deg,
    red,
    red 10px,
    blue 10px,
    blue 20px
);

/* 重复径向渐变 */
background: repeating-radial-gradient(
    circle at center,
    red,
    red 10px,
    blue 10px,
    blue 20px
);

/* 重复锥形渐变 */
background: repeating-conic-gradient(
    red 0deg 30deg,
    blue 30deg 60deg
);
```

### 3.5 渐变应用实例

#### 按钮渐变

```css
/* 基础渐变按钮 */
.btn-gradient {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

/* 悬停效果 */
.btn-gradient:hover {
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

/* 按钮边框渐变（透明背景） */
.btn-border-gradient {
    position: relative;
    background: white;
    border: none;
}

.btn-border-gradient::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 2px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-mask: 
        linear-gradient(#fff 0 0) content-box, 
        linear-gradient(#fff 0 0);
    mask: 
        linear-gradient(#fff 0 0) content-box, 
        linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
}
```

#### 卡片渐变背景

```css
/* 渐变卡片 */
.card-gradient {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* 霓虹效果 */
.card-neon {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 
        0 0 20px rgba(102, 126, 234, 0.5),
        0 0 40px rgba(118, 75, 162, 0.3);
}

/* 玻璃拟态 */
.card-glass {
    background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.1) 0%,
        rgba(255, 255, 255, 0.05) 100%
    );
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}
```

#### 文字渐变

```css
/* 渐变文字 */
.gradient-text {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* 动态渐变文字 */
.gradient-text-animated {
    background: linear-gradient(
        90deg,
        #f06 0%,
        #f90 25%,
        #3cf 50%,
        #0f6 75%,
        #f06 100%
    );
    background-size: 200% 100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradient-move 3s linear infinite;
}

@keyframes gradient-move {
    0% { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
}
```

#### 进度条

```css
/* 渐变进度条 */
.progress-bar {
    background: linear-gradient(90deg, #667eea, #764ba2);
    border-radius: 4px;
}

/* 条纹进度条 */
.progress-stripes {
    background: 
        linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.15) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.15) 50%,
            rgba(255, 255, 255, 0.15) 75%,
            transparent 75%
        ),
        linear-gradient(90deg, #667eea, #764ba2);
    background-size: 40px 40px, 100% 100%;
    animation: progress-stripes 1s linear infinite;
}

@keyframes progress-stripes {
    from { background-position: 40px 0, 0 0; }
    to { background-position: 0 0, 0 0; }
}
```

---

## 4. 多背景与层叠

### 4.1 多背景语法

```css
/* 多个背景层叠（先写的在上层） */
.multi-bg {
    background: 
        url('icon.png') no-repeat 10px 10px,
        url('overlay.png') no-repeat center,
        linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 分别设置各属性 */
.multi-bg {
    background-image: 
        url('icon.png'),
        url('overlay.png'),
        linear-gradient(135deg, #667eea, #764ba2);
    background-repeat: no-repeat, no-repeat, no-repeat;
    background-position: 10px 10px, center, center;
    background-size: 20px 20px, cover, cover;
}
```

### 4.2 实用组合

```css
/* 带图标的输入框 */
.input-with-icon {
    background: 
        url('search-icon.svg') no-repeat 10px center / 20px 20px,
        #fff;
    padding-left: 40px;
}

/* 带光晕效果 */
.glow-effect {
    background: 
        radial-gradient(circle at center, rgba(255, 255, 255, 0.8) 0%, transparent 70%),
        linear-gradient(135deg, #667eea, #764ba2);
}

/* 带噪点纹理 */
.noise-texture {
    background: 
        url('noise.png'),
        linear-gradient(135deg, #667eea, #764ba2);
    background-blend-mode: overlay;
}
```

### 4.3 background-blend-mode

```css
/* 混合模式 */
background-blend-mode: normal;      /* 默认 */
background-blend-mode: multiply;    /* 正片叠底（变暗） */
background-blend-mode: screen;      /* 滤色（变亮） */
background-blend-mode: overlay;     /* 叠加 */
background-blend-mode: darken;      /* 变暗 */
background-blend-mode: lighten;     /* 变亮 */
background-blend-mode: color-dodge; /* 颜色减淡 */
background-blend-mode: color-burn;  /* 颜色加深 */
background-blend-mode: soft-light;  /* 柔光 */
background-blend-mode: hard-light;  /* 强光 */
background-blend-mode: difference;  /* 差值 */
background-blend-mode: exclusion;   /* 排除 */
background-blend-mode: hue;         /* 色相 */
background-blend-mode: saturation;  /* 饱和度 */
background-blend-mode: color;       /* 颜色 */
background-blend-mode: luminosity;  /* 明度 */

/* 多值（对应多个背景层） */
background-blend-mode: multiply, screen, normal;
```

#### 混合模式效果

```css
/* 鼠标悬停变亮效果 */
.card {
    background: 
        url('photo.jpg'),
        #333;
    background-blend-mode: multiply;
}

.card:hover {
    background-blend-mode: screen;
}

/* 双色调效果 */
.duotone {
    background: 
        linear-gradient(to right, #f06, #0f6),
        url('photo.jpg');
    background-blend-mode: overlay;
}
```

---

## 5. 响应式背景

### 5.1 媒体查询切换背景

```css
.hero {
    background-image: url('hero-mobile.jpg');
    background-size: cover;
    background-position: center;
}

@media (min-width: 768px) {
    .hero {
        background-image: url('hero-tablet.jpg');
    }
}

@media (min-width: 1200px) {
    .hero {
        background-image: url('hero-desktop.jpg');
    }
}
```

### 5.2 image-set() 响应式图片

```css
.responsive-bg {
    background-image: image-set(
        'bg-small.jpg' 1x,
        'bg-medium.jpg' 2x,
        'bg-large.jpg' 3x
    );
}

/* 指定类型 */
.responsive-bg {
    background-image: image-set(
        'bg-small.webp' type('image/webp') 1x,
        'bg-small.jpg' type('image/jpeg') 1x,
        'bg-medium.webp' type('image/webp') 2x,
        'bg-medium.jpg' type('image/jpeg') 2x
    );
}
```

### 5.3 aspect-ratio 背景容器

```css
/* 保持宽高比的背景容器 */
.hero {
    aspect-ratio: 16 / 9;
    background: url('hero.jpg') center/cover;
}

/* 全屏英雄区 */
.hero-full {
    height: 100vh;
    background: 
        linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
        url('hero.jpg') center/cover;
}
```

---

## 小结

### 颜色表示法速查

| 方法 | 示例 | 特点 |
|------|------|------|
| 关键字 | `red`, `transparent` | 简单，有限 |
| 十六进制 | `#ff0000`, `#f00` | 紧凑，常用 |
| RGB | `rgb(255, 0, 0)` | 直观，可调透明度 |
| HSL | `hsl(0, 100%, 50%)` | 直观，易变体 |
| color-mix | `color-mix(in srgb, red, blue)` | 颜色混合 |

### 背景属性速查

| 属性 | 说明 | 常用值 |
|------|------|--------|
| `background-color` | 背景色 | 颜色值 |
| `background-image` | 背景图 | url(), 渐变 |
| `background-size` | 背景大小 | cover, contain, 像素, 百分比 |
| `background-position` | 背景位置 | center, 像素, 百分比 |
| `background-repeat` | 背景重复 | no-repeat, repeat-x/y |
| `background-attachment` | 背景附着 | scroll, fixed, local |
| `background-clip` | 背景裁剪 | border-box, text |
| `background-origin` | 背景原点 | padding-box, border-box |

### 渐变类型速查

| 类型 | 语法 | 用途 |
|------|------|------|
| 线性渐变 | `linear-gradient(角度, 颜色...)` | 按钮、背景、条纹 |
| 径向渐变 | `radial-gradient(形状 at 位置, 颜色...)` | 光晕、按钮高光 |
| 锥形渐变 | `conic-gradient(from 角度 at 位置, 颜色...)` | 饼图、色轮 |
| 重复渐变 | `repeating-linear-gradient(...)` | 条纹图案 |

---

## 参考资源

- [MDN CSS 颜色](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Colors)
- [MDN CSS 背景](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Backgrounds_and_Borders)
- [CSS 渐变指南](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Images/Using_CSS_gradients)
- [CSS 渐变生成器](https://cssgradient.io/)

---

[返回上级目录](../index.md)
