# 十三、Web Components

## 自定义元素

```html
<script>
class MyButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                button { 
                    background: blue; 
                    color: white; 
                    padding: 10px 20px;
                }
            </style>
            <button><slot></slot></button>
        `;
    }
}

customElements.define('my-button', MyButton);
</script>

<my-button>点击我</my-button>
```

---

## Shadow DOM

```html
<script>
class MyCard extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
            <style>
                :host { display: block; border: 1px solid #ccc; padding: 16px; }
                .title { font-size: 18px; font-weight: bold; }
            </style>
            <div class="title"><slot name="title"></slot></div>
            <div class="content"><slot></slot></div>
        `;
    }
}

customElements.define('my-card', MyCard);
</script>

<my-card>
    <h2 slot="title">卡片标题</h2>
    <p>卡片内容</p>
</my-card>
```

---

## template 元素

```html
<template id="card-template">
    <style>
        .card { border: 1px solid #ccc; padding: 16px; }
    </style>
    <div class="card">
        <slot></slot>
    </div>
</template>

<script>
const template = document.getElementById('card-template');
const content = template.content.cloneNode(true);
document.body.appendChild(content);
</script>
```

---

[返回上级目录](../README.md)
