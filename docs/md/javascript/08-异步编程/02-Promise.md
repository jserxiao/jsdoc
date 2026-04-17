# Promise

> Promise 是 JavaScript 异步编程的核心。它提供了一种更优雅的方式来处理异步操作，解决了回调地狱的问题。

## 学习要点

- 🔄 理解 Promise 的三种状态和状态转换
- 📝 掌握 then、catch、finally 的使用
- 🔗 理解 Promise 链式调用的原理
- ⚡ 掌握 Promise 静态方法的应用场景

---

## 1. 什么是 Promise？

### 问题：回调地狱

```javascript
// 传统的回调方式 - 回调地狱
getData(function(a) {
    getMoreData(a, function(b) {
        getMoreData(b, function(c) {
            getMoreData(c, function(d) {
                // 嵌套过深，难以维护
            });
        });
    });
});
```

### 解决方案：Promise

Promise 是一个代表异步操作最终完成或失败的对象。

```javascript
// Promise 写法 - 链式调用
getData()
    .then(a => getMoreData(a))
    .then(b => getMoreData(b))
    .then(c => getMoreData(c))
    .then(d => console.log(d))
    .catch(error => console.error(error));
```

---

## 2. Promise 基础

### 创建 Promise

```javascript
const promise = new Promise((resolve, reject) => {
    // resolve - 操作成功时调用
    // reject  - 操作失败时调用
    
    setTimeout(() => {
        const success = true;
        if (success) {
            resolve('成功的数据'); // 状态变为 fulfilled
        } else {
            reject('失败的原因');   // 状态变为 rejected
        }
    }, 1000);
});
```

### 使用 Promise

```javascript
promise
    .then(result => {
        console.log('成功:', result);
        // 可以返回值或新的 Promise
        return result.toUpperCase();
    })
    .then(upperResult => {
        console.log('处理后的结果:', upperResult);
    })
    .catch(error => {
        console.error('失败:', error);
    })
    .finally(() => {
        console.log('无论成功失败都会执行');
        // 常用于清理操作
    });
```

---

## 3. Promise 状态

Promise 有三种状态，状态一旦改变就不可逆：

```
         ┌──────────────────────────────────────┐
         │                                      │
         │           pending（进行中）           │
         │                                      │
         └──────────────┬───────────────────────┘
                        │
         ┌──────────────┴───────────────┐
         │                              │
         ▼                              ▼
┌─────────────────┐          ┌─────────────────┐
│   fulfilled     │          │    rejected     │
│   （已完成）     │          │    （已拒绝）    │
│                 │          │                 │
│  resolve() 调用  │          │  reject() 调用  │
└─────────────────┘          └─────────────────┘
```

### 状态特点

```javascript
// 状态只能改变一次
const p = new Promise((resolve, reject) => {
    resolve('first');
    reject('second'); // 无效！状态已经是 fulfilled
});

// 快捷创建
const p1 = Promise.resolve('value');  // 直接创建 fulfilled 状态
const p2 = Promise.reject('reason');  // 直接创建 rejected 状态
```

---

## 4. 链式调用

### then 的返回值

```javascript
Promise.resolve(1)
    .then(x => {
        console.log(x); // 1
        return x + 1;   // 返回普通值
    })
    .then(x => {
        console.log(x); // 2
        return Promise.resolve(x + 1); // 返回 Promise
    })
    .then(x => {
        console.log(x); // 3
        // 不返回值
    })
    .then(x => {
        console.log(x); // undefined
    });
```

### 错误冒泡

```javascript
// 错误会沿着链向下传递，直到遇到 catch
Promise.reject('error')
    .then(x => x + 1)      // 跳过
    .then(x => x * 2)      // 跳过
    .catch(e => {
        console.log('捕获:', e); // '捕获: error'
        return 'recovered';
    })
    .then(x => {
        console.log('继续:', x); // '继续: recovered'
    });
```

---

## 5. Promise 静态方法

### Promise.all - 全部成功

```javascript
// 所有 Promise 都成功才成功
// 一个失败就立即失败
const p1 = fetch('/api/users');
const p2 = fetch('/api/posts');
const p3 = fetch('/api/comments');

Promise.all([p1, p2, p3])
    .then(([users, posts, comments]) => {
        console.log('全部加载完成');
    })
    .catch(error => {
        console.log('有一个失败:', error);
    });
```

### Promise.race - 竞争

```javascript
// 返回最先完成的 Promise（无论成功失败）
Promise.race([
    fetch('/api/server1'),
    fetch('/api/server2')
]).then(response => {
    console.log('最快的响应');
});

// 超时控制
Promise.race([
    fetch('/api/data'),
    new Promise((_, reject) => 
        setTimeout(() => reject(new Error('timeout')), 5000)
    )
]);
```

### Promise.allSettled - 等待全部完成

```javascript
// 等待所有 Promise 完成（无论成功失败）
Promise.allSettled([
    Promise.resolve('success'),
    Promise.reject('error'),
    Promise.resolve('another')
]).then(results => {
    console.log(results);
    // [
    //   { status: 'fulfilled', value: 'success' },
    //   { status: 'rejected', reason: 'error' },
    //   { status: 'fulfilled', value: 'another' }
    // ]
});
```

### Promise.any - 任一成功

```javascript
// 返回第一个成功的 Promise
// 全部失败才失败
Promise.any([
    Promise.reject('error1'),
    Promise.resolve('success'),
    Promise.reject('error2')
]).then(result => {
    console.log(result); // 'success'
});
```

### 方法对比表

| 方法 | 描述 | 成功条件 | 失败条件 |
|------|------|----------|----------|
| `all` | 全部完成 | 全部成功 | 一个失败 |
| `race` | 竞争 | 第一个完成 | 第一个失败 |
| `allSettled` | 全部完成 | 永远成功 | 无 |
| `any` | 任一成功 | 一个成功 | 全部失败 |

---

## 6. 错误处理最佳实践

```javascript
// ✅ 推荐：使用 catch
fetch('/api/data')
    .then(response => {
        if (!response.ok) {
            throw new Error('HTTP ' + response.status);
        }
        return response.json();
    })
    .then(data => processData(data))
    .catch(error => {
        console.error('请求失败:', error);
        // 统一处理所有错误
    });

// ⚠️ 注意：then 的第二个参数
fetch('/api/data')
    .then(
        response => response.json(),
        error => console.log(error) // 只捕获当前 Promise 的错误
    );
```

---

## 练习题

```javascript
// 1. 实现一个延迟函数
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 使用
delay(1000).then(() => console.log('1秒后'));

// 2. 手写 Promise.all
function promiseAll(promises) {
    return new Promise((resolve, reject) => {
        const results = [];
        let count = 0;
        promises.forEach((p, i) => {
            Promise.resolve(p).then(value => {
                results[i] = value;
                if (++count === promises.length) {
                    resolve(results);
                }
            }).catch(reject);
        });
    });
}

// 3. 以下代码输出什么？
Promise.resolve(1)
    .then(x => x + 1)
    .then(x => { throw new Error('error') })
    .then(x => x + 1)
    .catch(e => 10)
    .then(x => x * 2)
    .then(console.log);
// 答案：20
```

---

[返回模块目录](./README.md)
