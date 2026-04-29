# React 18 — concurrent rendering, transitions, Suspense

> El gran cambio en React 18 fue hacer el rendering **interrumpible** para que la UI siga respondiendo bajo trabajo pesado.

## Concurrent rendering

Construido sobre Fiber. React puede **arrancar a renderizar**, **pausar**, hacer algo más urgente, y **reanudar**. Antes, el rendering era sincrónico y bloqueante.

No lo habilitás directo — los features opt-in (transitions, Suspense, deferred values) lo aprovechan.

## `startTransition` / `useTransition`

Marca un update de state como **no urgente**, así React puede interrumpirlo si llega algo más importante (como input del usuario).

```jsx
const [isPending, startTransition] = useTransition();

function onSearchChange(e) {
  setQuery(e.target.value);                      // urgente (input controlled)
  startTransition(() => {
    setResults(filter(items, e.target.value));   // se puede interrumpir
  });
}
```

**Caso de uso:** filtering / rendering de listas pesadas mientras tipeás — mantener el input snappy.

## `useDeferredValue`

Recibe un valor, devuelve una copia "deferred" que queda atrás durante trabajo pesado.

```jsx
const deferredQuery = useDeferredValue(query);
const results = useMemo(() => filter(items, deferredQuery), [items, deferredQuery]);
```

Más limpio que `useTransition` cuando recibís el valor como prop y no controlás el setter.

## Suspense para data

Suspense wrappea componentes que pueden "suspender" mientras esperan datos. El `<Suspense fallback>` más cercano muestra el placeholder hasta que resuelven.

```jsx
<Suspense fallback={<Spinner />}>
  <UserProfile id={id} />
</Suspense>
```

Suspense para data está full soportado en **frameworks** (Next.js, Remix) y vía librerías que se integran con él (React Query, Relay).

## Batching automático

React 17 batcheaba updates de state dentro de event handlers, pero no dentro de promesas / timers. **React 18 batchea en todos lados.**

```jsx
fetch('/api').then(() => {
  setA(1);
  setB(2);
  // React 18: 1 re-render. React 17: 2 re-renders.
});
```

## `useSyncExternalStore`

Para librerías que se integran con **stores mutables externos** (Redux, Zustand, Apollo). Es como esas librerías se volvieron seguras bajo concurrent rendering — declaran cómo subscribirse y snapshottear, y React las llama correctamente entre renders rotos.

## `useId`

Genera un ID único estable entre renders del servidor y del cliente. Genial para `aria-labelledby`, pares label/input en SSR.

## Encuadre senior

> "React 18's headline is concurrent rendering — making renders interruptible. The user-visible features built on it are transitions, deferred values, Suspense for data, and automatic batching. The mental model: mark non-urgent updates so React can keep input responsive while it works on them."
