# 三、数字与数学

> JavaScript 中的数字处理是前端开发的基础技能。理解数字类型的特点、精度问题和 Math 对象的使用，对于处理计算、动画、游戏等场景至关重要。

## 📁 模块目录

| 序号 | 模块 | 说明 | 文件 |
|------|------|------|------|
| 1 | 数字类型 | 表示法、特殊值、精度问题、数字方法 | [01-数字类型.md](./01-数字类型.md) |
| 2 | Math 对象 | 数学常量、取整、随机数、三角函数 | [02-Math对象.md](./02-Math对象.md) |

## 🎯 学习目标

学完本模块，你应该能够：

- ✅ 理解 JavaScript 数字类型的特点（IEEE 754 双精度浮点数）
- ✅ 掌握各种数字表示法和进制转换
- ✅ 理解并解决浮点数精度问题
- ✅ 熟练使用 Math 对象的各种方法
- ✅ 实现常见的数学计算功能

## 📖 核心概念速查

### 数字类型特点

```javascript
// JavaScript 只有一种数字类型：IEEE 754 双精度浮点数
// 所有数字都是浮点数（没有真正的整数类型）
console.log(1 === 1.0); // true

// 安全整数范围
Number.MAX_SAFE_INTEGER  // 9007199254740991 (2^53 - 1)
Number.MIN_SAFE_INTEGER  // -9007199254740991

// 特殊值
NaN        // Not a Number
Infinity   // 无穷大
-Infinity  // 负无穷大
```

### 数字表示法

```javascript
// 十进制
let a = 42;

// 科学计数法
let b = 2.5e6;   // 2500000

// 二进制（ES6）
let c = 0b1010;  // 10

// 八进制（ES6）
let d = 0o777;   // 511

// 十六进制
let e = 0xFF;    // 255

// 数字分隔符（ES2021）
let f = 1_000_000; // 1000000
```

### 常用数字方法

```javascript
// 解析
parseInt('42px')       // 42
parseFloat('3.14')     // 3.14
Number('42')           // 42

// 判断
Number.isNaN(NaN)      // true
Number.isFinite(100)   // true
Number.isInteger(42)   // true
Number.isSafeInteger(Number.MAX_SAFE_INTEGER) // true

// 格式化
(42).toFixed(2)        // '42.00'
(255).toString(16)     // 'ff'
```

### Math 常用方法

```javascript
// 取整
Math.floor(4.9)   // 4（向下）
Math.ceil(4.1)    // 5（向上）
Math.round(4.5)   // 5（四舍五入）
Math.trunc(4.9)   // 4（截断）

// 极值与绝对值
Math.max(1, 2, 3) // 3
Math.min(1, 2, 3) // 1
Math.abs(-5)      // 5

// 幂与根
Math.pow(2, 3)    // 8
2 ** 3            // 8（推荐）
Math.sqrt(16)     // 4

// 随机数
Math.random()     // [0, 1)
```

---

## ⚠️ 常见陷阱

### 1. 浮点数精度问题

```javascript
// 经典问题
console.log(0.1 + 0.2);        // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3); // false

// 解决方案
// 方案1：使用 EPSILON
function isEqual(a, b) {
    return Math.abs(a - b) < Number.EPSILON;
}

// 方案2：放大后计算
console.log((0.1 * 10 + 0.2 * 10) / 10); // 0.3

// 方案3：使用 toFixed
console.log(Number((0.1 + 0.2).toFixed(1))); // 0.3
```

### 2. NaN 不等于自身

```javascript
console.log(NaN === NaN);      // false
console.log(Number.isNaN(NaN)); // true（正确的检测方式）
```

### 3. parseInt 的基数问题

```javascript
// ❌ 旧版浏览器可能将 '08' 解析为八进制
parseInt('08'); // 可能是 0

// ✅ 始终指定基数
parseInt('08', 10); // 8
```

### 4. 大数精度丢失

```javascript
// 超过安全整数范围
console.log(9007199254740992 === 9007199254740993); // true（错误！）

// 使用 BigInt 处理大整数
console.log(9007199254740992n === 9007199254740993n); // false
```

---

## 💡 实用函数

### 随机数

```javascript
// [min, max] 范围随机整数
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 随机验证码
function generateCode(length = 6) {
    return Array.from({ length }, () => 
        Math.floor(Math.random() * 10)
    ).join('');
}

// 随机打乱数组
function shuffle(arr) {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}
```

### 精确计算

```javascript
// 精确加法
function preciseAdd(a, b) {
    const digits = Math.max(
        (a.toString().split('.')[1] || '').length,
        (b.toString().split('.')[1] || '').length
    );
    const factor = Math.pow(10, digits);
    return (a * factor + b * factor) / factor;
}

console.log(preciseAdd(0.1, 0.2)); // 0.3
```

### 数字格式化

```javascript
// 千分位分隔
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
console.log(formatNumber(1234567)); // '1,234,567'

// 使用 toLocaleString
console.log((1234567).toLocaleString()); // '1,234,567'
console.log((1234.5).toLocaleString('zh-CN', { style: 'currency', currency: 'CNY' }));
// '¥1,234.50'
```

---

## 📊 Math 方法速查表

### 取整方法对比

| 方法 | 说明 | 4.9 | 4.1 | -4.1 | -4.9 |
|------|------|-----|-----|------|------|
| floor | 向下取整 | 4 | 4 | -5 | -5 |
| ceil | 向上取整 | 5 | 5 | -4 | -4 |
| round | 四舍五入 | 5 | 4 | -4 | -5 |
| trunc | 截断小数 | 4 | 4 | -4 | -4 |

### 数学常量

```javascript
Math.PI        // 3.141592653589793（圆周率）
Math.E         // 2.718281828459045（自然对数底数）
Math.SQRT2     // 1.4142135623730951（√2）
Math.SQRT1_2   // 0.7071067811865476（√1/2）
Math.LN2       // 0.6931471805599453（ln 2）
Math.LN10      // 2.302585092994046（ln 10）
```

---

## 🔗 学习路径

```
开始
  │
  ▼
[数字类型] ──► 表示法、特殊值、精度问题
  │
  ▼
[数字方法] ──► parseInt、toFixed、toString
  │
  ▼
[Math 对象] ──► 取整、随机数、三角函数
  │
  ▼
[实战应用] ──► 精确计算、格式化、随机功能
  │
  ▼
完成数字模块 ✓
```

---

[返回上级目录](../README.md)
