# Lambdas — comportamiento como dato

> Funciones anónimas que podés pasar como valores.

## Ejemplo

```java
Function<String,Integer> length = s -> s.length();
length.apply("hello"); // 5
```

## Functional interfaces comunes

| Interface | Propósito |
|---|---|
| `Function<T,R>` | transformar `T` → `R` |
| `Predicate<T>` | testear (boolean) |
| `Consumer<T>` | efecto colateral (sin retorno) |
| `Supplier<T>` | proveer un `T`, sin input |
| `BiFunction<T,U,R>` | dos inputs → resultado |

## Dónde se usan

- Streams (`filter`, `map`, `forEach`, etc.).
- Comparators (`Comparator.comparing(User::age)`).
- Callbacks / event handlers.
- Patrón Strategy sin clases anónimas verbose.

## Method references

Más limpio que lambdas cuando solo llamás a un método:

```java
list.stream().map(String::toUpperCase);
list.forEach(System.out::println);
```
