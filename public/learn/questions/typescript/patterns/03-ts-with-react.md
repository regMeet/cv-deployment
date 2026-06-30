# TypeScript with React — props, hooks, events

> The patterns you use every day in a typed React codebase.

## Typing props

```tsx
// Basic component
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

function Button({ label, onClick, disabled = false, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled} className={variant}>{label}</button>;
}
```

## `children` prop

```tsx
import { ReactNode, PropsWithChildren } from 'react';

// Option A — explicit
interface CardProps { title: string; children: ReactNode; }

// Option B — PropsWithChildren utility
type CardProps = PropsWithChildren<{ title: string }>;

function Card({ title, children }: CardProps) {
  return <div><h2>{title}</h2>{children}</div>;
}
```

## Extending HTML element props

```tsx
import { ComponentPropsWithoutRef } from 'react';

// Button with all native button attributes + extras
interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  loading?: boolean;
}

function Button({ loading, children, ...rest }: ButtonProps) {
  return <button {...rest} disabled={loading || rest.disabled}>{children}</button>;
}
```

## Typing `useState`

```tsx
const [count, setCount] = useState(0);           // inferred: number
const [user, setUser]   = useState<User | null>(null); // explicit generic needed

// Typed with a union
const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
```

## Typing `useRef`

```tsx
// DOM ref — must initialize to null
const inputRef = useRef<HTMLInputElement>(null);

// Mutable value — no null needed
const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

// Usage
<input ref={inputRef} />
inputRef.current?.focus();
```

## Typing `useReducer`

```tsx
type State  = { count: number; error: string | null };
type Action = { type: 'inc' } | { type: 'dec' } | { type: 'error'; message: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'inc':   return { ...state, count: state.count + 1 };
    case 'dec':   return { ...state, count: state.count - 1 };
    case 'error': return { ...state, error: action.message };
  }
}
```

## Typing events

```tsx
// Input change
function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  setValue(e.target.value);
}

// Form submit
function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
}

// Button click
function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
  e.currentTarget.blur();
}
```

## Typing custom hooks

```tsx
function useToggle(initial = false): [boolean, () => void] {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue(v => !v), []);
  return [value, toggle];
}
```

Return a **tuple** with explicit type annotation — otherwise TypeScript infers `(boolean | (() => void))[]`.

## Generic components

```tsx
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T) => string;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, i) => (
        <li key={keyExtractor(item)}>{renderItem(item, i)}</li>
      ))}
    </ul>
  );
}

// Usage — T inferred as User
<List items={users} keyExtractor={u => u.id} renderItem={u => <span>{u.name}</span>} />
```

## Senior follow-ups

- **"What's the difference between `React.FC` and just annotating props?"** `React.FC` (deprecated as of React 18) implicitly added `children` and `displayName`. Most teams now annotate props directly — it's clearer and avoids the implicit children.
- **"How do you type a ref passed from a parent?"** Use `forwardRef`: `React.forwardRef<HTMLInputElement, InputProps>((props, ref) => <input ref={ref} {...props} />)`. The first generic is the element type, the second is the props type.
- **"What's `as const` useful for in React?"** Locking down object shapes so TypeScript infers literal types instead of widened primitives. Common with `useReducer` action creators and config objects.
