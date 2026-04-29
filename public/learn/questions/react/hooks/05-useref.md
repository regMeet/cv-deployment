# `useRef` — DOM refs and mutable values

> Two uses, often confused. **Same hook, different intents.**

## Use 1 — DOM refs

```jsx
const inputRef = useRef(null);
return <input ref={inputRef} />;

inputRef.current.focus();
```

- React assigns the DOM node to `ref.current` after mount.
- Read it inside an effect or event handler — **not during render**.

## Use 2 — mutable container that survives renders

A "box" you can mutate without triggering a re-render.

```jsx
const renderCount = useRef(0);
renderCount.current++;  // mutate freely, no re-render
```

Useful for:

- Storing the latest value of something (e.g., latest `props` for use inside an interval).
- Caching imperative results.
- Holding interval/timer IDs.

## Key distinction vs state

- `useState` → **change triggers a re-render**.
- `useRef` → **change does NOT trigger a re-render**. It's just a mutable slot.

If you need the UI to react, use `useState`. If you just need to remember something across renders, use `useRef`.

## Watch out

- **Don't read `.current` during render** — refs are populated after commit; reading too early gives the previous value (or null).
- **Don't put rendered state in a ref** — e.g., the value the user typed should be `useState`, not `useRef`. Otherwise the UI doesn't update.

## Forwarding refs

If you want a ref to point inside a custom component:

```jsx
const Button = forwardRef((props, ref) => (
  <button ref={ref} {...props} />
));
```

In React 19, `ref` is a regular prop on function components — no `forwardRef` needed.

## Interview line

> "`useRef` covers two cases: holding a DOM node, and holding a mutable value across renders without causing a re-render. The mental check is: 'does the UI need to update when this changes?' — yes → `useState`, no → `useRef`."
