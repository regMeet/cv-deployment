# When does a component re-render?

> Three triggers — and one widespread misconception.

## A component re-renders when

1. Its **state** changes (`setState`).
2. Its **props** change (parent re-rendered with different props — or any new reference).
3. A **context** it consumes changes value.
4. Its **parent re-renders** (by default — unless memoized).

## The big misconception

> "Props didn't change visually, so my component shouldn't re-render."

**Wrong.** By default, when a parent re-renders, every child re-renders too — *regardless* of whether the props are referentially equal. React doesn't "skip" rendering for free.

To make React skip, you need `React.memo` (and stable prop references).

## Re-render ≠ DOM update

A re-render produces a new virtual DOM, which React diffs against the previous one. If nothing changed, **no DOM mutations happen**. So a "wasted" re-render is cheap, but not free — the function runs, hooks execute, etc.

## What changes a prop reference

```jsx
<Child onClick={() => doX()}              />  // new function every render
<Child config={{ a: 1 }}                  />  // new object every render
<Child items={list.filter(x => x.active)} />  // new array every render
```

If `Child` is memoized but you pass new references every render, the memo never hits. Use `useCallback` / `useMemo` (or move the constants outside) to stabilize.

## Profiler mental check

If a component is re-rendering "for no reason":

1. Did **state** change? → expected.
2. Did **context** change? → expected.
3. Did **parent** re-render? → expected, unless `React.memo` + stable props.
4. None of the above? → check `React DevTools Profiler` — it'll tell you exactly why.

## Interview line

> "By default, every parent re-render re-renders its children — even if props are referentially equal. To skip, you need `React.memo` plus stable prop references. The DevTools Profiler tells you exactly which prop or hook caused a re-render."
