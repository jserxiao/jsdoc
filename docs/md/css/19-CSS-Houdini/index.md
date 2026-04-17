# 十九、CSS Houdini

## CSS Painting API

```javascript
// registerPaint('myGradient', class)
registerPaint('fancy-gradient', class {
    static get inputProperties() {
        return ['--gradient-colors'];
    }
    
    paint(ctx, size, properties) {
        const colors = properties.get('--gradient-colors');
        // 绑制自定义渐变...
        ctx.fillStyle = 'blue';
        ctx.fillRect(0, 0, size.width, size.height);
    }
});
```

```css
.element {
    --gradient-colors: red, blue;
    background: paint(fancy-gradient);
}
```

---

## CSS Properties and Values API

```javascript
CSS.registerProperty({
    name: '--my-color',
    syntax: '<color>',
    inherits: false,
    initialValue: 'black'
});
```

---

## Worklet

```javascript
// 动画 Worklet
await CSS.animationWorklet.addModule('my-animation.js');

// 布局 Worklet
await CSS.layoutWorklet.addModule('my-layout.js');
```

---

[返回上级目录](../README.md)
