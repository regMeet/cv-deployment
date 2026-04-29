# How do you detect N+1?

> N+1 = 1 query for the parent + N queries (one per parent row) for a related collection.

## Symptom

- One request issues hundreds of similar queries differing only in the WHERE id.
- Latency scales with the number of parents loaded.

## How to spot it

- **Datadog APM / Hibernate stats** — flags repeated identical queries per request.
- **Hibernate logging:**
  ```properties
  spring.jpa.show-sql=true
  logging.level.org.hibernate.SQL=DEBUG
  ```
- **Hypersistence Optimizer** / **Glowroot** — automated N+1 detection.

## Common causes

- Lazy associations + iteration:
  ```java
  for (Order o : orders) {
      o.getItems(); // 💥 query per order
  }
  ```
- Mapping a list of entities to DTOs in a loop, touching lazy fields.
- Spring Data findAll() returning entities, then someone touches a relation.

## Fixes

| Strategy | Use when |
|---|---|
| `JOIN FETCH` | You need the entity and its relation in one shot |
| `@EntityGraph` | Same, but declarative and reusable |
| **DTO projection** | Read-only response, never need the entity |
| Batching with `@BatchSize` | Multiple parents, lazy load grouped into IN-clause |

## Interview line

> "I detect N+1 with APM or Hibernate SQL logging — repeated identical queries per request are the tell. The fix depends on the case: `JOIN FETCH` if I need the entity, DTO projection if I'm just building a response."
