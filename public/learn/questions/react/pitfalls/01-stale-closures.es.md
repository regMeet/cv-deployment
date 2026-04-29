# Stale closures

> Una función definida en un render previo todavía ve las variables de ese render. Si corre después, lee valores **viejos**.

## El ejemplo clásico

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log(count);   // 💥 siempre 0
    }, 1000);
    return () => clearInterval(id);
  }, []);  // deps vacíos → setup una vez → closure stale para siempre
}
```

El callback del interval se creó cuando `count` era 0. El closure capturó ese valor. Renders nuevos crean closures nuevos, pero el **interval sigue referenciando el viejo**.

## Tres fixes

### 1. Agregar la dep (recrear el effect)

```jsx
useEffect(() => {
  const id = setInterval(() => console.log(count), 1000);
  return () => clearInterval(id);
}, [count]);
```

El effect se re-corre cada vez que `count` cambia. Interval nuevo, closure nuevo.

### 2. Functional updater (cuando solo seteás state)

```jsx
setCount(c => c + 1);
```

Te deja incrementar sin leer `count` externo. Sin dependencia de closure.

### 3. Ref al último valor

```jsx
const countRef = useRef(count);
useEffect(() => { countRef.current = count; });

useEffect(() => {
  const id = setInterval(() => console.log(countRef.current), 1000);
  return () => clearInterval(id);
}, []);
```

Los refs son mutables; el interval lee el valor **actual** a través del ref. Usar esto cuando genuinamente querés que el setup se quede estable.

## Dónde más muerden

- `setTimeout` en event handlers.
- Suscripciones registradas una vez con deps vacíos.
- Handlers de mensaje WebSocket.
- Funciones throttled / debounced capturadas al momento de definición.

## Cómo identificarlos

- "Mi handler muestra state viejo."
- "Mi interval / suscripción no refleja el valor nuevo."
- ESLint `react-hooks/exhaustive-deps` te avisa — **confiá**. La mayoría de bugs de stale closure son warnings de lint silenciados.

## Encuadre senior

> "Stale closures come from a function being defined in a past render and run later. I prefer functional updaters when I just need to update state, deps when the effect should restart on change, and a ref-to-latest pattern only when the setup must remain stable."
