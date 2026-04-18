# 表单

> 表单是网页与用户交互的重要方式，用于收集用户输入的数据。掌握表单是构建交互式网站的基础。

## 学习要点

- 📝 理解表单的基本结构和提交机制
- 🎛️ 掌握各种输入类型的特点和用法
- ✅ 学会使用表单验证
- ♿ 理解可访问性的重要性

---

## 1. 表单基本结构

```html
<form action="/submit" method="POST">
    <!-- action: 提交地址 -->
    <!-- method: 提交方式 (GET/POST) -->
    
    <label for="name">姓名：</label>
    <input type="text" id="name" name="name" required>
    
    <label for="email">邮箱：</label>
    <input type="email" id="email" name="email" required>
    
    <button type="submit">提交</button>
</form>
```

### 关键属性

| 属性 | 说明 | 示例 |
|------|------|------|
| `action` | 提交地址 | `action="/api/login"` |
| `method` | 提交方式 | `method="POST"` |
| `enctype` | 编码类型 | `enctype="multipart/form-data"` |
| `novalidate` | 禁用原生验证 | `novalidate` |

---

## 2. 输入类型大全

### 文本输入

```html
<!-- 单行文本 -->
<input type="text" placeholder="请输入用户名">

<!-- 密码（显示为圆点） -->
<input type="password" placeholder="请输入密码">

<!-- 邮箱（自动验证格式） -->
<input type="email" placeholder="example@mail.com">

<!-- 电话号码（移动端弹出数字键盘） -->
<input type="tel" pattern="[9]{11}">

<!-- 搜索框（带清除按钮） -->
<input type="search" placeholder="搜索...">

<!-- URL（验证网址格式） -->
<input type="url" placeholder="https://...">
```

### 数字输入

```html
<!-- 数字输入（带上下箭头） -->
<input type="number" min="0" max="100" step="1" value="50">

<!-- 滑块 -->
<input type="range" min="0" max="100" value="50">
<output for="range">50</output>
```

### 日期时间

```html
<!-- 日期选择器 -->
<input type="date" min="2024-01-01" max="2024-12-31">

<!-- 时间选择器 -->
<input type="time">

<!-- 日期时间 -->
<input type="datetime-local">

<!-- 月份 -->
<input type="month">

<!-- 周 -->
<input type="week">
```

### 选择类

```html
<!-- 复选框 -->
<label>
    <input type="checkbox" name="hobby" value="reading"> 阅读
</label>
<label>
    <input type="checkbox" name="hobby" value="music" checked> 音乐
</label>

<!-- 单选按钮（同 name 为一组） -->
<label>
    <input type="radio" name="gender" value="male"> 男
</label>
<label>
    <input type="radio" name="gender" value="female"> 女
</label>

<!-- 下拉选择 -->
<select name="city">
    <option value="">请选择城市</option>
    <optgroup label="一线城市">
        <option value="beijing">北京</option>
        <option value="shanghai">上海</option>
    </optgroup>
    <optgroup label="二线城市">
        <option value="hangzhou">杭州</option>
    </optgroup>
</select>

<!-- 多行文本 -->
<textarea name="content" rows="4" cols="50" placeholder="请输入内容"></textarea>
```

### 文件上传

```html
<!-- 单文件上传 -->
<input type="file" name="avatar">

<!-- 多文件上传 -->
<input type="file" name="photos" multiple>

<!-- 限制文件类型 -->
<input type="file" accept="image/*">
<input type="file" accept=".pdf,.doc,.docx">
<input type="file" accept="image/png, image/jpeg">
```

### 其他类型

```html
<!-- 颜色选择器 -->
<input type="color" value="#ff0000">

<!-- 隐藏字段 -->
<input type="hidden" name="token" value="abc123">

<!-- 图片提交按钮 -->
<input type="image" src="submit.png" alt="提交">
```

---

## 3. 表单验证

### HTML5 原生验证

```html
<!-- 必填 -->
<input type="text" required>

<!-- 最小/最大长度 -->
<input type="text" minlength="2" maxlength="10">

<!-- 数字范围 -->
<input type="number" min="0" max="100">

<!-- 正则表达式 -->
<input type="text" pattern="[A-Za-z]{3}" title="请输入3个字母">

<!-- 邮箱自动验证 -->
<input type="email" required>
```

### CSS 验证样式

```css
/* 验证通过 */
input:valid {
    border-color: green;
}

/* 验证失败 */
input:invalid {
    border-color: red;
}

/* 验证失败但未提交过（不显示错误） */
input:invalid:not(:placeholder-shown) {
    border-color: red;
}

/* 必填字段 */
input:required {
    border-left: 3px solid red;
}

/* 可选字段 */
input:optional {
    border-left: 3px solid gray;
}
```

### JavaScript 验证

```javascript
const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
    const input = form.querySelector('input[name="email"]');
    
    // 检查有效性
    if (!input.checkValidity()) {
        e.preventDefault(); // 阻止提交
        console.log(input.validationMessage); // 浏览器默认错误信息
    }
});

// 自定义验证
const password = document.querySelector('input[name="password"]');
password.addEventListener('input', () => {
    if (password.value.length < 8) {
        password.setCustomValidity('密码至少8位');
    } else {
        password.setCustomValidity(''); // 清除错误
    }
});
```

---

## 4. 常见表单布局

```html
<!-- 基本布局 -->
<form>
    <div class="form-group">
        <label for="username">用户名</label>
        <input type="text" id="username" name="username">
    </div>
    
    <div class="form-group">
        <label for="password">密码</label>
        <input type="password" id="password" name="password">
    </div>
    
    <button type="submit">登录</button>
</form>

<style>
.form-group {
    margin-bottom: 15px;
}
.form-group label {
    display: block;
    margin-bottom: 5px;
}
.form-group input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}
</style>
```

---

## 5. 可访问性最佳实践

```html
<!-- ✅ 使用 label 关联 -->
<label for="email">邮箱</label>
<input type="email" id="email">

<!-- ✅ 必填标识 -->
<label for="name">
    姓名 <span aria-label="必填">*</span>
</label>
<input type="text" id="name" required aria-required="true">

<!-- ✅ 错误提示 -->
<input type="text" id="username" aria-describedby="username-error">
<span id="username-error" role="alert">用户名不能为空</span>

<!-- ✅ 分组 -->
<fieldset>
    <legend>个人信息</legend>
    <!-- 表单控件 -->
</fieldset>
```

---

## 小结

| 元素 | 用途 |
|------|------|
| `<form>` | 表单容器 |
| `<input>` | 输入框 |
| `<label>` | 标签（关联输入框） |
| `<select>` | 下拉选择 |
| `<textarea>` | 多行文本 |
| `<button>` | 按钮 |
| `<fieldset>` | 表单分组 |

---

[返回上级目录](../README.md)
