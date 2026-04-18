# 表格

> HTML 表格用于展示二维数据。正确使用表格标签不仅能让数据清晰呈现，还能提升可访问性和 SEO。内容参考《HTML5 权威指南》等经典著作。

## 学习要点

- 📊 理解表格的语义结构
- 🏗️ 掌握表格分组的使用
- 🔗 学会单元格合并技巧
- ♿ 了解表格的可访问性最佳实践

---

## 1. 表格基本结构

### 1.1 基础表格

```html
<table>
    <tr>
        <th>姓名</th>
        <th>年龄</th>
        <th>城市</th>
    </tr>
    <tr>
        <td>张三</td>
        <td>25</td>
        <td>北京</td>
    </tr>
    <tr>
        <td>李四</td>
        <td>30</td>
        <td>上海</td>
    </tr>
</table>
```

### 1.2 表格元素说明

| 元素 | 说明 | 使用场景 |
|------|------|----------|
| `<table>` | 表格容器 | 包装整个表格 |
| `<tr>` | 表格行 | 每一行数据 |
| `<th>` | 表头单元格 | 列标题/行标题 |
| `<td>` | 数据单元格 | 实际数据 |
| `<caption>` | 表格标题 | 表格说明文字 |

### 1.3 完整结构（带分组）

```html
<table>
    <caption>员工信息表</caption>
    
    <thead>
        <tr>
            <th>编号</th>
            <th>姓名</th>
            <th>部门</th>
            <th>薪资</th>
        </tr>
    </thead>
    
    <tbody>
        <tr>
            <td>001</td>
            <td>张三</td>
            <td>技术部</td>
            <td>15000</td>
        </tr>
        <tr>
            <td>002</td>
            <td>李四</td>
            <td>市场部</td>
            <td>12000</td>
        </tr>
    </tbody>
    
    <tfoot>
        <tr>
            <td colspan="3">合计</td>
            <td>27000</td>
        </tr>
    </tfoot>
</table>
```

---

## 2. 表格分组

### 2.1 thead、tbody、tfoot

```html
<table>
    <!-- 表头区：定义列标题 -->
    <thead>
        <tr>
            <th>月份</th>
            <th>销售额</th>
            <th>利润</th>
        </tr>
    </thead>
    
    <!-- 表体区：实际数据 -->
    <tbody>
        <tr>
            <td>一月</td>
            <td>100,000</td>
            <td>20,000</td>
        </tr>
        <tr>
            <td>二月</td>
            <td>120,000</td>
            <td>25,000</td>
        </tr>
        <tr>
            <td>三月</td>
            <td>150,000</td>
            <td>35,000</td>
        </tr>
    </tbody>
    
    <!-- 表尾区：汇总信息 -->
    <tfoot>
        <tr>
            <th>季度合计</th>
            <td>370,000</td>
            <td>80,000</td>
        </tr>
    </tfoot>
</table>
```

### 2.2 分组的好处

```html
<!-- 语义化：帮助理解表格结构 -->
<!-- 可访问性：屏幕阅读器能正确解读 -->
<!-- 样式控制：可以分别设置样式 -->

<style>
    thead {
        background: #f5f5f5;
    }
    tbody tr:hover {
        background: #e8f4ff;
    }
    tfoot {
        font-weight: bold;
        background: #f0f0f0;
    }
</style>
```

### 2.3 多个 tbody

```html
<!-- 按类别分组数据 -->
<table>
    <caption>产品销售统计</caption>
    <thead>
        <tr>
            <th>产品</th>
            <th>销量</th>
            <th>金额</th>
        </tr>
    </thead>
    
    <!-- 电子产品组 -->
    <tbody>
        <tr>
            <th colspan="3" class="category">电子产品</th>
        </tr>
        <tr>
            <td>手机</td>
            <td>1000</td>
            <td>500,000</td>
        </tr>
        <tr>
            <td>电脑</td>
            <td>500</td>
            <td>750,000</td>
        </tr>
    </tbody>
    
    <!-- 家电产品组 -->
    <tbody>
        <tr>
            <th colspan="3" class="category">家电产品</th>
        </tr>
        <tr>
            <td>冰箱</td>
            <td>200</td>
            <td>300,000</td>
        </tr>
        <tr>
            <td>洗衣机</td>
            <td>150</td>
            <td>150,000</td>
        </tr>
    </tbody>
    
    <tfoot>
        <tr>
            <td>总计</td>
            <td>1850</td>
            <td>1,700,000</td>
        </tr>
    </tfoot>
</table>
```

---

## 3. 单元格合并

### 3.1 colspan（跨列合并）

```html
<table>
    <tr>
        <td colspan="2">跨两列</td>
        <td>普通单元格</td>
    </tr>
    <tr>
        <td colspan="3">跨三列</td>
    </tr>
    <tr>
        <td>单元格1</td>
        <td>单元格2</td>
        <td>单元格3</td>
    </tr>
</table>
```

### 3.2 rowspan（跨行合并）

```html
<table>
    <tr>
        <td rowspan="2">跨两行</td>
        <td>单元格A</td>
    </tr>
    <tr>
        <td>单元格B</td>
    </tr>
    <tr>
        <td>普通单元格</td>
        <td>单元格C</td>
    </tr>
</table>
```

### 3.3 复杂合并示例

```html
<table>
    <tr>
        <th rowspan="2">地区</th>
        <th colspan="3">销售数据</th>
    </tr>
    <tr>
        <th>Q1</th>
        <th>Q2</th>
        <th>Q3</th>
    </tr>
    <tr>
        <td rowspan="2">华东</td>
        <td>100</td>
        <td>120</td>
        <td>150</td>
    </tr>
    <tr>
        <td>90</td>
        <td>110</td>
        <td>140</td>
    </tr>
    <tr>
        <td>华北</td>
        <td>80</td>
        <td>95</td>
        <td>100</td>
    </tr>
    <tr>
        <td>总计</td>
        <td colspan="3">985</td>
    </tr>
</table>
```

### 3.4 合并示意图

```
colspan="3":    rowspan="2":
┌──────────────┐    ┌──────┬──────┐
│              │    │      │  A   │
│   跨三列      │    │ 跨   ├──────┤
│              │    │ 两   │  B   │
└──────────────┘    │ 行   ├──────┤
                    │      │  C   │
                    └──────┴──────┘
```

---

## 4. 表格标题与说明

### 4.1 caption（表格标题）

```html
<table>
    <caption>2024年销售数据统计表</caption>
    <tr>
        <th>月份</th>
        <th>销售额</th>
    </tr>
    <!-- ... -->
</table>

<!-- caption 位置控制 -->
<style>
    caption {
        caption-side: top;    /* 默认：标题在上方 */
        /* caption-side: bottom; */  /* 标题在下方 */
        text-align: left;
        font-weight: bold;
        padding: 10px 0;
    }
</style>
```

### 4.2 表格摘要（可访问性）

```html
<!-- 使用 aria-describedby 关联说明 -->
<table aria-describedby="table-summary">
    <caption>员工薪资表</caption>
    <!-- ... -->
</table>

<p id="table-summary" class="sr-only">
    此表格展示公司各部门员工的薪资信息，
    包含员工编号、姓名、部门和月薪数据。
</p>
```

---

## 5. th 表头详解

### 5.1 scope 属性

```html
<table>
    <!-- 列表头 -->
    <tr>
        <th scope="col">姓名</th>
        <th scope="col">年龄</th>
        <th scope="col">城市</th>
    </tr>
    <tr>
        <!-- 行表头 -->
        <th scope="row">张三</th>
        <td>25</td>
        <td>北京</td>
    </tr>
    <tr>
        <th scope="row">李四</th>
        <td>30</td>
        <td>上海</td>
    </tr>
</table>
```

### 5.2 scope 值说明

| 值 | 说明 | 使用场景 |
|------|------|----------|
| `col` | 列表头 | 列标题 |
| `row` | 行表头 | 行标题 |
| `colgroup` | 列组表头 | 跨多列的标题 |
| `rowgroup` | 行组表头 | 跨多行的标题 |

### 5.3 复杂表头

```html
<table>
    <thead>
        <tr>
            <th rowspan="2" scope="col">地区</th>
            <th colspan="2" scope="colgroup">上半年</th>
            <th colspan="2" scope="colgroup">下半年</th>
        </tr>
        <tr>
            <th scope="col">Q1</th>
            <th scope="col">Q2</th>
            <th scope="col">Q3</th>
            <th scope="col">Q4</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">华东</th>
            <td>100</td>
            <td>120</td>
            <td>150</td>
            <td>180</td>
        </tr>
    </tbody>
</table>
```

### 5.4 headers 属性

```html
<!-- 复杂表格使用 headers 关联表头 -->
<table>
    <thead>
        <tr>
            <th id="name">姓名</th>
            <th id="subject">科目</th>
            <th id="score">分数</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan="2" headers="name">张三</td>
            <td headers="subject">数学</td>
            <td headers="score">95</td>
        </tr>
        <tr>
            <td headers="subject">英语</td>
            <td headers="score">88</td>
        </tr>
    </tbody>
</table>
```

---

## 6. 响应式表格

### 6.1 水平滚动

```html
<!-- 最常见的响应式方案 -->
<div class="table-container">
    <table>
        <!-- 表格内容 -->
    </table>
</div>

<style>
    .table-container {
        width: 100%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;  /* iOS 平滑滚动 */
    }
    
    table {
        width: 100%;
        min-width: 600px;  /* 设置最小宽度 */
    }
</style>
```

### 6.2 隐藏列

```html
<table class="responsive-table">
    <thead>
        <tr>
            <th>姓名</th>
            <th class="hide-mobile">年龄</th>
            <th>城市</th>
            <th class="hide-mobile">邮箱</th>
        </tr>
    </thead>
    <!-- ... -->
</table>

<style>
    @media (max-width: 600px) {
        .hide-mobile {
            display: none;
        }
    }
</style>
```

### 6.3 卡片式布局

```html
<style>
    @media (max-width: 600px) {
        /* 隐藏表头 */
        .responsive-table thead {
            display: none;
        }
        
        /* 每行变成卡片 */
        .responsive-table tr {
            display: block;
            margin-bottom: 1rem;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        
        /* 每个单元格显示标签 */
        .responsive-table td {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem;
            border-bottom: 1px solid #eee;
        }
        
        .responsive-table td::before {
            content: attr(data-label);
            font-weight: bold;
        }
    }
</style>

<table class="responsive-table">
    <thead>
        <tr>
            <th>姓名</th>
            <th>年龄</th>
            <th>城市</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td data-label="姓名">张三</td>
            <td data-label="年龄">25</td>
            <td data-label="城市">北京</td>
        </tr>
    </tbody>
</table>
```

---

## 7. 表格样式

### 7.1 基础样式

```css
/* 表格基础样式 */
table {
    width: 100%;
    border-collapse: collapse;  /* 合并边框 */
}

th, td {
    padding: 12px 15px;
    text-align: left;
    border: 1px solid #ddd;
}

th {
    background: #f5f5f5;
    font-weight: 600;
}

/* 条纹行 */
tbody tr:nth-child(odd) {
    background: #f9f9f9;
}

/* 悬停效果 */
tbody tr:hover {
    background: #e8f4ff;
}
```

### 7.2 边框模型

```css
/* 分离边框（默认） */
table {
    border-collapse: separate;
    border-spacing: 2px;  /* 单元格间距 */
}

/* 合并边框（常用） */
table {
    border-collapse: collapse;
}
```

```
border-collapse: separate:    border-collapse: collapse:
┌───┐   ┌───┐   ┌───┐        ┌───┬───┬───┐
│ A │   │ B │   │ C │        │ A │ B │ C │
└───┘   └───┘   └───┘        ├───┼───┼───┤
┌───┐   ┌───┐   ┌───┐        │ D │ E │ F │
│ D │   │ E │   │ F │        └───┴───┴───┘
└───┘   └───┘   └───┘
     单元格有间距              单元格共享边框
```

### 7.3 表格布局

```css
/* 自动布局（默认） */
table {
    table-layout: auto;
    /* 列宽由内容决定 */
}

/* 固定布局 */
table {
    table-layout: fixed;
    /* 列宽由第一行或宽度设置决定 */
    /* 性能更好，适合大数据表格 */
}
```

### 7.4 空单元格处理

```css
/* 显示空单元格边框 */
table {
    empty-cells: show;   /* 默认 */
}

/* 隐藏空单元格边框 */
table {
    empty-cells: hide;
}

/* 使用 border-collapse: collapse 时无效 */
```

---

## 8. 表格可访问性

### 8.1 语义化结构

```html
<!-- 完整的可访问性表格 -->
<table 
    role="table"
    aria-label="员工信息表"
    summary="包含员工姓名、部门和薪资信息">
    
    <caption>员工信息统计</caption>
    
    <thead>
        <tr>
            <th scope="col">姓名</th>
            <th scope="col">部门</th>
            <th scope="col">薪资</th>
        </tr>
    </thead>
    
    <tbody>
        <tr>
            <td>张三</td>
            <td>技术部</td>
            <td>15,000</td>
        </tr>
    </tbody>
</table>
```

### 8.2 可排序表格

```html
<table>
    <thead>
        <tr>
            <th scope="col" aria-sort="ascending">
                <button>
                    姓名
                    <span aria-hidden="true">↑</span>
                </button>
            </th>
            <th scope="col" aria-sort="none">
                <button>
                    薪资
                    <span aria-hidden="true">↕</span>
                </button>
            </th>
        </tr>
    </thead>
</table>

<!-- aria-sort 值：ascending, descending, none -->
```

### 8.3 表格键盘导航

```javascript
// 实现表格键盘导航
const table = document.querySelector('table');

table.addEventListener('keydown', (e) => {
    const cell = document.activeElement.closest('td, th');
    if (!cell) return;
    
    const row = cell.parentElement;
    const cells = Array.from(row.children);
    const colIndex = cells.indexOf(cell);
    
    let targetCell;
    
    switch (e.key) {
        case 'ArrowRight':
            targetCell = cells[colIndex + 1];
            break;
        case 'ArrowLeft':
            targetCell = cells[colIndex - 1];
            break;
        case 'ArrowDown':
            const nextRow = row.nextElementSibling;
            if (nextRow) {
                targetCell = nextRow.children[colIndex];
            }
            break;
        case 'ArrowUp':
            const prevRow = row.previousElementSibling;
            if (prevRow) {
                targetCell = prevRow.children[colIndex];
            }
            break;
    }
    
    if (targetCell) {
        targetCell.focus();
    }
});
```

---

## 9. 实战示例

### 9.1 财务报表

```html
<table class="financial-table">
    <caption>2024年度财务报表</caption>
    <thead>
        <tr>
            <th rowspan="2">项目</th>
            <th colspan="4" scope="colgroup">季度数据（万元）</th>
        </tr>
        <tr>
            <th scope="col">Q1</th>
            <th scope="col">Q2</th>
            <th scope="col">Q3</th>
            <th scope="col">Q4</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">营业收入</th>
            <td>1,200</td>
            <td>1,500</td>
            <td>1,800</td>
            <td>2,100</td>
        </tr>
        <tr>
            <th scope="row">营业成本</th>
            <td>800</td>
            <td>950</td>
            <td>1,100</td>
            <td>1,300</td>
        </tr>
        <tr>
            <th scope="row">利润总额</th>
            <td>400</td>
            <td>550</td>
            <td>700</td>
            <td>800</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <th scope="row">年度合计</th>
            <td colspan="4">6,600（收入） / 4,150（成本）</td>
        </tr>
    </tfoot>
</table>
```

### 9.2 数据对比表

```html
<table class="comparison-table">
    <caption>产品功能对比</caption>
    <thead>
        <tr>
            <th scope="col">功能</th>
            <th scope="col">基础版</th>
            <th scope="col">专业版</th>
            <th scope="col">企业版</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">存储空间</th>
            <td>5GB</td>
            <td>50GB</td>
            <td>无限制</td>
        </tr>
        <tr>
            <th scope="row">用户数量</th>
            <td>1人</td>
            <td>5人</td>
            <td>无限制</td>
        </tr>
        <tr>
            <th scope="row">技术支持</th>
            <td>社区支持</td>
            <td>邮件支持</td>
            <td>24/7 专属客服</td>
        </tr>
        <tr>
            <th scope="row">API 访问</th>
            <td>❌</td>
            <td>✓</td>
            <td>✓</td>
        </tr>
        <tr class="price-row">
            <th scope="row">价格</th>
            <td>免费</td>
            <td>¥99/月</td>
            <td>¥299/月</td>
        </tr>
    </tbody>
</table>
```

### 9.3 排行榜表格

```html
<table class="ranking-table">
    <caption>销售排行榜</caption>
    <thead>
        <tr>
            <th scope="col">排名</th>
            <th scope="col">销售员</th>
            <th scope="col">部门</th>
            <th scope="col">销售额</th>
            <th scope="col">环比</th>
        </tr>
    </thead>
    <tbody>
        <tr class="rank-1">
            <td><span class="medal">🥇</span>1</td>
            <td>张三</td>
            <td>华东区</td>
            <td>¥1,500,000</td>
            <td class="increase">↑15%</td>
        </tr>
        <tr class="rank-2">
            <td><span class="medal">🥈</span>2</td>
            <td>李四</td>
            <td>华北区</td>
            <td>¥1,200,000</td>
            <td class="increase">↑8%</td>
        </tr>
        <tr class="rank-3">
            <td><span class="medal">🥉</span>3</td>
            <td>王五</td>
            <td>华南区</td>
            <td>¥1,000,000</td>
            <td class="decrease">↓3%</td>
        </tr>
    </tbody>
</table>
```

---

## 小结

### 表格元素速查

| 元素 | 说明 | 是否必须 |
|------|------|----------|
| `<table>` | 表格容器 | 必须 |
| `<tr>` | 表格行 | 必须 |
| `<th>` | 表头单元格 | 推荐 |
| `<td>` | 数据单元格 | 必须 |
| `<caption>` | 表格标题 | 推荐 |
| `<thead>` | 表头行组 | 推荐 |
| `<tbody>` | 表体行组 | 推荐 |
| `<tfoot>` | 表尾行组 | 可选 |

### 属性速查

| 属性 | 说明 | 使用场景 |
|------|------|----------|
| `colspan` | 跨列数 | 合并列 |
| `rowspan` | 跨行数 | 合并行 |
| `scope` | 表头范围 | 可访问性 |
| `headers` | 关联表头ID | 复杂表格 |

### 最佳实践

1. **使用分组**：`<thead>`、`<tbody>`、`<tfoot>` 提供语义
2. **添加标题**：`<caption>` 描述表格内容
3. **标注表头**：`scope` 属性提升可访问性
4. **响应式处理**：水平滚动或卡片布局
5. **避免布局表格**：仅用于数据展示

---

## 参考资源

- [MDN HTML 表格](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Tables)
- [HTML 表格可访问性](https://www.w3.org/WAI/tutorials/tables/)
- [响应式表格设计](https://css-tricks.com/responsive-data-tables/)

---

[返回上级目录](../index.md)
