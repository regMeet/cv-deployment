# Autocomplete (async + navegación con teclado)

> El "boss fight" del live coding de React. Combina debounce, race conditions, a11y de teclado y ARIA.

## Problema

Hacé un autocomplete:
- Fetch debounced mientras tipea
- Cancela requests in-flight con cada nuevo input
- Flechas navegan, Enter selecciona, Esc limpia
- El screen reader anuncia los resultados

## Solución

```jsx
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from './useDebounce'; // ver esa pregunta

export function Autocomplete({ fetchOptions, onSelect }) {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([]);
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);
  const debounced = useDebounce(query, 250);
  const listId = 'ac-listbox';

  useEffect(() => {
    if (!debounced) { setOptions([]); return; }
    const ctrl = new AbortController();
    fetchOptions(debounced, ctrl.signal)
      .then((res) => { setOptions(res); setActive(-1); setOpen(true); })
      .catch((e) => { if (e.name !== 'AbortError') setOptions([]); });
    return () => ctrl.abort();
  }, [debounced, fetchOptions]);

  function onKeyDown(e) {
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(i + 1, options.length - 1)); }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); choose(options[active]); }
    else if (e.key === 'Escape') { setOpen(false); }
  }

  function choose(opt) {
    onSelect?.(opt);
    setQuery(opt.label);
    setOpen(false);
  }

  return (
    <div role="combobox" aria-expanded={open} aria-haspopup="listbox" aria-owns={listId}>
      <input
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onKeyDown={onKeyDown}
        onBlur={() => setTimeout(() => setOpen(false), 100)}
        aria-autocomplete="list"
        aria-controls={listId}
        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
      />
      {open && options.length > 0 && (
        <ul id={listId} role="listbox">
          {options.map((opt, i) => (
            <li
              key={opt.id}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => e.preventDefault()} // mantener focus en el input
              onClick={() => choose(opt)}
              style={{ background: i === active ? '#eef' : 'transparent', cursor: 'pointer' }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## Qué te gana señal de senior

- **Debounce + AbortController** — la única forma sana de fetchear con cada tecla.
- **El cleanup aborta** — sin esto, el request lento de "ho" puede resolver *después* de "house" y pisar los resultados correctos.
- **`onMouseDown={(e) => e.preventDefault()}`** en `<li>` — sin eso, clickear una opción blurea el input *antes* del click, y el dropdown se cierra primero por `onBlur`. Bug muy común.
- **Patrón ARIA combobox** — `combobox` + `listbox` + `option` + `aria-activedescendant`. No movás el focus a la opción; mantené el focus en el input y anunciá el descendant activo.

## Errores comunes

- Usar `onClick` solo — los usuarios de teclado no pueden navegar.
- Guardar el índice activo por *id de opción* — frágil ante reordenamientos. Usá índice del array.
- Olvidar resetear `active` cuando cambian los resultados.

## Follow-ups

- **"Cacheá resultados por query."** Envolvelo con un `Map<query, options>` o usá SWR / React Query.
- **"Resaltá el substring que matchea."** Renderizá el label como `<>{antes}<mark>{match}</mark>{después}</>`.
- **"Multi-select con chips."** Trackeá `selected: Option[]`. Renderizá chips arriba del input.
