# Data fetching with `useEffect` — pitfalls

> The "hello world" of React tutorials, and a minefield in production. Most issues here are why React Query / SWR exist.

## The naive version

```jsx
useEffect(() => {
  fetch(`/api/users/${id}`)
    .then(r => r.json())
    .then(setUser);
}, [id]);
```

Looks fine. Hides at least 5 bugs.

## Pitfalls

### 1. Race conditions

User navigates from `id=1` to `id=2`. Both requests are in flight. The slower one wins. UI shows `id=1` data while URL says `id=2`.

**Fix:** abort the previous request, or guard with a flag.

```jsx
useEffect(() => {
  const ctrl = new AbortController();
  fetch(`/api/users/${id}`, { signal: ctrl.signal })
    .then(r => r.json())
    .then(setUser)
    .catch(err => { if (err.name !== 'AbortError') /* handle */; });
  return () => ctrl.abort();
}, [id]);
```

### 2. No deduplication

Two components fetch the same URL → two network calls. With caching, dedup, request batching — none of this is built-in.

### 3. No retry / no stale-while-revalidate

Network blip → request fails. UI shows error. User has to manually retry. No background refetch when the window regains focus.

### 4. No loading / error state machine

You typically need `idle / loading / success / error` plus `refetching`, `stale`, `mutating`. Modeling that correctly with `useState` is verbose; with `useReducer` it's better; with React Query it's already done for you.

### 5. StrictMode double-fire confuses people

React 18 dev mode runs effects twice. Without abort, you see two requests in the network tab and think "what?". Production runs them once.

## When `useEffect` for fetching is OK

- Tiny app, one or two endpoints, no caching needs.
- Trivial fire-and-forget.
- Loading data needed only at component init, that doesn't need to survive remount or refetch.

## What I'd reach for instead

- **React Query** / **SWR** — caching, dedup, refetch on focus, retries, mutations.
- **RTK Query** — same idea, integrated with Redux Toolkit.
- **Server-side data loaders** — Next.js / Remix patterns where data fetching happens before rendering.

## Senior framing

> "I avoid `useEffect` for data fetching except for trivial cases. It hides race conditions, has no caching or dedup, no stale-while-revalidate, no retries — and you reinvent all of that badly. React Query handles every one of those out of the box."
