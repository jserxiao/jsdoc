# Rollup

## 定位

专注于库打包的构建工具，输出更加干净。

## 核心特点

- **Tree Shaking**：原生支持，效果最佳
- **输出干净**：无运行时注入，代码精简
- **多格式输出**：ESM、CommonJS、UMD 等
- **插件系统**：简洁的插件 API

## 基础配置

```javascript
// rollup.config.js
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/bundle.js',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: 'dist/bundle.esm.js',
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    terser()
  ]
}
```

## 多格式输出配置

```javascript
export default {
  input: 'src/index.ts',
  output: [
    // CommonJS
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true
    },
    // ES Module
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    },
    // UMD
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'MyLibrary',
      globals: {
        vue: 'Vue'
      }
    }
  ],
  external: ['vue'],
  plugins: [
    resolve(),
    commonjs(),
    typescript()
  ]
}
```

## 常用插件

```javascript
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import dts from 'rollup-plugin-dts'

export default [
  // 主构建
  {
    input: 'src/index.ts',
    output: [
      { file: 'dist/index.cjs.js', format: 'cjs' },
      { file: 'dist/index.esm.js', format: 'esm' }
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript()
    ]
  },
  // 类型声明文件
  {
    input: 'dist/types/index.d.ts',
    output: { file: 'dist/index.d.ts', format: 'esm' },
    plugins: [dts()]
  }
]
```

## 库开发最佳实践

```javascript
// package.json
{
  "name": "my-library",
  "version": "1.0.0",
  "main": "dist/index.cjs.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.cjs.js",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist"]
}
```

## 适用场景

- 库开发（UI 组件库、工具库）
- 简单应用打包
- 需要多种输出格式
- 追求输出代码精简

## 与 Webpack 对比

| 特性 | Rollup | Webpack |
|------|--------|---------|
| Tree Shaking | 原生支持，效果最佳 | 需要配置 |
| 输出体积 | 更小 | 较大（有运行时） |
| 代码分割 | 基础支持 | 强大 |
| 生态 | 库开发为主 | 应用开发为主 |
| 学习曲线 | 简单 | 复杂 |
