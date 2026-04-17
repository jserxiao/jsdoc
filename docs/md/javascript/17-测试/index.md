# 测试

软件测试是保证代码质量的重要手段。本模块介绍前端测试的理论与实践，包括单元测试、集成测试和端到端测试。

---

## 📁 模块目录

| 序号 | 模块 | 主要内容 | 文件 |
|------|------|----------|------|
| 1 | 单元测试 | Jest、测试用例、Mock、TDD | [01-单元测试.md](./01-单元测试.md) |
| 2 | 其他测试 | E2E 测试、集成测试、测试最佳实践 | [02-其他测试.md](./02-其他测试.md) |

---

## 🎯 学习目标

学完本模块，你应该能够：

- ✅ 理解测试金字塔和测试策略
- ✅ 使用 Jest 编写单元测试
- ✅ 掌握 Mock、Spy 等测试技术
- ✅ 使用 Cypress/Playwright 编写 E2E 测试
- ✅ 实践 TDD/BDD 开发流程

---

## 📊 测试金字塔

```
                    ╱╲
                   ╱  ╲
                  ╱ E2E╲          少量、慢、高成本
                 ╱──────╲
                ╱        ╲
               ╱ 集成测试  ╲       中量、中等速度
              ╱────────────╲
             ╱              ╲
            ╱    单元测试     ╲     大量、快、低成本
           ╱──────────────────╲
```

### 测试类型对比

| 测试类型 | 范围 | 速度 | 成本 | 数量 |
|----------|------|------|------|------|
| 单元测试 | 函数/模块 | 毫秒级 | 低 | 多 |
| 集成测试 | 模块交互 | 秒级 | 中 | 中 |
| E2E 测试 | 完整流程 | 分钟级 | 高 | 少 |

---

## 🧪 单元测试核心概念

### 测试用例结构

```javascript
describe('Calculator', () => {
  // 测试套件

  beforeAll(() => {
    // 所有测试前执行一次
  });

  beforeEach(() => {
    // 每个测试前执行
  });

  describe('add', () => {
    // 嵌套测试套件

    test('should add two positive numbers', () => {
      // 测试用例
      expect(add(1, 2)).toBe(3);
    });

    test('should handle negative numbers', () => {
      expect(add(-1, 1)).toBe(0);
    });
  });

  afterEach(() => {
    // 每个测试后执行
  });

  afterAll(() => {
    // 所有测试后执行一次
  });
});
```

### 常用断言

```javascript
// 相等性
expect(value).toBe(expected);        // 严格相等 ===
expect(value).toEqual(expected);     // 深度相等
expect(value).toStrictEqual(obj);    // 严格深度相等

// 真值
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();

// 数字
expect(value).toBeGreaterThan(3);
expect(value).toBeLessThanOrEqual(5);
expect(value).toBeCloseTo(0.3, 5);   // 浮点数精度

// 字符串
expect(string).toMatch(/pattern/);
expect(string).toContain('substring');

// 数组
expect(array).toContain(item);
expect(array).toHaveLength(3);

// 对象
expect(obj).toHaveProperty('key');
expect(obj).toHaveProperty('key', value);

// 异常
expect(() => fn()).toThrow();
expect(() => fn()).toThrow(Error);
expect(() => fn()).toThrow('message');

// 异步
await expect(promise).resolves.toBe(value);
await expect(promise).rejects.toThrow();
```

---

## 🎭 Mock 技术

### 函数 Mock

```javascript
// 创建 Mock 函数
const mockFn = jest.fn();

// 设置返回值
mockFn.mockReturnValue('default');
mockFn.mockReturnValueOnce('first');

// 设置实现
mockFn.mockImplementation((x) => x * 2);

// 断言调用
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith(1, 2);
expect(mockFn).toHaveBeenCalledTimes(3);

// 获取调用信息
console.log(mockFn.mock.calls);      // 调用参数
console.log(mockFn.mock.results);    // 返回结果
```

### 模块 Mock

```javascript
// Mock 整个模块
jest.mock('axios');
axios.get.mockResolvedValue({ data: [] });

// Mock 部分导出
jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  fnToMock: jest.fn()
}));
```

### 定时器 Mock

```javascript
jest.useFakeTimers();

test('debounce', () => {
  const fn = jest.fn();
  const debounced = debounce(fn, 1000);

  debounced();
  expect(fn).not.toHaveBeenCalled();

  jest.advanceTimersByTime(1000);
  expect(fn).toHaveBeenCalled();
});

jest.useRealTimers();
```

---

## 🔌 E2E 测试

### Cypress 示例

```javascript
describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should login successfully', () => {
    cy.get('[data-cy=username]').type('user');
    cy.get('[data-cy=password]').type('password');
    cy.get('[data-cy=submit]').click();

    cy.url().should('include', '/dashboard');
    cy.contains('Welcome').should('be.visible');
  });

  it('should show error for invalid credentials', () => {
    cy.get('[data-cy=username]').type('invalid');
    cy.get('[data-cy=password]').type('wrong');
    cy.get('[data-cy=submit]').click();

    cy.get('[data-cy=error]').should('contain', 'Invalid');
  });
});
```

### Playwright 示例

```javascript
import { test, expect } from '@playwright/test';

test('login flow', async ({ page }) => {
  await page.goto('/login');

  await page.fill('[data-cy=username]', 'user');
  await page.fill('[data-cy=password]', 'password');
  await page.click('[data-cy=submit]');

  await expect(page).toHaveURL(/dashboard/);
  await expect(page.locator('.welcome')).toBeVisible();
});
```

---

## 📈 TDD 工作流

```
TDD 循环
    │
    ▼
┌─────────┐     ┌─────────┐     ┌─────────┐
│  Red    │ ──► │  Green  │ ──► │ Refactor│
│ 编写失败 │     │ 编写代码│     │ 重构代码 │
│ 的测试  │     │ 使测试通过│     │ 优化结构 │
└─────────┘     └─────────┘     └─────────┘
     ▲                                 │
     │                                 │
     └─────────────────────────────────┘
```

### TDD 示例

```javascript
// 1. Red: 编写失败的测试
test('should format currency', () => {
  expect(formatCurrency(1234.5)).toBe('$1,234.50');
  expect(formatCurrency(0)).toBe('$0.00');
  expect(formatCurrency(-100)).toBe('-$100.00');
});

// 2. Green: 编写最小实现
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

// 3. Refactor: 优化代码（可选）
// 在这个简单例子中，代码已经很简洁
```

---

## 🛠️ 测试配置

### Jest 配置

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less)$': 'identity-obj-proxy'
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.js'
  ]
};
```

### 测试脚本

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "cypress run",
    "test:e2e:open": "cypress open"
  }
}
```

---

## 📋 测试最佳实践

### 1. 测试行为，而非实现

```javascript
// ❌ 测试实现细节
test('counter state', () => {
  expect(counter._count).toBe(0);
});

// ✅ 测试公开行为
test('counter increments', () => {
  counter.increment();
  expect(counter.getCount()).toBe(1);
});
```

### 2. 使用有意义的测试描述

```javascript
// ❌ 模糊的描述
test('test 1', () => {});

// ✅ 清晰的描述
test('should throw error when email is invalid', () => {});
```

### 3. 保持测试独立

```javascript
// ❌ 测试相互依赖
let user;
test('create user', () => {
  user = createUser();
});
test('update user', () => {
  user.name = 'new name'; // 依赖上一个测试
});

// ✅ 独立的测试
beforeEach(() => {
  user = createUser();
});
test('update user', () => {
  user.name = 'new name';
  expect(user.name).toBe('new name');
});
```

### 4. 使用 data-cy 属性

```html
<!-- ✅ 使用专门的测试属性 -->
<button data-cy="submit-button">Submit</button>
```

---

## 🔗 学习路径

```
开始
  │
  ▼
[单元测试] ──► Jest 基础、断言、Mock
  │
  ▼
[其他测试] ──► E2E 测试、集成测试
  │
  ▼
[TDD/BDD] ──► 测试驱动开发
  │
  ▼
完成测试模块 ✓
```

---

## 📚 参考资源

- [Jest 官方文档](https://jestjs.io/)
- [Cypress 官方文档](https://www.cypress.io/)
- [Playwright 官方文档](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [JavaScript 测试最佳实践](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

[返回上级目录](../)
