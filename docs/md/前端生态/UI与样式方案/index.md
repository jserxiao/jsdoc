# UI 与样式方案

## 概述

解决界面开发、样式组织、设计系统等场景的需求。选择合适的样式方案对开发效率和代码可维护性有重要影响。

## 原子化 CSS

### Tailwind CSS
- **定位**：实用优先的 CSS 框架
- **特点**：原子类、JIT 编译、设计系统
- **适用场景**：快速开发、团队协作、设计一致性

### UnoCSS
- **定位**：即时原子 CSS 引擎
- **特点**：高性能、自定义规则、兼容 Tailwind
- **适用场景**：追求性能、自定义需求

### Windi CSS
- **定位**：下一代原子化 CSS
- **特点**：按需生成、兼容 Tailwind
- **适用场景**：Vite 项目、快速迁移

## CSS-in-JS

### styled-components
- **定位**：React 样式组件
- **特点**：模板字符串、主题支持、样式隔离
- **适用场景**：React 项目、组件级样式

### Emotion
- **定位**：灵活的 CSS-in-JS
- **特点**：多种写法、性能优化、SSR 支持
- **适用场景**：需要灵活性的 React 项目

### vanilla-extract
- **定位**：零运行时 CSS-in-JS
- **特点**：编译时处理、类型安全、无运行时开销
- **适用场景**：追求性能、TypeScript 项目

## CSS 预处理与后处理

### Sass
- **定位**：成熟的 CSS 预处理器
- **特点**：变量、嵌套、混入、函数
- **适用场景**：传统项目、大型样式代码

### Less
- **定位**：CSS 预处理器
- **特点**：变量、混入、函数、兼容性好
- **适用场景**：旧项目维护、兼容需求

### PostCSS
- **定位**：CSS 后处理器
- **特点**：插件化、自动前缀、未来 CSS
- **适用场景**：所有项目、自动化处理

### 常用 PostCSS 插件
- autoprefixer - 自动添加浏览器前缀
- postcss-preset-env - 使用未来 CSS 特性
- cssnano - CSS 压缩
- postcss-px-to-viewport - 移动端适配

## UI 组件库

### Ant Design
- **定位**：企业级 UI 组件库
- **特点**：组件丰富、设计规范、React 生态
- **适用场景**：企业后台、中后台系统

### Element Plus
- **定位**：Vue 3 组件库
- **特点**：Vue 3 原生、组件完善、中文文档
- **适用场景**：Vue 3 项目、后台管理

### Material-UI (MUI)
- **定位**：React Material Design
- **特点**：Material 设计、组件丰富、主题系统
- **适用场景**：Material 风格、国际化项目

### shadcn/ui
- **定位**：可定制的组件库
- **特点**：复制到项目、完全可控、基于 Radix
- **适用场景**：需要定制、追求独特设计

### Radix UI
- **定位**：无样式组件库
- **特点**：无样式、可访问性、行为完整
- **适用场景**：自定义设计系统、底层组件

## 设计系统与文档

### Storybook
- **定位**：组件文档与开发
- **特点**：独立开发、交互文档、测试支持
- **适用场景**：组件库开发、团队协作

### Figma API
- **定位**：设计稿对接
- **特点**：设计转代码、Design Token
- **适用场景**：设计开发协作

## CSS 架构

### CSS Modules
- **特点**：局部作用域、编译时处理
- **用法**：`import styles from './index.module.css'`
- **适用场景**：React 项目、样式隔离

### BEM 命名
- **Block**：独立的组件块
- **Element**：组件的组成部分 `__`
- **Modifier**：状态变体 `_`
- **示例**：`.card__title_active`

### CSS 变量
```css
:root {
  --primary-color: #1890ff;
  --spacing: 8px;
}

.button {
  background: var(--primary-color);
  padding: var(--spacing);
}
```

## 技术选型建议

| 场景 | 推荐方案 | 理由 |
|------|---------|------|
| 新项目快速开发 | Tailwind CSS | 开发速度快、一致性好 |
| React 企业后台 | Ant Design + CSS Modules | 组件丰富、开发效率高 |
| Vue 后台管理 | Element Plus + Sass | 生态完善、中文友好 |
| 组件库开发 | CSS Modules + vanilla-extract | 样式隔离、性能好 |
| 高度定制 UI | Radix UI + Tailwind | 灵活可控、无样式 |
| 设计系统 | Storybook + CSS 变量 | 文档化、Token 化 |

## 常见问题

### 样式冲突
- 使用 CSS Modules
- 配置类名前缀
- 使用 Shadow DOM

### 样式冗余
- PurgeCSS 移除未使用样式
- 按需引入组件样式
- CSS 拆分

### 主题切换
- CSS 变量 + data-theme
- CSS-in-JS 主题 Provider
- Tailwind dark: 前缀

### 响应式设计
- 移动优先原则
- Tailwind 断点
- CSS 媒体查询
