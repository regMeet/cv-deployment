# Render props → HOCs → Hooks (evolution)

> All three solve the same problem: **share stateful logic across components**. Hooks are the modern winner.

## Render props

A component takes a function as `children` (or a prop) and calls it with state.

```jsx
<MouseTracker>
  {({ x, y }) => <div>{x}, {y}</div>}
</MouseTracker>
```

✅ Flexible. ❌ Nesting hell when you compose multiple — pyramid of doom.

## HOCs (Higher-Order Components)

A function that takes a component and returns a new component with extra props.

```jsx
const withMouse = Component => props => {
  const mouse = useMouse();
  return <Component {...props} mouse={mouse} />;
};

const TrackedFoo = withMouse(Foo);
```

✅ Reusable. ❌ Wrapper components clutter the tree, prop name collisions, harder TypeScript inference, "where did this prop come from?" debugging pain.

## Hooks

```jsx
function Foo() {
  const { x, y } = useMouse();
  return <div>{x}, {y}</div>;
}
```

✅ Composable (call multiple).
✅ No wrapper components.
✅ TypeScript inference is natural.
✅ Logic and state stay in one place.

## When you'd still use the older patterns

- **Render props** for component APIs that need to expose runtime state in JSX (some headless UI libraries, e.g., `<Disclosure>` from Headless UI).
- **HOCs** for cross-cutting concerns at the **route or boundary** level — e.g., `withAuth` for redirecting to login. Even there, hooks + a wrapper component are usually cleaner.

## Senior framing

> "Hooks replaced render props and HOCs for sharing stateful logic. They compose without wrapper trees and play well with TypeScript. I still see render props in headless component libraries that expose internal state in JSX, and HOCs occasionally for route-level boundaries — but for new logic-reuse, it's hooks."
