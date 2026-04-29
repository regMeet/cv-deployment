# Custom hooks for logic reuse

> The modern way to share **stateful logic**. Replaces render props and HOCs in most cases.

## What goes in a custom hook

- **Stateful logic** that uses other hooks.
- Subscriptions, derived state, side effects.
- Anything you'd extract from a component to reuse elsewhere.

## Example — `useFetch` (educational; for production use React Query)

```jsx
function useFetch(url) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null });

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading', data: null, error: null });

    fetch(url)
      .then(r => r.json())
      .then(data => { if (!cancelled) setState({ status: 'success', data, error: null }); })
      .catch(err  => { if (!cancelled) setState({ status: 'error', data: null, error: err }); });

    return () => { cancelled = true; };
  }, [url]);

  return state;
}
```

## How to keep them clean

- **Single responsibility.** One hook = one concern.
- **Return a small, stable shape.** Consumers shouldn't have to remember positional arrays beyond 2 elements.
- **Memoize what you return** if consumers depend on stable identities (callbacks especially).
- **Never depend on call-site context** — the hook should be pure with respect to its inputs.

## When NOT to make a hook

If the logic doesn't use other hooks, it's not a custom hook — it's a function. Don't add the `use` prefix; it's misleading.

```js
function formatUSD(n) { /* no hooks */ }   // function, not a hook
```

## Composing custom hooks

```jsx
function useUser() {
  const id = useUserId();
  const data = useFetch(`/api/users/${id}`);
  return data;
}
```

Hooks compose like Lego. That's the whole appeal vs HOC wrapper-trees.

## Common production-grade ones

- `useDebounce`, `useThrottle`
- `useLocalStorage`, `useSessionStorage`
- `useMediaQuery`, `useOnClickOutside`
- `usePrevious`
- domain-specific: `useCart`, `useAuth`, `useFeatureFlag`

## Senior framing

> "Custom hooks let me extract stateful logic without wrapper trees. I follow three rules: name them `use*` only if they call other hooks, keep them single-purpose, and stabilize what they return. They compose naturally — that's why they replaced HOCs and render props."
