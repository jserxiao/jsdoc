# 列表

> 列表是网页中最常用的结构之一，用于展示一组相关项目。HTML 提供了三种列表类型：无序列表、有序列表和定义列表。

## 📚 学习要点

- 📝 掌握三种列表类型的语法和使用场景
- 🔄 学会列表的嵌套与组合
- 🎯 理解列表的语义化用途
- 🎨 了解列表的常见 CSS 样式技巧

---

## 1. 无序列表（ul）

### 基本用法

无序列表用于展示**没有特定顺序**的项目，项目前显示符号（默认圆点）。

```html
<ul>
    <li>苹果</li>
    <li>香蕉</li>
    <li>橙子</li>
</ul>
```

### 使用场景

```html
<!-- 导航菜单 -->
<nav>
    <ul>
        <li><a href="/">首页</a></li>
        <li><a href="/products">产品</a></li>
        <li><a href="/about">关于</a></li>
        <li><a href="/contact">联系</a></li>
    </ul>
</nav>

<!-- 特性列表 -->
<ul>
    <li>高性能</li>
    <li>易于使用</li>
    <li>跨平台支持</li>
    <li>开源免费</li>
</ul>

<!-- 购物清单 -->
<ul>
    <li>牛奶</li>
    <li>面包</li>
    <li>鸡蛋</li>
</ul>
```

### 列表样式类型

```html
<!-- 通过 CSS 改变项目符号 -->
<style>
.disc { list-style-type: disc; }      /* 实心圆点（默认） */
.circle { list-style-type: circle; }  /* 空心圆 */
.square { list-style-type: square; }  /* 实心方块 */
.none { list-style-type: none; }      /* 无符号 */
</style>

<ul class="disc">
    <li>实心圆点</li>
</ul>
<ul class="circle">
    <li>空心圆</li>
</ul>
<ul class="square">
    <li>实心方块</li>
</ul>
```

---

## 2. 有序列表（ol）

### 基本用法

有序列表用于展示**有特定顺序**的项目，项目前显示序号。

```html
<ol>
    <li>第一步：打开电脑</li>
    <li>第二步：启动浏览器</li>
    <li>第三步：输入网址</li>
</ol>
```

### 有序列表属性

```html
<!-- start: 指定起始编号 -->
<ol start="5">
    <li>从5开始</li>
    <li>这是6</li>
    <li>这是7</li>
</ol>

<!-- reversed: 倒序排列 -->
<ol reversed>
    <li>第三个</li>
    <li>第二个</li>
    <li>第一个</li>
</ol>

<!-- type: 编号类型 -->
<ol type="1">    <!-- 数字 1, 2, 3（默认） -->
    <li>数字编号</li>
</ol>
<ol type="A">    <!-- 大写字母 A, B, C -->
    <li>大写字母</li>
</ol>
<ol type="a">    <!-- 小写字母 a, b, c -->
    <li>小写字母</li>
</ol>
<ol type="I">    <!-- 大写罗马数字 I, II, III -->
    <li>大写罗马</li>
</ol>
<ol type="i">    <!-- 小写罗马数字 i, ii, iii -->
    <li>小写罗马</li>
</ol>
```

### 使用场景

```html
<!-- 操作步骤 -->
<ol>
    <li>下载安装包</li>
    <li>运行安装程序</li>
    <li>选择安装路径</li>
    <li>点击完成安装</li>
</ol>

<!-- 排行榜 -->
<ol>
    <li>冠军</li>
    <li>亚军</li>
    <li>季军</li>
</ol>

<!-- 章节目录 -->
<nav>
    <ol>
        <li><a href="#ch1">第一章 介绍</a></li>
        <li><a href="#ch2">第二章 基础</a></li>
        <li><a href="#ch3">第三章 进阶</a></li>
    </ol>
</nav>
```

---

## 3. 定义列表（dl）

### 基本用法

定义列表用于展示**术语及其定义**的对应关系。

```html
<dl>
    <dt>HTML</dt>
    <dd>HyperText Markup Language，超文本标记语言</dd>
    
    <dt>CSS</dt>
    <dd>Cascading Style Sheets，层叠样式表</dd>
    
    <dt>JavaScript</dt>
    <dd>一种脚本语言，用于网页交互</dd>
</dl>
```

### 一个术语多个定义

```html
<dl>
    <dt>水果</dt>
    <dd>苹果</dd>
    <dd>香蕉</dd>
    <dd>橙子</dd>
</dl>
```

### 使用场景

```html
<!-- 词汇表 -->
<dl>
    <dt>API</dt>
    <dd>Application Programming Interface，应用程序接口</dd>
    
    <dt>DOM</dt>
    <dd>Document Object Model，文档对象模型</dd>
</dl>

<!-- 产品参数 -->
<dl>
    <dt>品牌</dt>
    <dd>Apple</dd>
    
    <dt>型号</dt>
    <dd>iPhone 15 Pro</dd>
    
    <dt>存储</dt>
    <dd>256GB</dd>
    
    <dt>颜色</dt>
    <dd>深空黑</dd>
</dl>

<!-- FAQ 问答 -->
<dl>
    <dt>如何重置密码？</dt>
    <dd>点击登录页面的"忘记密码"链接，按提示操作。</dd>
    
    <dt>支持哪些支付方式？</dt>
    <dd>支持支付宝、微信支付、银行卡等。</dd>
</dl>

<!-- 联系信息 -->
<dl>
    <dt>地址</dt>
    <dd>北京市朝阳区xxx街道xxx号</dd>
    
    <dt>电话</dt>
    <dd>400-123-4567</dd>
    
    <dt>邮箱</dt>
    <dd>contact@example.com</dd>
</dl>
```

---

## 4. 列表嵌套

### 无序列表嵌套

```html
<ul>
    <li>水果
        <ul>
            <li>苹果</li>
            <li>香蕉</li>
            <li>橙子</li>
        </ul>
    </li>
    <li>蔬菜
        <ul>
            <li>胡萝卜</li>
            <li>西兰花</li>
        </ul>
    </li>
</ul>
```

### 有序列表嵌套

```html
<ol>
    <li>准备工作
        <ol>
            <li>下载软件</li>
            <li>安装依赖</li>
        </ol>
    </li>
    <li>配置环境
        <ol>
            <li>设置路径</li>
            <li>配置变量</li>
        </ol>
    </li>
</ol>
```

### 混合嵌套

```html
<ul>
    <li>前端技术
        <ol>
            <li>HTML</li>
            <li>CSS</li>
            <li>JavaScript</li>
        </ol>
    </li>
    <li>后端技术
        <ol>
            <li>Node.js</li>
            <li>Python</li>
            <li>Java</li>
        </ol>
    </li>
</ul>
```

### 多级导航菜单

```html
<nav>
    <ul class="menu">
        <li>
            <a href="/">首页</a>
        </li>
        <li>
            <a href="/products">产品</a>
            <ul class="submenu">
                <li><a href="/products/a">产品A</a></li>
                <li><a href="/products/b">产品B</a></li>
                <li>
                    <a href="/products/c">产品C</a>
                    <ul class="sub-submenu">
                        <li><a href="/products/c1">C-1</a></li>
                        <li><a href="/products/c2">C-2</a></li>
                    </ul>
                </li>
            </ul>
        </li>
        <li>
            <a href="/services">服务</a>
            <ul class="submenu">
                <li><a href="/services/consulting">咨询服务</a></li>
                <li><a href="/services/support">技术支持</a></li>
            </ul>
        </li>
    </ul>
</nav>
```

---

## 5. 列表常见样式

### 去除默认样式

```html
<style>
/* 去除列表样式和默认缩进 */
ul, ol {
    list-style: none;
    padding: 0;
    margin: 0;
}
</style>
```

### 水平导航

```html
<style>
.nav-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    gap: 20px;
}

.nav-list li a {
    text-decoration: none;
    color: #333;
}

.nav-list li a:hover {
    color: #007bff;
}
</style>

<nav>
    <ul class="nav-list">
        <li><a href="/">首页</a></li>
        <li><a href="/about">关于</a></li>
        <li><a href="/contact">联系</a></li>
    </ul>
</nav>
```

### 自定义项目符号

```html
<style>
.custom-list {
    list-style: none;
    padding-left: 20px;
}

.custom-list li {
    position: relative;
    padding-left: 25px;
    margin-bottom: 10px;
}

.custom-list li::before {
    content: "✓";
    position: absolute;
    left: 0;
    color: green;
    font-weight: bold;
}
</style>

<ul class="custom-list">
    <li>功能齐全</li>
    <li>性能优秀</li>
    <li>易于使用</li>
</ul>
```

### 使用图片作为符号

```html
<style>
.icon-list {
    list-style-image: url('checkmark.png');
    padding-left: 30px;
}
</style>

<ul class="icon-list">
    <li>项目一</li>
    <li>项目二</li>
    <li>项目三</li>
</ul>
```

---

## 6. 列表选择指南

| 场景 | 推荐列表类型 | 说明 |
|------|-------------|------|
| 导航菜单 | `<ul>` | 顺序不重要 |
| 操作步骤 | `<ol>` | 顺序重要 |
| 特性列表 | `<ul>` | 顺序不重要 |
| 排行榜 | `<ol>` | 顺序重要 |
| 产品参数 | `<dl>` | 术语-定义关系 |
| FAQ问答 | `<dl>` | 问题-答案关系 |
| 词汇表 | `<dl>` | 术语-定义关系 |
| 章节目录 | `<ol>` | 顺序重要 |

---

## 7. 可访问性注意事项

```html
<!-- 导航列表添加 aria-label -->
<nav aria-label="主导航">
    <ul>
        <li><a href="/">首页</a></li>
        <li><a href="/about">关于</a></li>
    </ul>
</nav>

<!-- 面包屑使用有序列表 -->
<nav aria-label="面包屑导航">
    <ol>
        <li><a href="/">首页</a></li>
        <li><a href="/products">产品</a></li>
        <li aria-current="page">当前产品</li>
    </ol>
</nav>

<!-- 列表组添加 role -->
<ul role="listbox" aria-label="选项列表">
    <li role="option">选项一</li>
    <li role="option">选项二</li>
</ul>
```

---

## 小结

### 三种列表对比

| 列表类型 | 标签 | 用途 | 默认样式 |
|---------|------|------|---------|
| 无序列表 | `<ul>` + `<li>` | 无特定顺序的项目 | 圆点 |
| 有序列表 | `<ol>` + `<li>` | 有特定顺序的项目 | 数字 |
| 定义列表 | `<dl>` + `<dt>` + `<dd>` | 术语与定义对应 | 术语顶格，定义缩进 |

### 关键要点

1. **语义正确**：根据内容特点选择合适的列表类型
2. **灵活嵌套**：列表可以相互嵌套形成复杂结构
3. **样式控制**：通过 CSS 自定义列表样式
4. **可访问性**：使用合适的 ARIA 属性增强可访问性

---

[返回上级目录](../index.md) | [下一章：链接与导航](../链接与导航/index.md)
