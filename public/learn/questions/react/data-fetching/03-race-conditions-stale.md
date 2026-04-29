# Race conditions & stale closures in fetching

> Two distinct bugs that look the same in the wild: **the older request wins**, or **the handler reads old state**.

## Race condition

Multiple in-flight requests; results arrive out of order; the slow one overwrites the fresh one.

```jsx
useEffect(() => {
  fetch(`/api/users/${id}`)
    .then(r => r.json())
    .then(setUser);
}, [id]);
```

User changes from `id=1` to `id=2`. Request 1 is slow. Request 2 returns first → state shows id=2. Then request 1 returns → overwrites with id=1. UI lies.

### Fixes

**Abort the previous request:**

```jsx
useEffect(() => {
  const ctrl = new AbortController();
  fetch(`/api/users/${id}`, { signal: ctrl.signal })
    .then(r => r.json())
    .then(setUser);
  return () => ctrl.abort();
}, [id]);
```

**Or guard with a flag:**

```jsx
useEffect(() => {
  let cancelled = false;
  fetch(`/api/users/${id}`).then(r => r.json()).then(d => {
    if (!cancelled) setUser(d);
  });
  return () => { cancelled = true; };
}, [id]);
```

**Or use React Query** — query keys (`['user', id]`) handle this automatically.

## Stale closure

A handler captures old state because it was defined in a previous render.

```jsx
useEffect(() => {
  const id = setInterval(() => {
    console.log(count);  // 💥 always 0
  }, 1000);
  return () => clearInterval(id);
}, []);  // no deps → setup once → forever-old closure
```

The interval's callback was created when `count` was 0. It keeps reading the same closure.

### Fixes

**Include the dep:**

```jsx
useEffect(() => {
  const id = setInterval(() => console.log(count), 1000);
  return () => clearInterval(id);
}, [count]); // re-create the interval each time
```

**Or use a ref to read the latest value:**

```jsx
const countRef = useRef(count);
useEffect(() => { countRef.current = count; });

useEffect(() => {
  const id = setInterval(() => console.log(countRef.current), 1000);
  return () => clearInterval(id);
}, []);
```

**Or use the functional updater** when only setting:

```jsx
setCount(c => c + 1);  // no need to read external `count`
```

## How to spot them

- "Why does my UI show old data?" → race.
- "Why does my interval / event handler ignore new state?" → stale closure.

## Senior framing

> "Race conditions and stale closures are different. Races come from older async results overwriting newer ones — fix with abort or cancellation flags. Stale closures come from handlers capturing old state — fix with proper deps, a ref to the latest value, or the functional updater for state-only updates. React Query handles races for you; closures still bite if you're not careful."
