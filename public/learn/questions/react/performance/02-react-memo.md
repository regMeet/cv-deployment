# `React.memo` — when it actually helps

> `React.memo` skips re-rendering a component if its props are **referentially equal** to the previous render. Two conditions must hold for it to actually help.

## What it does

```jsx
const Row = React.memo(function Row({ item }) {
  return <div>{item.name}</div>;
});
```

React compares each prop with `Object.is` (shallow). If all props are the same, it skips re-rendering.

## Two conditions for it to actually help

### 1. The component must be **expensive enough**

If the component is `<span>{count}</span>`, the cost of re-rendering is essentially zero. Wrapping in `memo` adds bookkeeping overhead that's bigger than the savings.

### 2. Props must be **stable across renders**

This is where most `React.memo` usage breaks:

```jsx
// parent
<Row item={items[i]} onClick={() => handle(i)} />  // ❌ new function every render
```

`memo` compares `onClick` → different reference → re-render anyway. You need `useCallback` (or pass an index/id and put the handler higher up).

## Custom comparison

```jsx
React.memo(Component, (prev, next) => prev.id === next.id);
```

Use rarely. If you find yourself writing custom comparators frequently, your component is probably accepting too many props or the parent is generating too much.

## When `memo` actually pays off

- Long lists of rows.
- Heavy form fields with derived state.
- Modal/popover children that re-render whenever the host page does.

## When it doesn't

- Cheap leaves.
- Children that always receive new prop references.
- Components whose props change every render anyway.

## Senior framing

> "`React.memo` only helps when the component's render cost is non-trivial AND its props are stable across renders. Skipping either condition means you're paying the comparison cost without the savings. I profile first, then memoize the hot spots — not by default."
