# Vue CLI

## 定位

Vue 官方脚手架，提供完整的 Vue 项目构建解决方案。

## 核心特点

- **图形界面**：可视化项目管理
- **插件体系**：丰富的官方和社区插件
- **预设配置**：可保存和复用配置
- **多环境支持**：完善的构建配置

## 常用命令

```bash
# 安装
npm install -g @vue/cli

# 创建项目
vue create my-app
vue create my-app -p preset-name

# 启动图形界面
vue ui

# 添加插件
vue add router
vue add vuex
vue add typescript

# 运行服务
vue serve
vue build
```

## 预设配置

```json
// ~/.vuerc
{
  "presets": {
    "my-preset": {
      "useConfigFiles": true,
      "plugins": {
        "@vue/cli-plugin-babel": {},
        "@vue/cli-plugin-typescript": {},
        "@vue/cli-plugin-router": {},
        "@vue/cli-plugin-vuex": {}
      }
    }
  }
}
```

## 项目结构

```
my-app/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   ├── components/
│   ├── views/
│   ├── router/
│   ├── store/
│   ├── App.vue
│   └── main.js
├── vue.config.js
└── package.json
```

## vue.config.js 配置

```javascript
module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  devServer: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
}
```

## 适用场景

- Vue 2 项目
- 企业级 Vue 项目
- 需要图形界面管理

## 注意事项

- Vue 3 项目建议使用 create-vite
- Vue CLI 进入维护模式，不再积极开发新功能
