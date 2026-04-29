# `useState` vs `useReducer`

> Same goal — local state. `useReducer` shines when state transitions get complex or interdependent.

## `useState`

```jsx
const [count, setCount] = useState(0);
setCount(c => c + 1);
```

- Best for **independent** pieces of state.
- Best when state transitions are simple.

## `useReducer`

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
dispatch({ type: 'add', payload: 1 });
```

- All transitions live in **one pure function** — the reducer.
- Easier to **test** in isolation.
- Good when next state depends on multiple pieces of current state, or when there are many actions that touch the same state.

## When to switch

Reach for `useReducer` when:

- You have ≥3 related `useState` calls that always change together.
- State transitions follow a state machine (loading / success / error / refetching).
- Same state is mutated from many handlers.
- You want `dispatch` to pass to children — its identity is stable, no need for `useCallback`.

## Example — fetching state machine

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

vs three `useState`s where you have to update them in lockstep and risk inconsistent intermediate states.

## Senior framing

> "I default to `useState` for simple, independent values. I switch to `useReducer` when transitions get coupled, or when I want pure, testable logic. Bonus: `dispatch` has a stable identity, which avoids `useCallback` noise in child props."
