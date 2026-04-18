# 请求监控

> 请求监控通过劫持 XHR 和 Fetch API，监控网络请求的成功、失败、慢请求等情况，帮助发现网络问题。

## 学习要点

- 🔄 掌握 XHR 劫持技术
- 🌐 学会 Fetch 劫持方法
- ⏱️ 实现慢请求检测
- ❌ 捕获网络错误
- 📊 统计请求性能

---

## 1. 请求监控架构

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  请求监控架构                                                                          │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│   应用代码                                                                            │
│       │                                                                               │
│       ▼                                                                               │
│   ┌─────────────────────────────────────────────────────────────────────────────┐   │
│   │                           监控劫持层                                        │   │
│   │  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐    │   │
│   │  │     XHR 劫持      │    │    Fetch 劫持     │    │   WebSocket 劫持  │    │   │
│   │  │  • open          │    │  • fetch         │    │  • send          │    │   │
│   │  │  • send          │    │                  │    │  • onmessage     │    │   │
│   │  │  • abort         │    │                  │    │  • onerror       │    │   │
│   │  └────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘    │   │
│   │           │                       │                       │              │   │
│   │           └───────────────────────┼───────────────────────┘              │   │
│   │                                   ▼                                      │   │
│   │                        ┌─────────────────┐                               │   │
│   │                        │   数据采集      │                               │   │
│   │                        │  • 时间统计     │                               │   │
│   │                        │  • 状态记录     │                               │   │
│   │                        │  • 错误捕获     │                               │   │
│   │                        └────────┬────────┘                               │   │
│   └─────────────────────────────────┼───────────────────────────────────────┘   │
│                                     ▼                                               │
│                        ┌─────────────────┐                                         │
│                        │   原生 API      │                                         │
│                        │  XMLHttpRequest │                                         │
│                        │  fetch          │                                         │
│                        │  WebSocket      │                                         │
│                        └─────────────────┘                                         │
│                                                                                     │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. XHR 劫持

### 2.1 基本劫持实现

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// XHR 劫持基础实现
// ────────────────────────────────────────────────────────────────────────────────────

class XHRInterceptor {
    constructor(options = {}) {
        this.options = {
            slowThreshold: 3000,    // 慢请求阈值（毫秒）
            ignoreUrls: [],         // 忽略的 URL
            captureBody: false,     // 是否捕获请求体
            captureResponse: false, // 是否捕获响应体
            maxBodySize: 10000,     // 最大请求体大小
            ...options
        };
        
        this.pendingRequests = new Map();
        this.requestId = 0;
        
        this.originalOpen = null;
        this.originalSend = null;
        this.originalSetRequestHeader = null;
        this.originalAbort = null;
        
        this.init();
    }
    
    init() {
        // 保存原始方法
        this.originalOpen = XMLHttpRequest.prototype.open;
        this.originalSend = XMLHttpRequest.prototype.send;
        this.originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
        this.originalAbort = XMLHttpRequest.prototype.abort;
        
        const self = this;
        
        // ─────────────────────────────────────────────────────────────────────────
        // 劫持 open 方法
        // ─────────────────────────────────────────────────────────────────────────
        
        XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            // 创建请求信息
            this._interceptorInfo = {
                id: ++self.requestId,
                method: method.toUpperCase(),
                url: typeof url === 'string' ? url : url.toString(),
                async: async !== false,
                user: user,
                password: password,
                headers: {},
                startTime: 0
            };
            
            return self.originalOpen.apply(this, arguments);
        };
        
        // ─────────────────────────────────────────────────────────────────────────
        // 劫持 setRequestHeader 方法
        // ─────────────────────────────────────────────────────────────────────────
        
        XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
            if (this._interceptorInfo) {
                this._interceptorInfo.headers[header] = value;
            }
            return self.originalSetRequestHeader.apply(this, arguments);
        };
        
        // ─────────────────────────────────────────────────────────────────────────
        // 劫持 send 方法
        // ─────────────────────────────────────────────────────────────────────────
        
        XMLHttpRequest.prototype.send = function(body) {
            const info = this._interceptorInfo;
            
            if (!info) {
                return self.originalSend.apply(this, arguments);
            }
            
            // 检查是否应该忽略
            if (self.shouldIgnore(info.url)) {
                return self.originalSend.apply(this, arguments);
            }
            
            // 记录开始时间
            info.startTime = Date.now();
            
            // 记录请求体
            if (body && self.options.captureBody) {
                info.body = self.truncateBody(body);
            }
            
            // 添加到待处理队列
            self.pendingRequests.set(info.id, {
                xhr: this,
                info: info
            });
            
            // 监听事件
            self.setupListeners(this, info);
            
            return self.originalSend.apply(this, arguments);
        };
        
        // ─────────────────────────────────────────────────────────────────────────
        // 劫持 abort 方法
        // ─────────────────────────────────────────────────────────────────────────
        
        XMLHttpRequest.prototype.abort = function() {
            const info = this._interceptorInfo;
            
            if (info) {
                self.handleAbort(this, info);
            }
            
            return self.originalAbort.apply(this, arguments);
        };
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 设置事件监听器
    // ─────────────────────────────────────────────────────────────────────────────
    
    setupListeners(xhr, info) {
        const self = this;
        
        // 请求成功完成
        xhr.addEventListener('load', function() {
            self.handleLoad(this, info);
        });
        
        // 请求错误
        xhr.addEventListener('error', function() {
            self.handleError(this, info);
        });
        
        // 请求超时
        xhr.addEventListener('timeout', function() {
            self.handleTimeout(this, info);
        });
        
        // 请求中止（已在 abort 方法中处理）
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 处理请求完成
    // ─────────────────────────────────────────────────────────────────────────────
    
    handleLoad(xhr, info) {
        const duration = Date.now() - info.startTime;
        const isError = xhr.status >= 400;
        const isSlow = duration > this.options.slowThreshold;
        
        const data = {
            type: 'request',
            subType: isError ? 'error' : (isSlow ? 'slow' : 'success'),
            id: info.id,
            method: info.method,
            url: info.url,
            status: xhr.status,
            statusText: xhr.statusText,
            duration: duration,
            isSlow: isSlow,
            isError: isError,
            responseSize: xhr.response?.length || 0,
            timestamp: Date.now()
        };
        
        // 捕获响应体
        if (this.options.captureResponse && xhr.response) {
            data.response = this.truncateBody(xhr.response);
        }
        
        this.report(data);
        this.pendingRequests.delete(info.id);
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 处理请求错误
    // ─────────────────────────────────────────────────────────────────────────────
    
    handleError(xhr, info) {
        const data = {
            type: 'request',
            subType: 'network-error',
            id: info.id,
            method: info.method,
            url: info.url,
            duration: Date.now() - info.startTime,
            timestamp: Date.now()
        };
        
        this.report(data);
        this.pendingRequests.delete(info.id);
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 处理请求超时
    // ─────────────────────────────────────────────────────────────────────────────
    
    handleTimeout(xhr, info) {
        const data = {
            type: 'request',
            subType: 'timeout',
            id: info.id,
            method: info.method,
            url: info.url,
            timeout: xhr.timeout,
            duration: Date.now() - info.startTime,
            timestamp: Date.now()
        };
        
        this.report(data);
        this.pendingRequests.delete(info.id);
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 处理请求中止
    // ─────────────────────────────────────────────────────────────────────────────
    
    handleAbort(xhr, info) {
        const data = {
            type: 'request',
            subType: 'abort',
            id: info.id,
            method: info.method,
            url: info.url,
            duration: Date.now() - info.startTime,
            timestamp: Date.now()
        };
        
        this.report(data);
        this.pendingRequests.delete(info.id);
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 辅助方法
    // ─────────────────────────────────────────────────────────────────────────────
    
    shouldIgnore(url) {
        for (const pattern of this.options.ignoreUrls) {
            if (typeof pattern === 'string' && url.includes(pattern)) {
                return true;
            }
            if (pattern instanceof RegExp && pattern.test(url)) {
                return true;
            }
        }
        return false;
    }
    
    truncateBody(body) {
        if (!body) return '';
        
        const str = typeof body === 'string' ? body : 
                    body instanceof FormData ? '[FormData]' :
                    body instanceof Blob ? `[Blob: ${body.size} bytes]` :
                    body instanceof ArrayBuffer ? `[ArrayBuffer: ${body.byteLength} bytes]` :
                    JSON.stringify(body);
        
        return str.length > this.options.maxBodySize 
            ? str.slice(0, this.options.maxBodySize) + '...[truncated]'
            : str;
    }
    
    report(data) {
        // 由外部设置 reporter
        if (this.reporter) {
            this.reporter.report(data);
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 销毁
    // ─────────────────────────────────────────────────────────────────────────────
    
    destroy() {
        XMLHttpRequest.prototype.open = this.originalOpen;
        XMLHttpRequest.prototype.send = this.originalSend;
        XMLHttpRequest.prototype.setRequestHeader = this.originalSetRequestHeader;
        XMLHttpRequest.prototype.abort = this.originalAbort;
        
        this.pendingRequests.clear();
    }
}
```

---

## 3. Fetch 劫持

### 3.1 Fetch 劫持实现

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// Fetch 劫持实现
// ────────────────────────────────────────────────────────────────────────────────────

class FetchInterceptor {
    constructor(options = {}) {
        this.options = {
            slowThreshold: 3000,
            ignoreUrls: [],
            captureBody: false,
            captureResponse: false,
            maxBodySize: 10000,
            ...options
        };
        
        this.originalFetch = null;
        this.requestId = 0;
        
        this.init();
    }
    
    init() {
        if (typeof window.fetch !== 'function') {
            console.warn('Fetch API not supported');
            return;
        }
        
        this.originalFetch = window.fetch;
        const self = this;
        
        window.fetch = function(url, options = {}) {
            const requestId = ++self.requestId;
            const startTime = Date.now();
            
            // 解析 URL
            const urlString = self.parseUrl(url);
            const method = (options.method || 'GET').toUpperCase();
            
            // 检查是否应该忽略
            if (self.shouldIgnore(urlString)) {
                return self.originalFetch.apply(this, arguments);
            }
            
            // 构建请求信息
            const requestInfo = {
                id: requestId,
                method: method,
                url: urlString,
                headers: options.headers,
                body: self.options.captureBody ? self.truncateBody(options.body) : undefined,
                startTime: startTime
            };
            
            // 发起请求
            return self.originalFetch.apply(this, arguments)
                .then(async response => {
                    const duration = Date.now() - startTime;
                    
                    // 克隆响应用于读取
                    const clonedResponse = response.clone();
                    
                    // 获取响应体大小
                    let responseSize = 0;
                    let responseBody;
                    
                    if (self.options.captureResponse) {
                        try {
                            responseBody = await clonedResponse.text();
                            responseSize = responseBody.length;
                            responseBody = self.truncateBody(responseBody);
                        } catch (e) {}
                    } else {
                        try {
                            const blob = await clonedResponse.blob();
                            responseSize = blob.size;
                        } catch (e) {}
                    }
                    
                    const isError = !response.ok;
                    const isSlow = duration > self.options.slowThreshold;
                    
                    const data = {
                        type: 'request',
                        subType: isError ? 'error' : (isSlow ? 'slow' : 'success'),
                        id: requestId,
                        method: method,
                        url: urlString,
                        status: response.status,
                        statusText: response.statusText,
                        duration: duration,
                        isSlow: isSlow,
                        isError: isError,
                        responseSize: responseSize,
                        response: responseBody,
                        timestamp: Date.now()
                    };
                    
                    self.report(data);
                    
                    return response;
                })
                .catch(error => {
                    // 网络错误
                    const data = {
                        type: 'request',
                        subType: 'network-error',
                        id: requestId,
                        method: method,
                        url: urlString,
                        message: error.message,
                        name: error.name,
                        duration: Date.now() - startTime,
                        timestamp: Date.now()
                    };
                    
                    self.report(data);
                    
                    throw error;
                });
        };
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 解析 URL
    // ─────────────────────────────────────────────────────────────────────────────
    
    parseUrl(url) {
        if (typeof url === 'string') {
            return url;
        }
        
        if (url instanceof Request) {
            return url.url;
        }
        
        if (url instanceof URL) {
            return url.toString();
        }
        
        return String(url);
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 辅助方法
    // ─────────────────────────────────────────────────────────────────────────────
    
    shouldIgnore(url) {
        for (const pattern of this.options.ignoreUrls) {
            if (typeof pattern === 'string' && url.includes(pattern)) {
                return true;
            }
            if (pattern instanceof RegExp && pattern.test(url)) {
                return true;
            }
        }
        return false;
    }
    
    truncateBody(body) {
        if (!body) return '';
        
        const str = typeof body === 'string' ? body : JSON.stringify(body);
        
        return str.length > this.options.maxBodySize 
            ? str.slice(0, this.options.maxBodySize) + '...[truncated]'
            : str;
    }
    
    report(data) {
        if (this.reporter) {
            this.reporter.report(data);
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 销毁
    // ─────────────────────────────────────────────────────────────────────────────
    
    destroy() {
        if (this.originalFetch) {
            window.fetch = this.originalFetch;
        }
    }
}
```

---

## 4. 慢请求检测

### 4.1 慢请求监控

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 慢请求检测与告警
// ────────────────────────────────────────────────────────────────────────────────────

class SlowRequestMonitor {
    constructor(options = {}) {
        this.options = {
            // 不同类型请求的阈值
            thresholds: {
                'api': 3000,        // API 请求
                'static': 5000,     // 静态资源
                'image': 5000,      // 图片
                'script': 5000,     // 脚本
                'stylesheet': 3000, // 样式表
                'font': 5000,       // 字体
                'default': 3000     // 默认
            },
            // 告警阈值
            alertThreshold: 5,      // 慢请求数量阈值
            alertWindow: 60000,     // 告警窗口期（毫秒）
            ...options
        };
        
        this.slowRequests = [];
        this.reporter = null;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 处理请求完成
    // ─────────────────────────────────────────────────────────────────────────────
    
    handleRequest(data) {
        const threshold = this.getThreshold(data.url, data.method);
        
        if (data.duration > threshold) {
            this.recordSlowRequest({
                ...data,
                threshold: threshold,
                exceeded: data.duration - threshold
            });
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 获取阈值
    // ─────────────────────────────────────────────────────────────────────────────
    
    getThreshold(url, method) {
        // 根据请求类型判断
        const type = this.getRequestType(url);
        return this.options.thresholds[type] || this.options.thresholds.default;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 获取请求类型
    // ─────────────────────────────────────────────────────────────────────────────
    
    getRequestType(url) {
        // 尝试解析 URL
        try {
            const urlObj = new URL(url, location.origin);
            const pathname = urlObj.pathname.toLowerCase();
            
            // 检查文件扩展名
            if (pathname.endsWith('.js')) return 'script';
            if (pathname.endsWith('.css')) return 'stylesheet';
            if (/\.(png|jpg|jpeg|gif|webp|svg|ico)$/i.test(pathname)) return 'image';
            if (/\.(woff|woff2|ttf|eot|otf)$/i.test(pathname)) return 'font';
            
            // 检查是否是 API 请求
            if (pathname.startsWith('/api/') || 
                pathname.includes('/api/') ||
                urlObj.searchParams.has('api')) {
                return 'api';
            }
            
        } catch (e) {}
        
        return 'default';
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 记录慢请求
    // ─────────────────────────────────────────────────────────────────────────────
    
    recordSlowRequest(data) {
        this.slowRequests.push({
            ...data,
            timestamp: Date.now()
        });
        
        // 清理过期数据
        this.cleanOldRequests();
        
        // 检查是否需要告警
        this.checkAlert();
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 清理过期数据
    // ─────────────────────────────────────────────────────────────────────────────
    
    cleanOldRequests() {
        const now = Date.now();
        const window = this.options.alertWindow;
        
        this.slowRequests = this.slowRequests.filter(
            req => now - req.timestamp < window
        );
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 检查告警
    // ─────────────────────────────────────────────────────────────────────────────
    
    checkAlert() {
        if (this.slowRequests.length >= this.options.alertThreshold) {
            this.sendAlert({
                type: 'request',
                subType: 'slow-request-alert',
                count: this.slowRequests.length,
                window: this.options.alertWindow,
                requests: this.slowRequests.slice(-10),
                timestamp: Date.now()
            });
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 统计信息
    // ─────────────────────────────────────────────────────────────────────────────
    
    getStatistics() {
        const byType = {};
        
        this.slowRequests.forEach(req => {
            const type = this.getRequestType(req.url);
            
            if (!byType[type]) {
                byType[type] = {
                    count: 0,
                    totalDuration: 0,
                    avgDuration: 0,
                    maxDuration: 0
                };
            }
            
            byType[type].count++;
            byType[type].totalDuration += req.duration;
            byType[type].maxDuration = Math.max(byType[type].maxDuration, req.duration);
        });
        
        // 计算平均值
        Object.keys(byType).forEach(type => {
            byType[type].avgDuration = byType[type].totalDuration / byType[type].count;
        });
        
        return {
            total: this.slowRequests.length,
            byType
        };
    }
    
    sendAlert(data) {
        if (this.reporter) {
            this.reporter.report(data);
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

## 5. 请求统计与分析

### 5.1 请求统计类

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 请求统计分析
// ────────────────────────────────────────────────────────────────────────────────────

class RequestStatistics {
    constructor(options = {}) {
        this.options = {
            windowSize: 60000,     // 统计窗口大小
            reportInterval: 30000, // 上报间隔
            ...options
        };
        
        this.requests = [];
        this.reporter = null;
        
        this.init();
    }
    
    init() {
        // 定时上报
        this.reportTimer = setInterval(() => {
            this.reportStatistics();
        }, this.options.reportInterval);
        
        // 页面隐藏时上报
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.reportStatistics();
            }
        });
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 记录请求
    // ─────────────────────────────────────────────────────────────────────────────
    
    recordRequest(data) {
        this.requests.push({
            ...data,
            timestamp: Date.now()
        });
        
        // 清理过期数据
        this.cleanOldData();
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 清理过期数据
    // ─────────────────────────────────────────────────────────────────────────────
    
    cleanOldData() {
        const now = Date.now();
        this.requests = this.requests.filter(
            req => now - req.timestamp < this.options.windowSize
        );
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 计算统计数据
    // ─────────────────────────────────────────────────────────────────────────────
    
    calculateStatistics() {
        if (this.requests.length === 0) {
            return null;
        }
        
        const stats = {
            total: this.requests.length,
            success: 0,
            error: 0,
            slow: 0,
            timeout: 0,
            abort: 0,
            
            // 按方法统计
            byMethod: {},
            
            // 按状态码统计
            byStatus: {},
            
            // 时间统计
            durations: [],
            
            // 慢请求
            slowRequests: []
        };
        
        this.requests.forEach(req => {
            // 统计类型
            if (req.subType === 'success') stats.success++;
            else if (req.subType === 'error') stats.error++;
            else if (req.subType === 'slow') { stats.slow++; stats.slowRequests.push(req); }
            else if (req.subType === 'timeout') stats.timeout++;
            else if (req.subType === 'abort') stats.abort++;
            
            // 按方法统计
            const method = req.method || 'UNKNOWN';
            if (!stats.byMethod[method]) {
                stats.byMethod[method] = { total: 0, error: 0 };
            }
            stats.byMethod[method].total++;
            if (req.isError) stats.byMethod[method].error++;
            
            // 按状态码统计
            const status = req.status || 0;
            const statusGroup = Math.floor(status / 100) * 100;
            if (!stats.byStatus[statusGroup]) {
                stats.byStatus[statusGroup] = 0;
            }
            stats.byStatus[statusGroup]++;
            
            // 时间
            if (req.duration) {
                stats.durations.push(req.duration);
            }
        });
        
        // 计算时间统计
        if (stats.durations.length > 0) {
            stats.duration = {
                min: Math.min(...stats.durations),
                max: Math.max(...stats.durations),
                avg: stats.durations.reduce((a, b) => a + b, 0) / stats.durations.length,
                p50: this.percentile(stats.durations, 50),
                p90: this.percentile(stats.durations, 90),
                p95: this.percentile(stats.durations, 95),
                p99: this.percentile(stats.durations, 99)
            };
        }
        
        // 计算成功率
        stats.successRate = stats.total > 0 
            ? ((stats.success / stats.total) * 100).toFixed(2) 
            : 0;
        
        return stats;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 计算百分位
    // ─────────────────────────────────────────────────────────────────────────────
    
    percentile(arr, p) {
        if (arr.length === 0) return 0;
        
        const sorted = [...arr].sort((a, b) => a - b);
        const index = Math.ceil(sorted.length * (p / 100)) - 1;
        return sorted[Math.max(0, index)];
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 上报统计
    // ─────────────────────────────────────────────────────────────────────────────
    
    reportStatistics() {
        const stats = this.calculateStatistics();
        
        if (stats && stats.total > 0) {
            this.report({
                type: 'request',
                subType: 'statistics',
                ...stats,
                window: this.options.windowSize,
                timestamp: Date.now()
            });
        }
    }
    
    report(data) {
        if (this.reporter) {
            this.reporter.report(data);
        }
    }
    
    destroy() {
        if (this.reportTimer) {
            clearInterval(this.reportTimer);
        }
    }
}
```

---

## 6. 完整请求监控类

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 完整请求监控类
// ────────────────────────────────────────────────────────────────────────────────────

class RequestMonitor {
    constructor(options = {}) {
        this.options = {
            captureXHR: true,
            captureFetch: true,
            slowThreshold: 3000,
            ignoreUrls: [],
            ...options
        };
        
        this.reporter = options.reporter;
        this.interceptors = {};
        this.statistics = null;
        this.slowRequestMonitor = null;
        
        this.init();
    }
    
    init() {
        // 初始化统计
        this.statistics = new RequestStatistics({
            reporter: this.reporter
        });
        
        // 初始化慢请求监控
        this.slowRequestMonitor = new SlowRequestMonitor({
            reporter: this.reporter
        });
        
        // XHR 劫持
        if (this.options.captureXHR) {
            this.interceptors.xhr = new XHRInterceptor({
                slowThreshold: this.options.slowThreshold,
                ignoreUrls: this.options.ignoreUrls
            });
            this.interceptors.xhr.reporter = this.createReporter();
        }
        
        // Fetch 劫持
        if (this.options.captureFetch) {
            this.interceptors.fetch = new FetchInterceptor({
                slowThreshold: this.options.slowThreshold,
                ignoreUrls: this.options.ignoreUrls
            });
            this.interceptors.fetch.reporter = this.createReporter();
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 创建上报器
    // ─────────────────────────────────────────────────────────────────────────────
    
    createReporter() {
        const self = this;
        
        return {
            report(data) {
                // 记录到统计
                self.statistics.recordRequest(data);
                
                // 检查慢请求
                self.slowRequestMonitor.handleRequest(data);
                
                // 上报
                self.reporter.report(data);
            }
        };
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 获取统计信息
    // ─────────────────────────────────────────────────────────────────────────────
    
    getStatistics() {
        return this.statistics.calculateStatistics();
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 销毁
    // ─────────────────────────────────────────────────────────────────────────────
    
    destroy() {
        Object.values(this.interceptors).forEach(interceptor => {
            if (interceptor && interceptor.destroy) {
                interceptor.destroy();
            }
        });
        
        if (this.statistics) {
            this.statistics.destroy();
        }
    }
}

export default RequestMonitor;
```

---

## 最佳实践

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  请求监控最佳实践                                                                      │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  劫持策略                                                                              │
│  □ 保存原始方法引用，销毁时恢复                                                       │
│  □ 使用 apply 保持 this 指向                                                         │
│  □ 异常处理避免影响正常请求                                                           │
│                                                                                       │
│  性能优化                                                                              │
│  □ 忽略不需要监控的请求（如监控上报本身）                                             │
│  □ 限制请求体/响应体捕获大小                                                         │
│  □ 使用被动监听减少性能开销                                                          │
│                                                                                       │
│  慢请求检测                                                                            │
│  □ 根据请求类型设置不同阈值                                                           │
│  □ 设置告警阈值避免频繁告警                                                           │
│  □ 记录慢请求详细信息便于排查                                                         │
│                                                                                       │
│  数据统计                                                                              │
│  □ 记录成功率和错误率                                                                 │
│  □ 计算响应时间百分位                                                                 │
│  □ 按接口分组统计                                                                     │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

[返回上级目录](../index.md)
