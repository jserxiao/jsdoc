# create-react-app

## 定位

React 官方脚手架，提供零配置的 React 开发环境。

## 核心特点

- **零配置**：无需配置 Webpack、Babel
- **开箱即用**：内置热更新、ESLint、测试
- **易于定制**：可通过 eject 或 craco 扩展
- **生态成熟**：社区支持广泛

## 常用命令

```bash
# 创建项目
npx create-react-app my-app
npx create-react-app my-app --template typescript

# 启动开发服务器
npm start

# 构建生产版本
npm run build

# 运行测试
npm test

# 弹出配置（不可逆）
npm run eject
```

## 自定义配置

```bash
# 使用 craco 扩展配置
npm install @craco/craco --save-dev
```

```javascript
// craco.config.js
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // 自定义 Webpack 配置
      return webpackConfig
    }
  }
}
```

## package.json 修改

```json
{
  "scripts": {
    "start": "craco start",
    "build": "craco build",
    "test": "craco test"
  }
}
```

## 适用场景

- React 学习入门
- 简单 React 项目
- 快速原型开发

## 注意事项

- `npm run eject` 是不可逆操作
- 推荐使用 craco 替代 eject 进行配置扩展
- 新项目建议考虑 Vite + React 模板
