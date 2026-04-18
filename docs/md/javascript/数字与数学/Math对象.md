# Math 对象

Math 是一个内置对象，提供数学常量和函数。Math 不是构造函数，所有属性和方法都是静态的。

## 数学常量

```javascript
// 圆周率
console.log(Math.PI);          // 3.141592653589793

// 自然对数的底数 e
console.log(Math.E);           // 2.718281828459045

// 2 的自然对数
console.log(Math.LN2);         // 0.6931471805599453

// 10 的自然对数
console.log(Math.LN10);        // 2.302585092994046

// 2 的平方根
console.log(Math.SQRT2);       // 1.4142135623730951

// 1/2 的平方根
console.log(Math.SQRT1_2);     // 0.7071067811865476
```

---

## 取整方法

### Math.floor() - 向下取整
```javascript
console.log(Math.floor(4.9));   // 4
console.log(Math.floor(4.1));   // 4
console.log(Math.floor(-4.1));  // -5（向更小的方向）
```

### Math.ceil() - 向上取整
```javascript
console.log(Math.ceil(4.1));    // 5
console.log(Math.ceil(-4.1));   // -4（向更大的方向）
```

### Math.round() - 四舍五入
```javascript
console.log(Math.round(4.4));   // 4
console.log(Math.round(4.5));   // 5
console.log(Math.round(-4.5));  // -4
```

### Math.trunc() - 截断小数部分
```javascript
console.log(Math.trunc(4.9));   // 4
console.log(Math.trunc(-4.9));  // -4（直接去掉小数）
```

### 取整方法对比表
| 方法 | 4.9 | 4.1 | -4.1 | -4.9 |
|------|-----|-----|------|------|
| floor | 4 | 4 | -5 | -5 |
| ceil | 5 | 5 | -4 | -4 |
| round | 5 | 4 | -4 | -5 |
| trunc | 4 | 4 | -4 | -4 |

---

## 极值与绝对值

### Math.max() / Math.min()
```javascript
console.log(Math.max(1, 2, 3));    // 3
console.log(Math.min(1, 2, 3));    // 1

// 数组求最值
const arr = [1, 2, 3, 4, 5];
console.log(Math.max(...arr));     // 5
```

### Math.abs() - 绝对值
```javascript
console.log(Math.abs(-5));     // 5
console.log(Math.abs(5));      // 5
```

---

## 幂与根

```javascript
// 幂运算
console.log(Math.pow(2, 3));   // 8
console.log(2 ** 3);           // 8（推荐）

// 平方根
console.log(Math.sqrt(16));    // 4

// 立方根
console.log(Math.cbrt(8));     // 2

// 斜边长度
console.log(Math.hypot(3, 4)); // 5
```

---

## 随机数

```javascript
// [0, 1) 随机数
console.log(Math.random());

// [min, max] 随机整数
function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 随机打乱数组
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
```

---

## 三角函数

```javascript
// 参数是弧度
const rad = Math.PI / 4; // 45度

console.log(Math.sin(rad));   // √2/2
console.log(Math.cos(rad));   // √2/2
console.log(Math.tan(rad));   // 1

// 角度转弧度
function toRadians(degrees) {
    return degrees * Math.PI / 180;
}
```

---

## 其他方法

```javascript
// 符号函数
console.log(Math.sign(-5));   // -1
console.log(Math.sign(0));    // 0
console.log(Math.sign(5));    // 1

// 对数
console.log(Math.log(Math.E));  // 1
console.log(Math.log2(8));      // 3
console.log(Math.log10(100));   // 2

// 指数
console.log(Math.exp(1));       // e
console.log(Math.expm1(1));     // e - 1
```

---

## 练习题

```javascript
// 1. 实现一个函数，生成指定位数的随机验证码
function generateCode(length) {
    // 你的实现
}

// 2. 计算两点之间的距离
function distance(x1, y1, x2, y2) {
    // 你的实现
}

// 3. 实现一个简单的加密函数（使用异或）
function encrypt(text, key) {
    // 你的实现
}
```

---

[返回模块目录](./README.md)
