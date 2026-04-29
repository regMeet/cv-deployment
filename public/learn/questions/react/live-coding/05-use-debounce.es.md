# Custom hook: useDebounce

> Pone a prueba el cleanup de effects + la diferencia entre **debouncear un valor** y **debouncear un callback**.

## Problema

Escribí un hook `useDebounce(value, delay)` que devuelva el valor después de `delay` ms de "silencio" (sin nuevos updates).

## Solución

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

## Uso

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

## Cómo lo hace funcionar el cleanup

En cada render donde `value` cambia:
1. Programa un nuevo `setTimeout`.
2. El cleanup corre primero → cancela el timeout **anterior** pendiente.

Así, `setDebounced` se dispara sólo cuando el usuario deja de tipear por `delay` ms.

## Follow-ups senior

- **"Debounceá un callback en vez de un valor."** Otro patrón — típicamente `useCallback` + un ref a un `setTimeout`. Útil cuando llamás APIs imperativamente (p.ej. `onChange={debouncedFetch}`).
- **"¿Por qué no lodash.debounce?"** El `debounce` de lodash devuelve una función estable — está bien, pero hay que memoizarla con `useMemo` y limpiarla al unmount. El hook de arriba es más simple para el caso de valor.
- **"Agregale leading edge."** Dos slots de state: `debouncedLeading` (dispara ya) + `debouncedTrailing` (dispara tras el silencio).
- **"Testealo."** `jest.useFakeTimers()` + `act(() => jest.advanceTimersByTime(300))`.
