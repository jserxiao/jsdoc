# Proxy 与 Reflect

> Proxy 和 Reflect 是 ES6 引入的两个强大的特性，它们允许我们拦截和自定义对象的基本操作。Vue 3 的响应式系统就是基于 Proxy 实现的。

## 学习要点

- 🔍 理解 Proxy 的概念和用法
- 📝 掌握 13 种拦截操作
- 🔮 理解 Reflect 的作用
- 🎯 学会实际应用场景

---

## 1. Proxy 基础

### 什么是 Proxy？

Proxy 用于创建一个对象的代理，从而实现基本操作的拦截和自定义。

```javascript
const target = {
    name: 'John',
    age: 30
};

const handler = {
    get(target, prop) {
        console.log(`读取属性: ${prop}`);
        return target[prop];
    }
};

const proxy = new Proxy(target, handler);

console.log(proxy.name); 
// 输出：读取属性: name
// 输出：John
```

### Proxy 的基本结构

```javascript
const proxy = new Proxy(target, handler);

// target: 要代理的目标对象
// handler: 包含各种拦截操作的对象（陷阱函数）

const target = { x: 1, y: 2 };
const handler = {}; // 空处理器，不做任何拦截

const proxy = new Proxy(target, handler);
console.log(proxy.x); // 1（直接透传）
```

---

## 2. Proxy 拦截操作

### get() - 拦截属性读取

```javascript
const person = {
    name: 'John',
    age: 30
};

const proxy = new Proxy(person, {
    get(target, prop, receiver) {
        // target: 目标对象
        // prop: 属性名
        // receiver: 代理对象本身
        
        console.log(`读取属性: ${prop}`);
        
        // 返回默认值
        if (prop in target) {
            return target[prop];
        } else {
            return '属性不存在';
        }
    }
});

console.log(proxy.name);    // John
console.log(proxy.unknown); // 属性不存在
```

### set() - 拦截属性设置

```javascript
const person = {
    name: 'John',
    age: 30
};

const proxy = new Proxy(person, {
    set(target, prop, value, receiver) {
        // target: 目标对象
        // prop: 属性名
        // value: 新值
        // receiver: 代理对象本身
        
        console.log(`设置属性: ${prop} = ${value}`);
        
        // 类型验证
        if (prop === 'age' && typeof value !== 'number') {
            throw new TypeError('age 必须是数字');
        }
        
        if (prop === 'age' && value < 0) {
            throw new RangeError('age 不能为负数');
        }
        
        target[prop] = value;
        return true; // 表示设置成功
    }
});

proxy.age = 31;    // 设置属性: age = 31
proxy.name = 'Jane'; // 设置属性: name = Jane

proxy.age = -5;    // RangeError: age 不能为负数
proxy.age = '30';  // TypeError: age 必须是数字
```

### has() - 拦截 in 操作符

```javascript
const obj = {
    name: 'John',
    _secret: 'hidden' // 私有属性
};

const proxy = new Proxy(obj, {
    has(target, prop) {
        // 隐藏以下划线开头的属性
        if (prop.startsWith('_')) {
            return false;
        }
        return prop in target;
    }
});

console.log('name' in proxy);    // true
console.log('_secret' in proxy); // false（隐藏了）
console.log('age' in proxy);     // false
```

### deleteProperty() - 拦截 delete 操作

```javascript
const obj = {
    name: 'John',
    _id: 123
};

const proxy = new Proxy(obj, {
    deleteProperty(target, prop) {
        // 禁止删除以 _ 开头的属性
        if (prop.startsWith('_')) {
            throw new Error(`不能删除 ${prop}`);
        }
        
        delete target[prop];
        return true;
    }
});

delete proxy.name;   // OK
console.log(proxy);  // { _id: 123 }

delete proxy._id;    // Error: 不能删除 _id
```

### ownKeys() - 拦截 Object.keys() 等

```javascript
const obj = {
    name: 'John',
    age: 30,
    _secret: 'hidden',
    [Symbol('id')]: 1
};

const proxy = new Proxy(obj, {
    ownKeys(target) {
        // 过滤掉 _ 开头的属性
        return Object.keys(target).filter(key => !key.startsWith('_'));
    }
});

console.log(Object.keys(proxy)); // ['name', 'age']

// 也影响 for...in
for (const key in proxy) {
    console.log(key); // name, age
}
```

### getOwnPropertyDescriptor()

```javascript
const obj = {
    name: 'John',
    _secret: 'hidden'
};

const proxy = new Proxy(obj, {
    getOwnPropertyDescriptor(target, prop) {
        // 隐藏私有属性的描述符
        if (prop.startsWith('_')) {
            return undefined;
        }
        return Object.getOwnPropertyDescriptor(target, prop);
    }
});

console.log(Object.getOwnPropertyDescriptor(proxy, 'name')); 
// { value: 'John', writable: true, enumerable: true, configurable: true }

console.log(Object.getOwnPropertyDescriptor(proxy, '_secret')); 
// undefined
```

### defineProperty() - 拦截 Object.defineProperty()

```javascript
const obj = {};

const proxy = new Proxy(obj, {
    defineProperty(target, prop, descriptor) {
        console.log(`定义属性: ${prop}`);
        
        // 禁止添加 _ 开头的属性
        if (prop.startsWith('_')) {
            return false;
        }
        
        Object.defineProperty(target, prop, descriptor);
        return true;
    }
});

Object.defineProperty(proxy, 'name', {
    value: 'John',
    writable: true
}); // 定义属性: name

Object.defineProperty(proxy, '_secret', {
    value: 'hidden'
}); // 返回 false，静默失败
```

### getPrototypeOf() 和 setPrototypeOf()

```javascript
const obj = {};
const proto = { greet() { return 'Hello'; } };

const proxy = new Proxy(obj, {
    getPrototypeOf(target) {
        console.log('获取原型');
        return Object.getPrototypeOf(target);
    },
    setPrototypeOf(target, newProto) {
        console.log('设置原型');
        Object.setPrototypeOf(target, newProto);
        return true;
    }
});

Object.getPrototypeOf(proxy); // 获取原型
Object.setPrototypeOf(proxy, proto); // 设置原型
```

### isExtensible() 和 preventExtensions()

```javascript
const obj = {};

const proxy = new Proxy(obj, {
    isExtensible(target) {
        console.log('检查是否可扩展');
        return Object.isExtensible(target);
    },
    preventExtensions(target) {
        console.log('阻止扩展');
        Object.preventExtensions(target);
        return true;
    }
});

Object.isExtensible(proxy); // true
Object.preventExtensions(proxy);
Object.isExtensible(proxy); // false
```

### apply() - 拦截函数调用

```javascript
function sum(a, b) {
    return a + b;
}

const proxy = new Proxy(sum, {
    apply(target, thisArg, args) {
        console.log(`调用函数，参数: ${args}`);
        
        // 参数验证
        if (args.some(arg => typeof arg !== 'number')) {
            throw new TypeError('所有参数必须是数字');
        }
        
        return target.apply(thisArg, args);
    }
});

console.log(proxy(1, 2)); // 调用函数，参数: 1,2 → 3
proxy(1, '2'); // TypeError
```

### construct() - 拦截 new 操作

```javascript
function Person(name) {
    this.name = name;
}

const proxy = new Proxy(Person, {
    construct(target, args, newTarget) {
        console.log(`创建实例，参数: ${args}`);
        
        // 必须返回对象
        const instance = new target(...args);
        instance.createdAt = new Date();
        return instance;
    }
});

const person = new proxy('John');
// 创建实例，参数: John
console.log(person.name);      // John
console.log(person.createdAt); // 当前时间
```

---

## 3. Reflect API

Reflect 是一个内置对象，提供与 Proxy handler 拦截操作对应的方法。

### Reflect 的作用

```javascript
// 1. 提供与 Object 方法对应的替代方案
const obj = { name: 'John' };

// 旧方式
'name' in obj;                    // true
delete obj.name;                  // true
Object.getOwnPropertyDescriptor(obj, 'name');

// Reflect 方式
Reflect.has(obj, 'name');         // true
Reflect.deleteProperty(obj, 'name'); // true
Reflect.getOwnPropertyDescriptor(obj, 'name');

// 2. Reflect 方法返回布尔值，更易处理错误
// Object.defineProperty 在失败时抛出异常
// Reflect.defineProperty 返回 false

const frozen = Object.freeze({ x: 1 });

// 旧方式需要 try-catch
try {
    Object.defineProperty(frozen, 'y', { value: 2 });
} catch (e) {
    console.log('定义失败');
}

// Reflect 方式更简洁
if (!Reflect.defineProperty(frozen, 'y', { value: 2 })) {
    console.log('定义失败');
}
```

### Reflect 方法列表

```javascript
// 与 Proxy handler 一一对应
Reflect.get(target, prop, receiver)
Reflect.set(target, prop, value, receiver)
Reflect.has(target, prop)
Reflect.deleteProperty(target, prop)
Reflect.ownKeys(target)
Reflect.getOwnPropertyDescriptor(target, prop)
Reflect.defineProperty(target, prop, descriptor)
Reflect.getPrototypeOf(target)
Reflect.setPrototypeOf(target, proto)
Reflect.isExtensible(target)
Reflect.preventExtensions(target)
Reflect.apply(target, thisArg, args)
Reflect.construct(target, args, newTarget)
```

### Proxy + Reflect 最佳实践

```javascript
const person = {
    name: 'John',
    age: 30,
    _secret: 'hidden'
};

const proxy = new Proxy(person, {
    get(target, prop, receiver) {
        // 使用 Reflect 代替直接访问
        console.log(`读取: ${prop}`);
        return Reflect.get(target, prop, receiver);
    },
    
    set(target, prop, value, receiver) {
        console.log(`设置: ${prop} = ${value}`);
        return Reflect.set(target, prop, value, receiver);
    },
    
    has(target, prop) {
        if (prop.startsWith('_')) {
            return false;
        }
        return Reflect.has(target, prop);
    },
    
    deleteProperty(target, prop) {
        if (prop.startsWith('_')) {
            return false;
        }
        return Reflect.deleteProperty(target, prop);
    }
});
```

---

## 4. 可撤销 Proxy

```javascript
// 创建可撤销的代理
const target = { name: 'John' };
const { proxy, revoke } = Proxy.revocable(target, {
    get(target, prop) {
        return target[prop].toUpperCase();
    }
});

console.log(proxy.name); // JOHN

// 撤销代理
revoke();

console.log(proxy.name); // TypeError: Cannot perform 'get' on a proxy that has been revoked
```

---

## 5. 实际应用

### 响应式系统

```javascript
function reactive(target) {
    const deps = new Map();
    
    return new Proxy(target, {
        get(target, key) {
            // 依赖收集
            if (activeEffect) {
                if (!deps.has(key)) {
                    deps.set(key, new Set());
                }
                deps.get(key).add(activeEffect);
            }
            return Reflect.get(target, key);
        },
        
        set(target, key, value) {
            const result = Reflect.set(target, key, value);
            // 触发更新
            if (deps.has(key)) {
                deps.get(key).forEach(fn => fn());
            }
            return result;
        }
    });
}

// 使用
let activeEffect = null;

function effect(fn) {
    activeEffect = fn;
    fn();
    activeEffect = null;
}

const state = reactive({ count: 0 });

effect(() => {
    console.log('count is:', state.count);
}); // count is: 0

state.count++; // count is: 1
```

### 数据验证

```javascript
function validate(target, schema) {
    return new Proxy(target, {
        set(target, key, value) {
            if (schema[key]) {
                const { type, min, max, validate } = schema[key];
                
                if (type && typeof value !== type) {
                    throw new TypeError(`${key} 必须是 ${type}`);
                }
                
                if (min !== undefined && value < min) {
                    throw new RangeError(`${key} 不能小于 ${min}`);
                }
                
                if (max !== undefined && value > max) {
                    throw new RangeError(`${key} 不能大于 ${max}`);
                }
                
                if (validate && !validate(value)) {
                    throw new Error(`${key} 验证失败`);
                }
            }
            
            return Reflect.set(target, key, value);
        }
    });
}

const person = validate({}, {
    name: { type: 'string' },
    age: { type: 'number', min: 0, max: 150 }
});

person.name = 'John'; // OK
person.age = 30;      // OK
person.age = -1;      // RangeError
```

### 访问日志

```javascript
function logAccess(target, name = 'Object') {
    return new Proxy(target, {
        get(target, prop) {
            console.log(`${name}.${prop} 被读取`);
            return Reflect.get(target, prop);
        },
        set(target, prop, value) {
            console.log(`${name}.${prop} = ${value}`);
            return Reflect.set(target, prop, value);
        }
    });
}

const api = logAccess({
    getUser(id) { return { id, name: 'User' + id }; },
    deleteUser(id) { return true; }
}, 'API');

api.getUser(1);
// API.getUser 被读取
```

### 默认值和计算属性

```javascript
const data = new Proxy({}, {
    get(target, prop) {
        // 计算属性
        if (prop === 'fullName') {
            return `${target.firstName || ''} ${target.lastName || ''}`.trim();
        }
        
        // 默认值
        if (!(prop in target)) {
            console.log(`属性 ${prop} 不存在，返回默认值`);
            return 'N/A';
        }
        
        return target[prop];
    }
});

data.firstName = 'John';
data.lastName = 'Doe';
console.log(data.fullName); // John Doe
console.log(data.age);      // N/A
```

---

## 小结

| Proxy 陷阱 | 触发时机 | Reflect 方法 |
|-----------|---------|-------------|
| get | 读取属性 | Reflect.get |
| set | 设置属性 | Reflect.set |
| has | in 操作符 | Reflect.has |
| deleteProperty | delete 操作 | Reflect.deleteProperty |
| ownKeys | Object.keys() 等 | Reflect.ownKeys |
| getOwnPropertyDescriptor | Object.getOwnPropertyDescriptor() | Reflect.getOwnPropertyDescriptor |
| defineProperty | Object.defineProperty() | Reflect.defineProperty |
| getPrototypeOf | Object.getPrototypeOf() | Reflect.getPrototypeOf |
| setPrototypeOf | Object.setPrototypeOf() | Reflect.setPrototypeOf |
| isExtensible | Object.isExtensible() | Reflect.isExtensible |
| preventExtensions | Object.preventExtensions() | Reflect.preventExtensions |
| apply | 函数调用 | Reflect.apply |
| construct | new 操作 | Reflect.construct |

---

[返回模块目录](./README.md)
