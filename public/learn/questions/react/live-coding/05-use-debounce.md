# Custom hook: useDebounce

> Tests effect cleanup + the difference between **debouncing a value** and **debouncing a callback**.

## Problem

Write a `useDebounce(value, delay)` hook that returns the value after `delay` ms of "quiet" (no new updates).

## Solution

```jsx
import { useEffect, useState } from 'react';

export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
```

## Usage

```jsx
function Search() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery) return;
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`).then(/* … */);
  }, [debouncedQuery]);

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

## How the cleanup makes it work

Every render where `value` changes:
1. Schedules a new `setTimeout`.
2. Cleanup runs first → cancels the **previous** pending timeout.

So the `setDebounced` only fires once the user stops typing for `delay` ms.

## Senior follow-ups

- **"Debounce a callback instead of a value."** Different pattern — typically `useCallback` + a ref to a `setTimeout`. Used when calling APIs imperatively (e.g. `onChange={debouncedFetch}`).
- **"Why not lodash.debounce?"** Lodash's `debounce` returns a stable function — fine, but you need to memoize it with `useMemo` and clean it up on unmount. The hook above is simpler for the value case.
- **"Add a leading edge."** Two state slots: `debouncedLeading` (fires immediately) + `debouncedTrailing` (fires after quiet).
- **"Test it."** `jest.useFakeTimers()` + `act(() => jest.advanceTimersByTime(300))`.
