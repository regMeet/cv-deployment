# Window functions — `RANK` / `LAG` / running totals

> Funciones tipo aggregate que **no colapsan filas**. Cada fila mantiene sus propios valores, más un valor computado sobre una "ventana" de filas relacionadas.

## La forma

```sql
function(...) OVER (
    PARTITION BY ...     -- splitear filas en grupos (opcional)
    ORDER BY ...         -- ordenar dentro de cada grupo (a menudo requerido)
    ROWS / RANGE ...     -- frame: qué filas son "la ventana" (opcional)
)
```

## Ranking — `ROW_NUMBER`, `RANK`, `DENSE_RANK`

```
salary    ROW_NUMBER  RANK  DENSE_RANK
100         1          1     1
100         2          1     1
90          3          3     2
80          4          4     3
```

- `ROW_NUMBER()` — secuencial único, los empates se rompen arbitrariamente.
- `RANK()` — los empates comparten rank, hay gaps después (1, 1, 3).
- `DENSE_RANK()` — los empates comparten rank, sin gaps (1, 1, 2).

```sql
SELECT name, salary,
       RANK() OVER (ORDER BY salary DESC) AS rnk
FROM employees;
```

## Ranking por grupo — `PARTITION BY`

```sql
-- top earner por departamento
SELECT name, dept, salary,
       RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS dept_rnk
FROM employees;
```

`PARTITION BY` resetea el ranking por grupo.

## `LAG` y `LEAD` — espiar vecinos

```sql
-- mostrar cambio vs mes anterior
SELECT month, revenue,
       LAG(revenue) OVER (ORDER BY month) AS prev_revenue,
       revenue - LAG(revenue) OVER (ORDER BY month) AS delta
FROM monthly_revenue;
```

- `LAG(col)` — valor de la fila **anterior** en el orden.
- `LEAD(col)` — valor de la fila **siguiente**.
- Ambos aceptan offset y default: `LAG(col, 1, 0)`.

## Running totals — `SUM` como ventana

```sql
SELECT order_date, total,
       SUM(total) OVER (ORDER BY order_date) AS running_total
FROM orders;
```

Running total por usuario:

```sql
SUM(total) OVER (PARTITION BY user_id ORDER BY order_date)
```

## Promedios móviles — cláusulas de frame

```sql
-- promedio móvil de 7 días
SELECT day, revenue,
       AVG(revenue) OVER (
           ORDER BY day
           ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
       ) AS avg_7d
FROM daily_revenue;
```

`ROWS BETWEEN ... AND ...` define el **frame** — qué filas ve la función.

## `FIRST_VALUE` / `LAST_VALUE` / `NTH_VALUE`

```sql
-- primer / último order_date por usuario, en cada fila
FIRST_VALUE(order_date) OVER (PARTITION BY user_id ORDER BY order_date)
LAST_VALUE(order_date)  OVER (PARTITION BY user_id ORDER BY order_date
                              ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)
```

Ojo: `LAST_VALUE` necesita un frame explícito para mirar adelante — el frame default es `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`, lo que hace que `LAST_VALUE` devuelva la fila actual.

## `NTILE` — splitear en N buckets

```sql
SELECT name, salary,
       NTILE(4) OVER (ORDER BY salary) AS quartile
FROM employees;
```

Cuartiles, deciles, bandas de percentil.

## Gotchas comunes

- **`ORDER BY` adentro de `OVER` es requerido** para ranking, `LAG`/`LEAD`, running totals.
- **Frame default** para ventanas con `ORDER BY` es `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` — los running totals funcionan out of the box, `LAST_VALUE` necesita un frame explícito.
- **PARTITION BY ≠ GROUP BY** — las ventanas no colapsan filas.

## Frase para entrevista

> "Window functions compute aggregates without collapsing rows. RANK/DENSE_RANK/ROW_NUMBER for ordering, LAG/LEAD to compare against neighbors, SUM/AVG with OVER for running totals or moving averages. The frame clause (ROWS BETWEEN…) controls which rows the function sees — important for moving windows and for LAST_VALUE."
