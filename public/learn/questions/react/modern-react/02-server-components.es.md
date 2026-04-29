# Server Components (RSC)

> Un nuevo tipo de componente que corre **solo en el servidor**, manda **cero JS al cliente**, y puede acceder directamente a recursos del servidor (DB, file system, secretos).

## Modelo mental

Coexisten dos tipos de componentes:

- **Server Components** — corren durante SSR (o en build time). Sin `useState`, sin `useEffect`, sin event handlers. Pueden ser `async`, pueden leer de DB, pueden usar secretos.
- **Client Components** — el React que conocés. Marcados con `"use client"` arriba. Corren en el servidor (para SSR) y en el cliente. Pueden tener state y effects.

Los Server Components pueden renderizar Client Components, y viceversa, con reglas.

## Por qué existen

- **Bundles más chicos** — lógica pesada (auth, queries DB, parsing markdown) se queda en el servidor. El cliente recibe HTML, no JS.
- **Acceso directo al backend** — sin necesidad de capa API para datos internos:

  ```jsx
  // app/users/[id]/page.tsx
  export default async function Page({ params }) {
    const user = await db.user.findUnique({ where: { id: params.id } });
    return <h1>{user.name}</h1>;
  }
  ```

- **Mejor performance** — menos JS para mandar y parsear en el cliente.

## Reglas

- Un Client Component no puede importar un Server Component (lo inverso está OK).
- Server Components pueden pasar props **serializables** a Client Components — incluyendo JSX.
- `useState`, `useEffect`, APIs del browser → solo Client Components.
- `"use client"` es un **marcador de boundary** — una vez que un archivo está marcado, todo lo que importe se vuelve un client tree.

## Dónde corren

Actualmente en **frameworks** que los soportan: **Next.js (App Router)**, Remix (planeado en versiones más nuevas). Apps CRA / Vite plain no tienen RSC out of the box — hay setups experimentales, pero la historia principal es vía frameworks.

## Trade-offs

- ✅ Bundles más chicos, acceso directo al backend, data fetching más simple.
- ❌ Más piezas móviles. Modelo mental nuevo. Dos "colores" de componente para trackear.
- ❌ Tooling y ecosistema todavía madurando.

## Encuadre senior

> "Server Components run only on the server, can be async, and ship no JS to the client. Combined with the framework's data layer, they replace a lot of the API + `useEffect` plumbing for read-only views. The trade-off is mental complexity — you now think about which color a component is, and how data crosses the boundary."
