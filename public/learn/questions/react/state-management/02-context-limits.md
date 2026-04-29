# Context API — when it's enough, when it isn't

> Context isn't a state-management library. It's a **prop-drilling solver**. It scales badly with frequent updates.

## When Context is the right tool

- **Theme**, locale, currency.
- **Current user / auth status**.
- **Feature flags**.
- DI for services (analytics client, API client).

> The pattern: data that's **broadly needed** but **rarely changes**.

## When Context is the wrong tool

- A piece of state that updates **often** (every keystroke, every scroll, real-time data).
- A large object where consumers each only care about **one field**.
- A **list that grows** with frequent inserts.

In these cases every `useContext` consumer re-renders on every change. There's no built-in way to subscribe to a slice.

## Workarounds before reaching for a library

### 1. Split into multiple contexts

If theme and user are unrelated, don't put them in one context. Two contexts = two re-render cycles, isolated.

### 2. Stable provider value

```jsx
const value = useMemo(() => ({ user, setUser }), [user]);
```

Otherwise you create a new object every render and re-render every consumer.

### 3. State + Dispatch contexts (Kent C. Dodds pattern)

Split the state and the dispatcher into two contexts. Components that only need to dispatch (not read) don't re-render when state changes.

## When to reach for Zustand / Redux / Jotai

- Multiple components subscribe to **different slices** of the same state.
- High-frequency updates.
- Need devtools / time-travel debugging.
- Complex actions / middleware.

## Interview line

> "Context is great for theme, locale, and auth — broadly-needed, low-frequency. For high-frequency or sliced state, every consumer re-rendering is too expensive, and I'd reach for Zustand or Redux which support subscribing to specific slices."
