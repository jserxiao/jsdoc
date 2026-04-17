# 七、表格

## 表格基本结构

```html
<table>
    <caption>表格标题</caption>
    <thead>
        <tr>
            <th>姓名</th>
            <th>年龄</th>
            <th>城市</th>
        </tr>
    </thead>
    <tbody>
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
    </tbody>
    <tfoot>
        <tr>
            <td colspan="3">表尾内容</td>
        </tr>
    </tfoot>
</table>
```

---

## 单元格合并

```html
<table>
    <tr>
        <td colspan="2">跨两列</td>
        <td>普通单元格</td>
    </tr>
    <tr>
        <td rowspan="2">跨两行</td>
        <td>单元格</td>
        <td>单元格</td>
    </tr>
    <tr>
        <td>单元格</td>
        <td>单元格</td>
    </tr>
</table>
```

---

[返回上级目录](../README.md)
