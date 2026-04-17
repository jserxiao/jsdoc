# 二十、手写实现

> 手写实现 JavaScript 常用 API 是深入理解语言原理和应对面试的重要方式。本模块涵盖高频手写题目。

## 📁 模块目录

## 一、函数方法手写

### 1. call / apply / bind

```javascript
// call 实现
Function.prototype.myCall = function(context, ...args) {
    context = context || window;
    const fn = Symbol();
    context[fn] = this;
    const result = context[fn](...args);
    delete context[fn];
    return result;
};

// apply 实现
Function.prototype.myApply = function(context, args) {
    context = context || window;
    const fn = Symbol();
    context[fn] = this;
    const result = context[fn](...args);
    delete context[fn];
    return result;
};

// bind 实现
Function.prototype.myBind = function(context, ...args) {
    const fn = this;
    const boundFn = function(...newArgs) {
        // new 调用时，this 指向新实例
        return fn.apply(
            this instanceof boundFn ? this : context,
            [...args, ...newArgs]
        );
    };
    // 保持原型链
    boundFn.prototype = Object.create(fn.prototype);
    return boundFn;
};
```

### 2. new 实现

```javascript
function myNew(Constructor, ...args) {
    // 1. 创建一个新对象，原型指向构造函数的 prototype
    const obj = Object.create(Constructor.prototype);
    
    // 2. 执行构造函数，绑定 this
    const result = Constructor.apply(obj, args);
    
    // 3. 如果构造函数返回对象，则返回该对象，否则返回新对象
    return result instanceof Object ? result : obj;
}
```

---

## 二、Promise 相关手写

### 1. Promise 基础实现

```javascript
class MyPromise {
    constructor(executor) {
        this.state = 'pending';
        this.value = undefined;
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];
        
        const resolve = (value) => {
            if (this.state === 'pending') {
                this.state = 'fulfilled';
                this.value = value;
                this.onFulfilledCallbacks.forEach(fn => fn());
            }
        };
        
        const reject = (reason) => {
            if (this.state === 'pending') {
                this.state = 'rejected';
                this.value = reason;
                this.onRejectedCallbacks.forEach(fn => fn());
            }
        };
        
        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }
    
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
        onRejected = typeof onRejected === 'function' ? onRejected : e => { throw e; };
        
        const promise2 = new MyPromise((resolve, reject) => {
            const handle = () => {
                setTimeout(() => {
                    try {
                        const fn = this.state === 'fulfilled' ? onFulfilled : onRejected;
                        const x = fn(this.value);
                        this.resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                });
            };
            
            if (this.state === 'pending') {
                this.onFulfilledCallbacks.push(handle);
                this.onRejectedCallbacks.push(handle);
            } else {
                handle();
            }
        });
        
        return promise2;
    }
    
    resolvePromise(promise2, x, resolve, reject) {
        if (promise2 === x) {
            return reject(new TypeError('Chaining cycle detected'));
        }
        
        if (x instanceof MyPromise) {
            x.then(resolve, reject);
        } else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
            let then;
            try {
                then = x.then;
            } catch (error) {
                return reject(error);
            }
            
            if (typeof then === 'function') {
                let called = false;
                try {
                    then.call(x, y => {
                        if (called) return;
                        called = true;
                        this.resolvePromise(promise2, y, resolve, reject);
                    }, r => {
                        if (called) return;
                        called = true;
                        reject(r);
                    });
                } catch (error) {
                    if (called) return;
                    reject(error);
                }
            } else {
                resolve(x);
            }
        } else {
            resolve(x);
        }
    }
    
    catch(onRejected) {
        return this.then(null, onRejected);
    }
    
    finally(onFinally) {
        return this.then(
            value => MyPromise.resolve(onFinally()).then(() => value),
            reason => MyPromise.resolve(onFinally()).then(() => { throw reason; })
        );
    }
    
    static resolve(value) {
        if (value instanceof MyPromise) return value;
        return new MyPromise(resolve => resolve(value));
    }
    
    static reject(reason) {
        return new MyPromise((_, reject) => reject(reason));
    }
}
```

### 2. Promise.all

```javascript
Promise.myAll = function(promises) {
    return new Promise((resolve, reject) => {
        const results = [];
        let count = 0;
        
        promises = Array.from(promises);
        
        if (promises.length === 0) {
            resolve(results);
            return;
        }
        
        promises.forEach((promise, index) => {
            Promise.resolve(promise).then(value => {
                results[index] = value;
                count++;
                
                if (count === promises.length) {
                    resolve(results);
                }
            }).catch(reject);
        });
    });
};
```

### 3. Promise.race

```javascript
Promise.myRace = function(promises) {
    return new Promise((resolve, reject) => {
        promises = Array.from(promises);
        promises.forEach(promise => {
            Promise.resolve(promise).then(resolve).catch(reject);
        });
    });
};
```

### 4. Promise.allSettled

```javascript
Promise.myAllSettled = function(promises) {
    return new Promise(resolve => {
        const results = [];
        let count = 0;
        
        promises = Array.from(promises);
        
        if (promises.length === 0) {
            resolve(results);
            return;
        }
        
        promises.forEach((promise, index) => {
            Promise.resolve(promise).then(
                value => {
                    results[index] = { status: 'fulfilled', value };
                    count++;
                    if (count === promises.length) resolve(results);
                },
                reason => {
                    results[index] = { status: 'rejected', reason };
                    count++;
                    if (count === promises.length) resolve(results);
                }
            );
        });
    });
};
```

### 5. Promise.any

```javascript
Promise.myAny = function(promises) {
    return new Promise((resolve, reject) => {
        const errors = [];
        let count = 0;
        
        promises = Array.from(promises);
        
        if (promises.length === 0) {
            reject(new AggregateError([], 'All promises were rejected'));
            return;
        }
        
        promises.forEach((promise, index) => {
            Promise.resolve(promise).then(resolve).catch(error => {
                errors[index] = error;
                count++;
                
                if (count === promises.length) {
                    reject(new AggregateError(errors, 'All promises were rejected'));
                }
            });
        });
    });
};
```

---

## 三、数组方法手写

### 1. map

```javascript
Array.prototype.myMap = function(callback, thisArg) {
    const result = [];
    for (let i = 0; i < this.length; i++) {
        result[i] = callback.call(thisArg, this[i], i, this);
    }
    return result;
};
```

### 2. filter

```javascript
Array.prototype.myFilter = function(callback, thisArg) {
    const result = [];
    for (let i = 0; i < this.length; i++) {
        if (callback.call(thisArg, this[i], i, this)) {
            result.push(this[i]);
        }
    }
    return result;
};
```

### 3. reduce

```javascript
Array.prototype.myReduce = function(callback, initialValue) {
    let acc = initialValue;
    let i = 0;
    
    if (initialValue === undefined) {
        acc = this[0];
        i = 1;
    }
    
    for (; i < this.length; i++) {
        acc = callback(acc, this[i], i, this);
    }
    
    return acc;
};
```

### 4. flat

```javascript
Array.prototype.myFlat = function(depth = 1) {
    const result = [];
    
    const flatten = (arr, d) => {
        for (const item of arr) {
            if (Array.isArray(item) && d > 0) {
                flatten(item, d - 1);
            } else {
                result.push(item);
            }
        }
    };
    
    flatten(this, depth);
    return result;
};

// 无限深度版本
Array.prototype.myFlatDeep = function() {
    const flatten = arr => 
        arr.reduce((acc, item) => 
            acc.concat(Array.isArray(item) ? flatten(item) : item),
            []
        );
    return flatten(this);
};
```

---

## 四、对象方法手写

### 1. Object.create

```javascript
Object.myCreate = function(proto, propertiesObject) {
    function F() {}
    F.prototype = proto;
    const obj = new F();
    
    if (propertiesObject) {
        Object.defineProperties(obj, propertiesObject);
    }
    
    return obj;
};
```

### 2. Object.assign

```javascript
Object.myAssign = function(target, ...sources) {
    if (target === null || target === undefined) {
        throw new TypeError('Cannot convert undefined or null to object');
    }
    
    const result = Object(target);
    
    for (const source of sources) {
        if (source !== null && source !== undefined) {
            for (const key of Object.keys(source)) {
                result[key] = source[key];
            }
        }
    }
    
    return result;
};
```

### 3. instanceof

```javascript
function myInstanceof(obj, Constructor) {
    if (obj === null || typeof obj !== 'object') {
        return false;
    }
    
    let proto = Object.getPrototypeOf(obj);
    
    while (proto !== null) {
        if (proto === Constructor.prototype) {
            return true;
        }
        proto = Object.getPrototypeOf(proto);
    }
    
    return false;
}
```

---

## 五、深拷贝

```javascript
function deepClone(obj, hash = new WeakMap()) {
    // null 或非对象类型直接返回
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    
    // 处理循环引用
    if (hash.has(obj)) {
        return hash.get(obj);
    }
    
    // 处理特殊对象
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof RegExp) return new RegExp(obj);
    if (obj instanceof Map) {
        const map = new Map();
        hash.set(obj, map);
        obj.forEach((value, key) => {
            map.set(deepClone(key, hash), deepClone(value, hash));
        });
        return map;
    }
    if (obj instanceof Set) {
        const set = new Set();
        hash.set(obj, set);
        obj.forEach(value => {
            set.add(deepClone(value, hash));
        });
        return set;
    }
    
    // 处理数组和普通对象
    const result = Array.isArray(obj) ? [] : {};
    hash.set(obj, result);
    
    // 处理 Symbol 键
    const symbolKeys = Object.getOwnPropertySymbols(obj);
    for (const symKey of symbolKeys) {
        result[symKey] = deepClone(obj[symKey], hash);
    }
    
    // 处理普通键
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            result[key] = deepClone(obj[key], hash);
        }
    }
    
    return result;
}
```

---

## 六、工具函数

### 1. 防抖 debounce

```javascript
function debounce(fn, delay, immediate = false) {
    let timer = null;
    
    return function(...args) {
        const callNow = immediate && !timer;
        
        clearTimeout(timer);
        
        timer = setTimeout(() => {
            timer = null;
            if (!immediate) {
                fn.apply(this, args);
            }
        }, delay);
        
        if (callNow) {
            fn.apply(this, args);
        }
    };
}
```

### 2. 节流 throttle

```javascript
function throttle(fn, delay) {
    let lastTime = 0;
    let timer = null;
    
    return function(...args) {
        const now = Date.now();
        const remaining = delay - (now - lastTime);
        
        if (remaining <= 0) {
            clearTimeout(timer);
            timer = null;
            lastTime = now;
            fn.apply(this, args);
        } else if (!timer) {
            timer = setTimeout(() => {
                lastTime = Date.now();
                timer = null;
                fn.apply(this, args);
            }, remaining);
        }
    };
}
```

### 3. 发布订阅模式

```javascript
class EventEmitter {
    constructor() {
        this.events = {};
    }
    
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
        return this;
    }
    
    emit(event, ...args) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(...args));
        }
        return this;
    }
    
    off(event, callback) {
        if (this.events[event]) {
            if (callback) {
                this.events[event] = this.events[event].filter(cb => cb !== callback);
            } else {
                delete this.events[event];
            }
        }
        return this;
    }
    
    once(event, callback) {
        const wrapper = (...args) => {
            callback(...args);
            this.off(event, wrapper);
        };
        return this.on(event, wrapper);
    }
}
```

---

## 七、数组扁平化、去重

### 1. 数组扁平化

```javascript
// 方法1：递归
function flatten1(arr) {
    const result = [];
    for (const item of arr) {
        if (Array.isArray(item)) {
            result.push(...flatten1(item));
        } else {
            result.push(item);
        }
    }
    return result;
}

// 方法2：reduce
function flatten2(arr) {
    return arr.reduce((acc, item) => 
        acc.concat(Array.isArray(item) ? flatten2(item) : item),
        []
    );
}

// 方法3：while 迭代
function flatten3(arr) {
    while (arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr);
    }
    return arr;
}
```

### 2. 数组去重

```javascript
// 方法1：Set
const unique1 = arr => [...new Set(arr)];

// 方法2：filter + indexOf
const unique2 = arr => arr.filter((item, index) => arr.indexOf(item) === index);

// 方法3：reduce
const unique3 = arr => arr.reduce((acc, item) => 
    acc.includes(item) ? acc : [...acc, item],
    []
);

// 方法4：对象键值对（适用于基本类型）
const unique4 = arr => {
    const obj = {};
    return arr.filter(item => 
        obj.hasOwnProperty(typeof item + JSON.stringify(item)) 
            ? false 
            : obj[typeof item + JSON.stringify(item)] = true
    );
};
```

---

[返回上级目录](../README.md)
