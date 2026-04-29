# Operaciones de conjuntos — UNION / INTERSECT / EXCEPT

> Apilan dos resultados de queries verticalmente. Ambas queries deben devolver el **mismo número y tipos de columnas**.

## UNION — combina y **dedupea**

```sql
SELECT email FROM customers
UNION
SELECT email FROM suppliers;
```

Saca filas duplicadas. Implica un SORT (o hash) → tiene costo.

## UNION ALL — combina, mantiene duplicados

```sql
SELECT email FROM customers
UNION ALL
SELECT email FROM suppliers;
```

Más rápido — sin trabajo de dedup. Usalo siempre que no necesites unicidad, o cuando ya sepas que las filas no se solapan.

> Regla: `UNION ALL` primero, cambiá a `UNION` solo si realmente necesitás dedup.

## INTERSECT — filas en **ambos**

```sql
SELECT email FROM customers
INTERSECT
SELECT email FROM suppliers;
```

Como `IN` pero para filas enteras. Devuelve filas distintas por default.

## EXCEPT (o MINUS en Oracle) — filas en **A pero no en B**

```sql
SELECT email FROM customers
EXCEPT
SELECT email FROM suppliers;
```

Como `NOT EXISTS` pero para filas enteras.

> MySQL 8+ soporta INTERSECT/EXCEPT; MySQL viejo no.

## Pitfalls comunes

### Cantidad y tipo de columnas debe coincidir

```sql
SELECT id, name FROM users
UNION
SELECT email FROM customers;        -- 💥 distinto número de columnas
```

### `ORDER BY` implícito al final

`ORDER BY` aplica al resultado **combinado**, no solo a la última query:

```sql
SELECT name FROM a
UNION ALL
SELECT name FROM b
ORDER BY name;                      -- ordena el resultado completo
```

Para ordenar solo una rama, wrappeala en una subquery.

## Aliases vienen de la **primera** query

```sql
SELECT id AS user_id FROM users
UNION
SELECT id AS something FROM admins;
-- la columna se llama user_id en el resultado
```

## Set ops vs JOIN — cuándo cada uno

- **Set ops** apilan verticalmente (filas de A y filas de B como filas separadas).
- **JOIN** combina horizontalmente (una fila con columnas de ambos A y B).

Si te encontrás escribiendo `SELECT * FROM (SELECT...UNION...) JOIN ...`, probablemente quieras un JOIN directo.

## Frase para entrevista

> "UNION dedupes, UNION ALL doesn't — and ALL is cheaper. INTERSECT is rows in both; EXCEPT is rows in A but not B. They're like IN/NOT EXISTS but for entire rows. Column counts and types must match across all branches."
