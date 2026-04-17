# BOM 浏览器对象

## window 对象

```javascript
// 全局作用域
var a = 1;
console.log(window.a); // 1

// 窗口尺寸
console.log(window.innerWidth, window.innerHeight);
console.log(window.outerWidth, window.outerHeight);

// 窗口位置
console.log(window.screenX, window.screenY);

// 窗口操作
window.open('https://example.com', '_blank', 'width=800,height=600');
window.close();
window.moveTo(0, 0);
window.resizeTo(800, 600);

// 对话框
alert('Message');
confirm('Are you sure?');
prompt('Enter name:', 'default');
```

---

## location 对象

```javascript
// URL 信息
console.log(location.href);      // 完整 URL
console.log(location.origin);    // 协议 + 域名 + 端口
console.log(location.protocol);  // 'https:'
console.log(location.host);      // 'example.com:8080'
console.log(location.hostname);  // 'example.com'
console.log(location.port);      // '8080'
console.log(location.pathname);  // '/path/page'
console.log(location.search);    // '?id=1&name=test'
console.log(location.hash);      // '#section'

// 导航方法
location.assign('/new-page');    // 添加历史记录
location.replace('/new-page');   // 替换当前记录
location.reload();               // 刷新
location.reload(true);           // 强制刷新（清除缓存）
```

---

## history 对象

```javascript
// 历史记录长度
console.log(history.length);

// 导航
history.back();      // 后退
history.forward();   // 前进
history.go(-2);      // 后退 2 步

// History API（SPA 路由）
history.pushState({ page: 1 }, 'Title', '/page1');
history.replaceState({ page: 2 }, 'Title', '/page2');

// 监听 popstate 事件
window.addEventListener('popstate', (e) => {
    console.log(e.state);
});
```

---

## navigator 对象

```javascript
// 用户代理
console.log(navigator.userAgent);

// 平台信息
console.log(navigator.platform);
console.log(navigator.language);

// 在线状态
console.log(navigator.onLine);
window.addEventListener('online', () => {});
window.addEventListener('offline', () => {});

// 地理位置
navigator.geolocation.getCurrentPosition((pos) => {
    console.log(pos.coords.latitude, pos.coords.longitude);
});

// 剪贴板 API
navigator.clipboard.writeText('text');
navigator.clipboard.readText().then(text => console.log(text));

// 分享 API
navigator.share({
    title: 'Title',
    url: 'https://example.com'
});
```

---

## performance 对象

```javascript
// 性能计时
console.log(performance.now());

// 页面加载性能
const timing = performance.timing;
const loadTime = timing.loadEventEnd - timing.navigationStart;

// 标记和测量
performance.mark('start');
// ... 代码执行
performance.mark('end');
performance.measure('myMeasure', 'start', 'end');

// 获取条目
performance.getEntriesByType('measure');
performance.getEntriesByName('myMeasure');
```

---

[返回模块目录](./README.md)
