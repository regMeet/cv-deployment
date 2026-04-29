# SQL — top 3 salarios por departamento

> Clásico "top-N por grupo" — la pregunta canónica de live coding con window functions.

## Esquema

```
employees(id, name, department_id, salary)
departments(id, name)
```

## Objetivo

Devolver los **3 empleados mejor pagos por departamento**, incluyendo empates.

## Solución 1 — `ROW_NUMBER` (sin empates)

```sql
SELECT department_id, id, name, salary
FROM (
    SELECT e.*,
           ROW_NUMBER() OVER (
             PARTITION BY department_id
             ORDER BY salary DESC
           ) AS rn
    FROM employees e
) t
WHERE rn <= 3;
```

`ROW_NUMBER` asigna 1, 2, 3, ... por partición — los empates obtienen posiciones arbitrarias. Usá esto cuando querés **a lo sumo 3 filas por departamento**, incluso si hay empates.

## Solución 2 — `DENSE_RANK` (incluye empates)

```sql
SELECT department_id, id, name, salary
FROM (
    SELECT e.*,
           DENSE_RANK() OVER (
             PARTITION BY department_id
             ORDER BY salary DESC
           ) AS rnk
    FROM employees e
) t
WHERE rnk <= 3;
```

`DENSE_RANK` les da el mismo rango a los empates sin saltar — así que "top 3" devuelve **todos los empleados** en los 3 niveles de salario distintos más altos (puede ser 4+ filas si hay empates).

## Solución 3 — lateral / correlated (sin window functions)

```sql
SELECT e.*
FROM employees e
WHERE e.id IN (
    SELECT id FROM employees e2
    WHERE e2.department_id = e.department_id
    ORDER BY salary DESC
    LIMIT 3
);
```

Funciona en MySQL viejo o entornos limitados. Lento a escala — las window functions ganan.

## `ROW_NUMBER` vs `RANK` vs `DENSE_RANK`

| Función | Salarios `[100, 100, 90, 80]` |
|----------|-------------------------------|
| `ROW_NUMBER` | 1, 2, 3, 4 |
| `RANK`       | 1, 1, 3, 4 |
| `DENSE_RANK` | 1, 1, 2, 3 |

## Qué mencionar en una entrevista

- Mencioná **empates** — clarificá el requerimiento antes de escribir código.
- Usá `PARTITION BY` para acotar el ranking por grupo.
- Sabé cuándo elegir `ROW_NUMBER` vs `DENSE_RANK`.
- Window function en un subquery + `WHERE rnk <= N` es el idiom estándar.
