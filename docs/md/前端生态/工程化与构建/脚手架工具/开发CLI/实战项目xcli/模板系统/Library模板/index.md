# Library 模板

Library 模板用于创建 TypeScript/JavaScript 库项目，提供基础的库开发环境。

## 模板定义

```typescript
export const libraryTemplate: TemplateGenerator = {
  type: 'library',
  displayName: 'Library',
  description: 'TypeScript/JavaScript 库项目',
  
  createStructure: async (projectPath, context) => { /* ... */ },
  getDependencies: (styleType, stateManager, httpClient, monitoring, bundler, useTypeScript) => { /* ... */ },
  getScripts: (bundler, useTypeScript) => { /* ... */ },
};
```

---

## 项目结构

```
my-library/
├── src/
│   └── index.ts        # 入口文件
├── dist/               # 构建输出
├── tests/              # 测试文件
├── tsconfig.json       # TypeScript 配置
├── package.json
└── README.md
```

---

## createStructure 实现

### 目录创建

```typescript
createStructure: async (projectPath: string, context: PluginContext) => {
  const { useTypeScript = true } = context;
  const ext = getExt(useTypeScript);

  // 创建目录
  await fs.ensureDir(path.join(projectPath, 'src'));
  await fs.ensureDir(path.join(projectPath, 'dist'));
}
```

### TypeScript 项目

```typescript
if (useTypeScript) {
  // 创建入口文件
  await fs.writeFile(
    path.join(projectPath, 'src', 'index.ts'),
    `/**
 * ${context.projectName}
 */

export function hello(name: string): string {
  return \`Hello, \${name}!\`;
}

export default {
  hello,
};
`,
    'utf-8'
  );

  // 创建 tsconfig.json
  await fs.writeFile(
    path.join(projectPath, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        target: 'ES2022',
        module: 'ESNext',
        moduleResolution: 'Node',
        lib: ['ES2022'],
        outDir: './dist',
        rootDir: './src',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        declaration: true,      // 生成 .d.ts 声明文件
        declarationMap: true,   // 生成声明文件的 sourcemap
        sourceMap: true,        // 生成 sourcemap
      },
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist'],
    }, null, 2),
    'utf-8'
  );
}
```

### JavaScript 项目

```typescript
else {
  await fs.writeFile(
    path.join(projectPath, 'src', 'index.js'),
    `/**
 * ${context.projectName}
 */

export function hello(name) {
  return \`Hello, \${name}!\`;
}

export default {
  hello,
};
`,
    'utf-8'
  );
}
```

---

## getDependencies 实现

```typescript
getDependencies: (
  _styleType?: StyleType,
  _stateManager?: StateManagerType,
  _httpClient?: HttpClientType,
  _monitoring?: MonitoringType,
  _bundler?: BundlerType,
  useTypeScript: boolean = true
) => {
  const deps = {
    dependencies: {},
    devDependencies: {},
  };

  if (useTypeScript) {
    deps.devDependencies['typescript'] = '^5.3.3';
  }

  return deps;
}
```

Library 项目依赖非常精简，只包含必要的 TypeScript 编译器。

---

## getScripts 实现

```typescript
getScripts: (_bundler?: BundlerType, useTypeScript: boolean = true) => {
  if (useTypeScript) {
    return {
      build: 'tsc',
      start: 'node dist/index.js',
    };
  }
  return {
    build: 'echo "No build step needed for JS"',
    start: 'node src/index.js',
  };
}
```

---

## TypeScript 配置详解

### compilerOptions 关键配置

| 配置项 | 值 | 说明 |
|--------|-----|------|
| `target` | `ES2022` | 编译目标版本 |
| `module` | `ESNext` | 模块系统 |
| `moduleResolution` | `Node` | 模块解析策略 |
| `outDir` | `./dist` | 输出目录 |
| `rootDir` | `./src` | 源码目录 |
| `strict` | `true` | 严格模式 |
| `declaration` | `true` | 生成类型声明文件 |
| `declarationMap` | `true` | 声明文件 sourcemap |
| `sourceMap` | `true` | 生成 sourcemap |

---

## 生成的 package.json

```json
{
  "name": "my-library",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "devDependencies": {
    "typescript": "^5.3.3"
  }
}
```

### 关键字段说明

| 字段 | 说明 |
|------|------|
| `main` | 包入口文件 |
| `types` | 类型声明文件入口 |
| `files` | 发布时包含的文件 |

---

## 使用示例

### 创建 Library 项目

```bash
# 交互式创建
xcli init my-library

# 选择 Library 类型
# ? 选择项目类型: Library - TypeScript/JavaScript 库项目
```

### 使用默认配置创建

```bash
xcli init my-library --template library --default
```

### 开发流程

```bash
cd my-library

# 安装依赖
pnpm install

# 开发模式（监听文件变化）
pnpm build --watch

# 构建
pnpm build
```

---

## 扩展建议

### 添加 Rollup 打包

如果需要更强大的打包能力，可以添加 Rollup 插件：

```bash
xcli plugin add rollup
```

这将生成 `rollup.config.js` 并更新 npm scripts。

### 添加测试框架

```bash
xcli plugin add jest
# 或
xcli plugin add vitest
```

### 添加代码规范

```bash
xcli plugin add eslint prettier
```

---

## 与 React/Vue 模板的区别

| 特性 | Library 模板 | React/Vue 模板 |
|------|-------------|---------------|
| 项目结构 | 简单 | Monorepo |
| 状态管理 | 不支持 | Redux/MobX/Pinia |
| HTTP 请求 | 不支持 | Axios/Fetch |
| 监控 SDK | 不支持 | xstat |
| 打包工具 | tsc | Vite/Webpack |
| Monorepo | 否 | 是（pnpm workspace） |

---

## 总结

Library 模板的特点：

1. **轻量级**：只包含必要的基础设施
2. **TypeScript 优先**：默认使用 TypeScript
3. **易于扩展**：可以通过插件添加功能
4. **适合库开发**：生成类型声明文件，便于发布到 npm

这是一个理想的 JavaScript/TypeScript 库开发起点。
