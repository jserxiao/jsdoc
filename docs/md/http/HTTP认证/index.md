# HTTP 认证

> HTTP 认证是保护资源安全的重要机制。从简单的 Basic 认证到复杂的 OAuth 2.0，不同的认证方式适用于不同的场景。理解各种认证机制的原理和实现方式，对于构建安全的 Web 应用至关重要。

## 学习要点

- 🔐 理解各种 HTTP 认证方式的原理
- 🎫 掌握 JWT 的结构和使用方法
- 🔑 了解 OAuth 2.0 授权流程
- 🛡️ 学会实现安全的认证机制

---

## 1. 认证方式概览

### 1.1 常见认证方式

```
┌─────────────────────────┬───────────────────────────────────────────────────┐
│  认证方式                │  说明                                                 │
├─────────────────────────┼───────────────────────────────────────────────────┤
│  Basic Authentication   │  用户名密码 Base64 编码，安全性低                      │
│  Digest Authentication  │  摘要认证，密码不明文传输                              │
│  Bearer Token          │  令牌认证，最常用的 API 认证方式                       │
│  OAuth 2.0            │  授权框架，支持第三方应用授权                          │
│  JWT                  │  JSON Web Token，自包含的令牌                          │
│  API Key              │  固定密钥，通常放在 URL 参数或请求头                   │
│  Session Cookie       │  会话认证，服务端存储会话状态                          │
└─────────────────────────┴───────────────────────────────────────────────────┘
```

### 1.2 认证 vs 授权

```
┌─────────────────┬───────────────────────────────────────────────────────┐
│  认证（Authentication）│  验证"你是谁"                                         │
├─────────────────┼───────────────────────────────────────────────────────┤
│  授权（Authorization） │  验证"你能做什么"                                      │
│                 │  在认证之后进行                                        │
│                 │  决定用户是否有权限访问某资源                            │
└─────────────────┴───────────────────────────────────────────────────────┘

示例：
• 认证：验证用户名密码，确认你是用户张三
• 授权：检查张三是否有权限访问管理员页面
```

---

## 2. Basic 认证

### 2.1 基本原理

```http
请求：
GET /api/protected HTTP/1.1
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=

dXNlcm5hbWU6cGFzc3dvcmQ= 是 "username:password" 的 Base64 编码
```

### 2.2 客户端实现

```javascript
// 方式1：手动编码
fetch('/api/protected', {
  headers: {
    'Authorization': 'Basic ' + btoa('username:password')
  }
});

// 方式2：URL 格式（不推荐，浏览器已逐渐不支持）
// https://username:password@example.com/api/protected

// 封装 Basic 认证请求
function basicAuth(username, password) {
  return {
    'Authorization': 'Basic ' + btoa(`${username}:${password}`)
  };
}

fetch('/api/protected', {
  headers: {
    ...basicAuth('admin', '123456'),
    'Content-Type': 'application/json'
  }
});
```

### 2.3 安全性问题

```
Basic 认证的安全问题：
┌─────────────────────────────────────────────────────────────────────────┐
│  • 凭证只是 Base64 编码，不是加密，可被轻易解码                            │
│  • 每次请求都发送凭证，增加泄露风险                                        │
│  • 无法注销（浏览器会缓存凭证）                                            │
│  • 容易受到重放攻击                                                       │
└─────────────────────────────────────────────────────────────────────────┘

安全建议：
┌─────────────────────────────────────────────────────────────────────────┐
│  • 仅在 HTTPS 环境下使用                                                 │
│  • 配合其他安全机制使用                                                   │
│  • 不适合作为主要的认证方式                                               │
│  • 适合内部服务间的简单认证                                               │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Bearer Token 认证

### 3.1 基本原理

```http
请求：
GET /api/users HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

Bearer 表示持有者令牌
服务器验证令牌的有效性，不关心持有者是谁
```

### 3.2 客户端实现

```javascript
// 存储和获取 Token
const token = localStorage.getItem('token');

fetch('/api/users', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// 封装认证请求
async function authFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };
  
  const response = await fetch(url, { ...options, headers });
  
  // 处理 Token 过期
  if (response.status === 401) {
    // 尝试刷新 Token
    const refreshed = await refreshToken();
    if (refreshed) {
      // 重试请求
      return authFetch(url, options);
    } else {
      // 跳转登录
      window.location.href = '/login';
    }
  }
  
  return response;
}

// 使用示例
const data = await authFetch('/api/users').then(r => r.json());
```

### 3.3 Token 刷新机制

```javascript
// 双 Token 机制：Access Token + Refresh Token
class AuthManager {
  constructor() {
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
    this.refreshing = null;  // 防止并发刷新
  }
  
  async getValidToken() {
    if (this.accessToken && !this.isTokenExpired(this.accessToken)) {
      return this.accessToken;
    }
    
    // Token 过期或不存在，刷新
    return this.refreshAccessToken();
  }
  
  async refreshAccessToken() {
    // 防止并发刷新
    if (this.refreshing) {
      return this.refreshing;
    }
    
    this.refreshing = (async () => {
      try {
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ refreshToken: this.refreshToken })
        });
        
        if (!response.ok) {
          throw new Error('Refresh failed');
        }
        
        const data = await response.json();
        this.accessToken = data.accessToken;
        this.refreshToken = data.refreshToken;
        
        localStorage.setItem('accessToken', this.accessToken);
        localStorage.setItem('refreshToken', this.refreshToken);
        
        return this.accessToken;
      } catch (error) {
        // 刷新失败，清除凭证
        this.logout();
        throw error;
      } finally {
        this.refreshing = null;
      }
    })();
    
    return this.refreshing;
  }
  
  isTokenExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
  
  logout() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}

const auth = new AuthManager();

// 使用
async function fetchWithAuth(url, options = {}) {
  const token = await auth.getValidToken();
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  });
}
```

---

## 4. JWT 详解

### 4.1 JWT 结构

```
JWT 结构：Header.Payload.Signature

示例：
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

┌─────────────────────────────────────────────────────────────────────────┐
│  Header（头部）                                                          │
│  {                                                                      │
│    "alg": "HS256",    // 签名算法                                         │
│    "typ": "JWT"       // 令牌类型                                         │
│  }                                                                      │
├─────────────────────────────────────────────────────────────────────────┤
│  Payload（载荷）                                                         │
│  {                                                                      │
│    "sub": "1234567890",  // 主题（用户ID）                                │
│    "name": "John Doe",   // 自定义字段                                    │
│    "iat": 1516239022,    // 签发时间                                      │
│    "exp": 1516242622,    // 过期时间                                      │
│    "iss": "example.com", // 签发者                                        │
│    "aud": "client.com",  // 受众                                          │
│    "nbf": 1516239022     // 生效时间                                      │
│  }                                                                      │
├─────────────────────────────────────────────────────────────────────────┤
│  Signature（签名）                                                       │
│  HMACSHA256(                                                             │
│    base64UrlEncode(header) + "." + base64UrlEncode(payload),            │
│    secret                                                               │
│  )                                                                      │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.2 注册声明

```
JWT 标准注册声明（建议使用但不强制）：
┌───────────┬─────────────────────────────────────────────────────────────┐
│  iss      │  签发者（Issuer）                                            │
│  sub      │  主题（Subject），通常是用户ID                                 │
│  aud      │  受众（Audience），令牌的目标接收者                             │
│  exp      │  过期时间（Expiration Time）                                  │
│  nbf      │  生效时间（Not Before）                                       │
│  iat      │  签发时间（Issued At）                                        │
│  jti      │  JWT ID，令牌的唯一标识                                       │
└───────────┴─────────────────────────────────────────────────────────────┘
```

### 4.3 客户端操作

```javascript
// JWT 解码（不验证签名）
function parseJWT(token) {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT');
  }
  
  const header = JSON.parse(atob(parts[0]));
  const payload = JSON.parse(atob(parts[1]));
  
  return { header, payload };
}

// 检查 JWT 是否过期
function isTokenExpired(token) {
  const { payload } = parseJWT(token);
  return payload.exp * 1000 < Date.now();
}

// 获取 JWT 剩余有效时间
function getTokenRemainingTime(token) {
  const { payload } = parseJWT(token);
  const remaining = payload.exp * 1000 - Date.now();
  return Math.max(0, remaining);
}

// 使用示例
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
const { header, payload } = parseJWT(token);

console.log('算法:', header.alg);
console.log('用户ID:', payload.sub);
console.log('过期时间:', new Date(payload.exp * 1000));
console.log('是否过期:', isTokenExpired(token));
```

### 4.4 安全注意事项

```
JWT 安全最佳实践：
┌─────────────────────────────────────────────────────────────────────────┐
│  1. 不要在 Payload 中存储敏感信息                                         │
│     • Payload 只做 Base64 编码，任何人都可以解码                          │
│     • 不要存储密码、信用卡号等                                            │
│                                                                          │
│  2. 设置合理的过期时间                                                    │
│     • Access Token：15分钟 - 1小时                                       │
│     • Refresh Token：7天 - 30天                                          │
│                                                                          │
│  3. 使用强密钥                                                           │
│     • HS256：至少 256 位（32 字节）                                       │
│     • RS256：至少 2048 位                                                │
│                                                                          │
│  4. 验证所有声明                                                         │
│     • exp：是否过期                                                      │
│     • iss：签发者是否正确                                                 │
│     • aud：受众是否匹配                                                   │
│                                                                          │
│  5. 存储位置选择                                                         │
│     • XSS 防护：不要存 localStorage，使用 HttpOnly Cookie                 │
│     • CSRF 防护：使用 SameSite 属性                                       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 5. OAuth 2.0

### 5.1 角色定义

```
┌─────────────────┬───────────────────────────────────────────────────────┐
│  Resource Owner │  资源所有者，通常是用户                                  │
│  (用户)         │  授权第三方应用访问其资源                                │
├─────────────────┼───────────────────────────────────────────────────────┤
│  Client         │  第三方应用                                             │
│  (客户端)       │  请求访问用户的资源                                      │
├─────────────────┼───────────────────────────────────────────────────────┤
│  Authorization  │  授权服务器                                             │
│  Server         │  认证用户并颁发令牌                                      │
├─────────────────┼───────────────────────────────────────────────────────┤
│  Resource       │  资源服务器                                             │
│  Server         │  存储用户资源，验证令牌后返回资源                         │
└─────────────────┴───────────────────────────────────────────────────────┘
```

### 5.2 授权码模式（最安全）

```
授权码模式流程：
┌──────────┐                                      ┌──────────┐
│   用户   │                                      │  服务端   │
└────┬─────┘                                      └────┬─────┘
     │                                                 │
     │  1. 点击"使用微信登录"                           │
     │ ──────────────────────────────────────────────► │
     │                                                 │
     │  2. 重定向到授权服务器                           │
     │     /authorize?client_id=xxx&redirect_uri=xxx   │
     │     &response_type=code&scope=xxx&state=xxx     │
     │ ◄────────────────────────────────────────────── │
     │                                                 │
     │  3. 用户在授权服务器登录并授权                    │
     │ ──────────────────────────────────────────────► │
     │                                                 │
     │  4. 重定向回应用，携带授权码 code                │
     │     /callback?code=AUTHORIZATION_CODE&state=xxx │
     │ ◄────────────────────────────────────────────── │
     │                                                 │
     │  5. 服务端用 code 换取 access_token（后端）       │
     │     POST /token                                 │
     │     grant_type=authorization_code               │
     │     code=xxx&client_id=xxx&client_secret=xxx    │
     │ ──────────────────────────────────────────────► │
     │                                                 │
     │  6. 返回 access_token 和 refresh_token          │
     │     { "access_token": "...", "refresh_token": "...", │
     │       "expires_in": 3600, "token_type": "Bearer" } │
     │ ◄────────────────────────────────────────────── │
     │                                                 │
```

### 5.3 前端实现

```javascript
// 发起授权请求
function initiateOAuth(provider) {
  const config = {
    google: {
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      clientId: 'your-google-client-id',
      redirectUri: 'https://yourapp.com/callback/google',
      scope: 'email profile'
    },
    github: {
      authUrl: 'https://github.com/login/oauth/authorize',
      clientId: 'your-github-client-id',
      redirectUri: 'https://yourapp.com/callback/github',
      scope: 'user:email'
    }
  };
  
  const { authUrl, clientId, redirectUri, scope } = config[provider];
  
  // 生成 state 参数防止 CSRF
  const state = generateRandomState();
  sessionStorage.setItem('oauth_state', state);
  
  // 构建授权 URL
  const url = new URL(authUrl);
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', scope);
  url.searchParams.set('state', state);
  
  // 跳转到授权页面
  window.location.href = url.toString();
}

// 处理回调
async function handleOAuthCallback(provider, code, state) {
  // 验证 state
  const savedState = sessionStorage.getItem('oauth_state');
  if (state !== savedState) {
    throw new Error('Invalid state');
  }
  
  // 向后端发送 code，获取 token
  const response = await fetch(`/api/auth/${provider}/callback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  });
  
  const { accessToken, refreshToken, user } = await response.json();
  
  // 存储 token
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  
  return user;
}

// 回调页面处理
const url = new URL(window.location.href);
const code = url.searchParams.get('code');
const state = url.searchParams.get('state');
const provider = 'google';  // 根据路由判断

if (code && state) {
  handleOAuthCallback(provider, code, state)
    .then(user => {
      window.location.href = '/';
    })
    .catch(error => {
      console.error('OAuth failed:', error);
    });
}
```

### 5.4 PKCE 扩展（增强安全）

```javascript
// PKCE 适用于单页应用和移动应用
async function initiateOAuthWithPKCE(provider) {
  // 生成 code_verifier（43-128 个字符）
  const codeVerifier = generateRandomString(64);
  
  // 计算 code_challenge
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const codeChallenge = base64UrlEncode(digest);
  
  // 存储 code_verifier
  sessionStorage.setItem('code_verifier', codeVerifier);
  
  // 发起授权请求
  const url = new URL(authUrl);
  url.searchParams.set('code_challenge', codeChallenge);
  url.searchParams.set('code_challenge_method', 'S256');
  // ... 其他参数
}

// 交换 token 时发送 code_verifier
async function exchangeCode(code, codeVerifier) {
  const response = await fetch('/api/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code,
      code_verifier: codeVerifier,
      grant_type: 'authorization_code'
    })
  });
  
  return response.json();
}

function base64UrlEncode(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}
```

---

## 6. Session vs Token

### 6.1 对比

```
┌─────────────────┬───────────────────────────────────────────────────────┐
│  Session 认证    │                                                        │
├─────────────────┼───────────────────────────────────────────────────────┤
│  工作原理        │  服务端存储会话数据，客户端只保存 Session ID             │
│                 │                                                        │
│  优点           │  • 服务端可随时注销会话                                 │
│                 │  • 数据安全（存储在服务端）                              │
│                 │  • 容易实现权限管理                                     │
│                 │                                                        │
│  缺点           │  • 服务端需要存储会话状态                               │
│                 │  • 分布式部署需要会话共享                               │
│                 │  • 跨域处理复杂                                        │
│                 │  • 移动端不友好                                        │
└─────────────────┴───────────────────────────────────────────────────────┘

┌─────────────────┬───────────────────────────────────────────────────────┐
│  Token 认证      │                                                        │
├─────────────────┼───────────────────────────────────────────────────────┤
│  工作原理        │  服务端无状态，客户端存储完整令牌                         │
│                 │                                                        │
│  优点           │  • 无状态，易于扩展                                    │
│                 │  • 跨域友好                                           │
│                 │  • 移动端友好                                         │
│                 │  • 服务端不需要存储会话                                │
│                 │                                                        │
│  缺点           │  • Token 一旦签发难以主动失效                          │
│                 │  • Payload 大小有限制                                  │
│                 │  • 需要额外处理 Token 刷新                             │
└─────────────────┴───────────────────────────────────────────────────────┘
```

### 6.2 选择建议

```
┌─────────────────────────────────────────────────────────────────────────┐
│  场景                          │  推荐方案                                │
├────────────────────────────────┼─────────────────────────────────────────┤
│  传统 Web 应用                 │  Session + Cookie                        │
│  （服务端渲染）                 │                                          │
├────────────────────────────────┼─────────────────────────────────────────┤
│  单页应用（SPA）                │  JWT + HttpOnly Cookie                   │
├────────────────────────────────┼─────────────────────────────────────────┤
│  移动端应用                     │  JWT                                     │
├────────────────────────────────┼─────────────────────────────────────────┤
│  微服务架构                     │  JWT（无状态）                            │
├────────────────────────────────┼─────────────────────────────────────────┤
│  第三方集成                     │  OAuth 2.0                               │
├────────────────────────────────┼─────────────────────────────────────────┤
│  高安全性要求                   │  Session + 多因素认证                     │
└────────────────────────────────┴─────────────────────────────────────────┘
```

---

## 小结

### 认证方式对比

| 方式 | 安全性 | 复杂度 | 适用场景 |
|------|--------|--------|---------|
| Basic | 低 | 简单 | 内部服务 |
| Session Cookie | 中 | 中等 | 传统 Web |
| JWT | 中高 | 中等 | SPA、移动端、微服务 |
| OAuth 2.0 | 高 | 复杂 | 第三方授权 |

### JWT 最佳实践

| 实践 | 说明 |
|------|------|
| 不存敏感信息 | Payload 可被解码 |
| 设置过期时间 | Access Token 短，Refresh Token 长 |
| 安全存储 | HttpOnly Cookie 防 XSS |
| 验证签名 | 使用强密钥 |
| HTTPS | 防止中间人攻击 |

---

## 参考资源

- [JWT.io](https://jwt.io/)
- [OAuth 2.0 规范 (RFC 6749)](https://www.rfc-editor.org/rfc/rfc6749)
- [OWASP 认证指南](https://owasp.org/www-project-web-security-testing-guide/)
- [RFC 6750 - Bearer Token](https://www.rfc-editor.org/rfc/rfc6750)

---

[返回模块目录](../index.md)
