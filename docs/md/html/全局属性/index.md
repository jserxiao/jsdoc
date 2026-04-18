# 全局属性

> 全局属性是可以用于任何 HTML 元素的属性。掌握这些属性对于构建交互式、可访问的网页至关重要。内容参考《HTML5 权威指南》等经典著作。

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
```

#### id 命名规则

```html
<!-- ✅ 合法的 id -->
<div id="header"></div>
<div id="main-content"></div>
<div id="section1"></div>
<div id="用户面板"></div>

<!-- ❌ 不推荐或非法 -->
<div id="">空 id</div>              <!-- 空值无效 -->
<div id="header box">包含空格</div>  <!-- 不能包含空格 -->
<div id="1section">数字开头</div>    <!-- 不推荐，CSS 选择器会出错 -->
<div id="class">保留字</div>         <!-- 避免使用保留字 -->
```

#### id vs class 选择

```html
<!-- id：页面唯一，用于锚点、表单关联、JavaScript 快速获取 -->
<header id="site-header">...</header>
<form id="login-form">...</form>
<output id="result"></output>

<!-- class：可重复使用，用于样式和分类 -->
<article class="post">...</article>
<article class="post featured">...</article>
<button class="btn btn-primary">提交</button>
```

#### 锚点导航

```html
<!-- 页内锚点 -->
<nav>
    <a href="#section1">第一节</a>
    <a href="#section2">第二节</a>
    <a href="#section3">第三节</a>
</nav>

<article>
    <section id="section1">
        <h2>第一节</h2>
        <p>内容...</p>
    </section>
    <section id="section2">
        <h2>第二节</h2>
        <p>内容...</p>
    </section>
    <section id="section3">
        <h2>第三节</h2>
        <p>内容...</p>
    </section>
</article>

<!-- 跨页面锚点 -->
<a href="page.html#section1">跳转到其他页面的第一节</a>
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
```

#### class 操作 API

```javascript
const el = document.querySelector('.card');

// 添加类
el.classList.add('active');
el.classList.add('highlight', 'visible');

// 移除类
el.classList.remove('active');
el.classList.remove('highlight', 'visible');

// 切换类
el.classList.toggle('active');
el.classList.toggle('active', true);  // 强制添加
el.classList.toggle('active', false); // 强制移除

// 检查类
el.classList.contains('card');  // true
el.classList.contains('active'); // false

// 替换类
el.classList.replace('old-class', 'new-class');

// 遍历类
el.classList.forEach(className => {
    console.log(className);
});

// 获取类名数量
el.classList.length;

// 通过索引获取类名
el.classList.item(0);  // 'card'
```

#### 常用命名规范

```html
<!-- BEM（Block Element Modifier） -->
<div class="menu">
    <div class="menu__item menu__item--active">首页</div>
    <div class="menu__item">产品</div>
</div>

<!-- OOCSS（Object Oriented CSS） -->
<div class="card">
    <div class="card-header">...</div>
    <div class="card-body">...</div>
</div>
<!-- 分离结构和皮肤 -->
<div class="btn btn-primary">...</div>
<div class="btn btn-secondary">...</div>

<!-- SMACSS -->
<div class="l-header">...</div>  <!-- 布局 -->
<div class="btn">...</div>       <!-- 模块 -->
<div class="is-active">...</div> <!-- 状态 -->

<!-- Utility First -->
<div class="flex items-center justify-between p-4 bg-white rounded shadow">
    ...
</div>
```

### 1.3 style - 内联样式

```html
<!-- 内联样式 -->
<div style="color: red; font-size: 16px;">红色文字</div>

<!-- CSS 变量 -->
<div style="--custom-color: blue; color: var(--custom-color);">蓝色文字</div>
```

#### JavaScript 操作

```javascript
const el = document.getElementById('myDiv');

// 设置单个样式
el.style.color = 'red';
el.style.fontSize = '16px';      // 驼峰命名
el.style.backgroundColor = '#fff';

// 设置 CSS 变量
el.style.setProperty('--custom-color', 'green');
el.style.setProperty('--spacing', '16px');

// 获取计算样式
const computedStyle = getComputedStyle(el);
console.log(computedStyle.color);
console.log(computedStyle.getPropertyValue('--custom-color'));

// 移除属性
el.style.removeProperty('color');
el.style.color = '';  // 或设为空字符串

// cssText 批量设置
el.style.cssText = 'color: red; font-size: 16px;';

// 获取内联样式文本
console.log(el.style.cssText);
```

#### 内联样式注意事项

```html
<!-- ⚠️ 内联样式优先级最高，难以覆盖 -->
<div style="color: red" id="myDiv">文字</div>

<style>
    #myDiv { color: blue !important; } /* 需要 !important */
</style>

<!-- ✅ 推荐：使用 class 代替内联样式 -->
<div class="text-red" id="myDiv">文字</div>

<style>
    .text-red { color: red; }
    #myDiv.text-blue { color: blue; } /* 可以覆盖 */
</style>
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

#### title 与其他说明属性的区别

```html
<!-- title：鼠标悬停提示，辅助信息 -->
<button title="点击保存 (Ctrl+S)">保存</button>

<!-- alt：图片无法显示时的替代文本 -->
<img src="chart.png" alt="2023年销售数据图表">

<!-- aria-label：屏幕阅读器读取的标签 -->
<button aria-label="关闭对话框">×</button>

<!-- placeholder：输入提示 -->
<input type="text" placeholder="请输入搜索关键词">
```

#### 多行 title

```html
<!-- 使用换行实体（不推荐，支持不一致） -->
<span title="第一行&#10;第二行&#10;第三行">多行提示</span>

<!-- 推荐：使用 CSS 自定义提示 -->
<span class="tooltip" data-tooltip="第一行<br>第二行">悬停查看</span>

<style>
.tooltip {
    position: relative;
}
.tooltip::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    padding: 8px;
    background: #333;
    color: #fff;
    white-space: pre-line;
    display: none;
}
.tooltip:hover::after {
    display: block;
}
</style>
```

### 1.5 lang - 语言

```html
<!-- 文档语言 -->
<html lang="zh-CN">

<!-- 段落语言 -->
<p lang="en">This is English text.</p>
<p lang="ja">これは日本語です。</p>
<p lang="zh-TW">繁體中文</p>
```

#### 常用语言代码

```
语言代码对照表：

中文：
- zh-CN: 简体中文（中国大陆）
- zh-TW: 繁体中文（台湾）
- zh-HK: 繁体中文（香港）
- zh-SG: 简体中文（新加坡）

英语：
- en: 英语（通用）
- en-US: 美式英语
- en-GB: 英式英语
- en-AU: 澳大利亚英语

其他：
- ja: 日语
- ko: 韩语
- fr: 法语
- de: 德语
- es: 西班牙语
- pt: 葡萄牙语
- ru: 俄语
- ar: 阿拉伯语
```

#### lang 的影响

```html
<!-- 影响：
     1. 屏幕阅读器发音
     2. 浏览器拼写检查
     3. 搜索引擎理解内容
     4. 浏览器翻译功能
     5. CSS :lang() 选择器
-->

<html lang="zh-CN">
<head>
    <style>
        /* 根据语言应用不同样式 */
        :lang(zh-CN) { font-family: "Microsoft YaHei", sans-serif; }
        :lang(en) { font-family: "Helvetica Neue", sans-serif; }
        :lang(ja) { font-family: "Hiragino Sans", sans-serif; }
        
        /* 引号样式 */
        :lang(en) q { quotes: '"' '"' "'" "'"; }
        :lang(zh-CN) q { quotes: "「" "」" "『" "』"; }
    </style>
</head>
<body>
    <p>中文内容使用中文字体</p>
    <p lang="en">English content uses English fonts.</p>
    <p lang="ja">日本語コンテンツは日本語フォントを使用します。</p>
</body>
</html>
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

#### RTL 布局处理

```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <style>
        /* 逻辑属性自动适应文本方向 */
        .box {
            margin-inline-start: 16px;  /* LTR: margin-left, RTL: margin-right */
            padding-inline-end: 16px;   /* LTR: padding-right, RTL: padding-left */
            border-inline-start: 1px solid #ccc;
        }
        
        /* 或使用 CSS 变量 */
        :root {
            --start: left;
            --end: right;
        }
        [dir="rtl"] {
            --start: right;
            --end: left;
        }
        
        .sidebar {
            position: absolute;
            left: 0;
            /* RTL 下 */
            position: absolute;
            inset-inline-start: 0;
        }
    </style>
</head>
<body>
    <nav>
        <a href="#">الرئيسية</a> <!-- 首页 -->
        <a href="#">المنتجات</a> <!-- 产品 -->
    </nav>
    <main>
        <h1>مرحبا بكم</h1> <!-- 欢迎 -->
    </main>
</body>
</html>
```

---

## 2. 交互属性

### 2.1 tabindex - Tab 顺序

```html
<!-- 自然 Tab 顺序（添加到顺序中） -->
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

#### tabindex 值详解

```html
<!-- tabindex="-1"：不在 Tab 顺序中，但可编程聚焦 -->
<div id="modal" tabindex="-1">
    模态框内容
</div>

<script>
    // 打开模态框时聚焦
    const modal = document.getElementById('modal');
    modal.hidden = false;
    modal.focus();  // 有效，因为有 tabindex="-1"
</script>

<!-- tabindex="0"：加入 Tab 顺序，按 DOM 位置 -->
<div class="custom-button" tabindex="0" role="button">
    自定义按钮
</div>

<script>
    // 添加键盘支持
    const button = document.querySelector('.custom-button');
    button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            button.click();
        }
    });
</script>

<!-- tabindex="1" 及以上：自定义顺序（强烈不推荐） -->
<!-- 会破坏自然导航顺序，造成可访问性问题 -->
```

#### 焦点管理 API

```javascript
// 获取当前聚焦元素
const activeElement = document.activeElement;

// 设置焦点
element.focus();
element.focus({ preventScroll: true });  // 聚焦但不滚动

// 移除焦点
element.blur();

// 检查是否可聚焦
element.focus();  // 尝试聚焦

// 焦点事件
element.addEventListener('focus', (e) => {
    console.log('获得焦点');
});

element.addEventListener('blur', (e) => {
    console.log('失去焦点');
});

element.addEventListener('focusin', (e) => {
    console.log('元素或子元素获得焦点（冒泡）');
});

element.addEventListener('focusout', (e) => {
    console.log('元素或子元素失去焦点（冒泡）');
});
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

#### JavaScript 操作

```javascript
const el = document.getElementById('editable');

// 检查是否可编辑
console.log(el.isContentEditable);  // true/false

// 开启/关闭编辑
el.contentEditable = 'true';
el.contentEditable = 'false';

// 或使用 setAttribute
el.setAttribute('contenteditable', 'true');
```

#### 获取编辑内容

```javascript
const editable = document.querySelector('[contenteditable]');

// 获取内容
const html = editable.innerHTML;      // HTML 内容
const text = editable.innerText;      // 文本内容

// 监听输入
editable.addEventListener('input', (e) => {
    console.log('内容变化:', editable.innerHTML);
});

// 监听粘贴事件
editable.addEventListener('paste', (e) => {
    e.preventDefault();
    // 只粘贴纯文本
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
});

// 保存选区
const selection = window.getSelection();
const range = selection.getRangeAt(0);

// 恢复选区
selection.removeAllRanges();
selection.addRange(range);
```

#### 富文本编辑器基础

```html
<div id="editor" contenteditable="true"></div>
<div class="toolbar">
    <button data-command="bold"><b>B</b></button>
    <button data-command="italic"><i>I</i></button>
    <button data-command="underline"><u>U</u></button>
    <button data-command="insertOrderedList">1.</button>
    <button data-command="insertUnorderedList">•</button>
</div>

<script>
document.querySelector('.toolbar').addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (button) {
        const command = button.dataset.command;
        document.execCommand(command, false, null);
    }
});
</script>
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

#### 完整拖拽实现

```html
<style>
.draggable {
    width: 100px;
    height: 100px;
    background: #1890ff;
    cursor: move;
}

.dropzone {
    width: 300px;
    height: 200px;
    border: 2px dashed #ccc;
    padding: 20px;
}

.dropzone.drag-over {
    border-color: #1890ff;
    background: rgba(24, 144, 255, 0.1);
}
</style>

<div id="draggable" draggable="true" class="draggable">
    拖拽我
</div>

<div id="dropzone" class="dropzone">
    放置区域
</div>

<script>
const draggable = document.getElementById('draggable');
const dropzone = document.getElementById('dropzone');

// 拖拽开始
draggable.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', e.target.id);
    e.dataTransfer.effectAllowed = 'move';
    
    // 添加拖拽样式
    setTimeout(() => {
        draggable.style.opacity = '0.5';
    }, 0);
});

// 拖拽结束
draggable.addEventListener('dragend', (e) => {
    draggable.style.opacity = '1';
});

// 拖拽进入放置区
dropzone.addEventListener('dragenter', (e) => {
    e.preventDefault();
    dropzone.classList.add('drag-over');
});

// 拖拽在放置区上方
dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
});

// 拖拽离开放置区
dropzone.addEventListener('dragleave', (e) => {
    dropzone.classList.remove('drag-over');
});

// 放置
dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('drag-over');
    
    const id = e.dataTransfer.getData('text/plain');
    const element = document.getElementById(id);
    dropzone.appendChild(element);
});
</script>
```

#### 拖拽数据类型

```javascript
// 设置多种类型的数据
e.dataTransfer.setData('text/plain', '文本内容');
e.dataTransfer.setData('text/uri-list', 'https://example.com');
e.dataTransfer.setData('text/html', '<b>HTML内容</b>');

// 获取数据
const text = e.dataTransfer.getData('text/plain');
const url = e.dataTransfer.getData('text/uri-list');

// 设置拖拽图像
const img = new Image();
img.src = 'drag-image.png';
e.dataTransfer.setDragImage(img, 10, 10);

// 设置拖拽效果
e.dataTransfer.effectAllowed = 'move';    // move, copy, link, all, none
e.dataTransfer.dropEffect = 'copy';       // 移动时显示的效果
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

// 切换
element.hidden = !element.hidden;
</script>
```

#### hidden vs CSS 隐藏

```html
<!-- hidden 属性：语义隐藏，表示内容当前不相关 -->
<div hidden>
    <h2>登录表单</h2>
    <!-- 用户已登录时隐藏 -->
</div>

<!-- display: none：样式隐藏 -->
<div style="display: none;">
    <!-- 仅仅是不显示 -->
</div>

<!-- visibility: hidden：隐藏但保留空间 -->
<div style="visibility: hidden;">
    <!-- 隐藏但占据布局空间 -->
</div>

<!-- opacity: 0：透明但可交互 -->
<div style="opacity: 0;">
    <!-- 完全透明，但仍可点击 -->
</div>

<!-- 对比表 -->
<!--
| 方式              | 视觉 | 空间 | 可交互 | 可访问性 | 可动画 |
|-------------------|------|------|--------|----------|--------|
| hidden            | 隐藏 | 无   | 否     | 否       | 否     |
| display: none     | 隐藏 | 无   | 否     | 否       | 否     |
| visibility: hidden| 隐藏 | 有   | 否     | 否       | 是     |
| opacity: 0        | 隐藏 | 有   | 是     | 是       | 是     |
| clip/clip-path    | 隐藏 | 有   | 否     | 否       | 是     |
-->
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

#### 完整快捷键实现

```html
<nav>
    <a href="/" accesskey="h">首页</a>
    <a href="/products" accesskey="p">产品</a>
    <a href="/about" accesskey="a">关于</a>
    <a href="/contact" accesskey="c">联系</a>
</nav>

<main>
    <button accesskey="s" id="saveBtn">保存</button>
    <input type="search" accesskey="f" id="searchInput" placeholder="搜索">
</main>

<script>
// 显示快捷键提示
document.addEventListener('keydown', (e) => {
    if (e.altKey) {
        document.body.classList.add('show-accesskeys');
    }
});

document.addEventListener('keyup', (e) => {
    if (!e.altKey) {
        document.body.classList.remove('show-accesskeys');
    }
});
</script>

<style>
[accesskey]::after {
    content: ' [Alt+' attr(accesskey) ']';
    display: none;
    color: #999;
    font-size: 12px;
}

.show-accesskeys [accesskey]::after {
    display: inline;
}
</style>
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

#### 拼写检查场景

```html
<!-- ✅ 应该开启拼写检查 -->
<textarea spellcheck="true" placeholder="请输入评论..."></textarea>
<input type="email" spellcheck="true">
<input type="text" placeholder="文章标题" spellcheck="true">

<!-- ❌ 应该关闭拼写检查 -->
<input type="text" placeholder="用户名" spellcheck="false">
<input type="password" spellcheck="false">
<input type="text" placeholder="代码片段" spellcheck="false">
<input type="text" placeholder="产品编号" spellcheck="false">
<textarea placeholder="JSON 数据" spellcheck="false"></textarea>
```

### 2.7 autocapitalize - 自动大写

```html
<!-- 关闭自动大写 -->
<input type="text" autocapitalize="off">

<!-- 全部大写 -->
<input type="text" autocapitalize="characters">

<!-- 单词首字母大写 -->
<input type="text" autocapitalize="words">

<!-- 句子首字母大写（默认） -->
<input type="text" autocapitalize="sentences">
```

#### 应用场景

```html
<!-- 用户名：通常小写 -->
<input type="text" name="username" autocapitalize="off" spellcheck="false">

<!-- 姓名首字母大写 -->
<input type="text" name="name" autocapitalize="words">

<!-- 标题句子大写 -->
<input type="text" name="title" autocapitalize="sentences">

<!-- 代码输入：关闭大写 -->
<textarea name="code" autocapitalize="off" spellcheck="false"></textarea>

<!-- 验证码：全部大写 -->
<input type="text" name="captcha" autocapitalize="characters">
```

### 2.8 autofocus - 自动聚焦

```html
<!-- 页面加载时自动聚焦 -->
<input type="text" autofocus>
<textarea autofocus></textarea>
<select autofocus>...</select>

<!-- 搜索页面示例 -->
<input type="search" autofocus placeholder="输入搜索关键词">

<!-- 登录页面示例 -->
<form>
    <input type="text" name="username" autofocus placeholder="用户名">
    <input type="password" name="password" placeholder="密码">
    <button type="submit">登录</button>
</form>
```

#### 注意事项

```html
<!-- ⚠️ 每个页面只应有一个 autofocus 元素 -->
<!-- ❌ 不推荐：多个 autofocus -->
<input autofocus>
<input autofocus>  <!-- 只有第一个生效 -->

<!-- ⚠️ 不要在非用户触发的情况下使用 -->
<!-- ❌ 不推荐：模态框内自动聚焦 -->
<div class="modal">
    <input autofocus>  <!-- 可能打断用户正在输入的内容 -->
</div>

<!-- ✅ 推荐：JavaScript 控制聚焦时机 -->
<script>
const modal = document.querySelector('.modal');
const input = modal.querySelector('input');

function openModal() {
    modal.hidden = false;
    input.focus();  // 打开后再聚焦
}
</script>
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

### 3.2 命名转换规则

```html
<!-- HTML: 连字符命名 -->
<div 
    data-user-id="1"
    data-user-name="张三"
    data-is-active="true"
    data-json-data='{"a": 1}'
></div>

<script>
const el = document.querySelector('div');

// JavaScript: 驼峰命名
console.log(el.dataset.userId);     // "1"
console.log(el.dataset.userName);   // "张三"
console.log(el.dataset.isActive);   // "true"
console.log(el.dataset.jsonData);   // '{"a": 1}'

// 设置时同样转换
el.dataset.newData = 'value';  // HTML: data-new-data="value"
</script>
```

### 3.3 CSS 使用

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

/* 使用 attr() 获取值 */
div::before {
    content: attr(data-status);
}

/* 部分匹配 */
[data-status^="act"] { }   /* 开头匹配 */
[data-status$="ive"] { }   /* 结尾匹配 */
[data-status*="ct"] { }    /* 包含匹配 */
</style>
```

### 3.4 实战示例

#### 列表数据绑定

```html
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

#### 条件渲染

```html
<div class="task-list">
    <div class="task" data-status="pending" data-priority="high">
        <span class="task-name">任务1</span>
        <button class="complete-btn">完成</button>
    </div>
    <div class="task" data-status="completed" data-priority="low">
        <span class="task-name">任务2</span>
    </div>
</div>

<style>
.task[data-status="completed"] {
    opacity: 0.6;
    text-decoration: line-through;
}

.task[data-priority="high"] {
    border-left: 3px solid red;
}

.task[data-priority="low"] {
    border-left: 3px solid gray;
}
</style>

<script>
document.querySelector('.task-list').addEventListener('click', (e) => {
    if (e.target.classList.contains('complete-btn')) {
        const task = e.target.closest('.task');
        task.dataset.status = 'completed';
    }
});
</script>
```

#### 动态样式

```html
<div class="progress-bar" data-progress="75"></div>

<style>
.progress-bar {
    width: 100%;
    height: 20px;
    background: #f0f0f0;
    position: relative;
}

.progress-bar::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: attr(data-progress);  /* 实验性，支持有限 */
    background: #1890ff;
}

/* 使用 CSS 变量替代 */
.progress-bar {
    --progress: 0%;
}
.progress-bar::after {
    width: var(--progress);
}
</style>

<script>
const progressBar = document.querySelector('.progress-bar');
progressBar.dataset.progress = '75';
progressBar.style.setProperty('--progress', '75%');
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
```

#### 常用 ARIA 角色

```html
<!-- 文档结构角色 -->
<header role="banner">页头</header>
<nav role="navigation">导航</nav>
<main role="main">主内容</main>
<aside role="complementary">侧边栏</aside>
<footer role="contentinfo">页脚</footer>

<!-- 小部件角色 -->
<div role="button">按钮</div>
<div role="checkbox">复选框</div>
<div role="link">链接</div>
<div role="menuitem">菜单项</div>
<div role="option">选项</div>
<div role="progressbar">进度条</div>
<div role="slider">滑块</div>
<div role="spinbutton">数字输入</div>
<div role="tab">标签页</div>
<div role="tooltip">提示</div>

<!-- 复合小部件角色 -->
<div role="tablist">
    <div role="tab">标签1</div>
    <div role="tab">标签2</div>
</div>
<div role="tabpanel">内容</div>

<div role="menu">
    <div role="menuitem">菜单项1</div>
    <div role="menuitem">菜单项2</div>
</div>

<div role="listbox">
    <div role="option">选项1</div>
    <div role="option">选项2</div>
</div>

<!-- 对话框角色 -->
<div role="dialog" aria-modal="true">模态对话框</div>
<div role="alertdialog">警告对话框</div>

<!-- 实时区域角色 -->
<div role="alert">立即播报的消息</div>
<div role="status">状态消息</div>
<div role="log">日志消息</div>
<div role="marquee">滚动消息</div>
<div role="timer">计时器</div>
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
```

#### 状态属性

```html
<!-- 按下状态 -->
<button aria-pressed="true">已选中</button>
<button aria-pressed="false">未选中</button>
<button aria-pressed="mixed">部分选中</button>

<!-- 展开状态 -->
<button aria-expanded="false" aria-controls="menu">展开菜单</button>
<div id="menu">菜单内容</div>

<!-- 隐藏状态 -->
<div aria-hidden="true">仅视觉装饰</div>

<!-- 禁用状态 -->
<div aria-disabled="true">禁用选项</div>

<!-- 选中状态 -->
<div role="option" aria-selected="true">选中项</div>

<!-- 勾选状态 -->
<div role="checkbox" aria-checked="true">已勾选</div>

<!-- 无效状态 -->
<input aria-invalid="true" aria-errormessage="error">
<span id="error" role="alert">格式错误</span>

<!-- 当前状态 -->
<a href="#" aria-current="page">当前页面</a>
<a href="#" aria-current="step">当前步骤</a>
```

#### 关系属性

```html
<!-- 控制关系 -->
<button aria-controls="panel1">显示面板</button>
<div id="panel1">面板内容</div>

<!-- 拥有关系 -->
<div aria-owns="child1 child2">拥有这些元素</div>

<!-- 活动后代 -->
<div role="listbox" aria-activedescendant="option1">
    <div role="option" id="option1">选项1</div>
    <div role="option" id="option2">选项2</div>
</div>

<!-- 描述关系 -->
<input aria-describedby="hint error">
<div id="hint">输入提示</div>
<div id="error">错误信息</div>

<!-- 标签关系 -->
<div aria-labelledby="title1 title2">
    <span id="title1">主标题</span>
    <span id="title2">副标题</span>
</div>
```

#### 实时区域

```html
<!-- 礼貌更新（等用户空闲时播报） -->
<div aria-live="polite">新消息已收到</div>

<!-- 紧急更新（立即播报，可能打断用户） -->
<div aria-live="assertive">发生错误！</div>

<!-- 不播报 -->
<div aria-live="off">后台更新</div>

<!-- 相关属性 -->
<div 
    aria-live="polite"
    aria-atomic="true"       <!-- 播报整个区域 -->
    aria-relevant="additions removals text"  <!-- 监听的变化类型 -->
>
    状态消息
</div>
```

### 4.3 无障碍组件示例

#### 模态对话框

```html
<div 
    role="dialog"
    aria-modal="true"
    aria-labelledby="dialog-title"
    aria-describedby="dialog-desc"
    class="dialog"
>
    <h2 id="dialog-title">确认删除</h2>
    <p id="dialog-desc">确定要删除这个项目吗？此操作无法撤销。</p>
    <div class="dialog-buttons">
        <button id="cancel-btn">取消</button>
        <button id="confirm-btn">删除</button>
    </div>
</div>
```

#### 标签页

```html
<div class="tabs">
    <div role="tablist" aria-label="设置选项卡">
        <button 
            role="tab" 
            id="tab-1"
            aria-selected="true" 
            aria-controls="panel-1"
        >
            基本信息
        </button>
        <button 
            role="tab" 
            id="tab-2"
            aria-selected="false" 
            aria-controls="panel-2"
            tabindex="-1"
        >
            安全设置
        </button>
    </div>
    
    <div 
        role="tabpanel" 
        id="panel-1" 
        aria-labelledby="tab-1"
    >
        基本信息内容
    </div>
    <div 
        role="tabpanel" 
        id="panel-2" 
        aria-labelledby="tab-2"
        hidden
    >
        安全设置内容
    </div>
</div>
```

#### 下拉菜单

```html
<div class="dropdown">
    <button 
        aria-haspopup="true"
        aria-expanded="false"
        aria-controls="menu-1"
    >
        更多操作
    </button>
    <ul 
        role="menu" 
        id="menu-1"
        aria-label="更多操作"
        hidden
    >
        <li role="menuitem">编辑</li>
        <li role="menuitem">复制</li>
        <li role="separator"></li>
        <li role="menuitem">删除</li>
    </ul>
</div>
```

### 4.4 常用 ARIA 属性速查

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
| `aria-haspopup` | 有弹出菜单 | true/menu/listbox/dialog/grid |
| `aria-modal` | 模态状态 | true/false |

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
<!-- 定义 Web Component 模板 -->
<template id="card-template">
    <style>
        .card { border: 1px solid #ccc; padding: 16px; }
        .header { font-size: 18px; font-weight: bold; }
        .footer { font-size: 12px; color: #666; }
    </style>
    <div class="card">
        <div class="header"><slot name="header"></slot></div>
        <div class="content"><slot></slot></div>
        <div class="footer"><slot name="footer"></slot></div>
    </div>
</template>

<!-- 使用组件 -->
<my-card>
    <h2 slot="header">卡片标题</h2>
    <p>卡片内容</p>
    <span slot="footer">页脚信息</span>
</my-card>
```

### 5.3 part - Shadow DOM 部分

```html
<!-- 定义组件 -->
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
        background: #f0f0f0;
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
<form>
    <input type="text" enterkeyhint="enter" placeholder="回车">
    <input type="text" enterkeyhint="done" placeholder="完成">
    <input type="text" enterkeyhint="go" placeholder="前往">
    <input type="text" enterkeyhint="next" placeholder="下一个">
    <input type="text" enterkeyhint="previous" placeholder="上一个">
    <input type="text" enterkeyhint="search" placeholder="搜索">
    <input type="text" enterkeyhint="send" placeholder="发送">
</form>
```

#### enterkeyhint 应用场景

```html
<!-- 搜索框：显示"搜索" -->
<input type="search" enterkeyhint="search">

<!-- 登录表单：最后一个显示"前往"或"完成" -->
<input type="text" name="username" enterkeyhint="next">
<input type="password" name="password" enterkeyhint="go">

<!-- 聊天输入：显示"发送" -->
<input type="text" enterkeyhint="send" placeholder="输入消息">

<!-- 表单多步骤：显示"下一个" -->
<input type="text" enterkeyhint="next">
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

#### inputmode vs type

```html
<!-- type 决定验证和语义，inputmode 决定键盘 -->
<!-- 数字输入 -->
<input type="text" inputmode="numeric" pattern="[0-9]*">
<!-- 优于 <input type="number">（可能显示 spinner） -->

<!-- 小数输入 -->
<input type="text" inputmode="decimal" pattern="[0-9.]*">

<!-- 电话号码 -->
<input type="tel" inputmode="tel">
<!-- type="tel" 提供语义，inputmode="tel" 显示电话键盘 -->

<!-- 金额输入 -->
<input type="text" inputmode="decimal" placeholder="输入金额">
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
<span translate="no">React</span>

<!-- 防止代码块被翻译 -->
<pre translate="no"><code>
function hello() {
    console.log('Hello World');
}
</code></pre>
```

### 5.8 nonce - CSP 随机数

```html
<!-- 内容安全策略随机数 -->
<script nonce="abc123">
    console.log('允许执行的脚本');
</script>

<style nonce="abc123">
    .allowed { color: red; }
</style>

<!-- 服务器端生成 nonce -->
<!-- 
HTTP Header:
Content-Security-Policy: script-src 'nonce-abc123'; style-src 'nonce-abc123'
-->
```

---

## 6. 全局属性速查表

### 基础属性

| 属性 | 用途 | 示例 |
|------|------|------|
| `id` | 唯一标识符 | `<div id="header">` |
| `class` | 类名 | `<div class="card active">` |
| `style` | 内联样式 | `<div style="color: red">` |
| `title` | 提示文本 | `<span title="说明">` |
| `lang` | 语言代码 | `<html lang="zh-CN">` |
| `dir` | 文本方向 | `<p dir="rtl">` |

### 交互属性

| 属性 | 用途 | 示例 |
|------|------|------|
| `tabindex` | Tab 顺序 | `<div tabindex="0">` |
| `contenteditable` | 可编辑 | `<div contenteditable>` |
| `draggable` | 可拖拽 | `<div draggable="true">` |
| `hidden` | 隐藏 | `<div hidden>` |
| `accesskey` | 快捷键 | `<button accesskey="s">` |
| `spellcheck` | 拼写检查 | `<input spellcheck="false">` |
| `autocapitalize` | 自动大写 | `<input autocapitalize="words">` |
| `autofocus` | 自动聚焦 | `<input autofocus>` |

### 数据与组件属性

| 属性 | 用途 | 示例 |
|------|------|------|
| `data-*` | 自定义数据 | `<div data-id="123">` |
| `is` | 自定义内置元素 | `<button is="my-button">` |
| `slot` | 插槽名称 | `<h2 slot="header">` |
| `part` | Shadow DOM 部分 | `<div part="header">` |
| `exportparts` | 导出部分 | `<x-tabs exportparts="tab">` |

### 无障碍属性

| 属性 | 用途 | 示例 |
|------|------|------|
| `role` | ARIA 角色 | `<div role="button">` |
| `aria-*` | ARIA 属性 | `<button aria-label="关闭">` |

### 移动端属性

| 属性 | 用途 | 示例 |
|------|------|------|
| `enterkeyhint` | 回车键提示 | `<input enterkeyhint="search">` |
| `inputmode` | 输入模式 | `<input inputmode="numeric">` |

### 其他属性

| 属性 | 用途 | 示例 |
|------|------|------|
| `translate` | 翻译控制 | `<code translate="no">` |
| `nonce` | CSP 随机数 | `<script nonce="...">` |

---

## 小结

### 属性分类速记

| 类别 | 重要属性 | 典型场景 |
|------|----------|----------|
| 基础 | id, class, style | 样式、脚本定位 |
| 交互 | tabindex, contenteditable | 自定义交互组件 |
| 数据 | data-* | 存储组件数据 |
| 无障碍 | role, aria-* | 屏幕阅读器支持 |
| 移动 | inputmode, enterkeyhint | 优化移动端输入 |

### 最佳实践

| 实践 | 说明 |
|------|------|
| 合理使用 id | 页面内唯一，避免滥用 |
| 语义化优先 | 先用语义标签，再用 ARIA |
| data-* 命名规范 | 使用小写，多个单词用连字符 |
| tabindex 谨慎使用 | 优先用自然 DOM 顺序 |
| 移动端优化 | 使用 inputmode 和 enterkeyhint 改善用户体验 |

---

## 参考资源

- [MDN 全局属性](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes)
- [ARIA 规范](https://www.w3.org/TR/wai-aria-1.2/)
- [自定义数据属性](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/data-*)
- [W3C HTML 规范](https://html.spec.whatwg.org/multipage/dom.html#global-attributes)

---

[返回上级目录](../index.md)
