# `useEffect` — dependencias y cleanup

> La fuente más grande de bugs sutiles en React. Acertá las deps, devolvé una función de cleanup, y evitás el 90% de los bugs de effects.

## Modelo mental

> Un effect es una forma de **sincronizar** algo externo (DOM, timer, suscripción, fetch) con state de React. Corre **después** del render, con los valores de ese render.

## Dependency array — qué meter

**Cada valor del scope del componente** que el effect usa. Props, state, valores derivados, funciones definidas en el componente.

```jsx
useEffect(() => {
  socket.subscribe(channel, handleMsg);
  return () => socket.unsubscribe(channel, handleMsg);
}, [channel, handleMsg]); // ← cualquier cosa usada adentro
```

`react-hooks/exhaustive-deps` lo lintea por vos. **Confiá en el linter**; acortar el array manualmente causa bugs de stale closures.

## Cleanup — cuándo corre

La función de cleanup corre:

1. Antes de la próxima vez que el effect corra (cambiaron las deps).
2. Cuando el componente se desmonta.

Así que el ciclo de vida típico de un effect es: `setup → cleanup → setup → cleanup → ...`.

## Siempre limpiar

- Suscripciones, sockets.
- Timers (`clearInterval` / `clearTimeout`).
- Event listeners.
- Abortar fetch (`AbortController`).

```jsx
useEffect(() => {
  const ctrl = new AbortController();
  fetch(url, { signal: ctrl.signal }).then(/*...*/);
  return () => ctrl.abort();
}, [url]);
```

## Doble disparo en StrictMode (solo dev)

En modo dev de React 18+, los effects corren **dos veces** para revelar cleanups faltantes. Producción los corre una vez. Si tu effect rompe bajo doble-mount, tu cleanup está incompleto.

## Cuándo NO usar un effect

- Calcular state derivado — hacerlo durante el render.
- Reaccionar a un cambio de prop para setear state — derivar en cambio, o usar `key` para resetear.
- Event handlers — la lógica va en el handler, no en un effect que mira el state.

> Regla: si el effect "está sincronizando con algo externo", quedátelo. De lo contrario, borralo.

## Frase para entrevista

> "I include every reactive value the effect uses in the deps and trust the linter. Cleanup is part of the contract — anything I subscribe to, time, or fetch must be undone. And a lot of effects shouldn't exist at all: derived state belongs in render, not in an effect that mirrors a prop into state."
