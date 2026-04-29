# Subqueries inline para resolver IDs (paralelismo máximo)

> Si 4 queries dependen de una 5ta ("primero resolvé los IDs, después usalos"), la dependencia fuerza ejecución serial. Empujá el resolver **adentro** de cada query paralela para que arranquen todas a la vez.

## Mal — dependencia secuencial

```java
List<Long> caseIds = caseRepo.findIdsByNumber(numbers);  // T_resolve

// recién ahora puede arrancar el paralelismo
var apps    = supplyAsync(() -> appRepo.find(caseIds));
var docs    = supplyAsync(() -> docRepo.find(caseIds));
var members = supplyAsync(() -> memberRepo.find(caseIds));
var events  = supplyAsync(() -> eventRepo.find(caseIds));
```

**Critical path:** `T_resolve + max(parallel)`.

## Bien — subquery inline en cada query paralela

```java
// cada query resuelve sus propios IDs vía subquery
var apps = supplyAsync(() -> em.createQuery("""
    SELECT new ... FROM Application a
    WHERE a.caseId IN (SELECT c.id FROM Case c WHERE c.number IN :nums)
    """).setParameter("nums", numbers).getResultList(), vthreads);

var docs = supplyAsync(() -> em.createQuery("""
    SELECT new ... FROM Document d
    WHERE d.caseId IN (SELECT c.id FROM Case c WHERE c.number IN :nums)
    """).setParameter("nums", numbers).getResultList(), vthreads);

// ... etc.
```

**Critical path:** `max(parallel)`. El paso de "resolver IDs" pasa **adentro** de cada query, en paralelo.

## Trade-off

- Cada query es un poco más compleja (lleva la subquery).
- La DB hace el mismo trabajo lógico, pero al **mismo tiempo**, no antes/después.
- Bonus: el optimizador a veces puede inlinear la subquery como un JOIN.

## Bullet de CV

> "Embedded inline ID-resolving subqueries inside each parallel query to remove sequential dependencies, maximizing true parallelism."
