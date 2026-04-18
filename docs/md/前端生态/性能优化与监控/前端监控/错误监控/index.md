# 错误监控

> 错误监控是保障应用稳定性的关键环节，通过全面捕获、上报和分析错误，帮助开发者快速定位和修复问题。

## 学习要点

- 🐛 掌握各类 JavaScript 错误捕获方式
- 🔗 理解 Promise 错误捕获机制
- 🖼️ 学会资源加载错误监控
- ⚛️ 掌握 Vue/React 框架错误处理
- 🌐 实现网络请求错误捕获

---

## 1. 错误类型分类

### 1.1 前端错误全景图

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  前端错误类型全景图                                                                    │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  JavaScript 运行时错误                                                           │ │
│  │  ┌──────────────────────────────────────────────────────────────────────────┐  │ │
│  │  │ SyntaxError      - 语法错误（编译时）                                     │  │ │
│  │  │ ReferenceError   - 引用不存在的变量                                       │  │ │
│  │  │ TypeError        - 类型错误                                               │  │ │
│  │  │ RangeError       - 超出有效范围                                           │  │ │
│  │  │ URIError         - URI 处理错误                                           │  │ │
│  │  │ EvalError        - eval 相关错误                                          │  │ │
│  │  └──────────────────────────────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  Promise 错误                                                                    │ │
│  │  ┌──────────────────────────────────────────────────────────────────────────┐  │ │
│  │  │ unhandledrejection - 未捕获的 Promise 拒绝                               │  │ │
│  │  │ rejectionhandled   - 延迟捕获的拒绝                                       │  │ │
│  │  └──────────────────────────────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  资源加载错误                                                                     │ │
│  │  ┌──────────────────────────────────────────────────────────────────────────┐  │ │
│  │  │ <script>    - JS 文件加载失败                                             │  │ │
│  │  │ <link>      - CSS 文件加载失败                                            │  │ │
│  │  │ <img>       - 图片加载失败                                                │  │ │
│  │  │ <video>     - 视频加载失败                                                │  │ │
│  │  │ <audio>     - 音频加载失败                                                │  │ │
│  │  │ <iframe>    - iframe 加载失败                                             │  │ │
│  │  │ @font-face  - 字体加载失败                                                │  │ │
│  │  └──────────────────────────────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  框架错误                                                                         │ │
│  │  ┌──────────────────────────────────────────────────────────────────────────┐  │ │
│  │  │ Vue  - errorHandler / warnHandler / renderError                          │  │ │
│  │  │ React - ErrorBoundary / componentDidCatch / getDerivedStateFromError     │  │ │
│  │  └──────────────────────────────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  网络请求错误                                                                     │ │
│  │  ┌──────────────────────────────────────────────────────────────────────────┐  │ │
│  │  │ XHR      - XMLHttpRequest 错误、超时、中止                                │  │ │
│  │  │ Fetch    - Fetch 请求错误、网络错误                                       │  │ │
│  │  │ WebSocket - 连接错误、关闭异常                                            │  │ │
│  │  └──────────────────────────────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 错误类型详解

| 错误类型 | 触发场景 | 示例 |
|---------|---------|------|
| SyntaxError | 代码解析阶段发现语法问题 | `const x =` |
| ReferenceError | 访问未声明的变量 | `console.log(undeclaredVar)` |
| TypeError | 值不是预期类型 | `null.foo()` |
| RangeError | 值超出有效范围 | `new Array(-1)` |
| URIError | URI 编解码错误 | `decodeURIComponent('%')` |

---

## 2. JavaScript 错误捕获

### 2.1 window.onerror

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// window.onerror - 捕获运行时错误
// ────────────────────────────────────────────────────────────────────────────────────

/**
 * window.onerror 能捕获以下错误：
 * 1. JavaScript 运行时错误（SyntaxError 除外）
 * 2. 动态脚本执行错误（需要设置 crossorigin）
 * 
 * 不能捕获：
 * 1. 语法错误（整个脚本不会执行）
 * 2. 资源加载错误
 * 3. Promise 错误
 */

window.onerror = function(message, source, lineno, colno, error) {
    // 参数说明：
    // message  - 错误消息
    // source   - 发生错误的脚本 URL
    // lineno   - 错误行号
    // colno    - 错误列号
    // error    - Error 对象（可能为 null）
    
    const errorInfo = {
        type: 'javascript',
        message: message,
        filename: source,
        lineno: lineno,
        colno: colno,
        stack: error?.stack,
        name: error?.name,
        timestamp: Date.now(),
        url: location.href,
        userAgent: navigator.userAgent
    };
    
    // 上报错误
    reportError(errorInfo);
    
    // 返回 true 阻止浏览器默认错误处理（控制台显示）
    return true;
};

// ────────────────────────────────────────────────────────────────────────────────────
// 注意事项
// ────────────────────────────────────────────────────────────────────────────────────

// 1. 只有在返回 true 时，才能阻止控制台报错
// 2. 对于跨域脚本，需要设置 crossorigin 属性才能捕获详细错误信息

// 正确引入跨域脚本
<script src="https://cdn.example.com/app.js" crossorigin="anonymous"></script>

// 服务器需要返回正确的 CORS 头
// Access-Control-Allow-Origin: *
// Access-Control-Allow-Credentials: true
```

### 2.2 window.addEventListener('error')

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// window.addEventListener('error') - 捕获所有错误
// ────────────────────────────────────────────────────────────────────────────────────

/**
 * 与 window.onerror 的区别：
 * 1. 可以捕获资源加载错误（event.target !== window）
 * 2. 需要在捕获阶段监听（第三个参数为 true）
 * 3. 返回值不影响浏览器默认行为
 */

window.addEventListener('error', (event) => {
    // event 包含错误信息
    // event.message    - 错误消息
    // event.filename   - 脚本文件名
    // event.lineno     - 行号
    // event.colno      - 列号
    // event.error      - Error 对象
    // event.target     - 触发错误的元素（资源错误时指向元素）
    
    if (event.target === window) {
        // JavaScript 错误（已被 window.onerror 处理）
        // 这里可以选择性地再次处理或忽略
        console.log('JS Error:', event.message);
    } else {
        // 资源加载错误
        const target = event.target;
        const resourceInfo = {
            type: 'resource',
            tagName: target.tagName.toLowerCase(),
            src: target.src || target.href,
            outerHTML: target.outerHTML?.slice(0, 500),
            timestamp: Date.now()
        };
        
        reportError(resourceInfo);
    }
}, true);  // 必须在捕获阶段监听！

// ────────────────────────────────────────────────────────────────────────────────────
// 为什么必须在捕获阶段监听？
// ────────────────────────────────────────────────────────────────────────────────────

/**
 * 事件传播顺序：
 * 1. 捕获阶段：window → document → body → ... → 目标元素
 * 2. 目标阶段：在目标元素上触发
 * 3. 冒泡阶段：目标元素 → ... → body → document → window
 * 
 * 资源加载错误不会冒泡！
 * 因此必须在捕获阶段监听，才能捕获到资源加载错误。
 */

// 错误示例：冒泡阶段监听（无法捕获资源错误）
window.addEventListener('error', handler, false);  // ✗ 错误

// 正确示例：捕获阶段监听
window.addEventListener('error', handler, true);   // ✓ 正确
```

### 2.3 完整的错误捕获类

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// JavaScript 错误监控类
// ────────────────────────────────────────────────────────────────────────────────────

class JSErrorMonitor {
    constructor(options = {}) {
        this.options = {
            captureErrors: true,
            captureRejections: true,
            captureResources: true,
            ignoreErrors: [],
            ignoreUrls: [],
            ...options
        };
        
        this.reporter = options.reporter;
        this.init();
    }
    
    init() {
        // 使用 addEventListener 捕获所有错误
        window.addEventListener('error', this.handleError.bind(this), true);
        
        // 兼容 window.onerror
        this.originalOnError = window.onerror;
        window.onerror = this.handleOnError.bind(this);
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 错误处理
    // ─────────────────────────────────────────────────────────────────────────────
    
    handleError(event) {
        if (event.target === window) {
            // JavaScript 错误
            this.processJSError(event);
        } else {
            // 资源加载错误
            if (this.options.captureResources) {
                this.processResourceError(event);
            }
        }
    }
    
    handleOnError(message, source, lineno, colno, error) {
        // 调用原始处理器
        if (this.originalOnError) {
            this.originalOnError(message, source, lineno, colno, error);
        }
        
        // 返回 true 阻止默认处理
        return true;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 处理 JS 错误
    // ─────────────────────────────────────────────────────────────────────────────
    
    processJSError(event) {
        const errorInfo = {
            type: 'javascript',
            subType: 'runtime',
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error?.stack,
            name: event.error?.name,
            timestamp: Date.now()
        };
        
        // 检查是否应该忽略
        if (this.shouldIgnore(errorInfo)) {
            return;
        }
        
        // 解析错误堆栈
        if (errorInfo.stack) {
            errorInfo.parsedStack = this.parseStack(errorInfo.stack);
        }
        
        this.report(errorInfo);
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 处理资源错误
    // ─────────────────────────────────────────────────────────────────────────────
    
    processResourceError(event) {
        const target = event.target;
        const tagName = target.tagName?.toLowerCase();
        
        if (!tagName) return;
        
        const resourceType = this.getResourceType(tagName);
        if (!resourceType) return;
        
        const resourceInfo = {
            type: 'resource',
            subType: resourceType,
            tagName: tagName,
            src: target.src || target.href,
            outerHTML: target.outerHTML?.slice(0, 500),
            id: target.id,
            className: target.className,
            timestamp: Date.now()
        };
        
        // 检查是否应该忽略
        if (this.shouldIgnoreUrl(resourceInfo.src)) {
            return;
        }
        
        this.report(resourceInfo);
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 辅助方法
    // ─────────────────────────────────────────────────────────────────────────────
    
    getResourceType(tagName) {
        const typeMap = {
            'script': 'script',
            'link': 'stylesheet',
            'img': 'image',
            'source': 'media',
            'video': 'video',
            'audio': 'audio',
            'iframe': 'iframe'
        };
        return typeMap[tagName] || 'unknown';
    }
    
    shouldIgnore(errorInfo) {
        // 检查错误消息
        for (const pattern of this.options.ignoreErrors) {
            if (typeof pattern === 'string' && errorInfo.message?.includes(pattern)) {
                return true;
            }
            if (pattern instanceof RegExp && pattern.test(errorInfo.message)) {
                return true;
            }
        }
        
        // 检查文件 URL
        return this.shouldIgnoreUrl(errorInfo.filename);
    }
    
    shouldIgnoreUrl(url) {
        if (!url) return false;
        
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
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 解析错误堆栈
    // ─────────────────────────────────────────────────────────────────────────────
    
    parseStack(stack) {
        if (!stack) return [];
        
        const lines = stack.split('\n');
        const result = [];
        
        // 常见的堆栈格式正则
        // Chrome:    at functionName (file:line:col)
        // Firefox:   functionName@file:line:col
        // Safari:    functionName@file:line:col
        // Edge:      at functionName (file:line:col)
        
        const chromeRegex = /^\s*at\s+(?:(.+?)\s+)?\(?(.+?):(\d+):(\d+)\)?$/;
        const firefoxRegex = /^(.+?)@(.+?):(\d+):(\d+)$/;
        
        for (const line of lines) {
            let match = line.match(chromeRegex);
            
            if (!match) {
                match = line.match(firefoxRegex);
            }
            
            if (match) {
                result.push({
                    functionName: match[1] || 'anonymous',
                    filename: match[2],
                    line: parseInt(match[3], 10),
                    column: parseInt(match[4], 10),
                    raw: line.trim()
                });
            }
        }
        
        return result;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 上报
    // ─────────────────────────────────────────────────────────────────────────────
    
    report(data) {
        if (this.reporter) {
            this.reporter.report(data);
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 销毁
    // ─────────────────────────────────────────────────────────────────────────────
    
    destroy() {
        window.removeEventListener('error', this.handleError, true);
        window.onerror = this.originalOnError;
    }
}
```

---

## 3. Promise 错误捕获

### 3.1 unhandledrejection 事件

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// Promise 错误捕获
// ────────────────────────────────────────────────────────────────────────────────────

/**
 * Promise 错误的特点：
 * 1. Promise 内部的错误不会冒泡到外层
 * 2. 没有 catch 的 Promise 拒绝会触发 unhandledrejection
 * 3. 后添加的 catch 会触发 rejectionhandled
 */

// 监听未处理的 Promise 拒绝
window.addEventListener('unhandledrejection', (event) => {
    // 阻止默认行为（控制台打印错误）
    event.preventDefault();
    
    const reason = event.reason;
    
    // 解析不同类型的 reason
    let errorInfo = {
        type: 'promise',
        subType: 'unhandledrejection',
        timestamp: Date.now()
    };
    
    if (reason instanceof Error) {
        // Error 对象
        errorInfo.message = reason.message;
        errorInfo.stack = reason.stack;
        errorInfo.name = reason.name;
    } else if (typeof reason === 'string') {
        // 字符串
        errorInfo.message = reason;
    } else if (typeof reason === 'object' && reason !== null) {
        // 对象
        try {
            errorInfo.message = JSON.stringify(reason);
        } catch (e) {
            errorInfo.message = String(reason);
        }
    } else {
        errorInfo.message = String(reason);
    }
    
    reportError(errorInfo);
});

// 监听延迟处理的 Promise 拒绝
window.addEventListener('rejectionhandled', (event) => {
    // 这个事件在 Promise 被拒绝后、又添加了 catch 处理器时触发
    // 通常不需要上报，但可以用于调试
    console.log('Promise rejection was handled:', event.reason);
});

// ────────────────────────────────────────────────────────────────────────────────────
// 示例：各种 Promise 错误场景
// ────────────────────────────────────────────────────────────────────────────────────

// 1. Promise 构造函数中抛出错误
new Promise((resolve, reject) => {
    throw new Error('Error in constructor');
});

// 2. Promise.reject
Promise.reject('Simple rejection');

// 3. then 中抛出错误
Promise.resolve()
    .then(() => {
        throw new Error('Error in then');
    });

// 4. async/await 中未捕获的错误
async function asyncError() {
    throw new Error('Async error');
}
asyncError();  // 没有 await，错误会丢失

// 5. async/await 中未处理的错误
async function asyncError2() {
    const result = await Promise.reject('Rejected');
    return result;
}
asyncError2();  // 没有 catch
```

### 3.2 Promise 错误监控类

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// Promise 错误监控类
// ────────────────────────────────────────────────────────────────────────────────────

class PromiseErrorMonitor {
    constructor(options = {}) {
        this.options = {
            captureUnhandledRejection: true,
            captureRejectionHandled: false,
            ignorePatterns: [],
            ...options
        };
        
        this.reporter = options.reporter;
        this.init();
    }
    
    init() {
        if (this.options.captureUnhandledRejection) {
            window.addEventListener('unhandledrejection', this.handleRejection.bind(this));
        }
        
        if (this.options.captureRejectionHandled) {
            window.addEventListener('rejectionhandled', this.handleRejectionHandled.bind(this));
        }
    }
    
    handleRejection(event) {
        event.preventDefault();
        
        const reason = event.reason;
        const errorInfo = {
            type: 'promise',
            subType: 'unhandledrejection',
            timestamp: Date.now()
        };
        
        this.parseReason(reason, errorInfo);
        
        // 检查是否应该忽略
        if (this.shouldIgnore(errorInfo.message)) {
            return;
        }
        
        // 添加 Promise 相关信息
        if (event.promise) {
            errorInfo.promiseState = this.getPromiseState(event.promise);
        }
        
        this.report(errorInfo);
    }
    
    handleRejectionHandled(event) {
        const errorInfo = {
            type: 'promise',
            subType: 'rejectionhandled',
            message: String(event.reason),
            timestamp: Date.now()
        };
        
        this.report(errorInfo);
    }
    
    parseReason(reason, errorInfo) {
        if (reason instanceof Error) {
            errorInfo.message = reason.message;
            errorInfo.stack = reason.stack;
            errorInfo.name = reason.name;
        } else if (reason === null || reason === undefined) {
            errorInfo.message = `Promise rejected with ${reason}`;
        } else if (typeof reason === 'object') {
            // 尝试提取常见属性
            errorInfo.message = reason.message || reason.error || JSON.stringify(reason);
            errorInfo.stack = reason.stack;
            errorInfo.code = reason.code || reason.status;
            errorInfo.data = reason;
        } else {
            errorInfo.message = String(reason);
        }
    }
    
    getPromiseState(promise) {
        // Promise 的状态无法直接获取，这里尝试通过 then 来判断
        // 注意：这只是近似判断
        const state = { status: 'unknown' };
        
        Promise.race([promise, Promise.resolve('pending')])
            .then(
                () => { state.status = 'resolved'; },
                () => { state.status = 'rejected'; }
            );
        
        return state.status;
    }
    
    shouldIgnore(message) {
        for (const pattern of this.options.ignorePatterns) {
            if (typeof pattern === 'string' && message?.includes(pattern)) {
                return true;
            }
            if (pattern instanceof RegExp && pattern.test(message)) {
                return true;
            }
        }
        return false;
    }
    
    report(data) {
        if (this.reporter) {
            this.reporter.report(data);
        }
    }
    
    destroy() {
        window.removeEventListener('unhandledrejection', this.handleRejection);
        window.removeEventListener('rejectionhandled', this.handleRejectionHandled);
    }
}
```

---

## 4. 资源加载错误

### 4.1 资源错误类型

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  资源加载错误类型                                                                      │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  <script> 脚本加载错误                                                           │ │
│  │  • 原因：URL 错误、服务器错误、CORS 问题、网络问题                               │ │
│  │  • 特点：会阻止后续脚本执行                                                       │ │
│  │  • 解决：async/defer、onerror、重试加载                                          │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  <link> 样式加载错误                                                             │ │
│  │  • 原因：URL 错误、服务器错误、CORS 问题                                         │ │
│  │  • 特点：页面样式缺失，影响布局                                                   │ │
│  │  • 解决：onerror、备用样式                                                       │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  <img> 图片加载错误                                                              │ │
│  │  • 原因：URL 错误、图片不存在、格式不支持、网络问题                               │ │
│  │  • 特点：显示占位图或空白                                                         │ │
│  │  • 解决：onerror、占位图、懒加载                                                  │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  @font-face 字体加载错误                                                         │ │
│  │  • 原因：URL 错误、字体格式不支持、CORS 问题                                     │ │
│  │  • 特点：文字显示默认字体或 FOUT/FOIT                                            │ │
│  │  • 解决：font-display、FontFace API、备用字体                                    │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 资源错误捕获实现

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 资源加载错误监控类
// ────────────────────────────────────────────────────────────────────────────────────

class ResourceErrorMonitor {
    constructor(options = {}) {
        this.options = {
            captureScripts: true,
            captureStyles: true,
            captureImages: true,
            captureMedia: true,
            captureFonts: true,
            captureIframes: true,
            ignoreUrls: [],
            ...options
        };
        
        this.reporter = options.reporter;
        this.init();
    }
    
    init() {
        // 使用捕获阶段监听 error 事件
        window.addEventListener('error', this.handleResourceError.bind(this), true);
        
        // 监听字体加载
        if (this.options.captureFonts && 'fonts' in document) {
            this.monitorFonts();
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 处理资源错误
    // ─────────────────────────────────────────────────────────────────────────────
    
    handleResourceError(event) {
        // 只处理元素错误，不处理 window 错误
        if (event.target === window) return;
        
        const target = event.target;
        const tagName = target.tagName?.toLowerCase();
        
        if (!tagName) return;
        
        // 根据标签类型决定是否捕获
        const shouldCapture = {
            'script': this.options.captureScripts,
            'link': this.options.captureStyles,
            'img': this.options.captureImages,
            'source': this.options.captureMedia,
            'video': this.options.captureMedia,
            'audio': this.options.captureMedia,
            'iframe': this.options.captureIframes
        };
        
        if (!shouldCapture[tagName]) return;
        
        // 获取资源 URL
        const src = this.getResourceUrl(target);
        if (!src) return;
        
        // 检查是否应该忽略
        if (this.shouldIgnore(src)) return;
        
        const resourceInfo = {
            type: 'resource',
            subType: this.getResourceType(tagName),
            tagName: tagName,
            src: src,
            id: target.id || undefined,
            className: target.className || undefined,
            outerHTML: target.outerHTML?.slice(0, 500),
            timestamp: Date.now(),
            // 添加更多上下文
            pageUrl: location.href,
            referrer: document.referrer
        };
        
        // 如果是 link 标签，判断是 CSS 还是其他
        if (tagName === 'link') {
            resourceInfo.rel = target.rel;
            resourceInfo.resourceType = target.rel;  // stylesheet, icon, preload 等
        }
        
        this.report(resourceInfo);
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 监听字体加载
    // ─────────────────────────────────────────────────────────────────────────────
    
    monitorFonts() {
        // 使用 FontFaceSet API 监听字体加载
        document.fonts.addEventListener('loadingerror', (event) => {
            event.fontfaces.forEach(fontFace => {
                const fontInfo = {
                    type: 'resource',
                    subType: 'font',
                    family: fontFace.family,
                    style: fontFace.style,
                    weight: fontFace.weight,
                    src: fontFace.src || fontFace._url,
                    timestamp: Date.now()
                };
                
                this.report(fontInfo);
            });
        });
        
        // 兼容：使用 document.fonts.ready
        document.fonts.ready.then(() => {
            // 检查加载失败的字体
            const failedFonts = [];
            document.fonts.forEach(fontFace => {
                if (fontFace.status === 'error') {
                    failedFonts.push({
                        family: fontFace.family,
                        style: fontFace.style,
                        weight: fontFace.weight
                    });
                }
            });
            
            if (failedFonts.length > 0) {
                this.report({
                    type: 'resource',
                    subType: 'font',
                    fonts: failedFonts,
                    timestamp: Date.now()
                });
            }
        });
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 辅助方法
    // ─────────────────────────────────────────────────────────────────────────────
    
    getResourceUrl(target) {
        // 根据标签类型获取 URL
        const tagName = target.tagName.toLowerCase();
        
        switch (tagName) {
            case 'script':
                return target.src;
            case 'link':
                return target.href;
            case 'img':
            case 'video':
            case 'audio':
            case 'iframe':
                return target.src || target.srcset;
            case 'source':
                return target.src || target.srcset;
            default:
                return target.src || target.href;
        }
    }
    
    getResourceType(tagName) {
        const typeMap = {
            'script': 'script',
            'link': 'stylesheet',
            'img': 'image',
            'source': 'media',
            'video': 'video',
            'audio': 'audio',
            'iframe': 'iframe'
        };
        return typeMap[tagName] || 'unknown';
    }
    
    shouldIgnore(url) {
        if (!url) return true;
        
        // 忽略 data URL
        if (url.startsWith('data:')) return true;
        
        // 忽略 blob URL
        if (url.startsWith('blob:')) return true;
        
        // 检查自定义忽略规则
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
    
    report(data) {
        if (this.reporter) {
            this.reporter.report(data);
        }
    }
    
    destroy() {
        window.removeEventListener('error', this.handleResourceError, true);
    }
}
```

---

## 5. Vue 错误捕获

### 5.1 Vue 2.x 错误处理

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// Vue 2.x 错误捕获
// ────────────────────────────────────────────────────────────────────────────────────

import Vue from 'vue';

// ────────────────────────────────────────────────────────────────────────────────────
// 1. 全局错误处理器
// ────────────────────────────────────────────────────────────────────────────────────

Vue.config.errorHandler = function(err, vm, info) {
    // err  - 错误对象
    // vm   - Vue 组件实例
    // info - Vue 特定的错误信息（如生命周期钩子名称）
    
    const errorInfo = {
        type: 'vue',
        subType: 'error',
        message: err.message,
        stack: err.stack,
        name: err.name,
        // 组件信息
        componentName: vm?.$options?.name || vm?.$options?._componentTag,
        componentPath: getComponentPath(vm),
        propsData: vm?.$options?.propsData,
        // Vue 特定信息
        lifecycle: info,
        info: info,
        timestamp: Date.now()
    };
    
    reportError(errorInfo);
    
    // 可以选择重新抛出错误
    // throw err;
};

// ────────────────────────────────────────────────────────────────────────────────────
// 2. 全局警告处理器（仅开发环境）
// ────────────────────────────────────────────────────────────────────────────────────

Vue.config.warnHandler = function(msg, vm, trace) {
    // msg   - 警告消息
    // vm    - Vue 组件实例
    // trace - 组件层级追踪
    
    const warningInfo = {
        type: 'vue',
        subType: 'warning',
        message: msg,
        trace: trace,
        componentName: vm?.$options?.name,
        timestamp: Date.now()
    };
    
    reportError(warningInfo);
};

// ────────────────────────────────────────────────────────────────────────────────────
// 3. 渲染函数错误捕获
// ────────────────────────────────────────────────────────────────────────────────────

// 在组件中捕获渲染错误
const ErrorComponent = {
    name: 'ErrorComponent',
    renderError(h, err) {
        return h('pre', { style: { color: 'red' } }, err.stack);
    },
    render(h) {
        // 如果这里抛出错误，会被 renderError 捕获
        throw new Error('Render Error');
    }
};

// ────────────────────────────────────────────────────────────────────────────────────
// 4. 获取组件路径
// ────────────────────────────────────────────────────────────────────────────────────

function getComponentPath(vm) {
    const path = [];
    let current = vm;
    
    while (current) {
        const name = current.$options?.name || current.$options?._componentTag || 'Anonymous';
        path.unshift(name);
        current = current.$parent;
    }
    
    return path.join(' > ');
}

// ────────────────────────────────────────────────────────────────────────────────────
// 5. 生命周期错误捕获
// ────────────────────────────────────────────────────────────────────────────────────

// 全局混入错误捕获
Vue.mixin({
    beforeCreate() {
        // 捕获 beforeCreate 错误
        try {
            // 组件初始化逻辑
        } catch (err) {
            reportError({
                type: 'vue',
                subType: 'lifecycle',
                lifecycle: 'beforeCreate',
                componentName: this.$options?.name,
                error: err.message,
                stack: err.stack
            });
        }
    },
    
    errorCaptured(err, vm, info) {
        // 组件内错误捕获
        // 返回 false 阻止错误继续传播
        reportError({
            type: 'vue',
            subType: 'errorCaptured',
            message: err.message,
            stack: err.stack,
            componentName: vm?.$options?.name,
            info
        });
        
        return false;  // 阻止错误继续向上传播
    }
});
```

### 5.2 Vue 3.x 错误处理

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// Vue 3.x 错误捕获
// ────────────────────────────────────────────────────────────────────────────────────

import { createApp } from 'vue';

const app = createApp(App);

// ────────────────────────────────────────────────────────────────────────────────────
// 1. 全局错误处理器
// ────────────────────────────────────────────────────────────────────────────────────

app.config.errorHandler = (err, instance, info) => {
    // err      - 错误对象
    // instance - 组件实例（可能为 null）
    // info     - 错误来源信息
    
    const errorInfo = {
        type: 'vue',
        subType: 'error',
        message: err.message,
        stack: err.stack,
        name: err.name,
        // 组件信息
        componentName: instance?.$options?.name || instance?.type?.name,
        componentFile: instance?.type?.__file,
        props: instance?.$props,
        // Vue 特定信息
        info: info,
        timestamp: Date.now()
    };
    
    reportError(errorInfo);
};

// ────────────────────────────────────────────────────────────────────────────────────
// 2. 全局警告处理器（仅开发环境）
// ────────────────────────────────────────────────────────────────────────────────────

app.config.warnHandler = (msg, instance, trace) => {
    const warningInfo = {
        type: 'vue',
        subType: 'warning',
        message: msg,
        trace: trace,
        componentName: instance?.$options?.name,
        timestamp: Date.now()
    };
    
    reportError(warningInfo);
};

// ────────────────────────────────────────────────────────────────────────────────────
// 3. 错误边界组件（Vue 3）
// ────────────────────────────────────────────────────────────────────────────────────

import { defineComponent, ref, onErrorCaptured } from 'vue';

const ErrorBoundary = defineComponent({
    name: 'ErrorBoundary',
    setup(props, { slots }) {
        const error = ref(null);
        const hasError = ref(false);
        
        onErrorCaptured((err, instance, info) => {
            // 捕获子组件错误
            hasError.value = true;
            error.value = err;
            
            // 上报错误
            reportError({
                type: 'vue',
                subType: 'errorCaptured',
                message: err.message,
                stack: err.stack,
                componentName: instance?.$options?.name,
                info
            });
            
            // 返回 false 阻止错误继续传播
            return false;
        });
        
        const reset = () => {
            hasError.value = false;
            error.value = null;
        };
        
        return () => {
            if (hasError.value) {
                return slots.fallback?.({ error: error.value, reset }) || 
                       h('div', { class: 'error-fallback' }, [
                           h('h2', '出错了'),
                           h('pre', error.value?.message),
                           h('button', { onClick: reset }, '重试')
                       ]);
            }
            
            return slots.default?.();
        };
    }
});

// 使用
// <ErrorBoundary>
//     <template #default>
//         <App />
//     </template>
//     <template #fallback="{ error, reset }">
//         <div>出错了: {{ error.message }}</div>
//         <button @click="reset">重试</button>
//     </template>
// </ErrorBoundary>
```

### 5.3 Vue 错误监控类

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// Vue 错误监控类
// ────────────────────────────────────────────────────────────────────────────────────

class VueErrorMonitor {
    constructor(options = {}) {
        this.options = {
            version: 2,  // Vue 版本
            captureWarnings: true,
            ...options
        };
        
        this.reporter = options.reporter;
        this.originalErrorHandler = null;
        this.originalWarnHandler = null;
    }
    
    install(Vue) {
        if (this.options.version === 2) {
            this.installVue2(Vue);
        } else {
            this.installVue3(Vue);
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // Vue 2.x 安装
    // ─────────────────────────────────────────────────────────────────────────────
    
    installVue2(Vue) {
        const self = this;
        
        // 保存原始处理器
        this.originalErrorHandler = Vue.config.errorHandler;
        this.originalWarnHandler = Vue.config.warnHandler;
        
        // 设置错误处理器
        Vue.config.errorHandler = function(err, vm, info) {
            self.handleError(err, vm, info);
            
            // 调用原始处理器
            if (self.originalErrorHandler) {
                return self.originalErrorHandler.call(this, err, vm, info);
            }
        };
        
        // 设置警告处理器
        if (this.options.captureWarnings) {
            Vue.config.warnHandler = function(msg, vm, trace) {
                self.handleWarning(msg, vm, trace);
                
                // 调用原始处理器
                if (self.originalWarnHandler) {
                    return self.originalWarnHandler.call(this, msg, vm, trace);
                }
            };
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // Vue 3.x 安装
    // ─────────────────────────────────────────────────────────────────────────────
    
    installVue3(app) {
        const self = this;
        
        // 保存原始处理器
        this.originalErrorHandler = app.config.errorHandler;
        this.originalWarnHandler = app.config.warnHandler;
        
        // 设置错误处理器
        app.config.errorHandler = (err, instance, info) => {
            self.handleError(err, instance, info);
            
            // 调用原始处理器
            if (self.originalErrorHandler) {
                return self.originalErrorHandler(err, instance, info);
            }
        };
        
        // 设置警告处理器
        if (this.options.captureWarnings) {
            app.config.warnHandler = (msg, instance, trace) => {
                self.handleWarning(msg, instance, trace);
                
                // 调用原始处理器
                if (self.originalWarnHandler) {
                    return self.originalWarnHandler(msg, instance, trace);
                }
            };
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 错误处理
    // ─────────────────────────────────────────────────────────────────────────────
    
    handleError(err, instance, info) {
        const errorInfo = {
            type: 'vue',
            subType: 'error',
            message: err.message,
            stack: err.stack,
            name: err.name,
            info: info,
            timestamp: Date.now()
        };
        
        // 提取组件信息
        if (instance) {
            const options = instance.$options || instance.type || {};
            errorInfo.componentName = options.name;
            errorInfo.componentFile = options.__file;
            
            // 组件路径
            errorInfo.componentPath = this.getComponentPath(instance);
        }
        
        // 解析错误来源
        errorInfo.source = this.parseErrorSource(info);
        
        this.report(errorInfo);
    }
    
    handleWarning(msg, instance, trace) {
        const warningInfo = {
            type: 'vue',
            subType: 'warning',
            message: msg,
            trace: trace,
            timestamp: Date.now()
        };
        
        if (instance) {
            const options = instance.$options || instance.type || {};
            warningInfo.componentName = options.name;
        }
        
        this.report(warningInfo);
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 辅助方法
    // ─────────────────────────────────────────────────────────────────────────────
    
    getComponentPath(instance) {
        const path = [];
        let current = instance;
        
        while (current) {
            const options = current.$options || current.type || {};
            const name = options.name || 'Anonymous';
            path.unshift(name);
            current = current.$parent || current.parent;
        }
        
        return path.join(' > ');
    }
    
    parseErrorSource(info) {
        // Vue 错误信息格式：
        // - "at <ComponentName>"
        // - "in setup"
        // - "in render"
        // - "lifecycle hook onMounted"
        
        const sourceMap = {
            'setup': 'setup',
            'render': 'render',
            'onMounted': 'lifecycle',
            'onUpdated': 'lifecycle',
            'onUnmounted': 'lifecycle',
            'onBeforeMount': 'lifecycle',
            'onBeforeUpdate': 'lifecycle',
            'onBeforeUnmount': 'lifecycle',
            'watcher': 'watcher',
            'event handler': 'event',
            'v-on handler': 'event',
            'ref': 'ref'
        };
        
        for (const [key, value] of Object.entries(sourceMap)) {
            if (info?.includes(key)) {
                return value;
            }
        }
        
        return 'unknown';
    }
    
    report(data) {
        if (this.reporter) {
            this.reporter.report(data);
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 卸载
    // ─────────────────────────────────────────────────────────────────────────────
    
    uninstall(Vue) {
        if (this.options.version === 2) {
            Vue.config.errorHandler = this.originalErrorHandler;
            Vue.config.warnHandler = this.originalWarnHandler;
        }
    }
}
```

---

## 6. React 错误捕获

### 6.1 Error Boundary

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// React Error Boundary
// ────────────────────────────────────────────────────────────────────────────────────

import { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Error Boundary 可以捕获以下错误：
 * 1. 子组件渲染期间的错误
 * 2. 生命周期方法中的错误
 * 3. 子组件构造函数中的错误
 * 
 * Error Boundary 不能捕获以下错误：
 * 1. 事件处理器中的错误
 * 2. 异步代码中的错误（如 setTimeout）
 * 3. 服务端渲染中的错误
 * 4. Error Boundary 自身的错误
 */

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }
    
    // 从错误中派生状态
    static getDerivedStateFromError(error) {
        // 更新 state，下次渲染时显示降级 UI
        return { hasError: true, error };
    }
    
    // 捕获错误信息
    componentDidCatch(error, errorInfo) {
        // error      - 抛出的错误
        // errorInfo  - 组件调用栈信息
        
        const errorData = {
            type: 'react',
            subType: 'errorBoundary',
            message: error.message,
            stack: error.stack,
            name: error.name,
            // React 特有的组件调用栈
            componentStack: errorInfo.componentStack,
            timestamp: Date.now()
        };
        
        // 解析组件栈
        errorData.parsedComponentStack = this.parseComponentStack(errorInfo.componentStack);
        
        // 上报错误
        reportError(errorData);
        
        // 更新状态
        this.setState({ errorInfo });
        
        // 调用自定义错误处理器
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }
    
    // 解析组件栈
    parseComponentStack(componentStack) {
        if (!componentStack) return [];
        
        const lines = componentStack.split('\n');
        const result = [];
        
        // React 组件栈格式：
        //     at ComponentName
        //     at ComponentName (file.js:line:col)
        const regex = /^\s*at\s+(.+?)(?:\s+\((.+?):(\d+):(\d+)\))?$/;
        
        for (const line of lines) {
            const match = line.match(regex);
            if (match) {
                result.push({
                    componentName: match[1],
                    file: match[2] || null,
                    line: match[3] ? parseInt(match[3], 10) : null,
                    column: match[4] ? parseInt(match[4], 10) : null,
                    raw: line.trim()
                });
            }
        }
        
        return result;
    }
    
    // 重置错误状态
    resetError = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
        
        if (this.props.onReset) {
            this.props.onReset();
        }
    };
    
    render() {
        if (this.state.hasError) {
            // 渲染降级 UI
            if (this.props.fallback) {
                if (typeof this.props.fallback === 'function') {
                    return this.props.fallback({
                        error: this.state.error,
                        errorInfo: this.state.errorInfo,
                        reset: this.resetError
                    });
                }
                return this.props.fallback;
            }
            
            // 默认降级 UI
            return (
                <div className="error-boundary">
                    <h2>出错了</h2>
                    <p>{this.state.error?.message}</p>
                    <button onClick={this.resetError}>重试</button>
                </div>
            );
        }
        
        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node,
    fallback: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    onError: PropTypes.func,
    onReset: PropTypes.func
};

// ────────────────────────────────────────────────────────────────────────────────────
// 使用示例
// ────────────────────────────────────────────────────────────────────────────────────

// 基本使用
<ErrorBoundary>
    <App />
</ErrorBoundary>

// 自定义降级 UI
<ErrorBoundary 
    fallback={<div>出错了，请刷新页面</div>}
    onError={(error, errorInfo) => {
        console.error('Error caught:', error);
    }}
>
    <App />
</ErrorBoundary>

// 函数式降级 UI
<ErrorBoundary 
    fallback={({ error, reset }) => (
        <div>
            <p>出错了: {error.message}</p>
            <button onClick={reset}>重试</button>
        </div>
    )}
>
    <App />
</ErrorBoundary>

// 包裹路由
<ErrorBoundary>
    <Router>
        <Routes />
    </Router>
</ErrorBoundary>

// 包裹特定组件
<ErrorBoundary fallback={<WidgetFallback />}>
    <ComplexWidget />
</ErrorBoundary>
```

### 6.2 React 错误监控类

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// React 错误监控类
// ────────────────────────────────────────────────────────────────────────────────────

import { Component } from 'react';

class ReactErrorMonitor {
    constructor(options = {}) {
        this.options = {
            captureConsoleErrors: true,
            captureEventErrors: true,
            ...options
        };
        
        this.reporter = options.reporter;
        this.init();
    }
    
    init() {
        // 拦截 console.error
        if (this.options.captureConsoleErrors) {
            this.interceptConsoleError();
        }
        
        // 设置全局错误处理器
        window.__REACT_ERROR_HANDLER__ = this.handleReactError.bind(this);
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 处理 React 错误
    // ─────────────────────────────────────────────────────────────────────────────
    
    handleReactError(error, errorInfo) {
        const errorData = {
            type: 'react',
            subType: 'errorBoundary',
            message: error.message,
            stack: error.stack,
            name: error.name,
            componentStack: errorInfo?.componentStack,
            timestamp: Date.now()
        };
        
        // 解析组件栈
        if (errorData.componentStack) {
            errorData.parsedComponentStack = this.parseComponentStack(errorData.componentStack);
            // 提取最顶层出错的组件
            errorData.errorComponent = errorData.parsedComponentStack[0]?.componentName;
        }
        
        this.report(errorData);
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 拦截 console.error
    // ─────────────────────────────────────────────────────────────────────────────
    
    interceptConsoleError() {
        const originalError = console.error;
        const self = this;
        
        console.error = function(...args) {
            // React 在开发模式下会打印很多警告
            // 我们只关心真正的错误
            
            const message = args.map(arg => {
                if (arg instanceof Error) {
                    return `${arg.name}: ${arg.message}`;
                }
                return String(arg);
            }).join(' ');
            
            // 过滤掉 React 的开发警告
            if (self.isReactWarning(message)) {
                return originalError.apply(console, args);
            }
            
            // 上报错误
            self.report({
                type: 'react',
                subType: 'console',
                message: message,
                timestamp: Date.now()
            });
            
            return originalError.apply(console, args);
        };
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 判断是否是 React 警告
    // ─────────────────────────────────────────────────────────────────────────────
    
    isReactWarning(message) {
        const warningPatterns = [
            'Warning:',
            'Each child in a list should have a unique "key" prop',
            'Warning: Each child in a list',
            'Warning: Failed prop type',
            'Warning: Invalid DOM property',
            'Warning: Unknown event handler property',
            'Warning: Received NaN for the',
            'Warning: Cannot update a component',
            'Warning: Cannot update during an existing state transition',
            'Warning: You provided a `value` prop to a form field',
            'Warning: You provided a `checked` prop to a form field'
        ];
        
        return warningPatterns.some(pattern => message.includes(pattern));
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 解析组件栈
    // ─────────────────────────────────────────────────────────────────────────────
    
    parseComponentStack(componentStack) {
        if (!componentStack) return [];
        
        const lines = componentStack.split('\n');
        const result = [];
        
        const regex = /^\s*at\s+(.+?)(?:\s+\((.+?):(\d+):(\d+)\))?$/;
        
        for (const line of lines) {
            const match = line.match(regex);
            if (match) {
                result.push({
                    componentName: match[1],
                    file: match[2] || null,
                    line: match[3] ? parseInt(match[3], 10) : null,
                    column: match[4] ? parseInt(match[4], 10) : null
                });
            }
        }
        
        return result;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 事件处理器错误捕获
    // ─────────────────────────────────────────────────────────────────────────────
    
    wrapEventHandler(handler, componentName, eventName) {
        const self = this;
        
        return function(...args) {
            try {
                return handler.apply(this, args);
            } catch (error) {
                self.report({
                    type: 'react',
                    subType: 'event',
                    message: error.message,
                    stack: error.stack,
                    componentName: componentName,
                    eventName: eventName,
                    timestamp: Date.now()
                });
                throw error;
            }
        };
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 上报
    // ─────────────────────────────────────────────────────────────────────────────
    
    report(data) {
        if (this.reporter) {
            this.reporter.report(data);
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 创建 Error Boundary
    // ─────────────────────────────────────────────────────────────────────────────
    
    createErrorBoundary(options = {}) {
        const self = this;
        
        return class extends Component {
            state = { hasError: false, error: null, errorInfo: null };
            
            static getDerivedStateFromError(error) {
                return { hasError: true, error };
            }
            
            componentDidCatch(error, errorInfo) {
                self.handleReactError(error, errorInfo);
                this.setState({ error, errorInfo });
            }
            
            render() {
                if (this.state.hasError) {
                    return options.fallback || <h1>出错了</h1>;
                }
                return this.props.children;
            }
        };
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 销毁
    // ─────────────────────────────────────────────────────────────────────────────
    
    destroy() {
        delete window.__REACT_ERROR_HANDLER__;
    }
}
```

---

## 7. 网络请求错误捕获

### 7.1 XHR 劫持

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// XHR 错误捕获
// ────────────────────────────────────────────────────────────────────────────────────

class XHRErrorMonitor {
    constructor(options = {}) {
        this.options = {
            captureErrors: true,
            captureTimeouts: true,
            captureAborts: true,
            slowThreshold: 3000,      // 慢请求阈值
            ignoreUrls: [],
            ...options
        };
        
        this.reporter = options.reporter;
        this.originalOpen = null;
        this.originalSend = null;
        
        this.init();
    }
    
    init() {
        this.originalOpen = XMLHttpRequest.prototype.open;
        this.originalSend = XMLHttpRequest.prototype.send;
        this.originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
        
        const self = this;
        
        // ─────────────────────────────────────────────────────────────────────────
        // 劫持 open 方法
        // ─────────────────────────────────────────────────────────────────────────
        
        XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            // 保存请求信息
            this._monitorInfo = {
                id: self.generateId(),
                method: method.toUpperCase(),
                url: typeof url === 'string' ? url : url.toString(),
                async: async !== false,
                startTime: 0,
                headers: {}
            };
            
            return self.originalOpen.apply(this, arguments);
        };
        
        // ─────────────────────────────────────────────────────────────────────────
        // 劫持 setRequestHeader 方法
        // ─────────────────────────────────────────────────────────────────────────
        
        XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
            if (this._monitorInfo) {
                this._monitorInfo.headers[header] = value;
            }
            return self.originalSetRequestHeader.apply(this, arguments);
        };
        
        // ─────────────────────────────────────────────────────────────────────────
        // 劫持 send 方法
        // ─────────────────────────────────────────────────────────────────────────
        
        XMLHttpRequest.prototype.send = function(body) {
            if (!this._monitorInfo) {
                return self.originalSend.apply(this, arguments);
            }
            
            const monitorInfo = this._monitorInfo;
            monitorInfo.startTime = Date.now();
            
            // 记录请求体大小
            if (body) {
                monitorInfo.requestSize = typeof body === 'string' 
                    ? body.length 
                    : body.size || 0;
            }
            
            // ─────────────────────────────────────────────────────────────────────
            // 监听各种事件
            // ─────────────────────────────────────────────────────────────────────
            
            // 请求完成
            this.addEventListener('load', function() {
                const duration = Date.now() - monitorInfo.startTime;
                const isError = this.status >= 400;
                const isSlow = duration > self.options.slowThreshold;
                
                if (isError || isSlow) {
                    self.report({
                        type: 'xhr',
                        subType: isError ? 'error' : 'slow',
                        id: monitorInfo.id,
                        method: monitorInfo.method,
                        url: monitorInfo.url,
                        status: this.status,
                        statusText: this.statusText,
                        duration: duration,
                        responseSize: this.responseText?.length,
                        requestSize: monitorInfo.requestSize,
                        isSlow: isSlow,
                        isError: isError
                    });
                }
            });
            
            // 请求错误
            this.addEventListener('error', function() {
                if (self.options.captureErrors) {
                    self.report({
                        type: 'xhr',
                        subType: 'network-error',
                        id: monitorInfo.id,
                        method: monitorInfo.method,
                        url: monitorInfo.url,
                        duration: Date.now() - monitorInfo.startTime
                    });
                }
            });
            
            // 请求超时
            this.addEventListener('timeout', function() {
                if (self.options.captureTimeouts) {
                    self.report({
                        type: 'xhr',
                        subType: 'timeout',
                        id: monitorInfo.id,
                        method: monitorInfo.method,
                        url: monitorInfo.url,
                        timeout: this.timeout,
                        duration: Date.now() - monitorInfo.startTime
                    });
                }
            });
            
            // 请求中止
            this.addEventListener('abort', function() {
                if (self.options.captureAborts) {
                    self.report({
                        type: 'xhr',
                        subType: 'abort',
                        id: monitorInfo.id,
                        method: monitorInfo.method,
                        url: monitorInfo.url,
                        duration: Date.now() - monitorInfo.startTime
                    });
                }
            });
            
            return self.originalSend.apply(this, arguments);
        };
    }
    
    generateId() {
        return `xhr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    shouldIgnore(url) {
        for (const pattern of this.options.ignoreUrls) {
            if (typeof pattern === 'string' && url.includes(pattern)) return true;
            if (pattern instanceof RegExp && pattern.test(url)) return true;
        }
        return false;
    }
    
    report(data) {
        if (!this.shouldIgnore(data.url) && this.reporter) {
            this.reporter.report(data);
        }
    }
    
    destroy() {
        XMLHttpRequest.prototype.open = this.originalOpen;
        XMLHttpRequest.prototype.send = this.originalSend;
        XMLHttpRequest.prototype.setRequestHeader = this.originalSetRequestHeader;
    }
}
```

### 7.2 Fetch 劫持

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// Fetch 错误捕获
// ────────────────────────────────────────────────────────────────────────────────────

class FetchErrorMonitor {
    constructor(options = {}) {
        this.options = {
            captureErrors: true,
            slowThreshold: 3000,
            ignoreUrls: [],
            ...options
        };
        
        this.reporter = options.reporter;
        this.originalFetch = null;
        
        this.init();
    }
    
    init() {
        if (typeof window.fetch !== 'function') return;
        
        this.originalFetch = window.fetch;
        const self = this;
        
        window.fetch = function(url, options = {}) {
            const startTime = Date.now();
            const requestId = self.generateId();
            
            // 解析 URL
            const urlString = typeof url === 'string' 
                ? url 
                : url instanceof Request 
                    ? url.url 
                    : url.toString();
            
            const method = (options.method || 'GET').toUpperCase();
            
            // 检查是否应该忽略
            if (self.shouldIgnore(urlString)) {
                return self.originalFetch.apply(this, arguments);
            }
            
            // 发起请求
            return self.originalFetch.apply(this, arguments)
                .then(async response => {
                    const duration = Date.now() - startTime;
                    
                    // 克隆响应以便读取
                    const clonedResponse = response.clone();
                    
                    // 获取响应体大小
                    let responseSize = 0;
                    try {
                        const blob = await clonedResponse.blob();
                        responseSize = blob.size;
                    } catch (e) {}
                    
                    // 判断是否是错误或慢请求
                    const isError = !response.ok;
                    const isSlow = duration > self.options.slowThreshold;
                    
                    if (isError || isSlow) {
                        self.report({
                            type: 'fetch',
                            subType: isError ? 'error' : 'slow',
                            id: requestId,
                            method: method,
                            url: urlString,
                            status: response.status,
                            statusText: response.statusText,
                            duration: duration,
                            responseSize: responseSize,
                            isSlow: isSlow,
                            isError: isError
                        });
                    }
                    
                    return response;
                })
                .catch(error => {
                    // 网络错误
                    self.report({
                        type: 'fetch',
                        subType: 'network-error',
                        id: requestId,
                        method: method,
                        url: urlString,
                        message: error.message,
                        name: error.name,
                        duration: Date.now() - startTime
                    });
                    
                    throw error;
                });
        };
    }
    
    generateId() {
        return `fetch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    shouldIgnore(url) {
        for (const pattern of this.options.ignoreUrls) {
            if (typeof pattern === 'string' && url.includes(pattern)) return true;
            if (pattern instanceof RegExp && pattern.test(url)) return true;
        }
        return false;
    }
    
    report(data) {
        if (this.reporter) {
            this.reporter.report(data);
        }
    }
    
    destroy() {
        if (this.originalFetch) {
            window.fetch = this.originalFetch;
        }
    }
}
```

---

## 8. 完整错误监控类

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 完整错误监控类
// ────────────────────────────────────────────────────────────────────────────────────

class ErrorMonitor {
    constructor(options = {}) {
        this.options = {
            // 开关配置
            captureJS: true,
            capturePromise: true,
            captureResource: true,
            captureConsole: true,
            captureVue: false,
            captureReact: false,
            captureXHR: true,
            captureFetch: true,
            // 忽略配置
            ignoreErrors: [
                'Script error',
                'Network Error',
                'ResizeObserver loop limit exceeded'
            ],
            ignoreUrls: [],
            // 其他配置
            ...options
        };
        
        this.reporter = options.reporter;
        this.monitors = {};
        
        this.init();
    }
    
    init() {
        if (this.options.captureJS) {
            this.monitors.js = new JSErrorMonitor({
                reporter: this.reporter,
                ignoreErrors: this.options.ignoreErrors,
                ignoreUrls: this.options.ignoreUrls
            });
        }
        
        if (this.options.capturePromise) {
            this.monitors.promise = new PromiseErrorMonitor({
                reporter: this.reporter,
                ignorePatterns: this.options.ignoreErrors
            });
        }
        
        if (this.options.captureResource) {
            this.monitors.resource = new ResourceErrorMonitor({
                reporter: this.reporter,
                ignoreUrls: this.options.ignoreUrls
            });
        }
        
        if (this.options.captureXHR) {
            this.monitors.xhr = new XHRErrorMonitor({
                reporter: this.reporter,
                ignoreUrls: this.options.ignoreUrls
            });
        }
        
        if (this.options.captureFetch) {
            this.monitors.fetch = new FetchErrorMonitor({
                reporter: this.reporter,
                ignoreUrls: this.options.ignoreUrls
            });
        }
    }
    
    // 安装 Vue 监控
    installVue(Vue, version = 2) {
        if (!this.monitors.vue) {
            this.monitors.vue = new VueErrorMonitor({
                reporter: this.reporter,
                version: version
            });
        }
        this.monitors.vue.install(Vue);
    }
    
    // 安装 React 监控
    installReact() {
        if (!this.monitors.react) {
            this.monitors.react = new ReactErrorMonitor({
                reporter: this.reporter
            });
        }
        return this.monitors.react.createErrorBoundary();
    }
    
    // 手动上报错误
    captureError(error, context = {}) {
        this.reporter.report({
            type: 'manual',
            subType: 'error',
            message: error.message,
            stack: error.stack,
            ...context
        });
    }
    
    // 销毁
    destroy() {
        Object.values(this.monitors).forEach(monitor => {
            if (monitor.destroy) {
                monitor.destroy();
            }
        });
        this.monitors = {};
    }
}

export default ErrorMonitor;
```

---

## 最佳实践

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  错误监控最佳实践                                                                      │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  捕获策略                                                                              │
│  □ 使用捕获阶段监听 error 事件                                                        │
│  □ 设置 crossorigin 属性以获取跨域脚本详细错误                                        │
│  □ 处理各种错误类型（JS、Promise、资源、网络）                                        │
│  □ 为 Vue/React 应用配置专门的错误处理器                                              │
│                                                                                       │
│  错误过滤                                                                              │
│  □ 过滤无意义的错误（如 Script error）                                               │
│  □ 设置采样率避免数据过多                                                             │
│  □ 忽略已知第三方脚本错误                                                             │
│                                                                                       │
│  错误处理                                                                              │
│  □ 提供友好的错误页面                                                                │
│  □ 允许用户从错误中恢复                                                               │
│  □ 区分开发和生产环境的处理方式                                                       │
│                                                                                       │
│  错误上报                                                                              │
│  □ 收集完整的错误上下文                                                               │
│  □ 使用 SourceMap 还原压缩代码                                                        │
│  □ 建立告警机制                                                                       │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

[返回上级目录](../index.md)
