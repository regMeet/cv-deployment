# Code splitting con `React.lazy` + Suspense

> No mandes 5MB de JS para la home. Splitear bundles por ruta, por feature, por widget poco usado.

## Forma básica

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

El bundler (Vite, webpack) splitea `Settings` en su propio chunk. Carga solo cuando el usuario navega a esa página.

## Splitting por ruta

La ganancia más grande. Cada ruta tiene su propio chunk:

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

## Splitting por feature / widget

Para componentes pesados usados solo en algunos flujos: librerías de gráficos, rich text editors, viewers de PDF. Lazy-load cuando el usuario abre ese feature.

## Preloading

Para evitar que el usuario vea un spinner al click, **precargá** el chunk en hover o ni bien sabés que se va a necesitar:

```jsx
const onHover = () => import('./Settings');
```

## Pitfalls

- **Demasiado granular** — cada chunk tiene overhead (request, parse). No splitees por componente.
- **Sin fallback** — sin `Suspense`, lazy tira.
- **Preloading olvidado** — elementos interactivos que siempre disparan 400ms de espera se sienten rotos.
- **Splitear contenido above-the-fold** — nunca lazy-loadees lo primero que el usuario ve.

## Otras ganancias de bundle-size

- **Tree-shaking** — importá solo lo que usás (`import { foo } from 'lib'`, no `import * as`).
- **Dynamic import para librerías** — cargá `dayjs` / `marked` / `chart.js` solo cuando hace falta.
- Reemplazá libs pesadas con alternativas más chicas (`moment` → `date-fns` o `Temporal`).

## Encuadre senior

> "Code splitting is mostly route-based — every additional 100KB on initial load hurts time-to-interactive on slow networks. For heavy non-critical widgets I lazy-load on demand and preload on hover so the perceived latency stays low."
