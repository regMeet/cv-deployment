# SQL — total acumulado (cumulative sum)

> Window function con frame — un clásico de live coding senior.

## Esquema

```
sales(sale_date, amount)
```

## Objetivo

Devolver una fila por día con el total diario **y** el total acumulado hasta ese día.

## Solución — window function

```sql
SELECT sale_date,
       SUM(amount) AS daily_total,
       SUM(SUM(amount)) OVER (
         ORDER BY sale_date
         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS running_total
FROM sales
GROUP BY sale_date
ORDER BY sale_date;
```

Dos cosas pasan:

- El `SUM(amount)` interno agrega por día (grupo).
- El `SUM(...) OVER (...)` externo acumula esas sumas diarias en orden de fecha.

## ¿Por qué especificar el frame?

Sin `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`, la mayoría de los motores usa por defecto `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`. Idéntico para fechas únicas, pero **con fechas duplicadas** `RANGE` incluye todas las filas empatadas en el valor actual, mientras que `ROWS` es estrictamente fila por fila.

Siempre especificá el frame en entrevistas senior — es el detalle que muestra que escribiste window functions en producción.

## Variante — total acumulado por partición

```sql
SELECT customer_id,
       sale_date,
       SUM(amount) OVER (
         PARTITION BY customer_id
         ORDER BY sale_date
         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS running_total
FROM sales
ORDER BY customer_id, sale_date;
```

`PARTITION BY` resetea el total acumulado por cliente.

## Variante — promedio móvil de 7 días

```sql
SELECT sale_date,
       AVG(amount) OVER (
         ORDER BY sale_date
         ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
       ) AS rolling_7d_avg
FROM sales;
```

## Qué mencionar en una entrevista

- Las window functions no colapsan filas — `GROUP BY` sí.
- `ROWS` vs `RANGE` importa con empates.
- `PARTITION BY` para totales acumulados "por cliente / por grupo".
- Los motores modernos optimizan esto bien; el viejo truco `JOIN ... ON s2.date <= s1.date` es `O(n²)` y red flag.
