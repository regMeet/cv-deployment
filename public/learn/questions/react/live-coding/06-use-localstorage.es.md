# Custom hook: useLocalStorage

> Pone a prueba consciencia de SSR, lazy init, y sync entre tabs vía evento.

## Problema

Escribí `useLocalStorage(key, initial)` que se comporte como `useState` pero que persista en `localStorage`.

## Solución

```jsx
import { useEffect, useState } from 'react';

export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return initial; // safety SSR
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota excedida, modo privado, etc. — ignoramos */
    }
  }, [key, value]);

  // opcional: mantener tabs sincronizados
  useEffect(() => {
    function onStorage(e) {
      if (e.key === key && e.newValue != null) {
        try { setValue(JSON.parse(e.newValue)); } catch {}
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key]);

  return [value, setValue];
}
```

## Qué señalan los detalles

- **Lazy initializer** (`useState(() => ...)`) — corre una vez. Sin él, `localStorage.getItem` corre en **cada** render.
- **`typeof window === 'undefined'`** — Next.js / SSR no tiene `window`. Sin este guard, el componente crashea en el server.
- **try/catch en JSON.parse** — maneja state corrupto de una versión anterior de la app.
- **try/catch en setItem** — Safari modo privado tira excepción al escribir. Las quota errors también.
- **listener de `storage`** — dispara sólo en **otras tabs**, no en la actual. Mantiene multi-tab en sync.

## Uso

```jsx
function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  return <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme}</button>;
}
```

## Follow-ups

- **"Soportá functional updates."** Ya lo hace — `setValue` es el setter de React, soporta `setValue((prev) => prev + 1)`.
- **"¿Qué pasa si cambia `key`?"** El effect corre de nuevo y escribe el valor actual bajo la nueva key. La key vieja conserva su valor viejo (probablemente mal — normalmente querés una sola key estable).
- **"¿Cómo testearías SSR?"** Renderizá en JSDOM con `window` borrado, o usá los helpers de server rendering de `@testing-library/react`.
