# 用户行为监控

> 用户行为监控通过采集用户在页面上的操作行为，帮助分析用户习惯、优化产品体验、追踪转化漏斗。

## 学习要点

- 📊 掌握 PV/UV 统计方法
- 🖱️ 学会点击行为追踪
- 📜 理解滚动深度采集
- ⏱️ 掌握页面停留时长统计
- 🛤️ 实现用户路径追踪

---

## 1. 用户行为指标体系

### 1.1 行为指标分类

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  用户行为指标分类                                                                      │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  页面访问指标                                                                     │ │
│  │  • PV (Page View) - 页面浏览量                                                  │ │
│  │  • UV (Unique Visitor) - 独立访客数                                             │ │
│  │  • IP - 独立 IP 数                                                              │ │
│  │  • 跳出率 - 只浏览一个页面就离开的比例                                           │ │
│  │  • 新访客比例 - 首次访问用户占比                                                 │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  交互行为指标                                                                     │ │
│  │  • 点击追踪 - 按钮点击、链接点击                                                │ │
│  │  • 滚动深度 - 页面滚动百分比                                                    │ │
│  │  • 页面停留时长 - 从进入到离开的时间                                            │ │
│  │  • 表单交互 - 填写开始、完成、放弃                                              │ │
│  │  • 热力图数据 - 点击位置分布                                                    │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  路径分析指标                                                                     │ │
│  │  • 访问路径 - 页面访问顺序                                                      │ │
│  │  • 来源分析 - 从哪里进入                                                        │ │
│  │  • 搜索关键词 - 搜索词分析                                                      │ │
│  │  • 转化漏斗 - 关键步骤完成率                                                    │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  设备与环境指标                                                                   │ │
│  │  • 设备类型 - PC/Mobile/Tablet                                                 │ │
│  │  • 浏览器类型 - Chrome/Safari/Firefox                                          │ │
│  │  • 操作系统 - Windows/macOS/iOS/Android                                        │ │
│  │  • 屏幕分辨率                                                                   │ │
│  │  • 网络类型 - 4G/5G/WiFi                                                       │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. PV/UV 统计

### 2.1 PV (Page View) 追踪

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// PV 追踪
// ────────────────────────────────────────────────────────────────────────────────────

class PVMonitor {
    constructor(reporter, options = {}) {
        this.reporter = reporter;
        this.options = {
            trackHashChange: true,      // 追踪 hash 变化
            trackPushState: true,       // 追踪 pushState
            trackPopState: true,        // 追踪 popstate
            trackReplaceState: false,   // 追踪 replaceState
            ...options
        };
        
        this.currentUrl = location.href;
        this.init();
    }
    
    init() {
        // 初始 PV
        this.trackPV('load');
        
        // 监听路由变化
        if (this.options.trackHashChange) {
            window.addEventListener('hashchange', () => this.trackPV('hashchange'));
        }
        
        if (this.options.trackPopState) {
            window.addEventListener('popstate', () => this.trackPV('popstate'));
        }
        
        // 劫持 pushState
        if (this.options.trackPushState) {
            this.interceptPushState();
        }
        
        // 劫持 replaceState
        if (this.options.trackReplaceState) {
            this.interceptReplaceState();
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 追踪 PV
    // ─────────────────────────────────────────────────────────────────────────────
    
    trackPV(trigger) {
        const oldUrl = this.currentUrl;
        this.currentUrl = location.href;
        
        // 避免重复上报
        if (oldUrl === this.currentUrl && trigger !== 'load') {
            return;
        }
        
        const pvData = {
            type: 'behavior',
            subType: 'pv',
            trigger: trigger,
            url: this.currentUrl,
            referrer: document.referrer,
            title: document.title,
            // 路由信息
            path: location.pathname,
            hash: location.hash,
            search: location.search,
            // 来源信息
            from: oldUrl,
            // 设备信息
            screenWidth: screen.width,
            screenHeight: screen.height,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            language: navigator.language,
            userAgent: navigator.userAgent,
            // 时间
            timestamp: Date.now()
        };
        
        // 解析 URL 参数
        pvData.queryParams = this.parseQuery(location.search);
        
        // 解析来源
        pvData.utm = this.parseUTM(location.search);
        
        // 上报
        this.report(pvData);
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 解析查询参数
    // ─────────────────────────────────────────────────────────────────────────────
    
    parseQuery(search) {
        const params = {};
        if (!search) return params;
        
        const searchParams = new URLSearchParams(search);
        for (const [key, value] of searchParams) {
            params[key] = value;
        }
        
        return params;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 解析 UTM 参数
    // ─────────────────────────────────────────────────────────────────────────────
    
    parseUTM(search) {
        const utm = {};
        const utmParams = [
            'utm_source',    // 来源
            'utm_medium',    // 媒介
            'utm_campaign',  // 活动
            'utm_term',      // 关键词
            'utm_content'    // 内容
        ];
        
        const searchParams = new URLSearchParams(search);
        utmParams.forEach(param => {
            const value = searchParams.get(param);
            if (value) {
                utm[param] = value;
            }
        });
        
        return utm;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 劫持 pushState
    // ─────────────────────────────────────────────────────────────────────────────
    
    interceptPushState() {
        const originalPushState = history.pushState;
        const self = this;
        
        history.pushState = function(state, title, url) {
            originalPushState.apply(this, arguments);
            self.trackPV('pushState');
        };
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 劫持 replaceState
    // ─────────────────────────────────────────────────────────────────────────────
    
    interceptReplaceState() {
        const originalReplaceState = history.replaceState;
        const self = this;
        
        history.replaceState = function(state, title, url) {
            originalReplaceState.apply(this, arguments);
            self.trackPV('replaceState');
        };
    }
    
    report(data) {
        if (this.reporter) {
            this.reporter.report(data);
        }
    }
}
```

### 2.2 UV (Unique Visitor) 统计

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// UV 统计
// ────────────────────────────────────────────────────────────────────────────────────

class UVMonitor {
    constructor(reporter) {
        this.reporter = reporter;
        this.init();
    }
    
    init() {
        // 获取或创建用户 ID
        this.userId = this.getOrCreateUserId();
        
        // 获取会话 ID
        this.sessionId = this.getOrCreateSessionId();
        
        // 判断是否是新用户
        this.isNewUser = this.checkIsNewUser();
        
        // 判断是否是新会话
        this.isNewSession = this.checkIsNewSession();
        
        // 上报用户信息
        this.reportUserInfo();
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 获取或创建用户 ID
    // ─────────────────────────────────────────────────────────────────────────────
    
    getOrCreateUserId() {
        // 尝试从多种存储获取
        let userId = this.getFromStorages('_uid');
        
        if (!userId) {
            // 生成新的用户 ID
            userId = this.generateId();
            // 存储到多个位置（cookie、localStorage）
            this.saveToStorages('_uid', userId, 365 * 24 * 60 * 60 * 1000);  // 1年
        }
        
        return userId;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 获取或创建会话 ID
    // ─────────────────────────────────────────────────────────────────────────────
    
    getOrCreateSessionId() {
        let sessionId = sessionStorage.getItem('_sid');
        
        if (!sessionId) {
            sessionId = this.generateId();
            sessionStorage.setItem('_sid', sessionId);
            
            // 记录会话开始时间
            sessionStorage.setItem('_session_start', Date.now().toString());
        }
        
        return sessionId;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 检查是否是新用户
    // ─────────────────────────────────────────────────────────────────────────────
    
    checkIsNewUser() {
        // 如果之前没有用户 ID，说明是新用户
        return !this.getFromStorages('_uid_visited');
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 检查是否是新会话
    // ─────────────────────────────────────────────────────────────────────────────
    
    checkIsNewSession() {
        const sessionStart = sessionStorage.getItem('_session_start');
        if (!sessionStart) return true;
        
        // 会话超时时间（30分钟）
        const SESSION_TIMEOUT = 30 * 60 * 1000;
        
        return Date.now() - parseInt(sessionStart, 10) > SESSION_TIMEOUT;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 生成唯一 ID
    // ─────────────────────────────────────────────────────────────────────────────
    
    generateId() {
        return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 存储相关
    // ─────────────────────────────────────────────────────────────────────────────
    
    getFromStorages(key) {
        // 优先从 localStorage 获取
        let value = localStorage.getItem(key);
        if (value) return value;
        
        // 尝试从 cookie 获取
        value = this.getCookie(key);
        return value;
    }
    
    saveToStorages(key, value, maxAge) {
        // 保存到 localStorage
        localStorage.setItem(key, value);
        
        // 标记已访问
        localStorage.setItem(`${key}_visited`, 'true');
        
        // 保存到 cookie
        this.setCookie(key, value, maxAge);
    }
    
    getCookie(name) {
        const matches = document.cookie.match(new RegExp(
            `(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1')}=([^;]*)`
        ));
        return matches ? decodeURIComponent(matches[1]) : null;
    }
    
    setCookie(name, value, maxAge) {
        const expires = new Date(Date.now() + maxAge).toUTCString();
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 上报用户信息
    // ─────────────────────────────────────────────────────────────────────────────
    
    reportUserInfo() {
        const data = {
            type: 'behavior',
            subType: 'user',
            userId: this.userId,
            sessionId: this.sessionId,
            isNewUser: this.isNewUser,
            isNewSession: this.isNewSession,
            timestamp: Date.now()
        };
        
        this.report(data);
    }
    
    report(data) {
        if (this.reporter) {
            this.reporter.report(data);
        }
    }
    
    // 获取用户 ID
    getUserId() {
        return this.userId;
    }
    
    // 获取会话 ID
    getSessionId() {
        return this.sessionId;
    }
}
```

---

## 3. 点击追踪

### 3.1 点击行为采集

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 点击追踪
// ────────────────────────────────────────────────────────────────────────────────────

class ClickMonitor {
    constructor(reporter, options = {}) {
        this.reporter = reporter;
        this.options = {
            captureAll: true,           // 是否捕获所有点击
            targetSelectors: [],        // 指定捕获的元素选择器
            excludeSelectors: [],       // 排除的选择器
            maxTextLength: 50,          // 文本最大长度
            capturePath: true,          // 是否捕获元素路径
            captureXPath: false,        // 是否捕获 XPath
            capturePosition: true,      // 是否捕获点击位置
            ...options
        };
        
        this.init();
    }
    
    init() {
        document.addEventListener('click', this.handleClick.bind(this), true);
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 处理点击事件
    // ─────────────────────────────────────────────────────────────────────────────
    
    handleClick(event) {
        const target = event.target;
        
        // 检查是否应该排除
        if (this.shouldExclude(target)) {
            return;
        }
        
        // 检查是否是指定元素
        if (!this.shouldCapture(target)) {
            return;
        }
        
        const clickData = {
            type: 'behavior',
            subType: 'click',
            // 元素信息
            tagName: target.tagName.toLowerCase(),
            className: target.className,
            id: target.id,
            text: this.getElementText(target),
            href: target.href || target.closest('a')?.href,
            // 位置信息
            x: this.options.capturePosition ? event.clientX : undefined,
            y: this.options.capturePosition ? event.clientY : undefined,
            pageX: this.options.capturePosition ? event.pageX : undefined,
            pageY: this.options.capturePosition ? event.pageY : undefined,
            // 元素路径
            path: this.options.capturePath ? this.getElementPath(target) : undefined,
            // XPath
            xpath: this.options.captureXPath ? this.getXPath(target) : undefined,
            // 时间
            timestamp: Date.now()
        };
        
        // 判断点击类型
        clickData.clickType = this.getClickType(target);
        
        // 如果是链接，添加特殊处理
        if (target.tagName === 'A' || target.closest('a')) {
            const link = target.tagName === 'A' ? target : target.closest('a');
            clickData.linkUrl = link.href;
            clickData.linkTarget = link.target;
            clickData.isExternal = this.isExternalLink(link.href);
            clickData.isDownload = link.hasAttribute('download');
        }
        
        // 如果是按钮，添加特殊处理
        if (target.tagName === 'BUTTON' || target.type === 'button' || target.type === 'submit') {
            clickData.buttonType = target.type;
            clickData.buttonName = target.name;
            clickData.buttonValue = target.value;
            clickData.formAction = target.formAction;
        }
        
        this.report(clickData);
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 辅助方法
    // ─────────────────────────────────────────────────────────────────────────────
    
    shouldExclude(target) {
        for (const selector of this.options.excludeSelectors) {
            if (target.matches && target.matches(selector)) {
                return true;
            }
        }
        return false;
    }
    
    shouldCapture(target) {
        if (this.options.captureAll) {
            return true;
        }
        
        for (const selector of this.options.targetSelectors) {
            if (target.matches && target.matches(selector)) {
                return true;
            }
        }
        return false;
    }
    
    getElementText(element) {
        // 获取元素的文本内容
        const text = element.innerText || element.textContent || element.value || '';
        return text.trim().slice(0, this.options.maxTextLength);
    }
    
    getElementPath(element) {
        const path = [];
        let current = element;
        
        while (current && current !== document.body) {
            const selector = this.getElementSelector(current);
            path.unshift(selector);
            current = current.parentElement;
        }
        
        return path.join(' > ');
    }
    
    getElementSelector(element) {
        if (element.id) {
            return `#${element.id}`;
        }
        
        const tagName = element.tagName.toLowerCase();
        
        if (element.className && typeof element.className === 'string') {
            const classes = element.className.split(' ').filter(Boolean);
            if (classes.length > 0) {
                return `${tagName}.${classes.slice(0, 2).join('.')}`;
            }
        }
        
        return tagName;
    }
    
    getXPath(element) {
        if (element.id) {
            return `//*[@id="${element.id}"]`;
        }
        
        const parts = [];
        let current = element;
        
        while (current && current.nodeType === Node.ELEMENT_NODE) {
            let index = 1;
            let sibling = current.previousSibling;
            
            while (sibling) {
                if (sibling.nodeType === Node.ELEMENT_NODE && 
                    sibling.tagName === current.tagName) {
                    index++;
                }
                sibling = sibling.previousSibling;
            }
            
            const tagName = current.tagName.toLowerCase();
            const indexStr = index > 1 ? `[${index}]` : '';
            parts.unshift(`${tagName}${indexStr}`);
            
            current = current.parentNode;
        }
        
        return `/${parts.join('/')}`;
    }
    
    getClickType(target) {
        const tagName = target.tagName.toLowerCase();
        
        if (tagName === 'a') return 'link';
        if (tagName === 'button') return 'button';
        if (tagName === 'input') {
            if (target.type === 'submit') return 'submit';
            if (target.type === 'button') return 'button';
            return 'input';
        }
        if (tagName === 'img') return 'image';
        if (tagName === 'select') return 'select';
        if (tagName === 'textarea') return 'textarea';
        
        return 'other';
    }
    
    isExternalLink(url) {
        try {
            const linkUrl = new URL(url);
            return linkUrl.hostname !== location.hostname;
        } catch (e) {
            return false;
        }
    }
    
    report(data) {
        if (this.reporter) {
            this.reporter.report(data);
        }
    }
    
    destroy() {
        document.removeEventListener('click', this.handleClick, true);
    }
}
```

### 3.2 热力图数据采集

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 热力图数据采集
// ────────────────────────────────────────────────────────────────────────────────────

class HeatmapMonitor {
    constructor(reporter, options = {}) {
        this.reporter = reporter;
        this.options = {
            sampleRate: 0.1,            // 采样率
            gridSize: 20,               // 网格大小（像素）
            reportInterval: 30000,      // 上报间隔
            ...options
        };
        
        this.clickData = [];
        this.moveData = [];
        this.scrollData = [];
        
        this.init();
    }
    
    init() {
        // 采样检查
        if (Math.random() > this.options.sampleRate) {
            return;
        }
        
        // 监听点击
        document.addEventListener('click', this.handleClick.bind(this), true);
        
        // 监听鼠标移动
        document.addEventListener('mousemove', this.handleMouseMove.bind(this), true);
        
        // 监听滚动
        window.addEventListener('scroll', this.handleScroll.bind(this), true);
        
        // 定时上报
        this.reportTimer = setInterval(() => this.flush(), this.options.reportInterval);
        
        // 页面隐藏时上报
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.flush();
            }
        });
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 处理点击
    // ─────────────────────────────────────────────────────────────────────────────
    
    handleClick(event) {
        const gridX = Math.floor(event.clientX / this.options.gridSize);
        const gridY = Math.floor(event.clientY / this.options.gridSize);
        
        this.clickData.push({
            x: gridX,
            y: gridY,
            pageX: event.pageX,
            pageY: event.pageY,
            timestamp: Date.now()
        });
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 处理鼠标移动
    // ─────────────────────────────────────────────────────────────────────────────
    
    handleMouseMove(event) {
        // 采样：只记录部分移动数据
        if (Math.random() > 0.01) return;
        
        const gridX = Math.floor(event.clientX / this.options.gridSize);
        const gridY = Math.floor(event.clientY / this.options.gridSize);
        
        this.moveData.push({
            x: gridX,
            y: gridY,
            timestamp: Date.now()
        });
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 处理滚动
    // ─────────────────────────────────────────────────────────────────────────────
    
    handleScroll(event) {
        const scrollTop = window.scrollY;
        const scrollLeft = window.scrollX;
        
        this.scrollData.push({
            top: scrollTop,
            left: scrollLeft,
            timestamp: Date.now()
        });
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 上报数据
    // ─────────────────────────────────────────────────────────────────────────────
    
    flush() {
        if (this.clickData.length === 0 && 
            this.moveData.length === 0 && 
            this.scrollData.length === 0) {
            return;
        }
        
        const data = {
            type: 'behavior',
            subType: 'heatmap',
            clicks: this.aggregateData(this.clickData),
            moves: this.aggregateData(this.moveData),
            scrolls: this.scrollData.slice(-10),  // 只保留最近 10 条
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            document: {
                width: document.documentElement.scrollWidth,
                height: document.documentElement.scrollHeight
            },
            timestamp: Date.now()
        };
        
        this.report(data);
        
        // 清空数据
        this.clickData = [];
        this.moveData = [];
        this.scrollData = [];
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 聚合数据（按网格）
    // ─────────────────────────────────────────────────────────────────────────────
    
    aggregateData(data) {
        const grid = {};
        
        data.forEach(item => {
            const key = `${item.x},${item.y}`;
            if (!grid[key]) {
                grid[key] = { x: item.x, y: item.y, count: 0 };
            }
            grid[key].count++;
        });
        
        return Object.values(grid);
    }
    
    report(data) {
        if (this.reporter) {
            this.reporter.report(data);
        }
    }
    
    destroy() {
        document.removeEventListener('click', this.handleClick, true);
        document.removeEventListener('mousemove', this.handleMouseMove, true);
        window.removeEventListener('scroll', this.handleScroll, true);
        
        if (this.reportTimer) {
            clearInterval(this.reportTimer);
        }
    }
}
```

---

## 4. 滚动深度追踪

### 4.1 滚动深度采集

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 滚动深度追踪
// ────────────────────────────────────────────────────────────────────────────────────

class ScrollMonitor {
    constructor(reporter, options = {}) {
        this.reporter = reporter;
        this.options = {
            thresholds: [25, 50, 75, 90, 100],  // 阈值百分比
            debounceTime: 100,                   // 防抖时间
            reportFinal: true,                   // 是否上报最终深度
            trackDirection: true,                // 是否追踪滚动方向
            ...options
        };
        
        this.maxDepth = 0;
        this.reportedDepths = new Set();
        this.scrollEvents = [];
        this.lastScrollTop = 0;
        this.lastScrollTime = 0;
        
        this.init();
    }
    
    init() {
        let scrollTimeout = null;
        
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(() => this.handleScroll(), this.options.debounceTime);
        }, { passive: true });
        
        // 页面隐藏时上报最终深度
        if (this.options.reportFinal) {
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'hidden') {
                    this.reportFinalDepth();
                }
            });
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 处理滚动
    // ─────────────────────────────────────────────────────────────────────────────
    
    handleScroll() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const viewportHeight = window.innerHeight;
        
        // 计算滚动百分比
        const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
        
        // 更新最大深度
        if (scrollPercent > this.maxDepth) {
            this.maxDepth = scrollPercent;
        }
        
        // 记录滚动事件
        if (this.options.trackDirection) {
            this.recordScrollEvent(scrollTop);
        }
        
        // 检查阈值
        this.checkThresholds(scrollPercent, scrollTop, docHeight, viewportHeight);
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 检查阈值
    // ─────────────────────────────────────────────────────────────────────────────
    
    checkThresholds(percent, scrollTop, docHeight, viewportHeight) {
        this.options.thresholds.forEach(threshold => {
            if (percent >= threshold && !this.reportedDepths.has(threshold)) {
                this.reportedDepths.add(threshold);
                
                const data = {
                    type: 'behavior',
                    subType: 'scroll',
                    depth: threshold,
                    maxDepth: this.maxDepth,
                    scrollTop: scrollTop,
                    docHeight: docHeight,
                    viewportHeight: viewportHeight,
                    timestamp: Date.now()
                };
                
                // 添加滚动方向统计
                if (this.options.trackDirection) {
                    data.direction = this.getScrollDirection();
                }
                
                this.report(data);
            }
        });
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 记录滚动事件
    // ─────────────────────────────────────────────────────────────────────────────
    
    recordScrollEvent(scrollTop) {
        const now = Date.now();
        const direction = scrollTop > this.lastScrollTop ? 'down' : 'up';
        const distance = Math.abs(scrollTop - this.lastScrollTop);
        const timeDelta = now - this.lastScrollTime;
        const speed = timeDelta > 0 ? distance / timeDelta : 0;
        
        this.scrollEvents.push({
            scrollTop,
            direction,
            distance,
            speed: speed.toFixed(2),
            timestamp: now
        });
        
        // 只保留最近 50 条
        if (this.scrollEvents.length > 50) {
            this.scrollEvents.shift();
        }
        
        this.lastScrollTop = scrollTop;
        this.lastScrollTime = now;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 获取滚动方向统计
    // ─────────────────────────────────────────────────────────────────────────────
    
    getScrollDirection() {
        const lastEvent = this.scrollEvents[this.scrollEvents.length - 1];
        return lastEvent ? lastEvent.direction : 'unknown';
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 上报最终深度
    // ─────────────────────────────────────────────────────────────────────────────
    
    reportFinalDepth() {
        if (this.maxDepth === 0) return;
        
        const data = {
            type: 'behavior',
            subType: 'scroll-final',
            maxDepth: this.maxDepth,
            reachedDepths: [...this.reportedDepths].sort((a, b) => a - b),
            scrollCount: this.scrollEvents.length,
            duration: Date.now() - this.getStartTime(),
            timestamp: Date.now()
        };
        
        // 滚动统计
        if (this.scrollEvents.length > 0) {
            const downCount = this.scrollEvents.filter(e => e.direction === 'down').length;
            const upCount = this.scrollEvents.filter(e => e.direction === 'up').length;
            const totalDistance = this.scrollEvents.reduce((sum, e) => sum + e.distance, 0);
            const avgSpeed = this.scrollEvents.reduce((sum, e) => sum + parseFloat(e.speed), 0) / this.scrollEvents.length;
            
            data.statistics = {
                downCount,
                upCount,
                totalDistance,
                avgSpeed: avgSpeed.toFixed(2)
            };
        }
        
        this.report(data);
    }
    
    getStartTime() {
        return performance.timing.navigationStart;
    }
    
    report(data) {
        if (this.reporter) {
            this.reporter.report(data);
        }
    }
    
    destroy() {
        this.scrollEvents = [];
    }
}
```

---

## 5. 页面停留时长

### 5.1 停留时长采集

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 页面停留时长追踪
// ────────────────────────────────────────────────────────────────────────────────────

class StayTimeMonitor {
    constructor(reporter, options = {}) {
        this.reporter = reporter;
        this.options = {
            heartbeatInterval: 30000,    // 心跳间隔
            reportOnUnload: true,        // 卸载时上报
            trackActiveTime: true,       // 追踪活跃时间
            idleThreshold: 30000,        // 空闲阈值
            ...options
        };
        
        this.pageStartTime = Date.now();
        this.activeStartTime = Date.now();
        this.totalActiveTime = 0;
        this.lastActiveTime = Date.now();
        this.isPageVisible = !document.hidden;
        
        this.init();
    }
    
    init() {
        // 监听页面可见性
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
        
        // 监听页面卸载
        if (this.options.reportOnUnload) {
            window.addEventListener('beforeunload', this.handleUnload.bind(this));
            window.addEventListener('pagehide', this.handlePageHide.bind(this));
        }
        
        // 监听用户活动
        if (this.options.trackActiveTime) {
            this.trackUserActivity();
        }
        
        // 心跳上报
        this.startHeartbeat();
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 处理可见性变化
    // ─────────────────────────────────────────────────────────────────────────────
    
    handleVisibilityChange() {
        const isVisible = !document.hidden;
        
        if (isVisible) {
            // 页面变为可见
            this.activeStartTime = Date.now();
            this.isPageVisible = true;
        } else {
            // 页面变为隐藏
            if (this.isPageVisible) {
                this.totalActiveTime += Date.now() - this.activeStartTime;
            }
            this.isPageVisible = false;
            
            // 上报停留时长
            this.reportStayTime('visibilitychange');
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 处理页面卸载
    // ─────────────────────────────────────────────────────────────────────────────
    
    handleUnload() {
        this.reportStayTime('unload');
    }
    
    handlePageHide() {
        this.reportStayTime('pagehide');
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 追踪用户活动
    // ─────────────────────────────────────────────────────────────────────────────
    
    trackUserActivity() {
        const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
        
        const onActivity = () => {
            this.lastActiveTime = Date.now();
        };
        
        events.forEach(event => {
            document.addEventListener(event, onActivity, { passive: true });
        });
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 判断用户是否活跃
    // ─────────────────────────────────────────────────────────────────────────────
    
    isUserActive() {
        return Date.now() - this.lastActiveTime < this.options.idleThreshold;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 开始心跳
    // ─────────────────────────────────────────────────────────────────────────────
    
    startHeartbeat() {
        this.heartbeatTimer = setInterval(() => {
            this.reportStayTime('heartbeat');
        }, this.options.heartbeatInterval);
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 上报停留时长
    // ─────────────────────────────────────────────────────────────────────────────
    
    reportStayTime(trigger) {
        const now = Date.now();
        const totalTime = now - this.pageStartTime;
        
        // 计算活跃时间
        let activeTime = this.totalActiveTime;
        if (this.isPageVisible) {
            activeTime += now - this.activeStartTime;
        }
        
        const data = {
            type: 'behavior',
            subType: 'stay-time',
            trigger: trigger,
            url: location.href,
            // 时间
            totalTime: totalTime,
            activeTime: activeTime,
            idleTime: totalTime - activeTime,
            activeRatio: totalTime > 0 ? (activeTime / totalTime).toFixed(2) : 0,
            // 页面状态
            isPageVisible: this.isPageVisible,
            isUserActive: this.isUserActive(),
            timestamp: now
        };
        
        this.report(data);
    }
    
    report(data) {
        if (this.reporter) {
            this.reporter.report(data);
        }
    }
    
    destroy() {
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        window.removeEventListener('beforeunload', this.handleUnload);
        window.removeEventListener('pagehide', this.handlePageHide);
        
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
        }
    }
}
```

---

## 6. 用户路径追踪

### 6.1 路径追踪实现

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 用户路径追踪
// ────────────────────────────────────────────────────────────────────────────────────

class PathMonitor {
    constructor(reporter, options = {}) {
        this.reporter = reporter;
        this.options = {
            maxPathLength: 50,          // 最大路径长度
            reportInterval: 60000,      // 上报间隔
            trackEvents: ['click', 'scroll', 'form', 'navigation'],
            ...options
        };
        
        this.path = [];
        this.currentPath = [];
        
        this.init();
    }
    
    init() {
        // 监听各种事件
        if (this.options.trackEvents.includes('click')) {
            document.addEventListener('click', this.trackClick.bind(this), true);
        }
        
        if (this.options.trackEvents.includes('form')) {
            this.trackFormEvents();
        }
        
        // 监听路由变化
        this.trackNavigation();
        
        // 定时上报
        this.reportTimer = setInterval(() => this.flush(), this.options.reportInterval);
        
        // 页面隐藏时上报
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.flush();
            }
        });
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 追踪点击
    // ─────────────────────────────────────────────────────────────────────────────
    
    trackClick(event) {
        this.addEvent({
            type: 'click',
            target: event.target.tagName.toLowerCase(),
            text: (event.target.innerText || '').slice(0, 30),
            href: event.target.href || event.target.closest('a')?.href
        });
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 追踪表单事件
    // ─────────────────────────────────────────────────────────────────────────────
    
    trackFormEvents() {
        // 表单开始
        document.addEventListener('focusin', (event) => {
            const target = event.target;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
                const form = target.closest('form');
                if (form && !form._tracked) {
                    form._tracked = true;
                    this.addEvent({
                        type: 'form-start',
                        formId: form.id,
                        formName: form.name
                    });
                }
            }
        }, true);
        
        // 表单提交
        document.addEventListener('submit', (event) => {
            const form = event.target;
            this.addEvent({
                type: 'form-submit',
                formId: form.id,
                formName: form.name
            });
        }, true);
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 追踪导航
    // ─────────────────────────────────────────────────────────────────────────────
    
    trackNavigation() {
        // 监听 hashchange
        window.addEventListener('hashchange', () => {
            this.addEvent({
                type: 'navigation',
                url: location.href,
                trigger: 'hashchange'
            });
        });
        
        // 劫持 pushState
        const originalPushState = history.pushState;
        const self = this;
        
        history.pushState = function(...args) {
            originalPushState.apply(this, args);
            self.addEvent({
                type: 'navigation',
                url: location.href,
                trigger: 'pushState'
            });
        };
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 添加事件
    // ─────────────────────────────────────────────────────────────────────────────
    
    addEvent(event) {
        const pathEvent = {
            ...event,
            url: location.href,
            path: location.pathname,
            timestamp: Date.now()
        };
        
        this.path.push(pathEvent);
        this.currentPath.push(pathEvent);
        
        // 限制长度
        if (this.path.length > this.options.maxPathLength) {
            this.path.shift();
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 上报
    // ─────────────────────────────────────────────────────────────────────────────
    
    flush() {
        if (this.currentPath.length === 0) return;
        
        const data = {
            type: 'behavior',
            subType: 'path',
            path: this.currentPath,
            pathLength: this.currentPath.length,
            duration: this.currentPath.length > 0 
                ? this.currentPath[this.currentPath.length - 1].timestamp - this.currentPath[0].timestamp 
                : 0,
            timestamp: Date.now()
        };
        
        this.report(data);
        
        // 清空当前路径
        this.currentPath = [];
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

## 7. 完整用户行为监控类

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 完整用户行为监控类
// ────────────────────────────────────────────────────────────────────────────────────

class BehaviorMonitor {
    constructor(options = {}) {
        this.options = {
            capturePV: true,
            captureUV: true,
            captureClick: true,
            captureScroll: true,
            captureStayTime: true,
            captureHeatmap: false,
            capturePath: false,
            ...options
        };
        
        this.reporter = options.reporter;
        this.monitors = {};
        
        this.init();
    }
    
    init() {
        // PV 追踪
        if (this.options.capturePV) {
            this.monitors.pv = new PVMonitor(this.reporter, this.options.pvOptions);
        }
        
        // UV 统计
        if (this.options.captureUV) {
            this.monitors.uv = new UVMonitor(this.reporter);
        }
        
        // 点击追踪
        if (this.options.captureClick) {
            this.monitors.click = new ClickMonitor(this.reporter, this.options.clickOptions);
        }
        
        // 滚动追踪
        if (this.options.captureScroll) {
            this.monitors.scroll = new ScrollMonitor(this.reporter, this.options.scrollOptions);
        }
        
        // 停留时长
        if (this.options.captureStayTime) {
            this.monitors.stayTime = new StayTimeMonitor(this.reporter, this.options.stayTimeOptions);
        }
        
        // 热力图
        if (this.options.captureHeatmap) {
            this.monitors.heatmap = new HeatmapMonitor(this.reporter, this.options.heatmapOptions);
        }
        
        // 路径追踪
        if (this.options.capturePath) {
            this.monitors.path = new PathMonitor(this.reporter, this.options.pathOptions);
        }
    }
    
    // 获取用户 ID
    getUserId() {
        return this.monitors.uv?.getUserId();
    }
    
    // 获取会话 ID
    getSessionId() {
        return this.monitors.uv?.getSessionId();
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

export default BehaviorMonitor;
```

---

## 最佳实践

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  用户行为监控最佳实践                                                                  │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  数据采集                                                                              │
│  □ 使用事件委托减少监听器数量                                                         │
│  □ 设置合理的采样率                                                                   │
│  □ 批量上报减少请求                                                                   │
│  □ 使用 passive 监听器优化滚动性能                                                    │
│                                                                                       │
│  用户标识                                                                              │
│  □ 使用多存储策略确保标识持久化                                                       │
│  □ 区分用户 ID 和会话 ID                                                             │
│  □ 设置合理的会话超时时间                                                             │
│                                                                                       │
│  隐私保护                                                                              │
│  □ 不采集敏感信息                                                                     │
│  □ 遵守隐私法规（GDPR、CCPA）                                                        │
│  □ 提供用户选择退出的选项                                                             │
│                                                                                       │
│  数据分析                                                                              │
│  □ 建立用户画像                                                                       │
│  □ 分析用户路径                                                                       │
│  □ 优化关键转化漏斗                                                                   │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

[返回上级目录](../index.md)
