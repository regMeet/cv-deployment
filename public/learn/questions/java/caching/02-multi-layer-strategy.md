# Multi-layer caching strategy

> Combine L1 (in-process) and L2 (distributed) for the best of both.

## Read flow

1. Look up in **L1** (in-process) → hit? return.
2. Miss → look up in **L2** (Redis) → hit? populate L1 + return.
3. Miss → query **DB** → populate L2 + L1 + return.

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

## Why both

- **L1** kills latency for repeated reads on the same pod.
- **L2** kills DB load and keeps multiple pods consistent (mostly).

## Optional layer — CDN / edge cache

For static / cacheable HTTP responses:

- **CDN (CloudFront, Cloudflare)** caches at the edge → ms vs hundreds of ms cross-region.
- Useful for assets and read-mostly endpoints with high cardinality.

## Decision rule

- Hot, low-cardinality data, read all the time → **L1 + L2**.
- Cold, high-cardinality, occasional reads → **L2 only** (avoid L1 churn).
- Public, cacheable HTTP → **CDN** in front of all of it.

## Interview line

> "I use L1 for ultra-fast in-process reads and L2 (Redis) to share state across pods and reduce DB load. The hardest part is keeping the layers consistent — see invalidation."
