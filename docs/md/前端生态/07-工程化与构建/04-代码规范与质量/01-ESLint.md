# ESLint

## 定位

可扩展的 JavaScript/TypeScript 代码检查工具。

## 核心特点

- **规则丰富**：内置大量代码质量规则
- **高度可配置**：支持自定义规则和插件
- **自动修复**：支持 --fix 自动修复部分问题
- **编辑器集成**：实时显示问题

## 安装配置

```bash
# 安装
npm install -D eslint @eslint/js

# 初始化配置
npx eslint --init

# 或使用扁平配置（ESLint 9+）
npm install -D eslint @eslint/js typescript-eslint
```

## 扁平配置（ESLint 9+）

```javascript
// eslint.config.js
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import vue from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs['vue3-recommended'],
  prettier,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  },
  {
    files: ['**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'warn'
    }
  },
  {
    ignores: ['dist/', 'node_modules/', '*.config.js']
  }
]
```

## 常用命令

```bash
# 检查代码
npx eslint src/

# 自动修复
npx eslint src/ --fix

# 指定配置文件
npx eslint src/ -c eslint.config.js
```

## 常用规则配置

```javascript
rules: {
  // 可能的错误
  'no-console': 'warn',
  'no-debugger': 'error',
  'no-duplicate-imports': 'error',

  // 最佳实践
  'eqeqeq': ['error', 'always'],
  'curly': ['error', 'multi-line'],
  'no-var': 'error',
  'prefer-const': 'error',

  // TypeScript 特定
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/no-explicit-any': 'warn',
  '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

  // Vue 特定
  'vue/require-default-prop': 'off',
  'vue/require-explicit-emits': 'error'
}
```

## 常用插件

| 插件 | 说明 |
|------|------|
| `typescript-eslint` | TypeScript 支持 |
| `eslint-plugin-vue` | Vue 支持 |
| `eslint-plugin-react` | React 支持 |
| `eslint-plugin-react-hooks` | React Hooks 规则 |
| `eslint-config-prettier` | 禁用与 Prettier 冲突的规则 |
