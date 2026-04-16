# 编译器选项

## 模块概述

tsconfig.json 是 TypeScript 项目的配置文件,本章将详细介绍各种编译器选项及其作用。

## 目录

- [01-tsconfig.json配置](./01-tsconfig.json配置.md)
- [02-基本选项](./02-基本选项.md)
- [03-严格类型检查选项](./03-严格类型检查选项.md)
- [04-模块解析选项](./04-模块解析选项.md)
- [05-源映射选项](./05-源映射选项.md)
- [06-实验性选项](./06-实验性选项.md)

## 核心要点

### 配置文件结构

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
  "extends": "base.json", // 继承配置
  "references": [
    // 项目引用
  ]
}
```

### 常用配置示例

```json
{
  "compilerOptions": {
    /* 基本选项 */
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "outDir": "./dist",
    "rootDir": "./src",

    /* 严格类型检查 */
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,

    /* 模块解析 */
    "moduleResolution": "node",
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    },

    /* 其他选项 */
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 严格模式选项

```json
{
  "compilerOptions": {
    "strict": true,                     // 启用所有严格选项
    "noImplicitAny": true,              // 禁止隐式 any
    "strictNullChecks": true,           // 严格的 null 检查
    "strictFunctionTypes": true,        // 严格的函数类型
    "strictBindCallApply": true,        // 严格的 bind/call/apply
    "strictPropertyInitialization": true, // 严格的属性初始化
    "noImplicitThis": true,             // 禁止隐式 this
    "useUnknownInCatchVariables": true,  // catch 变量为 unknown
    "alwaysStrict": true                // 总是使用严格模式
  }
}
```

### 项目引用

```json
// tsconfig.json (根目录)
{
  "references": [
    { "path": "./src/shared" },
    { "path": "./src/server" },
    { "path": "./src/client" }
  ],
  "files": []
}

// tsconfig.json (子项目)
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

## 学习路径

1. 理解 tsconfig.json 的作用
2. 掌握常用编译选项
3. 学会配置模块解析
4. 理解项目引用
5. 实践优化配置

## 参考资料

- [TypeScript Handbook - tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
- [TypeScript Compiler Options](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
