# 十一、全局属性

## 基础全局属性

```html
<!-- id - 唯一标识 -->
<div id="main"></div>

<!-- class - 类名 -->
<div class="container active"></div>

<!-- style - 内联样式 -->
<div style="color: red;"></div>

<!-- title - 提示文本 -->
<span title="完整内容">部分内容...</span>

<!-- lang - 语言 -->
<p lang="zh-CN">中文内容</p>

<!-- dir - 文本方向 -->
<p dir="rtl">从右到左</p>
```

---

## 交互属性

```html
<!-- tabindex - Tab 键顺序 -->
<button tabindex="0">可聚焦</button>
<div tabindex="-1">编程聚焦</div>

<!-- contenteditable - 可编辑 -->
<div contenteditable="true">可编辑内容</div>

<!-- draggable - 可拖拽 -->
<div draggable="true">可拖拽</div>

<!-- hidden - 隐藏 -->
<div hidden>隐藏元素</div>

<!-- accesskey - 快捷键 -->
<button accesskey="s">保存 (Alt+S)</button>
```

---

## 数据属性

```html
<!-- data-* 自定义数据 -->
<div 
    data-id="123" 
    data-name="John"
    data-user-role="admin"
>

<script>
const el = document.querySelector('div');
console.log(el.dataset.id);       // '123'
console.log(el.dataset.userName); // 'John' (自动转驼峰)
console.log(el.dataset.userRole); // 'admin'
</script>
```

---

[返回上级目录](../README.md)
