# Vue 模板

Vue 模板用于创建现代化的 Vue 3 应用项目，支持 Monorepo 架构和 Pinia 状态管理。

## 模板定义

```typescript
export const vueTemplate = {
  type: 'vue' as ProjectType,
  displayName: 'Vue',
  description: 'Vue 3 前端项目 (pnpm monorepo)',
  
  createStructure: async (projectPath, context) => { /* ... */ },
  getDependencies: (styleType, stateManager, httpClient, monitoring, bundler, useTypeScript) => { /* ... */ },
  getScripts: (bundler, useTypeScript) => { /* ... */ },
};
```

---

## 项目结构

```
my-vue-app/
├── src/                        # 主应用源码
│   ├── api/                    # API 请求
│   │   └── request.ts          # HTTP 请求封装
│   ├── components/             # 通用组件
│   ├── pages/                  # 页面组件
│   │   ├── Home.vue            # 首页
│   │   └── About.vue           # 关于页
│   ├── router/                 # 路由配置
│   │   └── index.ts
│   ├── store/                  # Pinia 状态管理
│   │   ├── index.ts            # Store 配置
│   │   └── counter.ts          # 示例 Store
│   ├── utils/                  # 工具函数
│   ├── types/                  # TypeScript 类型定义
│   ├── App.vue                 # 根组件
│   ├── main.ts                 # 入口文件
│   └── style.less              # 全局样式
├── packages/                   # Monorepo 子包
│   ├── shared/                 # 共享工具库
│   │   ├── src/
│   │   │   └── index.ts
│   │   └── package.json
│   └── ui/                     # UI 组件库
│       ├── src/
│       │   ├── index.ts
│       │   └── components/
│       │       └── MyButton.vue
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
| pinia | Vue 官方状态管理（推荐） |
| none | 不使用状态管理 |

### HTTP 请求库

| 类型 | 说明 |
|------|------|
| axios | Axios 库 |
| fetch | 原生 Fetch 封装 |
| none | 不使用 |

### 打包工具

| 类型 | 说明 |
|------|------|
| vite | Vite（推荐） |
| webpack | Webpack 5 |

---

## createStructure 实现

### 入口文件生成

```typescript
// src/main.ts
let mainContent = `import { createApp } from 'vue';
import './style.${styleExt}';
import App from './App.vue';
import router from './router';
${stateManager === 'pinia' ? "import { pinia } from './store';" : ''}
${monitoring === 'xstat' ? "import { initXStat } from './utils/monitoring';" : ''}
`;

mainContent += `
const app = createApp(App);
`;

// Vue 错误处理和监控初始化
if (monitoring === 'xstat') {
  mainContent += `
// 初始化前端监控（传入 Vue app 实例以启用 Vue 错误监控）
initXStat(app);

app.use(router);
`;
} else {
  mainContent += `app.use(router);
`;
}

if (stateManager === 'pinia') {
  mainContent += `app.use(pinia);
`;
}

mainContent += `app.mount('#app');
`;

await fs.writeFile(path.join(projectPath, 'src', `main${ext}`), mainContent, 'utf-8');
```

### 路由配置

```typescript
// src/router/index.ts
await fs.writeFile(
  path.join(projectPath, 'src', 'router', `index${ext}`),
  `import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import About from '../pages/About.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
`,
  'utf-8'
);
```

### App.vue 生成

```typescript
// src/App.vue
await fs.writeFile(
  path.join(projectPath, 'src', 'App.vue'),
  `<script setup${scriptLang}>
</script>

<template>
  <div class="app">
    <nav class="nav">
      <router-link to="/">首页</router-link>
      <router-link to="/about">关于</router-link>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped${styleLang}>
${getAppStyles(styleType, 'vue')}
</style>
`,
  'utf-8'
);
```

### Pinia Store 创建

```typescript
async function createPiniaStore(projectPath, useTypeScript) {
  const storePath = path.join(projectPath, 'src', 'store');
  await fs.ensureDir(storePath);

  // store/index.ts
  await fs.writeFile(
    path.join(storePath, `index${ext}`),
    getPiniaStoreIndex(),
    'utf-8'
  );

  // store/counter.ts
  await fs.writeFile(
    path.join(storePath, `counter${ext}`),
    getPiniaCounterStore(),
    'utf-8'
  );
}
```

### Home.vue 生成（带 Pinia）

```typescript
// src/pages/Home.vue
const homeVue = `<script setup${scriptLang}>
import { useCounterStore } from '../store/counter';
import { storeToRefs } from 'pinia';

const counterStore = useCounterStore();
const { count, doubleCount } = storeToRefs(counterStore);
</script>

<template>
  <div class="page">
    <div class="hero">
      <div class="logo">⚡</div>
      <h1>${context.projectName}</h1>
      <p class="subtitle">由 xcli 生成的现代化 Vue 项目</p>
      <div class="actions">
        <a href="https://vuejs.org" target="_blank" class="btn primary">
          📚 Vue 文档
        </a>
        <a href="https://vitejs.dev" target="_blank" class="btn secondary">
          ⚡ Vite 文档
        </a>
      </div>
    </div>
    <div class="card">
      <h2>🧮 状态管理演示</h2>
      <p>使用 Pinia 进行全局状态管理</p>
      <div class="counter-demo">
        <button type="button" @click="counterStore.decrement()">-</button>
        <span class="count">{{ count }}</span>
        <button type="button" @click="counterStore.increment()">+</button>
      </div>
      <p>双倍值: {{ doubleCount }}</p>
    </div>
  </div>
</template>

<style scoped${styleLang}>
${getPageStyles(styleType)}
</style>
`;
```

---

## getDependencies 实现

```typescript
getDependencies: (styleType, stateManager, httpClient, monitoring, bundler, useTypeScript) => {
  const deps = {
    dependencies: {
      vue: '^3.4.15',
      'vue-router': '^4.3.0',
      shared: 'workspace:*',
      ui: 'workspace:*',
    },
    devDependencies: {},
  };

  // TypeScript 类型
  if (useTypeScript) {
    deps.devDependencies['typescript'] = '^5.3.3';
  }

  // 打包工具依赖
  if (bundler === 'vite') {
    deps.devDependencies['vite'] = '^5.0.12';
    deps.devDependencies['@vitejs/plugin-vue'] = '^5.0.3';
    deps.devDependencies['@vitejs/plugin-legacy'] = '^5.3.0';
    if (useTypeScript) {
      deps.devDependencies['vue-tsc'] = '^1.8.27';
    }
  } else if (bundler === 'webpack') {
    deps.devDependencies['webpack'] = '^5.98.0';
    deps.devDependencies['vue-loader'] = '^17.4.2';
    deps.devDependencies['@vue/compiler-sfc'] = '^3.4.0';
    // ... 更多 webpack 依赖
  }

  // Pinia 状态管理
  if (stateManager === 'pinia') {
    deps.dependencies['pinia'] = '^2.1.7';
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
      ...(useTypeScript && { typecheck: 'vue-tsc --noEmit' }),
    };
  }
  
  return {
    dev: 'vite',
    build: useTypeScript ? 'vue-tsc --noEmit && vite build' : 'vite build',
    preview: 'vite preview',
  };
}
```

---

## 使用示例

### 交互式创建

```bash
xcli init my-vue-app

# 交互问答
? 选择项目类型: Vue
? 选择样式预处理器: Less
? 选择状态管理: Pinia
? 选择 HTTP 请求库: Axios
? 选择打包工具: Vite
? 使用 TypeScript?: Yes
```

### 命令行参数创建

```bash
xcli init my-vue-app \
  --template vue \
  --style less \
  --state-manager pinia \
  --http-client axios \
  --bundler vite \
  --package-manager pnpm \
  --default
```

### 开发流程

```bash
cd my-vue-app

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建
pnpm build

# 类型检查
pnpm typecheck
```

---

## Monorepo 使用

### 引用内部包

```vue
<script setup lang="ts">
import { formatDate, sleep } from 'shared';
import { MyButton } from 'ui';

const date = ref<string>('');

onMounted(() => {
  date.value = formatDate(new Date());
});
</script>

<template>
  <div>
    <p>当前日期: {{ date }}</p>
    <MyButton variant="primary">Primary</MyButton>
  </div>
</template>
```

### ui 包内容

```vue
<!-- packages/ui/src/components/MyButton.vue -->
<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary';
}>();

defineEmits<{
  click: [];
}>();
</script>

<template>
  <button 
    :class="['btn', \`btn-\${variant}\`]" 
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<style scoped>
.btn { /* ... */ }
.btn-primary { /* ... */ }
.btn-secondary { /* ... */ }
</style>
```

---

## 与 React 模板的区别

| 特性 | Vue 模板 | React 模板 |
|------|---------|-----------|
| 框架版本 | Vue 3 | React 18 |
| 状态管理 | Pinia | Redux/MobX |
| 组件格式 | SFC (.vue) | JSX/TSX |
| 路由库 | Vue Router 4 | React Router 6 |
| 类型检查 | vue-tsc | tsc |

---

## 总结

Vue 模板的特点：

1. **Vue 3 + Composition API**：使用 `<script setup>` 语法
2. **Pinia 状态管理**：Vue 官方推荐的状态管理方案
3. **Monorepo 架构**：pnpm workspace 管理多包
4. **TypeScript 支持**：完整的类型支持
5. **灵活配置**：支持多种样式预处理器和打包工具

这是一个现代化的 Vue 3 项目模板，适合构建企业级前端应用。
