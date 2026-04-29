# Re-render storms

> The whole tree re-renders every keystroke. Usually a few common causes — find them with the Profiler, fix at the source.

## Common causes

### 1. State lifted too high

A keystroke in a deep input updates state at the root → entire tree re-renders. The fix is **colocation**: keep state next to where it's used.

> See: [Local vs derived state](#react/state-management/local-vs-derived).

### 2. Provider value with new reference each render

```jsx
<Ctx.Provider value={{ user, setUser }}>  // 💥 new object every render
  ...
</Ctx.Provider>
```

Every consumer re-renders even when nothing changed. Memoize:

```jsx
const value = useMemo(() => ({ user, setUser }), [user]);
```

### 3. Inline objects/arrays/functions as memoized child props

```jsx
<MemoRow item={{ id, name }} onClick={() => handle(id)} />
// new object + new function every render → memo is useless
```

Hoist the constant or stabilize with `useMemo` / `useCallback`.

### 4. Context for high-frequency state

Every consumer re-renders on every change. Split the context, use a selector lib, or move to a real store.

### 5. Storing derived data as state

```jsx
const [items, setItems] = useState(...);
const [filtered, setFiltered] = useState(...); // 💥 derived state
useEffect(() => setFiltered(filter(items)), [items]); // syncs state in an effect
```

Doubles the renders and adds an effect that exists for no reason. Just compute:

```jsx
const filtered = useMemo(() => filter(items), [items]);
```

## How to find the culprit

- Open **React DevTools Profiler**.
- Record an interaction (typing in the input, clicking the button).
- Sort by render count and time.
- For each suspicious component, the Profiler shows **why** it re-rendered (props changed, hooks changed, parent re-rendered).

That tells you the source — usually a parent's prop reference or a state in the wrong place.

## Senior framing

> "I don't sprinkle memo everywhere. I find the cause with the Profiler — usually state lifted too high, a provider value that recreates every render, or derived state stored instead of computed. Fixing the source removes the storm; memoization is a band-aid for the rest."
