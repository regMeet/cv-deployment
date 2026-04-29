# SQL — crecimiento de revenue mes a mes

> Combina agregación, `LAG` y una historia cuidada de NULLs.

## Esquema

```
sales(sale_date, amount)
```

## Objetivo

Devolver una fila por mes con: revenue total, revenue del mes anterior, y **% de crecimiento** vs el mes anterior.

## Solución — `LAG` sobre agregados mensuales

```sql
WITH monthly AS (
    SELECT DATE_TRUNC('month', sale_date) AS month,
           SUM(amount)                    AS revenue
    FROM sales
    GROUP BY DATE_TRUNC('month', sale_date)
)
SELECT month,
       revenue,
       LAG(revenue) OVER (ORDER BY month) AS prev_revenue,
       ROUND(
         100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))
              / NULLIF(LAG(revenue) OVER (ORDER BY month), 0),
         2
       ) AS mom_growth_pct
FROM monthly
ORDER BY month;
```

Notas por motor:

- `DATE_TRUNC('month', x)` funciona en Postgres / Snowflake / BigQuery (con `TIMESTAMP_TRUNC`). Para MySQL: `DATE_FORMAT(sale_date, '%Y-%m-01')`.
- `NULLIF(prev, 0)` previene división por cero — devuelve NULL en vez de tirar error.

## La historia de NULLs — primer mes y meses faltantes

- El **primer mes** no tiene anterior — `LAG` devuelve NULL → growth es NULL. Eso es correcto; no fabriques un `0`.
- **Meses faltantes** (ej: sin ventas en febrero) desaparecen silenciosamente de `monthly`. Si necesitás una timeline continua, generá una tabla calendario y hacé LEFT JOIN.

```sql
WITH calendar AS (
    SELECT generate_series(
        DATE_TRUNC('month', MIN(sale_date)),
        DATE_TRUNC('month', MAX(sale_date)),
        INTERVAL '1 month'
    )::date AS month
    FROM sales
),
monthly AS (
    SELECT c.month,
           COALESCE(SUM(s.amount), 0) AS revenue
    FROM calendar c
    LEFT JOIN sales s
      ON DATE_TRUNC('month', s.sale_date) = c.month
    GROUP BY c.month
)
SELECT ...
```

## Variante — crecimiento YoY

```sql
LAG(revenue, 12) OVER (ORDER BY month) AS prev_year_revenue
```

`LAG(col, n)` salta `n` filas atrás — combinado con grano mensual, eso es year-over-year.

## Qué mencionar en una entrevista

- `LAG` para "comparar con la fila anterior".
- `NULLIF` para protegerse de división por cero.
- El NULL del primer mes es **comportamiento correcto**, no un bug.
- Los meses faltantes son silenciosos — mencionalos, proponé calendar join si importa.
- La función de bucketing por mes depende del motor — nombrá la tuya.
