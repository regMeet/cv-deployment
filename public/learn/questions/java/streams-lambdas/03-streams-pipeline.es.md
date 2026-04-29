# Streams pipeline & operaciones

> Un stream es un **pipeline** de operaciones sobre datos. Lazy hasta que corre una operación terminal.

## Estructura del pipeline

1. **Source** — colección, array, generator, I/O.
2. **Operaciones intermedias** — lazy (devuelven otro stream).
3. **Operación terminal** — dispara la ejecución.

```java
list.stream()
    .filter(x -> x > 10)
    .map(x -> x * 2)
    .toList();
```

## Operaciones intermedias (lazy)

- `filter(Predicate)` — quedarse con los que matchean.
- `map(Function)` — transformar.
- `flatMap(Function)` — transformar + aplanar.
- `sorted()` / `sorted(Comparator)` — ordenar.
- `distinct()` — deduplicar.
- `limit(n)` / `skip(n)` — paginación.
- `peek(Consumer)` — solo debug, tiene side effects.

## Operaciones terminales (ejecutan)

- `toList()` / `collect(Collectors.toMap(...))` — recolectar.
- `findFirst()` / `findAny()` — short-circuit.
- `count()` — tamaño.
- `anyMatch` / `allMatch` / `noneMatch` — chequeos booleanos.
- `reduce(BinaryOperator)` — combinar.
- `forEach(Consumer)` — aplicar.

## Lazy = importante

```java
stream
  .filter(x -> { System.out.println("f " + x); return x > 1; })
  .map(x -> { System.out.println("m " + x); return x; });
// nada impreso aún — sin op terminal
```

Hasta que agregás `.toList()` o similar, los lambdas no corren.

## Regla nivel senior

> Usá streams para **claridad** en business logic. Usá loops para **hot paths críticos en performance**.
