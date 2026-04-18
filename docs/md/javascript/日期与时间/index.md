# 日期与时间

> 日期和时间处理是前端开发中的常见需求，如表单日期选择、倒计时、日程管理等。JavaScript 的 Date 对象提供了基础的日期时间操作能力。

## 📁 模块目录

| 序号 | 模块 | 说明 | 文件 |
|------|------|------|------|
| 1 | Date 对象 | 创建、获取、设置、格式化、计算 | [Date对象.md](./Date对象.md) |

## 🎯 学习目标

学完本模块，你应该能够：

- ✅ 掌握 Date 对象的多种创建方式
- ✅ 熟练使用获取和设置方法操作日期各部分
- ✅ 理解时间戳和时区的概念
- ✅ 能够进行日期格式化和计算
- ✅ 实现倒计时、时间差等常见功能

## 📖 核心概念速查

### 日期创建方式

```javascript
// 当前时间
new Date()
Date.now()  // 时间戳

// 指定时间戳
new Date(1609459200000)

// 日期字符串
new Date('2024-01-01')
new Date('2024-01-01T12:00:00')

// 年月日时分秒
new Date(2024, 0, 1)        // 月份从0开始
new Date(2024, 0, 1, 12, 30, 0)
```

### 获取方法速查

```javascript
const date = new Date('2024-06-15T14:30:45');

date.getFullYear()      // 2024
date.getMonth()         // 5（0-11）
date.getDate()          // 15
date.getDay()           // 6（0-6，周日为0）
date.getHours()         // 14
date.getMinutes()       // 30
date.getSeconds()       // 45
date.getTime()          // 时间戳
date.getTimezoneOffset() // 时区偏移（分钟）
```

### 格式化方法速查

```javascript
date.toString()        // 完整字符串
date.toISOString()     // ISO格式（UTC）
date.toLocaleString()  // 本地格式
date.toDateString()    // 日期部分
date.toTimeString()    // 时间部分
```

### 常用时间单位

```
单位          毫秒数
─────────────────────────
秒(second)    1000
分(minute)    60 * 1000 = 60000
时(hour)      60 * 60 * 1000 = 3600000
天(day)       24 * 60 * 60 * 1000 = 86400000
周(week)      7 * 86400000 = 604800000
```

---

## ⚠️ 常见陷阱

### 1. 月份从0开始

```javascript
// ❌ 错误理解
new Date(2024, 1, 1);  // 不是1月1日，是2月1日！

// ✅ 正确理解
new Date(2024, 0, 1);  // 1月1日
new Date(2024, 11, 1); // 12月1日
```

### 2. 日期字符串解析差异

```javascript
// ISO 格式解析为 UTC 时间
new Date('2024-01-01');  // UTC 时间

// 带 T 的解析为本地时间
new Date('2024-01-01T00:00:00'); // 本地时间

// 推荐使用时间戳或明确指定时区
```

### 3. 日期设置返回时间戳

```javascript
const date = new Date();
const result = date.setFullYear(2025);
console.log(result); // 时间戳，不是 Date 对象
// date 本身已被修改
```

### 4. Date 对象是可变的

```javascript
const date = new Date('2024-01-01');
const copy = date; // 引用复制
copy.setFullYear(2025);
console.log(date.getFullYear()); // 2025，原对象也被修改！

// ✅ 正确复制
const realCopy = new Date(date);
```

---

## 💡 实用函数

### 日期范围

```javascript
// 获取本月天数
const getDaysInMonth = (year, month) => 
    new Date(year, month + 1, 0).getDate();

// 获取本月第一天
const getFirstDayOfMonth = (date = new Date()) => 
    new Date(date.getFullYear(), date.getMonth(), 1);

// 获取本月最后一天
const getLastDayOfMonth = (date = new Date()) => 
    new Date(date.getFullYear(), date.getMonth() + 1, 0);

// 获取本周一
const getMonday = (date = new Date()) => {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
    return d;
};
```

### 日期判断

```javascript
// 是否同一天
const isSameDay = (d1, d2) => 
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

// 是否今天
const isToday = (date) => isSameDay(date, new Date());

// 是否闰年
const isLeapYear = (year) => 
    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

// 是否工作日
const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
};
```

### 日期计算

```javascript
// 加减天数
const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

// 天数差
const getDaysDiff = (d1, d2) => 
    Math.floor(Math.abs(d2 - d1) / 86400000);
```

---

## 📚 推荐日期库

### dayjs（轻量，推荐）

```javascript
import dayjs from 'dayjs';

dayjs().format('YYYY-MM-DD');
dayjs().add(7, 'day').format('YYYY-MM-DD');
```

### date-fns（模块化）

```javascript
import { format, addDays } from 'date-fns';

format(new Date(), 'yyyy-MM-dd');
addDays(new Date(), 7);
```

---

## 🔗 学习路径

```
开始
  │
  ▼
[Date 创建] ──► 多种创建方式、时间戳
  │
  ▼
[获取/设置] ──► 各部分的操作方法
  │
  ▼
[格式化] ──► 各种输出格式
  │
  ▼
[日期计算] ──► 比较、加减、差值
  │
  ▼
[时区处理] ──► UTC、时区转换
  │
  ▼
完成日期模块 ✓
```

---

[返回上级目录](../README.md)
