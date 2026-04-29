# Custom hooks para reuso de lógica

> La forma moderna de compartir **lógica con state**. Reemplaza render props y HOCs en la mayoría de los casos.

## Qué va en un custom hook

- **Lógica con state** que usa otros hooks.
- Suscripciones, state derivado, efectos.
- Cualquier cosa que extraerías de un componente para reusar en otro lado.

## Ejemplo — `useFetch` (educativo; para producción usá React Query)

```jsx
function useFetch(url) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null });

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading', data: null, error: null });

    fetch(url)
      .then(r => r.json())
      .then(data => { if (!cancelled) setState({ status: 'success', data, error: null }); })
      .catch(err  => { if (!cancelled) setState({ status: 'error', data: null, error: err }); });

    return () => { cancelled = true; };
  }, [url]);

  return state;
}
```

## Cómo mantenerlos limpios

- **Responsabilidad única.** Un hook = un concern.
- **Devolver un shape chico y estable.** Los consumers no deberían tener que recordar arrays posicionales más allá de 2 elementos.
- **Memoizá lo que devolvés** si los consumers dependen de identidades estables (callbacks especialmente).
- **Nunca depender del contexto del call site** — el hook debe ser puro respecto a sus inputs.

## Cuándo NO hacer un hook

Si la lógica no usa otros hooks, no es un custom hook — es una función. No le pongas el prefijo `use`; es engañoso.

```js
function formatUSD(n) { /* sin hooks */ }   // función, no hook
```

## Componer custom hooks

```jsx
function useUser() {
  const id = useUserId();
  const data = useFetch(`/api/users/${id}`);
  return data;
}
```

Los hooks componen como Lego. Esa es la atracción vs HOC wrapper-trees.

## Comunes production-grade

- `useDebounce`, `useThrottle`
- `useLocalStorage`, `useSessionStorage`
- `useMediaQuery`, `useOnClickOutside`
- `usePrevious`
- domain-specific: `useCart`, `useAuth`, `useFeatureFlag`

## Encuadre senior

> "Custom hooks let me extract stateful logic without wrapper trees. I follow three rules: name them `use*` only if they call other hooks, keep them single-purpose, and stabilize what they return. They compose naturally — that's why they replaced HOCs and render props."
