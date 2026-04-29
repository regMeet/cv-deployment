# Server Components (RSC)

> A new component type that runs **only on the server**, ships **zero JS to the client**, and can directly access server resources (DB, file system, secrets).

## Mental model

Two component types coexist:

- **Server Components** — run during SSR (or at build time). No `useState`, no `useEffect`, no event handlers. Can be `async`, can read DB, can use secrets.
- **Client Components** — the React you know. Marked with `"use client"` at the top. Run on the server (for SSR) and the client. Can have state and effects.

Server Components can render Client Components, and vice versa, with rules.

## Why they exist

- **Smaller bundles** — heavy logic (auth, DB queries, markdown parsing) stays on the server. Client gets HTML, not JS.
- **Direct backend access** — no need for an API layer for internal data:

  ```jsx
  // app/users/[id]/page.tsx
  export default async function Page({ params }) {
    const user = await db.user.findUnique({ where: { id: params.id } });
    return <h1>{user.name}</h1>;
  }
  ```

- **Better performance** — less JS to ship and parse on the client.

## Rules

- A Client Component cannot import a Server Component (the inverse is fine).
- Server Components can pass **serializable** props to Client Components — including JSX.
- `useState`, `useEffect`, browser APIs → Client Components only.
- `"use client"` is a **boundary marker** — once a file is marked, everything it imports becomes a client tree.

## Where they run

Currently in **frameworks** that support them: **Next.js (App Router)**, Remix (planned in newer versions). Plain CRA / Vite apps don't have RSC out of the box — there are experimental setups, but the main story is via frameworks.

## Trade-offs

- ✅ Smaller bundles, direct backend access, simpler data fetching.
- ❌ More moving parts. New mental model. Two component "colors" to track.
- ❌ Tooling and ecosystem still maturing.

## Senior framing

> "Server Components run only on the server, can be async, and ship no JS to the client. Combined with the framework's data layer, they replace a lot of the API + `useEffect` plumbing for read-only views. The trade-off is mental complexity — you now think about which color a component is, and how data crosses the boundary."
