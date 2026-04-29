# Keys en listas — por qué importan

> Las keys le dicen a React **qué item es cuál** entre renders. Keys equivocadas → DOM equivocado, state equivocado, animaciones rotas.

## Sin key (o con keys malas)

React matchea items de lista por **posición**. Si los items reordenan, insertan al frente o se filtran, React updatea los nodos equivocados — los inputs pierden focus, las animaciones reinician, el state de los children queda atado a la fila equivocada.

## Mal — index como key

```jsx
items.map((item, i) => <Row key={i} {...item} />)
```

Estable solo si la lista **nunca reordena, nunca inserta/borra en el medio**. De lo contrario el index apunta a un item distinto en el próximo render.

## Bien — identidad estable desde los datos

```jsx
items.map(item => <Row key={item.id} {...item} />)
```

`id` sigue al item. React sabe "esta es la misma fila, solo que se movió" y preserva DOM, focus y state de los children.

## Cuándo el index *está bien*

- La lista es **append-only** y nunca reordena.
- La lista es puramente cosmética (sin state interno por fila, sin inputs para focusear).

## Señales senior

- Mencionar **preservación de state** — keys malas rompen focus, inputs controlled, transiciones.
- Mencionar **reconciliación** — las keys son cómo React matchea children viejos vs nuevos.
- No generar keys en render (`Math.random()`) — cada render es una key nueva, cada fila se desmonta y remonta, terrible.

## Frase para entrevista

> "Keys aren't just to silence the warning. They tell React which item is which between renders, so React preserves DOM nodes and component state for the items that didn't change. Index keys break the moment the list reorders or you insert in the middle."
