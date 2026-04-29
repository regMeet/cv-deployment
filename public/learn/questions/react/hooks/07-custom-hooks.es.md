# Custom hooks — extraer lógica

> Un custom hook es solo una función que **arranca con `use`** y **llama otros hooks**. La convención es lo que hace que el linter chequee las reglas de hooks.

## Para qué son

Reusar **lógica con state** entre componentes. No solo funciones — lógica que usa hooks.

## Ejemplo — useDebounce

```jsx
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

// uso
const debouncedQuery = useDebounce(query);
```

## Ejemplo — useLocalStorage

```jsx
function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initial;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
```

## Por qué custom hooks > HOCs / render props

- Más fácil de componer (solo llamar múltiples hooks).
- Sin componentes wrappers que ensucian el árbol.
- Inferencia de TypeScript funciona naturalmente.
- Lógica y state se mantienen juntos.

## Qué NO es un hook

Una función que no usa hooks no debería arrancar con `use`. Sé una función regular:

```js
function formatCurrency(n) { /* sin hooks */ } // no es un hook, no la nombres `useFormatCurrency`
```

## Encuadre senior

> "Custom hooks are how I share stateful logic. They keep components thin and let me unit-test the logic in isolation. Two rules: name it `use*`, and only put real hook usage in it — otherwise it's just a function pretending to be one."

## Hooks útiles comunes para mencionar

- `useDebounce`, `useThrottle`
- `useLocalStorage`, `useSessionStorage`
- `useMediaQuery`
- `usePrevious`
- `useOnClickOutside`
- `useFetch` (o directamente usar React Query)
