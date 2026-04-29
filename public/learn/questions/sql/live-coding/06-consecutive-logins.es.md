# SQL — usuarios con N días consecutivos de logins

> "Gaps and islands" — un patrón senior que filtra a la mayoría de candidatos.

## Esquema

```
logins(user_id, login_date)
```

`(user_id, login_date)` es único.

## Objetivo

Encontrar usuarios que se loguearon al menos **3 días consecutivos**.

## El truco — `date - row_number()` es constante por isla

Para cualquier usuario, si ordenás sus logins por fecha y los numerás 1, 2, 3, ..., las fechas consecutivas tienen una **diferencia constante** entre `login_date` y `row_number`. Esa constante es el "id de la isla".

```
date         rn   date - rn
2026-04-01   1    2026-03-31
2026-04-02   2    2026-03-31  ← misma isla
2026-04-03   3    2026-03-31  ← misma isla
2026-04-05   4    2026-04-01  ← nueva isla (gap)
2026-04-06   5    2026-04-01
```

## Solución

```sql
WITH numbered AS (
    SELECT user_id,
           login_date,
           ROW_NUMBER() OVER (
             PARTITION BY user_id
             ORDER BY login_date
           ) AS rn
    FROM logins
),
islands AS (
    SELECT user_id,
           login_date,
           login_date - rn * INTERVAL '1 day' AS island_id
    FROM numbered
)
SELECT user_id
FROM islands
GROUP BY user_id, island_id
HAVING COUNT(*) >= 3;
```

Para MySQL / motores sin aritmética de intervalos, reemplazá con `DATE_SUB(login_date, INTERVAL rn DAY)`. Para fechas enteras, solo `login_date - rn`.

## Variante — devolver solo usuarios distintos

```sql
SELECT DISTINCT user_id
FROM islands
GROUP BY user_id, island_id
HAVING COUNT(*) >= 3;
```

## Variante — devolver los rangos de la racha

```sql
SELECT user_id,
       MIN(login_date) AS streak_start,
       MAX(login_date) AS streak_end,
       COUNT(*)        AS streak_length
FROM islands
GROUP BY user_id, island_id
HAVING COUNT(*) >= 3;
```

## Edge cases a mencionar

- **Logins duplicados por día** — deduplicar con `SELECT DISTINCT user_id, login_date` antes de numerar, sino el count infla.
- **Timezones** — si `login_date` es timestamp, castealo a fecha en el TZ del usuario primero.
- **Qué cuenta como "consecutivo"** — ¿días calendario? ¿días hábiles? Clarificá.

## Qué mencionar en una entrevista

- Reconocer esto como **gaps and islands** por nombre.
- El truco `date - row_number()` (o sus variantes).
- Mencionar dedup y trampa de timezone.
- Window function + `GROUP BY` sobre el island id es la forma más limpia.
