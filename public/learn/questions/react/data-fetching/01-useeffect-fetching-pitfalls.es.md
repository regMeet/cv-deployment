# Data fetching con `useEffect` — pitfalls

> El "hello world" de los tutoriales de React, y un campo minado en producción. La mayoría de los issues acá son por qué existen React Query / SWR.

## La versión naive

```jsx
useEffect(() => {
  fetch(`/api/users/${id}`)
    .then(r => r.json())
    .then(setUser);
}, [id]);
```

Se ve bien. Esconde al menos 5 bugs.

## Pitfalls

### 1. Race conditions

El usuario navega de `id=1` a `id=2`. Ambos requests están in-flight. El más lento gana. La UI muestra datos de `id=1` mientras la URL dice `id=2`.

**Fix:** abortar el request anterior, o guardar con un flag.

```jsx
useEffect(() => {
  const ctrl = new AbortController();
  fetch(`/api/users/${id}`, { signal: ctrl.signal })
    .then(r => r.json())
    .then(setUser)
    .catch(err => { if (err.name !== 'AbortError') /* manejar */; });
  return () => ctrl.abort();
}, [id]);
```

### 2. Sin deduplicación

Dos componentes fetchean la misma URL → dos llamadas de red. Con caching, dedup, batching de requests — nada de esto está built-in.

### 3. Sin retry / sin stale-while-revalidate

Glitch de red → request falla. UI muestra error. El usuario tiene que reintentar manualmente. Sin refetch en background cuando la ventana recupera focus.

### 4. Sin state machine de loading / error

Típicamente necesitás `idle / loading / success / error` más `refetching`, `stale`, `mutating`. Modelar eso correctamente con `useState` es verboso; con `useReducer` mejor; con React Query ya está hecho por vos.

### 5. Doble disparo de StrictMode confunde

El modo dev de React 18 corre los effects dos veces. Sin abort, ves dos requests en el network tab y pensás "¿qué?". Producción los corre una vez.

## Cuándo `useEffect` para fetching está OK

- App chiquita, uno o dos endpoints, sin necesidades de caching.
- Fire-and-forget trivial.
- Cargar datos solo en el init del componente, sin necesidad de sobrevivir remount o refetch.

## Lo que reemplazaría

- **React Query** / **SWR** — caching, dedup, refetch on focus, retries, mutations.
- **RTK Query** — misma idea, integrada con Redux Toolkit.
- **Server-side data loaders** — patrones de Next.js / Remix donde el data fetching pasa antes del render.

## Encuadre senior

> "I avoid `useEffect` for data fetching except for trivial cases. It hides race conditions, has no caching or dedup, no stale-while-revalidate, no retries — and you reinvent all of that badly. React Query handles every one of those out of the box."
