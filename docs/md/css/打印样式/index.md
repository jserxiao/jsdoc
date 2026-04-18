# 打印样式

```css
@media print {
    /* 隐藏不需要打印的元素 */
    nav, footer, .no-print {
        display: none;
    }
    
    /* 显示链接 URL */
    a[href]::after {
        content: " (" attr(href) ")";
    }
    
    /* 分页控制 */
    h1, h2, h3 {
        page-break-after: avoid;
    }
    
    .new-page {
        page-break-before: always;
    }
    
    /* 打印颜色 */
    * {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }
    
    /* 背景 */
    body {
        background: white;
    }
}
```

---

[返回上级目录](../README.md)
