# 错误处理与调试

错误处理是构建健壮应用的关键，调试是解决问题的核心技能。本模块介绍 JavaScript 错误处理机制和调试技巧。

---

## 📁 模块目录

| 序号 | 模块 | 主要内容 | 文件 |
|------|------|----------|------|
| 1 | 错误处理 | Error 类型、try-catch、错误冒泡、自定义错误 | [01-错误处理.md](./01-错误处理.md) |
| 2 | 调试技巧 | DevTools、断点、console、性能分析 | [02-调试技巧.md](./02-调试技巧.md) |

---

## 🎯 学习目标

学完本模块，你应该能够：

- ✅ 理解 JavaScript 错误类型和错误对象
- ✅ 正确使用 try-catch-finally 处理错误
- ✅ 实现自定义错误类型
- ✅ 熟练使用浏览器开发者工具调试
- ✅ 掌握常用的调试技巧和工具

---

## 🚨 错误类型速查

### 内置错误类型

```javascript
// Error - 基础错误类型
new Error('通用错误');

// TypeError - 类型错误
// TypeError: Cannot read property 'x' of undefined

// ReferenceError - 引用错误
// ReferenceError: x is not defined

// SyntaxError - 语法错误
// SyntaxError: Unexpected token

// RangeError - 范围错误
// RangeError: Maximum call stack size exceeded

// URIError - URI 编码错误
// URIError: URI malformed

// EvalError - eval 错误（较少使用）
```

### 错误对象属性

```javascript
try {
  throw new Error('Something went wrong');
} catch (error) {
  console.log(error.name);      // 'Error'
  console.log(error.message);   // 'Something went wrong'
  console.log(error.stack);     // 堆栈信息
  console.log(error.toString()); // 'Error: Something went wrong'
}
```

---

## 🔧 错误处理模式

### 基础 try-catch

```javascript
try {
  // 可能出错的代码
  const data = JSON.parse(jsonString);
} catch (error) {
  // 处理错误
  console.error('解析失败:', error.message);
} finally {
  // 无论成功失败都执行
  cleanup();
}
```

### 异步错误处理

```javascript
// Promise 错误处理
fetch('/api/data')
  .then(response => response.json())
  .catch(error => console.error('请求失败:', error))
  .finally(() => console.log('请求完成'));

// async/await 错误处理
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    return await response.json();
  } catch (error) {
    console.error('请求失败:', error);
    throw error; // 重新抛出
  }
}

// 全局错误捕获
window.addEventListener('unhandledrejection', event => {
  console.error('未处理的 Promise 拒绝:', event.reason);
});

window.addEventListener('error', event => {
  console.error('全局错误:', event.error);
});
```

### 自定义错误

```javascript
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.timestamp = new Date();
  }
}

class NetworkError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'NetworkError';
    this.statusCode = statusCode;
  }
}

// 使用
function validateUser(user) {
  if (!user.email) {
    throw new ValidationError('Email is required', 'email');
  }
}
```

---

## 🛠️ 调试工具

### Console 方法

```javascript
// 基本输出
console.log('普通日志');
console.info('信息');
console.warn('警告');
console.error('错误');

// 结构化输出
console.table([{ name: 'John' }, { name: 'Jane' }]);
console.dir(document.body);

// 分组
console.group('用户信息');
console.log('姓名:', name);
console.log('年龄:', age);
console.groupEnd();

// 计时
console.time('操作耗时');
// ... 执行操作
console.timeEnd('操作耗时'); // 操作耗时: 123.45ms

// 计数
console.count('点击次数');
console.count('点击次数'); // 点击次数: 2

// 堆栈追踪
console.trace('调用堆栈');

// 断言
console.assert(value > 0, '值必须大于 0');
```

### 调试器语句

```javascript
function complexCalculation(data) {
  debugger; // 代码会在此处暂停
  return data.map(x => x * 2);
}
```

---

## 📊 调试流程

```
调试流程
    │
    ▼
┌─────────────┐
│  复现问题   │ ──► 确定问题发生的条件
└─────────────┘
      │
      ▼
┌─────────────┐
│  定位问题   │ ──► 使用断点、console 定位代码
└─────────────┘
      │
      ▼
┌─────────────┐
│  分析原因   │ ──► 检查变量、调用栈
└─────────────┘
      │
      ▼
┌─────────────┐
│  修复问题   │ ──► 修改代码并测试
└─────────────┘
      │
      ▼
┌─────────────┐
│  验证修复   │ ──► 确保问题已解决
└─────────────┘
```

---

## 🚀 常见调试技巧

### 1. 条件断点

在 DevTools Sources 面板中，右键断点可以设置条件：
```javascript
// 只在特定条件下暂停
user.id === 123
```

### 2. 监视表达式

在 DevTools 中添加监视表达式，实时观察变量值变化。

### 3. 网络调试

```javascript
// 在 Network 面板中：
// - 查看请求/响应详情
// - 模拟慢速网络
// - 阻止特定请求
```

### 4. 性能分析

```javascript
// Performance 面板
// - 录制性能快照
// - 分析帧率、CPU 使用
// - 查看长任务

// Performance Monitor
// - 实时监控 FPS、内存、DOM 节点
```

---

## 🔗 学习路径

```
开始
  │
  ▼
[错误处理] ──► Error 类型、try-catch、自定义错误
  │
  ▼
[调试技巧] ──► DevTools、断点、console
  │
  ▼
[实践应用] ──► 错误监控、日志系统
  │
  ▼
完成错误处理与调试模块 ✓
```

---

## 📚 参考资源

- [MDN Error](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Error)
- [Chrome DevTools 文档](https://developer.chrome.com/docs/devtools/)
- [JavaScript 错误处理最佳实践](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)

---

[返回上级目录](../)
