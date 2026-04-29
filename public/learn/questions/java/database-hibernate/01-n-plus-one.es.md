# ¿Cómo detectás N+1?

> N+1 = 1 query para el padre + N queries (una por cada fila padre) para una colección relacionada.

## Síntoma

- Un request emite cientos de queries similares que solo difieren en el WHERE id.
- La latencia escala con el número de padres cargados.

## Cómo detectarlo

- **Datadog APM / Hibernate stats** — flagea queries idénticas repetidas por request.
- **Logs de Hibernate:**
  ```properties
  spring.jpa.show-sql=true
  logging.level.org.hibernate.SQL=DEBUG
  ```
- **Hypersistence Optimizer** / **Glowroot** — detección automatizada de N+1.

## Causas comunes

- Asociaciones lazy + iteración:
  ```java
  for (Order o : orders) {
      o.getItems(); // 💥 query por order
  }
  ```
- Mapear una lista de entidades a DTOs en un loop, tocando campos lazy.
- `findAll()` de Spring Data devolviendo entidades, después alguien toca una relación.

## Fixes

| Estrategia | Usar cuando |
|---|---|
| `JOIN FETCH` | Necesitás la entidad y su relación de una sola vez |
| `@EntityGraph` | Lo mismo, pero declarativo y reusable |
| **DTO projection** | Response read-only, nunca necesitás la entidad |
| Batching con `@BatchSize` | Múltiples padres, lazy load agrupado en IN-clause |

## Frase para entrevista

> "I detect N+1 with APM or Hibernate SQL logging — repeated identical queries per request are the tell. The fix depends on the case: `JOIN FETCH` if I need the entity, DTO projection if I'm just building a response."
