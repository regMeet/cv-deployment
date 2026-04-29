# JOIN FETCH vs `@EntityGraph` vs DTO projection

> Tres formas de evitar N+1. Elegí según qué vas a hacer con los datos.

## JOIN FETCH

```java
@Query("SELECT o FROM Order o JOIN FETCH o.items WHERE o.id = :id")
Order findWithItems(@Param("id") Long id);
```

- Trae la relación eagerly en la misma query.
- Devuelve **entidades** (manejadas por Hibernate).
- ⚠️ Solo **una colección por query** — múltiples JOIN FETCHes sobre colecciones tipo bag tiran `MultipleBagFetchException`.

**Usar cuando:** necesitás modificar las entidades o pasarlas por lógica Hibernate-aware.

## `@EntityGraph`

```java
@EntityGraph(attributePaths = {"items", "customer"})
Optional<Order> findById(Long id);
```

- Declarativo, reusable a través de queries.
- Spring Data lo integra limpio.
- Misma regla de una colección por bag.

**Usar cuando:** lo mismo que JOIN FETCH pero querés centralizar el plan de fetch.

## DTO projection (la favorita)

```java
@Query("""
    SELECT new com.app.dto.OrderDto(o.id, o.total, c.name)
    FROM Order o JOIN o.customer c
    WHERE o.id = :id
    """)
OrderDto findDto(@Param("id") Long id);
```

- Devuelve un DTO plano (frecuentemente un `record`), **no una entidad**.
- Hibernate no la trackea → no hay lazy fan-out posible.
- Trae **solo las columnas que necesitás** → payload más chico.

**Usar cuando:** response read-only (la mayoría de endpoints HTTP).

## Decisión

| Objetivo | Usar |
|---|---|
| Necesitás modificar la entidad | JOIN FETCH o `@EntityGraph` |
| Read-only / armar response | **DTO projection** |
| Querés un fetch plan reusable | `@EntityGraph` |
| Múltiples bag collections | Splitear queries; no podés JOIN FETCH ambas |

## Frase para entrevista

> "If I need the entity, JOIN FETCH or `@EntityGraph`. For read paths I default to DTO projections — no entity means no surprise lazy loads, and I only fetch the columns I actually use."
