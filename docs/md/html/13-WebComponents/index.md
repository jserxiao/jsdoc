# 十三、Web Components

> Web Components 是一套用于创建可复用自定义元素的 Web 技术，它允许开发者封装 HTML、CSS 和 JavaScript，创建功能独立、样式隔离的组件。

## 学习要点

- 🧩 理解 Web Components 的三大核心技术
- 🔒 掌握 Shadow DOM 的样式隔离原理
- 🎨 学会使用 template 和 slot 实现灵活模板
- 🚀 能够开发可复用的自定义组件

---

## 1. Web Components 概述

### 什么是 Web Components？

Web Components 是一套 **浏览器原生支持** 的组件化技术，由三个主要技术组成：

```
Web Components 技术栈
├── Custom Elements（自定义元素）
│   └── 创建自定义 HTML 标签
├── Shadow DOM（影子 DOM）
│   └── 封装样式和结构，实现隔离
└── HTML Templates（HTML 模板）
    ├── <template> - 模板元素
    └── <slot> - 插槽元素
```

### 为什么使用 Web Components？

| 优势 | 说明 |
|------|------|
| **原生支持** | 无需框架，浏览器直接支持 |
| **样式隔离** | Shadow DOM 确保样式不泄漏 |
| **可复用性** | 一次编写，到处使用 |
| **互操作性** | 可与任何框架配合使用 |
| **封装性** | 内部实现对外不可见 |

### 浏览器支持

```
Custom Elements v1:    ████████████████████░ 98%
Shadow DOM v1:         ████████████████████░ 97%
HTML Templates:         ████████████████████░ 97%

注：支持所有现代浏览器，IE 需要polyfill
```

---

## 2. Custom Elements（自定义元素）

### 2.1 基础概念

Custom Elements 允许开发者定义自己的 HTML 元素。

```javascript
// 生命周期回调
class MyElement extends HTMLElement {
    constructor() {
        super();  // 必须首先调用
        // 元素创建时执行（提升时可能多次调用）
    }

    // 元素插入 DOM 时调用
    connectedCallback() {
        console.log('元素已连接到 DOM');
    }

    // 元素从 DOM 移除时调用
    disconnectedCallback() {
        console.log('元素已从 DOM 移除');
    }

    // 监听的属性变化时调用
    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`属性 ${name} 从 ${oldValue} 变为 ${newValue}`);
    }

    // 元素被移动到新文档时调用（很少用）
    adoptedCallback() {
        console.log('元素已移动到新文档');
    }

    // 声明需要监听的属性
    static get observedAttributes() {
        return ['name', 'value'];
    }
}

// 注册自定义元素
// 名称必须包含连字符，如 my-element, user-card
customElements.define('my-element', MyElement);
```

### 2.2 自定义元素的类型

```javascript
// 1. 自主自定义元素（Autonomous custom elements）
// 完全独立的元素，继承 HTMLElement
class MyButton extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = '<button>点击我</button>';
    }
}
customElements.define('my-button', MyButton);

// 使用：<my-button></my-button>

// 2. 自定义内置元素（Customized built-in elements）
// 继承特定 HTML 元素，保留原有功能
class MyParagraph extends HTMLParagraphElement {
    constructor() {
        super();
        this.style.color = 'blue';
    }
}
customElements.define('my-paragraph', MyParagraph, { extends: 'p' });

// 使用：<p is="my-paragraph">蓝色段落</p>
```

### 2.3 实战示例：用户卡片组件

```html
<script>
class UserCard extends HTMLElement {
    static get observedAttributes() {
        return ['name', 'avatar', 'role'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    render() {
        const name = this.getAttribute('name') || '匿名用户';
        const avatar = this.getAttribute('avatar') || 'https://via.placeholder.com/80';
        const role = this.getAttribute('role') || '用户';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: system-ui, sans-serif;
                }
                .card {
                    display: flex;
                    align-items: center;
                    padding: 16px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    background: white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .avatar {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    margin-right: 16px;
                }
                .info h3 {
                    margin: 0 0 4px;
                    font-size: 18px;
                }
                .info span {
                    color: #666;
                    font-size: 14px;
                }
            </style>
            <div class="card">
                <img class="avatar" src="${avatar}" alt="${name}">
                <div class="info">
                    <h3>${name}</h3>
                    <span>${role}</span>
                </div>
            </div>
        `;
    }
}

customElements.define('user-card', UserCard);
</script>

<!-- 使用组件 -->
<user-card 
    name="张三" 
    avatar="https://example.com/avatar.jpg" 
    role="前端工程师">
</user-card>
```

### 2.4 属性与属性反射

```javascript
class MyInput extends HTMLElement {
    // 属性反射：将 HTML 属性同步到 JavaScript 属性
    get value() {
        return this.getAttribute('value') || '';
    }
    
    set value(val) {
        this.setAttribute('value', val);
    }

    get disabled() {
        return this.hasAttribute('disabled');
    }
    
    set disabled(val) {
        if (val) {
            this.setAttribute('disabled', '');
        } else {
            this.removeAttribute('disabled');
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'value') {
            // 触发自定义事件
            this.dispatchEvent(new CustomEvent('change', {
                detail: { value: newValue },
                bubbles: true
            }));
        }
    }
}
```

---

## 3. Shadow DOM（影子 DOM）

### 3.1 核心概念

Shadow DOM 允许将隐藏的 DOM 树附加到元素上，实现样式和结构的封装。

```
文档结构
├── Light DOM（常规 DOM）
│   └── 用户可见的 DOM 树
└── Shadow DOM
    ├── Shadow Host（影子宿主）
    ├── Shadow Tree（影子树）
    └── Shadow Boundary（影子边界）- 样式隔离的分界线
```

### 3.2 创建 Shadow DOM

```javascript
class MyComponent extends HTMLElement {
    constructor() {
        super();
        
        // 创建 open 模式的 Shadow DOM
        // 外部可以通过 element.shadowRoot 访问
        this.attachShadow({ mode: 'open' });
        
        // 创建 closed 模式的 Shadow DOM
        // 外部无法访问，只能内部访问
        // this.attachShadow({ mode: 'closed' });
        
        this.shadowRoot.innerHTML = `
            <style>
                /* 这些样式不会影响外部 */
                p { color: red; }
            </style>
            <p>这是 Shadow DOM 内的内容</p>
        `;
    }
}
```

### 3.3 样式隔离原理

```html
<style>
    /* 外部样式 */
    p { color: blue; }
</style>

<p>外部段落（蓝色）</p>

<my-component></my-component>

<script>
class MyComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        // Shadow DOM 内的样式只影响内部
        this.shadowRoot.innerHTML = `
            <style>
                p { color: red; }
            </style>
            <p>内部段落（红色）</p>
        `;
    }
}
customElements.define('my-component', MyComponent);
</script>
```

### 3.4 Shadow DOM 特殊选择器

```css
/* :host - 选择影子宿主（组件本身） */
:host {
    display: block;
    padding: 10px;
}

/* :host() - 选择具有特定状态的宿主 */
:host([disabled]) {
    opacity: 0.5;
    pointer-events: none;
}

/* :host-context() - 根据祖先选择宿主 */
:host-context(.dark-theme) {
    background: #333;
    color: white;
}

/* ::slotted() - 选择通过插槽传入的内容 */
::slotted(h2) {
    color: blue;
}

/* :defined - 选择已注册的自定义元素 */
my-component:defined {
    /* 组件加载完成后的样式 */
}
```

### 3.5 穿透 Shadow DOM

```javascript
// 方法1：CSS 自定义属性（推荐）
// 外部定义
// :root { --custom-color: blue; }

// Shadow DOM 内部使用
this.shadowRoot.innerHTML = `
    <style>
        p { color: var(--custom-color, black); }
    </style>
    <p>可被外部控制的颜色</p>
`;

// 方法2：constructable stylesheets（构建样式表）
const sheet = new CSSStyleSheet();
sheet.replaceSync('p { color: green; }');
this.shadowRoot.adoptedStyleSheets = [sheet];

// 方法3：穿透选择器（不推荐）
// ::shadow /deep/ >>> 已被废弃
```

---

## 4. HTML Templates（HTML 模板）

### 4.1 template 元素

`<template>` 元素用于声明不会立即渲染的 HTML 片段。

```html
<!-- 模板内容不会显示 -->
<template id="card-template">
    <style>
        .card {
            border: 1px solid #ddd;
            padding: 16px;
            border-radius: 8px;
        }
        .title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 8px;
        }
    </style>
    <div class="card">
        <div class="title"><slot name="title"></slot></div>
        <div class="content"><slot></slot></div>
    </div>
</template>

<script>
class CardTemplate extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        // 克隆模板内容
        const template = document.getElementById('card-template');
        const content = template.content.cloneNode(true);
        
        this.shadowRoot.appendChild(content);
    }
}

customElements.define('card-template', CardTemplate);
</script>

<card-template>
    <h2 slot="title">卡片标题</h2>
    <p>这是卡片的内容部分</p>
</card-template>
```

### 4.2 slot 元素（插槽）

插槽允许将外部内容投射到组件内部。

```html
<script>
class MyCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        this.shadowRoot.innerHTML = `
            <style>
                .card { border: 1px solid #ccc; padding: 16px; }
                header { border-bottom: 1px solid #eee; padding-bottom: 8px; }
                footer { border-top: 1px solid #eee; padding-top: 8px; margin-top: 8px; }
            </style>
            <div class="card">
                <header>
                    <slot name="header">默认标题</slot>
                </header>
                <main>
                    <slot>默认内容</slot>
                </main>
                <footer>
                    <slot name="footer">默认页脚</slot>
                </footer>
            </div>
        `;
    }
}

customElements.define('my-card', MyCard);
</script>

<!-- 使用插槽 -->
<my-card>
    <h1 slot="header">文章标题</h1>
    <p>文章内容放在这里...</p>
    <span slot="footer">2024年1月1日</span>
</my-card>

<!-- 使用默认插槽 -->
<my-card></my-card>
```

### 4.3 插槽事件

```javascript
class SlotComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        this.shadowRoot.innerHTML = `
            <slot name="item"></slot>
        `;
        
        // 监听插槽内容变化
        this.shadowRoot.querySelector('slot').addEventListener('slotchange', (e) => {
            const nodes = e.target.assignedNodes();
            console.log('插槽内容已变化:', nodes);
        });
    }
    
    connectedCallback() {
        // 获取插槽中的元素
        const slot = this.shadowRoot.querySelector('slot');
        const assigned = slot.assignedElements();
        console.log('当前插槽元素:', assigned);
        
        // 获取所有插槽内容的扁平化版本
        const assignedFlat = slot.assignedElements({ flatten: true });
    }
}
```

---

## 5. 综合实战案例

### 5.1 可复用的模态框组件

```html
<script>
class ModalDialog extends HTMLElement {
    static get observedAttributes() {
        return ['open', 'title'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._previousFocus = null;
        this.render();
    }

    render() {
        const title = this.getAttribute('title') || '对话框';
        const isOpen = this.hasAttribute('open');

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: none;
                }
                :host([open]) {
                    display: flex;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    align-items: center;
                    justify-content: center;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 1000;
                }
                .modal {
                    background: white;
                    border-radius: 8px;
                    max-width: 500px;
                    width: 90%;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 20px;
                    border-bottom: 1px solid #eee;
                }
                .modal-header h2 {
                    margin: 0;
                    font-size: 18px;
                }
                .close-btn {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #999;
                }
                .close-btn:hover {
                    color: #333;
                }
                .modal-body {
                    padding: 20px;
                }
                .modal-footer {
                    padding: 16px 20px;
                    border-top: 1px solid #eee;
                    text-align: right;
                }
            </style>
            <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                <header class="modal-header">
                    <h2 id="modal-title">${title}</h2>
                    <button class="close-btn" aria-label="关闭">&times;</button>
                </header>
                <div class="modal-body">
                    <slot></slot>
                </div>
                <div class="modal-footer">
                    <slot name="footer">
                        <button class="cancel-btn">取消</button>
                        <button class="confirm-btn">确认</button>
                    </slot>
                </div>
            </div>
        `;

        // 绑定事件
        this.shadowRoot.querySelector('.close-btn').addEventListener('click', () => {
            this.close();
        });

        this.shadowRoot.querySelector('.modal').addEventListener('click', (e) => {
            e.stopPropagation();
        });

        this.addEventListener('click', () => {
            this.close();
        });
    }

    connectedCallback() {
        this._handleKeydown = this._handleKeydown.bind(this);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'open') {
            if (newValue !== null) {
                this._trapFocus();
            }
        }
    }

    open() {
        this.setAttribute('open', '');
        this._previousFocus = document.activeElement;
        this._trapFocus();
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.removeAttribute('open');
        document.body.style.overflow = '';
        if (this._previousFocus) {
            this._previousFocus.focus();
        }
        this.dispatchEvent(new CustomEvent('close'));
    }

    _trapFocus() {
        const modal = this.shadowRoot.querySelector('.modal');
        const focusable = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusable[0];
        const lastFocusable = focusable[focusable.length - 1];

        if (firstFocusable) {
            firstFocusable.focus();
        }

        this.shadowRoot.addEventListener('keydown', this._handleKeydown);
    }

    _handleKeydown(e) {
        if (e.key === 'Escape') {
            this.close();
        }
    }
}

customElements.define('modal-dialog', ModalDialog);
</script>

<!-- 使用模态框 -->
<button id="open-modal">打开对话框</button>

<modal-dialog id="my-modal" title="确认操作">
    <p>确定要删除这个项目吗？此操作无法撤销。</p>
    <div slot="footer">
        <button onclick="document.getElementById('my-modal').close()">取消</button>
        <button onclick="alert('已删除')">确认删除</button>
    </div>
</modal-dialog>

<script>
document.getElementById('open-modal').addEventListener('click', () => {
    document.getElementById('my-modal').open();
});
</script>
```

### 5.2 标签页组件

```html
<script>
class TabPanel extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this._setupKeyboardNav();
    }

    render() {
        // 收集所有 tab-panel 子元素
        const panels = Array.from(this.querySelectorAll('tab-pane'));
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                .tabs {
                    display: flex;
                    border-bottom: 2px solid #eee;
                }
                .tab {
                    padding: 12px 24px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 14px;
                    color: #666;
                    border-bottom: 2px solid transparent;
                    margin-bottom: -2px;
                }
                .tab:hover {
                    color: #333;
                }
                .tab.active {
                    color: #1890ff;
                    border-bottom-color: #1890ff;
                }
                .panel-container {
                    padding: 16px 0;
                }
                ::slotted(tab-pane) {
                    display: none;
                }
                ::slotted(tab-pane.active) {
                    display: block;
                }
            </style>
            <div class="tabs" role="tablist">
                ${panels.map((panel, i) => `
                    <button 
                        class="tab ${i === 0 ? 'active' : ''}" 
                        role="tab"
                        aria-selected="${i === 0}"
                        data-index="${i}">
                        ${panel.getAttribute('title') || `Tab ${i + 1}`}
                    </button>
                `).join('')}
            </div>
            <div class="panel-container">
                <slot></slot>
            </div>
        `;

        // 设置第一个面板为激活状态
        panels[0]?.classList.add('active');

        // 绑定标签点击事件
        this.shadowRoot.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.selectTab(parseInt(tab.dataset.index));
            });
        });
    }

    selectTab(index) {
        // 更新标签状态
        this.shadowRoot.querySelectorAll('.tab').forEach((tab, i) => {
            tab.classList.toggle('active', i === index);
            tab.setAttribute('aria-selected', i === index);
        });

        // 更新面板状态
        this.querySelectorAll('tab-pane').forEach((panel, i) => {
            panel.classList.toggle('active', i === index);
        });

        // 触发事件
        this.dispatchEvent(new CustomEvent('tab-change', {
            detail: { index },
            bubbles: true
        }));
    }

    _setupKeyboardNav() {
        const tabs = this.shadowRoot.querySelector('.tabs');
        tabs.addEventListener('keydown', (e) => {
            const currentTab = this.shadowRoot.querySelector('.tab.active');
            const currentIndex = parseInt(currentTab.dataset.index);
            const tabsArray = Array.from(this.shadowRoot.querySelectorAll('.tab'));
            
            let newIndex;
            if (e.key === 'ArrowRight') {
                newIndex = (currentIndex + 1) % tabsArray.length;
            } else if (e.key === 'ArrowLeft') {
                newIndex = (currentIndex - 1 + tabsArray.length) % tabsArray.length;
            } else if (e.key === 'Home') {
                newIndex = 0;
            } else if (e.key === 'End') {
                newIndex = tabsArray.length - 1;
            } else {
                return;
            }

            e.preventDefault();
            this.selectTab(newIndex);
            tabsArray[newIndex].focus();
        });
    }
}

class TabPane extends HTMLElement {
    constructor() {
        super();
    }
}

customElements.define('tab-panel', TabPanel);
customElements.define('tab-pane', TabPane);
</script>

<!-- 使用标签页 -->
<tab-panel>
    <tab-pane title="用户信息">
        <h3>用户信息</h3>
        <p>这里是用户信息内容...</p>
    </tab-pane>
    <tab-pane title="安全设置">
        <h3>安全设置</h3>
        <p>这里是安全设置内容...</p>
    </tab-pane>
    <tab-pane title="通知偏好">
        <h3>通知偏好</h3>
        <p>这里是通知偏好设置...</p>
    </tab-pane>
</tab-panel>
```

### 5.3 无限滚动列表组件

```html
<script>
class InfiniteList extends HTMLElement {
    static get observedAttributes() {
        return ['threshold'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._loading = false;
        this._observer = null;
    }

    connectedCallback() {
        this.render();
        this._setupObserver();
    }

    disconnectedCallback() {
        this._observer?.disconnect();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    height: 400px;
                    overflow-y: auto;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                }
                .list {
                    padding: 0;
                    margin: 0;
                    list-style: none;
                }
                ::slotted(li) {
                    padding: 12px 16px;
                    border-bottom: 1px solid #eee;
                }
                .loader {
                    text-align: center;
                    padding: 20px;
                    color: #666;
                }
                .loader.hidden {
                    display: none;
                }
            </style>
            <ul class="list">
                <slot></slot>
            </ul>
            <div class="loader hidden">
                <span>加载中...</span>
            </div>
        `;
    }

    _setupObserver() {
        const threshold = parseFloat(this.getAttribute('threshold')) || 100;
        const loader = this.shadowRoot.querySelector('.loader');

        this._observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !this._loading) {
                    this._loadMore();
                }
            },
            {
                root: this,
                rootMargin: `${threshold}px`
            }
        );

        this._observer.observe(loader);
    }

    async _loadMore() {
        this._loading = true;
        this.shadowRoot.querySelector('.loader').classList.remove('hidden');

        // 触发自定义事件，让外部提供数据
        const event = new CustomEvent('load-more', {
            detail: { page: this._getPage() + 1 }
        });
        this.dispatchEvent(event);
    }

    _getPage() {
        return parseInt(this.dataset.page || '0');
    }

    setPage(page) {
        this.dataset.page = page;
        this._loading = false;
        this.shadowRoot.querySelector('.loader').classList.add('hidden');
    }

    addItem(content) {
        const item = document.createElement('li');
        item.textContent = content;
        this.appendChild(item);
    }
}

customElements.define('infinite-list', InfiniteList);
</script>

<!-- 使用无限滚动 -->
<infinite-list id="my-list"></infinite-list>

<script>
const list = document.getElementById('my-list');
let page = 0;

// 初始化数据
for (let i = 1; i <= 20; i++) {
    list.addItem(`项目 ${i}`);
}

list.addEventListener('load-more', async (e) => {
    // 模拟异步加载
    await new Promise(r => setTimeout(r, 1000));
    
    const newPage = e.detail.page;
    for (let i = newPage * 20 + 1; i <= (newPage + 1) * 20; i++) {
        list.addItem(`项目 ${i}`);
    }
    
    list.setPage(newPage);
    
    // 限制最大页数
    if (newPage >= 5) {
        list._observer.disconnect();
    }
});
</script>
```

---

## 6. 与框架集成

### 6.1 React 集成

```jsx
// React 组件中使用 Web Components
function App() {
    const cardRef = useRef(null);

    useEffect(() => {
        const card = cardRef.current;
        card.addEventListener('tab-change', handleTabChange);
        return () => card.removeEventListener('tab-change', handleTabChange);
    }, []);

    const handleCardClick = () => {
        // 调用自定义元素的方法
        cardRef.current.open();
    };

    return (
        <div>
            {/* 使用自定义元素 */}
            <user-card 
                ref={cardRef}
                name="张三"
                role="前端工程师"
                onClick={handleCardClick}
            />
        </div>
    );
}

// React 中创建 Web Components
class ReactWebComponent extends HTMLElement {
    connectedCallback() {
        const mountPoint = document.createElement('div');
        this.attachShadow({ mode: 'open' }).appendChild(mountPoint);
        
        const root = createRoot(mountPoint);
        root.render(<MyReactApp />);
    }
}
```

### 6.2 Vue 集成

```vue
<!-- Vue 中使用 Web Components -->
<template>
    <user-card 
        :name="userName"
        :role="userRole"
        @tab-change="handleTabChange"
    />
</template>

<script>
export default {
    data() {
        return {
            userName: '李四',
            userRole: '后端工程师'
        }
    },
    methods: {
        handleTabChange(e) {
            console.log('Tab changed:', e.detail.index);
        }
    },
    mounted() {
        // Vue 3 需要在编译器选项中配置
        // app.config.compilerOptions.isCustomElement = tag => tag.includes('-')
    }
}
</script>
```

### 6.3 Angular 集成

```typescript
// Angular 模块配置
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

// Angular 组件中使用
@Component({
    template: `
        <user-card 
            [name]="userName"
            [role]="userRole"
            (tabChange)="handleTabChange($event)">
        </user-card>
    `
})
export class MyComponent {
    userName = '王五';
    userRole = '全栈工程师';

    handleTabChange(event: CustomEvent) {
        console.log('Tab changed:', event.detail.index);
    }
}
```

---

## 7. 最佳实践

### 7.1 组件设计原则

```javascript
// ✅ 好的设计：职责单一
class Tooltip extends HTMLElement {
    // 只负责显示提示信息
}

class DatePicker extends HTMLElement {
    // 只负责日期选择
}

// ❌ 避免：过于复杂
class SuperForm extends HTMLElement {
    // 包含表单验证、提交、样式、动画...
}

// ✅ 组合优于继承
<form-component>
    <input-component name="email"></input-component>
    <input-component name="password"></input-component>
    <button-component>提交</button-component>
</form-component>
```

### 7.2 性能优化

```javascript
// 1. 延迟渲染
class LazyComponent extends HTMLElement {
    constructor() {
        super();
        // 不在这里创建 Shadow DOM
    }

    connectedCallback() {
        // 只在连接到 DOM 时才渲染
        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
            this.render();
        }
    }
}

// 2. 使用 requestAnimationFrame
class AnimatedComponent extends HTMLElement {
    _update() {
        // 批量更新，避免重排重绘
        requestAnimationFrame(() => {
            this.render();
        });
    }
}

// 3. 缓存模板
const templateCache = new Map();

function getTemplate(id) {
    if (!templateCache.has(id)) {
        const template = document.getElementById(id);
        templateCache.set(id, template.content);
    }
    return templateCache.get(id).cloneNode(true);
}
```

### 7.3 无障碍支持

```javascript
class AccessibleComponent extends HTMLElement {
    connectedCallback() {
        // 设置 ARIA 角色
        if (!this.hasAttribute('role')) {
            this.setAttribute('role', 'button');
        }
        
        // 确保可聚焦
        if (!this.hasAttribute('tabindex')) {
            this.setAttribute('tabindex', '0');
        }
    }

    // 键盘支持
    _handleKeydown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            this.click();
        }
    }
}
```

### 7.4 命名规范

```
命名规则：
1. 必须包含连字符（-）
2. 使用小写字母
3. 使用有意义的名称

✅ 推荐：
<user-card>
<todo-item>
<date-picker>
<modal-dialog>
<progress-bar>

❌ 避免：
<usercard>      // 没有连字符
<UserCard>      // 大写字母
<my-element>    // 名称无意义
<ui-component>  // 太通用
```

---

## 8. 调试技巧

### 8.1 Chrome DevTools

```
1. Elements 面板
   - 展开 #shadow-root 查看影子 DOM
   - 检查 ::slotted 内容

2. Console 调试
   // 检查自定义元素是否已定义
   customElements.get('my-element')
   
   // 检查 Shadow DOM
   document.querySelector('my-element').shadowRoot

3. 事件监听
   // 监听所有事件
   monitorEvents(document.querySelector('my-element'))
```

### 8.2 常见问题解决

```javascript
// 问题1：元素未定义时显示闪烁
// 解决：使用 :not(:defined)
<style>
    my-element:not(:defined) {
        display: none;
    }
    my-element:defined {
        display: block;
    }
</style>

// 问题2：构造函数多次执行
// 解决：检查初始化状态
constructor() {
    super();
    if (this._initialized) return;
    this._initialized = true;
    // 初始化代码...
}

// 问题3：样式不生效
// 解决：检查 Shadow DOM 选择器
// 使用 :host, :host(), ::slotted()
```

---

## 9. 兼容性与 Polyfill

### 9.1 特性检测

```javascript
// 检测 Web Components 支持
const supportsCustomElements = 'customElements' in window;
const supportsShadowDOM = 'attachShadow' in Element.prototype;
const supportsTemplates = 'content' in document.createElement('template');

// 按需加载 polyfill
if (!supportsCustomElements || !supportsShadowDOM) {
    await import('@webcomponents/webcomponentsjs');
}
```

### 9.2 Polyfill 注意事项

```javascript
// 使用 polyfill 时的注意事项：
// 1. Shady CSS 不能完全模拟样式隔离
// 2. 性能可能比原生实现差
// 3. 某些边缘情况可能表现不一致

// 推荐的 polyfill 库
// @webcomponents/webcomponentsjs - 官方 polyfill
```

---

## 小结

| 技术 | 核心作用 | 关键 API |
|------|----------|----------|
| Custom Elements | 创建自定义 HTML 标签 | `customElements.define()` |
| Shadow DOM | 样式和结构隔离 | `attachShadow()` |
| template | 定义可复用模板 | `content.cloneNode()` |
| slot | 内容投射 | `assignedElements()` |

| 最佳实践 | 说明 |
|----------|------|
| 职责单一 | 每个组件只做一件事 |
| 样式隔离 | 利用 Shadow DOM |
| 无障碍 | 添加 ARIA 属性和键盘支持 |
| 命名规范 | 使用连分隔符，语义化命名 |

---

## 参考资源

### 官方文档
- [MDN Web Components](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components)
- [Web Components 官方规范](https://www.webcomponents.org/)
- [Custom Elements 规范](https://html.spec.whatwg.org/multipage/custom-elements.html)

### 工具库
- [Lit](https://lit.dev/) - 简化 Web Components 开发的库
- [Stencil](https://stenciljs.com/) - Web Components 编译器
- [hybrids](https://hybrids.js.org/) - 函数式 Web Components 库

---

[返回上级目录](../README.md)
