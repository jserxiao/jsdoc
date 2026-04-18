# 工具库封装

工具库封装是前端工程化的基础技能。本文档详细介绍如何封装高质量、可复用的 JavaScript 工具函数库，涵盖类型判断、数据处理、函数增强、DOM 操作、存储管理等常见场景。

---

## 目录

- [类型判断工具](#类型判断工具)
- [数据处理工具](#数据处理工具)
- [函数增强工具](#函数增强工具)
- [字符串处理工具](#字符串处理工具)
- [数组处理工具](#数组处理工具)
- [对象处理工具](#对象处理工具)
- [日期时间工具](#日期时间工具)
- [DOM 操作工具](#dom-操作工具)
- [存储管理工具](#存储管理工具)
- [URL 处理工具](#url-处理工具)
- [校验工具](#校验工具)
- [工具库设计原则](#工具库设计原则)

---

## 类型判断工具

### 基础类型判断

```javascript
/**
 * 类型判断工具集
 * 使用 Object.prototype.toString 实现精确类型判断
 */

// 获取原始类型
const getType = (value) => Object.prototype.toString.call(value).slice(8, -1);

// 基础类型判断
const isString = (value) => typeof value === 'string';
const isNumber = (value) => typeof value === 'number' && !isNaN(value);
const isBoolean = (value) => typeof value === 'boolean';
const isUndefined = (value) => value === undefined;
const isNull = (value) => value === null;
const isSymbol = (value) => typeof value === 'symbol';
const isBigInt = (value) => typeof value === 'bigint';

// 引用类型判断
const isObject = (value) => value !== null && typeof value === 'object';
const isArray = Array.isArray;
const isFunction = (value) => typeof value === 'function';
const isDate = (value) => getType(value) === 'Date';
const isRegExp = (value) => getType(value) === 'RegExp';
const isError = (value) => getType(value) === 'Error';
const isMap = (value) => getType(value) === 'Map';
const isSet = (value) => getType(value) === 'Set';
const isWeakMap = (value) => getType(value) === 'WeakMap';
const isWeakSet = (value) => getType(value) === 'WeakSet';
const isPromise = (value) => getType(value) === 'Promise';
const isArrayBuffer = (value) => getType(value) === 'ArrayBuffer';
const isDataView = (value) => getType(value) === 'DataView';

// 特殊判断
const isNaN = Number.isNaN;
const isFinite = Number.isFinite;
const isInteger = Number.isInteger;
const isSafeInteger = Number.isSafeInteger;

// 空值判断
const isEmpty = (value) => {
  if (value == null) return true;
  if (isArray(value) || typeof value === 'string') return value.length === 0;
  if (isMap(value) || isSet(value)) return value.size === 0;
  if (isObject(value)) return Object.keys(value).length === 0;
  return false;
};

// 是否为空对象
const isEmptyObject = (value) => {
  return isObject(value) && Object.keys(value).length === 0;
};

// 是否为类数组
const isArrayLike = (value) => {
  if (value == null || isFunction(value)) return false;
  const len = value.length;
  return isNumber(len) && len >= 0 && len <= Number.MAX_SAFE_INTEGER;
};

// 是否为原始类型
const isPrimitive = (value) => {
  return value === null || (typeof value !== 'object' && typeof value !== 'function');
};

// 是否为可迭代对象
const isIterable = (value) => {
  return value != null && typeof value[Symbol.iterator] === 'function';
};

// 是否为纯对象（通过 {} 或 new Object 创建）
const isPlainObject = (value) => {
  if (getType(value) !== 'Object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
};

// 导出
export {
  getType,
  isString,
  isNumber,
  isBoolean,
  isUndefined,
  isNull,
  isSymbol,
  isBigInt,
  isObject,
  isArray,
  isFunction,
  isDate,
  isRegExp,
  isError,
  isMap,
  isSet,
  isWeakMap,
  isWeakSet,
  isPromise,
  isArrayBuffer,
  isDataView,
  isNaN,
  isFinite,
  isInteger,
  isSafeInteger,
  isEmpty,
  isEmptyObject,
  isArrayLike,
  isPrimitive,
  isIterable,
  isPlainObject
};
```

---

## 数据处理工具

### 深拷贝

```javascript
/**
 * 深拷贝实现
 * 支持所有常见数据类型，处理循环引用
 */
function deepClone(obj, hash = new WeakMap()) {
  // null 或非对象类型直接返回
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 处理循环引用
  if (hash.has(obj)) {
    return hash.get(obj);
  }

  // 处理特殊对象类型
  if (obj instanceof Date) {
    const copy = new Date(obj);
    hash.set(obj, copy);
    return copy;
  }

  if (obj instanceof RegExp) {
    const copy = new RegExp(obj.source, obj.flags);
    copy.lastIndex = obj.lastIndex;
    hash.set(obj, copy);
    return copy;
  }

  if (obj instanceof Map) {
    const copy = new Map();
    hash.set(obj, copy);
    obj.forEach((value, key) => {
      copy.set(deepClone(key, hash), deepClone(value, hash));
    });
    return copy;
  }

  if (obj instanceof Set) {
    const copy = new Set();
    hash.set(obj, copy);
    obj.forEach(value => {
      copy.add(deepClone(value, hash));
    });
    return copy;
  }

  if (obj instanceof ArrayBuffer) {
    return obj.slice(0);
  }

  if (obj instanceof DataView) {
    return new DataView(obj.buffer.slice(0));
  }

  if (ArrayBuffer.isView(obj)) {
    // TypedArray
    return new obj.constructor(
      obj.buffer.slice(0),
      obj.byteOffset,
      obj.length
    );
  }

  // 处理数组和普通对象
  const result = Array.isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj));
  hash.set(obj, result);

  // 处理 Symbol 键
  const symbolKeys = Object.getOwnPropertySymbols(obj);
  for (const symKey of symbolKeys) {
    result[symKey] = deepClone(obj[symKey], hash);
  }

  // 处理普通键
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = deepClone(obj[key], hash);
    }
  }

  return result;
}
```

### 浅拷贝与合并

```javascript
/**
 * 浅拷贝
 */
const shallowClone = (obj) => {
  if (isArray(obj)) return [...obj];
  if (isPlainObject(obj)) return { ...obj };
  if (isMap(obj)) return new Map(obj);
  if (isSet(obj)) return new Set(obj);
  return obj;
};

/**
 * 对象合并（深度合并）
 */
function deepMerge(target, ...sources) {
  if (!sources.length) return target;

  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}

// 使用示例
const merged = deepMerge({}, obj1, obj2, obj3);
```

### 数据转换

```javascript
/**
 * 数组转对象
 */
const arrayToObject = (arr, key) => {
  return arr.reduce((obj, item) => {
    obj[item[key]] = item;
    return obj;
  }, {});
};

/**
 * 对象转数组
 */
const objectToArray = (obj, keyName = 'key') => {
  return Object.entries(obj).map(([key, value]) => ({
    [keyName]: key,
    value
  }));
};

/**
 * Map 转对象
 */
const mapToObject = (map) => {
  const obj = {};
  map.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
};

/**
 * 对象转 Map
 */
const objectToMap = (obj) => {
  return new Map(Object.entries(obj));
};

/**
 * JSON 安全序列化（处理循环引用）
 */
const safeStringify = (obj, space = 2) => {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) return '[Circular]';
      seen.add(value);
    }
    return value;
  }, space);
};
```

---

## 函数增强工具

### 防抖

```javascript
/**
 * 防抖函数
 * @param {Function} fn - 要执行的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @param {Object} options - 配置选项
 * @param {boolean} options.immediate - 是否立即执行
 * @param {Function} options.onWait - 等待时回调
 * @returns {Function}
 */
function debounce(fn, delay, options = {}) {
  const { immediate = false, onWait } = options;
  let timer = null;

  const debounced = function(...args) {
    const callNow = immediate && !timer;

    // 清除之前的定时器
    if (timer) {
      clearTimeout(timer);
    }

    // 设置新的定时器
    timer = setTimeout(() => {
      timer = null;
      if (!immediate) {
        fn.apply(this, args);
      }
    }, delay);

    // 等待中回调
    if (onWait && timer) {
      onWait();
    }

    // 立即执行
    if (callNow) {
      fn.apply(this, args);
    }
  };

  // 取消执行
  debounced.cancel = function() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  // 立即执行
  debounced.flush = function(...args) {
    this.cancel();
    fn.apply(this, args);
  };

  return debounced;
}
```

### 节流

```javascript
/**
 * 节流函数
 * @param {Function} fn - 要执行的函数
 * @param {number} interval - 间隔时间（毫秒）
 * @param {Object} options - 配置选项
 * @param {boolean} options.leading - 是否在开始时执行
 * @param {boolean} options.trailing - 是否在结束时执行
 * @returns {Function}
 */
function throttle(fn, interval, options = {}) {
  const { leading = true, trailing = true } = options;
  let lastTime = 0;
  let timer = null;

  const throttled = function(...args) {
    const now = Date.now();

    // 首次调用
    if (!lastTime && !leading) {
      lastTime = now;
    }

    const remaining = interval - (now - lastTime);

    // 超过间隔时间
    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      lastTime = now;
      fn.apply(this, args);
    } else if (!timer && trailing) {
      // 设置尾部调用
      timer = setTimeout(() => {
        lastTime = leading ? Date.now() : 0;
        timer = null;
        fn.apply(this, args);
      }, remaining);
    }
  };

  // 取消执行
  throttled.cancel = function() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    lastTime = 0;
  };

  return throttled;
}
```

### 柯里化与偏函数

```javascript
/**
 * 柯里化函数
 */
function curry(fn, arity = fn.length) {
  return function curried(...args) {
    if (args.length >= arity) {
      return fn.apply(this, args);
    }
    return function(...moreArgs) {
      return curried.apply(this, [...args, ...moreArgs]);
    };
  };
}

// 使用示例
const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);
curriedAdd(1)(2)(3); // 6
curriedAdd(1, 2)(3); // 6
curriedAdd(1)(2, 3); // 6

/**
 * 偏函数
 */
function partial(fn, ...presetArgs) {
  return function(...laterArgs) {
    return fn.apply(this, [...presetArgs, ...laterArgs]);
  };
}

// 使用示例
const multiply = (a, b, c) => a * b * c;
const double = partial(multiply, 2);
double(3, 4); // 24
```

### 函数组合

```javascript
/**
 * 从右到左组合函数
 */
function compose(...fns) {
  return function(...args) {
    return fns.reduceRight((result, fn) => {
      return [fn.apply(this, result)];
    }, args)[0];
  };
}

/**
 * 从左到右组合函数（管道）
 */
function pipe(...fns) {
  return function(...args) {
    return fns.reduce((result, fn) => {
      return fn.apply(this, result);
    }, args);
  };
}

// 使用示例
const addOne = x => x + 1;
const double = x => x * 2;
const square = x => x * x;

const compute = compose(square, double, addOne);
compute(3); // ((3 + 1) * 2) ^ 2 = 64

const computePipe = pipe(addOne, double, square);
computePipe(3); // ((3 + 1) * 2) ^ 2 = 64
```

### 记忆化

```javascript
/**
 * 记忆化函数
 */
function memoize(fn, resolver) {
  const cache = new Map();

  const memoized = function(...args) {
    const key = resolver ? resolver.apply(this, args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };

  memoized.cache = cache;
  memoized.clear = () => cache.clear();

  return memoized;
}

// 使用示例
const fibonacci = memoize((n) => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

fibonacci(50); // 12586269025（高效计算）
```

### 单次执行

```javascript
/**
 * 只执行一次的函数
 */
function once(fn) {
  let called = false;
  let result;

  return function(...args) {
    if (called) return result;

    called = true;
    result = fn.apply(this, args);
    return result;
  };
}

// 使用示例
const init = once(() => {
  console.log('初始化');
});
init(); // 打印 "初始化"
init(); // 无操作
```

---

## 字符串处理工具

```javascript
/**
 * 字符串工具集
 */

// 首字母大写
const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// 全部大写
const upperCase = (str) => str.toUpperCase();

// 全部小写
const lowerCase = (str) => str.toLowerCase();

// 驼峰转连字符
const camelToKebab = (str) => {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
};

// 连字符转驼峰
const kebabToCamel = (str) => {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
};

// 蛇形转驼峰
const snakeToCamel = (str) => {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
};

// 驼峰转蛇形
const camelToSnake = (str) => {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
};

// 截断字符串
const truncate = (str, length, suffix = '...') => {
  if (str.length <= length) return str;
  return str.slice(0, length) + suffix;
};

// 填充字符串
const pad = (str, length, char = ' ', type = 'right') => {
  const padStr = char.repeat(Math.max(0, length - str.length));
  switch (type) {
    case 'left': return padStr + str;
    case 'both': return padStr.slice(0, Math.ceil(padStr.length / 2)) + str + padStr.slice(Math.ceil(padStr.length / 2));
    default: return str + padStr;
  }
};

// 移除空白字符
const trim = (str, chars = ' ') => {
  const pattern = new RegExp(`^[${chars}]+|[${chars}]+$`, 'g');
  return str.replace(pattern, '');
};

// 生成随机字符串
const randomString = (length = 8, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// 生成 UUID
const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// 模板字符串
const template = (str, data) => {
  return str.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return data[key] !== undefined ? data[key] : '';
  });
};

// 转义 HTML
const escapeHtml = (str) => {
  const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return str.replace(/[&<>"']/g, char => escapeMap[char]);
};

// 反转义 HTML
const unescapeHtml = (str) => {
  const unescapeMap = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'"
  };
  return str.replace(/&(amp|lt|gt|quot|#39);/g, entity => unescapeMap[entity]);
};

// 计算字节长度
const byteLength = (str, encoding = 'utf-8') => {
  if (encoding === 'utf-8') {
    return new TextEncoder().encode(str).length;
  }
  return str.length;
};
```

---

## 数组处理工具

```javascript
/**
 * 数组工具集
 */

// 数组去重
const unique = (arr) => [...new Set(arr)];

// 按属性去重
const uniqueBy = (arr, key) => {
  const seen = new Set();
  return arr.filter(item => {
    const val = item[key];
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
};

// 数组扁平化
const flatten = (arr, depth = Infinity) => {
  return arr.flat(depth);
};

// 数组分块
const chunk = (arr, size) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

// 数组分组
const groupBy = (arr, key) => {
  return arr.reduce((groups, item) => {
    const group = typeof key === 'function' ? key(item) : item[key];
    if (!groups[group]) groups[group] = [];
    groups[group].push(item);
    return groups;
  }, {});
};

// 数组排序
const sortBy = (arr, key, order = 'asc') => {
  return [...arr].sort((a, b) => {
    const valA = typeof key === 'function' ? key(a) : a[key];
    const valB = typeof key === 'function' ? key(b) : b[key];
    const compare = valA < valB ? -1 : valA > valB ? 1 : 0;
    return order === 'desc' ? -compare : compare;
  });
};

// 数组交集
const intersection = (...arrays) => {
  return arrays.reduce((acc, arr) => acc.filter(x => arr.includes(x)));
};

// 数组并集
const union = (...arrays) => {
  return [...new Set(arrays.flat())];
};

// 数组差集
const difference = (arr1, arr2) => {
  return arr1.filter(x => !arr2.includes(x));
};

// 数组补集
const complement = (arr1, arr2) => {
  return difference(union(arr1, arr2), intersection(arr1, arr2));
};

// 数组求和
const sum = (arr) => arr.reduce((acc, val) => acc + val, 0);

// 数组平均值
const average = (arr) => arr.length ? sum(arr) / arr.length : 0;

// 数组最大值
const max = (arr) => Math.max(...arr);

// 数组最小值
const min = (arr) => Math.min(...arr);

// 数组洗牌
const shuffle = (arr) => {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// 随机取元素
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

// 随机取多个元素
const sampleSize = (arr, size) => {
  return shuffle(arr).slice(0, size);
};

// 数组统计
const countBy = (arr, key) => {
  return arr.reduce((counts, item) => {
    const val = typeof key === 'function' ? key(item) : item[key];
    counts[val] = (counts[val] || 0) + 1;
    return counts;
  }, {});
};

// 移除假值
const compact = (arr) => arr.filter(Boolean);

// 移除指定值
const without = (arr, ...values) => {
  return arr.filter(item => !values.includes(item));
};

// 数组分页
const paginate = (arr, page, pageSize) => {
  const start = (page - 1) * pageSize;
  return arr.slice(start, start + pageSize);
};

// 树形结构扁平化
const flattenTree = (arr, childrenKey = 'children') => {
  const result = [];
  const flatten = (items) => {
    items.forEach(item => {
      result.push(item);
      if (item[childrenKey]) {
        flatten(item[childrenKey]);
      }
    });
  };
  flatten(arr);
  return result;
};
```

---

## 对象处理工具

```javascript
/**
 * 对象工具集
 */

// 获取嵌套属性值
const get = (obj, path, defaultValue = undefined) => {
  const keys = path.split('.');
  let result = obj;
  for (const key of keys) {
    if (result == null) return defaultValue;
    result = result[key];
  }
  return result !== undefined ? result : defaultValue;
};

// 设置嵌套属性值
const set = (obj, path, value) => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  let target = obj;

  for (const key of keys) {
    if (target[key] == null) {
      target[key] = {};
    }
    target = target[key];
  }

  target[lastKey] = value;
  return obj;
};

// 检查属性是否存在
const has = (obj, path) => {
  const keys = path.split('.');
  let target = obj;

  for (const key of keys) {
    if (target == null || !(key in target)) {
      return false;
    }
    target = target[key];
  }

  return true;
};

// 删除属性
const omit = (obj, ...keys) => {
  const result = { ...obj };
  keys.flat().forEach(key => {
    delete result[key];
  });
  return result;
};

// 选取属性
const pick = (obj, ...keys) => {
  const result = {};
  keys.flat().forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

// 获取所有键路径
const getAllPaths = (obj, prefix = '') => {
  const paths = [];
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const path = prefix ? `${prefix}.${key}` : key;
      paths.push(path);
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        paths.push(...getAllPaths(obj[key], path));
      }
    }
  }
  return paths;
};

// 对象映射
const mapValues = (obj, fn) => {
  const result = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = fn(obj[key], key, obj);
    }
  }
  return result;
};

// 对象键映射
const mapKeys = (obj, fn) => {
  const result = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[fn(obj[key], key, obj)] = obj[key];
    }
  }
  return result;
};

// 反转键值
const invert = (obj) => {
  const result = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[obj[key]] = key;
    }
  }
  return result;
};

// 冻结对象（深冻结）
const deepFreeze = (obj) => {
  Object.freeze(obj);
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const val = obj[key];
      if (typeof val === 'object' && val !== null && !Object.isFrozen(val)) {
        deepFreeze(val);
      }
    }
  }
  return obj;
};
```

---

## 日期时间工具

```javascript
/**
 * 日期时间工具集
 */

// 解析日期
const parseDate = (date) => {
  if (date instanceof Date) return date;
  if (typeof date === 'number') return new Date(date);
  if (typeof date === 'string') return new Date(date);
  return new Date();
};

// 格式化日期
const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  const d = parseDate(date);

  const tokens = {
    YYYY: d.getFullYear(),
    YY: String(d.getFullYear()).slice(-2),
    MM: String(d.getMonth() + 1).padStart(2, '0'),
    M: d.getMonth() + 1,
    DD: String(d.getDate()).padStart(2, '0'),
    D: d.getDate(),
    HH: String(d.getHours()).padStart(2, '0'),
    H: d.getHours(),
    hh: String(d.getHours() % 12 || 12).padStart(2, '0'),
    h: d.getHours() % 12 || 12,
    mm: String(d.getMinutes()).padStart(2, '0'),
    m: d.getMinutes(),
    ss: String(d.getSeconds()).padStart(2, '0'),
    s: d.getSeconds(),
    SSS: String(d.getMilliseconds()).padStart(3, '0'),
    A: d.getHours() >= 12 ? 'PM' : 'AM',
    a: d.getHours() >= 12 ? 'pm' : 'am'
  };

  return format.replace(/YYYY|YY|MM|M|DD|D|HH|H|hh|h|mm|m|ss|s|SSS|A|a/g, match => tokens[match]);
};

// 相对时间
const timeAgo = (date) => {
  const d = parseDate(date);
  const now = new Date();
  const diff = now - d;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years}年前`;
  if (months > 0) return `${months}个月前`;
  if (days > 0) return `${days}天前`;
  if (hours > 0) return `${hours}小时前`;
  if (minutes > 0) return `${minutes}分钟前`;
  if (seconds > 0) return `${seconds}秒前`;
  return '刚刚';
};

// 日期计算
const addDays = (date, days) => {
  const d = parseDate(date);
  d.setDate(d.getDate() + days);
  return d;
};

const addMonths = (date, months) => {
  const d = parseDate(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

const addYears = (date, years) => {
  const d = parseDate(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
};

// 日期比较
const isSameDay = (date1, date2) => {
  const d1 = parseDate(date1);
  const d2 = parseDate(date2);
  return d1.toDateString() === d2.toDateString();
};

const isToday = (date) => isSameDay(date, new Date());

const isYesterday = (date) => isSameDay(date, addDays(new Date(), -1));

const isTomorrow = (date) => isSameDay(date, addDays(new Date(), 1));

// 获取月份天数
const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

// 获取月份第一天是周几
const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};
```

---

## DOM 操作工具

```javascript
/**
 * DOM 工具集
 */

// 选择元素
const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

// 创建元素
const createElement = (tag, attrs = {}, children = []) => {
  const el = document.createElement(tag);

  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'className') {
      el.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(el.style, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === 'dataset') {
      Object.entries(value).forEach(([k, v]) => {
        el.dataset[k] = v;
      });
    } else {
      el.setAttribute(key, value);
    }
  });

  children.forEach(child => {
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      el.appendChild(child);
    }
  });

  return el;
};

// 添加类
const addClass = (el, ...classes) => {
  el.classList.add(...classes);
};

// 移除类
const removeClass = (el, ...classes) => {
  el.classList.remove(...classes);
};

// 切换类
const toggleClass = (el, className, force) => {
  el.classList.toggle(className, force);
};

// 检查类
const hasClass = (el, className) => {
  return el.classList.contains(className);
};

// 设置样式
const setStyle = (el, styles) => {
  Object.assign(el.style, styles);
};

// 获取样式
const getStyle = (el, property) => {
  return window.getComputedStyle(el)[property];
};

// 显示/隐藏
const show = (el) => {
  el.style.display = '';
};

const hide = (el) => {
  el.style.display = 'none';
};

const toggle = (el) => {
  if (el.style.display === 'none') {
    show(el);
  } else {
    hide(el);
  }
};

// 元素位置
const offset = (el) => {
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    width: rect.width,
    height: rect.height
  };
};

// 滚动到元素
const scrollToElement = (el, options = {}) => {
  el.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    ...options
  });
};

// 复制到剪贴板
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // 降级方案
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  }
};

// 全屏
const requestFullscreen = (el = document.documentElement) => {
  if (el.requestFullscreen) {
    return el.requestFullscreen();
  }
};

const exitFullscreen = () => {
  if (document.exitFullscreen) {
    return document.exitFullscreen();
  }
};

const isFullscreen = () => {
  return !!document.fullscreenElement;
};
```

---

## 存储管理工具

```javascript
/**
 * 存储工具集
 */

// LocalStorage 封装
const storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  clear() {
    localStorage.clear();
  },

  has(key) {
    return localStorage.getItem(key) !== null;
  }
};

// SessionStorage 封装
const session = {
  get(key, defaultValue = null) {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove(key) {
    sessionStorage.removeItem(key);
  },

  clear() {
    sessionStorage.clear();
  }
};

// 带过期时间的存储
const expiringStorage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;

      const { value, expiry } = JSON.parse(item);
      if (expiry && Date.now() > expiry) {
        localStorage.removeItem(key);
        return defaultValue;
      }
      return value;
    } catch {
      return defaultValue;
    }
  },

  set(key, value, ttl) {
    const item = {
      value,
      expiry: ttl ? Date.now() + ttl : null
    };
    localStorage.setItem(key, JSON.stringify(item));
  }
};

// Cookie 操作
const cookie = {
  get(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  },

  set(name, value, options = {}) {
    const { days, path = '/', domain, secure, sameSite = 'Lax' } = options;

    let cookie = `${name}=${encodeURIComponent(value)}`;
    cookie += `; path=${path}`;

    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      cookie += `; expires=${date.toUTCString()}`;
    }

    if (domain) cookie += `; domain=${domain}`;
    if (secure) cookie += '; secure';
    cookie += `; sameSite=${sameSite}`;

    document.cookie = cookie;
  },

  remove(name, options = {}) {
    this.set(name, '', { ...options, days: -1 });
  }
};
```

---

## URL 处理工具

```javascript
/**
 * URL 工具集
 */

// 解析 URL
const parseUrl = (url) => {
  const a = document.createElement('a');
  a.href = url;
  return {
    href: a.href,
    origin: a.origin,
    protocol: a.protocol,
    host: a.host,
    hostname: a.hostname,
    port: a.port,
    pathname: a.pathname,
    search: a.search,
    hash: a.hash
  };
};

// 解析查询字符串
const parseQuery = (queryString) => {
  const searchParams = new URLSearchParams(queryString);
  const result = {};
  for (const [key, value] of searchParams) {
    result[key] = value;
  }
  return result;
};

// 对象转查询字符串
const stringifyQuery = (obj) => {
  return new URLSearchParams(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null)
  ).toString();
};

// 获取查询参数
const getQueryParam = (name, url = window.location.href) => {
  const { searchParams } = new URL(url);
  return searchParams.get(name);
};

// 设置查询参数
const setQueryParam = (url, params) => {
  const urlObj = new URL(url);
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      urlObj.searchParams.delete(key);
    } else {
      urlObj.searchParams.set(key, value);
    }
  });
  return urlObj.toString();
};

// URL 拼接
const joinUrl = (...parts) => {
  return parts
    .map((part, i) => {
      if (i === 0) {
        return part.replace(/\/+$/, '');
      }
      if (i === parts.length - 1) {
        return part.replace(/^\/+/, '');
      }
      return part.replace(/^\/+|\/+$/g, '');
    })
    .join('/');
};

// 判断是否为有效 URL
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
```

---

## 校验工具

```javascript
/**
 * 校验工具集
 */

// 邮箱校验
const isEmail = (value) => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
};

// 手机号校验（中国大陆）
const isPhone = (value) => {
  return /^1[9]\d{9}$/.test(value);
};

// 身份证号校验（中国大陆）
const isIdCard = (value) => {
  const reg = /^[9]\d{5}(19|20)\d{2}(0[9]|1[2])(0[9]|[12]\d|3[01])\d{3}[\dXx]$/;
  if (!reg.test(value)) return false;

  // 校验码验证
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += parseInt(value[i]) * weights[i];
  }
  return checkCodes[sum % 11] === value[17].toUpperCase();
};

// URL 校验
const isUrl = (value) => {
  return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value);
};

// 银行卡号校验（Luhn 算法）
const isBankCard = (value) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

// 密码强度校验
const checkPasswordStrength = (password) => {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

  if (strength <= 2) return 'weak';
  if (strength <= 4) return 'medium';
  return 'strong';
};

// 中文姓名校验
const isChineseName = (value) => {
  return /^[\u4e00-\u9fa5]{2,10}$/.test(value);
};

// IP 地址校验
const isIPv4 = (value) => {
  const parts = value.split('.');
  if (parts.length !== 4) return false;
  return parts.every(part => {
    const num = parseInt(part);
    return num >= 0 && num <= 255 && part === String(num);
  });
};

const isIPv6 = (value) => {
  return /^([9a-fA-F]{1,4}:){7}[9a-fA-F]{1,4}$/.test(value);
};

// 颜色值校验
const isHexColor = (value) => {
  return /^#([9A-Fa-f]{3}){1,2}$/.test(value);
};

const isRgbColor = (value) => {
  return /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(value);
};
```

---

## 工具库设计原则

### 模块化设计

```javascript
/**
 * 工具库模块结构示例
 */

// utils/index.js - 统一入口
export * from './type';
export * from './string';
export * from './array';
export * from './object';
export * from './function';
export * from './date';
export * from './dom';
export * from './storage';
export * from './url';
export * from './validate';

// 按需导入
// import { debounce, throttle, deepClone } from 'utils';
```

### Tree-shaking 支持

```javascript
// 确保 ES Module 格式
// package.json
{
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.cjs.js"
    }
  },
  "sideEffects": false
}
```

### TypeScript 类型支持

```typescript
// types/index.d.ts
export declare function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  options?: {
    immediate?: boolean;
    onWait?: () => void;
  }
): T & { cancel: () => void; flush: (...args: Parameters<T>) => void };

export declare function deepClone<T>(obj: T): T;

export declare function isEmail(value: string): boolean;
```

### 单元测试

```javascript
// utils/__tests__/string.test.js
import { describe, it, expect } from 'vitest';
import { capitalize, truncate, uuid } from '../string';

describe('string utils', () => {
  it('capitalize should work correctly', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('HELLO')).toBe('HELLO');
    expect(capitalize('')).toBe('');
  });

  it('truncate should work correctly', () => {
    expect(truncate('hello world', 5)).toBe('hello...');
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('uuid should generate valid UUID', () => {
    const id = uuid();
    expect(id).toMatch(/^[9a-f]{8}-[9a-f]{4}-4[9a-f]{3}-[89ab][9a-f]{3}-[9a-f]{12}$/);
  });
});
```

---

## 参考资源

- [Lodash 文档](https://lodash.com/docs/)
- [Underscore.js](https://underscorejs.org/)
- [Ramda 文档](https://ramdajs.com/)
- [30 Seconds of Code](https://www.30secondsofcode.org/)

---

[返回上级目录](../)
