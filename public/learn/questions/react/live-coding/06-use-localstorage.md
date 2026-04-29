# Custom hook: useLocalStorage

> Tests SSR-awareness, lazy initialization, and event-based cross-tab sync.

## Problem

Write `useLocalStorage(key, initial)` that behaves like `useState` but persists to `localStorage`.

## Solution

```jsx
import { useEffect, useState } from 'react';

export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return initial; // SSR safety
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
      /* quota exceeded, private mode, etc. — silently ignore */
    }
  }, [key, value]);

  // optional: keep tabs in sync
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

## What the details signal

- **Lazy initializer** (`useState(() => ...)`) — runs once. Without it, `localStorage.getItem` runs on **every** render.
- **`typeof window === 'undefined'`** — Next.js / SSR doesn't have `window`. Without this guard, the component crashes on the server.
- **try/catch on JSON.parse** — handles corrupted state from a previous app version.
- **try/catch on setItem** — Safari private mode throws on writes. Quota errors throw too.
- **`storage` event listener** — fires only on **other tabs**, not the current one. Keeps multi-tab in sync.

## Usage

```jsx
function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  return <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme}</button>;
}
```

## Follow-ups

- **"Support functional updates."** Already does — `setValue` is React's setter, supports `setValue((prev) => prev + 1)`.
- **"What if `key` changes?"** The effect re-runs and writes the current value under the new key. The old key keeps its old value (probably wrong — usually you want a single stable key).
- **"How would you test SSR?"** Render in JSDOM with `window` deleted, or use `@testing-library/react`'s server rendering helpers.
