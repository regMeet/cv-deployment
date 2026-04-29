# Effect dependency-array bugs

> Three classic ways to write a broken `useEffect`. The lint rule `react-hooks/exhaustive-deps` catches all of them — keep it on as an error.

## Bug 1 — missing dep (stale closure)

```jsx
useEffect(() => {
  console.log(count); // uses count
}, []); // 💥 count not in deps
```

Effect runs once with the original `count`. Subsequent renders don't re-run it; the captured `count` stays stale.

**Fix:** include `count`.

## Bug 2 — object/array dep recreated every render

```jsx
const config = { url: '/api', headers: { auth: token } };

useEffect(() => {
  fetch(config.url, { headers: config.headers });
}, [config]); // 💥 new object every render → effect runs every render
```

Even though the **values** are the same, the **reference** is new every render. React compares by `Object.is`, so `config` is "different" every time.

**Fixes:**

- Memoize:
  ```jsx
  const config = useMemo(() => ({ url, headers: { auth: token } }), [url, token]);
  ```
- Or break into primitive deps:
  ```jsx
  useEffect(() => { fetch(url, { headers: { auth: token } }); }, [url, token]);
  ```

## Bug 3 — function dep that changes every render

```jsx
function Foo({ onSave }) {
  useEffect(() => { onSave(); }, [onSave]);  // 💥 if parent re-creates onSave, this fires endlessly
}
```

If the parent passes a new `onSave` reference each render, the effect runs every render. Easy to create infinite loops with this:

```jsx
function Foo({ onLoad }) {
  const [data, setData] = useState();

  useEffect(() => {
    fetch('/api').then(setData);
    onLoad();
  }, [onLoad]); // parent re-renders due to data change → onLoad new → effect runs → 💥 loop
}
```

**Fixes:**

- Parent: stabilize with `useCallback`.
- Or pull the value inside (`useEvent` / latest-ref pattern).
- Or don't put it in deps if calling-once is the actual intent.

## When you genuinely want "run once"

The honest pattern is to spell out **why** you're skipping deps. Two safe options:

- **Mount effects** (e.g., one-time analytics):
  ```jsx
  useEffect(() => { analytics.track('view'); }, []);
  // ESLint: // eslint-disable-next-line react-hooks/exhaustive-deps  ← if needed
  ```
- **Latest ref** (capture the latest value but keep setup stable). See [Stale closures](#react/pitfalls/stale-closures).

## Senior framing

> "Almost every effect bug I see traces back to deps. My rule: trust the linter. If I'm tempted to silence it, that's a sign I should restructure — pull out a primitive dep, memoize an object, or use a latest-ref pattern. Empty deps with values inside is almost always wrong."
