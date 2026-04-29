# Colecciones hermanas — la trampa del producto cartesiano

> **Regla:** nunca hagas JOIN de múltiples colecciones hermanas en una sola query. Si necesitás 3 colecciones de 1 padre, hacelas en 3 queries (en paralelo si podés).

## Qué significa "hermanas"

Múltiples colecciones `@OneToMany` colgando del **mismo padre**, sin relación directa entre ellas.

```java
@Entity
class Involvement {
    @OneToMany List<InvolvementEvent>  events;   // hermana 1
    @OneToMany List<InvolvementPeriod> periods;  // hermana 2
    @OneToMany List<InvolvementAction> actions;  // hermana 3
}
```

`events`, `periods`, `actions` comparten `Involvement` como padre. Ninguna referencia a las otras.

## Cómo detectar hermanas (regla de 5 segundos)

Mirá la cláusula `ON` de cada JOIN. Si dos o más JOINs tienen el **mismo lado izquierdo** (misma columna del padre), son hermanas:

```sql
-- HERMANAS (malo):
FROM involvement i
  LEFT JOIN event  e ON e.involvement_id = i.id   -- FK a i
  LEFT JOIN period p ON p.involvement_id = i.id   -- FK a i
  LEFT JOIN action a ON a.involvement_id = i.id   -- FK a i
```

Las tres apuntan a `i.id` → producto cartesiano garantizado.

## NO hermanas (cadena — OK de joinear)

```sql
FROM case c
  JOIN application a ON a.case_id = c.id   -- FK a c
  JOIN app_member  m ON m.app_id  = a.id   -- FK a a, NO a c
```

El lado izquierdo cambia (`c.id` → `a.id`) → es una cadena, sin inflación.

## LEFT vs INNER no lo arregla

Ambos multiplican igual. La única diferencia: INNER descarta filas donde un lado está vacío; LEFT mantiene el padre y nullea el lado faltante. Ninguno previene la inflación cartesiana.

## Cómo arreglarlo de verdad

1. **Queries separadas** — una por colección, en paralelo.
2. **`@Fetch(FetchMode.SUBSELECT)`** — Hibernate emite una 2da query para la colección automáticamente.
3. **`JOIN FETCH` solo una colección por query** (Hibernate tira `MultipleBagFetchException` si intentás dos).
4. **`@BatchSize(size = N)`** — cuando Hibernate hace lazy load, agrupa N loads en una IN-clause.

## Detección post-hoc

¿Sospechás inflación? Corré:

```sql
SELECT COUNT(*), COUNT(DISTINCT parent.id) FROM ...
```

Si total ≫ distinct de padres → estás multiplicando.

## Corolario

Un padre con **una** colección joineada está bien (1→N es esperable). El quilombo arranca con **≥2 hermanas** en la misma query.
