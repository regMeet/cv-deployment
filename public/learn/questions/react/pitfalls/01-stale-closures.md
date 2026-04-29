# Stale closures

> A function defined in a previous render still sees that render's variables. If it later runs, it reads **old** values.

## The classic example

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log(count);   // 💥 always 0
    }, 1000);
    return () => clearInterval(id);
  }, []);  // empty deps → setup once → forever-stale closure
}
```

The interval's callback was created when `count` was 0. The closure captured that value. New renders create new closures, but the **interval still references the old one**.

## Three fixes

### 1. Add the dep (re-create the effect)

```jsx
useEffect(() => {
  const id = setInterval(() => console.log(count), 1000);
  return () => clearInterval(id);
}, [count]);
```

Effect re-runs every time `count` changes. New interval, new closure.

### 2. Functional updater (when only setting state)

```jsx
setCount(c => c + 1);
```

Lets you increment without reading external `count`. No closure dependency.

### 3. Ref to the latest value

```jsx
const countRef = useRef(count);
useEffect(() => { countRef.current = count; });

useEffect(() => {
  const id = setInterval(() => console.log(countRef.current), 1000);
  return () => clearInterval(id);
}, []);
```

Refs are mutable; the interval reads the **current** value through the ref. Use this when you genuinely want the effect to set up once.

## Where else they bite

- `setTimeout` in event handlers.
- Subscriptions registered once with empty deps.
- WebSocket message handlers.
- Throttled / debounced functions captured at definition time.

## How to spot them

- "My handler shows old state."
- "My interval / subscription doesn't reflect the new value."
- ESLint `react-hooks/exhaustive-deps` warns you — **trust it**. Most stale-closure bugs are silenced lint warnings.

## Senior framing

> "Stale closures come from a function being defined in a past render and run later. I prefer functional updaters when I just need to update state, deps when the effect should restart on change, and a ref-to-latest pattern only when the setup must remain stable."
