# 模板系统详解

> 本节详细介绍 `@jserxiao/xcli` 的模板系统设计，包括模板接口、三种项目模板的实现和 Monorepo 结构。

## 学习要点

- 📁 掌握模板接口设计
- 🔄 理解模板与插件协作机制
- 🏗️ 掌握 Monorepo 项目结构生成
- 📦 理解依赖和脚本的动态管理

---

## 1. 模板系统设计

### 1.1 设计理念

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  模板系统设计理念                                                                      │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  核心职责                                                                              │
│  ├── 项目结构创建: 创建目录和基础文件                                                 │
│  ├── 依赖管理: 提供框架/库的基础依赖                                                 │
│  ├── 脚本定义: 提供构建/开发/测试脚本                                                │
│  └── 与插件协作: 为插件生成预留空间                                                  │
│                                                                                       │
│  模板特点                                                                              │
│  ├── 纯代码生成: 不使用 EJS 等模板引擎，直接用代码生成                               │
│  ├── 动态配置: 根据用户选择生成不同内容                                              │
│  ├── Monorepo 支持: React/Vue 项目使用 pnpm workspace                               │
│  └── 可扩展性: 易于添加新的项目模板                                                  │
│                                                                                       │
│  与插件的关系                                                                          │
│  ├── 模板负责: 项目骨架、框架依赖、基础配置                                          │
│  ├── 插件负责: 工具配置、开发依赖、特定功能                                          │
│  └── 协作方式: 模板先创建结构，插件再生成配置文件                                    │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 模板接口定义

```typescript
// src/templates/library.ts

/**
 * 模板生成器接口
 */
export interface TemplateGenerator {
  // ============ 元信息 ============
  
  /** 项目类型 */
  type: ProjectType;
  
  /** 显示名称 */
  displayName: string;
  
  /** 描述 */
  description: string;
  
  // ============ 核心方法 ============
  
  /**
   * 创建项目目录结构
   * @param projectPath 项目路径
   * @param context 插件上下文
   */
  createStructure: (
    projectPath: string, 
    context: PluginContext
  ) => Promise<void>;
  
  /**
   * 获取项目依赖
   * @param styleType 样式预处理器
   * @param stateManager 状态管理
   * @param httpClient HTTP 请求库
   * @param monitoring 监控 SDK
   * @param bundler 打包工具
   * @param useTypeScript 是否使用 TypeScript
   */
  getDependencies: (
    styleType?: StyleType,
    stateManager?: StateManagerType,
    httpClient?: HttpClientType,
    monitoring?: MonitoringType,
    bundler?: BundlerType,
    useTypeScript?: boolean
  ) => { 
    dependencies: Record<string, string>; 
    devDependencies: Record<string, string> 
  };
  
  /**
   * 获取 npm scripts
   * @param bundler 打包工具
   * @param useTypeScript 是否使用 TypeScript
   */
  getScripts: (
    bundler?: BundlerType, 
    useTypeScript?: boolean
  ) => Record<string, string>;
}
```

### 1.3 模板注册机制

```typescript
// src/templates/index.ts

import { libraryTemplate } from './library';
import { reactTemplate } from './react';
import { vueTemplate } from './vue';

/**
 * 所有可用模板列表
 */
export const templates = [libraryTemplate, reactTemplate, vueTemplate];

/**
 * 模板映射表（按项目类型索引）
 */
export const templateMap = new Map<ProjectType, typeof libraryTemplate>(
  templates.map((t) => [t.type, t])
);

/**
 * 获取模板列表（用于交互式选择）
 */
export function getTemplateChoices() {
  return templates.map((t) => ({
    name: `${t.displayName} - ${t.description}`,
    value: t.type,
  }));
}

/**
 * 根据项目类型获取模板
 */
export function getTemplate(type: ProjectType) {
  return templateMap.get(type);
}

/**
 * 创建项目结构
 */
export async function createProjectStructure(
  projectPath: string,
  projectType: ProjectType,
  context: PluginContext
) {
  const template = getTemplate(projectType);
  if (!template) {
    throw new Error(`Unknown project type: ${projectType}`);
  }

  // 1. 模板创建项目特定结构
  await template.createStructure(projectPath, context);

  // 2. 创建基础文件（.gitignore 和 README.md）
  await createBaseFiles(projectPath, context.projectName, projectType, {
    styleType: context.styleType,
    stateManager: context.stateManager,
    httpClient: context.httpClient,
    monitoring: context.monitoring,
  });
}
```

---

## 2. Library 模板

### 2.1 项目结构

```
my-library/
├── src/
│   └── index.ts          # 入口文件
├── dist/                  # 编译输出
├── package.json
├── tsconfig.json          # TypeScript 配置
├── .gitignore
└── README.md
```

### 2.2 实现

```typescript
// src/templates/library.ts

export const libraryTemplate: TemplateGenerator = {
  type: 'library',
  displayName: 'Library',
  description: 'TypeScript/JavaScript 库项目',

  createStructure: async (projectPath: string, context: PluginContext) => {
    const { useTypeScript = true } = context;
    const ext = useTypeScript ? '.ts' : '.js';

    // 创建目录
    await fs.ensureDir(path.join(projectPath, 'src'));
    await fs.ensureDir(path.join(projectPath, 'dist'));

    // 创建入口文件
    if (useTypeScript) {
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
            declaration: true,        // 生成 .d.ts
            declarationMap: true,     // 生成声明映射
            sourceMap: true,
          },
          include: ['src/**/*'],
          exclude: ['node_modules', 'dist'],
        }, null, 2),
        'utf-8'
      );
    }
  },

  getDependencies: (_styleType, _stateManager, _httpClient, _monitoring, _bundler, useTypeScript = true) => {
    const deps = { dependencies: {}, devDependencies: {} };
    if (useTypeScript) {
      deps.devDependencies['typescript'] = '^5.3.3';
    }
    return deps;
  },

  getScripts: (_bundler, useTypeScript = true) => {
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
  },
};
```

---

## 3. React 模板

### 3.1 项目结构（Monorepo）

```
my-react-app/
├── package.json              # 根 package.json
├── pnpm-workspace.yaml       # pnpm workspace 配置
├── tsconfig.json             # TypeScript 配置
├── vite.config.ts            # Vite 配置
├── index.html                # HTML 入口
├── postcss.config.js         # PostCSS 配置
├── .browserslistrc           # 浏览器兼容配置
├── .env                      # 环境变量
├── .env.development
├── .env.production
├── .env.example
├── .gitignore
├── .npmrc                    # npm 配置
│
├── public/
│   └── vite.svg
│
├── src/                      # 主应用源码
│   ├── main.tsx              # 入口文件
│   ├── App.tsx               # 根组件
│   ├── index.less            # 全局样式
│   ├── vite-env.d.ts         # Vite 类型声明
│   │
│   ├── pages/                # 页面组件
│   │   ├── Home.tsx
│   │   ├── Home.less
│   │   ├── About.tsx
│   │   └── About.less
│   │
│   ├── components/           # 公共组件
│   │   ├── Layout.tsx
│   │   └── Layout.less
│   │
│   ├── router/               # 路由配置
│   │   └── index.tsx
│   │
│   ├── store/                # 状态管理 (Redux/MobX)
│   │   ├── index.ts
│   │   ├── counterSlice.ts
│   │   ├── apiSlice.ts
│   │   └── middleware/
│   │       └── logger.ts
│   │
│   ├── api/                  # HTTP 请求
│   │   └── request.ts
│   │
│   ├── utils/                # 工具函数
│   │   └── monitoring.ts     # 监控 SDK
│   │
│   └── assets/               # 静态资源
│
└── packages/                 # Monorepo 子包
    ├── shared/               # 共享工具库
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── src/
    │       ├── index.ts
    │       ├── date.ts
    │       └── sleep.ts
    │
    └── ui/                   # UI 组件库
        ├── package.json
        ├── tsconfig.json
        └── src/
            ├── index.ts
            └── Button.tsx
```

### 3.2 核心实现

```typescript
// src/templates/react.ts (简化版)

export const reactTemplate = {
  type: 'react' as ProjectType,
  displayName: 'React',
  description: 'React 前端项目 (pnpm monorepo)',

  createStructure: async (projectPath: string, context: PluginContext) => {
    const { 
      styleType = 'less', 
      stateManager = 'none', 
      httpClient = 'axios', 
      monitoring = 'none', 
      bundler = 'vite', 
      useTypeScript = true 
    } = context;
    
    const styleExt = getStyleExt(styleType);
    const ext = useTypeScript ? '.ts' : '.js';
    const jsxExt = useTypeScript ? '.tsx' : '.jsx';

    // ============ 1. 根目录文件 ============
    
    // 根据打包工具生成不同的 package.json
    const basePackageJson = {
      name: context.projectName,
      version: '1.0.0',
      private: true,
      type: 'module',
      dependencies: {
        shared: 'workspace:*',   // Monorepo 包引用
        ui: 'workspace:*',
      },
      scripts: bundler === 'vite' ? {
        dev: 'vite',
        build: useTypeScript ? 'tsc && vite build' : 'vite build',
        preview: 'vite preview',
      } : {
        dev: 'webpack serve --mode development',
        build: 'webpack --mode production',
      },
    };

    await fs.writeJson(path.join(projectPath, 'package.json'), basePackageJson, { spaces: 2 });

    // 创建通用配置文件
    await createRootConfigFiles(projectPath, 'react', bundler, useTypeScript);
    
    // 创建环境变量文件
    await createEnvFiles(projectPath, 'react', bundler);

    // ============ 2. src 目录 ============
    
    await createSrcDirectories(projectPath);
    
    // 创建状态管理文件
    if (stateManager === 'redux') {
      await createReduxStore(projectPath, bundler, useTypeScript);
    } else if (stateManager === 'mobx') {
      await createMobXStore(projectPath, useTypeScript);
    }

    // 创建 HTTP 请求文件
    if (httpClient === 'axios') {
      await fs.ensureDir(path.join(projectPath, 'src', 'api'));
      const content = axiosPlugin.files![0].content;
      await fs.writeFile(
        path.join(projectPath, 'src', 'api', `request${ext}`),
        typeof content === 'function' ? content(context) : content,
        'utf-8'
      );
    }

    // 创建监控文件
    if (monitoring === 'xstat') {
      await fs.ensureDir(path.join(projectPath, 'src', 'utils'));
      await fs.writeFile(
        path.join(projectPath, 'src', 'utils', `monitoring${jsxExt}`),
        getReactMonitoringContent(useTypeScript, bundler),
        'utf-8'
      );
    }

    // 创建入口文件和页面组件
    await createEntryFiles(projectPath, context);
    
    // 创建打包工具配置
    if (bundler === 'vite') {
      await fs.writeFile(
        path.join(projectPath, `vite.config.${useTypeScript ? 'ts' : 'js'}`),
        getReactViteConfig(),
        'utf-8'
      );
    }

    // ============ 3. packages 目录 (Monorepo) ============
    
    await fs.ensureDir(path.join(projectPath, 'packages'));
    
    // 创建 shared 包
    await createSharedPackage(projectPath, useTypeScript);
    
    // 创建 ui 包
    await createReactUiPackage(projectPath, useTypeScript);

    // TypeScript 类型声明
    if (useTypeScript && bundler === 'vite') {
      await fs.writeFile(
        path.join(projectPath, 'src', 'vite-env.d.ts'),
        getViteEnvDts('react'),
        'utf-8'
      );
    }
  },

  getDependencies: (styleType, stateManager, httpClient, monitoring, bundler, useTypeScript) => {
    const deps = {
      dependencies: {
        react: FRAMEWORK_VERSIONS.react,
        'react-dom': FRAMEWORK_VERSIONS['react-dom'],
        'react-router-dom': FRAMEWORK_VERSIONS['react-router-dom'],
        shared: 'workspace:*',
        ui: 'workspace:*',
      },
      devDependencies: {},
    };

    // TypeScript 依赖
    if (useTypeScript) {
      deps.devDependencies['@types/react'] = FRAMEWORK_VERSIONS['@types/react'];
      deps.devDependencies['@types/react-dom'] = FRAMEWORK_VERSIONS['@types/react-dom'];
      deps.devDependencies['typescript'] = TS_VERSIONS.typescript;
    }

    // Vite 依赖
    if (bundler === 'vite') {
      deps.devDependencies['vite'] = BUNDLER_VERSIONS.vite;
      deps.devDependencies['@vitejs/plugin-react'] = BUNDLER_VERSIONS['@vitejs/plugin-react'];
    }

    // 状态管理依赖
    if (stateManager === 'redux') {
      deps.dependencies['@reduxjs/toolkit'] = STATE_MANAGER_VERSIONS['@reduxjs/toolkit'];
      deps.dependencies['react-redux'] = STATE_MANAGER_VERSIONS['react-redux'];
    } else if (stateManager === 'mobx') {
      deps.dependencies['mobx'] = STATE_MANAGER_VERSIONS.mobx;
      deps.dependencies['mobx-react-lite'] = STATE_MANAGER_VERSIONS['mobx-react-lite'];
    }

    // HTTP 请求库依赖
    if (httpClient === 'axios') {
      deps.dependencies['axios'] = HTTP_CLIENT_VERSIONS.axios;
    }

    // 监控 SDK 依赖
    if (monitoring === 'xstat') {
      deps.dependencies['@jserxiao/xstat'] = MONITORING_VERSIONS['@jserxiao/xstat'];
    }

    // 样式预处理器依赖
    if (styleType === 'less') {
      deps.devDependencies['less'] = STYLE_VERSIONS.less;
    } else if (styleType === 'scss') {
      deps.devDependencies['sass'] = STYLE_VERSIONS.sass;
    }

    return deps;
  },

  getScripts: (bundler, useTypeScript) => {
    if (bundler === 'webpack') {
      return {
        dev: 'webpack serve --mode development',
        build: 'webpack --mode production',
        typecheck: useTypeScript ? 'tsc --noEmit' : undefined,
      };
    }
    return {
      dev: 'vite',
      build: useTypeScript ? 'tsc --noEmit && vite build' : 'vite build',
      preview: 'vite preview',
    };
  },
};
```

---

## 4. Vue 模板

### 4.1 项目结构

```
my-vue-app/
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.json
├── vite.config.ts
├── index.html
├── postcss.config.js
│
├── src/
│   ├── main.ts               # 入口文件
│   ├── App.vue               # 根组件
│   ├── style.less            # 全局样式
│   │
│   ├── pages/
│   │   ├── Home.vue
│   │   └── About.vue
│   │
│   ├── components/
│   │   └── ...
│   │
│   ├── router/
│   │   └── index.ts
│   │
│   ├── store/                # Pinia store
│   │   ├── index.ts
│   │   └── counter.ts
│   │
│   └── utils/
│       └── monitoring.ts
│
└── packages/
    ├── shared/
    └── ui/
```

### 4.2 Vue 特定实现

```typescript
// src/templates/vue.ts (关键部分)

export const vueTemplate = {
  type: 'vue' as ProjectType,
  displayName: 'Vue',
  description: 'Vue 3 前端项目 (pnpm monorepo)',

  createStructure: async (projectPath: string, context: PluginContext) => {
    // ... 创建目录结构

    // 创建 Pinia store
    if (stateManager === 'pinia') {
      await createPiniaStore(projectPath, useTypeScript);
    }

    // 创建 main.ts
    let mainContent = `import { createApp } from 'vue';
import './style.${styleExt}';
import App from './App.vue';
import router from './router';
${stateManager === 'pinia' ? "import { pinia } from './store';" : ''}
`;

    mainContent += `
const app = createApp(App);
app.use(router);
${stateManager === 'pinia' ? 'app.use(pinia);' : ''}
app.mount('#app');
`;

    await fs.writeFile(path.join(projectPath, 'src', `main${ext}`), mainContent, 'utf-8');

    // 创建 Vue 组件文件
    await createVueComponents(projectPath, context);
  },

  getDependencies: (styleType, stateManager, httpClient, monitoring, bundler, useTypeScript) => {
    const deps = {
      dependencies: {
        vue: FRAMEWORK_VERSIONS.vue,
        'vue-router': FRAMEWORK_VERSIONS['vue-router'],
        shared: 'workspace:*',
        ui: 'workspace:*',
      },
      devDependencies: {},
    };

    // Vite + Vue
    if (bundler === 'vite') {
      deps.devDependencies['vite'] = BUNDLER_VERSIONS.vite;
      deps.devDependencies['@vitejs/plugin-vue'] = BUNDLER_VERSIONS['@vitejs/plugin-vue'];
      if (useTypeScript) {
        deps.devDependencies['vue-tsc'] = FRAMEWORK_VERSIONS['vue-tsc'];
      }
    }

    // Pinia
    if (stateManager === 'pinia') {
      deps.dependencies['pinia'] = STATE_MANAGER_VERSIONS.pinia;
    }

    return deps;
  },
};
```

---

## 5. Monorepo 支持

### 5.1 pnpm workspace 配置

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
```

```ini
# .npmrc
auto-install-peers=true
strict-peer-dependencies=false
ignore-dep-scripts=true
```

### 5.2 shared 包

```typescript
// src/templates/files/shared/packages.ts

/**
 * 创建 shared 包
 * 提供跨项目共享的工具函数
 */
export async function createSharedPackage(
  projectPath: string, 
  useTypeScript: boolean = true
): Promise<void> {
  const sharedPath = path.join(projectPath, 'packages', 'shared');
  const ext = useTypeScript ? '.ts' : '.js';

  await fs.ensureDir(path.join(sharedPath, 'src'));

  // package.json
  await fs.writeJson(
    path.join(sharedPath, 'package.json'),
    {
      name: 'shared',
      version: '1.0.0',
      private: true,
      type: 'module',
      main: 'src/index.ts',
      types: 'src/index.ts',
    },
    { spaces: 2 }
  );

  // 入口文件
  await fs.writeFile(
    path.join(sharedPath, 'src', `index${ext}`),
    `/**
 * Shared utilities
 */

export * from './date';
export * from './sleep';
`,
    'utf-8'
  );

  // 日期工具
  await fs.writeFile(
    path.join(sharedPath, 'src', `date${ext}`),
    `/**
 * 格式化日期
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}
`,
    'utf-8'
  );

  // sleep 工具
  await fs.writeFile(
    path.join(sharedPath, 'src', `sleep${ext}`),
    `/**
 * 延迟执行
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
`,
    'utf-8'
  );
}
```

### 5.3 ui 包

```typescript
/**
 * 创建 React UI 包
 */
export async function createReactUiPackage(
  projectPath: string, 
  useTypeScript: boolean = true
): Promise<void> {
  const uiPath = path.join(projectPath, 'packages', 'ui');
  const ext = useTypeScript ? '.ts' : '.js';
  const jsxExt = useTypeScript ? '.tsx' : '.jsx';

  await fs.ensureDir(path.join(uiPath, 'src'));

  // package.json
  await fs.writeJson(
    path.join(uiPath, 'package.json'),
    {
      name: 'ui',
      version: '1.0.0',
      private: true,
      type: 'module',
      main: 'src/index.ts',
      types: 'src/index.ts',
      peerDependencies: {
        react: '^18.0.0',
      },
    },
    { spaces: 2 }
  );

  // Button 组件
  await fs.writeFile(
    path.join(uiPath, 'src', `Button${jsxExt}`),
    `import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  children: React.ReactNode;
}

export function Button({ variant = 'primary', onClick, children }: ButtonProps) {
  return (
    <button
      className={\`btn btn-\${variant}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
`,
    'utf-8'
  );

  // 入口文件
  await fs.writeFile(
    path.join(uiPath, 'src', `index${ext}`),
    `export * from './Button';
`,
    'utf-8'
  );
}
```

---

## 6. 状态管理模板

### 6.1 Redux Toolkit

```typescript
// src/templates/files/shared/store.ts

/**
 * Redux store 入口
 */
export function getReduxStoreIndex(bundler: BundlerType, useTypeScript: boolean): string {
  const ext = useTypeScript ? '' : '';
  
  return `import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
import apiReducer from './apiSlice';
import { loggerMiddleware } from './middleware/logger';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    api: apiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 类型化的 hooks
export { useDispatch, useSelector } from 'react-redux';
`;
}

/**
 * Counter Slice
 */
export function getReduxCounterSlice(useTypeScript: boolean): string {
  return `import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
`;
}
```

### 6.2 Pinia

```typescript
/**
 * Pinia store 入口
 */
export function getPiniaStoreIndex(): string {
  return `import { createPinia } from 'pinia';

export const pinia = createPinia();
`;
}

/**
 * Counter Store
 */
export function getPiniaCounterStore(): string {
  return `import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCounterStore = defineStore('counter', () => {
  // state
  const count = ref(0);
  
  // getters
  const doubleCount = computed(() => count.value * 2);
  
  // actions
  function increment() {
    count.value++;
  }
  
  function decrement() {
    count.value--;
  }
  
  return {
    count,
    doubleCount,
    increment,
    decrement,
  };
});
`;
}
```

---

## 7. 模板与插件协作

### 7.1 协作流程

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  模板与插件协作流程                                                                    │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  1. 模板创建项目结构                                                                   │
│     ├── 创建目录 (src/, packages/, public/)                                          │
│     ├── 创建入口文件 (main.ts, App.tsx/vue)                                          │
│     ├── 创建基础配置 (tsconfig.json, .browserslistrc)                                │
│     └── 创建环境变量 (.env, .env.development, .env.production)                       │
│                                                                                       │
│  2. 插件生成配置文件                                                                   │
│     ├── ESLint → eslint.config.js                                                    │
│     ├── Prettier → .prettierrc                                                       │
│     ├── Vite → vite.config.ts (如果模板未创建)                                        │
│     └── Husky → .husky/pre-commit                                                    │
│                                                                                       │
│  3. 合并依赖                                                                          │
│     ├── 模板依赖 (react, vue, axios, pinia...)                                       │
│     ├── 插件依赖 (eslint, prettier, vite...)                                         │
│     └── 生成最终的 package.json                                                      │
│                                                                                       │
│  4. 合并脚本                                                                          │
│     ├── 模板脚本 (dev, build, preview)                                               │
│     ├── 插件脚本 (lint, test, format)                                                │
│     └── 生成最终的 scripts                                                           │
│                                                                                       │
│  注意：打包工具配置由模板生成，插件不重复生成                                          │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 避免重复生成

```typescript
// src/commands/init.ts

// 对于 React/Vue 项目，打包工具配置已在模板中生成
// 需要过滤掉插件的打包工具配置文件
const bundlerFiles = ['webpack.config.cjs', 'vite.config.ts', 'vite.config.js', 'rollup.config.js'];

const filteredPlugins = selectedPlugins.map((plugin) => {
  if ((config.projectType === 'react' || config.projectType === 'vue') &&
      (plugin.name === 'webpack' || plugin.name === 'vite' || plugin.name === 'rollup')) {
    // 返回一个不包含配置文件的插件版本
    return {
      ...plugin,
      files: plugin.files?.filter((f) => {
        const pathStr = typeof f.path === 'function' ? f.path(context) : f.path;
        return !bundlerFiles.includes(pathStr);
      }) || [],
    };
  }
  return plugin;
});
```

---

[返回上级目录](../index.md) | [上一章：插件系统](../插件系统/index.md) | [下一章：工具函数](../工具函数/index.md)
