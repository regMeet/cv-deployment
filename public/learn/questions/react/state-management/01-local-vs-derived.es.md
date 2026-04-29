# State local vs derivado — colocá y computá

> Dos principios que previenen la mayoría de los dolores de state-management: **colocar** state, y **derivar** lo que se pueda.

## Colocación

Mantener el state **lo más cerca posible** de donde se usa. Subir el state tiene un costo — cada consumer entre la fuente y el target re-renderiza.

> Subilo solo lo que sea necesario para los componentes que necesitan **compartirlo**. No más alto.

## Derivación — no almacenar lo que podés computar

Mal — duplicar state en state derivado:

```jsx
const [items, setItems] = useState(initial);
const [count, setCount] = useState(initial.length);  // 💥 redundante

// ahora tenés que mantenerlos sincronizados, y te vas a olvidar
```

Bien — derivar en el render:

```jsx
const [items, setItems] = useState(initial);
const count = items.length;
```

Si `count` es caro (raramente lo es), wrappealo en `useMemo`. De lo contrario, computá nomás.

## No espejar props en state

```jsx
function Foo({ user }) {
  const [u, setU] = useState(user);  // 💥 stale cuando la prop cambia
}
```

O usá la prop directamente, o — si realmente necesitás "resetear" state interno cuando una prop cambia — usá el **patrón de reset con `key`**:

```jsx
<Foo key={user.id} user={user} />
```

Una key nueva = instancia nueva = state fresco. No hace falta effect.

## Heurística senior

Para cada pieza de state, preguntate:

1. ¿Puedo **computarlo** desde props u otro state? → No lo guardes.
2. ¿Es **compartido** entre componentes? → Subilo solo al padre común más cercano.
3. ¿Coincide con una prop? → Probablemente no debería ser state.
4. ¿Se updatea con otra pieza de state? → Usá una fuente, derivá la otra.

## Frase para entrevista

> "I default to local state, derive everything I can, and only lift state when multiple components actually need to share it. Most state-management complexity I've seen came from storing things that should have been derived."
