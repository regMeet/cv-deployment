# `useRef` — refs al DOM y valores mutables

> Dos usos, frecuentemente confundidos. **Mismo hook, intenciones distintas.**

## Uso 1 — refs al DOM

```jsx
const inputRef = useRef(null);
return <input ref={inputRef} />;

inputRef.current.focus();
```

- React asigna el nodo DOM a `ref.current` después del mount.
- Leelo dentro de un effect o event handler — **no durante el render**.

## Uso 2 — contenedor mutable que sobrevive renders

Una "caja" que podés mutar sin disparar un re-render.

```jsx
const renderCount = useRef(0);
renderCount.current++;  // mutá libremente, sin re-render
```

Útil para:

- Guardar el último valor de algo (ej: las `props` más recientes para usar dentro de un interval).
- Cachear resultados imperativos.
- Mantener IDs de interval/timer.

## Distinción clave vs state

- `useState` → **el cambio dispara un re-render**.
- `useRef` → **el cambio NO dispara un re-render**. Es solo un slot mutable.

Si necesitás que la UI reaccione, usá `useState`. Si solo necesitás recordar algo entre renders, usá `useRef`.

## Cuidado

- **No leer `.current` durante el render** — los refs se populan después del commit; leerlos muy temprano da el valor previo (o null).
- **No poner state renderizado en un ref** — ej: el valor que el usuario tipea debe ser `useState`, no `useRef`. De lo contrario la UI no se actualiza.

## Forwardear refs

Si querés que un ref apunte adentro de un componente custom:

```jsx
const Button = forwardRef((props, ref) => (
  <button ref={ref} {...props} />
));
```

En React 19, `ref` es una prop regular en componentes funcionales — no hace falta `forwardRef`.

## Frase para entrevista

> "`useRef` covers two cases: holding a DOM node, and holding a mutable value across renders without causing a re-render. The mental check is: 'does the UI need to update when this changes?' — yes → `useState`, no → `useRef`."
