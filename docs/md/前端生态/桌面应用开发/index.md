# 桌面应用开发

## 概述

解决跨平台桌面应用开发场景的需求。使用 Web 技术开发桌面应用已成为主流趋势，降低了开发门槛。

## 桌面应用框架

### Electron
- **定位**：跨平台桌面应用
- **特点**：Chromium + Node.js、生态成熟、跨平台
- **适用场景**：复杂桌面应用、需要 Node.js 能力

### Tauri
- **定位**：Rust 构建的轻量桌面应用
- **特点**：体积小、安全、性能好、使用系统 WebView
- **适用场景**：追求性能、安装包体积敏感

### Neutralino.js
- **定位**：轻量级桌面应用
- **特点**：极小体积、简单 API、跨平台
- **适用场景**：简单桌面应用、快速开发

## 框架对比

| 特性 | Electron | Tauri | Neutralino.js |
|------|----------|-------|---------------|
| 运行时 | Chromium + Node.js | 系统 WebView | 系统 WebView |
| 安装包体积 | 大 (100MB+) | 小 (几 MB) | 极小 |
| 后端能力 | Node.js 完整能力 | Rust | 有限 |
| 学习曲线 | 低 | 中等 (需 Rust) | 低 |
| 生态成熟度 | 最高 | 发展中 | 发展中 |

## Electron 开发

### 项目结构
```
my-app/
├── package.json
├── main.js          # 主进程
├── preload.js       # 预加载脚本
└── src/             # 渲染进程 (前端代码)
    ├── index.html
    └── ...
```

### 主进程与渲染进程
- **主进程**：Node.js 环境、创建窗口、系统 API
- **渲染进程**：浏览器环境、UI 渲染
- **通信**：ipcMain / ipcRenderer

### 常用 API
```javascript
// 主进程
const { app, BrowserWindow, ipcMain } = require('electron')

// 创建窗口
const win = new BrowserWindow({
  webPreferences: {
    preload: path.join(__dirname, 'preload.js')
  }
})

// IPC 通信
ipcMain.handle('get-data', async () => {
  return { data: 'from main process' }
})
```

### 常用模块
- **app**：应用生命周期
- **BrowserWindow**：窗口管理
- **ipcMain/ipcRenderer**：进程间通信
- **dialog**：系统对话框
- **menu**：菜单栏
- **shell**：打开外部链接
- **nativeTheme**：系统主题

## Tauri 开发

### 项目结构
```
my-app/
├── package.json
├── src/             # 前端代码
├── src-tauri/       # Rust 后端
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── src/
│       └── main.rs
└── ...
```

### 调用 Rust 后端
```javascript
// 前端
import { invoke } from '@tauri-apps/api/tauri'
const data = await invoke('my_command', { arg: 'value' })
```

```rust
// Rust 后端
#[tauri::command]
fn my_command(arg: &str) -> String {
    format!("Hello, {}", arg)
}
```

### 特点
- 使用系统 WebView，体积小
- Rust 后端，安全高效
- 支持自动更新
- 跨平台一致性好

## 打包与分发

### Electron 打包
- **electron-builder**：功能完善、多平台
- **electron-forge**：官方工具、插件化

### Tauri 打包
```bash
npm run tauri build
```

### 自动更新
- **electron-updater**：Electron 自动更新
- **Tauri 内置**：更新检查和安装

## 系统能力集成

### 文件系统
- 读写文件
- 选择文件/目录
- 监听文件变化

### 系统托盘
- 托盘图标
- 右键菜单
- 消息通知

### 原生菜单
- 应用菜单
- 上下文菜单
- 快捷键

### 剪贴板
- 读写文本
- 读写图片

### 窗口控制
- 窗口状态
- 无边框窗口
- 透明窗口

## 技术选型建议

| 场景 | 推荐方案 | 理由 |
|------|---------|------|
| 复杂企业应用 | Electron | 功能完善、生态成熟 |
| 轻量工具应用 | Tauri | 体积小、性能好 |
| 快速原型 | Electron | 开发效率高 |
| 系统集成多 | Electron | Node.js 生态丰富 |
| 安装包敏感 | Tauri | 打包体积最小 |
| 现有 Web 项目转桌面 | Tauri | 改动小、集成简单 |

## 常见问题

### 安装包体积大
- 使用 Tauri 替代 Electron
- 压缩资源文件
- 按需打包 Node 模块

### 性能优化
- 窗口懒加载
- 减少渲染进程
- 优化 IPC 通信频率

### 跨平台适配
- 处理平台差异 API
- 适配不同系统 UI 规范
- 测试各平台表现

### 安全考虑
- 禁用 nodeIntegration
- 使用 contextIsolation
- 验证 IPC 消息
- 更新依赖版本
