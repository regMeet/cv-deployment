# Fetch + display list (loading / error)

> Tests effect lifecycle, race conditions, and the three-state UI.

## Problem

Fetch a list from an API and render it. Show a loading state, an error state, and an empty state.

## Solution

```jsx
import { useEffect, useState } from 'react';

export function UserList() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);

    fetch('/api/users', { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => setData(json))
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err);
      })
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error)   return <p role="alert">Failed: {error.message}</p>;
  if (!data?.length) return <p>No users.</p>;

  return (
    <ul>
      {data.map((u) => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}
```

## Things interviewers grade

- **AbortController** in the cleanup. Without it, a fast unmount + slow network = "set state on unmounted component" warnings or stale data wins.
- **`if (!r.ok) throw`.** `fetch` only rejects on network failure; a 500 is a "successful" response.
- **Three states + empty.** Don't conflate `loading` with `data === null`.
- **`role="alert"`** on the error so screen readers announce it.

## Why hand-rolled fetch is fine for an interview

You don't need React Query / SWR for one endpoint. The interviewer is checking that you understand the **lifecycle**, not that you've memorized a library.

## Follow-up: refetch on prop change

Add the fetch to a `useEffect` keyed on the prop:

```jsx
useEffect(() => { /* fetch + abort */ }, [userId]);
```

Each new `userId` aborts the previous request via the cleanup. That's how you avoid the **race condition** where a slow first request resolves *after* a fast second one.
