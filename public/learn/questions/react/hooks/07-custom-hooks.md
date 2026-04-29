# Custom hooks — extracting logic

> A custom hook is just a function that **starts with `use`** and **calls other hooks**. The convention is what makes the linter check the rules of hooks.

## What they're for

Reuse **stateful logic** across components. Not just functions — logic that uses hooks.

## Example — useDebounce

```jsx
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

// usage
const debouncedQuery = useDebounce(query);
```

## Example — useLocalStorage

```jsx
function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initial;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
```

## Why custom hooks > HOCs / render props

- Easier to compose (just call multiple hooks).
- No wrapper components polluting the tree.
- TypeScript inference works naturally.
- Logic and state stay together.

## What's NOT a hook

A function that doesn't use hooks shouldn't start with `use`. Just be a regular function:

```js
function formatCurrency(n) { /* no hooks */ } // not a hook, don't name it `useFormatCurrency`
```

## Senior framing

> "Custom hooks are how I share stateful logic. They keep components thin and let me unit-test the logic in isolation. Two rules: name it `use*`, and only put real hook usage in it — otherwise it's just a function pretending to be one."

## Common useful hooks to mention

- `useDebounce`, `useThrottle`
- `useLocalStorage`, `useSessionStorage`
- `useMediaQuery`
- `usePrevious`
- `useOnClickOutside`
- `useFetch` (or just use React Query)
