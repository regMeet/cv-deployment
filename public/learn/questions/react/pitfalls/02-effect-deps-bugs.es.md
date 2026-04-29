# Bugs en el dependency array de effects

> Tres formas clásicas de escribir un `useEffect` roto. La regla de lint `react-hooks/exhaustive-deps` agarra todas — mantenelo encendido como error.

## Bug 1 — dep faltante (stale closure)

```jsx
useEffect(() => {
  console.log(count); // usa count
}, []); // 💥 count no está en deps
```

El effect corre una vez con el `count` original. Renders subsiguientes no lo re-corren; el `count` capturado se queda stale.

**Fix:** incluir `count`.

## Bug 2 — dep object/array recreada cada render

```jsx
const config = { url: '/api', headers: { auth: token } };

useEffect(() => {
  fetch(config.url, { headers: config.headers });
}, [config]); // 💥 objeto nuevo cada render → effect corre cada render
```

Aunque los **valores** son los mismos, la **referencia** es nueva cada render. React compara por `Object.is`, así que `config` es "distinto" cada vez.

**Fixes:**

- Memoizar:
  ```jsx
  const config = useMemo(() => ({ url, headers: { auth: token } }), [url, token]);
  ```
- O romper en deps primitivos:
  ```jsx
  useEffect(() => { fetch(url, { headers: { auth: token } }); }, [url, token]);
  ```

## Bug 3 — dep de función que cambia cada render

```jsx
function Foo({ onSave }) {
  useEffect(() => { onSave(); }, [onSave]);  // 💥 si el padre recrea onSave, esto dispara sin parar
}
```

Si el padre pasa una referencia nueva de `onSave` cada render, el effect corre cada render. Fácil crear loops infinitos con esto:

```jsx
function Foo({ onLoad }) {
  const [data, setData] = useState();

  useEffect(() => {
    fetch('/api').then(setData);
    onLoad();
  }, [onLoad]); // padre re-renderiza por cambio de data → onLoad nuevo → effect corre → 💥 loop
}
```

**Fixes:**

- Padre: estabilizar con `useCallback`.
- O traer el valor adentro (`useEvent` / patrón latest-ref).
- O no ponerlo en deps si la intención real es correr-una-vez.

## Cuando genuinamente querés "correr una vez"

El patrón honesto es deletrear **por qué** estás salteando deps. Dos opciones seguras:

- **Effects de mount** (ej: analytics one-time):
  ```jsx
  useEffect(() => { analytics.track('view'); }, []);
  // ESLint: // eslint-disable-next-line react-hooks/exhaustive-deps  ← si hace falta
  ```
- **Latest ref** (capturar el último valor pero mantener el setup estable). Ver [Stale closures](#react/pitfalls/stale-closures).

## Encuadre senior

> "Almost every effect bug I see traces back to deps. My rule: trust the linter. If I'm tempted to silence it, that's a sign I should restructure — pull out a primitive dep, memoize an object, or use a latest-ref pattern. Empty deps with values inside is almost always wrong."
