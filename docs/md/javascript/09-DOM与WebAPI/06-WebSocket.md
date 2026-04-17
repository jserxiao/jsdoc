# WebSocket

> WebSocket 是一种在单个 TCP 连接上进行全双工通信的协议，它允许服务端主动向客户端推送数据，是实时通信的重要技术。

## 学习要点

- 🔍 理解 WebSocket 与 HTTP 的区别
- 📝 掌握 WebSocket API 的使用
- 🔄 理解心跳机制和重连策略
- 🎯 学会实际应用场景

---

## 1. WebSocket 基础

### WebSocket vs HTTP

```javascript
/*
HTTP：
- 半双工通信（请求-响应模式）
- 每次请求都需要建立连接
- 服务器无法主动推送
- 头部信息较大

WebSocket：
- 全双工通信
- 一次握手，持久连接
- 服务器可以主动推送
- 头部信息小（2-10字节）
- 支持二进制数据
*/
```

### 创建 WebSocket 连接

```javascript
// 创建 WebSocket 连接
const ws = new WebSocket('ws://example.com/socket');
// 或使用安全连接
const wss = new WebSocket('wss://example.com/socket');

// WebSocket 状态
ws.readyState; // 0: CONNECTING, 1: OPEN, 2: CLOSING, 3: CLOSED

// 连接状态常量
WebSocket.CONNECTING; // 0
WebSocket.OPEN;       // 1
WebSocket.CLOSING;    // 2
WebSocket.CLOSED;     // 3
```

---

## 2. WebSocket 事件

### 连接事件

```javascript
const ws = new WebSocket('ws://example.com/socket');

// 连接打开
ws.onopen = function(event) {
    console.log('WebSocket 连接已建立');
    console.log('readyState:', ws.readyState); // 1 (OPEN)
    
    // 连接建立后可以发送消息
    ws.send('Hello Server!');
};

// 连接关闭
ws.onclose = function(event) {
    console.log('WebSocket 连接已关闭');
    
    // 关闭事件详情
    console.log('Code:', event.code);    // 关闭码
    console.log('Reason:', event.reason); // 关闭原因
    console.log('Clean:', event.wasClean); // 是否正常关闭
};

// 连接错误
ws.onerror = function(error) {
    console.error('WebSocket 错误:', error);
};
```

### 消息事件

```javascript
// 接收消息
ws.onmessage = function(event) {
    // 文本消息
    if (typeof event.data === 'string') {
        console.log('收到文本消息:', event.data);
    }
    
    // 二进制数据（Blob）
    if (event.data instanceof Blob) {
        console.log('收到 Blob 数据');
        const reader = new FileReader();
        reader.onload = () => console.log(reader.result);
        reader.readAsText(event.data);
    }
    
    // 二进制数据（ArrayBuffer）
    if (event.data instanceof ArrayBuffer) {
        console.log('收到 ArrayBuffer 数据');
        const view = new DataView(event.data);
        // 处理二进制数据
    }
};

// 使用 addEventListener
ws.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    handleMessage(data);
});
```

---

## 3. 发送消息

### 发送文本消息

```javascript
const ws = new WebSocket('ws://example.com/socket');

ws.onopen = function() {
    // 发送字符串
    ws.send('Hello World!');
    
    // 发送 JSON
    const message = {
        type: 'chat',
        content: 'Hello!',
        timestamp: Date.now()
    };
    ws.send(JSON.stringify(message));
};
```

### 发送二进制数据

```javascript
ws.onopen = function() {
    // 发送 ArrayBuffer
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setInt32(0, 12345);
    ws.send(buffer);
    
    // 发送 Blob
    const blob = new Blob(['Hello World'], { type: 'text/plain' });
    ws.send(blob);
    
    // 发送 TypedArray
    const array = new Uint8Array([1, 2, 3, 4, 5]);
    ws.send(array.buffer);
};

// 设置二进制类型
ws.binaryType = 'arraybuffer'; // 或 'blob'（默认）
```

---

## 4. 关闭连接

### 关闭 WebSocket

```javascript
// 正常关闭
ws.close();

// 带状态码关闭
ws.close(1000, 'Normal closure');

// 常见关闭码
/*
1000 - 正常关闭
1001 - 端点离开
1002 - 协议错误
1003 - 不支持的数据类型
1006 - 异常关闭（没有收到关闭帧）
1007 - 无效数据
1008 - 消息违反策略
1009 - 消息过大
1010 - 缺少扩展
1011 - 内部错误
1015 - TLS 握手失败

3000-3999 - 自定义使用
4000-4999 - 应用程序使用
*/

// 检查连接状态
if (ws.readyState === WebSocket.OPEN) {
    ws.close(1000, 'Goodbye');
}
```

---

## 5. 心跳机制

### 实现 WebSocket 心跳

```javascript
class WebSocketWithHeartbeat {
    constructor(url) {
        this.url = url;
        this.ws = null;
        this.heartbeatTimer = null;
        this.heartbeatInterval = 30000; // 30秒
        this.reconnectDelay = 5000;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        
        this.connect();
    }
    
    connect() {
        this.ws = new WebSocket(this.url);
        
        this.ws.onopen = () => {
            console.log('WebSocket 连接成功');
            this.reconnectAttempts = 0;
            this.startHeartbeat();
            this.onOpen();
        };
        
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            // 收到心跳响应
            if (data.type === 'pong') {
                console.log('收到心跳响应');
                return;
            }
            
            this.onMessage(data);
        };
        
        this.ws.onclose = (event) => {
            console.log('WebSocket 连接关闭');
            this.stopHeartbeat();
            this.onClose(event);
            
            // 非正常关闭则重连
            if (event.code !== 1000) {
                this.reconnect();
            }
        };
        
        this.ws.onerror = (error) => {
            console.error('WebSocket 错误:', error);
            this.onError(error);
        };
    }
    
    startHeartbeat() {
        this.heartbeatTimer = setInterval(() => {
            if (this.ws.readyState === WebSocket.OPEN) {
                console.log('发送心跳');
                this.ws.send(JSON.stringify({ type: 'ping' }));
            }
        }, this.heartbeatInterval);
    }
    
    stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }
    
    reconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log('达到最大重连次数，停止重连');
            return;
        }
        
        this.reconnectAttempts++;
        console.log(`尝试重连 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        
        setTimeout(() => {
            this.connect();
        }, this.reconnectDelay * this.reconnectAttempts);
    }
    
    send(data) {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }
    
    close() {
        this.stopHeartbeat();
        this.ws.close(1000, 'Client closing');
    }
    
    // 事件处理方法（可被子类覆盖）
    onOpen() {}
    onMessage(data) {}
    onClose(event) {}
    onError(error) {}
}

// 使用
const socket = new WebSocketWithHeartbeat('ws://example.com/socket');

socket.onMessage = function(data) {
    console.log('收到消息:', data);
};
```

---

## 6. 实际应用场景

### 实时聊天

```javascript
class ChatClient {
    constructor(url, userId) {
        this.url = url;
        this.userId = userId;
        this.ws = null;
        this.messageCallbacks = [];
    }
    
    connect() {
        this.ws = new WebSocket(`${this.url}?userId=${this.userId}`);
        
        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            
            switch (message.type) {
                case 'chat':
                    this.handleChatMessage(message);
                    break;
                case 'typing':
                    this.handleTyping(message);
                    break;
                case 'online':
                    this.handleOnlineStatus(message);
                    break;
            }
        };
    }
    
    sendMessage(to, content) {
        this.ws.send(JSON.stringify({
            type: 'chat',
            from: this.userId,
            to: to,
            content: content,
            timestamp: Date.now()
        }));
    }
    
    sendTyping(to) {
        this.ws.send(JSON.stringify({
            type: 'typing',
            from: this.userId,
            to: to
        }));
    }
    
    onMessage(callback) {
        this.messageCallbacks.push(callback);
    }
    
    handleChatMessage(message) {
        this.messageCallbacks.forEach(cb => cb(message));
    }
    
    handleTyping(message) {
        // 显示用户正在输入
    }
    
    handleOnlineStatus(message) {
        // 更新用户在线状态
    }
}

// 使用
const chat = new ChatClient('ws://api.example.com/chat', 'user123');

chat.onMessage((msg) => {
    displayMessage(msg);
});

chat.sendMessage('user456', 'Hello!');
```

### 实时数据推送

```javascript
class RealtimeData {
    constructor(url) {
        this.ws = new WebSocket(url);
        this.subscribers = new Map();
        
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.notify(data.channel, data.payload);
        };
    }
    
    subscribe(channel, callback) {
        if (!this.subscribers.has(channel)) {
            this.subscribers.set(channel, new Set());
            // 发送订阅请求
            this.ws.send(JSON.stringify({
                action: 'subscribe',
                channel: channel
            }));
        }
        this.subscribers.get(channel).add(callback);
        
        // 返回取消订阅函数
        return () => {
            this.subscribers.get(channel).delete(callback);
            if (this.subscribers.get(channel).size === 0) {
                this.unsubscribe(channel);
            }
        };
    }
    
    unsubscribe(channel) {
        this.subscribers.delete(channel);
        this.ws.send(JSON.stringify({
            action: 'unsubscribe',
            channel: channel
        }));
    }
    
    notify(channel, data) {
        const callbacks = this.subscribers.get(channel);
        if (callbacks) {
            callbacks.forEach(cb => cb(data));
        }
    }
}

// 使用
const realtime = new RealtimeData('ws://api.example.com/realtime');

// 订阅股票价格
const unsubscribe = realtime.subscribe('stock:AAPL', (data) => {
    updateStockPrice('AAPL', data.price);
});

// 取消订阅
// unsubscribe();
```

---

## 7. 浏览器兼容性处理

### 降级方案

```javascript
function createSocket(url) {
    // 检查浏览器支持
    if ('WebSocket' in window) {
        return new WebSocket(url);
    }
    
    // 降级到轮询
    console.log('WebSocket 不支持，使用轮询');
    return new PollingFallback(url);
}

class PollingFallback {
    constructor(url) {
        this.url = url;
        this.timer = null;
        this.interval = 3000;
        this.onmessage = null;
        this.onopen = null;
        this.onclose = null;
        this.onerror = null;
        
        this.start();
    }
    
    start() {
        this.timer = setInterval(() => {
            fetch(this.url)
                .then(res => res.json())
                .then(data => {
                    if (this.onmessage) {
                        this.onmessage({ data: JSON.stringify(data) });
                    }
                })
                .catch(error => {
                    if (this.onerror) {
                        this.onerror(error);
                    }
                });
        }, this.interval);
        
        if (this.onopen) {
            setTimeout(() => this.onopen(), 0);
        }
    }
    
    send(data) {
        fetch(this.url, {
            method: 'POST',
            body: data
        });
    }
    
    close() {
        clearInterval(this.timer);
        if (this.onclose) {
            this.onclose({ code: 1000, reason: 'Closed' });
        }
    }
    
    get readyState() {
        return this.timer ? 1 : 3; // OPEN or CLOSED
    }
}
```

---

## 小结

| 特性 | WebSocket | HTTP |
|------|-----------|------|
| 通信方式 | 全双工 | 半双工 |
| 连接 | 持久连接 | 短连接 |
| 推送能力 | 服务端可主动推送 | 需要客户端请求 |
| 头部开销 | 小（2-10字节） | 大 |
| 数据类型 | 文本、二进制 | 文本为主 |
| 协议 | ws:// 或 wss:// | http:// 或 https:// |

| 常用方法/属性 | 说明 |
|--------------|------|
| `new WebSocket(url)` | 创建连接 |
| `ws.send(data)` | 发送消息 |
| `ws.close()` | 关闭连接 |
| `ws.readyState` | 连接状态 |
| `ws.onopen` | 连接打开回调 |
| `ws.onmessage` | 接收消息回调 |
| `ws.onclose` | 连接关闭回调 |
| `ws.onerror` | 错误回调 |

---

[返回模块目录](./README.md)
