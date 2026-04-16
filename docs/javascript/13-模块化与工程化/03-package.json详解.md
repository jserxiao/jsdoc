# package.json 详解

> package.json 是 Node.js 项目的核心配置文件，它定义了项目的基本信息、依赖关系、脚本命令等。理解 package.json 的所有属性对于前端工程化至关重要。

## 学习要点

- 📝 掌握 package.json 的核心属性
- 📦 理解依赖管理相关字段
- 🔄 掌握脚本配置和生命周期
- 🎯 了解发布和配置相关属性

---

## 1. 基础信息属性

### name（必需）

```json
{
    "name": "my-awesome-package"
}
```

```javascript
// 规则：
// 1. 必须小于等于 214 个字符
// 2. 不能以点或下划线开头
// 3. 名称中只能包含 URL 安全字符（小写字母、数字、连字符、下划线）
// 4. 不能包含大写字母
// 5. 不能包含空格

// 有效示例
"name": "lodash"                    // 简单名称
"name": "@babel/core"               // 作用域包（@scope/name）
"name": "@my-org/my-package"        // 组织作用域包

// 无效示例
"name": "MyPackage"                 // 包含大写
"name": ".my-package"               // 以点开头
"name": "my package"                // 包含空格
"name": "my@package"                // 包含特殊字符
```

### version（必需）

```json
{
    "version": "1.0.0"
}
```

```javascript
// 语义化版本格式：major.minor.patch

// major（主版本号）：不兼容的 API 变更
// minor（次版本号）：向后兼容的功能新增
// patch（修订号）：向后兼容的问题修正

// 预发布版本
"version": "1.0.0-alpha.1"          // 内部测试版
"version": "1.0.0-beta.2"           // 公开测试版
"version": "1.0.0-rc.1"             // 候选版本

// 构建元数据
"version": "1.0.0+build.123"
```

### description

```json
{
    "description": "A simple and powerful utility library for JavaScript"
}
```

```javascript
// 用于描述项目的字符串
// 会显示在 npm search 结果中
// 建议简洁明了
```

### keywords

```json
{
    "keywords": [
        "javascript",
        "utility",
        "helper",
        "library"
    ]
}
```

```javascript
// 关键词数组，用于 npm search 优化
// 帮助用户找到你的包
```

### homepage

```json
{
    "homepage": "https://github.com/user/repo#readme"
}
```

### bugs

```json
{
    "bugs": {
        "url": "https://github.com/user/repo/issues",
        "email": "bugs@example.com"
    }
}
```

### license

```json
{
    "license": "MIT"
}
```

```javascript
// 常见许可证：
// MIT        - 最宽松，几乎无限制
// Apache-2.0 - 需要保留版权声明
// GPL-3.0    - 衍生作品必须同样开源
// BSD-2/3-Clause - 类似 MIT
// ISC        - 简化版 MIT
// UNLICENSED - 私有，不授权

// 多许可证
"license": "(MIT OR Apache-2.0)"

// 私有项目
"license": "UNLICENSED"
"private": true
```

### author & contributors

```json
{
    "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "url": "https://johndoe.com"
    },
    // 或者简写
    "author": "John Doe <john@example.com> (https://johndoe.com)",
    
    "contributors": [
        "Jane Doe <jane@example.com>",
        {
            "name": "Bob Smith",
            "email": "bob@example.com"
        }
    ]
}
```

### repository

```json
{
    "repository": {
        "type": "git",
        "url": "https://github.com/user/repo.git",
        "directory": "packages/core"  // monorepo 子目录
    },
    // 简写
    "repository": "github:user/repo",
    "repository": "gitlab:user/repo",
    "repository": "bitbucket:user/repo"
}
```

---

## 2. 入口与模块属性

### main

```json
{
    "main": "index.js"
}
```

```javascript
// 指定包的主入口文件
// require('my-package') 时加载的文件
// 默认是 index.js
```

### module

```json
{
    "module": "esm/index.js"
}
```

```javascript
// ES Module 入口文件
// 支持 ES Module 的打包工具（如 Rollup、Webpack 2+）会使用此入口
// 优先级高于 main
```

### exports

```json
{
    "exports": {
        ".": {
            "import": "./dist/index.mjs",
            "require": "./dist/index.cjs",
            "default": "./dist/index.js"
        },
        "./utils": "./dist/utils.js",
        "./features/*": "./dist/features/*.js",
        "./package.json": "./package.json"
    }
}
```

```javascript
// 现代包入口点配置（Node.js 12.7.0+）
// 1. 控制哪些模块可以被外部访问
// 2. 提供条件导出（ESM/CJS）
// 3. 更精细的导出控制

// 子路径导出
// import utils from 'my-package/utils'
// import feature from 'my-package/features/something'

// 条件导出优先级
{
    "exports": {
        ".": {
            "types": "./dist/index.d.ts",      // TypeScript
            "import": "./dist/index.mjs",       // ES Module
            "require": "./dist/index.cjs",      // CommonJS
            "default": "./dist/index.js"        // 默认
        }
    }
}
```

### types / typings

```json
{
    "types": "./dist/index.d.ts",
    // 或
    "typings": "./dist/index.d.ts"
}
```

```javascript
// TypeScript 类型定义文件入口
// 让使用者获得类型提示
```

### bin

```json
{
    "bin": {
        "my-cli": "./bin/cli.js",
        "another-cli": "./bin/another.js"
    },
    // 单个命令简写
    "bin": "./bin/cli.js"
}
```

```javascript
// 安装时会创建符号链接到 node_modules/.bin/
// 使得包可以作为命令行工具使用

// bin/cli.js 必须有 shebang
#!/usr/bin/env node

console.log('Hello from CLI!');
```

### browser

```json
{
    "browser": "./dist/browser.js",
    // 或对象形式，用于替换特定模块
    "browser": {
        "./lib/server.js": "./lib/browser.js",
        "fs": false  // 在浏览器中忽略 fs 模块
    }
}
```

---

## 3. 脚本与生命周期

### scripts

```json
{
    "scripts": {
        // 常用脚本
        "start": "node index.js",
        "test": "jest",
        "build": "webpack --mode production",
        "dev": "webpack serve --mode development",
        "lint": "eslint src/",
        "format": "prettier --write .",
        
        // 带参数传递
        "test": "jest --coverage",
        "build:prod": "webpack --mode production",
        "build:dev": "webpack --mode development",
        
        // 串行执行
        "build": "npm run clean && npm run compile",
        
        // 并行执行
        "lint": "npm-run-all --parallel lint:*",
        "lint:js": "eslint src/",
        "lint:css": "stylelint src/",
        
        // 跨平台兼容
        "clean": "rimraf dist",
        "copy": "copyfiles -u 1 src/**/* dist"
    }
}
```

### 生命周期脚本

```json
{
    "scripts": {
        // 核心生命周期钩子
        "preinstall": "node scripts/check-node.js",      // npm install 之前
        "postinstall": "node scripts/setup.js",          // npm install 之后
        "preuninstall": "echo 'Goodbye!'",               // npm uninstall 之前
        "postuninstall": "echo 'Cleaned up!'",           // npm uninstall 之后
        
        "preversion": "npm test",                        // 版本变更之前
        "version": "git add -A src",                     // 版本变更时
        "postversion": "git push && git push --tags",    // 版本变更之后
        
        "pretest": "npm run lint",                       // npm test 之前
        "test": "jest",                                  // npm test
        "posttest": "echo 'Tests done!'",               // npm test 之后
        
        "prepublishOnly": "npm run build",              // npm publish 之前（仅发布时）
        "prepack": "npm run build",                      // npm pack 之前
        "postpack": "echo 'Packed!'",                    // npm pack 之后
        
        "prepare": "husky install",                      // npm install 后或 git clone 后
        "publishConfig": {                               // 发布配置（仅发布时生效）
            "registry": "https://registry.npmjs.org/",
            "access": "public"
        }
    }
}
```

### scripts 执行顺序

```javascript
// npm run <command> 的执行顺序：
// 1. pre<command>
// 2. <command>
// 3. post<command>

// 示例：npm test
// 1. npm run pretest
// 2. npm run test
// 3. npm run posttest

// 跳过生命周期脚本
// npm install --ignore-scripts
```

---

## 4. 依赖管理

### dependencies

```json
{
    "dependencies": {
        "lodash": "^4.17.21",
        "axios": "^1.6.0",
        "express": "^4.18.2",
        "moment": "2.29.4"
    }
}
```

```javascript
// 运行时依赖
// 生产环境需要的包
// npm install <package> --save 或 npm install <package>
```

### devDependencies

```json
{
    "devDependencies": {
        "webpack": "^5.89.0",
        "jest": "^29.7.0",
        "eslint": "^8.56.0",
        "typescript": "^5.3.3",
        "@types/node": "^20.10.0",
        "vite": "^5.0.0"
    }
}
```

```javascript
// 开发时依赖
// 仅开发、测试、构建时需要
// npm install <package> --save-dev 或 npm install <package> -D

// 安装时跳过 devDependencies
// npm install --production
```

### peerDependencies

```json
{
    "peerDependencies": {
        "react": ">=16.8.0",
        "react-dom": ">=16.8.0",
        "vue": "^3.0.0"
    },
    "peerDependenciesMeta": {
        "react-dom": {
            "optional": true  // 可选依赖
        }
    }
}
```

```javascript
// 对等依赖
// 插件/库期望宿主环境提供的包
// 不会自动安装，需要用户手动安装

// npm 7+ 会自动安装 peerDependencies
// npm 6 及以下只会警告

// 典型场景：React 组件库、Webpack 插件、Babel 插件
```

### optionalDependencies

```json
{
    "optionalDependencies": {
        "fsevents": "^2.3.0",  // macOS 专用
        "sharp": "^0.32.0"      // 图片处理，可选
    }
}
```

```javascript
// 可选依赖
// 安装失败不会导致整个安装失败
// 需要在代码中检查是否可用

try {
    const fsevents = require('fsevents');
    // 使用 fsevents
} catch (e) {
    // 回退方案
}
```

### bundleDependencies / bundledDependencies

```json
{
    "bundleDependencies": [
        "lodash",
        "axios"
    ],
    // 或
    "bundledDependencies": ["lodash", "axios"]
}
```

```javascript
// 打包依赖
// 发布时会将这些依赖打包到包内
// 适用于需要离线安装或确保特定版本的包
```

### overrides

```json
{
    "overrides": {
        "lodash": "^4.17.21",           // 强制所有 lodash 版本
        "axios": {
            "follow-redirects": "^1.15.0"  // 嵌套覆盖
        }
    }
}
```

```javascript
// npm 8.3+ 
// 强制覆盖依赖树中的包版本
// 解决依赖冲突问题
```

### resolutions

```json
{
    "resolutions": {
        "lodash": "^4.17.21",
        "**/follow-redirects": "^1.15.0"
    }
}
```

```javascript
// Yarn 专用的依赖覆盖
// 类似 npm 的 overrides
```

---

## 5. 版本范围语法

### 基本语法

```json
{
    "dependencies": {
        "exact": "1.2.3",              // 精确版本
        "patch": "1.2.3",              // 补丁范围
        "minor": "^1.2.3",             // 次版本范围
        "major": ">=1.0.0 <2.0.0",     // 主版本范围
        "any": "*",                    // 任意版本
        "latest": "latest",            // 最新版本
        "git": "github:user/repo",     // Git 仓库
        "local": "file:../local-pkg",  // 本地包
        "url": "https://example.com/pkg.tgz",  // URL
        "range": "1.0.0 - 2.0.0",      // 范围
        "or": "1.0.0 || 2.0.0",        // 或
        "not": ">=1.0.0 <2.0.0"        // 非
    }
}
```

### 详细示例

```json
{
    "dependencies": {
        // 插入符 ^
        "^1.2.3": ">=1.2.3 <2.0.0",    // 允许次版本和补丁更新
        "^0.2.3": ">=0.2.3 <0.3.0",    // 0.x.x 只允许补丁更新
        "^0.0.3": ">=0.0.3 <0.0.4",    // 0.0.x 精确版本
        "^1.2.x": ">=1.2.0 <2.0.0",    // x 通配符
        
        // 波浪号 ~
        "~1.2.3": ">=1.2.3 <1.3.0",    // 只允许补丁更新
        "~1.2": ">=1.2.0 <1.3.0",      // 同上
        "~1": ">=1.0.0 <2.0.0",        // 允许次版本和补丁更新
        "~1.2.x": ">=1.2.0 <1.3.0",    // x 通配符
        
        // 比较运算符
        ">1.2.3": "大于 1.2.3",
        ">=1.2.3": "大于等于 1.2.3",
        "<2.0.0": "小于 2.0.0",
        "<=2.0.0": "小于等于 2.0.0",
        
        // 组合
        ">=1.0.0 <2.0.0": "1.x.x",
        "1.0.0 - 2.0.0": ">=1.0.0 <=2.0.0",
        "1.0.0 || 2.0.0": "精确 1.0.0 或 2.0.0"
    }
}
```

---

## 6. 引擎与环境

### engines

```json
{
    "engines": {
        "node": ">=18.0.0",
        "npm": ">=9.0.0",
        "yarn": ">=1.22.0",
        "pnpm": ">=8.0.0"
    },
    // 强制检查引擎版本
    "engineStrict": true  // 已废弃，改用 .npmrc 中的 engine-strict=true
}
```

### os

```json
{
    "os": [
        "darwin",           // macOS
        "linux",
        "win32",
        "!win32"           // 排除 Windows
    ]
}
```

### cpu

```json
{
    "cpu": [
        "x64",
        "arm64",
        "ia32",             // 32位
        "!arm"              // 排除 ARM
    ]
}
```

---

## 7. 发布配置

### private

```json
{
    "private": true
}
```

```javascript
// 标记为私有包
// 防止意外发布到 npm
// 作用域包设置为私有后可发布到私有仓库
```

### publishConfig

```json
{
    "publishConfig": {
        "registry": "https://registry.npmjs.org/",
        "access": "public",                    // 作用域包需要设置为 public
        "tag": "beta",                         // 发布标签
        "directory": "dist",                   // 发布目录
        "provenance": true                     // 供应链证明
    }
}
```

### files

```json
{
    "files": [
        "dist",
        "lib",
        "index.js",
        "README.md",
        "LICENSE"
    ],
    // 或排除文件
    "files": [
        "dist",
        "!dist/test"
    ]
}
```

```javascript
// 指定发布时要包含的文件
// 默认包含：package.json, README.md, LICENSE, main 指定的文件
// 默认排除：.git, .DS_Store, node_modules, .npmrc 等

// 始终包含的文件
// package.json
// README.md
// LICENSE / LICENCE
// main 字段指定的文件

// 始终排除的文件（无法覆盖）
// .git
// .gitignore
// .npmignore
// node_modules
// .npmrc
// 符号链接
```

### .npmignore

```text
# 类似 .gitignore，用于排除发布文件
test/
*.test.js
coverage/
.DS_Store
*.log
.env
.env.*
```

---

## 8. 工作区（Workspaces）

### 定义工作区

```json
{
    "workspaces": [
        "packages/*",
        "apps/*"
    ],
    // 或对象形式
    "workspaces": {
        "packages": [
            "packages/*"
        ],
        "nohoist": [
            "**/react-native",
            "**/react-native/**"
        ]
    }
}
```

```javascript
// Monorepo 配置
// 管理多个包

// 目录结构
// my-monorepo/
// ├── package.json
// ├── packages/
// │   ├── core/
// │   │   └── package.json
// │   └── utils/
// │       └── package.json
// └── apps/
//     └── web/
//         └── package.json
```

### 工作区命令

```bash
# npm
npm install                    # 安装所有工作区依赖
npm install lodash -w core     # 在指定工作区安装
npm run build -w core          # 在指定工作区运行脚本
npm run build -ws              # 在所有工作区运行
npm run build -ws --if-present # 只在有该脚本的工作区运行

# yarn
yarn workspaces list           # 列出所有工作区
yarn workspace core add lodash # 在 core 添加依赖

# pnpm
pnpm install                   # 安装所有依赖
pnpm --filter core add lodash  # 在 core 添加依赖
pnpm -r run build              # 递归运行脚本
```

---

## 9. 类型与配置

### type

```json
{
    "type": "module"
}
```

```javascript
// 指定 .js 文件的模块系统
// "module" - ES Module
// "commonjs" - CommonJS（默认）

// 影响：
// .js 文件的解析方式
// import vs require
// __dirname, __filename 的可用性
```

### imports

```json
{
    "imports": {
        "#utils": "./src/utils/index.js",
        "#utils/*": "./src/utils/*.js",
        "#config": "./config/index.js",
        "#internal/*": "./src/internal/*.js"
    }
}
```

```javascript
// 内部模块别名（Node.js 14.6.0+）
// 只能在包内部使用
// 以 # 开头

import utils from '#utils';
import { helper } from '#utils/helper';
import { dbConfig } from '#config';
```

### typesVersions

```json
{
    "typesVersions": {
        ">=4.0.0": {
            "utils": ["utils/index.d.ts"],
            "*": ["types/*.d.ts"]
        },
        ">=3.9.0": {
            "*": ["types/v3/*.d.ts"]
        }
    }
}
```

```javascript
// 根据 TypeScript 版本选择类型定义
```

---

## 10. 其他配置

### sideEffects

```json
{
    "sideEffects": false,
    // 或指定有副作用的文件
    "sideEffects": [
        "*.css",
        "*.scss",
        "./src/polyfills.js"
    ]
}
```

```javascript
// 标识包是否有副作用
// false 表示没有副作用，可以安全地进行 tree-shaking

// 副作用包括：
// 修改全局变量
// 修改原型
// polyfill
// CSS 样式注入
```

### config

```json
{
    "config": {
        "port": 3000,
        "apiUrl": "https://api.example.com"
    }
}
```

```javascript
// 应用配置
// 可通过 npm_package_config_port 访问
// 可被 npm config set mypackage:port 4000 覆盖

// 在脚本中使用
"scripts": {
    "start": "node server.js --port=$npm_package_config_port"
}
```

### directories

```json
{
    "directories": {
        "lib": "src/lib",
        "bin": "src/bin",
        "man": "src/man",
        "doc": "docs",
        "example": "examples",
        "test": "tests"
    }
}
```

### man

```json
{
    "man": "./man/doc.1"
}
```

```javascript
// 指定 man 命令的文档文件
```

---

## 11. 完整示例

```json
{
    "name": "@myorg/my-awesome-package",
    "version": "1.0.0",
    "description": "A comprehensive Node.js package example",
    "keywords": [
        "javascript",
        "nodejs",
        "utility"
    ],
    "homepage": "https://github.com/myorg/my-awesome-package#readme",
    "bugs": {
        "url": "https://github.com/myorg/my-awesome-package/issues"
    },
    "repository": {
        "type": "git",
        "url": "git+https://github.com/myorg/my-awesome-package.git"
    },
    "license": "MIT",
    "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "url": "https://johndoe.com"
    },
    "contributors": [
        "Jane Doe <jane@example.com>"
    ],
    "type": "module",
    "main": "./dist/index.cjs",
    "module": "./dist/index.mjs",
    "types": "./dist/index.d.ts",
    "exports": {
        ".": {
            "types": "./dist/index.d.ts",
            "import": "./dist/index.mjs",
            "require": "./dist/index.cjs"
        },
        "./utils": {
            "import": "./dist/utils.mjs",
            "require": "./dist/utils.cjs"
        }
    },
    "bin": {
        "my-cli": "./bin/cli.js"
    },
    "files": [
        "dist",
        "bin",
        "README.md",
        "LICENSE"
    ],
    "scripts": {
        "prepare": "husky install",
        "prebuild": "rimraf dist",
        "build": "tsc && vite build",
        "postbuild": "echo 'Build complete!'",
        "dev": "vite build --watch",
        "test": "vitest run",
        "test:watch": "vitest",
        "test:coverage": "vitest run --coverage",
        "lint": "eslint src/",
        "lint:fix": "eslint src/ --fix",
        "format": "prettier --write .",
        "typecheck": "tsc --noEmit",
        "release": "standard-version",
        "prepublishOnly": "npm run build && npm test"
    },
    "dependencies": {
        "lodash": "^4.17.21",
        "axios": "^1.6.0"
    },
    "devDependencies": {
        "@types/lodash": "^4.14.202",
        "@types/node": "^20.10.0",
        "typescript": "^5.3.3",
        "vite": "^5.0.0",
        "vitest": "^1.0.0",
        "eslint": "^8.56.0",
        "prettier": "^3.1.0",
        "husky": "^8.0.3",
        "rimraf": "^5.0.0",
        "standard-version": "^9.5.0"
    },
    "peerDependencies": {
        "react": ">=16.8.0"
    },
    "peerDependenciesMeta": {
        "react": {
            "optional": true
        }
    },
    "optionalDependencies": {
        "fsevents": "^2.3.0"
    },
    "engines": {
        "node": ">=18.0.0",
        "npm": ">=9.0.0"
    },
    "os": [
        "darwin",
        "linux",
        "win32"
    ],
    "cpu": [
        "x64",
        "arm64"
    ],
    "sideEffects": [
        "*.css"
    ],
    "imports": {
        "#utils": "./src/utils/index.js"
    },
    "publishConfig": {
        "access": "public",
        "registry": "https://registry.npmjs.org/"
    },
    "workspaces": [
        "packages/*"
    ]
}
```

---

## 12. 常用 npm 脚本命令

```json
{
    "scripts": {
        // 开发
        "dev": "vite",
        "start": "node index.js",
        "serve": "serve dist",
        
        // 构建
        "build": "webpack --mode production",
        "build:dev": "webpack --mode development",
        "build:watch": "webpack --watch",
        
        // 测试
        "test": "jest",
        "test:watch": "jest --watch",
        "test:coverage": "jest --coverage",
        "test:ci": "jest --ci --coverage",
        
        // 代码质量
        "lint": "eslint src/",
        "lint:fix": "eslint src/ --fix",
        "format": "prettier --write .",
        "format:check": "prettier --check .",
        "typecheck": "tsc --noEmit",
        
        // 清理
        "clean": "rimraf dist coverage node_modules",
        "clean:dist": "rimraf dist",
        
        // 发布
        "release": "standard-version",
        "release:major": "standard-version --release-as major",
        "release:minor": "standard-version --release-as minor",
        "release:patch": "standard-version --release-as patch"
    }
}
```

---

## 小结

| 属性分类 | 主要属性 | 用途 |
|---------|---------|------|
| **基础信息** | name, version, description, keywords, license | 项目标识和描述 |
| **入口模块** | main, module, exports, types, bin | 模块入口点配置 |
| **脚本命令** | scripts | 自动化任务和生命周期钩子 |
| **依赖管理** | dependencies, devDependencies, peerDependencies | 包依赖声明 |
| **版本控制** | ^, ~, >, <, \|\|, - | 语义化版本范围 |
| **引擎环境** | engines, os, cpu | 运行环境限制 |
| **发布配置** | private, publishConfig, files | 发布行为控制 |
| **工作区** | workspaces | Monorepo 管理 |

---

[返回模块目录](./README.md)
