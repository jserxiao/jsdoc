# SVG 与 Canvas

> SVG 和 Canvas 是 HTML5 提供的两种图形绘制技术。SVG 适合矢量图形，Canvas 适合像素图形和游戏。

## 学习要点

- 🎨 理解 SVG 和 Canvas 的区别
- 📐 掌握 SVG 基本图形的绘制
- 🖼️ 学会使用 Canvas API
- 🎯 根据场景选择合适的技术

---

## 1. SVG vs Canvas 对比

| 特性 | SVG | Canvas |
|------|-----|--------|
| 类型 | 矢量图形 | 位图（像素） |
| 缩放 | 无损缩放 | 放大会模糊 |
| DOM | 每个图形是 DOM 元素 | 只有一个 canvas 元素 |
| 事件 | 支持事件绑定 | 需手动计算点击区域 |
| 性能 | 大量元素时慢 | 适合大量绘制 |
| 适用场景 | 图标、图表、简单图形 | 游戏、图像处理 |

---

## 2. SVG 基础

### 内联 SVG

```html
<!-- SVG 基本结构 -->
<svg width="100" height="100" viewBox="0 0 100 100">
    <!-- viewBox 定义内部坐标系统 -->
</svg>
```

### 基本形状

```html
<svg width="200" height="200">
    <!-- 矩形 -->
    <rect 
        x="10" y="10" 
        width="80" height="60" 
        fill="red" 
        stroke="black" 
        stroke-width="2"
        rx="5" ry="5"  <!-- 圆角 -->
    />
    
    <!-- 圆形 -->
    <circle 
        cx="150" cy="50"  <!-- 圆心坐标 -->
        r="30"             <!-- 半径 -->
        fill="blue"
    />
    
    <!-- 椭圆 -->
    <ellipse 
        cx="100" cy="150" 
        rx="60" ry="30"    <!-- 横向和纵向半径 -->
        fill="green"
    />
    
    <!-- 线条 -->
    <line 
        x1="0" y1="0" 
        x2="200" y2="200" 
        stroke="black" 
        stroke-width="2"
    />
    
    <!-- 多边形（自动闭合） -->
    <polygon 
        points="50,10 90,90 10,90" 
        fill="purple"
    />
    
    <!-- 折线（不闭合） -->
    <polyline 
        points="10,10 50,50 10,90" 
        fill="none" 
        stroke="orange"
    />
</svg>
```

### 路径（Path）

```html
<svg width="200" height="200">
    <!-- M: 移动到, L: 连线到, Z: 闭合路径 -->
    <path d="M 10 10 L 90 10 L 90 90 L 10 90 Z" fill="red"/>
    
    <!-- H: 水平线, V: 垂直线 -->
    <path d="M 110 10 H 190 V 90 H 110 Z" fill="blue"/>
    
    <!-- C: 三次贝塞尔曲线 -->
    <path d="M 10 100 C 10 150, 90 150, 90 100" 
          fill="none" stroke="green"/>
    
    <!-- Q: 二次贝塞尔曲线 -->
    <path d="M 110 100 Q 150 50, 190 100" 
          fill="none" stroke="purple"/>
    
    <!-- A: 弧线 -->
    <path d="M 10 180 A 40 40 0 1 1 90 180" 
          fill="none" stroke="orange"/>
</svg>
```

### 文本

```html
<svg width="200" height="100">
    <text x="10" y="50" font-size="20" fill="black">
        Hello SVG
    </text>
    
    <!-- 沿路径排列文字 -->
    <defs>
        <path id="myPath" d="M 10 50 Q 50 10, 90 50"/>
    </defs>
    <text>
        <textPath href="#myPath">Text along path</textPath>
    </text>
</svg>
```

### 分组与复用

```html
<svg width="200" height="200">
    <!-- 定义可复用元素 -->
    <defs>
        <circle id="myCircle" r="20" fill="blue"/>
    </defs>
    
    <!-- 复用元素 -->
    <use href="#myCircle" x="30" y="30"/>
    <use href="#myCircle" x="70" y="30"/>
    <use href="#myCircle" x="50" y="70"/>
    
    <!-- 分组 -->
    <g fill="red" stroke="black">
        <rect x="10" y="100" width="40" height="40"/>
        <rect x="60" y="100" width="40" height="40"/>
    </g>
</svg>
```

---

## 3. Canvas 基础

### 基本设置

```html
<canvas id="myCanvas" width="400" height="300"></canvas>

<script>
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');  // 获取 2D 绑图上下文
</script>
```

### 绑制矩形

```javascript
// 填充矩形
ctx.fillStyle = 'red';
ctx.fillRect(10, 10, 100, 50);  // x, y, width, height

// 描边矩形
ctx.strokeStyle = 'blue';
ctx.lineWidth = 3;
ctx.strokeRect(120, 10, 100, 50);

// 清除矩形区域
ctx.clearRect(30, 20, 60, 30);
```

### 绑制路径

```javascript
// 开始路径
ctx.beginPath();

// 移动到起点
ctx.moveTo(50, 50);

// 连线
ctx.lineTo(150, 50);
ctx.lineTo(100, 120);

// 闭合路径
ctx.closePath();

// 填充
ctx.fillStyle = 'green';
ctx.fill();

// 或描边
ctx.stroke();
```

### 绑制圆形和弧线

```javascript
ctx.beginPath();
// arc(x, y, radius, startAngle, endAngle, anticlockwise)
ctx.arc(100, 100, 50, 0, Math.PI * 2);  // 完整圆
ctx.fillStyle = 'blue';
ctx.fill();

// 弧线
ctx.beginPath();
ctx.arc(200, 100, 50, 0, Math.PI);  // 半圆
ctx.stroke();
```

### 绑制文本

```javascript
// 填充文本
ctx.font = '24px Arial';
ctx.fillStyle = 'black';
ctx.fillText('Hello Canvas', 10, 50);

// 描边文本
ctx.strokeStyle = 'red';
ctx.strokeText('Stroke Text', 10, 80);

// 文本测量
const metrics = ctx.measureText('Hello');
console.log(metrics.width);
```

### 绑制图片

```javascript
const img = new Image();
img.onload = function() {
    // 绘制图片
    ctx.drawImage(img, 0, 0);
    
    // 缩放绘制
    ctx.drawImage(img, 0, 0, 200, 150);
    
    // 裁剪绘制
    // drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
    ctx.drawImage(img, 50, 50, 100, 100, 0, 0, 200, 200);
};
img.src = 'image.jpg';
```

---

## 4. Canvas 高级功能

### 渐变

```javascript
// 线性渐变
const linearGradient = ctx.createLinearGradient(0, 0, 200, 0);
linearGradient.addColorStop(0, 'red');
linearGradient.addColorStop(0.5, 'yellow');
linearGradient.addColorStop(1, 'blue');
ctx.fillStyle = linearGradient;
ctx.fillRect(0, 0, 200, 100);

// 径向渐变
const radialGradient = ctx.createRadialGradient(100, 100, 0, 100, 100, 50);
radialGradient.addColorStop(0, 'white');
radialGradient.addColorStop(1, 'black');
ctx.fillStyle = radialGradient;
ctx.fillRect(0, 100, 200, 100);
```

### 阴影

```javascript
ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
ctx.shadowBlur = 10;
ctx.shadowOffsetX = 5;
ctx.shadowOffsetY = 5;
ctx.fillStyle = 'red';
ctx.fillRect(50, 50, 100, 100);
```

### 变换

```javascript
// 平移
ctx.translate(100, 100);

// 旋转（弧度）
ctx.rotate(Math.PI / 4);

// 缩放
ctx.scale(2, 2);

// 变换矩阵
ctx.setTransform(1, 0, 0, 1, 0, 0); // 重置
ctx.transform(a, b, c, d, e, f);
```

### 动画示例

```javascript
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 更新状态
    x += vx;
    y += vy;
    
    // 绘制
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
    
    requestAnimationFrame(draw);
}

draw();
```

---

## 5. 选择指南

```
选择 SVG 当：
- 需要高质量缩放（图标、logo）
- 图形较少，需要交互
- 需要动画且性能要求不高

选择 Canvas 当：
- 游戏、粒子效果
- 实时图像处理
- 需要大量绑制
- 数据可视化（大量数据点）
```

---

## 小结

| 技术 | 特点 | 适用场景 |
|------|------|----------|
| SVG | 矢量、DOM、可交互 | 图标、简单图表 |
| Canvas | 位图、高性能 | 游戏、图像处理 |

---

[返回上级目录](../README.md)
