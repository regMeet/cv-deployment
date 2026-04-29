# Composición sobre herencia

> React no tiene realmente herencia para componentes. La respuesta nativa a "quiero reusar / extender comportamiento" es **composición** — pasar children, pasar props, pasar elements.

## Tres herramientas de composición

### 1. `children`

```jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

<Card>
  <h2>Title</h2>
  <p>Body</p>
</Card>
```

### 2. Slots (children nombrados vía props)

```jsx
function Layout({ header, sidebar, content }) {
  return (
    <div className="layout">
      <header>{header}</header>
      <aside>{sidebar}</aside>
      <main>{content}</main>
    </div>
  );
}

<Layout
  header={<TopBar />}
  sidebar={<Nav />}
  content={<HomePage />}
/>
```

### 3. Render props (children como función)

```jsx
function Tooltip({ children, content }) {
  const [visible, setVisible] = useState(false);
  return children({ visible, show: () => setVisible(true) });
}

<Tooltip content={<Help />}>
  {({ visible, show }) => <button onClick={show}>?</button>}
</Tooltip>
```

(Largamente reemplazado por **custom hooks** para lógica, pero útil para layout que necesita state runtime del padre.)

## Por qué no herencia

- Los componentes React son solo funciones. No hay nada útil para "extender".
- La herencia crea **jerarquías rígidas** que no componen bien con múltiples comportamientos no relacionados.
- La composición te deja mezclar piezas chicas e independientes.

## Encuadre senior

> "I share UI via composition (children, slots) and behavior via custom hooks. Inheritance hierarchies don't model UI well — components have many unrelated dimensions of variation, and composition handles each one independently."
