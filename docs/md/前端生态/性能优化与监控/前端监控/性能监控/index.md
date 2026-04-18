# 性能监控

> 性能监控是前端监控的核心模块，通过采集和分析 Web Vitals 等性能指标，帮助开发者了解页面性能状况并发现优化机会。

## 学习要点

- 📊 掌握 Web Vitals 核心指标体系
- ⏱️ 学会页面加载性能采集
- 🎨 理解渲染性能监控方法
- 📦 掌握资源加载监控
- ⚡ 实现长任务监控

---

## 1. Web Vitals 指标体系

### 1.1 核心指标（Core Web Vitals）

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  Core Web Vitals - Google 核心网页指标                                                 │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  LCP (Largest Contentful Paint) - 最大内容绘制                                  │ │
│  │  ┌──────────────────────────────────────────────────────────────────────────┐  │ │
│  │  │ 含义：页面主要内容加载完成的时间                                           │  │ │
│  │  │ 计算：视口内最大的图片/文本/视频元素的渲染时间                             │  │ │
│  │  │ 优秀：< 2.5s   需改进：2.5s-4s   差：> 4s                                 │  │ │
│  │  │ 影响因素：服务器响应时间、资源加载、渲染阻塞                               │  │ │
│  │  └──────────────────────────────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  INP (Interaction to Next Paint) - 交互到下一次绘制                             │ │
│  │  ┌──────────────────────────────────────────────────────────────────────────┐  │ │
│  │  │ 含义：用户交互后页面响应的速度（替代 FID）                                 │  │ │
│  │  │ 计算：所有交互延迟的最大值（忽略离群值）                                   │  │ │
│  │  │ 优秀：< 200ms   需改进：200-500ms   差：> 500ms                           │  │ │
│  │  │ 影响因素：JavaScript 执行时间、主线程阻塞、事件处理器复杂度               │  │ │
│  │  └──────────────────────────────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  CLS (Cumulative Layout Shift) - 累积布局偏移                                   │ │
│  │  ┌──────────────────────────────────────────────────────────────────────────┐  │ │
│  │  │ 含义：页面视觉稳定性                                                       │  │ │
│  │  │ 计算：所有意外布局偏移分数的总和                                           │  │ │
│  │  │ 优秀：< 0.1   需改进：0.1-0.25   差：> 0.25                               │  │ │
│  │  │ 影响因素：图片/视频尺寸未知、动态内容插入、字体加载                        │  │ │
│  │  └──────────────────────────────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 辅助指标

| 指标 | 全称 | 含义 | 优秀值 | 采集方式 |
|------|------|------|--------|----------|
| FCP | First Contentful Paint | 首次内容绘制 | < 1.8s | Paint Timing |
| TTFB | Time to First Byte | 首字节时间 | < 800ms | Navigation Timing |
| TTI | Time to Interactive | 可交互时间 | < 3.8s | 计算 |
| TBT | Total Blocking Time | 总阻塞时间 | < 200ms | Long Task API |
| SI | Speed Index | 速度指数 | < 3.4s | Lighthouse |
| FMP | First Meaningful Paint | 首次有效绘制 | - | 已废弃 |

### 1.3 指标评级标准

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// Web Vitals 评级标准
// ────────────────────────────────────────────────────────────────────────────────────

const RATING_THRESHOLDS = {
    // 核心指标
    lcp: {
        good: 2500,      // <= 2.5s
        needsImprovement: 4000  // <= 4s
    },
    inp: {
        good: 200,       // <= 200ms
        needsImprovement: 500   // <= 500ms
    },
    cls: {
        good: 0.1,       // <= 0.1
        needsImprovement: 0.25  // <= 0.25
    },
    fid: {
        good: 100,       // <= 100ms
        needsImprovement: 300   // <= 300ms
    },
    // 辅助指标
    fcp: {
        good: 1800,      // <= 1.8s
        needsImprovement: 3000  // <= 3s
    },
    ttfb: {
        good: 800,       // <= 800ms
        needsImprovement: 1800  // <= 1.8s
    }
};

/**
 * 获取指标评级
 * @param {string} metric - 指标名称
 * @param {number} value - 指标值
 * @returns {'good' | 'needs-improvement' | 'poor'}
 */
function getRating(metric, value) {
    const thresholds = RATING_THRESHOLDS[metric];
    if (!thresholds) return 'unknown';
    
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.needsImprovement) return 'needs-improvement';
    return 'poor';
}
```

---

## 2. 页面加载性能采集

### 2.1 Navigation Timing API

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// Navigation Timing API - 页面加载性能
// ────────────────────────────────────────────────────────────────────────────────────

/**
 * 页面加载时间线
 * 
 * navigationStart → fetchStart → domainLookupStart → domainLookupEnd
 * → connectStart → connectEnd → requestStart → responseStart → responseEnd
 * → domLoading → domInteractive → domContentLoadedEventStart → domContentLoadedEventEnd
 * → domComplete → loadEventStart → loadEventEnd
 */

class PageLoadMonitor {
    constructor(reporter) {
        this.reporter = reporter;
        this.metrics = {};
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 采集页面加载性能
    // ─────────────────────────────────────────────────────────────────────────────
    
    collect() {
        // 使用 Navigation Timing Level 2 API
        const navigationEntry = performance.getEntriesByType('navigation')[0];
        
        if (navigationEntry) {
            this.processNavigationEntry(navigationEntry);
        } else {
            // 降级使用 Level 1 API
            this.processLegacyTiming();
        }
        
        return this.metrics;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 处理 Navigation Timing Level 2
    // ─────────────────────────────────────────────────────────────────────────────
    
    processNavigationEntry(entry) {
        // 页面加载时间线
        this.metrics = {
            // ─────────────────────────────────────────────────────────────────
            // 网络阶段
            // ─────────────────────────────────────────────────────────────────
            
            // 重定向时间
            redirectTime: entry.redirectEnd - entry.redirectStart,
            redirectCount: entry.redirectCount,
            
            // DNS 查询时间
            dnsTime: entry.domainLookupEnd - entry.domainLookupStart,
            
            // TCP 连接时间
            tcpTime: entry.connectEnd - entry.connectStart,
            
            // SSL 握手时间
            sslTime: entry.secureConnectionStart > 0 
                ? entry.connectEnd - entry.secureConnectionStart 
                : 0,
            
            // TTFB - 首字节时间
            ttfb: entry.responseStart - entry.requestStart,
            
            // 内容下载时间
            downloadTime: entry.responseEnd - entry.responseStart,
            
            // ─────────────────────────────────────────────────────────────────
            // 解析阶段
            // ─────────────────────────────────────────────────────────────────
            
            // DOM 解析时间
            domParseTime: entry.domInteractive - entry.responseEnd,
            
            // 资源加载时间
            resourceLoadTime: entry.loadEventStart - entry.domContentLoadedEventEnd,
            
            // ─────────────────────────────────────────────────────────────────
            // 关键时间点
            // ─────────────────────────────────────────────────────────────────
            
            // DOM Ready 时间
            domReady: entry.domContentLoadedEventEnd - entry.startTime,
            
            // 页面完全加载时间
            pageLoad: entry.loadEventEnd - entry.startTime,
            
            // ─────────────────────────────────────────────────────────────────
            // 其他信息
            // ─────────────────────────────────────────────────────────────────
            
            // 导航类型
            navigationType: entry.type,  // navigate, reload, back_forward, prerender
            
            // 传输大小
            transferSize: entry.transferSize,
            encodedBodySize: entry.encodedBodySize,
            decodedBodySize: entry.decodedBodySize,
            
            // 压缩率
            compressionRatio: entry.decodedBodySize > 0 
                ? (1 - entry.encodedBodySize / entry.decodedBodySize).toFixed(2) 
                : 0
        };
        
        // 添加评级
        this.metrics.ttfbRating = getRating('ttfb', this.metrics.ttfb);
        
        // 上报
        this.report({
            type: 'performance',
            subType: 'pageLoad',
            ...this.metrics
        });
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 处理旧版 API
    // ─────────────────────────────────────────────────────────────────────────────
    
    processLegacyTiming() {
        const t = performance.timing;
        
        this.metrics = {
            dnsTime: t.domainLookupEnd - t.domainLookupStart,
            tcpTime: t.connectEnd - t.connectStart,
            ttfb: t.responseStart - t.navigationStart,
            downloadTime: t.responseEnd - t.responseStart,
            domReady: t.domContentLoadedEventEnd - t.navigationStart,
            pageLoad: t.loadEventEnd - t.navigationStart
        };
        
        this.report({
            type: 'performance',
            subType: 'pageLoad',
            ...this.metrics
        });
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 格式化输出
    // ─────────────────────────────────────────────────────────────────────────────
    
    formatOutput() {
        return {
            '网络阶段': {
                'DNS 查询': `${this.metrics.dnsTime}ms`,
                'TCP 连接': `${this.metrics.tcpTime}ms`,
                'SSL 握手': `${this.metrics.sslTime}ms`,
                '首字节(TTFB)': `${this.metrics.ttfb}ms`,
                '内容下载': `${this.metrics.downloadTime}ms`
            },
            '解析阶段': {
                'DOM 解析': `${this.metrics.domParseTime}ms`,
                '资源加载': `${this.metrics.resourceLoadTime}ms`
            },
            '关键指标': {
                'DOM Ready': `${this.metrics.domReady}ms`,
                '页面加载': `${this.metrics.pageLoad}ms`
            },
            '资源大小': {
                '传输大小': `${(this.metrics.transferSize / 1024).toFixed(2)}KB`,
                '压缩率': `${(this.metrics.compressionRatio * 100).toFixed(1)}%`
            }
        };
    }
    
    report(data) {
        if (this.reporter) {
            this.reporter.report(data);
        }
    }
}
```

### 2.2 页面加载瀑布图

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 生成页面加载瀑布图数据
// ────────────────────────────────────────────────────────────────────────────────────

function generateWaterfall() {
    const navigationEntry = performance.getEntriesByType('navigation')[0];
    if (!navigationEntry) return null;
    
    const startTime = navigationEntry.startTime;
    
    // 定义各个阶段
    const phases = [
        {
            name: 'Redirect',
            start: navigationEntry.redirectStart - startTime,
            end: navigationEntry.redirectEnd - startTime,
            color: '#999'
        },
        {
            name: 'DNS',
            start: navigationEntry.domainLookupStart - startTime,
            end: navigationEntry.domainLookupEnd - startTime,
            color: '#1e90ff'
        },
        {
            name: 'TCP',
            start: navigationEntry.connectStart - startTime,
            end: navigationEntry.connectEnd - startTime,
            color: '#32cd32'
        },
        {
            name: 'SSL',
            start: navigationEntry.secureConnectionStart - startTime,
            end: navigationEntry.connectEnd - startTime,
            color: '#9370db'
        },
        {
            name: 'Request',
            start: navigationEntry.requestStart - startTime,
            end: navigationEntry.responseStart - startTime,
            color: '#ffa500'
        },
        {
            name: 'Response',
            start: navigationEntry.responseStart - startTime,
            end: navigationEntry.responseEnd - startTime,
            color: '#ff6347'
        },
        {
            name: 'DOM Processing',
            start: navigationEntry.domLoading - startTime,
            end: navigationEntry.domComplete - startTime,
            color: '#20b2aa'
        },
        {
            name: 'Load Event',
            start: navigationEntry.loadEventStart - startTime,
            end: navigationEntry.loadEventEnd - startTime,
            color: '#dc143c'
        }
    ];
    
    // 过滤无效阶段
    return phases.filter(p => p.start >= 0 && p.end >= p.start);
}
```

---

## 3. Web Vitals 采集

### 3.1 LCP 采集

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// LCP (Largest Contentful Paint) 采集
// ────────────────────────────────────────────────────────────────────────────────────

class LCPMonitor {
    constructor(reporter) {
        this.reporter = reporter;
        this.lcpEntry = null;
        this.observer = null;
    }
    
    start() {
        // 检查浏览器支持
        if (!('PerformanceObserver' in window)) {
            console.warn('PerformanceObserver not supported');
            return;
        }
        
        try {
            this.observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                // LCP 可能会变化，取最后一个
                this.lcpEntry = entries[entries.length - 1];
            });
            
            this.observer.observe({ 
                type: 'largest-contentful-paint', 
                buffered: true 
            });
            
            // 在合适的时机上报
            this.setupReporting();
        } catch (e) {
            console.warn('LCP monitoring failed:', e);
        }
    }
    
    setupReporting() {
        // LCP 的上报时机：
        // 1. 页面隐藏时
        // 2. 用户首次交互时（点击、按键）
        
        const reportLCP = () => {
            if (this.lcpEntry) {
                const data = {
                    type: 'performance',
                    subType: 'web-vitals',
                    metric: 'lcp',
                    value: this.lcpEntry.startTime,
                    rating: getRating('lcp', this.lcpEntry.startTime),
                    // 元素信息
                    element: this.lcpEntry.element?.tagName,
                    elementId: this.lcpEntry.element?.id,
                    elementClass: this.lcpEntry.element?.className,
                    // 资源信息
                    url: this.lcpEntry.url,
                    size: this.lcpEntry.size,
                    // 加载时间
                    loadTime: this.lcpEntry.loadTime,
                    renderTime: this.lcpEntry.renderTime,
                    timestamp: Date.now()
                };
                
                this.report(data);
            }
            
            // 清理
            if (this.observer) {
                this.observer.disconnect();
            }
        };
        
        // 页面隐藏时上报
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                reportLCP();
            }
        }, { once: true });
        
        // 用户交互时上报（一旦用户交互，LCP 就不会再变化）
        ['click', 'keydown', 'pointerdown'].forEach(event => {
            document.addEventListener(event, reportLCP, { 
                once: true, 
                capture: true 
            });
        });
    }
    
    report(data) {
        if (this.reporter) {
            this.reporter.report(data);
        }
    }
    
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// ────────────────────────────────────────────────────────────────────────────────────
// LCP 元素类型分析
// ────────────────────────────────────────────────────────────────────────────────────

function analyzeLCPElement(lcpEntry) {
    const element = lcpEntry.element;
    
    if (!element) {
        return { type: 'unknown' };
    }
    
    const tagName = element.tagName.toLowerCase();
    
    // 图片
    if (tagName === 'img') {
        return {
            type: 'image',
            src: element.src,
            srcset: element.srcset,
            sizes: element.sizes,
            loading: element.loading,
            decoding: element.decoding
        };
    }
    
    // 视频
    if (tagName === 'video') {
        return {
            type: 'video',
            src: element.src,
            poster: element.poster
        };
    }
    
    // 文本
    if (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'span'].includes(tagName)) {
        return {
            type: 'text',
            tagName: tagName,
            text: element.textContent?.slice(0, 100),
            fontSize: window.getComputedStyle(element).fontSize,
            fontWeight: window.getComputedStyle(element).fontWeight
        };
    }
    
    // SVG 图片
    if (tagName === 'svg' || element.querySelector('svg, image')) {
        return {
            type: 'svg',
            tagName: tagName
        };
    }
    
    // 背景图片
    const bgImage = window.getComputedStyle(element).backgroundImage;
    if (bgImage && bgImage !== 'none') {
        return {
            type: 'background-image',
            tagName: tagName,
            backgroundImage: bgImage
        };
    }
    
    return {
        type: 'other',
        tagName: tagName
    };
}
```

### 3.2 INP/FID 采集

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// INP (Interaction to Next Paint) 和 FID (First Input Delay) 采集
// ────────────────────────────────────────────────────────────────────────────────────

class InputMetricsMonitor {
    constructor(reporter) {
        this.reporter = reporter;
        this.fidEntry = null;
        this.inpEntries = [];
        this.observer = null;
    }
    
    start() {
        if (!('PerformanceObserver' in window)) {
            console.warn('PerformanceObserver not supported');
            return;
        }
        
        try {
            this.observer = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    // FID - 首次输入延迟
                    if (entry.entryType === 'first-input') {
                        this.fidEntry = entry;
                    }
                    
                    // INP - 所有交互事件
                    if (entry.entryType === 'event') {
                        this.inpEntries.push(entry);
                    }
                });
            });
            
            // 监听 FID
            this.observer.observe({ 
                type: 'first-input', 
                buffered: true 
            });
            
            // 监听 INP（durationThreshold 越低越精确，但开销越大）
            this.observer.observe({ 
                type: 'event', 
                durationThreshold: 16,  // 一帧的时间
                buffered: true 
            });
            
            // 设置上报
            this.setupReporting();
        } catch (e) {
            console.warn('Input metrics monitoring failed:', e);
        }
    }
    
    setupReporting() {
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.reportFID();
                this.reportINP();
            }
        }, { once: true });
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 上报 FID
    // ─────────────────────────────────────────────────────────────────────────────
    
    reportFID() {
        if (!this.fidEntry) return;
        
        const fid = this.fidEntry.processingStart - this.fidEntry.startTime;
        
        const data = {
            type: 'performance',
            subType: 'web-vitals',
            metric: 'fid',
            value: fid,
            rating: getRating('fid', fid),
            eventType: this.fidEntry.name,
            target: this.fidEntry.target?.tagName,
            timestamp: Date.now()
        };
        
        this.report(data);
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 上报 INP
    // ─────────────────────────────────────────────────────────────────────────────
    
    reportINP() {
        if (this.inpEntries.length === 0) return;
        
        // INP 计算方法：
        // 取所有交互延迟的最大值（或高百分位值）
        
        // 方法1：取最大值
        const inp = Math.max(...this.inpEntries.map(e => e.duration));
        
        // 方法2：取 98 百分位（更精确）
        const inp98 = this.calculatePercentile(
            this.inpEntries.map(e => e.duration), 
            98
        );
        
        const data = {
            type: 'performance',
            subType: 'web-vitals',
            metric: 'inp',
            value: inp,
            value98: inp98,
            rating: getRating('inp', inp),
            interactionCount: this.inpEntries.length,
            // 最差的交互信息
            worstInteraction: this.getWorstInteraction(),
            timestamp: Date.now()
        };
        
        this.report(data);
    }
    
    calculatePercentile(arr, percentile) {
        if (arr.length === 0) return 0;
        
        const sorted = [...arr].sort((a, b) => a - b);
        const index = Math.ceil(sorted.length * (percentile / 100)) - 1;
        return sorted[Math.max(0, index)];
    }
    
    getWorstInteraction() {
        if (this.inpEntries.length === 0) return null;
        
        const worst = this.inpEntries.reduce((max, entry) => 
            entry.duration > max.duration ? entry : max
        );
        
        return {
            eventType: worst.name,
            duration: worst.duration,
            startTime: worst.startTime,
            target: worst.target?.tagName
        };
    }
    
    report(data) {
        if (this.reporter) {
            this.reporter.report(data);
        }
    }
    
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}
```

### 3.3 CLS 采集

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// CLS (Cumulative Layout Shift) 采集
// ────────────────────────────────────────────────────────────────────────────────────

class CLSMonitor {
    constructor(reporter) {
        this.reporter = reporter;
        this.sessionValue = 0;
        this.sessionEntries = [];
        this.clsValue = 0;
        this.clsEntries = [];
        this.observer = null;
    }
    
    start() {
        if (!('PerformanceObserver' in window)) {
            console.warn('PerformanceObserver not supported');
            return;
        }
        
        try {
            this.observer = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    // 只统计非用户输入导致的偏移
                    if (!entry.hadRecentInput) {
                        this.processEntry(entry);
                    }
                });
            });
            
            this.observer.observe({ 
                type: 'layout-shift', 
                buffered: true 
            });
            
            // 设置上报
            this.setupReporting();
        } catch (e) {
            console.warn('CLS monitoring failed:', e);
        }
    }
    
    processEntry(entry) {
        // CLS 使用会话窗口计算
        // 会话窗口：一组快速连续发生的布局偏移
        
        const firstEntry = this.sessionEntries[0];
        const lastEntry = this.sessionEntries[this.sessionEntries.length - 1];
        
        // 如果是第一个条目，或者距离上一个条目超过 1 秒，
        // 或者距离第一个条目超过 5 秒，开始新会话
        if (this.sessionEntries.length === 0 ||
            entry.startTime - lastEntry.startTime > 1000 ||
            entry.startTime - firstEntry.startTime > 5000) {
            
            // 保存上一个会话（如果更大）
            if (this.sessionValue > this.clsValue) {
                this.clsValue = this.sessionValue;
                this.clsEntries = [...this.sessionEntries];
            }
            
            // 开始新会话
            this.sessionValue = 0;
            this.sessionEntries = [];
        }
        
        // 添加到当前会话
        this.sessionValue += entry.value;
        this.sessionEntries.push(entry);
        
        // 更新最大值
        if (this.sessionValue > this.clsValue) {
            this.clsValue = this.sessionValue;
            this.clsEntries = [...this.sessionEntries];
        }
    }
    
    setupReporting() {
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.reportCLS();
            }
        }, { once: true });
        
        // 页面卸载时也上报
        window.addEventListener('pagehide', () => {
            this.reportCLS();
        }, { once: true });
    }
    
    reportCLS() {
        const data = {
            type: 'performance',
            subType: 'web-vitals',
            metric: 'cls',
            value: this.clsValue,
            rating: getRating('cls', this.clsValue),
            shiftCount: this.clsEntries.length,
            // 分析偏移元素
            affectedElements: this.analyzeShiftElements(),
            timestamp: Date.now()
        };
        
        this.report(data);
    }
    
    analyzeShiftElements() {
        return this.clsEntries.map(entry => {
            const sources = entry.sources || [];
            
            return {
                value: entry.value,
                startTime: entry.startTime,
                sources: sources.map(source => ({
                    node: source.node?.tagName,
                    currentRect: source.currentRect,
                    previousRect: source.previousRect
                }))
            };
        }).slice(0, 10);  // 最多 10 个
    }
    
    report(data) {
        if (this.reporter) {
            this.reporter.report(data);
        }
    }
    
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}
```

### 3.4 FCP/TTFB 采集

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// FCP (First Contentful Paint) 和 TTFB 采集
// ────────────────────────────────────────────────────────────────────────────────────

class PaintTimingMonitor {
    constructor(reporter) {
        this.reporter = reporter;
        this.observer = null;
    }
    
    start() {
        // FCP 采集
        this.collectFCP();
        
        // TTFB 采集
        this.collectTTFB();
    }
    
    collectFCP() {
        // 尝试从已存在的条目中获取
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(e => e.name === 'first-contentful-paint');
        
        if (fcp) {
            this.reportFCP(fcp);
        } else {
            // 使用 PerformanceObserver 监听
            if ('PerformanceObserver' in window) {
                try {
                    const observer = new PerformanceObserver((list) => {
                        list.getEntries().forEach(entry => {
                            if (entry.name === 'first-contentful-paint') {
                                this.reportFCP(entry);
                                observer.disconnect();
                            }
                        });
                    });
                    
                    observer.observe({ type: 'paint', buffered: true });
                } catch (e) {}
            }
        }
    }
    
    reportFCP(entry) {
        const data = {
            type: 'performance',
            subType: 'web-vitals',
            metric: 'fcp',
            value: entry.startTime,
            rating: getRating('fcp', entry.startTime),
            timestamp: Date.now()
        };
        
        this.report(data);
    }
    
    collectTTFB() {
        const navigationEntry = performance.getEntriesByType('navigation')[0];
        
        if (navigationEntry) {
            const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
            
            const data = {
                type: 'performance',
                subType: 'web-vitals',
                metric: 'ttfb',
                value: ttfb,
                rating: getRating('ttfb', ttfb),
                // 详细时间
                dnsTime: navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart,
                tcpTime: navigationEntry.connectEnd - navigationEntry.connectStart,
                sslTime: navigationEntry.secureConnectionStart > 0 
                    ? navigationEntry.connectEnd - navigationEntry.secureConnectionStart 
                    : 0,
                requestTime: navigationEntry.responseStart - navigationEntry.requestStart,
                timestamp: Date.now()
            };
            
            this.report(data);
        }
    }
    
    report(data) {
        if (this.reporter) {
            this.reporter.report(data);
        }
    }
}
```

---

## 4. 资源加载监控

### 4.1 Resource Timing API

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 资源加载监控
// ────────────────────────────────────────────────────────────────────────────────────

class ResourceMonitor {
    constructor(reporter, options = {}) {
        this.reporter = reporter;
        this.options = {
            slowThreshold: 1000,    // 慢资源阈值
            minSize: 0,             // 最小文件大小
            ignoreUrls: [],
            ...options
        };
        
        this.observer = null;
        this.resources = [];
    }
    
    start() {
        // 采集已加载的资源
        this.collectExisting();
        
        // 监听新资源加载
        this.observe();
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 采集已存在的资源
    // ─────────────────────────────────────────────────────────────────────────────
    
    collectExisting() {
        const entries = performance.getEntriesByType('resource');
        entries.forEach(entry => this.processEntry(entry));
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 监听新资源
    // ─────────────────────────────────────────────────────────────────────────────
    
    observe() {
        if (!('PerformanceObserver' in window)) return;
        
        try {
            this.observer = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => this.processEntry(entry));
            });
            
            this.observer.observe({ type: 'resource', buffered: true });
        } catch (e) {}
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 处理资源条目
    // ─────────────────────────────────────────────────────────────────────────────
    
    processEntry(entry) {
        const url = entry.name;
        
        // 检查是否应该忽略
        if (this.shouldIgnore(url)) return;
        
        // 检查是否是慢资源
        const isSlow = entry.duration > this.options.slowThreshold;
        
        // 检查文件大小
        const size = entry.transferSize || entry.encodedBodySize || 0;
        if (size < this.options.minSize) return;
        
        // 只有慢资源才上报
        if (isSlow) {
            const data = {
                type: 'performance',
                subType: 'slow-resource',
                url: url,
                initiatorType: entry.initiatorType,
                duration: entry.duration,
                transferSize: size,
                encodedBodySize: entry.encodedBodySize,
                decodedBodySize: entry.decodedBodySize,
                // 时间分解
                dnsTime: entry.domainLookupEnd - entry.domainLookupStart,
                tcpTime: entry.connectEnd - entry.connectStart,
                sslTime: entry.secureConnectionStart > 0 
                    ? entry.connectEnd - entry.secureConnectionStart 
                    : 0,
                ttfb: entry.responseStart - entry.requestStart,
                downloadTime: entry.responseEnd - entry.responseStart,
                // 缓存状态
                isCached: entry.transferSize === 0,
                timestamp: Date.now()
            };
            
            this.report(data);
        }
        
        // 记录所有资源
        this.resources.push({
            url: url,
            initiatorType: entry.initiatorType,
            duration: entry.duration,
            size: size
        });
    }
    
    shouldIgnore(url) {
        // 忽略 data URL
        if (url.startsWith('data:')) return true;
        if (url.startsWith('blob:')) return true;
        
        // 检查自定义忽略规则
        for (const pattern of this.options.ignoreUrls) {
            if (typeof pattern === 'string' && url.includes(pattern)) return true;
            if (pattern instanceof RegExp && pattern.test(url)) return true;
        }
        
        return false;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 获取资源统计
    // ─────────────────────────────────────────────────────────────────────────────
    
    getStatistics() {
        const byType = {};
        
        this.resources.forEach(resource => {
            const type = resource.initiatorType;
            
            if (!byType[type]) {
                byType[type] = {
                    count: 0,
                    totalSize: 0,
                    totalDuration: 0,
                    maxSize: 0,
                    maxDuration: 0
                };
            }
            
            byType[type].count++;
            byType[type].totalSize += resource.size;
            byType[type].totalDuration += resource.duration;
            byType[type].maxSize = Math.max(byType[type].maxSize, resource.size);
            byType[type].maxDuration = Math.max(byType[type].maxDuration, resource.duration);
        });
        
        // 计算平均值
        Object.keys(byType).forEach(type => {
            byType[type].avgSize = byType[type].totalSize / byType[type].count;
            byType[type].avgDuration = byType[type].totalDuration / byType[type].count;
        });
        
        return {
            totalCount: this.resources.length,
            totalSize: this.resources.reduce((sum, r) => sum + r.size, 0),
            totalDuration: this.resources.reduce((sum, r) => sum + r.duration, 0),
            byType
        };
    }
    
    report(data) {
        if (this.reporter) {
            this.reporter.report(data);
        }
    }
    
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}
```

---

## 5. 长任务监控

### 5.1 Long Task API

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 长任务监控
// ────────────────────────────────────────────────────────────────────────────────────

/**
 * 长任务定义：执行时间超过 50ms 的任务
 * 
 * 长任务会导致：
 * 1. 交互响应延迟
 * 2. 动画卡顿
 * 3. 输入延迟
 */

class LongTaskMonitor {
    constructor(reporter, options = {}) {
        this.reporter = reporter;
        this.options = {
            threshold: 50,  // 默认 50ms
            maxTasks: 100,  // 最多记录的任务数
            ...options
        };
        
        this.longTasks = [];
        this.observer = null;
    }
    
    start() {
        if (!('PerformanceObserver' in window)) {
            console.warn('PerformanceObserver not supported');
            return;
        }
        
        try {
            this.observer = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    if (entry.duration >= this.options.threshold) {
                        this.processEntry(entry);
                    }
                });
            });
            
            this.observer.observe({ type: 'longtask', buffered: true });
        } catch (e) {
            console.warn('Long task monitoring not supported:', e);
        }
    }
    
    processEntry(entry) {
        const task = {
            duration: entry.duration,
            startTime: entry.startTime,
            name: entry.name,
            attribution: this.parseAttribution(entry.attribution),
            timestamp: Date.now()
        };
        
        this.longTasks.push(task);
        
        // 限制数量
        if (this.longTasks.length > this.options.maxTasks) {
            this.longTasks.shift();
        }
        
        // 上报
        this.report({
            type: 'performance',
            subType: 'longtask',
            ...task
        });
    }
    
    parseAttribution(attribution) {
        if (!attribution || attribution.length === 0) {
            return [];
        }
        
        return attribution.map(attr => ({
            name: attr.name,
            containerType: attr.containerType,
            containerName: attr.containerName,
            containerId: attr.containerId,
            containerSrc: attr.containerSrc
        }));
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 统计分析
    // ─────────────────────────────────────────────────────────────────────────────
    
    getStatistics() {
        if (this.longTasks.length === 0) {
            return null;
        }
        
        const durations = this.longTasks.map(t => t.duration);
        
        return {
            count: this.longTasks.length,
            totalDuration: durations.reduce((a, b) => a + b, 0),
            avgDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
            maxDuration: Math.max(...durations),
            minDuration: Math.min(...durations),
            // 按来源分组
            bySource: this.groupBySource()
        };
    }
    
    groupBySource() {
        const groups = {};
        
        this.longTasks.forEach(task => {
            task.attribution.forEach(attr => {
                const source = attr.containerType || 'unknown';
                
                if (!groups[source]) {
                    groups[source] = [];
                }
                
                groups[source].push(task);
            });
        });
        
        return groups;
    }
    
    report(data) {
        if (this.reporter) {
            this.reporter.report(data);
        }
    }
    
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}
```

### 5.2 总阻塞时间计算

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// TBT (Total Blocking Time) 计算
// ────────────────────────────────────────────────────────────────────────────────────

/**
 * TBT 定义：
 * 在 FCP 和 TTI 之间，所有长任务超出 50ms 部分的总和
 * 
 * 例如：一个 70ms 的任务，阻塞时间为 70 - 50 = 20ms
 */

class TBTMonitor {
    constructor(reporter) {
        this.reporter = reporter;
        this.longTasks = [];
        this.fcp = 0;
        this.tti = 0;
    }
    
    start() {
        // 获取 FCP
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(e => e.name === 'first-contentful-paint');
        if (fcp) {
            this.fcp = fcp.startTime;
        }
        
        // 监听长任务
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    // 只统计 FCP 之后的长任务
                    if (entry.startTime >= this.fcp) {
                        this.longTasks.push(entry);
                    }
                });
            });
            
            observer.observe({ type: 'longtask', buffered: true });
        }
        
        // 页面隐藏时计算并上报
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.calculateAndReport();
            }
        });
    }
    
    calculateAndReport() {
        const tbt = this.calculateTBT();
        
        if (tbt !== null) {
            this.report({
                type: 'performance',
                subType: 'tbt',
                value: tbt,
                longTaskCount: this.longTasks.length,
                rating: tbt <= 200 ? 'good' : tbt <= 600 ? 'needs-improvement' : 'poor'
            });
        }
    }
    
    calculateTBT() {
        if (this.longTasks.length === 0 || this.fcp === 0) {
            return null;
        }
        
        let tbt = 0;
        
        this.longTasks.forEach(task => {
            // 阻塞时间 = 任务时长 - 50ms
            const blockingTime = task.duration - 50;
            if (blockingTime > 0) {
                tbt += blockingTime;
            }
        });
        
        return tbt;
    }
    
    report(data) {
        if (this.reporter) {
            this.reporter.report(data);
        }
    }
}
```

---

## 6. 完整性能监控类

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 完整性能监控类
// ────────────────────────────────────────────────────────────────────────────────────

class PerformanceMonitor {
    constructor(options = {}) {
        this.options = {
            capturePageLoad: true,
            captureWebVitals: true,
            captureResources: true,
            captureLongTasks: true,
            ...options
        };
        
        this.reporter = options.reporter;
        this.monitors = {};
        this.metrics = {};
        
        this.init();
    }
    
    init() {
        if (document.readyState === 'complete') {
            this.startMonitoring();
        } else {
            window.addEventListener('load', () => {
                // 延迟采集，确保数据完整
                setTimeout(() => this.startMonitoring(), 0);
            });
        }
    }
    
    startMonitoring() {
        // 页面加载性能
        if (this.options.capturePageLoad) {
            this.monitors.pageLoad = new PageLoadMonitor(this.reporter);
            this.metrics.pageLoad = this.monitors.pageLoad.collect();
        }
        
        // Web Vitals
        if (this.options.captureWebVitals) {
            this.monitors.lcp = new LCPMonitor(this.reporter);
            this.monitors.lcp.start();
            
            this.monitors.input = new InputMetricsMonitor(this.reporter);
            this.monitors.input.start();
            
            this.monitors.cls = new CLSMonitor(this.reporter);
            this.monitors.cls.start();
            
            this.monitors.paint = new PaintTimingMonitor(this.reporter);
            this.monitors.paint.start();
        }
        
        // 资源加载
        if (this.options.captureResources) {
            this.monitors.resource = new ResourceMonitor(this.reporter, this.options.resourceOptions);
            this.monitors.resource.start();
        }
        
        // 长任务
        if (this.options.captureLongTasks) {
            this.monitors.longTask = new LongTaskMonitor(this.reporter);
            this.monitors.longTask.start();
            
            this.monitors.tbt = new TBTMonitor(this.reporter);
            this.monitors.tbt.start();
        }
    }
    
    // 获取所有指标
    getMetrics() {
        return {
            ...this.metrics,
            longTasks: this.monitors.longTask?.longTasks || [],
            resourceStats: this.monitors.resource?.getStatistics()
        };
    }
    
    // 销毁
    destroy() {
        Object.values(this.monitors).forEach(monitor => {
            if (monitor && monitor.destroy) {
                monitor.destroy();
            }
        });
        this.monitors = {};
    }
}

export default PerformanceMonitor;
```

---

## 最佳实践

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  性能监控最佳实践                                                                      │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  指标选择                                                                              │
│  □ 优先关注 Core Web Vitals (LCP, INP, CLS)                                          │
│  □ 结合辅助指标全面评估                                                               │
│  □ 设定合理的性能预算                                                                 │
│                                                                                       │
│  采集时机                                                                              │
│  □ 页面加载完成后采集                                                                 │
│  □ 页面隐藏时上报最终值                                                               │
│  □ 用户交互后停止采集 LCP                                                             │
│                                                                                       │
│  数据处理                                                                              │
│  □ 使用 PerformanceObserver 实时监听                                                 │
│  □ 设置合理的采样率                                                                   │
│  □ 合并上报减少请求                                                                   │
│                                                                                       │
│  优化建议                                                                              │
│  □ LCP 差：优化服务器响应、资源加载、渲染阻塞                                         │
│  □ INP 差：减少 JavaScript 执行时间、使用 Web Worker                                  │
│  □ CLS 差：设置图片尺寸、避免动态内容插入、预加载字体                                 │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

[返回上级目录](../index.md)
