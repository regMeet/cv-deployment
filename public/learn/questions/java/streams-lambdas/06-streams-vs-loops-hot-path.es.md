# Streams vs loops — hot paths

> Streams mejoran legibilidad y mantenibilidad. En hot paths, los loops tradicionales pueden ser más eficientes.

## Hot path

> Código ejecutado **muy frecuentemente** — tight loops, sistemas de tiempo real, loops internos por-request en endpoints de alto QPS.

Ahí, cada microcosto (alocación de lambdas, boxing, overhead de iteradores) suma.

## Trade-offs

**Streams**
- ✅ Legibles, declarativos.
- ✅ Componibles.
- ❌ Algo de overhead (objetos lambda, autoboxing, cadenas de iteradores).

**Loops**
- ✅ Más rápidos en hot paths.
- ✅ Mejor optimización del JIT (eliminación de bounds-check, vectorización).
- ❌ Más verbose.

## Pitfalls comunes

- **Side effects** en operaciones de stream:
  ```java
  list.stream().forEach(other::add); // race, mal
  ```
- **Reusar un stream** — son single-use.
- **Usar `map` en vez de `forEach`** cuando solo querés side effects.
- **Pipelines sobrecomplicados** — extraé pasos a variables nombradas.

## Regla senior

> "Use streams for clarity. Use loops for performance-critical paths."

## Frase para entrevista

> "Java Streams and lambdas introduced a functional style that improves readability and composability. They add some overhead, so they're ideal for business logic. In performance-critical hot paths, traditional loops are still preferable."
