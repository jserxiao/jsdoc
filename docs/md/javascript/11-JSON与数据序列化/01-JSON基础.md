# JSON 基础

JSON（JavaScript Object Notation）是一种轻量级的数据交换格式，易于人阅读和编写，同时也易于机器解析和生成。

---

## 概述

### 什么是 JSON

JSON 是一种数据格式，不是编程语言：
- 基于 JavaScript 对象字面量语法
- 独立于编程语言（跨语言支持）
- 用于数据存储和传输
- Web API 的标准数据格式

### JSON 的特点

```
✅ 优点：
- 轻量级，比 XML 更简洁
- 易于人阅读和编写
- 易于机器解析和生成
- 跨语言支持（几乎所有编程语言）
- 支持嵌套结构

❌ 局限性：
- 不支持注释
- 不支持函数、Date 等复杂类型
- 不支持循环引用
- 不支持 undefined
```

---

## JSON 语法规则

### 数据类型

JSON 支持 6 种数据类型：

| 类型 | 说明 | 示例 |
|------|------|------|
| 对象 | 无序键值对集合 | `{"name": "John"}` |
| 数组 | 有序值集合 | `[1, 2, 3]` |
| 字符串 | 必须使用双引号 | `"Hello"` |
| 数字 | 整数或浮点数 | `42`, `3.14` |
| 布尔值 | true 或 false | `true`, `false` |
| null | 空值 | `null` |

### 语法规则详解

#### 1. 字符串

```json
// ✅ 正确：必须使用双引号
"Hello World"
"John"
"Line 1\nLine 2"

// ❌ 错误：单引号不被允许
'Hello World'

// ❌ 错误：无引号
Hello

// 转义字符
"Line 1\nLine 2"          // 换行
"Tab\there"               // 制表符
"Quote: \"text\""         // 双引号
"Backslash: \\"           // 反斜杠
"Unicode: \u0041"         // Unicode 字符（A）
```

#### 2. 数字

```json
// ✅ 正确的数字格式
42
-17
3.14
-0.5
2.998e8           // 科学计数法
1.5E-10

// ❌ 错误的数字格式
+42               // 不支持正号
007               // 不支持前导零（除非是 0）
NaN               // 不支持
Infinity          // 不支持
```

#### 3. 布尔值和 null

```json
// ✅ 正确
true
false
null

// ❌ 错误（必须小写）
TRUE
True
FALSE
False
NULL
Null
undefined        // JSON 不支持 undefined
```

#### 4. 对象

```json
// 基本对象
{
  "name": "John",
  "age": 30,
  "active": true
}

// 嵌套对象
{
  "user": {
    "name": "John",
    "address": {
      "city": "New York",
      "country": "USA"
    }
  }
}

// 属性名必须用双引号
{
  "firstName": "John",    // ✅ 正确
  "last-name": "Doe"      // ✅ 特殊字符需要引号
}
```

#### 5. 数组

```json
// 基本数组
[1, 2, 3, 4, 5]

// 混合类型数组
[1, "two", true, null]

// 对象数组
[
  {"name": "John", "age": 30},
  {"name": "Jane", "age": 25}
]

// 嵌套数组
[
  [1, 2, 3],
  [4, 5, 6]
]

// 复杂嵌套
{
  "users": [
    {
      "name": "John",
      "hobbies": ["reading", "gaming"],
      "scores": [95, 88, 92]
    }
  ]
}
```

### 完整 JSON 示例

```json
{
  "name": "JavaScript Guide",
  "version": "1.0.0",
  "author": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "chapters": [
    {
      "id": 1,
      "title": "Introduction",
      "pages": 15
    },
    {
      "id": 2,
      "title": "Variables",
      "pages": 23
    }
  ],
  "published": true,
  "tags": ["programming", "javascript", "guide"],
  "price": 29.99,
  "discount": null
}
```

---

## JSON vs JavaScript 对象

### 语法差异

```javascript
// ========== JavaScript 对象 ==========
const jsObj = {
  name: 'John',           // 属性名可以不加引号
  'last-name': 'Doe',     // 特殊字符需要引号
  age: 30,
  active: true,
  undefinedValue: undefined,  // ✅ 支持 undefined
  method() {              // ✅ 支持方法
    return 'Hello';
  },
  [Symbol('id')]: 123,    // ✅ 支持 Symbol
  date: new Date(),       // ✅ 支持 Date 对象
  regex: /pattern/,       // ✅ 支持正则表达式
  bigInt: 9007199254740991n,  // ✅ 支持 BigInt
  self: this              // ✅ 支持引用
};

// ========== JSON ==========
const jsonString = `{
  "name": "John",         // 属性名必须加双引号
  "last-name": "Doe",     // 同样需要双引号
  "age": 30,
  "active": true,
  "nullValue": null       // ❌ 不支持 undefined，转为 null
  // ❌ 不支持方法
  // ❌ 不支持 Symbol
  // ❌ 不支持 Date 对象
  // ❌ 不支持正则表达式
  // ❌ 不支持 BigInt
}`;
```

### 对照表

| 特性 | JavaScript 对象 | JSON |
|------|----------------|------|
| 属性名引号 | 可选 | 必须双引号 |
| 字符串引号 | 单引号或双引号 | 必须双引号 |
| 末尾逗号 | 允许 | 不允许 |
| undefined | 支持 | 不支持 |
| 函数/方法 | 支持 | 不支持 |
| Symbol | 支持 | 不支持 |
| Date | 支持 | 转为字符串 |
| 正则表达式 | 支持 | 不支持 |
| BigInt | 支持 | 不支持 |
| 循环引用 | 支持 | 不支持 |
| NaN/Infinity | 支持 | 转为 null |
| 注释 | 支持 | 不支持 |

### 转换注意事项

```javascript
// JavaScript 对象转 JSON 时的问题
const obj = {
  name: 'John',
  age: undefined,        // 会被忽略
  method() {},           // 会被忽略
  date: new Date(),      // 转为 ISO 字符串
  regex: /pattern/,      // 转为 {}
  nan: NaN,              // 转为 null
  infinity: Infinity     // 转为 null
};

const json = JSON.stringify(obj);
console.log(json);
// {"name":"John","date":"2024-01-15T10:30:00.000Z","regex":{},"nan":null,"infinity":null}
```

---

## JSON 的用途

### 1. Web API 数据交换

```javascript
// 请求 JSON 数据
fetch('https://api.example.com/users')
  .then(response => response.json())
  .then(data => console.log(data));

// 发送 JSON 数据
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John',
    email: 'john@example.com'
  })
});
```

### 2. 配置文件

```json
// package.json
{
  "name": "my-project",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.0",
    "lodash": "^4.17.21"
  }
}

// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true
  }
}
```

### 3. 本地存储

```javascript
// localStorage
const user = {
  name: 'John',
  preferences: {
    theme: 'dark',
    language: 'zh-CN'
  }
};

// 存储
localStorage.setItem('user', JSON.stringify(user));

// 读取
const savedUser = JSON.parse(localStorage.getItem('user'));
```

### 4. 数据持久化

```javascript
// IndexedDB 存储
const data = {
  users: [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' }
  ]
};

// 文件系统存储（Node.js）
const fs = require('fs');
fs.writeFileSync('data.json', JSON.stringify(data, null, 2));

// 读取
const loaded = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
```

### 5. 跨平台数据传输

```javascript
// WebSocket 消息
const ws = new WebSocket('wss://example.com/socket');
ws.send(JSON.stringify({
  type: 'message',
  content: 'Hello',
  timestamp: Date.now()
}));

// 消息队列（如 RabbitMQ）
const message = {
  queue: 'tasks',
  data: { task: 'process', fileId: 123 }
};
channel.sendToQueue('tasks', Buffer.from(JSON.stringify(message)));
```

---

## JSON 的局限性及解决方案

### 1. 不支持注释

**问题**：JSON 不支持注释，配置文件难以理解。

**解决方案**：
- 使用 JSONC（JSON with Comments）格式
- 使用 JSON5 格式
- 使用 JS 对象配置文件

```javascript
// JSONC（VS Code 配置）
{
  // 编辑器设置
  "editor.fontSize": 14,
  "editor.tabSize": 2,  // 缩进

  /* 多行注释
     也支持 */
  "editor.formatOnSave": true
}

// JSON5
{
  name: 'Project',     // 无需引号
  version: '1.0.0',
  // 注释支持
  dependencies: {
    'express': '^4.18.0',
  },  // 支持尾随逗号
}
```

### 2. 不支持 Date 对象

**问题**：日期对象会被转为字符串。

**解决方案**：
- 使用 ISO 8601 格式字符串
- 使用时间戳

```javascript
// 序列化日期
const data = {
  created: new Date().toISOString(),  // ISO 格式
  timestamp: Date.now()                // 时间戳
};

// 解析日期
const parsed = JSON.parse(jsonString);
parsed.created = new Date(parsed.created);
parsed.timestamp = new Date(parsed.timestamp);
```

### 3. 不支持函数

**问题**：方法无法序列化。

**解决方案**：
- 使用类和对象重构
- 序列化时过滤方法

```javascript
// 方案1：分离数据和方法
class User {
  constructor(data) {
    Object.assign(this, data);
  }

  // 方法单独定义
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  toJSON() {
    return {
      firstName: this.firstName,
      lastName: this.lastName
      // 不包含方法
    };
  }
}

const user = new User({ firstName: 'John', lastName: 'Doe' });
const json = JSON.stringify(user);  // 使用 toJSON()
```

### 4. 循环引用

**问题**：对象循环引用导致序列化失败。

```javascript
const obj = { name: 'John' };
obj.self = obj;  // 循环引用

JSON.stringify(obj);  // TypeError: Converting circular structure to JSON
```

**解决方案**：
- 使用第三方库（如 `flatted`、`circular-json`）
- 实现 `toJSON` 方法
- 使用 WeakMap 跟踪已序列化对象

```javascript
// 方案1：实现 toJSON
const obj = {
  name: 'John',
  get self() { return this; }  // 使用 getter
};

obj.toJSON = function() {
  return { name: this.name };  // 排除循环引用
};

JSON.stringify(obj);  // {"name":"John"}

// 方案2：使用 flatted 库
import { stringify, parse } from 'flatted';

const obj = { name: 'John' };
obj.self = obj;

const json = stringify(obj);  // ✅ 正常工作
const parsed = parse(json);
```

### 5. 不支持 undefined

**问题**：undefined 会被忽略或转为 null。

```javascript
const obj = {
  name: 'John',
  age: undefined
};

JSON.stringify(obj);  // {"name":"John"}
```

**解决方案**：
- 使用 null 替代
- 使用自定义序列化器

```javascript
// 自定义序列化器
function stringifyWithUndefined(obj) {
  return JSON.stringify(obj, (key, value) => {
    return value === undefined ? '__undefined__' : value;
  });
}

function parseWithUndefined(json) {
  return JSON.parse(json, (key, value) => {
    return value === '__undefined__' ? undefined : value;
  });
}
```

---

## JSON 验证

### 使用 JSONLint

```bash
# 在线验证
https://jsonlint.com/

# 命令行验证
npm install -g jsonlint
jsonlint data.json
```

### JavaScript 验证

```javascript
function isValidJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

// 使用示例
isValidJSON('{"name": "John"}');     // true
isValidJSON("{'name': 'John'}");     // false（单引号）
isValidJSON('{name: "John"}');       // false（属性名无引号）
isValidJSON('{"name": "John",}');    // false（尾随逗号）
```

---

## JSON Schema

JSON Schema 用于定义 JSON 数据的结构和验证规则。

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/user.schema.json",
  "title": "User",
  "description": "A user object",
  "type": "object",
  "required": ["name", "email"],
  "properties": {
    "name": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100
    },
    "email": {
      "type": "string",
      "format": "email"
    },
    "age": {
      "type": "integer",
      "minimum": 0,
      "maximum": 150
    },
    "role": {
      "type": "string",
      "enum": ["user", "admin", "moderator"],
      "default": "user"
    }
  }
}
```

### 验证 JSON

```javascript
const Ajv = require('ajv');
const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    name: { type: "string" },
    age: { type: "number", minimum: 0 }
  },
  required: ["name"]
};

const validate = ajv.compile(schema);

// 验证数据
const valid = validate({ name: "John", age: 30 });
if (!valid) {
  console.log(validate.errors);
}
```

---

## JSON 安全性

### JSON 劫持防护

```javascript
// ❌ 不安全：直接返回 JSON 数组
// [1, 2, 3]

// ✅ 安全：使用 JSON 对象
{
  "data": [1, 2, 3]
}

// ✅ 安全：使用前缀（如 while(1);）
while(1);{"data": [1, 2, 3]}
```

### XSS 防护

```javascript
// ❌ 危险：直接插入 HTML
element.innerHTML = JSON.parse(jsonString).name;

// ✅ 安全：转义后插入
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

element.textContent = JSON.parse(jsonString).name;
```

---

## JSON 性能优化

### 大文件处理

```javascript
// 流式解析大型 JSON 文件
const fs = require('fs');
const JSONStream = require('JSONStream');

const stream = fs.createReadStream('large.json')
  .pipe(JSONStream.parse('items.*'));

stream.on('data', item => {
  // 逐项处理
  console.log(item);
});
```

### 缓存策略

```javascript
// 序列化后缓存
const cache = new Map();

function getCached(key, fetcher) {
  if (cache.has(key)) {
    return Promise.resolve(JSON.parse(cache.get(key)));
  }

  return fetcher().then(data => {
    cache.set(key, JSON.stringify(data));
    return data;
  });
}
```

---

## 最佳实践

### 1. 使用标准格式

```javascript
// ✅ 推荐：标准 ISO 日期格式
{
  "createdAt": "2024-01-15T10:30:00.000Z"
}

// ✅ 推荐：使用 UTC 时间
{
  "timestamp": 1705315800000
}
```

### 2. 保持数据扁平

```javascript
// ✅ 推荐：扁平结构
{
  "userId": 123,
  "userName": "John",
  "userEmail": "john@example.com"
}

// ⚠️ 过度嵌套
{
  "user": {
    "profile": {
      "personal": {
        "details": {
          "name": "John"
        }
      }
    }
  }
}
```

### 3. 版本控制

```json
{
  "version": "1.0.0",
  "data": {
    // ...
  }
}
```

### 4. 错误处理

```javascript
// 安全解析 JSON
function safeJSONParse(str, defaultValue = null) {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.error('JSON parse error:', error);
    return defaultValue;
  }
}

// 使用
const data = safeJSONParse(jsonString, {});
```

---

## 参考资源

- [JSON 官网](https://www.json.org/)
- [MDN - JSON](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON)
- [JSON Schema](https://json-schema.org/)
- [JSON5](https://json5.org/)
- [RFC 8259](https://datatracker.ietf.org/doc/html/rfc8259) - JSON 规范

---

[返回模块目录](./)
