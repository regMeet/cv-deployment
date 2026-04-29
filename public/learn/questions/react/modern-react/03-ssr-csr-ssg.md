# SSR vs CSR vs SSG vs ISR

> Four strategies for getting React to the user. Each makes different trade-offs in TTFB, freshness, and hosting cost.

## CSR — Client-Side Rendering

The browser downloads a small HTML shell + a JS bundle. The JS renders the UI.

- ✅ Simple hosting (static).
- ✅ Cheap, scales like a static site.
- ❌ **Blank screen** until JS loads + executes (poor TTI / FCP on slow networks).
- ❌ Bad for **SEO** unless you handle it.

> Classic Vite / CRA app.

## SSR — Server-Side Rendering

The server renders to HTML on every request, then **hydrates** on the client.

- ✅ Fast first paint — HTML arrives ready.
- ✅ Good SEO (content is in the HTML).
- ❌ Server work per request → cost.
- ❌ Hydration cost on the client.

> Next.js (Pages Router with `getServerSideProps`), Remix loaders, RSC streaming.

## SSG — Static Site Generation

Render to HTML **at build time**. Serve as static files.

- ✅ Fastest possible response (just static files via CDN).
- ✅ Cheapest hosting.
- ❌ Stale until the next build.
- ❌ Long build times for large sites.

> Marketing pages, blogs, docs.

## ISR — Incremental Static Regeneration

SSG with **periodic regeneration**. Pages serve from the static cache; the server rebuilds them in the background after a TTL.

- ✅ Static-fast + freshness.
- ✅ Scales well.
- ❌ Stale window equal to revalidation interval.
- ❌ Requires a runtime that supports it (Next.js / Vercel, etc.).

> Product catalogs, news, anything mostly-static but occasionally updated.

## Hydration

After SSR/SSG, React **hydrates** the static HTML — attaches event listeners and resumes state. The HTML and the client tree must match exactly, or you get hydration warnings / mismatches.

Common pitfalls: rendering `Date.now()` or `Math.random()` on the server, then it differs on the client.

## When to pick what

| Page | Pick |
|---|---|
| Personalized dashboard | SSR or RSC |
| Marketing / docs | SSG |
| Product catalog | ISR |
| Internal tool, SEO doesn't matter | CSR |
| Public app with user data | SSR (+ RSC for read-heavy parts) |

## Senior framing

> "It's a spectrum. Static is fastest and cheapest but stale; SSR is fresh but costly; ISR splits the difference; CSR is fine where SEO doesn't matter. With React Server Components and Next.js's App Router, the line between server and client rendering blurs — you can mix per route or per component."
