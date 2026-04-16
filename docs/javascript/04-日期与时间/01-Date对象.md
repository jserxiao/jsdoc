# Date 对象

## 日期创建

```javascript
// 当前时间
const now = new Date();
console.log(now);

// 时间戳
console.log(Date.now()); // 毫秒数

// 指定时间戳
const date1 = new Date(1609459200000);

// 日期字符串
const date2 = new Date('2024-01-01');
const date3 = new Date('2024-01-01T12:00:00');

// 年月日时分秒
const date4 = new Date(2024, 0, 1); // 月份从0开始
const date5 = new Date(2024, 0, 1, 12, 30, 0);

// 解析日期字符串
console.log(Date.parse('2024-01-01')); // 时间戳
console.log(Date.UTC(2024, 0, 1));     // UTC 时间戳
```

---

## 获取方法

```javascript
const date = new Date('2024-06-15T14:30:45');

console.log(date.getFullYear());      // 2024
console.log(date.getMonth());         // 5（0-11）
console.log(date.getDate());          // 15
console.log(date.getDay());           // 6（星期几，0-6）
console.log(date.getHours());         // 14
console.log(date.getMinutes());       // 30
console.log(date.getSeconds());       // 45
console.log(date.getMilliseconds());  // 0
console.log(date.getTime());          // 时间戳
console.log(date.getTimezoneOffset());// 时区偏移（分钟）

// UTC 版本
console.log(date.getUTCFullYear());
console.log(date.getUTCMonth());
console.log(date.getUTCDate());
// ...
```

---

## 设置方法

```javascript
const date = new Date();

date.setFullYear(2025);
date.setMonth(11);    // 12月
date.setDate(25);
date.setHours(0);
date.setMinutes(0);
date.setSeconds(0);
date.setMilliseconds(0);
date.setTime(1609459200000);

// 链式调用
date.setFullYear(2025).setMonth(0); // 不行，set 方法返回时间戳
```

---

## 格式化方法

```javascript
const date = new Date('2024-06-15T14:30:45');

console.log(date.toString());        // 'Sat Jun 15 2024 14:30:45 GMT+0800'
console.log(date.toDateString());    // 'Sat Jun 15 2024'
console.log(date.toTimeString());    // '14:30:45 GMT+0800'
console.log(date.toLocaleDateString()); // '2024/6/15'
console.log(date.toLocaleTimeString()); // '14:30:45'
console.log(date.toLocaleString());     // '2024/6/15 14:30:45'
console.log(date.toISOString());        // '2024-06-15T06:30:45.000Z'
console.log(date.toJSON());             // 同 toISOString
console.log(date.toUTCString());        // 'Sat, 15 Jun 2024 06:30:45 GMT'
```

---

## 日期计算

```javascript
const date1 = new Date('2024-01-01');
const date2 = new Date('2024-12-31');

// 计算天数差
const diff = date2 - date1; // 毫秒差
const days = diff / (1000 * 60 * 60 * 24);

// 日期加减
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const nextMonth = new Date();
nextMonth.setMonth(nextMonth.getMonth() + 1);

// 判断是否同一天
function isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
}
```

---

## 常用日期库

```javascript
// dayjs（轻量）
import dayjs from 'dayjs';
dayjs().format('YYYY-MM-DD HH:mm:ss');

// date-fns（模块化）
import { format, addDays } from 'date-fns';
format(new Date(), 'yyyy-MM-dd');
addDays(new Date(), 7);
```

---

## 练习题

```javascript
// 1. 实现一个函数，获取本月的天数
function getDaysInMonth(year, month) {
    // 你的实现
}

// 2. 实现一个函数，判断是否是闰年
function isLeapYear(year) {
    // 你的实现
}

// 3. 实现一个倒计时函数
function countdown(targetDate) {
    // 返回剩余的天、时、分、秒
}
```

---

[返回模块目录](./README.md)
