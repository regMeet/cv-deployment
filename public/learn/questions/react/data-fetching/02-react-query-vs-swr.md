# React Query vs SWR — why use them

> They're not "fetch wrappers". They're **server-state cache** libraries. That distinction is what makes them transformative.

## What server state is

Data that lives on a server and you cache on the client:

- Different from UI state (modal open, selected tab).
- Has **freshness** characteristics — it can go stale.
- Can be **shared** across components.
- Can be **invalidated** by mutations.

UI state belongs in local state / Zustand / Redux. Server state belongs in React Query / SWR.

## What they give you out of the box

- **Cache** — same query key reused → no duplicate fetches.
- **Deduping** — N components asking for the same data → 1 request.
- **Stale-while-revalidate** — return cached, refetch in background.
- **Refetch on focus / reconnect** — data stays fresh as the user comes back.
- **Retries** with exponential backoff.
- **Pagination** and **infinite queries** primitives.
- **Mutations** with optimistic updates and rollback.
- **Devtools** showing every cache entry and its state.

## React Query (TanStack Query)

```jsx
import { useQuery } from '@tanstack/react-query';

const { data, isLoading, error } = useQuery({
  queryKey: ['user', id],
  queryFn: () => fetch(`/api/users/${id}`).then(r => r.json()),
});
```

- More feature-rich.
- Larger API surface.
- Excellent devtools.
- Larger bundle than SWR.
- Standard for medium/large apps.

## SWR (Vercel)

```jsx
import useSWR from 'swr';

const { data, error, isLoading } = useSWR(`/api/users/${id}`, fetcher);
```

- Smaller, simpler.
- Great defaults.
- Less surface area for advanced cases (mutations, infinite queries are simpler).
- Works beautifully with Next.js.

## Decision

| Need | Pick |
|---|---|
| Default for a small/medium app | SWR |
| Complex caching, advanced mutations, big app | React Query |
| Already using Redux Toolkit | RTK Query |
| Next.js + simple needs | SWR |

## Mutations + optimistic updates

```jsx
const mutation = useMutation({
  mutationFn: updateUser,
  onMutate: async (newUser) => {
    await queryClient.cancelQueries({ queryKey: ['user', newUser.id] });
    const prev = queryClient.getQueryData(['user', newUser.id]);
    queryClient.setQueryData(['user', newUser.id], newUser); // optimistic
    return { prev };
  },
  onError: (_err, newUser, ctx) => {
    queryClient.setQueryData(['user', newUser.id], ctx.prev); // rollback
  },
  onSettled: (_data, _err, newUser) => {
    queryClient.invalidateQueries({ queryKey: ['user', newUser.id] });
  },
});
```

That much code in `useEffect` would be brittle. Here it's idiomatic.

## Senior framing

> "Server state and UI state are different problems. React Query / SWR treat the network as a cache layer with freshness, dedup, and revalidation — solving things you'd build poorly by hand. I default to React Query for medium/large apps, SWR for smaller ones."
