# DOM 操作

## 节点查询

```javascript
// 获取单个元素
document.getElementById('id');
document.querySelector('.class');
document.querySelector('[data-id="1"]');

// 获取多个元素
document.getElementsByClassName('class');  // HTMLCollection
document.getElementsByTagName('div');       // HTMLCollection
document.querySelectorAll('.class');       // NodeList

// 现代方法（推荐）
const el = document.querySelector('#app');
const els = document.querySelectorAll('.item');

// 转换为数组
[...els];
Array.from(els);
```

---

## 节点创建与操作

```javascript
// 创建元素
const div = document.createElement('div');
const text = document.createTextNode('Hello');
const fragment = document.createDocumentFragment();

// 添加元素
parent.appendChild(child);
parent.insertBefore(newNode, referenceNode);
parent.append(child1, child2);      // 末尾添加多个
parent.prepend(child1, child2);     // 开头添加
parent.before(sibling);             // 前面添加
parent.after(sibling);              // 后面添加

// 删除元素
parent.removeChild(child);
child.remove();

// 替换元素
parent.replaceChild(newChild, oldChild);
oldChild.replaceWith(newChild);

// 克隆元素
el.cloneNode();        // 浅克隆
el.cloneNode(true);    // 深克隆
```

---

## 属性操作

```javascript
// 标准属性
el.id = 'newId';
el.className = 'class1 class2';
el.classList.add('class3');
el.classList.remove('class1');
el.classList.toggle('active');
el.classList.contains('class1');

// 自定义属性
el.setAttribute('data-id', '123');
el.getAttribute('data-id');
el.removeAttribute('data-id');
el.dataset.id;  // data-id 属性

// data-* 属性
el.dataset.userId = '456';    // data-user-id="456"
console.log(el.dataset.userId); // '456'
```

---

## 样式操作

```javascript
// 行内样式
el.style.color = 'red';
el.style.fontSize = '16px';
el.style.cssText = 'color: red; font-size: 16px;';

// 计算样式
const styles = window.getComputedStyle(el);
console.log(styles.color);

// 类名操作
el.classList.add('active');
el.classList.remove('active');
el.classList.toggle('active');
el.classList.replace('old', 'new');
```

---

## 内容操作

```javascript
// innerHTML - 解析 HTML
el.innerHTML = '<span>Hello</span>';

// textContent - 纯文本（推荐）
el.textContent = '<span>Hello</span>'; // 不解析 HTML

// innerText - 可见文本（考虑 CSS）
el.innerText = 'Hello';

// outerHTML - 包含自身
el.outerHTML = '<div>New</div>';

// 表单值
input.value;
input.value = 'new value';
```

---

[返回模块目录](./README.md)
