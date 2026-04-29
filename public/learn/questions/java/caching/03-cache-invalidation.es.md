# Estrategias de invalidación de cache

> "Solo hay dos cosas difíciles en CS: invalidación de cache y nombrar cosas." — toda estrategia de caching es un trade-off.

## El problema clásico

Escribís a la DB → L2 invalidado → pero L1 en algún pod todavía tiene el valor viejo. Stale read.

## Estrategias

### 1. TTL (time-to-live)

Cada entrada expira después de N segundos. Simple, sin coordinación cross-pod.

- ✅ Fácil.
- ❌ Ventana stale igual al TTL.

### 2. Write-through

Escribís al cache y a la DB al mismo tiempo, sincrónicamente.

- ✅ Cache y DB siempre coinciden.
- ❌ Escrituras más lentas.

### 3. Write-behind (write-back)

Escribís al cache, flush async a DB.

- ✅ Escrituras rápidas.
- ❌ Riesgo de pérdida de datos si el cache crashea antes del flush.

### 4. Invalidación event-driven

El que escribe publica un evento ("user 42 updated"); todos los caches se suscriben y eviccionan.

- ✅ Eventualmente consistente entre pods.
- ❌ Más piezas móviles (infra de pub/sub, ordering de mensajes).

### 5. Versioned keys

La key del cache incluye una versión (`user:42:v17`). Updatear el recurso bumpa la versión → las keys viejas naturalmente quedan huérfanas.

- ✅ No hace falta mensaje de invalidación; la key nueva automáticamente es miss.
- ❌ Las entradas viejas quedan hasta el eviction (costo de memoria).

## Cuál usar

- **No crítico** (feed, recomendaciones): TTL alcanza.
- **Crítico** (saldo, stock): TTL **corto** + invalidación por eventos + versioned keys.
- **Siempre**: TTL como red de seguridad incluso si tenés invalidación basada en eventos — los eventos se pueden perder.

## Frase para entrevista

> "TTL is the simplest, but for critical data I combine short TTL with event-driven invalidation and versioned keys. Pure write-through guarantees consistency but slows writes; pure event-driven is fast but you have to handle missed events."
