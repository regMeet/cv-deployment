# SQL — empleados sin salario

> Ejercicio clásico de "filas faltantes" / outer join.

## Esquema

```
employees(id, name)
salaries(employee_id, amount)
```

## Objetivo

Encontrar cada empleado que **no** tiene una fila en `salaries`.

## Solución 1 — LEFT JOIN + IS NULL

```sql
SELECT e.id, e.name
FROM employees e
LEFT JOIN salaries s ON s.employee_id = e.id
WHERE s.employee_id IS NULL;
```

El LEFT JOIN trae todos los empleados. `WHERE s.employee_id IS NULL` se queda solo con los que no tienen fila de salario matcheante.

## Solución 2 — NOT EXISTS (frecuentemente la más legible)

```sql
SELECT e.id, e.name
FROM employees e
WHERE NOT EXISTS (
    SELECT 1 FROM salaries s WHERE s.employee_id = e.id
);
```

## Solución 3 — NOT IN (cuidado con NULLs)

```sql
SELECT e.id, e.name
FROM employees e
WHERE e.id NOT IN (SELECT s.employee_id FROM salaries s);
```

⚠️ **NOT IN es peligroso si `salaries.employee_id` puede ser NULL** — `NOT IN (..., NULL, ...)` no devuelve filas por la lógica de tres valores. Siempre wrappear con `WHERE s.employee_id IS NOT NULL` o usar `NOT EXISTS` en cambio.

## Qué mencionar en una entrevista

- LEFT JOIN + IS NULL funciona bien.
- NOT EXISTS es típicamente la más limpia semánticamente.
- NOT IN tiene la trampa del NULL — señal de candidato que sabe SQL real.
- Las tres deberían producir el mismo plan en un buen optimizador; elegí la que tiene la **intención** más clara.
