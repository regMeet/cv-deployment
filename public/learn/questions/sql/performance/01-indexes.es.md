# Índices — estrategia y gotchas

> Los índices hacen las lecturas rápidas y las escrituras (un poco) más lentas. Las preguntas interesantes son **qué tipo**, **qué columnas** y **en qué orden**.

## Qué es un índice

Una estructura ordenada separada (típicamente un **B-tree**) que apunta a la tabla. La DB puede hacer binary search en el índice en lugar de scanear cada fila.

## Tipos

### B-tree (default)

- Mejor para **igualdad**, **rango** y **prefix matches** (`=`, `<`, `>`, `BETWEEN`, `LIKE 'foo%'`).
- El default en Postgres / MySQL / SQL Server / Oracle.
- 99% de los índices que vas a crear.

### Hash

- Solo igualdad. Más rápido que B-tree para `=` en algunos engines.
- Postgres los tiene; raramente vale la pena por los trade-offs.

### Compuesto (multi-columna)

```sql
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);
```

**El orden importa.** Este índice ayuda a:
- `WHERE user_id = ?` ✅
- `WHERE user_id = ? AND created_at > ?` ✅
- `WHERE user_id = ? ORDER BY created_at` ✅
- `WHERE created_at > ?` ❌ (sin columna líder)

> **Regla de leftmost**: un índice compuesto sirve queries que usan un **prefijo** de sus columnas desde la izquierda.

### Índice covering (INCLUDE)

```sql
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at) INCLUDE (total);
```

El índice ya contiene `total`, así la query se puede responder **sin tocar la tabla**. Lleva a "index-only scan".

### Índice parcial

```sql
CREATE INDEX idx_active_users ON users(email) WHERE active = true;
```

Índice más chico, más rápido. Útil cuando la mayoría de las filas no satisface la condición.

### Índice funcional / por expresión

```sql
CREATE INDEX idx_lower_email ON users (LOWER(email));
```

Te deja indexar valores computados. Necesario para que `WHERE LOWER(email) = ?` sea rápido.

### Especiales (Postgres)

- **GIN** — full-text, JSONB, arrays.
- **GiST** — tipos geométricos / range.
- **BRIN** — tablas enormes con datos naturalmente ordenados (timestamps).

## Costos de los índices

- **Escrituras más lentas** — cada INSERT/UPDATE/DELETE actualiza cada índice relevante.
- **Más espacio en disco**.
- **Más memoria** para mantener índices calientes en cache.
- **Tiempo de planning del optimizer** — demasiados índices hace al planner más lento.

> Regla: no indexes columnas por las que nunca filtrás / joineás.

## Cuándo los índices NO ayudan (o duelen)

### Funciones / casts sobre la columna indexada

```sql
WHERE LOWER(email) = 'a@x';        -- 💥 índice plano sobre email NO se usa
WHERE created_at::date = '2025-01-01';  -- 💥 igual
```

O indexás la expresión, o reescribís la query (ej: `created_at >= '2025-01-01' AND created_at < '2025-01-02'`).

### `LIKE` con wildcard al inicio

```sql
WHERE email LIKE '%@gmail.com';    -- 💥 B-tree inútil
```

Necesitás full-text o un truco de índice de string invertido.

### Columna de baja selectividad (boolean, status con 2 valores)

La DB puede decidir que un full scan es más barato. Los índices parciales ayudan acá.

### `OR` entre columnas

```sql
WHERE a = 1 OR b = 2;
```

A veces el planner no combina índices. `UNION ALL` de dos queries puede ser más rápido.

## Orden compuesto — elegir bien

```
(country, city) — sirve queries por country, por (country, city)
                  pero NO por city solo
```

Ordenar columnas por:
1. **Igualdad primero**, rango al final.
2. La más selectiva primero (con caveats — los optimizers modernos lo manejan OK).

## Frase para entrevista

> "B-tree composite indexes are 90% of what you need. Order matters because of the leftmost rule — equality columns first, range last. Partial indexes for skewed booleans, expression indexes for computed lookups, and covering (INCLUDE) for hot read paths to enable index-only scans. Every index also slows writes, so don't add what you don't query on."
