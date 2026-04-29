# Counter (bases de useState)

> El clásico de calentamiento. Cuesta poco, pero los follow-ups importan.

## Problema

Hacé un counter con **+ / − / Reset**. Deshabilitá **−** en cero.

## Solución

```jsx
import { useState } from 'react';

export function Counter({ initial = 0, step = 1 }) {
  const [count, setCount] = useState(initial);

  return (
    <div className="counter">
      <button onClick={() => setCount((c) => c - step)} disabled={count <= 0}>−</button>
      <span aria-live="polite">{count}</span>
      <button onClick={() => setCount((c) => c + step)}>+</button>
      <button onClick={() => setCount(initial)}>Reset</button>
    </div>
  );
}
```

## Por qué importa el **updater funcional**

`setCount(c => c + 1)` lee el valor más reciente encolado. `setCount(count + 1)` lee el valor del closure — bien acá, pero rompe si lo llamás dos veces en el mismo tick o adentro de un callback async.

```jsx
// MAL — los dos leen el mismo `count`
setCount(count + 1);
setCount(count + 1);

// BIEN — el segundo ve el resultado del primero
setCount((c) => c + 1);
setCount((c) => c + 1);
```

## Follow-ups senior

- **"Agregale un máximo."** Clampealo en el updater: `setCount((c) => Math.min(c + step, max))`.
- **"Evitá re-renders si está disabled."** No hace falta — React ya bail-outea si el estado es `===`.
- **"Refactorealo a useReducer."** Útil cuando `+`/`−`/`reset` crece a ~5+ acciones, o cuando las acciones se disparan desde lejos.
