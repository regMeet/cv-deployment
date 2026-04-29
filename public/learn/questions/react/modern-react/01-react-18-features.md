# React 18 — concurrent rendering, transitions, Suspense

> The big shift in React 18 was making rendering **interruptible** so the UI can stay responsive under heavy work.

## Concurrent rendering

Built on Fiber. React can **start rendering**, **pause**, do something more urgent, and **resume**. Before, rendering was synchronous and blocking.

You don't enable it directly — opt-in features (transitions, Suspense, deferred values) leverage it.

## `startTransition` / `useTransition`

Marks a state update as **non-urgent**, so React can interrupt it if something more important comes along (like user input).

```jsx
const [isPending, startTransition] = useTransition();

function onSearchChange(e) {
  setQuery(e.target.value);                      // urgent (controlled input)
  startTransition(() => {
    setResults(filter(items, e.target.value));   // can be interrupted
  });
}
```

**Use case:** filtering / heavy list rendering while typing — keep the input snappy.

## `useDeferredValue`

Receives a value, returns a "deferred" copy that lags behind during heavy work.

```jsx
const deferredQuery = useDeferredValue(query);
const results = useMemo(() => filter(items, deferredQuery), [items, deferredQuery]);
```

Cleaner than `useTransition` when you receive the value as a prop and don't control the setter.

## Suspense for data

Suspense wraps components that can "suspend" while waiting for data. The nearest `<Suspense fallback>` shows the placeholder until they resolve.

```jsx
<Suspense fallback={<Spinner />}>
  <UserProfile id={id} />
</Suspense>
```

Suspense for data is fully supported in **frameworks** (Next.js, Remix) and via libraries that integrate with it (React Query, Relay).

## Automatic batching

React 17 batched state updates inside event handlers, but not inside promises / timers. **React 18 batches everywhere.**

```jsx
fetch('/api').then(() => {
  setA(1);
  setB(2);
  // React 18: 1 re-render. React 17: 2 re-renders.
});
```

## `useSyncExternalStore`

For libraries integrating with **external mutable stores** (Redux, Zustand, Apollo). It's how those libraries became safe under concurrent rendering — they declare how to subscribe and snapshot, and React calls them correctly across torn renders.

## `useId`

Generates a unique ID stable across server and client renders. Great for `aria-labelledby`, label/input pairs in SSR.

## Senior framing

> "React 18's headline is concurrent rendering — making renders interruptible. The user-visible features built on it are transitions, deferred values, Suspense for data, and automatic batching. The mental model: mark non-urgent updates so React can keep input responsive while it works on them."
