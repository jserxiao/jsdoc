# 数据缓存与重试

> 数据缓存机制确保监控数据不会因为网络问题而丢失，支持离线存储和失败重试。

## 学习要点

- 💾 掌握本地存储缓存策略
- 🔄 理解失败重试机制
- 📦 学会数据批量处理
- 🗑️ 掌握过期数据清理

---

## 1. 缓存架构设计

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  数据缓存架构                                                                          │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│   数据采集                                                                            │
│       │                                                                               │
│       ▼                                                                               │
│   ┌─────────────────────────────────────────────────────────────────────────────┐   │
│   │                           内存队列                                          │   │
│   │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                                  │   │
│   │  │Data │ │Data │ │Data │ │Data │ │Data │  ...                            │   │
│   │  └──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘                                  │   │
│   │     │       │       │       │       │                                      │   │
│   │     └───────┴───────┴───────┴───────┘                                      │   │
│   │                         │                                                  │   │
│   └─────────────────────────┼─────────────────────────────────────────────────┘   │
│                             ▼                                                       │
│   ┌─────────────────────────────────────────────────────────────────────────────┐   │
│   │                         本地存储                                             │   │
│   │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐            │   │
│   │  │   localStorage  │  │ sessionStorage  │  │   IndexedDB     │            │   │
│   │  │   - 持久存储     │  │ - 会话存储      │  │ - 大量数据      │            │   │
│   │  │   - 跨会话       │  │ - 临时数据      │  │ - 结构化存储    │            │   │
│   │  └─────────────────┘  └─────────────────┘  └─────────────────┘            │   │
│   └─────────────────────────────────────────────────────────────────────────────┘   │
│                             │                                                       │
│                             ▼                                                       │
│   ┌─────────────────────────────────────────────────────────────────────────────┐   │
│   │                           上报策略                                          │   │
│   │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐                  │   │
│   │  │  立即上报      │  │  批量上报      │  │  重试上报      │                  │   │
│   │  │  - 错误数据    │  │  - 定时上报    │  │  - 失败重试    │                  │   │
│   │  │  - 关键数据    │  │  - 队列满时    │  │  - 网络恢复    │                  │   │
│   │  └───────────────┘  └───────────────┘  └───────────────┘                  │   │
│   └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. 内存队列

### 2.1 内存队列实现

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 内存队列 - 数据缓冲区
// ────────────────────────────────────────────────────────────────────────────────────

class MemoryQueue {
    constructor(options = {}) {
        this.options = {
            maxSize: 100,           // 最大条数
            maxMemory: 5 * 1024 * 1024,  // 最大内存（5MB）
            ...options
        };
        
        this.queue = [];
        this.currentMemory = 0;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 添加数据
    // ─────────────────────────────────────────────────────────────────────────────
    
    add(data) {
        const item = {
            data: data,
            size: this.calculateSize(data),
            timestamp: Date.now(),
            retryCount: 0
        };
        
        // 检查是否超出限制
        while (
            this.queue.length >= this.options.maxSize ||
            this.currentMemory + item.size > this.options.maxMemory
        ) {
            const removed = this.queue.shift();
            if (removed) {
                this.currentMemory -= removed.size;
            }
        }
        
        this.queue.push(item);
        this.currentMemory += item.size;
        
        return true;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 获取数据
    // ─────────────────────────────────────────────────────────────────────────────
    
    get(count = 10) {
        return this.queue.slice(0, count);
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 移除数据
    // ─────────────────────────────────────────────────────────────────────────────
    
    remove(count) {
        const removed = this.queue.splice(0, count);
        
        removed.forEach(item => {
            this.currentMemory -= item.size;
        });
        
        return removed;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 标记重试
    // ─────────────────────────────────────────────────────────────────────────────
    
    markRetry(index, maxRetry = 3) {
        const item = this.queue[index];
        
        if (item) {
            item.retryCount++;
            
            if (item.retryCount >= maxRetry) {
                // 超过最大重试次数，移除
                this.queue.splice(index, 1);
                this.currentMemory -= item.size;
                return false;
            }
            
            return true;
        }
        
        return false;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 计算数据大小
    // ─────────────────────────────────────────────────────────────────────────────
    
    calculateSize(data) {
        try {
            return new Blob([JSON.stringify(data)]).size;
        } catch (e) {
            return 1024;  // 默认 1KB
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 状态查询
    // ─────────────────────────────────────────────────────────────────────────────
    
    get length() {
        return this.queue.length;
    }
    
    get size() {
        return this.currentMemory;
    }
    
    get isEmpty() {
        return this.queue.length === 0;
    }
    
    clear() {
        this.queue = [];
        this.currentMemory = 0;
    }
}
```

---

## 3. 本地存储

### 3.1 LocalStorage 缓存

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// LocalStorage 缓存
// ────────────────────────────────────────────────────────────────────────────────────

class LocalStorageCache {
    constructor(options = {}) {
        this.options = {
            key: '_monitor_cache',    // 存储键名
            maxSize: 500,              // 最大条数
            maxAge: 24 * 60 * 60 * 1000,  // 最大存活时间（24小时）
            ...options
        };
        
        this.cache = [];
        this.init();
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 初始化
    // ─────────────────────────────────────────────────────────────────────────────
    
    init() {
        // 从本地存储恢复数据
        this.restore();
        
        // 监听在线状态
        window.addEventListener('online', () => {
            this.onOnline();
        });
        
        // 定期清理过期数据
        setInterval(() => this.cleanExpired(), 60000);
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 添加数据
    // ─────────────────────────────────────────────────────────────────────────────
    
    add(data) {
        const item = {
            ...data,
            _id: this.generateId(),
            _timestamp: Date.now(),
            _retryCount: 0
        };
        
        this.cache.push(item);
        
        // 检查大小限制
        while (this.cache.length > this.options.maxSize) {
            this.cache.shift();
        }
        
        // 持久化
        this.persist();
        
        return item;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 获取所有数据
    // ─────────────────────────────────────────────────────────────────────────────
    
    getAll() {
        return this.cache.slice();
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 获取指定数量的数据
    // ─────────────────────────────────────────────────────────────────────────────
    
    get(count) {
        return this.cache.slice(0, count);
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 移除数据
    // ─────────────────────────────────────────────────────────────────────────────
    
    remove(id) {
        const index = this.cache.findIndex(item => item._id === id);
        
        if (index > -1) {
            this.cache.splice(index, 1);
            this.persist();
            return true;
        }
        
        return false;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 批量移除
    // ─────────────────────────────────────────────────────────────────────────────
    
    removeBatch(ids) {
        const idSet = new Set(ids);
        const before = this.cache.length;
        
        this.cache = this.cache.filter(item => !idSet.has(item._id));
        
        if (this.cache.length !== before) {
            this.persist();
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 标记重试
    // ─────────────────────────────────────────────────────────────────────────────
    
    markRetry(id, maxRetry = 3) {
        const item = this.cache.find(i => i._id === id);
        
        if (item) {
            item._retryCount++;
            
            if (item._retryCount >= maxRetry) {
                this.remove(id);
                return false;
            }
            
            this.persist();
            return true;
        }
        
        return false;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 清空
    // ─────────────────────────────────────────────────────────────────────────────
    
    clear() {
        this.cache = [];
        this.persist();
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 持久化到本地存储
    // ─────────────────────────────────────────────────────────────────────────────
    
    persist() {
        try {
            const data = JSON.stringify(this.cache);
            
            // 检查大小
            if (data.length > 4.5 * 1024 * 1024) {  // localStorage 通常限制 5MB
                // 移除一半数据
                this.cache = this.cache.slice(Math.floor(this.cache.length / 2));
            }
            
            localStorage.setItem(this.options.key, JSON.stringify(this.cache));
        } catch (e) {
            // 存储已满
            if (e.name === 'QuotaExceededError') {
                this.handleStorageFull();
            }
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 从本地存储恢复
    // ─────────────────────────────────────────────────────────────────────────────
    
    restore() {
        try {
            const data = localStorage.getItem(this.options.key);
            
            if (data) {
                this.cache = JSON.parse(data);
                // 清理过期数据
                this.cleanExpired();
            }
        } catch (e) {
            this.cache = [];
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 清理过期数据
    // ─────────────────────────────────────────────────────────────────────────────
    
    cleanExpired() {
        const now = Date.now();
        const maxAge = this.options.maxAge;
        
        const before = this.cache.length;
        this.cache = this.cache.filter(item => {
            const age = now - (item._timestamp || 0);
            return age < maxAge;
        });
        
        if (this.cache.length !== before) {
            this.persist();
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 处理存储已满
    // ─────────────────────────────────────────────────────────────────────────────
    
    handleStorageFull() {
        // 移除一半旧数据
        this.cache = this.cache.slice(Math.floor(this.cache.length / 2));
        
        try {
            localStorage.setItem(this.options.key, JSON.stringify(this.cache));
        } catch (e) {
            // 仍然失败，清空缓存
            this.cache = [];
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 网络恢复
    // ─────────────────────────────────────────────────────────────────────────────
    
    onOnline() {
        // 网络恢复时，触发刷新
        if (this.flushCallback) {
            this.flushCallback(this.getAll());
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 设置刷新回调
    // ─────────────────────────────────────────────────────────────────────────────
    
    onFlush(callback) {
        this.flushCallback = callback;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 生成唯一 ID
    // ─────────────────────────────────────────────────────────────────────────────
    
    generateId() {
        return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // 状态
    get length() {
        return this.cache.length;
    }
}
```

### 3.2 IndexedDB 缓存（大数据量）

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// IndexedDB 缓存 - 支持大量数据存储
// ────────────────────────────────────────────────────────────────────────────────────

class IndexedDBCache {
    constructor(options = {}) {
        this.options = {
            dbName: 'MonitorDB',
            storeName: 'monitor_data',
            maxAge: 24 * 60 * 60 * 1000,
            ...options
        };
        
        this.db = null;
        this.ready = false;
        
        this.init();
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 初始化
    // ─────────────────────────────────────────────────────────────────────────────
    
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.options.dbName, 1);
            
            request.onerror = () => {
                console.error('IndexedDB open failed');
                reject(request.error);
            };
            
            request.onsuccess = () => {
                this.db = request.result;
                this.ready = true;
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // 创建对象存储
                if (!db.objectStoreNames.contains(this.options.storeName)) {
                    const store = db.createObjectStore(this.options.storeName, {
                        keyPath: '_id'
                    });
                    
                    // 创建索引
                    store.createIndex('timestamp', '_timestamp', { unique: false });
                    store.createIndex('type', 'type', { unique: false });
                }
            };
        });
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 添加数据
    // ─────────────────────────────────────────────────────────────────────────────
    
    async add(data) {
        if (!this.ready) {
            await this.init();
        }
        
        const item = {
            ...data,
            _id: this.generateId(),
            _timestamp: Date.now(),
            _retryCount: 0
        };
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.options.storeName], 'readwrite');
            const store = transaction.objectStore(this.options.storeName);
            const request = store.add(item);
            
            request.onsuccess = () => resolve(item);
            request.onerror = () => reject(request.error);
        });
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 获取所有数据
    // ─────────────────────────────────────────────────────────────────────────────
    
    async getAll() {
        if (!this.ready) {
            await this.init();
        }
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.options.storeName], 'readonly');
            const store = transaction.objectStore(this.options.storeName);
            const request = store.getAll();
            
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 获取指定数量
    // ─────────────────────────────────────────────────────────────────────────────
    
    async get(count) {
        const all = await this.getAll();
        return all.slice(0, count);
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 移除数据
    // ─────────────────────────────────────────────────────────────────────────────
    
    async remove(id) {
        if (!this.ready) {
            await this.init();
        }
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.options.storeName], 'readwrite');
            const store = transaction.objectStore(this.options.storeName);
            const request = store.delete(id);
            
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 批量移除
    // ─────────────────────────────────────────────────────────────────────────────
    
    async removeBatch(ids) {
        if (!this.ready) {
            await this.init();
        }
        
        const transaction = this.db.transaction([this.options.storeName], 'readwrite');
        const store = transaction.objectStore(this.options.storeName);
        
        ids.forEach(id => {
            store.delete(id);
        });
        
        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 清理过期数据
    // ─────────────────────────────────────────────────────────────────────────────
    
    async cleanExpired() {
        if (!this.ready) {
            await this.init();
        }
        
        const now = Date.now();
        const maxAge = this.options.maxAge;
        const cutoff = now - maxAge;
        
        const transaction = this.db.transaction([this.options.storeName], 'readwrite');
        const store = transaction.objectStore(this.options.storeName);
        const index = store.index('timestamp');
        
        // 使用游标删除过期数据
        const range = IDBKeyRange.upperBound(cutoff);
        
        return new Promise((resolve, reject) => {
            const request = index.openCursor(range);
            
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    cursor.delete();
                    cursor.continue();
                } else {
                    resolve();
                }
            };
            
            request.onerror = () => reject(request.error);
        });
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 清空
    // ─────────────────────────────────────────────────────────────────────────────
    
    async clear() {
        if (!this.ready) {
            await this.init();
        }
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.options.storeName], 'readwrite');
            const store = transaction.objectStore(this.options.storeName);
            const request = store.clear();
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 生成唯一 ID
    // ─────────────────────────────────────────────────────────────────────────────
    
    generateId() {
        return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
```

---

## 4. 失败重试机制

### 4.1 重试策略

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 失败重试机制
// ────────────────────────────────────────────────────────────────────────────────────

class RetryStrategy {
    constructor(options = {}) {
        this.options = {
            maxRetries: 3,              // 最大重试次数
            baseDelay: 1000,            // 基础延迟（毫秒）
            maxDelay: 30000,            // 最大延迟
            backoffFactor: 2,           // 退避因子
            retryableErrors: [          // 可重试的错误类型
                'NetworkError',
                'TimeoutError',
                'AbortError'
            ],
            retryableStatus: [          // 可重试的 HTTP 状态
                408,  // Request Timeout
                429,  // Too Many Requests
                500,  // Internal Server Error
                502,  // Bad Gateway
                503,  // Service Unavailable
                504   // Gateway Timeout
            ],
            ...options
        };
        
        this.retryTimers = new Map();
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 判断是否应该重试
    // ─────────────────────────────────────────────────────────────────────────────
    
    shouldRetry(error, retryCount) {
        // 超过最大重试次数
        if (retryCount >= this.options.maxRetries) {
            return false;
        }
        
        // 网络错误
        if (error.name && this.options.retryableErrors.includes(error.name)) {
            return true;
        }
        
        // HTTP 状态错误
        if (error.status && this.options.retryableStatus.includes(error.status)) {
            return true;
        }
        
        // 网络离线
        if (!navigator.onLine) {
            return true;
        }
        
        return false;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 计算重试延迟
    // ─────────────────────────────────────────────────────────────────────────────
    
    calculateDelay(retryCount) {
        // 指数退避 + 随机抖动
        const delay = this.options.baseDelay * Math.pow(this.options.backoffFactor, retryCount);
        const jitter = Math.random() * 1000;  // 随机抖动
        
        return Math.min(delay + jitter, this.options.maxDelay);
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 执行重试
    // ─────────────────────────────────────────────────────────────────────────────
    
    async retry(id, fn, retryCount = 0) {
        try {
            return await fn();
        } catch (error) {
            if (this.shouldRetry(error, retryCount)) {
                const delay = this.calculateDelay(retryCount);
                
                return new Promise((resolve, reject) => {
                    const timer = setTimeout(async () => {
                        this.retryTimers.delete(id);
                        
                        try {
                            const result = await this.retry(id, fn, retryCount + 1);
                            resolve(result);
                        } catch (e) {
                            reject(e);
                        }
                    }, delay);
                    
                    this.retryTimers.set(id, timer);
                });
            }
            
            throw error;
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 取消重试
    // ─────────────────────────────────────────────────────────────────────────────
    
    cancel(id) {
        const timer = this.retryTimers.get(id);
        
        if (timer) {
            clearTimeout(timer);
            this.retryTimers.delete(id);
            return true;
        }
        
        return false;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 取消所有重试
    // ─────────────────────────────────────────────────────────────────────────────
    
    cancelAll() {
        this.retryTimers.forEach(timer => clearTimeout(timer));
        this.retryTimers.clear();
    }
}
```

---

## 5. 完整缓存管理类

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 完整缓存管理类
// ────────────────────────────────────────────────────────────────────────────────────

class CacheManager {
    constructor(options = {}) {
        this.options = {
            useIndexedDB: false,    // 是否使用 IndexedDB
            useLocalStorage: true,  // 是否使用 localStorage
            maxMemorySize: 100,
            maxStorageSize: 500,
            maxAge: 24 * 60 * 60 * 1000,
            maxRetries: 3,
            reportInterval: 5000,   // 上报间隔
            batchSize: 10,          // 批量上报数量
            ...options
        };
        
        this.reporter = options.reporter;
        
        // 内存队列
        this.memoryQueue = new MemoryQueue({
            maxSize: this.options.maxMemorySize
        });
        
        // 本地存储
        this.storage = null;
        
        // 重试策略
        this.retryStrategy = new RetryStrategy({
            maxRetries: this.options.maxRetries
        });
        
        // 上报状态
        this.isSending = false;
        this.sendTimer = null;
        
        this.init();
    }
    
    async init() {
        // 初始化存储
        if (this.options.useIndexedDB) {
            this.storage = new IndexedDBCache({
                maxAge: this.options.maxAge
            });
        } else if (this.options.useLocalStorage) {
            this.storage = new LocalStorageCache({
                maxAge: this.options.maxAge,
                maxSize: this.options.maxStorageSize
            });
        }
        
        // 设置刷新回调
        if (this.storage && this.storage.onFlush) {
            this.storage.onFlush((data) => this.sendData(data));
        }
        
        // 开始定时上报
        this.startReportTimer();
        
        // 监听网络状态
        window.addEventListener('online', () => this.flush());
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 添加数据
    // ─────────────────────────────────────────────────────────────────────────────
    
    async add(data) {
        // 添加到内存队列
        this.memoryQueue.add(data);
        
        // 添加到本地存储
        if (this.storage) {
            await this.storage.add(data);
        }
        
        // 检查是否需要立即上报
        if (this.memoryQueue.length >= this.options.batchSize) {
            this.flush();
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 开始定时上报
    // ─────────────────────────────────────────────────────────────────────────────
    
    startReportTimer() {
        this.sendTimer = setInterval(() => {
            this.flush();
        }, this.options.reportInterval);
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 刷新（发送数据）
    // ─────────────────────────────────────────────────────────────────────────────
    
    async flush() {
        if (this.isSending) return;
        
        this.isSending = true;
        
        try {
            // 获取数据
            let data;
            
            if (this.storage) {
                data = await this.storage.get(this.options.batchSize);
            } else {
                data = this.memoryQueue.get(this.options.batchSize);
            }
            
            if (data.length === 0) {
                return;
            }
            
            // 发送数据
            await this.sendData(data);
            
        } catch (e) {
            console.error('Flush failed:', e);
        } finally {
            this.isSending = false;
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 发送数据
    // ─────────────────────────────────────────────────────────────────────────────
    
    async sendData(data) {
        const ids = data.map(item => item._id).filter(Boolean);
        
        try {
            // 使用重试策略发送
            await this.retryStrategy.retry('send', async () => {
                await this.reporter.send(data);
            });
            
            // 发送成功，移除数据
            if (this.storage) {
                await this.storage.removeBatch(ids);
            } else {
                this.memoryQueue.remove(data.length);
            }
            
        } catch (error) {
            // 发送失败，标记重试
            ids.forEach(id => {
                if (this.storage) {
                    this.storage.markRetry(id, this.options.maxRetries);
                }
            });
            
            throw error;
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 销毁
    // ─────────────────────────────────────────────────────────────────────────────
    
    destroy() {
        if (this.sendTimer) {
            clearInterval(this.sendTimer);
        }
        
        this.retryStrategy.cancelAll();
        this.memoryQueue.clear();
    }
}

export default CacheManager;
```

---

## 最佳实践

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  数据缓存最佳实践                                                                      │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  存储策略                                                                              │
│  □ 内存队列 + 本地存储双重保障                                                        │
│  □ 根据数据量选择 localStorage 或 IndexedDB                                          │
│  □ 定期清理过期数据                                                                   │
│                                                                                       │
│  重试策略                                                                              │
│  □ 使用指数退避避免请求风暴                                                           │
│  □ 区分可重试和不可重试的错误                                                         │
│  □ 设置最大重试次数                                                                   │
│                                                                                       │
│  上报策略                                                                              │
│  □ 批量上报减少请求数                                                                 │
│  □ 网络恢复时自动刷新                                                                 │
│  □ 页面卸载时使用 sendBeacon 确保数据发送                                            │
│                                                                                       │
│  性能优化                                                                              │
│  □ 限制内存和存储大小                                                                 │
│  □ 异步操作不阻塞主线程                                                               │
│  □ 使用防抖/节流控制上报频率                                                          │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

[返回上级目录](../index.md)
