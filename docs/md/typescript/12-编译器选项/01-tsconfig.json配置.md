# tsconfig.json 配置

tsconfig.json 是 TypeScript 项目的配置文件，它定义了编译器如何处理项目中的 TypeScript 代码。

---

## 目录

- [配置文件基础](#配置文件基础)
- [配置继承](#配置继承)
- [项目引用](#项目引用)
- [文件包含与排除](#文件包含与排除)

---

## 配置文件基础

### 基本结构

```json
{
  "compilerOptions": {
    // 编译选项
  },
  "include": [
    // 包含的文件
  ],
  "exclude": [
    // 排除的文件
  ],
  "files": [
    // 指定的文件
  ],
  "extends": "base.json",
  "references": [
    // 项目引用
  ]
}
```

### 最小配置

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

### 编译器选项分类

| 分类 | 主要选项 |
|------|----------|
| 项目选项 | `target`, `module`, `lib`, `outDir`, `rootDir` |
| 严格检查 | `strict`, `noImplicitAny`, `strictNullChecks` |
| 模块解析 | `moduleResolution`, `baseUrl`, `paths` |
| 源映射 | `sourceMap`, `inlineSourceMap` |
| 输出 | `declaration`, `declarationMap` |
| 实验性 | `experimentalDecorators`, `emitDecoratorMetadata` |

---

## 配置继承

### extends 字段

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}

// tsconfig.json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

### 继承 npm 包

```json
{
  "extends": "@tsconfig/recommended/tsconfig.json",
  "compilerOptions": {
    "strict": true
  }
}
```

### 常用 tsconfig 包

```bash
npm install --save-dev @tsconfig/recommended
npm install --save-dev @tsconfig/node16
npm install --save-dev @tsconfig/svelte
npm install --save-dev @tsconfig/vite-react
```

---

## 项目引用

### composite 项目

```json
// packages/shared/tsconfig.json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}

// packages/app/tsconfig.json
{
  "references": [
    { "path": "../shared" }
  ],
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext"
  }
}
```

### 根项目配置

```json
// tsconfig.json
{
  "references": [
    { "path": "./packages/shared" },
    { "path": "./packages/app" },
    { "path": "./packages/server" }
  ],
  "files": []
}
```

### 项目引用优势

- 增量编译：只编译修改的部分
- 代码组织：清晰的依赖关系
- 跨项目类型检查

---

## 文件包含与排除

### include

```json
{
  "include": [
    "src/**/*",           // src 下所有文件
    "tests/**/*",         // tests 下所有文件
    "**/*.ts",            // 所有 .ts 文件
    "**/*.tsx",           // 所有 .tsx 文件
    "**/*.d.ts"           // 所有声明文件
  ]
}
```

### exclude

```json
{
  "exclude": [
    "node_modules",       // 排除 node_modules
    "dist",               // 排除输出目录
    "**/*.test.ts",       // 排除测试文件
    "**/*.spec.ts"        // 排除规范测试文件
  ]
}
```

### files

```json
{
  "files": [
    "./src/index.ts",
    "./src/main.ts"
  ]
}
```

### 优先级

1. `files` 指定的文件始终包含
2. `include` 包含匹配的文件
3. `exclude` 排除匹配的文件
4. `exclude` 默认包含 `node_modules`, `bower_components`, `jspm_packages`

---

## 完整配置示例

### 前端项目

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Node.js 项目

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

**下一节**: [基本选项](./02-基本选项.md)
