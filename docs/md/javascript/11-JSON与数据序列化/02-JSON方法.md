# JSON 方法

JSON（JavaScript Object Notation）是一种轻量级的数据交换格式。本文档详细介绍 JavaScript 中 JSON 相关方法的完整用法，包括序列化、反序列化、高级技巧和常见问题解决。

---

## 目录

- [JSON.stringify()](#jsonstringify)
- [JSON.parse()](#jsonparse)
- [其他 JSON 方法](#其他-json-方法)
- [序列化特殊类型](#序列化特殊类型)
- [循环引用处理](#循环引用处理)
- [性能优化](#性能优化)
- [安全考虑](#安全考虑)
- [自定义序列化](#自定义序列化)

---

## JSON.stringify()

### 基本用法

```javascript
const obj = {
  name: 'John',
  age: 30,
  active: true,
  hobbies: ['reading', 'coding'],
  address: {
    city: 'NYC',
    country: 'USA'
  }
};

// 基本序列化
const json = JSON.stringify(obj);
// '{"name":"John","age":30,"active":true,"hobbies":["reading","coding"],"address":{"city":"NYC","country":"USA"}}'

// 格式化输出（美化 JSON）
const pretty = JSON.stringify(obj, null, 2);
/*
{
  "name": "John",
  "age": 30,
  "active": true,
  "hobbies": [
    "reading",
    "coding"
  ],
  "address": {
    "city": "NYC",
    "country": "USA"
  }
}
*/

// 使用制表符缩进
const tabbed = JSON.stringify(obj, null, '\t');

// 自定义缩进
const custom = JSON.stringify(obj, null, '  '); // 2个空格
```

### replacer 参数

```javascript
const user = {
  name: 'John',
  password: 'secret123',
  email: 'john@example.com',
  age: 30,
  salary: 50000
};

// 1. 数组形式：指定要包含的属性
const publicInfo = JSON.stringify(user, ['name', 'email', 'age']);
// '{"name":"John","email":"john@example.com","age":30}'

// 2. 函数形式：过滤/转换值
const filtered = JSON.stringify(user, (key, value) => {
  // 排除敏感字段
  if (key === 'password' || key === 'salary') {
    return undefined; // 返回 undefined 会排除该属性
  }
  return value;
});
// '{"name":"John","email":"john@example.com","age":30}'

// 3. 转换特定值
const transformed = JSON.stringify(user, (key, value) => {
  if (key === 'age') {
    return `${value} years old`;
  }
  if (key === 'salary') {
    return `$${value.toLocaleString()}`;
  }
  return value;
});

// 4. 深度处理嵌套对象
const deep = JSON.stringify({
  user: {
    name: 'John',
    secrets: {
      password: '123',
      token: 'abc'
    }
  }
}, (key, value) => {
  if (key === 'secrets') {
    return '[REDACTED]';
  }
  return value;
});

// 5. 条件过滤
const conditional = JSON.stringify({
  items: [
    { id: 1, price: 100, visible: true },
    { id: 2, price: 200, visible: false },
    { id: 3, price: 300, visible: true }
  ]
}, (key, value) => {
  if (Array.isArray(value)) {
    return value.filter(item => item.visible !== false);
  }
  return value;
});
```

### space 参数详解

```javascript
const data = { a: 1, b: { c: 2, d: [3, 4] } };

// 不传 space（默认）
JSON.stringify(data);
// '{"a":1,"b":{"c":2,"d":[3,4]}}'

// 数字（空格数量，最大 10）
JSON.stringify(data, null, 0);  // 无缩进
JSON.stringify(data, null, 2);  // 2个空格
JSON.stringify(data, null, 4);  // 4个空格
JSON.stringify(data, null, 10); // 10个空格

// 字符串（作为缩进符）
JSON.stringify(data, null, '\t');     // 制表符
JSON.stringify(data, null, '  ');     // 2个空格
JSON.stringify(data, null, '-->');    // 自定义字符串

// 应用：生成配置文件
const config = {
  name: 'my-app',
  version: '1.0.0',
  scripts: {
    start: 'node index.js',
    test: 'jest'
  }
};

const configJson = JSON.stringify(config, null, 2);
console.log(configJson);
/*
{
  "name": "my-app",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "test": "jest"
  }
}
*/
```

### replacer 函数执行顺序

```javascript
const obj = { a: 1, b: { c: 2 } };

JSON.stringify(obj, (key, value) => {
  console.log(`Key: "${key}", Value:`, value);
  return value;
});

// 输出顺序：
// Key: "", Value: { a: 1, b: { c: 2 } }  // 根对象，key 为空字符串
// Key: "a", Value: 1
// Key: "b", Value: { c: 2 }
// Key: "c", Value: 2

// 利用执行顺序实现特殊处理
const tracker = JSON.stringify(obj, function(key, value) {
  const path = this.path || '';
  const currentPath = path ? `${path}.${key}` : key;

  console.log(`Path: ${currentPath || 'root'}`);

  // 传递路径给子对象
  if (typeof value === 'object' && value !== null) {
    value.path = currentPath;
  }

  return value;
});
```

---

## JSON.parse()

### 基本用法

```javascript
// 基本解析
const json = '{"name":"John","age":30}';
const obj = JSON.parse(json);
// { name: 'John', age: 30 }

// 解析数组
const arr = JSON.parse('[1, 2, 3]');
// [1, 2, 3]

// 解析嵌套结构
const nested = JSON.parse('{"user":{"name":"John","address":{"city":"NYC"}}}');
// { user: { name: 'John', address: { city: 'NYC' } } }
```

### reviver 参数

```javascript
// 1. 转换日期字符串
const json = '{"name":"John","birthDate":"1990-01-15","joinDate":"2024-01-01T00:00:00Z"}';

const obj = JSON.parse(json, (key, value) => {
  if (key.includes('Date') && typeof value === 'string') {
    return new Date(value);
  }
  return value;
});
// birthDate 和 joinDate 都是 Date 对象

// 2. 转换正则表达式
const regexJson = '{"pattern":"/^\\d+$/","flags":""}';

const withRegex = JSON.parse(regexJson, (key, value) => {
  if (key === 'pattern' && typeof value === 'string') {
    const match = value.match(/^\/(.+)\/([gimsuy]*)$/);
    if (match) {
      return new RegExp(match[1], match[2]);
    }
  }
  return value;
});

// 3. 类型恢复
const typedJson = '{"__type":"Person","name":"John","age":30}';

const typed = JSON.parse(typedJson, (key, value) => {
  if (value && typeof value === 'object' && value.__type === 'Person') {
    return Object.assign(new Person(), value);
  }
  return value;
});

// 4. 属性过滤
const filtered = JSON.parse('{"a":1,"b":2,"c":3}', (key, value) => {
  if (key === 'b') return undefined; // 排除属性 b
  return value;
});
// { a: 1, c: 3 }

// 5. 数值转换
const numbers = JSON.parse('{"a":"123","b":"456","c":"not a number"}', (key, value) => {
  if (typeof value === 'string' && /^\d+$/.test(value)) {
    return parseInt(value, 10);
  }
  return value;
});

// 6. reviver 执行顺序（与 stringify 相反）
JSON.parse('{"a":1,"b":2}', (key, value) => {
  console.log(`Key: "${key}", Value:`, value);
  return value;
});
// Key: "a", Value: 1
// Key: "b", Value: 2
// Key: "", Value: { a: 1, b: 2 }  // 最后处理根对象
```

### 错误处理

```javascript
// 安全解析函数
function safeParse(json, fallback = null) {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.error('JSON parse error:', error.message);
    return fallback;
  }
}

// 使用
const data = safeParse('invalid json', {}); // 返回 {}

// 详细错误信息
function parseWithDetails(json) {
  try {
    return {
      success: true,
      data: JSON.parse(json)
    };
  } catch (error) {
    // 提取错误位置
    const match = error.message.match(/position (\d+)/);
    const position = match ? parseInt(match[1]) : -1;

    return {
      success: false,
      error: error.message,
      position,
      near: position >= 0 ? json.substring(position - 10, position + 10) : null
    };
  }
}

// 带恢复机制的解析
function parseWithRecovery(json) {
  // 尝试修复常见问题
  let fixed = json
    // 修复单引号
    .replace(/'/g, '"')
    // 修复未引用的属性名
    .replace(/(\w+):/g, '"$1":')
    // 修复尾随逗号
    .replace(/,\s*}/g, '}')
    .replace(/,\s*]/g, ']');

  try {
    return JSON.parse(fixed);
  } catch (error) {
    throw new Error(`Failed to parse JSON: ${error.message}`);
  }
}
```

---

## 其他 JSON 方法

### JSON.keys() 和 JSON.values()（非标准，自定义实现）

```javascript
// 获取 JSON 对象的所有键
function jsonKeys(json) {
  try {
    const obj = typeof json === 'string' ? JSON.parse(json) : json;
    return Object.keys(obj);
  } catch {
    return [];
  }
}

// 获取 JSON 对象的所有值
function jsonValues(json) {
  try {
    const obj = typeof json === 'string' ? JSON.parse(json) : json;
    return Object.values(obj);
  } catch {
    return [];
  }
}

// 递归获取所有键路径
function getAllPaths(obj, prefix = '') {
  const paths = [];

  for (const key in obj) {
    const path = prefix ? `${prefix}.${key}` : key;
    paths.push(path);

    if (typeof obj[key] === 'object' && obj[key] !== null) {
      paths.push(...getAllPaths(obj[key], path));
    }
  }

  return paths;
}

const data = { a: { b: { c: 1 } }, d: 2 };
console.log(getAllPaths(data)); // ['a', 'a.b', 'a.b.c', 'd']
```

### JSON 深拷贝

```javascript
// 使用 JSON 实现深拷贝（有局限性）
function jsonClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// 局限性：
const problematic = {
  date: new Date(),          // 变成字符串
  regex: /test/,             // 变成 {}
  fn: () => {},              // 丢失
  undefined: undefined,      // 丢失
  symbol: Symbol('test'),    // 丢失
  bigInt: 9007199254740991n, // 报错
  circular: null             // 循环引用报错
};
problematic.circular = problematic;

// 完善的深拷贝
function deepClone(obj, seen = new WeakMap()) {
  // 处理基本类型和 null
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 处理循环引用
  if (seen.has(obj)) {
    return seen.get(obj);
  }

  // 处理日期
  if (obj instanceof Date) {
    return new Date(obj);
  }

  // 处理正则
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // 处理 Map
  if (obj instanceof Map) {
    const copy = new Map();
    seen.set(obj, copy);
    obj.forEach((value, key) => {
      copy.set(deepClone(key, seen), deepClone(value, seen));
    });
    return copy;
  }

  // 处理 Set
  if (obj instanceof Set) {
    const copy = new Set();
    seen.set(obj, copy);
    obj.forEach(value => {
      copy.add(deepClone(value, seen));
    });
    return copy;
  }

  // 处理数组
  if (Array.isArray(obj)) {
    const copy = [];
    seen.set(obj, copy);
    obj.forEach((item, index) => {
      copy[index] = deepClone(item, seen);
    });
    return copy;
  }

  // 处理普通对象
  const copy = Object.create(Object.getPrototypeOf(obj));
  seen.set(obj, copy);

  for (const key of Object.keys(obj)) {
    copy[key] = deepClone(obj[key], seen);
  }

  // 处理 Symbol 属性
  for (const sym of Object.getOwnPropertySymbols(obj)) {
    copy[sym] = deepClone(obj[sym], seen);
  }

  return copy;
}
```

---

## 序列化特殊类型

### 日期处理

```javascript
// 默认：日期转为 ISO 字符串
const obj = { date: new Date('2024-01-01') };
JSON.stringify(obj); // {"date":"2024-01-01T00:00:00.000Z"}

// 自定义日期格式
const withDateFormat = JSON.stringify(obj, (key, value) => {
  if (value instanceof Date) {
    return {
      __type: 'Date',
      value: value.toISOString(),
      timestamp: value.getTime()
    };
  }
  return value;
});

// 解析时恢复日期
const restored = JSON.parse(withDateFormat, (key, value) => {
  if (value && value.__type === 'Date') {
    return new Date(value.value);
  }
  return value;
});
```

### 正则表达式

```javascript
// 默认：正则转为空对象
const obj = { pattern: /^test$/gi };
JSON.stringify(obj); // {"pattern":{}}

// 自定义序列化
const regexJson = JSON.stringify(obj, (key, value) => {
  if (value instanceof RegExp) {
    return {
      __type: 'RegExp',
      source: value.source,
      flags: value.flags
    };
  }
  return value;
});

// 解析恢复
const restored = JSON.parse(regexJson, (key, value) => {
  if (value && value.__type === 'RegExp') {
    return new RegExp(value.source, value.flags);
  }
  return value;
});
```

### Map 和 Set

```javascript
const obj = {
  map: new Map([['a', 1], ['b', 2]]),
  set: new Set([1, 2, 3])
};

// 自定义序列化
const serialized = JSON.stringify(obj, (key, value) => {
  if (value instanceof Map) {
    return {
      __type: 'Map',
      entries: Array.from(value.entries())
    };
  }
  if (value instanceof Set) {
    return {
      __type: 'Set',
      values: Array.from(value.values())
    };
  }
  return value;
});

// 解析恢复
const restored = JSON.parse(serialized, (key, value) => {
  if (value && value.__type === 'Map') {
    return new Map(value.entries);
  }
  if (value && value.__type === 'Set') {
    return new Set(value.values);
  }
  return value;
});
```

### 函数序列化

```javascript
// 注意：序列化函数有安全风险，慎用
const obj = {
  fn: (x) => x * 2,
  method: function(a, b) { return a + b; }
};

// 序列化
const serialized = JSON.stringify(obj, (key, value) => {
  if (typeof value === 'function') {
    return {
      __type: 'Function',
      body: value.toString()
    };
  }
  return value;
});

// 解析（注意安全风险）
const restored = JSON.parse(serialized, (key, value) => {
  if (value && value.__type === 'Function') {
    // 使用 Function 构造函数（有安全风险）
    try {
      return eval(`(${value.body})`);
    } catch (e) {
      console.warn('Failed to restore function:', e);
      return null;
    }
  }
  return value;
});
```

---

## 循环引用处理

### 检测和处理

```javascript
const obj = { name: 'John' };
obj.self = obj;
obj.friend = { name: 'Jane' };
obj.friend.ref = obj;

// 基本循环引用处理
function stringifySafe(obj) {
  const seen = new WeakSet();

  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);
    }
    return value;
  });
}

// 保留引用路径
function stringifyWithPath(obj) {
  const paths = new WeakMap();

  return JSON.stringify(obj, function(key, value) {
    if (typeof value === 'object' && value !== null) {
      const path = paths.get(value);
      if (path) {
        return { $ref: path };
      }

      const currentPath = this.__path || '';
      const newPath = key ? `${currentPath}.${key}` : '$';
      paths.set(value, newPath);

      if (typeof value === 'object') {
        value.__path = newPath;
      }
    }
    return value;
  });
}

// 解析时恢复引用
function parseWithRefs(json) {
  const obj = JSON.parse(json);
  const refs = {};

  // 收集所有引用
  function collectRefs(o, path = '$') {
    if (!o || typeof o !== 'object') return;

    if (o.$ref) {
      refs[path] = o.$ref;
      return;
    }

    for (const key in o) {
      collectRefs(o[key], `${path}.${key}`);
    }
  }

  collectRefs(obj);

  // 恢复引用
  function resolveRefs(o, path = '$') {
    if (!o || typeof o !== 'object') return o;

    if (o.$ref) {
      return getByPath(obj, o.$ref);
    }

    for (const key in o) {
      o[key] = resolveRefs(o[key], `${path}.${key}`);
    }

    return o;
  }

  return resolveRefs(obj);
}

function getByPath(obj, path) {
  const parts = path.split('.').slice(1);
  let current = obj;

  for (const part of parts) {
    if (current == null) return undefined;
    current = current[part];
  }

  return current;
}
```

### 第三方库推荐

```javascript
// 使用 flatted 库处理循环引用
// npm install flatted

import { parse, stringify } from 'flatted';

const obj = { name: 'John' };
obj.self = obj;

const json = stringify(obj);
const restored = parse(json);

console.log(restored.self === restored); // true

// 使用 circular-json（已废弃，推荐使用 flatted）
```

---

## 性能优化

### 大对象序列化

```javascript
// 分块处理大对象
async function stringifyLarge(obj, chunkSize = 1000) {
  if (Array.isArray(obj)) {
    const chunks = [];
    for (let i = 0; i < obj.length; i += chunkSize) {
      const chunk = obj.slice(i, i + chunkSize);
      chunks.push(JSON.stringify(chunk));
      await new Promise(resolve => setTimeout(resolve, 0)); // 让出主线程
    }
    return `[${chunks.join(',')}]`;
  }

  return JSON.stringify(obj);
}

// 流式序列化
class JSONStringifier {
  constructor() {
    this.chunks = [];
  }

  write(obj) {
    this.chunks.push(JSON.stringify(obj));
  }

  end() {
    return `[${this.chunks.join(',')}]`;
  }
}

// Web Worker 中处理
// worker.js
self.onmessage = function(e) {
  const { data, id } = e.data;
  const json = JSON.stringify(data);
  self.postMessage({ json, id });
};

// main.js
function stringifyInWorker(obj) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('worker.js');

    worker.onmessage = (e) => {
      resolve(e.data.json);
      worker.terminate();
    };

    worker.onerror = reject;
    worker.postMessage({ data: obj, id: 1 });
  });
}
```

### 缓存序列化结果

```javascript
// 缓存常用对象的序列化结果
class JSONCache {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  stringify(obj) {
    const key = this.getKey(obj);

    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const json = JSON.stringify(obj);

    // LRU 缓存
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, json);
    return json;
  }

  getKey(obj) {
    // 简单的键生成策略
    if (obj && obj.id) return `id:${obj.id}`;
    if (obj && obj._id) return `_id:${obj._id}`;
    return JSON.stringify(obj); // 回退
  }

  clear() {
    this.cache.clear();
  }
}
```

---

## 安全考虑

### JSON 劫持防护

```javascript
// 服务端：添加前缀
// 正常 JSON: {"user":"John"}
// 防护后: )]}',\n{"user":"John"}

// 客户端解析
function parseProtectedJSON(str) {
  // 移除防护前缀
  const prefix = ")]}',\n";
  if (str.startsWith(prefix)) {
    str = str.slice(prefix.length);
  }
  return JSON.parse(str);
}
```

### JSON 注入防护

```javascript
// 危险：直接拼接 JSON
const unsafe = `{"name":"${userName}"}`;
// 如果 userName = 'John", "admin":true, "x":"'，会导致注入

// 安全：使用 JSON.stringify
const safe = JSON.stringify({ name: userName });

// HTML 中的 JSON
function safeJSONForHTML(obj) {
  return JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

// 用于 <script> 标签
const userData = safeJSONForHTML({ name: userInput });
const html = `<script>var user = ${userData};</script>`;
```

### 原型污染防护

```javascript
// 危险：直接解析用户 JSON
const userJson = '{"__proto__":{"admin":true}}';
const user = JSON.parse(userJson);
// 可能污染原型链

// 安全：过滤 __proto__
function safeParse(json) {
  const obj = JSON.parse(json);

  function clean(o) {
    if (!o || typeof o !== 'object') return o;

    // 删除危险属性
    delete o.__proto__;
    delete o.constructor;
    delete o.prototype;

    // 递归处理
    for (const key in o) {
      if (typeof o[key] === 'object') {
        clean(o[key]);
      }
    }

    return o;
  }

  return clean(obj);
}

// 使用 Object.create(null) 创建无原型对象
function parseWithNullProto(json) {
  const obj = JSON.parse(json);

  function clean(o) {
    if (!o || typeof o !== 'object') return o;

    const result = Object.create(null);

    for (const key in o) {
      if (key === '__proto__') continue;
      result[key] = typeof o[key] === 'object' ? clean(o[key]) : o[key];
    }

    return result;
  }

  return clean(obj);
}
```

---

## 自定义序列化

### toJSON 方法

```javascript
// 对象自带 toJSON 方法
class User {
  constructor(id, name, email, password) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  toJSON() {
    // 返回要序列化的对象（排除敏感信息）
    return {
      id: this.id,
      name: this.name,
      email: this.email
      // password 被排除
    };
  }
}

const user = new User(1, 'John', 'john@example.com', 'secret');
JSON.stringify(user); // {"id":1,"name":"John","email":"john@example.com"}

// 复杂示例
class Product {
  constructor(data) {
    Object.assign(this, data);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      formattedPrice: `$${this.price.toFixed(2)}`,
      inStock: this.stock > 0,
      createdAt: this.createdAt?.toISOString()
    };
  }
}
```

### 自定义序列化器

```javascript
class JsonSerializer {
  constructor() {
    this.types = new Map();
  }

  // 注册类型处理器
  register(type, handlers) {
    this.types.set(type, handlers);
  }

  // 序列化
  stringify(obj) {
    return JSON.stringify(obj, (key, value) => {
      for (const [type, handlers] of this.types) {
        if (value instanceof type) {
          return {
            __type: type.name,
            data: handlers.serialize(value)
          };
        }
      }
      return value;
    });
  }

  // 反序列化
  parse(json) {
    return JSON.parse(json, (key, value) => {
      if (value && value.__type) {
        for (const [type, handlers] of this.types) {
          if (type.name === value.__type) {
            return handlers.deserialize(value.data);
          }
        }
      }
      return value;
    });
  }
}

// 使用
const serializer = new JsonSerializer();

// 注册 Date 处理
serializer.register(Date, {
  serialize: (date) => date.toISOString(),
  deserialize: (str) => new Date(str)
});

// 注册 RegExp 处理
serializer.register(RegExp, {
  serialize: (regex) => ({ source: regex.source, flags: regex.flags }),
  deserialize: ({ source, flags }) => new RegExp(source, flags)
});

// 序列化和反序列化
const obj = {
  date: new Date(),
  pattern: /^test$/gi
};

const json = serializer.stringify(obj);
const restored = serializer.parse(json);
```

---

## 参考资源

- [MDN - JSON](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON)
- [JSON 规范](https://www.json.org/json-zh.html)
- [ECMAScript JSON 规范](https://tc39.es/ecma262/#sec-json-object)

---

[返回模块目录](./)
