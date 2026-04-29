# Render props → HOCs → Hooks (evolución)

> Las tres resuelven el mismo problema: **compartir lógica con state entre componentes**. Hooks es el ganador moderno.

## Render props

Un componente toma una función como `children` (o como prop) y la llama con state.

```jsx
<MouseTracker>
  {({ x, y }) => <div>{x}, {y}</div>}
</MouseTracker>
```

✅ Flexible. ❌ Infierno de anidación cuando componés varios — pirámide de la fatalidad.

## HOCs (Higher-Order Components)

Una función que toma un componente y devuelve un componente nuevo con props extra.

```jsx
const withMouse = Component => props => {
  const mouse = useMouse();
  return <Component {...props} mouse={mouse} />;
};

const TrackedFoo = withMouse(Foo);
```

✅ Reusable. ❌ Componentes wrapper que ensucian el árbol, colisiones de nombre de prop, inferencia de TypeScript más difícil, dolor de debugging "¿de dónde salió esta prop?".

## Hooks

```jsx
function Foo() {
  const { x, y } = useMouse();
  return <div>{x}, {y}</div>;
}
```

✅ Componibles (llamar varios).
✅ Sin componentes wrapper.
✅ Inferencia de TypeScript natural.
✅ Lógica y state en un solo lugar.

## Cuándo seguir usando los patterns viejos

- **Render props** para APIs de componente que necesitan exponer state runtime en JSX (algunas librerías de headless UI, ej: `<Disclosure>` de Headless UI).
- **HOCs** para concerns transversales a nivel de **ruta o boundary** — ej: `withAuth` para redirigir a login. Incluso ahí, hooks + un wrapper component son normalmente más limpios.

## Encuadre senior

> "Hooks replaced render props and HOCs for sharing stateful logic. They compose without wrapper trees and play well with TypeScript. I still see render props in headless component libraries that expose internal state in JSX, and HOCs occasionally for route-level boundaries — but for new logic-reuse, it's hooks."
