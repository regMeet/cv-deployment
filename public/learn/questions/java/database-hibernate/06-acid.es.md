# ACID — Atomicidad, Consistencia, Aislamiento, Durabilidad

> Conjunto de propiedades que hacen que las transacciones de DB sean seguras y confiables, incluso bajo errores o crashes.

## A — Atomicity (Atomicidad)

> Todo o nada.

Una transacción se ejecuta completa o se hace rollback completo. Transferencia bancaria: debitar A + acreditar B; si falla acreditar B, se deshace el débito de A.

## C — Consistency (Consistencia)

> La DB siempre pasa de un estado válido a otro válido.

Las constraints (FK, NOT NULL, CHECK, reglas de negocio) se cumplen. Post-commit, todas las reglas siguen vigentes.

## I — Isolation (Aislamiento)

> Las transacciones concurrentes no se interfieren entre sí.

Anomalías clásicas:

- **Dirty reads** — leer datos no commiteados.
- **Non-repeatable reads** — la misma fila devuelve valores distintos dentro de una transacción.
- **Phantom reads** — la misma query devuelve sets distintos de filas dentro de una transacción.

Niveles estándar (más débil → más fuerte):

1. Read Uncommitted
2. Read Committed
3. Repeatable Read
4. Serializable

> Más aislamiento = menos concurrencia. Trade-off.

## D — Durability (Durabilidad)

> Una vez committeado, los datos sobreviven a crashes.

Logrado con **WAL (write-ahead logs)** + storage persistente. Después de que el commit retorna, la DB garantiza que el cambio está en disco durable.

## Encuadre senior

> "ACID is critical in monolithic systems with one DB. In distributed systems we often relax parts of it (especially consistency or strict isolation) for scalability — moving toward eventual consistency, with patterns like Saga, idempotency, and compensation."

## Follow-up común — "¿Se puede tener ACID en microservicios?"

Respuesta corta: **no fácilmente**. Cada servicio tiene su propia DB; no hay transacción global. Patrones que se usan en cambio:

- **Saga** — secuencia de transacciones locales con compensaciones.
- **Outbox / CDC** — escritura a DB + evento publicado atómicamente.
- **Idempotencia** — para reintentar de forma segura ante fallos.
