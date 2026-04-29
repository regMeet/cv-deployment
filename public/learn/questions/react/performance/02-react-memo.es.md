# `React.memo` — cuándo realmente ayuda

> `React.memo` saltea el re-render de un componente si sus props son **referencialmente iguales** al render anterior. Dos condiciones tienen que cumplirse para que realmente ayude.

## Qué hace

```jsx
const Row = React.memo(function Row({ item }) {
  return <div>{item.name}</div>;
});
```

React compara cada prop con `Object.is` (shallow). Si todas las props son iguales, saltea el re-render.

## Dos condiciones para que realmente ayude

### 1. El componente debe ser **lo suficientemente caro**

Si el componente es `<span>{count}</span>`, el costo de re-renderizar es esencialmente cero. Wrappear en `memo` agrega overhead de bookkeeping mayor que el ahorro.

### 2. Las props deben ser **estables entre renders**

Acá es donde se rompe la mayoría de los usos de `React.memo`:

```jsx
// padre
<Row item={items[i]} onClick={() => handle(i)} />  // ❌ función nueva cada render
```

`memo` compara `onClick` → referencia distinta → re-render igual. Necesitás `useCallback` (o pasar un index/id y poner el handler más arriba).

## Comparación custom

```jsx
React.memo(Component, (prev, next) => prev.id === next.id);
```

Usar raramente. Si te encontrás escribiendo comparators custom seguido, probablemente tu componente acepta demasiadas props o el padre genera demasiado.

## Cuándo `memo` realmente paga

- Listas largas de filas.
- Form fields pesados con state derivado.
- Children de modales/popovers que re-renderizan cuando la página host lo hace.

## Cuándo no

- Hojas baratas.
- Children que siempre reciben referencias de prop nuevas.
- Componentes cuyas props cambian cada render igual.

## Encuadre senior

> "`React.memo` only helps when the component's render cost is non-trivial AND its props are stable across renders. Skipping either condition means you're paying the comparison cost without the savings. I profile first, then memoize the hot spots — not by default."
