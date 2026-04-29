# Live search filter

> Easy on the surface. The trap is **derived state**.

## Problem

Given a list of items, render an input that filters them as the user types (case-insensitive substring match).

## Solution

```jsx
import { useState, useMemo } from 'react';

export function LiveSearch({ items }) {
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => it.toLowerCase().includes(q));
  }, [items, query]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search…"
        aria-label="Search items"
      />
      <ul>
        {visible.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
      {visible.length === 0 && <p>No matches.</p>}
    </div>
  );
}
```

## The anti-pattern to avoid

Don't store filtered results in state and sync with `useEffect`:

```jsx
// 🚫 Don't do this
const [filtered, setFiltered] = useState(items);
useEffect(() => {
  setFiltered(items.filter(...));
}, [items, query]);
```

This causes an extra render and gets stale. **Compute during render** — that's what React is for. Use `useMemo` only when the computation is genuinely expensive.

## Follow-ups

- **"It feels laggy with 10k items."** Two paths: debounce the query (see `useDebounce`), or virtualize the list (`react-window`).
- **"Search server-side."** Now `items` lives on the server — you need debouncing + cancellation. See the Autocomplete question.
- **"Highlight matches."** Wrap matched substring in `<mark>`. Build a small `splitMatch(text, query)` helper.
