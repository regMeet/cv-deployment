# SSR vs CSR vs SSG vs ISR

> Cuatro estrategias para llevar React al usuario. Cada una hace trade-offs distintos en TTFB, freshness y costo de hosting.

## CSR — Client-Side Rendering

El browser baja un shell HTML chico + un bundle JS. El JS renderiza la UI.

- ✅ Hosting simple (estático).
- ✅ Barato, escala como sitio estático.
- ❌ **Pantalla en blanco** hasta que el JS carga + ejecuta (TTI / FCP malo en redes lentas).
- ❌ Mal para **SEO** a menos que lo manejes.

> App típica de Vite / CRA.

## SSR — Server-Side Rendering

El servidor renderiza a HTML en cada request, después **hidrata** en el cliente.

- ✅ First paint rápido — el HTML llega listo.
- ✅ Buen SEO (el contenido está en el HTML).
- ❌ Trabajo del servidor por request → costo.
- ❌ Costo de hidratación en el cliente.

> Next.js (Pages Router con `getServerSideProps`), loaders de Remix, RSC streaming.

## SSG — Static Site Generation

Renderizar a HTML **en build time**. Servir como archivos estáticos.

- ✅ Response más rápido posible (solo archivos estáticos vía CDN).
- ✅ Hosting más barato.
- ❌ Stale hasta el próximo build.
- ❌ Builds largos para sitios grandes.

> Páginas marketing, blogs, docs.

## ISR — Incremental Static Regeneration

SSG con **regeneración periódica**. Las páginas se sirven del cache estático; el servidor las reconstruye en background después de un TTL.

- ✅ Estático-rápido + freshness.
- ✅ Escala bien.
- ❌ Ventana stale igual al intervalo de revalidación.
- ❌ Requiere un runtime que lo soporte (Next.js / Vercel, etc.).

> Catálogos de productos, news, cualquier cosa mostly-static pero ocasionalmente updateada.

## Hidratación

Después de SSR/SSG, React **hidrata** el HTML estático — adjunta event listeners y reanuda state. El HTML y el client tree deben coincidir exactamente, o tenés warnings / mismatches de hidratación.

Pitfalls comunes: renderizar `Date.now()` o `Math.random()` en el servidor, después difiere en el cliente.

## Cuándo elegir qué

| Página | Elegir |
|---|---|
| Dashboard personalizado | SSR o RSC |
| Marketing / docs | SSG |
| Catálogo de productos | ISR |
| Tool interno, SEO no importa | CSR |
| App pública con datos de usuario | SSR (+ RSC para partes read-heavy) |

## Encuadre senior

> "It's a spectrum. Static is fastest and cheapest but stale; SSR is fresh but costly; ISR splits the difference; CSR is fine where SEO doesn't matter. With React Server Components and Next.js's App Router, the line between server and client rendering blurs — you can mix per route or per component."
