# Turbopack

## 定位

Rust 编写的增量打包器，专为大型应用优化，是 Webpack 的下一代继任者。

## 核心特点

- **增量编译**：只编译变化的部分
- **内存缓存**：持久化缓存，重启后依然快速
- **Next.js 集成**：无缝对接 Next.js 13+
- **Rust 性能**：编译速度极快

## 基础使用

### Next.js 中启用

```javascript
// next.config.js
module.exports = {
  experimental: {
    turbo: {
      // 启用 Turbopack
      enabled: true
    }
  }
}
```

```bash
# 开发模式使用 Turbopack
next dev --turbo
```

## 性能对比

| 工具 | 冷启动 | HMR |
|------|--------|-----|
| Webpack | ~10s | ~1s |
| Vite | ~1s | ~100ms |
| Turbopack | ~1s | ~10ms |

## 配置选项

```javascript
// next.config.js
module.exports = {
  experimental: {
    turbo: {
      resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
      // 自定义模块解析
      resolveAlias: {
        '@': './src'
      }
    }
  }
}
```

## 支持的特性

### 已支持
- TypeScript
- JSX/TSX
- CSS Modules
- JSON 导入
- 图片资源
- Fast Refresh

### 开发中
- 完整的 Webpack Loader 兼容
- 完整的插件系统
- 独立使用（脱离 Next.js）

## 与 Vite 对比

| 特性 | Turbopack | Vite |
|------|-----------|------|
| 开发语言 | Rust | Go + JS |
| 冷启动 | 极快 | 极快 |
| HMR | 更快 | 快 |
| 生产构建 | 待完善 | Rollup |
| 生态绑定 | Next.js | 通用 |
| 持久缓存 | 内存缓存 | 文件缓存 |

## 适用场景

- Next.js 项目
- 大型应用增量构建
- 追求开发效率
- 需要 Webpack 生态兼容

## 未来规划

1. **独立使用**：脱离 Next.js，作为通用构建工具
2. **插件系统**：支持自定义扩展
3. **生产构建**：替代 Webpack 进行生产环境打包
4. **更多框架支持**：支持 React、Vue 等独立项目

## 迁移建议

### 从 Webpack 迁移
Turbopack 设计时考虑了 Webpack 兼容性，大部分配置可直接使用：

```javascript
// webpack.config.js 中的部分配置可迁移
module.exports = {
  resolve: {
    alias: {}, // 支持
    extensions: [] // 支持
  },
  // loader 配置部分需要调整
}
```

### 限制
- 目前仅支持 Next.js 13+
- 部分自定义 Webpack Loader 可能不兼容
- 生产构建仍建议使用 Webpack/Vite
