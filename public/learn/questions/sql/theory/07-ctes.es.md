# CTEs (cláusula WITH)

> Un **resultado temporal nombrado** al inicio de una query. Reemplaza subqueries anidadas; se lee top-down.

## CTE básico

```sql
WITH active_users AS (
    SELECT * FROM users WHERE active = true
)
SELECT country, COUNT(*) AS n
FROM active_users
GROUP BY country;
```

Equivalente a una tabla derivada, pero **nombrada** y **legible**.

## Múltiples CTEs

```sql
WITH
    active AS (
        SELECT * FROM users WHERE active = true
    ),
    by_country AS (
        SELECT country, COUNT(*) AS n FROM active GROUP BY country
    )
SELECT * FROM by_country WHERE n > 100;
```

Cada CTE puede referenciar al anterior. Se lee como una serie de bindings de variables.

## Cuándo brillan los CTEs

- **Queries multi-paso largas** — cada paso es su propio bloque nombrado, top-down.
- **Reusar un resultado dos veces** en la misma query.
- **Queries recursivas** — solo los CTEs pueden ser recursivos (ver Advanced).

## Cuándo las subqueries están bien

- One-off, single-use, simple — una subquery / tabla derivada plana es más corta.

## CTE vs subquery — performance

En **Postgres viejo (≤11)**, los CTEs siempre se **materializaban** (un fence que el optimizador no podía atravesar), lo que a veces los hacía más lentos que subqueries equivalentes.

**Postgres 12+** inlinea los CTEs por default a menos que digas `WITH foo AS MATERIALIZED (...)`.

En MySQL 8 / SQL Server / Oracle, los optimizadores generalmente inlinean. Así que la respuesta moderna: **usá CTEs libremente por legibilidad** y solo preocupate por materialización en casos patológicos.

## INSERT/UPDATE/DELETE adentro de un CTE

Postgres te deja poner DML adentro de un CTE — útil para workflows "hacé X y devolvé Y":

```sql
WITH archived AS (
    DELETE FROM logs WHERE created_at < now() - interval '30 days'
    RETURNING *
)
INSERT INTO logs_archive SELECT * FROM archived;
```

## CTEs recursivos

Un CTE que se referencia a sí mismo. Se usa para jerarquías (org charts, threaded comments) y traversal de grafos.

```sql
WITH RECURSIVE tree AS (
    SELECT id, name, manager_id, 1 AS depth
    FROM employees WHERE manager_id IS NULL
  UNION ALL
    SELECT e.id, e.name, e.manager_id, t.depth + 1
    FROM employees e JOIN tree t ON e.manager_id = t.id
)
SELECT * FROM tree;
```

> Ver [CTEs recursivos](#sql/advanced/recursive-ctes) para el deep dive.

## Frase para entrevista

> "CTEs name intermediate results so multi-step queries read top-down. They're cleaner than nested subqueries and they're the only way to do recursion in SQL. In modern Postgres / MySQL / SQL Server they're inlined by the optimizer, so they're free for readability."
