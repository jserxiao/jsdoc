# JSON 基础

## JSON 语法规则

```javascript
// JSON 数据类型
// - 对象 {}
// - 数组 []
// - 字符串 ""（必须双引号）
// - 数字
// - 布尔 true/false
// - null

// 有效 JSON
const validJson = '{"name": "John", "age": 30, "active": true}';

// 无效 JSON
const invalid = "{'name': 'John'}";  // 单引号无效
const invalid2 = '{name: "John"}';   // 属性名必须加引号
```

---

## JSON vs JavaScript 对象

```javascript
// JSON（字符串格式）
'{"name": "John", "age": 30}'

// JavaScript 对象
const obj = {
    name: 'John',
    age: 30,
    sayHello() { },  // JSON 不支持方法
    [Symbol('id')]: 1  // JSON 不支持 Symbol
};

// JSON 不支持的类型
// - undefined
// - 函数
// - Symbol
// - BigInt
// - 循环引用
```

---

[返回模块目录](./README.md)
