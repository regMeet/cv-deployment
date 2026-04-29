# `useMemo` / `useCallback` honestly — when they're worth it

> Most uses of `useMemo` and `useCallback` are **noise**. They don't make your app faster; they make it harder to read and sometimes slower.

## What they cost

Every memoization hook:

- Allocates an object to store the cached value + deps.
- Runs a deps comparison every render.
- Adds visual noise to your code.

If the cached operation is cheaper than the comparison + bookkeeping, **you've made things slower**, not faster.

## When they're actually worth it

### 1. Genuinely expensive computation

```jsx
const sorted = useMemo(() => bigSort(items), [items]);
```

`bigSort` over 10,000 items, several ms → memo helps.

### 2. Stable identity for a memoized child

```jsx
const handleClick = useCallback(id => onSelect(id), [onSelect]);
return <MemoizedRow onClick={handleClick} />;  // child compares props by reference
```

Without `useCallback`, the memo on `Row` is useless.

### 3. Stable identity for a hook dependency

```jsx
const config = useMemo(() => ({ url, headers }), [url, headers]);

useEffect(() => {
  fetch(config.url, { headers: config.headers });
}, [config]);  // without useMemo, config is "new" every render → effect runs every render
```

## When they're noise

- The computation is `a + b` or `arr.length`.
- The child isn't memoized — it re-renders regardless.
- Nothing reads the value as a stable dep.

## React Compiler (React 19+)

The React Compiler (formerly React Forget) **automates this**. With it enabled, you write straightforward code and the compiler inserts memoization where it actually helps. Manual `useMemo`/`useCallback` becomes mostly unnecessary.

> If your team uses the compiler, default to **no manual memoization** and only add it where the compiler can't infer (rare).

## Senior framing

> "I don't memoize defensively. I add `useMemo` / `useCallback` for three concrete reasons: a genuinely expensive computation, a memoized child that needs stable props, or a hook dependency that needs stable identity. With the React Compiler I drop almost all of it. Profile, don't guess."
