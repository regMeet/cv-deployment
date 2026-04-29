# Code splitting with `React.lazy` + Suspense

> Don't ship 5MB of JS for the home page. Split bundles by route, by feature, by rarely-used widget.

## Basic shape

```jsx
import { lazy, Suspense } from 'react';

const Settings = lazy(() => import('./Settings'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Settings />
    </Suspense>
  );
}
```

The bundler (Vite, webpack) splits `Settings` into its own chunk. It loads only when the user navigates to it.

## Route-based splitting

The biggest single win. Each route gets its own chunk:

```jsx
const Home    = lazy(() => import('./pages/Home'));
const Profile = lazy(() => import('./pages/Profile'));
const Admin   = lazy(() => import('./pages/Admin'));

<Routes>
  <Route path="/"        element={<Home />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/admin"   element={<Admin />} />
</Routes>
```

## Feature-based / widget-based splitting

For heavy components used only in some flows: chart libraries, rich text editors, PDF viewers. Lazy-load them when the user opens that feature.

## Preloading

To avoid the user seeing a spinner on click, **preload** the chunk on hover or as soon as you know it'll be needed:

```jsx
const onHover = () => import('./Settings');
```

## Pitfalls

- **Too granular** — each chunk has overhead (request, parse). Don't split per component.
- **No fallback** — without `Suspense`, lazy throws.
- **Forgotten preloading** — interactive elements that always trigger a 400ms wait feel broken.
- **Above-the-fold content split** — never lazy-load the first thing users see.

## Other bundle-size wins

- **Tree-shaking** — import only what you use (`import { foo } from 'lib'`, not `import * as`).
- **Dynamic import for libraries** — load `dayjs` / `marked` / `chart.js` only when needed.
- Replace heavy libs with smaller alternatives (`moment` → `date-fns` or `Temporal`).

## Senior framing

> "Code splitting is mostly route-based — every additional 100KB on initial load hurts time-to-interactive on slow networks. For heavy non-critical widgets I lazy-load on demand and preload on hover so the perceived latency stays low."
