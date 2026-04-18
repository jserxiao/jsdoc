# 正则表达式

正则表达式（Regular Expression，简称 Regex）是一种强大的文本模式匹配工具，用于搜索、匹配、提取和替换字符串中的模式。它是每个开发者必须掌握的核心技能之一。

---

## 模块概述

正则表达式提供了一种简洁灵活的方式来描述文本模式。从简单的字符匹配到复杂的文本提取，正则表达式都能高效完成。本模块将从基础概念开始，逐步深入到高级应用。

### 学习目标

- 理解正则表达式的基本概念和语法
- 掌握元字符、量词、分组等核心特性
- 学会使用正则方法处理字符串
- 积累常用正则模式，应用于实际开发

---

## 📁 模块目录

| 序号 | 模块 | 文件 | 内容概述 |
|------|------|------|----------|
| 1 | 正则基础 | [正则基础.md](./正则基础.md) | 创建方式、元字符、修饰符、边界符、字符集合 |
| 2 | 量词与分组 | [量词与分组.md](./量词与分组.md) | 量词、贪婪与非贪婪、分组、反向引用、断言 |
| 3 | 正则方法 | [正则方法.md](./正则方法.md) | test、exec、match、replace、split 等方法 |
| 4 | 常用正则模式 | [常用正则模式.md](./常用正则模式.md) | 手机号、邮箱、URL、日期等常用验证模式 |

---

## 核心概念速览

### 创建正则表达式

```javascript
// 字面量方式
const regex1 = /pattern/flags;

// 构造函数方式
const regex2 = new RegExp('pattern', 'flags');

// 示例
const emailRegex = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
const phoneRegex = new RegExp('^1[9]\\d{9}$');
```

### 常用元字符

| 元字符 | 含义 | 示例 |
|--------|------|------|
| `.` | 除换行外的任意字符 | `/a.c/` 匹配 "abc", "a1c" |
| `\d` | 数字 [9] | `/\d+/` 匹配 "123" |
| `\w` | 单词字符 [a-zA-Z0-9_] | `/\w+/` 匹配 "hello_123" |
| `\s` | 空白字符 | `/\s+/` 匹配空格、制表符等 |
| `\b` | 单词边界 | `/\bword\b/` 匹配完整单词 |

### 常用量词

| 量词 | 含义 | 示例 |
|------|------|------|
| `*` | 0 次或多次 | `/a*/` 匹配 "", "a", "aaa" |
| `+` | 1 次或多次 | `/a+/` 匹配 "a", "aaa" |
| `?` | 0 次或 1 次 | `/a?/` 匹配 "", "a" |
| `{n}` | 恰好 n 次 | `/a{3}/` 匹配 "aaa" |
| `{n,m}` | n 到 m 次 | `/a{2,4}/` 匹配 "aa" 到 "aaaa" |

### 修饰符

| 修饰符 | 含义 | 说明 |
|--------|------|------|
| `g` | global | 全局匹配 |
| `i` | ignoreCase | 忽略大小写 |
| `m` | multiline | 多行模式 |
| `s` | dotAll | `.` 匹配换行 |
| `u` | unicode | Unicode 模式 |
| `y` | sticky | 粘连模式 |

---

## 常用方法速查

### RegExp 方法

```javascript
const regex = /(\d+)/g;
const str = 'abc 123 def 456';

// test: 测试是否匹配
regex.test(str); // true

// exec: 执行匹配，返回匹配结果
regex.exec(str); // ['123', '123', index: 4, input: 'abc 123 def 456']

// 全局匹配循环
let match;
while ((match = regex.exec(str)) !== null) {
  console.log(match[0]); // '123', '456'
}
```

### String 方法

```javascript
const str = 'The price is $100 and $200';

// match: 返回匹配结果
str.match(/\$\d+/g); // ['$100', '$200']

// matchAll: 返回所有匹配的迭代器（ES2020）
[...str.matchAll(/\$(\d+)/g)]; // 详细匹配信息

// replace: 替换匹配
str.replace(/\$\d+/g, 'XXX'); // 'The price is XXX and XXX'

// search: 返回匹配位置
str.search(/\$\d+/); // 14

// split: 使用正则分割
'a1b2c3d'.split(/\d/); // ['a', 'b', 'c', 'd']
```

---

## 实用模式速查

### 表单验证

```javascript
// 手机号（中国大陆）
/^1[9]\d{9}$/

// 邮箱
/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/

// 身份证（18位）
/^\d{17}[\dXx]$/

// URL
/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/

// 密码（至少8位，包含字母和数字）
/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/
```

### 数据提取

```javascript
// 提取数字
'The price is $100'.match(/\d+/g); // ['100']

// 提取 URL 参数
function getParams(url) {
  const params = {};
  url.replace(/[?&]([^=]+)=([^&]*)/g, (_, key, value) => {
    params[key] = decodeURIComponent(value);
  });
  return params;
}

// 提取 HTML 标签内容
/<title>(.*?)<\/title>/.exec(html)[1];
```

### 文本处理

```javascript
// 千分位格式化
'1234567890'.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // '1,234,567,890'

// 隐藏手机号
'13812345678'.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'); // '138****5678'

// 移除 HTML 标签
html.replace(/<[^>]+>/g, '');

// 去除多余空白
text.replace(/\s+/g, ' ').trim();
```

---

## 学习路径

### 初级：基础语法
1. 理解正则表达式的作用和应用场景
2. 学习元字符 `\d`, `\w`, `\s`, `.` 的用法
3. 掌握量词 `*`, `+`, `?`, `{n,m}` 的含义
4. 熟悉修饰符 `g`, `i`, `m` 的作用

### 中级：分组与断言
1. 学习捕获分组 `()` 和非捕获分组 `(?:)`
2. 掌握命名分组 `(?<name>...)`
3. 理解反向引用 `\1`, `\k<name>`
4. 学习先行断言 `(?=...)` 和 `(?!...)`

### 高级：实战应用
1. 构建复杂的验证模式
2. 优化正则表达式性能
3. 处理复杂的文本提取场景
4. 积累常用正则模式库

---

## 常见问题

### 贪婪 vs 非贪婪

```javascript
const str = '<div>content</div>';

// 贪婪：尽可能多匹配
str.match(/<.+>/); // ['<div>content</div>']

// 非贪婪：尽可能少匹配
str.match(/<.+?>/); // ['<div>']
```

### 性能优化

```javascript
// ❌ 避免：回溯过多
/(a+)+$/.test('aaaaaaaaaaaaaaaaaaaaaaaaaaaaa!'); // 可能卡死

// ✅ 更好：使用原子分组或限制回溯
/(a++)+$/.test('aaa');

// ✅ 预编译正则表达式
const regex = /^1[9]\d{9}$/; // 编译一次，多次使用
function validatePhone(phone) {
  return regex.test(phone);
}
```

---

## 参考资料

- [MDN - 正则表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions)
- [正则表达式30分钟入门教程](https://deerchao.cn/tutorials/regex/regex.htm)
- [RegexOne - 交互式教程](https://regexone.com/)
- [Regex101 - 在线测试工具](https://regex101.com/)

---

[返回上级目录](../)
