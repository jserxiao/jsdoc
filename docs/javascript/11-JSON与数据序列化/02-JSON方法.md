# JSON 方法

## JSON.stringify()

```javascript
const obj = { name: 'John', age: 30 };

// 基本用法
JSON.stringify(obj); // '{"name":"John","age":30}'

// 格式化输出
JSON.stringify(obj, null, 2);
/*
{
  "name": "John",
  "age": 30
}
*/

// replacer 参数（数组：指定属性）
JSON.stringify(obj, ['name']); // '{"name":"John"}'

// replacer 参数（函数：过滤/转换）
JSON.stringify(obj, (key, value) => {
    if (key === 'age') return undefined; // 排除
    return value;
});

// 处理特殊类型
const obj2 = {
    date: new Date(),
    fn: () => {},    // 被忽略
    undef: undefined, // 被忽略
    inf: Infinity    // 转为 null
};

// toJSON() 自定义序列化
const obj3 = {
    name: 'John',
    toJSON() {
        return { fullName: this.name };
    }
};
JSON.stringify(obj3); // '{"fullName":"John"}'
```

---

## JSON.parse()

```javascript
// 基本用法
const obj = JSON.parse('{"name":"John"}');

// reviver 参数
const obj2 = JSON.parse('{"date":"2024-01-01"}', (key, value) => {
    if (key === 'date') return new Date(value);
    return value;
});

// 错误处理
try {
    const data = JSON.parse(jsonString);
} catch (e) {
    console.error('Invalid JSON:', e);
}
```

---

## 循环引用问题

```javascript
const obj = { name: 'John' };
obj.self = obj;

// JSON.stringify(obj); // TypeError: 循环引用

// 解决方案：使用 replacer
const seen = new WeakSet();
JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) return '[Circular]';
        seen.add(value);
    }
    return value;
});
```

---

[返回模块目录](./README.md)
