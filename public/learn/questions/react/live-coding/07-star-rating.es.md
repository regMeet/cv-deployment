# Componente de star rating

> Pone a prueba **controlado vs no controlado**, hover-vs-click, y a11y básico para un control no nativo.

## Problema

Hacé un star rating de 5 estrellas. Click setea el rating, hover lo previsualiza. Soportá modo read-only. Accesible.

## Solución

```jsx
import { useState } from 'react';

export function StarRating({ value, defaultValue = 0, onChange, max = 5, readOnly = false }) {
  // controlado si pasaron `value`, uncontrolled si no
  const [internal, setInternal] = useState(defaultValue);
  const current = value ?? internal;

  const [hover, setHover] = useState(0);
  const display = hover || current;

  function set(next) {
    if (readOnly) return;
    if (value === undefined) setInternal(next);
    onChange?.(next);
  }

  return (
    <div
      role="radiogroup"
      aria-label="Rating"
      onMouseLeave={() => setHover(0)}
      style={{ display: 'inline-flex' }}
    >
      {Array.from({ length: max }, (_, i) => {
        const n = i + 1;
        const filled = n <= display;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={n === current}
            aria-label={`${n} estrella${n === 1 ? '' : 's'}`}
            disabled={readOnly}
            onClick={() => set(n)}
            onMouseEnter={() => !readOnly && setHover(n)}
            onFocus={() => !readOnly && setHover(n)}
            onBlur={() => setHover(0)}
            style={{
              background: 'none', border: 'none', cursor: readOnly ? 'default' : 'pointer',
              fontSize: 24, color: filled ? 'gold' : '#ccc',
            }}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
```

## Qué demuestra esto

- **Controlado o no controlado.** Pasá `value` para controlado (lo maneja el padre), o `defaultValue` para uncontrolled (lo maneja el componente). Mismo patrón que `<input>`.
- **Dos slots de state: `current` + `hover`.** El hover nunca pisa el valor elegido — sólo cambia el display.
- **`role="radiogroup"` + `role="radio"`** para que los screen readers lo anuncien como un rating, no como "cinco botones".
- **El teclado funciona gratis** porque cada estrella es un `<button>` — Tab + Enter/Space.

## Errores comunes

- Guardar el hover en el mismo state que el rating elegido → al sacar el cursor "guarda" un rating equivocado.
- Usar `<div onClick>` en vez de `<button>` — mata el acceso por teclado.
- Ignorar `readOnly`. Los ratings de sólo display tienen que *renderizar* el valor pero no parecer interactivos.

## Follow-ups

- **"Medias estrellas."** Trackeá el valor como float; renderizá dos mitades clickeables por estrella.
- **"Iconos custom."** Hacé al renderer una prop (`renderIcon={(filled) => …}`).
