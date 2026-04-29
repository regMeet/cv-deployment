# Case study real — optimización de latencia DB (-12%)

> Proyecto concreto donde optimizaciones DB en capas redujeron latencia en un endpoint crítico. Usá esto como historia paraguas; las otras preguntas de esta sección profundizan en cada técnica.

## Resultado

- **Single case:** 1.80s → 1.58s (**−12%**)
- **Batch-5:** 6.26s → 5.75s (**−8%**)
- Medido en dev1 sobre VPN (Oracle remoto).

## Bullets CV-ready

- Reduje round-trips a DB **batcheando per-row lookups en queries IN-clause** Y **consolidando queries encadenadas en JPQL JOINs**.
- **Paralelicé 4 queries DB independientes** vía `CompletableFuture` en un **virtual-thread executor dedicado (Java 21)**. Critical path reducido de suma a max de tiempos de query.
- Usé **JPQL constructor projections con Java records** para fetchear solo las columnas necesarias (ej: 9 de 20 en una tabla caliente), reduciendo payload y evitando lazy-load fan-out de Hibernate.
- **Splitié colecciones hermanas `@OneToMany`** en queries paralelas separadas, eliminando un producto cartesiano que forzaba dedup en memoria.
- **Embebí subqueries inline para resolver IDs** dentro de cada query paralela, removiendo dependencias secuenciales y maximizando paralelismo real.
- Preservé **MDC SLF4J (traceId, userId) entre fronteras async** vía un wrapper de executor, manteniendo continuidad de distributed tracing.
- Refactoreé un endpoint monolítico en **clases dedicadas** (orquestación / acceso a DB / mapeo de DTOs), mejorando testeabilidad.

## Las tres reglas de oro que emergieron

1. **Hermanas joineadas = Cartesiano.** Splitealas en queries separadas.
2. **El round-trip es lo caro** (DB remota). Menos queries > queries más complejas.
3. **Virtual threads > platform threads** para I/O. Prácticamente gratis, sin starvation de pools compartidos.

## Pivots para entrevista

Si el entrevistador quiere más profundidad:

- **"¿Por qué virtual threads?"** → I/O bloqueante desmonta el carrier; ~gratis vs costo de thread del OS.
- **"¿Cómo detectás hermanas?"** → la regla de 5 segundos: 2+ JOINs con la misma columna del lado izquierdo.
- **"¿LEFT o INNER para fix?"** → ninguno. Multiplican igual. Splitear las queries.
- **"¿Por qué no `@Fetch(SUBSELECT)` o JOIN FETCH?"** → SUBSELECT es Hibernate-mágico (menos control), JOIN FETCH solo permite una bag collection (`MultipleBagFetchException`).
