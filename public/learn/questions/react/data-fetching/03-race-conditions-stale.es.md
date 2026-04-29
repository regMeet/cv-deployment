# Race conditions y stale closures en fetching

> Dos bugs distintos que se ven iguales en producción: **el request más viejo gana**, o **el handler lee state viejo**.

## Race condition

Múltiples requests in-flight; los resultados llegan fuera de orden; el más lento sobrescribe al fresco.

```jsx
useEffect(() => {
  fetch(`/api/users/${id}`)
    .then(r => r.json())
    .then(setUser);
}, [id]);
```

El usuario cambia de `id=1` a `id=2`. Request 1 está lento. Request 2 vuelve primero → state muestra id=2. Después vuelve request 1 → sobrescribe con id=1. La UI miente.

### Fixes

**Abortar el request anterior:**

```jsx
useEffect(() => {
  const ctrl = new AbortController();
  fetch(`/api/users/${id}`, { signal: ctrl.signal })
    .then(r => r.json())
    .then(setUser);
  return () => ctrl.abort();
}, [id]);
```

**O guardar con un flag:**

```jsx
useEffect(() => {
  let cancelled = false;
  fetch(`/api/users/${id}`).then(r => r.json()).then(d => {
    if (!cancelled) setUser(d);
  });
  return () => { cancelled = true; };
}, [id]);
```

**O usar React Query** — las query keys (`['user', id]`) lo manejan automáticamente.

## Stale closure

Un handler captura state viejo porque fue definido en un render previo.

```jsx
useEffect(() => {
  const id = setInterval(() => {
    console.log(count);  // 💥 siempre 0
  }, 1000);
  return () => clearInterval(id);
}, []);  // sin deps → setup una vez → closure viejo para siempre
```

El callback del interval se creó cuando `count` era 0. Sigue leyendo el mismo closure.

### Fixes

**Incluir la dep:**

```jsx
useEffect(() => {
  const id = setInterval(() => console.log(count), 1000);
  return () => clearInterval(id);
}, [count]); // recrear el interval cada vez
```

**O usar un ref para leer el último valor:**

```jsx
const countRef = useRef(count);
useEffect(() => { countRef.current = count; });

useEffect(() => {
  const id = setInterval(() => console.log(countRef.current), 1000);
  return () => clearInterval(id);
}, []);
```

**O usar el functional updater** cuando solo seteás:

```jsx
setCount(c => c + 1);  // no hace falta leer `count` externo
```

## Cómo identificarlos

- "¿Por qué mi UI muestra datos viejos?" → race.
- "¿Por qué mi interval / event handler ignora el state nuevo?" → stale closure.

## Encuadre senior

> "Race conditions and stale closures are different. Races come from older async results overwriting newer ones — fix with abort or cancellation flags. Stale closures come from handlers capturing old state — fix with proper deps, a ref to the latest value, or the functional updater for state-only updates. React Query handles races for you; closures still bite if you're not careful."
