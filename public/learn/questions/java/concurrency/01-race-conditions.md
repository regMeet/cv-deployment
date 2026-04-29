# How do you avoid race conditions?

> Race condition = unsynchronized concurrent access to shared mutable state.

## Strategies (in order of preference)

1. **Don't share mutable state.** Each task works on its own data; combine results at the end (e.g., `CompletableFuture` + `join`).
2. **Use immutable data** — records, `List.copyOf`, defensive copies.
3. **Use concurrent collections** — `ConcurrentHashMap`, `CopyOnWriteArrayList`.
4. **Use atomics** — `AtomicInteger`, `AtomicReference` (CAS, lock-free).
5. **Use locks** — `synchronized` or `ReentrantLock` for genuine critical sections. Keep them small.

## Anti-patterns

- `synchronized` on the entire method when only 2 lines are critical.
- Locking on `this` in public methods (callers can lock against you).
- "Double-checked locking" without `volatile` (broken on older JVMs).

## Interview line

> "I prefer designs that don't share state. Where shared state is unavoidable, I use the lightest tool that works: atomics → concurrent collections → narrow `synchronized` blocks → `ReentrantLock` only when I need fairness or `tryLock`."
