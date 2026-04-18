# JSON 与数据序列化

JSON（JavaScript Object Notation）是一种轻量级的数据交换格式，易于人阅读和编写，同时也易于机器解析和生成。它是现代 Web 开发中最常用的数据交换格式之一。

---

## 模块概述

JSON 虽然语法简单，但在实际应用中涉及许多细节，包括序列化控制、特殊类型处理、循环引用、性能优化和安全问题等。本模块将全面介绍 JSON 的基础知识和高级应用。

### 学习目标

- 理解 JSON 的语法规则和数据类型
- 掌握 JSON.stringify 和 JSON.parse 的高级用法
- 学会处理特殊类型（日期、正则、Map、Set）的序列化
- 了解循环引用的处理方案
- 掌握 JSON 性能优化和安全防护技巧

---

## 📁 模块目录

| 序号 | 模块 | 文件 | 内容概述 |
|------|------|------|----------|
| 1 | JSON 基础 | [JSON基础.md](./JSON基础.md) | 语法规则、数据类型、与 JS 对象的区别、用途、局限性 |
| 2 | JSON 方法 | [JSON方法.md](./JSON方法.md) | stringify/parse 高级用法、replacer/reviver、循环引用、性能优化 |

---

## 核心概念速览

### JSON 数据类型

```javascript
// JSON 支持的数据类型
const jsonTypes = {
  "string": "Hello, World!",      // 字符串（必须双引号）
  "number": 42,                   // 数字（整数或浮点数）
  "boolean": true,                // 布尔值
  "null": null,                   // null
  "object": {                     // 对象
    "key": "value"
  },
  "array": [1, 2, 3]              // 数组
};

// JSON 不支持的类型
// undefined、函数、Symbol、Date、RegExp、Map、Set、BigInt
```

### JSON vs JavaScript 对象

| 特性 | JSON | JavaScript 对象 |
|------|------|-----------------|
| 键名 | 必须双引号 | 可加可不加 |
| 字符串 | 必须双引号 | 单引号或双引号 |
| 末尾逗号 | 不允许 | 允许 |
| 注释 | 不支持 | 支持 |
| undefined | 不支持 | 支持 |
| 函数 | 不支持 | 支持 |

### 基本方法

```javascript
// 序列化：JavaScript 对象 → JSON 字符串
const obj = { name: 'John', age: 30 };
const json = JSON.stringify(obj);  // '{"name":"John","age":30}'

// 反序列化：JSON 字符串 → JavaScript 对象
const parsed = JSON.parse(json);   // { name: 'John', age: 30 }

// 美化输出
const pretty = JSON.stringify(obj, null, 2);
/*
{
  "name": "John",
  "age": 30
}
*/
```

---

## 高级用法速查

### replacer 参数

```javascript
const user = {
  name: 'John',
  password: 'secret',
  email: 'john@example.com'
};

// 数组形式：白名单过滤
const safe = JSON.stringify(user, ['name', 'email']);
// '{"name":"John","email":"john@example.com"}'

// 函数形式：动态处理
const filtered = JSON.stringify(user, (key, value) => {
  if (key === 'password') return undefined;  // 排除敏感字段
  return value;
});
```

### reviver 参数

```javascript
const json = '{"name":"John","birthDate":"1990-01-01","joinDate":"2024-01-01T00:00:00Z"}';

// 解析时自动转换日期
const obj = JSON.parse(json, (key, value) => {
  if (key.includes('Date') && typeof value === 'string') {
    return new Date(value);
  }
  return value;
});
// birthDate 和 joinDate 变为 Date 对象
```

### 处理循环引用

```javascript
const obj = { name: 'John' };
obj.self = obj;

// ❌ 直接序列化会报错
// JSON.stringify(obj);  // TypeError: Converting circular structure to JSON

// ✅ 使用 WeakSet 处理
function stringifySafe(obj) {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) return '[Circular]';
      seen.add(value);
    }
    return value;
  });
}
```

### toJSON 方法

```javascript
class User {
  constructor(id, name, password) {
    this.id = id;
    this.name = name;
    this.password = password;
  }

  toJSON() {
    // 自定义序列化输出
    return {
      id: this.id,
      name: this.name
      // password 被排除
    };
  }
}

const user = new User(1, 'John', 'secret');
JSON.stringify(user);  // '{"id":1,"name":"John"}'
```

---

## 常见应用场景

### 1. 数据存储

```javascript
// localStorage 存储
const settings = { theme: 'dark', fontSize: 14 };
localStorage.setItem('settings', JSON.stringify(settings));

// 读取
const saved = JSON.parse(localStorage.getItem('settings'));
```

### 2. 网络请求

```javascript
// 发送 JSON 数据
fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'John', email: 'john@example.com' })
});

// 接收 JSON 响应
const response = await fetch('/api/users');
const data = await response.json();
```

### 3. 深拷贝

```javascript
// 简单的深拷贝（有局限性）
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// 局限性：无法处理函数、Date、RegExp、Map、Set、循环引用等
```

### 4. 数据验证

```javascript
// 使用 JSON Schema 验证
function validateJSON(data, schema) {
  // 使用 ajv 等库进行验证
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  return validate(data);
}
```

---

## 安全注意事项

### JSON 劫持防护

```javascript
// 服务端：添加防护前缀
// )]}',\n{"user":"John"}

// 客户端：解析前移除前缀
function parseProtectedJSON(str) {
  const prefix = ")]}',\n";
  if (str.startsWith(prefix)) {
    str = str.slice(prefix.length);
  }
  return JSON.parse(str);
}
```

### 原型污染防护

```javascript
// 危险：直接解析用户 JSON
const userJson = '{"__proto__":{"admin":true}}';
// 可能污染原型链

// 安全：过滤危险属性
function safeParse(json) {
  const obj = JSON.parse(json);
  
  function clean(o) {
    if (!o || typeof o !== 'object') return o;
    delete o.__proto__;
    delete o.constructor;
    for (const key in o) {
      clean(o[key]);
    }
    return o;
  }
  
  return clean(obj);
}
```

---

## 性能优化

### 大对象处理

```javascript
// 分块处理大型数组
async function stringifyLarge(arr, chunkSize = 1000) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(JSON.stringify(arr.slice(i, i + chunkSize)));
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  return `[${chunks.join(',')}]`;
}
```

### 缓存序列化结果

```javascript
// 缓存常用对象的 JSON
const cache = new Map();

function cachedStringify(obj) {
  const key = obj.id || JSON.stringify(obj);
  if (cache.has(key)) return cache.get(key);
  
  const json = JSON.stringify(obj);
  cache.set(key, json);
  return json;
}
```

---

## 学习路径

### 初级：基础语法
1. 理解 JSON 的语法规则
2. 掌握 JSON.stringify 和 JSON.parse 基本用法
3. 了解 JSON 与 JavaScript 对象的区别
4. 学会在网络请求中使用 JSON

### 中级：高级应用
1. 掌握 replacer 和 reviver 参数
2. 学会处理特殊类型的序列化
3. 理解 toJSON 方法的作用
4. 解决循环引用问题

### 高级：性能与安全
1. 优化大型 JSON 的序列化性能
2. 了解 JSON 安全问题和防护措施
3. 使用 JSON Schema 进行数据验证
4. 实现自定义序列化器

---

## 常见问题

### 1. JSON.stringify 为什么返回 undefined？

```javascript
// 函数、undefined、Symbol 会被忽略
JSON.stringify({ fn: () => {} });      // '{}'
JSON.stringify({ x: undefined });       // '{}'
JSON.stringify({ x: Symbol('s') });     // '{}'

// 在数组中会转为 null
JSON.stringify([() => {}, undefined]);  // '[null,null]'
```

### 2. 如何序列化 Date 对象？

```javascript
// Date 会转为 ISO 字符串
const obj = { date: new Date() };
const json = JSON.stringify(obj);  // {"date":"2024-01-01T00:00:00.000Z"}

// 解析时使用 reviver 恢复
const restored = JSON.parse(json, (key, value) => {
  if (key === 'date') return new Date(value);
  return value;
});
```

### 3. BigInt 如何处理？

```javascript
// BigInt 无法直接序列化
const obj = { big: 9007199254740991n };
JSON.stringify(obj);  // TypeError: Do not know how to serialize a BigInt

// 解决方案：转为字符串
JSON.stringify(obj, (key, value) => {
  if (typeof value === 'bigint') return value.toString();
  return value;
});
```

---

## 参考资料

- [MDN - JSON](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON)
- [JSON 官方网站](https://www.json.org/json-zh.html)
- [ECMAScript JSON 规范](https://tc39.es/ecma262/#sec-json-object)
- [JSON Schema](https://json-schema.org/)

---

[返回上级目录](../)
