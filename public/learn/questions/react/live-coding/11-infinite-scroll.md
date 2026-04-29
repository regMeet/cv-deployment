# Infinite scroll (IntersectionObserver)

> Tests **refs**, the modern observer API, and pagination state.

## Problem

Render a list that loads more items when the user scrolls near the bottom. Don't trigger duplicate fetches. Stop when there are no more pages.

## Solution

```jsx
import { useCallback, useEffect, useRef, useState } from 'react';

export function InfiniteList({ fetchPage }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef(null);

  // load a page
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPage(page).then((res) => {
      if (cancelled) return;
      setItems((prev) => [...prev, ...res.items]);
      setHasMore(res.hasMore);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [page, fetchPage]);

  // observe the sentinel
  useEffect(() => {
    if (!hasMore || loading) return;
    const node = sentinelRef.current;
    if (!node) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setPage((p) => p + 1);
      },
      { rootMargin: '200px' },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [hasMore, loading]);

  return (
    <ul>
      {items.map((it) => <li key={it.id}>{it.title}</li>)}
      {hasMore && <li ref={sentinelRef} aria-hidden="true" style={{ height: 1 }} />}
      {loading && <li>Loading…</li>}
      {!hasMore && <li>End of list.</li>}
    </ul>
  );
}
```

## Why IntersectionObserver, not scroll listeners

- Scroll listeners fire **dozens of times per second**, force layout reads, kill performance.
- IntersectionObserver is **passive**, runs off the main thread, fires only on threshold crossings.
- `rootMargin: '200px'` triggers the load *before* the user reaches the bottom — feels seamless.

## What to be careful about

- **Don't observe while loading.** Otherwise the observer fires twice while the same page is in flight → duplicate items. Hence the `loading` guard.
- **Cancel-flag in the fetch effect.** A fast scroll past two pages: page 2 returns after page 3 → out-of-order appends without the flag.
- **Stable `fetchPage` reference.** If the parent re-creates it on every render, the effect re-runs and resets pagination. Wrap with `useCallback` upstream.

## Follow-ups

- **"Show errors."** Add `error` state, render a "Retry" button that resets the page.
- **"Window virtualization."** This still renders every loaded item in the DOM. For 10k+ items, combine with `react-window` and observe a footer outside the virtualized region.
- **"Cursor-based pagination."** Replace `page` with a `cursor` returned by the API.
