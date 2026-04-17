# Date 对象

> Date 是 JavaScript 中处理日期和时间的内置对象。理解 Date 对象对于处理时间相关的业务逻辑至关重要。

## 学习要点

- 📅 掌握日期创建的多种方式
- 🔍 熟悉日期的获取和设置方法
- 📊 理解时间戳和时区概念
- 🛠️ 学会日期格式化和计算

---

## 1. 日期创建

### 当前时间

```javascript
// 创建当前时间的 Date 对象
const now = new Date();
console.log(now); // 例如：Sat Jun 15 2024 14:30:45 GMT+0800 (中国标准时间)

// 获取当前时间戳（毫秒数）
console.log(Date.now()); // 1718430645000
console.log(new Date().getTime()); // 同上
console.log(+new Date()); // 同上（一元加号转数字）

// 获取当前时间戳（秒数，Unix 时间戳）
console.log(Math.floor(Date.now() / 1000));
```

### 指定时间戳创建

```javascript
// 传入毫秒时间戳
const date1 = new Date(0); // 1970-01-01 00:00:00 UTC
const date2 = new Date(1609459200000); // 2021-01-01 00:00:00 UTC
const date3 = new Date(Date.now()); // 当前时间

// 时间戳范围
console.log(new Date(-8640000000000000)); // 最小日期
console.log(new Date(8640000000000000));  // 最大日期
```

### 日期字符串创建

```javascript
// ISO 8601 格式（推荐）
const date1 = new Date('2024-01-01');           // 解析为 UTC 时间
const date2 = new Date('2024-01-01T00:00:00');  // 解析为本地时间
const date3 = new Date('2024-01-01T00:00:00Z'); // 解析为 UTC 时间
const date4 = new Date('2024-01-01T12:30:45.123Z'); // 包含毫秒

// 其他格式（兼容性可能有问题）
const date5 = new Date('January 1, 2024');
const date6 = new Date('Jan 1 2024');
const date7 = new Date('2024/01/01');
const date8 = new Date('01-01-2024');

// 解析日期字符串为时间戳
console.log(Date.parse('2024-01-01')); // 1704067200000
console.log(Date.parse('2024-01-01T00:00:00')); // 根据时区不同

// ⚠️ 注意：不同浏览器解析结果可能不同
// 推荐使用 ISO 8601 格式或时间戳
```

### 年月日时分秒创建

```javascript
// new Date(year, monthIndex, day, hours, minutes, seconds, milliseconds)
// monthIndex: 0-11（0 是一月，11 是十二月）

const date1 = new Date(2024, 0, 1);           // 2024年1月1日 00:00:00
const date2 = new Date(2024, 0, 1, 12);       // 2024年1月1日 12:00:00
const date3 = new Date(2024, 0, 1, 12, 30);   // 2024年1月1日 12:30:00
const date4 = new Date(2024, 0, 1, 12, 30, 45); // 2024年1月1日 12:30:45
const date5 = new Date(2024, 0, 1, 12, 30, 45, 123); // 含毫秒

// 参数溢出会自动进位
const date6 = new Date(2024, 0, 32);  // 2024年2月1日
const date7 = new Date(2024, 11, 32); // 2025年1月1日
const date8 = new Date(2024, 12, 1);  // 2025年1月1日

// 使用负数
const date9 = new Date(2024, -1, 1);  // 2023年12月1日
```

### UTC 时间创建

```javascript
// Date.UTC() 返回 UTC 时间戳
const utcTimestamp = Date.UTC(2024, 0, 1, 0, 0, 0);
console.log(utcTimestamp); // 1704067200000

const utcDate = new Date(utcTimestamp);
console.log(utcDate.toISOString()); // '2024-01-01T00:00:00.000Z'
```

---

## 2. 获取方法

### 本地时间获取

```javascript
const date = new Date('2024-06-15T14:30:45.123');

// 年月日
console.log(date.getFullYear());      // 2024
console.log(date.getMonth());         // 5（0-11，6月是5）
console.log(date.getDate());          // 15（日期，1-31）
console.log(date.getDay());           // 6（星期几，0-6，0是周日）

// 时分秒毫秒
console.log(date.getHours());         // 14（0-23）
console.log(date.getMinutes());       // 30（0-59）
console.log(date.getSeconds());       // 45（0-59）
console.log(date.getMilliseconds());  // 123（0-999）

// 时间戳
console.log(date.getTime());          // 毫秒时间戳
console.log(date.valueOf());          // 同 getTime()

// 时区偏移（分钟）
console.log(date.getTimezoneOffset()); // -480（中国标准时间，UTC+8）
```

### UTC 时间获取

```javascript
const date = new Date('2024-06-15T14:30:45.123');

// UTC 版本的获取方法
console.log(date.getUTCFullYear());   // 根据UTC时间
console.log(date.getUTCMonth());
console.log(date.getUTCDate());
console.log(date.getUTCDay());
console.log(date.getUTCHours());
console.log(date.getUTCMinutes());
console.log(date.getUTCSeconds());
console.log(date.getUTCMilliseconds());
```

### 获取方法速查表

| 方法 | 返回值范围 | 说明 |
|------|-----------|------|
| getFullYear() | 1000-9999 | 四位年份 |
| getMonth() | 0-11 | 月份（0=一月） |
| getDate() | 1-31 | 日期 |
| getDay() | 0-6 | 星期（0=周日） |
| getHours() | 0-23 | 小时 |
| getMinutes() | 0-59 | 分钟 |
| getSeconds() | 0-59 | 秒 |
| getMilliseconds() | 0-999 | 毫秒 |
| getTime() | 数字 | 时间戳毫秒 |

---

## 3. 设置方法

### 各部分设置

```javascript
const date = new Date();

// 设置年月日
date.setFullYear(2025);
date.setMonth(11);     // 12月
date.setDate(25);

// 设置时分秒
date.setHours(12);
date.setMinutes(0);
date.setSeconds(0);
date.setMilliseconds(0);

// 设置时间戳
date.setTime(1609459200000);

// 链式调用（不推荐，set 方法返回时间戳）
// date.setFullYear(2025).setMonth(0); // ❌ 报错
```

### 常见设置场景

```javascript
// 设置为本月最后一天
function getLastDayOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

// 设置为本周一
function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    return d;
}

// 设置为今天零点
function getStartOfDay(date = new Date()) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

// 设置为今天23:59:59
function getEndOfDay(date = new Date()) {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
}
```

---

## 4. 格式化方法

### toString 系列

```javascript
const date = new Date('2024-06-15T14:30:45.123');

// 完整格式
console.log(date.toString());
// 'Sat Jun 15 2024 14:30:45 GMT+0800 (中国标准时间)'

// 日期部分
console.log(date.toDateString());    // 'Sat Jun 15 2024'
console.log(date.toLocaleDateString('zh-CN')); // '2024/6/15'

// 时间部分
console.log(date.toTimeString());    // '14:30:45 GMT+0800 (中国标准时间)'
console.log(date.toLocaleTimeString('zh-CN')); // '14:30:45'

// 日期时间
console.log(date.toLocaleString('zh-CN')); // '2024/6/15 14:30:45'
```

### ISO 格式

```javascript
const date = new Date('2024-06-15T14:30:45.123');

// ISO 8601 格式（UTC时间）
console.log(date.toISOString());     // '2024-06-15T06:30:45.123Z'
console.log(date.toJSON());          // 同 toISOString

// UTC 字符串
console.log(date.toUTCString());     // 'Sat, 15 Jun 2024 06:30:45 GMT'
```

### toLocaleString 高级用法

```javascript
const date = new Date('2024-06-15T14:30:45');

// 指定语言
console.log(date.toLocaleString('zh-CN'));    // '2024/6/15 14:30:45'
console.log(date.toLocaleString('en-US'));    // '6/15/2024, 2:30:45 PM'
console.log(date.toLocaleString('ja-JP'));    // '2024/6/15 14:30:45'

// 自定义格式
console.log(date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
}));
// '2024年6月15日星期六 14:30:45 GMT+8'

// 仅日期
console.log(date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
}));
// '2024年6月15日'

// 仅时间
console.log(date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
}));
// '14:30:45'
```

### 自定义格式化函数

```javascript
function formatDate(date, format) {
    const map = {
        'YYYY': date.getFullYear(),
        'MM': String(date.getMonth() + 1).padStart(2, '0'),
        'DD': String(date.getDate()).padStart(2, '0'),
        'HH': String(date.getHours()).padStart(2, '0'),
        'mm': String(date.getMinutes()).padStart(2, '0'),
        'ss': String(date.getSeconds()).padStart(2, '0'),
        'SSS': String(date.getMilliseconds()).padStart(3, '0')
    };
    
    return format.replace(/YYYY|MM|DD|HH|mm|ss|SSS/g, matched => map[matched]);
}

const date = new Date('2024-06-15T14:30:45.123');
console.log(formatDate(date, 'YYYY-MM-DD'));           // '2024-06-15'
console.log(formatDate(date, 'YYYY-MM-DD HH:mm:ss'));  // '2024-06-15 14:30:45'
console.log(formatDate(date, 'YYYY/MM/DD HH:mm:ss.SSS')); // '2024/06/15 14:30:45.123'
```

---

## 5. 日期计算

### 日期比较

```javascript
const date1 = new Date('2024-01-01');
const date2 = new Date('2024-12-31');

// 比较时间戳
console.log(date1 < date2);  // true
console.log(date1 > date2);  // false
console.log(date1.getTime() === date2.getTime()); // false

// 计算天数差
function getDaysDiff(d1, d2) {
    const diff = Math.abs(d2 - d1);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

console.log(getDaysDiff(date1, date2)); // 365

// 计算小时差
function getHoursDiff(d1, d2) {
    return Math.abs(d2 - d1) / (1000 * 60 * 60);
}
```

### 日期加减

```javascript
// 加减天数
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

const tomorrow = addDays(new Date(), 1);
const yesterday = addDays(new Date(), -1);
const nextWeek = addDays(new Date(), 7);

// 加减月份
function addMonths(date, months) {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
}

const nextMonth = addMonths(new Date(), 1);
const lastMonth = addMonths(new Date(), -1);
const nextYear = addMonths(new Date(), 12);

// 加减年
function addYears(date, years) {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
}
```

### 日期判断

```javascript
// 判断是否同一天
function isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
}

// 判断是否今天
function isToday(date) {
    return isSameDay(date, new Date());
}

// 判断是否闰年
function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// 获取某月天数
function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

console.log(getDaysInMonth(2024, 1)); // 29（2024年2月，闰年）
console.log(getDaysInMonth(2024, 0)); // 31（2024年1月）

// 判断是否工作日
function isWeekday(date) {
    const day = date.getDay();
    return day !== 0 && day !== 6;
}

// 判断是否周末
function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
}
```

---

## 6. 相对时间

### 时间差描述

```javascript
function timeAgo(date) {
    const now = new Date();
    const diff = now - new Date(date);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 30) return `${days}天前`;
    if (months < 12) return `${months}个月前`;
    return `${years}年前`;
}

console.log(timeAgo(new Date() - 1000 * 60 * 5)); // '5分钟前'
console.log(timeAgo(new Date() - 1000 * 60 * 60 * 3)); // '3小时前'
```

### 倒计时

```javascript
function countdown(targetDate) {
    const now = new Date();
    const diff = new Date(targetDate) - now;
    
    if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds };
}

// 使用示例
const target = new Date('2024-12-31T00:00:00');
const remaining = countdown(target);
console.log(`距离2025年还有：${remaining.days}天${remaining.hours}小时${remaining.minutes}分钟${remaining.seconds}秒`);
```

---

## 7. 时区处理

### 时区基础

```javascript
const date = new Date();

// 获取时区偏移（分钟）
console.log(date.getTimezoneOffset()); // -480（UTC+8）

// 转换为其他时区的时间
function convertToTimezone(date, offsetHours) {
    const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    return new Date(utc + offsetHours * 3600000);
}

// 获取UTC时间
function getUTCDate(date) {
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
}
```

### 跨时区显示

```javascript
const date = new Date();

// 不同时区的显示
console.log(date.toLocaleString('en-US', { timeZone: 'America/New_York' }));
console.log(date.toLocaleString('en-GB', { timeZone: 'Europe/London' }));
console.log(date.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }));
console.log(date.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }));
```

---

## 8. 常用日期库

### dayjs（推荐）

```javascript
import dayjs from 'dayjs';

// 创建
const now = dayjs();
const date = dayjs('2024-06-15');
const date2 = dayjs(1718430645000);

// 格式化
dayjs().format('YYYY-MM-DD HH:mm:ss');
dayjs().format('YYYY年MM月DD日');

// 计算
dayjs().add(7, 'day');
dayjs().subtract(1, 'month');
dayjs().startOf('month');
dayjs().endOf('week');

// 比较
dayjs().isBefore(dayjs('2024-12-31'));
dayjs().isAfter(dayjs('2024-01-01'));
dayjs('2024-06-15').isSame(dayjs('2024-06-15'), 'day');
```

### date-fns（模块化）

```javascript
import { 
    format, 
    addDays, 
    subMonths, 
    startOfMonth, 
    endOfMonth,
    differenceInDays,
    isAfter,
    isBefore
} from 'date-fns';

// 格式化
format(new Date(), 'yyyy-MM-dd HH:mm:ss');

// 计算
addDays(new Date(), 7);
subMonths(new Date(), 1);
startOfMonth(new Date());
endOfMonth(new Date());

// 比较
differenceInDays(new Date('2024-12-31'), new Date('2024-01-01'));
isAfter(new Date(), new Date('2024-01-01'));
```

---

## 小结

| 方法类别 | 常用方法 |
|---------|---------|
| **创建** | `new Date()`, `Date.now()`, `Date.parse()` |
| **获取** | `getFullYear()`, `getMonth()`, `getDate()`, `getTime()` |
| **设置** | `setFullYear()`, `setMonth()`, `setDate()`, `setTime()` |
| **格式化** | `toString()`, `toISOString()`, `toLocaleString()` |
| **计算** | `getTime()`, 日期加减、比较 |

---

## 练习题

```javascript
// 1. 实现一个函数，获取本月的天数
function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

// 2. 实现一个函数，判断是否是闰年
function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// 3. 实现一个倒计时函数
function countdown(targetDate) {
    const diff = new Date(targetDate) - new Date();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000)
    };
}

// 4. 实现获取本月第一天的函数
function getFirstDayOfMonth(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

// 5. 实现获取本周一的函数
function getMonday(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
    return d;
}
```

---

[返回模块目录](./index.md)
