# 性能优化

性能优化是前端开发的高级主题，直接影响用户体验。本模块涵盖性能监控、优化策略和内存管理。

---

## 📁 模块目录

| 序号 | 模块 | 主要内容 | 文件 |
|------|------|----------|------|
| 1 | 性能检测 | Performance API、Web Vitals、性能监控 | [01-性能检测.md](./01-性能检测.md) |
| 2 | 优化策略 | 代码优化、加载优化、渲染优化 | [02-优化策略.md](./02-优化策略.md) |
| 3 | 内存管理与垃圾回收 | 内存泄漏检测、GC 原理、内存优化 | [03-内存管理与垃圾回收.md](./03-内存管理与垃圾回收.md) |

---

## 🎯 学习目标

学完本模块，你应该能够：

- ✅ 使用 Performance API 分析页面性能
- ✅ 理解 Core Web Vitals 核心指标
- ✅ 实施代码、加载和渲染层面的优化
- ✅ 识别和修复内存泄漏
- ✅ 建立性能监控体系

---

## 📊 Web Vitals 核心指标

### 核心指标（Core Web Vitals）

```
┌─────────────────────────────────────────────────────────────┐
│                    Core Web Vitals                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  LCP (Largest Contentful Paint)                             │
│  ├── 最大内容绘制时间                                        │
│  ├── 衡量加载性能                                            │
│  └── 目标: ≤ 2.5 秒                                          │
│                                                             │
│  FID (First Input Delay)                                    │
│  ├── 首次输入延迟                                            │
│  ├── 衡量交互性                                              │
│  └── 目标: ≤ 100 毫秒                                        │
│                                                             │
│  CLS (Cumulative Layout Shift)                              │
│  ├── 累积布局偏移                                            │
│  ├── 衡量视觉稳定性                                          │
│  └── 目标: ≤ 0.1                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 其他重要指标

| 指标 | 全称 | 含义 | 目标值 |
|------|------|------|--------|
| FCP | First Contentful Paint | 首次内容绘制 | ≤ 1.8s |
| TTFB | Time to First Byte | 首字节时间 | ≤ 600ms |
| TTI | Time to Interactive | 可交互时间 | ≤ 3.8s |
| TBT | Total Blocking Time | 总阻塞时间 | ≤ 200ms |

---

## 🔧 性能优化策略

### 加载优化

```
资源加载优化
├── 代码分割（Code Splitting）
│   ├── 路由级分割
│   └── 组件级分割
├── 懒加载（Lazy Loading）
│   ├── 图片懒加载
│   └── 组件懒加载
├── 预加载（Preload/Prefetch）
│   ├── <link rel="preload">
│   └── <link rel="prefetch">
└── 压缩优化
    ├── Gzip/Brotli
    └── 图片压缩
```

### 渲染优化

```
渲染性能优化
├── 减少 DOM 操作
│   ├── 批量更新
│   └── 虚拟列表
├── CSS 优化
│   ├── 避免 @import
│   └── 使用 transform
├── JavaScript 优化
│   ├── 防抖节流
│   └── Web Worker
└── 动画优化
    ├── 使用 requestAnimationFrame
    └── 启用 GPU 加速
```

---

## 🚨 常见性能问题

### 1. 长任务阻塞

```javascript
// ❌ 长任务阻塞主线程
function processData(data) {
  for (let i = 0; i < data.length; i++) {
    // 大量计算...
  }
}

// ✅ 使用时间切片
function processDataChunked(data, chunkSize = 1000) {
  let index = 0;

  function processChunk() {
    const end = Math.min(index + chunkSize, data.length);

    while (index < end) {
      // 处理数据
      index++;
    }

    if (index < data.length) {
      requestIdleCallback(processChunk);
    }
  }

  processChunk();
}
```

### 2. 内存泄漏

```javascript
// ❌ 未清理的事件监听
const element = document.getElementById('btn');
element.addEventListener('click', handler);
// element 被移除，但监听器未清理

// ✅ 正确清理
const controller = new AbortController();
element.addEventListener('click', handler, {
  signal: controller.signal
});

// 清理时
controller.abort();
```

### 3. 布局抖动

```javascript
// ❌ 强制同步布局
for (let i = 0; i < elements.length; i++) {
  elements[i].style.width = elements[i].offsetWidth + 10 + 'px';
}

// ✅ 批量读写
const widths = elements.map(el => el.offsetWidth + 10);
elements.forEach((el, i) => {
  el.style.width = widths[i] + 'px';
});
```

---

## 🛠️ 性能检测工具

### 浏览器工具

- **Chrome DevTools**：Performance、Memory、Network 面板
- **Lighthouse**：综合性能审计
- **Coverage**：代码覆盖率分析

### 在线工具

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)
- [GTmetrix](https://gtmetrix.com/)

### 代码监控

```javascript
// 使用 PerformanceObserver 监控
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(entry.name, entry.duration);
  }
});

observer.observe({ entryTypes: ['measure', 'resource', 'paint'] });
```

---

## 📈 性能监控流程

```
性能监控流程
    │
    ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   数据采集   │ ──► │   数据上报   │ ──► │   数据分析   │
└─────────────┘     └─────────────┘     └─────────────┘
      │                   │                   │
      ▼                   ▼                   ▼
  Performance API      Beacon API        可视化面板
  Web Vitals           sendBeacon        告警系统
  自定义指标           批量上报          报表生成
```

---

## 🔗 学习路径

```
开始
  │
  ▼
[性能检测] ──► Performance API、Web Vitals
  │
  ▼
[优化策略] ──► 代码、加载、渲染优化
  │
  ▼
[内存管理] ──► GC 原理、内存泄漏
  │
  ▼
完成性能优化模块 ✓
```

---

## 📚 参考资源

- [Google Web Vitals](https://web.dev/vitals/)
- [MDN Performance API](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance)
- [High Performance Browser Networking](https://hpbn.co/)
- [JavaScript Performance](https://developer.mozilla.org/zh-CN/docs/Web/Performance)

---

[返回上级目录](../)
