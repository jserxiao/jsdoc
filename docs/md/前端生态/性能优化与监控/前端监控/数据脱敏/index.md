# 数据脱敏

> 数据脱敏通过过滤和替换敏感信息，确保上报数据不包含用户隐私，符合数据安全法规要求。

## 学习要点

- 🔒 掌握敏感字段识别
- 🔄 理解数据脱敏策略
- 📝 学会正则匹配脱敏
- 🌐 掌握 URL 参数脱敏

---

## 1. 敏感信息分类

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  敏感信息分类                                                                          │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  个人身份信息 (PII)                                                              │ │
│  │  • 姓名、手机号、邮箱                                                           │ │
│  │  • 身份证号、护照号                                                             │ │
│  │  • 银行卡号、信用卡号                                                           │ │
│  │  • 地址、IP 地址                                                               │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  认证信息                                                                        │ │
│  │  • 密码、密钥                                                                   │ │
│  │  • Token、Session ID                                                           │ │
│  │  • API Key、Secret                                                             │ │
│  │  • 私钥、证书                                                                   │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  业务数据                                                                        │ │
│  │  • 订单号、交易号                                                               │ │
│  │  • 金额、余额                                                                   │ │
│  │  • 业务 ID、客户 ID                                                             │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  其他敏感信息                                                                    │ │
│  │  • URL 中的敏感参数                                                             │ │
│  │  • Cookie 中的敏感值                                                            │ │
│  │  • 请求体中的敏感字段                                                           │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. 数据脱敏实现

### 2.1 基础脱敏类

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 数据脱敏类
// ────────────────────────────────────────────────────────────────────────────────────

class DataSanitizer {
    constructor(config = {}) {
        this.config = {
            // 敏感字段名列表
            sensitiveFields: [
                // 认证相关
                'password', 'passwd', 'pwd', 'pass',
                'secret', 'token', 'access_token', 'refresh_token', 'auth_token',
                'apiKey', 'api_key', 'api-key', 'apiSecret', 'api_secret',
                'privateKey', 'private_key', 'private-key',
                'session', 'sessionId', 'session_id',
                
                // 个人信息
                'phone', 'mobile', 'tel', 'telephone',
                'email', 'mail',
                'idCard', 'id_card', 'id-card', 'identity',
                'name', 'realName', 'real_name', 'username',
                'address', 'addr',
                
                // 金融信息
                'creditCard', 'credit_card', 'cardNumber', 'card_number',
                'bankCard', 'bank_card', 'bankAccount', 'bank_account',
                'cvv', 'cvv2',
                
                // 其他
                'ssn', 'social_security',
                'license', 'passport'
            ],
            
            // 敏感正则匹配模式
            sensitivePatterns: [
                // 邮箱
                /\b[\w._%+-]+@[\w.-]+\.[A-Za-z]{2,}\b/g,
                
                // 手机号（中国大陆）
                /\b1[3-9]\d{9}\b/g,
                
                // 身份证号
                /\b\d{17}[\dXx]\b/g,
                
                // 银行卡号（16-19位）
                /\b\d{16,19}\b/g,
                
                // URL 中的敏感参数
                /(?:password|token|secret|key|apiKey|api_key)=[^&\s]+/gi,
                
                // Cookie 中的敏感值
                /(?:session|token|auth)=[^;]+/gi
            ],
            
            // 脱敏替换文本
            maskText: '******',
            
            // 是否脱敏 URL 参数
            maskUrlParams: true,
            
            // 是否脱敏请求体
            maskRequestBody: true,
            
            // 是否脱敏响应体
            maskResponseBody: true,
            
            // 最大字符串长度（防止过大字符串）
            maxStringLength: 10000,
            
            // 是否脱敏堆栈信息
            maskStackTrace: false,
            
            ...config
        };
        
        // 编译字段名匹配正则
        this.fieldRegex = this.buildFieldRegex();
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 构建字段名匹配正则
    // ─────────────────────────────────────────────────────────────────────────────
    
    buildFieldRegex() {
        const patterns = this.config.sensitiveFields.map(field => {
            const normalized = field.toLowerCase().replace(/[-_]/g, '');
            return {
                field: field,
                regex: new RegExp(normalized, 'i')
            };
        });
        
        return patterns;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 脱敏数据
    // ─────────────────────────────────────────────────────────────────────────────
    
    sanitize(data) {
        if (!data || typeof data !== 'object') {
            return data;
        }
        
        const result = {};
        
        for (const [key, value] of Object.entries(data)) {
            // 跳过内部字段
            if (key.startsWith('_')) {
                result[key] = value;
                continue;
            }
            
            // 递归脱敏
            result[key] = this.sanitizeValue(key, value);
        }
        
        return result;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 脱敏值
    // ─────────────────────────────────────────────────────────────────────────────
    
    sanitizeValue(key, value) {
        // 空值
        if (value === null || value === undefined) {
            return value;
        }
        
        // 检查字段名是否敏感
        if (this.isSensitiveField(key)) {
            return this.config.maskText;
        }
        
        // 字符串处理
        if (typeof value === 'string') {
            return this.sanitizeString(value);
        }
        
        // 数组处理
        if (Array.isArray(value)) {
            return value.map((item, index) => 
                this.sanitizeValue(`${key}[${index}]`, item)
            );
        }
        
        // 对象处理
        if (typeof value === 'object') {
            return this.sanitize(value);
        }
        
        return value;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 检查字段名是否敏感
    // ─────────────────────────────────────────────────────────────────────────────
    
    isSensitiveField(fieldName) {
        if (!fieldName) return false;
        
        const normalized = fieldName.toLowerCase().replace(/[-_]/g, '');
        
        return this.fieldRegex.some(({ regex }) => regex.test(normalized));
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 脱敏字符串
    // ─────────────────────────────────────────────────────────────────────────────
    
    sanitizeString(str) {
        if (!str) return str;
        
        // 限制长度
        if (str.length > this.config.maxStringLength) {
            str = str.slice(0, this.config.maxStringLength) + '...[truncated]';
        }
        
        // 应用敏感正则
        for (const pattern of this.config.sensitivePatterns) {
            str = str.replace(pattern, this.config.maskText);
        }
        
        return str;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 脱敏 URL
    // ─────────────────────────────────────────────────────────────────────────────
    
    sanitizeUrl(url) {
        if (!url) return url;
        
        try {
            const urlObj = new URL(url, location.origin);
            
            // 脱敏查询参数
            if (this.config.maskUrlParams) {
                const params = new URLSearchParams(urlObj.search);
                const newParams = new URLSearchParams();
                
                for (const [key, value] of params) {
                    if (this.isSensitiveField(key)) {
                        newParams.set(key, this.config.maskText);
                    } else {
                        newParams.set(key, this.sanitizeString(value));
                    }
                }
                
                urlObj.search = newParams.toString();
            }
            
            // 移除 hash 中的敏感信息
            if (urlObj.hash) {
                urlObj.hash = this.sanitizeString(urlObj.hash);
            }
            
            return urlObj.toString();
        } catch (e) {
            // 无效 URL，进行字符串脱敏
            return this.sanitizeString(url);
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 脱敏请求体
    // ─────────────────────────────────────────────────────────────────────────────
    
    sanitizeBody(body, contentType = '') {
        if (!body) return body;
        
        // JSON
        if (contentType.includes('application/json') || 
            (typeof body === 'string' && this.isJsonString(body))) {
            try {
                const parsed = typeof body === 'string' ? JSON.parse(body) : body;
                const sanitized = this.sanitize(parsed);
                return typeof body === 'string' ? JSON.stringify(sanitized) : sanitized;
            } catch (e) {
                return this.sanitizeString(String(body));
            }
        }
        
        // Form Data
        if (contentType.includes('application/x-www-form-urlencoded') || 
            typeof body === 'string' && body.includes('=')) {
            try {
                const params = new URLSearchParams(body);
                const newParams = new URLSearchParams();
                
                for (const [key, value] of params) {
                    if (this.isSensitiveField(key)) {
                        newParams.set(key, this.config.maskText);
                    } else {
                        newParams.set(key, this.sanitizeString(value));
                    }
                }
                
                return newParams.toString();
            } catch (e) {
                return this.sanitizeString(String(body));
            }
        }
        
        // FormData 对象
        if (body instanceof FormData) {
            const newFormData = new FormData();
            
            for (const [key, value] of body) {
                if (this.isSensitiveField(key)) {
                    newFormData.append(key, this.config.maskText);
                } else if (typeof value === 'string') {
                    newFormData.append(key, this.sanitizeString(value));
                } else {
                    newFormData.append(key, value);
                }
            }
            
            return newFormData;
        }
        
        // 其他类型
        return this.sanitizeString(String(body));
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 脱敏 Cookie
    // ─────────────────────────────────────────────────────────────────────────────
    
    sanitizeCookie(cookie) {
        if (!cookie) return cookie;
        
        return cookie.replace(/([^;=]+)=([^;]*)/g, (match, name, value) => {
            if (this.isSensitiveField(name)) {
                return `${name}=${this.config.maskText}`;
            }
            return `${name}=${this.sanitizeString(value)}`;
        });
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 脱敏堆栈
    // ─────────────────────────────────────────────────────────────────────────────
    
    sanitizeStackTrace(stack) {
        if (!stack || !this.config.maskStackTrace) return stack;
        
        // 脱敏堆栈中的文件路径
        return stack.replace(/at\s+.*?\((.*?)\)/g, (match, path) => {
            const sanitizedPath = this.sanitizeUrl(path);
            return match.replace(path, sanitizedPath);
        });
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 辅助方法
    // ─────────────────────────────────────────────────────────────────────────────
    
    isJsonString(str) {
        if (typeof str !== 'string') return false;
        
        const trimmed = str.trim();
        return (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
               (trimmed.startsWith('[') && trimmed.endsWith(']'));
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 添加自定义敏感字段
    // ─────────────────────────────────────────────────────────────────────────────
    
    addSensitiveField(field) {
        if (!this.config.sensitiveFields.includes(field)) {
            this.config.sensitiveFields.push(field);
            this.fieldRegex = this.buildFieldRegex();
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 添加自定义敏感模式
    // ─────────────────────────────────────────────────────────────────────────────
    
    addSensitivePattern(pattern) {
        if (pattern instanceof RegExp) {
            this.config.sensitivePatterns.push(pattern);
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 移除敏感字段
    // ─────────────────────────────────────────────────────────────────────────────
    
    removeSensitiveField(field) {
        const index = this.config.sensitiveFields.indexOf(field);
        if (index > -1) {
            this.config.sensitiveFields.splice(index, 1);
            this.fieldRegex = this.buildFieldRegex();
        }
    }
}

export default DataSanitizer;
```

---

## 3. 高级脱敏策略

### 3.1 部分脱敏

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 部分脱敏 - 保留部分信息用于调试
// ────────────────────────────────────────────────────────────────────────────────────

class PartialSanitizer extends DataSanitizer {
    constructor(config = {}) {
        super(config);
        
        this.partialConfig = {
            // 手机号：显示前3后4
            phone: {
                pattern: /(\d{3})\d{4}(\d{4})/g,
                replacement: '$1****$2'
            },
            // 邮箱：显示前3后缀
            email: {
                pattern: /([\w.]{3})[\w.]+@([\w.]+)/g,
                replacement: '$1***@$2'
            },
            // 身份证：显示前6后4
            idCard: {
                pattern: /(\d{6})\d{8}(\d{4})/g,
                replacement: '$1********$2'
            },
            // 银行卡：显示后4
            bankCard: {
                pattern: /\d{12,15}(\d{4})/g,
                replacement: '****$1'
            },
            // 姓名：显示姓
            name: {
                pattern: /(.{1})(.{1,})/g,
                replacement: '$1*'
            },
            ...config.partialConfig
        };
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 部分脱敏字符串
    // ─────────────────────────────────────────────────────────────────────────────
    
    partialSanitize(str, type) {
        if (!str || !type) return this.config.maskText;
        
        const config = this.partialConfig[type];
        if (!config) return this.config.maskText;
        
        return str.replace(config.pattern, config.replacement);
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 智能脱敏
    // ─────────────────────────────────────────────────────────────────────────────
    
    smartSanitize(key, value) {
        if (typeof value !== 'string') {
            return super.sanitizeValue(key, value);
        }
        
        const keyLower = key.toLowerCase();
        
        // 手机号
        if (keyLower.includes('phone') || keyLower.includes('mobile') || keyLower.includes('tel')) {
            return this.partialSanitize(value, 'phone');
        }
        
        // 邮箱
        if (keyLower.includes('email') || keyLower.includes('mail')) {
            return this.partialSanitize(value, 'email');
        }
        
        // 身份证
        if (keyLower.includes('idcard') || keyLower.includes('id_card') || keyLower.includes('identity')) {
            return this.partialSanitize(value, 'idCard');
        }
        
        // 银行卡
        if (keyLower.includes('card') || keyLower.includes('bank')) {
            return this.partialSanitize(value, 'bankCard');
        }
        
        // 其他敏感字段
        if (this.isSensitiveField(key)) {
            return this.config.maskText;
        }
        
        return this.sanitizeString(value);
    }
}
```

### 3.2 白名单模式

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 白名单模式 - 只保留允许的字段
// ────────────────────────────────────────────────────────────────────────────────────

class WhitelistSanitizer extends DataSanitizer {
    constructor(config = {}) {
        super(config);
        
        this.whitelistConfig = {
            // 允许的字段白名单
            allowedFields: [
                'type', 'subType', 'message', 'timestamp',
                'url', 'method', 'status', 'duration',
                'name', 'value', 'rating'
            ],
            
            // 允许的顶级字段
            allowedTopLevel: [
                'type', 'subType', 'timestamp', 'url', 'userId', 'sessionId'
            ],
            
            // 是否严格模式（不在白名单的字段直接移除）
            strict: false,
            
            ...config.whitelistConfig
        };
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 白名单脱敏
    // ─────────────────────────────────────────────────────────────────────────────
    
    sanitize(data) {
        if (!data || typeof data !== 'object') {
            return data;
        }
        
        const result = {};
        
        for (const [key, value] of Object.entries(data)) {
            // 内部字段保留
            if (key.startsWith('_')) {
                result[key] = value;
                continue;
            }
            
            // 检查是否在白名单中
            const isAllowed = this.whitelistConfig.allowedFields.includes(key) ||
                this.whitelistConfig.allowedTopLevel.includes(key);
            
            if (isAllowed) {
                result[key] = super.sanitizeValue(key, value);
            } else if (!this.whitelistConfig.strict) {
                // 非严格模式，检查是否敏感后决定
                if (this.isSensitiveField(key)) {
                    result[key] = this.config.maskText;
                } else {
                    result[key] = super.sanitizeValue(key, value);
                }
            }
            // 严格模式下，不在白名单的字段直接移除
        }
        
        return result;
    }
}
```

---

## 4. 脱敏规则配置

### 4.1 配置管理

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 脱敏规则配置管理
// ────────────────────────────────────────────────────────────────────────────────────

class SanitizerConfigManager {
    constructor(sanitizer) {
        this.sanitizer = sanitizer;
        this.configKey = '_monitor_sanitizer_config';
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 预设规则
    // ─────────────────────────────────────────────────────────────────────────────
    
    presets = {
        // 严格模式：完全脱敏
        strict: {
            sensitiveFields: [
                'password', 'token', 'secret', 'key', 'phone', 'email',
                'idCard', 'bankCard', 'creditCard', 'name', 'address'
            ],
            maskText: '******',
            maskUrlParams: true,
            maskRequestBody: true,
            maxStringLength: 5000
        },
        
        // 宽松模式：只脱敏认证信息
        loose: {
            sensitiveFields: [
                'password', 'token', 'secret', 'apiKey', 'privateKey'
            ],
            maskText: '******',
            maskUrlParams: true,
            maskRequestBody: false,
            maxStringLength: 10000
        },
        
        // 开发模式：最小脱敏
        development: {
            sensitiveFields: ['password'],
            maskText: '***',
            maskUrlParams: false,
            maskRequestBody: false,
            maxStringLength: 50000
        },
        
        // 合规模式：符合 GDPR
        gdpr: {
            sensitiveFields: [
                'password', 'token', 'secret', 'key',
                'name', 'email', 'phone', 'address', 'ip',
                'idCard', 'passport', 'license'
            ],
            maskText: '[REDACTED]',
            maskUrlParams: true,
            maskRequestBody: true,
            maxStringLength: 1000
        }
    };
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 应用预设
    // ─────────────────────────────────────────────────────────────────────────────
    
    applyPreset(presetName) {
        const preset = this.presets[presetName];
        
        if (preset) {
            Object.assign(this.sanitizer.config, preset);
            return true;
        }
        
        return false;
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 添加自定义规则
    // ─────────────────────────────────────────────────────────────────────────────
    
    addRule(type, rule) {
        switch (type) {
            case 'field':
                this.sanitizer.addSensitiveField(rule);
                break;
            case 'pattern':
                this.sanitizer.addSensitivePattern(rule);
                break;
            case 'partial':
                Object.assign(this.sanitizer.partialConfig, rule);
                break;
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 保存配置
    // ─────────────────────────────────────────────────────────────────────────────
    
    saveConfig() {
        try {
            localStorage.setItem(this.configKey, JSON.stringify(this.sanitizer.config));
        } catch (e) {}
    }
    
    // ─────────────────────────────────────────────────────────────────────────────
    // 加载配置
    // ─────────────────────────────────────────────────────────────────────────────
    
    loadConfig() {
        try {
            const config = localStorage.getItem(this.configKey);
            if (config) {
                Object.assign(this.sanitizer.config, JSON.parse(config));
            }
        } catch (e) {}
    }
}
```

---

## 5. 完整使用示例

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 完整使用示例
// ────────────────────────────────────────────────────────────────────────────────────

// 创建脱敏器
const sanitizer = new PartialSanitizer({
    // 自定义敏感字段
    sensitiveFields: [
        'password', 'token', 'apiKey',
        'phone', 'email', 'idCard',
        'creditCard', 'bankCard'
    ],
    
    // 脱敏文本
    maskText: '******',
    
    // 启用 URL 参数脱敏
    maskUrlParams: true,
    
    // 启用请求体脱敏
    maskRequestBody: true,
    
    // 最大字符串长度
    maxStringLength: 10000
});

// 应用预设
const configManager = new SanitizerConfigManager(sanitizer);

// 根据环境选择预设
const env = process.env.NODE_ENV;
if (env === 'development') {
    configManager.applyPreset('development');
} else if (env === 'production') {
    configManager.applyPreset('strict');
}

// 自定义规则
sanitizer.addSensitivePattern(/Bearer\s+\S+/g);  // 脱敏 Bearer Token

// 使用示例
const data = {
    type: 'error',
    message: 'Login failed',
    username: 'john_doe',
    password: 'secret123',
    email: 'john@example.com',
    phone: '13812345678',
    idCard: '110101199001011234',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    url: 'https://api.example.com/login?apiKey=mykey&token=abc123'
};

const sanitizedData = sanitizer.sanitize(data);

console.log('原始数据:', data);
console.log('脱敏后:', sanitizedData);
// 输出:
// {
//   type: 'error',
//   message: 'Login failed',
//   username: 'john_doe',
//   password: '******',
//   email: 'joh***@example.com',
//   phone: '138****5678',
//   idCard: '110101********1234',
//   token: '******',
//   url: 'https://api.example.com/login?apiKey=******&token=******'
// }

export { sanitizer, configManager };
```

---

## 最佳实践

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  数据脱敏最佳实践                                                                      │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  脱敏原则                                                                              │
│  □ 宁可多脱敏，不可漏脱敏                                                             │
│  □ 对所有用户输入进行脱敏                                                             │
│  □ URL 参数必须脱敏                                                                   │
│  □ Cookie 值必须脱敏                                                                  │
│                                                                                       │
│  字段识别                                                                              │
│  □ 使用字段名匹配 + 正则匹配双重保障                                                  │
│  □ 定期更新敏感字段列表                                                               │
│  □ 支持自定义规则扩展                                                                 │
│                                                                                       │
│  脱敏策略                                                                              │
│  □ 认证信息完全脱敏                                                                   │
│  □ 个人信息部分脱敏                                                                   │
│  □ 业务数据按需脱敏                                                                   │
│  □ 保留必要信息用于调试                                                               │
│                                                                                       │
│  合规要求                                                                              │
│  □ 符合 GDPR、CCPA 等法规要求                                                        │
│  □ 不存储用户原始敏感数据                                                             │
│  □ 提供数据删除机制                                                                   │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

[返回上级目录](../index.md)
