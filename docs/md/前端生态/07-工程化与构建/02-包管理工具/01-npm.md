# npm

## 简介

npm 是 Node.js 默认包管理器，最广泛使用。

## 基本命令

### 项目初始化

```bash
# 交互式创建 package.json
npm init

# 使用默认配置快速创建
npm init -y

# 使用自定义配置
npm init -y --scope=@myorg
```

### 安装依赖

```bash
# 安装所有依赖
npm install
npm i

# 安装生产依赖
npm install <package>
npm i <package>
npm install <package> --save  # 默认行为

# 安装开发依赖
npm install <package> --save-dev
npm i <package> -D

# 安装全局包
npm install -g <package>

# 安装特定版本
npm install <package>@1.2.3
npm install <package>@latest
npm install <package>@next

# 安装 GitHub 仓库
npm install user/repo
npm install github:user/repo
npm install git+https://git.example.com/package.git
```

### 卸载依赖

```bash
# 卸载项目依赖
npm uninstall <package>
npm un <package>

# 卸载开发依赖
npm uninstall <package> -D

# 卸载全局包
npm uninstall -g <package>
```

### 更新依赖

```bash
# 更新所有依赖到 package.json 允许的最新版本
npm update

# 更新特定包
npm update <package>

# 查看可更新的包
npm outdated

# 更新所有依赖到最新版本（忽略语义化版本约束）
npm update --latest
```

### 查看/搜索包

```bash
# 查看包信息
npm view <package>
npm view <package> versions
npm view <package> dependencies

# 搜索包
npm search <keyword>

# 查看已安装的包
npm list
npm list --depth=0
npm list -g --depth=0
```

### 运行脚本

```bash
# 运行 package.json 中的脚本
npm run <script>
npm run build
npm run test

# 特殊脚本可省略 run
npm start
npm test
npm stop

# 传递参数
npm run build -- --mode production

# 查看所有可用脚本
npm run
```

### 发布包

```bash
# 登录
npm login

# 发布
npm publish

# 发布到指定 scope
npm publish --access public

# 发布 beta 版本
npm publish --tag beta

# 撤销发布（24小时内）
npm unpublish <package>@<version>
```

### 其他常用命令

```bash
# 清理缓存
npm cache clean --force

# 检查安全漏洞
npm audit
npm audit fix

# 链接本地包（开发调试用）
npm link
npm link <package>

# 执行包命令
npx <package> [args]
npx create-react-app my-app
```

## npm 工作原理

### 依赖解析

1. **扁平化 node_modules**
   - npm v3+ 将依赖扁平化，减少嵌套层级
   - 同名包不同版本会提升到顶层或嵌套存储

```
node_modules/
├── lodash/           # 顶层依赖
├── express/          # 顶层依赖
└── .package-lock.json
```

### package-lock.json

- 锁定依赖版本树，确保团队成员安装相同版本
- 记录依赖的精确版本和完整性哈希
- 加速 npm install 过程

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "lockfileVersion": 2,
  "requires": true,
  "packages": {
    "": { "dependencies": { "lodash": "^4.17.21" } },
    "node_modules/lodash": {
      "version": "4.17.21",
      "resolved": "https://registry.npmjs.org/lodash/-/lodash-4.17.21.tgz",
      "integrity": "sha512-v2kDEe57lecTulaDIuNTPy3Ry4gLGJ6Z1O3vE1krgXZNrsQ+LFTGHVxVjcXPs17LhbZVGedAJv8XZ1tvj5FvSg=="
    }
  }
}
```
