# `useContext` — and its trade-offs

> Context lets you **avoid prop-drilling**. It is **not** a state-management library, and it doesn't prevent re-renders.

## Basic shape

```jsx
const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Button() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Click</button>;
}
```

## What it's good at

- **Theming**, locale, current user — values that lots of components need but rarely change.
- **DI** for services / configuration.
- Avoiding "prop tunnels" through 5 layers.

## What bites you

### 1. Every consumer re-renders when the value changes

If your context value is a mutable object that changes often (e.g., a frequently-updated state), every consumer re-renders. There's no built-in "subscribe to a slice".

### 2. Inline value object recreates each render

```jsx
<Ctx.Provider value={{ user, setUser }}>  // 💥 new object every render
```

The provider's value is a new reference every time, so every consumer re-renders even if `user` didn't change. Memoize the value:

```jsx
const value = useMemo(() => ({ user, setUser }), [user]);
return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
```

### 3. Selecting a slice — not natively supported

You can't do `useContextSelector` from React core. Options:

- Split into multiple contexts (one per slice).
- Use `use-context-selector` library.
- Pick a real state library (Redux, Zustand) for high-frequency updates.

## Senior framing

> "Context is great for low-frequency, broadly-needed values like theme or user. It's not a substitute for a state library when state updates frequently — every consumer re-renders, and you can't subscribe to a slice. For high-frequency state I reach for Zustand or Redux."

## Pattern — provider + custom hook

```jsx
const UserCtx = createContext(null);

export function UserProvider({ children }) {
  const value = useUserState(); // your hook
  return <UserCtx.Provider value={value}>{children}</UserCtx.Provider>;
}

export function useUser() {
  const ctx = useContext(UserCtx);
  if (!ctx) throw new Error('useUser must be used inside UserProvider');
  return ctx;
}
```

The custom hook hides the context entirely — consumers just call `useUser()`.
