# TypeScript与React

## 概述

在 React 项目中使用 TypeScript 的最佳实践。

## 一、函数组件

```typescript
interface ButtonProps {
  text: string
  onClick: () => void
  disabled?: boolean
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  disabled = false
}) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {text}
    </button>
  )
}
```

## 二、Hooks 类型

### useState

```typescript
const [count, setCount] = useState<number>(0)
const [user, setUser] = useState<User | null>(null)
```

### useEffect

```typescript
useEffect(() => {
  console.log('mounted')

  return () => {
    console.log('unmounted')
  }
}, [])
```

### useRef

```typescript
const inputRef = useRef<HTMLInputElement>(null)

inputRef.current?.focus()
```

### useContext

```typescript
interface Theme {
  primary: string
  secondary: string
}

const ThemeContext = createContext<Theme>({
  primary: 'blue',
  secondary: 'gray'
})

const theme = useContext(ThemeContext)
```

### useReducer

```typescript
type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'set'; payload: number }

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case 'increment':
      return state + 1
    case 'decrement':
      return state - 1
    case 'set':
      return action.payload
  }
}

const [state, dispatch] = useReducer(reducer, 0)
```

## 三、事件处理

```typescript
const Form = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} />
    </form>
  )
}
```

## 四、总结

- 使用 `React.FC<Props>` 定义组件
- 为 hooks 提供类型参数
- 使用 React 事件类型

---

**下一节**: [TypeScript与Node.js](./02-TypeScript与Node.js.md)
