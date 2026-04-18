# DOM 操作

DOM（Document Object Model，文档对象模型）是 JavaScript 操作网页内容的接口。本文档详细介绍 DOM 节点的查询、创建、修改、删除等操作。

---

## 目录

- [DOM 概述](#dom-概述)
- [节点类型](#节点类型)
- [节点查询](#节点查询)
- [节点遍历](#节点遍历)
- [节点创建](#节点创建)
- [节点操作](#节点操作)
- [属性操作](#属性操作)
- [样式操作](#样式操作)
- [内容操作](#内容操作)
- [DOM 性能优化](#dom-性能优化)
- [最佳实践](#最佳实践)

---

## DOM 概述

### 什么是 DOM？

DOM 是 HTML 文档的编程接口，它将网页表示为一个由节点组成的树形结构。

```html
<!DOCTYPE html>
<html>
  <head>
    <title>DOM 示例</title>
  </head>
  <body>
    <div id="app">
      <h1>标题</h1>
      <p class="text">段落</p>
    </div>
  </body>
</html>
```

对应的 DOM 树：

```
Document
└── html (HTMLElement)
    ├── head (HTMLHeadElement)
    │   └── title (HTMLTitleElement)
    │       └── "DOM 示例" (Text)
    └── body (HTMLBodyElement)
        └── div#app (HTMLDivElement)
            ├── h1 (HTMLHeadingElement)
            │   └── "标题" (Text)
            └── p.text (HTMLParagraphElement)
                └── "段落" (Text)
```

### document 对象

```javascript
// document 是 DOM 的入口点
console.log(document.nodeType);  // 9 (DOCUMENT_NODE)
console.log(document.nodeName);  // #document

// 文档信息
console.log(document.title);      // 页面标题
console.log(document.URL);        // 完整 URL
console.log(document.domain);     // 域名
console.log(document.referrer);   // 来源页面

// 文档状态
console.log(document.readyState); // 'loading' | 'interactive' | 'complete'
```

---

## 节点类型

### 节点类型常量

```javascript
// 12 种节点类型
Node.ELEMENT_NODE              // 1  元素节点
Node.ATTRIBUTE_NODE            // 2  属性节点（已废弃）
Node.TEXT_NODE                 // 3  文本节点
Node.CDATA_SECTION_NODE        // 4  CDATA 节点
Node.ENTITY_REFERENCE_NODE     // 5  实体引用（已废弃）
Node.ENTITY_NODE               // 6  实体（已废弃）
Node.PROCESSING_INSTRUCTION_NODE // 7 处理指令
Node.COMMENT_NODE              // 8  注释节点
Node.DOCUMENT_NODE             // 9  文档节点
Node.DOCUMENT_TYPE_NODE        // 10 文档类型
Node.DOCUMENT_FRAGMENT_NODE    // 11 文档片段
Node.NOTATION_NODE             // 12 符号（已废弃）
```

### 判断节点类型

```javascript
const element = document.querySelector('div');
const text = document.createTextNode('hello');

// nodeType 属性
console.log(element.nodeType);  // 1
console.log(text.nodeType);     // 3

// nodeName 属性
console.log(element.nodeName);  // 'DIV'
console.log(text.nodeName);     // '#text'

// instanceof 检查
console.log(element instanceof Element);   // true
console.log(element instanceof HTMLElement); // true
console.log(element instanceof HTMLDivElement); // true

// isElement() 辅助函数
function isElement(node) {
  return node.nodeType === Node.ELEMENT_NODE;
}

function isTextNode(node) {
  return node.nodeType === Node.TEXT_NODE;
}
```

---

## 节点查询

### 传统方法

```javascript
// 通过 ID 获取（最快）
const el = document.getElementById('app');
console.log(el);  // 元素或 null

// 通过标签名获取
const divs = document.getElementsByTagName('div');
console.log(divs);  // HTMLCollection（动态集合）

// 通过类名获取
const items = document.getElementsByClassName('item');
console.log(items);  // HTMLCollection（动态集合）

// 通过 name 属性获取
const inputs = document.getElementsByName('username');
console.log(inputs);  // NodeList
```

### 现代方法（推荐）

```javascript
// querySelector - 获取单个元素
const el = document.querySelector('#app');
const firstItem = document.querySelector('.item');
const attrEl = document.querySelector('[data-id="1"]');
const complex = document.querySelector('div.container > p.active');

// querySelectorAll - 获取所有匹配元素
const items = document.querySelectorAll('.item');
const paragraphs = document.querySelectorAll('div p');
const all = document.querySelectorAll('*');

// 在特定元素内查询
const container = document.getElementById('container');
const child = container.querySelector('.child');
const children = container.querySelectorAll('.item');
```

### HTMLCollection vs NodeList

```javascript
// HTMLCollection - 动态集合
const liveCollection = document.getElementsByClassName('item');
console.log(liveCollection.length);  // 3
document.body.appendChild(document.createElement('div')).className = 'item';
console.log(liveCollection.length);  // 4（自动更新）

// NodeList - 静态集合（querySelectorAll）
const staticList = document.querySelectorAll('.item');
console.log(staticList.length);  // 4
document.body.appendChild(document.createElement('div')).className = 'item';
console.log(staticList.length);  // 4（不会自动更新）

// 转换为数组
const arr1 = [...liveCollection];
const arr2 = Array.from(staticList);
const arr3 = Array.prototype.slice.call(liveCollection);
```

### 特殊元素快速获取

```javascript
// 文档根元素
console.log(document.documentElement);  // <html>
console.log(document.head);             // <head>
console.log(document.body);             // <body>

// 表单相关
console.log(document.forms);            // 所有表单
console.log(document.images);           // 所有图片
console.log(document.links);            // 所有链接
console.log(document.scripts);          // 所有脚本

// 获取当前焦点的元素
console.log(document.activeElement);

// 获取选中的文本
const selection = window.getSelection();
console.log(selection.toString());
```

---

## 节点遍历

### 父子关系遍历

```javascript
const el = document.querySelector('.item');

// 父节点
console.log(el.parentNode);        // 父节点
console.log(el.parentElement);     // 父元素节点

// 子节点
console.log(el.childNodes);        // 所有子节点（包含文本、注释等）
console.log(el.children);          // 只包含元素节点
console.log(el.firstChild);        // 第一个子节点
console.log(el.firstElementChild); // 第一个子元素
console.log(el.lastChild);         // 最后一个子节点
console.log(el.lastElementChild);  // 最后一个子元素

// 子节点数量
console.log(el.childNodes.length); // 所有节点数量
console.log(el.childElementCount); // 子元素数量（等同于 el.children.length）
```

### 兄弟关系遍历

```javascript
const el = document.querySelector('.item');

// 下一个兄弟
console.log(el.nextSibling);            // 下一个兄弟节点
console.log(el.nextElementSibling);     // 下一个兄弟元素

// 上一个兄弟
console.log(el.previousSibling);        // 上一个兄弟节点
console.log(el.previousElementSibling); // 上一个兄弟元素
```

### 遍历所有子元素

```javascript
// 遍历所有子元素
function traverseChildren(parent) {
  let child = parent.firstElementChild;
  while (child) {
    console.log(child);
    child = child.nextElementSibling;
  }
}

// 递归遍历所有后代
function traverseAll(element, callback, depth = 0) {
  callback(element, depth);

  for (const child of element.children) {
    traverseAll(child, callback, depth + 1);
  }
}

traverseAll(document.body, (el, depth) => {
  console.log('  '.repeat(depth) + el.tagName);
});
```

### contains() 判断包含关系

```javascript
const parent = document.querySelector('.parent');
const child = document.querySelector('.child');

// 判断是否是后代
console.log(parent.contains(child));  // true
console.log(child.contains(parent));  // false
console.log(parent.contains(parent)); // true（自己包含自己）
```

### compareDocumentPosition() 比较位置

```javascript
const el1 = document.querySelector('#el1');
const el2 = document.querySelector('#el2');

const position = el1.compareDocumentPosition(el2);
// 返回值是位掩码：
// 1: 不在同一文档
// 2: el2 在 el1 之前
// 4: el2 在 el1 之后
// 8: el2 包含 el1
// 16: el1 包含 el2

if (position & 4) {
  console.log('el2 在 el1 之后');
}
if (position & 16) {
  console.log('el1 包含 el2');
}
```

---

## 节点创建

### createElement 创建元素

```javascript
// 创建元素
const div = document.createElement('div');
div.id = 'container';
div.className = 'box';
div.textContent = 'Hello';

// 创建带命名空间的元素（SVG、MathML）
const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
```

### createTextNode 创建文本节点

```javascript
const text = document.createTextNode('Hello World');
console.log(text.nodeType);  // 3 (TEXT_NODE)
console.log(text.nodeValue); // 'Hello World'

// 添加到元素
const p = document.createElement('p');
p.appendChild(text);
```

### createDocumentFragment 创建文档片段

```javascript
// 文档片段是一个轻量级的容器
const fragment = document.createDocumentFragment();

for (let i = 0; i < 100; i++) {
  const li = document.createElement('li');
  li.textContent = `Item ${i}`;
  fragment.appendChild(li);
}

// 一次性添加到 DOM，只触发一次重排
document.getElementById('list').appendChild(fragment);
```

### createComment 创建注释

```javascript
const comment = document.createComment('这是一个注释');
document.body.appendChild(comment);
```

### innerHTML 创建元素

```javascript
// 使用 innerHTML 解析 HTML 字符串
const container = document.getElementById('container');
container.innerHTML = '<div class="item">Item 1</div>';

// 安全性问题：防止 XSS
const userInput = '<script>alert("XSS")</script>';
// ❌ 危险：会执行脚本
// container.innerHTML = userInput;

// ✅ 安全：先转义
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
container.innerHTML = escapeHtml(userInput);
```

### insertAdjacentHTML 高效插入

```javascript
const container = document.querySelector('#container');

// 四个位置：
// 'beforebegin': 元素之前
// 'afterbegin': 元素内部开头
// 'beforeend': 元素内部末尾
// 'afterend': 元素之后

container.insertAdjacentHTML('beforebegin', '<p>Before</p>');
container.insertAdjacentHTML('afterbegin', '<p>First child</p>');
container.insertAdjacentHTML('beforeend', '<p>Last child</p>');
container.insertAdjacentHTML('afterend', '<p>After</p>');

// 对应的元素插入方法
const newEl = document.createElement('p');
container.insertAdjacentElement('beforeend', newEl);
container.insertAdjacentText('beforeend', 'Text content');
```

---

## 节点操作

### appendChild 添加节点

```javascript
const parent = document.querySelector('#parent');
const child = document.createElement('div');

// 添加到末尾
parent.appendChild(child);

// 如果节点已存在，会移动而不是复制
const existing = document.querySelector('#existing');
parent.appendChild(existing);  // 从原位置移动到 parent 末尾
```

### insertBefore 插入节点

```javascript
const parent = document.querySelector('#parent');
const newItem = document.createElement('div');
const referenceItem = document.querySelector('#reference');

// 在 referenceItem 之前插入
parent.insertBefore(newItem, referenceItem);

// 插入到开头（reference 为 null）
parent.insertBefore(newItem, parent.firstChild);
```

### 现代插入方法

```javascript
const parent = document.querySelector('#parent');
const child1 = document.createElement('div');
const child2 = document.createElement('span');

// append - 末尾添加多个节点或字符串
parent.append(child1, child2, 'text');

// prepend - 开头添加
parent.prepend(child1, child2);

// before - 前面添加兄弟
parent.before(document.createElement('div'));

// after - 后面添加兄弟
parent.after(document.createElement('div'));

// 参数可以是字符串，会自动创建文本节点
parent.append('Some text');
```

### removeChild 移除节点

```javascript
const parent = document.querySelector('#parent');
const child = document.querySelector('#child');

// 通过父元素移除
const removed = parent.removeChild(child);
console.log(removed);  // 返回被移除的节点

// 移除所有子元素
while (parent.firstChild) {
  parent.removeChild(parent.firstChild);
}

// 更快的方式
parent.textContent = '';
```

### remove 移除自身

```javascript
const el = document.querySelector('#el');
el.remove();  // 直接移除自身

// 兼容性写法
if (el.remove) {
  el.remove();
} else {
  el.parentNode.removeChild(el);
}
```

### replaceChild 替换节点

```javascript
const parent = document.querySelector('#parent');
const newChild = document.createElement('div');
const oldChild = document.querySelector('#old');

// 替换节点
const replaced = parent.replaceChild(newChild, oldChild);
console.log(replaced);  // 返回被替换的节点
```

### replaceWith 替换自身

```javascript
const oldEl = document.querySelector('#old');
const newEl = document.createElement('div');

oldEl.replaceWith(newEl);

// 可以替换为多个节点
oldEl.replaceWith(document.createElement('span'), 'text', document.createElement('p'));
```

### cloneNode 克隆节点

```javascript
const original = document.querySelector('#original');

// 浅克隆：只克隆元素本身
const shallow = original.cloneNode();
console.log(shallow.children.length);  // 0

// 深克隆：克隆元素及其所有后代
const deep = original.cloneNode(true);
console.log(deep.children.length);  // 与 original 相同

// 注意：不会克隆事件监听器和自定义属性
original.customProp = 'value';
original.addEventListener('click', () => {});
const cloned = original.cloneNode(true);
console.log(cloned.customProp);  // undefined
cloned.click();  // 不会触发事件
```

### normalize 规范化节点

```javascript
const parent = document.createElement('div');
parent.appendChild(document.createTextNode('Hello'));
parent.appendChild(document.createTextNode(' '));
parent.appendChild(document.createTextNode('World'));
console.log(parent.childNodes.length);  // 3

// 合并相邻的文本节点
parent.normalize();
console.log(parent.childNodes.length);  // 1
```

---

## 属性操作

### HTML 属性 vs DOM 属性

```javascript
const input = document.querySelector('input');

// HTML 属性（attribute）：HTML 标签上的属性
console.log(input.getAttribute('value'));  // HTML 中的 value
input.setAttribute('value', 'new');

// DOM 属性（property）：JavaScript 对象上的属性
console.log(input.value);  // 当前输入值
input.value = 'new';

// 区别
input.value = 'user input';
console.log(input.getAttribute('value'));  // 初始值
console.log(input.value);                  // 当前值
```

### 标准属性

```javascript
const el = document.createElement('div');

// id 和 className
el.id = 'myId';
el.className = 'class1 class2';

// classList（推荐）
el.classList.add('class3');
el.classList.remove('class1');
el.classList.toggle('active');
el.classList.replace('old', 'new');
el.classList.contains('class2');  // true

// 批量操作
el.classList.add('a', 'b', 'c');
el.classList.remove('a', 'b');

// 检查多个类
['class1', 'class2'].every(c => el.classList.contains(c));
```

### getAttribute / setAttribute

```javascript
const el = document.querySelector('#el');

// 获取属性
console.log(el.getAttribute('id'));
console.log(el.getAttribute('class'));
console.log(el.getAttribute('data-id'));

// 设置属性
el.setAttribute('title', 'Tooltip');
el.setAttribute('data-custom', 'value');

// 移除属性
el.removeAttribute('disabled');

// 检查属性是否存在
console.log(el.hasAttribute('disabled'));

// 获取所有属性
for (const attr of el.attributes) {
  console.log(attr.name, attr.value);
}
```

### data-* 属性

```javascript
const el = document.querySelector('#el');

// 设置 data 属性
el.dataset.userId = '123';      // data-user-id="123"
el.dataset.userName = 'John';   // data-user-name="John"

// 读取 data 属性
console.log(el.dataset.userId);   // '123'
console.log(el.dataset.userName); // 'John'

// 删除 data 属性
delete el.dataset.userId;

// 遍历所有 data 属性
for (const [key, value] of Object.entries(el.dataset)) {
  console.log(`data-${key}: ${value}`);
}

// 注意：data 属性名转换规则
// data-user-id  -> dataset.userId
// data-userID   -> dataset.userid
// data-USER-ID  -> dataset.userId
```

### 布尔属性

```javascript
const input = document.querySelector('input');

// checked
input.checked = true;         // DOM 属性
input.setAttribute('checked', ''); // HTML 属性

// disabled
input.disabled = true;
input.removeAttribute('disabled');

// hidden
el.hidden = true;

// multiple, readonly, required, selected 等
```

### 自定义属性

```javascript
// 使用 data-* 属性（推荐）
el.dataset.customValue = 'value';

// 使用 setAttribute
el.setAttribute('custom-attr', 'value');

// 直接在 DOM 对象上设置
el.customProp = 'value';  // 不推荐，不会反映到 HTML
```

---

## 样式操作

### 行内样式

```javascript
const el = document.querySelector('#el');

// 单个样式
el.style.color = 'red';
el.style.fontSize = '16px';
el.style.backgroundColor = '#fff';

// 注意：属性名使用驼峰命名
// background-color -> backgroundColor
// margin-top -> marginTop

// cssText 批量设置
el.style.cssText = 'color: red; font-size: 16px;';

// 追加样式
el.style.cssText += '; padding: 10px;';

// 清除所有行内样式
el.style.cssText = '';

// 获取行内样式值
console.log(el.style.color);  // 只能获取行内样式
```

### getComputedStyle 获取计算样式

```javascript
const el = document.querySelector('#el');

// 获取所有计算样式
const styles = window.getComputedStyle(el);
console.log(styles.color);        // rgb(255, 0, 0)
console.log(styles.fontSize);     // 16px
console.log(styles.display);      // block

// 获取伪元素样式
const beforeStyles = window.getComputedStyle(el, '::before');
console.log(beforeStyles.content);

// 注意：getComputedStyle 返回的值可能是计算后的值
console.log(styles.width);  // '100px' 而不是 '50%'
```

### className 和 classList

```javascript
const el = document.querySelector('#el');

// className（字符串操作）
el.className = 'class1 class2';
el.className += ' class3';

// classList（推荐，更灵活）
el.classList.add('active', 'visible');
el.classList.remove('hidden');
el.classList.toggle('expanded');
el.classList.replace('old', 'new');

// 条件切换
el.classList.toggle('dark', isDarkMode);

// 检查是否存在
if (el.classList.contains('active')) {
  // ...
}
```

### CSS 变量操作

```javascript
const el = document.querySelector('#el');

// 设置 CSS 变量
el.style.setProperty('--main-color', '#ff0000');
el.style.setProperty('--padding', '20px');

// 获取 CSS 变量
const color = el.style.getPropertyValue('--main-color');
console.log(color);  // '#ff0000'

// 删除 CSS 变量
el.style.removeProperty('--main-color');

// 在根元素设置全局变量
document.documentElement.style.setProperty('--theme-color', '#007bff');
```

### 动态加载样式表

```javascript
// 添加 link 标签
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = '/styles/dark.css';
document.head.appendChild(link);

// 添加 style 标签
const style = document.createElement('style');
style.textContent = `
  .custom-class {
    color: red;
  }
`;
document.head.appendChild(style);
```

---

## 内容操作

### innerHTML

```javascript
const el = document.querySelector('#el');

// 设置 HTML 内容
el.innerHTML = '<span>Hello</span>';

// 获取 HTML 内容
console.log(el.innerHTML);

// 安全警告：XSS 攻击
const userInput = '<img src=x onerror=alert(1)>';
// el.innerHTML = userInput;  // 危险！

// 安全方式
function setHTML(element, html) {
  // 使用 DOMPurify 库清理 HTML
  element.innerHTML = DOMPurify.sanitize(html);
}
```

### textContent vs innerText

```javascript
const el = document.querySelector('#el');

// textContent - 所有文本内容
el.textContent = '<script>alert(1)</script>';  // 作为纯文本
console.log(el.textContent);  // 获取所有文本，包括隐藏的

// innerText - 可见文本（考虑 CSS）
el.innerText = 'Hello';
console.log(el.innerText);  // 只返回可见文本

// 区别
const div = document.createElement('div');
div.innerHTML = '<span style="display:none">Hidden</span>Visible';
console.log(div.textContent);  // 'HiddenVisible'
console.log(div.innerText);    // 'Visible'

// 性能：textContent 更快
// 推荐：纯文本使用 textContent
```

### outerHTML

```javascript
const el = document.querySelector('#el');

// 获取包含自身的 HTML
console.log(el.outerHTML);
// <div id="el">Content</div>

// 替换整个元素
el.outerHTML = '<section id="newEl">New Content</section>';

// 注意：原 el 变量仍然指向旧元素（已不在文档中）
```

### 表单元素值

```javascript
// input / textarea
const input = document.querySelector('input');
input.value = 'new value';
console.log(input.value);

// select
const select = document.querySelector('select');
console.log(select.value);           // 选中的值
console.log(select.selectedIndex);   // 选中项索引
console.log(select.selectedOptions); // 选中的 option 元素

// checkbox / radio
const checkbox = document.querySelector('input[type="checkbox"]');
console.log(checkbox.checked);
checkbox.checked = true;

// 多选
const multiselect = document.querySelector('select[multiple]');
const selectedValues = [...multiselect.selectedOptions].map(opt => opt.value);
```

---

## DOM 性能优化

### 使用文档片段

```javascript
// ❌ 不推荐：每次插入都触发重排
for (let i = 0; i < 1000; i++) {
  const li = document.createElement('li');
  li.textContent = `Item ${i}`;
  list.appendChild(li);
}

// ✅ 推荐：使用文档片段
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const li = document.createElement('li');
  li.textContent = `Item ${i}`;
  fragment.appendChild(li);
}
list.appendChild(fragment);
```

### 批量更新

```javascript
// ❌ 多次访问布局属性
for (let i = 0; i < elements.length; i++) {
  elements[i].style.width = elements[i].offsetWidth + 10 + 'px';
}

// ✅ 批量读取，批量写入
const widths = elements.map(el => el.offsetWidth);
elements.forEach((el, i) => {
  el.style.width = widths[i] + 10 + 'px';
});
```

### 使用 cloneNode

```javascript
// 创建模板元素，然后克隆
const template = document.createElement('li');
template.className = 'item';

const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const li = template.cloneNode(true);
  li.textContent = `Item ${i}`;
  fragment.appendChild(li);
}
list.appendChild(fragment);
```

### 隐藏元素后操作

```javascript
// 隐藏元素后进行大量 DOM 操作
const list = document.querySelector('#list');
list.style.display = 'none';

// 进行 DOM 操作...
for (let i = 0; i < 1000; i++) {
  const li = document.createElement('li');
  list.appendChild(li);
}

list.style.display = '';
```

### 虚拟滚动

```javascript
// 对于大量列表项，只渲染可见区域
class VirtualList {
  constructor(container, options) {
    this.container = container;
    this.itemHeight = options.itemHeight;
    this.items = options.items;
    this.visibleCount = Math.ceil(container.clientHeight / this.itemHeight);

    this.render();
    container.addEventListener('scroll', this.onScroll.bind(this));
  }

  onScroll() {
    const scrollTop = this.container.scrollTop;
    const startIndex = Math.floor(scrollTop / this.itemHeight);
    this.render(startIndex);
  }

  render(startIndex = 0) {
    const visibleItems = this.items.slice(
      startIndex,
      startIndex + this.visibleCount + 1
    );

    this.container.innerHTML = visibleItems.map((item, i) =>
      `<div style="height:${this.itemHeight}px;transform:translateY(${(startIndex + i) * this.itemHeight}px)">${item}</div>`
    ).join('');
  }
}
```

---

## 最佳实践

### 1. 缓存 DOM 引用

```javascript
// ❌ 每次都查询
function updateUI() {
  document.querySelector('#el').textContent = '1';
  document.querySelector('#el').classList.add('active');
  document.querySelector('#el').style.color = 'red';
}

// ✅ 缓存引用
const el = document.querySelector('#el');
function updateUI() {
  el.textContent = '1';
  el.classList.add('active');
  el.style.color = 'red';
}
```

### 2. 使用现代 API

```javascript
// ❌ 旧方法
el.className += ' active';

// ✅ 新方法
el.classList.add('active');

// ❌ 旧方法
parent.appendChild(child);

// ✅ 新方法（更语义化）
parent.append(child);
```

### 3. 避免直接拼接 HTML

```javascript
// ❌ XSS 风险
const name = getUserInput();
el.innerHTML = `<div>${name}</div>`;

// ✅ 使用 textContent
el.textContent = name;

// ✅ 或使用 DOM 方法创建
const div = document.createElement('div');
div.textContent = name;
el.appendChild(div);
```

### 4. 使用事件委托

```javascript
// ❌ 每个子元素绑定事件
document.querySelectorAll('.item').forEach(item => {
  item.addEventListener('click', handleClick);
});

// ✅ 事件委托
document.querySelector('#list').addEventListener('click', (e) => {
  if (e.target.matches('.item')) {
    handleClick(e);
  }
});
```

### 5. 使用模板字符串创建元素

```javascript
// 使用 <template> 标签
const template = document.querySelector('#item-template');
const content = template.content.cloneNode(true);
content.querySelector('.title').textContent = 'Title';
document.body.appendChild(content);
```

---

## 参考资源

- [MDN - Document Object Model](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model)
- [MDN - Element](https://developer.mozilla.org/zh-CN/docs/Web/API/Element)
- [JavaScript Info - DOM](https://javascript.info/document)
- [DOM Standard](https://dom.spec.whatwg.org/)

---

[返回模块目录](./)
