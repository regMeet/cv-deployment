# React Query vs SWR — por qué usarlos

> No son "wrappers de fetch". Son librerías de **server-state cache**. Esa distinción es lo que las hace transformadoras.

## Qué es server state

Datos que viven en un servidor y cacheás en el cliente:

- Distinto de UI state (modal abierto, tab seleccionada).
- Tiene características de **freshness** — puede ponerse stale.
- Puede ser **compartido** entre componentes.
- Puede ser **invalidado** por mutations.

UI state va en local state / Zustand / Redux. Server state va en React Query / SWR.

## Qué te dan out of the box

- **Cache** — misma query key reusada → sin fetches duplicados.
- **Deduping** — N componentes pidiendo los mismos datos → 1 request.
- **Stale-while-revalidate** — devolver cacheado, refetch en background.
- **Refetch on focus / reconnect** — los datos se mantienen frescos cuando el usuario vuelve.
- **Retries** con exponential backoff.
- **Pagination** y **infinite queries** primitivos.
- **Mutations** con updates optimistas y rollback.
- **Devtools** mostrando cada entrada del cache y su estado.

## React Query (TanStack Query)

```jsx
import { useQuery } from '@tanstack/react-query';

const { data, isLoading, error } = useQuery({
  queryKey: ['user', id],
  queryFn: () => fetch(`/api/users/${id}`).then(r => r.json()),
});
```

- Más feature-rich.
- API más grande.
- Excelentes devtools.
- Bundle más grande que SWR.
- Estándar para apps medianas/grandes.

## SWR (Vercel)

```jsx
import useSWR from 'swr';

const { data, error, isLoading } = useSWR(`/api/users/${id}`, fetcher);
```

- Más chica, más simple.
- Excelentes defaults.
- Menos superficie para casos avanzados (mutations, infinite queries son más simples).
- Funciona hermoso con Next.js.

## Decisión

| Necesidad | Elegir |
|---|---|
| Default para app chica/mediana | SWR |
| Caching complejo, mutations avanzadas, app grande | React Query |
| Ya usando Redux Toolkit | RTK Query |
| Next.js + necesidades simples | SWR |

## Mutations + updates optimistas

```jsx
const mutation = useMutation({
  mutationFn: updateUser,
  onMutate: async (newUser) => {
    await queryClient.cancelQueries({ queryKey: ['user', newUser.id] });
    const prev = queryClient.getQueryData(['user', newUser.id]);
    queryClient.setQueryData(['user', newUser.id], newUser); // optimista
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

Tanto código en `useEffect` sería frágil. Acá es idiomático.

## Encuadre senior

> "Server state and UI state are different problems. React Query / SWR treat the network as a cache layer with freshness, dedup, and revalidation — solving things you'd build poorly by hand. I default to React Query for medium/large apps, SWR for smaller ones."
