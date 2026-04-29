# Filtro de búsqueda en vivo

> Fácil en la superficie. La trampa es el **estado derivado**.

## Problema

Dada una lista de items, renderizá un input que los filtre mientras el usuario tipea (substring case-insensitive).

## Solución

```jsx
import { useState, useMemo } from 'react';

export function LiveSearch({ items }) {
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => it.toLowerCase().includes(q));
  }, [items, query]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar…"
        aria-label="Buscar items"
      />
      <ul>
        {visible.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
      {visible.length === 0 && <p>Sin resultados.</p>}
    </div>
  );
}
```

## El antipattern a evitar

No guardes los resultados filtrados en state y los sincronices con `useEffect`:

```jsx
// 🚫 No
const [filtered, setFiltered] = useState(items);
useEffect(() => {
  setFiltered(items.filter(...));
}, [items, query]);
```

Esto causa un render extra y queda stale. **Calculá durante el render** — para eso está React. Usá `useMemo` sólo cuando el cálculo sea genuinamente caro.

## Follow-ups

- **"Va lento con 10k items."** Dos caminos: debouncear la query (ver `useDebounce`), o virtualizar la lista (`react-window`).
- **"Que la búsqueda sea server-side."** Ahora `items` vive en el server — necesitás debounce + cancelación. Mirá la pregunta de Autocomplete.
- **"Resaltá los matches."** Envolvé el substring que matchea en `<mark>`. Construí un helper `splitMatch(text, query)`.
