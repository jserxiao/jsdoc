# 八、异步编程

> JavaScript 的异步编程是现代前端开发的核心技能。理解事件循环、Promise 和 async/await 是构建高性能应用的基石。

## 📁 模块目录

| 序号 | 主题 | 文件 | 核心内容 |
|------|------|------|----------|
| 1 | 回调与事件循环 | [01-回调与事件循环.md](./01-回调与事件循环.md) | 回调函数、事件循环基础 |
| 2 | Promise | [02-Promise.md](./02-Promise.md) | Promise 基础、链式调用、静态方法 |
| 3 | async/await | [03-async-await.md](./03-async-await.md) | async 函数、await 表达式、错误处理 |
| 4 | 异步应用 | [04-异步应用.md](./04-异步应用.md) | 并发控制、异步模式、实战技巧 |
| 5 | 事件循环详解 | [05-事件循环详解.md](./05-事件循环详解.md) | 微任务、宏任务、执行顺序 |
| 6 | 生成器与迭代器 | [06-生成器与迭代器.md](./06-生成器与迭代器.md) | Generator、Iterator、异步迭代 |

---

## 🎯 学习目标

通过本模块的学习，你将能够：

1. **理解 JavaScript 异步机制** - 掌握事件循环的工作原理
2. **熟练使用 Promise** - 理解 Promise 的状态和链式调用
3. **掌握 async/await** - 编写简洁的异步代码
4. **理解任务队列** - 区分微任务和宏任务的执行顺序
5. **处理异步错误** - 掌握异步代码的错误处理策略
6. **实现并发控制** - 管理多个异步操作的执行

---

## 📚 核心概念

### 异步编程演进

```javascript
// 1. 回调函数（Callback）
fetchData(function(result) {
    processData(result, function(processed) {
        saveData(processed, function(saved) {
            console.log('完成');
        });
    });
});
// 问题：回调地狱、错误处理困难

// 2. Promise
fetchData()
    .then(result => processData(result))
    .then(processed => saveData(processed))
    .then(saved => console.log('完成'))
    .catch(error => console.error(error));

// 3. async/await（推荐）
try {
    const result = await fetchData();
    const processed = await processData(result);
    const saved = await saveData(processed);
    console.log('完成');
} catch (error) {
    console.error(error);
}
```

### 事件循环模型

```
┌─────────────────────────────────────────────────────────────┐
│                     调用栈（Call Stack）                     │
│                   LIFO - 后进先出                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   微任务队列（Microtask Queue）              │
│                  优先级高，每个宏任务后执行                   │
│        Promise.then、MutationObserver、queueMicrotask       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   宏任务队列（Macrotask Queue）              │
│                setTimeout、setInterval、I/O、UI 渲染         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                         事件循环
```

### Promise 三种状态

```
         pending（进行中）
                │
        ┌───────┴───────┐
        │               │
        ▼               ▼
   fulfilled        rejected
   （已完成）        （已拒绝）
        │               │
   resolve()        reject()
        │               │
   .then()          .catch()
```

### async/await 本质

```javascript
// async/await 是 Promise 的语法糖
async function fetchUser(id) {
    const response = await fetch(`/api/users/${id}`);
    const user = await response.json();
    return user;
}

// 等价于
function fetchUser(id) {
    return fetch(`/api/users/${id}`)
        .then(response => response.json())
        .then(user => user);
}
```

---

## 🔄 知识关联

```
同步代码
    │
    └──→ 回调函数
              │
              └──→ Promise
                        │
                        ├──→ async/await
                        │         │
                        │         └──→ 并发控制
                        │
                        └──→ 事件循环
                                  │
                                  ├──→ 微任务
                                  │
                                  └──→ 宏任务
```

---

## ⚠️ 常见陷阱

### 1. 并行 vs 串行

```javascript
// ❌ 错误：串行执行（慢）
const user = await fetchUser();
const posts = await fetchPosts();
const comments = await fetchComments();

// ✅ 正确：并行执行（快）
const [user, posts, comments] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchComments()
]);
```

### 2. 忘记 await

```javascript
// ❌ 错误：忘记 await
async function getData() {
    const data = fetchData(); // 返回 Promise，不是数据
    return data; // 返回 Promise
}

// ✅ 正确：使用 await
async function getData() {
    const data = await fetchData();
    return data;
}
```

### 3. 循环中的异步

```javascript
// ❌ 错误：forEach 不等待
async function processItems(items) {
    items.forEach(async (item) => {
        await processItem(item);
    });
    console.log('完成'); // 可能在处理完成前执行
}

// ✅ 正确：使用 for...of
async function processItems(items) {
    for (const item of items) {
        await processItem(item);
    }
    console.log('完成');
}

// ✅ 正确：并行执行
async function processItems(items) {
    await Promise.all(items.map(item => processItem(item)));
    console.log('完成');
}
```

### 4. try/catch 中的异步

```javascript
// ❌ 错误：无法捕获异步错误
try {
    setTimeout(() => {
        throw new Error('异步错误');
    }, 100);
} catch (error) {
    console.log('无法捕获');
}

// ✅ 正确：在回调内部捕获
setTimeout(() => {
    try {
        throw new Error('异步错误');
    } catch (error) {
        console.log('捕获到错误');
    }
}, 100);

// ✅ 正确：使用 Promise
new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('异步错误')), 100);
}).catch(error => console.log('捕获到错误'));
```

---

## 💡 最佳实践

### 1. 选择合适的异步模式

```javascript
// 顺序执行：有依赖关系
const user = await fetchUser();
const profile = await fetchProfile(user.id);

// 并行执行：无依赖关系
const [users, products] = await Promise.all([
    fetchUsers(),
    fetchProducts()
]);

// 竞争执行：取最快
const response = await Promise.race([
    fetchFromServer1(),
    fetchFromServer2()
]);
```

### 2. 统一错误处理

```javascript
// 创建统一的错误处理包装器
async function withErrorHandling(fn, fallback = null) {
    try {
        return await fn();
    } catch (error) {
        console.error('操作失败:', error);
        return fallback;
    }
}

// 使用
const data = await withErrorHandling(() => fetchData(), []);
```

### 3. 超时控制

```javascript
function withTimeout(promise, ms) {
    const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), ms)
    );
    return Promise.race([promise, timeout]);
}

// 使用
const data = await withTimeout(fetchData(), 5000);
```

### 4. 并发限制

```javascript
async function limitConcurrency(tasks, limit) {
    const results = [];
    const executing = new Set();
    
    for (const task of tasks) {
        const promise = task().then(result => {
            executing.delete(promise);
            return result;
        });
        executing.add(promise);
        results.push(promise);
        
        if (executing.size >= limit) {
            await Promise.race(executing);
        }
    }
    
    return Promise.all(results);
}
```

---

## 🗺️ 学习路径

```
初级阶段：
1. 理解同步和异步的区别
2. 掌握回调函数的基本使用
3. 学会使用 setTimeout 和 setInterval

中级阶段：
4. 深入理解 Promise 的状态和链式调用
5. 掌握 Promise.all/race/allSettled/any
6. 学会使用 async/await 编写异步代码

高级阶段：
7. 理解事件循环和任务队列
8. 掌握微任务和宏任务的执行顺序
9. 实现并发控制和异步模式
```

---

## 📖 推荐资源

### 书籍
- 《你不知道的 JavaScript（中卷）》- 异步和性能
- 《JavaScript 高级程序设计》- Promise 和异步函数

### 在线资源
- [MDN - Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [MDN - async function](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function)
- [JavaScript Info - Promise](https://javascript.info/promise-basics)
- [JavaScript Info - Event Loop](https://javascript.info/event-loop)
- [Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

---

## 📝 练习建议

1. **手写 Promise** - 实现 Promise 的核心功能
2. **实现并发控制** - 限制同时执行的异步任务数量
3. **分析输出顺序** - 练习事件循环相关题目
4. **实现异步调度器** - 按优先级执行异步任务
5. **实现取消功能** - 为 Promise 添加取消能力

---

[返回上级目录](../index.md)
