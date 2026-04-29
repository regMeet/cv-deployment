# Fetch + listar (loading / error)

> Pone a prueba el ciclo de vida de un effect, race conditions, y la UI de tres estados.

## Problema

Traé una lista de un API y mostrala. Mostrá loading, error y estado vacío.

## Solución

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

  if (loading) return <p>Cargando…</p>;
  if (error)   return <p role="alert">Falló: {error.message}</p>;
  if (!data?.length) return <p>Sin usuarios.</p>;

  return (
    <ul>
      {data.map((u) => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}
```

## Lo que califican los entrevistadores

- **AbortController** en el cleanup. Sin él, unmount rápido + red lenta = warnings de "set state en componente desmontado" o gana data stale.
- **`if (!r.ok) throw`.** `fetch` sólo rechaza en falla de red; un 500 es una respuesta "exitosa".
- **Tres estados + vacío.** No confundas `loading` con `data === null`.
- **`role="alert"`** en el error para que los screen readers lo anuncien.

## Por qué fetch a mano alcanza para una entrevista

No necesitás React Query / SWR para un endpoint. El entrevistador revisa que entiendas el **ciclo de vida**, no que hayas memorizado una librería.

## Follow-up: refetch al cambiar prop

Llaveá el `useEffect` con la prop:

```jsx
useEffect(() => { /* fetch + abort */ }, [userId]);
```

Cada nuevo `userId` aborta el request anterior vía el cleanup. Así evitás la **race condition** donde un primer request lento resuelve *después* de un segundo request rápido.
