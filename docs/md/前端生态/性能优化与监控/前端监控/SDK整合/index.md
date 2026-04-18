# SDK 整合

> SDK 整合将所有监控模块统一管理，提供完整的初始化配置、数据上报和生命周期管理。

## 学习要点

- 🏗️ 掌握 SDK 架构设计
- ⚙️ 学会配置管理
- 📤 理解数据上报机制
- 🔄 掌握生命周期管理

---

## 1. SDK 架构设计

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  Monitor SDK 架构                                                                      │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│   ┌─────────────────────────────────────────────────────────────────────────────┐   │
│   │                           MonitorSDK                                        │   │
│   │  ┌─────────────────────────────────────────────────────────────────────┐  │   │
│   │  │                        配置管理                                      │  │   │
│   │  │  • 初始化配置  • 动态配置  • 预设规则                               │  │   │
│   │  └─────────────────────────────────────────────────────────────────────┘  │   │
│   │  ┌─────────────────────────────────────────────────────────────────────┐  │   │
│   │  │                        核心模块                                      │  │   │
│   │  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐          │  │   │
│   │  │  │ErrorMonitor│ │PerfMonitor│ │BehavMonitor│ │ReqMonitor │          │  │   │
│   │  │  └─────┬─────┘ └─────┬─────┘ └─────┬─────┘ └─────┬─────┘          │  │   │
│   │  │        └──────────────┴──────────────┴──────────────┘               │  │   │
│   │  └─────────────────────────────────────────────────────────────────────┘  │   │
│   │  ┌─────────────────────────────────────────────────────────────────────┐  │   │
│   │  │                        公共服务                                      │  │   │
│   │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐             │  │   │
│   │  │  │ Sampler  │ │Sanitizer │ │  Cache   │ │ Reporter │             │  │   │
│   │  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘             │  │   │
│   │  └─────────────────────────────────────────────────────────────────────┘  │   │
│   └─────────────────────────────────────────────────────────────────────────────┘   │
│                                       │                                               │
│                                       ▼                                               │
│                        ┌─────────────────────────┐                                   │
│                        │      上报端点           │                                   │
│                        │  • Beacon API          │                                   │
│                        │  • XMLHttpRequest      │                                   │
│                        │  • Fetch API           │                                   │
│                        └─────────────────────────┘                                   │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. 完整 SDK 实现

### 2.1 SDK 核心类

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// Monitor SDK 核心类
// ────────────────────────────────────────────────────────────────────────────────────

import ErrorMonitor from '../错误监控';
import PerformanceMonitor from '../性能监控';
import BehaviorMonitor from '../用户行为监控';
import RequestMonitor from '../请求监控';
import CacheManager from '../数据缓存';
import SamplingController from '../采样控制';
import DataSanitizer from '../数据脱敏';

class MonitorSDK {
    // 静态实例
    static instance = null;
    
    // 版本
    static version = '1.0.0';
    
    /**
     * 获取单例实例
     */
    static getInstance(options = {}) {
        if (!MonitorSDK.instance) {
            MonitorSDK.instance = new MonitorSDK(options);
        }
        return MonitorSDK.instance;
    }
    
    constructor(options = {}) {
        // 防止重复初始化
        if (MonitorSDK.instance) {
            console.warn('MonitorSDK already initialized');
            return MonitorSDK.instance;
        }
        
        // 默认配置
        this.defaultOptions = {
            // 基础配置
            appId: '',              // 应用 ID
            env: 'production',      // 环境
            version: '',            // 版本号
            
            // 上报配置
            endpoint: '',           // 上报地址
            reportInterval: 5000,   // 上报间隔
            batchSize: 10,          // 批量上报数量
            
            // 开关配置
            enableError: true,      // 启用错误监控
            enablePerformance: true,// 启用性能监控
            enableBehavior: true,   // 启用行为监控
            enableRequest: true,    // 启用请求监控
            
            // 采样配置
            sampling: {
                global: 1,
                byType: {
                    error: 1,
                    performance: 0.1,
                    behavior: 0.05,
                    request: 0.1
                }
            },
            
            // 脱敏配置
            sanitization: {
                enabled: true,
                sensitiveFields: [
                    'password', 'token', 'secret', 'apiKey'
                ]
            },
            
            // 缓存配置
            cache: {
                enabled: true,
                maxSize: 500,
                maxAge: 24 * 60 * 60 * 1000
            },
            
            // 其他配置
            debug: false,           // 调试模式
            silent: false           // 静默模式（不打印日志）
        };
        
        // 合并配置
        this.options = { ...this.defaultOptions, ...options };
        
        // 状态
        this.initialized = false;
        this.destroyed = false;
        
        // 模块实例
        this.modules = {};
        
        // 公共服务
        this.sampler = null;
        this.sanitizer = null;
        this.cache = null;
        
        // 初始化
        this.init();
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 初始化
    // ─────────────────────────────────────────────────────────────────────────────
    
    init() {
        if (this.initialized) return;
        
        this.log('Initializing MonitorSDK...', this.options);
        
        // 初始化公共服务
        this.initServices();
        
        // 初始化监控模块
        this.initModules();
        
        // 初始化上报器
        this.initReporter();
        
        // 初始化生命周期
        this.initLifecycle();
        
        this.initialized = true;
        
        this.log('MonitorSDK initialized successfully');
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 初始化公共服务
    // ─────────────────────────────────────────────────────────────────────────────
    
    initServices() {
        // 采样控制器
        this.sampler = new SamplingController({
            global: this.options.sampling.global,
            byType: this.options.sampling.byType,
            byEnvironment: {
                development: this.options.debug ? 1 : 0,
                staging: 0.5,
                production: 1
            },
            environment: this.options.env
        });
        
        // 数据脱敏
        this.sanitizer = this.options.sanitization.enabled 
            ? new DataSanitizer(this.options.sanitization)
            : null;
        
        // 缓存管理
        this.cache = this.options.cache.enabled
            ? new CacheManager({
                ...this.options.cache,
                reporter: this
            })
            : null;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 初始化监控模块
    // ─────────────────────────────────────────────────────────────────────────────
    
    initModules() {
        const reporter = {
            report: (data) => this.report(data)
        };
        
        // 错误监控
        if (this.options.enableError) {
            this.modules.error = new ErrorMonitor({
                reporter: reporter,
                captureJS: true,
                capturePromise: true,
                captureResource: true,
                captureXHR: false,  // 由 RequestMonitor 处理
                captureFetch: false
            });
        }
        
        // 性能监控
        if (this.options.enablePerformance) {
            this.modules.performance = new PerformanceMonitor({
                reporter: reporter,
                capturePageLoad: true,
                captureWebVitals: true,
                captureResources: true,
                captureLongTasks: true
            });
        }
        
        // 行为监控
        if (this.options.enableBehavior) {
            this.modules.behavior = new BehaviorMonitor({
                reporter: reporter,
                capturePV: true,
                captureUV: true,
                captureClick: true,
                captureScroll: true,
                captureStayTime: true
            });
        }
        
        // 请求监控
        if (this.options.enableRequest) {
            this.modules.request = new RequestMonitor({
                reporter: reporter,
                captureXHR: true,
                captureFetch: true,
                ignoreUrls: [
                    this.options.endpoint  // 忽略上报请求
                ]
            });
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 初始化上报器
    // ─────────────────────────────────────────────────────────────────────────────
    
    initReporter() {
        this.reportQueue = [];
        this.reportTimer = null;
        
        // 启动定时上报
        this.startReportTimer();
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 初始化生命周期
    // ─────────────────────────────────────────────────────────────────────────────
    
    initLifecycle() {
        // 页面隐藏时上报
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.flush();
            }
        });
        
        // 页面卸载时上报
        window.addEventListener('pagehide', () => {
            this.flush();
        });
        
        // 网络恢复时刷新缓存
        window.addEventListener('online', () => {
            if (this.cache) {
                this.cache.flush();
            }
        });
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 数据上报
    // ─────────────────────────────────────────────────────────────────────────────
    
    report(data) {
        if (this.destroyed) return;
        
        // 采样检查
        if (!this.sampler.shouldSample(data.type)) {
            return;
        }
        
        // 数据脱敏
        const sanitizedData = this.sanitizer 
            ? this.sanitizer.sanitize(data)
            : data;
        
        // 添加公共信息
        const reportData = this.addCommonInfo(sanitizedData);
        
        this.log('Report data:', reportData);
        
        // 添加到队列
        this.reportQueue.push(reportData);
        
        // 检查是否需要立即上报
        if (this.reportQueue.length >= this.options.batchSize) {
            this.flush();
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 添加公共信息
    // ─────────────────────────────────────────────────────────────────────────────
    
    addCommonInfo(data) {
        return {
            ...data,
            // 应用信息
            appId: this.options.appId,
            appVersion: this.options.version,
            env: this.options.env,
            sdkVersion: MonitorSDK.version,
            
            // 用户信息
            userId: this.getUserId(),
            sessionId: this.getSessionId(),
            
            // 设备信息
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screenWidth: screen.width,
            screenHeight: screen.height,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            
            // 页面信息
            url: location.href,
            path: location.pathname,
            referrer: document.referrer,
            title: document.title,
            
            // 时间
            timestamp: Date.now()
        };
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 刷新队列（发送数据）
    // ─────────────────────────────────────────────────────────────────────────────
    
    async flush() {
        if (this.reportQueue.length === 0) return;
        
        const data = this.reportQueue.splice(0, this.options.batchSize);
        
        try {
            await this.send(data);
        } catch (error) {
            // 发送失败，放回队列
            this.reportQueue.unshift(...data);
            
            // 尝试缓存
            if (this.cache) {
                data.forEach(item => this.cache.add(item));
            }
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 发送数据
    // ─────────────────────────────────────────────────────────────────────────────
    
    async send(data) {
        if (!this.options.endpoint) {
            this.log('No endpoint configured');
            return;
        }
        
        const payload = JSON.stringify({
            data: data,
            meta: {
                appId: this.options.appId,
                timestamp: Date.now()
            }
        });
        
        // 优先使用 Beacon API
        if (navigator.sendBeacon) {
            const sent = navigator.sendBeacon(
                this.options.endpoint,
                new Blob([payload], { type: 'application/json' })
            );
            
            if (sent) {
                this.log('Data sent via Beacon');
                return;
            }
        }
        
        // 降级使用 Fetch
        try {
            await fetch(this.options.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: payload,
                keepalive: true
            });
            
            this.log('Data sent via Fetch');
        } catch (error) {
            // 降级使用 XHR
            await this.sendViaXHR(payload);
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 使用 XHR 发送
    // ─────────────────────────────────────────────────────────────────────────────
    
    sendViaXHR(payload) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            
            xhr.open('POST', this.options.endpoint, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve();
                } else {
                    reject(new Error(`HTTP ${xhr.status}`));
                }
            };
            
            xhr.onerror = () => reject(new Error('Network error'));
            xhr.ontimeout = () => reject(new Error('Timeout'));
            
            xhr.send(payload);
        });
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 定时上报
    // ─────────────────────────────────────────────────────────────────────────────
    
    startReportTimer() {
        if (this.reportTimer) {
            clearInterval(this.reportTimer);
        }
        
        this.reportTimer = setInterval(() => {
            this.flush();
        }, this.options.reportInterval);
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 手动上报
    // ─────────────────────────────────────────────────────────────────────────────
    
    capture(data) {
        this.report({
            type: 'manual',
            ...data
        });
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 捕获错误
    // ─────────────────────────────────────────────────────────────────────────────
    
    captureError(error, context = {}) {
        if (this.modules.error) {
            this.modules.error.captureError(error, context);
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 捕获性能指标
    // ─────────────────────────────────────────────────────────────────────────────
    
    capturePerformance(data) {
        this.report({
            type: 'performance',
            subType: 'manual',
            ...data
        });
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 捕获用户行为
    // ─────────────────────────────────────────────────────────────────────────────
    
    captureBehavior(action, data = {}) {
        this.report({
            type: 'behavior',
            subType: 'manual',
            action: action,
            ...data
        });
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 设置用户信息
    // ─────────────────────────────────────────────────────────────────────────────
    
    setUser(user) {
        this.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            ...user
        };
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 设置自定义标签
    // ─────────────────────────────────────────────────────────────────────────────
    
    setTags(tags) {
        this.tags = { ...this.tags, ...tags };
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 获取用户 ID
    // ─────────────────────────────────────────────────────────────────────────────
    
    getUserId() {
        if (this.user?.id) {
            return this.user.id;
        }
        
        let userId = localStorage.getItem('_monitor_uid');
        if (!userId) {
            userId = this.generateId();
            localStorage.setItem('_monitor_uid', userId);
        }
        return userId;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 获取会话 ID
    // ─────────────────────────────────────────────────────────────────────────────
    
    getSessionId() {
        let sessionId = sessionStorage.getItem('_monitor_sid');
        if (!sessionId) {
            sessionId = this.generateId();
            sessionStorage.setItem('_monitor_sid', sessionId);
        }
        return sessionId;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 生成 ID
    // ─────────────────────────────────────────────────────────────────────────────
    
    generateId() {
        return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 日志
    // ─────────────────────────────────────────────────────────────────────────────
    
    log(...args) {
        if (this.options.debug && !this.options.silent) {
            console.log('[MonitorSDK]', ...args);
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 销毁
    // ─────────────────────────────────────────────────────────────────────────────
    
    destroy() {
        if (this.destroyed) return;
        
        this.log('Destroying MonitorSDK...');
        
        // 停止定时器
        if (this.reportTimer) {
            clearInterval(this.reportTimer);
        }
        
        // 刷新剩余数据
        this.flush();
        
        // 销毁各模块
        Object.values(this.modules).forEach(module => {
            if (module && module.destroy) {
                module.destroy();
            }
        });
        
        // 销毁缓存
        if (this.cache) {
            this.cache.destroy();
        }
        
        this.modules = {};
        this.reportQueue = [];
        this.destroyed = true;
        this.initialized = false;
        
        MonitorSDK.instance = null;
        
        this.log('MonitorSDK destroyed');
    }
}

// ────────────────────────────────────────────────────────────────────────────────────
// 导出
// ────────────────────────────────────────────────────────────────────────────────────

export default MonitorSDK;

// 便捷方法
export const init = (options) => MonitorSDK.getInstance(options);
export const capture = (data) => MonitorSDK.instance?.capture(data);
export const captureError = (error, context) => MonitorSDK.instance?.captureError(error, context);
export const captureBehavior = (action, data) => MonitorSDK.instance?.captureBehavior(action, data);
```

---

## 3. 使用示例

### 3.1 基础使用

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 基础使用示例
// ────────────────────────────────────────────────────────────────────────────────────

import MonitorSDK from './sdk';

// 初始化
const monitor = MonitorSDK.getInstance({
    appId: 'my-app',
    env: 'production',
    version: '1.0.0',
    
    endpoint: 'https://monitor.example.com/api/collect',
    
    enableError: true,
    enablePerformance: true,
    enableBehavior: true,
    enableRequest: true,
    
    sampling: {
        global: 1,
        byType: {
            error: 1,
            performance: 0.1,
            behavior: 0.05
        }
    },
    
    debug: false
});

// 设置用户信息
monitor.setUser({
    id: 'user123',
    name: 'John Doe',
    email: 'john@example.com'
});

// 手动上报
monitor.capture({
    type: 'custom',
    event: 'button_click',
    data: { buttonId: 'submit' }
});

// 捕获错误
try {
    // 某些可能出错的代码
} catch (error) {
    monitor.captureError(error, { context: 'additional info' });
}

// 捕获行为
monitor.captureBehavior('page_view', { page: 'home' });
```

### 3.2 Vue 项目集成

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// Vue 项目集成
// ────────────────────────────────────────────────────────────────────────────────────

import { createApp } from 'vue';
import App from './App.vue';
import MonitorSDK from './sdk';

// 初始化监控
const monitor = MonitorSDK.getInstance({
    appId: 'vue-app',
    env: process.env.NODE_ENV,
    version: process.env.APP_VERSION,
    endpoint: process.env.MONITOR_ENDPOINT
});

const app = createApp(App);

// 安装 Vue 错误监控
app.config.errorHandler = (err, instance, info) => {
    monitor.captureError(err, {
        componentName: instance?.$options?.name,
        info: info
    });
};

app.mount('#app');
```

### 3.3 React 项目集成

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// React 项目集成
// ────────────────────────────────────────────────────────────────────────────────────

import React from 'react';
import MonitorSDK from './sdk';

// 初始化监控
const monitor = MonitorSDK.getInstance({
    appId: 'react-app',
    env: process.env.NODE_ENV,
    version: process.env.APP_VERSION,
    endpoint: process.env.MONITOR_ENDPOINT
});

// 创建 Error Boundary
class MonitorErrorBoundary extends React.Component {
    componentDidCatch(error, errorInfo) {
        monitor.captureError(error, {
            componentStack: errorInfo.componentStack
        });
    }
    
    render() {
        return this.props.children;
    }
}

// 使用
function App() {
    return (
        <MonitorErrorBoundary>
            <MainApp />
        </MonitorErrorBoundary>
    );
}
```

---

## 4. 配置选项详解

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 完整配置选项
// ────────────────────────────────────────────────────────────────────────────────────

const fullConfig = {
    // ═══════════════════════════════════════════════════════════════════════
    // 基础配置
    // ═══════════════════════════════════════════════════════════════════════
    
    appId: 'my-app',               // 应用 ID（必填）
    env: 'production',             // 环境：development | staging | production
    version: '1.0.0',              // 应用版本号
    
    // ═══════════════════════════════════════════════════════════════════════
    // 上报配置
    // ═══════════════════════════════════════════════════════════════════════
    
    endpoint: 'https://monitor.example.com/api/collect',  // 上报地址
    reportInterval: 5000,          // 定时上报间隔（毫秒）
    batchSize: 10,                 // 批量上报数量
    
    // ═══════════════════════════════════════════════════════════════════════
    // 模块开关
    // ═══════════════════════════════════════════════════════════════════════
    
    enableError: true,             // 启用错误监控
    enablePerformance: true,       // 启用性能监控
    enableBehavior: true,          // 启用行为监控
    enableRequest: true,           // 启用请求监控
    
    // ═══════════════════════════════════════════════════════════════════════
    // 采样配置
    // ═══════════════════════════════════════════════════════════════════════
    
    sampling: {
        global: 1,                  // 全局采样率
        byType: {
            error: 1,               // 错误 100%
            performance: 0.1,       // 性能 10%
            behavior: 0.05,         // 行为 5%
            request: 0.1            // 请求 10%
        },
        byEnvironment: {
            development: 0,         // 开发环境 0%
            staging: 0.5,           // 预发布 50%
            production: 1           // 生产环境 100%
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // 脱敏配置
    // ═══════════════════════════════════════════════════════════════════════
    
    sanitization: {
        enabled: true,              // 启用脱敏
        sensitiveFields: [
            'password', 'token', 'secret', 'apiKey',
            'phone', 'email', 'idCard', 'bankCard'
        ],
        maskText: '******',
        maskUrlParams: true,
        maskRequestBody: true
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // 缓存配置
    // ═══════════════════════════════════════════════════════════════════════
    
    cache: {
        enabled: true,              // 启用缓存
        maxSize: 500,               // 最大条数
        maxAge: 24 * 60 * 60 * 1000 // 最大存活时间
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // 其他配置
    // ═══════════════════════════════════════════════════════════════════════
    
    debug: false,                   // 调试模式
    silent: false                   // 静默模式
};
```

---

## 最佳实践

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  SDK 使用最佳实践                                                                      │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  初始化                                                                                │
│  □ 应用启动时尽早初始化                                                               │
│  □ 使用单例模式避免重复初始化                                                         │
│  □ 根据环境配置不同的采样率                                                           │
│                                                                                       │
│  数据采集                                                                              │
│  □ 根据需求选择开启的模块                                                             │
│  □ 设置合理的采样率控制数据量                                                         │
│  □ 对敏感数据进行脱敏处理                                                             │
│                                                                                       │
│  数据上报                                                                              │
│  □ 使用 Beacon API 确保页面卸载时数据发送                                            │
│  □ 批量上报减少请求数                                                                 │
│  □ 失败重试确保数据可靠                                                               │
│                                                                                       │
│  性能优化                                                                              │
│  □ 避免阻塞主线程                                                                     │
│  □ 使用被动监听器                                                                     │
│  □ 限制内存和存储使用                                                                 │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

[返回上级目录](../index.md)
