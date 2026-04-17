# 二、字符串处理

> 字符串是 JavaScript 中最常用的数据类型之一，掌握字符串操作是前端开发的基础技能。字符串在表单验证、数据展示、文本处理等场景中广泛应用。

## 📁 模块目录

| 序号 | 模块 | 说明 | 文件 |
|------|------|------|------|
| 1 | 字符串基础 | 创建方式、模板字符串、不可变性、Unicode | [01-字符串基础.md](./01-字符串基础.md) |
| 2 | 字符串方法 | 查找、截取、修改、分割替换等常用方法 | [02-字符串方法.md](./02-字符串方法.md) |

## 🎯 学习目标

学完本模块，你应该能够：

- ✅ 理解字符串的不可变性及其影响
- ✅ 熟练使用模板字符串进行字符串插值和多行文本处理
- ✅ 掌握各种字符串创建方式的区别
- ✅ 熟练使用字符串方法进行查找、截取、替换等操作
- ✅ 理解 Unicode 字符编码和代理对的概念
- ✅ 能够处理包含 emoji 的字符串

## 📖 核心概念速查

### 字符串创建方式

```javascript
// 三种引号方式
let str1 = '单引号';
let str2 = "双引号";
let str3 = `模板字符串 ${变量}`;

// 构造函数
let str4 = String('Hello');     // 原始字符串
let str5 = new String('Hello'); // String 对象（不推荐）
```

### 字符串核心特性

```
特性              说明
────────────────────────────────────
不可变性          字符串一旦创建，内容不可修改
索引访问          str[0] 或 str.charAt(0)
长度属性          str.length 返回字符数
Unicode 支持      支持 UTF-16 编码
模板字符串        支持变量插值、多行、标签模板
```

### 常用方法分类

```
查找类
├── indexOf() / lastIndexOf()  查找位置
├── includes()                 是否包含
├── startsWith() / endsWith()  开头/结尾判断
└── charAt() / at()            获取字符

截取类
├── slice()      灵活截取（推荐）
├── substring()  截取（自动交换参数）
└── substr()     已废弃，不推荐

修改类
├── concat()     拼接
├── trim()       去除空白
├── toLowerCase() / toUpperCase()  大小写转换
├── padStart() / padEnd()    填充
└── repeat()     重复

分割替换类
├── split()      分割成数组
├── replace()    替换第一个匹配
└── replaceAll() 替换所有匹配（ES2021）
```

### 模板字符串特性

```javascript
// 1. 变量插值
const name = 'John';
const greeting = `Hello, ${name}!`;

// 2. 多行字符串
const html = `
  <div>
    <h1>${title}</h1>
  </div>
`;

// 3. 表达式计算
const price = 100;
const quantity = 3;
const total = `Total: $${price * quantity}`;

// 4. 标签模板
function highlight(strings, ...values) {
    return strings.reduce((result, str, i) => 
        result + str + (values[i] ? `<mark>${values[i]}</mark>` : ''), ''
    );
}
const output = highlight`Name: ${name}, Age: ${age}`;
```

---

## ⚠️ 常见陷阱

### 1. 字符串不可变性

```javascript
let str = 'Hello';
str[0] = 'h';  // ❌ 无效，不会改变
str = str.toLowerCase(); // ✅ 创建新字符串
```

### 2. Emoji 长度问题

```javascript
const emoji = '😀';
console.log(emoji.length);     // 2（代理对）
console.log([...emoji].length); // 1（正确）
```

### 3. substr 已废弃

```javascript
// ❌ 避免
str.substr(0, 5);
// ✅ 使用 slice
str.slice(0, 5);
```

### 4. replace 只替换第一个

```javascript
const str = 'Hello World World';
console.log(str.replace('World', 'JS')); // 'Hello JS World'
console.log(str.replaceAll('World', 'JS')); // 'Hello JS JS'
console.log(str.replace(/World/g, 'JS')); // 全局替换
```

---

## 🔗 学习路径

```
开始
  │
  ▼
[字符串基础] ──► 理解不可变性、创建方式
  │
  ▼
[模板字符串] ──► 变量插值、多行、标签模板
  │
  ▼
[字符串方法] ──► 查找、截取、修改、分割
  │
  ▼
[Unicode处理] ──► 编码、代理对、emoji
  │
  ▼
完成字符串模块 ✓
```

---

## 💡 实用技巧

### 格式化数字

```javascript
const num = 5;
console.log(num.toString().padStart(2, '0')); // '05'
```

### 首字母大写

```javascript
const capitalize = str => str[0].toUpperCase() + str.slice(1);
console.log(capitalize('hello')); // 'Hello'
```

### 反转字符串

```javascript
const reverse = str => [...str].reverse().join('');
console.log(reverse('hello')); // 'olleh'
```

### 截断字符串

```javascript
const truncate = (str, len) => 
    str.length > len ? str.slice(0, len) + '...' : str;
```

### 检测回文

```javascript
const isPalindrome = str => {
    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleaned === [...cleaned].reverse().join('');
};
```

---

## 📚 相关资源

- [MDN - String](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)
- [ES6 模板字符串](https://es6.ruanyifeng.com/#docs/string#模板字符串)
- [Unicode 与 JavaScript](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Grammar_and_types#unicode)

---

[返回上级目录](../README.md)
