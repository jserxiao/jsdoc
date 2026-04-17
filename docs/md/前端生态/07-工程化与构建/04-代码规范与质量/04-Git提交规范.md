# Git 提交规范

## Commitlint

### 安装配置

```bash
npm install -D @commitlint/cli @commitlint/config-conventional
```

### commitlint.config.js

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 新功能
        'fix',      // 修复 bug
        'docs',     // 文档变更
        'style',    // 代码格式
        'refactor', // 重构
        'perf',     // 性能优化
        'test',     // 测试
        'chore',    // 构建/工具变动
        'revert',   // 回滚
        'ci'        // CI 配置变动
      ]
    ],
    'subject-case': [0]
  }
}
```

## 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 字段说明

| 字段 | 说明 | 必填 |
|------|------|------|
| `type` | 提交类型 | 是 |
| `scope` | 影响范围 | 否 |
| `subject` | 简短描述 | 是 |
| `body` | 详细描述 | 否 |
| `footer` | 备注（如关闭 issue） | 否 |

## 示例

```
feat(auth): 添加用户登录功能

- 实现用户名密码登录
- 添加 JWT token 验证
- 支持记住密码

Closes #123
```

```
fix(cart): 修复购物车数量计算错误

修复了当商品数量为 0 时仍显示在购物车的问题

Fixes #456
```

## Type 类型说明

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档更新 |
| `style` | 代码格式（不影响逻辑） |
| `refactor` | 重构（不是新功能或修复） |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `chore` | 构建/工具变动 |
| `ci` | CI 配置变动 |
| `revert` | 回滚提交 |

## 使用 commitizen

```bash
# 安装
npm install -D commitizen cz-conventional-changelog

# 配置 package.json
{
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  }
}

# 使用
npx cz
# 或添加脚本
npm run commit
```
