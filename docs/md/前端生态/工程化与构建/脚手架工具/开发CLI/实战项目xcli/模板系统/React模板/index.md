# React 模板

React 模板用于创建现代化的 React 应用项目，支持 Monorepo 架构和丰富的配置选项。

## 模板定义

```typescript
export const reactTemplate = {
  type: 'react' as ProjectType,
  displayName: 'React',
  description: 'React 前端项目 (pnpm monorepo)',
  
  createStructure: async (projectPath, context) => { /* ... */ },
  getDependencies: (styleType, stateManager, httpClient, monitoring, bundler, useTypeScript) => { /* ... */ },
  getScripts: (bundler, useTypeScript) => { /* ... */ },
};
```

---

## 项目结构

```
my-react-app/
├── src/                        # 主应用源码
│   ├── api/                    # API 请求
│   │   └── request.ts          # HTTP 请求封装
│   ├── components/             # 通用组件
│   │   ├── Layout.tsx          # 布局组件
│   │   └── Layout.less         # 布局样式
│   ├── pages/                  # 页面组件
│   │   ├── Home.tsx            # 首页
│   │   ├── Home.less
│   │   ├── About.tsx           # 关于页
│   │   └── About.less
│   ├── router/                 # 路由配置
│   │   └── index.tsx
│   ├── store/                  # 状态管理
│   │   ├── index.ts            # Store 配置
│   │   ├── counterSlice.ts     # 示例 Slice
│   │   ├── apiSlice.ts         # RTK Query API
│   │   └── middleware/         # 中间件
│   ├── utils/                  # 工具函数
│   ├── types/                  # TypeScript 类型定义
│   ├── App.tsx                 # 根组件
│   ├── main.tsx                # 入口文件
│   └── index.less              # 全局样式
├── packages/                   # Monorepo 子包
│   ├── shared/                 # 共享工具库
│   │   ├── src/
│   │   │   └── index.ts        # 工具函数导出
│   │   └── package.json
│   └── ui/                     # UI 组件库
│       ├── src/
│       │   ├── index.ts        # 组件导出
│       │   └── components/
│       │       └── Button.tsx
│       └── package.json
├── public/                     # 静态资源
├── index.html                  # HTML 模板
├── vite.config.ts              # Vite 配置
├── tsconfig.json               # TypeScript 配置
├── eslint.config.js            # ESLint 配置
├── pnpm-workspace.yaml         # pnpm 工作区配置
└── package.json
```

---

## 支持的配置选项

### 样式预处理器

| 类型 | 扩展名 | 说明 |
|------|--------|------|
| CSS | `.css` | 原生 CSS |
| Less | `.less` | CSS 预处理器 |
| SCSS | `.scss` | CSS 预处理器 |

### 状态管理

| 类型 | 说明 |
|------|------|
| none | 不使用状态管理 |
| redux | Redux Toolkit |
| mobx | MobX + mobx-react-lite |

### HTTP 请求库

| 类型 | 说明 |
|------|------|
| none | 不使用 |
| axios | Axios 库 |
| fetch | 原生 Fetch 封装 |

### 打包工具

| 类型 | 说明 |
|------|------|
| vite | Vite（推荐） |
| webpack | Webpack 5 |
| rollup | Rollup |

---

## createStructure 实现

### 根目录文件

```typescript
// 根据打包工具生成不同的 package.json
const basePackageJson = {
  name: context.projectName,
  version: '1.0.0',
  private: true,
  type: 'module',
  dependencies: {
    shared: 'workspace:*',
    ui: 'workspace:*',
  },
};

if (bundler === 'vite') {
  basePackageJson.scripts = {
    dev: 'vite',
    build: useTypeScript ? 'tsc && vite build' : 'vite build',
    preview: 'vite preview',
  };
  basePackageJson.devDependencies = {
    '@vitejs/plugin-react': '^4.2.1',
    '@vitejs/plugin-legacy': '^5.3.0',
    autoprefixer: '^10.4.17',
  };
}
```

### 入口文件生成

```typescript
// src/main.tsx
let mainContent = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.${styleExt}';
`;

// 添加监控 SDK
if (monitoring === 'xstat') {
  mainContent += `import { initXStat, ReactErrorBoundary } from './utils/monitoring';

initXStat();
`;
}

// 添加状态管理
if (stateManager === 'redux') {
  mainContent += `import { store } from './store';
import { Provider } from 'react-redux';
`;
  mainContent += `
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      ${monitoring === 'xstat' ? '<ReactErrorBoundary><App /></ReactErrorBoundary>' : '<App />'}
    </Provider>
  </React.StrictMode>,
);
`;
}
```

### 路由配置

```typescript
// src/router/index.tsx
await fs.writeFile(
  path.join(projectPath, 'src', 'router', `index${jsxExt}`),
  `import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import About from '../pages/About';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
    ],
  },
]);

export default router;
`,
  'utf-8'
);
```

### Redux Store 创建

```typescript
async function createReduxStore(projectPath, bundler, useTypeScript) {
  const storePath = path.join(projectPath, 'src', 'store');
  await fs.ensureDir(storePath);
  await fs.ensureDir(path.join(storePath, 'middleware'));

  // store/index.ts
  await fs.writeFile(
    path.join(storePath, `index${ext}`),
    getReduxStoreIndex(bundler, useTypeScript),
    'utf-8'
  );

  // store/counterSlice.ts
  await fs.writeFile(
    path.join(storePath, `counterSlice${ext}`),
    getReduxCounterSlice(useTypeScript),
    'utf-8'
  );

  // store/apiSlice.ts (RTK Query)
  await fs.writeFile(
    path.join(storePath, `apiSlice${ext}`),
    getReduxApiSlice(useTypeScript),
    'utf-8'
  );
}
```

### Monorepo 包创建

```typescript
// 创建 shared 包（工具函数）
await createSharedPackage(projectPath, useTypeScript);

// 创建 ui 包（React 组件库）
await createReactUiPackage(projectPath, useTypeScript);
```

---

## getDependencies 实现

```typescript
getDependencies: (styleType, stateManager, httpClient, monitoring, bundler, useTypeScript) => {
  const deps = {
    dependencies: {
      react: '^18.2.0',
      'react-dom': '^18.2.0',
      'react-router-dom': '^6.22.0',
      shared: 'workspace:*',
      ui: 'workspace:*',
    },
    devDependencies: {},
  };

  // TypeScript 类型
  if (useTypeScript) {
    deps.devDependencies['@types/react'] = '^18.2.48';
    deps.devDependencies['@types/react-dom'] = '^18.2.18';
    deps.devDependencies['typescript'] = '^5.3.3';
  }

  // 打包工具依赖
  if (bundler === 'vite') {
    deps.devDependencies['vite'] = '^5.0.12';
    deps.devDependencies['@vitejs/plugin-react'] = '^4.2.1';
  } else if (bundler === 'webpack') {
    deps.devDependencies['webpack'] = '^5.98.0';
    deps.devDependencies['webpack-cli'] = '^6.0.1';
    // ... 更多 webpack 依赖
  }

  // 状态管理依赖
  if (stateManager === 'redux') {
    deps.dependencies['@reduxjs/toolkit'] = '^2.2.0';
    deps.dependencies['react-redux'] = '^9.1.0';
  } else if (stateManager === 'mobx') {
    deps.dependencies['mobx'] = '^6.12.0';
    deps.dependencies['mobx-react-lite'] = '^4.0.5';
  }

  // HTTP 请求库
  if (httpClient === 'axios') {
    deps.dependencies['axios'] = '^1.6.0';
  }

  // 监控 SDK
  if (monitoring === 'xstat') {
    deps.dependencies['@jserxiao/xstat'] = '^1.0.0';
  }

  // 样式预处理器
  if (styleType === 'less') {
    deps.devDependencies['less'] = '^4.2.0';
  } else if (styleType === 'scss') {
    deps.devDependencies['sass'] = '^1.70.0';
  }

  return deps;
}
```

---

## getScripts 实现

```typescript
getScripts: (bundler, useTypeScript) => {
  if (bundler === 'webpack') {
    return {
      dev: 'webpack serve --mode development',
      build: 'webpack --mode production',
      ...(useTypeScript && { typecheck: 'tsc --noEmit' }),
    };
  }
  
  return {
    dev: 'vite',
    build: useTypeScript ? 'tsc --noEmit && vite build' : 'vite build',
    preview: 'vite preview',
  };
}
```

---

## 使用示例

### 交互式创建

```bash
xcli init my-react-app

# 交互问答
? 选择项目类型: React
? 选择样式预处理器: Less
? 选择状态管理: Redux Toolkit
? 选择 HTTP 请求库: Axios
? 选择打包工具: Vite
? 使用 TypeScript?: Yes
? 选择代码检查插件: ESLint, Prettier
```

### 命令行参数创建

```bash
xcli init my-react-app \
  --template react \
  --style less \
  --state-manager redux \
  --http-client axios \
  --bundler vite \
  --package-manager pnpm \
  --default
```

### 开发流程

```bash
cd my-react-app

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建
pnpm build
```

---

## Monorepo 使用

### 引用内部包

```typescript
// 使用 shared 包的工具函数
import { formatDate, sleep } from 'shared';

// 使用 ui 包的组件
import { Button } from 'ui';
```

### shared 包内容

```typescript
// packages/shared/src/index.ts
export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN');
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

### ui 包内容

```typescript
// packages/ui/src/components/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  children: React.ReactNode;
}

export function Button({ variant = 'primary', onClick, children }: ButtonProps) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}
```

---

## 总结

React 模板的特点：

1. **Monorepo 架构**：pnpm workspace 管理多包
2. **灵活配置**：支持多种状态管理、HTTP 请求库
3. **打包工具选择**：支持 Vite 和 Webpack
4. **TypeScript 优先**：完整的类型支持
5. **最佳实践**：内置代码规范和开发工具

这是一个功能完整、可扩展的 React 项目模板。
