# JOIN FETCH vs `@EntityGraph` vs DTO projection

> Three ways to avoid N+1. Pick by what you'll do with the data.

## JOIN FETCH

```java
@Query("SELECT o FROM Order o JOIN FETCH o.items WHERE o.id = :id")
Order findWithItems(@Param("id") Long id);
```

- Brings the relation eagerly in the same query.
- Returns **entities** (managed by Hibernate).
- ⚠️ Only **one collection per query** — multiple JOIN FETCHes on bag-type collections throw `MultipleBagFetchException`.

**Use when:** you need to modify entities or pass them through Hibernate-aware logic.

## `@EntityGraph`

```java
@EntityGraph(attributePaths = {"items", "customer"})
Optional<Order> findById(Long id);
```

- Declarative, reusable across queries.
- Spring Data integrates cleanly.
- Same one-collection-per-bag rule.

**Use when:** same as JOIN FETCH but you want to centralize the fetch plan.

## DTO projection (the favorite)

```java
@Query("""
    SELECT new com.app.dto.OrderDto(o.id, o.total, c.name)
    FROM Order o JOIN o.customer c
    WHERE o.id = :id
    """)
OrderDto findDto(@Param("id") Long id);
```

- Returns a plain DTO (often a `record`), **not an entity**.
- Hibernate doesn't track it → no lazy fan-out possible.
- Fetches **only the columns you need** → smaller payload.

**Use when:** read-only response (most HTTP endpoints).

## Decision

| Goal | Use |
|---|---|
| Need to modify the entity | JOIN FETCH or `@EntityGraph` |
| Read-only / build response | **DTO projection** |
| Want a reusable fetch plan | `@EntityGraph` |
| Multiple bag collections | Split queries; can't JOIN FETCH them together |

## Interview line

> "If I need the entity, JOIN FETCH or `@EntityGraph`. For read paths I default to DTO projections — no entity means no surprise lazy loads, and I only fetch the columns I actually use."
