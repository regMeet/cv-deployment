# Cache invalidation strategies

> "There are only two hard things in CS: cache invalidation and naming things." — every caching strategy is a trade-off.

## The classic problem

You write to the DB → L2 invalidated → but L1 in some pod still has the old value. Stale read.

## Strategies

### 1. TTL (time-to-live)

Each entry expires after N seconds. Simple, no cross-pod coordination.

- ✅ Easy.
- ❌ Stale window equals the TTL.

### 2. Write-through

Write to cache and DB at the same time, synchronously.

- ✅ Cache and DB always agree.
- ❌ Slower writes.

### 3. Write-behind (write-back)

Write to cache, async-flush to DB.

- ✅ Fast writes.
- ❌ Risk of data loss if the cache crashes before flush.

### 4. Event-driven invalidation

Writer publishes an event ("user 42 updated"); all caches subscribe and evict.

- ✅ Eventually consistent across pods.
- ❌ More moving parts (pub/sub infra, message ordering).

### 5. Versioned keys

Cache key includes a version (`user:42:v17`). Updating the resource bumps the version → old keys naturally orphan.

- ✅ No invalidation message needed; new key is automatically a miss.
- ❌ Old entries linger until eviction (memory cost).

## Which to use

- **Non-critical** (feed, recommendations): TTL is fine.
- **Critical** (balance, stock): TTL **short** + event invalidation + versioned keys.
- **Always**: TTL as a safety net even if you have event-based invalidation — events get lost.

## Interview line

> "TTL is the simplest, but for critical data I combine short TTL with event-driven invalidation and versioned keys. Pure write-through guarantees consistency but slows writes; pure event-driven is fast but you have to handle missed events."
