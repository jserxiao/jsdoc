# ES6 集合类型

## Map

```javascript
const map = new Map();

// 设置
map.set('name', 'John');
map.set(1, 'number key');
map.set({ id: 1 }, 'object key');

// 获取
map.get('name');  // 'John'
map.get(1);       // 'number key'

// 检查
map.has('name');  // true

// 删除
map.delete('name');

// 大小
map.size;         // 2

// 清空
map.clear();

// 遍历
for (const [key, value] of map) {
    console.log(key, value);
}
map.forEach((value, key) => console.log(key, value));

// 转换
const arr = [...map];
const obj = Object.fromEntries(map);
```

---

## WeakMap

```javascript
// 键必须是对象，且是弱引用
const weakMap = new WeakMap();
let obj = { id: 1 };
weakMap.set(obj, 'data');

// obj 被垃圾回收后，WeakMap 中的条目自动删除
obj = null;

// 用途：存储私有数据
const privateData = new WeakMap();
class Person {
    constructor(name) {
        privateData.set(this, { name });
    }
    getName() {
        return privateData.get(this).name;
    }
}
```

---

## Set

```javascript
const set = new Set([1, 2, 3, 3, 3]);

// 添加
set.add(4);
set.add(4); // 重复值被忽略

// 检查
set.has(1);  // true

// 删除
set.delete(1);

// 大小
set.size;    // 3

// 遍历
for (const item of set) {
    console.log(item);
}

// 数组去重
const unique = [...new Set([1, 1, 2, 2, 3])];

// 集合运算
const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);

// 并集
const union = new Set([...a, ...b]);

// 交集
const intersection = new Set([...a].filter(x => b.has(x)));

// 差集
const difference = new Set([...a].filter(x => !b.has(x)));
```

---

## WeakSet

```javascript
const weakSet = new WeakSet();
let obj = { id: 1 };
weakSet.add(obj);

weakSet.has(obj);  // true
weakSet.delete(obj);

// 用途：标记对象
const visited = new WeakSet();
function process(obj) {
    if (visited.has(obj)) return;
    visited.add(obj);
    // 处理对象...
}
```

---

## 迭代器

```javascript
// 可迭代对象
const arr = [1, 2, 3];
const iterator = arr[Symbol.iterator]();

console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.next()); // { value: undefined, done: true }

// 自定义迭代器
const range = {
    from: 1,
    to: 3,
    [Symbol.iterator]() {
        return {
            current: this.from,
            last: this.to,
            next() {
                if (this.current <= this.last) {
                    return { value: this.current++, done: false };
                }
                return { done: true };
            }
        };
    }
};

for (const num of range) {
    console.log(num); // 1, 2, 3
}
```

---

[返回模块目录](./README.md)
