# 测试与质量保障

## 概述

解决自动化测试、代码质量、持续集成等场景的需求。完善的测试体系是保障项目质量、降低维护成本的关键。

---

## 📁 模块目录

| 序号 | 模块 | 主要内容 | 文件 |
|------|------|----------|------|
| 1 | 单元测试 | Jest、Vitest、Mock、测试覆盖率 | [单元测试.md](./单元测试.md) |
| 2 | 其他测试 | E2E 测试、集成测试、组件测试、TDD/BDD | [其他测试.md](./其他测试.md) |

---

## 🎯 学习目标

学完本模块，你应该能够：

- ✅ 理解测试金字塔和测试策略
- ✅ 使用 Jest/Vitest 编写单元测试
- ✅ 掌握 Mock、Spy 等测试技术
- ✅ 使用 Cypress/Playwright 编写 E2E 测试
- ✅ 实践 TDD/BDD 开发流程

---

## 单元测试

### Jest
- **定位**：JavaScript 测试框架
- **特点**：零配置、快照测试、覆盖率报告、Mock 功能
- **适用场景**：React/Vue/Node.js 项目单元测试

### Vitest
- **定位**：Vite 原生测试框架
- **特点**：极速启动、Vite 集成、兼容 Jest API
- **适用场景**：Vite 项目、追求速度

### Mocha
- **定位**：灵活的测试框架
- **特点**：高度可配置、多种断言库、异步支持
- **适用场景**：需要高度定制的测试场景

## 组件测试

### Testing Library
- **定位**：DOM 测试工具集
- **特点**：以用户行为为中心、可访问性友好
- **适用场景**：React/Vue 组件测试

### Vue Test Utils
- **定位**：Vue 组件测试
- **特点**：Vue 官方支持、组件挂载、事件模拟
- **适用场景**：Vue 组件单元测试

### React Testing Library
- **定位**：React 组件测试
- **特点**：用户视角测试、不依赖实现细节
- **适用场景**：React 组件测试首选

## 端到端测试 (E2E)

### Cypress
- **定位**：端到端测试框架
- **特点**：实时重载、时间旅行、调试体验好
- **适用场景**：Web 应用 E2E 测试、快速开发迭代

### Playwright
- **定位**：跨浏览器测试
- **特点**：多浏览器支持、并行测试、强大的选择器
- **适用场景**：跨浏览器兼容性测试、企业级项目

### Puppeteer
- **定位**：Headless Chrome 自动化
- **特点**：Chrome 官方支持、完整的 Chrome API
- **适用场景**：爬虫、截图、自动化任务

## 代码质量工具

### ESLint
- **定位**：JavaScript/TypeScript 静态检查
- **特点**：插件化、规则丰富、自动修复
- **适用场景**：所有 JavaScript/TypeScript 项目

### Prettier
- **定位**：代码格式化
- **特点**：统一风格、支持多语言、集成编辑器
- **适用场景**：团队代码风格统一

### TypeScript
- **定位**：类型检查
- **特点**：静态类型、IDE 支持、渐进式采用
- **适用场景**：中大型项目、团队协作

### Stylelint
- **定位**：CSS/Less/Sass 检查
- **特点**：样式规范、自动修复、插件生态
- **适用场景**：样式代码质量控制

## Git 工作流规范

### Husky
- **定位**：Git Hooks 管理
- **特点**：简单的配置、支持所有 Git Hooks
- **适用场景**：提交前检查、自动化流程

### lint-staged
- **定位**：暂存文件检查
- **特点**：只检查暂存文件、提高效率
- **适用场景**：提交时代码检查

### Commitlint
- **定位**：提交信息规范
- **特点**：约定式提交、自动校验
- **适用场景**：规范提交信息、自动化日志

### semantic-release
- **定位**：自动化版本发布
- **特点**：自动版本号、生成 CHANGELOG
- **适用场景**：开源项目、库发布

## 测试策略

### 测试金字塔
```
      /\
     /E2E\      少量端到端测试
    /------\
   /集成测试 \    适量集成测试
  /----------\
 /   单元测试  \   大量单元测试
/--------------\
```

### 测试覆盖策略
- **核心业务逻辑**：100% 覆盖
- **工具函数**：100% 覆盖
- **UI 组件**：关键交互测试
- **页面流程**：E2E 覆盖主流程

### 测试优先级
1. 高风险功能优先
2. 核心业务流程优先
3. 频繁变更但重要的代码
4. 复杂的逻辑判断

## CI/CD 集成

### GitHub Actions
```yaml
# 示例工作流
- name: Run Tests
  run: npm test
  
- name: Run E2E Tests
  run: npm run test:e2e
  
- name: Upload Coverage
  run: npm run coverage
```

### GitLab CI
- 集成测试阶段
- 代码质量检查
- 部署前测试

## 技术选型建议

| 场景 | 推荐方案 | 理由 |
|------|---------|------|
| Vite 项目单元测试 | Vitest | 原生集成、速度快 |
| Webpack 项目单元测试 | Jest | 生态成熟、功能完整 |
| React 组件测试 | React Testing Library | 用户视角、最佳实践 |
| Vue 组件测试 | Vue Test Utils + Vitest | 官方支持 |
| E2E 测试 | Playwright | 跨浏览器、功能强大 |
| 快速 E2E 开发 | Cypress | 调试体验好 |

## 常见问题

### 测试运行慢
- 并行执行测试
- 合理使用 Mock
- 优化数据库操作
- 测试数据工厂

### 测试不稳定
- 避免依赖外部服务
- 使用固定的测试数据
- 正确处理异步操作
- 隔离测试环境

### 覆盖率提不上去
- 先覆盖核心逻辑
- 使用 Istanbul 覆盖率报告
- 设置覆盖率阈值
- 新代码强制覆盖

---

## 📚 参考资源

- [Jest 官方文档](https://jestjs.io/)
- [Vitest 官方文档](https://vitest.dev/)
- [Cypress 官方文档](https://www.cypress.io/)
- [Playwright 官方文档](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [JavaScript 测试最佳实践](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

[返回上级目录](../)
