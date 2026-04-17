# Git Hooks

## Husky

### 安装配置

```bash
npm install -D husky
npx husky init
```

### .husky/pre-commit

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

### .husky/commit-msg

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit $1
```

## lint-staged

### 配置

```json
// package.json
{
  "lint-staged": {
    "*.{js,ts,vue}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,scss,html,md}": [
      "prettier --write"
    ]
  }
}
```

### 或使用 .lintstagedrc.js

```javascript
module.exports = {
  '*.{js,ts,vue}': ['eslint --fix', 'prettier --write'],
  '*.{css,scss,html,md}': ['prettier --write'],
  '*.{json}': ['prettier --write']
}
```

## 常用 Git Hooks

| Hook | 触发时机 | 用途 |
|------|----------|------|
| `pre-commit` | 提交前 | 代码检查 |
| `commit-msg` | 提交信息验证 | 提交规范检查 |
| `pre-push` | 推送前 | 测试运行 |
| `post-merge` | 合并后 | 依赖安装 |

## 跳过检查

```bash
# 跳过 pre-commit
git commit --no-verify -m "message"

# 或使用环境变量
HUSKY=0 git commit -m "message"
```

## 完整配置流程

```bash
# 1. 安装依赖
npm install -D husky lint-staged @commitlint/cli @commitlint/config-conventional

# 2. 初始化 husky
npx husky init

# 3. 创建 pre-commit hook
echo "npx lint-staged" > .husky/pre-commit

# 4. 创建 commit-msg hook
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg

# 5. 配置 lint-staged
# 在 package.json 中添加 lint-staged 配置

# 6. 配置 commitlint
# 创建 commitlint.config.js
```
