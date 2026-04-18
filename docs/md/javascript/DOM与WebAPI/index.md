# DOM 与 Web API

> 浏览器提供的 DOM 和 Web API 是前端开发的核心，掌握它们是构建交互式网页应用的基础。

## 📁 模块目录

| 序号 | 主题 | 文件 | 核心内容 |
|------|------|------|----------|
| 1 | DOM 操作 | [DOM操作.md](./DOM操作.md) | 节点查询、创建、修改、删除、性能优化 |
| 2 | 事件机制 | [事件机制.md](./事件机制.md) | 事件流、事件委托、自定义事件 |
| 3 | BOM 浏览器对象 | [BOM浏览器对象.md](./BOM浏览器对象.md) | window、location、history、navigator |
| 4 | 浏览器存储 | [浏览器存储.md](./浏览器存储.md) | cookie、localStorage、sessionStorage、IndexedDB |
| 5 | 网络请求 | [网络请求.md](./网络请求.md) | fetch、XMLHttpRequest、跨域处理 |
| 6 | WebSocket | [WebSocket.md](./WebSocket.md) | 实时通信、连接管理、心跳检测 |
| 7 | File API 与 Blob | [FileAPI与Blob.md](./FileAPI与Blob.md) | 文件处理、二进制数据、上传下载 |

---

## 🎯 学习目标

通过本模块的学习，你将能够：

1. **熟练操作 DOM** - 掌握节点的增删改查和遍历
2. **理解事件机制** - 掌握事件流、事件委托和自定义事件
3. **掌握 BOM 对象** - 理解 window、location、history 等核心对象
4. **使用浏览器存储** - 掌握各种存储方案及其应用场景
5. **进行网络请求** - 熟练使用 fetch 和处理跨域问题
6. **处理文件和数据** - 掌握文件上传下载和二进制数据处理
7. **理解 WebSocket 通信** - 掌握实时连接管理

---

## 📚 核心概念

### DOM 树结构

```
Document
└── html (HTMLElement)
    ├── head (HTMLHeadElement)
    │   ├── title
    │   ├── meta
    │   └── link
    └── body (HTMLBodyElement)
        ├── div
        │   ├── h1
        │   └── p
        └── script
```

### DOM 操作核心方法

```javascript
// 查询元素
const el = document.querySelector('#app');
const items = document.querySelectorAll('.item');

// 创建元素
const div = document.createElement('div');
div.textContent = 'Hello';
div.classList.add('box');

// 插入元素
parent.appendChild(div);
parent.append(div, 'text');
parent.insertBefore(div, reference);

// 删除元素
el.remove();
parent.removeChild(child);

// 修改元素
el.setAttribute('data-id', '1');
el.classList.toggle('active');
el.style.color = 'red';
```

### 事件传播机制

```
┌─────────────────────────────────────────────────────────────┐
│                        捕获阶段                              │
│                     window → document                        │
│                           ↓                                  │
│                     html → body                              │
│                           ↓                                  │
│                      目标元素                                │
│                           ↓                                  │
│                        冒泡阶段                              │
│                     body → html                              │
│                           ↓                                  │
│                   document → window                          │
└─────────────────────────────────────────────────────────────┘
```

### Web API 概览

```javascript
// BOM
window.location.href = '/new-page';
window.history.back();
window.navigator.userAgent;
window.screen.width;

// 存储
localStorage.setItem('key', 'value');
sessionStorage.setItem('key', 'value');
document.cookie = 'name=value';

// 网络
fetch('/api/data').then(res => res.json());
new WebSocket('ws://example.com/socket');

// 文件
const file = input.files[0];
const reader = new FileReader();
reader.readAsText(file);
```

---

## 🔄 知识关联

```
DOM 结构
    │
    ├──→ DOM 操作
    │         │
    │         ├──→ 节点增删改
    │         │
    │         └──→ 属性与样式
    │
    ├──→ 事件机制
    │         │
    │         ├──→ 事件监听
    │         │
    │         └──→ 事件委托
    │
    └──→ Web API
              │
              ├──→ BOM 对象
              │
              ├──→ 网络请求
              │
              └──→ 存储方案
```

---

## ⚠️ 常见陷阱

### 1. innerHTML 的 XSS 风险

```javascript
// ❌ 危险：可能导致 XSS 攻击
const userInput = '<script>alert("XSS")</script>';
el.innerHTML = userInput;

// ✅ 安全：使用 textContent
el.textContent = userInput;

// ✅ 或使用 DOMPurify 清理
el.innerHTML = DOMPurify.sanitize(userInput);
```

### 2. getElementsById 返回动态集合

```javascript
// HTMLCollection 是动态的
const items = document.getElementsByClassName('item');
console.log(items.length); // 3

// 添加新元素
document.body.appendChild(document.createElement('div')).className = 'item';
console.log(items.length); // 4（自动更新）

// 解决：转换为静态数组
const staticItems = [...document.querySelectorAll('.item')];
```

### 3. 事件监听器的内存泄漏

```javascript
// ❌ 忘记移除事件监听器
class Component {
    constructor() {
        this.handleClick = this.handleClick.bind(this);
        document.addEventListener('click', this.handleClick);
    }
    // 忘记在销毁时移除监听器
}

// ✅ 正确移除
class Component {
    constructor() {
        this.handleClick = this.handleClick.bind(this);
        document.addEventListener('click', this.handleClick);
    }
    
    destroy() {
        document.removeEventListener('click', this.handleClick);
    }
}
```

### 4. localStorage 的容量限制

```javascript
// localStorage 通常限制 5MB
try {
    localStorage.setItem('largeData', bigString);
} catch (e) {
    // 处理 QuotaExceededError
    console.log('存储空间已满');
    localStorage.clear();
}
```

---

## 💡 最佳实践

### 1. 使用事件委托

```javascript
// ❌ 为每个子元素绑定事件
document.querySelectorAll('.item').forEach(item => {
    item.addEventListener('click', handleClick);
});

// ✅ 使用事件委托
document.querySelector('#list').addEventListener('click', (e) => {
    if (e.target.matches('.item')) {
        handleClick(e);
    }
});
```

### 2. 批量 DOM 操作

```javascript
// ❌ 多次重排重绘
for (let i = 0; i < 1000; i++) {
    const li = document.createElement('li');
    list.appendChild(li); // 每次触发重排
}

// ✅ 使用文档片段
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
    const li = document.createElement('li');
    fragment.appendChild(li);
}
list.appendChild(fragment); // 只触发一次重排
```

### 3. 使用现代 API

```javascript
// 使用 fetch 替代 XMLHttpRequest
// 使用 classList 替代 className 字符串操作
// 使用 querySelector 替代 getElementById 等
// 使用 append/prepend 替代 appendChild
```

### 4. 异常处理

```javascript
// 网络请求异常处理
try {
    const response = await fetch('/api/data');
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
} catch (error) {
    console.error('请求失败:', error);
}
```

---

## 🗺️ 学习路径

```
初级阶段：
1. 掌握基本的 DOM 查询和操作
2. 理解事件监听和事件处理
3. 学会使用 window 和 location 对象

中级阶段：
4. 深入理解事件传播机制和事件委托
5. 掌握浏览器存储方案
6. 熟练使用 fetch 进行网络请求

高级阶段：
7. 掌握 WebSocket 实时通信
8. 理解文件处理和二进制数据
9. 学习 DOM 性能优化技巧
```

---

## 📖 推荐资源

### 书籍
- 《JavaScript 高级程序设计》- DOM 和事件章节
- 《JavaScript 权威指南》- 客户端 JavaScript

### 在线资源
- [MDN - DOM](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model)
- [MDN - Web APIs](https://developer.mozilla.org/zh-CN/docs/Web/API)
- [JavaScript Info - Document](https://javascript.info/document)
- [JavaScript Info - Events](https://javascript.info/introduction-browser-events)

---

## 📝 练习建议

1. **实现一个简单的轮播图** - 综合运用 DOM 操作和事件
2. **实现事件委托** - 处理动态列表的点击事件
3. **实现本地存储管理器** - 封装 localStorage 操作
4. **实现文件上传组件** - 处理文件选择和预览
5. **实现无限滚动** - 使用 Intersection Observer

---

[返回上级目录](../index.md)
