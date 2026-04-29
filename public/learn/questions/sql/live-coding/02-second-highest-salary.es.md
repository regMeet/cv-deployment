# SQL — segundo salario más alto

> SQL clásico de entrevista. Cuidado con **salarios duplicados**.

## Esquema

```
employees(id, name, salary)
```

## Solución 1 — `LIMIT` + `OFFSET`

Funciona si no te importan los salarios top duplicados:

```sql
SELECT id, name, salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1;
```

Pero si hay 3 empleados empatados en el salario más alto, esto devuelve a uno de ellos — no el "segundo más alto distinto".

## Solución 2 — salarios distintos (la mejor respuesta)

```sql
SELECT salary
FROM (
    SELECT DISTINCT salary
    FROM employees
    ORDER BY salary DESC
    LIMIT 2
) t
ORDER BY salary
LIMIT 1;
```

Devuelve el **segundo salario distinto más alto**. Con salarios `[10, 10, 9]`, devuelve `9`.

## Solución 3 — anti-join (funciona en la mayoría de DBs)

```sql
SELECT MAX(salary) AS second_highest
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);
```

Conciso, devuelve NULL si no hay segundo más alto (un único salario en la tabla).

## Solución 4 — window function (la más limpia en DBs modernas)

```sql
SELECT id, name, salary
FROM (
    SELECT id, name, salary,
           DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
    FROM employees
) t
WHERE rnk = 2;
```

`DENSE_RANK` los empates obtienen el mismo rank; los ranks no se saltean — así "segundo" realmente significa segundo salario distinto.

## Qué quieren escuchar los entrevistadores

- Mencionar **salarios duplicados** — la mayoría de los candidatos no lo nota.
- Mostrar que sabés que hay múltiples soluciones y **trade-offs**.
- Window functions son la respuesta moderna; anti-join es la clásica.
