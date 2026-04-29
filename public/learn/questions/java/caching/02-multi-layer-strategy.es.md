# Estrategia de caching multicapa

> Combinar L1 (in-process) y L2 (distribuido) para lo mejor de ambos.

## Flujo de lectura

1. Buscar en **L1** (in-process) → hit? devolver.
2. Miss → buscar en **L2** (Redis) → hit? popular L1 + devolver.
3. Miss → query a **DB** → popular L2 + L1 + devolver.

```java
Object v = l1.getIfPresent(key);
if (v != null) return v;

v = redis.get(key);
if (v != null) { l1.put(key, v); return v; }

v = db.load(key);
redis.set(key, v, ttl);
l1.put(key, v);
return v;
```

## Por qué ambos

- **L1** mata la latencia para lecturas repetidas en el mismo pod.
- **L2** mata la carga de DB y mantiene múltiples pods consistentes (mayormente).

## Capa opcional — CDN / edge cache

Para responses HTTP estáticos / cacheables:

- **CDN (CloudFront, Cloudflare)** cachea en el edge → ms vs cientos de ms cross-region.
- Útil para assets y endpoints read-mostly de alta cardinalidad.

## Regla de decisión

- Datos calientes, baja cardinalidad, leídos siempre → **L1 + L2**.
- Datos fríos, alta cardinalidad, lecturas ocasionales → **solo L2** (evitar churn de L1).
- HTTP público, cacheable → **CDN** delante de todo.

## Frase para entrevista

> "I use L1 for ultra-fast in-process reads and L2 (Redis) to share state across pods and reduce DB load. The hardest part is keeping the layers consistent — see invalidation."
