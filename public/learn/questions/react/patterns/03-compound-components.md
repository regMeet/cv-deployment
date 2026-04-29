# Compound components

> A pattern where a parent and a set of children **share implicit state via context**, so the consumer composes them naturally without prop-drilling.

## The shape

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

The parent (`<Tabs>`) holds state. The children (`<Tabs.Trigger>`, `<Tabs.Content>`) read it through a context the parent provides — without the consumer wiring anything.

## Implementation sketch

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

## Why use it

- **Flexible composition** — consumer arranges children freely.
- **No prop drilling** — children read from context instead of receiving props.
- **API mirrors structure** — `Tabs > Tabs.List > Tabs.Trigger` reads naturally.

## Where you've seen it

- **Headless UI** (`Disclosure`, `Listbox`).
- **Radix UI** (`Dialog`, `Tabs`, `DropdownMenu`).
- **Reach UI** (older, similar idea).

## Trade-offs

- **Implicit coupling** — children must be inside the right parent or they break.
- **TypeScript** can be tricky to type the children correctly.
- **Discoverability** — consumers must know the available subcomponents.

## Senior framing

> "Compound components are a great way to expose component state to children without prop-drilling. The pattern shines for widgets where the structure is opinionated — tabs, dialogs, dropdowns — and works through a context the parent provides. Radix and Headless UI use it heavily."
