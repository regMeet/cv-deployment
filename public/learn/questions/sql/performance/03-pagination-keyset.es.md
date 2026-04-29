# Pagination a escala — `OFFSET` vs keyset

> `OFFSET 10000 LIMIT 20` parece OK. A escala, es un desastre de performance. La paginación keyset lo arregla.

## Por qué `OFFSET` muere

```sql
SELECT * FROM orders ORDER BY created_at DESC LIMIT 20 OFFSET 10000;
```

Para saltearse 10.000 filas, la DB tiene que:
1. Sortear o scanear para encontrarlas.
2. Descartarlas.
3. Devolver las 20 siguientes.

El costo crece con el offset. La página 1 es rápida; la 500 es lenta; la 5000 puede timeoutear.

> Además: con inserts/deletes concurrentes, OFFSET puede mostrar duplicados o saltear filas entre cargas de página.

## Keyset pagination (el fix)

Recordá el **último valor** de la página anterior y pedí los siguientes **después** de él.

```sql
-- primera página
SELECT id, created_at, ...
FROM orders
ORDER BY created_at DESC, id DESC
LIMIT 20;

-- siguiente página: pasar el último (created_at, id) del response anterior
SELECT id, created_at, ...
FROM orders
WHERE (created_at, id) < ('2025-01-15 10:00', 99999)
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

Con un índice en `(created_at DESC, id DESC)`, cada página es **O(log n + page size)** — misma velocidad para página 1 y página 5000.

## El truco de comparación de tuplas

```sql
WHERE (created_at, id) < ('2025-01-15 10:00', 99999)
```

Es shorthand para "o created_at es anterior, o es el mismo timestamp y id es menor." Evita ambigüedad cuando los timestamps empatan.

Algunas DBs no soportan comparación de tuplas. Forma equivalente expandida:

```sql
WHERE created_at < '2025-01-15 10:00'
   OR (created_at = '2025-01-15 10:00' AND id < 99999)
```

## Por qué incluir el desempate (`id`)

Si dos filas comparten `created_at`, ordenar solo por eso no es determinístico — podrías saltarte o duplicar filas entre páginas. Siempre cerrá con un desempate único (`id` o `uuid`).

## Trade-offs

**Keyset**
- ✅ Rápido a cualquier profundidad.
- ✅ Estable bajo escrituras concurrentes (relativo al cursor).
- ❌ No podés saltar a "página N" — solo tenés prev/next.
- ❌ El cursor es el **último item del sort key**, no un número.

**OFFSET**
- ✅ Fácil "ir a la página 50".
- ❌ Más lento cuanto más profundo vas.
- ❌ Inconsistente con cambios concurrentes.

## Cuándo OFFSET está OK

- Datasets chicos, página máxima < 100.
- Tools de admin donde páginas lentas son aceptables.
- Queries one-off.

Para feeds user-facing a escala → **keyset**.

## Encoding del cursor para APIs

Mandar el cursor opaco en la API:

```
GET /orders?after=eyJ0cyI6IjIwMjUtMDEtMTUiLCJpZCI6OTk5OTl9
            (base64 de {ts, id})
```

Los clientes no necesitan saber el schema; podés cambiarlo después.

## Ejemplos del mundo real

- **Feeds de Twitter/X** — keyset por tweet ID.
- **Historial de mensajes Slack** — keyset por message ID.
- **Cursor APIs** en Stripe, GitHub — cursores opacos son keysets internamente.

## Frase para entrevista

> "OFFSET pagination scales linearly with depth — page 1 is fast, page 1000 isn't. Keyset pagination uses the last row's sort key as the cursor, so every page is O(log n) with the right index. Always include a unique tiebreaker. For user-facing feeds keyset is the standard answer."
