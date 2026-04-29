# Virtualización de listas (`react-window` / `@tanstack/react-virtual`)

> No renderices 10.000 filas cuando solo ~30 son visibles. Renderizá solo lo que entra en el viewport (más un overscan chico).

## El problema

Una lista naive:

```jsx
<ul>
  {items.map(item => <Row key={item.id} {...item} />)}
</ul>
```

Con 10K items: 10K nodos DOM, 10K nodos fiber de React, scroll lento, re-renders dolorosos.

## Virtualización

Solo los items actualmente visibles (más un buffer de overscan chico) están montados. A medida que el usuario scrollea, los items se desmontan/montan al vuelo.

```jsx
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  width="100%"
  itemCount={items.length}
  itemSize={48}
>
  {({ index, style }) => (
    <div style={style}>{items[index].name}</div>
  )}
</FixedSizeList>
```

## Cuándo lo necesitás

- Listas > ~500 items.
- Tablas / grids con muchas filas.
- Feeds scrolleables largos.

## Librerías

- **`react-window`** — chiquita, rápida, listas de tamaño fijo son fáciles.
- **`@tanstack/react-virtual`** — moderna, headless, soporta tamaños variables bien.
- **`react-virtuoso`** — full-featured, soporta alturas dinámicas y semántica "stick to bottom".

## Filas de altura variable

Tricky: no sabés la altura hasta que renderizás. Estrategias:

- **Estimar** una altura inicial; la lib ajusta a medida que mide.
- **Cachear** alturas medidas para que el scroll hacia atrás no salte.
- **`@tanstack/react-virtual`** y `react-virtuoso` lo manejan mejor.

## Pitfalls

- **Items con `position: absolute`** dentro de la lista — anclan al viewport, no a la fila → roto en scroll.
- **`autofocus` en una fila** — la fila puede estar desmontada; el focus se pierde.
- **Efectos hover con CSS** sobre el conteo de filas — sin afectar, pero **animaciones scroll-linked** pueden ser entrecortadas si la lib re-renderiza componentes pesados.

## Encuadre senior

> "I virtualize once a list crosses ~500 items or shows scroll jank. `react-window` for fixed sizes, `@tanstack/react-virtual` for variable heights. The trickiest part is variable-row heights — you need height caching to avoid jumpiness on scrollback."
