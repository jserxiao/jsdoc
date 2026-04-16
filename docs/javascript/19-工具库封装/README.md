# 十九、工具库封装

## 常用工具函数

```javascript
// 类型判断
const isString = val => typeof val === 'string';
const isNumber = val => typeof val === 'number';
const isArray = Array.isArray;
const isObject = val => val !== null && typeof val === 'object';
const isEmpty = val => {
    if (val == null) return true;
    if (isArray(val)) return val.length === 0;
    if (isObject(val)) return Object.keys(val).length === 0;
    return false;
};

// 深拷贝
function deepClone(obj, hash = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (hash.has(obj)) return hash.get(obj);
    const clone = Array.isArray(obj) ? [] : {};
    hash.set(obj, clone);
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            clone[key] = deepClone(obj[key], hash);
        }
    }
    return clone;
}

// 防抖
function debounce(fn, delay) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

// 节流
function throttle(fn, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 随机字符串
function randomString(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// 格式化日期
function formatDate(date, format = 'YYYY-MM-DD') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day);
}
```

---

[返回上级目录](../README.md)
