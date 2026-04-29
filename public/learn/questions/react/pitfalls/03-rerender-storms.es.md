# Tormentas de re-renders

> Todo el árbol re-renderiza en cada keystroke. Generalmente algunas causas comunes — encontralas con el Profiler, arreglalas en la fuente.

## Causas comunes

### 1. State subido demasiado alto

Un keystroke en un input profundo updatea state en la raíz → todo el árbol re-renderiza. El fix es **colocación**: mantener state cerca de donde se usa.

> Ver: [State local vs derivado](#react/state-management/local-vs-derived).

### 2. Provider value con referencia nueva cada render

```jsx
<Ctx.Provider value={{ user, setUser }}>  // 💥 objeto nuevo cada render
  ...
</Ctx.Provider>
```

Cada consumer re-renderiza incluso cuando nada cambió. Memoizá:

```jsx
const value = useMemo(() => ({ user, setUser }), [user]);
```

### 3. Objects/arrays/functions inline como props de child memoizado

```jsx
<MemoRow item={{ id, name }} onClick={() => handle(id)} />
// objeto nuevo + función nueva cada render → memo es inútil
```

Hoisteá la constante o estabilizá con `useMemo` / `useCallback`.

### 4. Context para state de alta frecuencia

Cada consumer re-renderiza en cada cambio. Splitear el context, usar una lib de selector, o moverse a un store real.

### 5. Almacenar datos derivados como state

```jsx
const [items, setItems] = useState(...);
const [filtered, setFiltered] = useState(...); // 💥 state derivado
useEffect(() => setFiltered(filter(items)), [items]); // sincroniza state en un effect
```

Duplica los renders y agrega un effect que existe sin razón. Computá nomás:

```jsx
const filtered = useMemo(() => filter(items), [items]);
```

## Cómo encontrar al culpable

- Abrir **React DevTools Profiler**.
- Grabar una interacción (tipear en el input, click en el botón).
- Ordenar por count y tiempo de render.
- Para cada componente sospechoso, el Profiler muestra **por qué** re-renderizó (cambiaron props, cambiaron hooks, padre re-renderizó).

Eso te dice la fuente — generalmente una referencia de prop del padre o un state en el lugar equivocado.

## Encuadre senior

> "I don't sprinkle memo everywhere. I find the cause with the Profiler — usually state lifted too high, a provider value that recreates every render, or derived state stored instead of computed. Fixing the source removes the storm; memoization is a band-aid for the rest."
