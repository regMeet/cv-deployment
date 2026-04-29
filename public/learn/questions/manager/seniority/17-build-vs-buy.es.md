# Build vs Buy — ¿cómo decidís?

> Decisión clásica de senior+. Están testeando **pensamiento de trade-offs** + conciencia de negocio.

## Qué significa

La decisión entre **construir algo in-house** vs **usar una solución existente** (open source, SaaS, producto de vendor).

Ejemplos:

- Auth → build vs Auth0 / Cognito / Clerk
- Cola → build vs SQS / RabbitMQ / Kafka
- Analytics → build vs Mixpanel / Amplitude
- Search → build vs Elasticsearch / Algolia
- Feature flags → build vs LaunchDarkly / Unleash

## Respuesta sólida

Trato a build vs buy como un **trade-off entre costo, control, time-to-market y encaje estratégico** — no como un default en ninguna dirección.

Tiendo a **comprar cuando la capacidad no es core a nuestro producto** y existe una solución madura. ¿Para qué gastar tiempo de ingeniería reinventando auth o messaging si ya hay grandes opciones?

Me inclino a **construir cuando**:

- Es un **diferenciador core** del producto.
- Las soluciones existentes no encajan con nuestra escala, latencia o requisitos de compliance.
- El costo del vendor lock-in es alto comparado con el costo de construir.
- El costo total de ownership de un vendor (licencias + integración + extracción de datos) supera el costo de construir en un horizonte razonable.

También considero la **carga de mantenimiento** — construir significa ser dueño para siempre, incluyendo parches de seguridad, escalabilidad y on-call.

Cuando hay duda, prefiero **comprar primero** para entregar rápido y aprender, y reevaluar si/cuando golpeamos limitaciones reales.

## Resumen de trade-offs

| Dimensión | Build | Buy |
|-----------|-------|-----|
| Time to market | Más lento | Rápido |
| Costo upfront | Alto (tiempo de eng) | Bajo (licencia) |
| Costo a largo plazo | Mantenimiento | Fees recurrentes |
| Control / customización | Total | Limitado |
| Riesgo de lock-in | Ninguno | Alto |
| Carga operativa | La tenés vos | Vendor la maneja |

## Señales a transmitir

- No religioso de ningún lado.
- Encuadrar alrededor de **core vs commodity**.
- Costo total de ownership, no solo el sticker price.
- Dispuesto a revisar la decisión cuando la escala cambie.
