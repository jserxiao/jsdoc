# 模块 Augmentation

模块 Augmentation 允许扩展现有模块的类型。

---

## 目录

- [全局扩展](#全局扩展)
- [模块扩展](#模块扩展)
- [扩展第三方库](#扩展第三方库)

---

## 全局扩展

### declare global

```typescript
// 在模块中扩展全局作用域
declare global {
  interface Array<T> {
    first(): T | undefined;
    last(): T | undefined;
  }

  interface Window {
    myAPI: {
      version: string;
      init(): void;
    };
  }
}

// 必须有导出才能被视为模块
export {};
```

### 扩展 NodeJS

```typescript
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      API_URL: string;
      DATABASE_URL: string;
    }
  }
}

export {};
```

---

## 模块扩展

### 扩展模块类型

```typescript
// 扩展 Express
import 'express';

declare module 'express' {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: 'admin' | 'user';
    };
    session: {
      id: string;
      data: Record<string, unknown>;
    };
  }

  interface Response {
    success(data: unknown): void;
    error(message: string, code?: number): void;
  }
}
```

### 扩展 Vue

```typescript
import Vue from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    $myPlugin: {
      doSomething(): void;
    };
  }
}
```

### 扩展 Sequelize

```typescript
import { Model } from 'sequelize';

declare module 'sequelize' {
  interface Model {
    toJSON(): any;
  }
}
```

---

## 扩展第三方库

### Express Session

```typescript
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId: string;
    role: string;
    createdAt: Date;
  }
}
```

### Jest 扩展

```typescript
declare namespace jest {
  interface Matchers<R> {
    toBeWithinRange(floor: number, ceiling: number): R;
  }
}

expect(100).toBeWithinRange(0, 150);
```

### Redux 扩展

```typescript
declare module 'redux' {
  interface Dispatch {
    <A extends Action>(action: A): A;
  }
}
```

---

## 注意事项

### 扩展规则

1. 必须在模块文件中（有 import 或 export）
2. 使用 `declare module` 声明要扩展的模块
3. 只能添加新成员，不能修改现有成员类型

### 文件位置

```
src/
├── types/
│   ├── express.d.ts      # 扩展 Express
│   ├── global.d.ts       # 全局扩展
│   └── vue.d.ts          # 扩展 Vue
└── index.ts
```

---

**下一节**: [项目引用](./06-项目引用.md)
