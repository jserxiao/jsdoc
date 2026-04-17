# 七、数组与集合

> 数组是 JavaScript 中最常用的数据结构，掌握数组方法和集合类型是处理数据的基础。

## 📁 模块目录

| 序号 | 主题 | 文件 | 核心内容 |
|------|------|------|----------|
| 1 | 数组方法 | [01-数组方法.md](./01-数组方法.md) | 增删改、查找、遍历、排序、去重 |
| 2 | 类型化数组 | [02-类型化数组.md](./02-类型化数组.md) | ArrayBuffer、TypedArray、DataView |
| 3 | ES6 集合类型 | [03-ES6集合类型.md](./03-ES6集合类型.md) | Map、Set、WeakMap、WeakSet |

---

## 🎯 学习目标

通过本模块的学习，你将能够：

1. **熟练使用数组方法** - 掌握增删改查、遍历、排序等核心操作
2. **理解数组方法分类** - 区分改变原数组与不改变原数组的方法
3. **掌握类型化数组** - 理解二进制数据处理
4. **使用 ES6 集合类型** - 掌握 Map、Set 及其应用场景
5. **高效处理数据** - 选择合适的数据结构和方法

---

## 📚 核心概念

### 数组方法分类

```javascript
// 1. 改变原数组的方法（破坏性）
const arr1 = [1, 2, 3];
arr1.push(4);      // 末尾添加
arr1.pop();        // 末尾删除
arr1.unshift(0);   // 开头添加
arr1.shift();      // 开头删除
arr1.splice(1, 1); // 删除/插入/替换
arr1.sort();       // 排序
arr1.reverse();    // 反转
arr1.fill(0);      // 填充
arr1.copyWithin(0, 1); // 内部复制

// 2. 不改变原数组的方法（非破坏性）
const arr2 = [1, 2, 3];
arr2.slice(1);         // 截取
arr2.concat([4, 5]);   // 合并
arr2.map(x => x * 2);  // 映射
arr2.filter(x => x > 1); // 过滤
arr2.flat();           // 扁平化

// 3. ES2023 新增非破坏性方法
arr2.toSorted();       // 排序（返回新数组）
arr2.toReversed();     // 反转（返回新数组）
arr2.toSpliced(1, 1);  // 增删（返回新数组）
arr2.with(0, 100);     // 替换（返回新数组）
```

### 数组遍历方法

```javascript
const arr = [1, 2, 3, 4, 5];

// forEach - 遍历执行
arr.forEach((v, i) => console.log(`${i}: ${v}`));

// map - 映射转换
const doubled = arr.map(x => x * 2);

// filter - 过滤筛选
const evens = arr.filter(x => x % 2 === 0);

// find/findIndex - 查找
const found = arr.find(x => x > 3);
const index = arr.findIndex(x => x > 3);

// some/every - 判断
const hasEven = arr.some(x => x % 2 === 0);
const allPositive = arr.every(x => x > 0);

// reduce - 归约累积
const sum = arr.reduce((acc, x) => acc + x, 0);
```

### ES6 集合类型

```javascript
// Map - 键值对集合（键可以是任意类型）
const map = new Map();
map.set('name', 'John');
map.set(1, 'number key');
map.set({ id: 1 }, 'object key');
console.log(map.get('name')); // 'John'

// Set - 值的集合（自动去重）
const set = new Set([1, 2, 2, 3, 3, 3]);
console.log([...set]); // [1, 2, 3]

// WeakMap/WeakSet - 弱引用版本
// 键必须是对象，且不会阻止垃圾回收
const weakMap = new WeakMap();
let obj = { id: 1 };
weakMap.set(obj, 'data');
obj = null; // 可以被垃圾回收
```

---

## 🔄 知识关联

```
数组创建
    │
    ├──→ 基本操作（增删改）
    │         │
    │         └──→ splice（万能方法）
    │
    ├──→ 查找遍历
    │         │
    │         ├──→ find/filter/map/reduce
    │         │
    │         └──→ some/every/includes
    │
    └──→ 数据结构
              │
              ├──→ Map（键值对）
              │
              ├──→ Set（去重）
              │
              └──→ TypedArray（二进制）
```

---

## ⚠️ 常见陷阱

### 1. sort() 的字典序问题

```javascript
// ❌ 错误：数字按字典序排序
[10, 2, 100].sort(); // [10, 100, 2]

// ✅ 正确：使用比较函数
[10, 2, 100].sort((a, b) => a - b); // [2, 10, 100]
```

### 2. fill() 的引用问题

```javascript
// ❌ 错误：所有元素引用同一对象
const arr = new Array(3).fill({});
arr[0].name = 'John';
console.log(arr); // [{name:'John'}, {name:'John'}, {name:'John'}]

// ✅ 正确：每次创建新对象
const arr = Array.from({ length: 3 }, () => ({}));
```

### 3. 稀疏数组

```javascript
// ⚠️ 稀疏数组可能导致意外行为
const arr = new Array(3);
arr.forEach(x => console.log(x)); // 无输出！
arr.map(x => x * 2); // [empty × 3]

// ✅ 避免：创建密集数组
const arr = Array.from({ length: 3 });
```

### 4. Map vs Object

```javascript
// Object 的键只能是字符串或 Symbol
const obj = {};
obj[1] = 'number';      // 键被转为 '1'
obj[{ a: 1 }] = 'obj';  // 键被转为 '[object Object]'

// Map 的键可以是任意类型
const map = new Map();
map.set(1, 'number');   // 键保持为数字 1
map.set({ a: 1 }, 'obj'); // 键保持为对象
```

---

## 💡 最佳实践

### 1. 选择合适的方法

```javascript
// 查找元素：用 find 而非 filter[0]
const user = users.find(u => u.id === 1);

// 判断存在：用 some/includes 而非 find
const hasAdmin = users.some(u => u.role === 'admin');

// 去重：用 Set 而非 filter
const unique = [...new Set(arr)];

// 数据转换：链式调用
const result = data
    .filter(item => item.active)
    .map(item => item.value)
    .sort((a, b) => a - b);
```

### 2. 使用非破坏性方法

```javascript
// ES2023+ 使用非破坏性方法
const sorted = arr.toSorted();
const reversed = arr.toReversed();

// ES2022- 使用 slice 创建副本
const sorted = [...arr].sort();
const reversed = arr.slice().reverse();
```

### 3. 合理使用集合类型

```javascript
// 需要键值对：用 Map
const userCache = new Map();
userCache.set(userId, userData);

// 需要去重：用 Set
const uniqueIds = new Set(ids);

// 需要存储对象关联数据：用 WeakMap
const privateData = new WeakMap();
class Person {
    constructor(name) {
        privateData.set(this, { name });
    }
}
```

---

## 🗺️ 学习路径

```
初级阶段：
1. 掌握数组基本操作（push、pop、shift、unshift）
2. 学会使用 splice 进行增删改
3. 理解数组遍历（forEach、map、filter）

中级阶段：
4. 掌握 reduce 的高级应用
5. 理解 sort 和自定义排序
6. 学会数组去重和扁平化

高级阶段：
7. 掌握类型化数组和二进制处理
8. 深入理解 Map、Set 及其应用场景
9. 学习 WeakMap、WeakSet 的内存管理
```

---

## 📖 推荐资源

### 书籍
- 《JavaScript 高级程序设计》- 数组章节
- 《JavaScript 权威指南》- 数组与集合

### 在线资源
- [MDN - Array](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [MDN - Map](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [MDN - Set](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set)
- [JavaScript Info - Array methods](https://javascript.info/array-methods)

---

## 📝 练习建议

1. **实现数组方法** - 手写 push、map、filter、reduce
2. **数组去重** - 多种方式实现，比较性能
3. **数组扁平化** - 实现 flat 方法
4. **数据分组** - 实现 groupBy 函数
5. **LRU 缓存** - 使用 Map 实现

---

[返回上级目录](../index.md)
