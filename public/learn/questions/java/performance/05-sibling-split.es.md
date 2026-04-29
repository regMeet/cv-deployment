# Splitear colecciones hermanas en queries separadas

> Joinear 2+ colecciones hermanas `@OneToMany` en una sola query → producto cartesiano. Spliteá.

## Qué evitás

Una query que devuelve `events × periods × actions` filas por cada padre — basura duplicada que después tenés que dedup en memoria.

> Ver [Cartesiano de hermanas — ejemplo chico](#java/database-hibernate/sibling-example) para la matemática.

## El fix

Correr una query por colección hermana. Con virtual threads y `CompletableFuture` corren todas **en paralelo**, así el costo es solo `max(query_times)`.

```java
var events  = supplyAsync(() -> findEvents(parentIds), vthreads);
var periods = supplyAsync(() -> findPeriods(parentIds), vthreads);
var actions = supplyAsync(() -> findActions(parentIds), vthreads);

allOf(events, periods, actions).join();
```

## ¿Por qué no `LEFT` en vez de `INNER`?

No ayuda. INNER y LEFT producen la misma inflación cartesiana cuando se joinean 2+ hermanas. La única diferencia es qué hacen cuando una colección está vacía, no cómo multiplican.

## ¿Por qué no `@Fetch(SUBSELECT)` o JOIN FETCH?

- **`@Fetch(SUBSELECT)`** funciona pero es magia de Hibernate — menos control, opaco.
- **JOIN FETCH** permite solo **una** colección bag por query — Hibernate tira `MultipleBagFetchException` si intentás dos, precisamente para prevenir esto.

## Bullet de CV

> "Split sibling `@OneToMany` collections into separate queries to eliminate Cartesian product inflation."
