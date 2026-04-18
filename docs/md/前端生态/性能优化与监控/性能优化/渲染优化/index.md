# 渲染性能优化

> 渲染性能优化关注的是如何让页面交互更流畅，减少卡顿和掉帧。这直接影响用户对应用质量的感知。

## 学习要点

- 🎨 理解浏览器渲染管线
- 📊 掌握长任务优化策略
- 🖼️ 熟练使用虚拟列表处理大数据
- ⚡ 运用防抖节流优化高频事件

---

## 1. 浏览器渲染管线

### 1.1 渲染流程详解

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  浏览器渲染管线                                                                        │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│   JavaScript ──► Style ──► Layout ──► Paint ──► Composite                            │
│       │            │           │          │            │                             │
│   执行 JS      计算样式    计算布局    绘制内容     合成图层                           │
│                                                                                       │
├───────────────────────────────────────────────────────────────────────────────────────┤
│  各阶段说明                                                                            │
│                                                                                       │
│  JavaScript - 执行 JavaScript 代码，可能触发样式变更、DOM 操作                         │
│  Style - 计算每个元素的最终样式，处理 CSS 选择器匹配                                   │
│  Layout - 计算元素的几何信息（位置、大小），递归过程                                   │
│  Paint - 将元素绘制到多个图层上（文本、颜色、边框、阴影等）                            │
│  Composite - 将图层按正确顺序合成到屏幕上                                             │
│                                                                                       │
├───────────────────────────────────────────────────────────────────────────────────────┤
│  触发条件                                                                              │
│                                                                                       │
│  JavaScript 更改 ──► 触发完整管线                                                     │
│  CSS 样式更改 ──► 跳过 JS 阶段                                                        │
│  几何属性更改 ──► 触发 Layout + Paint + Composite                                     │
│  绘制属性更改 ──► 触发 Paint + Composite（如 color、background）                       │
│  合成属性更改 ──► 只触发 Composite（如 transform、opacity）                            │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 重排与重绘

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 重排（Reflow / Layout）
// ────────────────────────────────────────────────────────────────────────────────────

/*
触发重排的操作：
• 改变窗口大小、字体大小
• 添加/删除样式表、操作 DOM
• 计算 offsetWidth/offsetHeight/scrollTop 等
• 设置 style 属性的几何属性
*/

// ❌ 错误示例：频繁触发重排
function badResizeElements() {
    const elements = document.querySelectorAll('.item');
    elements.forEach(el => {
        const height = el.offsetHeight;  // 读取触发重排
        el.style.height = height * 2 + 'px';  // 写入又触发重排
    });
}

// ✅ 正确示例：批量读取，批量写入
function goodResizeElements() {
    const elements = document.querySelectorAll('.item');
    // 先批量读取
    const heights = Array.from(elements).map(el => el.offsetHeight);
    // 再批量写入
    elements.forEach((el, i) => el.style.height = heights[i] * 2 + 'px');
}

// ────────────────────────────────────────────────────────────────────────────────────
// 重绘（Repaint）- 不改变布局
// ────────────────────────────────────────────────────────────────────────────────────

/*
触发重绘的操作：
• 改变颜色（color、background-color）
• 改变边框颜色、可见性、阴影、轮廓
*/

// ✅ 使用 opacity 和 transform 代替重排操作
// ❌ 会触发重排
element.style.left = '100px';
element.style.top = '50px';

// ✅ 只触发合成（性能更好）
element.style.transform = 'translate(100px, 50px)';

// ────────────────────────────────────────────────────────────────────────────────────
// FastDOM 模式
// ────────────────────────────────────────────────────────────────────────────────────

class FastDOM {
    constructor() {
        this.reads = [];
        this.writes = [];
        this.scheduled = false;
    }
    
    measure(fn) { this.reads.push(fn); this.schedule(); return this; }
    mutate(fn) { this.writes.push(fn); this.schedule(); return this; }
    
    schedule() {
        if (this.scheduled) return;
        this.scheduled = true;
        requestAnimationFrame(() => this.flush());
    }
    
    flush() {
        this.reads.forEach(fn => fn());
        this.reads.length = 0;
        this.writes.forEach(fn => fn());
        this.writes.length = 0;
        this.scheduled = false;
    }
}

// 使用
const fastdom = new FastDOM();
let height;
fastdom
    .measure(() => { height = element.offsetHeight; })
    .mutate(() => { element.style.height = height * 2 + 'px'; });
```

### 1.3 图层与合成

```css
/* ────────────────────────────────────────────────────────────────────────────────────
   创建合成图层 - GPU 加速
   ──────────────────────────────────────────────────────────────────────────────────── */

/* 使用 transform 和 opacity 进行动画（只触发合成） */
.smooth-animation {
    transform: translateX(100px);
    opacity: 0.8;
}

/* ❌ 避免使用触发 Layout 的属性 */
.slow-animation {
    left: 100px;     /* 会触发 Layout */
    top: 50px;
}

/* ✅ 推荐：悬停时才触发硬件加速 */
.animate-on-hover:hover {
    will-change: transform;
    transform: scale(1.1);
}

/* ────────────────────────────────────────────────────────────────────────────────────
   CSS Containment - 限制重排范围
   ──────────────────────────────────────────────────────────────────────────────────── */

/* 隔离布局计算 */
.isolated-component {
    contain: layout;  /* 内容不影响外部布局 */
}

/* 完全隔离 */
.fully-isolated {
    contain: strict;  /* 隔离布局、样式和绘制 */
}
```

---

## 2. 长任务优化

### 2.1 长任务问题

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  长任务（Long Task）- 执行时间超过 50ms 的任务                                          │
├───────────────────────────────────────────────────────────────────────────────────────┤
│  问题：                                                                               │
│  • 阻塞主线程，导致交互无响应                                                          │
│  • 影响 FID（首次输入延迟）和 INP（交互到下一次绘制）                                   │
│  • 导致动画卡顿、滚动不流畅                                                            │
│                                                                                       │
│  常见来源：大型 JavaScript 执行、复杂 DOM 操作、大量数据处理                            │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 任务分割策略

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 使用 requestIdleCallback 分割任务
// ────────────────────────────────────────────────────────────────────────────────────

function processDataAsync(data, callback) {
    const results = [];
    let index = 0;
    
    function processChunk(deadline) {
        // 在空闲时间内尽可能多地处理
        while (index < data.length && deadline.timeRemaining() > 0) {
            results.push(heavyComputation(data[index]));
            index++;
        }
        
        if (index < data.length) {
            requestIdleCallback(processChunk, { timeout: 1000 });
        } else {
            callback(results);
        }
    }
    
    requestIdleCallback(processChunk);
}

// ────────────────────────────────────────────────────────────────────────────────────
// 使用 setTimeout 分割任务
// ────────────────────────────────────────────────────────────────────────────────────

function processInChunks(data, chunkSize = 100, callback) {
    const results = [];
    let index = 0;
    
    function processChunk() {
        const end = Math.min(index + chunkSize, data.length);
        
        while (index < end) {
            results.push(heavyComputation(data[index]));
            index++;
        }
        
        if (index < data.length) {
            setTimeout(processChunk, 0);  // 让出主线程
        } else {
            callback(results);
        }
    }
    
    processChunk();
}

// ────────────────────────────────────────────────────────────────────────────────────
// 任务调度器
// ────────────────────────────────────────────────────────────────────────────────────

class TaskScheduler {
    constructor(options = {}) {
        this.chunkSize = options.chunkSize || 50;
        this.frameBudget = options.frameBudget || 16;  // 60fps
        this.tasks = [];
        this.isRunning = false;
    }
    
    add(task) {
        this.tasks.push(task);
        if (!this.isRunning) this.run();
    }
    
    async run() {
        this.isRunning = true;
        let startTime = performance.now();
        
        while (this.tasks.length > 0) {
            const task = this.tasks.shift();
            task();
            
            // 检查是否超出帧预算
            if (performance.now() - startTime > this.frameBudget) {
                await new Promise(r => requestAnimationFrame(r));
                startTime = performance.now();
            }
        }
        
        this.isRunning = false;
    }
}
```

---

## 3. 虚拟列表

### 3.1 虚拟列表原理

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  虚拟列表（Virtual List）                                                              │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  问题：渲染大量列表项（如 10000 条）会导致 DOM 节点过多，滚动卡顿                        │
│                                                                                       │
│  解决方案：只渲染可视区域内的列表项                                                     │
│                                                                                       │
│  ┌─────────────────────────────────────┐                                              │
│  │  可视区域            │  ↑                                          │
│  │  ┌─────────────────┐ │  │                                          │
│  │  │   Item 5        │ │  │                                          │
│  │  │   Item 6        │ │  │  实际渲染                                 │
│  │  │   Item 7        │ │  │  的项目                                   │
│  │  │   Item 8        │ │  │                                          │
│  │  │   Item 9        │ │  ↓                                          │
│  │  └─────────────────┘ │                                              │
│  │                      │                                              │
│  └─────────────────────────────────────┘                                              │
│                                                                                       │
│  核心要素：                                                                           │
│  1. 容器高度（可视区域高度）                                                           │
│  2. 列表项高度（固定或动态）                                                           │
│  3. 滚动位置（计算可见范围）                                                           │
│  4. 缓冲区（预渲染上下额外项目，避免白屏）                                             │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 固定高度虚拟列表实现

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 固定高度虚拟列表
// ────────────────────────────────────────────────────────────────────────────────────

class VirtualList {
    constructor(options) {
        const {
            container,      // 容器元素
            itemCount,      // 总项目数
            itemHeight,     // 每项高度
            bufferSize = 3, // 缓冲区大小
            renderItem      // 渲染函数
        } = options;
        
        this.container = container;
        this.itemCount = itemCount;
        this.itemHeight = itemHeight;
        this.bufferSize = bufferSize;
        this.renderItem = renderItem;
        
        this.scrollTop = 0;
        this.visibleCount = Math.ceil(container.clientHeight / itemHeight);
        
        this.init();
    }
    
    init() {
        // 创建内容容器（撑开滚动高度）
        this.contentEl = document.createElement('div');
        this.contentEl.style.cssText = `
            position: relative;
            height: ${this.itemCount * this.itemHeight}px;
        `;
        
        // 创建渲染区域
        this.renderEl = document.createElement('div');
        this.renderEl.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%;';
        this.contentEl.appendChild(this.renderEl);
        this.container.appendChild(this.contentEl);
        
        // 监听滚动
        this.container.addEventListener('scroll', this.handleScroll.bind(this));
        
        // 初始渲染
        this.render();
    }
    
    handleScroll() {
        if (this.scrollRAF) return;
        
        this.scrollRAF = requestAnimationFrame(() => {
            this.scrollTop = this.container.scrollTop;
            this.render();
            this.scrollRAF = null;
        });
    }
    
    getVisibleRange() {
        const start = Math.floor(this.scrollTop / this.itemHeight);
        const end = Math.min(
            start + this.visibleCount + this.bufferSize * 2,
            this.itemCount
        );
        
        return {
            start: Math.max(0, start - this.bufferSize),
            end
        };
    }
    
    render() {
        const { start, end } = this.getVisibleRange();
        
        // 设置渲染区域偏移
        this.renderEl.style.transform = `translateY(${start * this.itemHeight}px)`;
        
        // 渲染可见项
        const html = [];
        for (let i = start; i < end; i++) {
            html.push(this.renderItem(i));
        }
        this.renderEl.innerHTML = html.join('');
    }
    
    // 更新数据
    updateItemCount(count) {
        this.itemCount = count;
        this.contentEl.style.height = `${count * this.itemHeight}px`;
        this.render();
    }
}

// 使用示例
const virtualList = new VirtualList({
    container: document.getElementById('list-container'),
    itemCount: 10000,
    itemHeight: 50,
    bufferSize: 5,
    renderItem: (index) => `<div class="item">Item ${index}</div>`
});

// ────────────────────────────────────────────────────────────────────────────────────
// React 虚拟列表 Hook
// ────────────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect, useCallback } from 'react';

function useVirtualList({ itemCount, itemHeight, bufferSize = 3 }) {
    const [scrollTop, setScrollTop] = useState(0);
    const containerRef = useRef(null);
    const visibleCount = useRef(0);
    
    useEffect(() => {
        if (containerRef.current) {
            visibleCount.current = Math.ceil(containerRef.current.clientHeight / itemHeight);
        }
    }, [itemHeight]);
    
    const handleScroll = useCallback((e) => {
        setScrollTop(e.target.scrollTop);
    }, []);
    
    const getVisibleRange = useCallback(() => {
        const start = Math.floor(scrollTop / itemHeight);
        const end = Math.min(
            start + visibleCount.current + bufferSize * 2,
            itemCount
        );
        return {
            start: Math.max(0, start - bufferSize),
            end
        };
    }, [scrollTop, itemHeight, itemCount, bufferSize]);
    
    const { start, end } = getVisibleRange();
    
    return {
        containerRef,
        handleScroll,
        visibleItems: Array.from({ length: end - start }, (_, i) => start + i),
        offsetY: start * itemHeight,
        totalHeight: itemCount * itemHeight
    };
}

// 使用示例
function VirtualListComponent({ items }) {
    const { containerRef, handleScroll, visibleItems, offsetY, totalHeight } = useVirtualList({
        itemCount: items.length,
        itemHeight: 50,
        bufferSize: 5
    });
    
    return (
        <div
            ref={containerRef}
            onScroll={handleScroll}
            style={{ height: '500px', overflow: 'auto' }}
        >
            <div style={{ height: totalHeight, position: 'relative' }}>
                <div style={{ transform: `translateY(${offsetY}px)` }}>
                    {visibleItems.map(index => (
                        <div key={index} style={{ height: '50px' }}>
                            {items[index].name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
```

### 3.3 动态高度虚拟列表

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 动态高度虚拟列表
// ────────────────────────────────────────────────────────────────────────────────────

class DynamicHeightVirtualList {
    constructor(options) {
        const {
            container,
            itemCount,
            estimatedItemHeight,  // 预估高度
            bufferSize = 3,
            renderItem
        } = options;
        
        this.container = container;
        this.itemCount = itemCount;
        this.estimatedItemHeight = estimatedItemHeight;
        this.bufferSize = bufferSize;
        this.renderItem = renderItem;
        
        // 存储实际高度
        this.itemHeights = new Map();
        this.scrollTop = 0;
        
        this.init();
    }
    
    init() {
        this.contentEl = document.createElement('div');
        this.contentEl.style.position = 'relative';
        
        this.renderEl = document.createElement('div');
        this.renderEl.style.position = 'absolute';
        this.renderEl.style.top = '0';
        this.renderEl.style.left = '0';
        this.renderEl.style.width = '100%';
        
        this.contentEl.appendChild(this.renderEl);
        this.container.appendChild(this.contentEl);
        
        this.container.addEventListener('scroll', this.handleScroll.bind(this));
        
        this.updateTotalHeight();
        this.render();
    }
    
    // 获取项目高度
    getItemHeight(index) {
        return this.itemHeights.get(index) || this.estimatedItemHeight;
    }
    
    // 计算项目位置
    getItemPosition(index) {
        let position = 0;
        for (let i = 0; i < index; i++) {
            position += this.getItemHeight(i);
        }
        return position;
    }
    
    // 更新总高度
    updateTotalHeight() {
        let totalHeight = 0;
        for (let i = 0; i < this.itemCount; i++) {
            totalHeight += this.getItemHeight(i);
        }
        this.contentEl.style.height = `${totalHeight}px`;
    }
    
    // 二分查找起始索引
    findStartIndex() {
        let low = 0;
        let high = this.itemCount - 1;
        
        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            const position = this.getItemPosition(mid);
            
            if (position < this.scrollTop) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        
        return Math.max(0, low - this.bufferSize);
    }
    
    // 获取可见范围
    getVisibleRange() {
        const start = this.findStartIndex();
        const containerHeight = this.container.clientHeight;
        
        let height = 0;
        let end = start;
        
        while (end < this.itemCount && height < containerHeight + this.bufferSize * this.estimatedItemHeight) {
            height += this.getItemHeight(end);
            end++;
        }
        
        return { start, end };
    }
    
    handleScroll() {
        if (this.scrollRAF) return;
        this.scrollRAF = requestAnimationFrame(() => {
            this.scrollTop = this.container.scrollTop;
            this.render();
            this.scrollRAF = null;
        });
    }
    
    render() {
        const { start, end } = this.getVisibleRange();
        const offsetY = this.getItemPosition(start);
        
        this.renderEl.style.transform = `translateY(${offsetY}px)`;
        
        const fragment = document.createDocumentFragment();
        for (let i = start; i < end; i++) {
            const item = this.renderItem(i);
            item.dataset.index = i;
            fragment.appendChild(item);
        }
        
        this.renderEl.innerHTML = '';
        this.renderEl.appendChild(fragment);
        
        // 测量实际高度
        this.measureItems();
    }
    
    // 测量项目实际高度
    measureItems() {
        const items = this.renderEl.children;
        
        for (const item of items) {
            const index = parseInt(item.dataset.index);
            const height = item.offsetHeight;
            
            if (this.itemHeights.get(index) !== height) {
                this.itemHeights.set(index, height);
            }
        }
        
        // 更新总高度
        this.updateTotalHeight();
    }
}
```

---

## 4. 防抖与节流

### 4.1 防抖（Debounce）

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 防抖 - 事件停止触发后执行
// ────────────────────────────────────────────────────────────────────────────────────

function debounce(fn, delay, immediate = false) {
    let timer = null;
    
    return function(...args) {
        const context = this;
        
        // 立即执行
        if (immediate && !timer) {
            fn.apply(context, args);
        }
        
        clearTimeout(timer);
        
        timer = setTimeout(() => {
            if (!immediate) {
                fn.apply(context, args);
            }
            timer = null;
        }, delay);
    };
}

// 带取消功能
function debounceAdvanced(fn, delay, immediate = false) {
    let timer = null;
    
    const debounced = function(...args) {
        const context = this;
        
        if (immediate && !timer) {
            fn.apply(context, args);
        }
        
        clearTimeout(timer);
        timer = setTimeout(() => {
            if (!immediate) fn.apply(context, args);
            timer = null;
        }, delay);
    };
    
    debounced.cancel = () => {
        clearTimeout(timer);
        timer = null;
    };
    
    debounced.flush = () => {
        clearTimeout(timer);
        fn.apply(this, arguments);
        timer = null;
    };
    
    return debounced;
}

// 使用示例
const handleSearch = debounce((keyword) => {
    fetchSearchResults(keyword);
}, 300);

input.addEventListener('input', (e) => handleSearch(e.target.value));
```

### 4.2 节流（Throttle）

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 节流 - 固定频率执行
// ────────────────────────────────────────────────────────────────────────────────────

// 时间戳方式
function throttle(fn, delay) {
    let lastTime = 0;
    
    return function(...args) {
        const now = Date.now();
        
        if (now - lastTime >= delay) {
            fn.apply(this, args);
            lastTime = now;
        }
    };
}

// 定时器方式
function throttleTimer(fn, delay) {
    let timer = null;
    
    return function(...args) {
        if (!timer) {
            timer = setTimeout(() => {
                fn.apply(this, args);
                timer = null;
            }, delay);
        }
    };
}

// 结合方式（首尾都执行）
function throttleAdvanced(fn, delay) {
    let timer = null;
    let lastTime = 0;
    
    return function(...args) {
        const now = Date.now();
        const remaining = delay - (now - lastTime);
        const context = this;
        
        if (remaining <= 0) {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            fn.apply(context, args);
            lastTime = now;
        } else if (!timer) {
            timer = setTimeout(() => {
                fn.apply(context, args);
                lastTime = Date.now();
                timer = null;
            }, remaining);
        }
    };
}

// 使用示例
const handleScroll = throttle((scrollTop) => {
    updateUI(scrollTop);
}, 100);

window.addEventListener('scroll', () => handleScroll(window.scrollY));
```

### 4.3 requestAnimationFrame 节流

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 使用 rAF 进行动画级节流
// ────────────────────────────────────────────────────────────────────────────────────

function rafThrottle(fn) {
    let rAF = null;
    let args = null;
    
    return function(...newArgs) {
        args = newArgs;
        
        if (!rAF) {
            rAF = requestAnimationFrame(() => {
                fn.apply(this, args);
                rAF = null;
            });
        }
    };
}

// 使用示例 - 滚动动画
const handleScrollRAF = rafThrottle((scrollTop) => {
    // 确保每帧最多执行一次
    parallaxElements.forEach(el => {
        el.style.transform = `translateY(${scrollTop * 0.5}px)`;
    });
});

window.addEventListener('scroll', () => handleScrollRAF(window.scrollY), { passive: true });
```

---

## 5. Web Worker

### 5.1 基本使用

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// Web Worker 基础
// ────────────────────────────────────────────────────────────────────────────────────

// main.js - 主线程
const worker = new Worker('worker.js');

// 发送数据
worker.postMessage({ type: 'process', data: largeData });

// 接收结果
worker.onmessage = (e) => {
    console.log('Result:', e.data);
};

// 错误处理
worker.onerror = (e) => {
    console.error('Worker error:', e.message);
};

// worker.js - Worker 线程
self.onmessage = (e) => {
    const { type, data } = e.data;
    
    if (type === 'process') {
        const result = heavyComputation(data);
        self.postMessage(result);
    }
};

function heavyComputation(data) {
    // 耗时计算
    return data.map(item => /* 处理 */ item);
}

// ────────────────────────────────────────────────────────────────────────────────────
// 内联 Worker
// ────────────────────────────────────────────────────────────────────────────────────

function createInlineWorker(fn) {
    const blob = new Blob([`(${fn.toString()})()`], { type: 'application/javascript' });
    return new Worker(URL.createObjectURL(blob));
}

const inlineWorker = createInlineWorker(() => {
    self.onmessage = (e) => {
        const result = e.data.map(x => x * 2);
        self.postMessage(result);
    };
});

inlineWorker.postMessage([1, 2, 3, 4, 5]);
inlineWorker.onmessage = (e) => console.log(e.data); // [2, 4, 6, 8, 10]
```

### 5.2 Worker 池

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// Worker 池管理
// ────────────────────────────────────────────────────────────────────────────────────

class WorkerPool {
    constructor(workerScript, poolSize = navigator.hardwareConcurrency || 4) {
        this.workerScript = workerScript;
        this.poolSize = poolSize;
        this.workers = [];
        this.taskQueue = [];
        this.activeTasks = new Map();
        
        this.init();
    }
    
    init() {
        for (let i = 0; i < this.poolSize; i++) {
            const worker = new Worker(this.workerScript);
            worker.id = i;
            
            worker.onmessage = (e) => {
                const task = this.activeTasks.get(worker);
                if (task) {
                    task.resolve(e.data);
                    this.activeTasks.delete(worker);
                    this.processQueue();
                }
            };
            
            worker.onerror = (e) => {
                const task = this.activeTasks.get(worker);
                if (task) {
                    task.reject(new Error(e.message));
                    this.activeTasks.delete(worker);
                    this.processQueue();
                }
            };
            
            this.workers.push(worker);
        }
    }
    
    // 执行任务
    execute(data) {
        return new Promise((resolve, reject) => {
            this.taskQueue.push({ data, resolve, reject });
            this.processQueue();
        });
    }
    
    // 处理队列
    processQueue() {
        // 找到空闲 worker
        const availableWorker = this.workers.find(w => !this.activeTasks.has(w));
        
        if (!availableWorker || this.taskQueue.length === 0) return;
        
        const task = this.taskQueue.shift();
        this.activeTasks.set(availableWorker, task);
        availableWorker.postMessage(task.data);
    }
    
    // 销毁
    terminate() {
        this.workers.forEach(worker => worker.terminate());
        this.workers = [];
        this.taskQueue = [];
        this.activeTasks.clear();
    }
}

// 使用示例
const pool = new WorkerPool('compute-worker.js', 4);

async function processDataParallel(dataChunks) {
    const promises = dataChunks.map(chunk => pool.execute(chunk));
    const results = await Promise.all(promises);
    return results.flat();
}
```

---

## 6. 动画性能优化

### 6.1 CSS 动画 vs JavaScript 动画

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 动画性能对比
// ────────────────────────────────────────────────────────────────────────────────────

/*
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  CSS 动画 vs JS 动画                                                                   │
├───────────────────────────────────────────────────────────────────────────────────────┤
│  CSS 动画                                                                              │
│  • 可以声明式地定义动画                                                                │
│  • 浏览器可以优化（在合成线程执行）                                                     │
│  • 适合简单的过渡动画                                                                  │
│  • transform 和 opacity 性能最好                                                       │
│                                                                                       │
│  JS 动画                                                                               │
│  • 更精细的控制（暂停、回放、缓动）                                                     │
│  • 适合复杂的物理动画、交互式动画                                                      │
│  • 使用 requestAnimationFrame                                                         │
│  • 可以访问动画过程中的值                                                              │
└───────────────────────────────────────────────────────────────────────────────────────┘
*/

// ✅ 高性能 CSS 动画
.animated-element {
    transition: transform 0.3s ease-out, opacity 0.3s ease-out;
    will-change: transform, opacity;  /* 提前告知浏览器 */
}

.animated-element:hover {
    transform: scale(1.1) rotate(5deg);
    opacity: 0.8;
}

// ────────────────────────────────────────────────────────────────────────────────────
// requestAnimationFrame 动画
// ────────────────────────────────────────────────────────────────────────────────────

function animate(element, property, start, end, duration, easing = 'linear') {
    const startTime = performance.now();
    
    const easingFunctions = {
        linear: t => t,
        easeInOut: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        easeOut: t => t * (2 - t)
    };
    
    const ease = easingFunctions[easing];
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = ease(progress);
        
        const currentValue = start + (end - start) * easedProgress;
        
        // 使用 transform 而非直接设置属性
        if (property === 'x') {
            element.style.transform = `translateX(${currentValue}px)`;
        } else if (property === 'opacity') {
            element.style.opacity = currentValue;
        }
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// 使用
const box = document.querySelector('.box');
animate(box, 'x', 0, 200, 500, 'easeOut');

// ────────────────────────────────────────────────────────────────────────────────────
// Web Animations API
// ────────────────────────────────────────────────────────────────────────────────────

const element = document.querySelector('.animated');

// 创建动画
const animation = element.animate(
    [
        { transform: 'translateX(0)', opacity: 1 },
        { transform: 'translateX(200px)', opacity: 0.5 }
    ],
    {
        duration: 500,
        easing: 'ease-out',
        fill: 'forwards',
        iterations: 1
    }
);

// 控制
animation.pause();
animation.play();
animation.reverse();

// 监听事件
animation.onfinish = () => console.log('Animation finished');
```

### 6.2 滚动性能优化

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 滚动优化
// ────────────────────────────────────────────────────────────────────────────────────

// ✅ 使用 passive 事件监听
window.addEventListener('scroll', handleScroll, { passive: true });

// ✅ 使用 Intersection Observer 代替滚动事件
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// ✅ 使用 scroll-snap 实现平滑滚动
/*
.scroll-container {
    scroll-snap-type: y mandatory;
    overflow-y: scroll;
}

.scroll-section {
    scroll-snap-align: start;
    height: 100vh;
}
*/

// ✅ 使用 CSS scroll-behavior
/*
html {
    scroll-behavior: smooth;
}

// 或 JS
element.scrollIntoView({ behavior: 'smooth' });
*/
```

---

## 7. 渲染优化检查清单

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  渲染优化检查清单                                                                      │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  渲染管线优化                                                                          │
│  □ 减少/合并 DOM 操作                                                                 │
│  □ 批量读取/写入样式属性                                                              │
│  □ 使用 CSS Containment 隔离重排范围                                                  │
│  □ 使用 transform/opacity 进行动画                                                    │
│  □ 合理使用 will-change                                                              │
│                                                                                       │
│  长任务优化                                                                            │
│  □ 将长任务分割成小任务                                                               │
│  □ 使用 requestIdleCallback 处理非关键任务                                            │
│  □ 使用 Web Worker 处理 CPU 密集型计算                                                │
│  □ 避免同步的重量级操作                                                               │
│                                                                                       │
│  列表渲染                                                                              │
│  □ 大列表使用虚拟滚动                                                                 │
│  □ 使用 key 优化列表更新                                                              │
│  □ 避免不必要的列表重渲染                                                             │
│                                                                                       │
│  事件处理                                                                              │
│  □ 高频事件使用防抖/节流                                                              │
│  □ 滚动事件使用 passive: true                                                         │
│  □ 使用 Intersection Observer 代替滚动监听                                            │
│  □ 动画使用 requestAnimationFrame                                                    │
│                                                                                       │
│  内存管理                                                                              │
│  □ 及时移除不再需要的事件监听器                                                       │
│  □ 及时清理不再使用的 Web Worker                                                      │
│  □ 避免内存泄漏                                                                       │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

[返回上级目录](../index.md)
