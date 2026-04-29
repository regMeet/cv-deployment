# `useMemo` / `useCallback` honestamente — cuándo valen la pena

> La mayoría de los usos de `useMemo` y `useCallback` son **ruido**. No hacen tu app más rápida; la hacen más difícil de leer y a veces más lenta.

## Qué cuestan

Cada hook de memoización:

- Aloca un objeto para guardar el valor cacheado + deps.
- Corre una comparación de deps en cada render.
- Agrega ruido visual al código.

Si la operación cacheada es más barata que la comparación + bookkeeping, **lo hiciste más lento**, no más rápido.

## Cuándo realmente valen la pena

### 1. Computación genuinamente cara

```jsx
const sorted = useMemo(() => bigSort(items), [items]);
```

`bigSort` sobre 10.000 items, varios ms → memo ayuda.

### 2. Identidad estable para un child memoizado

```jsx
const handleClick = useCallback(id => onSelect(id), [onSelect]);
return <MemoizedRow onClick={handleClick} />;  // child compara props por referencia
```

Sin `useCallback`, el memo en `Row` es inútil.

### 3. Identidad estable para una dep de hook

```jsx
const config = useMemo(() => ({ url, headers }), [url, headers]);

useEffect(() => {
  fetch(config.url, { headers: config.headers });
}, [config]);  // sin useMemo, config es "nuevo" cada render → effect corre cada render
```

## Cuándo son ruido

- La computación es `a + b` o `arr.length`.
- El child no está memoizado — re-renderiza igual.
- Nada lee el valor como dep estable.

## React Compiler (React 19+)

El React Compiler (antes React Forget) **automatiza esto**. Con él habilitado, escribís código directo y el compilador inserta memoización donde realmente ayuda. La memoización manual `useMemo`/`useCallback` se vuelve mayormente innecesaria.

> Si tu equipo usa el compiler, defaultá a **sin memoización manual** y solo agregalo donde el compiler no puede inferir (raro).

## Encuadre senior

> "I don't memoize defensively. I add `useMemo` / `useCallback` for three concrete reasons: a genuinely expensive computation, a memoized child that needs stable props, or a hook dependency that needs stable identity. With the React Compiler I drop almost all of it. Profile, don't guess."
