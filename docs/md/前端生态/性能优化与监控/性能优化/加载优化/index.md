# 加载性能优化

> 加载性能优化关注的是如何让用户更快地看到页面内容，减少首屏加载时间。这是用户对网站的第一印象，直接影响跳出率和转化率。

## 学习要点

- 📦 理解关键渲染路径与加载阻塞
- 🚀 掌握代码分割与懒加载技术
- ⚡ 运用预加载策略加速关键资源
- 🔄 理解缓存策略对加载性能的影响

---

## 1. 关键渲染路径优化

### 1.1 关键渲染路径概念

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  关键渲染路径（Critical Rendering Path）                                               │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│   HTML ──► DOM ──┐                                                                    │
│                  ├──► Render Tree ──► Layout ──► Paint ──► Composite                 │
│   CSS  ──► CSSOM ─┘                                                                   │
│                                                                                       │
│   JavaScript 可以修改 DOM 和 CSSOM，会阻塞渲染                                         │
│                                                                                       │
├───────────────────────────────────────────────────────────────────────────────────────┤
│  优化目标                                                                              │
│  • 最小化关键资源数量                                                                  │
│  • 最小化关键资源大小                                                                  │
│  • 最小化关键资源加载延迟                                                              │
│  • 优化关键资源加载顺序                                                                │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 阻塞渲染的资源

```html
<!-- ───────────────────────────────────────────────────────────────────────────────── -->
<!-- CSS 阻塞渲染 -->
<!-- ───────────────────────────────────────────────────────────────────────────────── -->

<!-- CSS 默认阻塞渲染（浏览器需要构建完整的 CSSOM） -->
<link rel="stylesheet" href="styles.css">

<!-- 非阻塞 CSS（媒体查询不匹配时） -->
<link rel="stylesheet" href="print.css" media="print">
<link rel="stylesheet" href="mobile.css" media="screen and (max-width: 768px)">

<!-- 预加载 CSS（提前发现，但仍阻塞渲染） -->
<link rel="preload" href="critical.css" as="style">
<link rel="stylesheet" href="critical.css">

<!-- ───────────────────────────────────────────────────────────────────────────────── -->
<!-- JavaScript 阻塞解析 -->
<!-- ───────────────────────────────────────────────────────────────────────────────── -->

<!-- 默认：阻塞 HTML 解析，等待脚本下载和执行 -->
<script src="app.js"></script>

<!-- async：异步下载，下载完成后立即执行（不保证顺序） -->
<!-- 适用：独立的第三方脚本（统计、广告） -->
<script async src="analytics.js"></script>

<!-- defer：异步下载，HTML 解析完成后按顺序执行 -->
<!-- 适用：依赖 DOM 的脚本 -->
<script defer src="app.js"></script>

<!-- module：默认 defer 行为 -->
<script type="module" src="app.js"></script>

<!-- ───────────────────────────────────────────────────────────────────────────────── -->
<!-- 优化策略对比 -->
<!-- ───────────────────────────────────────────────────────────────────────────────── -->

/*
┌─────────────┬─────────────────────┬─────────────────────┬─────────────────────────────┐
│  属性        │  下载时机            │  执行时机            │  适用场景                    │
├─────────────┼─────────────────────┼─────────────────────┼─────────────────────────────┤
│  无属性      │  立即下载，阻塞解析  │  下载后立即执行      │  关键脚本（尽量避免）        │
├─────────────┼─────────────────────┼─────────────────────┼─────────────────────────────┤
│  async      │  异步下载，不阻塞    │  下载后立即执行      │  独立第三方脚本              │
│             │                     │  阻塞解析            │  （统计、广告）              │
├─────────────┼─────────────────────┼─────────────────────┼─────────────────────────────┤
│  defer      │  异步下载，不阻塞    │  DOMContentLoaded   │  依赖 DOM 的脚本            │
│             │                     │  之前按顺序执行      │  大多数应用脚本              │
├─────────────┼─────────────────────┼─────────────────────┼─────────────────────────────┤
│  module     │  异步下载，不阻塞    │  与 defer 相同       │  ES Module 脚本             │
└─────────────┴─────────────────────┴─────────────────────┴─────────────────────────────┘
*/
```

### 1.3 优化关键渲染路径

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- ───────────────────────────────────────────────────────────────────────────── -->
    <!-- 1. 内联关键 CSS -->
    <!-- ───────────────────────────────────────────────────────────────────────────── -->
    <style>
        /* 首屏渲染所需的关键样式 */
        :root { --primary: #1890ff; }
        body { margin: 0; font-family: system-ui, sans-serif; }
        .header { background: var(--primary); color: white; padding: 16px; }
        .main { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .skeleton { background: #f0f0f0; border-radius: 4px; }
    </style>
    
    <!-- 异步加载非关键 CSS -->
    <link rel="preload" href="non-critical.css" as="style" onload="this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="non-critical.css"></noscript>
    
    <!-- ───────────────────────────────────────────────────────────────────────────── -->
    <!-- 2. 预连接关键域名 -->
    <!-- ───────────────────────────────────────────────────────────────────────────── -->
    <link rel="preconnect" href="https://cdn.example.com">
    <link rel="dns-prefetch" href="https://api.example.com">
    
    <!-- ───────────────────────────────────────────────────────────────────────────── -->
    <!-- 3. 预加载关键资源 -->
    <!-- ───────────────────────────────────────────────────────────────────────────── -->
    <link rel="preload" href="critical-font.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="hero-image.webp" as="image">
    
    <!-- ───────────────────────────────────────────────────────────────────────────── -->
    <!-- 4. 延迟加载非关键脚本 -->
    <!-- ───────────────────────────────────────────────────────────────────────────── -->
    <script defer src="app.js"></script>
    
    <!-- 第三方脚本使用 async -->
    <script async src="https://www.googletagmanager.com/gtag/js"></script>
</head>
<body>
    <!-- 首屏内容直接渲染 -->
    <header class="header">...</header>
    <main class="main">...</main>
    
    <!-- 非首屏图片懒加载 -->
    <img src="placeholder.jpg" data-src="below-fold.jpg" loading="lazy" alt="...">
    
    <!-- 非关键脚本延迟加载 -->
    <script>
        // 延迟加载非关键功能
        window.addEventListener('load', () => {
            // 动态导入
            import('./non-critical-module.js');
        });
    </script>
</body>
</html>
```

---

## 2. 代码分割与懒加载

### 2.1 代码分割概念

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  代码分割（Code Splitting）                                                            │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  传统打包方式：                                                                        │
│  ┌───────────────────────────────────────────────────────────────────┐               │
│  │                        main.js (2MB)                              │               │
│  │  [首页代码] [商品页代码] [用户页代码] [设置页代码] [其他...]         │               │
│  └───────────────────────────────────────────────────────────────────┘               │
│  问题：首屏需下载全部代码，加载慢                                                       │
│                                                                                       │
│  代码分割后：                                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │  main.js    │  │  home.js    │  │  product.js │  │  user.js    │                 │
│  │  (100KB)    │  │  (50KB)     │  │  (80KB)     │  │  (60KB)     │                 │
│  │  路由+公共   │  │  首页代码    │  │  商品页代码  │  │  用户页代码  │                 │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘                 │
│  优势：首屏只下载必要代码，按需加载                                                     │
│                                                                                       │
├───────────────────────────────────────────────────────────────────────────────────────┤
│  分割策略                                                                              │
│  • 路由分割：按页面路由分割                                                            │
│  • 组件分割：按功能组件分割                                                            │
│  • 第三方库分割：将 node_modules 单独打包                                              │
│  • 动态分割：运行时按需加载                                                            │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 路由懒加载

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// Vue Router 路由懒加载
// ────────────────────────────────────────────────────────────────────────────────────

import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Home',
            // 动态导入，webpack 会自动代码分割
            component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue')
        },
        {
            path: '/products',
            name: 'Products',
            component: () => import(/* webpackChunkName: "products" */ '@/views/Products.vue'),
            // 预加载策略：鼠标悬停时预加载
            meta: { preload: true }
        },
        {
            path: '/product/:id',
            name: 'ProductDetail',
            // 分组打包：相关路由打包在一起
            component: () => import(/* webpackChunkName: "product-group" */ '@/views/ProductDetail.vue')
        },
        {
            path: '/user',
            name: 'User',
            component: () => import(/* webpackChunkName: "user" */ '@/views/User.vue'),
            children: [
                {
                    path: 'profile',
                    component: () => import(/* webpackChunkName: "user" */ '@/views/user/Profile.vue')
                },
                {
                    path: 'orders',
                    component: () => import(/* webpackChunkName: "user" */ '@/views/user/Orders.vue')
                }
            ]
        },
        {
            path: '/admin',
            name: 'Admin',
            // 延迟加载非必要模块
            component: () => import(/* webpackChunkName: "admin" */ '@/views/Admin.vue')
        }
    ]
});

// 路由预加载
router.beforeEach((to, from, next) => {
    if (to.meta.preload) {
        // 鼠标悬停预加载已在全局处理
    }
    next();
});

export default router;

// ────────────────────────────────────────────────────────────────────────────────────
// React Router 路由懒加载
// ────────────────────────────────────────────────────────────────────────────────────

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoadingSpinner from '@/components/LoadingSpinner';

// 懒加载组件
const Home = lazy(() => import(/* webpackChunkName: "home" */ '@/pages/Home'));
const Products = lazy(() => import(/* webpackChunkName: "products" */ '@/pages/Products'));
const ProductDetail = lazy(() => import(/* webpackChunkName: "product-group" */ '@/pages/ProductDetail'));
const User = lazy(() => import(/* webpackChunkName: "user" */ '@/pages/User'));
const Admin = lazy(() => import(/* webpackChunkName: "admin" */ '@/pages/Admin'));

function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/user/*" element={<User />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

// ────────────────────────────────────────────────────────────────────────────────────
// 预加载策略组件
// ────────────────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect } from 'react';

function usePrefetch() {
    // 鼠标悬停预加载
    const prefetchOnHover = useCallback((path) => {
        const component = lazy(() => import(`@/pages/${path}`));
        // 触发组件加载
        component._payload._result.then(() => {
            console.log(`Prefetched: ${path}`);
        });
    }, []);
    
    return { prefetchOnHover };
}

// 预加载链接组件
function PrefetchLink({ to, children, ...props }) {
    const handleMouseEnter = () => {
        // 悬停时预加载目标路由
        const componentName = to.slice(1).charAt(0).toUpperCase() + to.slice(2);
        import(`@/pages/${componentName}`);
    };
    
    return (
        <Link to={to} onMouseEnter={handleMouseEnter} {...props}>
            {children}
        </Link>
    );
}
```

### 2.3 组件懒加载

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// Vue 组件懒加载
// ────────────────────────────────────────────────────────────────────────────────────

import { defineAsyncComponent, ref, onMounted } from 'vue';

// 基本异步组件
const AsyncComponent = defineAsyncComponent(() =>
    import('@/components/HeavyComponent.vue')
);

// 带选项的异步组件
const AsyncComponentWithOptions = defineAsyncComponent({
    loader: () => import('@/components/HeavyComponent.vue'),
    loadingComponent: LoadingSpinner,       // 加载中显示的组件
    errorComponent: ErrorComponent,         // 加载失败显示的组件
    delay: 200,                             // 延迟显示 loading，避免闪烁
    timeout: 10000,                         // 超时时间
    onError: (error, retry, fail, attempts) => {
        if (attempts <= 3) {
            retry(); // 重试
        } else {
            fail();
        }
    }
});

// 条件加载
export default {
    components: {
        // 只在需要时加载
        Chart: defineAsyncComponent(() => {
            if (process.client) {
                return import('@/components/Chart.vue');
            }
            return Promise.resolve({ default: () => null });
        })
    }
};

// ────────────────────────────────────────────────────────────────────────────────────
// React 组件懒加载
// ────────────────────────────────────────────────────────────────────────────────────

import { lazy, Suspense, useState, useEffect } from 'react';

// 基本懒加载
const Chart = lazy(() => import('@/components/Chart'));

// 条件加载
function Dashboard() {
    const [showChart, setShowChart] = useState(false);
    
    return (
        <div>
            <button onClick={() => setShowChart(true)}>
                显示图表
            </button>
            
            {showChart && (
                <Suspense fallback={<div>加载中...</div>}>
                    <Chart />
                </Suspense>
            )}
        </div>
    );
}

// 视口内懒加载
function LazyLoadOnVisible({ component: Component, height = 300, ...props }) {
    const [shouldLoad, setShouldLoad] = useState(false);
    const ref = useRef(null);
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldLoad(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '100px' } // 提前 100px 开始加载
        );
        
        if (ref.current) {
            observer.observe(ref.current);
        }
        
        return () => observer.disconnect();
    }, []);
    
    const LazyComponent = useMemo(
        () => shouldLoad ? lazy(() => import(`@/components/${Component}`)) : null,
        [shouldLoad, Component]
    );
    
    return (
        <div ref={ref} style={{ minHeight: height }}>
            {shouldLoad && (
                <Suspense fallback={<Skeleton height={height} />}>
                    <LazyComponent {...props} />
                </Suspense>
            )}
        </div>
    );
}

// 使用示例
function App() {
    return (
        <div>
            <Header />
            <main>
                <Content />
                {/* 只有滚动到此处才加载 */}
                <LazyLoadOnVisible component="Chart" height={400} />
                <LazyLoadOnVisible component="Comments" height={300} />
            </main>
            <Footer />
        </div>
    );
}
```

### 2.4 动态导入与条件加载

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 动态导入工具函数
// ────────────────────────────────────────────────────────────────────────────────────

// 带缓存的动态导入
const moduleCache = new Map();

async function dynamicImport(modulePath, options = {}) {
    const { reload = false, timeout = 30000 } = options;
    
    // 检查缓存
    if (!reload && moduleCache.has(modulePath)) {
        return moduleCache.get(modulePath);
    }
    
    // 带超时的导入
    const modulePromise = Promise.race([
        import(modulePath),
        new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Import timeout')), timeout)
        )
    ]);
    
    try {
        const module = await modulePromise;
        moduleCache.set(modulePath, module);
        return module;
    } catch (error) {
        console.error(`Failed to load module: ${modulePath}`, error);
        throw error;
    }
}

// ────────────────────────────────────────────────────────────────────────────────────
// 按条件加载模块
// ────────────────────────────────────────────────────────────────────────────────────

// 根据功能检测加载
async function loadPolyfills() {
    const polyfills = [];
    
    // 检测并按需加载 polyfill
    if (!window.IntersectionObserver) {
        polyfills.push(import('intersection-observer'));
    }
    
    if (!window.ResizeObserver) {
        polyfills.push(import('resize-observer-polyfill'));
    }
    
    if (!CSS.supports('gap', '1px')) {
        polyfills.push(import('css-gap-polyfill'));
    }
    
    await Promise.all(polyfills);
}

// 根据设备能力加载
async function loadOptimizedAssets() {
    const isSlowConnection = navigator.connection?.effectiveType === 'slow-2g' ||
                             navigator.connection?.effectiveType === '2g';
    const isLowEndDevice = navigator.hardwareConcurrency <= 2 || 
                           navigator.deviceMemory <= 2;
    
    if (isSlowConnection || isLowEndDevice) {
        return import('@/assets/low-res');
    }
    
    // 检测 WebP 支持
    const supportsWebP = await checkWebPSupport();
    if (supportsWebP) {
        return import('@/assets/webp');
    }
    
    return import('@/assets/standard');
}

async function checkWebPSupport() {
    if (!self.createImageBitmap) return false;
    
    const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
    const blob = await fetch(webpData).then(r => r.blob());
    
    return createImageBitmap(blob).then(() => true, () => false);
}

// 根据用户权限加载
async function loadModuleByPermission(permission) {
    const moduleMap = {
        admin: () => import('@/modules/admin'),
        editor: () => import('@/modules/editor'),
        viewer: () => import('@/modules/viewer')
    };
    
    const loader = moduleMap[permission];
    if (!loader) {
        throw new Error(`Unknown permission: ${permission}`);
    }
    
    return loader();
}

// ────────────────────────────────────────────────────────────────────────────────────
// 智能预加载
// ────────────────────────────────────────────────────────────────────────────────────

class SmartPrefetcher {
    constructor() {
        this.prefetched = new Set();
        this.observer = null;
    }
    
    // 初始化
    init() {
        // 监听链接悬停
        this.observeLinks();
        
        // 监听视口内链接
        this.observeVisibleLinks();
        
        // 空闲时预加载
        this.prefetchOnIdle();
    }
    
    // 鼠标悬停预加载
    observeLinks() {
        document.addEventListener('mouseover', (e) => {
            const link = e.target.closest('a[href]');
            if (link && !this.prefetched.has(link.href)) {
                this.prefetch(link.href);
            }
        }, { passive: true });
    }
    
    // 视口内链接预加载
    observeVisibleLinks() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const link = entry.target;
                    if (!this.prefetched.has(link.href)) {
                        this.prefetch(link.href);
                    }
                }
            });
        }, { rootMargin: '50px' });
        
        document.querySelectorAll('a[href]').forEach(link => {
            this.observer.observe(link);
        });
    }
    
    // 空闲时预加载
    prefetchOnIdle() {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                // 预加载可能的下一页
                const likelyPages = this.predictNextPages();
                likelyPages.forEach(page => this.prefetch(page));
            });
        }
    }
    
    // 预加载资源
    prefetch(url) {
        if (this.prefetched.has(url)) return;
        
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
        
        this.prefetched.add(url);
    }
    
    // 预测下一页（基于当前路径）
    predictNextPages() {
        const predictions = [];
        const currentPath = window.location.pathname;
        
        // 简单规则：产品页预加载详情页
        if (currentPath === '/products') {
            predictions.push('/products/featured');
        }
        
        // 列表页预加载下一页
        if (document.querySelector('[data-next-page]')) {
            predictions.push(document.querySelector('[data-next-page]').dataset.nextPage);
        }
        
        return predictions;
    }
}

// 使用
new SmartPrefetcher().init();
```

---

## 3. 图片懒加载

### 3.1 原生懒加载

```html
<!-- ───────────────────────────────────────────────────────────────────────────────── -->
<!-- 原生懒加载（推荐） -->
<!-- ───────────────────────────────────────────────────────────────────────────────── -->

<!-- 基本用法 -->
<img src="image.jpg" loading="lazy" alt="...">

<!-- 配合 srcset -->
<img 
    src="image-400.jpg"
    srcset="image-400.jpg 400w, image-800.jpg 800w, image-1200.jpg 1200w"
    sizes="(max-width: 600px) 400px, (max-width: 1000px) 800px, 1200px"
    loading="lazy"
    alt="..."
>

<!-- 使用 data-src 作为回退 -->
<img 
    src="placeholder.jpg" 
    data-src="image.jpg" 
    loading="lazy"
    alt="..."
>

<!-- picture 元素懒加载 -->
<picture>
    <source srcset="image.webp" type="image/webp">
    <source srcset="image.jpg" type="image/jpeg">
    <img src="image.jpg" loading="lazy" alt="...">
</picture>

<!-- 背景图片懒加载（CSS） -->
<div loading="lazy" style="background-image: url(image.jpg)">
    Content
</div>
```

### 3.2 Intersection Observer 实现懒加载

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 图片懒加载类
// ────────────────────────────────────────────────────────────────────────────────────

class LazyLoader {
    constructor(options = {}) {
        const {
            root = null,           // 观察的根元素
            rootMargin = '50px',   // 提前加载的距离
            threshold = 0,         // 可见比例阈值
            loadingClass = 'loading',
            loadedClass = 'loaded',
            errorClass = 'error'
        } = options;
        
        this.options = { root, rootMargin, threshold, loadingClass, loadedClass, errorClass };
        this.observer = null;
        this.init();
    }
    
    init() {
        // 检查浏览器支持
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                this.handleIntersection.bind(this),
                {
                    root: this.options.root,
                    rootMargin: this.options.rootMargin,
                    threshold: this.options.threshold
                }
            );
        } else {
            // 降级：直接加载所有图片
            this.loadAllImages();
        }
    }
    
    // 观察元素
    observe(elements) {
        if (this.observer) {
            elements.forEach(el => {
                if (el.tagName === 'IMG' || el.tagName === 'VIDEO' || el.tagName === 'IFRAME') {
                    this.observer.observe(el);
                }
            });
        } else {
            this.loadAllImages(elements);
        }
    }
    
    // 取消观察
    unobserve(element) {
        if (this.observer) {
            this.observer.unobserve(element);
        }
    }
    
    // 处理交叉
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadElement(entry.target);
                this.observer.unobserve(entry.target);
            }
        });
    }
    
    // 加载元素
    async loadElement(element) {
        element.classList.add(this.options.loadingClass);
        
        try {
            if (element.tagName === 'IMG') {
                await this.loadImage(element);
            } else if (element.tagName === 'VIDEO') {
                await this.loadVideo(element);
            } else if (element.tagName === 'IFRAME') {
                await this.loadIframe(element);
            } else if (element.dataset.bgImage) {
                await this.loadBackgroundImage(element);
            }
            
            element.classList.remove(this.options.loadingClass);
            element.classList.add(this.options.loadedClass);
            element.dispatchEvent(new CustomEvent('lazyloaded'));
        } catch (error) {
            element.classList.remove(this.options.loadingClass);
            element.classList.add(this.options.errorClass);
            element.dispatchEvent(new CustomEvent('lazyerror', { detail: error }));
        }
    }
    
    // 加载图片
    loadImage(img) {
        return new Promise((resolve, reject) => {
            const src = img.dataset.src || img.dataset.lazy;
            const srcset = img.dataset.srcset;
            
            if (!src) {
                resolve();
                return;
            }
            
            // 创建新图片预加载
            const tempImg = new Image();
            
            tempImg.onload = () => {
                img.src = src;
                if (srcset) img.srcset = srcset;
                resolve();
            };
            
            tempImg.onerror = reject;
            tempImg.src = src;
        });
    }
    
    // 加载视频
    loadVideo(video) {
        return new Promise((resolve) => {
            const sources = video.querySelectorAll('source[data-src]');
            
            sources.forEach(source => {
                source.src = source.dataset.src;
            });
            
            video.load();
            video.onloadeddata = resolve;
        });
    }
    
    // 加载 iframe
    loadIframe(iframe) {
        return new Promise((resolve) => {
            if (iframe.dataset.src) {
                iframe.src = iframe.dataset.src;
            }
            iframe.onload = resolve;
            resolve(); // iframe 可能不触发 load
        });
    }
    
    // 加载背景图片
    loadBackgroundImage(element) {
        return new Promise((resolve, reject) => {
            const src = element.dataset.bgImage;
            const img = new Image();
            
            img.onload = () => {
                element.style.backgroundImage = `url(${src})`;
                resolve();
            };
            
            img.onerror = reject;
            img.src = src;
        });
    }
    
    // 加载所有图片（降级方案）
    loadAllImages(elements = document.querySelectorAll('[data-src], [loading="lazy"]')) {
        elements.forEach(el => this.loadElement(el));
    }
    
    // 销毁
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// ────────────────────────────────────────────────────────────────────────────────────
// Vue 指令
// ────────────────────────────────────────────────────────────────────────────────────

const vLazy = {
    mounted(el, binding) {
        const lazyLoader = new LazyLoader({ rootMargin: '100px' });
        
        if (el.tagName === 'IMG') {
            el.dataset.src = binding.value;
            el.src = binding.arg || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        } else {
            el.dataset.bgImage = binding.value;
        }
        
        lazyLoader.observe([el]);
    }
};

// 使用
// <img v-lazy="imageSrc" />
// <img v-lazy:placeholder="imageSrc" />
// <div v-lazy="imageSrc" class="bg-image"></div>

// ────────────────────────────────────────────────────────────────────────────────────
// React Hook
// ────────────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react';

function useLazyImage(src, placeholder = null) {
    const ref = useRef(null);
    const [imageSrc, setImageSrc] = useState(placeholder);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);
    
    useEffect(() => {
        if (!src) return;
        
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    const img = new Image();
                    img.src = src;
                    
                    img.onload = () => {
                        setImageSrc(src);
                        setIsLoaded(true);
                    };
                    
                    img.onerror = () => {
                        setIsError(true);
                    };
                    
                    observer.disconnect();
                }
            },
            { rootMargin: '100px' }
        );
        
        if (ref.current) {
            observer.observe(ref.current);
        }
        
        return () => observer.disconnect();
    }, [src]);
    
    return { ref, imageSrc, isLoaded, isError };
}

// 使用
function LazyImage({ src, alt, placeholder, className }) {
    const { ref, imageSrc, isLoaded } = useLazyImage(src, placeholder);
    
    return (
        <img
            ref={ref}
            src={imageSrc}
            alt={alt}
            className={`${className} ${isLoaded ? 'loaded' : ''}`}
        />
    );
}
```

### 3.3 渐进式图片加载

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// LQIP (Low Quality Image Placeholder)
// ────────────────────────────────────────────────────────────────────────────────────

// 方案1：模糊缩略图
function ProgressiveImage({ src, thumb, alt }) {
    const [isLoaded, setIsLoaded] = useState(false);
    
    return (
        <div className="progressive-image">
            {/* 缩略图 */}
            <img
                src={thumb}
                alt={alt}
                className={`thumb ${isLoaded ? 'hidden' : ''}`}
            />
            {/* 原图 */}
            <img
                src={src}
                alt={alt}
                className={`full ${isLoaded ? 'visible' : ''}`}
                onLoad={() => setIsLoaded(true)}
            />
        </div>
    );
}

// CSS
/*
.progressive-image {
    position: relative;
    overflow: hidden;
}

.progressive-image img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 0.3s ease;
}

.progressive-image .thumb {
    filter: blur(20px);
    transform: scale(1.1);
}

.progressive-image .full {
    opacity: 0;
}

.progressive-image .full.visible {
    opacity: 1;
}

.progressive-image .thumb.hidden {
    opacity: 0;
}
*/

// 方案2：SQIP (SVG-based Quality Image Placeholder)
function SQIPImage({ src, sqip, alt }) {
    const [isLoaded, setIsLoaded] = useState(false);
    
    return (
        <div className="sqip-image">
            {/* SVG 占位符 */}
            <div 
                className={`sqip-placeholder ${isLoaded ? 'hidden' : ''}`}
                dangerouslySetInnerHTML={{ __html: sqip }}
            />
            {/* 原图 */}
            <img
                src={src}
                alt={alt}
                className={`full ${isLoaded ? 'visible' : ''}`}
                onLoad={() => setIsLoaded(true)}
            />
        </div>
    );
}

// 方案3：BlurHash
import { decode } from 'blurhash';

function BlurHashImage({ src, hash, alt, width, height }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const canvasRef = useRef(null);
    
    useEffect(() => {
        if (!hash || !canvasRef.current) return;
        
        const pixels = decode(hash, width, height);
        const ctx = canvasRef.current.getContext('2d');
        const imageData = ctx.createImageData(width, height);
        imageData.data.set(pixels);
        ctx.putImageData(imageData, 0, 0);
    }, [hash, width, height]);
    
    return (
        <div className="blurhash-image">
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className={`blurhash ${isLoaded ? 'hidden' : ''}`}
            />
            <img
                src={src}
                alt={alt}
                className={`full ${isLoaded ? 'visible' : ''}`}
                onLoad={() => setIsLoaded(true)}
            />
        </div>
    );
}
```

---

## 4. 预加载策略

### 4.1 资源预加载类型

```html
<!-- ───────────────────────────────────────────────────────────────────────────────── -->
<!-- 预加载类型详解 -->
<!-- ───────────────────────────────────────────────────────────────────────────────── -->

<!-- preload: 预加载当前页面需要的资源 -->
<link rel="preload" href="critical.js" as="script">
<link rel="preload" href="critical.css" as="style">
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="hero.webp" as="image">
<link rel="preload" href="data.json" as="fetch" crossorigin>

<!-- prefetch: 预获取下一页面可能需要的资源 -->
<link rel="prefetch" href="next-page.js">
<link rel="prefetch" href="next-page.html">

<!-- preconnect: 提前建立连接 -->
<link rel="preconnect" href="https://cdn.example.com">
<link rel="preconnect" href="https://api.example.com" crossorigin>

<!-- dns-prefetch: 仅 DNS 解析 -->
<link rel="dns-prefetch" href="https://static.example.com">

<!-- modulepreload: 预加载 ES Module -->
<link rel="modulepreload" href="module.js">

<!-- ───────────────────────────────────────────────────────────────────────────────── -->
<!-- 预加载优先级 -->
<!-- ───────────────────────────────────────────────────────────────────────────────── -->

<!--
┌──────────────────┬─────────────────────┬─────────────────────────────────────────────┐
│  资源类型         │  默认优先级          │  预加载后优先级                              │
├──────────────────┼─────────────────────┼─────────────────────────────────────────────┤
│  HTML            │  Highest            │  -                                          │
│  CSS             │  Highest            │  Highest                                    │
│  Font            │  High               │  Highest                                    │
│  Script (head)   │  High               │  High                                       │
│  Script (body)   │  Medium             │  High                                       │
│  Image           │  Low                │  Medium                                     │
│  Fetch/XHR       │  High               │  High                                       │
└──────────────────┴─────────────────────┴─────────────────────────────────────────────┘

注意事项：
• preload 会让资源提前被发现并加载
• 预加载不保证资源一定会被使用，只是提示浏览器
• 过度预加载会浪费带宽，需要权衡
• preload 需要设置正确的 as 属性
• 字体预加载必须设置 crossorigin 属性
-->
```

### 4.2 智能预加载实现

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 预加载管理器
// ────────────────────────────────────────────────────────────────────────────────────

class PreloadManager {
    constructor(options = {}) {
        this.prefetched = new Set();
        this.maxConcurrent = options.maxConcurrent || 3;
        this.queue = [];
        this.loading = 0;
    }
    
    // 预连接
    preconnect(urls) {
        urls.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = url;
            document.head.appendChild(link);
        });
    }
    
    // DNS 预解析
    dnsPrefetch(urls) {
        urls.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = url;
            document.head.appendChild(link);
        });
    }
    
    // 预加载资源
    preload(url, options = {}) {
        if (this.prefetched.has(url)) return;
        
        const { as = 'fetch', type, crossorigin } = options;
        
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = url;
        link.as = as;
        if (type) link.type = type;
        if (crossorigin) link.crossOrigin = crossorigin;
        
        document.head.appendChild(link);
        this.prefetched.add(url);
    }
    
    // 预获取资源
    prefetch(url) {
        if (this.prefetched.has(url)) return;
        
        // 检查队列限制
        if (this.loading >= this.maxConcurrent) {
            this.queue.push(url);
            return;
        }
        
        this.loading++;
        this.prefetched.add(url);
        
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        
        link.onload = () => {
            this.loading--;
            this.processQueue();
        };
        
        link.onerror = () => {
            this.loading--;
            this.prefetched.delete(url);
            this.processQueue();
        };
        
        document.head.appendChild(link);
    }
    
    // 处理队列
    processQueue() {
        while (this.queue.length > 0 && this.loading < this.maxConcurrent) {
            const url = this.queue.shift();
            this.prefetch(url);
        }
    }
    
    // 预加载字体
    preloadFont(fontUrl) {
        this.preload(fontUrl, { as: 'font', type: 'font/woff2', crossorigin: 'anonymous' });
    }
    
    // 预加载关键资源
    preloadCritical(resources) {
        resources.forEach(({ url, as, type, crossorigin }) => {
            this.preload(url, { as, type, crossorigin });
        });
    }
}

// ────────────────────────────────────────────────────────────────────────────────────
// 基于用户行为的预加载
// ────────────────────────────────────────────────────────────────────────────────────

class BehaviorBasedPrefetch {
    constructor(options = {}) {
        this.preloadManager = new PreloadManager();
        this.hoverDelay = options.hoverDelay || 100; // 悬停延迟
        this.hoverTimers = new Map();
        this.clickHistory = [];
        this.init();
    }
    
    init() {
        // 监听链接悬停
        document.addEventListener('mouseenter', this.handleMouseEnter.bind(this), true);
        document.addEventListener('mouseleave', this.handleMouseLeave.bind(this), true);
        
        // 监听触摸开始
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), true);
        
        // 监听点击（记录历史）
        document.addEventListener('click', this.handleClick.bind(this), true);
        
        // 分析历史并预加载
        this.analyzeAndPrefetch();
    }
    
    handleMouseEnter(e) {
        const link = e.target.closest('a[href]');
        if (!link || link.origin !== location.origin) return;
        
        // 延迟预加载，避免误触
        const timer = setTimeout(() => {
            this.prefetchPage(link.href);
        }, this.hoverDelay);
        
        this.hoverTimers.set(link, timer);
    }
    
    handleMouseLeave(e) {
        const link = e.target.closest('a[href]');
        if (!link) return;
        
        const timer = this.hoverTimers.get(link);
        if (timer) {
            clearTimeout(timer);
            this.hoverTimers.delete(link);
        }
    }
    
    handleTouchStart(e) {
        const link = e.target.closest('a[href]');
        if (!link || link.origin !== location.origin) return;
        
        this.prefetchPage(link.href);
    }
    
    handleClick(e) {
        const link = e.target.closest('a[href]');
        if (!link || link.origin !== location.origin) return;
        
        this.clickHistory.push({
            path: link.pathname,
            timestamp: Date.now()
        });
        
        // 保持最近 50 条记录
        if (this.clickHistory.length > 50) {
            this.clickHistory.shift();
        }
        
        // 保存到本地存储
        this.saveHistory();
    }
    
    // 分析历史并预加载
    analyzeAndPrefetch() {
        const history = this.loadHistory();
        const currentPath = location.pathname;
        
        // 分析当前页面的常见下一页
        const nextPages = this.predictNextPages(history, currentPath);
        
        // 空闲时预加载
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                nextPages.forEach(page => this.prefetchPage(page));
            });
        }
    }
    
    // 预测下一页
    predictNextPages(history, currentPath) {
        const transitions = {};
        
        // 统计转换模式
        history.forEach((item, index) => {
            if (index > 0 && history[index - 1].path === currentPath) {
                const next = item.path;
                transitions[next] = (transitions[next] || 0) + 1;
            }
        });
        
        // 排序并取前 3 个
        return Object.entries(transitions)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([path]) => path);
    }
    
    // 预加载页面
    prefetchPage(url) {
        // 预加载 HTML
        this.preloadManager.prefetch(url);
        
        // 如果是 SPA，预加载对应的 JS chunk
        const route = this.getRouteFromUrl(url);
        if (route) {
            const chunkUrl = this.getChunkUrl(route);
            if (chunkUrl) {
                this.preloadManager.prefetch(chunkUrl);
            }
        }
    }
    
    saveHistory() {
        try {
            sessionStorage.setItem('clickHistory', JSON.stringify(this.clickHistory));
        } catch (e) {}
    }
    
    loadHistory() {
        try {
            return JSON.parse(sessionStorage.getItem('clickHistory')) || [];
        } catch (e) {
            return [];
        }
    }
    
    // 子类实现
    getRouteFromUrl(url) { return null; }
    getChunkUrl(route) { return null; }
}

// 使用
new BehaviorBasedPrefetch();
```

### 4.3 空闲时加载

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// 空闲时加载策略
// ────────────────────────────────────────────────────────────────────────────────────

class IdleLoader {
    constructor() {
        this.queue = [];
        this.isProcessing = false;
    }
    
    // 添加任务
    add(callback, options = {}) {
        const { priority = 'low', timeout = 2000 } = options;
        
        this.queue.push({ callback, priority, timeout });
        
        if (!this.isProcessing) {
            this.processQueue();
        }
    }
    
    // 处理队列
    processQueue() {
        if (this.queue.length === 0) {
            this.isProcessing = false;
            return;
        }
        
        this.isProcessing = true;
        
        // 按优先级排序
        this.queue.sort((a, b) => {
            const priorities = { high: 0, medium: 1, low: 2 };
            return priorities[a.priority] - priorities[b.priority];
        });
        
        const task = this.queue.shift();
        
        if ('requestIdleCallback' in window) {
            requestIdleCallback(
                (deadline) => {
                    // 在空闲时间内执行
                    if (deadline.timeRemaining() > 0 || deadline.didTimeout) {
                        task.callback();
                    } else {
                        // 时间不够，重新排队
                        this.queue.unshift(task);
                    }
                    this.processQueue();
                },
                { timeout: task.timeout }
            );
        } else {
            // 降级：使用 setTimeout
            setTimeout(() => {
                task.callback();
                this.processQueue();
            }, 1);
        }
    }
}

// 使用示例
const idleLoader = new IdleLoader();

// 添加非关键任务
idleLoader.add(() => {
    // 加载非关键模块
    import('./non-critical-module.js');
}, { priority: 'low' });

idleLoader.add(() => {
    // 发送分析数据
    navigator.sendBeacon('/analytics', data);
}, { priority: 'low' });

idleLoader.add(() => {
    // 预加载下一页
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = '/next-page';
    document.head.appendChild(link);
}, { priority: 'low' });
```

---

## 5. Service Worker 缓存策略

### 5.1 缓存策略详解

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// Service Worker 缓存策略
// ────────────────────────────────────────────────────────────────────────────────────

/*
┌────────────────────────────┬─────────────────────────┬──────────────────────────────┐
│  策略                       │  说明                    │  适用场景                    │
├────────────────────────────┼─────────────────────────┼──────────────────────────────┤
│  Cache First               │  优先缓存，失败则网络    │  静态资源、不常更新的内容    │
│  Network First             │  优先网络，失败则缓存    │  频繁更新的内容、API 请求    │
│  Stale While Revalidate    │  返回缓存，后台更新      │  允许短暂过期的内容          │
│  Network Only              │  只使用网络              │  实时数据、敏感操作          │
│  Cache Only                │  只使用缓存              │  离线优先的静态内容          │
└────────────────────────────┴─────────────────────────┴──────────────────────────────┘
*/

// 注册 Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('SW registered:', registration.scope);
        } catch (error) {
            console.error('SW registration failed:', error);
        }
    });
}

// sw.js - Service Worker 实现
const CACHE_VERSION = 'v1';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;

// 静态资源列表
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles/main.css',
    '/scripts/app.js',
    '/images/logo.svg'
];

// 安装事件 - 缓存静态资源
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(name => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
                        .map(name => caches.delete(name))
                );
            })
            .then(() => self.clients.claim())
    );
});

// 请求拦截
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // API 请求 - Network First
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(networkFirst(request));
        return;
    }
    
    // 静态资源 - Cache First
    if (isStaticAsset(url.pathname)) {
        event.respondWith(cacheFirst(request));
        return;
    }
    
    // HTML 页面 - Stale While Revalidate
    if (request.headers.get('accept')?.includes('text/html')) {
        event.respondWith(staleWhileRevalidate(request));
        return;
    }
    
    // 其他 - Stale While Revalidate
    event.respondWith(staleWhileRevalidate(request));
});

// 判断是否为静态资源
function isStaticAsset(pathname) {
    return /\.(css|js|png|jpg|jpeg|gif|svg|webp|woff2?)$/.test(pathname);
}

// Cache First 策略
async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) return cached;
    
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        return caches.match('/offline.html');
    }
}

// Network First 策略
async function networkFirst(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    
    try {
        const response = await fetch(request);
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        const cached = await cache.match(request);
        return cached || new Response('Network error', { status: 503 });
    }
}

// Stale While Revalidate 策略
async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cached = await cache.match(request);
    
    // 后台更新
    const fetchPromise = fetch(request).then(response => {
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    }).catch(() => cached);
    
    // 返回缓存或等待网络
    return cached || fetchPromise;
}
```

### 5.2 预缓存策略

```javascript
// ────────────────────────────────────────────────────────────────────────────────────
// Workbox 风格的预缓存
// ────────────────────────────────────────────────────────────────────────────────────

// 预缓存清单（构建时生成）
const PRECACHE_MANIFEST = {
    'v1': [
        { url: '/', revision: 'abc123' },
        { url: '/styles/main.css', revision: 'def456' },
        { url: '/scripts/app.js', revision: 'ghi789' }
    ]
};

class PrecacheManager {
    constructor() {
        this.cacheName = 'precache-v1';
    }
    
    // 预缓存资源
    async precache(manifest) {
        const cache = await caches.open(this.cacheName);
        
        const promises = manifest.map(async entry => {
            const cacheKey = this.getCacheKey(entry);
            const cached = await cache.match(cacheKey);
            
            // 检查是否需要更新
            if (!cached || await this.needsUpdate(entry, cached)) {
                const response = await fetch(entry.url);
                if (response.ok) {
                    await cache.put(cacheKey, response);
                }
            }
        });
        
        await Promise.all(promises);
    }
    
    // 获取缓存键
    getCacheKey(entry) {
        return entry.revision ? `${entry.url}?rev=${entry.revision}` : entry.url;
    }
    
    // 检查是否需要更新
    async needsUpdate(entry, cached) {
        // 简单实现：检查 revision
        return true;
    }
    
    // 清理过期的缓存
    async cleanup() {
        const cacheNames = await caches.keys();
        const validNames = [this.cacheName];
        
        await Promise.all(
            cacheNames
                .filter(name => !validNames.includes(name))
                .map(name => caches.delete(name))
        );
    }
}
```

---

## 6. 加载优化检查清单

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  加载优化检查清单                                                                      │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  关键渲染路径                                                                          │
│  □ 关键 CSS 内联到 <head>                                                             │
│  □ 非关键 CSS 异步加载                                                                │
│  □ JavaScript 使用 defer/async                                                       │
│  □ 减少/消除渲染阻塞资源                                                              │
│                                                                                       │
│  代码分割                                                                              │
│  □ 路由级别代码分割                                                                   │
│  □ 第三方库单独打包（vendor chunk）                                                   │
│  □ 大型组件懒加载                                                                     │
│  □ 使用动态 import() 按需加载                                                         │
│                                                                                       │
│  图片优化                                                                              │
│  □ 使用 WebP/AVIF 格式                                                               │
│  □ 图片懒加载（loading="lazy" 或 Intersection Observer）                              │
│  □ 使用渐进式图片加载                                                                 │
│  □ 响应式图片（srcset/sizes）                                                         │
│  □ 图片 CDN 压缩                                                                      │
│                                                                                       │
│  预加载策略                                                                            │
│  □ 预连接关键域名（preconnect）                                                       │
│  □ 预加载关键资源（preload）                                                          │
│  □ 预获取下一页资源（prefetch）                                                       │
│  □ 关键字体预加载                                                                     │
│  □ 基于用户行为的智能预加载                                                           │
│                                                                                       │
│  缓存策略                                                                              │
│  □ 配置合适的 Cache-Control                                                           │
│  □ 使用 Service Worker 缓存                                                           │
│  □ CDN 缓存静态资源                                                                   │
│  □ 版本化资源文件名                                                                   │
│                                                                                       │
│  压缩优化                                                                              │
│  □ 启用 Gzip/Brotli 压缩                                                              │
│  □ 代码压缩（Terser/cssnano）                                                         │
│  □ 图片压缩优化                                                                       │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

[返回上级目录](../index.md)
