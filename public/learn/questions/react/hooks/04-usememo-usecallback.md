# `useMemo` & `useCallback` — what they do

> They cache values across renders. They're tools for **referential stability** and for skipping expensive computations — not magic perf boosters.

## `useMemo` — cache a computed value

```jsx
const sorted = useMemo(
  () => heavySort(items),
  [items]
);
```

Returns the previous result if `[items]` didn't change.

## `useCallback` — cache a function reference

```jsx
const handleClick = useCallback(
  (id) => deleteItem(id),
  [deleteItem]
);
```

Same as `useMemo(() => fn, deps)`. Useful so child components that compare props by reference (`React.memo`, `useEffect` dep arrays) don't see a "new" function every render.

## When they actually help

1. The computation is **genuinely expensive** (sorting/filtering big arrays, parsing, complex shape transforms).
2. The value is passed to a **memoized child** (`React.memo`) and you want it to actually skip re-rendering.
3. The value is in a **dependency array** (`useEffect`, `useMemo`) and you want stable identity.

## When they don't help (or hurt)

- A trivial calculation. The bookkeeping cost ≈ the computation cost.
- Cached value passed to a non-memoized child — re-renders happen anyway.
- Used everywhere "just in case" — code becomes noisier and slower.

## Code smell

If your code is full of `useMemo` and `useCallback` everywhere, you've memoized your way out of being able to read it. **Profile first**, memoize the hot spots.

## Honest take

> See: [useMemo / useCallback honestly](#react/performance/memoization-honestly) for the deeper "is it worth it" discussion.

## Interview line

> "`useMemo` caches a value, `useCallback` caches a function reference. I reach for them when I have a memoized child that needs stable props, an effect dep that needs stable identity, or a computation that's actually expensive — not as a default everywhere."
