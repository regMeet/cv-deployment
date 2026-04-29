# Por qué Hibernate es peligroso a escala

> Hibernate es genial para productividad. A alta escala, la abstracción se filtra y muerde.

## Lazy loads escondidos

Tocás un getter de una relación lazy → query extra silenciosa. En un loop → N+1.

```java
for (Order o : orders) {
    o.getCustomer().getName(); // 💥 query por order
}
```

## El first-level cache (session) crece sin tope

En sesiones largas o jobs batch, el persistence context retiene cada entidad cargada. La memoria crece. Usá `entityManager.clear()` periódicamente en batch loops.

## Dirty checking tiene costo de CPU

En el flush, Hibernate compara cada entidad managed contra su snapshot cargado para detectar cambios. Barato por entidad, doloroso con miles.

## Abstracción que se filtra

Si no entendés el SQL que Hibernate genera, vas a escribir código que se ve bien en Java y manda queries terribles:

- Patrones de N+1 desde asociaciones lazy.
- Productos cartesianos por JOIN FETCH naive sobre hermanas.
- JOINs implícitos por mapeos cascade que olvidaste.

## `MultipleBagFetchException`

No podés JOIN FETCH dos colecciones tipo bag a la vez — Hibernate se niega, porque el resultado sería un producto cartesiano (ver hermanas).

## Mitigaciones

- **DTO projections** para read paths — bypass del persistence context.
- **Fetch plans explícitos** — `JOIN FETCH` o `@EntityGraph`, nunca confiar en el lazy default.
- **Stateless sessions** para batch.
- **Siempre logguear SQL en dev** así ves lo que Hibernate emite.
- **APM en prod** — Datadog flagea N+1 y queries lentas.

## Frase para entrevista

> "Hibernate accelerates development but its abstraction can hide expensive queries. At scale I lean on DTO projections for reads, explicit fetch plans for writes, and APM in production to catch what slipped through."
