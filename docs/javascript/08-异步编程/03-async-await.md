# async/await

> async/await 是 ES2017 引入的异步编程语法糖，让异步代码看起来像同步代码，大幅提升了代码可读性。

## 学习要点

- 🔄 理解 async 函数的本质
- ⏳ 掌握 await 的使用规则
- ⚠️ 学会正确处理异步错误
- 🚀 掌握并发控制技巧

---

## 1. 基本概念

### async 函数

```javascript
// async 声明一个异步函数
async function myFunction() {
    return 'Hello';
}

// async 函数始终返回 Promise
console.log(myFunction()); // Promise { 'Hello' }

// 等价于
function myFunction() {
    return Promise.resolve('Hello');
}

// 箭头函数形式
const myArrow = async () => {
    return 'Hello';
};

// 方法定义
const obj = {
    async method() {
        return 'Hello';
    }
};
```

### await 表达式

```javascript
// await 只能在 async 函数内使用
// await 会暂停函数执行，等待 Promise 解决
async function fetchData() {
    console.log('开始获取数据');
    
    const response = await fetch('/api/data'); // 等待请求完成
    console.log('请求完成');
    
    const data = await response.json(); // 等待解析完成
    console.log('解析完成', data);
    
    return data;
}

// await 会"解包" Promise 的值
async function example() {
    const value = await Promise.resolve(42);
    console.log(value); // 42（不是 Promise）
}
```

### 执行流程图

```
async function fetchUser() {
    console.log('1. 开始');
    const user = await getUser();
    console.log('2. 获取用户');
    const posts = await getPosts(user.id);
    console.log('3. 获取文章');
    return { user, posts };
}

执行流程：
┌──────────────────────────────────────────┐
│ console.log('1. 开始')                    │ → 同步执行
│ await getUser()                          │ → 暂停，等待 Promise
│     ↓                                    │
│     ← Promise 解决                       │
│ console.log('2. 获取用户')               │ → 继续执行
│ await getPosts()                         │ → 暂停，等待 Promise
│     ↓                                    │
│     ← Promise 解决                       │
│ console.log('3. 获取文章')               │ → 继续执行
│ return { user, posts }                   │ → 返回 Promise
└──────────────────────────────────────────┘
```

---

## 2. 对比：Promise vs async/await

### Promise 链式调用

```javascript
function fetchUser() {
    return fetch('/api/user')
        .then(response => response.json())
        .then(user => {
            return fetch(`/api/posts?userId=${user.id}`)
                .then(response => response.json())
                .then(posts => ({ user, posts }));
        });
}
```

### async/await 写法

```javascript
async function fetchUser() {
    const response = await fetch('/api/user');
    const user = await response.json();
    
    const postsResponse = await fetch(`/api/posts?userId=${user.id}`);
    const posts = await postsResponse.json();
    
    return { user, posts };
}
```

**优势：** 代码更线性，更接近同步思维，更易读

---

## 3. 错误处理

### try/catch

```javascript
async function fetchData() {
    try {
        const response = await fetch('/api/data');
        
        // 检查 HTTP 状态
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        // 捕获所有错误
        console.error('请求失败:', error);
        
        // 可以选择重新抛出
        throw error;
        
        // 或返回默认值
        // return null;
    }
}
```

### 多个错误的处理

```javascript
async function fetchAll() {
    try {
        const [users, posts] = await Promise.all([
            fetch('/api/users').then(r => r.json()),
            fetch('/api/posts').then(r => r.json())
        ]);
        return { users, posts };
    } catch (error) {
        // 任一请求失败都会进入这里
        console.error('至少一个请求失败:', error);
        throw error;
    }
}
```

### catch 方法替代

```javascript
// 也可以使用 Promise.catch
async function fetchData() {
    const data = await fetch('/api/data')
        .then(r => r.json())
        .catch(error => {
            console.error('失败:', error);
            return null; // 返回默认值
        });
    return data;
}
```

---

## 4. 并发控制

### 串行执行（一个接一个）

```javascript
async function processSequential(items) {
    const results = [];
    for (const item of items) {
        const result = await processItem(item);
        results.push(result);
    }
    return results;
}
```

### 并行执行（同时进行）

```javascript
async function processParallel(items) {
    // 使用 Promise.all 并行执行
    const results = await Promise.all(
        items.map(item => processItem(item))
    );
    return results;
}
```

### 限制并发数

```javascript
async function limitConcurrency(tasks, limit) {
    const results = [];
    const executing = new Set();
    
    for (const task of tasks) {
        // 创建 Promise 包装任务
        const promise = task().then(result => {
            executing.delete(promise);
            return result;
        });
        
        executing.add(promise);
        results.push(promise);
        
        // 当执行数量达到限制时，等待一个完成
        if (executing.size >= limit) {
            await Promise.race(executing);
        }
    }
    
    // 等待所有任务完成
    return Promise.all(results);
}

// 使用：最多同时执行 3 个任务
const results = await limitConcurrency(tasks, 3);
```

### 分批处理

```javascript
async function processBatch(items, batchSize = 5) {
    const results = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        // 每批并行执行
        const batchResults = await Promise.all(
            batch.map(item => processItem(item))
        );
        results.push(...batchResults);
    }
    
    return results;
}
```

---

## 5. 循环中的 async/await

### for...of（串行）

```javascript
async function processItems(items) {
    for (const item of items) {
        await processItem(item); // 一个接一个
    }
}
```

### 并行处理

```javascript
async function processItems(items) {
    await Promise.all(items.map(item => processItem(item)));
}
```

### for 循环（串行）

```javascript
async function processItems(items) {
    for (let i = 0; i < items.length; i++) {
        await processItem(items[i], i);
    }
}
```

### ⚠️ forEach 不能用于串行

```javascript
// ❌ 错误：forEach 不会等待 async
items.forEach(async (item) => {
    await processItem(item); // 不会按顺序执行！
});

// ✅ 正确：使用 for...of
for (const item of items) {
    await processItem(item);
}
```

---

## 6. 顶层 await（ES2022）

```javascript
// 在 ES Module 中，可以在顶层直接使用 await
// 不需要包裹在 async 函数中

// 动态导入
const lodash = await import('lodash');

// 获取配置
const config = await fetch('/api/config').then(r => r.json());

// 初始化
await initializeApp();

// 条件导入
if (needsFeature) {
    await import('./feature.js');
}
```

---

## 小结

| 语法 | 说明 |
|------|------|
| `async function` | 声明异步函数，返回 Promise |
| `await promise` | 等待 Promise 解决，获取值 |
| `try/catch` | 捕获异步错误 |
| `Promise.all` | 并行执行多个 |
| `for...of` | 串行处理数组 |

---

[返回模块目录](./README.md)
