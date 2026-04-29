# Mal uso de la prop key (y usar index)

> Keys equivocadas causan **bugs visibles** — DOM equivocado, focus perdido, state roto — no solo warnings de lint.

## El error más común — index como key

```jsx
items.map((item, i) => <Row key={i} {...item} />)
```

Si `items` alguna vez **reordena, inserta al frente, o borra del medio**, el index ahora apunta a un item distinto. React piensa que `key={2}` es "la misma fila" → updatea props sobre el nodo DOM equivocado → preserva state para la fila equivocada.

### Por qué es peor de lo que suena

- **Los form fields pierden valor o focus** — un input donde el usuario estaba tipeando muestra de pronto datos distintos.
- **Las animaciones reinician** para items que en realidad no cambiaron.
- **El state del componente queda atado a la fila equivocada** — el `useState` de una fila pertenece a la fila que esté en ese index en el próximo render, no al item.

## El patrón correcto

```jsx
items.map(item => <Row key={item.id} {...item} />)
```

Usar la **identidad estable de los datos** — generalmente `id`. La key sigue al item.

## Cuándo el index está OK

- Lista append-only, nunca reordena.
- Lista estática (ej: un menú nav fijo).
- Sin state dentro de la fila, sin inputs.

> Solo cuando **las tres** son verdaderas.

## Keys random son las peores

```jsx
<Row key={Math.random()} />  // 💥 key distinta cada render → unmount + remount cada vez
```

Cada render, cada fila se trata como nueva. Pierde state, DOM, todo. Evitar.

## Keys compuestas

Si una lista no tiene ID natural, componé una desde campos inmutables:

```jsx
key={`${item.userId}-${item.timestamp}`}
```

Mejor que index cuando necesitás unicidad entre remounts.

## Patrón intencional de reset con `key`

Podés **usar el cambio de key deliberadamente** para forzar un remount:

```jsx
<UserForm key={userId} userId={userId} />
```

Cuando `userId` cambia, React desmonta el `UserForm` viejo y monta uno nuevo — state fresco, effects frescos. Más limpio que sincronizar props en state con un effect.

## Encuadre senior

> "Wrong keys aren't a stylistic issue — they cause real bugs around focus, form state, and animations. I use stable IDs from the data; index is acceptable only on append-only static lists with no internal state. And I use the `key` change deliberately when I want to remount a subtree."
