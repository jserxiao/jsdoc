# 设计模式

设计模式是软件开发中经过验证的解决方案模板。本模块介绍在 JavaScript 中常用的设计模式及其应用场景。

---

## 📁 模块目录

| 序号 | 模块 | 主要内容 | 文件 |
|------|------|----------|------|
| 1 | 创建型模式 | 单例、工厂、建造者、原型 | [01-创建型模式.md](./01-创建型模式.md) |
| 2 | 结构型模式 | 适配器、装饰器、代理、外观 | [02-结构型模式.md](./02-结构型模式.md) |
| 3 | 行为型模式 | 观察者、策略、命令、状态 | [03-行为型模式.md](./03-行为型模式.md) |

---

## 🎯 学习目标

学完本模块，你应该能够：

- ✅ 理解设计模式的基本概念和分类
- ✅ 掌握常用的创建型模式
- ✅ 掌握常用的结构型模式
- ✅ 掌握常用的行为型模式
- ✅ 在实际项目中正确选择和应用设计模式

---

## 📖 设计模式分类

```
设计模式
├── 创建型模式（Creational）
│   ├── 单例模式（Singleton）
│   ├── 工厂模式（Factory）
│   ├── 抽象工厂模式（Abstract Factory）
│   ├── 建造者模式（Builder）
│   └── 原型模式（Prototype）
│
├── 结构型模式（Structural）
│   ├── 适配器模式（Adapter）
│   ├── 装饰器模式（Decorator）
│   ├── 代理模式（Proxy）
│   ├── 外观模式（Facade）
│   ├── 桥接模式（Bridge）
│   ├── 组合模式（Composite）
│   └── 享元模式（Flyweight）
│
└── 行为型模式（Behavioral）
    ├── 观察者模式（Observer）
    ├── 发布订阅模式（Pub/Sub）
    ├── 策略模式（Strategy）
    ├── 命令模式（Command）
    ├── 状态模式（State）
    ├── 迭代器模式（Iterator）
    ├── 责任链模式（Chain of Responsibility）
    └── 模板方法模式（Template Method）
```

---

## 🔑 核心模式速查

### 创建型模式

| 模式 | 意图 | JavaScript 应用场景 |
|------|------|---------------------|
| 单例 | 保证一个类只有一个实例 | 全局状态管理、日志记录器 |
| 工厂 | 创建对象而不暴露创建逻辑 | 组件创建、API 适配 |
| 建造者 | 分步骤构建复杂对象 | 配置对象、表单构建器 |
| 原型 | 通过克隆创建对象 | 对象复制、缓存 |

### 结构型模式

| 模式 | 意图 | JavaScript 应用场景 |
|------|------|---------------------|
| 适配器 | 转换接口以兼容 | API 适配、数据格式转换 |
| 装饰器 | 动态添加功能 | 高阶组件、AOP |
| 代理 | 控制对象访问 | 数据绑定、懒加载 |
| 外观 | 简化复杂接口 | 库封装、API 简化 |

### 行为型模式

| 模式 | 意图 | JavaScript 应用场景 |
|------|------|---------------------|
| 观察者 | 一对多依赖通知 | 事件系统、数据绑定 |
| 策略 | 动态切换算法 | 表单验证、排序策略 |
| 命令 | 封装请求为对象 | 撤销/重做、任务队列 |
| 状态 | 状态变化改变行为 | 状态机、游戏状态 |

---

## 🏗️ 模式示例

### 单例模式

```javascript
class Singleton {
  constructor() {
    if (Singleton.instance) {
      return Singleton.instance;
    }
    Singleton.instance = this;
  }
}

// 现代实现
const singleton = new Proxy({}, {
  instance: null,
  construct(target, args) {
    if (!this.instance) {
      this.instance = new target(...args);
    }
    return this.instance;
  }
});
```

### 观察者模式

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
  }

  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(cb => cb(...args));
    }
  }

  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }
}
```

### 策略模式

```javascript
const strategies = {
  fast: (data) => /* 快速但不精确 */,
  accurate: (data) => /* 精确但较慢 */,
  balanced: (data) => /* 平衡方案 */
};

function process(data, strategy) {
  return strategies[strategy](data);
}
```

---

## 📊 模式选择指南

```
需要创建对象？
    │
    ├── 只需要一个实例 ──► 单例模式
    │
    ├── 需要灵活创建 ──► 工厂模式
    │
    └── 需要分步构建 ──► 建造者模式

需要控制对象访问？
    │
    ├── 需要代理功能 ──► 代理模式
    │
    ├── 需要添加功能 ──► 装饰器模式
    │
    └── 需要统一接口 ──► 外观模式

需要对象间通信？
    │
    ├── 一对多通知 ──► 观察者模式
    │
    ├── 需要解耦 ──► 发布订阅模式
    │
    └── 需要切换算法 ──► 策略模式
```

---

## ⚠️ 设计模式原则（SOLID）

| 原则 | 名称 | 含义 |
|------|------|------|
| S | 单一职责 | 一个类只做一件事 |
| O | 开闭原则 | 对扩展开放，对修改关闭 |
| L | 里氏替换 | 子类可以替换父类 |
| I | 接口隔离 | 接口要小而专一 |
| D | 依赖倒置 | 依赖抽象，不依赖具体 |

---

## 🔗 学习路径

```
开始
  │
  ▼
[创建型模式] ──► 单例、工厂、建造者、原型
  │
  ▼
[结构型模式] ──► 适配器、装饰器、代理、外观
  │
  ▼
[行为型模式] ──► 观察者、策略、命令、状态
  │
  ▼
[实践应用] ──► 在项目中识别和应用模式
  │
  ▼
完成设计模式模块 ✓
```

---

## 📚 参考资源

- [Design Patterns](https://refactoring.guru/design-patterns) - 设计模式详解
- [JavaScript 设计模式](https://www.patterns.dev/) - 现代 JS 设计模式
- [Learning JavaScript Design Patterns](https://addyosmani.com/resources/essentialjsdesignpatterns/book/)
- 《设计模式：可复用面向对象软件的基础》

---

[返回上级目录](../)
