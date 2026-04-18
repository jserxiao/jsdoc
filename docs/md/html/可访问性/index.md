# 可访问性（Accessibility）

> 可访问性（a11y）确保网站能被所有人使用，包括残障人士。良好的可访问性不仅是一种责任，也能改善所有用户的体验。

## 学习要点

- ♿ 理解可访问性的重要性
- 🎯 掌握 ARIA 属性的使用
- ⌨️ 学会实现键盘导航
- ✅ 形成良好的可访问性习惯

---

## 1. 为什么可访问性重要？

### 影响的人群

| 类型 | 需求 | 辅助技术 |
|------|------|----------|
| 视觉障碍 | 屏幕阅读器、高对比度 | 屏幕阅读器 |
| 听觉障碍 | 字幕、文字提示 | 字幕、转录 |
| 运动障碍 | 键盘导航、语音控制 | 开关设备 |
| 认知障碍 | 简洁界面、清晰语言 | 阅读辅助 |

### 好处

- 🌍 扩大用户群体
- ⚖️ 法律合规要求
- 🔍 改善 SEO
- 👥 提升所有用户体验

---

## 2. HTML 语义化是基础

```html
<!-- ✅ 使用正确的语义标签 -->
<nav>
    <ul>
        <li><a href="/">首页</a></li>
        <li><a href="/about">关于</a></li>
    </ul>
</nav>

<main>
    <article>
        <h1>文章标题</h1>
        <p>内容...</p>
    </article>
</main>

<!-- ✅ 图片必须有 alt -->
<img src="chart.png" alt="2024年销售增长图表">

<!-- 装饰性图片用空 alt -->
<img src="decorative.png" alt="">

<!-- ✅ 链接文本要有意义 -->
<a href="/about">关于我们</a>  <!-- 好 -->
<a href="/about">点击这里</a>  <!-- 差 -->

<!-- ✅ 表单必须关联 label -->
<label for="email">邮箱地址</label>
<input type="email" id="email" name="email">
```

---

## 3. ARIA 属性

ARIA（Accessible Rich Internet Applications）用于增强 HTML 的可访问性。

### 角色（role）

```html
<!-- 当语义标签不够用时，使用 role -->
<div role="button" tabindex="0">自定义按钮</div>
<div role="dialog" aria-modal="true">对话框</div>
<div role="alert">警告消息</div>
<nav role="navigation">导航</nav>
<div role="tablist">
    <div role="tab">标签1</div>
    <div role="tabpanel">内容1</div>
</div>
```

### 常用 ARIA 属性

```html
<!-- aria-label：提供可访问名称 -->
<button aria-label="关闭对话框">×</button>
<nav aria-label="主导航">...</nav>

<!-- aria-labelledby：关联其他元素作为标签 -->
<div aria-labelledby="dialog-title">
    <h2 id="dialog-title">确认删除</h2>
    <p>确定要删除吗？</p>
</div>

<!-- aria-describedby：关联描述信息 -->
<input aria-describedby="password-hint">
<span id="password-hint">密码至少8位</span>

<!-- 状态属性 -->
<button aria-pressed="true">已选中</button>
<button aria-expanded="false" aria-controls="menu">展开菜单</button>
<div id="menu" aria-hidden="true">菜单内容</div>

<!-- 表单验证 -->
<input aria-invalid="true" aria-errormessage="error-msg">
<span id="error-msg" role="alert">格式错误</span>

<!-- 当前位置 -->
<a href="/" aria-current="page">首页</a>
```

### 状态和属性速查

| 属性 | 用途 |
|------|------|
| `aria-hidden` | 对辅助技术隐藏 |
| `aria-disabled` | 禁用状态 |
| `aria-checked` | 选中状态 |
| `aria-expanded` | 展开/折叠状态 |
| `aria-selected` | 选中状态 |
| `aria-live` | 实时区域（自动播报） |
| `aria-required` | 必填字段 |

---

## 4. 键盘导航

### 焦点管理

```html
<!-- 使非交互元素可获得焦点 -->
<div role="button" tabindex="0">可聚焦</div>

<!-- tabindex 值的含义 -->
tabindex="-1"  <!-- 可通过 JS 聚焦，不在 Tab 顺序中 -->
tabindex="0"   <!-- 在 Tab 顺序中，顺序由 DOM 决定 -->
tabindex="1"   <!-- ⚠️ 避免：会打乱自然顺序 -->

<!-- 跳过导航链接 -->
<a href="#main-content" class="skip-link">跳到主要内容</a>
<nav>导航内容...</nav>
<main id="main-content">主要内容</main>
```

### 键盘交互

```javascript
// 自定义按钮需要支持键盘
const button = document.querySelector('[role="button"]');

button.addEventListener('keydown', (e) => {
    // Enter 或 Space 触发点击
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        button.click();
    }
});
```

### 焦点样式

```css
/* 不要移除焦点样式 */
/* ❌ 避免 */
*:focus {
    outline: none;
}

/* ✅ 好：自定义焦点样式 */
*:focus {
    outline: 2px solid blue;
    outline-offset: 2px;
}

/* ✅ 好：只对鼠标用户隐藏焦点 */
*:focus:not(:focus-visible) {
    outline: none;
}

/* ✅ 好：键盘用户显示焦点 */
*:focus-visible {
    outline: 2px solid blue;
}
```

---

## 5. 实战示例

### 可访问的对话框

```html
<div role="dialog" 
     aria-modal="true" 
     aria-labelledby="dialog-title"
     aria-describedby="dialog-desc">
    
    <h2 id="dialog-title">确认操作</h2>
    <p id="dialog-desc">确定要删除这个项目吗？</p>
    
    <button>取消</button>
    <button>确认</button>
</div>
```

```javascript
// 打开对话框时
function openDialog(dialog) {
    dialog.setAttribute('aria-hidden', 'false');
    dialog.showModal();
    
    // 保存之前的焦点
    previousFocus = document.activeElement;
    
    // 聚焦到对话框
    dialog.querySelector('button').focus();
}

// 关闭对话框时
function closeDialog(dialog) {
    dialog.setAttribute('aria-hidden', 'true');
    dialog.close();
    
    // 恢复之前的焦点
    previousFocus?.focus();
}
```

### 可访问的标签页

```html
<div role="tablist">
    <button role="tab" 
            aria-selected="true" 
            aria-controls="panel1"
            id="tab1">
        标签1
    </button>
    <button role="tab" 
            aria-selected="false" 
            aria-controls="panel2"
            id="tab2">
        标签2
    </button>
</div>

<div role="tabpanel" id="panel1" aria-labelledby="tab1">
    内容1
</div>
<div role="tabpanel" id="panel2" aria-labelledby="tab2" hidden>
    内容2
</div>
```

---

## 6. 测试工具

### 自动化测试

- **Lighthouse**：Chrome 内置审计工具
- **axe DevTools**：浏览器扩展
- **WAVE**：网页可访问性评估工具

### 手动测试

- 🖱️ 只用键盘导航网站
- 🔊 使用屏幕阅读器测试（NVDA、VoiceOver）
- 🔍 检查颜色对比度

---

## 小结

| 要点 | 做法 |
|------|------|
| 语义化 | 使用正确的 HTML 标签 |
| ARIA | 增强语义，不是替代 |
| 键盘 | 所有功能可通过键盘访问 |
| 焦点 | 明显的焦点指示器 |
| 测试 | 定期进行可访问性测试 |

---

[返回上级目录](../README.md)
