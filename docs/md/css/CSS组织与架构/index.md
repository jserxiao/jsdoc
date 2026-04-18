# CSS 组织与架构

## 命名方法论

```css
/* BEM */
.block { }
.block__element { }
.block--modifier { }

/* 示例 */
.card { }
.card__header { }
.card__body { }
.card--featured { }

/* OOCSS */
/* 结构与皮肤分离 */
.btn { padding: 10px 20px; }
.btn-primary { background: blue; }
.btn-secondary { background: gray; }

/* SMACSS */
/* 分类：base, layout, module, state, theme */
```

---

## 文件组织

```
styles/
├── base/
│   ├── _reset.scss
│   ├── _typography.scss
│   └── _variables.scss
├── components/
│   ├── _button.scss
│   ├── _card.scss
│   └── _form.scss
├── layout/
│   ├── _header.scss
│   ├── _footer.scss
│   └── _grid.scss
├── utils/
│   ├── _mixins.scss
│   └── _functions.scss
└── main.scss
```

---

## CSS Modules

```css
/* 组件内局部作用域 */
/* Button.module.css */
.button {
    background: blue;
}

/* 使用 */
import styles from './Button.module.css';
<button className={styles.button}>
```

---

[返回上级目录](../README.md)
