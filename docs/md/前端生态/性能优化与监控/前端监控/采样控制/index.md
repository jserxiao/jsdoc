# 采样控制

> 采样控制通过合理的采样策略，在保证数据代表性的同时，减少数据采集和上报的开销。

## 学习要点

- 📊 理解采样策略设计
- 🎯 掌握按类型配置采样率
- 🔄 学会一致性采样
- 🌍 实现环境差异化采样

---

## 1. 采样策略设计

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  采样策略架构                                                                          │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│   数据采集                                                                            │
│       │                                                                               │
│       ▼                                                                               │
│   ┌─────────────────────────────────────────────────────────────────────────────┐   │
│   │                           采样判断                                          │   │
│   │  ┌─────────────────────────────────────────────────────────────────────┐  │   │
│   │  │  1. 环境采样                                                         │  │   │
│   │  │     • development: 0%（不采样）                                     │  │   │
│   │  │     • staging: 50%                                                  │  │   │
│   │  │     • production: 100%                                              │  │   │
│   │  └─────────────────────────────────────────────────────────────────────┘  │   │
│   │  ┌─────────────────────────────────────────────────────────────────────┐  │   │
│   │  │  2. 类型采样                                                         │  │   │
│   │  │     • error: 100%（错误全量）                                       │  │   │
│   │  │     • performance: 10%                                              │  │   │
│   │  │     • behavior: 5%                                                  │  │   │
│   │  └─────────────────────────────────────────────────────────────────────┘  │   │
│   │  ┌─────────────────────────────────────────────────────────────────────┐  │   │
│   │  │  3. 全局采样                                                         │  │   │
│   │  │     • 控制整体数据量                                                 │  │   │
│   │  │     • 作为最终采样率上限                                             │  │   │
│   │  └─────────────────────────────────────────────────────────────────────┘  │   │
│   └─────────────────────────────────────────────────────────────────────────────┘   │
│                             │                                                       │
│                             ▼                                                       │
│                    ┌────────────────┐                                              │
│                    │  采样结果      │                                              │
│                    │  • 采样通过    │                                              │
│                    │  • 采样拒绝    │                                              │
│                    └────────────────┘                                              │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. 采样控制器实现

### 2.1 基础采样控制器

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 采样控制器
// ────────────────────────────────────────────────────────────────────────────────────

class SamplingController {
    constructor(config = {}) {
        this.config = {
            // 全局采样率（0-1）
            global: 1,
            
            // 按类型配置采样率
            byType: {
                error: 1,           // 错误 100% 采样
                performance: 0.1,   // 性能 10% 采样
                behavior: 0.05,     // 行为 5% 采样
                request: 0.1,       // 请求 10% 采样
                resource: 0.05      // 资源 5% 采样
            },
            
            // 按环境配置采样率
            byEnvironment: {
                development: 0,     // 开发环境不采样
                staging: 0.5,       // 预发布 50%
                production: 1       // 生产环境 100%
            },
            
            // 按用户配置采样率（可选）
            byUser: {},
            
            ...config
        };
        
        // 用户标识（用于一致性采样）
        this.userId = this.getUserId();
        
        // 会话标识
        this.sessionId = this.getSessionId();
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 判断是否采样
    // ─────────────────────────────────────────────────────────────────────────────
    
    shouldSample(type = 'global', context = {}) {
        // 1. 获取环境采样率
        const env = this.getEnvironment();
        const envRate = this.config.byEnvironment[env] ?? 1;
        
        // 开发环境直接返回 false
        if (envRate === 0) {
            return false;
        }
        
        // 2. 获取类型采样率
        const typeRate = this.config.byType[type] ?? this.config.global;
        
        // 3. 计算综合采样率
        const finalRate = envRate * typeRate * this.config.global;
        
        // 4. 执行采样判断
        return this.doSample(finalRate, context);
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 执行采样
    // ─────────────────────────────────────────────────────────────────────────────
    
    doSample(rate, context = {}) {
        // 边界检查
        if (rate >= 1) return true;
        if (rate <= 0) return false;
        
        // 一致性采样：同一用户结果一致
        if (context.consistent !== false) {
            return this.consistentSample(rate);
        }
        
        // 随机采样
        return this.randomSample(rate);
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 随机采样
    // ─────────────────────────────────────────────────────────────────────────────
    
    randomSample(rate) {
        return Math.random() < rate;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 一致性采样
    // ─────────────────────────────────────────────────────────────────────────────
    
    consistentSample(rate) {
        // 使用用户 ID 进行一致性采样
        // 同一用户在同一段时间内采样结果一致
        const hash = this.hashString(this.userId);
        return (hash % 10000) / 10000 < rate;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 字符串哈希
    // ─────────────────────────────────────────────────────────────────────────────
    
    hashString(str) {
        let hash = 0;
        
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;  // Convert to 32bit integer
        }
        
        return Math.abs(hash);
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 获取环境
    // ─────────────────────────────────────────────────────────────────────────────
    
    getEnvironment() {
        // 优先使用配置的环境
        if (this.config.environment) {
            return this.config.environment;
        }
        
        // 从 hostname 判断
        const hostname = location.hostname;
        
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'development';
        }
        
        if (hostname.includes('staging') || 
            hostname.includes('test') || 
            hostname.includes('uat')) {
            return 'staging';
        }
        
        return 'production';
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 获取用户 ID
    // ─────────────────────────────────────────────────────────────────────────────
    
    getUserId() {
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
    // 动态更新采样率
    // ─────────────────────────────────────────────────────────────────────────────
    
    updateRate(type, rate) {
        if (type === 'global') {
            this.config.global = rate;
        } else {
            this.config.byType[type] = rate;
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 获取配置
    // ─────────────────────────────────────────────────────────────────────────────
    
    getConfig() {
        return { ...this.config };
    }
}
```

---

## 3. 高级采样策略

### 3.1 自适应采样

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 自适应采样 - 根据数据量动态调整采样率
// ────────────────────────────────────────────────────────────────────────────────────

class AdaptiveSamplingController extends SamplingController {
    constructor(config = {}) {
        super(config);
        
        this.adaptiveConfig = {
            // 目标数据量（每分钟）
            targetCount: 100,
            // 调整周期（毫秒）
            adjustInterval: 60000,
            // 最小采样率
            minRate: 0.01,
            // 最大采样率
            maxRate: 1,
            // 调整系数
            adjustFactor: 0.8,
            ...config.adaptive
        };
        
        // 统计数据
        this.stats = {
            totalCount: 0,
            sampledCount: 0,
            lastAdjustTime: Date.now()
        };
        
        // 当前采样率
        this.currentRate = this.config.global;
        
        // 启动自适应调整
        this.startAdjustment();
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 判断是否采样
    // ─────────────────────────────────────────────────────────────────────────────
    
    shouldSample(type = 'global', context = {}) {
        // 统计总数
        this.stats.totalCount++;
        
        // 获取基础采样率
        const baseRate = this.getBaseRate(type);
        
        // 应用自适应采样率
        const finalRate = Math.min(baseRate, this.currentRate);
        
        // 执行采样
        const result = this.doSample(finalRate, context);
        
        if (result) {
            this.stats.sampledCount++;
        }
        
        return result;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 获取基础采样率
    // ─────────────────────────────────────────────────────────────────────────────
    
    getBaseRate(type) {
        const env = this.getEnvironment();
        const envRate = this.config.byEnvironment[env] ?? 1;
        const typeRate = this.config.byType[type] ?? this.config.global;
        
        return envRate * typeRate;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 启动自适应调整
    // ─────────────────────────────────────────────────────────────────────────────
    
    startAdjustment() {
        setInterval(() => this.adjust(), this.adaptiveConfig.adjustInterval);
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 背景调整采样率
    // ─────────────────────────────────────────────────────────────────────────────
    
    adjust() {
        const now = Date.now();
        const elapsed = now - this.stats.lastAdjustTime;
        
        // 计算实际采样数量
        const actualCount = this.stats.sampledCount;
        
        // 计算目标数量（按时间比例）
        const targetCount = this.adaptiveConfig.targetCount * 
            (elapsed / this.adaptiveConfig.adjustInterval);
        
        // 计算调整因子
        if (actualCount > 0 && targetCount > 0) {
            const ratio = targetCount / actualCount;
            
            // 应用调整
            if (ratio < 1) {
                // 数据过多，降低采样率
                this.currentRate = Math.max(
                    this.currentRate * this.adaptiveConfig.adjustFactor * ratio,
                    this.adaptiveConfig.minRate
                );
            } else if (ratio > 1) {
                // 数据过少，提高采样率
                this.currentRate = Math.min(
                    this.currentRate / this.adaptiveConfig.adjustFactor * ratio,
                    this.adaptiveConfig.maxRate
                );
            }
        }
        
        // 重置统计
        this.stats.totalCount = 0;
        this.stats.sampledCount = 0;
        this.stats.lastAdjustTime = now;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 获取当前状态
    // ─────────────────────────────────────────────────────────────────────────────
    
    getStatus() {
        return {
            currentRate: this.currentRate,
            totalCount: this.stats.totalCount,
            sampledCount: this.stats.sampledCount,
            targetCount: this.adaptiveConfig.targetCount
        };
    }
}
```

### 3.2 分层采样

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 分层采样 - 确保不同层级数据都有代表性
// ────────────────────────────────────────────────────────────────────────────────────

class StratifiedSamplingController extends SamplingController {
    constructor(config = {}) {
        super(config);
        
        // 分层配置
        this.stratifiedConfig = {
            // 按错误严重程度分层
            severity: {
                critical: 1,     // 严重错误 100%
                error: 1,        // 普通错误 100%
                warning: 0.5,    // 警告 50%
                info: 0.1        // 信息 10%
            },
            // 按页面类型分层
            pageType: {
                landing: 1,      // 落地页 100%
                conversion: 1,   // 转化页 100%
                content: 0.3,    // 内容页 30%
                other: 0.1       // 其他 10%
            },
            // 按用户类型分层
            userType: {
                vip: 1,          // VIP 用户 100%
                registered: 0.5, // 注册用户 50%
                guest: 0.1       // 游客 10%
            },
            ...config.stratified
        };
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 判断是否采样
    // ─────────────────────────────────────────────────────────────────────────────
    
    shouldSample(type = 'global', context = {}) {
        // 获取基础采样率
        let rate = this.getBaseRate(type);
        
        // 应用分层采样率
        rate = this.applyStratifiedRate(rate, context);
        
        // 应用全局采样率上限
        rate = Math.min(rate, this.config.global);
        
        // 执行采样
        return this.doSample(rate, context);
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 应用分层采样率
    // ─────────────────────────────────────────────────────────────────────────────
    
    applyStratifiedRate(baseRate, context) {
        let rate = baseRate;
        
        // 按严重程度调整
        if (context.severity && this.stratifiedConfig.severity[context.severity]) {
            rate = Math.max(rate, this.stratifiedConfig.severity[context.severity]);
        }
        
        // 按页面类型调整
        if (context.pageType && this.stratifiedConfig.pageType[context.pageType]) {
            rate = Math.max(rate, this.stratifiedConfig.pageType[context.pageType]);
        }
        
        // 按用户类型调整
        if (context.userType && this.stratifiedConfig.userType[context.userType]) {
            rate = Math.max(rate, this.stratifiedConfig.userType[context.userType]);
        }
        
        return rate;
    }
}
```

---

## 4. 采样配置管理

### 4.1 配置管理类

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 采样配置管理
// ────────────────────────────────────────────────────────────────────────────────────

class SamplingConfigManager {
    constructor(controller) {
        this.controller = controller;
        this.configKey = '_monitor_sampling_config';
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 从服务端获取配置
    // ─────────────────────────────────────────────────────────────────────────────
    
    async fetchFromServer(url) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (response.ok) {
                const config = await response.json();
                this.applyConfig(config);
                return true;
            }
        } catch (e) {
            console.warn('Failed to fetch sampling config:', e);
        }
        
        return false;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 应用配置
    // ─────────────────────────────────────────────────────────────────────────────
    
    applyConfig(config) {
        // 更新控制器配置
        if (config.global !== undefined) {
            this.controller.config.global = config.global;
        }
        
        if (config.byType) {
            Object.assign(this.controller.config.byType, config.byType);
        }
        
        if (config.byEnvironment) {
            Object.assign(this.controller.config.byEnvironment, config.byEnvironment);
        }
        
        // 保存到本地
        this.saveConfig(config);
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 保存配置到本地
    // ─────────────────────────────────────────────────────────────────────────────
    
    saveConfig(config) {
        try {
            localStorage.setItem(this.configKey, JSON.stringify({
                config: config,
                timestamp: Date.now()
            }));
        } catch (e) {}
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 加载本地配置
    // ─────────────────────────────────────────────────────────────────────────────
    
    loadConfig() {
        try {
            const data = localStorage.getItem(this.configKey);
            
            if (data) {
                const { config, timestamp } = JSON.parse(data);
                
                // 检查配置是否过期（24小时）
                if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
                    this.applyConfig(config);
                    return true;
                }
            }
        } catch (e) {}
        
        return false;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 清除配置
    // ─────────────────────────────────────────────────────────────────────────────
    
    clearConfig() {
        localStorage.removeItem(this.configKey);
    }
}
```

---

## 5. 完整示例

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 采样控制完整示例
// ────────────────────────────────────────────────────────────────────────────────────

const samplingController = new AdaptiveSamplingController({
    // 全局采样率
    global: 1,
    
    // 按类型采样
    byType: {
        error: 1,           // 错误全量
        performance: 0.1,   // 性能 10%
        behavior: 0.05,     // 行为 5%
        request: 0.1
    },
    
    // 按环境采样
    byEnvironment: {
        development: 0,
        staging: 0.5,
        production: 1
    },
    
    // 自适应配置
    adaptive: {
        targetCount: 100,
        adjustInterval: 60000
    }
});

// 配置管理
const configManager = new SamplingConfigManager(samplingController);

// 启动时加载本地配置
configManager.loadConfig();

// 定期从服务端同步配置
setInterval(() => {
    configManager.fetchFromServer('/api/monitor/config');
}, 5 * 60 * 1000);

// 使用示例
function report(data) {
    // 检查是否采样
    if (!samplingController.shouldSample(data.type, {
        severity: data.severity,
        pageType: getPageType(),
        userType: getUserType()
    })) {
        return;
    }
    
    // 上报数据
    sendReport(data);
}

export default samplingController;
```

---

## 最佳实践

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  采样控制最佳实践                                                                      │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  采样原则                                                                              │
│  □ 错误类数据全量采样                                                                 │
│  □ 性能数据按需采样                                                                   │
│  □ 行为数据低采样率                                                                   │
│  □ 保证重要数据不丢失                                                                 │
│                                                                                       │
│  一致性采样                                                                            │
│  □ 同一用户采样结果一致                                                               │
│  □ 使用用户 ID 哈希作为种子                                                           │
│  □ 避免数据统计偏差                                                                   │
│                                                                                       │
│  动态调整                                                                              │
│  □ 根据数据量自适应调整                                                               │
│  □ 支持服务端配置下发                                                                 │
│  □ 重要事件可提升采样率                                                               │
│                                                                                       │
│  环境差异                                                                              │
│  □ 开发环境不采样                                                                     │
│  □ 预发布环境部分采样                                                                 │
│  □ 生产环境按需采样                                                                   │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

[返回上级目录](../index.md)
