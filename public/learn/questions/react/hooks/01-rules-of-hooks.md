# Rules of Hooks (and why they exist)

> Two rules. Both come from how React tracks hooks **by call order**.

## The rules

1. **Only call hooks at the top level.**
   Not inside conditionals, loops, or nested functions.

2. **Only call hooks from React functions.**
   React function components or other custom hooks. Not regular JS functions.

## Why — call order

Internally, React stores hook state in an array per component. Each render walks the array **in the same order**:

```js
// pseudo
[useState, useEffect, useMemo]   // render 1
[useState, useEffect, useMemo]   // render 2 — must match
```

If you conditionally skip a hook, the order shifts → the next hook reads the wrong slot → bizarre bugs.

## Bad

```jsx
function Foo({ flag }) {
  if (flag) {
    const [x, setX] = useState(0); // 💥 conditional
  }
  const [y, setY] = useState(0);
}
```

## Good — gate the *behavior*, not the *hook call*

```jsx
function Foo({ flag }) {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    if (!flag) return;
    // ...
  }, [flag]);
}
```

## Senior framing

> "The rules exist because React tracks hooks by call order. Skipping a hook conditionally would shift the indices and corrupt state. The mental fix is: hooks always run in the same order; gate the *logic* inside, not the call itself."

## Bonus

The `eslint-plugin-react-hooks` plugin (`react-hooks/rules-of-hooks` and `exhaustive-deps`) catches both rules and dependency mistakes — turn it on as an error, not a warning.
