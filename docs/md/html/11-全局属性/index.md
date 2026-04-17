# 十一、全局属性

> 全局属性是可以用于任何 HTML 元素的属性。掌握这些属性对于构建交互式、可访问的网页至关重要。

## 学习要点

- 🏷️ 掌握基础全局属性的使用
- 📊 学会使用 data-* 存储自定义数据
- ♿ 理解无障碍相关属性
- 🎯 了解交互属性的应用场景

---

## 1. 基础属性

### 1.1 id - 唯一标识符

```html
<!-- 唯一标识元素 -->
<div id="header"></div>
<p id="intro-text">介绍文字</p>

<!-- 用途 -->
<!-- 1. CSS 选择器：#header { ... } -->
<!-- 2. JavaScript 获取：document.getElementById('header') -->
<!-- 3. 锚点链接：<a href="#header">跳转到头部</a> -->

<!-- 注意事项 -->
<!-- - 页面内必须唯一 -->
<!-- - 不能包含空格 -->
<!-- - 区分大小写 -->
<!-- - 避免纯数字开头 -->
```

### 1.2 class - 类名

```html
<!-- 单个类名 -->
<div class="container"></div>

<!-- 多个类名（空格分隔） -->
<div class="card active highlight"></div>

<!-- BEM 命名规范 -->
<div class="block__element--modifier"></div>
<article class="post post--featured">
    <h2 class="post__title">标题</h2>
    <p class="post__content">内容</p>
</article>

<!-- JavaScript 操作 -->
<script>
const el = document.querySelector('.card');
el.classList.add('new-class');
el.classList.remove('active');
el.classList.toggle('highlight');
el.classList.contains('card');  // true
el.classList.replace('old', 'new');
</script>
```

### 1.3 style - 内联样式

```html
<!-- 内联样式 -->
<div style="color: red; font-size: 16px;">红色文字</div>

<!-- CSS 变量 -->
<div style="--custom-color: blue; color: var(--custom-color);">蓝色文字</div>

<!-- JavaScript 操作 -->
<script>
const el = document.getElementById('myDiv');
el.style.color = 'red';
el.style.fontSize = '16px';  // 驼峰命名
el.style.setProperty('--custom-color', 'green');
</script>
```

### 1.4 title - 提示文本

```html
<!-- 鼠标悬停显示提示 -->
<span title="这是完整的提示文字">悬停查看</span>

<!-- 链接说明 -->
<a href="/help" title="点击查看帮助文档">帮助</a>

<!-- 表单控件说明 -->
<input type="text" title="请输入您的用户名">

<!-- 图片说明（不如 alt 重要） -->
<img src="info.png" title="点击了解更多信息">
```

### 1.5 lang - 语言

```html
<!-- 文档语言 -->
<html lang="zh-CN">

<!-- 段落语言 -->
<p lang="en">This is English text.</p>
<p lang="ja">これは日本語です。</p>
<p lang="zh-TW">繁體中文</p>

<!-- 语言代码 -->
<!-- zh-CN: 简体中文 -->
<!-- zh-TW: 繁体中文（台湾） -->
<!-- zh-HK: 繁体中文（香港） -->
<!-- en: 英语 -->
<!-- en-US: 美式英语 -->
<!-- en-GB: 英式英语 -->
<!-- ja: 日语 -->
<!-- ko: 韩语 -->
```

### 1.6 dir - 文本方向

```html
<!-- 从左到右（默认） -->
<p dir="ltr">从左到右的文字</p>

<!-- 从右到左 -->
<p dir="rtl">从右到左的文字</p>

<!-- 自动检测 -->
<p dir="auto">Hello 你好</p>

<!-- 阿拉伯语示例 -->
<p dir="rtl" lang="ar">مرحبا بالعالم</p>

<!-- 希伯来语示例 -->
<p dir="rtl" lang="he">שלום עולם</p>
```

---

## 2. 交互属性

### 2.1 tabindex - Tab 顺序

```html
<!-- 自然 Tab 顺序 -->
<button tabindex="0">可聚焦按钮</button>

<!-- 从 Tab 顺序中移除（但可编程聚焦） -->
<div tabindex="-1">编程聚焦</div>

<!-- 自定义 Tab 顺序（避免使用正数） -->
<!-- ❌ 不推荐 -->
<input tabindex="1">
<input tabindex="2">
<input tabindex="3">

<!-- ✅ 推荐：使用 DOM 顺序 -->
<div>
    <input>  <!-- 自然第一个 -->
    <input>  <!-- 自然第二个 -->
    <input>  <!-- 自然第三个 -->
</div>
```

```javascript
// JavaScript 焦点控制
const el = document.getElementById('myDiv');

// 设置焦点
el.focus();

// 移除焦点
el.blur();

// 检查是否聚焦
document.activeElement === el;
```

### 2.2 contenteditable - 可编辑

```html
<!-- 可编辑 -->
<div contenteditable="true">这段文字可以编辑</div>

<!-- 简写 -->
<div contenteditable>可编辑内容</div>

<!-- 不可编辑 -->
<div contenteditable="false">不可编辑</div>

<!-- 继承父元素 -->
<div contenteditable="true">
    <p>可编辑</p>
    <p contenteditable="false">不可编辑</p>
    <p contenteditable="inherit">继承（可编辑）</p>
</div>
```

```javascript
// JavaScript 检测和控制
const el = document.getElementById('editable');

// 检查是否可编辑
console.log(el.isContentEditable);  // true/false

// 开启编辑
el.contentEditable = 'true';
// 或
el.setAttribute('contenteditable', 'true');

// 关闭编辑
el.contentEditable = 'false';
```

### 2.3 draggable - 可拖拽

```html
<!-- 可拖拽 -->
<div draggable="true">可拖拽元素</div>

<!-- 不可拖拽（默认） -->
<div draggable="false">不可拖拽</div>

<!-- 图片默认可拖拽 -->
<img src="image.jpg" draggable="true">
```

```javascript
// 拖拽事件处理
const draggable = document.getElementById('draggable');

draggable.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', e.target.id);
    e.dataTransfer.effectAllowed = 'move';
});

const dropzone = document.getElementById('dropzone');

dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
});

dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const element = document.getElementById(id);
    dropzone.appendChild(element);
});
```

### 2.4 hidden - 隐藏

```html
<!-- 隐藏元素 -->
<div hidden>这个元素被隐藏</div>

<!-- 等同于 display: none -->
<div style="display: none;">同样隐藏</div>

<!-- 条件隐藏 -->
<div hidden id="modal">模态框内容</div>

<script>
// 显示
document.getElementById('modal').hidden = false;

// 隐藏
document.getElementById('modal').hidden = true;
</script>
```

### 2.5 accesskey - 快捷键

```html
<!-- 快捷键 -->
<button accesskey="s">保存 (Alt+S)</button>
<a href="/" accesskey="h">首页 (Alt+H)</a>
<input type="search" accesskey="f" placeholder="搜索 (Alt+F)">

<!-- 不同浏览器的快捷键组合 -->
<!-- Chrome/Edge/Safari: Alt + key -->
<!-- Firefox: Alt + Shift + key -->
<!-- Mac: Control + Option + key -->
```

### 2.6 spellcheck - 拼写检查

```html
<!-- 开启拼写检查 -->
<textarea spellcheck="true"></textarea>
<input type="text" spellcheck="true">

<!-- 关闭拼写检查 -->
<input type="text" spellcheck="false">

<!-- 继承 -->
<div spellcheck="true">
    <input type="text">  <!-- 继承开启 -->
    <input type="text" spellcheck="false">  <!-- 单独关闭 -->
</div>
```

---

## 3. 数据属性 data-*

### 3.1 基本用法

```html
<!-- 自定义数据属性 -->
<div 
    data-id="123"
    data-name="张三"
    data-user-role="admin"
    data-json='{"key": "value"}'
>
    用户卡片
</div>

<script>
const el = document.querySelector('div');

// 读取数据
console.log(el.dataset.id);       // "123"
console.log(el.dataset.name);     // "张三"
console.log(el.dataset.userRole); // "admin" (自动转驼峰)
console.log(el.dataset.json);     // '{"key": "value"}'

// 设置数据
el.dataset.id = '456';
el.dataset.newAttr = 'new value';

// 删除数据
delete el.dataset.id;

// 检查数据
console.log('id' in el.dataset);  // true/false
</script>
```

### 3.2 CSS 使用

```html
<div data-status="active" data-priority="high">内容</div>

<style>
/* 属性选择器 */
[data-status="active"] {
    color: green;
}

[data-status="inactive"] {
    color: gray;
}

[data-priority="high"] {
    font-weight: bold;
}

/* 使用 data 属性值 */
div::before {
    content: attr(data-status);
}
</style>
```

### 3.3 实战示例

```html
<!-- 列表项数据绑定 -->
<ul class="user-list">
    <li 
        data-user-id="1" 
        data-user-name="张三"
        data-user-email="zhangsan@example.com"
    >
        张三
    </li>
    <li 
        data-user-id="2" 
        data-user-name="李四"
        data-user-email="lisi@example.com"
    >
        李四
    </li>
</ul>

<script>
// 点击获取用户数据
document.querySelector('.user-list').addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (li) {
        const { userId, userName, userEmail } = li.dataset;
        console.log('ID:', userId);
        console.log('姓名:', userName);
        console.log('邮箱:', userEmail);
    }
});
</script>
```

---

## 4. 无障碍属性

### 4.1 role - 角色

```html
<!-- 显式指定角色 -->
<div role="button">自定义按钮</div>
<div role="dialog">对话框</div>
<nav role="navigation">导航</nav>
<div role="alert">警告消息</div>

<!-- 常用角色 -->
<div role="tablist">                          <!-- 标签列表 -->
    <div role="tab">标签1</div>
</div>
<div role="tabpanel">内容</div>

<div role="menu">                              <!-- 菜单 -->
    <div role="menuitem">菜单项</div>
</div>

<div role="listbox">                           <!-- 列表框 -->
    <div role="option">选项1</div>
</div>
```

### 4.2 aria-* 属性

```html
<!-- 标签和描述 -->
<button aria-label="关闭对话框">×</button>
<div aria-labelledby="dialog-title">
    <h2 id="dialog-title">对话框标题</h2>
</div>
<input aria-describedby="input-hint">
<span id="input-hint">请输入8位密码</span>

<!-- 状态属性 -->
<button aria-pressed="true">已选中</button>
<button aria-expanded="false" aria-controls="menu">展开菜单</button>
<div id="menu" aria-hidden="true">菜单内容</div>
<input aria-invalid="true" aria-errormessage="error">
<span id="error" role="alert">格式错误</span>

<!-- 关系属性 -->
<div aria-owns="child1 child2">拥有这些子元素</div>
<input aria-activedescendant="option1">当前活动后代</div>

<!-- 实时区域 -->
<div aria-live="polite">礼貌更新（等用户空闲时播报）</div>
<div aria-live="assertive">紧急更新（立即播报）</div>
<div aria-live="off">不播报</div>

<!-- 组合属性 -->
<div 
    role="dialog"
    aria-modal="true"
    aria-labelledby="title"
    aria-describedby="desc"
>
    <h2 id="title">确认删除</h2>
    <p id="desc">确定要删除这个项目吗？</p>
</div>
```

### 4.3 常用 ARIA 属性速查

| 属性 | 用途 | 值 |
|------|------|-----|
| `aria-label` | 提供可访问名称 | 字符串 |
| `aria-labelledby` | 引用其他元素作为标签 | ID 引用 |
| `aria-describedby` | 引用描述元素 | ID 引用 |
| `aria-hidden` | 对辅助技术隐藏 | true/false |
| `aria-disabled` | 禁用状态 | true/false |
| `aria-checked` | 选中状态 | true/false/mixed |
| `aria-selected` | 选择状态 | true/false |
| `aria-expanded` | 展开状态 | true/false/undefined |
| `aria-pressed` | 按下状态 | true/false/mixed |
| `aria-live` | 实时更新 | polite/assertive/off |
| `aria-current` | 当前位置 | page/step/true |
| `aria-required` | 必填 | true/false |
| `aria-invalid` | 验证失败 | true/false/grammar/spelling |
| `aria-errormessage` | 错误信息 | ID 引用 |
| `aria-controls` | 控制的元素 | ID 引用 |
| `aria-owns` | 拥有的元素 | ID 引用 |

---

## 5. 其他属性

### 5.1 is - 自定义内置元素

```html
<!-- 使用自定义内置元素 -->
<button is="my-button">自定义按钮</button>
<p is="my-paragraph">自定义段落</p>

<script>
class MyButton extends HTMLButtonElement {
    constructor() {
        super();
        this.addEventListener('click', () => {
            alert('自定义按钮被点击');
        });
    }
}
customElements.define('my-button', MyButton, { extends: 'button' });
</script>
```

### 5.2 slot - 插槽

```html
<!-- 定义插槽内容 -->
<my-card>
    <h2 slot="header">卡片标题</h2>
    <p>卡片内容</p>
    <span slot="footer">页脚信息</span>
</my-card>
```

### 5.3 part - Shadow DOM 部分

```html
<!-- 暴露 Shadow DOM 内部元素 -->
<template id="card-template">
    <style>
        .header { color: blue; }
    </style>
    <div class="header" part="header">
        <slot name="header"></slot>
    </div>
</template>

<!-- 外部自定义样式 -->
<style>
    my-card::part(header) {
        color: red;
    }
</style>
```

### 5.4 exportparts - 导出部分

```html
<!-- 导出嵌套 Shadow DOM 的部分 -->
<x-tabs exportparts="tab: my-tab">
    <!-- 内部 Shadow DOM 的 tab 部分导出为 my-tab -->
</x-tabs>

<style>
    x-tabs::part(my-tab) {
        background: yellow;
    }
</style>
```

### 5.5 enterkeyhint - 回车键提示

```html
<!-- 移动端键盘回车键提示 -->
<input type="text" enterkeyhint="enter">     <!-- 回车 -->
<input type="text" enterkeyhint="done">      <!-- 完成 -->
<input type="text" enterkeyhint="go">        <!-- 前往 -->
<input type="text" enterkeyhint="next">      <!-- 下一个 -->
<input type="text" enterkeyhint="previous">  <!-- 上一个 -->
<input type="text" enterkeyhint="search">    <!-- 搜索 -->
<input type="text" enterkeyhint="send">      <!-- 发送 -->
```

### 5.6 inputmode - 输入模式

```html
<!-- 虚拟键盘类型 -->
<input type="text" inputmode="none">        <!-- 不显示键盘 -->
<input type="text" inputmode="text">        <!-- 标准键盘 -->
<input type="text" inputmode="decimal">     <!-- 小数键盘 -->
<input type="text" inputmode="numeric">     <!-- 数字键盘 -->
<input type="text" inputmode="tel">         <!-- 电话键盘 -->
<input type="text" inputmode="search">      <!-- 搜索键盘 -->
<input type="text" inputmode="email">       <!-- 邮箱键盘 -->
<input type="text" inputmode="url">         <!-- URL 键盘 -->
```

### 5.7 translate - 翻译

```html
<!-- 允许翻译 -->
<p translate="yes">这段文字可以被翻译</p>

<!-- 禁止翻译 -->
<p translate="no">Code examples should not be translated</p>
<code translate="no">console.log('hello')</code>

<!-- 品牌名、专有名词 -->
<span translate="no">Google</span>
<span translate="no">JavaScript</span>
```

---

## 6. 全局属性速查表

| 属性 | 类别 | 用途 |
|------|------|------|
| `id` | 基础 | 唯一标识符 |
| `class` | 基础 | 类名（可多个） |
| `style` | 基础 | 内联样式 |
| `title` | 基础 | 提示文本 |
| `lang` | 基础 | 语言代码 |
| `dir` | 基础 | 文本方向 |
| `hidden` | 交互 | 隐藏元素 |
| `tabindex` | 交互 | Tab 顺序 |
| `contenteditable` | 交互 | 可编辑 |
| `draggable` | 交互 | 可拖拽 |
| `accesskey` | 交互 | 快捷键 |
| `spellcheck` | 交互 | 拼写检查 |
| `data-*` | 数据 | 自定义数据 |
| `role` | 无障碍 | ARIA 角色 |
| `aria-*` | 无障碍 | ARIA 属性 |
| `is` | 组件 | 自定义内置元素 |
| `slot` | 组件 | 插槽名称 |
| `part` | 组件 | Shadow DOM 部分 |
| `translate` | 其他 | 翻译控制 |
| `enterkeyhint` | 移动 | 回车键提示 |
| `inputmode` | 移动 | 输入模式 |

---

## 小结

| 类别 | 重要属性 | 典型场景 |
|------|----------|----------|
| 基础 | id, class, style | 样式、脚本定位 |
| 交互 | tabindex, contenteditable | 自定义交互组件 |
| 数据 | data-* | 存储组件数据 |
| 无障碍 | role, aria-* | 屏幕阅读器支持 |
| 移动 | inputmode, enterkeyhint | 优化移动端输入 |

| 最佳实践 | 说明 |
|----------|------|
| 合理使用 id | 页面内唯一，避免滥用 |
| 语义化优先 | 先用语义标签，再用 ARIA |
| data-* 命名规范 | 使用小写，多个单词用连字符 |
| tabindex 谨慎使用 | 优先用自然 DOM 顺序 |

---

## 参考资源

- [MDN 全局属性](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes)
- [ARIA 规范](https://www.w3.org/TR/wai-aria-1.2/)
- [自定义数据属性](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/data-*)

---

[返回上级目录](../README.md)
