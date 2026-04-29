# SQL — usuarios con más de un email

> Ejercicio clásico de GROUP BY / HAVING.

## Esquema

```
users(name, email)
```

## Objetivo

Encontrar todos los usuarios que tienen **más de un email**.

## Solución

```sql
SELECT name, COUNT(email) AS email_count
FROM users
GROUP BY name
HAVING COUNT(email) > 1;
```

## Por qué `HAVING` (no `WHERE`)

- `WHERE` filtra **filas antes de agregar**.
- `HAVING` filtra **grupos después de agregar**.

Funciones de agregación como `COUNT()` solo existen después de que corre el GROUP BY — por eso el filtro va en HAVING.

## Variante — solo emails distintos

Si `users` tiene filas duplicadas `(name, email)` y querés contar emails distintos por usuario:

```sql
SELECT name, COUNT(DISTINCT email) AS email_count
FROM users
GROUP BY name
HAVING COUNT(DISTINCT email) > 1;
```

## Variante — devolver solo los nombres

```sql
SELECT name
FROM users
GROUP BY name
HAVING COUNT(email) > 1;
```
