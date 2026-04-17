# EditorConfig

## 概述

EditorConfig 帮助开发者在不同编辑器和 IDE 之间保持一致的编码风格。

## .editorconfig

```ini
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false

[*.{yml,yaml}]
indent_size = 2

[Makefile]
indent_style = tab
```

## 配置项说明

| 选项 | 说明 |
|------|------|
| `root` | 是否为根配置文件 |
| `charset` | 文件编码（utf-8, latin1 等） |
| `indent_style` | 缩进风格（space, tab） |
| `indent_size` | 缩进大小 |
| `end_of_line` | 换行符（lf, crlf, cr） |
| `insert_final_newline` | 文件末尾插入空行 |
| `trim_trailing_whitespace` | 删除行尾空白 |

## 编辑器支持

| 编辑器 | 支持方式 |
|--------|----------|
| VS Code | 内置支持 |
| WebStorm | 内置支持 |
| Sublime Text | 需安装插件 |
| Vim | 需安装插件 |
| Emacs | 需安装插件 |

## 文件匹配规则

```ini
# 匹配所有文件
[*]

# 匹配特定扩展名
[*.js]
[*.ts]
[*.vue]

# 匹配特定目录
[src/**.js]
[lib/**.ts]

# 匹配多种扩展名
[*.{js,ts,vue}]

# 匹配特定文件
[package.json]
```
