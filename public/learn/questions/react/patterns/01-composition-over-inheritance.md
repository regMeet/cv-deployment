# Composition over inheritance

> React doesn't really have inheritance for components. The native answer to "I want to reuse / extend behavior" is **composition** — pass children, pass props, pass elements.

## Three composition tools

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

### 2. Slots (named children via props)

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

### 3. Render props (children as a function)

```jsx
function Tooltip({ children, content }) {
  const [visible, setVisible] = useState(false);
  return children({ visible, show: () => setVisible(true) });
}

<Tooltip content={<Help />}>
  {({ visible, show }) => <button onClick={show}>?</button>}
</Tooltip>
```

(Largely replaced by **custom hooks** for logic, but still useful for layout that needs runtime state from the parent.)

## Why no inheritance

- React components are just functions. There's nothing useful to "extend".
- Inheritance creates **rigid hierarchies** that don't compose well with multiple unrelated behaviors.
- Composition lets you mix small, independent pieces.

## Senior framing

> "I share UI via composition (children, slots) and behavior via custom hooks. Inheritance hierarchies don't model UI well — components have many unrelated dimensions of variation, and composition handles each one independently."
