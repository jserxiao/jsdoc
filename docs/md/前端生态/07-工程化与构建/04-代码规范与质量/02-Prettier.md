# Prettier

## 定位

固执己见的代码格式化工具，统一代码风格。

## 核心特点

- **统一风格**：团队成员无需争论格式
- **支持多语言**：JS、TS、HTML、CSS、Markdown 等
- **编辑器集成**：保存时自动格式化
- **与 ESLint 配合**：eslint-config-prettier 禁用冲突规则

## 安装配置

```bash
npm install -D prettier eslint-config-prettier
```

## .prettierrc 配置

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "none",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "vueIndentScriptAndStyle": false,
  "htmlWhitespaceSensitivity": "ignore"
}
```

## .prettierignore

```
dist/
node_modules/
*.min.js
pnpm-lock.yaml
```

## 常用命令

```bash
# 格式化所有文件
npx prettier --write "src/**/*.{js,ts,vue,css,scss}"

# 检查格式
npx prettier --check "src/**/*.{js,ts,vue}"

# 配合 ESLint
npm install -D eslint-config-prettier
# 在 ESLint 配置中添加 prettier 配置（放最后）
```

## 配置选项说明

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `printWidth` | 每行最大字符数 | 80 |
| `tabWidth` | 缩进空格数 | 2 |
| `useTabs` | 使用 tab 缩进 | false |
| `semi` | 语句末尾分号 | true |
| `singleQuote` | 使用单引号 | false |
| `trailingComma` | 尾随逗号 | "es5" |
| `bracketSpacing` | 对象字面量空格 | true |
| `arrowParens` | 箭头函数参数括号 | "always" |
| `endOfLine` | 换行符 | "lf" |
