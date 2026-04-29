# `useContext` — y sus trade-offs

> Context te deja **evitar prop-drilling**. **No** es una librería de state management, y no previene re-renders.

## Forma básica

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

## Para qué es bueno

- **Theming**, locale, usuario actual — valores que muchos componentes necesitan pero raramente cambian.
- **DI** para servicios / configuración.
- Evitar "prop tunnels" a través de 5 capas.

## Qué te muerde

### 1. Cada consumer re-renderiza cuando el value cambia

Si tu context value es un objeto mutable que cambia frecuentemente (ej: state que se actualiza seguido), cada consumer re-renderiza. No hay un "subscribirse a un slice" built-in.

### 2. Objeto value inline se recrea cada render

```jsx
<Ctx.Provider value={{ user, setUser }}>  // 💥 nuevo objeto cada render
```

El value del provider es una referencia nueva cada vez, así que cada consumer re-renderiza incluso si `user` no cambió. Memoizá el value:

```jsx
const value = useMemo(() => ({ user, setUser }), [user]);
return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
```

### 3. Seleccionar un slice — no soportado nativo

No podés hacer `useContextSelector` desde el core de React. Opciones:

- Splitear en múltiples contexts (uno por slice).
- Usar la lib `use-context-selector`.
- Elegir una lib de state real (Redux, Zustand) para updates de alta frecuencia.

## Encuadre senior

> "Context is great for low-frequency, broadly-needed values like theme or user. It's not a substitute for a state library when state updates frequently — every consumer re-renders, and you can't subscribe to a slice. For high-frequency state I reach for Zustand or Redux."

## Patrón — provider + custom hook

```jsx
const UserCtx = createContext(null);

export function UserProvider({ children }) {
  const value = useUserState(); // tu hook
  return <UserCtx.Provider value={value}>{children}</UserCtx.Provider>;
}

export function useUser() {
  const ctx = useContext(UserCtx);
  if (!ctx) throw new Error('useUser must be used inside UserProvider');
  return ctx;
}
```

El custom hook esconde el context completo — los consumers solo llaman `useUser()`.
