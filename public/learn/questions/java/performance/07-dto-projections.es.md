# DTO projections con Java records

> No cargues la entidad completa si solo necesitás 9 de 20 columnas. Proyectá directo en un record.

## Patrón

```java
public record AppSummary(Long id, String number, String status, Instant createdAt) {}

@Query("""
    SELECT new com.app.dto.AppSummary(a.id, a.number, a.status, a.createdAt)
    FROM Application a
    WHERE a.caseId IN :ids
    """)
List<AppSummary> findSummaries(@Param("ids") List<Long> ids);
```

## Por qué es mejor que cargar entidades

- **Payload más chico** — menos columnas por la red.
- **Sin entidad managed** — Hibernate no la trackea, así:
  - No hay lazy loads accidentales cuando alguien toca un getter.
  - Sin costo de dirty checking.
  - Sin bloat del first-level cache.
- **Inmutable por diseño** — los records son final + componentes final.
- **Heap más chico** — `record` tiene overhead mínimo vs grafo de objetos de entidad.

## Cuándo seguir usando entidades

- Necesitás **modificar** los datos (save Hibernate-managed).
- Realmente querés change tracking / comportamiento de cascade.

## Evitar el lazy fan-out

Si estás armando un response HTTP, las projections **eliminan la superficie** de N+1 sorpresivo: no hay entidad para lazy-loadear. Es la forma más limpia de frenar queries escondidas.

## Bullet de CV

> "Used JPQL constructor projections with Java record DTOs to fetch only needed columns (9 of 20 on a hot table), cutting payload and avoiding Hibernate lazy-load fan-out."
