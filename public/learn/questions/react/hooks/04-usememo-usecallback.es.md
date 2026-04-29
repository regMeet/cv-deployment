# `useMemo` y `useCallback` — qué hacen

> Cachean valores entre renders. Son herramientas para **estabilidad referencial** y para saltarse computaciones caras — no boosters mágicos de performance.

## `useMemo` — cachear un valor computado

```jsx
const sorted = useMemo(
  () => heavySort(items),
  [items]
);
```

Devuelve el resultado anterior si `[items]` no cambió.

## `useCallback` — cachear una referencia de función

```jsx
const handleClick = useCallback(
  (id) => deleteItem(id),
  [deleteItem]
);
```

Lo mismo que `useMemo(() => fn, deps)`. Útil para que componentes hijos que comparan props por referencia (`React.memo`, dep arrays de `useEffect`) no vean una función "nueva" en cada render.

## Cuándo realmente ayudan

1. La computación es **genuinamente cara** (sort/filter de arrays grandes, parsing, transformaciones complejas de shape).
2. El valor se pasa a un **child memoizado** (`React.memo`) y querés que efectivamente saltee el re-render.
3. El valor está en un **dependency array** (`useEffect`, `useMemo`) y querés identidad estable.

## Cuándo no ayudan (o duelen)

- Cálculo trivial. El costo del bookkeeping ≈ al costo de la computación.
- Valor cacheado pasado a un child no memoizado — los re-renders pasan igual.
- Usados en todos lados "por las dudas" — el código se vuelve ruidoso y a veces más lento.

## Code smell

Si tu código está lleno de `useMemo` y `useCallback` en todos lados, te memoizaste hasta el punto de no poder leerlo. **Profileá primero**, memoizá los hot spots.

## Posición honesta

> Ver: [useMemo / useCallback honestamente](#react/performance/memoization-honestly) para la discusión más profunda de "vale la pena".

## Frase para entrevista

> "`useMemo` caches a value, `useCallback` caches a function reference. I reach for them when I have a memoized child that needs stable props, an effect dep that needs stable identity, or a computation that's actually expensive — not as a default everywhere."
