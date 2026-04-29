# Locking — pessimistic vs optimistic

> Dos estrategias para coordinar escrituras concurrentes a la misma fila. Pessimistic usa locks de DB; optimistic usa un chequeo de versión.

## Pessimistic — `SELECT ... FOR UPDATE`

Lockea la fila durante la transacción. Otras transacciones que intenten escribir a esa fila **esperan**.

```sql
BEGIN;

SELECT balance
FROM accounts
WHERE id = 1
FOR UPDATE;          -- 🔒 fila lockeada hasta COMMIT/ROLLBACK

-- seguro de leer + decidir + actualizar
UPDATE accounts SET balance = balance - 100 WHERE id = 1;

COMMIT;
```

Otros writers llamando `FOR UPDATE` sobre la misma fila **bloquean** hasta que commiteás.

### Variantes

- `FOR UPDATE` — lock exclusivo; bloquea a todos los writers.
- `FOR SHARE` — lock compartido; readers OK, writers bloqueados.
- `FOR UPDATE NOWAIT` — falla inmediatamente si no puede lockear.
- `FOR UPDATE SKIP LOCKED` — saltea filas que otros tienen lockeadas. Killer feature para **work queues**.

### Patrón de work queue con `SKIP LOCKED`

```sql
SELECT id FROM jobs
WHERE status = 'pending'
ORDER BY created_at
LIMIT 1
FOR UPDATE SKIP LOCKED;

-- esta fila es tuya; otros workers obtienen el siguiente job no-lockeado
```

Múltiples workers pueden pollear la misma tabla sin pisarse.

## Optimistic — columna de versión

Sin locks. Chequeás la **versión** al momento del update.

```sql
-- leer
SELECT id, balance, version FROM accounts WHERE id = 1;
-- (got balance=100, version=7)

-- update con chequeo de versión
UPDATE accounts
SET balance = 50, version = version + 1
WHERE id = 1 AND version = 7;
```

Si la versión de la fila ya no es 7 (otro committeó en el medio), el `UPDATE` afecta 0 filas. La aplicación detecta esto y **reintenta** (o expone el conflicto).

> La anotación `@Version` de JPA / Hibernate hace exactamente esto.

### Cuándo usar cada uno

| Escenario | Usar |
|---|---|
| Conflictos frecuentes (alta contención) | Pessimistic — evita tormentas de retry |
| Conflictos raros | Optimistic — sin overhead de lock |
| Read-modify-write entre servicios | Optimistic con retry |
| Workflows con estado / wallets | Pessimistic con `FOR UPDATE` |
| Job/work queues | `FOR UPDATE SKIP LOCKED` |

## Deadlocks

Cuando dos transacciones se esperan los locks una a la otra. La DB lo detecta y **mata una** con un error.

Forma clásica:

```
Tx A: lockea fila 1 → quiere fila 2
Tx B: lockea fila 2 → quiere fila 1
                                ← deadlock
```

### Cómo evitar

- **Adquirir locks siempre en el mismo orden** en todo el codebase. Si todos lockean `id` ascendente, sin deadlock.
- **Mantené las transacciones cortas.** Menos tiempo manteniendo locks = menos chance de deadlock.
- **No lockees más de lo necesario.** `FOR UPDATE OF specific_table` (Postgres) cuando joineás muchas tablas.
- **Ante error de deadlock, retry**. No son un bug; es la DB diciéndote que intentes de nuevo.

## Granularidad de locks

- **Row lock** — el más común, default con `FOR UPDATE`.
- **Page lock** — algunas DBs (SQL Server) lockean páginas por eficiencia; pueden causar bloqueo inesperado.
- **Table lock** — DDL o `LOCK TABLE` explícito. Martillo grande.

## Los niveles de aislamiento afectan el locking

- **Read Committed** (default típico) — locking mínimo; phantom/non-repeatable reads posibles.
- **Repeatable Read / Serializable** — más locking o trucos de MVCC; algunos workloads lo necesitan.

> Ver ACID para el detalle completo.

## Frase para entrevista

> "Pessimistic locking with `SELECT FOR UPDATE` for high-contention or stateful operations like wallets. Optimistic via a version column for low-contention reads with retries — JPA `@Version` does this. `FOR UPDATE SKIP LOCKED` is the right tool for work queues. Avoid deadlocks by acquiring locks in a consistent order and keeping transactions short; on deadlock errors, retry."
