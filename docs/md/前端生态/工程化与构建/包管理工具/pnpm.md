# pnpm

## 简介

pnpm 是高性能的包管理器：
- 使用硬链接和符号链接节省磁盘空间
- 安装速度极快
- 严格的依赖管理，避免幽灵依赖

## 安装

```bash
# 通过 npm 安装
npm install -g pnpm

# 查看版本
pnpm --version
```

## 基本命令

### 项目初始化

```bash
pnpm init
```

### 安装依赖

```bash
# 安装所有依赖
pnpm install

# 安装生产依赖
pnpm add <package>

# 安装开发依赖
pnpm add <package> --save-dev
pnpm add <package> -D

# 安装全局包
pnpm add -g <package>
pnpm global add <package>

# 安装特定版本
pnpm add <package>@1.2.3
```

### 卸载依赖

```bash
pnpm remove <package>
pnpm remove <package> -D

# 卸载全局包
pnpm remove -g <package>
```

### 更新依赖

```bash
# 更新依赖
pnpm update
pnpm up

# 更新特定包
pnpm update <package>

# 查看过期包
pnpm outdated
```

### 运行脚本

```bash
# 运行脚本
pnpm <script>
pnpm build
pnpm test
pnpm start
```

### 其他命令

```bash
# 查看包信息
pnpm info <package>

# 清理缓存
pnpm store prune

# 列出已安装的包
pnpm list
pnpm ls
```

## pnpm 工作原理

### 内容寻址存储

pnpm 将所有包存储在全局 store（默认 `~/.pnpm-store`）：
- 通过硬链接指向同一份代码
- 不同项目共享相同版本的包
- 节省 70% 以上的磁盘空间

```
# 全局 store
~/.pnpm-store/
└── v3/
    └── files/
        └── 00/
            └── lodash@4.17.21/

# 项目中的 node_modules
project/node_modules/
├── .pnpm/              # 硬链接指向全局 store
│   └── lodash@4.17.21/
└── lodash -> .pnpm/lodash@4.17.21/node_modules/lodash
```

### 非扁平 node_modules

pnpm 使用符号链接创建依赖树：
- 只有 package.json 中声明的依赖才能访问
- 避免幽灵依赖（phantom dependency）问题

```javascript
// ❌ npm/yarn 中可能可以使用未声明的依赖
const lodash = require('lodash') // 即使未在 package.json 中声明

// ✅ pnpm 中严格报错
// Error: Cannot find module 'lodash'
```

### pnpm-lock.yaml

```yaml
lockfileVersion: '6.0'

dependencies:
  lodash:
    specifier: ^4.17.21
    version: 4.17.21

packages:
  /lodash@4.17.21:
    resolution: {integrity: sha512-v2kDEe57lecTulaDIuNTPy3Ry4gLGJ6Z1O3vE1krgXZNrsQ+LFTGHVxVjcXPs17LhbZVGedAJv8XZ1tvj5FvSg==}
    dev: false
```

## Monorepo 配置

### pnpm-workspace.yaml

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

### .npmrc 配置

```ini
# 使用硬链接
shamefully-hoist=true

# 严格 peer 依赖
strict-peer-dependencies=false

# 自动安装 peer 依赖
auto-install-peers=true
```

### 工作空间依赖引用

```json
// packages/web/package.json
{
  "dependencies": {
    "@my-org/ui": "workspace:*",
    "@my-org/utils": "workspace:^1.0.0"
  }
}
```

### Monorepo 常用命令

```bash
# 为指定包安装依赖
pnpm --filter @pkg/a add lodash

# 递归执行脚本
pnpm -r run build
```
