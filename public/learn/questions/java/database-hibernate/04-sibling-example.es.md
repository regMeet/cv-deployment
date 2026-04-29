# Cartesiano de hermanas — ejemplo chico

> Una persona con 2 teléfonos y 3 emails. Joineando ambos a la vez te da **6 filas**, no 5.

## Tablas

**person**

| id | name |
|---|---|
| 1 | Ana |

**phone** (hija de person)

| id | person_id | number |
|---|---|---|
| 10 | 1 | 111 |
| 20 | 1 | 222 |

**email** (hija de person — hermana de phone)

| id | person_id | addr |
|---|---|---|
| 100 | 1 | a@x |
| 200 | 1 | b@x |
| 300 | 1 | c@x |

## La query (joineando ambas hermanas)

```sql
SELECT p.name, ph.number, e.addr
FROM person p
  JOIN phone ph ON ph.person_id = p.id
  JOIN email e  ON e.person_id  = p.id;
```

**Resultado: 2 × 3 = 6 filas.**

| name | number | addr |
|---|---|---|
| Ana | 111 | a@x |
| Ana | 111 | b@x |
| Ana | 111 | c@x |
| Ana | 222 | a@x |
| Ana | 222 | b@x |
| Ana | 222 | c@x |

## Por qué

La DB no sabe que phones y emails son independientes. Trata cada fila como una combinación de las dos — cada teléfono × cada email.

Datos reales: 2 teléfonos + 3 emails = **5 cosas**. Resultado de la query: **6 filas**, con cada teléfono repetido 3× y cada email repetido 2×. Basura duplicada.

## Fix — queries separadas

```sql
SELECT * FROM phone WHERE person_id = 1;  -- 2 filas limpias
SELECT * FROM email WHERE person_id = 1;  -- 3 filas limpias
```

Total: 5 filas, sin duplicación. Costo: 1 round-trip extra (o 0 si las corrés en paralelo).

## Cómo escala

| Phones | Emails | 1 query (filas) | 2 queries (filas) |
|---|---|---|---|
| 10 | 10 | 100 | 20 |
| 100 | 100 | 10.000 | 200 |
| 1.000 | 1.000 | 1.000.000 | 2.000 |

Por eso un multi-JOIN sobre hermanas puede explotar a escala.
