# JSX and React elements

> JSX is **syntax sugar** for `React.createElement`. The thing that flows through React isn't HTML — it's a tree of plain objects.

## What JSX compiles to

```jsx
const el = <div className="card">Hello</div>;
```

Compiles to:

```js
const el = React.createElement('div', { className: 'card' }, 'Hello');
// → { type: 'div', props: { className: 'card', children: 'Hello' }, ... }
```

(Modern JSX transform uses `jsx`/`jsxs` from `react/jsx-runtime`, same idea.)

## What that object is

A **React element** — a lightweight, immutable description of what should appear on screen. Not the DOM. Not a component instance.

## Components vs elements

- A **component** is a function (or class) that returns elements.
- An **element** is an object describing a component (or host node).

```jsx
function Greet({ name }) { return <h1>Hi {name}</h1>; }

<Greet name="Ana" />
// element: { type: Greet, props: { name: 'Ana' } }
```

React calls `Greet` during reconciliation to expand it into more elements.

## Senior takeaways

- JSX isn't templates — it's expressions. Anything in `{}` is real JS.
- `<Foo />` (capital F) → component; `<foo />` → host element (DOM tag).
- `key` and `ref` are **special** — they don't get forwarded to your component as props.
- `children` is just a prop. You can pass any React node, including functions (render-props).

## Why this matters

Understanding that components return data (elements), not DOM, makes it click why:

- React can re-run a component cheaply (it's just a function).
- Conditional rendering is just JavaScript (`cond && <X />`).
- Composition works — you can pass elements around.
