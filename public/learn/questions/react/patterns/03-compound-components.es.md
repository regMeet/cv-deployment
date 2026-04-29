# Compound components

> Patrón donde un padre y un set de children **comparten state implícito vía context**, así el consumer compone naturalmente sin prop-drilling.

## La forma

```jsx
<Tabs defaultValue="profile">
  <Tabs.List>
    <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
    <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="profile">…</Tabs.Content>
  <Tabs.Content value="settings">…</Tabs.Content>
</Tabs>
```

El padre (`<Tabs>`) sostiene el state. Los children (`<Tabs.Trigger>`, `<Tabs.Content>`) lo leen a través de un context que el padre provee — sin que el consumer tenga que cablear nada.

## Sketch de implementación

```jsx
const TabsContext = createContext(null);

function Tabs({ defaultValue, children }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      {children}
    </TabsContext.Provider>
  );
}

function Trigger({ value, children }) {
  const ctx = useContext(TabsContext);
  return (
    <button
      data-active={ctx.value === value}
      onClick={() => ctx.setValue(value)}
    >
      {children}
    </button>
  );
}

Tabs.List    = ({ children }) => <div role="tablist">{children}</div>;
Tabs.Trigger = Trigger;
Tabs.Content = ({ value, children }) => {
  const ctx = useContext(TabsContext);
  return ctx.value === value ? <div>{children}</div> : null;
};
```

## Por qué usarlo

- **Composición flexible** — el consumer ordena los children libremente.
- **Sin prop drilling** — los children leen del context en lugar de recibir props.
- **API espeja la estructura** — `Tabs > Tabs.List > Tabs.Trigger` se lee natural.

## Dónde lo viste

- **Headless UI** (`Disclosure`, `Listbox`).
- **Radix UI** (`Dialog`, `Tabs`, `DropdownMenu`).
- **Reach UI** (más viejo, idea similar).

## Trade-offs

- **Acoplamiento implícito** — los children tienen que estar dentro del padre correcto o se rompen.
- **TypeScript** puede ser tricky para tipar los children correctamente.
- **Discoverability** — los consumers deben conocer los subcomponentes disponibles.

## Encuadre senior

> "Compound components are a great way to expose component state to children without prop-drilling. The pattern shines for widgets where the structure is opinionated — tabs, dialogs, dropdowns — and works through a context the parent provides. Radix and Headless UI use it heavily."
