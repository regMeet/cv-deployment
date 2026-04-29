# `useState` vs `useReducer`

> Mismo objetivo — state local. `useReducer` brilla cuando las transiciones de state se vuelven complejas o interdependientes.

## `useState`

```jsx
const [count, setCount] = useState(0);
setCount(c => c + 1);
```

- Mejor para piezas de state **independientes**.
- Mejor cuando las transiciones son simples.

## `useReducer`

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
dispatch({ type: 'add', payload: 1 });
```

- Todas las transiciones viven en **una función pura** — el reducer.
- Más fácil de **testear** en aislamiento.
- Bueno cuando el próximo state depende de múltiples piezas del state actual, o cuando hay muchas acciones que tocan el mismo state.

## Cuándo cambiar

Recurrir a `useReducer` cuando:

- Tenés ≥3 `useState`s relacionados que siempre cambian juntos.
- Las transiciones de state siguen una state machine (loading / success / error / refetching).
- El mismo state se muta desde muchos handlers.
- Querés pasarle `dispatch` a los children — su identidad es estable, no necesita `useCallback`.

## Ejemplo — state machine de fetching

```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'fetch':   return { status: 'loading', error: null, data: null };
    case 'success': return { status: 'idle',    error: null, data: action.payload };
    case 'error':   return { status: 'idle',    error: action.payload, data: null };
  }
}

const [state, dispatch] = useReducer(reducer, { status: 'idle', error: null, data: null });
```

vs tres `useState`s donde tenés que actualizarlos en sincronía y arriesgar estados intermedios inconsistentes.

## Encuadre senior

> "I default to `useState` for simple, independent values. I switch to `useReducer` when transitions get coupled, or when I want pure, testable logic. Bonus: `dispatch` has a stable identity, which avoids `useCallback` noise in child props."
