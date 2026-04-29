# Streams pipeline & operations

> A stream is a **pipeline** of operations on data. Lazy until a terminal op runs.

## Pipeline structure

1. **Source** — collection, array, generator, I/O.
2. **Intermediate operations** — lazy (return another stream).
3. **Terminal operation** — triggers execution.

```java
list.stream()
    .filter(x -> x > 10)
    .map(x -> x * 2)
    .toList();
```

## Intermediate operations (lazy)

- `filter(Predicate)` — keep matching.
- `map(Function)` — transform.
- `flatMap(Function)` — transform + flatten.
- `sorted()` / `sorted(Comparator)` — order.
- `distinct()` — dedupe.
- `limit(n)` / `skip(n)` — pagination.
- `peek(Consumer)` — debug only, has side effects.

## Terminal operations (execute)

- `toList()` / `collect(Collectors.toMap(...))` — gather.
- `findFirst()` / `findAny()` — short-circuit.
- `count()` — size.
- `anyMatch` / `allMatch` / `noneMatch` — boolean checks.
- `reduce(BinaryOperator)` — combine.
- `forEach(Consumer)` — apply.

## Lazy = important

```java
stream
  .filter(x -> { System.out.println("f " + x); return x > 1; })
  .map(x -> { System.out.println("m " + x); return x; });
// nothing printed yet — no terminal op
```

Until you add `.toList()` or similar, the lambdas don't run.

## Senior-level rule

> Use streams for **clarity** in business logic. Use loops for **performance-critical hot paths**.
