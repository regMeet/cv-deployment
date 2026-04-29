# Infinite scroll (IntersectionObserver)

> Pone a prueba **refs**, la API moderna de observers, y estado de paginación.

## Problema

Renderizá una lista que cargue más items cuando el usuario scrollea cerca del final. Sin disparar fetches duplicados. Frenando cuando no hay más páginas.

## Solución

```jsx
import { useCallback, useEffect, useRef, useState } from 'react';

export function InfiniteList({ fetchPage }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef(null);

  // cargar una página
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

  // observar el sentinel
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
      {loading && <li>Cargando…</li>}
      {!hasMore && <li>Fin de la lista.</li>}
    </ul>
  );
}
```

## Por qué IntersectionObserver y no scroll listeners

- Los scroll listeners disparan **decenas de veces por segundo**, fuerzan reads de layout, matan la performance.
- IntersectionObserver es **pasivo**, corre fuera del main thread, dispara sólo al cruzar thresholds.
- `rootMargin: '200px'` dispara la carga *antes* de llegar al fondo — se siente fluido.

## Qué cuidar

- **No observes mientras está cargando.** Si no, el observer dispara dos veces mientras la misma página está in-flight → items duplicados. De ahí el guard de `loading`.
- **Flag de cancelación en el fetch effect.** Un scroll rápido pasando dos páginas: página 2 vuelve después que página 3 → appends fuera de orden sin el flag.
- **Referencia estable a `fetchPage`.** Si el padre la recrea en cada render, el effect corre de nuevo y resetea la paginación. Envolvelo con `useCallback` arriba.

## Follow-ups

- **"Mostrá errores."** Agregá un state `error`, renderizá un botón "Reintentar" que resetea la página.
- **"Virtualización."** Esto sigue renderizando todos los items cargados en el DOM. Para 10k+ items, combiná con `react-window` y observá un footer afuera de la región virtualizada.
- **"Paginación por cursor."** Reemplazá `page` por un `cursor` que devuelva el API.
